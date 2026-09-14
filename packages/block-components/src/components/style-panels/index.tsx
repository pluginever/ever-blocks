/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { StyleGroup } from '../style-group';
import type { GroupControls } from '../style-group';
import { StateControl } from '../state-control';
import { getDeclaration } from '../../utils/block-declaration';
import { useStyleState } from '../../hooks/use-style-state';
import type { StyleObject } from '../../types';

type Element = { label?: string } & GroupControls;

interface Props {
	/** Defaults to the block's own client id, which is what a `ToolsPanel` needs. */
	panelId?: string;
	attributes: Record< string, unknown > & { style?: StyleObject };
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** One panel per element declared in block.json, plus `root` for the block itself. */
	elements?: Record< string, Element >;
}

/**
 * Renders a block's style panels from a single declaration.
 *
 * The root panel takes the block's title; every other element named here must
 * be declared in the block's `block.json` under `supports.everBlocks.elements`,
 * or its panel is not rendered — there would be nothing on the page for its
 * values to reach.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.panelId       ToolsPanel id prefix.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.elements      Panels keyed by element name.
 * @return The panels.
 */
export function StylePanels( {
	panelId,
	attributes,
	setAttributes,
	elements = {},
}: Props ) {
	const { clientId, name } = useBlockEditContext();
	const { viewport, pseudo, setPseudo, setViewport } = useStyleState();
	const blockType = getBlockType( name );
	const declaration = getDeclaration( blockType );
	const declared = declaration.elements;
	const id = panelId ?? clientId;
	const states = [
		...new Set( [
			...Object.keys( declaration.states ),
			...Object.values( declared ).flatMap( ( item ) => item.states ),
		] ),
	];

	const panels = Object.entries( elements ).filter(
		( [ element ] ) => 'root' === element || element in declared
	);

	if ( ! panels.length ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<StateControl
				states={ states }
				value={ pseudo }
				onChange={ setPseudo }
				viewport={ viewport }
				onViewportChange={ setViewport }
			/>
			{ panels.map( ( [ element, { label, ...controls } ] ) => (
				<StyleGroup
					key={ element }
					element={ 'root' === element ? '' : element }
					label={
						label ??
						( 'root' === element
							? String( blockType?.title ?? '' )
							: element )
					}
					controls={ controls }
					panelId={ `${ id }-${ element }` }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) ) }
		</InspectorControls>
	);
}
