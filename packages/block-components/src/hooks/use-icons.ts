/**
 * WordPress dependencies
 */
import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

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

interface Library {
	icons: Icon[];
	collections: IconCollection[];
	isLoading: boolean;
}

const EMPTY: Library = { icons: [], collections: [], isLoading: false };

// core-data's generic selector types do not survive `select()`.
interface Selectors {
	getEntityRecords: ( kind: string, name: string ) => unknown[] | null;
	getEntityRecord: ( kind: string, name: string, key: string ) => unknown;
	hasFinishedResolution: ( selector: string, args: unknown[] ) => boolean;
}

/**
 * Returns every registered icon and collection from the `icon` and
 * `iconCollection` entities core-data registers.
 *
 * @since 0.1.0
 * @param enabled Whether to load. Pass false while the picker is closed.
 * @return The library and its loading state.
 */
export function useIcons( enabled: boolean ): Library {
	return useSelect(
		( select ) => {
			if ( ! enabled ) {
				return EMPTY;
			}

			const { getEntityRecords, hasFinishedResolution } = select(
				coreDataStore
			) as unknown as Selectors;

			return {
				icons:
					( getEntityRecords( 'root', 'icon' ) as Icon[] | null ) ??
					[],
				collections:
					( getEntityRecords( 'root', 'iconCollection' ) as
						| IconCollection[]
						| null ) ?? [],
				isLoading: ! hasFinishedResolution( 'getEntityRecords', [
					'root',
					'icon',
				] ),
			};
		},
		[ enabled ]
	);
}

/**
 * Returns a single registered icon by name.
 *
 * @since 0.1.0
 * @param name Namespaced icon name, such as `core/star-filled`.
 * @return The icon, or undefined while loading or when it is not registered.
 */
export function useIcon( name?: string ): Icon | undefined {
	return useSelect(
		( select ) =>
			name
				? ( (
						select( coreDataStore ) as unknown as Selectors
				   ).getEntityRecord( 'root', 'icon', name ) as
						| Icon
						| undefined )
				: undefined,
		[ name ]
	);
}
