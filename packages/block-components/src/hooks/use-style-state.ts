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

const DEVICES: Record< Viewport, string > = {
	default: 'Desktop',
	'@tablet': 'Tablet',
	'@mobile': 'Mobile',
};

interface Result extends StyleState {
	setPseudo: ( pseudo: Pseudo ) => void;
	setViewport: ( viewport: Viewport ) => void;
}

/**
 * Returns the style state a panel is editing for one element of the current block.
 *
 * The viewport is the editor's device preview, so choosing one in a panel also
 * moves the canvas; the pseudo or custom state is the block's own selection.
 *
 * @since 0.1.0
 * @param element Element name, or an empty string for the block root.
 * @return Selected style state, and setters for both parts.
 */
export function useStyleState( element = '' ): Result {
	const { clientId } = useBlockEditContext();
	const { setStyleState } = useDispatch( store );
	const { setDeviceType } = useDispatch( editorStore );
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

	const setViewport = useCallback(
		( next: Viewport ) => setDeviceType( DEVICES[ next ] ?? 'Desktop' ),
		[ setDeviceType ]
	);

	return {
		viewport: VIEWPORTS[ device ?? 'Desktop' ] ?? 'default',
		pseudo,
		setPseudo,
		setViewport,
	};
}
