import {AbsoluteFill} from 'remotion';
import {clamp, segment, easeOutCubic, easeOutQuart} from '../timing';
import {BRAND} from '../../v2/brand';

interface Props {
	t: number;
}

const COUNT = 50;

// Full-bleed procedural plates in the brand palette. Each is a desaturated
// stone/sage base with a single architectural rectangle and a thin orange
// section line. Real work imagery will replace these later.
const PLATES = Array.from({length: COUNT}, (_, i) => {
	const family = i % 4;
	const tones: [number, number, number][] = [
		[28, 14, 12], // dark warm   (near #2D2D27)
		[20, 8, 16],  // brown-grey
		[80, 8, 22],  // sage darker
		[82, 12, 30], // sage lighter
	];
	const [h, s, l] = tones[family];
	const lightShift = ((i * 7) % 10) - 5;
	const baseL = l + lightShift;
	const accentL = baseL + 22;

	return {
		bg: `linear-gradient(${(i * 31) % 360}deg, hsl(${h} ${s}% ${baseL}%) 0%, hsl(${h} ${s}% ${baseL + 8}%) 100%)`,
		blockBg: `hsl(${h} ${s}% ${accentL}% / 0.32)`,
		blockX: 8 + ((i * 13) % 70),
		blockY: 8 + ((i * 19) % 65),
		blockW: 28 + ((i * 11) % 45),
		blockH: 22 + ((i * 17) % 40),
		lineY: 18 + ((i * 23) % 60),
		lineLeft: ((i * 7) % 30),
		lineWidth: 40 + ((i * 13) % 55),
	};
});

const SLIDESHOW_START = 1.2;
const SLIDESHOW_END = 4.6;

/**
 * 1.2 – 5.0s: full-bleed slideshow of 50 procedural plates that decelerate
 * on easeOutQuart so cuts thin out toward 2026 — same curve as the year
 * counter. Locks on the final plate from 4.6s onward and crossfades into
 * the morph at 5.0.
 *
 * Two overlay gradients (top + bottom) keep the year counter and verbs
 * legible on top of any plate.
 */
export const Slideshow: React.FC<Props> = ({t}) => {
	const fadeIn = segment(t, 0.9, 1.4, easeOutCubic);
	const fadeOut = segment(t, 4.9, 5.3, easeOutCubic);
	const opacity = fadeIn * (1 - fadeOut);

	const progress = clamp(
		(t - SLIDESHOW_START) / (SLIDESHOW_END - SLIDESHOW_START),
	);
	const idx = Math.min(COUNT - 1, Math.floor(easeOutQuart(progress) * COUNT));
	const p = PLATES[idx];

	return (
		<AbsoluteFill style={{opacity}}>
			{/* Full-bleed plate */}
			<AbsoluteFill style={{background: p.bg}} />

			{/* Architectural rectangle — large, off-center, suggests an elevation */}
			<div
				style={{
					position: 'absolute',
					left: `${p.blockX}%`,
					top: `${p.blockY}%`,
					width: `${p.blockW}%`,
					height: `${p.blockH}%`,
					background: p.blockBg,
					border: `1px solid ${BRAND.colors.orange}28`,
				}}
			/>

			{/* Single orange section line — drafting hint */}
			<div
				style={{
					position: 'absolute',
					top: `${p.lineY}%`,
					left: `${p.lineLeft}%`,
					width: `${p.lineWidth}%`,
					height: 1,
					background: BRAND.colors.orange,
					opacity: 0.4,
				}}
			/>

			{/* Subtle desaturated tint to keep plates feeling photographic */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 90% 70% at 30% 25%, rgba(255,255,255,0.06), transparent 70%)',
				}}
			/>

			{/* Top + bottom legibility wash so the year counter and verbs read
			    cleanly on top of any plate. */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 28%, rgba(0,0,0,0.10) 72%, rgba(0,0,0,0.65) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
