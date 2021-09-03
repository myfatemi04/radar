import { useContext, useMemo } from 'react';
import ItemsStoreContext from './ItemsStoreContext';

function useItem(id: string) {
	const { getItem } = useContext(ItemsStoreContext);

	return useMemo(() => getItem(id), [getItem, id]);
}

export default useItem;
