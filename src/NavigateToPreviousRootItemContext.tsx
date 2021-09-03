import { createContext } from 'react';

const NavigateToPreviousRootItemContext = createContext(() => {
	console.log('back');
});

export default NavigateToPreviousRootItemContext;
