/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Icon } from '../../hooks/use-icons';
import { useIcons } from '../../hooks/use-icons';
import { getIconTransform } from '../icon-settings/transform';
import type { IconTransform } from '../icon-settings/transform';

/**
 * Returns a single registered icon by name.
 *
 * @since 0.1.0
 * @param name Namespaced icon name, such as `core/star-filled`.
 * @return The icon, or undefined while loading or when it is not registered.
 */
export function useIcon( name?: string ): Icon | undefined {
	const { icons } = useIcons( Boolean( name ) );

	return name ? icons.find( ( icon ) => icon.name === name ) : undefined;
}

/**
 * Applies size and accessibility attributes to raw icon markup.
 *
 * The icons endpoint serves the SVG as registered, with a `viewBox` and no
 * dimensions — `wp_get_icon()` adds those when rendering on the server. Doing
 * the same here keeps the editor and the front end in step; without it the icon
 * scales to whatever space it is given.
 *
 * The transform goes on the SVG rather than a wrapper, as `blocks/icon.php`
 * does. A wrapper is sized by its parent — a grid item fills its whole track —
 * so rotating it swings the icon across the block instead of turning in place.
 *
 * @since 0.1.0
 * @param content       Raw SVG markup.
 * @param size          Width and height in pixels.
 * @param label         Accessible label. Omit for a decorative icon.
 * @param transform     Rotation and flips.
 * @param iconClassName Classes for the SVG element.
 * @param iconStyle     Inline declarations for the SVG element.
 * @return Prepared SVG markup.
 */
function prepare(
	content: string,
	size: number,
	label?: string,
	transform: IconTransform = {},
	iconClassName = '',
	iconStyle: Record< string, unknown > = {}
): string {
	const document = new window.DOMParser().parseFromString(
		content,
		'image/svg+xml'
	);
	const svg = document.querySelector( 'svg' );

	if ( ! svg ) {
		return '';
	}

	svg.setAttribute( 'width', String( size ) );
	svg.setAttribute( 'height', String( size ) );

	const style = Object.entries( {
		...iconStyle,
		...getIconTransform( transform ),
	} )
		.filter( ( [ , value ] ) => undefined !== value && null !== value )
		.map(
			( [ property, value ] ) =>
				`${ property.replace(
					/[A-Z]/g,
					( letter ) => `-${ letter.toLowerCase() }`
				) }:${ value }`
		)
		.join( ';' );

	if ( style ) {
		svg.setAttribute( 'style', style );
	}

	if ( iconClassName ) {
		svg.setAttribute(
			'class',
			[ svg.getAttribute( 'class' ), iconClassName ]
				.filter( Boolean )
				.join( ' ' )
		);
	}

	if ( label ) {
		svg.setAttribute( 'role', 'img' );
		svg.setAttribute( 'aria-label', label );
		svg.removeAttribute( 'aria-hidden' );
		svg.removeAttribute( 'focusable' );
	} else {
		svg.setAttribute( 'aria-hidden', 'true' );
		svg.setAttribute( 'focusable', 'false' );
	}

	return svg.outerHTML;
}

interface Props extends IconTransform {
	name?: string;
	/** Width and height in pixels. Defaults to core's own default. */
	size?: number;
	/** Accessible label. Omit for a decorative icon. */
	label?: string;
	className?: string;
	/** Classes for the SVG itself, e.g. from block support props. */
	iconClassName?: string;
	/** Inline declarations for the SVG itself, e.g. from block support props. */
	iconStyle?: Record< string, unknown >;
}

/**
 * Renders a registered icon.
 *
 * The editor has no server render to fall back on, so a block showing an icon
 * on the canvas resolves it through this rather than duplicating the lookup.
 *
 * @since 0.1.0
 * @param props                Display props.
 * @param props.name
 * @param props.size
 * @param props.label
 * @param props.className
 * @param props.iconClassName
 * @param props.iconStyle
 * @param props.rotation
 * @param props.flipHorizontal
 * @param props.flipVertical
 * @return The icon, or null when it cannot be resolved.
 */
export function IconDisplay( {
	name,
	size = 24,
	label,
	className,
	iconClassName = '',
	iconStyle,
	rotation,
	flipHorizontal,
	flipVertical,
}: Props ) {
	const icon = useIcon( name );
	const iconStyleKey = JSON.stringify( iconStyle ?? {} );
	const markup = useMemo(
		() =>
			icon
				? prepare(
						icon.content,
						size,
						label,
						{ rotation, flipHorizontal, flipVertical },
						iconClassName,
						iconStyle
				  )
				: '',
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			icon,
			size,
			label,
			rotation,
			flipHorizontal,
			flipVertical,
			iconClassName,
			iconStyleKey,
		]
	);

	if ( ! markup ) {
		return null;
	}

	return (
		<span
			className={ className }
			style={ { display: 'inline-flex' } }
			// Markup comes from the icons endpoint, which serves only icons
			// registered in PHP.
			dangerouslySetInnerHTML={ { __html: markup } }
		/>
	);
}
