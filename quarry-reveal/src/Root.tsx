import {Composition} from 'remotion';
import {QuarryReveal, FPS, DURATION_SECONDS, WIDTH, HEIGHT} from './QuarryReveal';
import {QuarryV2, V2_FPS, V2_WIDTH, V2_HEIGHT, V2_DURATION_FRAMES} from './v2/QuarryV2';
import {QuarryV3, V3_FPS, V3_DURATION_SECONDS, V3_WIDTH, V3_HEIGHT} from './v3/QuarryV3';
import {QuarryV4, V4_FPS, V4_WIDTH, V4_HEIGHT, V4_DURATION_FRAMES} from './v4/QuarryV4';
import {QuarryV4L, V4L_FPS, V4L_WIDTH, V4L_HEIGHT, V4L_DURATION_FRAMES} from './v4l/QuarryV4L';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="QuarryReveal"
				component={QuarryReveal}
				durationInFrames={Math.round(FPS * DURATION_SECONDS)}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			<Composition
				id="QuarryV2"
				component={QuarryV2}
				durationInFrames={V2_DURATION_FRAMES}
				fps={V2_FPS}
				width={V2_WIDTH}
				height={V2_HEIGHT}
			/>
			<Composition
				id="QuarryV3"
				component={QuarryV3}
				durationInFrames={Math.round(V3_FPS * V3_DURATION_SECONDS)}
				fps={V3_FPS}
				width={V3_WIDTH}
				height={V3_HEIGHT}
			/>
			<Composition
				id="QuarryV4"
				component={QuarryV4}
				durationInFrames={V4_DURATION_FRAMES}
				fps={V4_FPS}
				width={V4_WIDTH}
				height={V4_HEIGHT}
			/>
			<Composition
				id="QuarryV4L"
				component={QuarryV4L}
				durationInFrames={V4L_DURATION_FRAMES}
				fps={V4L_FPS}
				width={V4L_WIDTH}
				height={V4L_HEIGHT}
			/>
		</>
	);
};
