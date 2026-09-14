/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { StyleGroup } from '../style-group';
import type { GroupControls } from '../style-group';
import { getDeclaration } from '../../utils/block-declaration';
import { getNamespace } from '../../utils/style-css';
import { stripStyle } from '../../utils/style-path';
import type { StyleObject } from '../../types';

type Element = { label: string } & GroupControls;

interface Props {
	attributes: Record< string, unknown > & { style?: StyleObject };
	setAttributes: ( next: Record< string, unknown > ) => void;
	/** One section per element declared in block.json, plus `root` for the block itself. */
	elements?: Record< string, Element >;
}

/**
 * Renders a block's style controls from a single declaration.
 *
 * Every section fills core's Elements panel, the one slot the inspector keeps
 * in both its normal and its responsive-editing layout. Every element named
 * here must be declared in the block's `block.json` under
 * `supports.everBlocks.elements`, or its section is not rendered — there would
 * be nothing on the page for its values to reach.
 *
 * @since 0.1.0
 * @param props               Component props.
 * @param props.attributes    Block attributes.
 * @param props.setAttributes Attribute setter.
 * @param props.elements      Sections keyed by element name.
 * @return The sections.
 */
export function StylePanels( {
	attributes,
	setAttributes,
	elements = {},
}: Props ) {
	const { clientId, name } = useBlockEditContext();
	const declaration = useMemo(
		() => getDeclaration( getBlockType( name ) ),
		[ name ]
	);
	const namespace = getNamespace( name );

	const resetAllFilter = useCallback(
		( next: { style?: StyleObject } ) => ( {
			...next,
			style: stripStyle(
				next.style,
				namespace,
				Object.keys( declaration.elements ),
				Object.keys( declaration.states )
			),
		} ),
		[ namespace, declaration ]
	);

	const sections = Object.entries( elements ).filter(
		( [ element ] ) => 'root' === element || element in declaration.elements
	);

	if ( ! sections.length ) {
		return null;
	}

	return (
		<InspectorControls group="elements" resetAllFilter={ resetAllFilter }>
			{ sections.map( ( [ element, { label, ...controls } ] ) => (
				<StyleGroup
					key={ element }
					element={ 'root' === element ? '' : element }
					label={ label }
					controls={ controls }
					panelId={ clientId }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) ) }
		</InspectorControls>
	);
}
