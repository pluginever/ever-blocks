import classnames from "classnames";
import {RichText} from "@wordpress/block-editor";

const save = ({attributes}) => {
	const {
		title,
		content,
		imgUrl
	} = attributes;

	return (
		<div>
			{ imgUrl ?  <img className="wp-block-ever-blocks-testimonial__avatar" src={imgUrl} alt="avatar"/> : null}

			{title && (<RichText.Content
				tagName="h3"
				value={title}
				className="wp-block-ever-blocks-card__title"
			/>)}

			{content && (<RichText.Content
				tagName="div"
				value={content}
				className="wp-block-ever-blocks-card__content"
			/>)}

		</div>
	);
};

export default save;
