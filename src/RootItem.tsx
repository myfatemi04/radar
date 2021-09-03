import { useContext, useState } from 'react';
import SubItem from './SubItem';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';
import {
	useItemsSearchResults,
	useCreateDependencyWithName,
} from './ItemUtilities';

export default function RootItem({ item }: { item: ItemProps }) {
	const { getItem, addDependencyToItem } = useContext(ItemStoreContext);

	const [addItemTextboxText, setAddItemTextboxText] = useState('');

	const addItemTextboxSearchResults = useItemsSearchResults(
		addItemTextboxText,
		item
	);

	const createItemAsDependency = useCreateDependencyWithName(item.id);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: 'calc(min(30rem, 50vw))',
				margin: '1rem auto',
			}}
		>
			<h1>{item.name}</h1>

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
