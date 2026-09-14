/**
 * WordPress dependencies
 */
import type { Pseudo } from '../../types';

export type { Pseudo };

export interface LinkSetting {
	/** Control label. */
	label: string;
	/** Attribute holding the URL. Defaults to the declaration's own key. */
	url?: string;
	/** Attribute holding `_blank`, or false to omit the control. */
	target?: string | false;
	/** Attribute holding the `rel` value, or false to omit both toggles. */
	rel?: string | false;
	/** Attribute holding the link title, or false to omit the control. */
	title?: string | false;
	/** Attribute holding the download flag, or false to omit the control. */
	download?: string | false;
}

export interface TagSetting {
	/** Control label. */
	label: string;
	/** Tags offered, in order. The first is the default. */
	options: string[];
}
