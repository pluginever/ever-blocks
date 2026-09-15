import { __, sprintf } from '@wordpress/i18n';
import { card, divided } from './icons';

const price = ( monthly, yearly ) => ( {
	monthly: {
		currency: '$',
		amount: monthly,
		period: __( '/ month', 'ever-blocks' ),
		note: __( 'Billed monthly', 'ever-blocks' ),
	},
	yearly: {
		currency: '$',
		amount: yearly,
		period: __( '/ month', 'ever-blocks' ),
		note: sprintf(
			/* translators: %s: yearly total. */
			__( '$%s billed yearly', 'ever-blocks' ),
			yearly * 12
		),
	},
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
	prices,
	button,
	link,
	features,
	featured = false,
	badge,
} ) => [
	'ever-blocks/pricing-column',
	{ featured, badge },
	[
		...( icon ? [ [ 'core/icon', { icon } ] ] : [] ),
		[ 'core/heading', { level: 3, content: name } ],
		[ 'core/paragraph', { content: description } ],
		[
			'ever-blocks/pricing-price',
			{ prices, perOption: ! ( 'default' in prices ) },
		],
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

export const blankColumn = ( options ) =>
	column( {
		name: __( 'Plan', 'ever-blocks' ),
		description: __( 'Who this plan is for.', 'ever-blocks' ),
		prices: Object.fromEntries(
			( options.length ? options : [ { slug: 'default' } ] ).map(
				( option ) => [ option.slug, { currency: '$', amount: '' } ]
			)
		),
		button: __( 'Get started', 'ever-blocks' ),
		features: [ __( 'Feature', 'ever-blocks' ) ],
	} );

export const PLANS = {
	starter: column( {
		icon: 'core/home',
		name: __( 'Starter', 'ever-blocks' ),
		description: __( 'For one site and one person.', 'ever-blocks' ),
		prices: price( 9, 7 ),
		button: __( 'Start free trial', 'ever-blocks' ),
		link: __( 'Compare all features', 'ever-blocks' ),
		features: [
			__( '1 site', 'ever-blocks' ),
			__( 'All blocks', 'ever-blocks' ),
			__( 'Email support', 'ever-blocks' ),
			[ __( 'Priority support', 'ever-blocks' ) ],
			[ __( 'White label', 'ever-blocks' ) ],
		],
	} ),
	team: column( {
		icon: 'core/people',
		name: __( 'Team', 'ever-blocks' ),
		description: __(
			'For agencies with a handful of clients.',
			'ever-blocks'
		),
		prices: price( 29, 24 ),
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
	} ),
	business: column( {
		icon: 'core/store',
		name: __( 'Business', 'ever-blocks' ),
		description: __( 'For studios shipping every week.', 'ever-blocks' ),
		prices: price( 79, 65 ),
		button: __( 'Start free trial', 'ever-blocks' ),
		link: __( 'Compare all features', 'ever-blocks' ),
		features: [
			__( '25 sites', 'ever-blocks' ),
			__( 'All blocks', 'ever-blocks' ),
			__( 'Priority support', 'ever-blocks' ),
			__( 'Pattern library', 'ever-blocks' ),
			__( 'White label', 'ever-blocks' ),
		],
	} ),
	enterprise: column( {
		icon: 'core/shield',
		name: __( 'Enterprise', 'ever-blocks' ),
		description: __(
			'Unlimited sites, a contract, an SLA.',
			'ever-blocks'
		),
		prices: {
			monthly: {
				amount: __( 'Custom', 'ever-blocks' ),
				note: __( 'Billed annually, invoiced', 'ever-blocks' ),
			},
			yearly: {
				amount: __( 'Custom', 'ever-blocks' ),
				note: __( 'Billed annually, invoiced', 'ever-blocks' ),
			},
		},
		button: __( 'Contact sales', 'ever-blocks' ),
		link: __( 'Book a demo', 'ever-blocks' ),
		features: [
			__( 'Unlimited sites', 'ever-blocks' ),
			__( 'Dedicated support', 'ever-blocks' ),
			__( 'Custom blocks', 'ever-blocks' ),
			__( 'SSO', 'ever-blocks' ),
			__( 'Invoicing', 'ever-blocks' ),
		],
	} ),
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

export const TEMPLATE = [ PLANS.starter, PLANS.team, PLANS.business ];

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
