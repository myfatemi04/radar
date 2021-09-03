// Lists items from broadest to most specific

import { useContext } from 'react';
import ItemStoreContext from './ItemStoreContext';
import { useIndirectDependencyCompletionStatus } from './ItemUtilities';
import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItemGoalsView({ item }: { item: ItemProps }) {
	const { getItem, removeDependencyFromItem } = useContext(ItemStoreContext);
	const [completed, total] = useIndirectDependencyCompletionStatus(item.id);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<h1 style={{ marginTop: '1rem', marginBottom: 0 }}>Goals</h1>

			<div
				style={{
					width: '100%',
					height: '2rem',
					padding: '0.5rem',
					marginTop: '0.5rem',
					backgroundImage: 'linear-gradient(90deg, #aa50ff, #f74424)',
					backgroundSize: (completed / total) * 100 + '% 100%',
					backgroundRepeat: 'no-repeat',
					transition: 'background-size 500ms ease',
					userSelect: 'none',
				}}
			>
				{((completed / total) * 100).toFixed(0) + '%'}
			</div>

			{item.dependencyIds.map((dependencyId, index) => {
				const dependency = getItem(dependencyId);
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
					removeDependencyFromItem(item.id, dependencyId);
					return null;
				}
			})}
		</div>
	);
}
