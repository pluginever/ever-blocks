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

export const still = frame(
	<>
		<Rect
			x="2"
			y="17"
			width="44"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.15"
		/>
		<Rect
			x="10"
			y="22"
			width="22"
			height="4"
			rx="1.5"
			fill="currentColor"
		/>
		<Path
			d="M38 21l4 4m0-4-4 4"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</>
);

export const ticker = frame(
	<>
		<Rect
			x="2"
			y="17"
			width="44"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.15"
		/>
		<Rect
			x="0"
			y="22"
			width="12"
			height="4"
			rx="1.5"
			fill="currentColor"
			opacity="0.4"
		/>
		<Rect
			x="16"
			y="22"
			width="16"
			height="4"
			rx="1.5"
			fill="currentColor"
		/>
		<Rect
			x="36"
			y="22"
			width="12"
			height="4"
			rx="1.5"
			fill="currentColor"
			opacity="0.4"
		/>
		<Path
			d="M18 38h12m-4-3 4 3-4 3"
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</>
);

export const rotate = frame(
	<>
		<Rect
			x="2"
			y="17"
			width="44"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.15"
		/>
		<Rect
			x="13"
			y="22"
			width="22"
			height="4"
			rx="1.5"
			fill="currentColor"
		/>
		<Rect
			x="16"
			y="9"
			width="16"
			height="4"
			rx="1.5"
			fill="currentColor"
			opacity="0.3"
		/>
		<Rect
			x="16"
			y="35"
			width="16"
			height="4"
			rx="1.5"
			fill="currentColor"
			opacity="0.3"
		/>
		<Path
			d="M42 11v6m-3-3 3-3 3 3"
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</>
);
