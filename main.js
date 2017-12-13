'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 610,
        resizable: false,
        width: 368
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createShortcuts() {
    for (let i = 1; i <= 6 ; i++) {
        globalShortcut.register('ctrl+shift+' + i, () => {
            mainWindow.webContents.send('global-shortcut', i-1);
        });
    }
}

app.on('ready', () => {
    createWindow();
    createShortcuts();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

ipcMain.on('close-main-window', () => {
    app.quit();
});
