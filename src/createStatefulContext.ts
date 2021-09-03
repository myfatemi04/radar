import { Dispatch, SetStateAction } from 'react';
import { Context, createContext } from 'react';

export type StatefulContextProps<T> = [T, Dispatch<SetStateAction<T>>];

function createStatefulContext<T>(
	defaultValue: T
): Context<StatefulContextProps<T>> {
	return createContext([defaultValue, () => {}] as StatefulContextProps<T>);
}

export default createStatefulContext;
