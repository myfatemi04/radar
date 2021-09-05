import { useContext, useRef } from 'react';
import AutoresizableTextarea from './AutoresizableTextarea';
import DatetimePickerNullable from './DatetimePickerNullable';
import ItemStoreContext from './ItemStoreContext';
import { ItemProps } from './types';

export default function RootItemInformationSection({
	item,
}: {
	item: ItemProps;
}) {
	const { setItemTargetTime, setItemDescription, setItemName } =
		useContext(ItemStoreContext);

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

			<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>Target</pre>
			<DatetimePickerNullable
				style={{ marginBottom: '0.5rem' }}
				value={item.target}
				onChange={date => setItemTargetTime(item.id, date)}
			/>

			<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>
				Description
			</pre>
			<AutoresizableTextarea
				style={{ marginBottom: '0.5rem', backgroundColor: '#202020' }}
				value={item.description}
				cols={80}
				onChange={e => setItemDescription(item.id, e.target.value)}
				ref={descriptionTextareaRef}
			/>
		</>
	);
}
