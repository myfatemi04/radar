import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from 'react';
import ItemsStoreContext, { ItemsStoreContextProps } from './ItemsStoreContext';
import { ItemProps } from './types';

const defaultItems: ItemProps[] = [
	{
		id: '0',
		name: 'Goals',
		description: '',
		target: null,
		dependencies: [],
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

const ItemsStoreProvider: FC = ({ children }) => {
	const [items, setItems_internal] = useState(() => loadItems());

	const setItems: Dispatch<SetStateAction<ItemProps[]>> = useCallback(items => {
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
		(item: ItemProps) => {
			setItems(items => [...items, item]);
		},
		[setItems]
	);

	const removeItem = useCallback(
		(id: string) => {
			setItems(items => {
				items = items.filter(item => item.id !== id);
				items = items.map(item => ({
					...item,
					dependencies: item.dependencies.filter(dep => dep !== id),
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
							? { ...item, dependencies: [...item.dependencies, dependencyId] }
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
			if (item) {
				setItems(items =>
					items.map(item =>
						item.id === id
							? {
									...item,
									dependencies: item.dependencies.filter(
										dep => dep !== dependencyId
									),
							  }
							: item
					)
				);
			}
		},
		[getItem, setItems]
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
		<ItemsStoreContext.Provider value={value}>
			{children}
		</ItemsStoreContext.Provider>
	);
};

export default ItemsStoreProvider;
