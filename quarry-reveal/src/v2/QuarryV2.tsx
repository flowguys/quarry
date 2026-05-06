import {AbsoluteFill, Series} from 'remotion';
import {loadBrandFonts} from './fonts';
import {
	Scene1987,
	SceneBuilt,
	SceneShaped,
	SceneStructured,
	SceneDefined,
	ScenePause,
	Scene2026,
	SceneWe,
	SceneAre,
	SceneQ,
	SceneLogo,
} from './scenes';

// Trigger font load at module evaluation so the renderer's delayRender()
// captures it before the first frame is composited.
loadBrandFonts();

export const V2_FPS = 30;
export const V2_WIDTH = 1080;
export const V2_HEIGHT = 1920;

// Scene durations in frames. Total: 246f = 8.2s.
//
// Rhythm:
//   slow start (1987)
//     → fast middle (BUILT → DEFINED, four hard cuts)
//       → pause
//         → strong finish (2026 → WE → ARE → Q → LOGO)
export const V2_SCENES = [
	{name: '1987',       frames: 33, Component: Scene1987},
	{name: 'BUILT',      frames: 15, Component: SceneBuilt},
	{name: 'SHAPED',     frames: 15, Component: SceneShaped},
	{name: 'STRUCTURED', frames: 15, Component: SceneStructured},
	{name: 'DEFINED',    frames: 15, Component: SceneDefined},
	{name: 'PAUSE',      frames: 9,  Component: ScenePause},
	{name: '2026',       frames: 30, Component: Scene2026},
	{name: 'WE',         frames: 15, Component: SceneWe},
	{name: 'ARE',        frames: 15, Component: SceneAre},
	{name: 'Q',          frames: 30, Component: SceneQ},
	{name: 'LOGO',       frames: 54, Component: SceneLogo},
] as const;

export const V2_DURATION_FRAMES = V2_SCENES.reduce((s, x) => s + x.frames, 0);

export const QuarryV2: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0D0D0D'}}>
			<Series>
				{V2_SCENES.map(({name, frames, Component}) => (
					<Series.Sequence key={name} durationInFrames={frames}>
						<Component />
					</Series.Sequence>
				))}
			</Series>
		</AbsoluteFill>
	);
};
