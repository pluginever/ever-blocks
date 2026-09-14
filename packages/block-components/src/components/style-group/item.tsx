/**
 * Internal dependencies
 */
import { ToolsPanelItem } from '../../experimental';

interface Props {
	label: string;
	panelId: string;
	value: unknown;
	onReset: () => void;
	isShownByDefault?: boolean;
	children: React.ReactNode;
}

/**
 * A ToolsPanel item that derives its own set state and reset behaviour.
 *
 * Rendered without a surrounding ToolsPanel so it slot-fills into the core
 * panel its `InspectorControls` group belongs to, and joins that panel's
 * "Reset all".
 *
 * @since 0.1.0
 * @param props                  Item props.
 * @param props.label
 * @param props.panelId
 * @param props.value
 * @param props.onReset
 * @param props.isShownByDefault
 * @param props.children
 * @return The item.
 */
export function Item( {
	label,
	panelId,
	value,
	onReset,
	isShownByDefault = false,
	children,
}: Props ) {
	const hasValue = () =>
		undefined !== value && '' !== value && null !== value;

	return (
		<ToolsPanelItem
			label={ label }
			panelId={ panelId }
			hasValue={ hasValue }
			onDeselect={ onReset }
			resetAllFilter={ onReset }
			isShownByDefault={ isShownByDefault }
		>
			{ children }
		</ToolsPanelItem>
	);
}
