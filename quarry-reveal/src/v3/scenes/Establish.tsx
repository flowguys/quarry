import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic} from '../timing';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

/**
 * 0.0 – 1.2s: quiet establish.
 *   "EST. 1987" mark, "Lytle Associates" name, "Architecture & Planning" tag.
 * Fades out cleanly before the slideshow takes over at 1.2s.
 */
export const Establish: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.0, 0.6, easeOutCubic);
	const fadeOut = segment(t, 1.0, 1.4, easeInOutCubic);
	const opacity = fadeIn * (1 - fadeOut);

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				opacity,
				pointerEvents: 'none',
			}}
		>
			{/* EST. 1987 — restrained tracking, padding-left compensates trailing
			    letter-space so the visual text centers on the box. */}
			<div
				style={{
					fontFamily: BRAND.fonts.body,
					fontSize: 22,
					letterSpacing: '0.22em',
					color: BRAND.colors.orange,
					marginBottom: 38,
					fontWeight: 500,
					position: 'relative',
					paddingLeft: 'calc(28px + 0.22em)',
					paddingRight: 28,
					display: 'inline-block',
					textTransform: 'uppercase',
				}}
			>
				<span
					style={{
						position: 'absolute',
						top: '50%',
						right: '100%',
						width: 60,
						height: 1,
						background: BRAND.colors.orange,
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
						background: BRAND.colors.orange,
						opacity: 0.6,
					}}
				/>
			</div>

			{/* Lytle Associates — large, restrained */}
			<div
				style={{
					fontFamily: BRAND.fonts.heading,
					fontWeight: 500,
					fontSize: 110,
					letterSpacing: '0.01em',
					color: BRAND.colors.ink,
					whiteSpace: 'nowrap',
					textShadow: '0 4px 24px rgba(0,0,0,0.6)',
				}}
			>
				Lytle Associates
			</div>

			{/* Architecture & Planning — modest tracking with matching padding-left */}
			<div
				style={{
					fontFamily: BRAND.fonts.body,
					fontSize: 18,
					letterSpacing: '0.14em',
					color: BRAND.colors.bone,
					marginTop: 32,
					textTransform: 'uppercase',
					paddingLeft: '0.14em',
				}}
			>
				Architecture &amp; Planning
			</div>
		</AbsoluteFill>
	);
};
