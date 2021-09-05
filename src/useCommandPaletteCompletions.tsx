import { FC } from 'react';
import { useContext } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { getItemsSearchResults } from './ItemUtilities';

const CompletionRow: FC = ({ children }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#303030',
				padding: '1rem',
			}}
		>
			{children}
		</div>
	);
};

/**
 * Finds the suggestions for the given command. They're inserted directly after the command palette's <input />, in
 * a flex column.
 * @param text The text in the command palette
 * @returns Completions for the command palette
 */
export default function useCommandPaletteSuggestions(text: string) {
	const [rootItemId] = useContext(RootItemIdContext);
	const { items } = useContext(ItemStoreContext);

	if (text.startsWith('/')) {
		if (text.startsWith('/t ') && text.length > 3) {
			const rest = text.substring(3);
			return (
				<CompletionRow>
					<span style={{ marginRight: '1ch' }}>Add an item with the name</span>
					<span style={{ fontFamily: 'monospace' }}>{rest}</span>
				</CompletionRow>
			);
		}
		return null;
	} else {
		const matches = getItemsSearchResults(items, text, rootItemId, true);
		return (
			<>
				{matches.map(match => (
					<CompletionRow key={match.id}>{match.name}</CompletionRow>
				))}
			</>
		);
	}
}
