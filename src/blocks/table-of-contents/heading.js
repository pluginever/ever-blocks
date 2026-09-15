import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import { ToolsPanel, ToolsPanelItem } from '@byteever/block-components';
import { __ } from '@wordpress/i18n';

export const EXCLUDED = 'everBlocksTocExcluded';

function addAttribute( settings, name ) {
	if ( 'core/heading' !== name ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			[ EXCLUDED ]: { type: 'boolean', default: false },
		},
	};
}

const withControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( 'core/heading' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;
		const excluded = Boolean( attributes[ EXCLUDED ] );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Table of contents', 'ever-blocks' ) }
						panelId={ clientId }
						resetAll={ () =>
							setAttributes( { [ EXCLUDED ]: undefined } )
						}
					>
						<ToolsPanelItem
							hasValue={ () => excluded }
							label={ __( 'Listed', 'ever-blocks' ) }
							panelId={ clientId }
							isShownByDefault
							onDeselect={ () =>
								setAttributes( { [ EXCLUDED ]: undefined } )
							}
						>
							<ToggleControl
								label={ __(
									'Include in table of contents',
									'ever-blocks'
								) }
								checked={ ! excluded }
								onChange={ ( next ) =>
									setAttributes( {
										[ EXCLUDED ]: next ? undefined : true,
									} )
								}
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	},
	'withEverBlocksTocExcluded'
);

addFilter(
	'blocks.registerBlockType',
	'ever-blocks/table-of-contents/heading-attribute',
	addAttribute
);
addFilter(
	'editor.BlockEdit',
	'ever-blocks/table-of-contents/heading-control',
	withControl
);
