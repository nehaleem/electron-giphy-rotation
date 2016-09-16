import { createEventBusListener } from './bus-listener';

export function searchGifsByName (name, { limit = 1, offset = 0 }) {
	return createEventBusListener('giphy-fetch', {
		query: name,
		limit,
		offset,
	});
}

export function resizeWindowForImage (width, height) {
	return createEventBusListener('window-resize', {
		width,
		height,
	});
}
