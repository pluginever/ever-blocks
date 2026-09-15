/**
 * WordPress dependencies
 */
import { createReduxStore, register, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { Pseudo } from '../types';

export const STORE_NAME = 'byteever/block-components';

interface State {
	/** Selected state per block, keyed by client id then element name. */
	styleStates: Record< string, Record< string, Pseudo > >;
}

interface SetStyleStateAction {
	type: 'SET_STYLE_STATE';
	clientId: string;
	element: string;
	pseudo: Pseudo;
}

const DEFAULT_STATE: State = { styleStates: {} };
const EMPTY: Record< string, Pseudo > = {};

function reducer(
	state: State = DEFAULT_STATE,
	action: SetStyleStateAction
): State {
	if ( 'SET_STYLE_STATE' !== action.type ) {
		return state;
	}

	const block = { ...( state.styleStates[ action.clientId ] ?? {} ) };

	if ( 'default' === action.pseudo ) {
		delete block[ action.element ];
	} else {
		block[ action.element ] = action.pseudo;
	}

	return {
		...state,
		styleStates: { ...state.styleStates, [ action.clientId ]: block },
	};
}

const actions = {
	setStyleState(
		clientId: string,
		element: string,
		pseudo: Pseudo
	): SetStyleStateAction {
		return { type: 'SET_STYLE_STATE', clientId, element, pseudo };
	},
};

const selectors = {
	getStyleState( state: State, clientId: string, element: string ): Pseudo {
		return state.styleStates[ clientId ]?.[ element ] ?? 'default';
	},
	getStyleStates( state: State, clientId: string ): Record< string, Pseudo > {
		return state.styleStates[ clientId ] ?? EMPTY;
	},
};

export const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

// Every block bundle carries its own copy of this module; the first to load
// registers the store and the rest reuse it.
if ( ! select( STORE_NAME ) ) {
	register( store );
}
