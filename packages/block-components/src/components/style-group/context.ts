/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Pseudo, Viewport } from '../../types';

interface ItemContextValue {
	/** Part the items belong to, or empty for the block root. */
	element: string;
	/** States the part's colours can be edited at. */
	options: Pseudo[];
	/** Whether the part has any value at a viewport and state. */
	hasValueAt: ( viewport: Viewport, pseudo: Pseudo ) => boolean;
}

export const ItemContext = createContext< ItemContextValue >( {
	element: '',
	options: [],
	hasValueAt: () => false,
} );

export const useItemContext = () => useContext( ItemContext );
