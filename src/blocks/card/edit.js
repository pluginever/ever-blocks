/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {
	Component,
	Fragment
} = wp.element;

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
export default class Edit extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		// Setup the attributes
		const {
			attributes: {
				title,
				content,
				imgUrl
			},
			isSelected,
			setAttributes
		} = this.props;

		const onUploadImage = (media) => setAttributes({imgUrl: media.url, imgId: media.id});
		const onRemoveImage = () => setAttributes({imgUrl: null});

		return (
			<Fragment>
				<div className="wp-block-ever-blocks-card">

					<MediaUpload
						onSelect={onUploadImage}
						type="image"
						allowedTypes={['image']}
						value={imgUrl}
						render={({open}) => (
							<Button
								className={imgUrl ? null : 'eb-upload-image'}
								onClick={open}>
								{ ! imgUrl ?
									<Dashicon icon="format-image"/> :
									<img className="wp-block-ever-blocks-card__cover"
										 src={imgUrl}
										 alt="avatar"
									/>
								}
							</Button>
						)}
					>
					</MediaUpload>

					<div className="wp-block-ever-blocks-card__body">
						<RichText
							tagName="h3"
							placeholder={__('Card Title', 'ever-blocks')}
							value={title}
							multiline={false}
							className="wp-block-ever-blocks-card__title"
							onChange={(title) => setAttributes({title})}
							keepPlaceholderOnFocus
						/>
						<RichText
							identifier="content"
							multiline="p"
							value={content}
							placeholder={__('Card content', 'ever-blocks')}
							allowedFormats={['bold', 'italic', 'strikethrough', 'link']}
							className="wp-block-ever-blocks-card__content"
							onChange={(content) => setAttributes({content: content})}
							keepPlaceholderOnFocus
						/>

					</div>
				</div>
			</Fragment>
		)

	}

}
