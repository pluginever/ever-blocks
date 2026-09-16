import {
	getContext,
	getElement,
	store,
	withScope,
} from '@wordpress/interactivity';

const reduced = () =>
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

const timers = new WeakMap();

const stop = ( root ) => {
	window.clearInterval( timers.get( root ) );
	timers.delete( root );
};

const place = ( run, context ) => {
	const items = Array.from(
		run.querySelectorAll( ':scope > .eb-announcement' )
	);
	const item = items[ context.index ];

	if ( ! item ) {
		return;
	}

	run.parentElement.style.height = `${ item.offsetHeight }px`;
	run.style.transform = `translateY(-${ item.offsetTop }px)`;
	items.forEach( ( node, i ) => {
		node.setAttribute(
			'aria-hidden',
			i === context.index ? 'false' : 'true'
		);
		node.inert = i !== context.index;
	} );
};

const step = ( root, context ) => {
	const run = root.querySelector( '.eb-announcement-bar__run' );
	const count = run
		? run.querySelectorAll( ':scope > .eb-announcement' ).length
		: 0;

	if ( count < 2 ) {
		return;
	}

	const direction = context.reverse ? -1 : 1;

	context.index = ( context.index + direction + count ) % count;
	place( run, context );
};

const start = ( root, context ) => {
	stop( root );

	if ( 'rotate' !== context.animation || reduced() ) {
		return;
	}

	timers.set(
		root,
		window.setInterval(
			withScope( () => step( root, context ) ),
			context.interval * 1000
		)
	);
};

store( 'ever-blocks/announcement-bar', {
	actions: {
		dismiss() {
			const context = getContext();
			const root = getElement().ref.closest( '.eb-announcement-bar' );

			context.hidden = true;
			stop( root );

			if ( ! context.dismiss ) {
				return;
			}

			try {
				window.localStorage.setItem(
					context.dismiss,
					String( Date.now() + context.days * 86400000 )
				);
			} catch {}
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

			if ( context.dismiss ) {
				try {
					const until = Number(
						window.localStorage.getItem( context.dismiss )
					);

					if ( until > Date.now() ) {
						return;
					}
				} catch {}

				context.hidden = false;
			}

			start( root, context );

			return () => stop( root );
		},
		measure() {
			const context = getContext();
			const track = getElement().ref;
			const run = track.querySelector( '.eb-announcement-bar__run' );

			if ( ! run || context.hidden ) {
				return;
			}

			const fill = () => {
				const runs = track.querySelectorAll(
					'.eb-announcement-bar__run'
				);
				const needed =
					Math.ceil(
						track.offsetWidth / Math.max( 1, run.offsetWidth )
					) + 1;

				for ( let i = runs.length; i < needed; i++ ) {
					const clone = run.cloneNode( true );

					clone.setAttribute( 'aria-hidden', 'true' );
					clone.inert = true;
					track.appendChild( clone );
				}

				track.style.setProperty(
					'--ever-blocks-announcement-bar-duration',
					`${ Math.max( 1, run.offsetWidth / context.speed ) }s`
				);
			};

			const observer = new window.ResizeObserver( fill );
			observer.observe( track );
			fill();

			return () => observer.disconnect();
		},
		rotate() {
			const run = getElement().ref;

			if ( ! run.querySelector( ':scope > .eb-announcement' ) ) {
				return;
			}

			const context = getContext();
			const observer = new window.ResizeObserver(
				withScope( () => place( run, context ) )
			);

			observer.observe( run );
			place( run, context );

			return () => observer.disconnect();
		},
	},
} );
