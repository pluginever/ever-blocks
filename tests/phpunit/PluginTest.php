<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Supports\ZIndex;

/**
 * The container resolves each class once.
 */
class PluginTest extends TestCase {

	/**
	 * Two reads of the same key return the same instance.
	 *
	 * @return void
	 */
	public function test_container_memoises_instances(): void {
		$this->assertSame( $this->plugin->get( ZIndex::class ), $this->plugin->get( ZIndex::class ) );
		$this->assertSame( $this->plugin->styler, $this->plugin->styler );
	}

}
