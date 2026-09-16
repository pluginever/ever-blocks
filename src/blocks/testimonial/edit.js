import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { TextControl, ToggleControl } from '@wordpress/components';
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

function Picture( { id, url, alt, className, label, onSelect } ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				value={ id }
				onSelect={ onSelect }
				render={ ( { open } ) => (
					<button
						type="button"
						className={ `${ className } eb-testimonial__picture${
							url ? '' : ' is-empty'
						}` }
						onClick={ open }
						aria-label={ label }
					>
						{ url ? <img src={ url } alt={ alt } /> : label }
					</button>
				) }
			/>
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
		showName,
		name,
		showRole,
		role,
		showAvatar,
		avatarId,
		avatarUrl,
		avatarAlt,
		showRating,
		rating,
		showLogo,
		logoId,
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

	const selectAvatar = ( media ) =>
		setAttributes( {
			avatarId: media.id,
			avatarUrl: media.sizes?.thumbnail?.url ?? media.url,
			avatarAlt: media.alt ?? '',
		} );
	const resetAvatar = () =>
		setAttributes( {
			avatarId: undefined,
			avatarUrl: undefined,
			avatarAlt: undefined,
		} );
	const selectLogo = ( media ) =>
		setAttributes( {
			logoId: media.id,
			logoUrl: media.sizes?.medium?.url ?? media.url,
			logoAlt: media.alt ?? '',
		} );
	const resetLogo = () =>
		setAttributes( {
			logoId: undefined,
			logoUrl: undefined,
			logoAlt: undefined,
		} );

	return (
		<>
			<BlockControls group="other">
				{ showAvatar && (
					<MediaReplaceFlow
						name={ __( 'Photo', 'ever-blocks' ) }
						mediaId={ avatarId }
						mediaURL={ avatarUrl }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ selectAvatar }
						onReset={ resetAvatar }
					/>
				) }
				{ showLogo && (
					<MediaReplaceFlow
						name={ __( 'Logo', 'ever-blocks' ) }
						mediaId={ logoId }
						mediaURL={ logoUrl }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ selectLogo }
						onReset={ resetLogo }
					/>
				) }
			</BlockControls>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Layout', 'ever-blocks' ) }
					panelId={ `${ clientId }-layout` }
					resetAll={ () => setAttributes( { layout: 'stacked' } ) }
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
			</InspectorControls>

			<SettingsPanels
				label={ __( 'Testimonial', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				resets={ [ 'rating' ] }
				controls={ {
					showAvatar: {
						type: 'toggle',
						label: __( 'Photo', 'ever-blocks' ),
						isShownByDefault: true,
					},
					showRating: {
						type: 'toggle',
						label: __( 'Rating', 'ever-blocks' ),
						isShownByDefault: true,
					},
					...( showRating
						? {
								rating: {
									type: 'range',
									label: __( 'Stars', 'ever-blocks' ),
									min: 0,
									max: 5,
									step: 0.5,
									isShownByDefault: true,
								},
						  }
						: {} ),
					showName: {
						type: 'toggle',
						label: __( 'Name', 'ever-blocks' ),
						isShownByDefault: true,
					},
					showRole: {
						type: 'toggle',
						label: __( 'Role', 'ever-blocks' ),
						isShownByDefault: true,
					},
					showLogo: {
						type: 'toggle',
						label: __( 'Logo', 'ever-blocks' ),
						isShownByDefault: true,
					},
					quoteMark: {
						type: 'toggle',
						label: __( 'Quotation mark', 'ever-blocks' ),
						isShownByDefault: true,
					},
				} }
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Schema', 'ever-blocks' ) }
					panelId={ `${ clientId }-schema` }
					resetAll={ () =>
						setAttributes( { schema: false, itemReviewed: '' } )
					}
				>
					<ToolsPanelItem
						hasValue={ () => Boolean( schema ) }
						label={ __( 'Review schema', 'ever-blocks' ) }
						panelId={ `${ clientId }-schema` }
						isShownByDefault
						onDeselect={ () => setAttributes( { schema: false } ) }
					>
						<ToggleControl
							label={ __( 'Review schema', 'ever-blocks' ) }
							help={ __(
								'Adds Review structured data. Needs the reviewed item’s name.',
								'ever-blocks'
							) }
							checked={ Boolean( schema ) }
							onChange={ ( next ) =>
								setAttributes( { schema: next } )
							}
						/>
					</ToolsPanelItem>
					{ schema && (
						<ToolsPanelItem
							hasValue={ () => Boolean( itemReviewed ) }
							label={ __( 'Item reviewed', 'ever-blocks' ) }
							panelId={ `${ clientId }-schema` }
							isShownByDefault
							onDeselect={ () =>
								setAttributes( { itemReviewed: '' } )
							}
						>
							<TextControl
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
					) }
				</ToolsPanel>
			</InspectorControls>

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
							filled: {
								control: 'color',
								label: __( 'Filled', 'ever-blocks' ),
								isShownByDefault: true,
							},
							empty: {
								control: 'color',
								label: __( 'Empty', 'ever-blocks' ),
								isShownByDefault: true,
							},
						},
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
				{ ( showAvatar || showName || showRole || showLogo ) && (
					<figcaption className="eb-testimonial__author">
						{ showAvatar && (
							<Picture
								id={ avatarId }
								url={ avatarUrl }
								alt={ avatarAlt }
								className="eb-testimonial__avatar"
								label={ __( 'Photo', 'ever-blocks' ) }
								onSelect={ selectAvatar }
							/>
						) }
						{ ( showName || showRole ) && (
							<span className="eb-testimonial__who">
								{ showName && (
									<RichText
										tagName="span"
										className="eb-testimonial__name"
										value={ name }
										onChange={ ( next ) =>
											setAttributes( { name: next } )
										}
										placeholder={ __(
											'Name',
											'ever-blocks'
										) }
										allowedFormats={ [] }
									/>
								) }
								{ showRole && (
									<RichText
										tagName="span"
										className="eb-testimonial__role"
										value={ role }
										onChange={ ( next ) =>
											setAttributes( { role: next } )
										}
										placeholder={ __(
											'Role, company',
											'ever-blocks'
										) }
										allowedFormats={ [ 'core/link' ] }
									/>
								) }
							</span>
						) }
						{ showLogo && (
							<Picture
								id={ logoId }
								url={ logoUrl }
								alt={ logoAlt }
								className="eb-testimonial__logo"
								label={ __( 'Logo', 'ever-blocks' ) }
								onSelect={ selectLogo }
							/>
						) }
					</figcaption>
				) }
			</figure>
		</>
	);
}
