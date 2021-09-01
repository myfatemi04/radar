import { useCallback, useContext, useMemo, useState } from 'react';
import AppContext from './AppContext';
import { ItemProps } from './types';

function Item({ item }: { item: ItemProps }) {
	const {
		items,
		getItem,
		addItem,
		removeItem,
		addDependencyToItem,
		removeDependencyFromItem,
	} = useContext(AppContext);
	const [addItemTextboxText, setAddItemTextboxText] = useState('');
	const addItemTextboxSearchResults: ItemProps[] = useMemo(() => {
		const searchKey = addItemTextboxText.toLowerCase();
		if (!searchKey) {
			return [];
		}
		return items.filter(
			other =>
				other.id !== item.id &&
				!item.dependencies.includes(other.id) &&
				(other.name.toLowerCase().includes(searchKey) ||
					other.description.toLowerCase().includes(searchKey))
		);
	}, [addItemTextboxText, item.dependencies, item.id, items]);
	const createItemAsDependency = useCallback(
		(name: string) => {
			const dependency: ItemProps = {
				id: Math.random().toString(36).substr(2, 9),
				name,
				target: null,
				description: '',
				dependencies: [],
			};
			addItem(dependency);
			addDependencyToItem(item.id, dependency.id);
			setAddItemTextboxText('');
		},
		[addDependencyToItem, addItem, item.id]
	);
	return (
		<div
			style={{
				border: '1px solid white',
				padding: '1rem',
				marginTop: '1rem',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<h2>{item.name}</h2>
			{item.id !== '0' && (
				<div>
					<button
						style={{ marginBottom: '1rem' }}
						onClick={() => removeItem(item.id)}
					>
						Delete
					</button>
				</div>
			)}
			{item.target != null && <b>{item.target.toLocaleString()}</b>}
			{item.description && <p style={{ color: 'grey' }}>{item.description}</p>}
			<div>
				{/* <span style={{ color: 'grey', fontSize: '0.75rem' }}>Subitems</span> */}
				<br />
				<input
					value={addItemTextboxText}
					style={{ marginBottom: '1rem' }}
					placeholder='Add something...'
					onChange={e => setAddItemTextboxText(e.target.value)}
					type='text'
				/>
				{addItemTextboxText.length > 0 && (
					<button
						style={{ marginLeft: '1rem' }}
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
				{item.dependencies.map(dependencyId => {
					const dependency = getItem(dependencyId)!;
					return (
						<div key={dependencyId}>
							<h3>{dependency.name}</h3>
							<p>{dependency.description}</p>
							<button
								onClick={() => removeDependencyFromItem(item.id, dependencyId)}
							>
								Remove
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Item;
