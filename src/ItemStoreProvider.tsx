import { FC, useEffect, useMemo, useState } from 'react';
import ItemStore from './ItemStore';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

const defaultItems: ItemProps[] = [
	{
		id: '0',
		name: 'Goals',
		description: '',
		target: null,
		dependencyIds: [],
		completedAt: null,
	},
];

function loadItems(): ItemProps[] {
	const string = localStorage.getItem('items');
	if (string === null) {
		return defaultItems;
	} else {
		return JSON.parse(string).map((rawItem: ItemProps) => ({
			...rawItem,
			target: rawItem.target ? new Date(rawItem.target) : null,
		})) as ItemProps[];
	}
}

// eslint-disable-next-line
function saveItems(items: ItemProps[]) {
	localStorage.setItem('items', JSON.stringify(items));
}

const ItemStoreProvider: FC = ({ children }) => {
	const store = useMemo(() => new ItemStore(loadItems()), []);
	const [state, setState] = useState(store.state);

	useEffect(() => {
		store.subscribe(() => {
			setState(store.state);
		});
	}, [store]);

	return (
		<ItemStoreContext.Provider value={{ state, store }}>
			{children}
		</ItemStoreContext.Provider>
	);
};

export default ItemStoreProvider;
