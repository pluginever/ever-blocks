<?php
/**
 * Title: Ticker bar
 * Slug: announcement-ticker
 * Description: Three messages scrolling across the bar; stops under the pointer.
 * Block Types: ever-blocks/announcement-bar
 * Keywords: announcement, ticker, marquee
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/announcement-bar {"animation":"ticker","align":"full"} -->
<!-- wp:ever-blocks/announcement -->
<!-- wp:paragraph --><p><?php echo esc_html__( 'Free shipping on every order this week', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- /wp:ever-blocks/announcement -->
<!-- wp:ever-blocks/announcement -->
<!-- wp:paragraph --><p><?php echo esc_html__( 'New: the Pricing Table block is out', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- /wp:ever-blocks/announcement -->
<!-- wp:ever-blocks/announcement -->
<!-- wp:paragraph --><p><?php echo esc_html__( 'Support hours extended to weekends', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- /wp:ever-blocks/announcement -->
<!-- /wp:ever-blocks/announcement-bar -->
