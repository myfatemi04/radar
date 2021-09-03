import {
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from 'react';
import AppContext, { AppContextProps } from './AppContext';
import { CommandPaletteWrapper } from './CommandPalette';
import Item from './Item';
import { ItemProps } from './types';
import useKeybind from './useKeybind';

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

function App() {
	const [items, setItems_internal] = useState(() => loadItems());
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

	useKeybind(
		'c',
		useCallback(() => {
			setCommandPaletteOpen(true);
		}, [])
	);

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

	const value: AppContextProps = useMemo(
		() => ({
			items,
			setItems,
			getItem,
			addItem,
			removeItem,
			addDependencyToItem,
			removeDependencyFromItem,
			commandPaletteOpen,
			setCommandPaletteOpen,
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
			commandPaletteOpen,
			toggleItemCompleted,
		]
	);

	const root = useMemo(() => getItem('0'), [getItem]);

	return (
		<AppContext.Provider value={value}>
			{commandPaletteOpen && <CommandPaletteWrapper />}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: 'calc(min(30rem, 50vw))',
					margin: '1rem auto',
				}}
			>
				<h1>Planner</h1>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{root?.dependencies.map(id => (
						<Item key={id} item={getItem(id)!} />
					))}
				</div>
			</div>
		</AppContext.Provider>
	);
}

export default App;
