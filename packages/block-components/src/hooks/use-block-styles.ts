/**
 * WordPress dependencies
 */
import {
	useBlockEditContext,
	useSettings,
	useStyleOverride,
} from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store } from '../store';
import { getDeclaration } from '../utils/block-declaration';
import { compileStyle, toCSS } from '../utils/style-css';
import { getViewportQueries } from '../utils/viewport-queries';
import type { StyleObject } from '../types';

/**
 * Binds a block's generated CSS to the editor canvas, previewing the state
 * each element's panel is editing.
 *
 * @since 0.1.0
 * @param attributes       Block attributes.
 * @param attributes.style Style attribute.
 */
export function useBlockStyles( attributes: { style?: StyleObject } ): void {
	const { name, clientId, isSelected } = useBlockEditContext();
	const [ viewport ] = useSettings( 'viewport' );
	const selected = useSelect(
		( select ) => select( store ).getStyleStates( clientId ),
		[ clientId ]
	);

	const css = useMemo( () => {
		const declaration = getDeclaration( getBlockType( name ) );
		const queries = getViewportQueries( viewport );
		const selector = `[data-block="${ clientId }"]`;

		return toCSS(
			compileStyle(
				attributes.style,
				name,
				declaration,
				queries,
				isSelected ? selected : {}
			),
			`${ selector }${ selector }`
		);
	}, [ attributes.style, name, clientId, viewport, selected, isSelected ] );

	useStyleOverride( { css } );
}
