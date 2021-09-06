import { createContext } from 'react';

const RouteHistoryContext = createContext({
	history: [] as string[],
	pos: 0,
	go: (route: string) => {},
	back: () => {},
	forward: () => {},
});

export default RouteHistoryContext;
