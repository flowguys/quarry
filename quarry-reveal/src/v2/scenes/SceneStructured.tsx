import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';

export const SceneStructured: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper>
			<BackgroundImage
				src="https://picsum.photos/seed/quarry-structured/1080/1920"
				desaturate={0.4}
				overlay={0.45}
				scaleFrom={1.0}
				scaleTo={1.04}
				scaleProgress={progress}
			/>
			<CenteredText size={130} tracking={0.06}>
				STRUCTURED
			</CenteredText>
		</SceneWrapper>
	);
};
