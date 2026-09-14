<?php
/**
 * Accordion Item block, server render.
 *
 * @package EverBlocks
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Inner blocks.
 * @var \WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$eb_id        = wp_unique_id( 'eb-accordion-item-' );
$eb_level     = (int) ( $attributes['level'] ?? 3 );
$eb_tag       = $eb_level >= 1 && $eb_level <= 6 ? 'h' . $eb_level : 'p';
$eb_title     = (string) ( $attributes['title'] ?? '' );
$eb_icon      = (string) ( $block->context['ever-blocks/accordionIcon'] ?? '' );
$eb_icon_open = (string) ( $block->context['ever-blocks/accordionIconOpen'] ?? '' );
$eb_icons     = '';

if ( '' !== $eb_icon ) {
	$eb_icons .= '<span class="eb-accordion-item__icon eb-accordion-item__icon--closed" aria-hidden="true">' . wp_get_icon( $eb_icon ) . '</span>';
}

if ( '' !== $eb_icon_open ) {
	$eb_icons .= '<span class="eb-accordion-item__icon eb-accordion-item__icon--open" aria-hidden="true">' . wp_get_icon( $eb_icon_open ) . '</span>';
}

$eb_wrapper = get_block_wrapper_attributes(
	array_filter(
		array(
			'class' => 'eb-accordion-item' . ( '' !== $eb_icon_open ? ' has-open-icon' : '' ),
			'open'  => ! empty( $attributes['open'] ) ? 'open' : null,
		)
	)
);
?>
<details <?php echo $eb_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<summary class="eb-accordion-item__summary" id="<?php echo esc_attr( $eb_id ); ?>">
		<<?php echo esc_html( $eb_tag ); ?> class="eb-accordion-item__title"><?php echo wp_kses_post( $eb_title ); ?></<?php echo esc_html( $eb_tag ); ?>>
		<?php echo $eb_icons; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</summary>
	<div class="eb-accordion-item__panel" role="region" aria-labelledby="<?php echo esc_attr( $eb_id ); ?>">
		<div class="eb-accordion-item__content"><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
	</div>
</details>
