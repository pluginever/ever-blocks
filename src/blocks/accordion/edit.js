import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	IconPickerControl,
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const TEMPLATE = [
	[ 'ever-blocks/accordion-item', { open: true } ],
	[ 'ever-blocks/accordion-item' ],
	[ 'ever-blocks/accordion-item' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { icon, iconOpen, iconPosition } = attributes;
	const blockProps = useBlockProps( {
		className: `eb-accordion eb-accordion--icon-${ iconPosition }`,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
		orientation: 'vertical',
	} );

	useBlockStyles( attributes );

	return (
		<>
			<SettingsPanels
				label={ __( 'Accordion', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					allowMultiple: {
						type: 'toggle',
						label: __(
							'Allow several open at once',
							'ever-blocks'
						),
						isShownByDefault: true,
					},
					iconPosition: {
						type: 'select',
						label: __( 'Icon position', 'ever-blocks' ),
						isShownByDefault: true,
						options: [
							{
								label: __( 'Right', 'ever-blocks' ),
								value: 'right',
							},
							{
								label: __( 'Left', 'ever-blocks' ),
								value: 'left',
							},
						],
					},
					schema: {
						type: 'toggle',
						label: __( 'FAQ schema', 'ever-blocks' ),
						help: __(
							'Adds FAQPage structured data for search engines. Use once per page.',
							'ever-blocks'
						),
						isShownByDefault: true,
					},
				} }
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Icons', 'ever-blocks' ) }
					panelId={ `${ clientId }-icons` }
					resetAll={ () =>
						setAttributes( {
							icon: undefined,
							iconOpen: undefined,
						} )
					}
				>
					<IconPickerControl
						label={ __( 'Closed', 'ever-blocks' ) }
						value={ icon }
						panelId={ `${ clientId }-icons` }
						onChange={ ( next ) => setAttributes( { icon: next } ) }
					/>
					<IconPickerControl
						label={ __( 'Open', 'ever-blocks' ) }
						value={ iconOpen }
						panelId={ `${ clientId }-icons` }
						onChange={ ( next ) =>
							setAttributes( { iconOpen: next } )
						}
					/>
				</ToolsPanel>
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							gap: {
								control: 'unit',
								label: __(
									'Space between items',
									'ever-blocks'
								),
								min: 0,
							},
						},
					},
				} }
			/>

			<div { ...innerBlocksProps } />
		</>
	);
}
