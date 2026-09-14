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
} from '../../experimental';

export interface IconColorSetting {
	/** Offer a colour for the icon itself. */
	text?: boolean;
	/** Offer a colour behind the icon. */
	background?: boolean;
}

interface Props {
	name: string;
	label: string;
	setting: IconColorSetting;
	panelId: string;
	values: Record< string, unknown >;
	setValue: ( next: Record< string, unknown > ) => void;
}

/**
 * Returns the value names an icon's colours are written to.
 *
 * `core/icon` has no colour of its own and `WP_Theme_JSON::ELEMENTS` is a closed
 * list, so an icon cannot ride core's element styles. These become custom
 * properties instead, which the same declaration already gives responsive
 * values and pseudo-states.
 *
 * @since 0.1.0
 * @param name Attribute holding the icon name.
 * @return The text and background value names.
 */
export function getIconColorValues( name: string ): {
	text: string;
	background: string;
} {
	return { text: `${ name }Color`, background: `${ name }Background` };
}

/**
 * Renders an icon's colour controls.
 *
 * @since 0.1.0
 * @param props          Component props.
 * @param props.name
 * @param props.label
 * @param props.setting
 * @param props.panelId
 * @param props.values
 * @param props.setValue
 * @return The controls, or null when neither is offered.
 */
export function IconColorControl( {
	name,
	label,
	setting,
	panelId,
	values,
	setValue,
}: Props ) {
	const colors = useMultipleOriginColorsAndGradients();
	const keys = getIconColorValues( name );
	const items = [];

	if ( setting.text ) {
		items.push( {
			label: `${ label }: ${ __( 'Text', 'ever-blocks' ) }`,
			colorValue: values[ keys.text ],
			onColorChange: ( next: unknown ) =>
				setValue( { [ keys.text ]: next } ),
			resetAllFilter: () => setValue( { [ keys.text ]: undefined } ),
			enableAlpha: true,
			clearable: true,
		} );
	}

	if ( setting.background ) {
		items.push( {
			label: `${ label }: ${ __( 'Background', 'ever-blocks' ) }`,
			colorValue: values[ keys.background ],
			onColorChange: ( next: unknown ) =>
				setValue( { [ keys.background ]: next } ),
			resetAllFilter: () =>
				setValue( { [ keys.background ]: undefined } ),
			enableAlpha: true,
			clearable: true,
		} );
	}

	if ( ! items.length ) {
		return null;
	}

	return (
		<ColorGradientSettingsDropdown
			__experimentalIsRenderedInSidebar
			panelId={ panelId }
			settings={ items }
			{ ...colors }
		/>
	);
}
