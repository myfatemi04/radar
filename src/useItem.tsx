import { useContext, useMemo } from 'react';
import ItemStoreContext from './ItemStoreContext';

function useItem(id: string) {
	const { getItem } = useContext(ItemStoreContext);

	return useMemo(() => getItem(id), [getItem, id]);
}

export default useItem;
