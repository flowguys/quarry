import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from '../brand';

interface Props {
	children: React.ReactNode;
	/** Font size in px. Default 180. */
	size?: number;
	/** Letter spacing in em. Default 0.04. */
	tracking?: number;
	/** Font family stack. Default brand heading. */
	font?: string;
	/** Font weight. Default 500 (medium). */
	weight?: number | string;
	color?: string;
	style?: CSSProperties;
}

/**
 * Centered, all-caps wordmark for typography-led scenes.
 *
 * Wraps itself in an AbsoluteFill so it overlays sibling positioned layers
 * (e.g. BackgroundImage) cleanly. Source order in the parent determines
 * stacking, so always render after any background.
 */
export const CenteredText: React.FC<Props> = ({
	children,
	size = 180,
	tracking = 0.04,
	font = BRAND.fonts.heading,
	weight = 500,
	color = BRAND.colors.ink,
	style,
}) => {
	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					fontFamily: font,
					fontWeight: weight,
					fontSize: size,
					letterSpacing: `${tracking}em`,
					color,
					textAlign: 'center',
					lineHeight: 1,
					textTransform: 'uppercase',
					whiteSpace: 'nowrap',
					...style,
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
