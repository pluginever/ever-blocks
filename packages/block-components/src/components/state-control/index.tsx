/**
 * WordPress dependencies
 */
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { check, chevronDown, desktop, mobile, tablet } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { HStack } from '../../experimental';
import type { Pseudo, Viewport } from '../../types';
import './editor.scss';

const LABELS: Record< string, string > = {
	':hover': _x( 'Hover', 'CSS pseudo-class', 'ever-blocks' ),
	':focus': _x( 'Focus', 'CSS pseudo-class', 'ever-blocks' ),
	':focus-visible': _x( 'Focus-visible', 'CSS pseudo-class', 'ever-blocks' ),
	':focus-within': _x( 'Focus-within', 'CSS pseudo-class', 'ever-blocks' ),
	':active': _x( 'Active', 'CSS pseudo-class', 'ever-blocks' ),
	':visited': _x( 'Visited', 'CSS pseudo-class', 'ever-blocks' ),
	':disabled': _x( 'Disabled', 'CSS pseudo-class', 'ever-blocks' ),
	':checked': _x( 'Checked', 'CSS pseudo-class', 'ever-blocks' ),
	'::placeholder': _x( 'Placeholder', 'CSS pseudo-element', 'ever-blocks' ),
};

const VIEWPORTS: Array< {
	value: Viewport;
	label: string;
	icon: React.ReactElement;
} > = [
	{ value: 'default', label: __( 'Desktop', 'ever-blocks' ), icon: desktop },
	{ value: '@tablet', label: __( 'Tablet', 'ever-blocks' ), icon: tablet },
	{ value: '@mobile', label: __( 'Mobile', 'ever-blocks' ), icon: mobile },
];

interface Props {
	/** State names the block declares, without the default. */
	states: string[];
	value: Pseudo;
	onChange: ( next: Pseudo ) => void;
	viewport: Viewport;
	onViewportChange: ( next: Viewport ) => void;
}

/**
 * Returns a readable label for a state name.
 *
 * @since 0.1.0
 * @param state State name, e.g. `:hover` or `-open`.
 * @return Label.
 */
export function getStateLabel( state: string ): string {
	if ( 'default' === state ) {
		return __( 'Default', 'ever-blocks' );
	}

	if ( LABELS[ state ] ) {
		return LABELS[ state ];
	}

	const words = state.replace( /^[:-]+/, '' ).replace( /-/g, ' ' );

	return words.charAt( 0 ).toUpperCase() + words.slice( 1 );
}

/**
 * Chooses the viewport and state every style panel below it writes to.
 *
 * Mirrors the States menu core shows for Global Styles: one compact dropdown
 * with a group per axis, and badges naming whatever is not the default.
 *
 * @since 0.1.0
 * @param props                  Component props.
 * @param props.states           State names the block declares.
 * @param props.value            Selected state.
 * @param props.onChange         Called with the next state.
 * @param props.viewport         Selected viewport.
 * @param props.onViewportChange Called with the next viewport.
 * @return The bar.
 */
export function StateControl( {
	states,
	value,
	onChange,
	viewport,
	onViewportChange,
}: Props ) {
	const active = [
		...VIEWPORTS.filter(
			( option ) => option.value === viewport && 'default' !== viewport
		).map( ( option ) => option.label ),
		...( 'default' !== value ? [ getStateLabel( value ) ] : [] ),
	];

	return (
		<HStack
			className="b8-state-control"
			spacing={ 2 }
			alignment="center"
			justify="space-between"
		>
			<span className="b8-state-control__label">
				{ active.length
					? sprintf(
							// translators: %s: comma separated viewport and state, e.g. "Mobile, Hover".
							__( 'Styling: %s', 'ever-blocks' ),
							active.join( ', ' )
					  )
					: __( 'Styling: Default', 'ever-blocks' ) }
			</span>

			<DropdownMenu
				icon={ chevronDown }
				text={ __( 'States', 'ever-blocks' ) }
				label={ __(
					'Choose the viewport and state to style',
					'ever-blocks'
				) }
				toggleProps={ { size: 'compact', iconPosition: 'right' } }
				popoverProps={ { placement: 'bottom-end' } }
			>
				{ () => (
					<>
						<MenuGroup label={ __( 'Viewport', 'ever-blocks' ) }>
							{ VIEWPORTS.map( ( option ) => (
								<MenuItem
									key={ option.value }
									icon={
										viewport === option.value
											? check
											: option.icon
									}
									isSelected={ viewport === option.value }
									onClick={ () =>
										onViewportChange( option.value )
									}
								>
									{ option.label }
								</MenuItem>
							) ) }
						</MenuGroup>
						{ states.length > 0 && (
							<MenuGroup label={ __( 'State', 'ever-blocks' ) }>
								{ [ 'default', ...states ].map( ( state ) => (
									<MenuItem
										key={ state }
										icon={ value === state ? check : null }
										isSelected={ value === state }
										onClick={ () =>
											onChange( state as Pseudo )
										}
									>
										{ getStateLabel( state ) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }
					</>
				) }
			</DropdownMenu>
		</HStack>
	);
}
