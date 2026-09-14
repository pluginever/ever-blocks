<?php

namespace EverBlocks\Extensions;

defined( 'ABSPATH' ) || exit;

/**
 * Extension registration.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class Extensions {

	/**
	 * Editor bundle handle.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	private const HANDLE = 'ever-blocks-editor';

	/**
	 * Available extensions.
	 *
	 * @since 2.0.0
	 * @var array<int, class-string<Extension>>
	 */
	private array $extensions = array(
		ZIndex::class,
	);

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', array( $this, 'register_extensions' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
	}

	/**
	 * Boots every enabled extension.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register_extensions(): void {
		foreach ( $this->enabled() as $extension ) {
			$extension->register();
		}
	}

	/**
	 * Enqueues the editor half and tells it which extensions are on.
	 *
	 * The same option gates the PHP hooks and this map, so disabling an extension
	 * removes its inspector panel as well as its output. Gating only the server
	 * leaves a control that silently does nothing.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function enqueue_editor_assets(): void {
		$asset = EVER_BLOCKS_DIR . 'build/editor.asset.php';

		if ( ! is_readable( $asset ) ) {
			return;
		}

		$meta = require $asset;

		wp_enqueue_script(
			self::HANDLE,
			EVER_BLOCKS_URL . 'build/editor.js',
			$meta['dependencies'] ?? array(),
			$meta['version'] ?? EVER_BLOCKS_VERSION,
			true
		);

		wp_set_script_translations( self::HANDLE, 'ever-blocks' );

		$active = array();

		foreach ( $this->enabled() as $extension ) {
			$active[ $extension->name() ] = true;
		}

		wp_add_inline_script(
			self::HANDLE,
			'window.everBlocksExtensions = ' . wp_json_encode( $active ) . ';',
			'before'
		);
	}

	/**
	 * Returns the extensions the site has enabled.
	 *
	 * @since 2.0.0
	 * @return array<int, Extension> Enabled extensions.
	 */
	private function enabled(): array {
		$disabled = (array) get_option( 'ever_blocks_disabled_extensions', array() );
		$enabled  = array();

		foreach ( $this->extensions as $class ) {
			$extension = ever_blocks()->get( $class );

			if ( ! $extension instanceof Extension || in_array( $extension->name(), $disabled, true ) ) {
				continue;
			}

			/**
			 * Filters whether an extension is enabled.
			 *
			 * @since 2.0.0
			 * @param bool   $enabled Whether the extension is enabled.
			 * @param string $name    Extension slug.
			 */
			if ( apply_filters( 'ever_blocks_is_extension_enabled', true, $extension->name() ) ) {
				$enabled[] = $extension;
			}
		}

		return $enabled;
	}
}
