import { useCallback, useContext, useMemo, useState } from 'react';
import { CommandPaletteContext } from './AppContexts';
import { CommandPaletteWrapper } from './CommandPalette';
import GoalProgressBar from './GoalProgressBar';
import ItemStoreContext from './ItemStoreContext';
import RootItemGoalsView from './RootItemGoalsView';
import RootItemInformationSection from './RootItemInformationSection';
import RootItemPriorityView from './RootItemPriorityView';
import RootItemSearchBar from './RootItemSearchBar';
import RootItemTreeView from './RootItemTreeView';
import { useBack, useForward } from './RouteHooks';
import { ItemProps } from './types';
import useKeybind from './useKeybind';

enum RootItemView {
	Goals = 'goals',
	Priority = 'priority',
	Tree = 'tree',
}

export default function RootItem({ item }: { item: ItemProps }) {
	const [view, setView] = useState(RootItemView.Goals);

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
	const forward = useForward();
	const back = useBack();

	useKeybind('/', e => {
		setCommandPaletteOpen(true);
	});
	useKeybind('Escape', e => {
		setCommandPaletteOpen(false);
	});
	useKeybind('ArrowLeft', () => back());
	useKeybind('ArrowRight', () => forward());

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
			<RootItemSearchBar />

			{commandPaletteOpen && (
				<CommandPaletteContext.Provider
					value={[commandPaletteOpen, setCommandPaletteOpen]}
				>
					<CommandPaletteWrapper itemIndexToItemId={indexToItemId} />
				</CommandPaletteContext.Provider>
			)}

			<div style={{ marginTop: '0.5rem', fontFamily: 'monospace' }}>
				<span
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
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
						marginLeft: '1rem',
						textDecoration:
							view === RootItemView.Priority ? 'underline' : 'none',
					}}
					onClick={() => setView(RootItemView.Priority)}
				>
					Priority
				</span>
				<span
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
						cursor: 'pointer',
						marginLeft: '1rem',
						textDecoration: view === RootItemView.Tree ? 'underline' : 'none',
					}}
					onClick={() => setView(RootItemView.Tree)}
				>
					Tree
				</span>
			</div>

			{item.dependencyIds.length > 0 && <GoalProgressBar item={item} />}

			{view === RootItemView.Goals ? (
				<RootItemGoalsView item={item} />
			) : view === RootItemView.Priority ? (
				<RootItemPriorityView leaves={leaves} />
			) : (
				view === RootItemView.Tree && <RootItemTreeView />
			)}
		</div>
	);
}
