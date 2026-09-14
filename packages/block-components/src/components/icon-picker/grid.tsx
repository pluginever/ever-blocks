/**
 * WordPress dependencies
 */
import { Button, Spinner } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Icon } from '../../hooks/use-icons';

/**
 * Icons rendered before the first scroll. A collection can hold thousands, and
 * the REST endpoint paginates the fetch but nothing limits the DOM.
 */
const CHUNK = 120;

interface Props {
	icons: Icon[];
	value?: string;
	size: number;
	isLoading: boolean;
	onSelect: ( icon: Icon ) => void;
}

/**
 * Renders icons in chunks, growing as the end of the list is reached.
 *
 * @since 0.1.0
 * @param props           Grid props.
 * @param props.icons
 * @param props.value
 * @param props.size
 * @param props.isLoading
 * @param props.onSelect
 * @return The grid.
 */
export function IconGrid( { icons, value, size, isLoading, onSelect }: Props ) {
	const [ visible, setVisible ] = useState( CHUNK );
	const sentinel = useRef< HTMLDivElement >( null );

	useEffect( () => setVisible( CHUNK ), [ icons ] );

	useEffect( () => {
		const node = sentinel.current;

		if ( ! node || visible >= icons.length ) {
			return;
		}

		const observer = new IntersectionObserver( ( entries ) => {
			if ( entries[ 0 ]?.isIntersecting ) {
				setVisible( ( shown ) => shown + CHUNK );
			}
		} );

		observer.observe( node );

		return () => observer.disconnect();
	}, [ visible, icons.length ] );

	if ( isLoading ) {
		return (
			<div className="b8-icon-picker__status">
				<Spinner />
			</div>
		);
	}

	if ( ! icons.length ) {
		return (
			<div className="b8-icon-picker__status">
				{ __( 'No icons found.', 'ever-blocks' ) }
			</div>
		);
	}

	return (
		<div
			className="b8-icon-picker__grid"
			style={ { '--b8-icon-size': `${ size }px` } as React.CSSProperties }
		>
			{ icons.slice( 0, visible ).map( ( icon ) => (
				<Button
					key={ icon.name }
					className="b8-icon-picker__icon"
					label={ icon.label }
					showTooltip
					isPressed={ icon.name === value }
					onClick={ () => onSelect( icon ) }
				>
					<span
						className="b8-icon-picker__icon-svg"
						// The markup comes from the icons endpoint, which serves
						// only icons registered in PHP.
						dangerouslySetInnerHTML={ { __html: icon.content } }
					/>
				</Button>
			) ) }
			{ visible < icons.length && <div ref={ sentinel } /> }
		</div>
	);
}
