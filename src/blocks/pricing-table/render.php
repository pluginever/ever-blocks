<?php
/**
 * Pricing table block template.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @var array<string, mixed> $attributes Block attributes.
 * @var string               $content    Rendered columns.
 * @var \WP_Block            $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

$eb_options = array();

foreach ( is_array( $attributes['options'] ?? null ) ? $attributes['options'] : array() as $eb_option ) {
	if ( is_array( $eb_option ) && ! empty( $eb_option['slug'] ) ) {
		$eb_options[] = $eb_option;
	}
}

$eb_slugs  = array_column( $eb_options, 'slug' );
$eb_active = in_array( $attributes['active'] ?? '', $eb_slugs, true ) ? $attributes['active'] : ( $eb_slugs[0] ?? '' );
$eb_switch = '';

$eb_layout = in_array( $attributes['layout'] ?? '', array( 'card', 'divided' ), true ) ? $attributes['layout'] : 'card';

$eb_wrapper = array(
	'class' => 'eb-pricing-table is-layout-' . $eb_layout,
	'style' => '--columns:' . count( $block->parsed_block['innerBlocks'] ?? array() ),
);

if ( $eb_options ) {
	$eb_is_active = static function (): bool {
		$context = wp_interactivity_get_context();

		return ( $context['option'] ?? null ) === ( $context['active'] ?? null );
	};

	wp_interactivity_state(
		'ever-blocks/pricing-table',
		array(
			'checked'  => $eb_is_active,
			'tabindex' => static fn(): int => $eb_is_active() ? 0 : -1,
			'hidden'   => static fn(): bool => ! $eb_is_active(),
		)
	);

	$eb_wrapper['data-wp-interactive'] = 'ever-blocks/pricing-table';
	$eb_wrapper['data-wp-context']     = (string) wp_json_encode( array( 'active' => $eb_active ) );

	foreach ( $eb_options as $eb_option ) {
		$eb_switch .= sprintf(
			'<button type="button" role="radio" class="eb-pricing-table__option" data-option="%1$s" data-wp-context="%2$s" data-wp-bind--aria-checked="state.checked" data-wp-bind--tabindex="state.tabindex" data-wp-on--click="actions.select" data-wp-on--keydown="actions.key">%3$s%4$s</button>',
			esc_attr( $eb_option['slug'] ),
			esc_attr( (string) wp_json_encode( array( 'option' => $eb_option['slug'] ) ) ),
			esc_html( $eb_option['label'] ?? '' ),
			empty( $eb_option['badge'] ) ? '' : '<span class="eb-pricing-table__option-badge">' . esc_html( $eb_option['badge'] ) . '</span>'
		);
	}

	$eb_switch = sprintf(
		'<div class="eb-pricing-table__switch" role="radiogroup" aria-label="%1$s">%2$s</div>',
		esc_attr( $attributes['optionsLabel'] ?? __( 'Billing period', 'ever-blocks' ) ),
		$eb_switch
	);
}

printf(
	'<div %1$s>%2$s<div class="eb-pricing-table__columns">%3$s</div></div>',
	get_block_wrapper_attributes( $eb_wrapper ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by get_block_wrapper_attributes().
	$eb_switch, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built from escaped parts above.
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered inner blocks.
);
