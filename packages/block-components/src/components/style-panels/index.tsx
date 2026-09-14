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
import { getDeclaration } from '../../utils/block-declaration';
import type { StyleObject } from '../../types';

type Element = { label?: string } & GroupControls;

interface Props {
	attributes: Record< string, unknown > & { style?: StyleObject };
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** One panel per element declared in block.json, plus `root` for the block itself. */
	elements?: Record< string, Element >;
}

/**
 * Renders one style panel per element a block declares, plus `root` for the
 * block itself; an element missing from `block.json` gets no panel.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.elements      Panels keyed by element name.
 * @return The panels.
 */
export function StylePanels( {
	attributes,
	setAttributes,
	elements = {},
}: Props ) {
	const { clientId, name } = useBlockEditContext();
	const blockType = getBlockType( name );
	const declared = getDeclaration( blockType ).elements;

	const panels = Object.entries( elements ).filter(
		( [ element ] ) => 'root' === element || element in declared
	);

	if ( ! panels.length ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
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
					panelId={ `${ clientId }-${ element }` }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) ) }
		</InspectorControls>
	);
}
