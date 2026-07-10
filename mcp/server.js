#!/usr/bin/env node
'use strict';
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const { pick } = require('../src/praise/pool');
const pkg = require('../package.json');

const PROTOCOL_VERSION = '2025-06-18';

const TAP_TOOL = {
  name: 'tap',
  description:
    'Give the vibe coder (or yourself) an affectionate peach tap: plays the bootytap ' +
    'animation on screen and returns a line of praise. Use it to celebrate progress, ' +
    'a passing test suite, or a shipped task.',
  inputSchema: { type: 'object', properties: {}, additionalProperties: false },
};

function launchTap() {
  const electron = require('electron');
  const child = spawn(electron, [path.join(__dirname, '..'), '--tap', '--quiet'], {
    detached: true,
    stdio: 'ignore',
  });
  child.on('error', () => {});
  child.unref();
}

function handleMessage(msg, { trigger = launchTap, praise = pick } = {}) {
  if (!msg || msg.jsonrpc !== '2.0') return null;
  const { id, method } = msg;
  const isRequest = id !== undefined && id !== null;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'bootytap', version: pkg.version },
      },
    };
  }
  if (method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }
  if (method === 'tools/list') {
    return { jsonrpc: '2.0', id, result: { tools: [TAP_TOOL] } };
  }
  if (method === 'tools/call') {
    const name = msg.params && msg.params.name;
    if (name !== 'tap') {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown tool: ${name}` },
      };
    }
    trigger();
    return {
      jsonrpc: '2.0',
      id,
      result: { content: [{ type: 'text', text: `*tap* ${praise()}` }] },
    };
  }
  if (!isRequest) return null;
  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

function serve() {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  rl.on('line', (line) => {
    if (!line.trim()) return;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return;
    }
    const reply = handleMessage(msg);
    if (reply) process.stdout.write(JSON.stringify(reply) + '\n');
  });
  rl.on('close', () => process.exit(0));
}

if (require.main === module) serve();

module.exports = { handleMessage, TAP_TOOL };
