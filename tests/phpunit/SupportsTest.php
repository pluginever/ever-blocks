<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

use EverBlocks\Blocks\Supports;

/**
 * A block names a support preset instead of repeating one.
 *
 * Disabled: `test_the_registered_type_carries_the_preset` checks
 * `ever-blocks/row`'s registered supports and is renamed out of the `test_`
 * prefix, following `RowTest.php` — `row`/`row-column` were removed as
 * stress-test scaffolds. Every other method here uses `ever-blocks/icon` or
 * calls `Supports::apply_preset()` directly and stays active.
 */
class SupportsTest extends TestCase {

	/**
	 * Applies a preset the way registration does.
	 *
	 * @param string $preset   Preset name.
	 * @param array  $supports The block's own supports.
	 * @return array Resulting supports.
	 */
	private function apply( string $preset, array $supports = array() ): array {
		$declared = array_merge( $supports, array( 'everBlocks' => array( 'preset' => $preset ) ) );

		$settings = ( new Supports() )->apply_preset(
			array( 'supports' => $declared ),
			array( 'supports' => $declared )
		);

		return $settings['supports'] ?? array();
	}

	/**
	 * The preset fills in what the block does not declare.
	 *
	 * @return void
	 */
	public function test_a_preset_is_applied(): void {
		$supports = $this->apply( 'layout' );

		$this->assertSame( array( 'wide', 'full' ), $supports['align'] );
		$this->assertTrue( $supports['shadow'] );
		$this->assertArrayHasKey( '__experimentalBorder', $supports );
	}

	/**
	 * A block's own declaration wins over the preset.
	 *
	 * @return void
	 */
	public function test_the_block_overrides_the_preset(): void {
		$supports = $this->apply( 'layout', array( 'shadow' => false, 'align' => array( 'full' ) ) );

		$this->assertFalse( $supports['shadow'] );
		$this->assertSame( array( 'full' ), $supports['align'] );
		$this->assertTrue( $supports['anchor'], 'Unrelated preset keys should survive.' );
	}

	/**
	 * An unknown preset changes nothing.
	 *
	 * @return void
	 */
	public function test_an_unknown_preset_is_ignored(): void {
		$supports = $this->apply( 'nonsense', array( 'anchor' => true ) );

		$this->assertSame( array( 'anchor' => true ), array_diff_key( $supports, array( 'everBlocks' => null ) ) );
	}

	/**
	 * A block that names no preset is untouched.
	 *
	 * @return void
	 */
	public function test_a_block_without_a_preset_is_untouched(): void {
		$settings = ( new Supports() )->apply_preset( array( 'supports' => array( 'anchor' => true ) ), array() );

		$this->assertSame( array( 'anchor' => true ), $settings['supports'] );
	}

	/**
	 * The registered block type carries the preset, which is what the editor reads.
	 *
	 * @return void
	 */
	public function disabled_test_the_registered_type_carries_the_preset(): void {
		$type = \WP_Block_Type_Registry::get_instance()->get_registered( 'ever-blocks/row' );

		$this->assertInstanceOf( \WP_Block_Type::class, $type );
		$this->assertSame( array( 'wide', 'full' ), $type->supports['align'] ?? null );
		$this->assertTrue( $type->supports['shadow'] ?? false );
		$this->assertArrayHasKey( 'interactivity', $type->supports, 'The block keeps its own supports.' );
	}

	/**
	 * A feature selector points core at an inner element.
	 *
	 * The icon block's supports are generated against the SVG, not the wrapper,
	 * which is what makes a transform turn the icon rather than its box.
	 *
	 * @return void
	 */
	public function test_a_feature_selector_targets_an_inner_element(): void {
		$type = \WP_Block_Type_Registry::get_instance()->get_registered( 'ever-blocks/icon' );

		$this->assertInstanceOf( \WP_Block_Type::class, $type );
		$this->assertSame( '.wp-block-ever-blocks-icon svg', wp_get_block_css_selector( $type, 'root' ) );
		$this->assertSame(
			'.wp-block-ever-blocks-icon svg',
			wp_get_block_css_selector( $type, 'color', true ),
			'A feature with no entry of its own falls back to the root, which is the SVG.'
		);
		$this->assertSame(
			'.wp-block-ever-blocks-icon',
			wp_get_block_css_selector( $type, array( 'spacing', 'margin' ) )
		);
	}

	/**
	 * The icon preset reaches the registered type, which is what the editor reads.
	 *
	 * @return void
	 */
	public function test_the_icon_preset_is_applied(): void {
		$type = \WP_Block_Type_Registry::get_instance()->get_registered( 'ever-blocks/icon' );

		$this->assertInstanceOf( \WP_Block_Type::class, $type );
		$this->assertSame( array( 'left', 'center', 'right' ), $type->supports['align'] ?? null );
		$this->assertTrue( $type->supports['dimensions']['width'] ?? false );
		$this->assertTrue( $type->supports['color']['__experimentalSkipSerialization'] ?? false );
	}
}
