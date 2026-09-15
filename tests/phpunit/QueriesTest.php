<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * The editor's media queries match the ones the server generates.
 *
 * `getResponsiveMediaQueries()` is a private API of
 * `@wordpress/global-styles-engine`, so the editor rebuilds the string from the
 * viewport settings. These cases mirror `queries.test.ts` one for one; if core
 * changes the query form, one of the two suites fails instead of the editor
 * quietly previewing a breakpoint the front end does not use.
 */
class QueriesTest extends TestCase {

	/**
	 * Viewport settings and the queries the editor builds for them.
	 *
	 * @return array<string, array{0: array<string, string>, 1: array<string, string>}>
	 */
	public function viewports(): array {
		return array(
			'defaults'    => array(
				array(),
				array(
					'@mobile' => '@media (width <= 480px)',
					'@tablet' => '@media (480px < width <= 782px)',
				),
			),
			'theme values' => array(
				array( 'mobile' => '600px', 'tablet' => '900px' ),
				array(
					'@mobile' => '@media (width <= 600px)',
					'@tablet' => '@media (600px < width <= 900px)',
				),
			),
			'mobile only' => array(
				array( 'mobile' => '480px' ),
				array( '@mobile' => '@media (width <= 480px)' ),
			),
			'tablet only' => array(
				array( 'tablet' => '782px' ),
				array( '@tablet' => '@media (width <= 782px)' ),
			),
		);
	}

	/**
	 * Core produces exactly what the editor builds.
	 *
	 * @dataProvider viewports
	 * @param array<string, string> $settings Viewport settings.
	 * @param array<string, string> $expected Queries the editor builds.
	 * @return void
	 */
	public function test_core_matches_the_editor( array $settings, array $expected ): void {
		$this->assertSame( $expected, \WP_Theme_JSON::get_viewport_media_queries( $settings ) );
	}
}
