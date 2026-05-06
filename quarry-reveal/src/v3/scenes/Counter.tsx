import {AbsoluteFill} from 'remotion';
import {lerp, segment, easeOutCubic, easeInCubic, easeInOutCubic, easeOutQuart} from '../timing';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

/**
 * Year counter — sits in the upper portion of the frame, large and prominent.
 * Ticks 1987 → 2026 on easeOutQuart so it shares the slideshow's deceleration.
 */
export const Counter: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 1.0, 1.4, easeOutCubic);
	const fadeOut = segment(t, 4.7, 5.0, easeInCubic);
	const opacity = fadeIn * (1 - fadeOut);

	const RAMP_START = 1.2;
	const RAMP_END = 4.6;
	let yearProgress: number;
	if (t < RAMP_START) {
		yearProgress = 0;
	} else if (t > RAMP_END) {
		yearProgress = 1;
	} else {
		yearProgress = easeOutQuart((t - RAMP_START) / (RAMP_END - RAMP_START));
	}
	const year = Math.min(2026, Math.floor(lerp(1987, 2026, yearProgress)));

	const lockPulse =
		segment(t, 4.4, 4.6, easeOutCubic) *
		(1 - segment(t, 4.6, 4.85, easeOutCubic));
	const glow = 24 + lockPulse * 80;
	const glowOpacity = 0.4 + lockPulse * 0.6;

	const nudgeUp = segment(t, 4.5, 4.6, easeOutCubic);
	const nudgeDown = segment(t, 4.6, 4.9, easeInOutCubic);
	const scale = 1.0 + nudgeUp * 0.04 - nudgeDown * 0.06;

	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: 240,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				{/* "YEAR" label — restrained tracking with matching padding-left */}
				<div
					style={{
						fontFamily: BRAND.fonts.body,
						fontWeight: 500,
						fontSize: 22,
						letterSpacing: '0.22em',
						color: BRAND.colors.orange,
						marginBottom: 28,
						textTransform: 'uppercase',
						paddingLeft: '0.22em',
						textShadow: '0 1px 12px rgba(0,0,0,0.7)',
					}}
				>
					Year
				</div>

				{/* Hero year number — huge, brand heading, with warm glow */}
				<div
					style={{
						fontFamily: BRAND.fonts.heading,
						fontWeight: 500,
						fontSize: 320,
						lineHeight: 0.9,
						letterSpacing: '-0.02em',
						color: BRAND.colors.ink,
						fontVariantNumeric: 'tabular-nums',
						textShadow: `0 0 ${glow}px rgba(235, 87, 23, ${glowOpacity}), 0 6px 32px rgba(0,0,0,0.75)`,
						transform: `scale(${scale})`,
					}}
				>
					{year}
				</div>
			</div>
		</AbsoluteFill>
	);
};
