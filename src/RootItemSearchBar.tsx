import { useMemo } from 'react';
import { useContext, useState } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { useCreateDependencyWithName } from './ItemUtilities';
import useItem from './useItem';

export default function RootItemSearchBar() {
	const rootItemId = useContext(RootItemIdContext);
	const { store, state } = useContext(ItemStoreContext);
	const item = useItem(rootItemId)!;
	const [addItemTextboxText, setAddItemTextboxText] = useState('');

	const addItemTextboxSearchResults = useMemo(
		() =>
			[...state.search(addItemTextboxText)].filter(
				result =>
					result.id !== item.id && !state.isAncestor(result.id, rootItemId)
			),
		[addItemTextboxText, item.id, rootItemId, state]
	);

	const createItemAsDependency = useCreateDependencyWithName(item.id);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>
				Add subitem
			</pre>
			<input
				value={addItemTextboxText}
				style={{
					backgroundColor: '#202020',
				}}
				onChange={e => setAddItemTextboxText(e.target.value)}
				type='text'
			/>
			{addItemTextboxText.length > 0 && (
				<button
					style={{ marginTop: '1rem' }}
					onClick={() => {
						createItemAsDependency(addItemTextboxText);
						setAddItemTextboxText('');
					}}
				>
					Create item with name "{addItemTextboxText}"
				</button>
			)}
			{addItemTextboxText.length > 0 &&
				addItemTextboxSearchResults.map(result => (
					<div key={result.id}>
						<h3>{result.name}</h3>
						<p>{result.description}</p>
						<button
							onClick={() => {
								store.addDependencyToItem(item.id, result.id);
								setAddItemTextboxText('');
							}}
						>
							Add as subitem
						</button>
					</div>
				))}
		</div>
	);
}
