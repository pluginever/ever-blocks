<?php
// This file is generated. Do not modify it manually.
return array(
	'announcement' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/announcement',
		'title' => 'Announcement',
		'category' => 'ever-blocks',
		'icon' => 'megaphone',
		'description' => 'One message in an announcement bar; holds any blocks.',
		'textdomain' => 'ever-blocks',
		'parent' => array(
			'ever-blocks/announcement-bar'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'reusable' => false,
			'inserter' => false,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'padding' => true,
				'blockGap' => true
			),
			'layout' => array(
				'allowSwitching' => false,
				'allowInheriting' => false,
				'default' => array(
					'type' => 'flex',
					'flexWrap' => 'wrap',
					'justifyContent' => 'center',
					'verticalAlignment' => 'center'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-announcement'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'announcement-bar' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/announcement-bar',
		'title' => 'Announcement Bar',
		'category' => 'ever-blocks',
		'icon' => 'megaphone',
		'description' => 'A bar for notices and promotions — still, scrolling, or rotating — that visitors can dismiss.',
		'keywords' => array(
			'notification',
			'banner',
			'top bar',
			'promo',
			'marquee',
			'announcement'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'animation' => array(
				'type' => 'string',
				'default' => 'static',
				'enum' => array(
					'static',
					'ticker',
					'rotate'
				)
			),
			'speed' => array(
				'type' => 'string',
				'default' => 'normal',
				'enum' => array(
					'slow',
					'normal',
					'fast'
				)
			),
			'direction' => array(
				'type' => 'string',
				'default' => 'left',
				'enum' => array(
					'left',
					'right',
					'up',
					'down'
				)
			),
			'dismissible' => array(
				'type' => 'boolean',
				'default' => false
			),
			'rememberDays' => array(
				'type' => 'number',
				'default' => 7
			),
			'startsAt' => array(
				'type' => 'string',
				'default' => ''
			),
			'endsAt' => array(
				'type' => 'string',
				'default' => ''
			),
			'closeIcon' => array(
				'type' => 'string',
				'default' => 'heroicons/x-mark'
			),
			'separator' => array(
				'type' => 'string',
				'default' => 'dot',
				'enum' => array(
					'none',
					'dot',
					'line',
					'slash',
					'custom'
				)
			),
			'separatorText' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'allowedBlocks' => array(
			'ever-blocks/announcement'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'link' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true,
					'link' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'position' => array(
				'sticky' => true
			),
			'interactivity' => true,
			'everBlocks' => array(
				'elements' => array(
					'track' => '.eb-announcement-bar__track',
					'close' => array(
						'selector' => '.eb-announcement-bar__close',
						'states' => array(
							':hover',
							':focus-visible'
						)
					),
					'separator' => '.eb-announcement-bar__track .eb-announcement::after'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-announcement-bar',
			'states' => array(
				'-paused' => '.eb-announcement-bar.is-paused'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	),
	'carousel' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/carousel',
		'title' => 'Carousel',
		'category' => 'ever-blocks',
		'icon' => 'images-alt2',
		'description' => 'A slider, a scrolling row, or columns of blocks — moving or still.',
		'keywords' => array(
			'slider',
			'slides',
			'scroll',
			'marquee',
			'masonry',
			'wall'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'layout' => array(
				'type' => 'string',
				'default' => 'slider',
				'enum' => array(
					'slider',
					'row',
					'columns'
				)
			),
			'columns' => array(
				'type' => 'number',
				'default' => 3
			),
			'arrows' => array(
				'type' => 'boolean',
				'default' => true
			),
			'dots' => array(
				'type' => 'boolean',
				'default' => true
			),
			'justifyContent' => array(
				'type' => 'string',
				'default' => 'center',
				'enum' => array(
					'left',
					'center',
					'right',
					'space-between'
				)
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'loop' => array(
				'type' => 'boolean',
				'default' => true
			),
			'speed' => array(
				'type' => 'string',
				'default' => 'normal',
				'enum' => array(
					'slow',
					'normal',
					'fast'
				)
			),
			'direction' => array(
				'type' => 'string',
				'default' => 'left',
				'enum' => array(
					'left',
					'right'
				)
			),
			'previousIcon' => array(
				'type' => 'string',
				'default' => 'core/chevron-left'
			),
			'nextIcon' => array(
				'type' => 'string',
				'default' => 'core/chevron-right'
			)
		),
		'providesContext' => array(
			'ever-blocks/carouselLayout' => 'layout'
		),
		'allowedBlocks' => array(
			'ever-blocks/carousel-slide'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'interactivity' => true,
			'everBlocks' => array(
				'elements' => array(
					'track' => '.eb-carousel__track',
					'arrow' => array(
						'selector' => '.eb-carousel__arrow',
						'states' => array(
							':hover',
							':focus-visible',
							':disabled'
						)
					),
					'dot' => array(
						'selector' => '.eb-carousel__dot',
						'states' => array(
							':hover'
						)
					)
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-carousel'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	),
	'carousel-slide' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/carousel-slide',
		'title' => 'Slide',
		'category' => 'ever-blocks',
		'icon' => 'images-alt2',
		'description' => 'One slide of a carousel; holds any blocks.',
		'textdomain' => 'ever-blocks',
		'parent' => array(
			'ever-blocks/carousel'
		),
		'usesContext' => array(
			'ever-blocks/carouselLayout'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'reusable' => false,
			'inserter' => false,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'padding' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'layout' => array(
				'allowSwitching' => false,
				'allowInheriting' => false,
				'default' => array(
					'type' => 'flex',
					'orientation' => 'vertical',
					'justifyContent' => 'stretch'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-carousel__slide'
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'pricing-column' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/pricing-column',
		'title' => 'Pricing Column',
		'category' => 'ever-blocks',
		'icon' => 'table-col-after',
		'description' => 'One plan: its billing option, badge and featured state, with any blocks inside.',
		'textdomain' => 'ever-blocks',
		'parent' => array(
			'ever-blocks/pricing-table'
		),
		'attributes' => array(
			'featured' => array(
				'type' => 'boolean',
				'default' => false
			),
			'badge' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'option' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'usesContext' => array(
			'ever-blocks/pricingOptions',
			'ever-blocks/pricingActive'
		),
		'providesContext' => array(
			'ever-blocks/pricingFeatured' => 'featured'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'reusable' => false,
			'inserter' => false,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'padding' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'shadow' => true,
			'everBlocks' => array(
				'elements' => array(
					'badge' => '.eb-pricing-column__badge'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-pricing-column',
			'states' => array(
				'-featured' => '.eb-pricing-column.is-featured'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		)
	),
	'pricing-price' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/pricing-price',
		'title' => 'Price',
		'category' => 'ever-blocks',
		'icon' => 'tag',
		'description' => 'A plan’s price: currency, amount, period, an original price and a note.',
		'textdomain' => 'ever-blocks',
		'parent' => array(
			'ever-blocks/pricing-column'
		),
		'attributes' => array(
			'currency' => array(
				'type' => 'string',
				'default' => ''
			),
			'amount' => array(
				'type' => 'string',
				'default' => ''
			),
			'period' => array(
				'type' => 'string',
				'default' => ''
			),
			'original' => array(
				'type' => 'string',
				'default' => ''
			),
			'note' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'inserter' => false,
			'reusable' => false,
			'color' => array(
				'text' => true,
				'background' => false,
				'__experimentalDefaultControls' => array(
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true
			),
			'everBlocks' => array(
				'elements' => array(
					'currency' => '.eb-pricing-price__currency',
					'amount' => '.eb-pricing-price__amount',
					'period' => '.eb-pricing-price__period',
					'original' => '.eb-pricing-price__original',
					'note' => '.eb-pricing-price__note'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-pricing-price'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'render' => 'file:./render.php'
	),
	'pricing-table' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/pricing-table',
		'title' => 'Pricing Table',
		'category' => 'ever-blocks',
		'icon' => 'table-col-after',
		'description' => 'Plans side by side, with a billing switch that shows the columns for one option at a time.',
		'keywords' => array(
			'pricing',
			'plans',
			'price',
			'subscription',
			'compare'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'layout' => array(
				'type' => 'string',
				'default' => 'card',
				'enum' => array(
					'card',
					'divided'
				)
			),
			'options' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object'
				)
			),
			'active' => array(
				'type' => 'string',
				'default' => ''
			),
			'optionsLabel' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'providesContext' => array(
			'ever-blocks/pricingOptions' => 'options',
			'ever-blocks/pricingActive' => 'active'
		),
		'allowedBlocks' => array(
			'ever-blocks/pricing-column'
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'interactivity' => true,
			'everBlocks' => array(
				'elements' => array(
					'switch' => '.eb-pricing-table__switch',
					'option' => array(
						'selector' => '.eb-pricing-table__option',
						'states' => array(
							':hover',
							':focus-visible'
						)
					),
					'optionBadge' => '.eb-pricing-table__option-badge'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-pricing-table'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	),
	'rating' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/rating',
		'title' => 'Rating',
		'category' => 'ever-blocks',
		'icon' => 'star-filled',
		'description' => 'Shows a score as a row of stars or any icon.',
		'keywords' => array(
			'stars',
			'review',
			'score'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'value' => array(
				'type' => 'number',
				'default' => 5
			),
			'max' => array(
				'type' => 'number',
				'default' => 5
			),
			'icon' => array(
				'type' => 'string',
				'default' => 'heroicons/star'
			),
			'showLabel' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'textAlign' => true
			),
			'everBlocks' => array(
				'elements' => array(
					'label' => '.eb-rating__label'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-rating'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		)
	),
	'search-modal' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/search-modal',
		'title' => 'Search Modal',
		'category' => 'ever-blocks',
		'icon' => 'search',
		'description' => 'A search button that opens the site search in a dialog.',
		'keywords' => array(
			'search',
			'modal',
			'popup',
			'dialog',
			'header'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'triggerLabel' => array(
				'type' => 'string',
				'role' => 'content',
				'default' => ''
			),
			'triggerIcon' => array(
				'type' => 'string',
				'default' => 'core/search'
			),
			'closeIcon' => array(
				'type' => 'string',
				'default' => 'heroicons/x-mark'
			),
			'overlay' => array(
				'type' => 'string',
				'default' => 'full',
				'enum' => array(
					'full',
					'center',
					'top'
				)
			),
			'shortcut' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'left',
				'center',
				'right'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'interactivity' => true,
			'everBlocks' => array(
				'elements' => array(
					'trigger' => array(
						'selector' => '.eb-search-modal__trigger',
						'states' => array(
							':hover',
							':focus-visible'
						)
					),
					'dialog' => '.eb-search-modal__dialog',
					'backdrop' => '.eb-search-modal__dialog::backdrop',
					'content' => '.eb-search-modal__content',
					'close' => array(
						'selector' => '.eb-search-modal__close',
						'states' => array(
							':hover',
							':focus-visible'
						)
					)
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-search-modal',
			'states' => array(
				'-open' => '.eb-search-modal.is-open'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'viewScriptModule' => 'file:./view.js'
	),
	'table-of-contents' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/table-of-contents',
		'title' => 'Table of Contents',
		'category' => 'ever-blocks',
		'icon' => 'list-view',
		'description' => 'Lists the headings of this post and links to each one.',
		'keywords' => array(
			'toc',
			'outline',
			'summary',
			'jump links',
			'index'
		),
		'textdomain' => 'ever-blocks',
		'usesContext' => array(
			'postId'
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'role' => 'content',
				'default' => ''
			),
			'titleTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'p'
				)
			),
			'levels' => array(
				'type' => 'array',
				'default' => array(
					2,
					3
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'listStyle' => array(
				'type' => 'string',
				'default' => 'decimal',
				'enum' => array(
					'none',
					'disc',
					'decimal',
					'nested',
					'upper-roman',
					'lower-alpha'
				)
			),
			'collapsible' => array(
				'type' => 'boolean',
				'default' => false
			),
			'open' => array(
				'type' => 'boolean',
				'default' => true
			),
			'smoothScroll' => array(
				'type' => 'boolean',
				'default' => true
			),
			'highlight' => array(
				'type' => 'boolean',
				'default' => true
			),
			'minHeadings' => array(
				'type' => 'number',
				'default' => 2
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'link' => false,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'interactivity' => true,
			'everBlocks' => array(
				'elements' => array(
					'title' => '.eb-table-of-contents__title',
					'toggle' => '.eb-table-of-contents__toggle',
					'list' => '.eb-table-of-contents__list',
					'item' => array(
						'selector' => '.eb-table-of-contents__item > .eb-table-of-contents__link',
						'states' => array(
							':hover',
							':focus-visible'
						)
					),
					'current' => '.eb-table-of-contents__link[aria-current]',
					'marker' => '.eb-table-of-contents__item::marker'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-table-of-contents'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		),
		'viewScriptModule' => 'file:./view.js'
	),
	'testimonial' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ever-blocks/testimonial',
		'title' => 'Testimonial',
		'category' => 'ever-blocks',
		'icon' => 'format-quote',
		'description' => 'A customer quote with photo, name, role, rating and logo.',
		'keywords' => array(
			'quote',
			'review',
			'customer',
			'testimonial'
		),
		'textdomain' => 'ever-blocks',
		'attributes' => array(
			'layout' => array(
				'type' => 'string',
				'default' => 'stacked',
				'enum' => array(
					'stacked',
					'side',
					'centered'
				)
			),
			'quote' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'showName' => array(
				'type' => 'boolean',
				'default' => true
			),
			'name' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'showRole' => array(
				'type' => 'boolean',
				'default' => true
			),
			'role' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'showAvatar' => array(
				'type' => 'boolean',
				'default' => true
			),
			'avatarId' => array(
				'type' => 'number'
			),
			'avatarUrl' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'avatarAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'showRating' => array(
				'type' => 'boolean',
				'default' => true
			),
			'rating' => array(
				'type' => 'number',
				'default' => 5
			),
			'showLogo' => array(
				'type' => 'boolean',
				'default' => false
			),
			'logoId' => array(
				'type' => 'number'
			),
			'logoUrl' => array(
				'type' => 'string',
				'role' => 'content'
			),
			'logoAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'quoteMark' => array(
				'type' => 'boolean',
				'default' => false
			),
			'schema' => array(
				'type' => 'boolean',
				'default' => false
			),
			'itemReviewed' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide'
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'gradients' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'textAlign' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'shadow' => true,
			'everBlocks' => array(
				'elements' => array(
					'quote' => '.eb-testimonial__quote',
					'author' => '.eb-testimonial__author',
					'name' => '.eb-testimonial__name',
					'role' => '.eb-testimonial__role',
					'avatar' => '.eb-testimonial__avatar',
					'rating' => '.eb-testimonial__rating',
					'mark' => '.eb-testimonial__mark',
					'logo' => '.eb-testimonial__logo'
				)
			)
		),
		'selectors' => array(
			'root' => '.eb-testimonial'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => array(
			'ever-blocks-common',
			'file:./style-index.css'
		)
	)
);
