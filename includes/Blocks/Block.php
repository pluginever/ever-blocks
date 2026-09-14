<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Base block class.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
abstract class Block {

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = '';

	/**
	 * Constructor.
	 *
	 * @since 2.0.0
	 */
	public function __construct() {
		if ( '' !== $this->name ) {
			add_filter( 'render_block_' . $this->name, array( $this, 'render' ), 10, 2 );
		}
	}

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {}

	/**
	 * Runs the render pipeline for one instance of the block.
	 *
	 * @since 2.0.0
	 * @param string               $content Rendered block content.
	 * @param array<string, mixed> $block   Parsed block.
	 * @return string Rendered block content.
	 */
	public function render( string $content, array $block ): string {
		$attributes = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();

		return $this->content( $content, $attributes, $block );
	}

	/**
	 * Alters the rendered content.
	 *
	 * @since 2.0.0
	 * @param string               $content    Rendered block content.
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param array<string, mixed> $block      Parsed block.
	 * @return string Rendered block content.
	 */
	protected function content( string $content, array $attributes, array $block ): string {
		return $content;
	}
}
