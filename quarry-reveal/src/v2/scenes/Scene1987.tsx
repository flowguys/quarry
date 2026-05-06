import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';

export const Scene1987: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper enterFrames={6} slideY={12}>
			<BackgroundImage
				src="https://picsum.photos/seed/quarry-1987/1080/1920"
				desaturate={0.55}
				overlay={0.45}
				scaleFrom={1.05}
				scaleTo={1.0}
				scaleProgress={progress}
			/>
			<CenteredText size={220} tracking={0.18} weight={500}>
				1987
			</CenteredText>
		</SceneWrapper>
	);
};
