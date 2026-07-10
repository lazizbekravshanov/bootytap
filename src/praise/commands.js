'use strict';

const SENDKEYS_SPECIALS = new Set(['+', '^', '%', '~', '(', ')', '{', '}', '[', ']']);

function escapeSendKeys(text) {
  return [...text].map((ch) => (SENDKEYS_SPECIALS.has(ch) ? `{${ch}}` : ch)).join('');
}

function escapePowerShellSingleQuoted(text) {
  return text.replace(/'/g, "''");
}

function escapeAppleScript(text) {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildCommands(platform, text) {
  if (platform === 'darwin') {
    return [
      {
        cmd: 'osascript',
        args: [
          '-e', `tell application "System Events" to keystroke "${escapeAppleScript(text)}"`,
          '-e', 'tell application "System Events" to key code 36',
        ],
      },
    ];
  }
  if (platform === 'win32') {
    const payload = escapePowerShellSingleQuoted(escapeSendKeys(text)) + '{ENTER}';
    return [
      {
        cmd: 'powershell',
        args: [
          '-NoProfile',
          '-Command',
          `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${payload}')`,
        ],
      },
    ];
  }
  if (platform === 'linux') {
    return [
      { cmd: 'xdotool', args: ['type', '--', text] },
      { cmd: 'xdotool', args: ['key', 'Return'] },
    ];
  }
  throw new Error(`Unsupported platform: ${platform}`);
}

module.exports = { buildCommands, escapeSendKeys, escapeAppleScript, escapePowerShellSingleQuoted };
