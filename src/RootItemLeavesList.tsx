// Lists items from most specific (and immediate) to broadest

import { useMemo } from 'react';
import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItemPriorityView({
	leaves,
}: {
	leaves: [string[], ItemProps][];
}) {
	const sortedLeaves = useMemo(() => {
		const defaultTime = Infinity;
		return [...leaves].sort(([, a], [, b]) => {
			const firstTime = a.target?.getTime() ?? defaultTime;
			const secondTime = b.target?.getTime() ?? defaultTime;

			// Sort by soonest to latest
			return firstTime - secondTime;
		});
	}, [leaves]);

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<h1 style={{ marginTop: '1rem', marginBottom: 0 }}>Priority</h1>
			{sortedLeaves.map(
				([path, leaf], index) =>
					leaf && (
						<SubItem key={leaf.id} item={leaf} index={index} path={path} />
					)
			)}
		</div>
	);
}
