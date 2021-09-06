import { CSSProperties, useContext } from 'react';
import ItemStoreContext from './ItemStoreContext';
import { useSetRootItemId } from './RouteHooks';

export default function Path({
	items,
	style,
}: {
	items: string[];
	style?: CSSProperties;
}) {
	const { state } = useContext(ItemStoreContext);
	const setRootItemId = useSetRootItemId();

	return (
		<span style={{ fontFamily: 'monospace', ...style }}>
			{items.map((id, index) => {
				const item = state.getItem(id)!;
				return (
					<>
						<span
							style={{
								textDecoration: 'underline',
								cursor: 'pointer',
							}}
							onClick={() => setRootItemId(item.id)}
							key={index}
						>
							{item.name}
						</span>

						{index + 1 < items.length && ' > '}
					</>
				);
			})}
		</span>
	);
}
