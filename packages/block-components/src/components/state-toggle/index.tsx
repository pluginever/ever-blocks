/**
 * WordPress dependencies
 */
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	VisuallyHidden,
} from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import { SVG, Path, Circle } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import { useStyleState } from '../../hooks/use-style-state';
import { useItemContext } from '../style-group/context';
import './editor.scss';

const LABELS: Record< string, string > = {
	':hover': _x( 'Hover', 'CSS pseudo-class', 'ever-blocks' ),
	':focus': _x( 'Focus', 'CSS pseudo-class', 'ever-blocks' ),
	':focus-visible': _x( 'Focus-visible', 'CSS pseudo-class', 'ever-blocks' ),
	':focus-within': _x( 'Focus-within', 'CSS pseudo-class', 'ever-blocks' ),
	':active': _x( 'Active', 'CSS pseudo-class', 'ever-blocks' ),
	'::placeholder': _x( 'Placeholder', 'CSS pseudo-element', 'ever-blocks' ),
};

const stateDefault = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Circle
			cx="12"
			cy="12"
			r="5.25"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
	</SVG>
);

const stateHover = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path
			d="M7 5.5v12l3.2-3 2 4.5 1.9-.9-2-4.4h4.4z"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	</SVG>
);

const stateCustom = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Circle
			cx="12"
			cy="12"
			r="5.25"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<Circle cx="12" cy="12" r="2" fill="currentColor" />
	</SVG>
);

function getStateLabel( state: string ): string {
	if ( 'default' === state ) {
		return __( 'Default', 'ever-blocks' );
	}

	if ( LABELS[ state ] ) {
		return LABELS[ state ];
	}

	const words = state.replace( /^[:-]+/, '' ).replace( /-/g, ' ' );

	return words.charAt( 0 ).toUpperCase() + words.slice( 1 );
}

const stateIcon = ( state: string ) => {
	if ( 'default' === state ) {
		return stateDefault;
	}

	return state.startsWith( ':' ) ? stateHover : stateCustom;
};

/**
 * The state switch shown in a colour row.
 *
 * The choice is remembered per element, so every colour of that element
 * follows it. Options the element already has values for say so.
 *
 * @since 0.1.0
 * @return The switch, or null when the element declares no state.
 */
export function StateToggle() {
	const { options, hasValueAt, element } = useItemContext();
	const { viewport, pseudo, setPseudo } = useStyleState( element );

	if (
		! options.length ||
		( 1 === options.length && 'default' === pseudo )
	) {
		return null;
	}

	return (
		<DropdownMenu
			className="b8-state-toggle"
			icon={ stateIcon( pseudo ) }
			label={ sprintf(
				// translators: %s: state name.
				__( 'State: %s', 'ever-blocks' ),
				getStateLabel( pseudo )
			) }
			disableOpenOnArrowDown={ 1 === options.length }
			toggleProps={ {
				size: 'small',
				className: 'b8-state-toggle__button',
				disabled: 1 === options.length,
				showTooltip: true,
			} }
			popoverProps={ { placement: 'bottom-end' } }
		>
			{ ( { onClose } ) => (
				<MenuGroup>
					{ options.map( ( state ) => (
						<MenuItem
							key={ state }
							role="menuitemradio"
							icon={
								pseudo === state ? check : stateIcon( state )
							}
							isSelected={ pseudo === state }
							suffix={
								hasValueAt( viewport, state ) ? (
									<span className="b8-state-toggle__dot">
										<VisuallyHidden>
											{ __(
												'Has values',
												'ever-blocks'
											) }
										</VisuallyHidden>
									</span>
								) : undefined
							}
							onClick={ () => {
								setPseudo( state );
								onClose();
							} }
						>
							{ getStateLabel( state ) }
						</MenuItem>
					) ) }
				</MenuGroup>
			) }
		</DropdownMenu>
	);
}
