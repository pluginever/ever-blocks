import { registerBlockType } from '@wordpress/blocks';
import { search } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './style.scss';

registerBlockType( metadata.name, {
	icon: search,
	edit: Edit,
	save,
} );
