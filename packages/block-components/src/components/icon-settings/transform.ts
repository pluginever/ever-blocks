/**
 * The rotation the toolbar steps through, matching `core/icon`.
 *
 * @since 0.1.0
 */
export const ROTATION_STEP = 90;

export interface IconTransform {
	rotation?: number;
	flipHorizontal?: boolean;
	flipVertical?: boolean;
}

/**
 * Returns the next rotation, wrapping a full turn back to none.
 *
 * @since 0.1.0
 * @param rotation Current rotation in degrees.
 * @return The next rotation in degrees.
 */
export function nextRotation( rotation?: number ): number {
	return ( ( Number( rotation ) || 0 ) + ROTATION_STEP ) % 360;
}

/**
 * Returns the inline style that renders an icon's rotation and flips.
 *
 * Core applies rotation inline and the flips as classes (`blocks/icon.php`),
 * which needs `core/icon`'s own stylesheet. Both go inline here so an icon
 * renders the same wherever it is placed, with no stylesheet to depend on.
 *
 * @since 0.1.0
 * @param transform Icon transform attributes.
 * @return Style properties, empty when the icon is untransformed.
 */
export function getIconTransform(
	transform: IconTransform
): Record< string, string > {
	const { rotation, flipHorizontal, flipVertical } = transform;
	const degrees = Number( rotation ) || 0;
	const style: Record< string, string > = {};

	if ( degrees % 360 ) {
		style.rotate = `${ degrees % 360 }deg`;
	}

	if ( flipHorizontal || flipVertical ) {
		style.scale = `${ flipHorizontal ? -1 : 1 } ${ flipVertical ? -1 : 1 }`;
	}

	return style;
}
