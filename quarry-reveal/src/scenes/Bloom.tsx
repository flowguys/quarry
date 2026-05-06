import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic} from '../timing';

interface Props {
	t: number;
}

export const Bloom: React.FC<Props> = ({t}) => {
	const lockFlash =
		segment(t, 6.95, 7.05, easeOutCubic) *
		(1 - segment(t, 7.05, 7.3, easeOutCubic));
	const finalBloom =
		segment(t, 7.5, 7.75, easeOutCubic) *
		(1 - segment(t, 7.75, 8.0, easeInOutCubic));
	const opacity = lockFlash * 0.5 + finalBloom * 0.85;

	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(ellipse 60% 35% at 50% 49%, rgba(244, 122, 53, 0.7), transparent 70%)',
				mixBlendMode: 'screen',
				filter: 'blur(28px)',
				opacity,
				pointerEvents: 'none',
			}}
		/>
	);
};
