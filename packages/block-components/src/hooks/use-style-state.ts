/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { STORE_NAME, store } from '../store';
import type { Pseudo, StyleState, Viewport } from '../types';

const VIEWPORTS: Record< string, Viewport > = {
	Desktop: 'default',
	Tablet: '@tablet',
	Mobile: '@mobile',
};

interface Result extends StyleState {
	setPseudo: ( pseudo: Pseudo ) => void;
}

/**
 * Returns the style state the controls of one part are editing.
 *
 * The viewport follows the editor's device preview; the state is the part's
 * own selection.
 *
 * @since 0.1.0
 * @param element Part name, or an empty string for the block root.
 * @return Selected style state and the state setter.
 */
export function useStyleState( element = '' ): Result {
	const { clientId } = useBlockEditContext();
	const { setStyleState } = useDispatch( store );
	const { device, pseudo } = useSelect(
		(
			select: (
				name: unknown
			) => Record< string, ( ...args: unknown[] ) => unknown >
		) => ( {
			device: select( editorStore ).getDeviceType?.() as
				| string
				| undefined,
			pseudo: select( STORE_NAME ).getStyleState(
				clientId,
				element
			) as Pseudo,
		} ),
		[ clientId, element ]
	);

	const setPseudo = useCallback(
		( next: Pseudo ) => setStyleState( clientId, element, next ),
		[ setStyleState, clientId, element ]
	);

	return {
		viewport: VIEWPORTS[ device ?? 'Desktop' ] ?? 'default',
		pseudo,
		setPseudo,
	};
}
