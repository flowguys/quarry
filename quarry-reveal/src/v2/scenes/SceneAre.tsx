import {SceneWrapper, BackgroundImage, CenteredText} from '../components';

export const SceneAre: React.FC = () => {
	return (
		<SceneWrapper>
			<BackgroundImage
				src="https://picsum.photos/seed/quarry-texture-are/1080/1920"
				desaturate={0.7}
				overlay={0.5}
			/>
			<CenteredText size={300} tracking={0.06}>
				ARE
			</CenteredText>
		</SceneWrapper>
	);
};
