/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { UnitControl, useCustomUnits } from '../../../experimental';
import { ColorItem } from '../color-item';
import { Item } from '../item';
import type { ValueControl, ValuesProps } from '../types';

const DEFAULT_UNITS = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ];

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
					isShownByDefault={ control.isShownByDefault ?? true }
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
								control.isShownByDefault ?? true
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
	if ( 'range' === control.control ) {
		return (
			<RangeControl
				label={ control.label }
				help={ control.help }
				allowReset
				min={ control.min }
				max={ control.max }
				step={ control.step }
				value={ value as number | undefined }
				onChange={ onChange }
			/>
		);
	}

	return (
		<UnitControl
			label={ control.label }
			help={ control.help }
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
}
