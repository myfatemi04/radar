import { ReactNode, useContext } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';

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
	const { state } = useContext(ItemStoreContext);
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
		const matches = Array.from(state.search(text, rootItemId));
		return matches.map(match => ({
			label: match.name,
			onClick: () => setRootItemId(match.id),
		}));
	}
}
