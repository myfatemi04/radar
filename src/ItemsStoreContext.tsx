import { createContext, Dispatch, SetStateAction } from 'react';
import { ItemProps } from './types';

export type ItemsStoreContextProps = {
	items: ItemProps[];
	setItems: Dispatch<SetStateAction<ItemProps[]>>;
	removeItem: (id: string) => void;
	addItem: (item: ItemProps) => void;
	getItem: (id: string) => ItemProps | undefined;
	addDependencyToItem: (id: string, dependency: string) => void;
	removeDependencyFromItem: (id: string, dependency: string) => void;
	toggleItemCompleted: (id: string) => void;
};

const ItemsStoreContext = createContext<ItemsStoreContextProps>({
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
	toggleItemCompleted(id: string) {
		console.log('toggleItemCompleted', id);
	},
});

export default ItemsStoreContext;
