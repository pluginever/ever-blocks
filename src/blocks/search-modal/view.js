import { getContext, getElement, store } from '@wordpress/interactivity';

const { actions } = store( 'ever-blocks/search-modal', {
	actions: {
		open() {
			getContext().isOpen = true;
		},
		close() {
			getContext().isOpen = false;
		},
		dismiss( event ) {
			if ( event.target === getElement().ref ) {
				actions.close();
			}
		},
	},
	callbacks: {
		// Escape closes a modal dialog natively. Newer browsers report that
		// through `toggle`, older ones through `close`; both are covered so
		// the state never drifts from the element.
		dialog() {
			const { ref } = getElement();
			const context = getContext();
			const onClose = ( event ) => {
				if ( 'toggle' === event.type && 'closed' !== event.newState ) {
					return;
				}

				context.isOpen = false;
			};

			ref.addEventListener( 'toggle', onClose );
			ref.addEventListener( 'close', onClose );

			return () => {
				ref.removeEventListener( 'toggle', onClose );
				ref.removeEventListener( 'close', onClose );
			};
		},
		sync() {
			const { ref } = getElement();
			const { isOpen } = getContext();

			if ( isOpen && ! ref.open ) {
				ref.showModal();
				ref.querySelector( 'input' )?.focus();
			} else if ( ! isOpen && ref.open ) {
				ref.close();
			}

			ref.ownerDocument.body.style.overflow = isOpen ? 'hidden' : '';
		},
		shortcut() {
			const context = getContext();

			if ( ! context.shortcut ) {
				return;
			}

			const onKeydown = ( event ) => {
				if (
					( event.metaKey || event.ctrlKey ) &&
					'k' === event.key.toLowerCase()
				) {
					event.preventDefault();
					context.isOpen = true;
				}
			};

			document.addEventListener( 'keydown', onKeydown );

			return () => document.removeEventListener( 'keydown', onKeydown );
		},
	},
} );
