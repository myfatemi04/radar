import { ItemProps } from './types';

export default function createEmptyItem(
	initialProps: Partial<ItemProps>
): ItemProps {
	return {
		id: Math.random().toString(36).substr(2, 9),
		name: '',
		target: null,
		description: '',
		dependencyIds: [],
		completedAt: null,
		...initialProps,
	};
}
