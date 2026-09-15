/**
 * Internal dependencies
 */
import type { Viewport } from '../types';

interface Viewports {
	mobile?: string;
	tablet?: string;
}

/**
 * Builds the media queries for the theme's viewport breakpoints.
 *
 * Core's own `getResponsiveMediaQueries()` is a private API of
 * `@wordpress/global-styles-engine`, so the string has to be rebuilt here from
 * the settings `useSettings( 'viewport' )` returns. `QueriesTest` asserts this
 * matches `WP_Theme_JSON::get_viewport_media_queries()` for every shape,
 * including the one-breakpoint cases where tablet becomes an upper bound.
 *
 * @since 0.1.0
 * @param settings Viewport settings from theme.json.
 * @return Media queries keyed by style-state name.
 */
export function getViewportQueries(
	settings?: Viewports
): Partial< Record< Viewport, string > > {
	const mobile = settings?.mobile ?? '480px';
	const tablet = settings?.tablet ?? '782px';
	const hasMobile =
		undefined !== settings?.mobile || undefined === settings?.tablet;
	const hasTablet =
		undefined !== settings?.tablet || undefined === settings?.mobile;
	const queries: Partial< Record< Viewport, string > > = {};

	if ( hasMobile ) {
		queries[ '@mobile' ] = `@media (width <= ${ mobile })`;
	}

	if ( hasTablet ) {
		queries[ '@tablet' ] = hasMobile
			? `@media (${ mobile } < width <= ${ tablet })`
			: `@media (width <= ${ tablet })`;
	}

	return queries;
}
