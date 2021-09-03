import { useCallback, useContext, useMemo } from 'react';
import createEmptyItem from './createEmptyItem';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

export function useCreateDependencyWithName(id: string) {
	const { addItem } = useContext(ItemStoreContext);

	const createItemAsDependency = useCallback(
		(name: string) => addItem(createEmptyItem({ name }), id),
		[addItem, id]
	);

	return createItemAsDependency;
}

export function getItemsSearchResults(
	items: ItemProps[],
	text: string,
	rootItemId: string
) {
	const getItem = (id: string) => items.find(item => item.id === id);
	const searchKey = text.toLowerCase();
	if (!searchKey) {
		return [];
	}
	return items.filter(other => {
		if (other.id === rootItemId) {
			return false;
		}

		// If the subitem is a parent of this item, there would be a circular dependency
		if (isDescendant(other.id, rootItemId, getItem)) {
			return false;
		}

		// If the subitem is already a descendant of this item, we shouldn't suggest adding it
		if (isDescendant(rootItemId, other.id, getItem)) {
			return false;
		}

		if (
			other.name.toLowerCase().includes(searchKey) ||
			other.description.toLowerCase().includes(searchKey)
		) {
			return true;
		}

		return false;
	});
}

export function useItemsSearchResults(text: string, root: ItemProps) {
	const { items, getItem } = useContext(ItemStoreContext);

	return useMemo(() => {
		const searchKey = text.toLowerCase();
		if (!searchKey) {
			return [];
		}
		return items.filter(other => {
			if (other.id === root.id) {
				return false;
			}

			// If the subitem is a parent of this item, there would be a circular dependency
			if (isDescendant(other.id, root.id, getItem)) {
				return false;
			}

			// If the subitem is already a descendant of this item, we shouldn't suggest adding it
			if (isDescendant(root.id, other.id, getItem)) {
				return false;
			}

			if (
				other.name.toLowerCase().includes(searchKey) ||
				other.description.toLowerCase().includes(searchKey)
			) {
				return true;
			}

			return false;
		});
	}, [text, items, root.id, getItem]);
}

export function useIndirectDependencyCompletionStatus(
	id: string
): [number, number] {
	const { getItem } = useContext(ItemStoreContext);

	return useMemo(() => {
		return getIndirectDependencyCompletionStatus(id, getItem);
	}, [getItem, id]);
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

export function isDescendant(
	maybeAncestorId: string,
	maybeDescendantId: string,
	getItem: (id: string) => ItemProps | undefined
): boolean {
	if (maybeAncestorId === maybeDescendantId) {
		return true;
	}
	const ancestor = getItem(maybeAncestorId);
	if (!ancestor) {
		return false;
	}

	const dependencyForIds = getItem(maybeDescendantId)?.dependencyForIds;
	if (!dependencyForIds) {
		return false;
	}

	// Check if any of the dependency's parents are descendents of the ancestor
	return dependencyForIds.some(id =>
		isDescendant(maybeAncestorId, id, getItem)
	);
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
