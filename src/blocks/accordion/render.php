<?php
/**
 * Accordion block, server render.
 *
 * @package EverBlocks
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner blocks.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( (string) $content ) ) {
	return;
}

printf(
	'<div %s>%s</div>',
	get_block_wrapper_attributes( array( 'class' => 'eb-accordion eb-accordion--icon-' . ( 'left' === ( $attributes['iconPosition'] ?? '' ) ? 'left' : 'right' ) ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
