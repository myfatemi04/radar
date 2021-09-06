import { createContext } from 'react';
import createStatefulContext from './createStatefulContext';

export const CommandPaletteContext = createStatefulContext<boolean>(false);
export const RootItemIdContext = createContext('0');
