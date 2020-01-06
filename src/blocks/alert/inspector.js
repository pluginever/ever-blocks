// Setup the block
import PaddingControl from "../../components/padding-control";

const {__} = wp.i18n;
const {Component} = wp.element;

// Import block components
const {
	InspectorControls,
	PanelColorSettings,
} = wp.blockEditor;

// Import Inspector components
const {
	PanelBody,
	RangeControl,
	SelectControl
} = wp.components;


export default class Inspector extends Component {
	constructor(props) {
		super(...arguments);
	}

	render() {
		const {attributes: {
			backgroundColor,
			borderColor,
			titleColor,
			descriptionColor,
			borderWidth,
			borderStyle,
			borderRadius,
		}, setAttributes} = this.props;


		return (
			<InspectorControls key="inspector">

				<PanelColorSettings
					title={__('Color Settings', 'ever-blocks')}
					initialOpen={false}
					colorSettings={[{
						value: titleColor,
						onChange: titleColor => setAttributes({titleColor}),
						label: __('Title Color', 'ever-blocks')
					},{
						value: descriptionColor,
						onChange: descriptionColor => setAttributes({descriptionColor}),
						label: __('Description Color', 'ever-blocks')
					},{
						value: backgroundColor,
						onChange: backgroundColor => setAttributes({backgroundColor}),
						label: __('Background Color', 'ever-blocks')
					}, {
						value: borderColor,
						onChange: borderColor => setAttributes({borderColor}),
						label: __('Border Color', 'ever-blocks')
					}
					]}
				>
				</PanelColorSettings>

				<PanelBody title={__('Border', 'ever-blocks')} initialOpen={false}>
					<SelectControl
						label={ __( 'Border Type', 'ever-blocks' ) }
						value={ borderStyle }
						options= {[
							{ value: 'none', label: __( 'None', 'ever-blocks' ) },
							{ value: 'solid', label: __( 'Solid', 'ever-blocks' ) },
							{ value: 'double', label: __( 'Double', 'ever-blocks' ) },
							{ value: 'dotted', label: __( 'dotted', 'ever-blocks' ) },
							{ value: 'dashed', label: __( 'dashed', 'ever-blocks' ) },
							{ value: 'groove', label: __( 'groove', 'ever-blocks' ) },
						]}
						onChange={ ( borderStyle ) => setAttributes( { borderStyle } ) }
					/>

					<RangeControl
						label={__('Border Width', 'ever-blocks')}
						value={borderWidth}
						onChange={(borderWidth) => setAttributes({borderWidth})}
						min={0}
						max={50}
						step={1}
					/>

					<RangeControl
						label={__('Border Radius', 'ever-blocks')}
						value={borderRadius}
						onChange={(borderRadius) => setAttributes({borderRadius})}
						min={0}
						max={50}
						step={1}
					/>

				</PanelBody>

				<PanelBody title={__('Margin', 'ever-blocks')} initialOpen={false}>

				</PanelBody>
				{/*<PaddingControl padding={40}*/}
				{/*				paddingEnable*/}
				{/*				onChangePadding={ (padding)=> console.log(padding)}*/}
				{/*/>*/}


			</InspectorControls>
		)
	}
}
