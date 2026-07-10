'use strict';
const { execFile } = require('child_process');
const { buildCommands } = require('./commands');

function run(execFileFn, cmd, args) {
  return new Promise((resolve, reject) => {
    execFileFn(cmd, args, (err) => (err ? reject(err) : resolve()));
  });
}

function createInjector({
  platform = process.platform,
  execFileFn = execFile,
  onFailure = () => {},
} = {}) {
  return {
    async inject(text) {
      try {
        for (const { cmd, args } of buildCommands(platform, text)) {
          await run(execFileFn, cmd, args);
        }
        return true;
      } catch (err) {
        onFailure(err);
        return false;
      }
    },
  };
}

module.exports = { createInjector };
