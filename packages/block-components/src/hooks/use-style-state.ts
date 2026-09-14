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
import { useResponsiveEditing } from './use-responsive-editing';
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
 * Returns the style state the inspector is editing for one element of the current block.
 *
 * The viewport follows the editor's device preview while core's "Responsive
 * styles" mode is on, exactly as core's own controls do; the pseudo or custom
 * state is the block's own selection.
 *
 * @since 0.1.0
 * @param element Element name, or an empty string for the block root.
 * @return Selected style state, and a setter for its pseudo part.
 */
export function useStyleState( element = '' ): Result {
	const { clientId } = useBlockEditContext();
	const responsive = useResponsiveEditing();
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
		viewport: responsive
			? VIEWPORTS[ device ?? 'Desktop' ] ?? 'default'
			: 'default',
		pseudo,
		setPseudo,
	};
}
