import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';
import {BRAND} from '../brand';

export const Scene2026: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper enterFrames={6} slideY={10}>
			{/* Bright sky-feeling backdrop. Picsum doesn't guarantee a sky shot,
			    so we lean on a near-white overlay to keep it luminous. */}
			<BackgroundImage
				src="https://picsum.photos/seed/quarry-2026/1080/1920"
				desaturate={0.7}
				overlay={0.35}
				overlayColor={BRAND.colors.bone}
				scaleFrom={1.04}
				scaleTo={1.0}
				scaleProgress={progress}
			/>
			<CenteredText size={220} tracking={0.18} color={BRAND.colors.dark}>
				2026
			</CenteredText>
		</SceneWrapper>
	);
};
