<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * The core surface the engine is built on.
 *
 * Every name here is public in WordPress 7.1 (no `@access private`). A core
 * upgrade that removes or renames one fails this suite before it fails a page.
 */
class CoreContractTest extends TestCase {

	/**
	 * Functions the server side calls.
	 *
	 * @return array<int, array<int, string>>
	 */
	public function functions(): array {
		return array_map(
			static fn( string $name ): array => array( $name ),
			array(
				'wp_get_block_state_style_rules',
				'wp_build_state_selector',
				'wp_split_selector_list',
				'wp_get_root_state_style',
				'wp_normalize_state_style_for_css_output',
				'wp_get_state_declarations_with_background_resets',
				'wp_get_state_declarations_with_fallback_border_styles',
				'wp_style_engine_get_styles',
				'wp_style_engine_get_stylesheet_from_css_rules',
				'wp_style_engine_get_stylesheet_from_context',
				'wp_unique_id_from_values',
				'wp_register_block_metadata_collection',
				'wp_get_icon',
				'_wp_to_kebab_case',
			)
		);
	}

	/**
	 * Each function still exists.
	 *
	 * @dataProvider functions
	 * @param string $name Function name.
	 * @return void
	 */
	public function test_function_exists( string $name ): void {
		$this->assertTrue( function_exists( $name ), $name );
	}

	/**
	 * The `WP_Theme_JSON` members the engine reads, on a class core marks private.
	 *
	 * @return void
	 */
	public function test_theme_json_members_exist(): void {
		$this->assertTrue( method_exists( 'WP_Theme_JSON', 'get_viewport_media_queries' ) );
		$this->assertTrue( defined( 'WP_Theme_JSON::ELEMENTS' ) );
		$this->assertArrayHasKey( 'button', \WP_Theme_JSON::ELEMENTS );
	}

	/**
	 * Core still compiles no pseudo-states for third-party blocks; the day it
	 * does, the engine's state switch can retire.
	 *
	 * @return void
	 */
	public function test_core_state_allow_lists_exclude_third_party_blocks(): void {
		$this->assertArrayNotHasKey( 'ever-blocks/search-modal', \WP_Theme_JSON::VALID_BLOCK_PSEUDO_SELECTORS );
		$this->assertArrayNotHasKey( 'ever-blocks/search-modal', \WP_Theme_JSON::VALID_BLOCK_CUSTOM_STATES );
	}

	/**
	 * Core leaves unknown keys inside `style` alone, on the way in and out.
	 *
	 * @return void
	 */
	public function test_core_keeps_unknown_style_keys(): void {
		$style = array( 'everBlocks' => array( 'gap' => '1rem' ), 'elements' => array( 'input' => array( 'everBlocks' => array( 'size' => '2rem' ) ) ) );
		$attrs = wp_json_encode( array( 'style' => $style ) );
		$block = parse_blocks( '<!-- wp:paragraph ' . $attrs . ' --><p>Hi</p><!-- /wp:paragraph -->' )[0];

		$this->assertSame( $style, $block['attrs']['style'] );
		$this->assertStringContainsString( '<p', render_block( $block ) );
	}

	/**
	 * The style engine store core prints for us keeps its handle.
	 *
	 * @return void
	 */
	public function test_store_is_enqueued_under_the_expected_handle(): void {
		wp_style_engine_get_stylesheet_from_css_rules(
			array( array( 'selector' => '.eb-contract', 'declarations' => array( 'color' => 'red' ) ) ),
			array( 'context' => \EverBlocks\Services\Styler::CONTEXT )
		);
		wp_enqueue_stored_styles();

		$this->assertTrue( wp_style_is( 'wp-style-engine-ever-blocks', 'enqueued' ) );
	}
}
