import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneWrapper, BackgroundImage, CenteredText} from '../components';
import {imageForWord} from '../videoImages';

export const SceneBuilt: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = frame / Math.max(1, durationInFrames - 1);

	return (
		<SceneWrapper>
			<BackgroundImage
				src={imageForWord('imagined')}
				desaturate={0.4}
				overlay={0.42}
				scaleFrom={1.0}
				scaleTo={1.04}
				scaleProgress={progress}
			/>
			<CenteredText size={150} tracking={0.06}>
				IMAGINED
			</CenteredText>
		</SceneWrapper>
	);
};
