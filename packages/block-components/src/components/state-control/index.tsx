/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ToggleGroupControl,
	ToggleGroupControlOption,
} from '../../experimental';
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

const VIEWPORTS: Array< { value: Viewport; label: string } > = [
	{ value: 'default', label: __( 'Desktop', 'ever-blocks' ) },
	{ value: '@tablet', label: __( 'Tablet', 'ever-blocks' ) },
	{ value: '@mobile', label: __( 'Mobile', 'ever-blocks' ) },
];

interface Props {
	/** State names the block or element declares, without the default. */
	states: string[];
	value: Pseudo;
	onChange: ( next: Pseudo ) => void;
	viewport: Viewport;
	onViewportChange: ( next: Viewport ) => void;
}

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

/**
 * Chooses the viewport and state a panel's controls write to.
 *
 * @since 0.1.0
 * @param props                  Component props.
 * @param props.states           State names the block or element declares.
 * @param props.value            Selected state.
 * @param props.onChange         Called with the next state.
 * @param props.viewport         Selected viewport.
 * @param props.onViewportChange Called with the next viewport.
 * @return The controls.
 */
export function StateControl( {
	states,
	value,
	onChange,
	viewport,
	onViewportChange,
}: Props ) {
	const options = [ 'default', ...states ];

	return (
		<div className="b8-state-control">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				isBlock
				label={ __( 'Viewport', 'ever-blocks' ) }
				value={ viewport }
				onChange={ ( next: unknown ) =>
					onViewportChange( ( next ?? 'default' ) as Viewport )
				}
			>
				{ VIEWPORTS.map( ( option ) => (
					<ToggleGroupControlOption
						key={ option.value }
						value={ option.value }
						label={ option.label }
					/>
				) ) }
			</ToggleGroupControl>

			{ states.length > 0 && options.length <= 4 && (
				<ToggleGroupControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					isBlock
					label={ __( 'State', 'ever-blocks' ) }
					value={ value }
					onChange={ ( next: unknown ) =>
						onChange( ( next ?? 'default' ) as Pseudo )
					}
				>
					{ options.map( ( state ) => (
						<ToggleGroupControlOption
							key={ state }
							value={ state }
							label={ getStateLabel( state ) }
						/>
					) ) }
				</ToggleGroupControl>
			) }

			{ states.length > 0 && options.length > 4 && (
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'State', 'ever-blocks' ) }
					value={ value }
					options={ options.map( ( state ) => ( {
						value: state,
						label: getStateLabel( state ),
					} ) ) }
					onChange={ ( next: string ) => onChange( next as Pseudo ) }
				/>
			) }
		</div>
	);
}
