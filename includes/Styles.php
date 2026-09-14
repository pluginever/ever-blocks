<?php

namespace EverBlocks;

use EverBlocks\Services\StyleCompiler;

defined( 'ABSPATH' ) || exit;

/**
 * Generated CSS for block instances.
 *
 * Covers only what core's block supports cannot express for a block: its own
 * values as custom properties, the states and elements it declares, and any
 * rules its handler adds. One class per instance carries all of it.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Styles {

	/**
	 * Style compiler.
	 *
	 * @since 2.0.0
	 * @var StyleCompiler
	 */
	private StyleCompiler $compiler;

	/**
	 * Constructor.
	 *
	 * @since 2.0.0
	 */
	public function __construct() {
		$this->compiler = ever_blocks()->compiler;
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
		$name = isset( $block['blockName'] ) && is_string( $block['blockName'] ) ? $block['blockName'] : '';

		if ( '' === $name || '' === trim( $content ) ) {
			return $content;
		}

		$attributes = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
		$style      = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();

		if ( empty( $style ) && ! has_filter( 'ever_blocks_block_styles' ) && ! has_filter( "ever_blocks_block_styles_{$name}" ) ) {
			return $content;
		}

		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $name );

		if ( ! $block_type instanceof \WP_Block_Type ) {
			return $content;
		}

		/**
		 * Filters the CSS rules a block instance contributes.
		 *
		 * @since 2.0.0
		 * @param array<int, array<string, mixed>> $css_rules  Rules of `declarations`, and optionally `selector` and `query`.
		 * @param string                           $name       Block name.
		 * @param array<string, mixed>             $attributes Block attributes.
		 */
		$own = apply_filters( 'ever_blocks_block_styles', array(), $name, $attributes );

		/**
		 * Filters the CSS rules one block contributes to its own instances.
		 *
		 * The dynamic portion of the hook name, `$name`, refers to the block name,
		 * e.g. `ever-blocks/icon`. Mirrors core's `render_block_{$name}` pairing with
		 * the generic `render_block` filter above.
		 *
		 * @since 2.0.0
		 * @param array<int, array<string, mixed>> $css_rules  Rules gathered so far.
		 * @param array<string, mixed>             $attributes Block attributes.
		 */
		$own = apply_filters( "ever_blocks_block_styles_{$name}", $own, $attributes );

		return $this->compiler->apply( $content, $name, $this->compiler->compile( $style, $block_type, (array) $own ) );
	}
}
