'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const closeEl = document.querySelector('.close');
closeEl.addEventListener('click', () => {
    ipcRenderer.send('close-settings-window');
});