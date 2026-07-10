#!/usr/bin/env node
'use strict';
const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');

const child = spawn(electron, [path.join(__dirname, '..')], {
  detached: true,
  stdio: 'ignore',
});
child.on('error', (err) => {
  console.error(`bootytap: failed to launch Electron: ${err.message}`);
  process.exit(1);
});
child.unref();
