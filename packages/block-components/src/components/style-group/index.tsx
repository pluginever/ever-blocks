/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { StateControl } from '../state-control';
import { BackgroundGroup } from './groups/background';
import { BorderGroup } from './groups/border';
import { ColorGroup } from './groups/color';
import { ShadowGroup } from './groups/shadow';
import { SizeGroup } from './groups/size';
import { SpacingGroup } from './groups/spacing';
import { TypographyGroup } from './groups/typography';
import { ValuesGroup } from './groups/values';
import { getDeclaration } from '../../utils/block-declaration';
import { getNamespace } from '../../utils/style-css';
import { getStylePath, readStyle, writeStyle } from '../../utils/style-path';
import { isCustomState } from '../../utils/selectors';
import { useStyleState } from '../../hooks/use-style-state';
import type { StyleObject } from '../../types';
import type { ValueControl } from './types';
import './editor.scss';

const GROUPS = {
	background: BackgroundGroup,
	typography: TypographyGroup,
	spacing: SpacingGroup,
	color: ColorGroup,
	border: BorderGroup,
	shadow: ShadowGroup,
	size: SizeGroup,
} as const;

export type GroupName = keyof typeof GROUPS;

export type GroupControls = Partial<
	Record< GroupName, Record< string, boolean > >
> & {
	/** The block's own values, each one custom property. */
	values?: Record< string, ValueControl >;
};

interface Props {
	controls: GroupControls;
	/** ToolsPanel the items belong to; core's Elements panel uses the client id. */
	panelId: string;
	attributes: { style?: StyleObject };
	setAttributes: ( next: { style?: StyleObject } ) => void;
	/** Element name from the block's declaration, or empty for the root. */
	element?: string;
	/** Section heading; omit to render the items alone. */
	label?: string;
}

/**
 * Renders one element's style controls as a section of the enclosing ToolsPanel.
 *
 * Values are written at the path for the editor's current device and the state
 * chosen in the section, so a single call covers every viewport and state
 * without the block knowing which one is active. On the root, core's own panels
 * own the default state, so only the block's own values render there until a
 * state is chosen.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.controls      Groups and values to render.
 * @param props.panelId       ToolsPanel id.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.element       Element name, or empty for the root.
 * @param props.label         Section heading.
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
	const { viewport, pseudo, setPseudo } = useStyleState( element );
	const declaration = useMemo(
		() => getDeclaration( getBlockType( name ) ),
		[ name ]
	);
	const namespace = getNamespace( name );
	const path = getStylePath( { viewport, pseudo }, element );
	const value = readStyle( attributes.style, path );

	const states = element
		? [
				...( declaration.elements[ element ]?.states ?? [] ),
				...Object.keys( declaration.states ).filter( isCustomState ),
		  ]
		: Object.keys( declaration.states );

	const onChange = useCallback(
		( next: StyleObject ) => {
			setAttributes( {
				style: writeStyle( attributes.style, path, next ),
			} );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ attributes.style, path.join( '.' ), setAttributes ]
	);

	const { values, ...groups } = controls;
	const showGroups = Boolean( element ) || 'default' !== pseudo;

	return (
		<>
			{ label && (
				<div className="b8-style-group__heading">{ label }</div>
			) }
			<StateControl
				states={ states }
				value={ pseudo }
				onChange={ setPseudo }
			/>
			{ values && (
				<ValuesGroup
					values={ readStyle( value, [ namespace ] ) }
					onChange={ ( next ) =>
						onChange( { ...value, [ namespace ]: next } )
					}
					controls={ values }
					panelId={ panelId }
				/>
			) }
			{ showGroups &&
				( Object.keys( groups ) as GroupName[] ).map( ( group ) => {
					const Group = GROUPS[ group ];

					return Group ? (
						<Group
							key={ group }
							value={ value }
							onChange={ onChange }
							controls={ groups[ group ] ?? {} }
							panelId={ panelId }
						/>
					) : null;
				} ) }
		</>
	);
}
