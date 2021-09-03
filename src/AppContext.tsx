import { createContext, Dispatch, SetStateAction } from 'react';
import { ItemProps } from './types';

export type AppContextProps = {
	items: ItemProps[];
	setItems: Dispatch<SetStateAction<ItemProps[]>>;
	removeItem: (id: string) => void;
	addItem: (item: ItemProps) => void;
	getItem: (id: string) => ItemProps | undefined;
	addDependencyToItem: (id: string, dependency: string) => void;
	removeDependencyFromItem: (id: string, dependency: string) => void;
	commandPaletteOpen: boolean;
	setCommandPaletteOpen: Dispatch<SetStateAction<boolean>>;
	toggleItemCompleted: (id: string) => void;
};

const AppContext = createContext<AppContextProps>({
	items: [],
	setItems: (() => {}) as Dispatch<SetStateAction<ItemProps[]>>,
	removeItem(id: string) {
		console.log('removeItem', id);
	},
	addItem(item: ItemProps) {
		console.log('addItem', item);
	},
	getItem(id: string): ItemProps | undefined {
		console.log('getItem', id);
		return undefined;
	},
	addDependencyToItem(id: string, dependency: string) {
		console.log('addDependencyToItem', id, dependency);
	},
	removeDependencyFromItem(id: string, dependency: string) {
		console.log('removeDependencyFromItem', id, dependency);
	},
	commandPaletteOpen: false,
	setCommandPaletteOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
	toggleItemCompleted(id: string) {
		console.log('toggleItemCompleted', id);
	},
});

export default AppContext;
