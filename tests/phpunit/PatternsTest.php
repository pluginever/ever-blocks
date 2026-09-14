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

}
