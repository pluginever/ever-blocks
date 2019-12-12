/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

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
		} = attributes;

		return(
			<Fragment>
				{ isSelected && (
					<Controls
						{ ...this.props }
					/>
				) }
				<div
					className={ classnames(
						className, {
							[ `has-text-align-${ textAlign }` ]: textAlign,
						}
					) }
					>
					{ ( ! RichText.isEmpty( title ) || isSelected ) && (
						<RichText
							placeholder={ __( 'Alert Title…', 'ever-blocks' ) }
							value={ title }
							className="wp-block-ever-blocks-alert__title"
							onChange={ ( value ) => setAttributes( { title: value } ) }
							keepPlaceholderOnFocus
						/>
					) }

					<RichText
						placeholder={ __( 'Alert message content...', 'ever-blocks' ) }
						value={ value }
						className="wp-block-ever-blocks-alert__text"
						onChange={ ( value ) => setAttributes( { value: value } ) }
						keepPlaceholderOnFocus
					/>

				</div>

			</Fragment>
		)
    }
}

export default Edit;
