import {Img, staticFile} from 'remotion';
import {BRAND} from '../brand';

interface Props {
	/** Render width in px. Default 720. The lockup is wide (89:25). */
	width?: number;
	/** Color override. Default brand ink. The SVG uses currentColor. */
	color?: string;
}

/**
 * Full Quarry lockup (Q + wordmark) from /Brand/Logo/quarry-logo.svg,
 * masked so we can re-tint without modifying the source SVG.
 */
export const LogoLockup: React.FC<Props> = ({
	width = 720,
	color = BRAND.colors.ink,
}) => {
	const aspect = 89 / 25;
	const height = width / aspect;
	const url = staticFile('brand/logo/quarry-logo.svg');

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

/** Image-direct variant that preserves the SVG's authored fill colors. */
export const LogoLockupImg: React.FC<Pick<Props, 'width'>> = ({width = 720}) => {
	const aspect = 89 / 25;
	return (
		<Img
			src={staticFile('brand/logo/quarry-logo.svg')}
			style={{width, height: width / aspect, display: 'block'}}
		/>
	);
};
