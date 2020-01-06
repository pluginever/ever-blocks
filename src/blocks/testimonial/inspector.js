// Setup the block
const {__} = wp.i18n;
const {Component} = wp.element;

// Import block components
const {
	InspectorControls,
	PanelColorSettings
} = wp.blockEditor;

// Import Inspector components
const {
	PanelBody,
	RangeControl,
	SelectControl
} = wp.components;

import PaddingControl from "../../components/padding-control";

export default class Inspector extends Component {
	constructor(props) {
		super(...arguments);
	}

	render() {
		const {attributes: {backgroundColor, textColor}, setAttributes} = this.props;


		return (
			<InspectorControls key="inspector">
				<PanelColorSettings
					title={__('Background Color', 'ever-blocks')}
					initialOpen={false}
					colorSettings={[{
						value: backgroundColor,
						onChange: backgroundColor => setAttributes({backgroundColor}),
						label: __('Background Color', 'ever-blocks')
					}]}
				>
				</PanelColorSettings>

				<PanelColorSettings
					title={__('Text Color', 'ever-blocks')}
					initialOpen={false}
					colorSettings={[{
						value: textColor,
						onChange: textColor => setAttributes({textColor}),
						label: __('Text Color', 'ever-blocks')
					}]}
				>
				</PanelColorSettings>

				<PaddingControl padding={40}
								paddingEnable
								onChangePadding={ (padding)=> console.log(padding)}
								/>


			</InspectorControls>
		)
	}
}
