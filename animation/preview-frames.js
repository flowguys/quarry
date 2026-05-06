// Capture key timestamps as PNGs into ./preview-keys/ for fast visual verification.
import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = [0.0, 0.6, 1.5, 2.2, 3.0, 4.0, 4.85, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0, 7.3, 7.7, 8.0];
const OUT = path.join(__dirname, 'preview-keys');

function startServer() {
  const MIME = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json' };
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

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const { srv, port } = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('CONSOLE ERROR:', msg.text());
  });

  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/index.html?headless=1`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof window.renderFrame === 'function');
  try { await page.evaluateHandle('document.fonts.ready'); } catch {}

  for (const t of KEYS) {
    await page.evaluate((time) => window.renderFrame(time), t);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const file = path.join(OUT, `t-${t.toFixed(2).padStart(5, '0')}.png`);
    await page.screenshot({ path: file, type: 'png' });
    console.log('captured', path.basename(file));
  }

  await browser.close();
  srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
