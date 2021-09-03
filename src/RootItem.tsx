import { useContext } from 'react';
import Item from './Item';
import ItemsStoreContext from './ItemsStoreContext';
import { ItemProps } from './types';

export default function RootItem({ item }: { item: ItemProps }) {
	const { getItem } = useContext(ItemsStoreContext);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: 'calc(min(30rem, 50vw))',
				margin: '1rem auto',
			}}
		>
			<h1>{item.name}</h1>

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{item.dependencyIds.map(id => {
					const item = getItem(id);
					if (item) {
						return <Item key={id} item={item} />;
					} else {
						return null;
					}
				})}
			</div>
		</div>
	);
}
