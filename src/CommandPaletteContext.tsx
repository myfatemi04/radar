import createStatefulContext from './createStatefulContext';

const CommandPaletteContext = createStatefulContext<boolean>(false);

export default CommandPaletteContext;
