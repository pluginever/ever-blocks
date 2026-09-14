/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ColorGradientSettingsDropdown,
	useMultipleOriginColorsAndGradients,
} from '../../../experimental';
import type { GroupProps } from '../types';

/**
 * Text, background and gradient for one element.
 *
 * Colour uses core's own dropdown rather than a ToolsPanelItem per colour, so
 * the swatches sit where they do on a core block.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function ColorGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const settings = useMultipleOriginColorsAndGradients();
	const color = ( value.color ?? {} ) as Record< string, unknown >;

	const set = ( next: Record< string, unknown > ) =>
		onChange( { ...value, color: { ...color, ...next } } );

	const items = [];

	if ( controls.text ) {
		items.push( {
			label: __( 'Text', 'ever-blocks' ),
			isShownByDefault: 'default' === controls.text,
			colorValue: color.text,
			onColorChange: ( next: unknown ) => set( { text: next } ),
			resetAllFilter: () => set( { text: undefined } ),
			enableAlpha: true,
			clearable: true,
		} );
	}

	if ( controls.background ) {
		items.push( {
			label: __( 'Background', 'ever-blocks' ),
			isShownByDefault: 'default' === controls.background,
			colorValue: color.background,
			gradientValue: controls.gradient ? color.gradient : undefined,
			onColorChange: ( next: unknown ) =>
				set( { background: next, gradient: undefined } ),
			onGradientChange: controls.gradient
				? ( next: unknown ) =>
						set( { gradient: next, background: undefined } )
				: undefined,
			resetAllFilter: () =>
				set( { background: undefined, gradient: undefined } ),
			enableAlpha: true,
			clearable: true,
		} );
	}

	if ( ! items.length ) {
		return null;
	}

	return (
		<div className="b8-style-group__colors">
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				panelId={ panelId }
				settings={ items }
				{ ...settings }
			/>
		</div>
	);
}
