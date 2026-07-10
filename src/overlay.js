'use strict';
const { BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

function createOverlay() {
  let win = null;

  const build = () => {
    win = new BrowserWindow({
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: false,
      skipTaskbar: true,
      hasShadow: false,
      webPreferences: {
        preload: path.join(__dirname, 'overlay', 'preload.js'),
        contextIsolation: true,
      },
    });
    win.setIgnoreMouseEvents(true);
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.loadFile(path.join(__dirname, 'overlay', 'overlay.html'));
    win.on('closed', () => { win = null; });
  };

  build();

  ipcMain.on('bootytap:done', () => {
    if (win) win.hide();
  });

  return {
    play() {
      if (!win) build();
      const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
      win.setBounds(display.bounds);
      win.showInactive();
      if (win.webContents.isLoading()) {
        win.webContents.once('did-finish-load', () => win.webContents.send('bootytap:play'));
      } else {
        win.webContents.send('bootytap:play');
      }
    },
  };
}

module.exports = { createOverlay };
