import { useParams } from 'react-router-dom';
import RootItemRenderer from './RootItemRenderer';

function App() {
	const { rootItemId = '0' } = useParams<{ rootItemId?: string }>();

	return <RootItemRenderer id={rootItemId} />;
}

export default App;
