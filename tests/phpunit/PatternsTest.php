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
	 * Block attributes inside every pattern stay valid JSON when a translation carries a quote or apostrophe.
	 *
	 * @return void
	 */
	public function test_translated_strings_keep_block_attributes_parseable(): void {
		$quote = static fn( string $translation ): string => 'D\'oh "' . $translation . '"';

		add_filter( 'gettext', $quote );

		$plugin = $this->plugin->get( \EverBlocks\Patterns::class );

		$registry = \WP_Block_Patterns_Registry::get_instance();

		foreach ( $registry->get_all_registered() as $pattern ) {
			if ( ! in_array( 'ever-blocks', $pattern['categories'] ?? array(), true ) ) {
				continue;
			}

			$registry->unregister( $pattern['name'] );
		}

		$plugin->register_patterns();

		remove_filter( 'gettext', $quote );

		foreach ( glob( EVER_BLOCKS_DIR . 'patterns/*.php' ) as $file ) {
			$pattern = $registry->get_registered( 'ever-blocks/' . basename( $file, '.php' ) );

			$this->assertIsArray( $pattern, $file );

			foreach ( $this->flatten( parse_blocks( $pattern['content'] ) ) as $block ) {
				if ( null === $block['blockName'] ) {
					$this->assertSame( '', trim( $block['innerHTML'] ), $file . ': a block lost its name.' );

					continue;
				}

				$this->assertIsArray( $block['attrs'], $file . ': ' . $block['blockName'] . ' lost its attributes.' );
			}
		}
	}

	/**
	 * Flattens a block tree.
	 *
	 * @param array<int, array<string, mixed>> $blocks Parsed blocks.
	 * @return array<int, array<string, mixed>> Every block, depth first.
	 */
	private function flatten( array $blocks ): array {
		$flat = array();

		foreach ( $blocks as $block ) {
			$flat[] = $block;
			$flat   = array_merge( $flat, $this->flatten( $block['innerBlocks'] ?? array() ) );
		}

		return $flat;
	}

}
