import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';
import {imageForWord} from '../videoImages';

export const SceneDefined: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper>
			<BackgroundImage
				src={imageForWord('delivered')}
				desaturate={0.4}
				overlay={0.45}
				scaleFrom={1.04}
				scaleTo={1.0}
				scaleProgress={progress}
			/>
			<CenteredText size={135} tracking={0.06}>
				DELIVERED
			</CenteredText>
		</SceneWrapper>
	);
};
