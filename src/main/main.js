import { app as electronApp } from 'electron';

import app from './app';  // CommonJS singleton

electronApp.on('ready', () => {
	app.createMainWindow({ resizable: false });
});


