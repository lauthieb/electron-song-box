'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipcMain = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const configuration = require('./configuration');

let mainWindow;
let settingsWindow;

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

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    const shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    const shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    for (let i = 1; i <= 6 ; i++) {
        globalShortcut.register(shortcutPrefix + i, () => {
            mainWindow.webContents.send('global-shortcut', i-1);
        });
    }
}

app.on('ready', () => {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    createWindow();
    setGlobalShortcuts();
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

ipcMain.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/settings.html'),
        protocol: 'file:',
        slashes: true
    }));

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipcMain.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipcMain.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});

