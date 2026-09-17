import {
	InspectorControls,
	RichText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { CheckboxControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { Icon, chevronDown } from '@wordpress/icons';
import { cleanForSlug } from '@wordpress/url';
import {
	SettingsPanels,
	StylePanels,
	ToolsPanel,
	ToolsPanelItem,
	useBlockStyles,
} from '@byteever/block-components';
import { EXCLUDED } from './heading';
import './editor.scss';

const LEVELS = [ 1, 2, 3, 4, 5, 6 ];

const LIST_STYLES = [
	{ label: __( 'None', 'ever-blocks' ), value: 'none' },
	{ label: __( 'Bullets', 'ever-blocks' ), value: 'disc' },
	{ label: __( 'Numbers', 'ever-blocks' ), value: 'decimal' },
	{ label: __( 'Nested numbers (1.1)', 'ever-blocks' ), value: 'nested' },
	{ label: __( 'Roman numerals', 'ever-blocks' ), value: 'upper-roman' },
	{ label: __( 'Letters', 'ever-blocks' ), value: 'lower-alpha' },
];

const TITLE_TAGS = [
	...[ 'h2', 'h3', 'h4', 'h5', 'h6' ].map( ( tag ) => ( {
		label: tag.toUpperCase(),
		value: tag,
	} ) ),
	{ label: __( 'Paragraph', 'ever-blocks' ), value: 'p' },
];

const MINIMUMS = [ 1, 2, 3, 4, 5, 6 ].map( ( n ) => ( {
	label: String( n ),
	value: String( n ),
} ) );

const text = ( html ) => {
	const element = document.createElement( 'div' );
	element.innerHTML = String( html ?? '' ).replace( /<br\s*\/?>/gi, ' ' );

	return ( element.textContent ?? '' ).replace( /\s+/g, ' ' ).trim();
};

function nest( flat ) {
	const tree = [];

	for ( let i = 0; i < flat.length;  ) {
		let next = i + 1;

		while ( next < flat.length && flat[ next ].level > flat[ i ].level ) {
			next++;
		}

		tree.push( {
			...flat[ i ],
			children: nest( flat.slice( i + 1, next ) ),
		} );

		i = next;
	}

	return tree;
}

function useHeadings( levels ) {
	return useSelect(
		( select ) => {
			const { getBlocksByName, getBlockAttributes } =
				select( blockEditorStore );
			const ids = {};
			const all = getBlocksByName( 'core/heading' ).map( ( clientId ) => {
				const attributes = getBlockAttributes( clientId ) ?? {};
				const content = text( attributes.content );
				const base =
					attributes.anchor || cleanForSlug( content ) || 'heading';
				let id = base;

				for ( let n = 2; ids[ id ] && ! attributes.anchor; n++ ) {
					id = `${ base }-${ n }`;
				}

				ids[ id ] = true;

				return {
					id,
					text: content,
					level: Number( attributes.level ?? 2 ),
					excluded: Boolean( attributes[ EXCLUDED ] ),
				};
			} );

			return all.filter(
				( heading ) =>
					heading.text &&
					! heading.excluded &&
					levels.includes( heading.level )
			);
		},
		[ levels ]
	);
}

function List( { nodes, prefix = '' } ) {
	return (
		<ol className="eb-table-of-contents__list">
			{ nodes.map( ( node, position ) => {
				const index = `${ prefix }${ position + 1 }`;

				return (
					<li
						key={ node.id }
						className="eb-table-of-contents__item"
						data-index={ index }
					>
						<a
							className="eb-table-of-contents__link"
							href={ `#${ node.id }` }
							onClick={ ( event ) => event.preventDefault() }
						>
							{ node.text }
						</a>
						{ node.children.length > 0 && (
							<List
								nodes={ node.children }
								prefix={ `${ index }.` }
							/>
						) }
					</li>
				);
			} ) }
		</ol>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		title,
		titleTag,
		levels,
		listStyle,
		collapsible,
		open,
		minHeadings,
	} = attributes;
	const headings = useHeadings( levels );
	const tree = nest( headings );
	const blockProps = useBlockProps( {
		className: `eb-table-of-contents is-list-style-${ listStyle }`,
	} );

	useBlockStyles( attributes );

	const TitleTag = collapsible && 'p' === titleTag ? 'span' : titleTag;
	const titleField = (
		<RichText
			tagName={ TitleTag }
			className="eb-table-of-contents__title"
			value={ title }
			onChange={ ( next ) => setAttributes( { title: next } ) }
			placeholder={ __( 'Table of contents', 'ever-blocks' ) }
			allowedFormats={ [ 'core/bold', 'core/italic' ] }
			withoutInteractiveFormatting
		/>
	);

	const body = headings.length ? (
		<List nodes={ tree } />
	) : (
		<p className="eb-table-of-contents__placeholder">
			{ __(
				'Add heading blocks to this post and they will be listed here.',
				'ever-blocks'
			) }
		</p>
	);

	const settings = {
		collapsible: {
			type: 'toggle',
			label: __( 'Collapsible', 'ever-blocks' ),
			isShownByDefault: true,
		},
		...( collapsible
			? {
					open: {
						type: 'toggle',
						label: __( 'Open by default', 'ever-blocks' ),
						isShownByDefault: true,
					},
			  }
			: {} ),
		titleTag: {
			type: 'select',
			label: __( 'Title tag', 'ever-blocks' ),
			options: TITLE_TAGS,
		},
		listStyle: {
			type: 'select',
			label: __( 'List style', 'ever-blocks' ),
			options: LIST_STYLES,
			isShownByDefault: true,
		},
		smoothScroll: {
			type: 'toggle',
			label: __( 'Smooth scroll', 'ever-blocks' ),
		},
		highlight: {
			type: 'toggle',
			label: __( 'Highlight the current heading', 'ever-blocks' ),
		},
	};

	return (
		<>
			<SettingsPanels
				label={ __( 'Table of contents', 'ever-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				controls={ settings }
			/>

			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Headings', 'ever-blocks' ) }
					panelId={ `${ clientId }-headings` }
					resetAll={ () =>
						setAttributes( {
							levels: [ 2, 3 ],
							minHeadings: 2,
						} )
					}
				>
					<ToolsPanelItem
						hasValue={ () =>
							JSON.stringify( levels ) !==
							JSON.stringify( [ 2, 3 ] )
						}
						label={ __( 'Levels', 'ever-blocks' ) }
						panelId={ `${ clientId }-headings` }
						isShownByDefault
						onDeselect={ () =>
							setAttributes( { levels: [ 2, 3 ] } )
						}
					>
						<fieldset className="eb-table-of-contents__levels">
							<legend>
								{ __( 'Heading levels', 'ever-blocks' ) }
							</legend>
							{ LEVELS.map( ( level ) => (
								<CheckboxControl
									key={ level }
									__nextHasNoMarginBottom
									label={ sprintf(
										/* translators: %d: heading level. */
										__( 'Heading %d', 'ever-blocks' ),
										level
									) }
									checked={ levels.includes( level ) }
									onChange={ ( checked ) =>
										setAttributes( {
											levels: LEVELS.filter( ( l ) =>
												l === level
													? checked
													: levels.includes( l )
											),
										} )
									}
								/>
							) ) }
						</fieldset>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => 2 !== minHeadings }
						label={ __( 'Minimum', 'ever-blocks' ) }
						panelId={ `${ clientId }-headings` }
						onDeselect={ () => setAttributes( { minHeadings: 2 } ) }
					>
						<SelectControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Show when at least', 'ever-blocks' ) }
							help={ __(
								'Renders nothing on the front end below this many headings.',
								'ever-blocks'
							) }
							value={ String( minHeadings ) }
							options={ MINIMUMS }
							onChange={ ( next ) =>
								setAttributes( { minHeadings: Number( next ) } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<StylePanels
				attributes={ attributes }
				setAttributes={ setAttributes }
				elements={ {
					root: {
						values: {
							columns: {
								control: 'range',
								label: __( 'Columns', 'ever-blocks' ),
								min: 1,
								max: 3,
								step: 1,
							},
							gap: {
								control: 'unit',
								label: __( 'Item gap', 'ever-blocks' ),
								min: 0,
							},
							indent: {
								control: 'unit',
								label: __( 'Indent', 'ever-blocks' ),
								min: 0,
							},
							scrollOffset: {
								control: 'unit',
								label: __( 'Scroll offset', 'ever-blocks' ),
								help: __(
									'Space kept above a heading when a link scrolls to it, for a fixed header.',
									'ever-blocks'
								),
								min: 0,
							},
						},
					},
					title: {
						label: __( 'Title', 'ever-blocks' ),
						color: { text: true },
						typography: {
							fontSize: true,
							fontAppearance: true,
							letterSpacing: true,
							textTransform: true,
						},
						spacing: { margin: true },
					},
					toggle: {
						label: __( 'Toggle', 'ever-blocks' ),
						values: {
							iconSize: {
								control: 'unit',
								label: __( 'Icon size', 'ever-blocks' ),
								min: 8,
								max: 64,
							},
						},
						color: { text: true },
					},
					list: {
						label: __( 'List', 'ever-blocks' ),
						spacing: { padding: 'default' },
					},
					item: {
						label: __( 'Item', 'ever-blocks' ),
						color: { text: true, background: true },
						typography: {
							fontSize: true,
							fontAppearance: true,
							textDecoration: true,
						},
						spacing: { padding: true },
					},
					current: {
						label: __( 'Current heading', 'ever-blocks' ),
						color: { text: true, background: true },
						typography: {
							fontAppearance: true,
							textDecoration: true,
						},
					},
					marker: {
						label: __( 'Marker', 'ever-blocks' ),
						color: { text: true },
						typography: { fontSize: true, fontAppearance: true },
					},
				} }
			/>

			<nav { ...blockProps }>
				{ collapsible ? (
					<div
						className={ `eb-table-of-contents__details${
							open ? ' is-open' : ''
						}` }
					>
						<div className="eb-table-of-contents__summary">
							{ titleField }
							<span
								className="eb-table-of-contents__toggle"
								aria-hidden="true"
							>
								<Icon icon={ chevronDown } />
							</span>
						</div>
						{ body }
					</div>
				) : (
					<>
						{ titleField }
						{ body }
					</>
				) }
			</nav>
		</>
	);
}
