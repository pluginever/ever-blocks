/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useIcon } from '../../hooks/use-icons';
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
	onSelect: ( name: string ) => void;
	/** Supplies the trigger. Anything that calls `open` will do. */
	render: ( props: RenderProps ) => React.ReactNode;
}

/**
 * Owns the icon library and hands the trigger to the consumer, as core's
 * `MediaUpload` does.
 *
 * @since 0.1.0
 * @param props          Picker props.
 * @param props.value    Name of the chosen icon.
 * @param props.onSelect Receives the chosen name.
 * @param props.render   Supplies the trigger; anything that calls `open` will do.
 * @return The consumer's trigger, plus the library while it is open.
 */
export function IconPicker( { value, onSelect, render }: Props ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const icon = useIcon( value );

	return (
		<>
			{ render( { open: () => setIsOpen( true ), icon } ) }
			{ isOpen && (
				<IconLibrary
					value={ value }
					onClose={ () => setIsOpen( false ) }
					onSelect={ onSelect }
				/>
			) }
		</>
	);
}

export { IconLibrary } from './library';
export { IconPickerControl } from './control';
