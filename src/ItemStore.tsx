import * as immutable from 'immutable';
import { ItemProps } from './types';

export class ItemStoreState extends immutable.Record({
	items: immutable.Map<string, ItemProps>(),
}) {
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
		const queue: [string[], string][] = [[[], id]];
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
			}
			for (const child of item!.dependencyIds) {
				queue.push([[...path, current], child]);
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
}

export default ItemStore;