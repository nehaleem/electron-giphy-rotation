import { ipcRenderer } from 'electron';

function _createEventBusListener (method, params) {
	return new Promise((resolve, reject) => {
		ipcRenderer.send('async-request', {
			method,
			params
		});

		ipcRenderer.once(`${method}-finish`, (event, { err, result }) => {
			if (err) {
				return reject(err);
			}

			resolve(result);
		});
	});
}

export function searchGifsByName (name, { limit = 1, offset = 0 }) {
	return _createEventBusListener('giphy-fetch', {
		query: name,
		limit,
		offset,
	});
}

export function resizeWindowForImage (width, height) {
	return _createEventBusListener('window-resize', {
		width,
		height,
	});
}
