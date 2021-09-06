import { ItemProps } from './types';

export default function createEmptyItem(
	initialProps: Partial<ItemProps>
): ItemProps {
	return {
		name: '',
		target: null,
		description: '',
		dependencyIds: [],
		completedAt: null,
		...initialProps,
		id: Math.random().toString(36).substr(2, 9),
	};
}
