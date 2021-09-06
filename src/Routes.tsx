import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/i/:rootItemId' component={App} />
				<Route path='/' component={App} />
			</Switch>
		</BrowserRouter>
	);
}
