<?php

namespace EverBlocks;

defined( 'ABSPATH' ) || exit;

/**
 * Bundled icon collection.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Icons {

	/**
	 * Collection slug.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const COLLECTION = 'heroicons';

	/**
	 * Generated manifest, keyed by icon slug.
	 *
	 * @since 2.0.0
	 * @var array<string, array{label: string, filePath: string, category: string}>|null
	 */
	private ?array $manifest = null;

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_icons' ) );
		add_action( 'rest_api_init', array( $this, 'register_fields' ) );
	}

	/**
	 * Registers the bundled collection and its icons.
	 *
	 * Mirrors core's `_wp_register_default_icons()`: a generated manifest of labels
	 * and file paths, registered by path so each SVG is read only when something
	 * asks for it and none of them reach the editor bundle.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_icons(): void {
		$manifest = $this->manifest();

		if ( empty( $manifest ) ) {
			return;
		}

		// Named for the source, the way core labels its own collection
		// "WordPress". Calling someone else's set by our name would obscure the
		// attribution MIT asks us to carry.
		wp_register_icon_collection(
			self::COLLECTION,
			array(
				'label'       => __( 'Heroicons', 'ever-blocks' ),
				'description' => __( 'Heroicons solid, by Tailwind Labs. MIT licensed.', 'ever-blocks' ),
			)
		);

		$dir = EVER_BLOCKS_DIR . 'assets/icons/';

		foreach ( $manifest as $slug => $icon ) {
			wp_register_icon(
				self::COLLECTION . '/' . $slug,
				array(
					'label'     => $icon['label'],
					'file_path' => $dir . $icon['filePath'],
				)
			);
		}
	}

	/**
	 * Adds a category to every icon in the REST response.
	 *
	 * Core's icon schema carries only name, label, content and collection, and its
	 * controller has no filters. It does call `add_additional_fields_to_object()`,
	 * so a registered field is the one way to give the picker something to group by.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_fields(): void {
		register_rest_field(
			'icon',
			'category',
			array(
				'get_callback' => array( $this, 'get_category' ),
				'schema'       => array(
					'description' => __( 'Category the icon belongs to.', 'ever-blocks' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			)
		);
	}

	/**
	 * Returns an icon's category.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $icon Prepared icon.
	 * @return string Category slug, or an empty string for icons we do not own.
	 */
	public function get_category( array $icon ): string {
		$name = isset( $icon['name'] ) && is_string( $icon['name'] ) ? $icon['name'] : '';
		$slug = 0 === strpos( $name, self::COLLECTION . '/' )
			? substr( $name, strlen( self::COLLECTION ) + 1 )
			: '';

		return (string) ( $this->manifest()[ $slug ]['category'] ?? '' );
	}

	/**
	 * Returns the generated manifest.
	 *
	 * @since 2.0.0
	 * @return array<string, array{label: string, filePath: string, category: string}> Manifest.
	 */
	private function manifest(): array {
		if ( null === $this->manifest ) {
			$path = EVER_BLOCKS_DIR . 'assets/icons/manifest.php';

			$this->manifest = is_readable( $path ) ? (array) require $path : array();
		}

		return $this->manifest;
	}
}
