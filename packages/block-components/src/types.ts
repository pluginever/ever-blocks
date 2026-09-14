/**
 * Types shared across components, hooks and utilities.
 *
 * A type that belongs to one component lives with that component; only the
 * style-state vocabulary, which every layer speaks, is here.
 */
export type Viewport = 'default' | '@tablet' | '@mobile';

export type Pseudo = 'default' | `:${ string }` | `-${ string }`;

export interface StyleState {
	viewport: Viewport;
	pseudo: Pseudo;
}

export type StyleObject = Record< string, unknown >;

export interface ElementDeclaration {
	selector: string;
	states: string[];
}

export interface BlockDeclaration {
	/** Elements keyed by name, from `supports.everBlocks.elements`. */
	elements: Record< string, ElementDeclaration >;
	/** Root states keyed by name: pseudo-states map to '', custom states to their selector. */
	states: Record< string, string >;
	/** Feature selectors from block.json `selectors`. */
	selectors: Record< string, unknown >;
}

export interface StyleRule {
	/** Selector tail appended to the instance selector. */
	selector: string;
	declarations: Record< string, string >;
	query: string;
	important: boolean;
}
