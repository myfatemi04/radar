import { useContext, useDebugValue } from 'react';
import { RootItemIdContext } from './AppContexts';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

function SubItem({ item }: { item: ItemProps }) {
	useDebugValue(item);

	const { getItem, removeItem, removeDependencyFromItem, toggleItemCompleted } =
		useContext(ItemStoreContext);

	const [, setRootItemId] = useContext(RootItemIdContext);
	return (
		<div
			style={{
				border: '1px solid white',
				padding: '1rem',
				marginTop: '1rem',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<h2 style={{ cursor: 'pointer' }} onClick={() => setRootItemId(item.id)}>
				{item.name}
			</h2>
			{item.id !== '0' && (
				<div>
					<button
						style={{ marginBottom: '1rem' }}
						onClick={() => removeItem(item.id)}
					>
						Delete
					</button>
				</div>
			)}

			{item.target != null && <b>{item.target.toLocaleString()}</b>}
			{item.description && <p style={{ color: 'grey' }}>{item.description}</p>}

			<div>
				{item.dependencyIds.map(dependencyId => {
					const dependency = getItem(dependencyId)!;
					const completed = dependency.completedAt != null;
					const dependencyDependencies = dependency.dependencyIds.map(
						dependencyId => getItem(dependencyId)!
					);
					const dependencyDependenciesCompleted = dependencyDependencies.reduce(
						(acc, dependency) => acc + (dependency.completedAt != null ? 1 : 0),
						0
					);
					const dependencyDependenciesTotal = dependencyDependencies.length;
					const allDependenciesCompleted =
						dependencyDependenciesCompleted === dependencyDependenciesTotal;
					const hasDependencies = dependencyDependencies.length > 0;
					const color = hasDependencies
						? allDependenciesCompleted
							? '#50ff50'
							: 'white'
						: completed
						? 'grey'
						: 'white';
					return (
						<div key={dependencyId}>
							<h3
								style={{
									textDecoration: completed ? 'line-through' : 'none',
									color,
									cursor: 'pointer',
									userSelect: 'none',
								}}
								onClick={() => toggleItemCompleted(dependencyId)}
							>
								{dependency.name}{' '}
								{hasDependencies &&
									`${dependencyDependenciesCompleted} / ${dependencyDependenciesTotal}`}
							</h3>
							<p>{dependency.description}</p>
							<div>
								<button
									onClick={() =>
										removeDependencyFromItem(item.id, dependencyId)
									}
								>
									Remove
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SubItem;
