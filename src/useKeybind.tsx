import { useEffect } from 'react';

export default function useKeybind(key: string, callback: () => void) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// if (event.key === key) {
			// 	callback();
			// }
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === key) {
				callback();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [callback, key]);
}
