import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic} from '../timing';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

/** Faint blueprint grid behind the establish & slideshow phases. */
export const Grid: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.4, 1.2, easeOutCubic);
	const fadeOut = segment(t, 4.6, 5.2, easeInOutCubic);
	const opacity = fadeIn * 0.07 * (1 - fadeOut);

	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'screen'}}>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 1080 1920"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<pattern id="bp-fine" width="12" height="12" patternUnits="userSpaceOnUse">
						<path
							d="M 12 0 L 0 0 0 12"
							fill="none"
							stroke={BRAND.colors.orange}
							strokeWidth="0.25"
						/>
					</pattern>
					<pattern id="bp-coarse" width="60" height="60" patternUnits="userSpaceOnUse">
						<path
							d="M 60 0 L 0 0 0 60"
							fill="none"
							stroke={BRAND.colors.orange}
							strokeWidth="0.6"
						/>
					</pattern>
				</defs>
				<rect width="1080" height="1920" fill="url(#bp-fine)" opacity={0.55} />
				<rect width="1080" height="1920" fill="url(#bp-coarse)" />
			</svg>
		</AbsoluteFill>
	);
};
