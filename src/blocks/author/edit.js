/**
 * Internal dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;

const {Component, Fragment} = wp.element;
import {mediaUpload} from '@wordpress/editor';
import {RichText, InnerBlocks, MediaUpload, MediaUploadCheck, withColors, withFontSizes} from '@wordpress/block-editor';
import {Button, Dashicon, DropZone} from '@wordpress/components';

/**
 * Internal dependencies
 */
import Controls from './controls';

export default class Edit extends Component {
	constructor() {
		super(...arguments);
		this.addImage = this.addImage.bind(this);
		this.onSelectImage = this.onSelectImage.bind(this);
	}

	onSelectImage(media) {
		if (media && media.url) {
			this.props.setAttributes({authorImgURL: media.url});
		}
	}

	addImage(files) {
		mediaUpload({
			allowedTypes: ['image'],
			filesList: files,
			onFileChange: ([media]) => this.onSelectImage(media),
		});
	}

	render() {
		const {
			attributes: {
				authorName,
				authorTitle,
				authorContent,
				authorAlignment,
				authorImgURL,
				authorImgID,
				authorImgAlt,
				authorTextColor,
				className,
				isSelected
			},
			setAttributes
		} = this.props;

		const hasImage = !!authorImgURL;

		const dropZone = (
			<DropZone
				onFilesDrop={this.addImage}
				/* translators: image to represent the post author */
				label={__('Drop to upload as avatar', 'coblocks')}
			/>
		);

		const onUploadImage = (media) => setAttributes({authorImgURL: media.url, imgId: media.id});

		// const classes = classnames(
		// 	className, {
		// 		'has-background': backgroundColor.color,
		// 		'has-text-color': textColor.color,
		// 		[ backgroundColor.class ]: backgroundColor.class,
		// 		[ textColor.class ]: textColor.class,
		// 	}
		// );

		return (
			<Fragment>
				{ isSelected && (
					<Controls
						{ ...this.props }
					/>
				) }

				<div className={className}>
					{dropZone}

						<figure className="wp-block-coblocks-author__avatar">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onUploadImage}
									allowedTypes={['image']}
									value={authorImgURL}
									render={({open}) => (
										<Button onClick={open}>
											{!authorImgURL ?
												<Dashicon icon="format-image"/> :
												<img className="wp-block-ever-blocks-author__avatar-img"
													 src={authorImgURL}
													 alt="avatar"
												/>
											}
										</Button>
									)}
								>
								</MediaUpload>
							</MediaUploadCheck>
						</figure>

					<div className={ `${ className }__content` }>
						<RichText
							identifier="name"
							multiline={ false }
							tagName="span"
							className="wp-block-ever-blocks-author__name"
							placeholder={
								__( 'Author name…', 'ever-blocks' )
							}
							value={ authorName }
							onChange={ ( authorName ) => {
								setAttributes( authorName );
							} }
							keepPlaceholderOnFocus={ true }
						/>

						<RichText
							identifier="biography"
							multiline={ false }
							tagName="p"
							className="wp-block-ever-blocks-author__biography"
							placeholder={
								__( 'Write a biography that distills objective credibility and authority to your readers…', 'ever-blocks' )
							}
							value={ authorContent }
							onChange={ ( authorContent ) => {
								setAttributes( { authorContent } );
							} }
							keepPlaceholderOnFocus={ true }
						/>
					</div>

				</div>

			</Fragment>

		)

	}
}
