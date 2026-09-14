import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, RangeControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	IconDisplay,
	LayoutControl,
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
} from '@byteever/block-components';
import { centered, side, stacked } from './icons';
import './editor.scss';

const LAYOUTS = [
	{ value: 'stacked', label: __( 'Stacked', 'ever-blocks' ), icon: stacked },
	{ value: 'side', label: __( 'Side by side', 'ever-blocks' ), icon: side },
	{
		value: 'centered',
		label: __( 'Centered', 'ever-blocks' ),
		icon: centered,
	},
];

const FORMATS = [ 'core/bold', 'core/italic', 'core/link' ];

function Picture( { url, alt, className, label, onSelect, onRemove } ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ undefined }
				onSelect={ onSelect }
				render={ ( { open } ) =>
					url ? (
						<button
							type="button"
							className={ `${ className } eb-testimonial__picture` }
							onClick={ open }
							aria-label={ label }
						>
							<img src={ url } alt={ alt } />
						</button>
					) : (
						<Button
							variant="secondary"
							size="compact"
							className={ `${ className } eb-testimonial__picture is-empty` }
							onClick={ open }
						>
							{ label }
						</Button>
					)
				}
			/>
			{ url && (
				<Button
					variant="link"
					size="small"
					className="eb-testimonial__remove"
					onClick={ onRemove }
				>
					{ __( 'Remove', 'ever-blocks' ) }
				</Button>
			) }
		</MediaUploadCheck>
	);
}

function Stars( { value } ) {
	const icons = Array.from( { length: 5 }, ( _, i ) => (
		<IconDisplay key={ i } name="heroicons/star" />
	) );

	return (
		<div className="eb-testimonial__rating eb-rating">
			<span className="eb-rating__icons" aria-hidden="true">
				<span className="eb-rating__empty">{ icons }</span>
				<span
					className="eb-rating__filled"
					style={ { width: `${ ( value / 5 ) * 100 }%` } }
				>
					{ icons }
				</span>
			</span>
		</div>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		layout,
		quote,
		name,
		role,
		avatarUrl,
		avatarAlt,
		showRating,
		rating,
		showLogo,
		logoUrl,
		logoAlt,
		quoteMark,
		schema,
		itemReviewed,
	} = attributes;
	const blockProps = useBlockProps( {
		className: `eb-testimonial eb-testimonial--${ layout }`,
	} );

	useBlockStyles( attributes );

	return (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Layout', 'ever-blocks' ) }
					panelId={ `${ clientId }-layout` }
					resetAll={ () => setAttributes( { layout: undefined } ) }
				>
					<LayoutControl
						label={ __( 'Layout', 'ever-blocks' ) }
						panelId={ `${ clientId }-layout` }
						value={ layout }
						defaultValue="stacked"
						options={ LAYOUTS }
						onChange={ ( next ) =>
							setAttributes( { layout: next } )
						}
					/>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Rating', 'ever-blocks' ) }
					panelId={ `${ clientId }-rating` }
					resetAll={ () =>
						setAttributes( {
							showRating: undefined,
							rating: undefined,
						} )
					}
				>
					<ToolsPanelItem
						hasValue={ () => 5 !== rating || ! showRating }
						label={ __( 'Stars', 'ever-blocks' ) }
						panelId={ `${ clientId }-rating` }
						isShownByDefault
						onDeselect={ () =>
							setAttributes( {
								showRating: undefined,
								rating: undefined,
							} )
						}
					>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Stars', 'ever-blocks' ) }
							help={ __(
								'Zero hides the rating.',
								'ever-blocks'
							) }
							min={ 0 }
							max={ 5 }
							step={ 0.5 }
							value={ showRating ? rating : 0 }
							onChange={ ( next ) =>
								setAttributes( {
									rating: next || undefined,
									showRating: next > 0,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<SettingsPanels
				label={ __( 'Testimonial', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					showLogo: {
						type: 'toggle',
						label: __( 'Company logo', 'ever-blocks' ),
						isShownByDefault: true,
					},
					quoteMark: {
						type: 'toggle',
						label: __( 'Quotation mark', 'ever-blocks' ),
						isShownByDefault: true,
					},
					schema: {
						type: 'toggle',
						label: __( 'Review schema', 'ever-blocks' ),
						help: __(
							'Adds Review structured data. Needs the reviewed item’s name.',
							'ever-blocks'
						),
					},
				} }
			/>

			{ schema && (
				<InspectorControls group="settings">
					<ToolsPanel
						label={ __( 'Schema', 'ever-blocks' ) }
						panelId={ `${ clientId }-schema` }
						resetAll={ () =>
							setAttributes( { itemReviewed: undefined } )
						}
					>
						<ToolsPanelItem
							hasValue={ () => Boolean( itemReviewed ) }
							label={ __( 'Item reviewed', 'ever-blocks' ) }
							panelId={ `${ clientId }-schema` }
							isShownByDefault
							onDeselect={ () =>
								setAttributes( { itemReviewed: undefined } )
							}
						>
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Item reviewed', 'ever-blocks' ) }
								help={ __(
									'The product or service this testimonial is about.',
									'ever-blocks'
								) }
								value={ itemReviewed }
								onChange={ ( next ) =>
									setAttributes( { itemReviewed: next } )
								}
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			) }

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							avatarSize: {
								control: 'unit',
								label: __( 'Photo size', 'ever-blocks' ),
								min: 24,
								max: 160,
							},
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					quote: {
						label: __( 'Quote', 'ever-blocks' ),
						color: { text: true },
						typography: {
							fontSize: true,
							fontAppearance: true,
							lineHeight: true,
							letterSpacing: true,
						},
					},
					name: {
						label: __( 'Name', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true, fontAppearance: true },
					},
					role: {
						label: __( 'Role', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true, fontAppearance: true },
					},
					avatar: {
						label: __( 'Photo', 'ever-blocks' ),
						border: { radius: true, width: true, color: true },
					},
					rating: {
						label: __( 'Rating', 'ever-blocks' ),
						values: {
							size: {
								control: 'unit',
								label: __( 'Size', 'ever-blocks' ),
								min: 8,
								max: 48,
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
					mark: {
						label: __( 'Mark', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true },
					},
					logo: {
						label: __( 'Logo', 'ever-blocks' ),
						values: {
							width: {
								control: 'unit',
								label: __( 'Width', 'ever-blocks' ),
								min: 24,
								max: 320,
							},
						},
					},
				} }
			/>

			<figure { ...blockProps }>
				{ quoteMark && (
					<span className="eb-testimonial__mark" aria-hidden="true">
						“
					</span>
				) }
				{ showRating && <Stars value={ rating } /> }
				<RichText
					tagName="blockquote"
					className="eb-testimonial__quote"
					value={ quote }
					onChange={ ( next ) => setAttributes( { quote: next } ) }
					placeholder={ __( 'What did they say?', 'ever-blocks' ) }
					allowedFormats={ FORMATS }
				/>
				<figcaption className="eb-testimonial__author">
					<Picture
						url={ avatarUrl }
						alt={ avatarAlt }
						className="eb-testimonial__avatar"
						label={ __( 'Photo', 'ever-blocks' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								avatarId: media.id,
								avatarUrl:
									media.sizes?.thumbnail?.url ?? media.url,
								avatarAlt: media.alt ?? '',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								avatarId: undefined,
								avatarUrl: undefined,
								avatarAlt: undefined,
							} )
						}
					/>
					<span className="eb-testimonial__who">
						<RichText
							tagName="span"
							className="eb-testimonial__name"
							value={ name }
							onChange={ ( next ) =>
								setAttributes( { name: next } )
							}
							placeholder={ __( 'Name', 'ever-blocks' ) }
							allowedFormats={ [] }
						/>
						<RichText
							tagName="span"
							className="eb-testimonial__role"
							value={ role }
							onChange={ ( next ) =>
								setAttributes( { role: next } )
							}
							placeholder={ __( 'Role, company', 'ever-blocks' ) }
							allowedFormats={ [ 'core/link' ] }
						/>
					</span>
					{ showLogo && (
						<Picture
							url={ logoUrl }
							alt={ logoAlt }
							className="eb-testimonial__logo"
							label={ __( 'Logo', 'ever-blocks' ) }
							onSelect={ ( media ) =>
								setAttributes( {
									logoId: media.id,
									logoUrl:
										media.sizes?.medium?.url ?? media.url,
									logoAlt: media.alt ?? '',
								} )
							}
							onRemove={ () =>
								setAttributes( {
									logoId: undefined,
									logoUrl: undefined,
									logoAlt: undefined,
								} )
							}
						/>
					) }
				</figcaption>
			</figure>
		</>
	);
}
