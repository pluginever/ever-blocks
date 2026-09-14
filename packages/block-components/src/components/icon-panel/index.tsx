/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ToolsPanel } from '../../experimental';
import { IconSettingControl } from '../icon-settings';
import { getIconColorValues, IconColorControl } from '../icon-settings/color';
import type { IconColorSetting } from '../icon-settings/color';
import type { IconSetting } from '../icon-settings/types';
import { useStyleValues } from '../../hooks/use-style-values';
import type { StyleObject } from '../../types';

export interface IconPanelSetting extends IconSetting {
	/** Colours for the icon and behind it. */
	color?: IconColorSetting;
}

interface Props {
	/** Attribute holding the icon name. */
	name: string;
	setting: IconPanelSetting;
	attributes: Record< string, unknown > & { style?: StyleObject };
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** Defaults to the block's own client id, which is what a `ToolsPanel` needs. */
	panelId?: string;
}

/**
 * Renders every control for one icon, from one declaration.
 *
 * The controls land in the tab WordPress puts that kind of control in — the icon
 * itself, its size and its transform are content, its colours are not — so the
 * block declares the icon once and does not decide where each control belongs.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.name
 * @param props.setting
 * @param props.attributes
 * @param props.setAttributes
 * @param props.panelId
 * @return The panels.
 */
export function IconPanel( {
	name,
	setting,
	attributes,
	setAttributes,
	panelId,
}: Props ) {
	const { clientId } = useBlockEditContext();
	const { values, setValue, resetValues } = useStyleValues(
		attributes,
		setAttributes
	);
	const id = `${ panelId ?? clientId }-${ name }`;
	const { label, color, ...icon } = setting;

	const attributeKeys = [
		name,
		'string' === typeof icon.size ? icon.size : 'iconSize',
		'string' === typeof icon.ariaLabel ? icon.ariaLabel : 'iconLabel',
		'string' === typeof icon.rotation ? icon.rotation : 'rotation',
		'string' === typeof icon.flipHorizontal
			? icon.flipHorizontal
			: 'flipHorizontal',
		'string' === typeof icon.flipVertical
			? icon.flipVertical
			: 'flipVertical',
		...Object.keys( icon.extras ?? {} ),
	];

	const colorValues = Object.values( getIconColorValues( name ) );

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ label }
					panelId={ id }
					resetAll={ () =>
						setAttributes(
							Object.fromEntries(
								attributeKeys.map( ( key ) => [
									key,
									undefined,
								] )
							)
						)
					}
				>
					<IconSettingControl
						name={ name }
						setting={ { label, ...icon } }
						panelId={ id }
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				</ToolsPanel>
			</InspectorControls>

			{ color && (
				<InspectorControls group="styles">
					{ /* Core's own colour panel markup, so its stylesheet collapses the
					     row gap and the borders between swatches. */ }
					<ToolsPanel
						label={ label }
						panelId={ `${ id }-color` }
						resetAll={ () => resetValues( colorValues ) }
						hasInnerWrapper
						className="color-block-support-panel"
						__experimentalFirstVisibleItemClass="first"
						__experimentalLastVisibleItemClass="last"
					>
						<div className="color-block-support-panel__inner-wrapper">
							<IconColorControl
								name={ name }
								label={ label }
								setting={ color }
								panelId={ `${ id }-color` }
								values={ values }
								setValue={ setValue }
							/>
						</div>
					</ToolsPanel>
				</InspectorControls>
			) }
		</>
	);
}
