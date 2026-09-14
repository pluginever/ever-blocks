import { registerBlockType } from '@wordpress/blocks';
import { starFilled } from '@wordpress/icons';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
	icon: starFilled,
	edit: Edit,
	save: () => null,
} );
