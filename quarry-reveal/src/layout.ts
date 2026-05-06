// Shared layout constants so QLogo and Wordmark stay pixel-aligned.
// All values in canvas px (1080×1920).

// Quarry wordmark SVG (89×25 viewBox) rendered at this size & position.
// 660px wide leaves ~210px side margin → comfortably title-safe.
export const WORDMARK = {
	left: 210,
	top: 1380,
	width: 660,
	get height() {
		return (this.width * 25) / 89;
	},
} as const;

// Position for ARCHITECTS subtitle (centered horizontally).
export const ARCHITECTS_TOP = 1605;
// Position for "Formerly Lytle Associates" line.
export const FORMERLY_TOP = 1660;
