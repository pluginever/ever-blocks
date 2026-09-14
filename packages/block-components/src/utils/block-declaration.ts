/**
 * Internal dependencies
 */
import { isCustomState, isPseudoState } from './selectors';
import type { BlockDeclaration, ElementDeclaration } from '../types';

interface BlockSettings {
	supports?: Record< string, unknown >;
	selectors?: Record< string, unknown >;
}

const ELEMENT_NAME = /^[a-z][a-zA-Z0-9]*$/;

const isRecord = ( value: unknown ): value is Record< string, unknown > =>
	Boolean( value ) && 'object' === typeof value && ! Array.isArray( value );

/**
 * Reads the elements and states a block declares in its `block.json`.
 *
 * Mirrors the server's reading of the same declaration so both halves compile
 * the same states and elements and ignore the same undeclared ones.
 *
 * @since 0.1.0
 * @param settings Registered block settings, as `getBlockType()` returns them.
 * @return The declaration.
 */
export function getDeclaration(
	settings: BlockSettings | null | undefined
): BlockDeclaration {
	const everBlocks = isRecord( settings?.supports?.everBlocks )
		? settings.supports.everBlocks
		: {};
	const selectors = isRecord( settings?.selectors ) ? settings.selectors : {};
	const elements: Record< string, ElementDeclaration > = {};
	const states: Record< string, string > = {};

	if ( isRecord( everBlocks.elements ) ) {
		for ( const [ name, value ] of Object.entries( everBlocks.elements ) ) {
			if ( ! ELEMENT_NAME.test( name ) ) {
				continue;
			}

			const selector = isRecord( value ) ? value.selector : value;
			const declared = isRecord( value ) ? value.states : [];

			if ( 'string' !== typeof selector || ! selector.trim() ) {
				continue;
			}

			elements[ name ] = {
				selector: selector.trim(),
				states: ( Array.isArray( declared ) ? declared : [] ).filter(
					isPseudoState
				),
			};
		}
	}

	if ( Array.isArray( everBlocks.states ) ) {
		for ( const state of everBlocks.states ) {
			if ( isPseudoState( state ) ) {
				states[ state ] = '';
			}
		}
	}

	if ( isRecord( selectors.states ) ) {
		for ( const [ state, selector ] of Object.entries(
			selectors.states
		) ) {
			if (
				isCustomState( state ) &&
				'string' === typeof selector &&
				selector.trim()
			) {
				states[ state ] = selector.trim();
			}
		}
	}

	return { elements, states, selectors };
}
