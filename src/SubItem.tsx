import { useContext, useDebugValue } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { useIndirectDependencyCompletionStatus } from './ItemUtilities';
import { ItemProps } from './types';

function SubItem({
	item,
	index,
	path,
}: {
	item: ItemProps;
	index: number;
	path: string[];
}) {
	useDebugValue(item);

	const { removeDependencyFromItem, toggleItemCompleted, getItem } =
		useContext(ItemStoreContext);

	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);

	const [completed, total] = useIndirectDependencyCompletionStatus(item.id);

	const hasDependencies = item.dependencyIds.length > 0;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginTop: '1rem',
				border: '1px solid white',
				padding: '0.5rem',
			}}
		>
			{path && (
				<span style={{ fontFamily: 'monospace' }}>
					{path
						.slice(0, path.length - 1)
						.map(id => getItem(id)!.name)
						.join(' > ')}
				</span>
			)}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<pre>{index}</pre>
				<h2
					style={{ cursor: 'pointer', margin: '0 0.5rem' }}
					onClick={() => setRootItemId(item.id)}
				>
					{item.name}
				</h2>
				{hasDependencies ? (
					<span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
						{completed} / {total}
					</span>
				) : (
					<button
						style={{ margin: '0 0.5rem' }}
						onClick={() => toggleItemCompleted(item.id)}
					>
						{item.completedAt === null ? 'Mark complete' : 'Unmark complete'}
					</button>
				)}
				{item.target != null && <b>{item.target.toLocaleString()}</b>}
				{item.description && (
					<p style={{ color: 'grey' }}>{item.description}</p>
				)}
				{item.id !== '0' && (
					<button
						style={{ margin: '0 0.5rem' }}
						onClick={() => removeDependencyFromItem(rootItemId, item.id)}
					>
						Remove
					</button>
				)}
			</div>
		</div>
	);
}

export default SubItem;
