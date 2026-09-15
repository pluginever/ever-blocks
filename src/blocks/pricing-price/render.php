<?php
/**
 * Pricing price block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Unused.
 * @var \WP_Block            $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$eb_prices  = is_array( $attributes['prices'] ?? null ) ? $attributes['prices'] : array();
$eb_options = array();

foreach ( is_array( $block->context['ever-blocks/pricingOptions'] ?? null ) ? $block->context['ever-blocks/pricingOptions'] : array() as $eb_option ) {
	if ( is_array( $eb_option ) && ! empty( $eb_option['slug'] ) ) {
		$eb_options[] = $eb_option['slug'];
	}
}

$eb_switching = ! empty( $eb_options ) && ! empty( $attributes['perOption'] );
$eb_options   = $eb_switching ? $eb_options : array( 'default' );
$eb_rows      = '';

foreach ( $eb_options as $eb_slug ) {
	$eb_price = is_array( $eb_prices[ $eb_slug ] ?? null ) ? array_map( 'wp_kses_post', array_filter( $eb_prices[ $eb_slug ], 'is_string' ) ) : array();

	if ( '' === trim( $eb_price['amount'] ?? '' ) ) {
		continue;
	}

	$eb_line = '';

	if ( '' !== ( $eb_price['currency'] ?? '' ) ) {
		$eb_line .= '<span class="eb-pricing-price__currency">' . $eb_price['currency'] . '</span>';
	}

	$eb_line .= '<span class="eb-pricing-price__amount' . ( preg_match( '/\p{L}/u', wp_strip_all_tags( $eb_price['amount'] ) ) ? ' is-text' : '' ) . '">' . $eb_price['amount'] . '</span>';

	if ( '' !== ( $eb_price['period'] ?? '' ) ) {
		$eb_line .= '<span class="eb-pricing-price__period">' . $eb_price['period'] . '</span>';
	}

	if ( '' !== ( $eb_price['original'] ?? '' ) ) {
		$eb_line .= '<s class="eb-pricing-price__original"><span class="screen-reader-text">' . esc_html__( 'Was', 'ever-blocks' ) . ' </span>' . $eb_price['original'] . '</s>';
	}

	$eb_rows .= sprintf(
		'<div class="eb-pricing-price__row"%1$s><span class="eb-pricing-price__line">%2$s</span>%3$s</div>',
		$eb_switching ? sprintf( ' data-wp-context="%s" data-wp-bind--hidden="state.hidden"', esc_attr( (string) wp_json_encode( array( 'option' => $eb_slug ) ) ) ) : '',
		$eb_line,
		empty( $eb_price['note'] ) ? '' : '<span class="eb-pricing-price__note">' . $eb_price['note'] . '</span>'
	);
}

if ( '' === $eb_rows ) {
	return;
}

printf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes( array( 'class' => 'eb-pricing-price' ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$eb_rows // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from wp_kses_post() output above.
);
