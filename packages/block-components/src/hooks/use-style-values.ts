/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getStylePath, readStyle, writeStyle } from '../utils/style-path';
import { getNamespace } from '../utils/style-css';
import { useStyleState } from './use-style-state';
import type { StyleObject } from '../types';

/**
 * Reads and writes a block's own values at the state the inspector is editing.
 *
 * The values ride core's `style` attribute, so switching device or state moves
 * the write target exactly as it does for every core control — the block never
 * sees a breakpoint.
 *
 * @since 0.1.0
 * @param attributes       Block attributes.
 * @param attributes.style
 * @param setAttributes    Attribute setter.
 * @param element          Element name, or an empty string for the block root.
 * @return The current values, a setter, and a reset for a `ToolsPanel`.
 */
export function useStyleValues(
	attributes: { style?: StyleObject },
	setAttributes: ( next: { style?: StyleObject } ) => void,
	element = ''
) {
	const { name } = useBlockEditContext();
	const namespace = getNamespace( name );
	const { viewport, pseudo } = useStyleState( element );
	const path = useMemo(
		() => [ ...getStylePath( { viewport, pseudo }, element ), namespace ],
		[ viewport, pseudo, element, namespace ]
	);
	const values = readStyle( attributes.style, path );

	const setValue = useCallback(
		( next: Record< string, unknown > ) => {
			setAttributes( {
				style: writeStyle( attributes.style, path, {
					...values,
					...next,
				} ),
			} );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ attributes.style, path.join( '.' ), setAttributes ]
	);

	const resetValues = useCallback(
		( keys?: string | string[] ) => {
			const target =
				undefined === keys ? Object.keys( values ) : [ keys ].flat();

			setValue(
				Object.fromEntries(
					target.map( ( key ) => [ key, undefined ] )
				)
			);
		},
		[ setValue, values ]
	);

	return {
		values,
		setValue,
		resetValues,
		isDefault: 'default' === viewport && 'default' === pseudo,
	};
}
