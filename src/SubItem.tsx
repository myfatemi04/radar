import { useContext, useDebugValue } from 'react';
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
		setItemDescription,
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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				marginTop: '1rem',
				border: `1px solid ${borderColor}`,
				padding: '0.5rem',
			}}
		>
			<pre style={{ marginTop: 0, marginRight: '0.5rem' }}>{index}</pre>
			<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{path.length > 0 && (
					<span style={{ fontFamily: 'monospace', marginBottom: '0.5rem' }}>
						{path.slice(1, path.length - 1).map((id, index) => {
							const item = getItem(id)!;
							return (
								<>
									<span
										style={{
											textDecoration: 'underline',
											cursor: 'pointer',
										}}
										onClick={() => setRootItemId(item.id)}
									>
										{item.name}
									</span>

									{index + 1 < path.length - 2 && ' > '}
								</>
							);
						})}
					</span>
				)}
				<h2
					style={{ cursor: 'pointer', margin: 0 }}
					onClick={() => setRootItemId(item.id)}
				>
					{item.name}
				</h2>

				<div>
					{
						// Completion
						hasDependencies ? (
							<span
								style={{
									fontFamily: 'monospace',
									fontWeight: 'bold',
									marginRight: '0.5rem',
								}}
							>
								{completedDependencyCount} / {totalDependencyCount}
							</span>
						) : (
							<button
								style={{
									marginRight: '0.5rem',
								}}
								onClick={() => toggleItemCompleted(item.id)}
							>
								{item.completedAt === null
									? 'Mark complete'
									: 'Unmark complete'}
							</button>
						)
					}
				</div>

				<div>
					{
						// Target time
						item.target !== null ? (
							<>
								<button
									style={{ marginRight: '0.5rem' }}
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
							<button
								onClick={() => setItemTargetTime(item.id, new Date())}
								style={{ cursor: 'pointer', margin: '0.5rem 0' }}
							>
								Add target time
							</button>
						)
					}
				</div>

				<textarea
					rows={item.description.split('\n').length}
					style={{ marginBottom: '0.5rem' }}
					value={item.description}
					placeholder='Description'
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.stopPropagation();
						}
					}}
					onChange={e => setItemDescription(item.id, e.target.value)}
				>
					{item.description}
				</textarea>

				<div>
					{item.id !== '0' && (
						<button
							onClick={() => removeDependencyFromItem(rootItemId, item.id)}
						>
							Delete
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default SubItem;
