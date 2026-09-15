/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import {
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
			options: Array< { label: string; value: string } >;
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
	const fallback = getBlockType( blockName )?.attributes?.[ name ]?.default;
	const value = attributes[ name ];
	const isDefault = ( next: unknown ) =>
		'toggle' === setting.type
			? Boolean( next ) === Boolean( fallback )
			: String( next ?? '' ) === String( fallback ?? '' );
	const set = ( next: unknown ) =>
		setAttributes( { [ name ]: isDefault( next ) ? undefined : next } );

	return (
		<ToolsPanelItem
			hasValue={ () => ! isDefault( value ) }
			label={ setting.label }
			panelId={ panelId }
			onDeselect={ () => set( undefined ) }
			isShownByDefault={ setting.isShownByDefault ?? false }
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

			{ 'select' === setting.type && (
				<SelectControl
					label={ setting.label }
					value={ ( value as string ) ?? '' }
					options={ setting.options }
					onChange={ set }
				/>
			) }
		</ToolsPanelItem>
	);
}
