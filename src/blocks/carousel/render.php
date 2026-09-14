<?php
/**
 * Carousel block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Rendered slides.
 * @var \WP_Block            $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

$eb_layouts  = array( 'slider', 'row', 'columns' );
$eb_layout   = in_array( $attributes['layout'] ?? '', $eb_layouts, true ) ? $attributes['layout'] : 'slider';
$eb_autoplay = ! empty( $attributes['autoplay'] );
$eb_moving   = $eb_autoplay && 'slider' !== $eb_layout;
$eb_columns  = min( 4, max( 1, (int) ( $attributes['columns'] ?? 3 ) ) );
$eb_count    = count( $block->parsed_block['innerBlocks'] ?? array() );
$eb_loop     = ! isset( $attributes['loop'] ) || $attributes['loop'];
$eb_arrows   = 'slider' === $eb_layout && ( ! isset( $attributes['arrows'] ) || $attributes['arrows'] ) && $eb_count > 1;
$eb_dots     = 'slider' === $eb_layout && ( ! isset( $attributes['dots'] ) || $attributes['dots'] ) && $eb_count > 1;
$eb_icon     = static function ( $name, string $fallback ): string {
	$icon = is_string( $name ) && '' !== $name ? wp_get_icon( $name, array( 'size' => null ) ) : '';

	return (string) ( '' === $icon ? wp_get_icon( $fallback, array( 'size' => null ) ) : $icon );
};

$eb_wrapper = array(
	'class'           => 'eb-carousel is-layout-' . $eb_layout . ( $eb_moving ? ' is-moving' : '' ),
	'data-wp-context' => (string) wp_json_encode(
		array(
			'index'    => 0,
			'count'    => $eb_count,
			'layout'   => $eb_layout,
			'autoplay' => $eb_autoplay,
			'delay'    => max( 1, (float) ( $attributes['delay'] ?? 5 ) ),
			'loop'     => $eb_loop,
			'speed'    => max( 10, (int) ( $attributes['speed'] ?? 60 ) ),
			'reverse'  => 'right' === ( $attributes['direction'] ?? 'left' ),
		)
	),
);

if ( 'slider' === $eb_layout || $eb_moving ) {
	$eb_wrapper += array(
		'data-wp-interactive'    => 'ever-blocks/carousel',
		'data-wp-init'           => 'callbacks.init',
		'data-wp-on--mouseenter' => 'actions.pause',
		'data-wp-on--mouseleave' => 'actions.resume',
		'data-wp-on--focusin'    => 'actions.pause',
		'data-wp-on--focusout'   => 'actions.resume',
	);
}

if ( 'slider' === $eb_layout ) {
	$eb_wrapper['role']                 = 'region';
	$eb_wrapper['aria-roledescription'] = __( 'carousel', 'ever-blocks' );
}

if ( 'columns' === $eb_layout ) {
	$eb_wrapper['style'] = '--columns:' . $eb_columns;
}

if ( 'columns' === $eb_layout && $eb_moving ) {
	$eb_column_html = array_fill( 0, $eb_columns, '' );

	foreach ( array_values( iterator_to_array( $block->inner_blocks ) ) as $eb_i => $eb_slide ) {
		$eb_column_html[ $eb_i % $eb_columns ] .= $eb_slide->render();
	}

	$eb_track = '<div class="eb-carousel__track" data-wp-watch="callbacks.measure">';

	foreach ( $eb_column_html as $eb_html ) {
		$eb_track .= sprintf( '<div class="eb-carousel__column"><div class="eb-carousel__run">%1$s</div><div class="eb-carousel__run" aria-hidden="true">%1$s</div></div>', $eb_html );
	}

	$eb_track .= '</div>';
} elseif ( 'row' === $eb_layout && $eb_moving ) {
	$eb_track = sprintf(
		'<div class="eb-carousel__track" data-wp-watch="callbacks.measure"><div class="eb-carousel__run">%1$s</div><div class="eb-carousel__run" aria-hidden="true">%1$s</div></div>',
		$content
	);
} elseif ( 'slider' !== $eb_layout ) {
	$eb_track = '<div class="eb-carousel__track">' . $content . '</div>';
} else {
	$eb_track = sprintf(
		'<div class="eb-carousel__track" tabindex="0" data-wp-on--scroll="actions.scrolled" data-wp-on--keydown="actions.key" aria-label="%1$s">%2$s</div>',
		esc_attr__( 'Slides', 'ever-blocks' ),
		$content
	);
}

$eb_nav = '';

if ( $eb_arrows || $eb_dots ) {
	$eb_dot_buttons = '';

	for ( $eb_i = 0; $eb_dots && $eb_i < $eb_count; $eb_i++ ) {
		$eb_dot_buttons .= sprintf(
			'<button type="button" class="eb-carousel__dot" data-wp-on--click="actions.go" data-index="%1$d" aria-label="%2$s"%3$s></button>',
			$eb_i,
			/* translators: %d: slide number. */
			esc_attr( sprintf( __( 'Go to slide %d', 'ever-blocks' ), $eb_i + 1 ) ),
			0 === $eb_i ? ' aria-current="true"' : ''
		);
	}

	$eb_nav = sprintf(
		'<div class="eb-carousel__nav">%1$s%2$s%3$s</div>',
		$eb_arrows ? sprintf( '<button type="button" class="eb-carousel__arrow eb-carousel__arrow--previous" data-wp-on--click="actions.previous" aria-label="%1$s">%2$s</button>', esc_attr__( 'Previous slide', 'ever-blocks' ), $eb_icon( $attributes['previousIcon'] ?? '', 'core/chevron-left' ) ) : '',
		$eb_dots ? '<div class="eb-carousel__dots">' . $eb_dot_buttons . '</div>' : '',
		$eb_arrows ? sprintf( '<button type="button" class="eb-carousel__arrow eb-carousel__arrow--next" data-wp-on--click="actions.next" aria-label="%1$s">%2$s</button>', esc_attr__( 'Next slide', 'ever-blocks' ), $eb_icon( $attributes['nextIcon'] ?? '', 'core/chevron-right' ) ) : ''
	);
}

printf(
	'<div %1$s>%2$s%3$s%4$s</div>',
	get_block_wrapper_attributes( $eb_wrapper ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$eb_track, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks.
	$eb_nav, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts above.
	'slider' === $eb_layout ? '<div class="eb-carousel__status" aria-live="polite" aria-atomic="true"></div>' : ''
);
