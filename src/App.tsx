import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { RootItemIdContext } from './AppContexts';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import RootItemRenderer from './RootItemRenderer';

function App() {
	const itemNavigationStackRef = useRef<string[]>(['0']);
	const [rootItemId, setRootItemId_internal] = useState('0');

	const navigateToPreviousRootItem = useCallback(() => {
		const itemNavigationStack = itemNavigationStackRef.current;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		if (itemNavigationStack.length > 1) {
			itemNavigationStack.pop();
			const prev = itemNavigationStack[itemNavigationStack.length - 1];
			if (prev) {
				console.log('Going back to', prev);
				setRootItemId_internal(prev);
			}
		}
	}, []);

	const setRootItemId: Dispatch<SetStateAction<string>> = useCallback(
		action => {
			const itemNavigationStack = itemNavigationStackRef.current;
			setRootItemId_internal(id => {
				const nextId = typeof action === 'function' ? action(id) : action;
				console.log('Pushing', nextId);
				itemNavigationStack.push(nextId);
				return nextId;
			});
		},
		[]
	);

	return (
		<NavigateToPreviousRootItemContext.Provider
			value={navigateToPreviousRootItem}
		>
			<RootItemIdContext.Provider value={[rootItemId, setRootItemId]}>
				<RootItemRenderer id={rootItemId} />
			</RootItemIdContext.Provider>
		</NavigateToPreviousRootItemContext.Provider>
	);
}

export default App;
