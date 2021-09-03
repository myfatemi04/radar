// Lists items from most specific (and immediate) to broadest

import SubItem from './SubItem';
import { ItemProps } from './types';

export default function RootItemSubItemsBottomUpView({
	leaves,
}: {
	leaves: [string[], ItemProps][];
}) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<h1 style={{ marginTop: '1rem', marginBottom: 0 }}>Priority</h1>
			{leaves.map(([path, leaf], index) => {
				if (leaf) {
					return (
						<SubItem key={leaf.id} item={leaf} index={index} path={path} />
					);
				} else {
					return null;
				}
			})}
		</div>
	);
}
