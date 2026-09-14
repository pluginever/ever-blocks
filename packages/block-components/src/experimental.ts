/**
 * Single place the `__experimental` prefixes are resolved.
 *
 * Verified against WordPress 7.1: every name below is still prefixed. When one
 * stabilises, this file changes and nothing else does. Import from here rather
 * than reaching for the prefixed name directly.
 */
export {
	__experimentalBorderControl as BorderControl,
	__experimentalBoxControl as BoxControl,
	__experimentalGrid as Grid,
	__experimentalHStack as HStack,
	__experimentalNumberControl as NumberControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalVStack as VStack,
} from '@wordpress/components';

export {
	__experimentalBorderRadiusControl as BorderRadiusControl,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalFontAppearanceControl as FontAppearanceControl,
	__experimentalLetterSpacingControl as LetterSpacingControl,
	__experimentalLinkControl as LinkControl,
	__experimentalSpacingSizesControl as SpacingSizesControl,
	__experimentalTextDecorationControl as TextDecorationControl,
	__experimentalTextTransformControl as TextTransformControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetDimensionsClassesAndStyles as getDimensionsClassesAndStyles,
} from '@wordpress/block-editor';
