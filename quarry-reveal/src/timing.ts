// Deterministic timing helpers shared across scenes.
// All beats below are timed in *seconds* on an 8-second canvas.

export const clamp = (x: number, a = 0, b = 1) =>
	Math.min(b, Math.max(a, x));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutCubic = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInCubic = (t: number) => t * t * t;

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Returns 0 before `a`, 1 after `b`, eased value in between.
 * The single most-used helper across the timeline.
 */
export const segment = (
	t: number,
	a: number,
	b: number,
	ease: (x: number) => number = easeInOutCubic,
): number => {
	if (t <= a) return 0;
	if (t >= b) return 1;
	return ease((t - a) / (b - a));
};

// ---- shared brand tokens ----
export const PALETTE = {
	bg: '#0E0E10',
	ink: '#F4F1EC',
	inkDim: 'rgba(244, 241, 236, 0.55)',
	orange: '#E45A1B',
	orangeBright: '#F47A35',
	orangeDeep: '#C44510',
} as const;

// ---- Q geometry on the 1080×1920 canvas ----
// The Q raster is 383×457; we render it at ~520×620 box, centered at (540, 960).
export const Q_BOX = {
	x: 280,
	y: 650,
	width: 520,
	height: 620,
	cx: 540,
	cy: 960,
} as const;
