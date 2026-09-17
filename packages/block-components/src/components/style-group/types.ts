/**
 * Internal dependencies
 */
import type { StyleObject } from '../../types';

/** Whether a control renders; `'default'` also shows it before it has a value. */
export type Control = boolean | 'default';

export interface GroupControls {
	color?: Partial< Record< 'text' | 'background', Control > >;
	typography?: Partial<
		Record<
			| 'fontSize'
			| 'fontAppearance'
			| 'lineHeight'
			| 'letterSpacing'
			| 'textTransform'
			| 'textDecoration',
			Control
		>
	>;
	spacing?: Partial< Record< 'padding' | 'margin', Control > >;
	border?: Partial<
		Record< 'color' | 'style' | 'width' | 'radius', Control >
	>;
	/** The block's own values, each one custom property. */
	values?: Record< string, ValueControl >;
}

export interface GroupProps< Name extends keyof GroupControls > {
	/** Style object read from the current state, never the whole attribute. */
	value: StyleObject;
	/** Receives the style object for the current state, already merged. */
	onChange: ( next: StyleObject ) => void;
	controls: NonNullable< GroupControls[ Name ] >;
	/** ToolsPanel this group's items belong to. */
	panelId: string;
}

export interface ValueControl {
	label: string;
	control: 'range' | 'unit' | 'color';
	min?: number;
	max?: number;
	step?: number;
	/** Units offered by a `unit` control; defaults to the theme's spacing units. */
	units?: string[];
	help?: string;
	isShownByDefault?: boolean;
}

export interface ValuesProps {
	/** The block's own values at the default state, keyed by value name. */
	values: StyleObject;
	onChange: ( next: StyleObject ) => void;
	controls: Record< string, ValueControl >;
	panelId: string;
}

export interface ColorValuesProps {
	/** The block's own colours at the selected state, keyed by value name. */
	values: StyleObject;
	onChange: ( next: StyleObject ) => void;
	controls: Record< string, ValueControl >;
	panelId: string;
}
