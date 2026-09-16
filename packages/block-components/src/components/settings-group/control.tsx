/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import {
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { ToolsPanelItem } from '../../experimental';

export type ControlSetting =
	| { type: 'text'; label: string; help?: string; isShownByDefault?: boolean }
	| {
			type: 'toggle';
			label: string;
			help?: string;
			isShownByDefault?: boolean;
	  }
	| {
			type: 'select';
			label: string;
			help?: string;
			options: Array< { label: string; value: string } >;
			isShownByDefault?: boolean;
	  }
	| {
			type: 'range';
			label: string;
			help?: string;
			min: number;
			max: number;
			step?: number;
			isShownByDefault?: boolean;
	  };

interface Props {
	name: string;
	setting: ControlSetting;
	panelId: string;
	attributes: Record< string, unknown >;
	setAttributes: ( next: Record< string, unknown > ) => void;
}

export function SettingControl( {
	name,
	setting,
	panelId,
	attributes,
	setAttributes,
}: Props ) {
	const { name: blockName } = useBlockEditContext();
	const schema = getBlockType( blockName )?.attributes?.[ name ];
	const fallback = schema?.default;
	const value = attributes[ name ];
	const coerce = ( next: unknown ) =>
		'number' === schema?.type && 'string' === typeof next && next.trim()
			? Number( next )
			: next;
	const isDefault = ( next: unknown ) =>
		'toggle' === setting.type
			? Boolean( next ) === Boolean( fallback )
			: String( coerce( next ) ?? '' ) === String( fallback ?? '' );
	// The editor never re-applies a block.json default after a write, so the
	// default is written back in full rather than as undefined.
	const set = ( next: unknown ) =>
		setAttributes( {
			[ name ]: isDefault( next ) ? fallback : coerce( next ),
		} );

	return (
		<ToolsPanelItem
			hasValue={ () => ! isDefault( value ) }
			label={ setting.label }
			panelId={ panelId }
			onDeselect={ () => set( fallback ) }
			isShownByDefault={ setting.isShownByDefault ?? true }
		>
			{ 'toggle' === setting.type && (
				<ToggleControl
					label={ setting.label }
					help={ setting.help }
					checked={ Boolean( value ) }
					onChange={ set }
				/>
			) }

			{ 'text' === setting.type && (
				<TextControl
					label={ setting.label }
					help={ setting.help }
					value={ ( value as string ) ?? '' }
					onChange={ set }
				/>
			) }

			{ 'range' === setting.type && (
				<RangeControl
					label={ setting.label }
					help={ setting.help }
					min={ setting.min }
					max={ setting.max }
					step={ setting.step }
					value={ ( value as number ) ?? fallback }
					onChange={ set }
				/>
			) }

			{ 'select' === setting.type && (
				<SelectControl
					label={ setting.label }
					help={ setting.help }
					value={ ( value as string ) ?? '' }
					options={ setting.options }
					onChange={ set }
				/>
			) }
		</ToolsPanelItem>
	);
}
