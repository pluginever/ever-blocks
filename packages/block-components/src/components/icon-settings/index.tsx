/**
 * WordPress dependencies
 */
import { Button, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	flipHorizontal as flipH,
	flipVertical as flipV,
	rotateRight,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ToolsPanelItem } from '../../experimental';
import { IconPickerControl } from '../icon-picker/control';
import { SettingControl } from '../settings-group/control';
import type { ControlSetting } from '../settings-group/control';
import { nextRotation } from './transform';
import type { IconControlSetting, IconSetting } from './types';

interface Props {
	name: string;
	setting: IconSetting;
	panelId: string;
	attributes: Record< string, unknown >;
	setAttributes: ( next: Record< string, unknown > ) => void;
}

/**
 * Resolves a transform declaration to the attribute it writes to.
 *
 * @since 0.1.0
 * @param setting  Declared value.
 * @param fallback Attribute `core/icon` uses.
 * @return Attribute name, or an empty string when the control is off.
 */
function attribute(
	setting: IconControlSetting | undefined,
	fallback: string
): string {
	if ( false === setting ) {
		return '';
	}

	return 'string' === typeof setting ? setting : fallback;
}

/**
 * Renders an icon's picker, whichever transforms are declared, and any extras.
 *
 * Transform attribute names default to the ones `core/icon` uses, so a block
 * carrying one icon needs no mapping, a block carrying two can rename them, and
 * a block that wants none can switch each off.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.name
 * @param props.setting
 * @param props.panelId
 * @param props.attributes
 * @param props.setAttributes
 * @return The controls.
 */
export function IconSettingControl( {
	name,
	setting,
	panelId,
	attributes,
	setAttributes,
}: Props ) {
	const { label, extras = {} } = setting;
	const size = attribute( setting.size, 'iconSize' );
	const ariaLabel = attribute( setting.ariaLabel, 'iconLabel' );
	const rotation = attribute( setting.rotation, 'rotation' );
	const flips = (
		[
			[
				attribute( setting.flipHorizontal, 'flipHorizontal' ),
				__( 'Flip horizontal', 'ever-blocks' ),
				flipH,
			],
			[
				attribute( setting.flipVertical, 'flipVertical' ),
				__( 'Flip vertical', 'ever-blocks' ),
				flipV,
			],
		] as const
	 ).filter( ( [ key ] ) => '' !== key );

	const transforms = [ rotation, ...flips.map( ( [ key ] ) => key ) ].filter(
		Boolean
	);
	const degrees = Number( attributes[ rotation ] ) || 0;

	const built: Record< string, ControlSetting > = { ...extras };

	if ( '' !== size ) {
		built[ size ] = {
			type: 'unit',
			label: __( 'Size', 'ever-blocks' ),
			isShownByDefault: true,
		};
	}

	if ( '' !== ariaLabel ) {
		built[ ariaLabel ] = {
			type: 'text',
			label: __( 'Accessible label', 'ever-blocks' ),
			help: __( 'Leave empty for a decorative icon.', 'ever-blocks' ),
		};
	}

	return (
		<>
			<IconPickerControl
				label={ label }
				value={ attributes[ name ] as string | undefined }
				panelId={ panelId }
				isShownByDefault
				onChange={ ( next ) => setAttributes( { [ name ]: next } ) }
			/>

			{ transforms.length > 0 && (
				<ToolsPanelItem
					hasValue={ () =>
						transforms.some( ( key ) =>
							Boolean( attributes[ key ] )
						)
					}
					label={ __( 'Transform', 'ever-blocks' ) }
					panelId={ panelId }
					onDeselect={ () =>
						setAttributes(
							Object.fromEntries(
								transforms.map( ( key ) => [ key, undefined ] )
							)
						)
					}
					isShownByDefault
				>
					<Flex justify="flex-start" gap={ 2 }>
						{ '' !== rotation && (
							<Button
								size="compact"
								icon={ rotateRight }
								isPressed={ Boolean( degrees ) }
								label={ __( 'Rotate', 'ever-blocks' ) }
								onClick={ () =>
									setAttributes( {
										[ rotation ]:
											nextRotation( degrees ) ||
											undefined,
									} )
								}
							/>
						) }

						{ flips.map( ( [ key, flipLabel, icon ] ) => (
							<Button
								key={ key }
								size="compact"
								icon={ icon }
								isPressed={ Boolean( attributes[ key ] ) }
								label={ flipLabel }
								onClick={ () =>
									setAttributes( {
										[ key ]: attributes[ key ]
											? undefined
											: true,
									} )
								}
							/>
						) ) }
					</Flex>
				</ToolsPanelItem>
			) }

			{ Object.entries( built ).map( ( [ key, control ] ) => (
				<SettingControl
					key={ key }
					name={ key }
					setting={ control }
					panelId={ panelId }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) ) }
		</>
	);
}

export { getIconTransform, nextRotation, ROTATION_STEP } from './transform';
export type { IconTransform } from './transform';
export type { ControlSetting, IconControlSetting, IconSetting } from './types';
