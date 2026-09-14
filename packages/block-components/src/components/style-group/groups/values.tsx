/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
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
	UnitControl,
	useCustomUnits,
} from '../../../experimental';
import { ColorItem } from '../color-item';
import { Item } from '../item';
import type { ValueControl, ValuesProps } from '../types';

const DEFAULT_UNITS = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ];

/**
 * A block's own values for one element, from a declaration.
 *
 * Each value is written to one key under the block's namespace in `style` and
 * reaches the page as one custom property. Colours follow the part's selected
 * state; everything else is written at the default state.
 *
 * @since 0.1.0
 * @param props                Component props.
 * @param props.values         Values at the default state.
 * @param props.onChange       Receives the merged values.
 * @param props.colors         Colours at the selected state.
 * @param props.onColorsChange Receives the merged colours.
 * @param props.controls       Control declarations keyed by value name.
 * @param props.panelId        ToolsPanel the items belong to.
 * @return The controls.
 */
export function ValuesGroup( {
	values,
	onChange,
	colors: colorValues,
	onColorsChange,
	controls,
	panelId,
}: ValuesProps ) {
	const [ available ] = useSettings( 'spacing.units' );
	const units: Units = useCustomUnits( {
		availableUnits: ( available as string[] ) ?? DEFAULT_UNITS,
	} );

	const set = ( key: string, next: unknown ) =>
		onChange( { ...values, [ key ]: next } );

	const entries = Object.entries( controls );
	const colors = entries.filter(
		( [ , control ] ) => 'color' === control.control
	);
	const others = entries.filter(
		( [ , control ] ) => 'color' !== control.control
	);

	return (
		<>
			{ others.map( ( [ key, control ] ) => (
				<Item
					key={ key }
					label={ control.label }
					panelId={ panelId }
					value={ values[ key ] }
					onReset={ () => set( key, undefined ) }
					isShownByDefault={ control.isShownByDefault ?? false }
				>
					{ renderControl(
						control,
						values[ key ],
						( next ) => set( key, next ),
						units
					) }
				</Item>
			) ) }

			{ colors.length > 0 && (
				<div className="b8-style-group__colors">
					{ colors.map( ( [ key, control ] ) => (
						<ColorItem
							key={ key }
							label={ control.label }
							panelId={ panelId }
							value={ colorValues[ key ] as string | undefined }
							onChange={ ( next ) =>
								onColorsChange( {
									...colorValues,
									[ key ]: next,
								} )
							}
							isShownByDefault={
								control.isShownByDefault ?? false
							}
						/>
					) ) }
				</div>
			) }
		</>
	);
}

type Units = Array< { value: string; label: string } >;

function renderControl(
	control: ValueControl,
	value: unknown,
	onChange: ( next: unknown ) => void,
	units: Units
) {
	const common = {
		__nextHasNoMarginBottom: true,
		__next40pxDefaultSize: true,
		label: control.label,
		help: control.help,
	};

	switch ( control.control ) {
		case 'range':
			return (
				<RangeControl
					{ ...common }
					allowReset
					min={ control.min }
					max={ control.max }
					step={ control.step }
					value={ value as number | undefined }
					onChange={ onChange }
				/>
			);
		case 'unit':
			return (
				<UnitControl
					{ ...common }
					units={
						control.units
							? control.units.map( ( unit ) => ( {
									value: unit,
									label: unit,
							  } ) )
							: units
					}
					min={ control.min }
					max={ control.max }
					step={ control.step }
					value={ value as string | undefined }
					onChange={ onChange }
				/>
			);
		case 'number':
			return (
				<NumberControl
					{ ...common }
					min={ control.min }
					max={ control.max }
					step={ control.step }
					value={ value as number | string | undefined }
					onChange={ onChange }
				/>
			);
		case 'select':
			return (
				<SelectControl
					{ ...common }
					options={ control.options ?? [] }
					value={ value as string | undefined }
					onChange={ onChange }
				/>
			);
		case 'toggle':
			return (
				<ToggleControl
					__nextHasNoMarginBottom
					label={ control.label }
					help={ control.help }
					checked={ Boolean( value ) }
					onChange={ ( next: boolean ) =>
						onChange( next ? '1' : undefined )
					}
				/>
			);
		default:
			return (
				<TextControl
					{ ...common }
					value={ ( value as string | undefined ) ?? '' }
					onChange={ ( next: string ) =>
						onChange( next || undefined )
					}
				/>
			);
	}
}
