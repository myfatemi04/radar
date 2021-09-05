import { ReactNode, useContext } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { getItemsSearchResults } from './ItemUtilities';

export type Suggestion = {
	label: ReactNode;
	onClick: () => void;
};

/**
 * Finds the suggestions for the given command. They're inserted directly after the command palette's <input />, in
 * a flex column.
 * @param text The text in the command palette
 * @returns Completions for the command palette
 */
export default function useCommandPaletteSuggestions(
	text: string
): Suggestion[] {
	const [rootItemId] = useContext(RootItemIdContext);
	const { items } = useContext(ItemStoreContext);
	const [, setRootItemId] = useContext(RootItemIdContext);

	if (text.startsWith('/')) {
		if (text.startsWith('/t ') && text.length > 3) {
			const rest = text.substring(3);
			return [
				{
					label: (
						<>
							<span style={{ marginRight: '1ch' }}>
								Add an item with the name
							</span>
							<span style={{ fontFamily: 'monospace' }}>{rest}</span>
						</>
					),
					onClick: () => {},
				},
			];
		}
		return [];
	} else {
		const matches = getItemsSearchResults(items, text, rootItemId, true);
		return matches.map(match => ({
			label: match.name,
			onClick: () => setRootItemId(match.id),
		}));
	}
}
