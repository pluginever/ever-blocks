<?php
/**
 * Carousel slide block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Rendered inner blocks.
 * @var \WP_Block            $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

printf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes(
		array(
			'class'                => 'eb-carousel__slide',
			'role'                 => 'group',
			'aria-roledescription' => __( 'slide', 'ever-blocks' ),
		)
	), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks.
);
