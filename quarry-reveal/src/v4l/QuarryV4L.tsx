import {AbsoluteFill, Series} from 'remotion';
import {loadBrandFonts} from '../v4/fonts';
import {SceneWe} from '../v4/scenes';
import {SceneAreL} from './scenes/SceneAreL';
import {SceneFinalRevealL} from './scenes/SceneFinalRevealL';

loadBrandFonts();

export const V4L_FPS = 30;
export const V4L_WIDTH = 1920;
export const V4L_HEIGHT = 1080;

// Landscape cut of v4's tail. Total: 156f = 5.2s.
//   WE → ARE (orange close-up) → FINAL (zoom-out + lockup)
//
// SceneWe comes straight from v4 — full-bleed wrapper + centred type, so it
// auto-fits the landscape canvas. SceneAreL and SceneFinalRevealL are
// landscape-positioned variants.
export const V4L_SCENES = [
	{name: 'WE',    frames: 15,  Component: SceneWe},
	{name: 'ARE',   frames: 15,  Component: SceneAreL},
	{name: 'FINAL', frames: 126, Component: SceneFinalRevealL},
] as const;

export const V4L_DURATION_FRAMES = V4L_SCENES.reduce((s, x) => s + x.frames, 0);

export const QuarryV4L: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#0D0D0D'}}>
			<Series>
				{V4L_SCENES.map(({name, frames, Component}) => (
					<Series.Sequence key={name} durationInFrames={frames}>
						<Component />
					</Series.Sequence>
				))}
			</Series>
		</AbsoluteFill>
	);
};
