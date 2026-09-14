import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	IconDisplay,
	IconPicker,
	IconPickerControl,
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/list',
	'core/buttons',
];

const TEMPLATE = [
	[
		'core/heading',
		{
			level: 3,
			placeholder: __( 'Popular searches', 'ever-blocks' ),
		},
	],
	[ 'core/buttons', {}, [ [ 'core/button' ], [ 'core/button' ] ] ],
];

const ICON_SIZE = ( label ) => ( {
	control: 'unit',
	label,
	min: 8,
	max: 96,
} );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		placeholder,
		triggerLabel,
		triggerIcon,
		submitIcon,
		closeIcon,
		layout,
	} = attributes;
	const blockProps = useBlockProps( {
		className: `eb-search-modal eb-search-modal--${ layout }`,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-search-modal__content' },
		{ allowedBlocks: ALLOWED_BLOCKS, template: TEMPLATE }
	);

	useBlockStyles( attributes );

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<IconPicker
						value={ triggerIcon }
						onSelect={ ( next ) =>
							setAttributes( { triggerIcon: next } )
						}
						render={ ( { open } ) => (
							<ToolbarButton onClick={ open }>
								{ __( 'Trigger icon', 'ever-blocks' ) }
							</ToolbarButton>
						) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<SettingsPanels
				label={ __( 'Search modal', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					layout: {
						type: 'select',
						label: __( 'Layout', 'ever-blocks' ),
						isShownByDefault: true,
						options: [
							{
								label: __( 'Full screen', 'ever-blocks' ),
								value: 'full',
							},
							{
								label: __( 'Centered', 'ever-blocks' ),
								value: 'center',
							},
							{
								label: __( 'Top bar', 'ever-blocks' ),
								value: 'top',
							},
						],
					},
					shortcut: {
						type: 'toggle',
						label: __( 'Open with ⌘K / Ctrl+K', 'ever-blocks' ),
						isShownByDefault: true,
					},
					triggerLabel: {
						type: 'text',
						label: __( 'Button label', 'ever-blocks' ),
						help: __(
							'Read by screen readers. Defaults to “Search”.',
							'ever-blocks'
						),
					},
				} }
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Icons', 'ever-blocks' ) }
					panelId={ `${ clientId }-icons` }
					resetAll={ () =>
						setAttributes( {
							triggerIcon: undefined,
							submitIcon: undefined,
							closeIcon: undefined,
						} )
					}
				>
					<IconPickerControl
						label={ __( 'Trigger', 'ever-blocks' ) }
						value={ triggerIcon }
						panelId={ `${ clientId }-icons` }
						onChange={ ( next ) =>
							setAttributes( { triggerIcon: next } )
						}
					/>
					<IconPickerControl
						label={ __( 'Submit', 'ever-blocks' ) }
						value={ submitIcon }
						panelId={ `${ clientId }-icons` }
						onChange={ ( next ) =>
							setAttributes( { submitIcon: next } )
						}
					/>
					<IconPickerControl
						label={ __( 'Close', 'ever-blocks' ) }
						value={ closeIcon }
						panelId={ `${ clientId }-icons` }
						onChange={ ( next ) =>
							setAttributes( { closeIcon: next } )
						}
					/>
				</ToolsPanel>
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					trigger: {
						label: __( 'Trigger button', 'ever-blocks' ),
						values: {
							iconSize: ICON_SIZE(
								__( 'Icon size', 'ever-blocks' )
							),
							opacity: {
								control: 'range',
								label: __( 'Opacity', 'ever-blocks' ),
								min: 0,
								max: 1,
								step: 0.05,
							},
						},
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true, width: true, color: true },
					},
					dialog: {
						label: __( 'Dialog', 'ever-blocks' ),
						values: {
							maxWidth: {
								control: 'unit',
								label: __( 'Content width', 'ever-blocks' ),
								min: 240,
							},
						},
						color: { text: true, background: true, gradient: true },
						spacing: { padding: true },
						border: { radius: true },
					},
					backdrop: {
						label: __( 'Backdrop', 'ever-blocks' ),
						color: { background: true, gradient: true },
					},
					input: {
						label: __( 'Search field', 'ever-blocks' ),
						typography: {
							fontSize: true,
							fontAppearance: true,
							letterSpacing: true,
						},
						color: { text: true, background: true },
						spacing: { padding: true },
					},
					placeholder: {
						label: __( 'Placeholder', 'ever-blocks' ),
						color: { text: true },
					},
					form: {
						label: __( 'Field row', 'ever-blocks' ),
						border: { color: true, width: true },
					},
					submit: {
						label: __( 'Submit button', 'ever-blocks' ),
						values: {
							iconSize: ICON_SIZE(
								__( 'Icon size', 'ever-blocks' )
							),
						},
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true },
					},
					close: {
						label: __( 'Close button', 'ever-blocks' ),
						values: {
							iconSize: ICON_SIZE(
								__( 'Icon size', 'ever-blocks' )
							),
						},
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true },
					},
					content: {
						label: __( 'Content area', 'ever-blocks' ),
						spacing: { padding: true, margin: true },
						color: { text: true, background: true },
					},
				} }
			/>

			<div { ...blockProps }>
				<span
					className="eb-search-modal__trigger"
					role="img"
					aria-label={ triggerLabel || __( 'Search', 'ever-blocks' ) }
				>
					<IconDisplay name={ triggerIcon } />
				</span>

				<div
					className="eb-search-modal__preview"
					data-label={ __( 'Dialog contents', 'ever-blocks' ) }
				>
					<div className="eb-search-modal__dialog">
						<span
							className="eb-search-modal__close"
							role="img"
							aria-label={ __( 'Close search', 'ever-blocks' ) }
						>
							<IconDisplay name={ closeIcon } />
						</span>
						<div className="eb-search-modal__inner">
							<div className="eb-search-modal__form">
								<RichText
									tagName="span"
									className="eb-search-modal__input"
									value={ placeholder }
									onChange={ ( next ) =>
										setAttributes( { placeholder: next } )
									}
									placeholder={ __(
										'Search',
										'ever-blocks'
									) }
									aria-label={ __(
										'Placeholder text',
										'ever-blocks'
									) }
									allowedFormats={ [] }
									withoutInteractiveFormatting
								/>
								<span
									className="eb-search-modal__submit"
									role="img"
									aria-label={ __(
										'Submit search',
										'ever-blocks'
									) }
								>
									<IconDisplay name={ submitIcon } />
								</span>
							</div>
							<div { ...innerBlocksProps } />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
