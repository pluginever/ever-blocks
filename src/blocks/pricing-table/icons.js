import { Path, Rect, SVG } from '@wordpress/components';

const frame = ( children ) => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width="48"
		height="48"
		aria-hidden="true"
		focusable="false"
	>
		{ children }
	</SVG>
);

export const card = frame(
	<>
		<Rect
			x="3"
			y="12"
			width="12"
			height="26"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect x="18" y="6" width="12" height="36" rx="2" fill="currentColor" />
		<Rect
			x="33"
			y="12"
			width="12"
			height="26"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
	</>
);

export const divided = frame(
	<>
		<Path
			d="M16.5 8v32M31.5 8v32"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			opacity="0.5"
		/>
		<Path
			d="M5 14h8M5 19h6M5 27h8M5 31h8M20 14h8M20 19h6M20 27h8M20 31h8M35 14h8M35 19h6M35 27h8M35 31h8"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<Path
			d="M5 23h8M20 23h8M35 23h8"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
		/>
	</>
);
