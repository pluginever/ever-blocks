import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { quote } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
	icon: quote,
	edit: Edit,
	save: () => null,
	styles: [ { name: 'bubble', label: __( 'Bubble', 'ever-blocks' ) } ],
	example: {
		attributes: {
			quote: __(
				'We replaced three plugins with this one and the site got faster.',
				'ever-blocks'
			),
			name: __( 'Maya Ortiz', 'ever-blocks' ),
			role: __( 'Product lead, Northwind', 'ever-blocks' ),
			rating: 5,
		},
	},
} );
