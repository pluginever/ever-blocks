import { InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { table } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import variations from './variations';
import './style.scss';

registerBlockType( metadata.name, {
	icon: table,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
	variations,
} );
