/**
 * Values offered as their own toggle.
 *
 * @since 0.1.0
 */
export const REL_VALUES = {
	nofollow: 'nofollow',
	sponsored: 'sponsored',
	noreferrer: 'noreferrer',
} as const;

export type RelValue = keyof typeof REL_VALUES;

/**
 * The value a new-tab link carries, which the author does not toggle directly.
 *
 * Core still writes this and strips it again when the link stops opening in a
 * new tab (`block-library/src/button/constants.js`, `NEW_TAB_REL`), so a link
 * built here behaves the same as `core/button`.
 *
 * @since 0.1.0
 */
export const NEW_TAB_REL = 'noopener';

/**
 * Returns a `rel` string as its values, in order and without duplicates.
 *
 * @since 0.1.0
 * @param rel Current `rel` attribute.
 * @return The values.
 */
function values( rel: string | undefined ): string[] {
	const found = ( rel ?? '' ).split( /\s+/ ).filter( Boolean );

	return found.filter( ( value, index ) => found.indexOf( value ) === index );
}

/**
 * Returns whether a `rel` string carries a value.
 *
 * @since 0.1.0
 * @param rel   Current `rel` attribute.
 * @param value Value to look for.
 * @return Whether the value is present.
 */
export function hasRel( rel: string | undefined, value: string ): boolean {
	return values( rel ).includes( value );
}

/**
 * Returns a `rel` string with one value added or removed.
 *
 * Order is preserved, so toggling twice returns the string the author started
 * with rather than reordering values this control does not own.
 *
 * @since 0.1.0
 * @param rel   Current `rel` attribute.
 * @param value Value to toggle.
 * @param on    Whether the value should be present.
 * @return The new `rel`, or undefined when nothing is left.
 */
export function toggleRel(
	rel: string | undefined,
	value: string,
	on: boolean
): string | undefined {
	const next = values( rel ).filter( ( item ) => item !== value );

	if ( on ) {
		next.push( value );
	}

	return next.length ? next.join( ' ' ) : undefined;
}
