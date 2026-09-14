<?php

namespace EverBlocks;

use EverBlocks\Services\Styler;

defined( 'ABSPATH' ) || exit;

/**
 * Generated CSS for block instances.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Styles {

	/**
	 * Styler.
	 *
	 * @since 2.0.0
	 * @var Styler
	 */
	private Styler $styler;

	/**
	 * Constructor.
	 *
	 * @since 2.0.0
	 */
	public function __construct() {
		$this->styler = ever_blocks()->styler;
	}

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_filter( 'render_block', array( $this, 'render' ), 10, 2 );
	}

	/**
	 * Adds a block instance's generated CSS.
	 *
	 * @since 2.0.0
	 * @param string               $content Rendered block content.
	 * @param array<string, mixed> $block   Parsed block.
	 * @return string Rendered block content.
	 */
	public function render( string $content, array $block ): string {
		$name  = isset( $block['blockName'] ) && is_string( $block['blockName'] ) ? $block['blockName'] : '';
		$style = $block['attrs']['style'] ?? null;

		if ( '' === $name || ! is_array( $style ) || empty( $style ) || '' === trim( $content ) ) {
			return $content;
		}

		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $name );

		if ( ! $block_type instanceof \WP_Block_Type ) {
			return $content;
		}

		return $this->styler->apply( $content, $name, $this->styler->compile( $style, $block_type ) );
	}
}
