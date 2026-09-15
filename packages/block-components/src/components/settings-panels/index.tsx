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
import { SettingControl } from '../settings-group/control';
import type { ControlSetting } from '../settings-group/control';

interface Props {
	attributes: Record< string, unknown >;
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** Panel label. */
	label?: string;
	/** Settings, keyed by the attribute each writes to. */
	controls?: Record< string, ControlSetting >;
}

/**
 * Renders a block's settings panel from a single declaration.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.label         Panel label.
 * @param props.controls      Settings keyed by attribute.
 * @return The panel.
 */
export function SettingsPanels( {
	attributes,
	setAttributes,
	label = '',
	controls = {},
}: Props ) {
	const { clientId } = useBlockEditContext();
	const id = `${ clientId }-settings`;
	const names = Object.keys( controls );

	if ( ! names.length ) {
		return null;
	}

	const shared = { panelId: id, attributes, setAttributes };

	return (
		<InspectorControls group="settings">
			<ToolsPanel
				label={ label || 'Settings' }
				panelId={ id }
				resetAll={ () =>
					setAttributes(
						Object.fromEntries(
							names.map( ( name ) => [ name, undefined ] )
						)
					)
				}
			>
				{ Object.entries( controls ).map( ( [ name, setting ] ) => (
					<SettingControl
						key={ name }
						name={ name }
						setting={ setting }
						{ ...shared }
					/>
				) ) }
			</ToolsPanel>
		</InspectorControls>
	);
}
