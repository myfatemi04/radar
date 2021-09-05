import { useCallback, useContext, useMemo, useState } from 'react';
import { CommandPaletteContext } from './AppContexts';
import { CommandPaletteWrapper } from './CommandPalette';
import GoalProgressBar from './GoalProgressBar';
import ItemStoreContext from './ItemStoreContext';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import RootItemGoalsView from './RootItemGoalsView';
import RootItemInformationSection from './RootItemInformationSection';
import RootItemPriorityView from './RootItemPriorityView';
import { ItemProps } from './types';
import useKeybind from './useKeybind';

enum RootItemView {
	Goals = 'goals',
	Priority = 'priority',
}

export default function RootItem({ item }: { item: ItemProps }) {
	const [view, setView] = useState(RootItemView.Goals);

	const back = useContext(NavigateToPreviousRootItemContext);

	const { state } = useContext(ItemStoreContext);

	const leaves = useMemo(
		() => Array.from(state.leaves(item.id)),
		[item.id, state]
	);

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

	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

	useKeybind('/', e => {
		setCommandPaletteOpen(true);
	});
	useKeybind('Escape', e => {
		setCommandPaletteOpen(false);
	});

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

			{commandPaletteOpen && (
				<CommandPaletteContext.Provider
					value={[commandPaletteOpen, setCommandPaletteOpen]}
				>
					<CommandPaletteWrapper itemIndexToItemId={indexToItemId} />
				</CommandPaletteContext.Provider>
			)}

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
			</div>

			<div style={{ marginTop: '0.5rem', fontFamily: 'monospace' }}>
				<span
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
						marginRight: '1rem',
						cursor: 'pointer',
						textDecoration: view === RootItemView.Goals ? 'underline' : 'none',
					}}
					onClick={() => setView(RootItemView.Goals)}
				>
					Goals
				</span>
				<span
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
						cursor: 'pointer',
						textDecoration:
							view === RootItemView.Priority ? 'underline' : 'none',
					}}
					onClick={() => setView(RootItemView.Priority)}
				>
					Priority
				</span>
			</div>

			{item.dependencyIds.length > 0 && <GoalProgressBar item={item} />}

			{view === RootItemView.Goals ? (
				<RootItemGoalsView item={item} />
			) : (
				<RootItemPriorityView leaves={leaves} />
			)}
		</div>
	);
}
