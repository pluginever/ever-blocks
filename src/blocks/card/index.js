import icon from "../alert/icon";

/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;
/**
 * Internal
 */
import edit from './edit';
import save from './save';

/**
 * Styles.
 */
import './styles/editor.scss';
import './styles/style.scss';


registerBlockType('ever-blocks/card', {
	title: __('Card', 'ever-blocks'),
	description: __('Add a card block.', 'ever-blocks'),
	icon: "format-quote",
	category: 'ever-blocks',
	keywords: [
		__('ever blocks', 'ever-blocks'),
		__('card', 'ever-blocks'),
		__('block', 'ever-blocks'),
	],
	example: {
		attributes: {
			title: __('Well done!', 'ever-blocks'),
			value: __('Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.', 'ever-blocks'),
		},
	},
	attributes: {
		title: {
			type: "string",
			selector: ".wp-block-ever-blocks-card__title"
		},
		content: {
			type: "string",
			source: "html",
			selector: ".wp-block-ever-blocks-card__content",
			default: ""
		},
		imgId: {
			type: "number"
		},
		imgUrl: {
			type: "string",
			source: "attribute",
			attribute: "src",
			selector: "img"
		},
	},
	edit,
	save
});
