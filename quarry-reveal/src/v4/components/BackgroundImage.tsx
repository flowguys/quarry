import {AbsoluteFill, Img} from 'remotion';

interface Props {
	src: string;
	/** 0–1 desaturation strength applied via CSS filter. Default 0.4. */
	desaturate?: number;
	/** 0–1 black overlay opacity for readability. Default 0.4. */
	overlay?: number;
	/** Override overlay color (e.g. white wash for the 2026 sky scene). */
	overlayColor?: string;
	/** Slow Ken Burns scale during the scene. Default off. */
	scaleFrom?: number;
	scaleTo?: number;
	scaleProgress?: number;
}

/**
 * Full-bleed background image with desaturation, dark overlay, and an
 * optional slow scale (driven by the parent's local frame progress 0..1).
 */
export const BackgroundImage: React.FC<Props> = ({
	src,
	desaturate = 0.4,
	overlay = 0.4,
	overlayColor = '#000',
	scaleFrom = 1,
	scaleTo = 1,
	scaleProgress = 0,
}) => {
	const scale = scaleFrom + (scaleTo - scaleFrom) * scaleProgress;
	const saturate = 1 - desaturate;

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${scale})`}}>
				<Img
					src={src}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						filter: `saturate(${saturate}) contrast(1.02)`,
					}}
				/>
			</AbsoluteFill>
			<AbsoluteFill
				style={{background: overlayColor, opacity: overlay}}
			/>
		</AbsoluteFill>
	);
};
