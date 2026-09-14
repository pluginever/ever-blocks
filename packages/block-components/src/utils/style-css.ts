/**
 * External dependencies
 */
import { getCSSRules, getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Internal dependencies
 */
import { elementSelector, isPseudoState, scopeSelector } from './selectors';
import type { BlockDeclaration, StyleObject, StyleRule } from '../types';

const isRecord = ( value: unknown ): value is StyleObject =>
	Boolean( value ) && 'object' === typeof value && ! Array.isArray( value );

const toKebab = ( value: string ): string =>
	value.replace( /([a-z0-9])([A-Z])/g, '$1-$2' ).toLowerCase();

const omit = ( source: StyleObject, keys: string[] ): StyleObject => {
	const next = { ...source };

	for ( const key of keys ) {
		delete next[ key ];
	}

	return next;
};

/**
 * Returns the key inside `style` that holds a block's own values.
 *
 * Derived from the block's own namespace, which WordPress already keeps unique
 * per plugin, so two plugins using this package can never read or overwrite each
 * other's values. Core compiles the features it knows and ignores the rest, so
 * these ride its attribute and inherit its per-viewport shape for free.
 *
 * @since 0.1.0
 * @param name Block name.
 * @return Namespace, or an empty string when the block name is unusable.
 */
export function getNamespace( name: string ): string {
	const separator = name.indexOf( '/' );

	if ( separator < 1 ) {
		return '';
	}

	const vendor = name.slice( 0, separator );

	if ( ! /^[a-z][a-z0-9-]*$/.test( vendor ) ) {
		return '';
	}

	return vendor.replace( /-([a-z0-9])/g, ( _match, character ) =>
		character.toUpperCase()
	);
}

/**
 * Returns the custom property a block's own value is written to.
 *
 * The name is derived rather than mapped so an editor and a server cannot
 * disagree about it. Keys come from block attributes, so anything that is not a
 * plain identifier is refused before it reaches a declaration.
 *
 * @since 0.1.0
 * @param name    Block name.
 * @param key     Value name.
 * @param element Element the value belongs to, or empty for the root.
 * @return Custom property, or an empty string when any part is unusable.
 */
export function getProperty( name: string, key: string, element = '' ): string {
	const separator = name.indexOf( '/' );

	if ( separator < 1 || ! /^[a-zA-Z][a-zA-Z0-9]*$/.test( key ) ) {
		return '';
	}

	if ( element && ! /^[a-z][a-zA-Z0-9]*$/.test( element ) ) {
		return '';
	}

	const vendor = name.slice( 0, separator );
	const slug = name.slice( separator + 1 );

	if (
		! /^[a-z][a-z0-9-]*$/.test( vendor ) ||
		! /^[a-z][a-z0-9-]*$/.test( slug )
	) {
		return '';
	}

	return `--${ [ vendor, slug, toKebab( element ), toKebab( key ) ]
		.filter( Boolean )
		.join( '-' ) }`;
}

/**
 * Returns the declarations for the values written to custom properties.
 *
 * @since 0.1.0
 * @param values  Values from one state of the namespace.
 * @param name    Block name.
 * @param element Element the values belong to, or empty for the root.
 * @return Custom properties, or undefined when none are set.
 */
export function getVars(
	values: unknown,
	name: string,
	element = ''
): Record< string, string > | undefined {
	if ( ! isRecord( values ) ) {
		return undefined;
	}

	const style: Record< string, string > = {};

	for ( const [ key, value ] of Object.entries( values ) ) {
		if (
			undefined === value ||
			null === value ||
			'' === value ||
			'object' === typeof value
		) {
			continue;
		}

		const property = getProperty( name, key, element );

		if ( property ) {
			style[ property ] = String(
				getCSSValueFromRawStyle( String( value ) )
			);
		}
	}

	return Object.keys( style ).length ? style : undefined;
}

/**
 * States to render as if they were the default, keyed by element name.
 *
 * The root is the empty key. Used by the canvas so an author editing a hover
 * colour sees it without hovering.
 */
export type StatePreview = Partial< Record< string, string > >;

/**
 * Compiles every rule an instance needs beyond what core's block supports write.
 *
 * Walks the attribute in core's own order — viewport, then custom state, then
 * element, then pseudo-state — and only compiles the states and elements the
 * block declares in its `block.json`. Mirrors the server's compiler rule for
 * rule; the parity fixtures hold both to the same output.
 *
 * @since 0.1.0
 * @param style       Block style attribute.
 * @param name        Block name.
 * @param declaration The block's declaration, from `getDeclaration()`.
 * @param queries     Viewport media queries keyed by state name.
 * @param preview     States to also emit without their selector, for the canvas.
 * @return Rules with selector tails relative to the instance.
 */
export function compileStyle(
	style: StyleObject | undefined,
	name: string,
	declaration: BlockDeclaration,
	queries: Partial< Record< string, string > >,
	preview: StatePreview = {}
): StyleRule[] {
	const rules: StyleRule[] = [];
	const key = getNamespace( name );
	const scopes: Array< [ string, string ] > = [
		[ '', '' ],
		...Object.entries( queries ).map(
			( [ viewport, query ] ): [ string, string ] => [
				viewport,
				query ?? '',
			]
		),
	];

	for ( const [ viewport, query ] of scopes ) {
		const scope = '' === viewport ? style : style?.[ viewport ];

		if ( ! isRecord( scope ) || ! Object.keys( scope ).length ) {
			continue;
		}

		compileScope(
			rules,
			scope,
			'',
			name,
			key,
			declaration,
			query,
			preview
		);

		for ( const state of Object.keys( declaration.states ) ) {
			if ( isRecord( scope[ state ] ) ) {
				compileScope(
					rules,
					scope[ state ],
					state,
					name,
					key,
					declaration,
					query,
					preview
				);
			}
		}
	}

	return rules;
}

/**
 * Serialises compiled rules for one instance.
 *
 * State declarations carry `!important` because they have to beat the inline
 * styles core writes for the base state, on the canvas and the front end alike.
 *
 * @since 0.1.0
 * @param rules    Compiled rules.
 * @param selector Instance selector the tails attach to.
 * @return CSS, or an empty string.
 */
export function toCSS( rules: StyleRule[], selector: string ): string {
	const css: string[] = [];

	for ( const rule of rules ) {
		const declarations = rule.important
			? withStateFallbacks( rule.declarations )
			: Object.entries( rule.declarations ).map(
					( [ property, value ] ) => `${ property }:${ value };`
			  );

		if ( ! declarations.length ) {
			continue;
		}

		const block = `${ selector }${ rule.selector }{${ declarations.join(
			''
		) }}`;

		css.push( rule.query ? `${ rule.query }{${ block }}` : block );
	}

	return css.join( '' );
}

function compileScope(
	rules: StyleRule[],
	scope: StyleObject,
	state: string,
	name: string,
	key: string,
	declaration: BlockDeclaration,
	query: string,
	preview: StatePreview,
	previewing = false
): void {
	if ( '' !== state && ! previewing && preview[ '' ] === state ) {
		compileScope(
			rules,
			scope,
			state,
			name,
			key,
			declaration,
			query,
			preview,
			true
		);
	}

	const isPseudo = isPseudoState( state );
	const stateSelector = isPseudo
		? state
		: scopeSelector( declaration.states[ state ] ?? '' );
	const selector = previewing ? '' : stateSelector;
	const vars = getVars( scope[ key ], name );

	if ( vars ) {
		rules.push( { selector, declarations: vars, query, important: false } );
	}

	if ( '' !== state ) {
		const node = omit( scope, [
			'elements',
			key,
			...Object.keys( declaration.states ),
		] );

		for ( const group of getStateStyleGroups(
			node,
			declaration.selectors
		) ) {
			const declarations = getFeatureDeclarations( group.style, true );

			if ( ! Object.keys( declarations ).length ) {
				continue;
			}

			const tail = scopeSelector( group.selector );

			rules.push( {
				selector: isPseudo ? tail + selector : selector + tail,
				declarations,
				query,
				important: true,
			} );
		}
	}

	if ( ! isRecord( scope.elements ) ) {
		return;
	}

	for ( const [ element, declared ] of Object.entries(
		declaration.elements
	) ) {
		const node = scope.elements[ element ];

		if ( ! isRecord( node ) || ! Object.keys( node ).length ) {
			continue;
		}

		const base = selector + elementSelector( declared.selector );

		compileElement(
			rules,
			node,
			base,
			'',
			name,
			key,
			element,
			declared.states,
			query
		);

		for ( const pseudo of declared.states ) {
			if ( ! isRecord( node[ pseudo ] ) ) {
				continue;
			}

			compileElement(
				rules,
				node[ pseudo ],
				base + pseudo,
				pseudo,
				name,
				key,
				element,
				declared.states,
				query
			);

			if ( preview[ element ] === pseudo ) {
				compileElement(
					rules,
					node[ pseudo ],
					base,
					pseudo,
					name,
					key,
					element,
					declared.states,
					query
				);
			}
		}
	}
}

function compileElement(
	rules: StyleRule[],
	node: StyleObject,
	selector: string,
	pseudo: string,
	name: string,
	key: string,
	element: string,
	states: string[],
	query: string
): void {
	const vars = getVars( node[ key ], name, element );

	if ( vars ) {
		rules.push( { selector, declarations: vars, query, important: false } );
	}

	const features = omit( node, [ key, ...( '' === pseudo ? states : [] ) ] );
	const declarations = getFeatureDeclarations( features, false );

	if ( Object.keys( declarations ).length ) {
		rules.push( { selector, declarations, query, important: false } );
	}
}

interface StyleGroup {
	selector: string;
	style: StyleObject;
}

/**
 * Splits a state's style by the feature selectors block.json declares.
 *
 * Mirrors `wp_get_state_style_groups()`.
 *
 * @param style     Style object for one state.
 * @param selectors Block selectors from block.json.
 * @return Groups of style keyed by the selector they target.
 */
function getStateStyleGroups(
	style: StyleObject,
	selectors: Record< string, unknown >
): StyleGroup[] {
	const groups: StyleGroup[] = [];
	const root = 'string' === typeof selectors.root ? selectors.root : '';

	const add = ( selector: string, part: StyleObject ) => {
		const existing = groups.find(
			( group ) => group.selector === selector
		);

		if ( existing ) {
			existing.style = { ...existing.style, ...part };
			return;
		}

		groups.push( { selector, style: part } );
	};

	for ( const [ feature, featureStyles ] of Object.entries( style ) ) {
		const featureSelectors = selectors[ feature ];

		if ( 'string' === typeof featureSelectors ) {
			add( featureSelectors, { [ feature ]: featureStyles } );
			continue;
		}

		if ( isRecord( featureSelectors ) && isRecord( featureStyles ) ) {
			const remaining = { ...featureStyles };

			for ( const [ sub, subSelector ] of Object.entries(
				featureSelectors
			) ) {
				if (
					'root' === sub ||
					'string' !== typeof subSelector ||
					! ( sub in featureStyles )
				) {
					continue;
				}

				add( subSelector, {
					[ feature ]: { [ sub ]: featureStyles[ sub ] },
				} );
				delete remaining[ sub ];
			}

			if ( Object.keys( remaining ).length ) {
				add(
					'string' === typeof featureSelectors.root
						? featureSelectors.root
						: root,
					{ [ feature ]: remaining }
				);
			}

			continue;
		}

		add( root, { [ feature ]: featureStyles } );
	}

	return groups;
}

/**
 * Compiles core features to declarations the way the server's style engine does.
 *
 * `text-align` is class-based on the base state, so a state needs it as a
 * declaration — the same exception `wp_add_block_state_style_rule()` makes.
 *
 * @param style   Style object holding core features only.
 * @param isState Whether the style belongs to a state.
 * @return Declarations keyed by CSS property.
 */
function getFeatureDeclarations(
	style: StyleObject,
	isState: boolean
): Record< string, string > {
	const declarations: Record< string, string > = {};

	for ( const rule of getCSSRules( omit( style, [ 'layout' ] ) as never ) ) {
		declarations[ toKebab( rule.key ) ] = String( rule.value );
	}

	const textAlign = isRecord( style.typography )
		? style.typography.textAlign
		: undefined;

	if ( isState && 'string' === typeof textAlign && textAlign.trim() ) {
		declarations[ 'text-align' ] = textAlign;
	}

	return declarations;
}

/**
 * Applies the resets core adds to state declarations, and marks them important.
 *
 * Mirrors `wp_get_state_declarations_with_background_resets()` and
 * `wp_get_state_declarations_with_fallback_border_styles()`.
 *
 * @param declarations Declarations for a state.
 * @return Serialised declarations.
 */
function withStateFallbacks(
	declarations: Record< string, string >
): string[] {
	const important = { ...declarations };
	const hasBackgroundColor = Boolean( important[ 'background-color' ] );
	const hasBackground = Boolean( important.background );
	const hasBackgroundImage = Boolean( important[ 'background-image' ] );

	if ( hasBackgroundColor && ! hasBackground && ! hasBackgroundImage ) {
		important[ 'background-image' ] = 'unset';
	}

	const out = Object.entries( important ).map(
		( [ property, value ] ) => `${ property }:${ value } !important;`
	);

	const hasBorderStyle = Boolean( declarations[ 'border-style' ] );
	const hasBorderColor = Boolean( declarations[ 'border-color' ] );
	const hasBorderWidth = Boolean( declarations[ 'border-width' ] );

	if ( ! hasBorderStyle && ( hasBorderColor || hasBorderWidth ) ) {
		out.push( 'border-style:solid;' );
	}

	for ( const side of [ 'top', 'right', 'bottom', 'left' ] ) {
		const hasSideStyle = Boolean(
			declarations[ `border-${ side }-style` ]
		);
		const hasSideColor = Boolean(
			declarations[ `border-${ side }-color` ]
		);
		const hasSideWidth = Boolean(
			declarations[ `border-${ side }-width` ]
		);

		if ( ! hasSideStyle && ( hasSideColor || hasSideWidth ) ) {
			out.push( `border-${ side }-style:solid;` );
		}
	}

	return out;
}
