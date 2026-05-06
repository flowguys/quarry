import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeInOutCubic, Q_BOX, PALETTE} from '../timing';

interface Props {
	t: number;
}

// Deterministic set of architectural construction lines.
// Each entry: a "primitive" + an estimated path length (used as the dash budget).
// We hand-tune lengths because we render server-side under Node where DOM
// getTotalLength() isn't available.
type Primitive =
	| {type: 'line'; x1: number; y1: number; x2: number; y2: number; len: number}
	| {type: 'path'; d: string; len: number};

const QX = Q_BOX.x;
const QY = Q_BOX.y;
const QW = Q_BOX.width;
const QH = Q_BOX.height;
const CX = QX + QW / 2;
const CY = QY + QH / 2;

const PRIMITIVES: Primitive[] = [
	// Outer extension lines (frame the Q's bbox)
	{type: 'line', x1: QX - 80, y1: QY, x2: QX + QW + 80, y2: QY, len: QW + 160},
	{type: 'line', x1: QX - 80, y1: QY + QH, x2: QX + QW + 80, y2: QY + QH, len: QW + 160},
	{type: 'line', x1: QX, y1: QY - 60, x2: QX, y2: QY + QH + 60, len: QH + 120},
	{type: 'line', x1: QX + QW, y1: QY - 60, x2: QX + QW, y2: QY + QH + 60, len: QH + 120},

	// Center cross-hairs (registration marks)
	{type: 'line', x1: CX - 90, y1: CY, x2: CX + 90, y2: CY, len: 180},
	{type: 'line', x1: CX, y1: CY - 90, x2: CX, y2: CY + 90, len: 180},

	// Diagonals (surveying triangulation)
	{type: 'line', x1: QX, y1: QY, x2: QX + QW, y2: QY + QH, len: Math.hypot(QW, QH)},
	{type: 'line', x1: QX + QW, y1: QY, x2: QX, y2: QY + QH, len: Math.hypot(QW, QH)},

	// Dimension ticks above
	{
		type: 'path',
		d: `M ${QX} ${QY - 40} L ${QX} ${QY - 20} M ${QX + QW} ${QY - 40} L ${QX + QW} ${QY - 20} M ${QX} ${QY - 30} L ${QX + QW} ${QY - 30}`,
		len: QW + 40,
	},
	// Dimension ticks below
	{
		type: 'path',
		d: `M ${QX} ${QY + QH + 40} L ${QX} ${QY + QH + 20} M ${QX + QW} ${QY + QH + 40} L ${QX + QW} ${QY + QH + 20} M ${QX} ${QY + QH + 30} L ${QX + QW} ${QY + QH + 30}`,
		len: QW + 40,
	},

	// Inner rule-of-thirds grid
	{type: 'line', x1: QX, y1: QY + QH / 3, x2: QX + QW, y2: QY + QH / 3, len: QW},
	{type: 'line', x1: QX, y1: QY + (QH * 2) / 3, x2: QX + QW, y2: QY + (QH * 2) / 3, len: QW},
	{type: 'line', x1: QX + QW / 3, y1: QY, x2: QX + QW / 3, y2: QY + QH, len: QH},
	{type: 'line', x1: QX + (QW * 2) / 3, y1: QY, x2: QX + (QW * 2) / 3, y2: QY + QH, len: QH},

	// Tail-direction guideline
	{
		type: 'line',
		x1: QX + 380,
		y1: QY + 380,
		x2: QX + QW + 100,
		y2: QY + QH + 100,
		len: Math.hypot(QW + 100 - 380, QH + 100 - 380),
	},
];

const DRAW_WINDOW: [number, number] = [2.05, 4.85];

export const CadLines: React.FC<Props> = ({t}) => {
	const total = PRIMITIVES.length;
	const fadeOut = segment(t, 5.0, 5.6, easeInOutCubic);

	return (
		<AbsoluteFill style={{mixBlendMode: 'screen'}}>
			<svg width="100%" height="100%" viewBox="0 0 1080 1920">
				<g
					stroke={PALETTE.orange}
					strokeWidth={1.5}
					fill="none"
					strokeLinecap="round"
				>
					{PRIMITIVES.map((p, i) => {
						const stagger =
							(i / total) * (DRAW_WINDOW[1] - DRAW_WINDOW[0]) * 0.7;
						const startAt = DRAW_WINDOW[0] + stagger;
						const endAt = startAt + 0.5;
						const drawn = segment(t, startAt, endAt, easeOutCubic);
						const dashOffset = p.len * (1 - drawn);
						const opacity = drawn * (1 - fadeOut) * 0.85;
						const common = {
							strokeDasharray: p.len,
							strokeDashoffset: dashOffset,
							opacity,
						};
						if (p.type === 'line') {
							return (
								<line
									key={i}
									x1={p.x1}
									y1={p.y1}
									x2={p.x2}
									y2={p.y2}
									style={common}
								/>
							);
						}
						return <path key={i} d={p.d} style={common} />;
					})}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
