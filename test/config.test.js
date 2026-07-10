'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { DEFAULTS, loadConfig, saveConfig } = require('../src/config');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bootytap-'));
}

test('loadConfig returns defaults when file is missing', () => {
  assert.deepStrictEqual(loadConfig(tmpDir()), DEFAULTS);
});

test('saveConfig then loadConfig round-trips and merges defaults', () => {
  const dir = tmpDir();
  saveConfig(dir, { typePraise: false });
  const cfg = loadConfig(dir);
  assert.strictEqual(cfg.typePraise, false);
  assert.strictEqual(cfg.launchAtLogin, DEFAULTS.launchAtLogin);
  assert.strictEqual(cfg.injectionHelpShown, DEFAULTS.injectionHelpShown);
});

test('loadConfig survives corrupt json', () => {
  const dir = tmpDir();
  fs.writeFileSync(path.join(dir, 'config.json'), '{nope');
  assert.deepStrictEqual(loadConfig(dir), DEFAULTS);
});
