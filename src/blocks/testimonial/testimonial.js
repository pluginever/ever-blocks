const {
	Component,
	Fragment
} = wp.element;

// Import block dependencies and components
import classnames from 'classnames';


/**
 * Create a Testimonial wrapper Component
 */
export default class Testimonial extends Component {
	constructor( props ) {
		super( ...arguments );
	}

	render() {
		const {
			heading,
			content,
			imgUrl,
			name,
			position,
			backgroundColor,
			textColor,
			textAlign
		} = this.props.attributes;

		return (
			<div>
				{ this.props.children }
			</div>
		);
	}
}
