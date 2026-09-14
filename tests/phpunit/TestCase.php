<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Plugin;

/**
 * Base test case.
 *
 * The style engine's stores are process-global, so each test starts from an
 * empty one or it would assert against another test's rules.
 */
abstract class TestCase extends \WP_UnitTestCase {

	/**
	 * Plugin instance.
	 *
	 * @var Plugin
	 */
	protected Plugin $plugin;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->plugin = ever_blocks();

		\WP_Style_Engine_CSS_Rules_Store::remove_all_stores();

		// The style queue is a global that survives between tests, so a handle
		// enqueued by one would still read as enqueued in the next.
		$GLOBALS['wp_styles'] = null;
	}

	/**
	 * Tears down the test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		\WP_Style_Engine_CSS_Rules_Store::remove_all_stores();

		$GLOBALS['wp_styles'] = null;

		\WP_Theme_JSON_Resolver::clean_cached_data();

		parent::tear_down();
	}

	/**
	 * Returns the compiled CSS the plugin has registered this request.
	 *
	 * @return string Compiled CSS.
	 */
	protected function plugin_css(): string {
		return wp_style_engine_get_stylesheet_from_context( \EverBlocks\Services\StyleCompiler::CONTEXT );
	}

	/**
	 * Renders a serialized block through the full render_block pipeline.
	 *
	 * @param string $markup Serialized block markup.
	 * @return string Rendered HTML.
	 */
	protected function render( string $markup ): string {
		return do_blocks( $markup );
	}
}
