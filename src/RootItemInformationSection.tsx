import { useContext, useMemo } from 'react';
import ContentEditableTextbox from './ContentEditableTextbox';
import DatetimePickerNullable from './DatetimePickerNullable';
import ItemStoreContext from './ItemStoreContext';
import Path from './Path';
import { ItemProps } from './types';

export default function RootItemInformationSection({
	item,
}: {
	item: ItemProps;
}) {
	const { store, state } = useContext(ItemStoreContext);

	const pathsFromAbsoluteRoot = useMemo(() => {
		const results = [];
		for (const [path, item3] of state.bfs('0')) {
			if (item.id === item3.id) {
				results.push(path);
			}
		}
		return results;
	}, [item.id, state]);

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
				onChange={e => store.setItemName(item.id, e.target.value)}
			/>

			{pathsFromAbsoluteRoot.map((path, index) => (
				<Path style={{ marginBottom: '0.25rem' }} items={path} key={index} />
			))}

			<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>Target</pre>
			<DatetimePickerNullable
				style={{ marginBottom: '0.5rem' }}
				value={item.target}
				onChange={date => store.setItemTarget(item.id, date)}
			/>

			<pre style={{ marginBottom: '0.25rem', color: '#808080' }}>
				Description
			</pre>
			<ContentEditableTextbox
				style={{ marginBottom: '0.5rem' }}
				html={item.description}
				onChange={e => store.setItemDescription(item.id, e.target.value)}
			/>
		</>
	);
}
