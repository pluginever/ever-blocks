<?php
//phpcs:ignoreFile

namespace EverBlocks\Tests;

/**
 * The editor's style engine and the server's agree.
 *
 * Both halves of the plugin compile the same style object: `compileCSS()` from
 * `@wordpress/style-engine` in the editor, `wp_style_engine_get_styles()` here.
 * The fixtures are shared with the JS suite, so a change to either engine fails
 * loudly rather than letting the front end drift from the canvas.
 */
class ParityTest extends TestCase {

	/**
	 * Fixtures the server compiles differently, with the reason.
	 *
	 * `safecss_filter_attr()` allows a fixed list of CSS functions
	 * (`kses.php:3018-3032`) that omits `rgb`/`rgba`/`color-mix`, and only
	 * strips them for gradients. The editor applies no such filter, so an alpha
	 * colour renders in the canvas and is dropped on the front end. Listed here
	 * so the behaviour is visible and a core fix makes this suite fail rather
	 * than pass silently.
	 *
	 * @var array<string, string>
	 */
	private const KNOWN_DIVERGENCES = array(
		'alpha-color-rgba'  => 'rgba() is not an allowed CSS function outside gradients',
		'alpha-shadow-rgba' => 'rgba() is not an allowed CSS function outside gradients',
		'alpha-color-mix'   => 'color-mix() is not an allowed CSS function',
	);

	/**
	 * Returns the shared fixtures.
	 *
	 * @return array<string, array{style: array, expected: array<int, string>}>
	 */
	private function fixtures(): array {
		$path = dirname( __DIR__ ) . '/data/styles.json';

		$this->assertFileExists( $path, 'Run `pnpm fixtures` before this suite.' );

		return json_decode( (string) file_get_contents( $path ), true );
	}

	/**
	 * Both languages derive the same style namespace from the same block name.
	 *
	 * @return void
	 */
	public function test_style_namespaces_match_the_editor(): void {
		$path = dirname( __DIR__ ) . '/data/namespaces.json';

		$this->assertFileExists( $path );

		$cases = json_decode( (string) file_get_contents( $path ), true );

		$this->assertNotEmpty( $cases );

		foreach ( $cases as $case ) {
			$this->assertSame(
				$case['expected'],
				( new \EverBlocks\Services\Styler() )->get_namespace( $case['block'] ),
				sprintf( 'Deriving the namespace for %s.', $case['block'] )
			);
		}
	}

	/**
	 * Both languages derive the same custom property from the same value name.
	 *
	 * @return void
	 */
	public function test_custom_property_names_match_the_editor(): void {
		$path = dirname( __DIR__ ) . '/data/properties.json';

		$this->assertFileExists( $path );

		$cases = json_decode( (string) file_get_contents( $path ), true );

		$this->assertNotEmpty( $cases );

		foreach ( $cases as $case ) {
			$this->assertSame(
				$case['expected'],
				( new \EverBlocks\Services\Styler() )->get_custom_property( $case['block'], $case['key'] ),
				sprintf( 'Deriving "%s" for %s.', $case['key'], $case['block'] )
			);
		}
	}

	/**
	 * Reduces compiled CSS to a sorted declaration list.
	 *
	 * Whitespace and declaration order differ between the two engines and are
	 * meaningless to CSS, so both sides are normalised the same way.
	 *
	 * @param string $css Compiled CSS.
	 * @return array<int, string> Declarations.
	 */
	private function declarations( string $css ): array {
		$open = strpos( $css, '{' );

		if ( false === $open ) {
			return array();
		}

		$body         = substr( $css, $open + 1, strrpos( $css, '}' ) - $open - 1 );
		$declarations = array();

		foreach ( explode( ';', $body ) as $declaration ) {
			$declaration = trim( (string) preg_replace( '/\s+/', ' ', $declaration ) );

			if ( '' === $declaration ) {
				continue;
			}

			// Split on the first colon only: values carry colons of their own.
			$parts       = explode( ':', $declaration, 2 );
			$declaration = 2 === count( $parts )
				? trim( $parts[0] ) . ':' . trim( $parts[1] )
				: $declaration;

			// Spaces immediately inside parentheses are insignificant in CSS.
			$declarations[] = (string) preg_replace( array( '/\( /', '/ \)/' ), array( '(', ')' ), $declaration );
		}

		sort( $declarations );

		return $declarations;
	}

	/**
	 * Every fixture compiles to the declarations the editor produces.
	 *
	 * @return void
	 */
	public function test_every_fixture_matches_the_editor(): void {
		foreach ( $this->fixtures() as $name => $fixture ) {
			if ( isset( self::KNOWN_DIVERGENCES[ $name ] ) ) {
				continue;
			}

			$compiled = wp_style_engine_get_styles( $fixture['style'], array( 'selector' => '.eb-fixture' ) );

			$this->assertSame(
				$fixture['expected'],
				$this->declarations( $compiled['css'] ?? '' ),
				sprintf( 'Fixture "%s" diverged between the editor and the server.', $name )
			);
		}
	}

	/**
	 * Each recorded divergence still diverges, and still for the stated reason.
	 *
	 * @return void
	 */
	public function test_known_divergences_still_diverge(): void {
		$fixtures = $this->fixtures();

		foreach ( self::KNOWN_DIVERGENCES as $name => $reason ) {
			$this->assertArrayHasKey( $name, $fixtures, sprintf( 'Fixture "%s" is missing.', $name ) );
			$this->assertNotEmpty( $fixtures[ $name ]['expected'], sprintf( 'The editor no longer emits "%s".', $name ) );

			$compiled = wp_style_engine_get_styles( $fixtures[ $name ]['style'], array( 'selector' => '.eb-fixture' ) );

			$this->assertSame(
				array(),
				$this->declarations( $compiled['css'] ?? '' ),
				sprintf( 'Core now compiles "%s" on the server (%s). Remove it from KNOWN_DIVERGENCES.', $name, $reason )
			);
		}
	}

	/**
	 * Gradients keep their alpha, which is what makes the omission a carve-out
	 * rather than a blanket rule.
	 *
	 * @return void
	 */
	public function test_gradients_are_exempt_from_the_function_allow_list(): void {
		$compiled = wp_style_engine_get_styles(
			array( 'color' => array( 'gradient' => 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, #fff 100%)' ) ),
			array( 'selector' => '.eb-fixture' )
		);

		$this->assertStringContainsString( 'rgba(0,0,0,0.2)', $compiled['css'] ?? '' );
	}

	/**
	 * A partially-dropped declaration set is the dangerous shape: the border
	 * survives without the colour it was given.
	 *
	 * @return void
	 */
	public function test_a_dropped_value_can_leave_a_partial_rule(): void {
		$compiled = wp_style_engine_get_styles(
			array( 'border' => array( 'color' => 'rgba(1,2,3,0.5)', 'width' => '1px', 'style' => 'solid' ) ),
			array( 'selector' => '.eb-fixture' )
		);

		$css = $compiled['css'] ?? '';

		$this->assertStringContainsString( 'border-width:1px', $css );
		$this->assertStringNotContainsString( 'border-color', $css );
	}

	/**
	 * The fixtures exercise every feature the residual pipeline can carry.
	 *
	 * @return void
	 */
	public function test_fixtures_cover_the_supported_surface(): void {
		$fixtures = $this->fixtures();

		foreach ( array( 'spacing', 'color', 'border', 'shadow', 'dimensions', 'typography', 'background' ) as $feature ) {
			$found = false;

			foreach ( $fixtures as $fixture ) {
				if ( isset( $fixture['style'][ $feature ] ) ) {
					$found = true;
					break;
				}
			}

			$this->assertTrue( $found, sprintf( 'No fixture covers "%s".', $feature ) );
		}
	}

	/**
	 * Preset references resolve to custom properties, not preset classnames.
	 *
	 * A generated rule cannot carry a `has-x-color` class, so the engine has to
	 * emit the variable instead.
	 *
	 * @return void
	 */
	public function test_presets_resolve_to_custom_properties(): void {
		foreach ( $this->fixtures() as $name => $fixture ) {
			$encoded = wp_json_encode( $fixture['style'] );

			if ( ! is_string( $encoded ) || ! str_contains( $encoded, 'var:preset|' ) ) {
				continue;
			}

			$compiled = wp_style_engine_get_styles( $fixture['style'], array( 'selector' => '.eb-fixture' ) );

			$this->assertStringContainsString( 'var(--wp--preset--', $compiled['css'] ?? '', $name );
			$this->assertStringNotContainsString( 'var:preset|', $compiled['css'] ?? '', $name );
		}
	}

	/**
	 * An empty style object produces nothing at all.
	 *
	 * @return void
	 */
	public function test_empty_style_produces_nothing(): void {
		$compiled = wp_style_engine_get_styles( array(), array( 'selector' => '.eb-fixture' ) );

		$this->assertSame( '', $compiled['css'] ?? '' );
	}

	/**
	 * Unknown properties are dropped rather than emitted raw.
	 *
	 * @return void
	 */
	public function test_unknown_properties_are_dropped(): void {
		$compiled = wp_style_engine_get_styles(
			array( 'nonsense' => array( 'whatever' => 'red' ) ),
			array( 'selector' => '.eb-fixture' )
		);

		$this->assertSame( '', $compiled['css'] ?? '' );
	}

	/**
	 * Normalises compiled rules so order, which CSS ignores, cannot fail the comparison.
	 *
	 * @param array<int, array<string, mixed>> $rules Rules.
	 * @return array<int, array<string, mixed>> Sorted rules with sorted declarations.
	 */
	private function normalize( array $rules ): array {
		$normalized = array();

		foreach ( $rules as $rule ) {
			$declarations = (array) $rule['declarations'];
			ksort( $declarations );

			$normalized[] = array(
				'selector'     => (string) $rule['selector'],
				'declarations' => $declarations,
				'query'        => (string) $rule['query'],
				'important'    => (bool) $rule['important'],
			);
		}

		usort(
			$normalized,
			static fn( array $a, array $b ): int => strcmp(
				$a['query'] . '|' . $a['selector'] . '|' . (int) $a['important'],
				$b['query'] . '|' . $b['selector'] . '|' . (int) $b['important']
			)
		);

		return $normalized;
	}

	/**
	 * The styler produces the rules the shared oracle records, case by case.
	 *
	 * The same oracle drives the editor’s compiler in `rules.test.js`, so both
	 * halves are held to one hand-written expectation rather than to each other.
	 *
	 * @return void
	 */
	public function test_compiled_rules_match_the_oracle(): void {
		$path = dirname( __DIR__ ) . '/data/rules.json';

		$this->assertFileExists( $path );

		$oracle     = json_decode( (string) file_get_contents( $path ), true );
		$block_type = new \WP_Block_Type( $oracle['block']['name'], $oracle['block'] );

		$this->assertGreaterThan( 15, count( $oracle['cases'] ) );

		foreach ( $oracle['cases'] as $name => $case ) {
			$this->assertSame(
				$this->normalize( $case['rules'] ),
				$this->normalize( ( new \EverBlocks\Services\Styler() )->compile( $case['style'], $block_type ) ),
				sprintf( 'Compiling the "%s" case.', $name )
			);
		}
	}
}
