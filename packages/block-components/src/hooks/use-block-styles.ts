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
import { STORE_NAME } from '../store';
import { getDeclaration } from '../utils/block-declaration';
import { compileStyle, toCSS } from '../utils/style-css';
import { getViewportQueries } from '../utils/viewport-queries';
import type { Pseudo, StyleObject } from '../types';

/**
 * Binds a block's generated CSS to the editor canvas.
 *
 * Everything core's block supports can express is left to core on both sides;
 * this covers only what they cannot — the block's own values, its declared
 * states and elements — and previews the state each panel is editing so an
 * author sees a hover colour without hovering.
 *
 * @since 0.1.0
 * @param attributes       Block attributes.
 * @param attributes.style
 */
export function useBlockStyles( attributes: { style?: StyleObject } ): void {
	const { name, clientId, isSelected } = useBlockEditContext();
	const [ viewport ] = useSettings( 'viewport' );
	const selected: Record< string, Pseudo > | undefined = useSelect(
		(
			select: (
				name: unknown
			) => Record< string, ( ...args: unknown[] ) => unknown >
		) =>
			select( STORE_NAME ).getStyleStates( clientId ) as
				| Record< string, Pseudo >
				| undefined,
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
				isSelected ? selected ?? {} : {}
			),
			`${ selector }${ selector }`
		);
	}, [ attributes.style, name, clientId, viewport, selected, isSelected ] );

	useStyleOverride( { css } );
}
