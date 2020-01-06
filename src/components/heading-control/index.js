/**
 * External dependencies
 */
import { range } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Toolbar } from '@wordpress/components';


export  default class HeadingControl extends Component {
	createHeadingControl( targetLevel, selectedLevel, onChange ) {
		return {
			icon: 'heading',
			title: sprintf(
				__( 'Heading %d', 'ever-blocks' ),
				targetLevel
			),
			isActive: targetLevel === selectedLevel,
			onClick: () => onChange( targetLevel ),
			subscript: String( targetLevel ),
		};
	}


	render() {
		const { minLevel, maxLevel, selectedLevel, onChange } = this.props;
		return (
			<Toolbar
				controls={ range( minLevel, maxLevel ).map( index =>
					this.createHeadingControl( index, selectedLevel, onChange )
				) }
			/>
		);
	}
}
