import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, segment, easeInOutCubic, easeOutCubic} from '../../v3/timing';
import {
	StandaloneQ,
	QPaths,
	UarryStaggered,
	Q_GLYPH_IN_WORDMARK,
	WORDMARK_VIEWBOX,
	type LetterState,
} from '../../v3/glyphs';
import {BRAND} from '../../v4/brand';
import {
	ARCHITECTS_PATH,
	ARCHITECTS_VIEWBOX,
	ARCHITECTS_IN_LOGO,
} from '../../v4/components/ArchitectsGlyph';
import {
	CLOSEUP_Q_LEFT,
	CLOSEUP_Q_TOP,
	CLOSEUP_Q_WIDTH,
	STAGE_WIDTH,
	STAGE_HEIGHT,
} from './closeup';

// Wordmark layout on the 1920×1080 stage — centered horizontally, the whole
// stack (wordmark + tagline) centered vertically.
const WORDMARK = {
	left: (STAGE_WIDTH - 660) / 2,
	top: 0,
	width: 660,
	get height() {
		return (this.width * 25) / 89;
	},
} as const;
const TAGLINE_GAP = 96;
const TAGLINE_HEIGHT = 50;
const STACK_HEIGHT = (660 * 25) / 89 + TAGLINE_GAP + TAGLINE_HEIGHT;
const WORDMARK_TOP = (STAGE_HEIGHT - STACK_HEIGHT) / 2;
const TAGLINE_TOP = WORDMARK_TOP + (660 * 25) / 89 + TAGLINE_GAP;

// Strapline — anchored to the brand SVG's geometry. Render the wordmark
// at width=660, then place the strapline at the same scale so its bbox
// matches the source file exactly.
const SVG_TO_STAGE = WORDMARK.width / 1523.72;
const ARCHITECTS_LEFT = WORDMARK.left + ARCHITECTS_IN_LOGO.leftFrac * WORDMARK.width;
const ARCHITECTS_TOP = WORDMARK_TOP + ARCHITECTS_VIEWBOX.y * SVG_TO_STAGE;
const ARCHITECTS_WIDTH = ARCHITECTS_VIEWBOX.w * SVG_TO_STAGE;
const ARCHITECTS_HEIGHT = ARCHITECTS_VIEWBOX.h * SVG_TO_STAGE;

// Q's pixel target inside the wordmark (matches the SVG path geometry exactly).
const Q_TARGET_LEFT = WORDMARK.left;
const Q_TARGET_TOP = WORDMARK_TOP;
const Q_TARGET_WIDTH =
	(Q_GLYPH_IN_WORDMARK.w / WORDMARK_VIEWBOX.w) * WORDMARK.width;

const LETTER_START = 0.65;
const LETTER_STAGGER = 0.02;
const LETTER_DURATION = 0.08;
const LETTER_DROP = 1.4;

// Outro logo pose — wordmark settles in the top-left corner at brand-mark scale.
const LOGO_LEFT = 72;
const LOGO_TOP = 72;
const LOGO_WIDTH = 260;

/**
 * Landscape final reveal scene — mirrors v4's SceneFinalReveal but positioned
 * for the 1920×1080 stage.
 */
export const SceneFinalRevealL: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Single continuous flight: Q goes from filling the screen directly to
	// its wordmark slot, arriving at t=0.8s. easeOutCubic — fast at the
	// start and decelerating into the slot.
	const ZOOM_TO_SLOT = [0.0, 0.8] as const;
	const HANDOFF = [0.78, 0.82] as const;
	const ARCHITECTS_IN = [0.85, 0.95] as const;
	const TAGLINE_IN = [1.0, 1.4] as const;
	const OUTRO_MOVE = [3.0, 3.8] as const;
	const OUTRO_FADE = [3.0, 3.5] as const;

	const flight = segment(t, ZOOM_TO_SLOT[0], ZOOM_TO_SLOT[1], easeOutCubic);
	const left = lerp(CLOSEUP_Q_LEFT, Q_TARGET_LEFT, flight);
	const top = lerp(CLOSEUP_Q_TOP, Q_TARGET_TOP, flight);
	const width = lerp(CLOSEUP_Q_WIDTH, Q_TARGET_WIDTH, flight);

	// Hold the lockup Q at full opacity from the handoff onward. Both Qs
	// render the same orange paths at the same pixel position, so keeping
	// lockup at 1.0 underneath the fading standalone avoids any sub-1.0
	// moment that would read as a tint shift against the background.
	const handoffFade = segment(t, HANDOFF[0], HANDOFF[1], easeOutCubic);
	const standaloneOpacity = 1 - handoffFade;
	const lockupQOpacity = t >= HANDOFF[0] ? 1 : 0;

	const letters: [LetterState, LetterState, LetterState, LetterState, LetterState] = [
		letterState(t, 0),
		letterState(t, 1),
		letterState(t, 2),
		letterState(t, 3),
		letterState(t, 4),
	];

	const architectsIn = segment(t, ARCHITECTS_IN[0], ARCHITECTS_IN[1], easeOutCubic);
	const taglineIn = segment(t, TAGLINE_IN[0], TAGLINE_IN[1], easeOutCubic);

	const outroMove = segment(t, OUTRO_MOVE[0], OUTRO_MOVE[1], easeInOutCubic);
	const outroFade = segment(t, OUTRO_FADE[0], OUTRO_FADE[1], easeOutCubic);
	const wordmarkLeft = lerp(WORDMARK.left, LOGO_LEFT, outroMove);
	const wordmarkTop = lerp(WORDMARK_TOP, LOGO_TOP, outroMove);
	const wordmarkWidth = lerp(WORDMARK.width, LOGO_WIDTH, outroMove);
	const wordmarkHeight = (wordmarkWidth * 25) / 89;
	const taglineOpacity = taglineIn * (1 - outroFade);
	const architectsOpacity = architectsIn * (1 - outroFade);

	return (
		<AbsoluteFill
			style={{
				background: BRAND.colors.dark,
				overflow: 'hidden',
			}}
		>
			{standaloneOpacity > 0.001 && (
				<AbsoluteFill style={{opacity: standaloneOpacity, pointerEvents: 'none'}}>
					<div style={{position: 'absolute', left, top}}>
						<StandaloneQ width={width} color={BRAND.colors.orange} />
					</div>
				</AbsoluteFill>
			)}

			<div
				style={{
					position: 'absolute',
					left: wordmarkLeft,
					top: wordmarkTop,
					width: wordmarkWidth,
					height: wordmarkHeight,
					pointerEvents: 'none',
				}}
			>
				<svg
					width={wordmarkWidth}
					height={wordmarkHeight}
					viewBox={`0 0 ${WORDMARK_VIEWBOX.w} ${WORDMARK_VIEWBOX.h}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<QPaths color={BRAND.colors.orange} opacity={lockupQOpacity} />
					<UarryStaggered color={BRAND.colors.sage} letters={letters} />
				</svg>
			</div>

			{/* ARCHITECTS strapline — extracted from the brand SVG, positioned at
			    the same scale as the wordmark so it lands where the source
			    file places it. Single fade-in. */}
			<div
				style={{
					position: 'absolute',
					left: ARCHITECTS_LEFT,
					top: ARCHITECTS_TOP,
					width: ARCHITECTS_WIDTH,
					height: ARCHITECTS_HEIGHT,
					opacity: architectsOpacity,
					pointerEvents: 'none',
				}}
			>
				<svg
					width={ARCHITECTS_WIDTH}
					height={ARCHITECTS_HEIGHT}
					viewBox={`${ARCHITECTS_VIEWBOX.x} ${ARCHITECTS_VIEWBOX.y} ${ARCHITECTS_VIEWBOX.w} ${ARCHITECTS_VIEWBOX.h}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d={ARCHITECTS_PATH} fill={BRAND.colors.sage} />
				</svg>
			</div>

			<div
				style={{
					position: 'absolute',
					top: TAGLINE_TOP,
					left: WORDMARK.left,
					width: WORDMARK.width,
					textAlign: 'center',
					opacity: taglineOpacity,
					transform: `translate(-8px, ${(1 - taglineIn) * 14}px)`,
					pointerEvents: 'none',
				}}
			>
				<span
					style={{
						display: 'inline-block',
						fontFamily: '"Neue Montreal", "Inter", system-ui, sans-serif',
						fontWeight: 400,
						fontStyle: 'normal',
						fontSize: 44,
						letterSpacing: '0.005em',
						color: BRAND.colors.sage,
					}}
				>
					Lytle Associates since 1987
				</span>
			</div>
		</AbsoluteFill>
	);
};

const letterState = (t: number, i: number): LetterState => {
	const start = LETTER_START + i * LETTER_STAGGER;
	const eased = segment(t, start, start + LETTER_DURATION, easeOutCubic);
	return {
		opacity: eased,
		dy: (1 - eased) * LETTER_DROP,
	};
};
