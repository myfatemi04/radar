import { useEffect } from 'react';

export enum KeybindType {
	DOWN = 'down',
	UP = 'up',
}

export default function useKeybind(
	key: string,
	callback: (event: KeyboardEvent) => void,
	type: KeybindType = KeybindType.DOWN
) {
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (event.key === key) {
				callback(event);
			}
		};
		const eventType = type === KeybindType.DOWN ? 'keydown' : 'keyup';
		window.addEventListener(eventType, listener);
		return () => {
			window.removeEventListener(eventType, listener);
		};
	}, [callback, key, type]);
}
