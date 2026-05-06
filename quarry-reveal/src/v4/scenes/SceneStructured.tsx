import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';
import {imageForWord} from '../videoImages';

export const SceneStructured: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper>
			<BackgroundImage
				src={imageForWord('crafted')}
				desaturate={0.4}
				overlay={0.45}
				scaleFrom={1.0}
				scaleTo={1.04}
				scaleProgress={progress}
			/>
			<CenteredText size={172} tracking={0.06}>
				CRAFTED
			</CenteredText>
		</SceneWrapper>
	);
};
