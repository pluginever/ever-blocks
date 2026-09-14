/**
 * WordPress dependencies
 */
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
	const value = attributes[ name ];
	const set = ( next: unknown ) => setAttributes( { [ name ]: next } );

	return (
		<ToolsPanelItem
			hasValue={ () => undefined !== value }
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
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }

			{ 'text' === setting.type && (
				<TextControl
					label={ setting.label }
					help={ setting.help }
					value={ ( value as string ) ?? '' }
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }

			{ 'select' === setting.type && (
				<SelectControl
					label={ setting.label }
					value={ ( value as string ) ?? '' }
					options={ setting.options }
					onChange={ ( next ) => set( next || undefined ) }
				/>
			) }
		</ToolsPanelItem>
	);
}
