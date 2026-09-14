<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Services\StyleCompiler;

/**
 * Style compiler: the two derivations a block may need, and theme-driven breakpoints.
 */
class StyleCompilerTest extends TestCase {

	/**
	 * A theme's viewport settings change the compiled queries with no code change.
	 *
	 * @return void
	 */
	public function test_queries_follow_theme_settings(): void {
		$filter = static function ( $theme_json ) {
			return $theme_json->update_with(
				array(
					'version'  => \WP_Theme_JSON::LATEST_SCHEMA,
					'settings' => array( 'viewport' => array( 'mobile' => '600px', 'tablet' => '900px' ) ),
				)
			);
		};

		add_filter( 'wp_theme_json_data_theme', $filter );
		\WP_Theme_JSON_Resolver::clean_cached_data();

		$rules = ( new StyleCompiler() )->compile(
			array(
				'@mobile' => array( 'everBlocks' => array( 'gap' => '1rem' ) ),
				'@tablet' => array( 'everBlocks' => array( 'gap' => '2rem' ) ),
			),
			new \WP_Block_Type( 'ever-blocks/x' )
		);

		remove_filter( 'wp_theme_json_data_theme', $filter );
		\WP_Theme_JSON_Resolver::clean_cached_data();

		$this->assertSame( array( '@media (width <= 600px)', '@media (600px < width <= 900px)' ), array_column( $rules, 'query' ) );
	}

	/**
	 * A value's custom property carries the block, and the element when it has one.
	 *
	 * @return void
	 */
	public function test_custom_property_names_the_block_and_element(): void {
		$style = new StyleCompiler();

		$this->assertSame( '--ever-blocks-test-icon-size', $style->get_custom_property( 'ever-blocks/test', 'iconSize' ) );
		$this->assertSame( '--ever-blocks-test-input-font-size', $style->get_custom_property( 'ever-blocks/test', 'fontSize', 'input' ) );
		$this->assertSame( '--ever-blocks-test-close-button-size', $style->get_custom_property( 'ever-blocks/test', 'size', 'closeButton' ) );
		$this->assertSame( '', $style->get_custom_property( 'ever-blocks/test', 'size', 'Bad' ) );
		$this->assertSame( '', $style->get_custom_property( 'ever-blocks/test', '1bad' ) );
		$this->assertSame( '', $style->get_custom_property( 'nope', 'size' ) );
	}

	/**
	 * The namespace is the vendor in camelCase, or nothing for an unusable name.
	 *
	 * @return void
	 */
	public function test_namespace_is_the_vendor(): void {
		$style = new StyleCompiler();

		$this->assertSame( 'everBlocks', $style->get_namespace( 'ever-blocks/test' ) );
		$this->assertSame( 'acme', $style->get_namespace( 'acme/thing' ) );
		$this->assertSame( '', $style->get_namespace( 'nope' ) );
		$this->assertSame( '', $style->get_namespace( 'Bad/thing' ) );
	}
}
