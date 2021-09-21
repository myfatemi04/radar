import { useCallback, useContext, useMemo } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import Path from './Path';
import { useSetRootItemId } from './RouteHooks';
import useItem from './useItem';

export function RootItemTreeViewNode({
	itemId,
	hasCompletedParent = false,
}: {
	itemId: string;
	hasCompletedParent?: boolean;
}) {
	const item = useItem(itemId);
	const { store } = useContext(ItemStoreContext);
	const setRootItemId = useSetRootItemId();

	const toggleCompletion = useCallback(
		() => store.toggleCompleted(itemId),
		[itemId, store]
	);

	const navigateToItem = useCallback(
		() => setRootItemId(itemId),
		[itemId, setRootItemId]
	);

	if (!item) {
		return null;
	}

	const explicitlyCompleted = item.completedAt !== null;

	return (
		<div style={{ paddingTop: '0.5rem', paddingLeft: '0.5rem' }}>
			<input
				type='checkbox'
				checked={explicitlyCompleted}
				// Disable checkbox if parent is completed
				disabled={hasCompletedParent}
				readOnly={hasCompletedParent}
				onChange={hasCompletedParent ? undefined : toggleCompletion}
			/>{' '}
			<span
				style={{
					color: explicitlyCompleted
						? '#88ff88'
						: hasCompletedParent
						? 'gray'
						: undefined,
					fontStyle:
						explicitlyCompleted || hasCompletedParent ? 'italic' : undefined,
				}}
			>
				{item.name}
			</span>{' '}
			<span onClick={navigateToItem} style={{ cursor: 'pointer' }}>
				(view)
			</span>
			{item.target && <span> - {item.target.toLocaleString()}</span>}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					paddingLeft: '0.5rem',
				}}
			>
				{item.dependencyIds.map(dependencyId => (
					<RootItemTreeViewNode
						key={dependencyId}
						itemId={dependencyId}
						hasCompletedParent={hasCompletedParent || explicitlyCompleted}
					/>
				))}
			</div>
		</div>
	);
}

export default function RootItemTreeView() {
	const rootItemId = useContext(RootItemIdContext);
	const item = useItem(rootItemId);
	const { state } = useContext(ItemStoreContext);

	const pathsFromAbsoluteRoot = useMemo(() => {
		const paths = [];
		for (const [path, otherItem] of state.bfs('0')) {
			if (rootItemId === otherItem.id) {
				if (path.length > 1) {
					paths.push(path.slice(0, path.length - 1));
				}
			}
		}
		return paths;
	}, [rootItemId, state]);

	if (!item) {
		return <>No item found</>;
	}

	return (
		<>
			{pathsFromAbsoluteRoot.map((path, index) => (
				<Path style={{ marginTop: '0.25rem' }} items={path} key={index} />
			))}
			<RootItemTreeViewNode itemId={rootItemId} />
		</>
	);
}
