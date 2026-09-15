/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useIcon } from '../../hooks/use-icons';

// The icons endpoint serves the SVG as registered, without dimensions or
// accessibility attributes; `wp_get_icon()` adds both on the server.
function prepare( content: string, size: number, label?: string ): string {
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

interface Props {
	name?: string;
	/** Width and height in pixels. */
	size?: number;
	/** Accessible label. Omit for a decorative icon. */
	label?: string;
	className?: string;
}

/**
 * Renders a registered icon on the canvas.
 *
 * @since 0.1.0
 * @param props           Display props.
 * @param props.name      Namespaced icon name.
 * @param props.size      Width and height in pixels.
 * @param props.label     Accessible label; omit for a decorative icon.
 * @param props.className Wrapper class.
 * @return The icon, or null when it cannot be resolved.
 */
export function IconDisplay( { name, size = 24, label, className }: Props ) {
	const icon = useIcon( name );
	const markup = useMemo(
		() => ( icon ? prepare( icon.content, size, label ) : '' ),
		[ icon, size, label ]
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
