/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import type { ReactElement } from 'react';

/**
 * Internal dependencies
 */
import { ToolsPanelItem } from '../../experimental';
import './editor.scss';

export interface LayoutOption {
	value: string;
	label: string;
	/** A drawn SVG, 48×48 grid, as core's block variation icons. */
	icon: ReactElement;
}

interface Props {
	label: string;
	value: string | undefined;
	options: LayoutOption[];
	onChange: ( value: string ) => void;
	panelId: string;
	/** The option that counts as unset for Reset all. */
	defaultValue?: string;
	isShownByDefault?: boolean;
}

/**
 * A row of drawn layouts to choose from — the block variation picker, inside
 * the inspector.
 *
 * @since 0.1.0
 * @param props                  Component props.
 * @param props.label            Control label.
 * @param props.value            Selected layout.
 * @param props.options          Layouts, each with a drawn icon.
 * @param props.onChange         Receives the chosen value.
 * @param props.panelId          ToolsPanel the item belongs to.
 * @param props.defaultValue     Value that counts as unset.
 * @param props.isShownByDefault Whether the item shows before it has a value.
 * @return The control.
 */
export function LayoutControl( {
	label,
	value,
	options,
	onChange,
	panelId,
	defaultValue,
	isShownByDefault = true,
}: Props ) {
	return (
		<ToolsPanelItem
			hasValue={ () => undefined !== value && value !== defaultValue }
			label={ label }
			panelId={ panelId }
			isShownByDefault={ isShownByDefault }
			onDeselect={ () => onChange( defaultValue ?? options[ 0 ].value ) }
		>
			<fieldset className="b8-layout-control">
				<legend className="b8-layout-control__label">{ label }</legend>
				<div
					className="b8-layout-control__options"
					role="radiogroup"
					aria-label={ label }
				>
					{ options.map( ( option ) => (
						<div
							key={ option.value }
							className="b8-layout-control__option"
						>
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								role="radio"
								aria-checked={ option.value === value }
								icon={ option.icon }
								iconSize={ 48 }
								label={ option.label }
								showTooltip={ false }
								isPressed={ option.value === value }
								className="b8-layout-control__button"
								onClick={ () => onChange( option.value ) }
							/>
							<span
								className="b8-layout-control__name"
								aria-hidden="true"
							>
								{ option.label }
							</span>
						</div>
					) ) }
				</div>
			</fieldset>
		</ToolsPanelItem>
	);
}
