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
			authorName,
			authorTitle,
			authorContent,
			authorImgURL,
			authorImgAlt,
			authorImgID,
			authorTextColor
		} = this.props.attributes;

		return (
			<div
				className={classnames(
					'ab-author-column ab-author-content-wrap'
				)}
			>
				{authorName && (
					<RichText.Content
						tagName="h2"
						className="ab-author-name"
						style={{
							color: authorTextColor
						}}
						value={authorName}
					/>
				)}

				{authorTitle && (
					<RichText.Content
						tagName="p"
						className="ab-author-title"
						style={{
							color: authorTextColor
						}}
						value={authorTitle}
					/>
				)}

				{authorContent && (
					<RichText.Content
						tagName="div"
						className="ab-author-text"
						value={authorContent}
					/>
				)}
			</div>
		);
	}
}

