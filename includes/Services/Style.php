<?php

namespace EverBlocks\Services;

defined( 'ABSPATH' ) || exit;

/**
 * Compiles a block instance's style attribute into the rules core does not generate.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
final class Style {

	/**
	 * Style engine store the plugin's rules are registered with.
	 *
	 * Core enqueues every store that is not `block-supports` as
	 * `wp-style-engine-{context}`, so nothing here registers or prints a handle.
	 *
	 * @since 2.0.0
	 * @var string
	 */
	public const CONTEXT = 'ever-blocks';

	/**
	 * Compiles every rule an instance needs beyond what core's block supports write.
	 *
	 * Walks the attribute in core's own order — viewport, then custom state, then
	 * element, then pseudo-state — and only compiles the states and elements the
	 * block declares in its `block.json`.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $style      Block style attribute.
	 * @param \WP_Block_Type       $block_type Registered block type.
	 * @param array<int, mixed>    $extra      Rules a block or filter adds, of `declarations` and optionally a `selector` relative to the instance and a `query`.
	 * @return array<int, array<string, mixed>> Rules of `selector`, `declarations`, `query` and `important`.
	 */
	public function compile( array $style, \WP_Block_Type $block_type, array $extra = array() ): array {
		$name      = (string) $block_type->name;
		$style_key = $this->get_namespace( $name );
		$elements  = $this->get_elements( $block_type );
		$states    = $this->get_states( $block_type );
		$queries   = array_merge( array( '' => '' ), $this->get_media_queries() );
		$css_rules = array();

		foreach ( $queries as $viewport => $query ) {
			$scope = '' === $viewport ? $style : ( $style[ $viewport ] ?? null );

			if ( ! is_array( $scope ) || empty( $scope ) ) {
				continue;
			}

			$this->compile_scope( $css_rules, $scope, '', $block_type, $style_key, $elements, $states, $query );

			foreach ( $states as $state => $selector ) {
				if ( isset( $scope[ $state ] ) && is_array( $scope[ $state ] ) ) {
					$this->compile_scope( $css_rules, $scope[ $state ], $state, $block_type, $style_key, $elements, $states, $query );
				}
			}
		}

		foreach ( $extra as $rule ) {
			if ( ! is_array( $rule ) || empty( $rule['declarations'] ) || ! is_array( $rule['declarations'] ) ) {
				continue;
			}

			$css_rules[] = $this->rule(
				$this->element_selector( isset( $rule['selector'] ) && is_string( $rule['selector'] ) ? $rule['selector'] : '' ),
				$rule['declarations'],
				isset( $rule['query'] ) && is_string( $rule['query'] ) ? $rule['query'] : '',
				! empty( $rule['important'] )
			);
		}

		return $css_rules;
	}

	/**
	 * Registers an instance's rules with the store and stamps its class on the wrapper.
	 *
	 * State declarations carry `!important` because they have to beat the inline
	 * styles and preset utility classes core writes for the base state. The
	 * selector is doubled so it outranks core's block-support CSS, which is
	 * sorted after a plugin's overrides.
	 *
	 * @since 2.0.0
	 * @param string                           $content   Rendered block content.
	 * @param string                           $name      Block name.
	 * @param array<int, array<string, mixed>> $css_rules Rules from `compile()`.
	 * @return string Rendered block content.
	 */
	public function apply( string $content, string $name, array $css_rules ): string {
		if ( empty( $css_rules ) ) {
			return $content;
		}

		$processor = new \WP_HTML_Tag_Processor( $content );

		if ( ! $processor->next_tag() ) {
			return $content;
		}

		$classname = wp_unique_id_from_values(
			array(
				'blockName' => $name,
				'rules'     => $css_rules,
			),
			'eb-'
		);

		foreach ( $css_rules as $rule ) {
			$declarations = is_array( $rule['declarations'] ) ? $rule['declarations'] : array();
			$selector     = '.' . $classname . '.' . $classname . (string) $rule['selector'];
			$query        = is_string( $rule['query'] ) ? $rule['query'] : '';

			if ( empty( $rule['important'] ) ) {
				$this->store_rule( $selector, $declarations, $query );

				continue;
			}

			$important = new \WP_Style_Engine_CSS_Declarations();

			foreach ( wp_get_state_declarations_with_background_resets( $declarations ) as $property => $value ) {
				$important->add_declaration( $property, $value, array( 'important' => true ) );
			}

			$this->store_rule( $selector, $important, $query );

			$fallback = wp_get_state_declarations_with_fallback_border_styles( $declarations );

			foreach ( array_keys( $declarations ) as $property ) {
				unset( $fallback[ $property ] );
			}

			$this->store_rule( $selector, $fallback, $query );
		}

		$processor->add_class( $classname );

		return $processor->get_updated_html();
	}

	/**
	 * Returns the key inside `style` that holds a block's own values.
	 *
	 * Derived from the block's own namespace, which WordPress already keeps
	 * unique per plugin, so the editor and the server cannot disagree about it.
	 *
	 * @since 2.0.0
	 * @param string $name Block name.
	 * @return string Namespace, or an empty string when the block name is unusable.
	 */
	public function get_namespace( string $name ): string {
		$separator = strpos( $name, '/' );

		if ( ! $separator ) {
			return '';
		}

		$vendor = substr( $name, 0, $separator );

		if ( ! preg_match( '/^[a-z][a-z0-9-]*$/', $vendor ) ) {
			return '';
		}

		return (string) preg_replace_callback(
			'/-([a-z0-9])/',
			static fn( array $parts ): string => strtoupper( $parts[1] ),
			$vendor
		);
	}

	/**
	 * Returns the custom property one of a block's own values is written to.
	 *
	 * The name is derived rather than mapped so the editor and the server cannot
	 * disagree about it. Keys come from block attributes, so anything that is not
	 * a plain identifier is refused before it reaches a declaration.
	 *
	 * @since 2.0.0
	 * @param string $name    Block name.
	 * @param string $key     Value name.
	 * @param string $element Element the value belongs to, or empty for the root.
	 * @return string Custom property, or an empty string when any part is unusable.
	 */
	public function get_custom_property( string $name, string $key, string $element = '' ): string {
		if ( ! preg_match( '/^[a-zA-Z][a-zA-Z0-9]*$/', $key ) ) {
			return '';
		}

		if ( '' !== $element && ! preg_match( '/^[a-z][a-zA-Z0-9]*$/', $element ) ) {
			return '';
		}

		$separator = strpos( $name, '/' );

		if ( ! $separator ) {
			return '';
		}

		$vendor = substr( $name, 0, $separator );
		$slug   = substr( $name, $separator + 1 );

		if ( ! preg_match( '/^[a-z][a-z0-9-]*$/', $vendor ) || ! preg_match( '/^[a-z][a-z0-9-]*$/', $slug ) ) {
			return '';
		}

		$parts = array_filter( array( $vendor, $slug, $this->to_kebab( $element ), $this->to_kebab( $key ) ) );

		return '--' . implode( '-', $parts );
	}

	/**
	 * Returns the elements a block declares, keyed by name.
	 *
	 * Read from `supports.everBlocks.elements`. A string is the selector; an array
	 * carries `selector` and the `states` the element accepts.
	 *
	 * @since 2.0.0
	 * @param \WP_Block_Type $block_type Registered block type.
	 * @return array<string, array{selector: string, states: array<int, string>}> Elements.
	 */
	private function get_elements( \WP_Block_Type $block_type ): array {
		$declared = $block_type->supports['everBlocks']['elements'] ?? null;
		$elements = array();

		if ( ! is_array( $declared ) ) {
			return $elements;
		}

		foreach ( $declared as $element => $value ) {
			if ( ! is_string( $element ) || ! preg_match( '/^[a-z][a-zA-Z0-9]*$/', $element ) ) {
				continue;
			}

			$selector = is_array( $value ) ? ( $value['selector'] ?? '' ) : $value;
			$states   = is_array( $value ) ? ( $value['states'] ?? array() ) : array();

			if ( ! is_string( $selector ) || '' === trim( $selector ) ) {
				continue;
			}

			$elements[ $element ] = array(
				'selector' => trim( $selector ),
				'states'   => array_values( array_filter( (array) $states, array( $this, 'is_pseudo_state' ) ) ),
			);
		}

		return $elements;
	}

	/**
	 * Returns the root states a block declares, keyed by name.
	 *
	 * Pseudo-states come from `supports.everBlocks.states` and carry an empty
	 * selector; custom states come from `selectors.states` with the selector core
	 * expects there, e.g. `.eb-search-modal.is-open`.
	 *
	 * @since 2.0.0
	 * @param \WP_Block_Type $block_type Registered block type.
	 * @return array<string, string> Selector keyed by state.
	 */
	private function get_states( \WP_Block_Type $block_type ): array {
		$states = array();

		foreach ( (array) ( $block_type->supports['everBlocks']['states'] ?? array() ) as $state ) {
			if ( $this->is_pseudo_state( $state ) ) {
				$states[ $state ] = '';
			}
		}

		$custom = $block_type->selectors['states'] ?? null;

		foreach ( is_array( $custom ) ? $custom : array() as $state => $selector ) {
			if ( is_string( $state ) && preg_match( '/^-[a-z][a-z0-9-]*$/', $state ) && is_string( $selector ) && '' !== trim( $selector ) ) {
				$states[ $state ] = trim( $selector );
			}
		}

		return $states;
	}

	/**
	 * Returns the part of a block-scoped selector that follows the instance selector.
	 *
	 * Mirrors `wp_build_state_selector()`: the leading class, id, tag or attribute
	 * is the block's own root and is replaced by the instance selector, anything
	 * after it is kept.
	 *
	 * @since 2.0.0
	 * @param string $selector Selector from block metadata, e.g. `.wp-block-ever-blocks-icon svg`.
	 * @return string Selector tail, e.g. ` svg`.
	 */
	private function scope_selector( string $selector ): string {
		$selector = trim( $selector );

		if ( '' === $selector ) {
			return '';
		}

		if ( preg_match( '/^([.#]?[-_a-zA-Z0-9]+|\[[^\]]+\])/', $selector, $matches ) ) {
			return substr( $selector, strlen( $matches[0] ) );
		}

		return $selector;
	}

	/**
	 * Returns the part of an element selector that follows the instance selector.
	 *
	 * `&` stands for the instance itself; a selector starting with `:` attaches to
	 * it; anything else is a descendant.
	 *
	 * @since 2.0.0
	 * @param string $selector Element selector as declared, e.g. `&::backdrop` or `.eb-x__input`.
	 * @return string Selector tail, e.g. `::backdrop` or ` .eb-x__input`.
	 */
	private function element_selector( string $selector ): string {
		$selector = trim( $selector );

		if ( '' === $selector ) {
			return '';
		}

		if ( str_starts_with( $selector, '&' ) ) {
			return substr( $selector, 1 );
		}

		if ( str_starts_with( $selector, ':' ) || str_starts_with( $selector, ' ' ) || str_starts_with( $selector, '>' ) ) {
			return $selector;
		}

		return ' ' . $selector;
	}

	/**
	 * Registers one rule with the plugin's store.
	 *
	 * @since 2.0.0
	 * @param string                                                  $selector     Rule selector.
	 * @param array<string, string>|\WP_Style_Engine_CSS_Declarations $declarations Declarations.
	 * @param string                                                  $query        Optional media query.
	 * @return void
	 */
	private function store_rule( string $selector, $declarations, string $query = '' ): void {
		if ( '' === trim( $selector ) || empty( $declarations ) ) {
			return;
		}

		wp_style_engine_get_stylesheet_from_css_rules(
			array(
				array(
					'selector'     => $selector,
					'declarations' => $declarations,
					'rules_group'  => $query,
				),
			),
			array(
				'context'  => self::CONTEXT,
				'prettify' => false,
			)
		);
	}

	/**
	 * Returns the media queries for the theme's viewport breakpoints.
	 *
	 * @since 2.0.0
	 * @return array<string, string> Media queries keyed by state name.
	 */
	private function get_media_queries(): array {
		return \WP_Theme_JSON::get_viewport_media_queries(
			wp_get_global_settings( array( 'viewport' ) )
		);
	}

	/**
	 * Compiles one state's subtree: the root, then each declared element.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>>                                   $css_rules  Rules gathered so far, appended to.
	 * @param array<string, mixed>                                               $scope      Style subtree for this viewport and state.
	 * @param string                                                             $state      Root state name, or empty for the default state.
	 * @param \WP_Block_Type                                                     $block_type Registered block type.
	 * @param string                                                             $style_key  Key holding the block's own values.
	 * @param array<string, array{selector: string, states: array<int, string>}> $elements   Declared elements.
	 * @param array<string, string>                                              $states     Declared root states.
	 * @param string                                                             $query      Media query, or empty.
	 * @return void
	 */
	private function compile_scope( array &$css_rules, array $scope, string $state, \WP_Block_Type $block_type, string $style_key, array $elements, array $states, string $query ): void {
		$name      = (string) $block_type->name;
		$is_pseudo = $this->is_pseudo_state( $state );
		$selector  = $is_pseudo ? $state : $this->scope_selector( $states[ $state ] ?? '' );
		$vars      = $this->get_custom_property_declarations( $scope[ $style_key ] ?? null, $name );

		if ( ! empty( $vars ) ) {
			$css_rules[] = $this->rule( $selector, $vars, $query, false );
		}

		if ( '' !== $state ) {
			$node = wp_get_root_state_style( $scope, array_merge( array( 'elements', $style_key ), array_keys( $states ) ) );

			foreach ( wp_get_block_state_style_rules( array( $state => $node ), $block_type, $query ) as $rule ) {
				$tail = $this->scope_selector( (string) ( $rule['selector'] ?? '' ) );

				$css_rules[] = $this->rule(
					$is_pseudo ? $tail . $state : $selector . $tail,
					(array) ( $rule['declarations'] ?? array() ),
					$query,
					true
				);
			}
		}

		if ( ! isset( $scope['elements'] ) || ! is_array( $scope['elements'] ) ) {
			return;
		}

		foreach ( $elements as $element => $declaration ) {
			$node = $scope['elements'][ $element ] ?? null;

			if ( ! is_array( $node ) || empty( $node ) ) {
				continue;
			}

			$base = $selector . $this->element_selector( $declaration['selector'] );

			$this->compile_element( $css_rules, $node, $base, '', $name, $style_key, $element, $declaration['states'], $query );

			foreach ( $declaration['states'] as $pseudo ) {
				if ( isset( $node[ $pseudo ] ) && is_array( $node[ $pseudo ] ) ) {
					$this->compile_element( $css_rules, $node[ $pseudo ], $base . $pseudo, $pseudo, $name, $style_key, $element, $declaration['states'], $query );
				}
			}
		}
	}

	/**
	 * Compiles one element at one state: its own values, then its core features.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>> $css_rules Rules gathered so far, appended to.
	 * @param array<string, mixed>             $node      Style subtree for the element at this state.
	 * @param string                           $selector  Selector tail for the element at this state.
	 * @param string                           $pseudo    Element pseudo-state, or empty.
	 * @param string                           $name      Block name.
	 * @param string                           $style_key Key holding the block's own values.
	 * @param string                           $element   Element name.
	 * @param array<int, string>               $states    Pseudo-states the element accepts.
	 * @param string                           $query     Media query, or empty.
	 * @return void
	 */
	private function compile_element( array &$css_rules, array $node, string $selector, string $pseudo, string $name, string $style_key, string $element, array $states, string $query ): void {
		$vars = $this->get_custom_property_declarations( $node[ $style_key ] ?? null, $name, $element );

		if ( ! empty( $vars ) ) {
			$css_rules[] = $this->rule( $selector, $vars, $query, false );
		}

		$features = wp_get_root_state_style( $node, array_merge( array( $style_key ), '' === $pseudo ? $states : array() ) );
		$compiled = wp_style_engine_get_styles( wp_normalize_state_style_for_css_output( $features ) );

		if ( ! empty( $compiled['declarations'] ) ) {
			$css_rules[] = $this->rule( $selector, $compiled['declarations'], $query, false );
		}
	}

	/**
	 * Builds one normalized rule.
	 *
	 * @since 2.0.0
	 * @param string                $selector     Selector tail.
	 * @param array<string, string> $declarations Declarations.
	 * @param string                $query        Media query, or empty.
	 * @param bool                  $important    Whether the declarations must beat inline styles.
	 * @return array<string, mixed> Rule.
	 */
	private function rule( string $selector, array $declarations, string $query, bool $important ): array {
		return array(
			'selector'     => $selector,
			'declarations' => $declarations,
			'query'        => $query,
			'important'    => $important,
		);
	}

	/**
	 * Determines whether a name is a pseudo-state this engine compiles.
	 *
	 * @since 2.0.0
	 * @param mixed $state Candidate state name.
	 * @return bool True for `:hover`-style names.
	 */
	private function is_pseudo_state( $state ): bool {
		return is_string( $state ) && (bool) preg_match( '/^::?[a-z][a-z-]*$/', $state );
	}

	/**
	 * Maps one state's values to the custom properties they set.
	 *
	 * @since 2.0.0
	 * @param mixed  $values  Values from one state of the namespace.
	 * @param string $name    Block name.
	 * @param string $element Element the values belong to, or empty for the root.
	 * @return array<string, string> Declarations.
	 */
	private function get_custom_property_declarations( $values, string $name, string $element = '' ): array {
		if ( ! is_array( $values ) ) {
			return array();
		}

		$declarations = array();

		foreach ( $values as $key => $value ) {
			if ( null === $value || '' === $value || is_array( $value ) ) {
				continue;
			}

			$property = $this->get_custom_property( $name, (string) $key, $element );

			if ( '' === $property ) {
				continue;
			}

			$declarations[ $property ] = (string) wp_normalize_state_preset_vars( (string) $value );
		}

		return $declarations;
	}

	/**
	 * Converts a camelCase identifier to kebab-case.
	 *
	 * @since 2.0.0
	 * @param string $value Identifier.
	 * @return string Kebab-case identifier.
	 */
	private function to_kebab( string $value ): string {
		return strtolower( (string) preg_replace( '/([a-z0-9])([A-Z])/', '$1-$2', $value ) );
	}
}
