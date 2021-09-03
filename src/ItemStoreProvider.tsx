import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ItemStoreContext, { ItemsStoreContextProps } from './ItemStoreContext';
import { ItemProps } from './types';

const defaultItems: ItemProps[] = [
	{
		id: '0',
		name: 'Goals',
		description: '',
		target: null,
		dependencyIds: [],
		dependencyForIds: [],
		completedAt: null,
	},
];

function loadItems(): ItemProps[] {
	const string = localStorage.getItem('items');
	if (string === null) {
		return defaultItems;
	} else {
		return JSON.parse(string) as ItemProps[];
	}
}

function saveItems(items: ItemProps[]) {
	localStorage.setItem('items', JSON.stringify(items));
}

const ItemStoreProvider: FC = ({ children }) => {
	const [items, setItems_internal] = useState(() => loadItems());

	useEffect(() => {
		console.table(items);
	}, [items]);

	const setItems: typeof setItems_internal = useCallback(items => {
		setItems_internal(oldItems => {
			const result = typeof items === 'function' ? items(oldItems) : items;
			saveItems(result);
			return result;
		});
	}, []);

	const getItem = useCallback(
		(id: string) => items.find(item => item.id === id),
		[items]
	);

	const addItem = useCallback(
		(itemWithoutParent: ItemProps, parentId: string) => {
			setItems(items => {
				const item = { ...itemWithoutParent, dependencyForIds: [parentId] };
				const itemId = itemWithoutParent.id;
				const withNewItem = [...items, item];
				const withNewItemAndDependency = withNewItem.map(item => {
					if (item.id === parentId) {
						return {
							...item,
							dependencyIds: [...item.dependencyIds, itemId],
						};
					} else {
						return item;
					}
				});
				return withNewItemAndDependency;
			});
		},
		[setItems]
	);

	const removeItem = useCallback(
		(id: string) => {
			setItems(items => {
				items = items.filter(item => item.id !== id);
				items = items.map(item => ({
					...item,
					dependencies: item.dependencyIds.filter(dep => dep !== id),
				}));
				return items;
			});
		},
		[setItems]
	);

	const addDependencyToItem = useCallback(
		(id: string, dependencyId: string) => {
			const item = getItem(id);
			if (item) {
				setItems(items =>
					items.map(item =>
						item.id === id
							? {
									...item,
									dependencyIds: [...item.dependencyIds, dependencyId],
							  }
							: item
					)
				);
			}
		},
		[getItem, setItems]
	);

	const removeDependencyFromItem = useCallback(
		(id: string, dependencyId: string) => {
			const item = getItem(id);
			const dependency = getItem(dependencyId);
			if (item && dependency) {
				if (
					dependency.dependencyForIds.length === 1 &&
					dependency.dependencyForIds[0] === item.id
				) {
					removeItem(dependencyId);
				}
			}
			if (item) {
				setItems(items =>
					items.map(item =>
						item.id === id
							? {
									...item,
									dependencyIds: item.dependencyIds.filter(
										dep => dep !== dependencyId
									),
							  }
							: item
					)
				);
			}
		},
		[getItem, removeItem, setItems]
	);

	const toggleItemCompleted = useCallback(
		(id: string) => {
			const item = getItem(id);
			if (item) {
				setItems(items =>
					items.map(item =>
						item.id === id
							? ({
									...item,
									completedAt: item.completedAt ? null : new Date(),
							  } as ItemProps)
							: item
					)
				);
			}
		},
		[getItem, setItems]
	);

	const value: ItemsStoreContextProps = useMemo(
		() => ({
			items,
			setItems,
			getItem,
			addItem,
			removeItem,
			addDependencyToItem,
			removeDependencyFromItem,
			toggleItemCompleted,
		}),
		[
			items,
			setItems,
			getItem,
			addItem,
			removeItem,
			addDependencyToItem,
			removeDependencyFromItem,
			toggleItemCompleted,
		]
	);

	return (
		<ItemStoreContext.Provider value={value}>
			{children}
		</ItemStoreContext.Provider>
	);
};

export default ItemStoreProvider;
