import { useCallback, useContext } from 'react';
import RouteHistoryContext from './RouteHistoryContext';

export function useSetRootItemId() {
	const routeHistory = useContext(RouteHistoryContext);

	return useCallback(
		(id: string) => {
			routeHistory.go('/i/' + id);
		},
		[routeHistory]
	);
}

export function useBack() {
	return useContext(RouteHistoryContext).back;
}

export function useForward() {
	return useContext(RouteHistoryContext).forward;
}
