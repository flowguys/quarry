/* ============================================================
   Headless frame-by-frame renderer
   - Loads index.html in puppeteer at 1080x1920
   - Steps the deterministic timeline frame by frame
   - Captures PNG screenshots
   - Encodes to MP4 with ffmpeg-static

   Usage:
     node render.js                     # default: 30fps, CRF 20, 8s
     node render.js --fps 30 --quality 18
     node render.js --duration 8 --out quarry-9x16.mp4
   ============================================================ */

import puppeteer from 'puppeteer';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- args ----------
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const FPS = parseInt(arg('fps', '30'), 10);
const DURATION = parseFloat(arg('duration', '8'));
const QUALITY = parseInt(arg('quality', '20'), 10); // CRF — lower = better
const OUT = arg('out', path.join(__dirname, 'quarry-9x16.mp4'));
const KEEP_FRAMES = args.includes('--keep-frames');
const FRAMES_DIR = path.join(__dirname, 'frames');

const TOTAL_FRAMES = Math.round(FPS * DURATION);

// ---------- tiny static server (puppeteer needs http for fonts/CORS) ----------
function startServer() {
  const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  };
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = req.url.split('?')[0];
      const fp = path.join(__dirname, p === '/' ? 'index.html' : p);
      if (!fp.startsWith(__dirname)) { res.writeHead(403); res.end(); return; }
      fs.stat(fp, (err, st) => {
        if (err || !st.isFile()) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
        fs.createReadStream(fp).pipe(res);
      });
    });
    srv.listen(0, () => resolve({ srv, port: srv.address().port }));
  });
}

// ---------- main ----------
async function main() {
  console.log(`Quarry render → ${OUT}`);
  console.log(`  ${TOTAL_FRAMES} frames @ ${FPS}fps, ${DURATION}s, CRF ${QUALITY}`);

  // Prepare frames dir
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const { srv, port } = await startServer();
  const url = `http://127.0.0.1:${port}/index.html?headless=1`;

  console.log(`Launching puppeteer at ${url}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-web-security', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  // wait for fonts + the timeline module to expose renderFrame
  await page.waitForFunction(() => typeof window.renderFrame === 'function');
  try {
    await page.evaluateHandle('document.fonts.ready');
  } catch {}

  // Capture frames
  const t0 = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((time) => window.renderFrame(time), t);
    // Force a paint sync. waitForNextFrame via evaluate.
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const file = path.join(FRAMES_DIR, `frame-${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: file, omitBackground: false, type: 'png' });
    if (i % 15 === 0 || i === TOTAL_FRAMES - 1) {
      const pct = Math.round(((i + 1) / TOTAL_FRAMES) * 100);
      const rate = (i + 1) / ((Date.now() - t0) / 1000);
      process.stdout.write(`\r  capturing frame ${i + 1}/${TOTAL_FRAMES} (${pct}%, ${rate.toFixed(1)} fps)`);
    }
  }
  process.stdout.write('\n');

  await browser.close();
  srv.close();

  // Encode with ffmpeg
  console.log(`Encoding → ${OUT}`);
  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'frame-%05d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', String(QUALITY),
      '-preset', 'slow',
      '-movflags', '+faststart',
      '-color_primaries', 'bt709',
      '-color_trc', 'bt709',
      '-colorspace', 'bt709',
      OUT,
    ], { stdio: ['ignore', 'inherit', 'inherit'] });
    ff.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
  });

  if (!KEEP_FRAMES) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }

  const stat = fs.statSync(OUT);
  console.log(`Done: ${OUT} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
