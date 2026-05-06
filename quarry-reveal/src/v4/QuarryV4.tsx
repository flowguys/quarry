import {AbsoluteFill, Series} from 'remotion';
import {loadBrandFonts} from './fonts';
import {
	SceneOpening,
	SceneBuilt,
	SceneShaped,
	SceneStructured,
	SceneDefined,
	SceneWe,
	SceneAre,
	SceneFinalReveal,
} from './scenes';

// Trigger font load at module evaluation so the renderer's delayRender()
// captures it before the first frame is composited.
loadBrandFonts();

export const V4_FPS = 30;
export const V4_WIDTH = 1080;
export const V4_HEIGHT = 1920;

// Scene durations in frames @ 30fps. Total: 468f = 15.6s.
//
// Rhythm:
//   continuous opening: 1987 hold → ticker 1987 → 2026 → 1s lock (8.4s)
//     → fast middle IMAGINED → DELIVERED, four hard cuts (2.0s)
//       → WE / ARE (1.0s)
//         → final reveal: Q close-up → flight to wordmark slot (4.2s)
export const V4_SCENES = [
	{name: 'OPENING',     frames: 252, Component: SceneOpening},
	{name: 'BUILT',       frames: 15,  Component: SceneBuilt},
	{name: 'SHAPED',      frames: 15,  Component: SceneShaped},
	{name: 'STRUCTURED',  frames: 15,  Component: SceneStructured},
	{name: 'DEFINED',     frames: 15,  Component: SceneDefined},
	{name: 'WE',          frames: 15,  Component: SceneWe},
	{name: 'ARE',         frames: 15,  Component: SceneAre},
	{name: 'FINAL',       frames: 126, Component: SceneFinalReveal},
] as const;

export const V4_DURATION_FRAMES = V4_SCENES.reduce((s, x) => s + x.frames, 0);

export const QuarryV4: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0D0D0D'}}>
			<Series>
				{V4_SCENES.map(({name, frames, Component}) => (
					<Series.Sequence key={name} durationInFrames={frames}>
						<Component />
					</Series.Sequence>
				))}
			</Series>
		</AbsoluteFill>
	);
};
