import { useCallback, useContext } from 'react';
import CommandPaletteContext from './CommandPaletteContext';
import useKeybind from './useKeybind';

export function CommandPalette() {
	const [, setCommandPaletteOpen] = useContext(CommandPaletteContext);

	useKeybind(
		'Escape',
		useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen])
	);

	return (
		<input
			ref={input => input?.focus()}
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
