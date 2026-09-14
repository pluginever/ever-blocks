<?php
/**
 * Icon block, server render.
 *
 * @package EverBlocks
 *
 * @var array $attributes Block attributes.
 */

defined( 'ABSPATH' ) || exit;

if ( empty( $attributes['icon'] ) || ! is_string( $attributes['icon'] ) ) {
	return;
}

// `core/icon` already applies the supports this block skips serialising to the
// SVG rather than the wrapper, and reads the wrapper from the block being
// rendered, so it emits ours. Falls back to an unstyled icon if core renames it.
if ( function_exists( 'render_block_core_icon' ) ) {
	echo render_block_core_icon( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

	return;
}

printf(
	'<div %s>%s</div>',
	get_block_wrapper_attributes(), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	wp_get_icon( $attributes['icon'], array( 'label' => $attributes['ariaLabel'] ?? '' ) ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
