import { useEffect } from 'react';

export enum KeybindType {
	DOWN = 'down',
	UP = 'up',
}

export default function useKeybind(
	key: string,
	callback: () => void,
	type: KeybindType = KeybindType.DOWN
) {
	useEffect(() => {
		if (type === KeybindType.DOWN) {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === key) {
					callback();
				}
			};
			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		} else if (type === KeybindType.UP) {
			const handleKeyUp = (event: KeyboardEvent) => {
				if (event.key === key) {
					callback();
				}
			};
			window.addEventListener('keyup', handleKeyUp);
			return () => {
				window.removeEventListener('keyup', handleKeyUp);
			};
		}
	}, [callback, key, type]);
}
