/**
 * Internal dependencies
 */
import classnames from 'classnames';
import Inspector from "./inspector";

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
				heading,
				content,
				imgUrl,
				name,
				position,
				backgroundColor,
				textColor,
				textAlign
			},
			isSelected,
			setAttributes
		} = this.props;

		const onUploadImage = (media) => setAttributes({imgUrl: media.url, imgId: media.id});
		const onRemoveImage = () => setAttributes({imgUrl: null});

		return (
			<Fragment>
				<Inspector
					{...{setAttributes, ...this.props}}
				/>

				<div
					style={{
						color: textColor ? textColor : '#32373c',
						backgroundColor: backgroundColor ? backgroundColor : '#f2f2f2',
					}}
					className="wp-block-ever-blocks-testimonial">

					<div className="wp-block-ever-blocks-testimonial__header">
						{!!isSelected || !!heading ? <RichText
								identifier="heading"
								placeholder={__('Very helpful', 'ever-blocks')}
								value={heading}
								multiline={false}
								className="wp-block-ever-blocks-testimonial__heading"
								onChange={(heading) => setAttributes({heading: heading})}
								keepPlaceholderOnFocus
							/>
						: null }
					</div>


					<RichText
						identifier="content"
						multiline="p"
						value={content}
						placeholder={__('Dramatically re-engineer worldwide relationships before timely growth strategies. Uniquely actualize viral ROI through.', 'ever-blocks')}
						allowedFormats={['bold', 'italic', 'strikethrough', 'link']}
						className="wp-block-ever-blocks-testimonial__content"
						onChange={(content) => setAttributes({content: content})}
						keepPlaceholderOnFocus
					/>


					<div className="wp-block-ever-blocks-testimonial__footer">

						<div className="wp-block-ever-blocks-testimonial__footer-left">

							<div className="wp-block-ever-blocks-testimonial__avatar-wrap">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onUploadImage}
										type="image"
										allowedTypes={['image']}
										value={imgUrl}
										render={({open}) => (
											<Button
												className={imgUrl ? 'eb-change-image' : 'eb-add-image'}
												onClick={open}>
												{!imgUrl ?
													<Dashicon icon="format-image"/> :
													<img className="wp-block-ever-blocks-testimonial__avatar"
														 src={imgUrl}
														 alt="avatar"
													/>
												}
											</Button>
										)}
									>
									</MediaUpload>
								</MediaUploadCheck>
							</div>
						</div>

						<div className="wp-block-ever-blocks-testimonial__footer-right">
							<RichText
								placeholder={__('John Doe', 'ever-blocks')}
								value={name}
								multiline={false}
								className="wp-block-ever-blocks-testimonial__name"
								onChange={(name) => setAttributes({name})}
								keepPlaceholderOnFocus
							/>

							<RichText
								tagName="small"
								placeholder={__('CEO', 'ever-blocks')}
								value={position}
								multiline={false}
								className="wp-block-ever-blocks-testimonial__position"
								onChange={(position) => setAttributes({position})}
								keepPlaceholderOnFocus
							/>

						</div>

					</div>
				</div>
			</Fragment>
		)
	}
}
