import { useContext, useState } from 'react';
import SubItem from './SubItem';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';
import {
	useItemsSearchResults,
	useCreateDependencyWithName,
} from './ItemUtilities';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';

export default function RootItem({ item }: { item: ItemProps }) {
	const { getItem, addDependencyToItem } = useContext(ItemStoreContext);

	const [addItemTextboxText, setAddItemTextboxText] = useState('');

	const addItemTextboxSearchResults = useItemsSearchResults(
		addItemTextboxText,
		item
	);

	const createItemAsDependency = useCreateDependencyWithName(item.id);

	const back = useContext(NavigateToPreviousRootItemContext);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				padding: '1rem',
			}}
		>
			<h1>{item.name}</h1>
			<div style={{ marginBottom: '1rem' }}>
				<button style={{ padding: '0.5rem 1rem' }} onClick={back}>
					Back
				</button>
			</div>

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
								addDependencyToItem(item.id, result.id);
								setAddItemTextboxText('');
							}}
						>
							Add as subitem
						</button>
					</div>
				))}
			</div>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{item.dependencyIds.map(id => {
					const item = getItem(id);
					if (item) {
						return <SubItem key={id} item={item} />;
					} else {
						return null;
					}
				})}
			</div>
		</div>
	);
}
