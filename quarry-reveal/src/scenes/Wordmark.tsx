import {AbsoluteFill} from 'remotion';
import {segment, easeOutCubic, easeOutQuart, PALETTE} from '../timing';
import {WORDMARK, ARCHITECTS_TOP, FORMERLY_TOP} from '../layout';

interface Props {
	t: number;
}

// Path indices in quarry-logo.svg:
// 0,1 → Q  |  2 → U  |  3,4 → R (right) and R (left)  |  5 → Y  |  6 → A
const Q_FILL = PALETTE.orange;
const LETTER_FILL = PALETTE.ink;

export const Wordmark: React.FC<Props> = ({t}) => {
	// At t=6.0 the QLogo Q has just landed in this exact spot — fade the
	// brand-mark Q in alongside the rest of the letters so the hand-off is
	// invisible.
	const wordIn = segment(t, 6.0, 6.5, easeOutQuart);
	const archIn = segment(t, 6.5, 6.9, easeOutCubic);
	const formerlyIn = segment(t, 6.9, 7.3, easeOutCubic);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: WORDMARK.left,
					top: WORDMARK.top,
					width: WORDMARK.width,
					height: WORDMARK.height,
				}}
			>
				<svg
					width={WORDMARK.width}
					height={WORDMARK.height}
					viewBox="0 0 89 25"
					xmlns="http://www.w3.org/2000/svg"
				>
					{/* Q — fades in WITH the rest; QLogo is in this exact position so they overlap perfectly */}
					<g opacity={wordIn}>
						<path
							d="M17.964 19.1578L16.2754 21.4852L13.2644 19.2982C12.9688 19.0831 12.6128 18.9671 12.2472 18.9666H4.64459C4.03403 18.9659 3.4487 18.7229 3.01705 18.2911L0.675429 15.9536C0.461129 15.7394 0.291168 15.485 0.175271 15.205C0.0593736 14.9251 -0.000185663 14.625 4.34762e-07 14.322V4.84766H2.8482V13.321C2.84922 13.7789 3.03133 14.2177 3.35477 14.5417L4.42284 15.6098C4.74686 15.9332 5.18568 16.1153 5.64349 16.1163H13.413C13.6566 16.1166 13.8938 16.1942 14.0904 16.3381L17.964 19.1578Z"
							fill={Q_FILL}
						/>
						<path
							d="M17.9638 4.64459V14.1189H15.1156V5.64553C15.1146 5.18771 14.9325 4.74889 14.609 4.42487L13.541 3.3568C13.217 3.03337 12.7781 2.85126 12.3203 2.85023H4.18262V0H13.3192C13.9298 0.000703078 14.5151 0.243617 14.9468 0.675429L17.2925 3.01298C17.506 3.22754 17.6752 3.48206 17.7904 3.76201C17.9056 4.04196 17.9645 4.34187 17.9638 4.64459Z"
							fill={Q_FILL}
						/>
					</g>
					{/* U A R R Y — appear at 6.0s as Q lands */}
					<g opacity={wordIn}>
						{/* U */}
						<path
							d="M20.1243 3.61759C20.9563 3.60334 21.821 3.61759 22.6571 3.61759V9.78189C22.6571 12.6687 22.1872 16.6216 26.2967 16.7152C28.8926 16.7925 30.7724 14.9066 30.8762 12.3331C30.9087 11.4135 30.8762 10.4756 30.8762 9.55404V3.61759C31.7042 3.60131 32.5648 3.61759 33.3948 3.61759V18.9938H30.9372V16.88C28.7665 19.5736 24.3009 19.9316 21.8149 17.5493C19.7967 15.6126 20.1161 12.2781 20.1161 9.7412L20.1243 3.61759Z"
							fill={LETTER_FILL}
						/>
						{/* A */}
						<path
							d="M42.4344 3.33887C42.5849 3.33887 42.7355 3.33887 42.884 3.34904C44.9612 3.45483 46.371 4.26046 47.7341 5.76594C47.7341 3.53824 47.7341 4.24215 47.7341 3.59114H50.1754L50.1388 18.9958H47.6975C47.6975 18.9958 47.7341 15.0002 47.6975 13.155C47.6771 12.1968 47.7178 11.0331 47.5896 10.0891C47.5161 9.51757 47.362 8.95934 47.1319 8.43103C46.0313 5.95514 43.3336 5.10475 40.8598 6.10365C39.6188 6.61022 38.8253 7.71898 38.3676 8.95185C37.4155 12.2517 38.512 16.3633 42.5341 16.6216C44.3101 16.7356 45.2358 16.1741 46.5032 15.0673C46.487 15.9503 46.5032 16.8983 46.5032 17.7874C45.4824 18.5166 44.275 18.94 43.0223 19.008C38.6666 19.2704 35.6821 15.991 35.4828 11.7736C35.2773 7.24903 37.7003 3.59927 42.4344 3.33887Z"
							fill={LETTER_FILL}
						/>
						{/* R (left) */}
						<path
							d="M58.7947 3.58099C59.1894 3.51995 61.1099 3.55861 61.6429 3.56268V6.01619C59.8912 6.01619 57.7937 5.73137 56.4408 7.0924C54.8133 8.74029 55.1103 11.1613 55.1124 13.3137V18.9877H52.5693V3.61557C53.3831 3.60133 54.2091 3.60337 55.029 3.61557V5.57676C56.1479 4.27269 57.1061 3.74578 58.8089 3.57488L58.7947 3.58099Z"
							fill={LETTER_FILL}
						/>
						{/* R (right) */}
						<path
							d="M70.1997 3.58062C70.5557 3.51755 72.5962 3.55824 73.0479 3.56231C73.058 4.37608 73.0479 5.20612 73.0479 6.00362H71.3735C69.9698 6.00362 68.8793 6.05855 67.8174 7.11848C66.2183 8.72568 66.5255 11.1894 66.5255 13.2543V18.9853H63.9784V18.7981C63.9479 16.9936 63.9784 15.1056 63.9784 13.293V3.6152C64.7922 3.60707 65.6059 3.60707 66.4197 3.6152C66.4197 4.24384 66.4197 4.9742 66.4075 5.60284C67.5244 4.30894 68.4623 3.75151 70.1915 3.57858L70.1997 3.58062Z"
							fill={LETTER_FILL}
						/>
						{/* Y */}
						<path
							d="M79.0499 24.3055L80.8809 19.0018L75.1377 3.6154H77.817L82.1259 16.0824L86.3209 3.61133H89.0003L81.5421 24.3055H79.0499Z"
							fill={LETTER_FILL}
						/>
					</g>
				</svg>
			</div>

			{/* ARCHITECTS — orange, monospace, modest letter-spacing */}
			<div
				style={{
					position: 'absolute',
					top: ARCHITECTS_TOP,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: archIn,
					transform: `translateY(${(1 - archIn) * 18}px)`,
				}}
			>
				<span
					style={{
						display: 'inline-block',
						fontFamily: '"JetBrains Mono", "SF Mono", monospace',
						fontWeight: 500,
						fontSize: 22,
						letterSpacing: '0.24em',
						color: PALETTE.orange,
						textTransform: 'uppercase',
						paddingLeft: '0.24em',
					}}
				>
					ARCHITECTS
				</span>
			</div>

			{/* Provenance line */}
			<div
				style={{
					position: 'absolute',
					top: FORMERLY_TOP,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: 'Inter, system-ui, sans-serif',
					fontWeight: 300,
					fontStyle: 'italic',
					fontSize: 18,
					letterSpacing: '0.14em',
					color: PALETTE.inkDim,
					textTransform: 'uppercase',
					opacity: formerlyIn * 0.6,
				}}
			>
				Formerly Lytle Associates
			</div>
		</AbsoluteFill>
	);
};
