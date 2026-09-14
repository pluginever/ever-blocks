import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const FIELDS = [
	[ 'amount', __( 'Amount', 'ever-blocks' ), true ],
	[ 'currency', __( 'Currency', 'ever-blocks' ), true ],
	[ 'period', __( 'Period', 'ever-blocks' ), true ],
	[ 'original', __( 'Original price', 'ever-blocks' ), false ],
	[ 'note', __( 'Note', 'ever-blocks' ), true ],
];

export function Price( { price = {}, className = '', hidden = false } ) {
	const { currency, amount, period, original, note } = price;

	if ( ! amount ) {
		return null;
	}

	return (
		<div
			className={ `eb-pricing-price__row ${ className }`.trim() }
			hidden={ hidden }
		>
			<span className="eb-pricing-price__line">
				{ currency && (
					<span className="eb-pricing-price__currency">
						{ currency }
					</span>
				) }
				<span
					className={ `eb-pricing-price__amount${
						/\p{L}/u.test( amount ) ? ' is-text' : ''
					}` }
				>
					{ amount }
				</span>
				{ period && (
					<span className="eb-pricing-price__period">{ period }</span>
				) }
				{ original && (
					<s className="eb-pricing-price__original">
						<span className="screen-reader-text">
							{ __( 'Was', 'ever-blocks' ) }{ ' ' }
						</span>
						{ original }
					</s>
				) }
			</span>
			{ note && <span className="eb-pricing-price__note">{ note }</span> }
		</div>
	);
}

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { prices, perOption } = attributes;
	const tableOptions = context[ 'ever-blocks/pricingOptions' ] ?? [];
	const options =
		tableOptions.length && perOption
			? tableOptions
			: [ { slug: 'default', label: __( 'Price', 'ever-blocks' ) } ];
	const active = options.some(
		( option ) => option.slug === context[ 'ever-blocks/pricingActive' ]
	)
		? context[ 'ever-blocks/pricingActive' ]
		: options[ 0 ].slug;
	const blockProps = useBlockProps( { className: 'eb-pricing-price' } );

	useBlockStyles( attributes );

	const set = ( slug, key, value ) =>
		setAttributes( {
			prices: {
				...prices,
				[ slug ]: { ...prices[ slug ], [ key ]: value || undefined },
			},
		} );

	return (
		<>
			{ tableOptions.length > 0 && (
				<SettingsPanels
					label={ __( 'Price', 'ever-blocks' ) }
					attributes={ attributes }
					setAttributes={ setAttributes }
					controls={ {
						perOption: {
							type: 'toggle',
							label: __( 'Price per option', 'ever-blocks' ),
							help: __(
								'Each billing option gets its own price; off shows one price for all.',
								'ever-blocks'
							),
							isShownByDefault: true,
						},
					} }
				/>
			) }

			<InspectorControls group="settings">
				{ options.map( ( option ) => (
					<ToolsPanel
						key={ option.slug }
						label={ option.label || option.slug }
						panelId={ `${ clientId }-${ option.slug }` }
						resetAll={ () =>
							setAttributes( {
								prices: {
									...prices,
									[ option.slug ]: undefined,
								},
							} )
						}
					>
						{ FIELDS.map( ( [ key, label, shown ] ) => (
							<ToolsPanelItem
								key={ key }
								hasValue={ () =>
									Boolean( prices[ option.slug ]?.[ key ] )
								}
								label={ label }
								panelId={ `${ clientId }-${ option.slug }` }
								isShownByDefault={ shown }
								onDeselect={ () =>
									set( option.slug, key, undefined )
								}
							>
								<TextControl
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									label={ label }
									help={
										'original' === key
											? __(
													'Shown struck through next to the amount.',
													'ever-blocks'
											  )
											: undefined
									}
									value={
										prices[ option.slug ]?.[ key ] ?? ''
									}
									onChange={ ( next ) =>
										set( option.slug, key, next )
									}
								/>
							</ToolsPanelItem>
						) ) }
					</ToolsPanel>
				) ) }
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					currency: {
						label: __( 'Currency', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true, fontAppearance: true },
					},
					amount: {
						label: __( 'Amount', 'ever-blocks' ),
						color: { text: true },
						typography: {
							fontSize: true,
							fontAppearance: true,
							letterSpacing: true,
						},
					},
					period: {
						label: __( 'Period', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true },
					},
					original: {
						label: __( 'Original', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true },
					},
					note: {
						label: __( 'Note', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true },
					},
				} }
			/>

			<div { ...blockProps }>
				{ prices[ active ]?.amount ? (
					<Price price={ prices[ active ] } />
				) : (
					<span className="eb-pricing-price__empty">
						{ __( 'Set the price in the sidebar.', 'ever-blocks' ) }
					</span>
				) }
			</div>
		</>
	);
}
