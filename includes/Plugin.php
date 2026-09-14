<?php

namespace EverBlocks;

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin class.
 *
 * @since   2.0.0
 * @package EverBlocks
 * @property-read string          $file    Plugin file path.
 * @property-read string          $version Plugin version.
 * @property-read Services\Styler $styler Styler.
 */
final class Plugin {

	/**
	 * Plugin instance.
	 *
	 * @since 2.0.0
	 * @var Plugin|null
	 */
	protected static ?Plugin $instance = null;

	/**
	 * Container bindings.
	 *
	 * @since 2.0.0
	 * @var array<string, \Closure>
	 */
	protected array $container = array();

	/**
	 * Components booted on load.
	 *
	 * @since 2.0.0
	 * @var array<int, string>
	 */
	protected array $components = array(
		Assets::class,
		Blocks\Blocks::class,
		Styles::class,
		Supports\Supports::class,
		Icons::class,
	);

	/**
	 * Creates the plugin instance.
	 *
	 * @since 2.0.0
	 * @param string $file Main plugin file.
	 * @param string $version Plugin version.
	 * @return self Plugin instance.
	 */
	public static function create( string $file, string $version = '2.0.0' ): self {
		if ( null === self::$instance ) {
			self::$instance = new self();

			self::$instance->set( 'file', $file );
			self::$instance->set( 'version', $version );
			self::$instance->set( 'styler', fn() => new Services\Styler() );
		}

		return self::$instance;
	}

	/**
	 * Returns the plugin instance.
	 *
	 * @since 2.0.0
	 * @return self Plugin instance.
	 */
	public static function instance(): self {
		if ( ! self::$instance instanceof Plugin ) {
			wp_die( 'Ever Blocks is not initialized.' );
		}

		return self::$instance;
	}

	/**
	 * Returns a container value.
	 *
	 * @since 2.0.0
	 * @param string $key Property name.
	 * @return mixed Container value, or null when the key is unknown.
	 */
	public function __get( string $key ) {
		return $this->get( $key );
	}

	/**
	 * Sets a container value.
	 *
	 * @since 2.0.0
	 * @param string $key Value identifier or class name.
	 * @param mixed  $value Value or closure.
	 * @return void
	 */
	public function set( string $key, $value ): void {
		$this->container[ $key ] = $value instanceof \Closure ? $value : fn() => $value;
	}

	/**
	 * Returns a container value, resolving plugin classes on demand and once.
	 *
	 * @since 2.0.0
	 * @param string $key Value identifier or class name.
	 * @return mixed Container value, or null when the key is unknown.
	 */
	public function get( string $key ) {
		if ( ! isset( $this->container[ $key ] ) && 0 === strpos( $key, __NAMESPACE__ . '\\' ) && class_exists( $key ) ) {
			$this->set( $key, fn() => new $key() );
		}

		if ( ! isset( $this->container[ $key ] ) ) {
			return null;
		}

		$value = $this->container[ $key ]();

		$this->container[ $key ] = fn() => $value;

		return $value;
	}

	/**
	 * Defines constants and boots components.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function bootstrap(): void {
		define( 'EVER_BLOCKS_FILE', $this->get( 'file' ) );
		define( 'EVER_BLOCKS_VERSION', $this->get( 'version' ) );
		define( 'EVER_BLOCKS_DIR', plugin_dir_path( EVER_BLOCKS_FILE ) );
		define( 'EVER_BLOCKS_URL', plugin_dir_url( EVER_BLOCKS_FILE ) );

		foreach ( $this->components as $component ) {
			$this->get( $component )->register();
		}
	}
}
