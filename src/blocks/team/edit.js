/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	RichText,
	AlignmentToolbar,
	BlockControls,
	MediaUpload,
	MediaUploadCheck
} = wp.blockEditor;
const {
	Button,
	Dashicon
} = wp.components;

/**
 * Block edit function
 */
export default class edit extends Component {
	constructor() {
		super(...arguments);
	}


	render() {
		// Setup the attributes
		const {
			attributes: {
				image,
				name,
				position,
				content,
				facebook,
				twitter,
				instagram,
				pinterest,
				linkedin,
				youtube,
				web,
				backgroundColor,
				textColor,
				className
			},
			isSelected,
			setAttributes
		} = this.props;

		const onUploadImage = (media) => setAttributes({image: media.url, imgId: media.id});
		const onRemoveImage = () => setAttributes({image: null});


		const classes = classnames( className,
			'wp-block-ever-blocks-team', {} );

		const style = {

		};


		return(
			<div className={classes} style={{style}}>

				<div className="wp-block-ever-blocks-team__image-wrap">
					<MediaUpload
						onSelect={onUploadImage}
						type="image"
						allowedTypes={['image']}
						value={image}
						render={({open}) => (
							<Button
								className={image ? null : 'eb-upload-image'}
								onClick={open}>
								{ ! image ?
									<Dashicon icon="format-image"/> :
									<img className="wp-block-ever-blocks-team__avatar"
										 src={image}
										 alt="avatar"
									/>
								}
							</Button>
						)}
					>
					</MediaUpload>
				</div>

				<div className="wp-block-ever-blocks-team__body">

					<RichText
						tagName="h3"
						placeholder={__('Name', 'ever-blocks')}
						value={name}
						multiline={false}
						className="wp-block-ever-blocks-team__name"
						onChange={(name) => setAttributes({name})}
						keepPlaceholderOnFocus
					/>

					<RichText
						tagName="span"
						placeholder={__('Position', 'ever-blocks')}
						value={position}
						multiline={false}
						className="wp-block-ever-blocks-team__position"
						onChange={(position) => setAttributes({position})}
						keepPlaceholderOnFocus
					/>

					<RichText
						tagName="p"
						placeholder={__('Content', 'ever-blocks')}
						value={content}
						multiline={false}
						className="wp-block-ever-blocks-team__content"
						onChange={(content) => setAttributes({content})}
						keepPlaceholderOnFocus
					/>

				</div>

			</div>
		)
	}
}

