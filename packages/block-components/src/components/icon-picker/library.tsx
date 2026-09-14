/**
 * WordPress dependencies
 */
import { Modal, SearchControl } from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { IconGrid } from './grid';
import { IconSidebar } from './sidebar';
import type { Icon, IconFilter } from '../../hooks/use-icons';
import { useIcons } from '../../hooks/use-icons';

interface Props {
	value?: string;
	onClose: () => void;
	onSelect: ( name: string ) => void;
}

/**
 * The icon library modal.
 *
 * @since 0.1.0
 * @param props          Library props.
 * @param props.value    Name of the chosen icon.
 * @param props.onClose  Called when the modal closes.
 * @param props.onSelect Receives the chosen name.
 * @return The modal.
 */
export function IconLibrary( { value, onClose, onSelect }: Props ) {
	const { icons, collections, isLoading } = useIcons( true );
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState< IconFilter >( {
		collection: '',
		category: '',
	} );

	const matches = useMemo( () => {
		const term = search.trim().toLowerCase();

		return icons.filter( ( icon ) => {
			if ( filter.collection && icon.collection !== filter.collection ) {
				return false;
			}

			if ( filter.category && icon.category !== filter.category ) {
				return false;
			}

			return (
				! term ||
				icon.label.toLowerCase().includes( term ) ||
				icon.name.toLowerCase().includes( term )
			);
		} );
	}, [ icons, search, filter ] );

	return (
		<Modal
			title={ __( 'Icons', 'ever-blocks' ) }
			className="b8-icon-picker"
			size="fill"
			onRequestClose={ onClose }
		>
			<div className="b8-icon-picker__header">
				<SearchControl
					__nextHasNoMarginBottom
					label={ __( 'Search icons', 'ever-blocks' ) }
					placeholder={ __( 'Search icons', 'ever-blocks' ) }
					value={ search }
					onChange={ setSearch }
				/>
			</div>

			<div className="b8-icon-picker__body">
				<IconSidebar
					icons={ icons }
					collections={ collections }
					value={ filter }
					onChange={ setFilter }
				/>
				<div className="b8-icon-picker__results">
					<IconGrid
						icons={ matches }
						value={ value }
						isLoading={ isLoading }
						onSelect={ ( icon: Icon ) => {
							onSelect( icon.name );
							onClose();
						} }
					/>
				</div>
			</div>
		</Modal>
	);
}
