import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { RangeControl, ToggleControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import {
	IconDisplay,
	IconPickerControl,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const clamp = ( number, min, max ) => Math.min( max, Math.max( min, number ) );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { icon, showLabel } = attributes;
	const max = clamp( Number( attributes.max ) || 5, 1, 10 );
	const value = clamp( Number( attributes.value ) || 0, 0, max );
	const panelId = `${ clientId }-rating`;
	const blockProps = useBlockProps( { className: 'eb-rating' } );
	const row = Array.from( { length: max }, ( _, i ) => (
		<IconDisplay key={ i } name={ icon } />
	) );

	useBlockStyles( attributes );

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Rating', 'ever-blocks' ) }
					panelId={ panelId }
					resetAll={ () =>
						setAttributes( {
							value: 5,
							max: 5,
							icon: 'heroicons/star',
							showLabel: false,
						} )
					}
				>
					<ToolsPanelItem
						hasValue={ () => 5 !== attributes.value }
						label={ __( 'Value', 'ever-blocks' ) }
						panelId={ panelId }
						isShownByDefault
						onDeselect={ () => setAttributes( { value: 5 } ) }
					>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Value', 'ever-blocks' ) }
							min={ 0 }
							max={ max }
							step={ 0.5 }
							value={ value }
							onChange={ ( next ) =>
								setAttributes( { value: next } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => 5 !== attributes.max }
						label={ __( 'Maximum', 'ever-blocks' ) }
						panelId={ panelId }
						onDeselect={ () => setAttributes( { max: 5 } ) }
					>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Maximum', 'ever-blocks' ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							value={ max }
							onChange={ ( next ) =>
								setAttributes( {
									max: next,
									value: Math.min( value, next ),
								} )
							}
						/>
					</ToolsPanelItem>
					<IconPickerControl
						label={ __( 'Icon', 'ever-blocks' ) }
						value={ icon }
						panelId={ panelId }
						onChange={ ( next ) =>
							setAttributes( { icon: next ?? 'heroicons/star' } )
						}
					/>
					<ToolsPanelItem
						hasValue={ () => Boolean( showLabel ) }
						label={ __( 'Label', 'ever-blocks' ) }
						panelId={ panelId }
						onDeselect={ () =>
							setAttributes( { showLabel: false } )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Show the value as text',
								'ever-blocks'
							) }
							checked={ Boolean( showLabel ) }
							onChange={ ( next ) =>
								setAttributes( { showLabel: next } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							size: {
								control: 'unit',
								label: __( 'Icon size', 'ever-blocks' ),
								min: 8,
								max: 96,
							},
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					filled: {
						label: __( 'Filled', 'ever-blocks' ),
						color: { text: 'default' },
					},
					empty: {
						label: __( 'Empty', 'ever-blocks' ),
						color: { text: 'default' },
					},
					label: {
						label: __( 'Label', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true, fontAppearance: true },
					},
				} }
			/>

			<div { ...blockProps }>
				<span
					className="eb-rating__icons"
					role="img"
					aria-label={ sprintf(
						/* translators: 1: rating value, 2: maximum rating. */
						__( 'Rated %1$s out of %2$s', 'ever-blocks' ),
						value,
						max
					) }
				>
					<span className="eb-rating__empty" aria-hidden="true">
						{ row }
					</span>
					<span
						className="eb-rating__filled"
						aria-hidden="true"
						style={ { width: `${ ( value / max ) * 100 }%` } }
					>
						{ row }
					</span>
				</span>
				{ showLabel && (
					<span className="eb-rating__label" aria-hidden="true">
						{ sprintf(
							/* translators: 1: rating value, 2: maximum rating. */
							__( '%1$s / %2$s', 'ever-blocks' ),
							value,
							max
						) }
					</span>
				) }
			</div>
		</>
	);
}
