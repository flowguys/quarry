// Landscape close-up pose — same idea as v4's closeup but positioned for the
// 1920×1080 stage. The Q is rendered at ~22000px wide and anchored so the
// visible frame sits inside the right-bowl stroke, filling the screen with
// solid orange.

import {Q_GLYPH_IN_WORDMARK} from '../../v3/glyphs';

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export const CLOSEUP_Q_WIDTH = 22000;
export const CLOSEUP_Q_HEIGHT =
	CLOSEUP_Q_WIDTH * (Q_GLYPH_IN_WORDMARK.h / Q_GLYPH_IN_WORDMARK.w);

// Anchor: which point in the Q's viewBox should sit at frame centre. Same
// (16, 12) anchor as the portrait version — comfortably inside the right-
// bowl stroke at this scale.
const ANCHOR_VIEWBOX_X = 16;
const ANCHOR_VIEWBOX_Y = 12;

const PX_PER_VIEWBOX_UNIT = CLOSEUP_Q_WIDTH / Q_GLYPH_IN_WORDMARK.w;

export const CLOSEUP_Q_LEFT =
	STAGE_WIDTH / 2 - ANCHOR_VIEWBOX_X * PX_PER_VIEWBOX_UNIT;
export const CLOSEUP_Q_TOP =
	STAGE_HEIGHT / 2 - ANCHOR_VIEWBOX_Y * PX_PER_VIEWBOX_UNIT;
