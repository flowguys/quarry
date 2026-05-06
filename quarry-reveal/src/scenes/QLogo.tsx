import {AbsoluteFill} from 'remotion';
import {clamp, lerp, segment, easeInOutCubic, easeOutCubic, PALETTE} from '../timing';
import {WORDMARK} from '../layout';

interface Props {
	t: number;
}

// SVG viewBox is 89×25; the Q paths occupy 17.964 × 21.4852 of that.
// We render the SVG at HERO_SVG_W so the Q itself displays ≈520×620 in hero pose.
const HERO_Q_WIDTH = 520;
const HERO_SVG_W = (HERO_Q_WIDTH * 89) / 17.964; // ≈2576
const HERO_SVG_H = (HERO_SVG_W * 25) / 89;
const HERO_LEFT = 540 - HERO_Q_WIDTH / 2; // Q centered on x=540
const HERO_TOP = 960 - ((HERO_SVG_H * 21.4852) / 25) / 2; // Q centered on y=960

const TARGET_LEFT = WORDMARK.left;
const TARGET_TOP = WORDMARK.top;
const TARGET_SCALE = WORDMARK.width / HERO_SVG_W;

export const QLogo: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 4.6, 5.0, easeOutCubic);
	const fadeOut = segment(t, 6.0, 6.4, easeOutCubic);
	const opacity = fadeIn * (1 - fadeOut);

	const morph = clamp((t - 5.0) / 1.0);
	const eased = easeInOutCubic(morph);
	const left = lerp(HERO_LEFT, TARGET_LEFT, eased);
	const top = lerp(HERO_TOP, TARGET_TOP, eased);
	const scale = lerp(1, TARGET_SCALE, eased);

	return (
		<AbsoluteFill style={{opacity}}>
			<div
				style={{
					position: 'absolute',
					left,
					top,
					width: HERO_SVG_W,
					height: HERO_SVG_H,
					transform: `scale(${scale})`,
					transformOrigin: '0 0',
				}}
			>
				<svg
					width={HERO_SVG_W}
					height={HERO_SVG_H}
					viewBox="0 0 89 25"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M17.964 19.1578L16.2754 21.4852L13.2644 19.2982C12.9688 19.0831 12.6128 18.9671 12.2472 18.9666H4.64459C4.03403 18.9659 3.4487 18.7229 3.01705 18.2911L0.675429 15.9536C0.461129 15.7394 0.291168 15.485 0.175271 15.205C0.0593736 14.9251 -0.000185663 14.625 4.34762e-07 14.322V4.84766H2.8482V13.321C2.84922 13.7789 3.03133 14.2177 3.35477 14.5417L4.42284 15.6098C4.74686 15.9332 5.18568 16.1153 5.64349 16.1163H13.413C13.6566 16.1166 13.8938 16.1942 14.0904 16.3381L17.964 19.1578Z"
						fill={PALETTE.orange}
					/>
					<path
						d="M17.9638 4.64459V14.1189H15.1156V5.64553C15.1146 5.18771 14.9325 4.74889 14.609 4.42487L13.541 3.3568C13.217 3.03337 12.7781 2.85126 12.3203 2.85023H4.18262V0H13.3192C13.9298 0.000703078 14.5151 0.243617 14.9468 0.675429L17.2925 3.01298C17.506 3.22754 17.6752 3.48206 17.7904 3.76201C17.9056 4.04196 17.9645 4.34187 17.9638 4.64459Z"
						fill={PALETTE.orange}
					/>
				</svg>
			</div>
		</AbsoluteFill>
	);
};
