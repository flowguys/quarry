import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {segment, easeOutQuart, easeInOutCubic} from './timing';
import {BRAND} from '../v2/brand';
import {loadBrandFonts} from '../v2/fonts';
import {Grid} from './scenes/Grid';
import {Establish} from './scenes/Establish';
import {Slideshow} from './scenes/Slideshow';
import {Counter} from './scenes/Counter';
import {Verbs} from './scenes/Verbs';
import {QMorph} from './scenes/QMorph';
import {Lockup} from './scenes/Lockup';
import {Bloom} from './scenes/Bloom';

// Register brand fonts (Instrument Sans + Inter from /Brand) so the renderer
// waits for them before flushing frames.
loadBrandFonts();

export const V3_FPS = 30;
export const V3_DURATION_SECONDS = 12;
export const V3_WIDTH = 1080;
export const V3_HEIGHT = 1920;

/**
 * Quarry — From Foundations to Form (v3).
 *
 * v3 evolves v2's brand-aware foundation (Instrument Sans + Inter, brand
 * orange #EB5717, /Brand SVG paths) into a single continuous narrative
 * instead of v2's hard-cut Series.
 *
 * Beat map (seconds):
 *   0.0 – 1.2   Establish: Lytle Associates / EST. 1987 / Architecture & Planning
 *               over a faint blueprint grid.
 *   1.2 – 4.6   Slideshow of 50 procedural plates decelerates (easeOutQuart) in
 *               lock-step with the year counter ticking 1987 → 2026 on the same
 *               curve. Verbs BUILT → SHAPED → STRUCTURED → DEFINED cross-fade
 *               across the window.
 *   4.6 – 5.0   Counter locks on 2026, slideshow holds on its final plate, the
 *               brand Q fades up at hero pose.
 *   5.0 – 6.0   Q-to-wordmark transition: the same SVG paths morph (translate
 *               + scale, easeInOutCubic) from hero pose down to the exact
 *               pixel slot the Q occupies in the wordmark.
 *   6.0 – 6.5   The Q stays put; UARRY appears next to it (cream, while the
 *               Q stays orange).
 *   6.5 – 6.9   ARCHITECTS subtitle rises beneath the wordmark.
 *   6.9 – 7.3   "Formerly Lytle Associates" fades in below.
 *   7.3 – 11.6  Quiet hold on the final lockup with a slow camera dolly.
 *  11.6 – 12.0  0.4s fade-to-black.
 */
export const QuarryV3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Slow camera dolly across the reveal + hold (5.0 → 11.6s): 1.000 → 1.018
	const cam = segment(t, 5.0, 11.6, easeOutQuart);
	const stageScale = 1.0 + cam * 0.018;

	// 0.4s fade-to-black at the end.
	const fadeOut = segment(t, 11.6, 12.0, easeInOutCubic);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 70% 60% at 50% 45%, #14141a 0%, ${BRAND.colors.darker} 60%, #050507 100%)`,
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					transform: `scale(${stageScale})`,
					transformOrigin: '50% 55%',
				}}
			>
				<Grid t={t} />
				<Slideshow t={t} />
				<Counter t={t} />
				<Establish t={t} />
				<Verbs t={t} />
				<QMorph t={t} />
				<Lockup t={t} />
				<Vignette />
				<Bloom t={t} />
			</AbsoluteFill>

			{/* Fade-to-black sits OUTSIDE the dolly transform so the black covers
			    the full frame regardless of stage scale. */}
			<AbsoluteFill
				style={{
					background: '#000',
					opacity: fadeOut,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

const Vignette: React.FC = () => (
	<AbsoluteFill
		style={{
			background:
				'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
			mixBlendMode: 'multiply',
			pointerEvents: 'none',
		}}
	/>
);
