/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useIcon } from '../icon-display';
import { IconLibrary } from './library';
import type { Icon } from '../../hooks/use-icons';

import './editor.scss';

interface RenderProps {
	/** Opens the icon library. */
	open: () => void;
	/** The chosen icon, so a trigger can preview it without looking it up. */
	icon?: Icon;
}

interface Props {
	/** Name of the chosen icon. */
	value?: string;
	/** Translated category labels, keyed by slug. Slugs are titled when absent. */
	labels?: Record< string, string >;
	onSelect: ( name: string ) => void;
	/** Supplies the trigger. Anything that calls `open` will do. */
	render: ( props: RenderProps ) => React.ReactNode;
}

/**
 * Owns the icon library and hands the trigger to the consumer.
 *
 * Follows the contract core uses for `MediaUpload`: this component holds the
 * open state and the modal, and `render` decides what opens it — a toolbar
 * button, an inspector row, a placeholder on the canvas, or anything else.
 *
 * @since 0.1.0
 * @param props          Picker props.
 * @param props.value
 * @param props.labels
 * @param props.onSelect
 * @param props.render
 * @return The consumer's trigger, plus the library while it is open.
 */
export function IconPicker( { value, labels = {}, onSelect, render }: Props ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const icon = useIcon( value );

	return (
		<>
			{ render( { open: () => setIsOpen( true ), icon } ) }
			{ isOpen && (
				<IconLibrary
					value={ value }
					labels={ labels }
					onClose={ () => setIsOpen( false ) }
					onSelect={ onSelect }
				/>
			) }
		</>
	);
}

export { IconLibrary } from './library';
export { IconPickerControl } from './control';
