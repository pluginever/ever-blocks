import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { columns } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
	icon: columns,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
