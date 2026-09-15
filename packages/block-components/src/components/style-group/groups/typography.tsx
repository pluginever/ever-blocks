/**
 * WordPress dependencies
 */
import { LineHeightControl, useSettings } from '@wordpress/block-editor';
import { FontSizePicker } from '@wordpress/components';
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

export function TypographyGroup( {
	value,
	onChange,
	controls,
	panelId,
}: GroupProps< 'typography' > ) {
	const [ sizes, customSizes ] = useSettings(
		'typography.fontSizes',
		'typography.customFontSize'
	);
	const typography = ( value.typography ?? {} ) as Record< string, unknown >;

	const set = ( key: string, next: unknown ) =>
		onChange( { ...value, typography: { ...typography, [ key ]: next } } );

	return (
		<>
			{ controls.fontSize && (
				<Item
					isShownByDefault={ 'default' === controls.fontSize }
					label={ __( 'Font size', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.fontSize }
					onReset={ () => set( 'fontSize', undefined ) }
				>
					<FontSizePicker
						value={ typography.fontSize as string | undefined }
						fontSizes={ ( sizes as [] ) ?? [] }
						disableCustomFontSizes={ ! customSizes }
						withReset={ false }
						withSlider
						onChange={ ( next ) => set( 'fontSize', next ) }
					/>
				</Item>
			) }

			{ controls.fontAppearance && (
				<Item
					isShownByDefault={ 'default' === controls.fontAppearance }
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
					isShownByDefault={ 'default' === controls.lineHeight }
					label={ __( 'Line height', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.lineHeight }
					onReset={ () => set( 'lineHeight', undefined ) }
				>
					<LineHeightControl
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
					isShownByDefault={ 'default' === controls.letterSpacing }
					label={ __( 'Letter spacing', 'ever-blocks' ) }
					panelId={ panelId }
					value={ typography.letterSpacing }
					onReset={ () => set( 'letterSpacing', undefined ) }
				>
					<LetterSpacingControl
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
					isShownByDefault={ 'default' === controls.textTransform }
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
					/>
				</Item>
			) }

			{ controls.textDecoration && (
				<Item
					isShownByDefault={ 'default' === controls.textDecoration }
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
