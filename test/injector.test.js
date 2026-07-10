'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { createInjector } = require('../src/praise/injector');

function fakeExec(calls, failOnCall = null) {
  return (cmd, args, cb) => {
    calls.push({ cmd, args });
    cb(failOnCall !== null && calls.length === failOnCall ? new Error('boom') : null);
  };
}

test('inject runs every command for the platform in order', async () => {
  const calls = [];
  const injector = createInjector({ platform: 'linux', execFileFn: fakeExec(calls) });
  const ok = await injector.inject('good bot');
  assert.strictEqual(ok, true);
  assert.strictEqual(calls.length, 2);
  assert.strictEqual(calls[0].args[0], 'type');
  assert.strictEqual(calls[1].args[0], 'key');
});

test('inject reports failure through onFailure and returns false', async () => {
  const calls = [];
  let failure = null;
  const injector = createInjector({
    platform: 'linux',
    execFileFn: fakeExec(calls, 1),
    onFailure: (e) => { failure = e; },
  });
  const ok = await injector.inject('good bot');
  assert.strictEqual(ok, false);
  assert.ok(failure instanceof Error);
});
