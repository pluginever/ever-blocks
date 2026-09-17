import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	SettingsPanels,
	StylePanels,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

export function Price( { currency, amount, period, original, note } ) {
	return (
		<>
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
		</>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps( { className: 'eb-pricing-price' } );

	useBlockStyles( attributes );

	return (
		<>
			<SettingsPanels
				label={ __( 'Price', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					amount: {
						type: 'text',
						label: __( 'Amount', 'ever-blocks' ),
					},
					currency: {
						type: 'text',
						label: __( 'Currency', 'ever-blocks' ),
					},
					period: {
						type: 'text',
						label: __( 'Period', 'ever-blocks' ),
					},
					original: {
						type: 'text',
						label: __( 'Original price', 'ever-blocks' ),
						help: __(
							'Shown struck through next to the amount.',
							'ever-blocks'
						),
						isShownByDefault: false,
					},
					note: {
						type: 'text',
						label: __( 'Note', 'ever-blocks' ),
					},
				} }
			/>

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
				{ attributes.amount ? (
					<Price { ...attributes } />
				) : (
					<span className="eb-pricing-price__empty">
						{ __( 'Set the price in the sidebar.', 'ever-blocks' ) }
					</span>
				) }
			</div>
		</>
	);
}
