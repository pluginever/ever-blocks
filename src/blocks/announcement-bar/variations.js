import { __ } from '@wordpress/i18n';
import { rotate, still, ticker } from './icons';

const message = ( text ) => [
	'ever-blocks/announcement',
	{},
	[ [ 'core/paragraph', { content: text } ] ],
];

export const ANIMATIONS = [
	{
		value: 'static',
		label: __( 'Static', 'ever-blocks' ),
		icon: still,
		attributes: { animation: 'static' },
		innerBlocks: [
			message(
				__( 'Free shipping on every order this week.', 'ever-blocks' )
			),
		],
	},
	{
		value: 'ticker',
		label: __( 'Ticker', 'ever-blocks' ),
		icon: ticker,
		attributes: { animation: 'ticker', direction: 'left' },
		innerBlocks: [
			message(
				__( 'Free shipping on every order this week', 'ever-blocks' )
			),
			message(
				__( 'New: the Pricing Table block is out', 'ever-blocks' )
			),
			message(
				__( 'Support hours extended to weekends', 'ever-blocks' )
			),
		],
	},
	{
		value: 'rotate',
		label: __( 'Rotate', 'ever-blocks' ),
		icon: rotate,
		attributes: { animation: 'rotate', direction: 'up' },
		innerBlocks: [
			message(
				__( 'Free shipping on every order this week', 'ever-blocks' )
			),
			message(
				__( 'New: the Pricing Table block is out', 'ever-blocks' )
			),
			message(
				__( 'Support hours extended to weekends', 'ever-blocks' )
			),
		],
	},
];

export default ANIMATIONS.map( ( option ) => ( {
	name: option.value,
	title: option.label,
	icon: option.icon,
	attributes: option.attributes,
	innerBlocks: option.innerBlocks,
	scope: [ 'block' ],
	isActive: ( attributes ) => attributes.animation === option.value,
} ) );
