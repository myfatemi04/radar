import { useCallback, useContext, useRef } from 'react';
import createEmptyItem from './createEmptyItem';
import ItemStoreContext from './ItemStoreContext';

function ItemAdder() {
	const { store } = useContext(ItemStoreContext);

	const nameRef = useRef<HTMLInputElement>(null);

	const create = useCallback(() => {
		if (!nameRef.current) {
			return;
		}

		const name = nameRef.current.value;
		if (!name) {
			return;
		}

		store.addItem(createEmptyItem({ name }), '0');

		nameRef.current.value = '';
	}, [store]);

	return (
		<div style={{ width: '20rem' }}>
			<input
				style={{
					width: '100%',
					marginBottom: '1rem',
					fontSize: '2em',
				}}
				placeholder='Add something...'
				ref={nameRef}
				onKeyPress={e => {
					if (e.key === 'Enter') {
						create();
					}
				}}
			/>
		</div>
	);
}

export default ItemAdder;
