'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const soundButtons = document.querySelectorAll('.button-sound');

for (let i = 0; i < soundButtons.length; i++) {
    const soundButton = soundButtons[i];
    const soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

    const audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    buttonEl.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.play();
    });
}

const closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
    ipcRenderer.send('close-main-window');
});

ipcRenderer.on('global-shortcut', function (evt, data) {
    const event = new MouseEvent('click');
    soundButtons[data].dispatchEvent(event);
});