import { useCallback, useContext, useState } from 'react';
import { CommandPaletteWrapper } from './CommandPalette';
import CommandPaletteContext from './CommandPaletteContext';
import Item from './Item';
import ItemsStoreContext from './ItemsStoreContext';
import useItem from './useItem';
import useKeybind from './useKeybind';

function App() {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
	const { getItem } = useContext(ItemsStoreContext);

	useKeybind(
		'c',
		useCallback(() => {
			setCommandPaletteOpen(true);
		}, [])
	);

	const root = useItem('0');

	return (
		<CommandPaletteContext.Provider
			value={[commandPaletteOpen, setCommandPaletteOpen]}
		>
			{commandPaletteOpen && <CommandPaletteWrapper />}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: 'calc(min(30rem, 50vw))',
					margin: '1rem auto',
				}}
			>
				<h1>Planner</h1>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{root?.dependencies.map(id => (
						<Item key={id} item={getItem(id)!} />
					))}
				</div>
			</div>
		</CommandPaletteContext.Provider>
	);
}

export default App;
