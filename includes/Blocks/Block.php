<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Base class for a block's server behaviour.
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
	 * Wires the subclass's `render()` as the block's render callback.
	 *
	 * @since 2.0.0
	 */
	public function __construct() {
		add_filter( 'block_type_metadata_settings', array( $this, 'render_callback' ), 10, 2 );
	}

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {}

	/**
	 * Makes the subclass's `render()` the block's render callback when it defines one.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $settings Block type settings.
	 * @param array<string, mixed> $metadata Block metadata.
	 * @return array<string, mixed> Block type settings.
	 */
	public function render_callback( array $settings, array $metadata ): array {
		if ( ( $metadata['name'] ?? '' ) === $this->name && method_exists( $this, 'render' ) ) {
			$settings['render_callback'] = array( $this, 'render' );
		}

		return $settings;
	}
}
