// Shared "extreme close-up" pose for the Q glyph.
//
// The Q is rendered at ~22000px wide (vs 520px at hero pose) and positioned
// so the visible 1080×1920 frame falls entirely INSIDE one of the Q's
// strokes — the audience sees only solid brand orange filling the screen
// and doesn't yet realise they're inside a letterform.
//
// SceneAre holds this pose for its full duration. SceneFinalReveal starts at
// the same pose and animates left/top/width down to the hero pose, so the
// orange shrinks to reveal the Q's corner and then the full glyph.

import {Q_GLYPH_IN_WORDMARK} from '../../v3/glyphs';

// Big number — at this scale the Q's right-bowl stroke is ~3500px wide, so a
// 1080-wide frame falls comfortably inside it and the audience sees only the
// photo, no orange. As the camera pulls back the Q stays "huge" for a long
// time, so the corner reveal lands as a giant graphic moment before the Q
// finally settles into the hero pose.
export const CLOSEUP_Q_WIDTH = 22000;
export const CLOSEUP_Q_HEIGHT =
	CLOSEUP_Q_WIDTH * (Q_GLYPH_IN_WORDMARK.h / Q_GLYPH_IN_WORDMARK.w);

// Anchor: which point in the Q's viewBox should sit at frame centre (540, 960).
// Picked to land inside the right-side bowl stroke so the visible frame falls
// entirely on coloured Q geometry — no orange edges intrude.
const ANCHOR_VIEWBOX_X = 16;
const ANCHOR_VIEWBOX_Y = 12;

const PX_PER_VIEWBOX_UNIT = CLOSEUP_Q_WIDTH / Q_GLYPH_IN_WORDMARK.w;

export const CLOSEUP_Q_LEFT = 540 - ANCHOR_VIEWBOX_X * PX_PER_VIEWBOX_UNIT;
export const CLOSEUP_Q_TOP = 960 - ANCHOR_VIEWBOX_Y * PX_PER_VIEWBOX_UNIT;
