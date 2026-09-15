import {
	getContext,
	getElement,
	store,
	withScope,
} from '@wordpress/interactivity';

const reduced = () =>
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

const parts = ( root ) => {
	const track = root.querySelector( '.eb-carousel__track' );

	return {
		track,
		slides: Array.from(
			track?.querySelectorAll( ':scope > .eb-carousel__slide' ) ?? []
		),
		dots: Array.from( root.querySelectorAll( '.eb-carousel__dot' ) ),
		previous: root.querySelector( '.eb-carousel__arrow--previous' ),
		next: root.querySelector( '.eb-carousel__arrow--next' ),
		status: root.querySelector( '.eb-carousel__status' ),
	};
};

const timers = new WeakMap();

const stop = ( root ) => {
	window.clearInterval( timers.get( root ) );
	timers.delete( root );
};

const start = ( root, context ) => {
	stop( root );

	if ( ! context.autoplay || 'slider' !== context.layout || reduced() ) {
		return;
	}

	timers.set(
		root,
		window.setInterval(
			withScope( () => actions.next() ),
			context.delay * 1000
		)
	);
};

const { actions } = store( 'ever-blocks/carousel', {
	actions: {
		go( event ) {
			const context = getContext();
			const target =
				'number' === typeof event
					? event
					: Number( event.currentTarget.dataset.index );
			const { slides, track } = parts(
				getElement().ref.closest( '.eb-carousel' )
			);
			const index = Math.min( slides.length - 1, Math.max( 0, target ) );

			if ( slides[ index ] ) {
				track.scrollLeft =
					slides[ index ].offsetLeft - track.offsetLeft;
			}

			context.index = index;
		},
		next() {
			const context = getContext();
			const last = Math.max( 0, context.count - context.perView );

			if ( context.index < last ) {
				actions.go( context.index + 1 );
			} else if ( context.loop ) {
				actions.go( 0 );
			}
		},
		previous() {
			const context = getContext();
			const last = Math.max( 0, context.count - context.perView );

			if ( context.index > 0 ) {
				actions.go( context.index - 1 );
			} else if ( context.loop ) {
				actions.go( last );
			}
		},
		scrolled() {
			const root = getElement().ref.closest( '.eb-carousel' );
			const { slides, track, dots, previous, next, status } =
				parts( root );

			if ( ! slides.length ) {
				return;
			}

			const context = getContext();

			const step = slides[ 1 ]
				? slides[ 1 ].offsetLeft - slides[ 0 ].offsetLeft
				: slides[ 0 ].offsetWidth;
			const index = Math.min(
				slides.length - 1,
				Math.max( 0, Math.round( track.scrollLeft / step ) )
			);
			const last = Math.max( 0, context.count - context.perView );

			context.index = index;

			dots.forEach( ( dot, i ) => {
				if ( i === index ) {
					dot.setAttribute( 'aria-current', 'true' );
				} else {
					dot.removeAttribute( 'aria-current' );
				}
			} );

			if ( previous && ! context.loop ) {
				previous.disabled = 0 === index;
			}

			if ( next && ! context.loop ) {
				next.disabled = index >= last;
			}

			if ( status ) {
				status.textContent = `${ index + 1 } / ${ slides.length }`;
			}
		},
		key( event ) {
			if ( 'ArrowRight' === event.key ) {
				event.preventDefault();
				actions.next();
			} else if ( 'ArrowLeft' === event.key ) {
				event.preventDefault();
				actions.previous();
			}
		},
		pause() {
			const root = getElement().ref;

			root.classList.add( 'is-paused' );
			stop( root );
		},
		resume() {
			const root = getElement().ref;

			root.classList.remove( 'is-paused' );
			start( root, getContext() );
		},
	},
	callbacks: {
		init() {
			const context = getContext();
			const root = getElement().ref;

			if ( 'slider' !== context.layout ) {
				root.classList.toggle(
					'is-reverse',
					Boolean( context.reverse )
				);

				return;
			}

			const { track } = parts( root );
			const measure = () => {
				context.perView = Math.max(
					1,
					Math.round(
						parseFloat(
							window
								.getComputedStyle( root )
								.getPropertyValue( '--per-view' )
						) || 1
					)
				);
				actions.scrolled.call( null );
			};

			const observer = new window.ResizeObserver( withScope( measure ) );
			observer.observe( track );
			start( root, context );

			return () => {
				observer.disconnect();
				stop( root );
			};
		},
		measure() {
			const root = getElement().ref.closest( '.eb-carousel' );
			const track = getElement().ref;
			const vertical = root.classList.contains( 'is-layout-columns' );
			const lanes = vertical
				? Array.from( track.querySelectorAll( '.eb-carousel__column' ) )
				: [ track ];

			if (
				! lanes.length ||
				! lanes[ 0 ].querySelector( '.eb-carousel__run' )
			) {
				return;
			}

			const context = getContext();
			const size = ( element ) =>
				vertical ? element.offsetHeight : element.offsetWidth;

			const fill = () => {
				for ( const lane of lanes ) {
					const runs = lane.querySelectorAll( '.eb-carousel__run' );
					const run = runs[ 0 ];
					const needed =
						Math.ceil( size( lane ) / Math.max( 1, size( run ) ) ) +
						1;

					for ( let i = runs.length; i < needed; i++ ) {
						const clone = run.cloneNode( true );

						clone.setAttribute( 'aria-hidden', 'true' );
						clone.inert = true;
						lane.appendChild( clone );
					}

					lane.style.setProperty(
						'--ever-blocks-carousel-duration',
						`${ Math.max( 1, size( run ) / context.speed ) }s`
					);
				}
			};

			const observer = new window.ResizeObserver( fill );
			observer.observe( track );
			fill();

			return () => observer.disconnect();
		},
	},
} );
