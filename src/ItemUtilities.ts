import { useCallback, useContext, useMemo } from 'react';
import createEmptyItem from './createEmptyItem';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

export function useCreateDependencyWithName(id: string) {
	const { store } = useContext(ItemStoreContext);

	const createItemAsDependency = useCallback(
		(name: string) => {
			store.addItem(createEmptyItem({ name }), id);
		},
		[id, store]
	);

	return createItemAsDependency;
}

export function useItemsSearchResults(text: string, rootItemId: string) {
	const { state } = useContext(ItemStoreContext);

	return useMemo(() => {
		return Array.from(state.search(text, rootItemId));
	}, [state, text, rootItemId]);
}

export function useIndirectDependencyCompletionStatus(
	id: string
): [number, number] {
	const { state } = useContext(ItemStoreContext);

	return useMemo(() => state.getIndirectCompletionProgress(id), [id, state]);
}

export function getIndirectDependencyCompletionStatus(
	id: string,
	getItem: (id: string) => ItemProps | undefined
): [number, number] {
	const item = getItem(id);
	if (!item) {
		return [0, 0];
	}
	const { dependencyIds } = item;
	if (dependencyIds.length === 0) {
		if (item.completedAt === null) {
			return [0, 1];
		} else {
			return [1, 1];
		}
	}

	let completed = 0;
	let total = 0;

	for (const dependencyId of dependencyIds) {
		const [dependencyCompleted, dependencyTotal] =
			getIndirectDependencyCompletionStatus(dependencyId, getItem);
		completed += dependencyCompleted;
		total += dependencyTotal;
	}

	if (item.completedAt !== null) {
		return [total, total];
	}

	return [completed, total];
}

export function findLeaves(
	items: ItemProps[],
	rootId: string
): [string[], ItemProps][] {
	const visited = new Set<string>();
	const queue: [string[], string][] = [[[], rootId]];
	const results: [string[], ItemProps][] = [];
	while (queue.length > 0) {
		const [prev, nodeId] = queue.shift()!;
		if (visited.has(nodeId)) {
			continue;
		}

		const node = items.find(item => item.id === nodeId);
		if (!node) {
			continue;
		}

		if (node.dependencyIds.length === 0) {
			results.push([[...prev, nodeId], node]);
		}

		for (const dependencyId of node.dependencyIds) {
			queue.push([[...prev, nodeId], dependencyId]);
		}
	}

	return results;
}

export function findPath(
	sourceItemId: string,
	destinationItemId: string,
	getItem: (id: string) => ItemProps | undefined,
	visited: Set<string> = new Set([sourceItemId])
): string[] | null {
	const sourceItem = getItem(sourceItemId);
	if (!sourceItem) {
		return null;
	}

	if (sourceItemId === destinationItemId) {
		return [sourceItemId];
	}

	const dependencyIds = sourceItem.dependencyIds;
	if (dependencyIds.length === 0) {
		return null;
	}

	for (const dependencyId of dependencyIds) {
		if (visited.has(dependencyId)) {
			continue;
		}
		visited.add(dependencyId);
		const path = findPath(dependencyId, destinationItemId, getItem);
		visited.delete(dependencyId);
		if (path) {
			return [sourceItemId, ...path];
		}
	}

	return null;
}

export function generateParentsMap(
	items: ItemProps[]
): Map<string, Set<string>> {
	const parentsMap = new Map<string, Set<string>>();
	for (const item of items) {
		const dependencyIds = item.dependencyIds;
		for (const dependencyId of dependencyIds) {
			if (!parentsMap.has(dependencyId)) {
				parentsMap.set(dependencyId, new Set());
			}
			parentsMap.get(dependencyId)!.add(item.id);
		}
	}

	return parentsMap;
}
