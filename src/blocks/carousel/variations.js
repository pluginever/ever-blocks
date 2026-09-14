import { __ } from '@wordpress/i18n';
import { scrollColumns, scrollRow, slider } from './icons';

const slides = ( n ) =>
	Array.from( { length: n }, () => [ 'ever-blocks/carousel-slide' ] );

export const LAYOUTS = [
	{
		value: 'slider',
		label: __( 'Slider', 'ever-blocks' ),
		icon: slider,
		attributes: { layout: 'slider' },
	},
	{
		value: 'row',
		label: __( 'Row', 'ever-blocks' ),
		icon: scrollRow,
		attributes: { layout: 'row', autoplay: true },
	},
	{
		value: 'columns',
		label: __( 'Columns', 'ever-blocks' ),
		icon: scrollColumns,
		attributes: { layout: 'columns', autoplay: true, speed: 30 },
	},
];

export default LAYOUTS.map( ( option ) => ( {
	name: option.value,
	title: option.label,
	icon: option.icon,
	attributes: option.attributes,
	innerBlocks: slides( 'columns' === option.value ? 6 : 4 ),
	scope: [ 'block' ],
} ) );
