import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { megaphone } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import variations from './variations';
import './style.scss';

registerBlockType( metadata.name, {
	icon: megaphone,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
	variations,
	styles: [
		{ name: 'solid', label: __( 'Solid', 'ever-blocks' ), isDefault: true },
		{ name: 'line', label: __( 'Line', 'ever-blocks' ) },
		{ name: 'inset', label: __( 'Inset', 'ever-blocks' ) },
	],
} );
