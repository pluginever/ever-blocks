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
import { LinkSettingControl, TagSettingControl } from '../settings-group';
import { SettingControl } from '../settings-group/control';
import type { ControlSetting } from '../settings-group/control';
import type { LinkSetting, TagSetting } from '../settings-group';

interface Props {
	/** Defaults to the block's own client id, which is what a `ToolsPanel` needs. */
	panelId?: string;
	attributes: Record< string, unknown >;
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** Panel label. */
	label?: string;
	/** Link settings, keyed by the attribute holding the URL. */
	links?: Record< string, LinkSetting >;
	/** Tag choosers, keyed by the attribute each writes to. */
	tags?: Record< string, TagSetting >;
	/** Settings, keyed by the attribute each writes to. */
	controls?: Record< string, ControlSetting >;
}

/**
 * Renders a block's settings panel from a single declaration.
 *
 * The counterpart to `StylePanels`: those write into core's `style` attribute,
 * these write into attributes of the block's own, because a link target or an
 * HTML tag is content rather than presentation.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.panelId
 * @param props.attributes
 * @param props.setAttributes
 * @param props.label
 * @param props.links
 * @param props.tags
 * @param props.controls
 * @return The panel.
 */
export function SettingsPanels( {
	panelId,
	attributes,
	setAttributes,
	label = '',
	links = {},
	tags = {},
	controls = {},
}: Props ) {
	const { clientId } = useBlockEditContext();
	const id = `${ panelId ?? clientId }-settings`;
	const names = [
		...Object.keys( links ),
		...Object.keys( tags ),
		...Object.keys( controls ),
	];

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
				{ Object.entries( links ).map( ( [ name, setting ] ) => (
					<LinkSettingControl
						key={ name }
						name={ name }
						setting={ setting }
						{ ...shared }
					/>
				) ) }

				{ Object.entries( tags ).map( ( [ name, setting ] ) => (
					<TagSettingControl
						key={ name }
						name={ name }
						setting={ setting }
						{ ...shared }
					/>
				) ) }

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
