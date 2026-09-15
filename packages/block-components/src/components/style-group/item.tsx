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
			isShownByDefault={ isShownByDefault }
		>
			{ children }
		</ToolsPanelItem>
	);
}
