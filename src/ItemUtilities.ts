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

export function useIndirectDependencyCompletionStatus(
	id: string
): [number, number] {
	const { getItem } = useContext(ItemStoreContext);

	return useMemo(() => {
		return getIndirectDependencyCompletionStatus(id, getItem);
	}, [getItem, id]);
}
