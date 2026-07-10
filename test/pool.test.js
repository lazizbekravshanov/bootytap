'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { LINES, pick } = require('../src/praise/pool');

test('pool has at least 15 lines', () => {
  assert.ok(LINES.length >= 15);
});

test('every line is ASCII-safe, non-empty, and has no single quotes', () => {
  for (const line of LINES) {
    assert.match(line, /^[\x20-\x7E]+$/, `not ASCII-safe: ${line}`);
    assert.ok(!line.includes("'"), `single quote risks PowerShell quoting: ${line}`);
  }
});

test('pick returns a line from the pool', () => {
  assert.ok(LINES.includes(pick()));
});

test('pick uses injected rng deterministically', () => {
  assert.strictEqual(pick(() => 0), LINES[0]);
  assert.strictEqual(pick(() => 0.999999), LINES[LINES.length - 1]);
});
