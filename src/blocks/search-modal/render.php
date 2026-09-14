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

$eb_layout      = in_array( $attributes['layout'] ?? '', array( 'full', 'center', 'top' ), true ) ? $attributes['layout'] : 'full';
$eb_id          = wp_unique_id( 'eb-search-modal-' );
$eb_placeholder = is_string( $attributes['placeholder'] ?? null ) ? $attributes['placeholder'] : '';
$eb_label       = ! empty( $attributes['triggerLabel'] ) && is_string( $attributes['triggerLabel'] ) ? $attributes['triggerLabel'] : __( 'Search', 'ever-blocks' );
$eb_content     = trim( (string) $content );

$eb_icon = static function ( $name ): string {
	return is_string( $name ) && '' !== $name ? (string) wp_get_icon( $name ) : '';
};

$eb_wrapper = get_block_wrapper_attributes(
	array(
		'class'                  => 'eb-search-modal eb-search-modal--' . $eb_layout,
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
		data-wp-bind--aria-expanded="context.isOpen"
	><?php echo $eb_icon( $attributes['triggerIcon'] ?? '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>

	<dialog
		id="<?php echo esc_attr( $eb_id ); ?>"
		class="eb-search-modal__dialog"
		aria-label="<?php echo esc_attr( $eb_label ); ?>"
		data-wp-init="callbacks.dialog"
		data-wp-watch="callbacks.sync"
		data-wp-on--click="actions.dismiss"
	>
		<button
			type="button"
			class="eb-search-modal__close"
			aria-label="<?php esc_attr_e( 'Close search', 'ever-blocks' ); ?>"
			data-wp-on--click="actions.close"
		><?php echo $eb_icon( $attributes['closeIcon'] ?? '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>

		<div class="eb-search-modal__inner">
			<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="eb-search-modal__form">
				<label for="<?php echo esc_attr( $eb_id ); ?>-input" class="screen-reader-text"><?php echo esc_html( $eb_label ); ?></label>
				<input
					type="search"
					id="<?php echo esc_attr( $eb_id ); ?>-input"
					name="s"
					class="eb-search-modal__input"
					placeholder="<?php echo esc_attr( $eb_placeholder ); ?>"
					autocomplete="off"
				/>
				<button type="submit" class="eb-search-modal__submit" aria-label="<?php esc_attr_e( 'Submit search', 'ever-blocks' ); ?>"><?php echo $eb_icon( $attributes['submitIcon'] ?? '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
			</form>

			<?php if ( '' !== $eb_content ) : ?>
				<div class="eb-search-modal__content"><?php echo $eb_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
			<?php endif; ?>
		</div>
	</dialog>
</div>
