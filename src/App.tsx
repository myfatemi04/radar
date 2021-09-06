import { useParams } from 'react-router-dom';
import { RootItemIdContext } from './AppContexts';
import RootItemRenderer from './RootItemRenderer';

function App() {
	const { rootItemId = '0' } = useParams<{ rootItemId?: string }>();

	return (
		<RootItemIdContext.Provider value={rootItemId}>
			<RootItemRenderer id={rootItemId} />
		</RootItemIdContext.Provider>
	);
}

export default App;
