/**
 * WordPress dependencies
 */
import {
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	NumberControl,
	ToolsPanelItem,
	UnitControl,
	useCustomUnits,
} from '../../experimental';

export type ControlSetting =
	| { type: 'text'; label: string; help?: string; isShownByDefault?: boolean }
	| {
			type: 'toggle';
			label: string;
			help?: string;
			isShownByDefault?: boolean;
	  }
	| {
			type: 'number';
			label: string;
			min?: number;
			max?: number;
			step?: number;
			isShownByDefault?: boolean;
	  }
	| {
			type: 'range';
			label: string;
			min?: number;
			max?: number;
			step?: number;
			isShownByDefault?: boolean;
	  }
	| {
			type: 'unit';
			label: string;
			units?: string[];
			isShownByDefault?: boolean;
	  }
	| {
			type: 'select';
			label: string;
			options: Array< { label: string; value: string } >;
			isShownByDefault?: boolean;
	  };

interface Props {
	name: string;
	setting: ControlSetting;
	panelId: string;
	attributes: Record< string, unknown >;
	setAttributes: ( next: Record< string, unknown > ) => void;
}

/**
 * Renders one declared setting, bound to one attribute.
 *
 * The control types are the ones the field actually uses. A block names the
 * attribute and the kind; everything else — panel wiring, reset, empty handling
 * — is the same for all of them and lives here rather than in each block.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.name
 * @param props.setting
 * @param props.panelId
 * @param props.attributes
 * @param props.setAttributes
 * @return The control.
 */
export function SettingControl( {
	name,
	setting,
	panelId,
	attributes,
	setAttributes,
}: Props ) {
	const value = attributes[ name ];
	const set = ( next: unknown ) => setAttributes( { [ name ]: next } );
	const units = useCustomUnits( {
		availableUnits:
			'unit' === setting.type
				? setting.units ?? [ 'px', 'em', 'rem', '%' ]
				: [],
	} );

	return (
		<ToolsPanelItem
			hasValue={ () => undefined !== value }
			label={ setting.label }
			panelId={ panelId }
			onDeselect={ () => set( undefined ) }
			isShownByDefault={ setting.isShownByDefault ?? false }
		>
			{ 'toggle' === setting.type && (
				<ToggleControl
					__nextHasNoMarginBottom
					label={ setting.label }
					help={ setting.help }
					checked={ Boolean( value ) }
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }

			{ 'text' === setting.type && (
				<TextControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ setting.label }
					help={ setting.help }
					value={ ( value as string ) ?? '' }
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }

			{ 'number' === setting.type && (
				<NumberControl
					__next40pxDefaultSize
					label={ setting.label }
					min={ setting.min }
					max={ setting.max }
					step={ setting.step }
					value={ value as number | undefined }
					onChange={ ( next?: string ) =>
						set(
							undefined === next || '' === next
								? undefined
								: Number( next )
						)
					}
				/>
			) }

			{ 'range' === setting.type && (
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ setting.label }
					min={ setting.min }
					max={ setting.max }
					step={ setting.step }
					value={ value as number | undefined }
					onChange={ ( next ) => set( next ) }
				/>
			) }

			{ 'unit' === setting.type && (
				<UnitControl
					__next40pxDefaultSize
					label={ setting.label }
					units={ units }
					value={ ( value as string ) ?? '' }
					onChange={ ( next?: string ) => set( next || undefined ) }
				/>
			) }

			{ 'select' === setting.type && (
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ setting.label }
					value={ ( value as string ) ?? '' }
					options={ setting.options }
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }
		</ToolsPanelItem>
	);
}
