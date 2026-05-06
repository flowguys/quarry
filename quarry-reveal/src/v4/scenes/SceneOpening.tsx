import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../brand';
import {easeInQuad} from '../../v3/timing';
import {imageForYear, openerImage} from '../videoImages';

// Continuous opening: a single take that holds on 1987, then ticks
// 1987 → 2026 with a hard image cut on every year change. The ramp uses
// easeInOutSine so the count starts slow, accelerates smoothly through the
// middle decades, and decelerates as it lands on 2026 — the half-cosine
// curve gives a more even speed ramp than cubic, with no abrupt change in
// acceleration around the midpoint.
//
// Local timeline (seconds):
//   0.00 – 1.00   Opener photo only — no year text yet.
//   1.00 – 1.50   "1987" appears and holds.
//   1.50 – 7.40   Year ramps 1987 → 2026 on easeInQuad — slow start that
//                 keeps accelerating, so the late years (2024/2025) tick
//                 past quickly instead of dwelling on a long sine tail.
//   7.40 – 8.40   Lock on 2026 (1s pause — the "ramp down" beat).
export const SceneOpening: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const t = frame / fps;
	const totalT = (durationInFrames - 1) / fps;

	// Hold 1987 until t=1.5, then ramp up to 2026 by t=totalT-1.0.
	// Trailing 1s holds 2026 on screen so the year reads cleanly before the
	// word ticker hard-cuts in. Longer hold + longer ramp window keeps the
	// symmetric sine curve but stretches the slow shoulders, so early-decade
	// images dwell longer.
	const RAMP_START = 1.5;
	const RAMP_END = Math.max(RAMP_START + 0.5, totalT - 1.0);
	let yearProgress: number;
	if (t < RAMP_START) {
		yearProgress = 0;
	} else if (t > RAMP_END) {
		yearProgress = 1;
	} else {
		yearProgress = easeInQuad((t - RAMP_START) / (RAMP_END - RAMP_START));
	}
	const yearFloat = 1987 + (2026 - 1987) * yearProgress;
	const yearDisplay = Math.min(2026, Math.floor(yearFloat));
	const activeYear = Math.min(2026, Math.max(1987, yearDisplay));

	const YEAR_TEXT_APPEAR = 1.0;
	const showYearText = t >= YEAR_TEXT_APPEAR;

	// Slow continuous zoom across the whole opening — gives the photography
	// a hint of motion. Photos cut on year change but the scale carries
	// across, so each new image is sampled at a slightly larger crop than
	// the last.
	const zoomScale = 1 + 0.08 * (t / totalT);

	// 1987 = the opener photo from /public/video-images/opener; other years
	// take the next unused image from the pool (one per year, no reuse).
	// When the pool runs out, render a grey placeholder instead.
	const imageSrc =
		activeYear === 1987 ? openerImage() : imageForYear(activeYear);

	return (
		<AbsoluteFill style={{background: '#0D0D0D', overflow: 'hidden'}}>
			{imageSrc ? (
				<Img
					key={activeYear}
					src={imageSrc}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						filter: 'saturate(0.85) contrast(1.04)',
						transform: `scale(${zoomScale})`,
						transformOrigin: '50% 50%',
					}}
				/>
			) : (
				<AbsoluteFill key={activeYear} style={{background: '#7a7a7a'}} />
			)}
			{/* Slight darkening so the white year reads cleanly over the photo. */}
			<AbsoluteFill style={{background: '#000', opacity: 0.35}} />

			{/* Single text element across the entire scene — same font, size,
			    tracking, and position whether it reads 1987 or 2026. tabular-nums
			    keeps each digit slot the same width so nothing shifts as the
			    counter ticks. */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
				}}
			>
				<div
					style={{
						fontFamily: BRAND.fonts.heading,
						fontWeight: 500,
						fontSize: 220,
						lineHeight: 1,
						letterSpacing: '0.18em',
						color: BRAND.colors.ink,
						fontVariantNumeric: 'tabular-nums',
						textAlign: 'center',
						textTransform: 'uppercase',
						whiteSpace: 'nowrap',
						paddingLeft: '0.18em',
					}}
				>
					{showYearText ? yearDisplay : ''}
				</div>
			</div>
		</AbsoluteFill>
	);
};
