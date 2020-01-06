import classnames from "classnames";
import {RichText} from "@wordpress/block-editor";

const save = ({attributes}) => {
	const {
		heading,
		content,
		imgUrl,
		name,
		position,
		backgroundColor,
		textColor,
		textAlign
	} = attributes;

	const classes = classnames({
		[`has-text-align-${textAlign}`]: textAlign,
	});
	console.log(imgUrl);
	return (
		<div
			style={{
				color: textColor ? textColor : '#32373c',
				backgroundColor: backgroundColor ? backgroundColor : '#f2f2f2',
			}}
			className={classes}
		>
			{!RichText.isEmpty(heading) && <div className="wp-block-ever-blocks-testimonial__header"><RichText.Content
				tagName="span"
				className="wp-block-ever-blocks-testimonial__heading"
				value={heading}
			/></div>}

			{content && (<RichText.Content
				className="wp-block-ever-blocks-testimonial__content"
				tagName="div"
				value={content}
			/>)}

			<div className="wp-block-ever-blocks-testimonial__footer">

				<div className="wp-block-ever-blocks-testimonial__footer-left">
					<div className={'wp-block-ever-blocks-testimonial__avatar-wrap'}>
					{!!imgUrl ?  <img className="wp-block-ever-blocks-testimonial__avatar" src={imgUrl} alt="avatar"/> : null}
					</div>
				</div>

				<div className="wp-block-ever-blocks-testimonial__footer-right">
					{!RichText.isEmpty(name) && <RichText.Content
						tagName="span"
						value={name}
						className="wp-block-ever-blocks-testimonial__name"
					/>}

					{!RichText.isEmpty(position) && <RichText.Content
						tagName="small"
						value={position}
						className="wp-block-ever-blocks-testimonial__position"
					/>}

				</div>
			</div>

		</div>
	);
};

export default save;
