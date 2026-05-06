import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {SceneWrapper, QSymbol} from '../components';
import {BRAND} from '../brand';

export const SceneQ: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// Subtle 0.95 → 1.0 scale-in over the first ~third of the scene, then hold.
	const scaleEnd = Math.max(8, Math.round(durationInFrames * 0.45));
	const scale = interpolate(frame, [0, scaleEnd], [0.95, 1.0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<SceneWrapper background={BRAND.colors.darker}>
			{/* Dark textured surface — a faint vignette over solid dark to feel
			    refined without competing with the symbol. */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 90% 80% at 50% 50%, #1a1a18 0%, #0D0D0D 60%, #050505 100%)',
				}}
			/>
			<div style={{transform: `scale(${scale})`}}>
				<QSymbol size={520} color={BRAND.colors.orange} />
			</div>
		</SceneWrapper>
	);
};
