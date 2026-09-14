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
 * A convenience preset over `IconPicker` for the common case. Use `IconPicker`
 * directly wherever the trigger needs to be something else.
 *
 * @since 0.1.0
 * @param props                  Control props.
 * @param props.label
 * @param props.value
 * @param props.panelId
 * @param props.onChange
 * @param props.isShownByDefault
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
					<div className="b8-icon-picker-control">
						<Button
							className="b8-icon-picker-control__preview"
							variant="secondary"
							onClick={ open }
							aria-haspopup="dialog"
						>
							{ icon ? (
								<span
									className="b8-icon-picker__icon-svg"
									dangerouslySetInnerHTML={ {
										__html: icon.content,
									} }
								/>
							) : (
								__( 'Select icon', 'ever-blocks' )
							) }
						</Button>
						{ value && (
							<Button
								variant="tertiary"
								isDestructive
								size="small"
								onClick={ () => onChange( undefined ) }
							>
								{ __( 'Remove', 'ever-blocks' ) }
							</Button>
						) }
					</div>
				) }
			/>
		</ToolsPanelItem>
	);
}
