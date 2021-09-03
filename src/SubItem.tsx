import { useContext, useDebugValue } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { useIndirectDependencyCompletionStatus } from './ItemUtilities';
import { ItemProps } from './types';

function SubItem({ item, index }: { item: ItemProps; index: number }) {
	useDebugValue(item);

	const { removeDependencyFromItem, toggleItemCompleted } =
		useContext(ItemStoreContext);

	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);

	const [completed, total] = useIndirectDependencyCompletionStatus(item.id);

	return (
		<div
			style={{
				border: '1px solid white',
				padding: '0.5rem',
				marginTop: '1rem',
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
			{item.id !== '0' && (
				<button
					style={{ margin: '0 0.5rem' }}
					onClick={() => removeDependencyFromItem(rootItemId, item.id)}
				>
					Remove
				</button>
			)}
			<b>
				{completed} / {total}
			</b>
			<button
				style={{ margin: '0 0.5rem' }}
				onClick={() => toggleItemCompleted(item.id)}
			>
				{item.completedAt === null ? 'Mark complete' : 'Unmark complete'}
			</button>
			{item.target != null && <b>{item.target.toLocaleString()}</b>}
			{item.description && <p style={{ color: 'grey' }}>{item.description}</p>}
		</div>
	);
}

export default SubItem;
