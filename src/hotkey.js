'use strict';
const { globalShortcut } = require('electron');

const PRIMARY = 'CommandOrControl+Shift+B';
const FALLBACK = 'CommandOrControl+Alt+Shift+B';

function registerHotkey(onTap) {
  for (const accel of [PRIMARY, FALLBACK]) {
    try {
      if (globalShortcut.register(accel, onTap)) return accel;
    } catch {
      // registration threw; try the fallback
    }
  }
  return null;
}

module.exports = { registerHotkey, PRIMARY, FALLBACK };
