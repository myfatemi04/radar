import { useContext, useState } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import {
	useCreateDependencyWithName,
	useItemsSearchResults,
} from './ItemUtilities';
import useItem from './useItem';

export default function RootItemSearchBar() {
	const [rootItemId] = useContext(RootItemIdContext);
	const { store } = useContext(ItemStoreContext);
	const item = useItem(rootItemId)!;
	const [addItemTextboxText, setAddItemTextboxText] = useState('');

	const addItemTextboxSearchResults = useItemsSearchResults(
		addItemTextboxText,
		item
	);

	const createItemAsDependency = useCreateDependencyWithName(item.id);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<input
				value={addItemTextboxText}
				placeholder='Add something...'
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
			{addItemTextboxSearchResults.map(result => (
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
