'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bootytap', {
  onPlay: (cb) => ipcRenderer.on('bootytap:play', cb),
  done: () => ipcRenderer.send('bootytap:done'),
});
