import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic} from '../timing';

interface Props {
	t: number;
}

/**
 * Warm orange bloom that pulses at the brand-mark moments.
 *   5.95 – 6.30  Q lock-flash + wordmark settle
 *  10.40 – 11.20  Quiet final breath before the fade
 */
export const Bloom: React.FC<Props> = ({t}) => {
	const lockFlash =
		segment(t, 5.95, 6.05, easeOutCubic) *
		(1 - segment(t, 6.05, 6.30, easeOutCubic));
	const wordmarkBloom =
		segment(t, 6.0, 6.30, easeOutCubic) *
		(1 - segment(t, 6.30, 6.80, easeInOutCubic));
	const finalBreath =
		segment(t, 10.40, 10.80, easeOutCubic) *
		(1 - segment(t, 10.80, 11.30, easeInOutCubic));
	const opacity = lockFlash * 0.45 + wordmarkBloom * 0.7 + finalBreath * 0.3;

	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(ellipse 60% 35% at 50% 49%, rgba(244, 122, 53, 0.65), transparent 70%)',
				mixBlendMode: 'screen',
				filter: 'blur(28px)',
				opacity,
				pointerEvents: 'none',
			}}
		/>
	);
};
