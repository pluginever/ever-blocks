/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ToolsPanelItem } from '../../experimental';
import { IconPicker } from './index';

interface Props {
	label: string;
	value?: string;
	panelId: string;
	onChange: ( name: string | undefined ) => void;
	isShownByDefault?: boolean;
}

/**
 * An inspector row that opens the icon library.
 *
 * @since 0.1.0
 * @param props                  Control props.
 * @param props.label            Row label.
 * @param props.value            Name of the chosen icon.
 * @param props.panelId          ToolsPanel the row belongs to.
 * @param props.onChange         Receives the chosen name, or undefined to clear.
 * @param props.isShownByDefault Whether the row shows before it has a value.
 * @return The control.
 */
export function IconPickerControl( {
	label,
	value,
	panelId,
	onChange,
	isShownByDefault = true,
}: Props ) {
	return (
		<ToolsPanelItem
			hasValue={ () => undefined !== value && '' !== value }
			label={ label }
			panelId={ panelId }
			onDeselect={ () => onChange( undefined ) }
			isShownByDefault={ isShownByDefault }
		>
			<IconPicker
				value={ value }
				onSelect={ onChange }
				render={ ( { open, icon } ) => (
					<Button
						__next40pxDefaultSize
						className="b8-icon-picker-control"
						onClick={ open }
						aria-haspopup="dialog"
					>
						<span className="b8-icon-picker-control__label">
							{ label }
						</span>
						<span className="b8-icon-picker-control__value">
							{ icon ? (
								<>
									<span
										className="b8-icon-picker-control__preview"
										dangerouslySetInnerHTML={ {
											__html: icon.content,
										} }
									/>
									{ icon.label }
								</>
							) : (
								__( 'Select icon', 'ever-blocks' )
							) }
						</span>
					</Button>
				) }
			/>
		</ToolsPanelItem>
	);
}
