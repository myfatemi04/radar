import { useCallback, useContext, useState } from 'react';
import CommandPaletteContext from './CommandPaletteContext';
import createEmptyItem from './createEmptyItem';
import ItemsStoreContext from './ItemsStoreContext';
import useKeybind from './useKeybind';

export function CommandPalette() {
	const [, setCommandPaletteOpen] = useContext(CommandPaletteContext);
	const [command, setCommand] = useState('');
	const I = useContext(ItemsStoreContext);

	useKeybind(
		'Escape',
		useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen])
	);

	const onEnteredCommand = useCallback(() => {
		if (command === '' || command === '/') {
			setCommandPaletteOpen(false);
			return;
		}
		const [commandName, ...args] = command.split(' ');
		console.log(commandName, args);
		switch (commandName.toLowerCase()) {
			case '/t': {
				const name = args.join(' ');
				if (name.trim() === '') {
					return;
				}
				I.addItem(createEmptyItem({ name }), '0');
				setCommandPaletteOpen(false);
				break;
			}
		}
	}, [I, command, setCommandPaletteOpen]);

	useKeybind('Enter', onEnteredCommand);

	return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
			<input
				ref={input => input?.focus()}
				type='text'
				value={command}
				onChange={e => setCommand(e.target.value)}
				style={{
					width: '100%',
					border: 'none',
					outline: 'none',
					padding: '0.5em',
					fontSize: '2em',
					fontFamily: 'monospace',
					backgroundColor: '#202020',
					borderRadius: '0.5em',
				}}
			/>
		</div>
	);
}

/**
 * Renders the command palette in the absolute center of the body.
 */
export function CommandPaletteWrapper() {
	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				zIndex: 1,
				width: 'min(80vw, 40rem)',
			}}
		>
			<CommandPalette />
		</div>
	);
}
