import {AbsoluteFill} from 'remotion';
import {lerp, segment, easeOutCubic, easeInCubic, easeInOutCubic, easeOutQuart, PALETTE} from '../timing';

interface Props {
	t: number;
}

export const Counter: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 1.0, 1.4, easeOutCubic);
	const fadeOut = segment(t, 4.6, 4.9, easeInCubic);
	const opacity = fadeIn * (1 - fadeOut);

	// Year ramp 1987 → 2026 — easeOutQuart so it ticks fast then slows,
	// staying in lock-step with the slideshow that decelerates the same way.
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

	// Lock pulse near 2026
	const lockPulse =
		segment(t, 4.4, 4.6, easeOutCubic) *
		(1 - segment(t, 4.6, 4.85, easeOutCubic));
	const glow = 18 + lockPulse * 60;
	const glowOpacity = 0.35 + lockPulse * 0.7;

	// Pre-lock scale nudge
	const nudgeUp = segment(t, 4.5, 4.6, easeOutCubic);
	const nudgeDown = segment(t, 4.6, 4.85, easeInOutCubic);
	const scale = 1.0 + nudgeUp * 0.04 - nudgeDown * 0.08;

	// Rule width
	const ruleA = segment(t, 1.2, 1.6, easeOutCubic);
	const ruleB = segment(t, 4.4, 4.6, easeOutCubic);
	const ruleW = ruleA * 360 + ruleB * 180;

	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: 720,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontFamily: '"JetBrains Mono", "SF Mono", monospace',
						fontSize: 20,
						letterSpacing: '0.32em',
						color: PALETTE.orange,
						marginBottom: 24,
						textTransform: 'uppercase',
						paddingLeft: '0.32em',
						textShadow: '0 1px 8px rgba(0,0,0,0.6)',
					}}
				>
					Year
				</div>

				<div
					style={{
						fontFamily: '"JetBrains Mono", "SF Mono", monospace',
						fontWeight: 300,
						fontSize: 240,
						lineHeight: 0.9,
						letterSpacing: '-0.02em',
						color: PALETTE.ink,
						fontVariantNumeric: 'tabular-nums',
						textShadow: `0 0 ${glow}px rgba(244, 122, 53, ${glowOpacity}), 0 4px 24px rgba(0,0,0,0.7)`,
						transform: `scale(${scale})`,
					}}
				>
					{year}
				</div>

				<div
					style={{
						width: ruleW,
						height: 1.5,
						background: PALETTE.orange,
						marginTop: 28,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
