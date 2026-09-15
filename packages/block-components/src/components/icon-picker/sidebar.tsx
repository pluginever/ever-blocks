/**
 * WordPress dependencies
 */
import { MenuGroup, MenuItem } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Icon, IconCollection, IconFilter } from '../../hooks/use-icons';

interface Props {
	icons: Icon[];
	collections: IconCollection[];
	value: IconFilter;
	onChange: ( filter: IconFilter ) => void;
}

/**
 * Turns a slug into a readable label when the consumer supplies none.
 *
 * @since 0.1.0
 * @param slug Category slug.
 * @return Readable label.
 */
function toLabel( slug: string ): string {
	return slug
		.split( '-' )
		.map( ( word ) => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
		.join( ' ' );
}

/**
 * Lists the collections and categories an icon can be filtered to.
 *
 * @since 0.1.0
 * @param props             Sidebar props.
 * @param props.icons
 * @param props.collections
 * @param props.value
 * @param props.onChange
 * @return The sidebar.
 */
export function IconSidebar( { icons, collections, value, onChange }: Props ) {
	const counts = useMemo( () => {
		const totals: Record< string, number > = {};

		icons.forEach( ( icon ) => {
			totals[ icon.collection ] = ( totals[ icon.collection ] ?? 0 ) + 1;
		} );

		return totals;
	}, [ icons ] );

	const categories = useMemo( () => {
		const totals: Record< string, number > = {};

		icons.forEach( ( icon ) => {
			if ( ! icon.category ) {
				return;
			}

			if ( value.collection && icon.collection !== value.collection ) {
				return;
			}

			totals[ icon.category ] = ( totals[ icon.category ] ?? 0 ) + 1;
		} );

		return Object.keys( totals )
			.sort()
			.map( ( slug ) => ( {
				slug,
				label: toLabel( slug ),
				count: totals[ slug ],
			} ) );
	}, [ icons, value.collection ] );

	return (
		<div className="b8-icon-picker__sidebar">
			<MenuGroup label={ __( 'Collections', 'ever-blocks' ) }>
				<MenuItem
					role="menuitemradio"
					isSelected={ '' === value.collection }
					onClick={ () =>
						onChange( { collection: '', category: '' } )
					}
				>
					{ __( 'All icons', 'ever-blocks' ) }
					<span className="b8-icon-picker__count">
						{ icons.length }
					</span>
				</MenuItem>
				{ collections.map( ( collection ) => (
					<MenuItem
						key={ collection.slug }
						role="menuitemradio"
						isSelected={ collection.slug === value.collection }
						onClick={ () =>
							onChange( {
								collection: collection.slug,
								category: '',
							} )
						}
					>
						{ collection.label }
						<span className="b8-icon-picker__count">
							{ counts[ collection.slug ] ?? 0 }
						</span>
					</MenuItem>
				) ) }
			</MenuGroup>

			{ categories.length > 0 && (
				<MenuGroup label={ __( 'Categories', 'ever-blocks' ) }>
					{ categories.map( ( category ) => (
						<MenuItem
							key={ category.slug }
							role="menuitemcheckbox"
							isSelected={ category.slug === value.category }
							onClick={ () =>
								onChange( {
									collection: value.collection,
									category:
										category.slug === value.category
											? ''
											: category.slug,
								} )
							}
						>
							{ category.label }
							<span className="b8-icon-picker__count">
								{ category.count }
							</span>
						</MenuItem>
					) ) }
				</MenuGroup>
			) }
		</div>
	);
}
