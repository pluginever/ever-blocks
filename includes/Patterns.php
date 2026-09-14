<?php

namespace EverBlocks;

defined( 'ABSPATH' ) || exit;

/**
 * Block pattern registration from the plugin's `patterns/` directory.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Patterns {

	/**
	 * Pattern category slug.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const CATEGORY = 'ever-blocks';

	/**
	 * File headers a pattern declares, in the shape themes use.
	 *
	 * @since 2.0.0
	 * @var array<string, string>
	 */
	private const HEADERS = array(
		'title'         => 'Title',
		'slug'          => 'Slug',
		'description'   => 'Description',
		'blockTypes'    => 'Block Types',
		'keywords'      => 'Keywords',
		'viewportWidth' => 'Viewport Width',
	);

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_patterns' ) );
	}

	/**
	 * Registers the category and every pattern file.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_patterns(): void {
		$files = glob( EVER_BLOCKS_DIR . 'patterns/*.php' );

		if ( empty( $files ) ) {
			return;
		}

		register_block_pattern_category(
			self::CATEGORY,
			array(
				'label'       => __( 'Ever Blocks', 'ever-blocks' ),
				'description' => __( 'Ready-made designs built with Ever Blocks.', 'ever-blocks' ),
			)
		);

		foreach ( $files as $file ) {
			$headers = get_file_data( $file, self::HEADERS );

			if ( '' === $headers['slug'] || '' === $headers['title'] ) {
				continue;
			}

			$slug = self::CATEGORY . '/' . $headers['slug'];

			if ( ! $this->is_pattern_enabled( $headers['slug'] ) || \WP_Block_Patterns_Registry::get_instance()->is_registered( $slug ) ) {
				continue;
			}

			ob_start();
			include $file;
			$content = (string) ob_get_clean();

			if ( '' === trim( $content ) ) {
				continue;
			}

			$properties = array(
				'title'       => $headers['title'],
				'description' => $headers['description'],
				'content'     => $content,
				'categories'  => array( self::CATEGORY ),
				'blockTypes'  => array_filter( array_map( 'trim', explode( ',', $headers['blockTypes'] ) ) ),
				'keywords'    => array_filter( array_map( 'trim', explode( ',', $headers['keywords'] ) ) ),
			);

			if ( is_numeric( $headers['viewportWidth'] ) ) {
				$properties['viewportWidth'] = (int) $headers['viewportWidth'];
			}

			register_block_pattern( $slug, $properties );
		}
	}

	/**
	 * Determines whether a pattern is enabled.
	 *
	 * @since 2.0.0
	 * @param string $slug Pattern slug without the category.
	 * @return bool True when the pattern is enabled.
	 */
	protected function is_pattern_enabled( string $slug ): bool {
		/**
		 * Filters whether a pattern is enabled.
		 *
		 * @since 2.0.0
		 * @param bool   $enabled Whether the pattern is enabled.
		 * @param string $slug    Pattern slug.
		 */
		return (bool) apply_filters( 'ever_blocks_is_pattern_enabled', true, $slug );
	}
}
