/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorItem } from '../color-item';
import type { GroupProps } from '../types';

export function ColorGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps< 'color' > ) {
	const color = ( value.color ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next?: string ) =>
		onChange( { ...value, color: { ...color, [ key ]: next } } );

	return (
		<div className="b8-style-group__colors">
			{ controls.text && (
				<ColorItem
					label={ __( 'Text', 'ever-blocks' ) }
					panelId={ panelId }
					value={ color.text as string | undefined }
					onChange={ ( next ) => set( 'text', next ) }
					isShownByDefault={ 'default' === controls.text }
				/>
			) }
			{ controls.background && (
				<ColorItem
					label={ __( 'Background', 'ever-blocks' ) }
					panelId={ panelId }
					value={ color.background as string | undefined }
					onChange={ ( next ) => set( 'background', next ) }
					isShownByDefault={ 'default' === controls.background }
				/>
			) }
		</div>
	);
}
