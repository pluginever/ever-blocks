<?php
/**
 * Title: Rating with review count
 * Slug: rating-summary
 * Description: A score beside a short line of social proof.
 * Block Types: ever-blocks/rating
 * Keywords: rating, stars, reviews, social proof
 * Viewport Width: 600
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"center"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
<div class="wp-block-group"><!-- wp:ever-blocks/rating {"value":4.8} /-->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"var:preset|font-size|small"}}} -->
<p style="font-size:var(--wp--preset--font-size--small)"><?php echo esc_html__( '4.8 out of 5 from 1,200 reviews', 'ever-blocks' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
