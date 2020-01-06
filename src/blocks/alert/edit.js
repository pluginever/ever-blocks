/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {Component, Fragment} from '@wordpress/element';
import {compose} from '@wordpress/compose';
import {RichText} from '@wordpress/block-editor';
import classnames from 'classnames';
import Inspector from "./inspector";
import Controls from "./controls";

class Edit extends Component {
	render() {
		const {
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;

		const {
			textAlign,
			title,
			value,
			backgroundColor,
			titleColor,
			descriptionColor,
			borderColor,
			borderWidth,
			borderStyle,
			borderRadius,
		} = attributes;

		return (

			<Fragment>
				{isSelected && (
					<Controls
						{...this.props}
					/>
				)}
				<Inspector
					{...{setAttributes, ...this.props}}
				/>

				<div
					className={classnames(
						className, {
							[`has-text-align-${textAlign}`]: textAlign,
						}
					)}
					style={{
						backgroundColor: backgroundColor ? backgroundColor : undefined,
						borderWidth: borderWidth ? borderWidth : 1,
						borderStyle: borderStyle ? borderStyle : undefined,
						borderRadius: borderRadius ? borderRadius : undefined,
						borderColor: borderColor ? borderColor : undefined,
					}}
				>
					{(!RichText.isEmpty(title) || isSelected) && (
						<RichText
							placeholder={__('Alert Title…', 'ever-blocks')}
							value={title}
							className="wp-block-ever-blocks-alert__title"
							onChange={(value) => setAttributes({title: value})}
							style={{
								color: titleColor
							}}
							keepPlaceholderOnFocus
						/>
					)}

					<RichText
						placeholder={__('Alert message content...', 'ever-blocks')}
						value={value}
						className="wp-block-ever-blocks-alert__text"
						onChange={(value) => setAttributes({value: value})}
						style={{
							color: descriptionColor
						}}
						keepPlaceholderOnFocus
					/>

				</div>

			</Fragment>
		)
	}
}

export default Edit;
