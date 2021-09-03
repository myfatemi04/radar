import { useContext } from 'react';
import ItemStoreContext from './ItemStoreContext';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import RootItemSearchBar from './RootItemSearchBar';
import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItem({ item }: { item: ItemProps }) {
	const { getItem, removeDependencyFromItem } = useContext(ItemStoreContext);

	const back = useContext(NavigateToPreviousRootItemContext);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				padding: '1rem',
			}}
		>
			<h1>{item.name}</h1>
			<div style={{ marginBottom: '1rem' }}>
				<button style={{ padding: '0.5rem 1rem' }} onClick={back}>
					Back
				</button>
			</div>

			<RootItemSearchBar />

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{item.dependencyIds.map((dependencyId, index) => {
					const dependency = getItem(dependencyId);
					if (dependency) {
						return (
							<SubItem key={dependencyId} item={dependency} index={index} />
						);
					} else {
						removeDependencyFromItem(item.id, dependencyId);
						return null;
					}
				})}
			</div>
		</div>
	);
}
