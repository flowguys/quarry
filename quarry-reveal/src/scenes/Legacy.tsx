import {AbsoluteFill} from 'remotion';
import {clamp, segment, easeOutCubic, easeInCubic, easeInOutCubic, PALETTE} from '../timing';

interface Props {
	t: number;
}

const NAME = 'Lytle Associates';

export const Legacy: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.0, 0.6, easeOutCubic);
	const dim = segment(t, 1.8, 2.4, easeInOutCubic);
	const frag = segment(t, 5.0, 6.4, easeInCubic);
	const baseOpacity = fadeIn * (1 - 0.55 * dim);
	const groupOpacity = (1 - frag) * baseOpacity;

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'flex-start',
				paddingTop: 460,
				textAlign: 'center',
				opacity: groupOpacity,
			}}
		>
			<div
				style={{
					fontFamily: '"JetBrains Mono", "SF Mono", monospace',
					fontSize: 22,
					letterSpacing: '0.28em',
					color: PALETTE.orange,
					marginBottom: 38,
					fontWeight: 500,
					position: 'relative',
					padding: '0 28px',
					display: 'inline-block',
				}}
			>
				<span
					style={{
						position: 'absolute',
						top: '50%',
						right: '100%',
						width: 60,
						height: 1,
						background: PALETTE.orange,
						opacity: 0.6,
					}}
				/>
				EST. 1987
				<span
					style={{
						position: 'absolute',
						top: '50%',
						left: '100%',
						width: 60,
						height: 1,
						background: PALETTE.orange,
						opacity: 0.6,
					}}
				/>
			</div>

			<div
				style={{
					fontFamily: 'Inter, system-ui, sans-serif',
					fontWeight: 300,
					fontSize: 78,
					letterSpacing: '0.04em',
					color: PALETTE.ink,
					whiteSpace: 'nowrap',
				}}
			>
				{NAME.split('').map((ch, i) => {
					// Each char fragments downward + rotates between t=5.0 and 6.4, staggered
					const stagger = (i % 8) * 0.04;
					const local = clamp((t - (5.0 + stagger)) / 1.0);
					const drop = easeInCubic(local) * (60 + (i % 4) * 30);
					const rot = easeInCubic(local) * ((i % 2 === 0 ? 1 : -1) * (4 + (i % 3)));
					const charOpacity = 1 - local;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								whiteSpace: 'pre',
								transform: `translateY(${drop}px) rotate(${rot}deg)`,
								opacity: charOpacity,
							}}
						>
							{ch}
						</span>
					);
				})}
			</div>

			<div
				style={{
					fontFamily: '"JetBrains Mono", "SF Mono", monospace',
					fontSize: 18,
					letterSpacing: '0.18em',
					color: PALETTE.inkDim,
					marginTop: 32,
					textTransform: 'uppercase',
					paddingLeft: '0.18em',
				}}
			>
				Architecture &amp; Planning
			</div>
		</AbsoluteFill>
	);
};
