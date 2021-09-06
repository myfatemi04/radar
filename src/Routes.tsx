import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import RouteHistoryProvider from './RouteHistoryProvider';

export default function Routes() {
	return (
		<BrowserRouter>
			<RouteHistoryProvider>
				<Switch>
					<Route path='/i/:rootItemId' component={App} />
					<Route path='/' component={App} />
				</Switch>
			</RouteHistoryProvider>
		</BrowserRouter>
	);
}
