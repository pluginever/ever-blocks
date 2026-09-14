<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Services\Styler;

/**
 * Styler: theme-driven breakpoints.
 */
class StylerTest extends TestCase {

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

		$rules = ( new Styler() )->compile(
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
}
