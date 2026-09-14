import {
	RichText,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	IconDisplay,
	SettingsPanels,
	StylePanels,
	useBlockStyles,
} from '@byteever/block-components';
import './editor.scss';

const TEMPLATE = [
	[
		'core/paragraph',
		{ placeholder: __( 'Write the answer…', 'ever-blocks' ) },
	],
];

const LEVELS = [ 2, 3, 4, 5, 6 ].map( ( level ) => ( {
	value: String( level ),
	// translators: %d: heading level.
	label: sprintf( __( 'Heading %d', 'ever-blocks' ), level ),
} ) );

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
	isSelected,
} ) {
	const { title, open, level } = attributes;
	const [ expanded, setExpanded ] = useState( open );
	const hasSelectedChild = useSelect(
		( select ) =>
			select( blockEditorStore ).hasSelectedInnerBlock( clientId, true ),
		[ clientId ]
	);
	const isOpen = expanded || open || isSelected || hasSelectedChild;
	const icon = context[ 'ever-blocks/accordionIcon' ];
	const iconOpen = context[ 'ever-blocks/accordionIconOpen' ];
	const Title = level >= 1 && level <= 6 ? `h${ level }` : 'p';

	const blockProps = useBlockProps( {
		className: `eb-accordion-item${ iconOpen ? ' has-open-icon' : '' }`,
		open: isOpen ? 'open' : undefined,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'eb-accordion-item__content' },
		{ template: TEMPLATE }
	);

	useBlockStyles( attributes );

	return (
		<>
			<SettingsPanels
				label={ __( 'Accordion item', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ {
					open: {
						type: 'toggle',
						label: __( 'Open by default', 'ever-blocks' ),
						isShownByDefault: true,
					},
				} }
			/>

			<SettingsPanels
				label={ __( 'Title', 'ever-blocks' ) }
				attributes={ { level: String( level ) } }
				setAttributes={ ( next ) =>
					setAttributes( {
						level: Number( next.level ?? 3 ),
					} )
				}
				controls={ {
					level: {
						type: 'select',
						label: __( 'Heading level', 'ever-blocks' ),
						isShownByDefault: true,
						options: LEVELS,
					},
				} }
			/>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					summary: {
						label: __( 'Header', 'ever-blocks' ),
						color: { text: 'default', background: 'default' },
						spacing: { padding: true },
					},
					title: {
						label: __( 'Title', 'ever-blocks' ),
						typography: {
							fontSize: 'default',
							fontAppearance: true,
							lineHeight: true,
							letterSpacing: true,
							textTransform: true,
						},
						color: { text: true },
					},
					icon: {
						label: __( 'Icon', 'ever-blocks' ),
						values: {
							size: {
								control: 'unit',
								label: __( 'Size', 'ever-blocks' ),
								min: 8,
								isShownByDefault: true,
							},
						},
						color: { text: true, background: true },
						spacing: { padding: true },
						border: { radius: true },
					},
					panel: {
						label: __( 'Panel', 'ever-blocks' ),
						color: { text: true, background: 'default' },
						spacing: { padding: true },
						typography: { fontSize: true },
					},
				} }
			/>

			<div { ...blockProps }>
				<div className="eb-accordion-item__summary">
					<RichText
						tagName={ Title }
						className="eb-accordion-item__title"
						value={ title }
						onChange={ ( next ) =>
							setAttributes( { title: next } )
						}
						placeholder={ __(
							'Question or title…',
							'ever-blocks'
						) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						withoutInteractiveFormatting
					/>
					<button
						type="button"
						className="eb-accordion-item__toggle"
						aria-expanded={ isOpen }
						aria-label={
							isOpen
								? __( 'Collapse item', 'ever-blocks' )
								: __( 'Expand item', 'ever-blocks' )
						}
						onClick={ () => setExpanded( ! isOpen ) }
					>
						{ icon && (
							<span
								className="eb-accordion-item__icon eb-accordion-item__icon--closed"
								aria-hidden="true"
							>
								<IconDisplay name={ icon } />
							</span>
						) }
						{ iconOpen && (
							<span
								className="eb-accordion-item__icon eb-accordion-item__icon--open"
								aria-hidden="true"
							>
								<IconDisplay name={ iconOpen } />
							</span>
						) }
					</button>
				</div>
				<div
					className="eb-accordion-item__panel"
					role="region"
					aria-label={ __( 'Panel content', 'ever-blocks' ) }
				>
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}
