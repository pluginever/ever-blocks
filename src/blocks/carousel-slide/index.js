import { createBlock, registerBlockType } from '@wordpress/blocks';
import {
	BlockControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { gallery as slides, plus } from '@wordpress/icons';
import metadata from './block.json';
import './style.scss';

function Edit( { clientId } ) {
	const { parentId, index } = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockIndex } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );

			return {
				parentId: rootClientId,
				index: getBlockIndex( clientId ),
			};
		},
		[ clientId ]
	);
	const { insertBlock } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( { className: 'eb-carousel__slide' } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: [ [ 'core/paragraph' ] ],
	} );

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						icon={ plus }
						label={ __( 'Add slide after', 'ever-blocks' ) }
						onClick={ () =>
							insertBlock(
								createBlock( metadata.name, {}, [
									createBlock( 'core/paragraph' ),
								] ),
								index + 1,
								parentId
							)
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...innerBlocksProps } />
		</>
	);
}

registerBlockType( metadata.name, {
	icon: slides,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
