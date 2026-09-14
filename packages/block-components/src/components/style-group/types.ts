/**
 * Internal dependencies
 */
import type { StyleObject } from '../../types';

export interface GroupProps {
	/** Style object read from the current state, never the whole attribute. */
	value: StyleObject;
	/** Receives the style object for the current state, already merged. */
	onChange: ( next: StyleObject ) => void;
	/** Which controls to render. Keys are group specific. */
	controls: Record< string, boolean >;
	/** ToolsPanel this group's items belong to. */
	panelId: string;
}

interface ValueOption {
	label: string;
	value: string;
}

export interface ValueControl {
	label: string;
	control:
		| 'range'
		| 'unit'
		| 'number'
		| 'select'
		| 'toggle'
		| 'color'
		| 'text';
	min?: number;
	max?: number;
	step?: number;
	/** Units offered by a `unit` control; defaults to the theme's spacing units. */
	units?: string[];
	options?: ValueOption[];
	help?: string;
	isShownByDefault?: boolean;
}

export interface ValuesProps {
	/** The block's own values at the current state, keyed by value name. */
	values: StyleObject;
	onChange: ( next: StyleObject ) => void;
	controls: Record< string, ValueControl >;
	panelId: string;
}
