import { addFilter } from '@wordpress/hooks';
import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import { ToolsPanel, ToolsPanelItem } from '@byteever/block-components';
import { __ } from '@wordpress/i18n';
import { help } from '@wordpress/icons';

const BLOCK = 'core/accordion';
const ATTRIBUTE = 'everBlocksSchema';
const CONTEXT = 'ever-blocks/schema';

const item = ( question ) => [
	'core/accordion-item',
	{},
	[
		[ 'core/accordion-heading', { title: question } ],
		[ 'core/accordion-panel', {}, [ [ 'core/paragraph' ] ] ],
	],
];

registerBlockStyle( BLOCK, {
	name: 'divided',
	label: __( 'Divided', 'ever-blocks' ),
} );

registerBlockVariation( BLOCK, {
	name: 'ever-blocks/faq',
	title: __( 'FAQ', 'ever-blocks' ),
	description: __(
		'Questions and answers, with FAQ schema for search engines.',
		'ever-blocks'
	),
	icon: help,
	keywords: [ __( 'faq', 'ever-blocks' ), __( 'questions', 'ever-blocks' ) ],
	category: 'ever-blocks',
	attributes: { [ ATTRIBUTE ]: true, className: 'is-style-divided' },
	innerBlocks: [ item( '' ), item( '' ), item( '' ) ],
	isActive: [ ATTRIBUTE ],
	scope: [ 'inserter', 'transform' ],
} );

function addAttribute( settings, name ) {
	if ( 'core/accordion-heading' === name ) {
		return {
			...settings,
			usesContext: [ ...( settings.usesContext ?? [] ), CONTEXT ],
			supports: {
				...settings.supports,
				typography: {
					...settings.supports?.typography,
					textAlign: true,
				},
			},
		};
	}

	if ( 'core/accordion-panel' === name ) {
		return {
			...settings,
			usesContext: [ ...( settings.usesContext ?? [] ), CONTEXT ],
		};
	}

	if ( BLOCK !== name ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			[ ATTRIBUTE ]: { type: 'boolean', default: false },
		},
		providesContext: {
			...settings.providesContext,
			[ CONTEXT ]: ATTRIBUTE,
		},
	};
}

const withControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		if ( BLOCK !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;
		const value = attributes[ ATTRIBUTE ];

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'FAQ', 'ever-blocks' ) }
						panelId={ clientId }
						resetAll={ () =>
							setAttributes( { [ ATTRIBUTE ]: undefined } )
						}
					>
						<ToolsPanelItem
							hasValue={ () => Boolean( value ) }
							label={ __( 'Schema', 'ever-blocks' ) }
							panelId={ clientId }
							isShownByDefault
							onDeselect={ () =>
								setAttributes( { [ ATTRIBUTE ]: undefined } )
							}
						>
							<ToggleControl
								label={ __( 'FAQ schema', 'ever-blocks' ) }
								help={ __(
									'Adds FAQPage structured data for the questions and answers.',
									'ever-blocks'
								) }
								checked={ Boolean( value ) }
								onChange={ ( next ) =>
									setAttributes( { [ ATTRIBUTE ]: next } )
								}
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	},
	'withEverBlocksFaq'
);

addFilter(
	'blocks.registerBlockType',
	'ever-blocks/faq/attribute',
	addAttribute
);
addFilter( 'editor.BlockEdit', 'ever-blocks/faq/control', withControl );
