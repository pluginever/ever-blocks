import classnames from "classnames";
import {RichText} from "@wordpress/block-editor";

const save = ( { attributes } ) => {
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

	const classes = classnames( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<div
			className={ classes }
			style={{
				backgroundColor: backgroundColor ? backgroundColor : undefined,
				borderWidth: borderWidth ? borderWidth : 1,
				borderStyle: borderStyle ? borderStyle : undefined,
				borderRadius: borderRadius ? borderRadius : undefined,
				borderColor: borderColor ? borderColor : undefined,
			}}

		>
			{ ! RichText.isEmpty( title ) &&
			<RichText.Content
				tagName="p"
				className="wp-block-ever-blocks-alert__title"
				value={ title }
				style={{
					color: titleColor
				}}
			/>
			}
			{ ! RichText.isEmpty( value ) &&
			<RichText.Content
				tagName="p"
				className="wp-block-ever-blocks-alert__text"
				value={ value }
				style={{
					color: descriptionColor
				}}
			/>
			}
		</div>
	);
};

export default save;
