'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const configuration = require('../configuration');

const modifierCheckboxes = document.querySelectorAll('.global-shortcut');

function bindModifierCheckboxes(e) {
    const shortcutKeys = configuration.readSettings('shortcutKeys');
    const modifierKey = e.target.attributes['data-modifier-key'].value;

    if (shortcutKeys.indexOf(modifierKey) !== -1) {
        const shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
        shortcutKeys.splice(shortcutKeyIndex, 1);
    }
    else {
        shortcutKeys.push(modifierKey);
    }

    configuration.saveSettings('shortcutKeys', shortcutKeys);
    ipcRenderer.send('set-global-shortcuts');
}

for (let i = 0; i < modifierCheckboxes.length; i++) {
    const shortcutKeys = configuration.readSettings('shortcutKeys');
    const modifierKey = modifierCheckboxes[i].attributes['data-modifier-key'].value;
    modifierCheckboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

    modifierCheckboxes[i].addEventListener('click', function (e) {
        bindModifierCheckboxes(e);
    });
}

const closeEl = document.querySelector('.close');
closeEl.addEventListener('click', () => {
    ipcRenderer.send('close-settings-window');
});