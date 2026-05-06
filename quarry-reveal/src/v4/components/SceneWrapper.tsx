import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import type {ReactNode, CSSProperties} from 'react';

interface Props {
	children?: ReactNode;
	background?: string;
	/** Optional 0–1 fade-in over the first `enterFrames` frames. */
	enterFrames?: number;
	/** Optional micro upward slide (px) over the enter window. */
	slideY?: number;
	style?: CSSProperties;
}

/**
 * Wraps a single scene. Local time starts at frame 0 inside any <Sequence>,
 * so each scene's animations are self-contained and easily retimed.
 */
export const SceneWrapper: React.FC<Props> = ({
	children,
	background = '#0D0D0D',
	enterFrames = 0,
	slideY = 0,
	style,
}) => {
	const frame = useCurrentFrame();

	const opacity =
		enterFrames > 0
			? interpolate(frame, [0, enterFrames], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: 1;

	const ty =
		slideY !== 0
			? interpolate(frame, [0, enterFrames], [slideY, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: 0;

	return (
		<AbsoluteFill
			style={{
				background,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...style,
			}}
		>
			<AbsoluteFill
				style={{
					opacity,
					transform: ty ? `translateY(${ty}px)` : undefined,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
