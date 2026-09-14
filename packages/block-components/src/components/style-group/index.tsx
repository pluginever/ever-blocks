/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ToolsPanel } from '../../experimental';
import { ItemContext } from './context';
import { BorderGroup } from './groups/border';
import { ColorGroup } from './groups/color';
import { SpacingGroup } from './groups/spacing';
import { TypographyGroup } from './groups/typography';
import { ValuesGroup } from './groups/values';
import { getDeclaration } from '../../utils/block-declaration';
import { getNamespace } from '../../utils/style-css';
import {
	getStylePath,
	readStyle,
	stripStyle,
	writeStyle,
} from '../../utils/style-path';
import { isCustomState } from '../../utils/selectors';
import { useStyleState } from '../../hooks/use-style-state';
import type { Pseudo, StyleObject, Viewport } from '../../types';
import type { ValueControl } from './types';
import './editor.scss';

const GROUPS = {
	typography: TypographyGroup,
	spacing: SpacingGroup,
	border: BorderGroup,
} as const;

export type GroupName = keyof typeof GROUPS;

export type GroupControls = Partial<
	Record< GroupName | 'color', Record< string, boolean | 'default' > >
> & {
	/** The block's own values, each one custom property. */
	values?: Record< string, ValueControl >;
};

interface Props {
	controls: GroupControls;
	panelId: string;
	attributes: { style?: StyleObject };
	setAttributes: ( next: { style?: StyleObject } ) => void;
	/** Part name from the block's declaration, or empty for the root. */
	element?: string;
	/** Panel label; without one the items slot into the enclosing panel. */
	label?: string;
}

/**
 * Renders one part's style controls, bound to the block's `style` attribute.
 *
 * Values are written at the viewport the editor is previewing. Colours also
 * follow the state chosen in their row; every other control writes at the
 * default state. On the root, core's own panels own the default state, so the
 * block's own values render there and colours only at the declared states.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.controls      Groups and values to render.
 * @param props.panelId       ToolsPanel id.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.element       Part name, or empty for the root.
 * @param props.label         Panel label.
 * @return The controls.
 */
export function StyleGroup( {
	controls,
	panelId,
	attributes,
	setAttributes,
	element = '',
	label = '',
}: Props ) {
	const { name } = useBlockEditContext();
	const { viewport, pseudo: selected } = useStyleState( element );
	const declaration = useMemo(
		() => getDeclaration( getBlockType( name ) ),
		[ name ]
	);
	const namespace = getNamespace( name );

	const states = (
		element
			? [
					...( declaration.elements[ element ]?.states ?? [] ),
					...Object.keys( declaration.states ).filter(
						isCustomState
					),
			  ]
			: Object.keys( declaration.states )
	) as Pseudo[];
	const options: Pseudo[] = element ? [ 'default', ...states ] : states;
	const pseudo = options.includes( selected )
		? selected
		: options[ 0 ] ?? 'default';

	const basePath = getStylePath( { viewport, pseudo: 'default' }, element );
	const statePath = getStylePath( { viewport, pseudo }, element );
	const base = readStyle( attributes.style, basePath );
	const stated = readStyle( attributes.style, statePath );

	const context = useMemo(
		() => ( {
			element,
			options,
			hasValueAt: ( at: Viewport, state: Pseudo ) =>
				Object.keys(
					readStyle(
						attributes.style,
						getStylePath( { viewport: at, pseudo: state }, element )
					)
				).length > 0,
		} ),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ element, options.join( ',' ), attributes.style ]
	);

	const write = useCallback(
		( path: string[], next: StyleObject ) =>
			setAttributes( {
				style: writeStyle( attributes.style, path, next ),
			} ),
		[ attributes.style, setAttributes ]
	);

	const resetAll = () =>
		setAttributes( {
			style: stripStyle(
				attributes.style,
				element
					? { elements: [ element ] }
					: {
							namespace,
							states: Object.keys( declaration.states ),
					  }
			),
		} );

	const { values, color, ...groups } = controls;
	const showColor = color && ( element || states.length > 0 );

	const items = (
		<ItemContext.Provider value={ context }>
			{ values && (
				<ValuesGroup
					values={ readStyle( base, [ namespace ] ) }
					onChange={ ( next ) =>
						write( basePath, { ...base, [ namespace ]: next } )
					}
					colors={ readStyle( stated, [ namespace ] ) }
					onColorsChange={ ( next ) =>
						write( statePath, { ...stated, [ namespace ]: next } )
					}
					controls={ values }
					panelId={ panelId }
				/>
			) }
			{ showColor && (
				<ColorGroup
					value={ stated }
					onChange={ ( next ) => write( statePath, next ) }
					controls={ color }
					panelId={ panelId }
				/>
			) }
			{ element &&
				( Object.keys( groups ) as GroupName[] ).map( ( group ) => {
					const Group = GROUPS[ group ];

					return Group ? (
						<Group
							key={ group }
							value={ base }
							onChange={ ( next ) => write( basePath, next ) }
							controls={ groups[ group ] ?? {} }
							panelId={ panelId }
						/>
					) : null;
				} ) }
		</ItemContext.Provider>
	);

	if ( ! label ) {
		return items;
	}

	return (
		<ToolsPanel label={ label } panelId={ panelId } resetAll={ resetAll }>
			{ items }
		</ToolsPanel>
	);
}
