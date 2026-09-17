import {
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';
import {
	IconDisplay,
	IconPickerControl,
	SettingsPanels,
	settingsPanelId,
	StylePanels,
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

export default function Edit( { attributes, setAttributes, clientId } ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const hasSelectedChild = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	const showDialog = isOpen || hasSelectedChild;
	const { triggerLabel, triggerIcon, closeIcon, overlay } = attributes;
	const label = triggerLabel || __( 'Search', 'ever-blocks' );
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
			>
				<IconPickerControl
					label={ __( 'Button icon', 'ever-blocks' ) }
					value={ triggerIcon }
					panelId={ settingsPanelId( clientId ) }
					onChange={ ( next ) =>
						setAttributes( { triggerIcon: next ?? 'core/search' } )
					}
					resetAllFilter={ ( next ) => ( {
						...next,
						triggerIcon: 'core/search',
					} ) }
				/>
				<IconPickerControl
					label={ __( 'Close icon', 'ever-blocks' ) }
					value={ closeIcon }
					panelId={ settingsPanelId( clientId ) }
					onChange={ ( next ) =>
						setAttributes( {
							closeIcon: next ?? 'heroicons/x-mark',
						} )
					}
					resetAllFilter={ ( next ) => ( {
						...next,
						closeIcon: 'heroicons/x-mark',
					} ) }
				/>
			</SettingsPanels>

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
				<button
					type="button"
					className="eb-search-modal__trigger"
					aria-label={ label }
					aria-haspopup="dialog"
					aria-expanded={ showDialog }
					onClick={ () => setIsOpen( true ) }
				>
					<IconDisplay name={ triggerIcon } />
				</button>

				<div
					className="eb-search-modal__overlay"
					hidden={ ! showDialog }
					style={ {
						background: getCSSValueFromRawStyle(
							attributes.style?.elements?.backdrop?.color
								?.background
						),
					} }
				>
					<dialog
						open
						className="eb-search-modal__dialog"
						aria-label={ label }
						onKeyDown={ ( event ) => {
							if ( 'Escape' === event.key ) {
								setIsOpen( false );
							}
						} }
					>
						<div { ...innerBlocksProps } />
						<button
							type="button"
							className="eb-search-modal__close"
							aria-label={ __( 'Close search', 'ever-blocks' ) }
							onClick={ () => setIsOpen( false ) }
						>
							<IconDisplay name={ closeIcon } />
						</button>
					</dialog>
				</div>
			</div>
		</>
	);
}
