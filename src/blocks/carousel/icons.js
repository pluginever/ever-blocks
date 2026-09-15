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

export const slider = frame(
	<>
		<Rect
			x="2"
			y="12"
			width="9"
			height="20"
			rx="1.5"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect x="14" y="10" width="20" height="24" rx="2" fill="currentColor" />
		<Rect
			x="37"
			y="12"
			width="9"
			height="20"
			rx="1.5"
			fill="currentColor"
			opacity="0.35"
		/>
		<circle cx="20" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
		<circle cx="24" cy="40" r="1.5" fill="currentColor" />
		<circle cx="28" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
	</>
);

export const scrollRow = frame(
	<>
		<Rect
			x="1"
			y="14"
			width="12"
			height="20"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect x="16" y="14" width="16" height="20" rx="2" fill="currentColor" />
		<Rect
			x="35"
			y="14"
			width="12"
			height="20"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Path
			d="M18 42h12m-4-3 4 3-4 3"
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</>
);

export const scrollColumns = frame(
	<>
		<Rect
			x="4"
			y="2"
			width="11"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect x="4" y="19" width="11" height="14" rx="2" fill="currentColor" />
		<Rect
			x="4"
			y="36"
			width="11"
			height="10"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect
			x="18.5"
			y="8"
			width="11"
			height="14"
			rx="2"
			fill="currentColor"
		/>
		<Rect
			x="18.5"
			y="25"
			width="11"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect
			x="33"
			y="2"
			width="11"
			height="14"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Rect x="33" y="19" width="11" height="14" rx="2" fill="currentColor" />
		<Rect
			x="33"
			y="36"
			width="11"
			height="10"
			rx="2"
			fill="currentColor"
			opacity="0.35"
		/>
		<Path
			d="M9.5 41v-6m-3 3 3-3 3 3M24 36v6m-3-3 3 3 3-3"
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity="0.9"
		/>
	</>
);
