/**
 * WordPress dependencies
 */
import { useSettings } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { HStack } from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

interface Preset {
	name: string;
	slug: string;
	shadow: string;
}

/**
 * Box shadow for one element, from the theme's own presets.
 *
 * Core exports no shadow control, so this offers the registered presets rather
 * than an arbitrary shadow builder — a value a theme cannot express is a value
 * that will not survive a theme change.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function ShadowGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ theme, defaults ] = useSettings(
		'shadow.presets.theme',
		'shadow.presets.default'
	);
	const presets = [
		...( ( defaults as Preset[] ) ?? [] ),
		...( ( theme as Preset[] ) ?? [] ),
	];

	if ( ! controls.shadow || ! presets.length ) {
		return null;
	}

	const current = value.shadow as string | undefined;

	return (
		<Item
			isShownByDefault={ 'default' === controls.shadow }
			label={ __( 'Shadow', 'ever-blocks' ) }
			panelId={ panelId }
			value={ current }
			onReset={ () => onChange( { ...value, shadow: undefined } ) }
		>
			<HStack justify="flex-start" wrap>
				{ presets.map( ( preset ) => {
					const token = `var(--wp--preset--shadow--${ preset.slug })`;

					return (
						<Button
							key={ preset.slug }
							size="compact"
							label={ preset.name }
							showTooltip
							isPressed={ current === token }
							onClick={ () =>
								onChange( {
									...value,
									shadow:
										current === token ? undefined : token,
								} )
							}
							className="b8-styles__shadow"
							style={ { boxShadow: preset.shadow } }
						/>
					);
				} ) }
			</HStack>
		</Item>
	);
}
