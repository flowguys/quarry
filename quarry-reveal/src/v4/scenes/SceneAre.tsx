import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {StandaloneQ} from '../../v3/glyphs';
import {BRAND} from '../brand';
import {
	CLOSEUP_Q_LEFT,
	CLOSEUP_Q_TOP,
	CLOSEUP_Q_WIDTH,
} from './closeup';

// "ARE" reads on a screen of solid brand orange. The audience doesn't
// realise yet that they're already inside the Q — the camera is so close
// that the Q's stroke alone fills the frame. SceneFinalReveal starts at
// the exact same pose and pulls the camera back to reveal the trick.
export const SceneAre: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// ARE fades out over the last 3 frames so the zoom-out can begin clean.
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
			{/* Giant Q — at this scale the right-bowl stroke is ~3500px wide,
			    so the entire 1080×1920 frame sits inside the orange. */}
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
