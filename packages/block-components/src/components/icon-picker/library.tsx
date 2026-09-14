/**
 * WordPress dependencies
 */
import { Modal, RangeControl, SearchControl } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { IconGrid } from './grid';
import { IconSidebar } from './sidebar';
import type { Icon, IconFilter } from '../../hooks/use-icons';
import { useIcons } from '../../hooks/use-icons';

const STORAGE_KEY = 'b8-icon-picker';
const DEFAULT_SIZE = 24;

/**
 * Reads the viewer's remembered preview size.
 *
 * @since 0.1.0
 * @return Preview size in pixels.
 */
function readSize(): number {
	try {
		const stored = window.localStorage.getItem( STORAGE_KEY );

		return stored
			? JSON.parse( stored )?.size ?? DEFAULT_SIZE
			: DEFAULT_SIZE;
	} catch {
		return DEFAULT_SIZE;
	}
}

interface Props {
	value?: string;
	labels: Record< string, string >;
	onClose: () => void;
	onSelect: ( name: string ) => void;
}

/**
 * The icon library modal.
 *
 * Mounted by `IconPicker` only once opened, so the icon request is not made
 * until someone asks for it.
 *
 * @since 0.1.0
 * @param props          Library props.
 * @param props.value
 * @param props.labels
 * @param props.onClose
 * @param props.onSelect
 * @return The modal.
 */
export function IconLibrary( { value, labels, onClose, onSelect }: Props ) {
	const { icons, collections, isLoading } = useIcons( true );
	const [ search, setSearch ] = useState( '' );
	const [ size, setSize ] = useState( readSize );
	const [ filter, setFilter ] = useState< IconFilter >( {
		collection: '',
		category: '',
	} );

	useEffect( () => {
		try {
			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify( { size } )
			);
		} catch {
			// A viewer with site data blocked simply gets the default each time.
		}
	}, [ size ] );

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
				<RangeControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					className="b8-icon-picker__size"
					label={ __( 'Preview size', 'ever-blocks' ) }
					min={ 16 }
					max={ 48 }
					step={ 4 }
					value={ size }
					onChange={ ( next ) => setSize( next ?? DEFAULT_SIZE ) }
				/>
			</div>

			<div className="b8-icon-picker__body">
				<IconSidebar
					icons={ icons }
					collections={ collections }
					labels={ labels }
					value={ filter }
					onChange={ setFilter }
				/>
				<div className="b8-icon-picker__results">
					<p className="b8-icon-picker__count-line">
						{ sprintf(
							/* translators: %d: number of icons shown. */
							_n(
								'%d icon',
								'%d icons',
								matches.length,
								'ever-blocks'
							),
							matches.length
						) }
					</p>
					<IconGrid
						icons={ matches }
						value={ value }
						size={ size }
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
