import { Circle, Rect, SVG } from '@wordpress/components';

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

export const stacked = frame(
	<>
		<Rect x="6" y="8" width="36" height="5" rx="1.5" fill="currentColor" />
		<Rect x="6" y="16" width="28" height="5" rx="1.5" fill="currentColor" />
		<Circle cx="11" cy="34" r="5" fill="currentColor" opacity="0.4" />
		<Rect
			x="20"
			y="30"
			width="16"
			height="3"
			rx="1"
			fill="currentColor"
			opacity="0.7"
		/>
		<Rect
			x="20"
			y="35"
			width="12"
			height="3"
			rx="1"
			fill="currentColor"
			opacity="0.35"
		/>
	</>
);

export const side = frame(
	<>
		<Circle cx="12" cy="16" r="7" fill="currentColor" opacity="0.4" />
		<Rect x="24" y="8" width="18" height="5" rx="1.5" fill="currentColor" />
		<Rect
			x="24"
			y="16"
			width="14"
			height="5"
			rx="1.5"
			fill="currentColor"
		/>
		<Rect
			x="24"
			y="28"
			width="12"
			height="3"
			rx="1"
			fill="currentColor"
			opacity="0.7"
		/>
		<Rect
			x="24"
			y="33"
			width="10"
			height="3"
			rx="1"
			fill="currentColor"
			opacity="0.35"
		/>
	</>
);

export const centered = frame(
	<>
		<Rect x="8" y="8" width="32" height="5" rx="1.5" fill="currentColor" />
		<Rect
			x="14"
			y="16"
			width="20"
			height="5"
			rx="1.5"
			fill="currentColor"
		/>
		<Circle cx="24" cy="30" r="5" fill="currentColor" opacity="0.4" />
		<Rect
			x="17"
			y="38"
			width="14"
			height="3"
			rx="1"
			fill="currentColor"
			opacity="0.7"
		/>
	</>
);
