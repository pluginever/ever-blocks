<?php
/**
 * Title: Sticky sidebar with table of contents
 * Slug: table-of-contents-sidebar
 * Description: Two columns; the outline stays in view while the article scrolls.
 * Block Types: ever-blocks/table-of-contents
 * Keywords: toc, sidebar, sticky, outline
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"30%"} -->
<div class="wp-block-column" style="flex-basis:30%"><!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"},"spacing":{"padding":{"top":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30)"><!-- wp:ever-blocks/table-of-contents {"title":"<?php echo esc_attr__( 'On this page', 'ever-blocks' ); ?>","listStyle":"none","levels":[2]} /--></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"70%"} -->
<div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo esc_html__( 'First section', 'ever-blocks' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Replace this with your article. Every heading you add appears in the outline on the left.', 'ever-blocks' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo esc_html__( 'Second section', 'ever-blocks' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo esc_html__( 'Headings inside synced patterns and on later pages of a paginated post are listed too.', 'ever-blocks' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
