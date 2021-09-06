import { useContext, useDebugValue, useMemo } from 'react';
import TextareaAutosize from 'react-autosize-textarea/lib';
import { RootItemIdContext } from './AppContexts';
import DatetimePickerNullable from './DatetimePickerNullable';
import ItemStoreContext from './ItemStoreContext';
import { useIndirectDependencyCompletionStatus } from './ItemUtilities';
import Path from './Path';
import { useSetRootItemId } from './RouteHooks';
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

	const { store } = useContext(ItemStoreContext);

	const rootItemId = useContext(RootItemIdContext);
	const setRootItemId = useSetRootItemId();

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
					<Path items={visiblePathItems} style={{ marginBottom: '0.5rem' }} />
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
				<TextareaAutosize
					style={{ marginBottom: '0.5rem' }}
					placeholder='...'
					value={item.description}
					onChange={e =>
						store.setItemDescription(
							item.id,
							(e.target as HTMLTextAreaElement).value
						)
					}
				/>

				<div>
					<button
						onClick={() => store.duplicateItem(item.id, rootItemId, true)}
					>
						Duplicate
					</button>

					<button
						onClick={() => store.removeDependencyFromItem(rootItemId, item.id)}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default SubItem;
