<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Patterns registered from the plugin's patterns directory.
 */
class PatternsTest extends TestCase {

	/**
	 * Every pattern file registers under the plugin category with its block types.
	 *
	 * @return void
	 */
	public function test_registers_pattern_files(): void {
		$registry = \WP_Block_Patterns_Registry::get_instance();

		$this->assertTrue( \WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( 'ever-blocks' ) );

		$pattern = $registry->get_registered( 'ever-blocks/table-of-contents-collapsible' );

		$this->assertIsArray( $pattern );
		$this->assertSame( 'Collapsible table of contents', $pattern['title'] );
		$this->assertSame( array( 'ever-blocks' ), $pattern['categories'] );
		$this->assertSame( array( 'ever-blocks/table-of-contents' ), $pattern['blockTypes'] );
		$this->assertStringContainsString( '<!-- wp:ever-blocks/table-of-contents {"title":"In this article"', $pattern['content'] );
		$this->assertSame( 800, $pattern['viewportWidth'] );

		$files    = glob( EVER_BLOCKS_DIR . 'patterns/*.php' );
		$expected = array_map( fn( string $file ): string => 'ever-blocks/' . basename( $file, '.php' ), $files );

		foreach ( $expected as $name ) {
			$this->assertTrue( $registry->is_registered( $name ), $name );
		}
	}

	/**
	 * Restores the pattern set for later tests.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		remove_all_filters( 'ever_blocks_is_pattern_enabled' );
		ever_blocks()->get( \EverBlocks\Patterns::class )->register_patterns();

		parent::tear_down();
	}

	/**
	 * The filter can keep a pattern out.
	 *
	 * @return void
	 */
	public function test_filter_disables_a_pattern(): void {
		$registry = \WP_Block_Patterns_Registry::get_instance();
		$registry->unregister( 'ever-blocks/table-of-contents-sidebar' );

		add_filter( 'ever_blocks_is_pattern_enabled', fn( bool $enabled, string $slug ): bool => 'table-of-contents-sidebar' !== $slug, 10, 2 );

		ever_blocks()->get( \EverBlocks\Patterns::class )->register_patterns();

		$this->assertFalse( $registry->is_registered( 'ever-blocks/table-of-contents-sidebar' ) );
		$this->assertTrue( $registry->is_registered( 'ever-blocks/table-of-contents-collapsible' ) );
	}
}
