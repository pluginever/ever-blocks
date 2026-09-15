/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SpacingSizesControl } from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

export function SpacingGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps< 'spacing' > ) {
	const spacing = ( value.spacing ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next: unknown ) =>
		onChange( { ...value, spacing: { ...spacing, [ key ]: next } } );

	return (
		<>
			{ controls.padding && (
				<Item
					isShownByDefault={ 'default' === controls.padding }
					label={ __( 'Padding', 'ever-blocks' ) }
					panelId={ panelId }
					value={ spacing.padding }
					onReset={ () => set( 'padding', undefined ) }
				>
					<SpacingSizesControl
						label={ __( 'Padding', 'ever-blocks' ) }
						values={ spacing.padding }
						sides={ SIDES }
						onChange={ ( next: unknown ) => set( 'padding', next ) }
					/>
				</Item>
			) }

			{ controls.margin && (
				<Item
					isShownByDefault={ 'default' === controls.margin }
					label={ __( 'Margin', 'ever-blocks' ) }
					panelId={ panelId }
					value={ spacing.margin }
					onReset={ () => set( 'margin', undefined ) }
				>
					<SpacingSizesControl
						label={ __( 'Margin', 'ever-blocks' ) }
						values={ spacing.margin }
						sides={ SIDES }
						onChange={ ( next: unknown ) => set( 'margin', next ) }
					/>
				</Item>
			) }
		</>
	);
}
