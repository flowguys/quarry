import {SceneWrapper, CenteredText} from '../components';
import {BRAND} from '../brand';

export const SceneWe: React.FC = () => {
	return (
		<SceneWrapper background={BRAND.colors.bone}>
			<CenteredText size={300} tracking={0.06} color={BRAND.colors.dark}>
				WE
			</CenteredText>
		</SceneWrapper>
	);
};
