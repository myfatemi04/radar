import { FC, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RouteHistoryContext from './RouteHistoryContext';

const RouteHistoryProvider: FC = ({ children }) => {
	const reactRouterHistory = useHistory();

	const [history, setHistory] = useState<string[]>([]);
	const [pos, setPos] = useState(0);

	console.log({ history, pos });

	const value = useMemo(() => {
		return {
			history,
			pos,
			go: (path: string) => {
				setHistory(history => [...history.slice(0, pos), path]);
				setPos(pos => pos + 1);
				reactRouterHistory.push(path);
			},
			back: () => {
				setPos(pos => {
					if (pos === 0) {
						return 0;
					}

					reactRouterHistory.goBack();

					return pos - 1;
				});
			},
			forward: () => {
				setPos(pos => {
					if (pos >= history.length) {
						return pos;
					}

					reactRouterHistory.goForward();

					return pos + 1;
				});
			},
		};
	}, [history, pos, reactRouterHistory]);

	return (
		<RouteHistoryContext.Provider value={value}>
			{children}
		</RouteHistoryContext.Provider>
	);
};

export default RouteHistoryProvider;
