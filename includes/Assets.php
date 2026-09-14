<?php

namespace EverBlocks;

defined( 'ABSPATH' ) || exit;

/**
 * Shared asset registration.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Assets {

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_assets' ), 5 );
	}

	/**
	 * Registers the shared handles blocks depend on.
	 *
	 * Nothing is enqueued here. A block names a handle in its `block.json` `style`
	 * array, so core loads it exactly when that block renders — including inside
	 * template parts and synced patterns, which `has_block()` does not inspect.
	 *
	 * Priority 5 so the handles exist before blocks register at priority 10.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_assets(): void {
		$common = EVER_BLOCKS_DIR . 'build/style-common.css';

		if ( is_readable( $common ) && ! wp_style_is( 'ever-blocks-common', 'registered' ) ) {
			wp_register_style(
				'ever-blocks-common',
				EVER_BLOCKS_URL . 'build/style-common.css',
				array(),
				(string) filemtime( $common )
			);
		}
	}
}
