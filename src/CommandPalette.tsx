import { useCallback, useContext, useRef, useState } from 'react';
import { RootItemIdContext } from './AppContexts';
import createEmptyItem from './createEmptyItem';
import isNaturalNumber from './isDigit';
import ItemStoreContext from './ItemStoreContext';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import useKeybind from './useKeybind';

export function CommandPalette() {
	const [command, setCommand] = useState('');
	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);
	const ref = useRef<HTMLInputElement>(null);
	const I = useContext(ItemStoreContext);

	const done = useCallback(() => {
		setCommand('');
	}, []);

	const typeCallback = useCallback(() => {
		ref.current?.focus();
	}, []);

	useKeybind('Enter', typeCallback);
	useKeybind('/', typeCallback);

	const back = useContext(NavigateToPreviousRootItemContext);

	const onEnteredCommand = useCallback(() => {
		if (command === '' || command === '/') {
			return;
		}
		const [commandName, ...args] = command.split(' ');
		console.log(commandName, args);

		const rootItem = I.getItem(rootItemId);

		switch (commandName.toLowerCase()) {
			case '/t': {
				const name = args.join(' ');
				if (name.trim() === '') {
					return;
				}
				I.addItem(createEmptyItem({ name }), rootItemId);
				done();
				break;
			}
			case '/b': {
				back();
				done();

				break;
			}
			default: {
				if (commandName.startsWith('/')) {
					const rest = commandName.slice(1);
					const natural = isNaturalNumber(rest);
					if (natural) {
						const dependencyIndexToNavigateTo = +rest;

						const dependencyId =
							rootItem!.dependencyIds[dependencyIndexToNavigateTo];

						if (dependencyId !== undefined) {
							console.log('Dependencies:', +rest, dependencyId);
							setRootItemId(dependencyId);
							done();

							break;
						}
					}
				}
			}
		}
	}, [I, back, command, done, rootItemId, setRootItemId]);

	useKeybind('Enter', onEnteredCommand);

	return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
			<input
				ref={ref}
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
