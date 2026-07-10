'use strict';
const { app, Notification } = require('electron');
const { createOverlay } = require('./overlay');
const { createTray } = require('./tray');
const { registerHotkey } = require('./hotkey');
const { createInjector } = require('./praise/injector');
const { pick } = require('./praise/pool');
const { loadConfig, saveConfig } = require('./config');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let overlay = null;
  let injector = null;
  let config = null;

  const persist = () => saveConfig(app.getPath('userData'), config);

  const notifyInjectionFailure = () => {
    if (!config || config.injectionHelpShown) return;
    config.injectionHelpShown = true;
    persist();
    const body =
      process.platform === 'darwin'
        ? 'Grant Accessibility permission: System Settings > Privacy & Security > Accessibility, then enable bootytap (it may be listed as Electron).'
        : process.platform === 'linux'
          ? 'Install xdotool (e.g. sudo apt install xdotool) so bootytap can type praise.'
          : 'Praise typing failed. Check that PowerShell is available on PATH.';
    new Notification({ title: 'bootytap: praise not delivered', body }).show();
  };

  const tap = () => {
    overlay.play();
    if (config.typePraise) injector.inject(pick());
  };

  app.on('second-instance', () => tap());

  app.on('window-all-closed', () => {
    // Keep running in the tray; quitting happens via the tray menu.
  });

  app.whenReady().then(() => {
    if (process.platform === 'darwin' && app.dock) app.dock.hide();
    config = loadConfig(app.getPath('userData'));
    overlay = createOverlay();
    injector = createInjector({ onFailure: notifyInjectionFailure });
    const hotkey = registerHotkey(tap);
    config.hotkey = hotkey;
    persist();
    createTray({ onTap: tap, config, onConfigChange: persist, hotkeyLabel: hotkey });
    if (process.argv.includes('--tap')) tap();
  });
}
