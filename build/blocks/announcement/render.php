<?php
/**
 * Announcement block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Rendered inner blocks.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

printf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes( array( 'class' => 'eb-announcement' ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks.
);
