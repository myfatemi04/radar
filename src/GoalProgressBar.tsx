import { useIndirectDependencyCompletionStatus } from './ItemUtilities';
import { ItemProps } from './types';

export default function GoalProgressBar({ item }: { item: ItemProps }) {
	const [completed, total] = useIndirectDependencyCompletionStatus(item.id);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				height: '2rem',
				padding: '0.5rem',
				marginTop: '0.5rem',
				border: '0.125rem solid white',
				backgroundImage: 'linear-gradient(90deg, #aa50ff, #f74424)',
				backgroundSize: (completed / total) * 100 + '% 100%',
				backgroundRepeat: 'no-repeat',
				transition: 'background-size 500ms ease',
				userSelect: 'none',
				fontFamily: 'monospace',
				fontSize: '1rem',
			}}
		>
			{((completed / total) * 100).toFixed(0) + '%'}
		</div>
	);
}
