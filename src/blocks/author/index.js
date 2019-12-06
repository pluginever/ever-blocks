/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;
const {Component, Fragment} = wp.element;
import {mediaUpload} from '@wordpress/editor';
import {RichText, InnerBlocks, MediaUpload, MediaUploadCheck, withColors, withFontSizes} from '@wordpress/block-editor';
import {Button, Dashicon, DropZone} from '@wordpress/components';


/**
 * Styles.
 */
import './styles/editor.scss';
import './styles/style.scss';

const attributes = {
	image: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: 'img'
	},
	name: {
		type: 'array',
		source: 'children',
		selector: '.wp-block-ever-blocks-author__name'
	},
	biography: {
		type: 'array',
		selector: '.wp-block-ever-blocks-author__biography',
		source: 'children'
	},

};
registerBlockType('ever-blocks/author', {
	title: __('Author', 'ever-blocks'),
	description: __('Add a author box with bio info and social media links.', 'ever-blocks'),
	icon: 'admin-users',
	category: 'ever-blocks',
	keywords: [
		__('ever blocks', 'ever-blocks'),
		__('author', 'ever-blocks'),
		__('bio', 'ever-blocks'),
	],
	example: {
		attributes: {
			title: __('Well done!', 'ever-blocks'),
			value: __('Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.', 'ever-blocks'),
		},
	},
	attributes,
	edit: props => {
		const {
			attributes: {image, biography, name},
			setAttributes,
			isSelected
		} = props;

		const onSelectMedia = media => {
			const image = media.sizes.medium ? media.sizes.medium.url : media.url;
			setAttributes({image});
		};

		return (
			<Fragment>
				<div className="wp-block-ever-blocks-author">

					<div className="wp-block-ever-blocks-author__avatar_column">
						<div className="wp-block-ever-blocks-author__avatar-wrap">
							<MediaUpload
								onSelect={onSelectMedia}
								allowedTypes={['image']}
								value={image}
								render={({open}) => (
									<Button onClick={open}>
										{!image ?
											<Dashicon icon="format-image"/> :
											<img className="wp-block-ever-blocks-author__avatar-img"
												 src={image}
												 alt="avatar"
											/>
										}
									</Button>
								)}
							>
							</MediaUpload>
						</div>
					</div>

					<div className="wp-block-ever-blocks-author__content_column">
						<RichText
							identifier="name"
							multiline={false}
							tagName="span"
							className="wp-block-ever-blocks-author__name"
							placeholder={
								__('Author name…', 'ever-blocks')
							}
							value={name}
							onChange={(name) => {
								setAttributes(name);
							}}
							keepPlaceholderOnFocus={true}
						/>

						<RichText
							identifier="biography"
							multiline={false}
							tagName="p"
							className="wp-block-ever-blocks-author__biography"
							placeholder={
								__('Write a biography that distills objective credibility and authority to your readers…', 'ever-blocks')
							}
							value={biography}
							onChange={(biography) => {
								setAttributes({biography});
							}}
							keepPlaceholderOnFocus={true}
						/>
					</div>
				</div>
			</Fragment>
		)

	},
	save: props => {
		const {
			image,
			name,
			biography
		} = props.attributes;
		return (
			<div className="wp-block-ever-blocks-author">
				{image && <div className="wp-block-ever-blocks-author__avatar_column">
					<div className="wp-block-ever-blocks-author__avatar-wrap">
						<img className="wp-block-ever-blocks-author__avatar-img"
							 src={image}
							 alt="avatar"
						/>
					</div>
				</div>}

				<div className="wp-block-ever-blocks-author__content_column">
					{name && <span className="wp-block-ever-blocks-author__name">
						{name}
					</span>}

					{biography && <p className="wp-block-ever-blocks-author__biography">
						{biography}
					</p>}
				</div>


			</div>
		)
	}
});
