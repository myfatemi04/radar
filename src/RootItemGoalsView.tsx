// Lists items from broadest to most specific

import { useContext } from 'react';
import ItemStoreContext from './ItemStoreContext';
import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItemGoalsView({ item }: { item: ItemProps }) {
	const { store, state } = useContext(ItemStoreContext);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{item.dependencyIds.map((dependencyId, index) => {
				const dependency = state.getItem(dependencyId);
				if (dependency) {
					return (
						<SubItem
							key={dependencyId}
							item={dependency}
							index={index}
							path={[]}
						/>
					);
				} else {
					store.removeDependencyFromItem(item.id, dependencyId);
					return null;
				}
			})}
		</div>
	);
}
