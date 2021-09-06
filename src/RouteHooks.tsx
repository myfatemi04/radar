import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export function useSetRootItemId() {
	const history = useHistory();

	return useCallback(
		(id: string) => {
			history.push('/i/' + id);
		},
		[history]
	);
}

export function useBack() {
	const history = useHistory();

	return useCallback(() => {
		history.goBack();
	}, [history]);
}
