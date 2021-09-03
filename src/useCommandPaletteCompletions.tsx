import { FC } from 'react';
import { useContext } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { getItemsSearchResults } from './ItemUtilities';

const commandsAndDescriptions = {
	'/t': 'Create a new item',
	'/b': 'Navigate back',
	'/#': 'Navigate to item by label',
};

const CompletionRow: FC = ({ children }) => {
	return (
		<div
			style={{
				display: 'flex',
				backgroundColor: '#303030',
				padding: '1rem',
				marginTop: '0.5rem',
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
		if (text.length === 1) {
			return (
				<>
					{Object.entries(commandsAndDescriptions).map(
						([command, description]) => {
							return (
								<CompletionRow key={command}>
									<span
										style={{ fontFamily: 'monospace', marginRight: '1rem' }}
									>
										{command}
									</span>
									<span>{description}</span>
								</CompletionRow>
							);
						}
					)}
				</>
			);
		}
		return null;
	} else {
		const matches = getItemsSearchResults(items, text, rootItemId);
		return (
			<>
				{matches.map(match => (
					<CompletionRow key={match.id}>{match.name}</CompletionRow>
				))}
			</>
		);
	}
}
