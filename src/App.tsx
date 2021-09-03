import { useCallback, useState } from 'react';
import { CommandPaletteContext, RootItemIdContext } from './AppContexts';
import { CommandPaletteWrapper } from './CommandPalette';
import RootItemRenderer from './RootItemRenderer';
import useKeybind from './useKeybind';

function App() {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
	const [rootItemId, setRootItemId] = useState('0');

	useKeybind(
		'/',
		useCallback(() => {
			setCommandPaletteOpen(true);
		}, [])
	);

	return (
		<CommandPaletteContext.Provider
			value={[commandPaletteOpen, setCommandPaletteOpen]}
		>
			<RootItemIdContext.Provider value={[rootItemId, setRootItemId]}>
				{commandPaletteOpen && <CommandPaletteWrapper />}
				<RootItemRenderer id={rootItemId} />
			</RootItemIdContext.Provider>
		</CommandPaletteContext.Provider>
	);
}

export default App;
