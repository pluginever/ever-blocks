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
		if ( '' === $this->name ) {
			return;
		}

		add_filter( 'render_block_' . $this->name, array( $this, 'render' ), 10, 2 );
		add_filter( 'ever_blocks_block_styles_' . $this->name, array( $this, 'style' ), 10, 2 );

		$this->register();
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
	 * Runs the style pipeline for one instance of the block.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>> $rules      Rules gathered so far.
	 * @param array<string, mixed>             $attributes Block attributes.
	 * @return array<int, array<string, mixed>> Rules.
	 */
	public function style( array $rules, array $attributes ): array {
		return array_merge( $rules, $this->styles( $attributes ) );
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

	/**
	 * Returns the CSS rules an instance needs beyond what the block supports write.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return array<int, array<string, mixed>> Rules of `declarations`, and optionally a `selector` relative to the instance and a `query`.
	 */
	protected function styles( array $attributes ): array {
		return array();
	}

	/**
	 * Returns a CSS value from a stored style value, resolving a preset reference.
	 *
	 * @since 2.0.0
	 * @param mixed $value Stored value, such as `#fff` or `var:preset|color|contrast`.
	 * @return string CSS value, or an empty string when there is none.
	 */
	protected function css_value( $value ): string {
		if ( ! is_string( $value ) || '' === $value ) {
			return '';
		}

		return (string) wp_normalize_state_preset_vars( $value );
	}

	/**
	 * Reads a theme.json setting for this block.
	 *
	 * @since 2.0.0
	 * @param array<int, string> $path Setting path, such as `array( 'spacing', 'units' )`.
	 * @return mixed Setting value, or null when it is not set.
	 */
	protected function setting( array $path ) {
		return wp_get_global_settings( $path, array( 'block_name' => $this->name ) );
	}
}
