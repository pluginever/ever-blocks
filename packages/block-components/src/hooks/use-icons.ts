export interface Icon {
	name: string;
	label: string;
	content: string;
	collection: string;
	category?: string;
}

export interface IconCollection {
	slug: string;
	label: string;
	description?: string;
}

export interface IconFilter {
	collection: string;
	category: string;
}

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */

interface Library {
	icons: Icon[];
	collections: IconCollection[];
}

/**
 * Resolved once per page load and shared by every picker instance.
 */
let request: Promise< Library > | null = null;

function load(): Promise< Library > {
	if ( ! request ) {
		request = Promise.all( [
			apiFetch< Icon[] >( { path: '/wp/v2/icons?per_page=-1' } ),
			apiFetch< IconCollection[] >( { path: '/wp/v2/icon-collections' } ),
		] )
			.then( ( [ icons, collections ] ) => ( { icons, collections } ) )
			.catch( () => {
				request = null;

				return { icons: [], collections: [] };
			} );
	}

	return request;
}

/**
 * Returns every registered icon and collection.
 *
 * Reads the shared endpoints, so the picker lists this plugin's icons alongside
 * core's and any other plugin's without integrating with them.
 *
 * @since 0.1.0
 * @param enabled Whether to load. Pass false while the picker is closed.
 * @return The library and its loading state.
 */
export function useIcons( enabled: boolean ) {
	const [ library, setLibrary ] = useState< Library >( {
		icons: [],
		collections: [],
	} );
	const [ isLoading, setIsLoading ] = useState( false );

	useEffect( () => {
		if ( ! enabled || library.icons.length ) {
			return;
		}

		let cancelled = false;

		setIsLoading( true );

		load().then( ( next ) => {
			if ( ! cancelled ) {
				setLibrary( next );
				setIsLoading( false );
			}
		} );

		return () => {
			cancelled = true;
		};
	}, [ enabled, library.icons.length ] );

	return { ...library, isLoading };
}
