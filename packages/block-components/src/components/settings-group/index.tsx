/**
 * WordPress dependencies
 */
import { SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { LinkControl, ToolsPanelItem } from '../../experimental';
import { hasRel, NEW_TAB_REL, REL_VALUES, toggleRel } from './rel';
import type { RelValue } from './rel';
import type { LinkSetting, TagSetting } from './types';

type Attributes = Record< string, unknown >;
type SetAttributes = ( next: Record< string, unknown > ) => void;

interface ControlProps {
	name: string;
	panelId: string;
	attributes: Attributes;
	setAttributes: SetAttributes;
}

const read = ( attributes: Attributes, key: string ): string | undefined => {
	const value = attributes[ key ];

	return 'string' === typeof value && '' !== value ? value : undefined;
};

/**
 * Renders one link setting: its URL plus whichever of its options are declared.
 *
 * Each part writes to an attribute of its own rather than a nested object, which
 * is what lets a block reuse the block-library attribute names core already
 * understands — `url`, `linkTarget`, `rel`, `title`.
 *
 * @since 0.1.0
 * @param props               Control props.
 * @param props.name
 * @param props.setting
 * @param props.panelId
 * @param props.attributes
 * @param props.setAttributes
 * @return The controls.
 */
export function LinkSettingControl( {
	name,
	setting,
	panelId,
	attributes,
	setAttributes,
}: ControlProps & { setting: LinkSetting } ) {
	const url = setting.url ?? name;
	const { target, rel, title, download } = setting;
	const keys = [ url, target, rel, title, download ].filter(
		( key ): key is string => 'string' === typeof key
	);

	const value = {
		url: read( attributes, url ),
		opensInNewTab:
			false !== target && '_blank' === read( attributes, target || '' ),
		title: false !== title ? read( attributes, title || '' ) : undefined,
	};

	return (
		<>
			<ToolsPanelItem
				hasValue={ () =>
					keys.some( ( key ) => undefined !== attributes[ key ] )
				}
				label={ setting.label }
				panelId={ panelId }
				onDeselect={ () =>
					setAttributes(
						Object.fromEntries(
							keys.map( ( key ) => [ key, undefined ] )
						)
					)
				}
				isShownByDefault
			>
				<LinkControl
					value={ value }
					settings={ [] }
					hasTextControl={ false }
					onChange={ ( next: {
						url?: string;
						opensInNewTab?: boolean;
					} ) => {
						const changes: Record< string, unknown > = {
							[ url ]: next.url || undefined,
						};

						if ( false !== target && target ) {
							changes[ target ] = next.opensInNewTab
								? '_blank'
								: undefined;

							// Core adds and strips this alongside the target rather than
							// exposing it, so a link here behaves like `core/button`.
							if ( false !== rel && rel ) {
								changes[ rel ] = toggleRel(
									read( attributes, rel ),
									NEW_TAB_REL,
									Boolean( next.opensInNewTab )
								);
							}
						}

						setAttributes( changes );
					} }
					onRemove={ () =>
						setAttributes(
							Object.fromEntries(
								keys.map( ( key ) => [ key, undefined ] )
							)
						)
					}
				/>
			</ToolsPanelItem>

			{ false !== rel &&
				rel &&
				( Object.keys( REL_VALUES ) as RelValue[] ).map( ( item ) => (
					<ToolsPanelItem
						key={ item }
						hasValue={ () =>
							hasRel( read( attributes, rel ), item )
						}
						label={ REL_LABELS[ item ] }
						panelId={ panelId }
						onDeselect={ () =>
							setAttributes( {
								[ rel ]: toggleRel(
									read( attributes, rel ),
									item,
									false
								),
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ REL_LABELS[ item ] }
							checked={ hasRel( read( attributes, rel ), item ) }
							onChange={ ( on ) =>
								setAttributes( {
									[ rel ]: toggleRel(
										read( attributes, rel ),
										item,
										on
									),
								} )
							}
						/>
					</ToolsPanelItem>
				) ) }

			{ false !== download && download && (
				<ToolsPanelItem
					hasValue={ () => Boolean( attributes[ download ] ) }
					label={ __( 'Download', 'ever-blocks' ) }
					panelId={ panelId }
					onDeselect={ () =>
						setAttributes( { [ download ]: undefined } )
					}
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Download', 'ever-blocks' ) }
						checked={ Boolean( attributes[ download ] ) }
						onChange={ ( on ) =>
							setAttributes( { [ download ]: on || undefined } )
						}
					/>
				</ToolsPanelItem>
			) }
		</>
	);
}

const REL_LABELS: Record< RelValue, string > = {
	nofollow: __( 'Nofollow', 'ever-blocks' ),
	sponsored: __( 'Sponsored', 'ever-blocks' ),
	noreferrer: __( 'No referrer', 'ever-blocks' ),
};

/**
 * Renders a tag chooser bound to one attribute.
 *
 * @since 0.1.0
 * @param props               Control props.
 * @param props.name
 * @param props.setting
 * @param props.panelId
 * @param props.attributes
 * @param props.setAttributes
 * @return The control.
 */
export function TagSettingControl( {
	name,
	setting,
	panelId,
	attributes,
	setAttributes,
}: ControlProps & { setting: TagSetting } ) {
	const [ fallback ] = setting.options;

	return (
		<ToolsPanelItem
			hasValue={ () => undefined !== attributes[ name ] }
			label={ setting.label }
			panelId={ panelId }
			onDeselect={ () => setAttributes( { [ name ]: undefined } ) }
			isShownByDefault
		>
			<SelectControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ setting.label }
				value={ ( read( attributes, name ) ?? fallback ) as string }
				options={ setting.options.map( ( tag ) => ( {
					label: `<${ tag }>`,
					value: tag,
				} ) ) }
				onChange={ ( next ) => setAttributes( { [ name ]: next } ) }
			/>
		</ToolsPanelItem>
	);
}

export type { LinkSetting, TagSetting };
export { SettingControl } from './control';
export type { ControlSetting } from './control';
