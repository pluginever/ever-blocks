<?php

namespace EverBlocks\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Table of Contents: scans a post's heading blocks and gives each one an anchor.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
class TableOfContents extends Block {

	/**
	 * Attribute on a heading that keeps it out of the table.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const EXCLUDED = 'everBlocksTocExcluded';

	/**
	 * Block name.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public string $name = 'ever-blocks/table-of-contents';

	/**
	 * Scanned headings per post, in document order.
	 *
	 * @since 2.0.0
	 * @var array<int, array<int, array{text: string, id: string, level: int, page: int, excluded: bool, claimed: bool}>>
	 */
	private array $scans = array();

	/**
	 * Registers hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function register(): void {
		add_filter( 'block_type_metadata_settings', array( $this, 'add_settings' ), 10, 2 );
		add_filter( 'the_content', array( $this, 'release_anchors' ), 8 );
		add_filter( 'render_block_core/heading', array( $this, 'add_anchor' ), 10, 3 );
	}

	/**
	 * Frees every scanned heading before a content pass, so a second pass over the same post anchors again.
	 *
	 * @since 2.0.0
	 * @param string $content Post content.
	 * @return string Post content, unchanged.
	 */
	public function release_anchors( string $content ): string {
		foreach ( $this->scans as &$headings ) {
			foreach ( $headings as &$heading ) {
				$heading['claimed'] = false;
			}

			unset( $heading );
		}

		unset( $headings );

		return $content;
	}

	/**
	 * Points the block at `markup()` and gives the core heading block the attribute and context the scan needs.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $settings Block type settings.
	 * @param array<string, mixed> $metadata Block metadata.
	 * @return array<string, mixed> Block type settings.
	 */
	public function add_settings( array $settings, array $metadata ): array {
		$name = $metadata['name'] ?? '';

		if ( $name === $this->name ) {
			$settings['render_callback'] = array( $this, 'markup' );
		}

		if ( 'core/heading' === $name ) {
			$settings['attributes'][ self::EXCLUDED ] = array(
				'type'    => 'boolean',
				'default' => false,
			);
			$settings['uses_context'][]               = 'postId';
		}

		return $settings;
	}

	/**
	 * Builds the block's markup: a titled, optionally collapsible nested list of heading links.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Rendered inner blocks, unused.
	 * @param \WP_Block            $block      Block instance.
	 * @return string Block markup, or an empty string below the heading minimum.
	 */
	public function markup( array $attributes, string $content, \WP_Block $block ): string {
		$headings = $this->get_headings( $block );

		if ( $this->count( $headings ) < max( 1, (int) ( $attributes['minHeadings'] ?? 2 ) ) ) {
			return '';
		}

		$styles      = array( 'none', 'disc', 'decimal', 'nested', 'upper-roman', 'lower-alpha' );
		$style       = in_array( $attributes['listStyle'] ?? '', $styles, true ) ? $attributes['listStyle'] : 'decimal';
		$tags        = array( 'h2', 'h3', 'h4', 'h5', 'h6', 'p' );
		$tag         = in_array( $attributes['titleTag'] ?? '', $tags, true ) ? $attributes['titleTag'] : 'h2';
		$collapsible = ! empty( $attributes['collapsible'] );
		$title       = is_string( $attributes['title'] ?? null ) ? trim( $attributes['title'] ) : '';
		$title       = '' === $title && $collapsible ? __( 'Table of contents', 'ever-blocks' ) : $title;
		$id          = wp_unique_id( 'eb-table-of-contents-' );
		$wrapper     = array(
			'class'               => 'eb-table-of-contents is-list-style-' . $style,
			'data-wp-interactive' => 'ever-blocks/table-of-contents',
			'data-wp-context'     => (string) wp_json_encode(
				array(
					'smooth'    => ! empty( $attributes['smoothScroll'] ),
					'highlight' => ! empty( $attributes['highlight'] ),
				)
			),
			'data-wp-init'        => 'callbacks.observe',
		);

		if ( '' === $title ) {
			$wrapper['aria-label'] = __( 'Table of contents', 'ever-blocks' );
		} else {
			$wrapper['aria-labelledby'] = $id;
		}

		$body = $this->list( $headings );

		if ( $collapsible ) {
			$body = sprintf(
				'<details class="eb-table-of-contents__details"%1$s><summary class="eb-table-of-contents__summary"><%6$s class="eb-table-of-contents__title" id="%2$s">%3$s</%6$s><span class="eb-table-of-contents__toggle" aria-hidden="true">%4$s</span></summary>%5$s</details>',
				! isset( $attributes['open'] ) || $attributes['open'] ? ' open' : '',
				esc_attr( $id ),
				wp_kses_post( $title ),
				wp_get_icon( 'core/chevron-down', array( 'size' => null ) ),
				$body,
				'p' === $tag ? 'span' : $tag
			);
		} elseif ( '' !== $title ) {
			$body = sprintf(
				'<%1$s class="eb-table-of-contents__title" id="%2$s">%3$s</%1$s>%4$s',
				$tag,
				esc_attr( $id ),
				wp_kses_post( $title ),
				$body
			);
		}

		return sprintf( '<nav %1$s>%2$s</nav>', get_block_wrapper_attributes( $wrapper ), $body );
	}

	/**
	 * Gives a heading without an anchor the id the table links to.
	 *
	 * @since 2.0.0
	 * @param string               $content  Rendered heading.
	 * @param array<string, mixed> $block    Parsed block.
	 * @param \WP_Block            $instance Block instance.
	 * @return string Rendered heading.
	 */
	public function add_anchor( string $content, array $block, \WP_Block $instance ): string {
		$post_id = (int) ( $instance->context['postId'] ?? 0 );

		if (
			! $post_id || ! empty( $block['attrs']['anchor'] ) || ! doing_filter( 'the_content' )
			|| ! \WP_Block_Type_Registry::get_instance()->is_registered( $this->name )
		) {
			return $content;
		}

		$text  = $this->text( (string) ( $block['innerHTML'] ?? '' ) );
		$level = min( 6, max( 1, (int) ( $block['attrs']['level'] ?? 2 ) ) );
		$page  = max( 1, (int) get_query_var( 'page' ) );

		if ( '' === $text ) {
			return $content;
		}

		foreach ( $this->scan( $post_id ) as $index => $heading ) {
			if ( $heading['claimed'] || $heading['text'] !== $text || $heading['level'] !== $level || $heading['page'] !== $page ) {
				continue;
			}

			$this->scans[ $post_id ][ $index ]['claimed'] = true;

			$processor = new \WP_HTML_Tag_Processor( $content );

			if ( $processor->next_tag( array( 'tag_name' => 'H' . $level ) ) && null === $processor->get_attribute( 'id' ) ) {
				$processor->set_attribute( 'id', $heading['id'] );
			}

			return $processor->get_updated_html();
		}

		return $content;
	}

	/**
	 * Returns the headings one table instance lists, nested by level.
	 *
	 * @since 2.0.0
	 * @param \WP_Block $block Table of contents instance.
	 * @return array<int, array{text: string, link: string, children: array<int, mixed>}> Heading tree.
	 */
	public function get_headings( \WP_Block $block ): array {
		$post_id = (int) ( $block->context['postId'] ?? get_the_ID() );

		if ( ! $post_id ) {
			return array();
		}

		$levels = array_map( 'intval', (array) ( $block->attributes['levels'] ?? array( 2, 3 ) ) );
		$page   = max( 1, (int) get_query_var( 'page' ) );
		$flat   = array();

		foreach ( $this->scan( $post_id ) as $heading ) {
			if ( $heading['excluded'] || ! in_array( $heading['level'], $levels, true ) ) {
				continue;
			}

			$flat[] = array(
				'text'     => $heading['text'],
				'level'    => $heading['level'],
				'link'     => ( $heading['page'] === $page ? '' : $this->page_link( $heading['page'] ) ) . '#' . $heading['id'],
				'children' => array(),
			);
		}

		return $this->nest( $flat );
	}

	/**
	 * Scans a post's content once per request for every heading block.
	 *
	 * @since 2.0.0
	 * @param int $post_id Post ID.
	 * @return array<int, array{text: string, id: string, level: int, page: int, excluded: bool, claimed: bool}> Headings in document order.
	 */
	private function scan( int $post_id ): array {
		if ( isset( $this->scans[ $post_id ] ) ) {
			return $this->scans[ $post_id ];
		}

		$post                    = get_post( $post_id );
		$this->scans[ $post_id ] = array();

		if ( ! $post instanceof \WP_Post ) {
			return array();
		}

		$headings = array();
		$ids      = array();
		$page     = 1;

		$this->walk( parse_blocks( $post->post_content ), $headings, $page, 0 );

		foreach ( $headings as $heading ) {
			if ( '' !== $heading['id'] ) {
				$ids[ $heading['id'] ] = true;
			}
		}

		foreach ( $headings as $index => $heading ) {
			if ( '' === $heading['id'] ) {
				$base = sanitize_title( $heading['text'] );
				$base = '' === $base ? 'heading' : $base;
				$id   = $base;

				for ( $n = 2; isset( $ids[ $id ] ); $n++ ) {
					$id = $base . '-' . $n;
				}

				$ids[ $id ]               = true;
				$headings[ $index ]['id'] = $id;
			}
		}

		$this->scans[ $post_id ] = $headings;

		return $headings;
	}

	/**
	 * Collects heading blocks, following synced patterns and counting page breaks.
	 *
	 * @since 2.0.0
	 * @param array<int|string, array<string, mixed>>                                                           $blocks   Parsed blocks.
	 * @param array<int, array{text: string, id: string, level: int, page: int, excluded: bool, claimed: bool}> $headings Headings gathered so far, appended to.
	 * @param int                                                                                               $page     Current page of a paginated post.
	 * @param int                                                                                               $depth    Synced pattern nesting depth.
	 * @return void
	 */
	private function walk( array $blocks, array &$headings, int &$page, int $depth ): void {
		foreach ( $blocks as $block ) {
			$name  = (string) ( $block['blockName'] ?? '' );
			$attrs = is_array( $block['attrs'] ?? null ) ? $block['attrs'] : array();

			if ( 'core/nextpage' === $name ) {
				++$page;
				continue;
			}

			if ( 'core/block' === $name ) {
				$ref = get_post( (int) ( $attrs['ref'] ?? 0 ) );

				if ( $ref instanceof \WP_Post && 'wp_block' === $ref->post_type && $depth < 5 ) {
					$this->walk( parse_blocks( $ref->post_content ), $headings, $page, $depth + 1 );
				}

				continue;
			}

			if ( 'core/heading' === $name ) {
				$text = $this->text( (string) ( $block['innerHTML'] ?? '' ) );

				if ( '' !== $text ) {
					$headings[] = array(
						'text'     => $text,
						'id'       => is_string( $attrs['anchor'] ?? null ) ? trim( $attrs['anchor'] ) : '',
						'level'    => min( 6, max( 1, (int) ( $attrs['level'] ?? 2 ) ) ),
						'page'     => $page,
						'excluded' => ! empty( $attrs[ self::EXCLUDED ] ),
						'claimed'  => false,
					);
				}
			}

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$this->walk( $block['innerBlocks'], $headings, $page, $depth );
			}
		}
	}

	/**
	 * Nests a flat list of headings by level.
	 *
	 * @since 2.0.0
	 * @param array<int, array{text: string, level: int, link: string, children: array<int, mixed>}> $flat Headings in document order.
	 * @return array<int, array{text: string, link: string, children: array<int, mixed>}> Heading tree.
	 */
	private function nest( array $flat ): array {
		$tree  = array();
		$count = count( $flat );

		for ( $i = 0; $i < $count; $i = $next ) {
			$next = $i + 1;

			while ( $next < $count && $flat[ $next ]['level'] > $flat[ $i ]['level'] ) {
				++$next;
			}

			$tree[] = array(
				'text'     => $flat[ $i ]['text'],
				'link'     => $flat[ $i ]['link'],
				'children' => $this->nest( array_slice( $flat, $i + 1, $next - $i - 1 ) ),
			);
		}

		return $tree;
	}

	/**
	 * Renders a heading tree as nested ordered lists, each item carrying its outline index.
	 *
	 * @since 2.0.0
	 * @param array<int, array{text: string, link: string, children: array<int, mixed>}> $nodes  Heading tree.
	 * @param string                                                                     $prefix Index of the parent item, or empty at the top level.
	 * @return string List markup.
	 */
	private function list( array $nodes, string $prefix = '' ): string {
		$items = '';

		foreach ( array_values( $nodes ) as $position => $node ) {
			$index  = $prefix . ( $position + 1 );
			$items .= sprintf(
				'<li class="eb-table-of-contents__item" data-index="%1$s"><a class="eb-table-of-contents__link" href="%2$s" data-wp-on--click="actions.follow">%3$s</a>%4$s</li>',
				esc_attr( $index ),
				esc_url( $node['link'] ),
				esc_html( $node['text'] ),
				empty( $node['children'] ) ? '' : $this->list( $node['children'], $index . '.' )
			);
		}

		return '<ol class="eb-table-of-contents__list">' . $items . '</ol>';
	}

	/**
	 * Counts every heading in a tree.
	 *
	 * @since 2.0.0
	 * @param array<int, array{text: string, link: string, children: array<int, mixed>}> $nodes Heading tree.
	 * @return int Heading count.
	 */
	private function count( array $nodes ): int {
		$total = 0;

		foreach ( $nodes as $node ) {
			$total += 1 + $this->count( $node['children'] );
		}

		return $total;
	}

	/**
	 * Returns the plain text of a heading block's markup.
	 *
	 * @since 2.0.0
	 * @param string $html Heading block inner HTML.
	 * @return string Decoded, trimmed text.
	 */
	private function text( string $html ): string {
		$html = preg_replace( '/<br\s*\/?>/i', ' ', $html );

		return trim( html_entity_decode( wp_strip_all_tags( (string) $html ), ENT_QUOTES, get_bloginfo( 'charset' ) ) );
	}

	/**
	 * Returns the URL of one page of the current paginated post.
	 *
	 * @since 2.0.0
	 * @param int $page Page number.
	 * @return string URL.
	 */
	private function page_link( int $page ): string {
		$processor = new \WP_HTML_Tag_Processor( _wp_link_page( $page ) );

		return $processor->next_tag( array( 'tag_name' => 'a' ) ) ? (string) $processor->get_attribute( 'href' ) : '';
	}
}
