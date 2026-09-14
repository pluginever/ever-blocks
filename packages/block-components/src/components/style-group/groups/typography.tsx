/**
 * WordPress dependencies
 */
import { LineHeightControl, useSettings } from '@wordpress/block-editor';
import { FontSizePicker as BaseFontSizePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	FontAppearanceControl,
	LetterSpacingControl,
	TextDecorationControl,
	TextTransformControl,
} from '../../../experimental';
import { Item } from '../item';
import type { GroupProps } from '../types';

const FontSizePicker = BaseFontSizePicker as unknown as React.ComponentType<
	Record< string, unknown >
>;

/**
 * Typography controls for one element.
 *
 * @since 0.1.0
 * @param props          Group props.
 * @param props.value
 * @param props.onChange
 * @param props.controls
 * @param props.panelId
 * @return The controls.
 */
export function TypographyGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps ) {
	const [ sizes, fluid ] = useSettings(
		'typography.fontSizes',
		'typography.fluid'
	);
	const typography = ( value.typography ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next: unknown ) =>
		onChange( { ...value, typography: { ...typography, [ key ]: next } } );

	return (
		<>
			{ controls.fontSize && (
				<Item
					label={ __( 'Size', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.fontSize }
					onReset={ () => set( 'fontSize', undefined ) }
					isShownByDefault
				>
					<FontSizePicker
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						value={ typography.fontSize as string | undefined }
						fontSizes={ ( sizes as [] ) ?? [] }
						fluid={ fluid }
						onChange={ ( next: unknown ) =>
							set( 'fontSize', next )
						}
					/>
				</Item>
			) }

			{ controls.fontAppearance && (
				<Item
					label={ __( 'Appearance', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.fontWeight ?? typography.fontStyle }
					onReset={ () =>
						onChange( {
							...value,
							typography: {
								...typography,
								fontWeight: undefined,
								fontStyle: undefined,
							},
						} )
					}
				>
					<FontAppearanceControl
						__next40pxDefaultSize
						value={ {
							fontStyle: typography.fontStyle,
							fontWeight: typography.fontWeight,
						} }
						onChange={ ( next: Record< string, unknown > ) =>
							onChange( {
								...value,
								typography: { ...typography, ...next },
							} )
						}
					/>
				</Item>
			) }

			{ controls.lineHeight && (
				<Item
					label={ __( 'Line height', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.lineHeight }
					onReset={ () => set( 'lineHeight', undefined ) }
				>
					<LineHeightControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						__unstableInputWidth="auto"
						value={ typography.lineHeight }
						onChange={ ( next: unknown ) =>
							set( 'lineHeight', next )
						}
					/>
				</Item>
			) }

			{ controls.letterSpacing && (
				<Item
					label={ __( 'Letter spacing', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.letterSpacing }
					onReset={ () => set( 'letterSpacing', undefined ) }
				>
					<LetterSpacingControl
						__next40pxDefaultSize
						__unstableInputWidth="auto"
						value={ typography.letterSpacing }
						onChange={ ( next: unknown ) =>
							set( 'letterSpacing', next )
						}
					/>
				</Item>
			) }

			{ controls.textTransform && (
				<Item
					label={ __( 'Letter case', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.textTransform }
					onReset={ () => set( 'textTransform', undefined ) }
				>
					<TextTransformControl
						value={ typography.textTransform }
						onChange={ ( next: unknown ) =>
							set( 'textTransform', next )
						}
						showNone
						isBlock
					/>
				</Item>
			) }

			{ controls.textDecoration && (
				<Item
					label={ __( 'Decoration', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.textDecoration }
					onReset={ () => set( 'textDecoration', undefined ) }
				>
					<TextDecorationControl
						value={ typography.textDecoration }
						onChange={ ( next: unknown ) =>
							set( 'textDecoration', next )
						}
					/>
				</Item>
			) }
		</>
	);
}
