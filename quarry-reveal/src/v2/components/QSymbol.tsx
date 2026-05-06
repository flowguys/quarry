import {Img, staticFile} from 'remotion';
import {BRAND} from '../brand';

interface Props {
	/** Render width in px. Default 540. */
	size?: number;
	/** Color override (the SVG uses currentColor). Default brand orange. */
	color?: string;
}

/**
 * Q symbol from /Brand/Logo/quarry-logo.svg, isolated to just the Q glyph.
 * Uses a CSS mask so we can colorize the SVG without re-encoding it.
 */
export const QSymbol: React.FC<Props> = ({size = 540, color = BRAND.colors.orange}) => {
	const aspect = 18 / 22;
	const width = size;
	const height = size / aspect;

	const url = staticFile('brand/logo/q-symbol.svg');

	return (
		<div
			style={{
				width,
				height,
				background: color,
				WebkitMask: `url(${url}) center / contain no-repeat`,
				mask: `url(${url}) center / contain no-repeat`,
			}}
			aria-hidden
		/>
	);
};

/**
 * Variant that renders the SVG directly (no mask). Useful when you want
 * to keep the original brand fill colors as authored.
 */
export const QSymbolImg: React.FC<Pick<Props, 'size'>> = ({size = 540}) => {
	const aspect = 18 / 22;
	return (
		<Img
			src={staticFile('brand/logo/q-symbol.svg')}
			style={{width: size, height: size / aspect, display: 'block'}}
		/>
	);
};
