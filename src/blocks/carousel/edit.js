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
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockVariationPicker,
	IconDisplay,
	IconPickerControl,
	LayoutControl,
	SettingsPanels,
	settingsPanelId,
	StylePanels,
	ToolsPanel,
	useBlockStyles,
} from '@byteever/block-components';
import { LAYOUTS } from './variations';
import './editor.scss';

function Placeholder( { clientId, setAttributes } ) {
	const variations = useSelect(
		( select ) =>
			select( 'core/blocks' ).getBlockVariations(
				'ever-blocks/carousel',
				'block'
			),
		[]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( { className: 'eb-carousel' } );

	return (
		<div { ...blockProps }>
			<BlockVariationPicker
				label={ __( 'Carousel', 'ever-blocks' ) }
				instructions={ __(
					'Choose a layout to start with.',
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

function Carousel( { attributes, setAttributes, clientId } ) {
	const {
		layout,
		arrows,
		dots,
		justifyContent,
		autoplay,
		previousIcon,
		nextIcon,
	} = attributes;
	const isSlider = 'slider' === layout;
	const isRow = 'row' === layout;
	const isColumns = 'columns' === layout;
	const isMoving = autoplay && ! isSlider;
	const count = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ),
		[ clientId ]
	);
	const { insertBlock } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( {
		className: `eb-carousel is-layout-${ layout }${
			isMoving ? ' is-moving' : ''
		}`,
		style: isColumns ? { '--columns': attributes.columns } : undefined,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-carousel__track' },
		{ orientation: isColumns ? 'vertical' : 'horizontal' }
	);

	useBlockStyles( attributes );

	const settings = {
		autoplay: {
			type: 'toggle',
			label: isSlider
				? __( 'Autoplay', 'ever-blocks' )
				: __( 'Auto-scroll', 'ever-blocks' ),
			help: __(
				'Stops while the pointer is over it or anything inside has focus.',
				'ever-blocks'
			),
			isShownByDefault: true,
		},
		...( autoplay
			? {
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
			  }
			: {} ),
		...( isRow && autoplay
			? {
					direction: {
						type: 'select',
						label: __( 'Direction', 'ever-blocks' ),
						options: [
							{
								label: __( 'Left', 'ever-blocks' ),
								value: 'left',
							},
							{
								label: __( 'Right', 'ever-blocks' ),
								value: 'right',
							},
						],
					},
			  }
			: {} ),
		...( isColumns
			? {
					columns: {
						type: 'select',
						label: __( 'Columns', 'ever-blocks' ),
						isShownByDefault: true,
						options: [ 1, 2, 3, 4 ].map( ( n ) => ( {
							label: String( n ),
							value: String( n ),
						} ) ),
					},
			  }
			: {} ),
		...( isSlider
			? {
					arrows: {
						type: 'toggle',
						label: __( 'Arrows', 'ever-blocks' ),
						isShownByDefault: true,
					},
					dots: {
						type: 'toggle',
						label: __( 'Dots', 'ever-blocks' ),
						isShownByDefault: true,
					},
					...( arrows || dots
						? {
								justifyContent: {
									type: 'select',
									label: __( 'Justification', 'ever-blocks' ),
									isShownByDefault: true,
									help: __(
										'Where the arrows and dots sit.',
										'ever-blocks'
									),
									options: [
										{
											label: __( 'Left', 'ever-blocks' ),
											value: 'left',
										},
										{
											label: __(
												'Center',
												'ever-blocks'
											),
											value: 'center',
										},
										{
											label: __( 'Right', 'ever-blocks' ),
											value: 'right',
										},
										{
											label: __(
												'Space between',
												'ever-blocks'
											),
											value: 'space-between',
										},
									],
								},
						  }
						: {} ),
					loop: {
						type: 'toggle',
						label: __( 'Loop', 'ever-blocks' ),
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
						label={ __( 'Add slide', 'ever-blocks' ) }
						onClick={ () =>
							insertBlock(
								createBlock( 'ever-blocks/carousel-slide', {}, [
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
					label={ __( 'Layout', 'ever-blocks' ) }
					panelId={ `${ clientId }-layout` }
					resetAll={ () => setAttributes( { layout: 'slider' } ) }
				>
					<LayoutControl
						label={ __( 'Layout', 'ever-blocks' ) }
						panelId={ `${ clientId }-layout` }
						value={ layout }
						defaultValue="slider"
						options={ LAYOUTS }
						onChange={ ( next ) =>
							setAttributes(
								LAYOUTS.find( ( o ) => o.value === next )
									.attributes
							)
						}
					/>
				</ToolsPanel>
			</InspectorControls>

			<SettingsPanels
				label={ __( 'Carousel', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ settings }
			>
				{ isSlider && arrows && (
					<>
						<IconPickerControl
							label={ __( 'Previous icon', 'ever-blocks' ) }
							value={ previousIcon }
							panelId={ settingsPanelId( clientId ) }
							onChange={ ( next ) =>
								setAttributes( {
									previousIcon: next ?? 'core/chevron-left',
								} )
							}
							resetAllFilter={ ( next ) => ( {
								...next,
								previousIcon: 'core/chevron-left',
							} ) }
						/>
						<IconPickerControl
							label={ __( 'Next icon', 'ever-blocks' ) }
							value={ nextIcon }
							panelId={ settingsPanelId( clientId ) }
							onChange={ ( next ) =>
								setAttributes( {
									nextIcon: next ?? 'core/chevron-right',
								} )
							}
							resetAllFilter={ ( next ) => ( {
								...next,
								nextIcon: 'core/chevron-right',
							} ) }
						/>
					</>
				) }
			</SettingsPanels>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							...( isSlider
								? {
										perView: {
											control: 'range',
											label: __(
												'Slides per view',
												'ever-blocks'
											),
											min: 1,
											max: 6,
											step: 1,
											isShownByDefault: true,
										},
										peek: {
											control: 'unit',
											label: __( 'Peek', 'ever-blocks' ),
											help: __(
												'How much of the next slide shows at the edge.',
												'ever-blocks'
											),
											min: 0,
										},
								  }
								: {} ),
							...( isRow
								? {
										slideWidth: {
											control: 'unit',
											label: __(
												'Slide width',
												'ever-blocks'
											),
											min: 80,
											isShownByDefault: true,
										},
								  }
								: {} ),
							...( isColumns && autoplay
								? {
										height: {
											control: 'unit',
											label: __(
												'Height',
												'ever-blocks'
											),
											min: 160,
											isShownByDefault: true,
										},
								  }
								: {} ),
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					track: {
						label: __( 'Track', 'ever-blocks' ),
						color: { background: true },
						spacing: { padding: true },
					},
					...( isSlider
						? {
								arrow: {
									label: __( 'Arrow', 'ever-blocks' ),
									values: {
										size: {
											control: 'unit',
											label: __( 'Size', 'ever-blocks' ),
											min: 24,
											max: 96,
										},
									},
									color: { text: true, background: true },
									border: {
										color: true,
										width: true,
										radius: true,
									},
								},
								dot: {
									label: __( 'Dot', 'ever-blocks' ),
									values: {
										size: {
											control: 'unit',
											label: __( 'Size', 'ever-blocks' ),
											min: 4,
											max: 24,
										},
									},
									color: { background: true },
								},
								dotActive: {
									label: __( 'Active', 'ever-blocks' ),
									color: { background: true },
								},
						  }
						: {} ),
				} }
			/>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
				{ isSlider && ( arrows || dots ) && (
					<div
						className={ `eb-carousel__nav is-content-justification-${ justifyContent }` }
						aria-hidden="true"
					>
						{ arrows && (
							<span className="eb-carousel__arrow">
								<IconDisplay name={ previousIcon } />
							</span>
						) }
						{ dots && (
							<span className="eb-carousel__dots">
								{ Array.from( { length: count }, ( _, i ) => (
									<span
										key={ i }
										className="eb-carousel__dot"
										aria-current={
											0 === i ? 'true' : undefined
										}
									/>
								) ) }
							</span>
						) }
						{ arrows && (
							<span className="eb-carousel__arrow">
								<IconDisplay name={ nextIcon } />
							</span>
						) }
					</div>
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

	return hasInnerBlocks ? (
		<Carousel { ...props } />
	) : (
		<Placeholder { ...props } />
	);
}
