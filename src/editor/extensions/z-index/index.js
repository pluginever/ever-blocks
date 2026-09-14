import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { RangeControl } from '@wordpress/components';
import { ToolsPanel, ToolsPanelItem } from '@byteever/block-components';
import { __ } from '@wordpress/i18n';

const NAME = 'z-index';
const ATTRIBUTE = 'everBlocksZIndex';
const EXCLUDE = [];

// The server gates this extension by the same option, so a disabled extension
// loses its panel as well as its output.
const isEnabled = () => Boolean( window.everBlocksExtensions?.[ NAME ] );

// Scope rides core's own capability rather than a list kept in step by hand.
const supports = ( name ) =>
	! EXCLUDE.includes( name ) &&
	hasBlockSupport( name, 'customClassName', true );

function addAttribute( settings, name ) {
	if ( ! supports( name ) ) {
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
									__nextHasNoMarginBottom
									__next40pxDefaultSize
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
