<?php
/**
 * Title: Promo bar
 * Slug: announcement-promo
 * Description: A dismissible bar with a message and a button, for the top of the header.
 * Block Types: ever-blocks/announcement-bar
 * Keywords: announcement, promo, banner
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/announcement-bar {"dismissible":true,"align":"full"} -->
<!-- wp:ever-blocks/announcement -->
<!-- wp:paragraph --><p><?php echo esc_html__( 'Free shipping on every order this week.', 'ever-blocks' ); ?></p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline","fontSize":"small"} --><div class="wp-block-button is-style-outline has-custom-font-size has-small-font-size"><a class="wp-block-button__link wp-element-button"><?php echo esc_html__( 'Shop now', 'ever-blocks' ); ?></a></div><!-- /wp:button --></div><!-- /wp:buttons -->
<!-- /wp:ever-blocks/announcement -->
<!-- /wp:ever-blocks/announcement-bar -->
