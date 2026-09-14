/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store } from '../store';
import type { Pseudo, StyleState } from '../types';

interface Result extends StyleState {
	setPseudo: ( pseudo: Pseudo ) => void;
}

/**
 * Returns the style state the controls of one element are editing.
 *
 * Core writes per-viewport values only in its own responsive editing mode,
 * which hides third-party style panels, so these controls always write the
 * default viewport.
 *
 * @since 0.1.0
 * @param element Element name, or an empty string for the block root.
 * @return Selected style state and the state setter.
 */
export function useStyleState( element = '' ): Result {
	const { clientId } = useBlockEditContext();
	const { setStyleState } = useDispatch( store );
	const pseudo = useSelect(
		( select ) => select( store ).getStyleState( clientId, element ),
		[ clientId, element ]
	);

	const setPseudo = useCallback(
		( next: Pseudo ) => setStyleState( clientId, element, next ),
		[ setStyleState, clientId, element ]
	);

	return { viewport: 'default', pseudo, setPseudo };
}
