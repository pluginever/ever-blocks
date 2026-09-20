<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Pricing table, column and price blocks, rendered from their built metadata.
 */
class PricingTableTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/pricing-table' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Wraps one column in a table with the given attributes.
	 *
	 * @param string $attributes JSON table attributes.
	 * @param string $column     Column attributes.
	 * @return string Rendered HTML.
	 */
	private function table( string $attributes, string $column = '' ): string {
		return $this->render(
			'<!-- wp:ever-blocks/pricing-table ' . $attributes . ' -->'
			. '<!-- wp:ever-blocks/pricing-column ' . $column . ' -->'
			. '<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Team</h3><!-- /wp:heading -->'
			. '<!-- wp:ever-blocks/pricing-price {"currency":"$","amount":"24","original":"$29"} /-->'
			. '<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item --><li>5 sites</li><!-- /wp:list-item --><!-- wp:list-item {"className":"is-style-excluded"} --><li class="is-style-excluded">White label</li><!-- /wp:list-item --></ul><!-- /wp:list -->'
			. '<!-- /wp:ever-blocks/pricing-column -->'
			. '<!-- /wp:ever-blocks/pricing-table -->'
		);
	}

	/**
	 * The switch is a radiogroup whose active option decides which columns are visible; without options there is no switch.
	 *
	 * @return void
	 */
	public function test_switch_shows_the_active_price(): void {
		$html = $this->table( '{"options":[{"slug":"monthly","label":"Monthly"},{"slug":"yearly","label":"Yearly","badge":"Save"}],"active":"yearly"}', '{"option":"monthly"}' );

		$this->assertStringContainsString( 'data-wp-interactive="ever-blocks/pricing-table"', $html );
		$this->assertStringContainsString( 'class="eb-pricing-table is-layout-card', $html );
		$this->assertMatchesRegularExpression( '/<div hidden class="eb-pricing-column [^"]*" role="group"/', $html, 'A column shown for another option is hidden.' );
		$this->assertMatchesRegularExpression( '/<div class="eb-pricing-table__switch" role="radiogroup" aria-label="Billing period">/', $html );
		$this->assertMatchesRegularExpression( '/<button aria-checked="false" tabindex="-1"[^>]*data-option="monthly"/', $html );
		$this->assertMatchesRegularExpression( '/<button aria-checked="true" tabindex="0"[^>]*data-option="yearly"/', $html );
		$this->assertStringContainsString( '<s class="eb-pricing-price__original"><span class="screen-reader-text">Was </span>$29</s>', $html );

		$plain = $this->table( '{"options":[]}', '{"option":"monthly"}' );

		$this->assertStringNotContainsString( 'role="radiogroup"', $plain );
		$this->assertStringNotContainsString( 'data-wp-interactive', $plain );
		$this->assertStringNotContainsString( '<div hidden', $plain, 'Without options every column shows.' );
		$this->assertStringContainsString( '--columns:1', $plain, 'A column tagged with a removed option still counts.' );
		$this->assertStringContainsString( '<span class="eb-pricing-price__amount">24</span>', $plain );
	}

	/**
	 * A column is a group named by its heading, and an excluded feature says so to screen readers only inside a column.
	 *
	 * @return void
	 */
	public function test_column_is_labelled_and_excluded_features_are_named(): void {
		$html = $this->table( '{}', '{"featured":true,"badge":"Most popular"}' );

		$this->assertMatchesRegularExpression( '/<div class="eb-pricing-column is-featured[^"]*" role="group" aria-labelledby="(eb-plan-\d+)">.*<h3 id="\1" class="wp-block-heading">Team<\/h3>/s', $html );
		$this->assertStringContainsString( '<span class="eb-pricing-column__badge">Most popular</span>', $html );
		$this->assertStringContainsString( '<li class="is-style-excluded"><span class="screen-reader-text">Not included: </span>White label</li>', $html );
		$this->assertStringContainsString( '<li>5 sites</li>', $html );

		$outside = $this->render( '<!-- wp:list --><ul class="wp-block-list"><!-- wp:list-item {"className":"is-style-excluded"} --><li class="is-style-excluded">Alone</li><!-- /wp:list-item --></ul><!-- /wp:list -->' );

		$this->assertStringNotContainsString( 'Not included', $outside );
	}
}
