import {continueRender, delayRender, staticFile} from 'remotion';

// Load brand fonts via the FontFace API so Remotion's renderer waits for them
// before flushing frames. Idempotent — only registers once per process.
let started = false;

export const loadBrandFonts = () => {
	if (started) return;
	started = true;
	if (typeof document === 'undefined') return;

	const handle = delayRender('Loading brand fonts');

	const fonts = [
		new FontFace(
			'Instrument Sans',
			`url(${staticFile('brand/fonts/InstrumentSans-Medium.woff2')}) format('woff2')`,
			{weight: '500', style: 'normal', display: 'block'},
		),
		new FontFace(
			'Inter',
			`url(${staticFile('brand/fonts/Inter-Medium.ttf')}) format('truetype')`,
			{weight: '500', style: 'normal', display: 'block'},
		),
	];

	Promise.all(fonts.map((f) => f.load()))
		.then((loaded) => {
			loaded.forEach((f) => document.fonts.add(f));
			continueRender(handle);
		})
		.catch((err) => {
			console.error('Font load failed', err);
			continueRender(handle);
		});
};
