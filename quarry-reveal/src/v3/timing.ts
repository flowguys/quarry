// v3 timing helpers — same primitives as v2 but with the layout/Q geometry
// constants v3 needs for the Q-to-wordmark morph.

export const clamp = (x: number, a = 0, b = 1) =>
	Math.min(b, Math.max(a, x));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutCubic = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Smoothest symmetric sigmoid — constant-acceleration slow→fast→slow.
// Half-cosine; derivative is sine, so the rate-of-change itself ramps up
// and down without the abrupt second-derivative jumps that cubic-style
// curves have around their inflection point.
export const easeInOutSine = (t: number) =>
	-(Math.cos(Math.PI * t) - 1) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInCubic = (t: number) => t * t * t;

export const easeInQuad = (t: number) => t * t;

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

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

// Final wordmark layout on the 1080×1920 stage.
// quarry-logo.svg viewBox = 89×25; the Q glyph occupies x:[0,17.964], y:[0,21.4852].
// The wordmark sits centered in the lower-mid of the frame.
export const WORDMARK = {
	left: 210,
	top: 880,
	width: 660,
	get height() {
		return (this.width * 25) / 89;
	},
} as const;

export const ARCHITECTS_TOP = WORDMARK.top + WORDMARK.height + 38;
export const FORMERLY_TOP = ARCHITECTS_TOP + 56;
