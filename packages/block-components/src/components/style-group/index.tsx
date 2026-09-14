/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useCallback, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ToolsPanel } from '../../experimental';
import { getStateLabel } from '../state-control';
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
import {
	getStylePath,
	readStyle,
	stripStyle,
	writeStyle,
} from '../../utils/style-path';
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
	panelId: string;
	attributes: { style?: StyleObject };
	setAttributes: ( next: { style?: StyleObject } ) => void;
	/** Element name from the block's declaration, or empty for the root. */
	element?: string;
	/** Panel label; without one the items slot into the enclosing panel. */
	label?: string;
}

/**
 * Renders one element's style controls, bound to the block's `style` attribute.
 *
 * Values are written at the path for the viewport and state chosen in the bar
 * above the panels, so a single call covers every viewport and state without
 * the block knowing which one is active. On the root, core's own panels own the
 * default state, so only the block's own values render there until a state is
 * chosen.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.controls      Groups and values to render.
 * @param props.panelId       ToolsPanel id.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.element       Element name, or empty for the root.
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
	const { viewport, pseudo } = useStyleState();
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
	const unsupported = 'default' !== pseudo && ! states.includes( pseudo );

	const onChange = useCallback(
		( next: StyleObject ) => {
			setAttributes( {
				style: writeStyle( attributes.style, path, next ),
			} );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ attributes.style, path.join( '.' ), setAttributes ]
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

	const { values, ...groups } = controls;
	const showGroups = Boolean( element ) || 'default' !== pseudo;

	if ( unsupported ) {
		const notice = (
			<Notice status="info" isDismissible={ false }>
				{ sprintf(
					// translators: 1: panel label, 2: state label.
					__( '%1$s has no %2$s state.', 'ever-blocks' ),
					label || __( 'This part', 'ever-blocks' ),
					getStateLabel( pseudo )
				) }
			</Notice>
		);

		return label ? (
			<ToolsPanel
				label={ label }
				panelId={ panelId }
				resetAll={ resetAll }
			>
				<div className="b8-style-group__notice">{ notice }</div>
			</ToolsPanel>
		) : (
			notice
		);
	}

	const items = (
		<>
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

	if ( ! label ) {
		return items;
	}

	return (
		<ToolsPanel label={ label } panelId={ panelId } resetAll={ resetAll }>
			{ items }
		</ToolsPanel>
	);
}
