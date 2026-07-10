'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { buildCommands, escapeSendKeys } = require('../src/praise/commands');

test('darwin builds one osascript command with keystroke then return', () => {
  const cmds = buildCommands('darwin', 'good bot <3');
  assert.strictEqual(cmds.length, 1);
  assert.strictEqual(cmds[0].cmd, 'osascript');
  assert.deepStrictEqual(cmds[0].args, [
    '-e', 'tell application "System Events" to keystroke "good bot <3"',
    '-e', 'tell application "System Events" to key code 36',
  ]);
});

test('darwin escapes double quotes and backslashes for AppleScript', () => {
  const [c] = buildCommands('darwin', 'say "hi" \\ wave');
  assert.ok(c.args[1].includes('keystroke "say \\"hi\\" \\\\ wave"'));
});

test('win32 wraps SendKeys specials in braces and appends ENTER', () => {
  const [c] = buildCommands('win32', 'vibes (100%) {ok}+^~');
  assert.strictEqual(c.cmd, 'powershell');
  const psCmd = c.args[c.args.length - 1];
  assert.ok(psCmd.includes("SendWait('vibes {(}100{%}{)} {{}ok{}}{+}{^}{~}{ENTER}')"));
});

test('win32 doubles single quotes for PowerShell single-quoted string', () => {
  const [c] = buildCommands('win32', "it's fine");
  assert.ok(c.args[c.args.length - 1].includes("it''s fine{ENTER}"));
});

test('linux builds xdotool type then key Return', () => {
  const cmds = buildCommands('linux', 'good bot');
  assert.deepStrictEqual(cmds, [
    { cmd: 'xdotool', args: ['type', '--', 'good bot'] },
    { cmd: 'xdotool', args: ['key', 'Return'] },
  ]);
});

test('unknown platform throws', () => {
  assert.throws(() => buildCommands('sunos', 'x'), /Unsupported platform/);
});

test('escapeSendKeys leaves plain praise untouched', () => {
  assert.strictEqual(
    escapeSendKeys('good bot, keep vibing <3'),
    'good bot, keep vibing <3'
  );
});
