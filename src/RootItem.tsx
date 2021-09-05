import { useCallback, useContext, useState } from 'react';
import ItemStoreContext from './ItemStoreContext';
import { findLeaves } from './ItemUtilities';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import RootItemGoalsView from './RootItemDirectDependenciesList';
import RootItemInformationSection from './RootItemInformationSection';
import RootItemSubItemsBottomUpView from './RootItemLeavesList';
import { ItemProps } from './types';

enum RootItemView {
	Goals = 'goals',
	Priority = 'priority',
}

export default function RootItem({ item }: { item: ItemProps }) {
	const [view, setView] = useState(RootItemView.Goals);

	const back = useContext(NavigateToPreviousRootItemContext);

	const { items } = useContext(ItemStoreContext);

	const leaves = findLeaves(items, item.id);

	// eslint-disable-next-line
	const indexToItemId = useCallback(
		index => {
			if (view === RootItemView.Goals) {
				return item.dependencyIds[index] ?? null;
			} else {
				const leaf = leaves[index];
				if (leaf) {
					return leaf[1].id;
				} else {
					return null;
				}
			}
		},
		[item.dependencyIds, leaves, view]
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				padding: '1rem',
			}}
		>
			<RootItemInformationSection item={item} />

			{/* <CommandPalette itemIndexToItemId={indexToItemId} /> */}

			<div style={{ display: 'flex', marginTop: '1rem' }}>
				<button
					style={{
						padding: '0.5rem 1rem',
						marginRight: '1rem',
					}}
					onClick={back}
				>
					Back
				</button>

				<button
					style={{
						padding: '0.5rem 1rem',
						marginRight: '1rem',
					}}
					onClick={() => setView(RootItemView.Goals)}
				>
					Goals
				</button>
				<button
					style={{
						padding: '0.5rem 1rem',
					}}
					onClick={() => setView(RootItemView.Priority)}
				>
					Priority
				</button>
			</div>

			{view === RootItemView.Goals ? (
				<RootItemGoalsView item={item} />
			) : (
				<RootItemSubItemsBottomUpView leaves={leaves} />
			)}
		</div>
	);
}
