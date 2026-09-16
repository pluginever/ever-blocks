<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * Announcement Bar block, rendered from its built metadata.
 */
class AnnouncementBarTest extends TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		if ( ! \WP_Block_Type_Registry::get_instance()->is_registered( 'ever-blocks/announcement-bar' ) ) {
			$this->markTestSkipped( 'Run `pnpm build` before this suite.' );
		}
	}

	/**
	 * Wraps messages in a bar.
	 *
	 * @param string $attributes JSON attributes.
	 * @param int    $messages   Message count.
	 * @return string Rendered HTML.
	 */
	private function bar( string $attributes, int $messages = 1 ): string {
		$message = static fn( int $i ): string => '<!-- wp:ever-blocks/announcement --><!-- wp:paragraph --><p>Message ' . $i . '</p><!-- /wp:paragraph --><!-- /wp:ever-blocks/announcement -->';

		return $this->render( '<!-- wp:ever-blocks/announcement-bar ' . $attributes . ' -->' . implode( '', array_map( $message, range( 1, $messages ) ) ) . '<!-- /wp:ever-blocks/announcement-bar -->' );
	}

	/**
	 * The schedule decides whether anything renders; a dismissible bar carries a stable key and its close button.
	 *
	 * @return void
	 */
	public function test_schedule_and_dismissal(): void {
		$past   = wp_date( 'Y-m-d\TH:i', time() - HOUR_IN_SECONDS );
		$future = wp_date( 'Y-m-d\TH:i', time() + HOUR_IN_SECONDS );

		$this->assertSame( '', $this->bar( '{"endsAt":"' . $past . '"}' ), 'Ended bars render nothing.' );
		$this->assertSame( '', $this->bar( '{"startsAt":"' . $future . '"}' ), 'Bars that have not started render nothing.' );
		$this->assertStringContainsString( 'eb-announcement-bar', $this->bar( '{"startsAt":"' . $past . '","endsAt":"' . $future . '"}' ) );

		$html = $this->bar( '{"animation":"ticker","dismissible":true,"rememberDays":30,"anchor":"sale"}', 3 );

		$this->assertMatchesRegularExpression( '/<div hidden class="[^"]*\beb-announcement-bar is-animation-ticker is-moving\b[^"]*is-dismissible[^"]*"[^>]*role="region"/', $html );
		$this->assertDoesNotMatchRegularExpression( '/<div[^>]*\shidden[\s>]/', $this->bar( '{}' ), 'A bar that cannot be dismissed paints without the script.' );
		$this->assertStringContainsString( '&quot;dismiss&quot;:&quot;eb-announcement-sale&quot;', $html );
		$this->assertStringContainsString( '&quot;days&quot;:30', $html );
		$this->assertSame( 2, substr_count( $html, 'class="eb-announcement-bar__run"' ), 'The ticker duplicates its run once.' );
		$this->assertMatchesRegularExpression( '/<button type="button" class="eb-announcement-bar__close"[^>]*data-wp-on--click="actions.dismiss"[^>]*aria-label="Dismiss"><svg/', $html );
		$this->assertStringNotContainsString( '__close', $this->bar( '{}' ) );
	}
}
