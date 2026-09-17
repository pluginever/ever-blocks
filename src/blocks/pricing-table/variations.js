import { __, sprintf } from '@wordpress/i18n';
import { card, divided } from './icons';

const monthly = ( amount ) => ( {
	currency: '$',
	amount: String( amount ),
	period: __( '/ month', 'ever-blocks' ),
	note: __( 'Billed monthly', 'ever-blocks' ),
} );

const yearly = ( amount ) => ( {
	currency: '$',
	amount: String( amount ),
	period: __( '/ month', 'ever-blocks' ),
	note: sprintf(
		/* translators: %s: yearly total. */
		__( '$%s billed yearly', 'ever-blocks' ),
		amount * 12
	),
} );

const list = ( features ) => [
	'core/list',
	{},
	features.map( ( feature ) =>
		Array.isArray( feature )
			? [
					'core/list-item',
					{ content: feature[ 0 ], className: 'is-style-excluded' },
			  ]
			: [ 'core/list-item', { content: feature } ]
	),
];

export const column = ( {
	icon,
	name,
	description,
	price,
	button,
	link,
	features,
	featured = false,
	badge,
	option = '',
} ) => [
	'ever-blocks/pricing-column',
	{ featured, badge, option },
	[
		...( icon ? [ [ 'core/icon', { icon } ] ] : [] ),
		[ 'core/heading', { level: 3, content: name } ],
		[ 'core/paragraph', { content: description } ],
		[ 'ever-blocks/pricing-price', price ],
		[
			'core/buttons',
			{},
			[
				[
					'core/button',
					{
						text: button,
						width: 100,
						className: featured ? undefined : 'is-style-outline',
					},
				],
			],
		],
		...( link
			? [ [ 'core/paragraph', { content: `<a href="#">${ link }</a>` } ] ]
			: [] ),
		list( features ),
	],
];

export const blankColumn = ( option = '' ) =>
	column( {
		name: __( 'Plan', 'ever-blocks' ),
		description: __( 'Who this plan is for.', 'ever-blocks' ),
		price: { currency: '$' },
		button: __( 'Get started', 'ever-blocks' ),
		features: [ __( 'Feature', 'ever-blocks' ) ],
		option,
	} );

const PLANS = {
	starter: {
		icon: 'core/home',
		name: __( 'Starter', 'ever-blocks' ),
		description: __( 'For one site and one person.', 'ever-blocks' ),
		button: __( 'Start free trial', 'ever-blocks' ),
		link: __( 'Compare all features', 'ever-blocks' ),
		features: [
			__( '1 site', 'ever-blocks' ),
			__( 'All blocks', 'ever-blocks' ),
			__( 'Email support', 'ever-blocks' ),
			[ __( 'Priority support', 'ever-blocks' ) ],
			[ __( 'White label', 'ever-blocks' ) ],
		],
	},
	team: {
		icon: 'core/people',
		name: __( 'Team', 'ever-blocks' ),
		description: __(
			'For agencies with a handful of clients.',
			'ever-blocks'
		),
		button: __( 'Start free trial', 'ever-blocks' ),
		link: __( 'Compare all features', 'ever-blocks' ),
		features: [
			__( '5 sites', 'ever-blocks' ),
			__( 'All blocks', 'ever-blocks' ),
			__( 'Priority support', 'ever-blocks' ),
			__( 'Pattern library', 'ever-blocks' ),
			[ __( 'White label', 'ever-blocks' ) ],
		],
		featured: true,
		badge: __( 'Most popular', 'ever-blocks' ),
	},
	business: {
		icon: 'core/store',
		name: __( 'Business', 'ever-blocks' ),
		description: __( 'For studios shipping every week.', 'ever-blocks' ),
		button: __( 'Start free trial', 'ever-blocks' ),
		link: __( 'Compare all features', 'ever-blocks' ),
		features: [
			__( '25 sites', 'ever-blocks' ),
			__( 'All blocks', 'ever-blocks' ),
			__( 'Priority support', 'ever-blocks' ),
			__( 'Pattern library', 'ever-blocks' ),
			__( 'White label', 'ever-blocks' ),
		],
	},
};

export const OPTIONS = [
	{ slug: 'monthly', label: __( 'Monthly', 'ever-blocks' ) },
	{
		slug: 'yearly',
		label: __( 'Yearly', 'ever-blocks' ),
		badge: __( 'Save 20%', 'ever-blocks' ),
	},
];

export const LAYOUTS = [
	{
		value: 'card',
		label: __( 'Card', 'ever-blocks' ),
		icon: card,
		attributes: { layout: 'card' },
	},
	{
		value: 'divided',
		label: __( 'Divided', 'ever-blocks' ),
		icon: divided,
		attributes: { layout: 'divided' },
	},
];

export const TEMPLATE = [
	column( { ...PLANS.starter, option: 'monthly', price: monthly( 9 ) } ),
	column( { ...PLANS.team, option: 'monthly', price: monthly( 29 ) } ),
	column( { ...PLANS.business, option: 'monthly', price: monthly( 79 ) } ),
	column( { ...PLANS.starter, option: 'yearly', price: yearly( 7 ) } ),
	column( { ...PLANS.team, option: 'yearly', price: yearly( 24 ) } ),
	column( { ...PLANS.business, option: 'yearly', price: yearly( 65 ) } ),
];

export default LAYOUTS.map( ( option ) => ( {
	name: option.value,
	title: __( 'Pricing Table', 'ever-blocks' ),
	description: option.label,
	icon: option.icon,
	attributes: { ...option.attributes, options: OPTIONS, active: 'yearly' },
	innerBlocks: TEMPLATE,
	scope: [ 'block' ],
	isActive: ( attributes ) => attributes.layout === option.value,
} ) );
