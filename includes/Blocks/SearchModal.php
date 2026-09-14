<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Search Modal block.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class SearchModal extends Block {

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/search-modal';


	/**
	 * Builds the block's markup: a trigger button and a dialog holding the inner blocks.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Rendered inner blocks.
	 * @return string Block markup.
	 */
	public function markup( array $attributes, string $content ): string {
		$overlay = in_array( $attributes['overlay'] ?? '', array( 'full', 'center', 'top' ), true ) ? $attributes['overlay'] : 'full';
		$id      = wp_unique_id( 'eb-search-modal-' );
		$label   = is_string( $attributes['triggerLabel'] ?? null ) ? trim( wp_strip_all_tags( $attributes['triggerLabel'] ) ) : '';
		$label   = '' === $label ? __( 'Search', 'ever-blocks' ) : $label;

		$wrapper = get_block_wrapper_attributes(
			array(
				'class'                  => 'eb-search-modal eb-search-modal--' . $overlay,
				'data-wp-interactive'    => 'ever-blocks/search-modal',
				'data-wp-context'        => (string) wp_json_encode(
					array(
						'isOpen'   => false,
						'shortcut' => ! empty( $attributes['shortcut'] ),
					)
				),
				'data-wp-class--is-open' => 'context.isOpen',
				'data-wp-init'           => 'callbacks.shortcut',
			)
		);

		return sprintf(
			'<div %1$s>' .
			'<button type="button" class="eb-search-modal__trigger" aria-label="%2$s" aria-haspopup="dialog" aria-controls="%3$s" data-wp-on--click="actions.open">%4$s</button>' .
			'<dialog id="%3$s" class="eb-search-modal__dialog" aria-label="%2$s" data-wp-init="callbacks.dialog" data-wp-watch="callbacks.sync" data-wp-on--click="actions.dismiss">' .
			'<div class="eb-search-modal__content">%5$s</div>' .
			'<button type="button" class="eb-search-modal__close" aria-label="%6$s" data-wp-on--click="actions.close">%7$s</button>' .
			'</dialog>' .
			'</div>',
			$wrapper,
			esc_attr( $label ),
			esc_attr( $id ),
			$this->icon( $attributes['triggerIcon'] ?? '' ),
			$content,
			esc_attr__( 'Close search', 'ever-blocks' ),
			$this->icon( $attributes['closeIcon'] ?? '' )
		);
	}

	/**
	 * Returns a registered icon's markup, unsized so the stylesheet sizes it.
	 *
	 * @since 2.0.0
	 * @param mixed $name Icon name.
	 * @return string SVG markup, or an empty string.
	 */
	private function icon( $name ): string {
		return is_string( $name ) && '' !== $name ? (string) wp_get_icon( $name, array( 'size' => null ) ) : '';
	}
}
