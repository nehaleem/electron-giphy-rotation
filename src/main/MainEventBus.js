import { ipcMain } from 'electron';

import app from '../main/app';
import * as giphyController from './controller/giphy';

export default class MainEventBus {
	registerAsyncListener () {
		ipcMain.on('async-request', (event, { method, params = {} } = {}) => {
			if (!method) {
				return;
			}

			this._processAsyncEventRequest(event.sender, method, params);
		});
	}

	_processAsyncEventRequest (sender, method, params) {
		switch (method) {
			case 'giphy-fetch':
				const { query, ...extra } = params;

				giphyController
					.search(query, extra)
					.then((result) => sender.send('giphy-fetch-finish', { method, error: null, result }))
					.catch((err) => sender.send('giphy-fetch-finish', { method, error: err }));
				break;
			case 'window-resize':
				const { width, height } = params;

				const mainWindow = app.getMainWindow();
				const currentBounds = mainWindow.getContentBounds();
				const updatedBounds = Object.assign(currentBounds, { width, height });

				mainWindow.setContentBounds(updatedBounds);
				break;
			case 'window-pin':
				const { isPinned } = params;

				app.getMainWindow().setAlwaysOnTop(isPinned);
				break;

		}
	}
}
