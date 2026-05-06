import {AbsoluteFill} from 'remotion';
import {clamp, lerp, segment, easeInOutCubic, easeOutCubic} from '../timing';
import {WORDMARK} from '../timing';
import {StandaloneQ, Q_GLYPH_IN_WORDMARK, WORDMARK_VIEWBOX} from '../glyphs';

interface Props {
	t: number;
}

// Compute exact pixel target for the Q's slot inside the wordmark.
// Using the same fraction the wordmark SVG uses guarantees pixel-identical
// handoff to the lockup.
const Q_TARGET_LEFT = WORDMARK.left;
const Q_TARGET_TOP = WORDMARK.top;
const Q_TARGET_WIDTH =
	(Q_GLYPH_IN_WORDMARK.w / WORDMARK_VIEWBOX.w) * WORDMARK.width;

// Hero pose: Q centered on stage at ~520px wide.
const Q_HERO_WIDTH = 520;
const Q_HERO_LEFT = 540 - Q_HERO_WIDTH / 2;
const Q_HERO_TOP =
	960 - (Q_HERO_WIDTH * (Q_GLYPH_IN_WORDMARK.h / Q_GLYPH_IN_WORDMARK.w)) / 2;

/**
 * 4.6 – 5.0s  Q fades in at hero pose as the slideshow holds and counter locks.
 * 5.0 – 6.0s  Q morphs (translate + scale, easeInOutCubic) from hero pose to
 *             its exact pixel slot in the wordmark.
 * 6.0+        Q fades out — the lockup takes over rendering the same paths
 *             at the same pose, so the handoff is invisible.
 */
export const QMorph: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 4.6, 5.0, easeOutCubic);
	const fadeOut = segment(t, 6.0, 6.15, easeOutCubic);
	const opacity = fadeIn * (1 - fadeOut);
	if (opacity <= 0.001) return null;

	const morph = clamp((t - 5.0) / 1.0);
	const eased = easeInOutCubic(morph);
	const left = lerp(Q_HERO_LEFT, Q_TARGET_LEFT, eased);
	const top = lerp(Q_HERO_TOP, Q_TARGET_TOP, eased);
	const width = lerp(Q_HERO_WIDTH, Q_TARGET_WIDTH, eased);

	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left, top}}>
				<StandaloneQ width={width} />
			</div>
		</AbsoluteFill>
	);
};
