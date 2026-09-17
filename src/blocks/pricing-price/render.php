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

$eb_price = array_map( 'wp_kses_post', array_filter( $attributes, 'is_string' ) );

if ( '' === trim( $eb_price['amount'] ?? '' ) ) {
	return;
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

printf(
	'<div %1$s><span class="eb-pricing-price__line">%2$s</span>%3$s</div>',
	get_block_wrapper_attributes( array( 'class' => 'eb-pricing-price' ) ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$eb_line, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from wp_kses_post() output above.
	empty( $eb_price['note'] ) ? '' : '<span class="eb-pricing-price__note">' . $eb_price['note'] . '</span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() output.
);
