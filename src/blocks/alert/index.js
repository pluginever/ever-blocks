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

/**
 * Styles.
 */
import './styles/editor.scss';
import './styles/style.scss';

const attributes = {
	"title": {
		"type": "string",
		"selector": ".wp-block-ever-blocks-alert__title"
	},
	"value": {
		"type": "string",
		"source": "html",
		"selector": ".wp-block-ever-blocks-alert__text",
		"default": ""
	},
	"textAlign": {
		"type": "string"
	}
};

registerBlockType('ever-blocks/alert', {
	title: __('Alert', 'ever-blocks'),
	description: __('Add a notice block.', 'ever-blocks'),
	icon: icon,
	category: 'ever-blocks',
	keywords: [
		__('ever blocks', 'ever-blocks'),
		__('notice', 'ever-blocks'),
		__('message', 'ever-blocks'),
	],
	styles: [
		{
			name: 'info',
			label: __('Info', 'ever-blocks'),
			isDefault: true,
		},
		{
			name: 'success',
			label: __('Success', 'ever-blocks'),
		},
		{
			name: 'warning',
			label: __('Warning', 'ever-blocks'),
		},
		{
			name: 'error',
			label: __('Error', 'ever-blocks'),
		},
	],
	example: {
		attributes: {
			title: __( 'Well done!', 'ever-blocks' ),
			value: __( 'Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.', 'ever-blocks' ),
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
