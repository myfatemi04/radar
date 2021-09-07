import * as immutable from 'immutable';
import createEmptyItem from './createEmptyItem';
import { ItemProps } from './types';

export class ItemStoreState extends immutable.Record({
	items: immutable.Map<string, ItemProps>(),
}) {
	isCompleted(id: string): boolean {
		const item = this.items.get(id);
		if (!item) {
			return false;
		}
		if (item.completedAt !== null) {
			return true;
		}
		if (item.dependencyIds.length === 0) {
			return false;
		}

		for (const child of item.dependencyIds) {
			if (!this.isCompleted(child)) {
				return false;
			}
		}

		return true;
	}

	getItem(id: string): ItemProps | undefined {
		return this.items.get(id);
	}

	isAncestor(parent: string, child: string): boolean {
		for (const [, item] of this.bfs(parent)) {
			if (item.id === child) {
				return true;
			}
		}
		return false;
	}

	*bfs(id: string): IterableIterator<[string[], ItemProps]> {
		const queue: [string[], string][] = [[['0'], id]];
		const visited = new Set<string>();
		while (queue.length) {
			const [path, current] = queue.shift()!;
			if (visited.has(current)) {
				continue;
			}
			visited.add(current);
			const item = this.getItem(current);
			if (item) {
				yield [path, item];
				for (const child of item.dependencyIds) {
					queue.push([[...path, child], child]);
				}
			} else {
				console.warn('Item not found:', current);
			}
		}
	}

	*leaves(id: string): IterableIterator<[string[], ItemProps]> {
		for (const [path, item] of this.bfs(id)) {
			if (item.dependencyIds.length === 0) {
				yield [path, item];
			}
		}
	}

	*search(query: string, root: string = '0'): IterableIterator<ItemProps> {
		query = query.toLowerCase();
		for (const [, item] of this.bfs(root)) {
			const name = item.name.toLowerCase();
			if (name.includes(query)) {
				yield item;
			}
		}
	}

	getIndirectCompletionProgress(id: string): [number, number] {
		const item = this.getItem(id);
		if (!item) {
			return [0, 0];
		}

		let completed = 0;
		let total = 0;

		for (const [, item] of this.bfs(id)) {
			if (item.dependencyIds.length === 0) {
				completed += item.completedAt !== null ? 1 : 0;
				total += 1;
			}
		}

		if (item.completedAt !== null) {
			return [total, total];
		}

		return [completed, total];
	}

	*getAllPathways(id: string, rootItemId = '0'): IterableIterator<string[]> {
		for (const [path, item] of this.bfs(rootItemId)) {
			if (item.id === id) {
				yield path;
			}
		}
	}

	getEarliestTarget(id: string): [string, Date] | [null, null] {
		let earliestId: string | null = null;
		let earliest: Date | null = null;
		for (const path of this.getAllPathways(id)) {
			for (const itemId of path) {
				const item = this.getItem(itemId);
				if (!item?.target) {
					continue;
				}
				if (earliest === null) {
					earliest = item.target;
					earliestId = item.id;
				} else if (earliest.getTime() > item.target.getTime()) {
					earliest = item.target;
					earliestId = item.id;
				}
			}
		}
		// @ts-expect-error
		return [earliestId, earliest];
	}
}

class ItemStore {
	private _state: ItemStoreState = new ItemStoreState();
	private listeners = new Set<(state: ItemStoreState) => void>();
	set state(state: ItemStoreState) {
		this._state = state;
		this.listeners.forEach(listener => listener(state));
	}

	get state(): ItemStoreState {
		return this._state;
	}

	subscribe(listener: (state: ItemStoreState) => void) {
		this.listeners.add(listener);
		listener(this._state);
	}

	unsubscribe(listener: (state: ItemStoreState) => void) {
		this.listeners.delete(listener);
	}

	parents: Map<string, Set<string>> = new Map();
	constructor(items: ItemProps[]) {
		this.state = this.state.set(
			'items',
			immutable.Map(items.map(item => [item.id, item]))
		);
		for (const item of items) {
			for (const dependencyId of item.dependencyIds) {
				if (!this.parents.has(dependencyId)) {
					this.parents.set(dependencyId, new Set());
				}
				this.parents.get(dependencyId)!.add(item.id);
			}
		}
	}

	addItem(item: ItemProps, parentId: string) {
		item.dependencyIds.forEach(dependencyId => {
			if (!this.parents.has(dependencyId)) {
				this.parents.set(dependencyId, new Set());
			}
			this.parents.get(dependencyId)!.add(item.id);
		});
		this.state = this.state.set('items', this.state.items.set(item.id, item));
		this.addDependencyToItem(parentId, item.id);
	}

	removeItem(id: string) {
		let state = this.state;
		for (const parentId of this.parents.get(id) ?? []) {
			const parent = state.getItem(parentId)!;
			state = state.set(
				'items',
				state.items.set(parentId, {
					...parent,
					dependencyIds: parent.dependencyIds.filter(
						dependencyId => dependencyId !== id
					),
				})
			);
		}
		this.parents.delete(id);

		state = state.set('items', this.state.items.delete(id));

		this.state = state;
	}

	addDependencyToItem(parentId: string, dependencyId: string) {
		// Add parentId as a parent of dependencyId
		if (!this.parents.has(dependencyId)) {
			this.parents.set(dependencyId, new Set());
		}
		this.parents.get(dependencyId)!.add(parentId);

		// Add dependencyId as a dependency of parentId
		const parent = this.state.getItem(parentId)!;
		this.state = this.state.set(
			'items',
			this.state.items.set(parentId, {
				...parent,
				dependencyIds: [...parent.dependencyIds, dependencyId],
			})
		);
	}

	removeDependencyFromItem(id: string, dependencyId: string) {
		const item = this.state.getItem(id);
		const dependency = this.state.getItem(dependencyId);
		if (item && dependency) {
			const parents = this.parents.get(dependencyId);
			if (!parents || (parents.size === 1 && parents.has(id))) {
				this.removeItem(dependencyId);
			}
		}
		if (item) {
			this.state = this.state.set(
				'items',
				this.state.items.set(id, {
					...item,
					dependencyIds: item.dependencyIds.filter(id => id !== dependencyId),
				})
			);
		}
	}

	toggleCompleted(id: string) {
		const item = this.state.getItem(id);
		if (item) {
			this.state = this.state.set(
				'items',
				this.state.items.set(id, {
					...item,
					completedAt: item.completedAt ? null : new Date(),
				})
			);
		}
	}

	setItemTarget(id: string, target: Date | null) {
		const item = this.state.getItem(id);
		if (item) {
			this.state = this.state.set(
				'items',
				this.state.items.set(id, {
					...item,
					target,
				})
			);
		}
	}

	setItemDescription(id: string, description: string) {
		const item = this.state.getItem(id);
		if (item) {
			this.state = this.state.set(
				'items',
				this.state.items.set(id, {
					...item,
					description,
				})
			);
		}
	}

	setItemName(id: string, name: string) {
		const item = this.state.getItem(id);
		if (item) {
			this.state = this.state.set(
				'items',
				this.state.items.set(id, {
					...item,
					name,
				})
			);
		}
	}

	duplicateItem(
		id: string,
		parentId: string,
		createSeparateDependencies: boolean = true
	) {
		this.duplicateItemInternal(id, parentId, createSeparateDependencies, true);
	}

	private duplicateItemInternal(
		id: string,
		parentId: string,
		createSeparateDependencies: boolean,
		addCopyToName: boolean
	) {
		const item = this.state.getItem(id);
		if (item) {
			const newItem = createEmptyItem({
				...item,
				name: addCopyToName ? `${item.name} (copy)` : item.name,
				dependencyIds: createSeparateDependencies ? [] : item.dependencyIds,
				completedAt: null,
			});
			this.state = this.state.set(
				'items',
				this.state.items.set(newItem.id, newItem)
			);
			this.addDependencyToItem(parentId, newItem.id);
			if (createSeparateDependencies) {
				for (let dependencyId of item.dependencyIds) {
					// Duplicate the dependency and add it to the new item
					this.duplicateItemInternal(dependencyId, newItem.id, true, false);
				}
			}
		}
	}
}

export default ItemStore;
