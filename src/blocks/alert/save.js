import classnames from "classnames";
import {RichText} from "@wordpress/block-editor";

const save = ( { attributes } ) => {
	const {
		textAlign,
		title,
		value,
	} = attributes;

	const classes = classnames( {
		[ `has-text-align-${ textAlign }` ]: textAlign,
	} );

	return (
		<div
			className={ classes }
		>
			{ ! RichText.isEmpty( title ) &&
			<RichText.Content
				tagName="p"
				className="wp-block-ever-blocks-alert__title"
				value={ title }
			/>
			}
			{ ! RichText.isEmpty( value ) &&
			<RichText.Content
				tagName="p"
				className="wp-block-ever-blocks-alert__text"
				value={ value }
			/>
			}
		</div>
	);
};

export default save;
