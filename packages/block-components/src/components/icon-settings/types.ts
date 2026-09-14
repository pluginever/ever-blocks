/**
 * Internal dependencies
 */
import type { ControlSetting } from '../settings-group/control';

/**
 * A built-in control: true for the default attribute, a string to bind it to
 * another attribute, false to leave it out.
 *
 * @since 0.1.0
 */
export type IconControlSetting = string | boolean;

export interface IconSetting {
	/** Control label. */
	label: string;
	/** Icon size. Defaults to `iconSize`. */
	size?: IconControlSetting;
	/** Rotation in degrees. Defaults to `rotation`, as `core/icon` names it. */
	rotation?: IconControlSetting;
	/** Horizontal flip. Defaults to `flipHorizontal`. */
	flipHorizontal?: IconControlSetting;
	/** Vertical flip. Defaults to `flipVertical`. */
	flipVertical?: IconControlSetting;
	/** Accessible label. Defaults to `iconLabel`. */
	ariaLabel?: IconControlSetting;
	/** Controls this block needs that the built-ins do not cover. */
	extras?: Record< string, ControlSetting >;
}

export type { ControlSetting };
