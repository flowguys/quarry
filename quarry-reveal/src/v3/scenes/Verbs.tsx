import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic} from '../timing';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

/**
 * The four verbs cross-fade across the slideshow window — what the studio did
 * between 1987 and 2026. Sized big (v2 magnitude) and positioned in the lower
 * portion of the frame so they read alongside the year counter above.
 *
 * Sizes are tuned per-word so each fits within ~880px of the 1080-wide canvas
 * (≈100px each side as title-safe gutter).
 */
const VERBS: {word: string; in: number; out: number; size: number}[] = [
	{word: 'BUILT',      in: 1.4, out: 2.3, size: 240},
	{word: 'SHAPED',     in: 2.2, out: 3.1, size: 175},
	{word: 'STRUCTURED', in: 3.0, out: 3.95, size: 130},
	{word: 'DEFINED',    in: 3.85, out: 4.7, size: 172},
];

export const Verbs: React.FC<Props> = ({t}) => {
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{VERBS.map((v) => {
				const mid = (v.in + v.out) / 2;
				const fadeIn = segment(t, v.in, mid, easeOutCubic);
				const fadeOut = segment(t, mid, v.out, easeInOutCubic);
				const opacity = fadeIn * (1 - fadeOut);
				if (opacity <= 0.001) return null;
				return (
					<div
						key={v.word}
						style={{
							position: 'absolute',
							top: 1280,
							left: 0,
							right: 0,
							textAlign: 'center',
							opacity,
							transform: `translateY(${(1 - fadeIn) * 24}px)`,
						}}
					>
						<span
							style={{
								display: 'inline-block',
								fontFamily: BRAND.fonts.heading,
								fontWeight: 500,
								fontSize: v.size,
								letterSpacing: '0.06em',
								paddingLeft: '0.06em',
								color: BRAND.colors.ink,
								textTransform: 'uppercase',
								lineHeight: 1,
								textShadow: '0 6px 32px rgba(0,0,0,0.7)',
							}}
						>
							{v.word}
						</span>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
