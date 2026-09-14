const PSEUDO = /^::?[a-z][a-z-]*$/;
const CUSTOM = /^-[a-z][a-z0-9-]*$/;
const LEADING = /^([.#]?[-_a-zA-Z0-9]+|\[[^\]]+\])/;

export function isPseudoState( state: unknown ): state is string {
	return 'string' === typeof state && PSEUDO.test( state );
}

export function isCustomState( state: unknown ): state is string {
	return 'string' === typeof state && CUSTOM.test( state );
}

// Mirrors `wp_split_selector_list()`.
export function splitSelectorList( selector: string ): string[] {
	if ( ! selector.includes( ',' ) ) {
		return [ selector ];
	}

	const selectors: string[] = [];
	let current = '';
	let depth = 0;

	for ( const character of selector ) {
		if ( '(' === character ) {
			depth++;
		} else if ( ')' === character && depth > 0 ) {
			depth--;
		} else if ( ',' === character && 0 === depth ) {
			selectors.push( current );
			current = '';
			continue;
		}

		current += character;
	}

	selectors.push( current );

	return selectors;
}

// Mirrors `wp_build_state_selector()`.
export function buildStateSelector(
	base: string,
	selector: string,
	state: string
): string {
	if ( ! selector.trim() ) {
		return base + state;
	}

	const scoped: string[] = [];

	for ( const part of splitSelectorList( selector ) ) {
		const trimmed = part.trim();

		if ( ! trimmed ) {
			continue;
		}

		const match = trimmed.match( LEADING );

		scoped.push(
			match
				? base + trimmed.slice( match[ 0 ].length ) + state
				: base + state
		);
	}

	return scoped.length ? scoped.join( ', ' ) : base + state;
}

/**
 * Nests one `&` selector list inside another.
 *
 * @since 0.1.0
 * @param outer Selector list the inner one attaches to, e.g. `&.is-open, &[open]`.
 * @param inner Selector list with `&` standing for the outer one, e.g. `& .input`.
 * @return Selector list, e.g. `&.is-open .input, &[open] .input`.
 */
export function scopeSelector( outer: string, inner: string ): string {
	const selectors: string[] = [];

	for ( const outerPart of splitSelectorList( outer ) ) {
		for ( const innerPart of splitSelectorList( inner ) ) {
			selectors.push( innerPart.trim().replace( '&', outerPart.trim() ) );
		}
	}

	return selectors.join( ', ' );
}

/**
 * Returns an element selector as a `&` selector relative to the instance.
 *
 * `&` stands for the instance itself; a selector starting with `:` or `>`
 * attaches to it; anything else is a descendant.
 *
 * @since 0.1.0
 * @param selector Element selector as declared, e.g. `&::backdrop` or `.eb-x__input`.
 * @return Selector, e.g. `&::backdrop` or `& .eb-x__input`.
 */
export function elementSelector( selector: string ): string {
	const trimmed = selector.trim();

	if ( trimmed.startsWith( '&' ) ) {
		return trimmed;
	}

	if ( /^[:>]/.test( trimmed ) ) {
		return `&${ trimmed }`;
	}

	return `& ${ trimmed }`;
}
