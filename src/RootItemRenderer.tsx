import RootItem from './RootItem';
import useItem from './useItem';

export default function RootItemRenderer({ id }: { id: string }) {
	const item = useItem(id);
	if (!item) {
		return null;
	}
	return <RootItem item={item} />;
}
