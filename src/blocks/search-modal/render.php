<?php
/**
 * Search Modal block, server render.
 *
 * @package EverBlocks
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner blocks.
 */

defined( 'ABSPATH' ) || exit;

$eb_overlay = in_array( $attributes['overlay'] ?? '', array( 'full', 'center', 'top' ), true ) ? $attributes['overlay'] : 'full';
$eb_id      = wp_unique_id( 'eb-search-modal-' );
$eb_label   = is_string( $attributes['triggerLabel'] ?? null ) ? trim( wp_strip_all_tags( $attributes['triggerLabel'] ) ) : '';
$eb_label   = '' === $eb_label ? __( 'Search', 'ever-blocks' ) : $eb_label;

$eb_icon = static function ( $name ): string {
	return is_string( $name ) && '' !== $name ? (string) wp_get_icon( $name, array( 'size' => null ) ) : '';
};

$eb_wrapper = get_block_wrapper_attributes(
	array(
		'class'                  => 'eb-search-modal eb-search-modal--' . $eb_overlay,
		'data-wp-interactive'    => 'ever-blocks/search-modal',
		'data-wp-context'        => wp_json_encode(
			array(
				'isOpen'   => false,
				'shortcut' => ! empty( $attributes['shortcut'] ),
			)
		),
		'data-wp-class--is-open' => 'context.isOpen',
		'data-wp-init'           => 'callbacks.shortcut',
	)
);
?>
<div <?php echo $eb_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<button
		type="button"
		class="eb-search-modal__trigger"
		aria-label="<?php echo esc_attr( $eb_label ); ?>"
		aria-haspopup="dialog"
		aria-controls="<?php echo esc_attr( $eb_id ); ?>"
		data-wp-on--click="actions.open"
	><?php echo $eb_icon( $attributes['triggerIcon'] ?? '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>

	<dialog
		id="<?php echo esc_attr( $eb_id ); ?>"
		class="eb-search-modal__dialog"
		aria-label="<?php echo esc_attr( $eb_label ); ?>"
		data-wp-init="callbacks.dialog"
		data-wp-watch="callbacks.sync"
		data-wp-on--click="actions.dismiss"
	>
		<div class="eb-search-modal__content"><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>

		<button
			type="button"
			class="eb-search-modal__close"
			aria-label="<?php esc_attr_e( 'Close search', 'ever-blocks' ); ?>"
			data-wp-on--click="actions.close"
		><?php echo $eb_icon( $attributes['closeIcon'] ?? '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
	</dialog>
</div>
