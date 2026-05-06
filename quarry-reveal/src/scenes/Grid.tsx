import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic, PALETTE} from '../timing';

interface Props {
	t: number;
}

export const Grid: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.6, 1.4, easeOutCubic);
	const fadeOut = segment(t, 5.0, 6.0, easeInOutCubic);
	const opacity = fadeIn * 0.08 * (1 - fadeOut);

	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'screen'}}>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 1080 1920"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern
						id="bp-grid"
						width="60"
						height="60"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 60 0 L 0 0 0 60"
							fill="none"
							stroke={PALETTE.orange}
							strokeWidth="0.6"
						/>
					</pattern>
					<pattern
						id="bp-grid-fine"
						width="12"
						height="12"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 12 0 L 0 0 0 12"
							fill="none"
							stroke={PALETTE.orange}
							strokeWidth="0.25"
						/>
					</pattern>
				</defs>
				<rect width="1080" height="1920" fill="url(#bp-grid-fine)" opacity={0.55} />
				<rect width="1080" height="1920" fill="url(#bp-grid)" />
			</svg>
		</AbsoluteFill>
	);
};
