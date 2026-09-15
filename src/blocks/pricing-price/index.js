import { registerBlockType } from '@wordpress/blocks';
import { tag } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
	icon: tag,
	edit: Edit,
	save: () => null,
} );
