import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import {
	Button,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { arrowDown, arrowUp, closeSmall, plus } from '@wordpress/icons';
import {
	BlockVariationPicker,
	HStack,
	LayoutControl,
	SettingsPanels,
	settingsPanelId,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
	VStack,
} from '@byteever/block-components';
import { blankColumn, LAYOUTS, OPTIONS } from './variations';
import './editor.scss';

const BLOCK = 'ever-blocks/pricing-table';

const nextSlug = ( options ) =>
	`option-${
		1 +
		options.reduce(
			( max, option ) =>
				Math.max(
					max,
					Number( option.slug.match( /\d+$/ )?.[ 0 ] ?? 0 )
				),
			0
		)
	}`;

export function Switch( { options, active, label, onChange, className = '' } ) {
	if ( ! options.length ) {
		return null;
	}

	const current = options.some( ( o ) => o.slug === active )
		? active
		: options[ 0 ].slug;
	const move = ( event ) => {
		const step = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1,
		}[ event.key ];
		const index = options.findIndex( ( o ) => o.slug === current );
		let next;

		if ( step ) {
			next =
				options[ ( index + step + options.length ) % options.length ];
		} else if ( 'Home' === event.key ) {
			next = options[ 0 ];
		} else if ( 'End' === event.key ) {
			next = options[ options.length - 1 ];
		}

		if ( next ) {
			event.preventDefault();
			onChange( next.slug );
			event.currentTarget.parentElement
				.querySelector( `[data-option="${ next.slug }"]` )
				?.focus();
		}
	};

	return (
		<div
			className={ `eb-pricing-table__switch ${ className }`.trim() }
			role="radiogroup"
			aria-label={ label }
		>
			{ options.map( ( option ) => (
				<button
					key={ option.slug }
					type="button"
					role="radio"
					className="eb-pricing-table__option"
					aria-checked={ option.slug === current }
					tabIndex={ option.slug === current ? 0 : -1 }
					data-option={ option.slug }
					onClick={ () => onChange( option.slug ) }
					onKeyDown={ move }
				>
					{ option.label }
					{ option.badge && (
						<span className="eb-pricing-table__option-badge">
							{ option.badge }
						</span>
					) }
				</button>
			) ) }
		</div>
	);
}

function Placeholder( { clientId, setAttributes } ) {
	const variations = useSelect(
		( select ) =>
			select( 'core/blocks' ).getBlockVariations( BLOCK, 'block' ),
		[]
	);
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( { className: 'eb-pricing-table' } );

	return (
		<div { ...blockProps }>
			<BlockVariationPicker
				label={ __( 'Pricing Table', 'ever-blocks' ) }
				instructions={ __(
					'Pick a look to start with.',
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

function Options( { options, active, setAttributes, panelId } ) {
	const update = ( next ) => {
		const patch = { options: next };

		if ( next.length && ! next.some( ( o ) => o.slug === active ) ) {
			patch.active = next[ 0 ].slug;
		}

		setAttributes( patch );
	};
	const change = ( index, patch ) =>
		update(
			options.map( ( option, i ) =>
				i === index ? { ...option, ...patch } : option
			)
		);
	const swap = ( index, step ) => {
		const next = [ ...options ];
		[ next[ index ], next[ index + step ] ] = [
			next[ index + step ],
			next[ index ],
		];
		update( next );
	};

	return (
		<ToolsPanelItem
			hasValue={ () => true }
			label={ __( 'Options', 'ever-blocks' ) }
			panelId={ panelId }
			isShownByDefault
			onDeselect={ () => setAttributes( { options: [] } ) }
			resetAllFilter={ ( next ) => ( {
				...next,
				options: OPTIONS,
				active: 'yearly',
			} ) }
		>
			{ options.map( ( option, index ) => (
				<VStack
					key={ option.slug }
					className="eb-pricing-table__option-fields"
					role="group"
					aria-label={
						option.label || __( 'Untitled option', 'ever-blocks' )
					}
					spacing={ 2 }
				>
					<HStack justify="space-between">
						<span className="eb-pricing-table__option-name">
							{ option.label ||
								__( 'Untitled option', 'ever-blocks' ) }
						</span>
						<HStack spacing={ 0 } expanded={ false }>
							<Button
								icon={ arrowUp }
								size="small"
								label={ __( 'Move up', 'ever-blocks' ) }
								disabled={ 0 === index }
								onClick={ () => swap( index, -1 ) }
							/>
							<Button
								icon={ arrowDown }
								size="small"
								label={ __( 'Move down', 'ever-blocks' ) }
								disabled={ index === options.length - 1 }
								onClick={ () => swap( index, 1 ) }
							/>
							<Button
								icon={ closeSmall }
								size="small"
								label={ __( 'Remove option', 'ever-blocks' ) }
								onClick={ () =>
									update(
										options.filter(
											( _, i ) => i !== index
										)
									)
								}
							/>
						</HStack>
					</HStack>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Label', 'ever-blocks' ) }
						value={ option.label ?? '' }
						onChange={ ( label ) => change( index, { label } ) }
					/>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Badge', 'ever-blocks' ) }
						help={ __(
							'Short text beside the label, like a saving.',
							'ever-blocks'
						) }
						value={ option.badge ?? '' }
						onChange={ ( badge ) =>
							change( index, { badge: badge || undefined } )
						}
					/>
				</VStack>
			) ) }
			<Button
				variant="secondary"
				size="compact"
				icon={ plus }
				onClick={ () =>
					update( [
						...options,
						{
							slug: nextSlug( options ),
							label: __( 'Option', 'ever-blocks' ),
						},
					] )
				}
			>
				{ __( 'Add option', 'ever-blocks' ) }
			</Button>
		</ToolsPanelItem>
	);
}

function Table( { attributes, setAttributes, clientId } ) {
	const { layout, options, active, optionsLabel } = attributes;
	const count = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ),
		[ clientId ]
	);
	const { insertBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( {
		className: `eb-pricing-table is-layout-${ layout }`,
		style: { '--columns': count },
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-pricing-table__columns' },
		{ orientation: 'horizontal' }
	);

	useBlockStyles( attributes );

	const addColumns = ( templates ) =>
		insertBlocks(
			createBlocksFromInnerBlocksTemplate( templates ),
			count,
			clientId
		);

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						icon={ plus }
						label={ __( 'Add column', 'ever-blocks' ) }
						onClick={ () =>
							addColumns( [ blankColumn( options ) ] )
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Layout', 'ever-blocks' ) }
					panelId={ `${ clientId }-layout` }
					resetAll={ () => setAttributes( { layout: 'card' } ) }
				>
					<LayoutControl
						label={ __( 'Layout', 'ever-blocks' ) }
						panelId={ `${ clientId }-layout` }
						value={ layout }
						defaultValue="card"
						options={ LAYOUTS }
						onChange={ ( next ) =>
							setAttributes( { layout: next } )
						}
					/>
				</ToolsPanel>
			</InspectorControls>

			<SettingsPanels
				label={ __( 'Billing switch', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={
					options.length > 0
						? {
								optionsLabel: {
									type: 'text',
									label: __(
										'Accessible name',
										'ever-blocks'
									),
									help: __(
										'Read to screen readers before the options. Defaults to “Billing period”.',
										'ever-blocks'
									),
								},
						  }
						: {}
				}
			>
				<Options
					options={ options }
					active={ active }
					setAttributes={ setAttributes }
					panelId={ settingsPanelId( clientId ) }
				/>
			</SettingsPanels>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							columns: {
								control: 'range',
								label: __( 'Columns', 'ever-blocks' ),
								help: __(
									'Plans per row on desktop; more wrap to the next row.',
									'ever-blocks'
								),
								min: 1,
								max: 6,
								step: 1,
								isShownByDefault: true,
							},
							columnsTablet: {
								control: 'range',
								label: __( 'Tablet columns', 'ever-blocks' ),
								min: 1,
								max: 4,
								step: 1,
							},
							columnsMobile: {
								control: 'range',
								label: __( 'Mobile columns', 'ever-blocks' ),
								min: 1,
								max: 2,
								step: 1,
							},
							columnWidth: {
								control: 'unit',
								label: __( 'Column width', 'ever-blocks' ),
								help: __(
									'Widest a column grows before the table stops stretching.',
									'ever-blocks'
								),
								min: 160,
							},
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					...( options.length
						? {
								switch: {
									label: __( 'Switch', 'ever-blocks' ),
									color: { background: true },
									border: { radius: true },
									spacing: { padding: true },
								},
								option: {
									label: __( 'Option', 'ever-blocks' ),
									color: { text: true, background: true },
									typography: {
										fontSize: true,
										fontAppearance: true,
									},
									spacing: { padding: true },
								},
								optionActive: {
									label: __( 'Active', 'ever-blocks' ),
									color: { text: true, background: true },
								},
								optionBadge: {
									label: __( 'Badge', 'ever-blocks' ),
									color: { text: true, background: true },
									typography: { fontSize: true },
								},
						  }
						: {} ),
				} }
			/>

			<div { ...blockProps }>
				<Switch
					options={ options }
					active={ active }
					label={
						optionsLabel || __( 'Billing period', 'ever-blocks' )
					}
					onChange={ ( slug ) => setAttributes( { active: slug } ) }
				/>
				<div { ...innerBlocksProps } />
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
		<Table { ...props } />
	) : (
		<Placeholder { ...props } />
	);
}
