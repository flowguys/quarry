import {useId} from 'react';
import {QPaths, Q_GLYPH_IN_WORDMARK} from '../../v3/glyphs';

interface Props {
	/** Q's left edge in stage pixels. */
	left: number;
	/** Q's top edge in stage pixels. */
	top: number;
	/** Q's width in stage pixels. */
	width: number;
	/** Photo URL to show inside the Q. */
	photoSrc: string;
	/** Optional fade for the whole mask. */
	opacity?: number;
}

/**
 * Renders a 1080×1920 SVG that draws the supplied photo clipped to the Q
 * letterform at (left, top, width). Outside the Q's silhouette nothing is
 * drawn, so a parent's dark background shows through.
 *
 * Used to make the photo appear to live "inside" the Q during the SceneAre
 * close-up and the first phase of SceneFinalReveal.
 */
export const QPhotoMask: React.FC<Props> = ({
	left,
	top,
	width,
	photoSrc,
	opacity = 1,
}) => {
	const clipId = `q-photo-clip-${useId()}`;
	const scale = width / Q_GLYPH_IN_WORDMARK.w;

	return (
		<svg
			width={1080}
			height={1920}
			viewBox="0 0 1080 1920"
			preserveAspectRatio="none"
			style={{position: 'absolute', top: 0, left: 0, opacity}}
		>
			<defs>
				<clipPath id={clipId}>
					<g transform={`translate(${left} ${top}) scale(${scale})`}>
						<QPaths color="#fff" />
					</g>
				</clipPath>
			</defs>
			<image
				href={photoSrc}
				x={0}
				y={0}
				width={1080}
				height={1920}
				preserveAspectRatio="xMidYMid slice"
				clipPath={`url(#${clipId})`}
			/>
		</svg>
	);
};
