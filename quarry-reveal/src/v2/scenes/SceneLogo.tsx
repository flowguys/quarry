import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {SceneWrapper, LogoLockup} from '../components';
import {BRAND} from '../brand';

export const SceneLogo: React.FC = () => {
	const frame = useCurrentFrame();

	// Tagline rises after the lockup has settled — slow, restrained.
	const taglineOpacity = interpolate(frame, [12, 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [12, 24], [12, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<SceneWrapper background={BRAND.colors.dark} enterFrames={8} slideY={8}>
			{/* Dark surface with a subtle vignette. */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 100% 80% at 50% 50%, #3a3a32 0%, #2D2D27 60%, #1d1d18 100%)',
				}}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 56,
				}}
			>
				<LogoLockup width={680} color={BRAND.colors.ink} />
				<div
					style={{
						fontFamily: BRAND.fonts.body,
						fontSize: 26,
						fontWeight: 500,
						letterSpacing: '0.32em',
						textTransform: 'uppercase',
						color: BRAND.colors.bone,
						opacity: taglineOpacity * 0.8,
						transform: `translateY(${taglineY}px)`,
					}}
				>
					Lytle Associates &middot; Since 1987
				</div>
			</div>
		</SceneWrapper>
	);
};
