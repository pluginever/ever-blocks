/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { desktop, mobile, tablet } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	HStack,
	ToggleGroupControl,
	ToggleGroupControlOption,
	ToggleGroupControlOptionIcon,
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
	const options = [ 'default', ...states ];

	return (
		<HStack className="b8-state-control" spacing={ 2 } alignment="center">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				hideLabelFromVision
				label={ __( 'Viewport', 'ever-blocks' ) }
				value={ viewport }
				onChange={ ( next: unknown ) =>
					onViewportChange( ( next ?? 'default' ) as Viewport )
				}
			>
				{ VIEWPORTS.map( ( option ) => (
					<ToggleGroupControlOptionIcon
						key={ option.value }
						value={ option.value }
						label={ option.label }
						icon={ option.icon }
					/>
				) ) }
			</ToggleGroupControl>

			{ states.length > 0 && options.length <= 3 && (
				<ToggleGroupControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					isBlock
					hideLabelFromVision
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

			{ states.length > 0 && options.length > 3 && (
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					hideLabelFromVision
					label={ __( 'State', 'ever-blocks' ) }
					value={ value }
					options={ options.map( ( state ) => ( {
						value: state,
						label: getStateLabel( state ),
					} ) ) }
					onChange={ ( next: string ) => onChange( next as Pseudo ) }
				/>
			) }
		</HStack>
	);
}
