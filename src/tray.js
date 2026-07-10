'use strict';
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function createTray({ onTap, config, onConfigChange, hotkeyLabel }) {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, '..', 'assets', 'peach-tray.png'))
    .resize({ width: 18, height: 18 });
  tray = new Tray(icon);
  tray.setToolTip('bootytap');

  const menu = Menu.buildFromTemplate([
    { label: 'Tap now', click: onTap },
    { type: 'separator' },
    {
      label: 'Type praise',
      type: 'checkbox',
      checked: config.typePraise,
      click: (item) => {
        config.typePraise = item.checked;
        onConfigChange();
      },
    },
    { type: 'separator' },
    { label: `Hotkey: ${hotkeyLabel || 'unavailable'}`, enabled: false },
    { label: 'Quit bootytap', role: 'quit' },
  ]);

  if (process.platform === 'linux') {
    tray.setContextMenu(menu);
  } else {
    tray.on('click', onTap);
    tray.on('right-click', () => tray.popUpContextMenu(menu));
  }

  return tray;
}

module.exports = { createTray };
