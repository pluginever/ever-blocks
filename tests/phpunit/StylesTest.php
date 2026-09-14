<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Generated CSS for a block instance: own values, states, elements, for any block.
 *
 * Every test renders through the real `render_block` pipeline against a block
 * registered here, so the assertions cover the declaration in block.json, the
 * styler, the store and the stamped class together.
 */
class StylesTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		register_block_type(
			'ever-blocks/test',
			array(
				'render_callback' => static fn(): string => '<div class="eb-test"><span class="inner">x</span><input class="eb-test__input" /></div>',
				'selectors'       => array(
					'root'   => '.eb-test',
					'typography' => '.eb-test .inner',
					'states' => array( '-open' => '.eb-test.is-open' ),
				),
				'supports'        => array(
					'color'      => array( 'background' => true, 'text' => true ),
					'typography' => array( 'fontSize' => true ),
					'everBlocks' => array(
						'states'   => array( ':hover' ),
						'elements' => array(
							'input'    => array( 'selector' => '.eb-test__input', 'states' => array( ':focus' ) ),
							'backdrop' => '&::backdrop',
						),
					),
				),
			)
		);

		register_block_type(
			'acme/thing',
			array(
				'render_callback' => static fn(): string => '<p class="acme-thing">y</p>',
				'supports'        => array( 'everBlocks' => array( 'states' => array( ':hover' ) ) ),
			)
		);
	}

	/**
	 * Tears down the test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		unregister_block_type( 'ever-blocks/test' );
		unregister_block_type( 'acme/thing' );

		parent::tear_down();
	}

	/**
	 * Renders one instance of a block carrying the given style attribute.
	 *
	 * @param array  $style Style attribute.
	 * @param string $name  Block name.
	 * @return string Rendered HTML.
	 */
	private function render_with( array $style, string $name = 'ever-blocks/test' ): string {
		return $this->render( '<!-- wp:' . $name . ' ' . wp_json_encode( array( 'style' => $style ) ) . ' /-->' );
	}

	/**
	 * Returns the instance class stamped on the rendered markup.
	 *
	 * @param string $html Rendered HTML.
	 * @return string Class name.
	 */
	private function instance_class( string $html ): string {
		$this->assertSame( 1, preg_match( '/class="[^"]*\b(eb-[0-9a-f]{8})\b/', $html, $match ), 'No instance class was stamped.' );

		return '.' . $match[1] . '.' . $match[1];
	}

	/**
	 * The gap core will not close: our blocks are absent from core's allow-lists.
	 *
	 * @return void
	 */
	public function test_core_generates_no_states_for_our_blocks(): void {
		$this->assertArrayNotHasKey( 'ever-blocks/test', \WP_Theme_JSON::VALID_BLOCK_PSEUDO_SELECTORS );
		$this->assertArrayNotHasKey( 'ever-blocks/test', \WP_Theme_JSON::VALID_BLOCK_CUSTOM_STATES );
		$this->assertArrayHasKey( 'core/button', \WP_Theme_JSON::VALID_BLOCK_PSEUDO_SELECTORS );
	}

	/**
	 * A root value becomes one custom property on the instance.
	 *
	 * @return void
	 */
	public function test_own_values_become_custom_properties(): void {
		$class = $this->instance_class( $this->render_with( array( 'everBlocks' => array( 'columns' => 4, 'iconSize' => '2rem' ) ) ) );

		$this->assertSame( $class . '{--ever-blocks-test-columns:4;--ever-blocks-test-icon-size:2rem;}', $this->plugin_css() );
	}

	/**
	 * A value under a viewport is wrapped in that viewport's media query.
	 *
	 * @return void
	 */
	public function test_own_values_follow_viewports(): void {
		$class = $this->instance_class( $this->render_with( array( '@mobile' => array( 'everBlocks' => array( 'columns' => 1 ) ) ) ) );

		$this->assertSame( '@media (width <= 480px){' . $class . '{--ever-blocks-test-columns:1;}}', $this->plugin_css() );
	}

	/**
	 * A preset reference in a value resolves to core's custom property.
	 *
	 * @return void
	 */
	public function test_own_values_resolve_presets(): void {
		$this->render_with( array( 'everBlocks' => array( 'accent' => 'var:preset|color|primary' ) ) );

		$this->assertStringContainsString( '--ever-blocks-test-accent:var(--wp--preset--color--primary);', $this->plugin_css() );
	}

	/**
	 * A declared pseudo-state compiles core features with `!important`, as core does for its own blocks.
	 *
	 * @return void
	 */
	public function test_root_pseudo_state_compiles_core_features(): void {
		$class = $this->instance_class( $this->render_with( array( ':hover' => array( 'color' => array( 'background' => '#ff0000' ) ) ) ) );

		$this->assertSame( $class . ':hover{background-color:#ff0000 !important;background-image:unset !important;}', $this->plugin_css() );
	}

	/**
	 * A feature selector from block.json is honoured inside a state.
	 *
	 * @return void
	 */
	public function test_root_pseudo_state_honours_feature_selectors(): void {
		$class = $this->instance_class( $this->render_with( array( ':hover' => array( 'typography' => array( 'fontSize' => '2rem' ) ) ) ) );

		$this->assertStringContainsString( $class . ' .inner:hover{font-size:2rem !important;}', $this->plugin_css() );
	}

	/**
	 * A block's own values also change per state.
	 *
	 * @return void
	 */
	public function test_root_pseudo_state_compiles_own_values(): void {
		$class = $this->instance_class( $this->render_with( array( ':hover' => array( 'everBlocks' => array( 'iconSize' => '3rem' ) ) ) ) );

		$this->assertSame( $class . ':hover{--ever-blocks-test-icon-size:3rem;}', $this->plugin_css() );
	}

	/**
	 * A state the block did not declare is never compiled.
	 *
	 * @return void
	 */
	public function test_undeclared_states_are_ignored(): void {
		$html = $this->render_with( array( ':active' => array( 'color' => array( 'background' => '#ff0000' ) ) ) );

		$this->assertSame( '', $this->plugin_css() );
		$this->assertDoesNotMatchRegularExpression( '/\beb-[0-9a-f]{8}\b/', $html );
	}

	/**
	 * A custom state from `selectors.states` scopes to the instance, keeping what follows the block class.
	 *
	 * @return void
	 */
	public function test_custom_state_uses_its_declared_selector(): void {
		$class = $this->instance_class( $this->render_with( array( '-open' => array( 'color' => array( 'background' => '#0000ff' ), 'everBlocks' => array( 'columns' => 2 ) ) ) ) );

		$this->assertSame( $class . '.is-open{--ever-blocks-test-columns:2;background-color:#0000ff !important;background-image:unset !important;}', $this->plugin_css() );
	}

	/**
	 * An element compiles core features on its own selector, without `!important`.
	 *
	 * @return void
	 */
	public function test_element_compiles_core_features(): void {
		$class = $this->instance_class( $this->render_with( array( 'elements' => array( 'input' => array( 'typography' => array( 'fontSize' => '2rem' ), 'color' => array( 'text' => 'var:preset|color|contrast' ) ) ) ) ) );

		$this->assertSame( $class . ' .eb-test__input{color:var(--wp--preset--color--contrast);font-size:2rem;}', $this->plugin_css() );
	}

	/**
	 * An element's own value carries the element name in the property.
	 *
	 * @return void
	 */
	public function test_element_own_values_name_the_element(): void {
		$class = $this->instance_class( $this->render_with( array( 'elements' => array( 'input' => array( 'everBlocks' => array( 'size' => '3rem' ) ) ) ) ) );

		$this->assertSame( $class . ' .eb-test__input{--ever-blocks-test-input-size:3rem;}', $this->plugin_css() );
	}

	/**
	 * An element pseudo-state declared for that element compiles.
	 *
	 * @return void
	 */
	public function test_element_pseudo_state_compiles(): void {
		$class = $this->instance_class( $this->render_with( array( 'elements' => array( 'input' => array( ':focus' => array( 'color' => array( 'background' => '#eeeeee' ) ) ) ) ) ) );

		$this->assertSame( $class . ' .eb-test__input:focus{background-color:#eeeeee;}', $this->plugin_css() );
	}

	/**
	 * An element pseudo-state the element did not declare is ignored.
	 *
	 * @return void
	 */
	public function test_element_undeclared_pseudo_state_is_ignored(): void {
		$this->render_with( array( 'elements' => array( 'input' => array( ':hover' => array( 'color' => array( 'background' => '#eeeeee' ) ) ) ) ) );

		$this->assertSame( '', $this->plugin_css() );
	}

	/**
	 * An element the block did not declare is ignored, including core's own element names.
	 *
	 * @return void
	 */
	public function test_undeclared_elements_are_ignored(): void {
		$this->render_with( array( 'elements' => array( 'link' => array( 'color' => array( 'text' => '#ff0000' ) ), 'button' => array( 'everBlocks' => array( 'size' => '1rem' ) ) ) ) );

		$this->assertSame( '', $this->plugin_css() );
	}

	/**
	 * `&` attaches the element selector to the instance itself.
	 *
	 * @return void
	 */
	public function test_ampersand_element_attaches_to_the_instance(): void {
		$class = $this->instance_class( $this->render_with( array( 'elements' => array( 'backdrop' => array( 'color' => array( 'background' => '#000000' ) ) ) ) ) );

		$this->assertSame( $class . '::backdrop{background-color:#000000;}', $this->plugin_css() );
	}

	/**
	 * Elements inside a custom state are scoped by that state.
	 *
	 * @return void
	 */
	public function test_elements_inside_a_custom_state(): void {
		$class = $this->instance_class( $this->render_with( array( '-open' => array( 'elements' => array( 'input' => array( 'typography' => array( 'fontSize' => '4rem' ) ) ) ) ) ) );

		$this->assertSame( $class . '.is-open .eb-test__input{font-size:4rem;}', $this->plugin_css() );
	}

	/**
	 * Elements inside a root pseudo-state are scoped by that state.
	 *
	 * @return void
	 */
	public function test_elements_inside_a_root_pseudo_state(): void {
		$class = $this->instance_class( $this->render_with( array( ':hover' => array( 'elements' => array( 'input' => array( 'everBlocks' => array( 'size' => '1rem' ) ) ) ) ) ) );

		$this->assertSame( $class . ':hover .eb-test__input{--ever-blocks-test-input-size:1rem;}', $this->plugin_css() );
	}

	/**
	 * States and elements nest under a viewport in core's order.
	 *
	 * @return void
	 */
	public function test_viewport_wraps_states_and_elements(): void {
		$class = $this->instance_class(
			$this->render_with(
				array(
					'@tablet' => array(
						':hover'   => array( 'color' => array( 'background' => '#123456' ) ),
						'elements' => array( 'input' => array( ':focus' => array( 'everBlocks' => array( 'size' => '5rem' ) ) ) ),
					),
				)
			)
		);

		$css = $this->plugin_css();

		$this->assertStringContainsString( '@media (480px < width <= 782px){' . $class . ':hover{background-color:#123456 !important;', $css );
		$this->assertStringContainsString( '@media (480px < width <= 782px){' . $class . ' .eb-test__input:focus{--ever-blocks-test-input-size:5rem;}}', $css );
	}

	/**
	 * A block outside this plugin's namespace is compiled from its own declaration.
	 *
	 * @return void
	 */
	public function test_any_declared_block_is_compiled(): void {
		$class = $this->instance_class( $this->render_with( array( ':hover' => array( 'everBlocks' => array( 'lift' => '2px' ) ), 'acme' => array( 'gap' => '1rem' ) ), 'acme/thing' ) );

		$this->assertSame( $class . '{--acme-thing-gap:1rem;}', $this->plugin_css() );
	}

	/**
	 * A block that declares nothing and sets only core supports gets nothing from us.
	 *
	 * @return void
	 */
	public function test_core_supports_alone_produce_nothing(): void {
		$attrs = wp_json_encode( array( 'style' => array( 'spacing' => array( 'padding' => '1rem' ), ':hover' => array( 'color' => array( 'background' => '#ff0000' ) ) ) ) );
		$html  = $this->render( '<!-- wp:paragraph ' . $attrs . ' --><p>Hi</p><!-- /wp:paragraph -->' );

		$this->assertSame( '', $this->plugin_css() );
		$this->assertDoesNotMatchRegularExpression( '/\beb-[0-9a-f]{8}\b/', $html );
	}

	/**
	 * Two instances styled the same way share one class and one rule.
	 *
	 * @return void
	 */
	public function test_identical_instances_share_one_rule(): void {
		$style = array( ':hover' => array( 'color' => array( 'background' => '#0000ff' ) ) );

		$first  = $this->instance_class( $this->render_with( $style ) );
		$second = $this->instance_class( $this->render_with( $style ) );

		$this->assertSame( $first, $second );
		$this->assertSame( 1, substr_count( $this->plugin_css(), 'background-color:#0000ff' ) );
	}
}
