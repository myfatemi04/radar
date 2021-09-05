import { useContext, useDebugValue, useMemo } from 'react';
import { RootItemIdContext } from './AppContexts';
import AutoresizableTextarea from './AutoresizableTextarea';
import DatetimePickerNullable from './DatetimePickerNullable';
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

	const { store, state } = useContext(ItemStoreContext);

	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);

	const [completedDependencyCount, totalDependencyCount] =
		useIndirectDependencyCompletionStatus(item.id);

	const completedDirectly = item.completedAt !== null;

	const hasDependencies = item.dependencyIds.length > 0;

	const completed =
		(hasDependencies && completedDependencyCount === totalDependencyCount) ||
		completedDirectly;

	const borderColor = completed ? '#80ff80' : '#ffffff';

	const visiblePathItems = useMemo(
		() => (path.length > 0 ? path.slice(1, path.length - 1) : []),
		[path]
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				marginTop: '1rem',
				border: `0.125rem solid ${borderColor}`,
				padding: '1rem 0.5rem',
			}}
		>
			<pre style={{ marginTop: 0, marginRight: '0.5rem' }}>{index}</pre>
			<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{visiblePathItems.length > 0 && (
					<span style={{ fontFamily: 'monospace', marginBottom: '0.5rem' }}>
						{visiblePathItems.map((id, index) => {
							const item = state.getItem(id)!;
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
								}}
							>
								{completedDependencyCount} / {totalDependencyCount}
							</span>
						) : (
							<button onClick={() => store.toggleCompleted(item.id)}>
								{item.completedAt === null
									? 'Mark complete'
									: 'Unmark complete'}
							</button>
						)
					}
				</div>

				<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>Target</pre>
				<DatetimePickerNullable
					value={item.target}
					onChange={t => store.setItemTarget(item.id, t)}
				/>

				<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>
					Description
				</pre>
				<AutoresizableTextarea
					style={{ marginBottom: '0.5rem' }}
					placeholder='...'
					value={item.description}
					onChange={e => store.setItemDescription(item.id, e.target.value)}
				/>

				<div>
					{item.id !== '0' && (
						<button
							onClick={() =>
								store.removeDependencyFromItem(rootItemId, item.id)
							}
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
