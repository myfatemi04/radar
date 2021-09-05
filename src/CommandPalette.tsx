import {
	FC,
	useCallback,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { CommandPaletteContext, RootItemIdContext } from './AppContexts';
import createEmptyItem from './createEmptyItem';
import isNaturalNumber from './isDigit';
import ItemStoreContext from './ItemStoreContext';
import NavigateToPreviousRootItemContext from './NavigateToPreviousRootItemContext';
import useCommandPaletteSuggestions from './useCommandPaletteCompletions';
import useKeybind from './useKeybind';

export const CompletionRow: FC<{ onClick: () => void }> = ({
	children,
	onClick,
}) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				backgroundColor: '#303030',
				padding: '1rem',
				cursor: 'pointer',
			}}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export function CommandPalette({
	itemIndexToItemId,
}: {
	itemIndexToItemId: (index: number) => string | null;
}) {
	const [command, setCommand] = useState('');
	const [rootItemId, setRootItemId] = useContext(RootItemIdContext);
	const ref = useRef<HTMLInputElement>(null);
	const I = useContext(ItemStoreContext);

	const [, setCommandPaletteOpen] = useContext(CommandPaletteContext);

	const done = useCallback(() => {
		setCommand('');
		setCommandPaletteOpen(false);
	}, [setCommandPaletteOpen]);

	useLayoutEffect(() => {
		ref.current?.focus();
	}, []);

	const back = useContext(NavigateToPreviousRootItemContext);

	const onEnteredCommand = useCallback(() => {
		if (command === '' || command === '/') {
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
						const dependencyIndex = +rest;
						const dependencyId = itemIndexToItemId(dependencyIndex);

						if (dependencyId !== null) {
							console.log('Dependencies:', +rest, dependencyId);
							setRootItemId(dependencyId);
							done();

							break;
						}
					}
				}
			}
		}
	}, [I, back, command, done, itemIndexToItemId, rootItemId, setRootItemId]);

	useKeybind('Enter', onEnteredCommand);

	const suggestions = useCommandPaletteSuggestions(command);

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column-reverse',
			}}
		>
			<input
				ref={ref}
				type='text'
				value={command}
				onChange={e => setCommand(e.target.value)}
				style={{
					width: '100%',
					height: '2rem',
					border: 'none',
					outline: 'none',
					padding: '0.5rem',
					fontSize: '1rem',
					fontFamily: 'monospace',
					backgroundColor: '#202020',
				}}
			/>
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					overflowY: 'auto',
					maxHeight: 'calc(100% - 2rem)',
				}}
			>
				{suggestions.map(({ onClick, label }, index) => (
					<CompletionRow
						key={index}
						onClick={() => {
							onClick();
							done();
						}}
					>
						{label}
					</CompletionRow>
				))}
			</div>
		</div>
	);
}

/**
 * Renders the command palette in the absolute center of the body.
 */
export function CommandPaletteWrapper({
	itemIndexToItemId,
}: {
	itemIndexToItemId: (index: number) => string | null;
}) {
	return (
		<div
			style={{
				position: 'fixed',
				inset: '0.5rem',
				maxHeight: 'calc(100vh - 1rem)',
				zIndex: 1,
			}}
		>
			<CommandPalette itemIndexToItemId={itemIndexToItemId} />
		</div>
	);
}
