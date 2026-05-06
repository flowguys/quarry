import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {StandaloneQ} from '../../v3/glyphs';
import {BRAND} from '../../v4/brand';
import {
	CLOSEUP_Q_LEFT,
	CLOSEUP_Q_TOP,
	CLOSEUP_Q_WIDTH,
} from './closeup';

// Landscape "ARE" scene: solid orange (we're inside the giant Q's stroke).
// SceneFinalRevealL starts at the same close-up pose so the cut is invisible.
export const SceneAreL: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const fadeStart = Math.max(0, durationInFrames - 3);
	const areOpacity = interpolate(frame, [fadeStart, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: BRAND.colors.darker,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: CLOSEUP_Q_LEFT,
					top: CLOSEUP_Q_TOP,
					pointerEvents: 'none',
				}}
			>
				<StandaloneQ width={CLOSEUP_Q_WIDTH} color={BRAND.colors.orange} />
			</div>

			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
					opacity: areOpacity,
				}}
			>
				<div
					style={{
						fontFamily: BRAND.fonts.heading,
						fontWeight: 500,
						fontSize: 300,
						lineHeight: 1,
						letterSpacing: '0.06em',
						color: BRAND.colors.ink,
						textTransform: 'uppercase',
						paddingLeft: '0.06em',
					}}
				>
					ARE
				</div>
			</div>
		</AbsoluteFill>
	);
};
