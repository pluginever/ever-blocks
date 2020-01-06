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

registerBlockType('ever-blocks/team', {
	title: __('Team', 'ever-blocks'),
	description: __('Add a team block.', 'ever-blocks'),
	icon: "businessman",
	category: 'ever-blocks',
	keywords: [
		__('ever blocks', 'ever-blocks'),
		__('team', 'ever-blocks'),
		__('member', 'ever-blocks'),
		__('team member', 'ever-blocks'),
	],
	styles: [
		{
			name: 'rectangular',
			label: __('Rectangular', 'ever-blocks'),
			isDefault: true,
		},
		{
			name: 'rounded',
			label: __('Rounded', 'ever-blocks'),
		},
		{
			name: 'side',
			label: __('Side', 'ever-blocks'),
		}
	],
	attributes: {
		image: {
			type: "string",
			source: "attribute",
			attribute: "src",
			selector: "img"
		},
		name:{
			type: "string",
			source: 'children',
			selector: '.wp-block-ever-blocks-team__name'
		},
		position:{
			type: "string",
			source: 'children',
			selector: '.wp-block-ever-blocks-team__position'
		},
		content: {
			type: 'array',
			selector: '.wp-block-ever-blocks-team__content',
			source: 'children'
		},
		facebook: {
			"type": "string",
			"default": ""
		},
		twitter: {
			"type": "string",
			"default": ""
		},
		instagram: {
			"type": "string",
			"default": ""
		},
		pinterest: {
			"type": "string",
			"default": ""
		},
		linkedin: {
			"type": "string",
			"default": ""
		},
		youtube: {
			"type": "string",
			"default": ""
		},
		web: {
			"type": "string",
			"default": ""
		},
		backgroundColor: {
			"type": "string"
		},
		textColor: {
			"type": "string"
		},
		className: {
			"type": "string"
		},
	},
	edit,
	save
});
