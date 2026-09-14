<?php
/**
 * Title: Scrolling logo strip
 * Slug: logo-strip
 * Description: Client logos that keep scrolling across the page; stops under the pointer.
 * Block Types: ever-blocks/carousel
 * Keywords: logos, clients, marquee, carousel
 * Viewport Width: 1200
 *
 * @since   2.0.0
 * @package EverBlocks
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:ever-blocks/carousel {"layout":"row","autoplay":true,"speed":"slow","align":"full","style":{"everBlocks":{"slideWidth":"160px","gap":"48px"}}} -->
<?php for ( $eb_i = 0; $eb_i < 6; $eb_i++ ) : ?>
<!-- wp:ever-blocks/carousel-slide {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<!-- wp:image {"aspectRatio":"3","scale":"contain","sizeSlug":"medium"} -->
<figure class="wp-block-image size-medium"><img src="<?php echo esc_url( EVER_BLOCKS_URL . 'assets/images/logo.svg' ); ?>" alt="" style="aspect-ratio:3;object-fit:contain"/></figure>
<!-- /wp:image -->
<!-- /wp:ever-blocks/carousel-slide -->
<?php endfor; ?>
<!-- /wp:ever-blocks/carousel -->
