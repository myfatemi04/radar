import { useContext, useMemo } from 'react';
import ItemStoreContext from './ItemStoreContext';

function useItem(id: string) {
	const { state } = useContext(ItemStoreContext);

	return useMemo(() => state.getItem(id), [id, state]);
}

export default useItem;
