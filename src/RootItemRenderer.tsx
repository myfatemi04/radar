import { useEffect } from 'react';
import RootItem from './RootItem';
import useItem from './useItem';

export default function RootItemRenderer({ id }: { id: string }) {
	const item = useItem(id);

	useEffect(() => {
		if (item?.name) {
			document.title = `${item.name} | Radar`;
		} else {
			document.title = 'Radar';
		}
	}, [item]);

	if (!item) {
		return null;
	}
	return <RootItem item={item} />;
}
