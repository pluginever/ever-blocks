/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';

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
	/** Further `ToolsPanelItem`s for the same panel; each takes `settingsPanelId( clientId )`. */
	children?: ReactNode;
}

/**
 * Returns the ToolsPanel id a block's settings items belong to.
 *
 * @since 0.1.0
 * @param clientId Block client id.
 * @return Panel id.
 */
export const settingsPanelId = ( clientId: string ): string =>
	`${ clientId }-settings`;

/**
 * Renders a block's settings panel from a single declaration.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.label         Panel label.
 * @param props.controls      Settings keyed by attribute.
 * @param props.children      Further items for the same panel.
 * @return The panel.
 */
export function SettingsPanels( {
	attributes,
	setAttributes,
	label = '',
	controls = {},
	children,
}: Props ) {
	const { clientId, name: blockName } = useBlockEditContext();
	const names = Object.keys( controls );

	if ( ! names.length && ! children ) {
		return null;
	}

	const id = settingsPanelId( clientId );
	const shared = { panelId: id, attributes, setAttributes };
	// The editor never re-applies a block.json default after a write, so
	// reset writes each default back in full rather than undefined.
	const resetAll = (
		filters: Array<
			( next: Record< string, unknown > ) => Record< string, unknown >
		> = []
	) => {
		const schema = getBlockType( blockName )?.attributes ?? {};
		const defaults = Object.fromEntries(
			names.map( ( name ) => [ name, schema[ name ]?.default ] )
		);

		setAttributes(
			filters.reduce(
				( next, filter ) => ( { ...next, ...filter( next ) } ),
				defaults
			)
		);
	};

	return (
		<InspectorControls group="settings">
			<ToolsPanel
				label={ label || 'Settings' }
				panelId={ id }
				resetAll={ resetAll }
			>
				{ Object.entries( controls ).map( ( [ name, setting ] ) => (
					<SettingControl
						key={ name }
						name={ name }
						setting={ setting }
						{ ...shared }
					/>
				) ) }
				{ children }
			</ToolsPanel>
		</InspectorControls>
	);
}
