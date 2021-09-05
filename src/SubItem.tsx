import { useContext, useDebugValue, useState } from 'react';
import { RootItemIdContext } from './AppContexts';
import DatetimePicker from './DatetimePicker';
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

	const {
		removeDependencyFromItem,
		toggleItemCompleted,
		getItem,
		setItemTargetTime,
	} = useContext(ItemStoreContext);

	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);

	const [completedDependencyCount, totalDependencyCount] =
		useIndirectDependencyCompletionStatus(item.id);

	const completedDirectly = item.completedAt !== null;

	const hasDependencies = item.dependencyIds.length > 0;

	const completed =
		(hasDependencies && completedDependencyCount === totalDependencyCount) ||
		completedDirectly;

	const borderColor = completed ? '#80ff80' : '#ffffff';

	const [targetTimePickerOpen, setTargetTimePickerOpen] = useState(false);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginTop: '1rem',
				border: `1px solid ${borderColor}`,
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
					<span
						style={{
							fontFamily: 'monospace',
							fontWeight: 'bold',
							margin: '0 0.5rem',
						}}
					>
						{completedDependencyCount} / {totalDependencyCount}
					</span>
				) : (
					<button
						style={{ margin: '0 0.5rem' }}
						onClick={() => toggleItemCompleted(item.id)}
					>
						{item.completedAt === null ? 'Mark complete' : 'Unmark complete'}
					</button>
				)}
				{item.description && (
					<p style={{ color: 'grey' }}>{item.description}</p>
				)}
				{targetTimePickerOpen ? (
					<>
						<button
							style={{ margin: '0 0.5rem' }}
							onClick={() => setTargetTimePickerOpen(false)}
						>
							Close
						</button>
						<button
							style={{ margin: '0 0.5rem' }}
							onClick={() => setItemTargetTime(item.id, null)}
						>
							Clear
						</button>
						<DatetimePicker
							value={item.target}
							onChange={date => setItemTargetTime(item.id, date)}
						/>
					</>
				) : (
					<span
						onClick={() => setTargetTimePickerOpen(true)}
						style={{ cursor: 'pointer' }}
					>
						{item.target
							? item.target.toLocaleString()
							: 'Choose a target time'}
					</span>
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
