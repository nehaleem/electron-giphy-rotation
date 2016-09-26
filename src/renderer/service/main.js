import { createEventBusListener } from './bus-listener';

export function setAlwaysOnTop (isPinned) {
	return createEventBusListener('window-pin', { isPinned });
}
