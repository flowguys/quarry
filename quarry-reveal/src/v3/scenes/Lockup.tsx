import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeOutQuart} from '../timing';
import {WORDMARK, ARCHITECTS_TOP, FORMERLY_TOP} from '../timing';
import {QPaths, UarryPaths, WORDMARK_VIEWBOX} from '../glyphs';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

/**
 * 6.0+s  The lockup. Q has just landed at this exact pose; we render it here
 *        too (same paths) so the QMorph→Lockup handoff is invisible.
 *        Then UARRY appears to the right at 6.0–6.5, ARCHITECTS at 6.5–6.9,
 *        and "Formerly Lytle Associates" at 6.9–7.3. Holds until the end.
 */
export const Lockup: React.FC<Props> = ({t}) => {
	// The Q paths must be visible from t=6.0 onward so the handoff lands
	// exactly when QMorph fades out at 6.0.
	const qIn = segment(t, 5.95, 6.05, easeOutCubic);
	const wordIn = segment(t, 6.0, 6.5, easeOutQuart);
	const archIn = segment(t, 6.5, 6.9, easeOutCubic);
	const formerlyIn = segment(t, 6.9, 7.3, easeOutCubic);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{/* The full wordmark — Q at exact handoff pose, UARRY appears at 6.0+ */}
			<div
				style={{
					position: 'absolute',
					left: WORDMARK.left,
					top: WORDMARK.top,
					width: WORDMARK.width,
					height: WORDMARK.height,
				}}
			>
				<svg
					width={WORDMARK.width}
					height={WORDMARK.height}
					viewBox={`0 0 ${WORDMARK_VIEWBOX.w} ${WORDMARK_VIEWBOX.h}`}
					xmlns="http://www.w3.org/2000/svg"
				>
					<QPaths color={BRAND.colors.orange} opacity={qIn} />
					<UarryPaths color={BRAND.colors.ink} opacity={wordIn} />
				</svg>
			</div>

			{/* ARCHITECTS — orange monospace, restrained tracking */}
			<div
				style={{
					position: 'absolute',
					top: ARCHITECTS_TOP,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: archIn,
					transform: `translateY(${(1 - archIn) * 18}px)`,
				}}
			>
				<span
					style={{
						display: 'inline-block',
						fontFamily: BRAND.fonts.body,
						fontWeight: 500,
						fontSize: 22,
						letterSpacing: '0.18em',
						color: BRAND.colors.orange,
						textTransform: 'uppercase',
						paddingLeft: '0.18em',
					}}
				>
					ARCHITECTS
				</span>
			</div>

			{/* "Formerly Lytle Associates" — dim italic */}
			<div
				style={{
					position: 'absolute',
					top: FORMERLY_TOP,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: formerlyIn * 0.6,
				}}
			>
				<span
					style={{
						display: 'inline-block',
						fontFamily: BRAND.fonts.body,
						fontWeight: 500,
						fontStyle: 'italic',
						fontSize: 18,
						letterSpacing: '0.12em',
						color: BRAND.colors.bone,
						textTransform: 'uppercase',
						paddingLeft: '0.12em',
					}}
				>
					Formerly Lytle Associates
				</span>
			</div>
		</AbsoluteFill>
	);
};
