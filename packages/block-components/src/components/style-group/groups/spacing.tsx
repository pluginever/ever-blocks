/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SpacingSizesControl } from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

const SIDES = [ 'top', 'right', 'bottom', 'left' ];

/**
 * Padding, margin and block gap for one element.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function SpacingGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ units ] = useSettings( 'spacing.units' );
	const spacing = ( value.spacing ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next: unknown ) =>
		onChange( { ...value, spacing: { ...spacing, [ key ]: next } } );

	return (
		<>
			{ controls.padding && (
				<Item
					label={ __( 'Padding', 'ever-blocks' ) }
					panelId={ panelId }
					value={ spacing.padding }
					onReset={ () => set( 'padding', undefined ) }
					isShownByDefault
				>
					<SpacingSizesControl
						label={ __( 'Padding', 'ever-blocks' ) }
						values={ spacing.padding }
						sides={ SIDES }
						units={ units }
						allowReset={ false }
						splitOnAxis
						onChange={ ( next: unknown ) => set( 'padding', next ) }
					/>
				</Item>
			) }

			{ controls.margin && (
				<Item
					label={ __( 'Margin', 'ever-blocks' ) }
					panelId={ panelId }
					value={ spacing.margin }
					onReset={ () => set( 'margin', undefined ) }
				>
					<SpacingSizesControl
						label={ __( 'Margin', 'ever-blocks' ) }
						values={ spacing.margin }
						sides={ SIDES }
						units={ units }
						allowReset={ false }
						splitOnAxis
						onChange={ ( next: unknown ) => set( 'margin', next ) }
					/>
				</Item>
			) }

			{ controls.blockGap && (
				<Item
					label={ __( 'Block spacing', 'ever-blocks' ) }
					panelId={ panelId }
					value={ spacing.blockGap }
					onReset={ () => set( 'blockGap', undefined ) }
					isShownByDefault
				>
					<SpacingSizesControl
						label={ __( 'Block spacing', 'ever-blocks' ) }
						values={ { top: spacing.blockGap } }
						sides={ [ 'top' ] }
						units={ units }
						allowReset={ false }
						showSideInLabel={ false }
						onChange={ ( next: Record< string, unknown > ) =>
							set( 'blockGap', next?.top )
						}
					/>
				</Item>
			) }
		</>
	);
}
