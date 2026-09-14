import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	IconDisplay,
	IconPickerControl,
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const TEMPLATE = [
	[
		'core/search',
		{
			showLabel: false,
			buttonPosition: 'button-inside',
			buttonUseIcon: true,
		},
	],
	[
		'core/heading',
		{
			level: 3,
			placeholder: __( 'Popular searches', 'ever-blocks' ),
		},
	],
	[ 'core/buttons', {}, [ [ 'core/button' ], [ 'core/button' ] ] ],
];

const ICON_SIZE = {
	control: 'unit',
	label: __( 'Icon size', 'ever-blocks' ),
	min: 8,
	max: 96,
};

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	isSelected,
} ) {
	const [ pinned, setPinned ] = useState( false );
	const hasSelectedChild = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	const showDialog = pinned || isSelected || hasSelectedChild;
	const { triggerLabel, triggerIcon, closeIcon, overlay } = attributes;
	const blockProps = useBlockProps( {
		className: `eb-search-modal eb-search-modal--${ overlay }`,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-search-modal__content' },
		{ template: TEMPLATE }
	);

	useBlockStyles( attributes );

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						isPressed={ pinned }
						onClick={ () => setPinned( ! pinned ) }
					>
						{ __( 'Dialog', 'ever-blocks' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>

			<SettingsPanels
				label={ __( 'Search modal', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					overlay: {
						type: 'select',
						label: __( 'Overlay', 'ever-blocks' ),
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
						label: __( 'Trigger', 'ever-blocks' ),
						values: {
							iconSize: ICON_SIZE,
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
						border: { color: true, width: true, radius: true },
					},
					dialog: {
						label: __( 'Dialog', 'ever-blocks' ),
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true },
					},
					backdrop: {
						label: __( 'Backdrop', 'ever-blocks' ),
						color: { background: true },
					},
					content: {
						label: __( 'Content', 'ever-blocks' ),
						values: {
							maxWidth: {
								control: 'unit',
								label: __( 'Width', 'ever-blocks' ),
								min: 240,
							},
						},
						spacing: { padding: true },
					},
					close: {
						label: __( 'Close', 'ever-blocks' ),
						values: { iconSize: ICON_SIZE },
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true },
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
					hidden={ ! showDialog }
				>
					<div className="eb-search-modal__dialog">
						<div { ...innerBlocksProps } />
						<span
							className="eb-search-modal__close"
							role="img"
							aria-label={ __( 'Close search', 'ever-blocks' ) }
						>
							<IconDisplay name={ closeIcon } />
						</span>
					</div>
				</div>
			</div>
		</>
	);
}
