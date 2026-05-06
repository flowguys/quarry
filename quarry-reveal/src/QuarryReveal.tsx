import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {PALETTE, segment, easeOutQuart} from './timing';
import {Grid} from './scenes/Grid';
import {Legacy} from './scenes/Legacy';
import {Counter} from './scenes/Counter';
import {CadLines} from './scenes/CadLines';
import {Slideshow} from './scenes/Slideshow';
import {QLogo} from './scenes/QLogo';
import {Wordmark} from './scenes/Wordmark';
import {Bloom} from './scenes/Bloom';

export const FPS = 30;
export const DURATION_SECONDS = 12;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * Quarry — From Foundations to Form.
 *
 * Beat map (seconds):
 *   0.0 – 2.0  Establish: Lytle Associates / EST. 1987 + blueprint grid
 *   2.0 – 5.0  Year counter ticks 1987 → 2026; CAD construction lines draw
 *   5.0 – 6.5  Lock + dissolve: counter pulses, legacy fragments away,
 *              Q starts forming as wireframe edge
 *   6.5 – 8.0  Reveal: wireframe → glass → solid Q, specular sweep,
 *              QUARRY / ARCHITECTS rise into place, final bloom
 */
export const QuarryReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Whole-stage camera: subtle 1.0 → 1.015 ease across the reveal phase
	const cam = segment(t, 6.5, 8.0, easeOutQuart);
	const stageScale = 1.0 + cam * 0.015;

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 70% 60% at 50% 45%, #14141a 0%, ${PALETTE.bg} 60%, #08080a 100%)`,
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
				<CadLines t={t} />
				<Legacy t={t} />
				<Counter t={t} />
				<QLogo t={t} />
				<Wordmark t={t} />
				<Vignette />
				<Bloom t={t} />
			</AbsoluteFill>
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
