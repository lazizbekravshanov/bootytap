'use strict';
const { globalShortcut } = require('electron');

// Control+Option+Shift avoids the Command+Shift menu shortcuts that terminals
// (New Remote Connection, Show Colors, etc.) claim while focused.
const PRIMARY = 'Control+Alt+Shift+B';
const FALLBACK = 'Control+Alt+Shift+P';

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
