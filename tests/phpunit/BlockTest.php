<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Block;

/**
 * The base block binds the render seam on construction; `register()` is the plugin's call.
 */
class BlockTest extends TestCase {

	/**
	 * `register()` is left to the plugin, so construction alone hooks nothing else.
	 *
	 * @return void
	 */
	public function test_register_is_not_run_on_construction(): void {
		$block = new class() extends Block {
			public string $name = 'ever-blocks/plain';
			public bool $registered = false;

			public function register(): void {
				$this->registered = true;
			}
		};

		$this->assertFalse( $block->registered );
	}

}
