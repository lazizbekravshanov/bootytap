'use strict';
const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  typePraise: true,
  launchAtLogin: false,
  hotkey: null,
  injectionHelpShown: false,
};

function configPath(dir) {
  return path.join(dir, 'config.json');
}

function loadConfig(dir) {
  try {
    const raw = JSON.parse(fs.readFileSync(configPath(dir), 'utf8'));
    return { ...DEFAULTS, ...raw };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveConfig(dir, cfg) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configPath(dir), JSON.stringify(cfg, null, 2));
}

module.exports = { DEFAULTS, loadConfig, saveConfig };
