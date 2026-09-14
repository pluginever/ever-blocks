const PSEUDO = /^::?[a-z][a-z-]*$/;
const CUSTOM = /^-[a-z][a-z0-9-]*$/;
const LEADING = /^([.#]?[-_a-zA-Z0-9]+|\[[^\]]+\])/;

export function isPseudoState( state: unknown ): state is string {
	return 'string' === typeof state && PSEUDO.test( state );
}

export function isCustomState( state: unknown ): state is string {
	return 'string' === typeof state && CUSTOM.test( state );
}

/**
 * Returns the part of a block-scoped selector that follows the instance selector.
 *
 * Mirrors `wp_build_state_selector()`: the leading class, id, tag or attribute
 * is the block's own root and is replaced by the instance selector, anything
 * after it is kept.
 *
 * @since 0.1.0
 * @param selector Selector from block metadata, e.g. `.wp-block-ever-blocks-icon svg`.
 * @return Selector tail, e.g. ` svg`.
 */
export function scopeSelector( selector: string ): string {
	const trimmed = selector.trim();

	if ( ! trimmed ) {
		return '';
	}

	const match = trimmed.match( LEADING );

	return match ? trimmed.slice( match[ 0 ].length ) : trimmed;
}

/**
 * Returns the part of an element selector that follows the instance selector.
 *
 * `&` stands for the instance itself; a selector starting with `:` attaches to
 * it; anything else is a descendant.
 *
 * @since 0.1.0
 * @param selector Element selector as declared, e.g. `&::backdrop` or `.eb-x__input`.
 * @return Selector tail, e.g. `::backdrop` or ` .eb-x__input`.
 */
export function elementSelector( selector: string ): string {
	const trimmed = selector.trim();

	if ( ! trimmed ) {
		return '';
	}

	if ( trimmed.startsWith( '&' ) ) {
		return trimmed.slice( 1 );
	}

	if ( /^[:>]/.test( trimmed ) ) {
		return trimmed;
	}

	return ` ${ trimmed }`;
}
