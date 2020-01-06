/**
 * WordPress dependencies
 */
const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;
/**
 * Internal
 */
import icon from './icon';
import edit from './edit';
import save from './save';

// Import CSS
import './styles/style.scss';
import './styles/editor.scss';

const attributes = {
	heading: {
		"type": "string",
		"selector": ".wp-block-eb-testimonial__heading"
	},
	content: {
		"type": "string",
		"selector": ".wp-block-eb-testimonial__content"
	},
	imgURL: {
		"type": 'string',
		"source": 'attribute',
		"attribute": 'src',
		"selector": 'img'
	},
	name: {
		"type": "string",
		"selector": ".wp-block-eb-testimonial__name"
	},
	position: {
		"type": "string",
		"selector": ".wp-block-eb-testimonial__position"
	},
	backgroundColor: {
		type: 'string',
		default: '#f2f2f2'
	},
	headingTextColor: {
		type: 'string',
		default: '#32373c'
	},
	textColor: {
		type: 'string',
		default: '#32373c'
	}
};


registerBlockType('ever-blocks/testimonial', {
	title: __('Testimonial', 'ever-blocks'),
	description: __('Add a notice block.', 'ever-blocks'),
	icon: "format-quote",
	category: 'ever-blocks',
	keywords: [
		__('testimonial', 'ever-blocks'),
	],
	styles: [],
	example: {
		attributes: {
			title: __('Very helpful', 'ever-blocks'),
			content: __('Dramatically re-engineer worldwide relationships before timely growth strategies. Uniquely actualize viral ROI through.', 'ever-blocks'),
		},
	},
	supports: {
		align: true,
		alignWide: false,
		alignFull: false,
	},
	attributes,
	edit,
	save
});
