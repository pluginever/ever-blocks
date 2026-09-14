<?php

namespace EverBlocks\Services;

defined( 'ABSPATH' ) || exit;

/**
 * Compiles a block instance's style attribute into the rules core does not generate.
 *
 * @since   2.0.0
 * @package EverBlocks
 */
final class Styler {

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
	 * Selectors carry `&` where the instance selector goes; `apply()` fills it in.
	 *
	 * @since 2.0.0
	 * @param array<string, mixed> $style      Block style attribute.
	 * @param \WP_Block_Type       $block_type Registered block type.
	 * @return array<int, array<string, mixed>> Rules of `selector`, `declarations`, `query` and `important`.
	 */
	public function compile( array $style, \WP_Block_Type $block_type ): array {
		$declaration = $this->get_declaration( $block_type );
		$queries     = array_merge( array( '' => '' ), \WP_Theme_JSON::get_viewport_media_queries( wp_get_global_settings( array( 'viewport' ) ) ) );
		$css_rules   = array();

		foreach ( $queries as $viewport => $query ) {
			$scope = '' === $viewport ? $style : ( $style[ $viewport ] ?? null );

			if ( ! is_array( $scope ) || empty( $scope ) ) {
				continue;
			}

			$this->compile_scope( $css_rules, $scope, '', $block_type, $declaration, $query );

			foreach ( array_keys( $declaration['states'] ) as $state ) {
				if ( isset( $scope[ $state ] ) && is_array( $scope[ $state ] ) ) {
					$this->compile_scope( $css_rules, $scope[ $state ], $state, $block_type, $declaration, $query );
				}
			}
		}

		return $css_rules;
	}

	/**
	 * Registers an instance's rules with the store and stamps its class on the wrapper.
	 *
	 * State declarations carry `!important` and the class is doubled, as core does
	 * for its own state rules, to beat inline styles and preset classes.
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
		$stored    = array();

		foreach ( $css_rules as $rule ) {
			$declarations = is_array( $rule['declarations'] ) ? $rule['declarations'] : array();
			$selector     = str_replace( '&', '.' . $classname . '.' . $classname, (string) $rule['selector'] );
			$query        = is_string( $rule['query'] ) ? $rule['query'] : '';

			if ( empty( $rule['important'] ) ) {
				$stored[] = $this->stored_rule( $selector, $declarations, $query );

				continue;
			}

			$important = new \WP_Style_Engine_CSS_Declarations();

			foreach ( wp_get_state_declarations_with_background_resets( $declarations ) as $property => $value ) {
				$important->add_declaration( $property, $value, array( 'important' => true ) );
			}

			$stored[] = $this->stored_rule( $selector, $important, $query );

			$fallback = wp_get_state_declarations_with_fallback_border_styles( $declarations );

			foreach ( array_keys( $declarations ) as $property ) {
				unset( $fallback[ $property ] );
			}

			if ( ! empty( $fallback ) ) {
				$stored[] = $this->stored_rule( $selector, $fallback, $query );
			}
		}

		wp_style_engine_get_stylesheet_from_css_rules(
			$stored,
			array(
				'context'  => self::CONTEXT,
				'prettify' => false,
			)
		);

		$processor->add_class( $classname );

		return $processor->get_updated_html();
	}

	/**
	 * Returns the key inside `style` that holds a block's own values.
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
	 * Reads the elements and states a block declares in its `block.json`.
	 *
	 * Elements come from `supports.everBlocks.elements` (a selector, or `selector`
	 * plus the `states` it accepts); root pseudo-states from
	 * `supports.everBlocks.states`; custom states from `selectors.states`.
	 *
	 * @since 2.0.0
	 * @param \WP_Block_Type $block_type Registered block type.
	 * @return array{elements: array<string, array{selector: string, states: array<int, string>}>, states: array<string, string>} Declaration.
	 */
	private function get_declaration( \WP_Block_Type $block_type ): array {
		$supports = $block_type->supports['everBlocks'] ?? array();
		$supports = is_array( $supports ) ? $supports : array();
		$elements = array();
		$states   = array();

		foreach ( is_array( $supports['elements'] ?? null ) ? $supports['elements'] : array() as $element => $value ) {
			$selector = is_array( $value ) ? ( $value['selector'] ?? '' ) : $value;
			$declared = is_array( $value ) ? ( $value['states'] ?? array() ) : array();

			if (
				! is_string( $element ) || ! preg_match( '/^[a-z][a-zA-Z0-9]*$/', $element ) || isset( \WP_Theme_JSON::ELEMENTS[ $element ] )
				|| ! is_string( $selector ) || '' === trim( $selector ) || str_contains( $selector, ',' )
			) {
				continue;
			}

			$elements[ $element ] = array(
				'selector' => trim( $selector ),
				'states'   => array_values( array_filter( is_array( $declared ) ? $declared : array(), array( $this, 'is_pseudo_state' ) ) ),
			);
		}

		foreach ( is_array( $supports['states'] ?? null ) ? $supports['states'] : array() as $state ) {
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

		return array(
			'elements' => $elements,
			'states'   => $states,
		);
	}

	/**
	 * Compiles one state's subtree: the root, then each declared element.
	 *
	 * @since 2.0.0
	 * @param array<int, array<string, mixed>> $css_rules   Rules gathered so far, appended to.
	 * @param array<string, mixed>             $scope       Style subtree for this viewport and state.
	 * @param string                           $state       Root state name, or empty for the default state.
	 * @param \WP_Block_Type                   $block_type  Registered block type.
	 * @param array<string, mixed>             $declaration Declaration from `get_declaration()`.
	 * @param string                           $query       Media query, or empty.
	 * @return void
	 */
	private function compile_scope( array &$css_rules, array $scope, string $state, \WP_Block_Type $block_type, array $declaration, string $query ): void {
		$name      = (string) $block_type->name;
		$style_key = $this->get_namespace( $name );
		$is_pseudo = $this->is_pseudo_state( $state );
		$base      = $is_pseudo ? '&' . $state : wp_build_state_selector( '&', $declaration['states'][ $state ] ?? '', '' );
		$vars      = $this->get_custom_property_declarations( $scope[ $style_key ] ?? null, $name );

		if ( ! empty( $vars ) ) {
			$css_rules[] = $this->rule( $base, $vars, $query );
		}

		if ( '' !== $state ) {
			$node = wp_get_root_state_style( $scope, array_merge( array( 'elements', $style_key ), array_keys( $declaration['states'] ) ) );

			foreach ( wp_get_block_state_style_rules( array( $state => $node ), $block_type, $query ) as $rule ) {
				$feature = (string) ( $rule['selector'] ?? '' );

				$css_rules[] = $this->rule(
					$is_pseudo ? wp_build_state_selector( '&', $feature, $state ) : $this->scope( $base, wp_build_state_selector( '&', $feature, '' ) ),
					(array) ( $rule['declarations'] ?? array() ),
					$query,
					true
				);
			}
		}

		if ( ! isset( $scope['elements'] ) || ! is_array( $scope['elements'] ) ) {
			return;
		}

		foreach ( $declaration['elements'] as $element => $declared ) {
			$node = $scope['elements'][ $element ] ?? null;

			if ( ! is_array( $node ) || empty( $node ) ) {
				continue;
			}

			$selector = $this->scope( $base, $this->element_selector( $declared['selector'] ) );

			$this->compile_element( $css_rules, $node, $selector, '', $name, $element, $declared['states'], $query );

			foreach ( $declared['states'] as $pseudo ) {
				if ( isset( $node[ $pseudo ] ) && is_array( $node[ $pseudo ] ) ) {
					$this->compile_element( $css_rules, $node[ $pseudo ], $this->scope( $selector, '&' . $pseudo ), $pseudo, $name, $element, $declared['states'], $query );
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
	 * @param string                           $selector  Selector for the element at this state.
	 * @param string                           $pseudo    Element pseudo-state, or empty.
	 * @param string                           $name      Block name.
	 * @param string                           $element   Element name.
	 * @param array<int, string>               $states    Pseudo-states the element accepts.
	 * @param string                           $query     Media query, or empty.
	 * @return void
	 */
	private function compile_element( array &$css_rules, array $node, string $selector, string $pseudo, string $name, string $element, array $states, string $query ): void {
		$style_key = $this->get_namespace( $name );
		$vars      = $this->get_custom_property_declarations( $node[ $style_key ] ?? null, $name, $element );

		if ( ! empty( $vars ) ) {
			$css_rules[] = $this->rule( $selector, $vars, $query );
		}

		$features = wp_get_root_state_style( $node, array_merge( array( $style_key ), '' === $pseudo ? $states : array() ) );
		$compiled = wp_style_engine_get_styles( wp_normalize_state_style_for_css_output( $features ) );

		if ( ! empty( $compiled['declarations'] ) ) {
			$css_rules[] = $this->rule( $selector, $compiled['declarations'], $query );
		}
	}

	/**
	 * Nests one `&` selector list inside another.
	 *
	 * @since 2.0.0
	 * @param string $outer Selector list the inner one attaches to, e.g. `&.is-open, &[open]`.
	 * @param string $inner Selector list with `&` standing for the outer one, e.g. `& .input`.
	 * @return string Selector list, e.g. `&.is-open .input, &[open] .input`.
	 */
	private function scope( string $outer, string $inner ): string {
		$selectors = array();

		foreach ( wp_split_selector_list( $outer ) as $outer_selector ) {
			foreach ( wp_split_selector_list( $inner ) as $inner_selector ) {
				$selectors[] = str_replace( '&', trim( $outer_selector ), trim( $inner_selector ) );
			}
		}

		return implode( ', ', $selectors );
	}

	/**
	 * Returns an element selector as a `&` selector relative to the instance.
	 *
	 * `&` stands for the instance itself; a selector starting with `:` or `>`
	 * attaches to it; anything else is a descendant.
	 *
	 * @since 2.0.0
	 * @param string $selector Element selector as declared, e.g. `&::backdrop` or `.eb-x__input`.
	 * @return string Selector, e.g. `&::backdrop` or `& .eb-x__input`.
	 */
	private function element_selector( string $selector ): string {
		$selector = trim( $selector );

		if ( str_starts_with( $selector, '&' ) ) {
			return $selector;
		}

		if ( str_starts_with( $selector, ':' ) || str_starts_with( $selector, '>' ) ) {
			return '&' . $selector;
		}

		return '& ' . $selector;
	}

	/**
	 * Builds one compiled rule.
	 *
	 * @since 2.0.0
	 * @param string                $selector     Selector with `&` for the instance.
	 * @param array<string, string> $declarations Declarations.
	 * @param string                $query        Media query, or empty.
	 * @param bool                  $important    Whether the declarations must beat inline styles.
	 * @return array<string, mixed> Rule.
	 */
	private function rule( string $selector, array $declarations, string $query, bool $important = false ): array {
		return array(
			'selector'     => $selector,
			'declarations' => $declarations,
			'query'        => $query,
			'important'    => $important,
		);
	}

	/**
	 * Builds one rule in the shape the style engine store takes.
	 *
	 * @since 2.0.0
	 * @param string                                                  $selector     Selector.
	 * @param array<string, string>|\WP_Style_Engine_CSS_Declarations $declarations Declarations.
	 * @param string                                                  $query        Media query, or empty.
	 * @return array{selector: string, declarations: array<string, string>|\WP_Style_Engine_CSS_Declarations, rules_group: string} Rule.
	 */
	private function stored_rule( string $selector, $declarations, string $query ): array {
		return array(
			'selector'     => $selector,
			'declarations' => $declarations,
			'rules_group'  => $query,
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
			if ( ( ! is_string( $value ) && ! is_int( $value ) && ! is_float( $value ) ) || '' === $value ) {
				continue;
			}

			$property = $this->get_custom_property( $name, (string) $key, $element );

			if ( '' === $property ) {
				continue;
			}

			$value = (string) $value;

			if ( str_starts_with( $value, 'var:' ) ) {
				$value = 'var(--wp--' . implode( '--', array_map( '_wp_to_kebab_case', explode( '|', substr( $value, 4 ) ) ) ) . ')';
			}

			$declarations[ $property ] = $value;
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
