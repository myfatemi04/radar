import { useMemo } from 'react';
import { useContext, useCallback } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import Path from './Path';
import { useSetRootItemId } from './RouteHooks';
import useItem from './useItem';

export function RootItemTreeViewNode({ itemId }: { itemId: string }) {
	const item = useItem(itemId);
	const { state, store } = useContext(ItemStoreContext);
	const setRootItemId = useSetRootItemId();

	const onCheckboxClicked = useCallback(() => {
		store.toggleCompleted(itemId);
	}, [itemId, store]);

	const onTitleClicked = useCallback(() => {
		setRootItemId(itemId);
	}, [itemId, setRootItemId]);

	if (!item) {
		return null;
	}

	return (
		<div style={{ padding: '0.5rem' }}>
			<span onClick={onTitleClicked} style={{ cursor: 'pointer' }}>
				{item.name}
			</span>{' '}
			<input
				type='checkbox'
				checked={state.isCompleted(itemId)}
				onClick={onCheckboxClicked}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					paddingLeft: '0.5rem',
				}}
			>
				{item.dependencyIds.map(dependencyId => (
					<RootItemTreeViewNode key={dependencyId} itemId={dependencyId} />
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
