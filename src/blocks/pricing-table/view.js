import { getContext, getElement, store } from '@wordpress/interactivity';

const STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const { state } = store( 'ever-blocks/pricing-table', {
	state: {
		get checked() {
			const { option, active } = getContext();

			return option === active;
		},
		get tabindex() {
			return state.checked ? 0 : -1;
		},
		get hidden() {
			return ! state.checked;
		},
	},
	actions: {
		select() {
			const context = getContext();

			context.active = context.option;
		},
		key( event ) {
			const { ref } = getElement();
			const radios = [
				...ref
					.closest( '[role="radiogroup"]' )
					.querySelectorAll( '[role="radio"]' ),
			];
			const index = radios.indexOf( ref );
			let next;

			if ( event.key in STEPS ) {
				next =
					radios[
						( index + STEPS[ event.key ] + radios.length ) %
							radios.length
					];
			} else if ( 'Home' === event.key ) {
				next = radios[ 0 ];
			} else if ( 'End' === event.key ) {
				next = radios[ radios.length - 1 ];
			}

			if ( ! next ) {
				return;
			}

			event.preventDefault();
			getContext().active = next.dataset.option;
			next.focus();
		},
	},
} );
