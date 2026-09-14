/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { BorderBoxControl as BaseBorderBoxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BorderRadiusControl } from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

const BorderBoxControl = BaseBorderBoxControl as unknown as React.ComponentType<
	Record< string, unknown >
>;

/**
 * Border and radius for one element.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function BorderGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ colors, customColors ] = useSettings(
		'color.palette.theme',
		'color.custom'
	);
	const border = ( value.border ?? {} ) as Record< string, unknown >;

	const set = ( next: Record< string, unknown > ) =>
		onChange( { ...value, border: { ...border, ...next } } );

	const box = {
		color: border.color,
		style: border.style,
		width: border.width,
		top: border.top,
		right: border.right,
		bottom: border.bottom,
		left: border.left,
	};

	const hasBorder = Object.values( box ).some(
		( item ) => undefined !== item
	);

	return (
		<>
			{ controls.border && (
				<Item
					label={ __( 'Border', 'ever-blocks' ) }
					panelId={ panelId }
					value={ hasBorder || undefined }
					onReset={ () =>
						set( {
							color: undefined,
							style: undefined,
							width: undefined,
							top: undefined,
							right: undefined,
							bottom: undefined,
							left: undefined,
						} )
					}
				>
					<BorderBoxControl
						__next40pxDefaultSize
						label={ __( 'Border', 'ever-blocks' ) }
						colors={ ( colors as [] ) ?? [] }
						disableCustomColors={ ! customColors }
						enableAlpha
						enableStyle
						value={ box }
						onChange={ ( next: Record< string, unknown > ) =>
							set( next ?? {} )
						}
					/>
				</Item>
			) }

			{ controls.radius && (
				<Item
					label={ __( 'Radius', 'ever-blocks' ) }
					panelId={ panelId }
					value={ border.radius }
					onReset={ () => set( { radius: undefined } ) }
				>
					<BorderRadiusControl
						values={ border.radius }
						onChange={ ( next: unknown ) =>
							set( { radius: next } )
						}
					/>
				</Item>
			) }
		</>
	);
}
