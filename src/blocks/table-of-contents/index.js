import { registerBlockType } from '@wordpress/blocks';
import { listView } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import './heading';
import './style.scss';

registerBlockType( metadata.name, {
	icon: listView,
	edit: Edit,
	save: () => null,
} );
