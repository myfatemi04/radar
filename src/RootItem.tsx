import { useContext, useState } from 'react';
import { CommandPalette } from './CommandPalette';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import RootItemGoalsView from './RootItemGoalsView';
import RootItemSubItemsBottomUpView from './RootItemPriorityView';
import { ItemProps } from './types';

enum RootItemView {
	Goals = 'top_down',
	Priority = 'bottom_up',
}

export default function RootItem({ item }: { item: ItemProps }) {
	const [view, setView] = useState<RootItemView>(RootItemView.Goals);

	const back = useContext(NavigateToPreviousRootItemContext);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				padding: '1rem',
			}}
		>
			<h1>{item.name}</h1>

			<CommandPalette />

			<div style={{ display: 'flex', marginTop: '1rem' }}>
				<button
					style={{
						padding: '0.5rem 1rem',
						marginRight: '1rem',
					}}
					onClick={back}
				>
					Back
				</button>

				<button
					style={{
						padding: '0.5rem 1rem',
						marginRight: '1rem',
					}}
					onClick={() => setView(RootItemView.Goals)}
				>
					Goals
				</button>
				<button
					style={{
						padding: '0.5rem 1rem',
					}}
					onClick={() => setView(RootItemView.Priority)}
				>
					Priority
				</button>
			</div>

			{view === RootItemView.Goals ? (
				<RootItemGoalsView item={item} />
			) : (
				<RootItemSubItemsBottomUpView item={item} />
			)}
		</div>
	);
}
