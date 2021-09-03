import createStatefulContext from './createStatefulContext';

export const CommandPaletteContext = createStatefulContext<boolean>(false);
export const RootItemIdContext = createStatefulContext<string>('0');
