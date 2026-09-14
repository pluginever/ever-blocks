/**
 * Internal dependencies
 */
import { isCustomState } from './selectors';
import type { StyleObject, StyleState } from '../types';

/**
 * Returns the path into a style attribute for a state and element.
 *
 * Core reads the viewport first, then a custom state, then the element, then
 * the pseudo-state: `style['@mobile']['-open'].elements.link[':hover']` — see
 * `block-supports/states.php` and `WP_Theme_JSON::get_block_nodes()`. Without
 * an element the state sits directly under the viewport.
 *
 * @since 0.1.0
 * @param state   Selected style state.
 * @param element Element name, or an empty string for the block root.
 * @return Object path.
 */
export function getStylePath( state: StyleState, element = '' ): string[] {
	const path: string[] = [];
	const custom = isCustomState( state.pseudo );

	if ( 'default' !== state.viewport ) {
		path.push( state.viewport );
	}

	if ( custom ) {
		path.push( state.pseudo );
	}

	if ( element ) {
		path.push( 'elements', element );
	}

	if ( 'default' !== state.pseudo && ! custom ) {
		path.push( state.pseudo );
	}

	return path;
}

/**
 * Reads the style object stored at a path.
 *
 * @since 0.1.0
 * @param style Style attribute.
 * @param path  Object path.
 * @return Style object, empty when the path is unset.
 */
export function readStyle(
	style: StyleObject | undefined,
	path: string[]
): StyleObject {
	let value: unknown = style ?? {};

	for ( const key of path ) {
		if ( ! value || 'object' !== typeof value ) {
			return {};
		}

		value = ( value as StyleObject )[ key ];
	}

	return value && 'object' === typeof value ? ( value as StyleObject ) : {};
}

/**
 * Removes empty objects and undefined values, depth first.
 *
 * An attribute left as `{ typography: {} }` is not equal to an unset one:
 * `hasValue` would report the control as set and the block would serialize a
 * husk into post content.
 *
 * @since 0.1.0
 * @param value Value to clean.
 * @return Cleaned value, or undefined when nothing is left.
 */
export function clean( value: unknown ): unknown {
	if ( ! value || 'object' !== typeof value || Array.isArray( value ) ) {
		return '' === value ? undefined : value;
	}

	const next: StyleObject = {};

	for ( const [ key, item ] of Object.entries( value as StyleObject ) ) {
		const cleaned = clean( item );

		if ( undefined !== cleaned ) {
			next[ key ] = cleaned;
		}
	}

	return Object.keys( next ).length ? next : undefined;
}

/**
 * Returns a style attribute with a new object written at a path.
 *
 * @since 0.1.0
 * @param style Style attribute.
 * @param path  Object path.
 * @param next  Style object to write.
 * @return Style attribute, or undefined when nothing is left.
 */
export function writeStyle(
	style: StyleObject | undefined,
	path: string[],
	next: StyleObject
): StyleObject | undefined {
	if ( ! path.length ) {
		return clean( next ) as StyleObject | undefined;
	}

	const [ key, ...rest ] = path;
	const branch = writeStyle( readStyle( style, [ key ] ), rest, next );
	const merged = { ...( style ?? {} ) };

	if ( undefined === branch ) {
		delete merged[ key ];
	} else {
		merged[ key ] = branch;
	}

	return clean( merged ) as StyleObject | undefined;
}

/**
 * Removes what this engine wrote to a style attribute, in every viewport and state.
 *
 * Core's Reset all hands each fill the attributes in turn; this leaves core's
 * own features untouched and drops only the parts named: the block's own values
 * under `namespace`, the declared `states`, and the declared `elements`.
 *
 * @since 0.1.0
 * @param style           Style attribute.
 * @param parts           What to drop.
 * @param parts.namespace Key holding the block's own values.
 * @param parts.elements  Element names.
 * @param parts.states    Root state names.
 * @return Style attribute, or undefined when nothing is left.
 */
export function stripStyle(
	style: StyleObject | undefined,
	{
		namespace = '',
		elements = [],
		states = [],
	}: { namespace?: string; elements?: string[]; states?: string[] }
): StyleObject | undefined {
	if ( ! style ) {
		return undefined;
	}

	const strip = ( scope: StyleObject ): StyleObject => {
		const next = { ...scope };

		if ( namespace ) {
			delete next[ namespace ];
		}

		for ( const state of states ) {
			delete next[ state ];
		}

		if ( elements.length && isRecord( next.elements ) ) {
			const remaining = { ...next.elements };

			for ( const element of elements ) {
				delete remaining[ element ];
			}

			next.elements = remaining;
		}

		for ( const key of Object.keys( next ) ) {
			if (
				( key.startsWith( '@' ) ||
					key.startsWith( '-' ) ||
					key.startsWith( ':' ) ) &&
				isRecord( next[ key ] )
			) {
				next[ key ] = strip( next[ key ] as StyleObject );
			}
		}

		return next;
	};

	return clean( strip( style ) ) as StyleObject | undefined;
}

const isRecord = ( value: unknown ): value is StyleObject =>
	Boolean( value ) && 'object' === typeof value && ! Array.isArray( value );
