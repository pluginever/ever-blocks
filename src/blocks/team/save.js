/**
 * Internal dependencies
 */

import classnames from "classnames";

/**
 * WordPress dependencies
 */
const {Component} = wp.element;
const {
	RichText
} = wp.editor;

export default class Save extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			image,
			name,
			position,
			content,
			facebook,
			twitter,
			instagram,
			pinterest,
			linkedin,
			youtube,
			web,
			backgroundColor,
			textColor,
			className
		} = this.props.attributes;

		const classes = classnames( className,
			'wp-block-ever-blocks-team', {} );

		const style = {

		};

		return(
			<div className={classes} style={{style}}>

			</div>
		)
	}
}

