import { ipcRenderer } from 'electron';

export function createEventBusListener (method, params) {
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
