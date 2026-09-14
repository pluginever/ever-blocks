/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { UnitControl, useCustomUnits } from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

const KEYS: Record< string, string > = {
	width: __( 'Width', 'ever-blocks' ),
	height: __( 'Height', 'ever-blocks' ),
	minHeight: __( 'Minimum height', 'ever-blocks' ),
};

/**
 * Width and height for one element.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function SizeGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ available ] = useSettings( 'spacing.units' );
	const units = useCustomUnits( {
		availableUnits: ( available as string[] ) ?? [
			'px',
			'%',
			'em',
			'rem',
			'vw',
			'vh',
		],
	} );
	const dimensions = ( value.dimensions ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next: unknown ) =>
		onChange( { ...value, dimensions: { ...dimensions, [ key ]: next } } );

	return (
		<>
			{ Object.entries( KEYS ).map( ( [ key, label ] ) =>
				controls[ key ] ? (
					<Item
						key={ key }
						label={ label }
						panelId={ panelId }
						value={ dimensions[ key ] }
						onReset={ () => set( key, undefined ) }
					>
						<UnitControl
							__next40pxDefaultSize
							label={ label }
							units={ units }
							min={ 0 }
							value={ dimensions[ key ] as string | undefined }
							onChange={ ( next: string | undefined ) =>
								set( key, next )
							}
						/>
					</Item>
				) : null
			) }
		</>
	);
}
