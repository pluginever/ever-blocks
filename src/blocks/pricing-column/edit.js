import {
	BlockControls,
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plus, starFilled } from '@wordpress/icons';
import {
	SettingsPanels,
	StylePanels,
	useBlockStyles,
} from '@byteever/block-components';
import { blankColumn } from '../pricing-table/variations';
import './editor.scss';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const { featured, badge, option } = attributes;
	const tableOptions = context[ 'ever-blocks/pricingOptions' ] ?? [];
	const shown =
		! option ||
		! tableOptions.length ||
		option === context[ 'ever-blocks/pricingActive' ];
	const { parentId, index, isSelected, options } = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getBlockIndex,
				getBlockAttributes,
				hasSelectedInnerBlock,
				isBlockSelected,
			} = select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );

			return {
				parentId: rootClientId,
				index: getBlockIndex( clientId ),
				isSelected:
					isBlockSelected( clientId ) ||
					hasSelectedInnerBlock( clientId, true ),
				options: getBlockAttributes( rootClientId )?.options ?? [],
			};
		},
		[ clientId ]
	);
	const { insertBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps( {
		className: `eb-pricing-column${ featured ? ' is-featured' : '' }${
			shown ? '' : ' is-inactive'
		}`,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-pricing-column__content' },
		{ orientation: 'vertical' }
	);

	useBlockStyles( attributes );

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						icon={ starFilled }
						label={ __( 'Featured', 'ever-blocks' ) }
						isPressed={ featured }
						onClick={ () =>
							setAttributes( { featured: ! featured } )
						}
					/>
					<ToolbarButton
						icon={ plus }
						label={ __( 'Add column after', 'ever-blocks' ) }
						onClick={ () =>
							insertBlocks(
								createBlocksFromInnerBlocksTemplate( [
									blankColumn( options ),
								] ),
								index + 1,
								parentId
							)
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			<SettingsPanels
				label={ __( 'Plan', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					featured: {
						type: 'toggle',
						label: __( 'Featured', 'ever-blocks' ),
						help: __(
							'Stands out from the other plans and comes first on phones.',
							'ever-blocks'
						),
						isShownByDefault: true,
					},
					...( tableOptions.length
						? {
								option: {
									type: 'select',
									label: __( 'Show for', 'ever-blocks' ),
									help: __(
										'Only for this billing option; leave on every option when just the price changes.',
										'ever-blocks'
									),
									isShownByDefault: true,
									options: [
										{
											label: __(
												'Every option',
												'ever-blocks'
											),
											value: '',
										},
										...tableOptions.map( ( o ) => ( {
											label: o.label || o.slug,
											value: o.slug,
										} ) ),
									],
								},
						  }
						: {} ),
				} }
			/>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							gap: {
								control: 'unit',
								label: __( 'Gap', 'ever-blocks' ),
								min: 0,
							},
						},
					},
					badge: {
						label: __( 'Badge', 'ever-blocks' ),
						color: { text: true, background: true },
						typography: { fontSize: true, fontAppearance: true },
						border: { radius: true },
					},
				} }
			/>

			<div { ...blockProps }>
				{ ( badge || isSelected ) && (
					<RichText
						tagName="span"
						className="eb-pricing-column__badge"
						value={ badge }
						onChange={ ( next ) =>
							setAttributes( { badge: next || undefined } )
						}
						placeholder={ __( 'Badge', 'ever-blocks' ) }
						allowedFormats={ [] }
						withoutInteractiveFormatting
					/>
				) }
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
