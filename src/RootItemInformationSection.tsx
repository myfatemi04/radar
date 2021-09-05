import { useContext, useRef, useState } from 'react';
import DatetimePicker from './DatetimePicker';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

export default function RootItemInformationSection({
	item,
}: {
	item: ItemProps;
}) {
	const { setItemTargetTime, setItemDescription, setItemName } =
		useContext(ItemStoreContext);

	const [editingTargetTime, setEditingTargetTime] = useState(false);

	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<>
			<input
				style={{
					fontSize: '4rem',
					fontWeight: 'bolder',
					marginBlock: '1rem',
				}}
				type='text'
				value={item.name}
				onChange={e => setItemName(item.id, e.target.value)}
			/>

			<div style={{ marginBottom: '0.5rem' }}>
				{editingTargetTime ? (
					<>
						<button
							onClick={() => {
								setEditingTargetTime(false);
							}}
						>
							Done
						</button>
						<button
							style={{ margin: '0 0.5rem' }}
							onClick={() => {
								setItemTargetTime(item.id, null);
							}}
						>
							Clear
						</button>
						<DatetimePicker
							value={item.target}
							onChange={value => setItemTargetTime(item.id, value)}
						/>
					</>
				) : (
					<>
						{item.target ? (
							<span
								style={{
									cursor: 'pointer',
									fontFamily: 'monospace',
									fontSize: '0.875rem',
								}}
								onClick={() => setEditingTargetTime(true)}
							>
								{item.target.toLocaleString()}
							</span>
						) : (
							<button onClick={() => setEditingTargetTime(true)}>
								Add a target time
							</button>
						)}
					</>
				)}
			</div>

			<textarea
				style={{ marginBottom: '0.5rem' }}
				rows={item.description.split('\n').length}
				value={item.description}
				placeholder='Description'
				cols={80}
				onKeyDown={e => e.stopPropagation()}
				onChange={e => setItemDescription(item.id, e.target.value)}
				ref={descriptionTextareaRef}
			/>
		</>
	);
}
