import {AbsoluteFill} from 'remotion';
import {clamp, segment, easeOutCubic, easeInOutCubic, easeOutQuart, PALETTE} from '../timing';

interface Props {
	t: number;
}

const COUNT = 50;

// Deterministic procedural placeholders (golden-ratio hue spread → wide variety)
const PLACEHOLDERS = Array.from({length: COUNT}, (_, i) => {
	const hue = (i * 137.508) % 360;
	const sat = 18 + ((i * 11) % 28);
	const light = 22 + ((i * 7) % 20);
	const accentHue = (hue + 25 + ((i * 19) % 60)) % 360;
	const stripeAngle = (i * 13) % 180;
	const stripePeriod = 60 + ((i * 17) % 80);
	const stripeWidth = 12 + ((i * 5) % 28);
	const blockX = 8 + ((i * 23) % 70);
	const blockY = 12 + ((i * 31) % 60);
	const blockW = 14 + ((i * 13) % 40);
	const blockH = 10 + ((i * 17) % 35);
	const blockOpacity = 0.18 + ((i % 5) * 0.05);
	return {
		bg: `linear-gradient(${(i * 47) % 360}deg, hsl(${hue} ${sat}% ${light}%) 0%, hsl(${(hue + 40) % 360} ${Math.max(8, sat - 12)}% ${light + 12}%) 100%)`,
		stripe: `repeating-linear-gradient(${stripeAngle}deg, transparent 0 ${stripePeriod - stripeWidth}px, hsl(${accentHue} 60% 70% / 0.18) ${stripePeriod - stripeWidth}px ${stripePeriod}px)`,
		blockColor: `hsl(${accentHue} 55% 65% / ${blockOpacity})`,
		blockX,
		blockY,
		blockW,
		blockH,
	};
});

// Slideshow window: cycle through COUNT placeholders fast→slow.
// Image index advances along easeOutQuart(progress) so cuts decelerate.
const SLIDESHOW_START = 1.2;
const SLIDESHOW_END = 4.6;

// Verbs ride the slideshow — what the studio did between 1987 and 2026.
const VERBS: {word: string; in: number; out: number}[] = [
	{word: 'BUILT', in: 1.4, out: 2.3},
	{word: 'SHAPED', in: 2.2, out: 3.1},
	{word: 'STRUCTURED', in: 3.0, out: 3.95},
	{word: 'DEFINED', in: 3.85, out: 4.7},
];

export const Slideshow: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.8, 1.2, easeOutCubic);
	const fadeOut = segment(t, 4.6, 5.0, easeOutCubic);
	const opacity = fadeIn * (1 - fadeOut);

	const progress = clamp((t - SLIDESHOW_START) / (SLIDESHOW_END - SLIDESHOW_START));
	const idx = Math.min(COUNT - 1, Math.floor(easeOutQuart(progress) * COUNT));
	const p = PLACEHOLDERS[idx];

	return (
		<AbsoluteFill style={{opacity}}>
			{/* Image stage — sits behind the year counter */}
			<div
				style={{
					position: 'absolute',
					top: 540,
					left: 90,
					right: 90,
					height: 760,
					borderRadius: 12,
					overflow: 'hidden',
					background: p.bg,
					boxShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)',
				}}
			>
				{/* Stripes (architectural blueprint feel) */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: p.stripe,
						mixBlendMode: 'overlay',
					}}
				/>
				{/* Accent block */}
				<div
					style={{
						position: 'absolute',
						left: `${p.blockX}%`,
						top: `${p.blockY}%`,
						width: `${p.blockW}%`,
						height: `${p.blockH}%`,
						background: p.blockColor,
						borderRadius: 4,
					}}
				/>
				{/* Subtle grain via radial highlight */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(255,255,255,0.08), transparent 70%)',
					}}
				/>
			</div>

			{/* Verbs — what the studio did between 1987 and 2026 */}
			{VERBS.map((v) => {
				const mid = (v.in + v.out) / 2;
				const fadeIn = segment(t, v.in, mid, easeOutCubic);
				const fadeOut = segment(t, mid, v.out, easeInOutCubic);
				const verbOpacity = fadeIn * (1 - fadeOut);
				if (verbOpacity <= 0) return null;
				return (
					<div
						key={v.word}
						style={{
							position: 'absolute',
							top: 1380,
							left: 0,
							right: 0,
							textAlign: 'center',
							fontFamily: '"JetBrains Mono", "SF Mono", monospace',
							fontWeight: 500,
							fontSize: 56,
							letterSpacing: '0.18em',
							color: PALETTE.ink,
							textTransform: 'uppercase',
							opacity: verbOpacity,
							transform: `translateY(${(1 - fadeIn) * 18}px)`,
							paddingLeft: '0.18em',
							textShadow: '0 2px 24px rgba(0,0,0,0.7)',
						}}
					>
						{v.word}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
