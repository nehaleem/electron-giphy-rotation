import * as path from 'path';

import { app, BrowserWindow, Tray, ipcMain } from 'electron';

import * as utils from '../common/lib/utils';
import MainEventBus from '../main/MainEventBus';

class App {
	constructor () {
		this._windows = new Map();
		this._mainEventBus = new MainEventBus();
	}

	createMainWindow ({ width = 1000, height = 800, useTrayIcon = false, resizable = false } = {}) {
		if (this._windows.has('main')) {
			return this;
		}

		const mainWindow = new BrowserWindow(Object.assign({ width: 1000, height: 800, resizable, frame: false }));

		if (useTrayIcon) {
			const trayIconPath = App._getTrayIconPath();

			App._setTrayIcon(trayIconPath, { toolTip: 'Testing tooltip' });
		}

		mainWindow.setMenu(null);
		mainWindow.loadURL(`file://${path.resolve(__dirname, '..', '..', 'static', 'index.html')}`);
		//mainWindow.openDevTools();

		this._windows.set('main', mainWindow);
		this._registerAppEventListeners();
		this._mainEventBus.registerAsyncListener();

		return this;
	}

	getMainWindow () {
		return this._windows.get('main');
	}

	destroyApp () {
		const mainWindow = this._windows.get('main');

		if (mainWindow) {
			mainWindow.destroy();
		}

		app.quit();
	}

	_registerAppEventListeners () {
		// Main window
		this._windows.get('main')
			.on('closed', () => this._windows.delete('main'));

		// App
		app.on('window-all-closed', () => {
			this.destroyApp();
		});
	}

	static _getTrayIconPath () {
		const TRAY_ICON_NAME = 'tray_icon';
		const osSpecificExtension = utils.isWindows() ? 'ico' : 'png';
		const trayIconFileName = `${TRAY_ICON_NAME}.${osSpecificExtension}`;

		return path.join(__dirname, 'images', trayIconFileName);
	}

	static _setTrayIcon(path, { toolTip } = {}) {
		const trayIcon = new Tray(path);

		if (toolTip) {
			trayIcon.setToolTip(toolTip);
		}
	}
}

export default new App();
