import { useCallback, useContext, useRef } from 'react';
import AppContext from './AppContext';

function ItemAdder() {
	const { addItem } = useContext(AppContext);

	const nameRef = useRef<HTMLInputElement>(null);

	const create = useCallback(() => {
		if (!nameRef.current) {
			return;
		}

		const name = nameRef.current.value;
		if (!name) {
			return;
		}

		addItem({
			id: Math.random().toString(36).substr(2, 9),
			name,
			description: '',
			target: null,
			dependencies: [],
			completedAt: null,
		});

		nameRef.current.value = '';
	}, [addItem]);

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
