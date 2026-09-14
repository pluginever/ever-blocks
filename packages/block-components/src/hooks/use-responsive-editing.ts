/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

const SELECTOR = '.editor-preview-dropdown';
const ACTIVE = 'is-responsive-editing';

const read = (): boolean =>
	Boolean( document.querySelector( `${ SELECTOR }.${ ACTIVE }` ) );

/**
 * Returns whether core's "Responsive styles" mode is on.
 *
 * Core keeps this in a private selector (`isResponsiveEditing`), so the only
 * public signal is the class its preview dropdown carries. Replace with the
 * selector the day core exposes it.
 *
 * @since 0.1.0
 * @return True while style edits apply to the previewed viewport.
 */
export function useResponsiveEditing(): boolean {
	const [ active, setActive ] = useState( read );

	useEffect( () => {
		const observer = new MutationObserver( ( mutations ) => {
			for ( const mutation of mutations ) {
				const target = mutation.target as Element;

				if (
					'attributes' === mutation.type
						? target.matches( SELECTOR )
						: true
				) {
					setActive( read() );
					return;
				}
			}
		} );

		observer.observe( document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [ 'class' ],
		} );

		setActive( read() );

		return () => observer.disconnect();
	}, [] );

	return active;
}
