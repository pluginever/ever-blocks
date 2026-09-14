/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { BorderBoxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	BorderRadiusControl,
	useMultipleOriginColorsAndGradients,
} from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

type Border = Record< string, unknown >;

export function BorderGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps< 'border' > ) {
	const { colors } = useMultipleOriginColorsAndGradients();
	const [ customColors ] = useSettings( 'color.custom' );
	const border = ( value.border ?? {} ) as Border;
	const { radius, ...box } = border;
	const showBox = controls.color || controls.style || controls.width;
	const hasBox = Object.values( box ).some( ( item ) => undefined !== item );

	const setBox = ( next?: Border ) =>
		onChange( {
			...value,
			border: { ...( next ?? {} ), radius },
		} );

	return (
		<>
			{ showBox && (
				<Item
					isShownByDefault={ [
						controls.color,
						controls.style,
						controls.width,
					].includes( 'default' ) }
					label={ __( 'Border', 'ever-blocks' ) }
					panelId={ panelId }
					value={ hasBox || undefined }
					onReset={ () => setBox() }
				>
					<BorderBoxControl
						label={ __( 'Border', 'ever-blocks' ) }
						colors={ colors }
						disableCustomColors={ ! customColors }
						enableAlpha
						enableStyle={ false !== controls.style }
						value={ hasBox ? ( box as never ) : undefined }
						onChange={ ( next ) => setBox( next as Border ) }
					/>
				</Item>
			) }

			{ controls.radius && (
				<Item
					isShownByDefault={ 'default' === controls.radius }
					label={ __( 'Radius', 'ever-blocks' ) }
					panelId={ panelId }
					value={ radius }
					onReset={ () =>
						onChange( { ...value, border: { ...box } } )
					}
				>
					<BorderRadiusControl
						values={ radius }
						onChange={ ( next: unknown ) =>
							onChange( {
								...value,
								border: { ...box, radius: next },
							} )
						}
					/>
				</Item>
			) }
		</>
	);
}
