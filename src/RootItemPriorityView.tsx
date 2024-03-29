// Lists items from most specific (and immediate) to broadest

import { useContext, useMemo } from 'react';
import ItemStoreContext from './ItemStoreContext';
import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItemPriorityView({
	leaves,
}: {
	leaves: [string[][], ItemProps][];
}) {
	const { state } = useContext(ItemStoreContext);

	const sortedLeaves = useMemo(() => {
		const defaultTime = Infinity;
		return [...leaves].sort(([, a], [, b]) => {
			const firstCompleted = state.isCompleted(a.id);
			const secondCompleted = state.isCompleted(b.id);
			if (firstCompleted && !secondCompleted) {
				return 1;
			}

			if (!firstCompleted && secondCompleted) {
				return -1;
			}

			// Both are completed, or both are not completed
			// Sort by time

			const firstTime = state.getEarliestTarget(a.id)[1] ?? defaultTime;
			const secondTime = state.getEarliestTarget(b.id)[1] ?? defaultTime;

			// Sort by soonest to latest
			return firstTime < secondTime ? -1 : 1;
		});
	}, [leaves, state]);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{sortedLeaves.map(
				([paths, leaf], index) =>
					leaf && (
						<SubItem key={leaf.id} item={leaf} index={index} paths={paths} />
					)
			)}
		</div>
	);
}
