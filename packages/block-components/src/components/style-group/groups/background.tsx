/**
 * WordPress dependencies
 */
import {
	MediaUpload,
	MediaUploadCheck,
	useSettings,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ToggleGroupControl,
	ToggleGroupControlOption,
} from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

interface Image {
	url?: string;
	id?: number;
}

/**
 * Background image, size, position and repeat for one element.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function BackgroundGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ enabled ] = useSettings( 'background.backgroundImage' );
	const background = ( value.background ?? {} ) as Record< string, unknown >;
	const image = ( background.backgroundImage ?? {} ) as Image;

	const set = ( next: Record< string, unknown > ) =>
		onChange( { ...value, background: { ...background, ...next } } );

	if ( ! controls.image || false === enabled ) {
		return null;
	}

	return (
		<>
			<Item
				label={ __( 'Image', 'ever-blocks' ) }
				panelId={ panelId }
				value={ image.url }
				onReset={ () =>
					set( {
						backgroundImage: undefined,
						backgroundSize: undefined,
						backgroundPosition: undefined,
						backgroundRepeat: undefined,
					} )
				}
				isShownByDefault
			>
				<MediaUploadCheck>
					<MediaUpload
						allowedTypes={ [ 'image' ] }
						value={ image.id }
						onSelect={ ( media: { id: number; url: string } ) =>
							set( {
								backgroundImage: {
									id: media.id,
									url: media.url,
								},
							} )
						}
						render={ ( { open }: { open: () => void } ) => (
							<Button
								__next40pxDefaultSize
								variant="secondary"
								onClick={ open }
							>
								{ image.url
									? __( 'Replace image', 'ever-blocks' )
									: __( 'Select image', 'ever-blocks' ) }
							</Button>
						) }
					/>
				</MediaUploadCheck>
			</Item>

			{ controls.size && image.url && (
				<Item
					label={ __( 'Size', 'ever-blocks' ) }
					panelId={ panelId }
					value={ background.backgroundSize }
					onReset={ () => set( { backgroundSize: undefined } ) }
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Size', 'ever-blocks' ) }
						value={
							background.backgroundSize as string | undefined
						}
						onChange={ ( next: unknown ) =>
							set( { backgroundSize: next } )
						}
						isBlock
					>
						<ToggleGroupControlOption
							value="cover"
							label={ __( 'Cover', 'ever-blocks' ) }
						/>
						<ToggleGroupControlOption
							value="contain"
							label={ __( 'Contain', 'ever-blocks' ) }
						/>
						<ToggleGroupControlOption
							value="auto"
							label={ __( 'Tile', 'ever-blocks' ) }
						/>
					</ToggleGroupControl>
				</Item>
			) }

			{ controls.repeat && image.url && (
				<Item
					label={ __( 'Repeat', 'ever-blocks' ) }
					panelId={ panelId }
					value={ background.backgroundRepeat }
					onReset={ () => set( { backgroundRepeat: undefined } ) }
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Repeat', 'ever-blocks' ) }
						value={
							background.backgroundRepeat as string | undefined
						}
						onChange={ ( next: unknown ) =>
							set( { backgroundRepeat: next } )
						}
						isBlock
					>
						<ToggleGroupControlOption
							value="repeat"
							label={ __( 'Repeat', 'ever-blocks' ) }
						/>
						<ToggleGroupControlOption
							value="no-repeat"
							label={ __( 'No repeat', 'ever-blocks' ) }
						/>
					</ToggleGroupControl>
				</Item>
			) }
		</>
	);
}
