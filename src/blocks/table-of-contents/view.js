import { getContext, getElement, store } from '@wordpress/interactivity';

const PROPERTY = '--ever-blocks-table-of-contents-scroll-offset';

const pinnedHeight = () => {
	const pinned = [];

	for ( const element of document.querySelectorAll(
		'#wpadminbar, header, .is-position-sticky'
	) ) {
		const { position } = window.getComputedStyle( element );

		if (
			( 'fixed' === position || 'sticky' === position ) &&
			! pinned.some( ( parent ) => parent.contains( element ) )
		) {
			pinned.push( element );
		}
	}

	return pinned.reduce(
		( total, element ) => total + element.offsetHeight,
		pinned.length ? 16 : 0
	);
};

const offsetOf = ( root ) =>
	parseFloat(
		window.getComputedStyle( root ).getPropertyValue( PROPERTY )
	) || pinnedHeight();

const targetOf = ( link ) => {
	if ( ! link.hash || link.pathname !== window.location.pathname ) {
		return null;
	}

	const id = link.hash.slice( 1 );

	try {
		return (
			document.getElementById( id ) ||
			document.getElementById( decodeURIComponent( id ) )
		);
	} catch {
		return null;
	}
};

store( 'ever-blocks/table-of-contents', {
	actions: {
		follow( event ) {
			const { smooth } = getContext();
			const link = getElement().ref;
			const target = targetOf( link );

			if ( ! smooth || ! target ) {
				return;
			}

			event.preventDefault();

			target.style.scrollMarginTop = `${ offsetOf(
				link.closest( '.eb-table-of-contents' )
			) }px`;

			const reduced = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches;

			if ( ! target.hasAttribute( 'tabindex' ) ) {
				target.setAttribute( 'tabindex', '-1' );
			}

			target.focus( { preventScroll: true } );
			target.scrollIntoView( {
				behavior: reduced ? 'auto' : 'smooth',
				block: 'start',
			} );
			window.history.pushState( null, '', link.hash );
		},
	},
	callbacks: {
		observe() {
			const root = getElement().ref;
			const links = Array.from(
				root.querySelectorAll( '.eb-table-of-contents__link' )
			);
			const pairs = links
				.map( ( link ) => [ targetOf( link ), link ] )
				.filter( ( [ target ] ) => target );

			if ( ! pairs.length ) {
				return;
			}

			const offset = offsetOf( root );

			for ( const [ target ] of pairs ) {
				target.style.scrollMarginTop = `${ offset }px`;
			}

			if (
				! getContext().highlight ||
				! ( 'IntersectionObserver' in window )
			) {
				return;
			}

			const byTarget = new Map( pairs );
			const visible = new Set();

			const mark = () => {
				let current = null;

				for ( const [ target ] of pairs ) {
					if ( visible.has( target ) ) {
						current = target;
						break;
					}
				}

				if ( ! current ) {
					return;
				}

				for ( const [ target, link ] of pairs ) {
					if ( target === current ) {
						link.setAttribute( 'aria-current', 'location' );
					} else {
						link.removeAttribute( 'aria-current' );
					}
				}
			};

			const observer = new window.IntersectionObserver(
				( entries ) => {
					for ( const entry of entries ) {
						if ( entry.isIntersecting ) {
							visible.add( entry.target );
						} else {
							visible.delete( entry.target );
						}
					}

					mark();
				},
				{ rootMargin: `-${ offset }px 0px -50% 0px` }
			);

			for ( const target of byTarget.keys() ) {
				observer.observe( target );
			}

			return () => observer.disconnect();
		},
	},
} );
