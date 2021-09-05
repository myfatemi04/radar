import { createContext } from 'react';
import ItemStore, { ItemStoreState } from './ItemStore';

export type ItemsStoreContextProps = {
	store: ItemStore;
	state: ItemStoreState;
};

const ItemStoreContext = createContext<ItemsStoreContextProps>({
	store: new ItemStore([]),
	state: new ItemStoreState(),
});

export default ItemStoreContext;
