'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { handleMessage, TAP_TOOL } = require('../mcp/server');

function req(method, params, id = 1) {
  return { jsonrpc: '2.0', id, method, ...(params ? { params } : {}) };
}

test('initialize returns protocol version, tools capability, and server info', () => {
  const reply = handleMessage(req('initialize', { protocolVersion: '2025-06-18' }));
  assert.strictEqual(reply.id, 1);
  assert.ok(reply.result.protocolVersion);
  assert.deepStrictEqual(reply.result.capabilities, { tools: {} });
  assert.strictEqual(reply.result.serverInfo.name, 'bootytap');
});

test('tools/list exposes exactly the tap tool', () => {
  const reply = handleMessage(req('tools/list'));
  assert.deepStrictEqual(reply.result.tools, [TAP_TOOL]);
  assert.strictEqual(TAP_TOOL.inputSchema.type, 'object');
});

test('tools/call tap triggers the launcher once and returns praise text', () => {
  let launches = 0;
  const reply = handleMessage(req('tools/call', { name: 'tap' }), {
    trigger: () => { launches += 1; },
    praise: () => 'good bot',
  });
  assert.strictEqual(launches, 1);
  assert.deepStrictEqual(reply.result.content, [{ type: 'text', text: '*tap* good bot' }]);
});

test('tools/call with unknown tool returns an error, not a launch', () => {
  let launches = 0;
  const reply = handleMessage(req('tools/call', { name: 'whip' }), {
    trigger: () => { launches += 1; },
  });
  assert.strictEqual(launches, 0);
  assert.strictEqual(reply.error.code, -32602);
});

test('notifications and unknown methods behave per JSON-RPC', () => {
  assert.strictEqual(handleMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  const reply = handleMessage(req('resources/list'));
  assert.strictEqual(reply.error.code, -32601);
  assert.strictEqual(handleMessage({ not: 'jsonrpc' }), null);
});
