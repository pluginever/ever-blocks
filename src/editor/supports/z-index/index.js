import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl } from '@wordpress/components';
import { ToolsPanel, ToolsPanelItem } from '@byteever/block-components';
import { __ } from '@wordpress/i18n';

const NAME = 'z-index';
const ATTRIBUTE = 'everBlocksZIndex';

const isEnabled = () => Boolean( window.everBlocksSupports?.[ NAME ] );

// `blocks.registerBlockType` runs before the block is in the store, so the
// settings object is checked rather than the name.
const supports = ( settings ) =>
	hasBlockSupport( settings, 'customClassName', true );

function addAttribute( settings ) {
	if ( ! supports( settings ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			[ ATTRIBUTE ]: { type: 'number' },
		},
	};
}

const withControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( ! supports( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId, isSelected } = props;
		const value = attributes[ ATTRIBUTE ];

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected && (
					<InspectorControls group="advanced">
						<ToolsPanel
							label={ __( 'Stacking order', 'ever-blocks' ) }
							panelId={ clientId }
							resetAll={ () =>
								setAttributes( { [ ATTRIBUTE ]: undefined } )
							}
						>
							<ToolsPanelItem
								hasValue={ () => undefined !== value }
								label={ __( 'Z-index', 'ever-blocks' ) }
								panelId={ clientId }
								onDeselect={ () =>
									setAttributes( {
										[ ATTRIBUTE ]: undefined,
									} )
								}
							>
								<RangeControl
									label={ __( 'Z-index', 'ever-blocks' ) }
									min={ -10 }
									max={ 100 }
									allowReset
									value={ value }
									onChange={ ( next ) =>
										setAttributes( { [ ATTRIBUTE ]: next } )
									}
									help={ __(
										'Applies on the front end, not while editing.',
										'ever-blocks'
									) }
								/>
							</ToolsPanelItem>
						</ToolsPanel>
					</InspectorControls>
				) }
			</>
		);
	},
	'withEverBlocksZIndex'
);

if ( isEnabled() ) {
	addFilter(
		'blocks.registerBlockType',
		'ever-blocks/z-index/attribute',
		addAttribute
	);
	addFilter( 'editor.BlockEdit', 'ever-blocks/z-index/control', withControl );
}
