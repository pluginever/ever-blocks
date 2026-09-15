import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import {
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import {
	BlockVariationPicker,
	IconDisplay,
	IconPickerControl,
	LayoutControl,
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
} from '@byteever/block-components';
import { ANIMATIONS } from './variations';
import './editor.scss';

const BLOCK = 'ever-blocks/announcement-bar';

function Placeholder( { clientId, setAttributes } ) {
	const variations = useSelect(
		( select ) =>
			select( 'core/blocks' ).getBlockVariations( BLOCK, 'block' ),
		[]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( { className: 'eb-announcement-bar' } );

	return (
		<div { ...blockProps }>
			<BlockVariationPicker
				label={ __( 'Announcement Bar', 'ever-blocks' ) }
				instructions={ __(
					'How should the messages appear?',
					'ever-blocks'
				) }
				variations={ variations.map( ( variation ) => ( {
					...variation,
					title: variation.description,
				} ) ) }
				onSelect={ ( variation = variations[ 0 ] ) => {
					setAttributes( variation.attributes );
					replaceInnerBlocks(
						clientId,
						createBlocksFromInnerBlocksTemplate(
							variation.innerBlocks
						),
						true
					);
				} }
			/>
		</div>
	);
}

function Bar( { attributes, setAttributes, clientId } ) {
	const { animation, dismissible, startsAt, endsAt, closeIcon } = attributes;
	const isStatic = 'static' === animation;
	const isTicker = 'ticker' === animation;
	const count = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ),
		[ clientId ]
	);
	const { insertBlock } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( {
		className: `eb-announcement-bar is-animation-${ animation }${
			isTicker && 'none' !== attributes.separator
				? ` has-separator-${ attributes.separator }`
				: ''
		}`,
		style: attributes.separatorText
			? {
					'--ever-blocks-announcement-bar-separator': JSON.stringify(
						attributes.separatorText
					),
			  }
			: undefined,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-announcement-bar__track' },
		{ orientation: isTicker ? 'horizontal' : 'vertical' }
	);

	useBlockStyles( attributes );

	const directions = isTicker
		? [
				{ label: __( 'Left', 'ever-blocks' ), value: 'left' },
				{ label: __( 'Right', 'ever-blocks' ), value: 'right' },
		  ]
		: [
				{ label: __( 'Up', 'ever-blocks' ), value: 'up' },
				{ label: __( 'Down', 'ever-blocks' ), value: 'down' },
		  ];

	const settings = {
		...( isStatic
			? {}
			: {
					speed: {
						type: 'select',
						label: __( 'Speed', 'ever-blocks' ),
						isShownByDefault: true,
						options: [
							{
								label: __( 'Slow', 'ever-blocks' ),
								value: 'slow',
							},
							{
								label: __( 'Normal', 'ever-blocks' ),
								value: 'normal',
							},
							{
								label: __( 'Fast', 'ever-blocks' ),
								value: 'fast',
							},
						],
					},
					direction: {
						type: 'select',
						label: __( 'Direction', 'ever-blocks' ),
						options: directions,
					},
			  } ),
		...( isTicker
			? {
					separator: {
						type: 'select',
						label: __( 'Separator', 'ever-blocks' ),
						isShownByDefault: true,
						options: [
							{
								label: __( 'None', 'ever-blocks' ),
								value: 'none',
							},
							{ label: __( 'Dot', 'ever-blocks' ), value: 'dot' },
							{
								label: __( 'Line', 'ever-blocks' ),
								value: 'line',
							},
							{
								label: __( 'Slash', 'ever-blocks' ),
								value: 'slash',
							},
							{
								label: __( 'Custom', 'ever-blocks' ),
								value: 'custom',
							},
						],
					},
					...( 'custom' === attributes.separator
						? {
								separatorText: {
									type: 'text',
									label: __(
										'Separator text',
										'ever-blocks'
									),
									isShownByDefault: true,
								},
						  }
						: {} ),
			  }
			: {} ),
		dismissible: {
			type: 'toggle',
			label: __( 'Dismissible', 'ever-blocks' ),
			help: __(
				'Adds a close button; the choice is remembered in the browser.',
				'ever-blocks'
			),
			isShownByDefault: true,
		},
		...( dismissible
			? {
					rememberDays: {
						type: 'select',
						label: __( 'Stay closed for', 'ever-blocks' ),
						isShownByDefault: true,
						options: [
							{ label: __( 'A day', 'ever-blocks' ), value: '1' },
							{
								label: __( 'A week', 'ever-blocks' ),
								value: '7',
							},
							{
								label: __( 'A month', 'ever-blocks' ),
								value: '30',
							},
							{
								label: __( 'A year', 'ever-blocks' ),
								value: '365',
							},
						],
					},
			  }
			: {} ),
	};

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						icon={ plus }
						label={ __( 'Add announcement', 'ever-blocks' ) }
						onClick={ () =>
							insertBlock(
								createBlock( 'ever-blocks/announcement', {}, [
									createBlock( 'core/paragraph' ),
								] ),
								count,
								clientId
							)
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Animation', 'ever-blocks' ) }
					panelId={ `${ clientId }-animation` }
					resetAll={ () =>
						setAttributes( {
							animation: 'static',
							direction: 'left',
						} )
					}
				>
					<LayoutControl
						label={ __( 'Animation', 'ever-blocks' ) }
						panelId={ `${ clientId }-animation` }
						value={ animation }
						defaultValue="static"
						options={ ANIMATIONS }
						onChange={ ( next ) =>
							setAttributes(
								ANIMATIONS.find( ( o ) => o.value === next )
									.attributes
							)
						}
					/>
				</ToolsPanel>
			</InspectorControls>

			<SettingsPanels
				label={ __( 'Announcement bar', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ settings }
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Schedule', 'ever-blocks' ) }
					panelId={ `${ clientId }-schedule` }
					resetAll={ () =>
						setAttributes( {
							startsAt: '',
							endsAt: '',
						} )
					}
				>
					<ToolsPanelItem
						hasValue={ () => Boolean( startsAt ) }
						label={ __( 'Start', 'ever-blocks' ) }
						panelId={ `${ clientId }-schedule` }
						onDeselect={ () => setAttributes( { startsAt: '' } ) }
					>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							type="datetime-local"
							label={ __( 'Show from', 'ever-blocks' ) }
							value={ startsAt }
							onChange={ ( next ) =>
								setAttributes( { startsAt: next } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => Boolean( endsAt ) }
						label={ __( 'End', 'ever-blocks' ) }
						panelId={ `${ clientId }-schedule` }
						onDeselect={ () => setAttributes( { endsAt: '' } ) }
					>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							type="datetime-local"
							label={ __( 'Hide after', 'ever-blocks' ) }
							help={ __( 'Site timezone.', 'ever-blocks' ) }
							value={ endsAt }
							onChange={ ( next ) =>
								setAttributes( { endsAt: next } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				{ dismissible && (
					<ToolsPanel
						label={ __( 'Close icon', 'ever-blocks' ) }
						panelId={ `${ clientId }-icon` }
						resetAll={ () =>
							setAttributes( { closeIcon: 'heroicons/x-mark' } )
						}
					>
						<IconPickerControl
							label={ __( 'Icon', 'ever-blocks' ) }
							value={ closeIcon }
							panelId={ `${ clientId }-icon` }
							onChange={ ( next ) =>
								setAttributes( {
									closeIcon: next ?? 'heroicons/x-mark',
								} )
							}
						/>
					</ToolsPanel>
				) }
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							minHeight: {
								control: 'unit',
								label: __( 'Height', 'ever-blocks' ),
								min: 24,
							},
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					track: {
						label: __( 'Track', 'ever-blocks' ),
						spacing: { padding: true },
					},
					...( isTicker
						? {
								separator: {
									label: __( 'Separator', 'ever-blocks' ),
									color: { text: true },
									typography: { fontSize: true },
								},
						  }
						: {} ),
					...( dismissible
						? {
								close: {
									label: __( 'Close', 'ever-blocks' ),
									values: {
										size: {
											control: 'unit',
											label: __(
												'Icon size',
												'ever-blocks'
											),
											min: 12,
											max: 48,
										},
									},
									color: { text: true, background: true },
									border: { radius: true },
								},
						  }
						: {} ),
				} }
			/>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
				{ dismissible && (
					<span
						className="eb-announcement-bar__close"
						aria-hidden="true"
					>
						<IconDisplay name={ closeIcon } />
					</span>
				) }
			</div>
		</>
	);
}

export default function Edit( props ) {
	const hasInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockCount( props.clientId ) > 0,
		[ props.clientId ]
	);

	return hasInnerBlocks ? <Bar { ...props } /> : <Placeholder { ...props } />;
}
