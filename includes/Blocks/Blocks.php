<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Block and category registration.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Blocks {

	/**
	 * Priority the block category is added at.
	 *
	 * @since 2.0.0
	 * @var int
	 */
	private const CATEGORY_PRIORITY = PHP_INT_MAX;

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'register_category' ), self::CATEGORY_PRIORITY );
	}

	/**
	 * Registers the block collection and each enabled block.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_blocks(): void {
		$path     = untrailingslashit( EVER_BLOCKS_DIR . 'build/blocks' );
		$manifest = EVER_BLOCKS_DIR . 'build/blocks-manifest.php';

		if ( ! is_readable( $manifest ) ) {
			return;
		}

		wp_register_block_metadata_collection( $path, $manifest );

		foreach ( array_keys( (array) require $manifest ) as $slug ) {
			if ( ! $this->is_block_enabled( (string) $slug ) ) {
				continue;
			}

			register_block_type( $path . '/' . $slug );
		}
	}

	/**
	 * Adds the plugin block category.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>> $categories Registered categories.
	 * @return array<int, array<string, mixed>> Block categories.
	 */
	public function register_category( array $categories ): array {
		array_unshift(
			$categories,
			array(
				'slug'  => 'ever-blocks',
				'title' => __( 'Ever Blocks', 'ever-blocks' ),
			)
		);

		return $categories;
	}

	/**
	 * Determines whether a block is enabled.
	 *
	 * @since 2.0.0
	 * @param string $slug Block slug.
	 * @return bool True when the block is enabled.
	 */
	protected function is_block_enabled( string $slug ): bool {
		$disabled = (array) get_option( 'ever_blocks_disabled_blocks', array() );

		/**
		 * Filters whether a block is enabled.
		 *
		 * @since 2.0.0
		 * @param bool   $enabled Whether the block is enabled.
		 * @param string $slug    Block slug.
		 */
		return (bool) apply_filters( 'ever_blocks_is_block_enabled', ! in_array( $slug, $disabled, true ), $slug );
	}
}
