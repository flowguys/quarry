import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, segment, easeOutCubic} from '../../v3/timing';
import {
	StandaloneQ,
	QPaths,
	UarryStaggered,
	Q_GLYPH_IN_WORDMARK,
	WORDMARK_VIEWBOX,
	type LetterState,
} from '../../v3/glyphs';
import {BRAND} from '../brand';
import {
	ARCHITECTS_PATH,
	ARCHITECTS_VIEWBOX,
	ARCHITECTS_IN_LOGO,
} from '../components/ArchitectsGlyph';
import {
	CLOSEUP_Q_LEFT,
	CLOSEUP_Q_TOP,
	CLOSEUP_Q_WIDTH,
} from './closeup';

// Wordmark layout on the 1080×1920 stage — same target slot v3 uses so the
// Q lands pixel-identical to a hand-placed lockup.
const WORDMARK = {
	left: 210,
	top: 880,
	width: 660,
	get height() {
		return (this.width * 25) / 89;
	},
} as const;
// Strapline position derived from the brand SVG. We render the wordmark at
// width=660, so we map the strapline's bbox in the source viewBox into
// stage pixels at the same scale and anchor it relative to the wordmark
// slot's top-left. The gap below the wordmark therefore matches the gap
// in the brand file (proportionally) instead of being a hand-picked number.
const SVG_TO_STAGE = WORDMARK.width / 1523.72;
const ARCHITECTS_LEFT = WORDMARK.left + ARCHITECTS_IN_LOGO.leftFrac * WORDMARK.width;
const ARCHITECTS_TOP = WORDMARK.top + ARCHITECTS_VIEWBOX.y * SVG_TO_STAGE;
const ARCHITECTS_WIDTH = ARCHITECTS_VIEWBOX.w * SVG_TO_STAGE;
const ARCHITECTS_HEIGHT = ARCHITECTS_VIEWBOX.h * SVG_TO_STAGE;
const TAGLINE_TOP = WORDMARK.top + WORDMARK.height + 96;

// Q's pixel target inside the wordmark (matches the SVG path geometry exactly).
const Q_TARGET_LEFT = WORDMARK.left;
const Q_TARGET_TOP = WORDMARK.top;
const Q_TARGET_WIDTH =
	(Q_GLYPH_IN_WORDMARK.w / WORDMARK_VIEWBOX.w) * WORDMARK.width;

const LETTER_START = 0.65; // letters arrive just before the Q lands at 0.8s
const LETTER_STAGGER = 0.02;
const LETTER_DURATION = 0.08;
const LETTER_DROP = 1.4; // viewBox units (~10px on stage)

/**
 * Final reveal scene.
 *
 * Local timeline (seconds inside this scene):
 *   0.0 – 0.6   Rapid pull-back from the SceneAre close-up to the full Q at
 *               hero pose.
 *   0.6 – 0.7   Brief hold on the orange Q.
 *   0.7 – 0.95  Q snaps from hero pose into its wordmark slot.
 *   0.95 – 1.04 UARRY letters appear almost instantly behind the Q
 *               (~3-frame stagger left → right, no slow fade).
 *   1.3 – 1.7   "Lytle Associates · Since 1987" rises beneath the wordmark.
 *   1.7 – end   Quiet hold on the lockup.
 */
export const SceneFinalReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Single continuous flight: Q goes from filling the screen directly to
	// its wordmark slot, arriving at t=0.8s. easeOutCubic — fast at the
	// start (when the Q is huge and rapidly shrinking) and decelerating as
	// it settles into the slot. Lockup then holds with the tagline in for
	// the rest of the scene — no move to a top-left logo position.
	const ZOOM_TO_SLOT = [0.0, 0.8] as const;
	const HANDOFF = [0.78, 0.82] as const;
	const ARCHITECTS_IN = [0.85, 0.95] as const;
	const TAGLINE_IN = [1.0, 1.4] as const;

	const flight = segment(t, ZOOM_TO_SLOT[0], ZOOM_TO_SLOT[1], easeOutCubic);
	const left = lerp(CLOSEUP_Q_LEFT, Q_TARGET_LEFT, flight);
	const top = lerp(CLOSEUP_Q_TOP, Q_TARGET_TOP, flight);
	const width = lerp(CLOSEUP_Q_WIDTH, Q_TARGET_WIDTH, flight);

	// Standalone Q fades out at the handoff. The lockup Q is at full
	// opacity from HANDOFF[0] onward — both render the same orange paths at
	// pixel-identical positions, so holding the lockup Q at 1.0 underneath
	// the fading standalone keeps the total opacity at 1.0 throughout.
	// Anything less risks a brief sub-1.0 moment that reads as a tint shift.
	const handoffFade = segment(t, HANDOFF[0], HANDOFF[1], easeOutCubic);
	const standaloneOpacity = 1 - handoffFade;
	const lockupQOpacity = t >= HANDOFF[0] ? 1 : 0;

	// Per-letter staggered fade with a subtle drop-in.
	const letters: [LetterState, LetterState, LetterState, LetterState, LetterState] = [
		letterState(t, 0),
		letterState(t, 1),
		letterState(t, 2),
		letterState(t, 3),
		letterState(t, 4),
	];

	const architectsIn = segment(t, ARCHITECTS_IN[0], ARCHITECTS_IN[1], easeOutCubic);
	const taglineIn = segment(t, TAGLINE_IN[0], TAGLINE_IN[1], easeOutCubic);

	return (
		<AbsoluteFill
			style={{
				background: BRAND.colors.dark,
				overflow: 'hidden',
			}}
		>
			{/* Solid orange Q — at frame 0 the close-up scale fills the entire
			    frame with orange. As the zoom-out runs the Q shrinks into
			    view as a glyph, then morphs into the wordmark slot, then
			    hands off to the in-lockup Q. */}
			{standaloneOpacity > 0.001 && (
				<AbsoluteFill style={{opacity: standaloneOpacity, pointerEvents: 'none'}}>
					<div style={{position: 'absolute', left, top}}>
						<StandaloneQ width={width} color={BRAND.colors.orange} />
					</div>
				</AbsoluteFill>
			)}

			{/* In-lockup wordmark: Q at handoff pose + UARRY letters dropping in. */}
			<div
				style={{
					position: 'absolute',
					left: WORDMARK.left,
					top: WORDMARK.top,
					width: WORDMARK.width,
					height: WORDMARK.height,
					pointerEvents: 'none',
				}}
			>
				<svg
					width={WORDMARK.width}
					height={WORDMARK.height}
					viewBox={`0 0 ${WORDMARK_VIEWBOX.w} ${WORDMARK_VIEWBOX.h}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<QPaths color={BRAND.colors.orange} opacity={lockupQOpacity} />
					<UarryStaggered color={BRAND.colors.sage} letters={letters} />
				</svg>
			</div>

			{/* ARCHITECTS strapline — rendered from the path in the brand SVG so
			    it sits in the exact relative position the brand file places
			    it. Single fade-in, no per-letter stagger. */}
			<div
				style={{
					position: 'absolute',
					left: ARCHITECTS_LEFT,
					top: ARCHITECTS_TOP,
					width: ARCHITECTS_WIDTH,
					height: ARCHITECTS_HEIGHT,
					opacity: architectsIn,
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

			{/* "Lytle Associates since 1987" — Neue Montreal Regular, sized to
			    the wordmark's horizontal extent. Nudged a few px to the left
			    to optically balance the lockup. */}
			<div
				style={{
					position: 'absolute',
					top: TAGLINE_TOP,
					left: WORDMARK.left,
					width: WORDMARK.width,
					textAlign: 'center',
					opacity: taglineIn,
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
