/**
 * WordPress dependencies
 */
import { Button, ColorIndicator, Dropdown } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { reset } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	ColorGradientControl,
	DropdownContentWrapper,
	ToolsPanelItem,
	useMultipleOriginColorsAndGradients,
} from '../../../experimental';
import { StateToggle } from '../../state-toggle';
import './editor.scss';

interface Props {
	label: string;
	panelId: string;
	value?: string;
	onChange: ( next?: string ) => void;
	isShownByDefault?: boolean;
}

/**
 * A colour row with the state switch beside its label.
 *
 * Carries core's list and popover classes so rows join into one list and the
 * popover sizes as in core's Color panel, and opens core's own colour control.
 *
 * @since 0.1.0
 * @param props                  Component props.
 * @param props.label            Row label.
 * @param props.panelId          ToolsPanel the row belongs to.
 * @param props.value            Colour at the current state.
 * @param props.onChange         Called with the next colour, or undefined to clear.
 * @param props.isShownByDefault Whether the row shows before it has a value.
 * @return The row.
 */
export function ColorItem( {
	label,
	panelId,
	value,
	onChange,
	isShownByDefault = false,
}: Props ) {
	const settings = useMultipleOriginColorsAndGradients();
	const hasValue = () => Boolean( value );
	const clear = () => onChange( undefined );

	return (
		<ToolsPanelItem
			className="block-editor-color-gradient-item block-editor-tools-panel-color-gradient-settings__item b8-color-item"
			label={ label }
			panelId={ panelId }
			hasValue={ hasValue }
			onDeselect={ clear }
			isShownByDefault={ isShownByDefault }
		>
			<Dropdown
				popoverProps={ {
					placement: 'left-start',
					offset: 36,
					shift: true,
				} }
				className="b8-color-item__dropdown"
				renderToggle={ ( { onToggle, isOpen } ) => (
					<>
						<Button
							__next40pxDefaultSize
							className="b8-color-item__toggle"
							onClick={ onToggle }
							aria-expanded={ isOpen }
						>
							<ColorIndicator colorValue={ value } />
							<span
								className="b8-color-item__name"
								title={ label }
							>
								{ label }
							</span>
						</Button>
						{ hasValue() && (
							<Button
								size="small"
								className="b8-color-item__reset"
								icon={ reset }
								label={ __( 'Reset', 'ever-blocks' ) }
								onClick={ clear }
							/>
						) }
					</>
				) }
				renderContent={ () => (
					<DropdownContentWrapper paddingSize="none">
						<div className="block-editor-panel-color-gradient-settings__dropdown-content">
							<ColorGradientControl
								__experimentalIsRenderedInSidebar
								clearable
								enableAlpha
								colorValue={ value }
								onColorChange={ onChange }
								{ ...settings }
							/>
						</div>
					</DropdownContentWrapper>
				) }
			/>
			<StateToggle />
		</ToolsPanelItem>
	);
}
