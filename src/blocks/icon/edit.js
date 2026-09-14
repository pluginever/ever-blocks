import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import {
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { flipHorizontal, flipVertical, rotateRight } from '@wordpress/icons';
import {
	IconDisplay,
	IconPanel,
	IconPicker,
	StylePanels,
	nextRotation,
	useBlockStyles,
} from '@byteever/block-components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		icon,
		rotation,
		flipHorizontal: flipH,
		flipVertical: flipV,
	} = attributes;
	const blockProps = useBlockProps();

	useBlockStyles( attributes );

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<IconPicker
						value={ icon }
						onSelect={ ( next ) => setAttributes( { icon: next } ) }
						render={ ( { open } ) => (
							<ToolbarButton onClick={ open }>
								{ icon
									? __( 'Replace', 'ever-blocks' )
									: __( 'Select icon', 'ever-blocks' ) }
							</ToolbarButton>
						) }
					/>
					{ icon && (
						<>
							<ToolbarButton
								icon={ rotateRight }
								label={ __( 'Rotate', 'ever-blocks' ) }
								isPressed={ Boolean( rotation ) }
								onClick={ () =>
									setAttributes( {
										rotation: nextRotation( rotation ),
									} )
								}
							/>
							<ToolbarButton
								icon={ flipHorizontal }
								label={ __( 'Flip horizontal', 'ever-blocks' ) }
								isPressed={ Boolean( flipH ) }
								onClick={ () =>
									setAttributes( { flipHorizontal: ! flipH } )
								}
							/>
							<ToolbarButton
								icon={ flipVertical }
								label={ __( 'Flip vertical', 'ever-blocks' ) }
								isPressed={ Boolean( flipV ) }
								onClick={ () =>
									setAttributes( { flipVertical: ! flipV } )
								}
							/>
						</>
					) }
				</ToolbarGroup>
			</BlockControls>

			<IconPanel
				name="icon"
				attributes={ attributes }
				setAttributes={ setAttributes }
				setting={ {
					label: __( 'Icon', 'ever-blocks' ),
					size: false,
					ariaLabel: false,
				} }
			/>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						label: __( 'Icon', 'ever-blocks' ),
						color: { text: true, background: true },
						values: {
							opacity: {
								control: 'range',
								label: __( 'Opacity', 'ever-blocks' ),
								min: 0,
								max: 1,
								step: 0.05,
							},
						},
					},
				} }
			/>

			<div { ...blockProps }>
				{ icon ? (
					<IconDisplay
						name={ icon }
						rotation={ rotation }
						flipHorizontal={ flipH }
						flipVertical={ flipV }
					/>
				) : (
					<IconPicker
						value={ icon }
						onSelect={ ( next ) => setAttributes( { icon: next } ) }
						render={ ( { open } ) => (
							<Placeholder
								icon={ rotateRight }
								label={ __( 'Icon', 'ever-blocks' ) }
								instructions={ __(
									'Choose an icon to display.',
									'ever-blocks'
								) }
							>
								<ToolbarButton
									onClick={ open }
									variant="primary"
								>
									{ __( 'Select icon', 'ever-blocks' ) }
								</ToolbarButton>
							</Placeholder>
						) }
					/>
				) }
			</div>
		</>
	);
}
