# bootytap — design spec

**Date:** 2026-07-10
**Status:** Approved pending final user review
**Inspiration:** [OpenWhip](https://github.com/GitFrog1111/OpenWhip) — the viral digital whip that interrupts Claude Code with Ctrl-C when it's too slow. bootytap is the inversion: instead of punishing Claude, you give it a light affectionate tap and it receives actual praise.

## What it is

A cross-platform system-tray app, published to npm as `bootytap`. You click the peach in the menu bar (or hit a global hotkey) and two things happen at once:

1. A silent ~1.8s "peach tap" animation plays over your screen in a transparent, click-through, always-on-top overlay.
2. A random ASCII-safe praise line (e.g. `good bot, keep vibing <3`) is typed into the focused window followed by Enter. When that window is a running Claude Code session, the praise queues as a real user message, so Claude genuinely receives the encouragement mid-task.

Install and run exactly like OpenWhip: `npm install -g bootytap`, then `bootytap`.

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| Direction of affection | User taps Claude (tray app), not an MCP server |
| Visual style | "Peach classic": hand taps a peach, squash-and-stretch jiggle, hearts float up |
| Tap effect | Types praise + Enter into the focused window (mirror of OpenWhip's Ctrl-C) |
| Trigger | Menu bar/tray icon click AND global hotkey (default ⌘⇧B / Ctrl+Shift+B) |
| Scope | Cross-platform (macOS, Windows, Linux) from day one, published to npm |
| Sound | Silent — the animation carries it |
| Stack | Electron (OpenWhip's stack: tray, globalShortcut, transparent overlay, one JS codebase) |

## User experience

- Tray/menu-bar icon: a small peach. No dock icon, no taskbar entry, ever.
- Tray menu: **Tap now**, **Type praise on/off**, **Launch at login**, **Quit**. The menu also displays the currently active hotkey.
- Trigger via icon click or global hotkey. Rapid-fire taps restart the animation and send another praise line.
- Animation: center of the display the cursor is on, roughly 30% of screen height. Timeline (~1.8s): hand swings in from upper right → one light tap on the peach → peach squash-and-stretch jiggle (two decaying wobbles) → 2–3 hearts float up and fade → overlay hides. Click-through for its entire lifetime; focus is never stolen from the active window.
- Praise typing happens at tap time into whatever window has focus. This is deliberate and documented: if your focus is on Slack, Slack gets told it's a good bot.

## Architecture

One Electron app, four components:

### 1. Main process
App lifecycle, tray icon + menu, `globalShortcut` registration, config persistence, single-instance lock. Orchestrates a tap: show overlay + fire praise injector. A second `bootytap` invocation while running signals the first instance to perform a tap, then exits (CLI tap affordance).

### 2. Overlay window
- Frameless, transparent, fullscreen on the cursor's display, `alwaysOnTop` (screen-saver level), `setIgnoreMouseEvents(true)`, `skipTaskbar`, shown with `showInactive()` so focus stays on the user's terminal.
- Pre-created at launch and kept hidden; a tap shows it, plays the CSS animation, hides on animation end. Recreated on demand if it ever dies.
- Animation is plain HTML/CSS keyframes (already prototyped during brainstorming).
- Art assets: bundled Twemoji SVGs (peach, waving hand, hearts) rather than raw emoji glyphs, so the tap looks identical on macOS/Windows/Linux. Twemoji is CC-BY 4.0; attribution goes in the README.

### 3. Praise injector (per-platform module)
Same pattern as OpenWhip's Ctrl-C injection, but typing a praise string + Enter via `child_process`:

| Platform | Mechanism | Requirement |
|---|---|---|
| macOS | `osascript` → System Events `keystroke` + Return | Accessibility permission |
| Windows | PowerShell `[System.Windows.Forms.SendKeys]::SendWait` | SendKeys special chars (`{}+^%~()`) escaped |
| Linux | `xdotool type --` + `xdotool key Return` | `xdotool` installed (documented, like OpenWhip) |

Praise lines are ASCII-safe only (`<3`, not `♡`) because unicode injection is unreliable through SendKeys/xdotool. Hearts live in the animation.

### 4. Praise pool + config
- ~15 built-in praise lines in a bundled JSON file, selected uniformly at random.
- Config: tiny JSON in Electron's userData dir. Four keys: `typePraise` (bool, default true), `launchAtLogin` (bool, default false), the resolved hotkey, and `injectionHelpShown` (bool — the once-only failure notification flag). No accounts, no network, no telemetry.

## Error handling

- **Animation always plays** even when praise injection fails — graceful degradation.
- Injection failure (missing macOS Accessibility permission, missing xdotool): one system notification explaining the fix, shown once (flag persisted in config), not per tap.
- Hotkey already claimed: fall back to alternate combo (⌘⇧⌥B / Ctrl+Alt+Shift+B); active hotkey visible in tray menu.
- Single-instance lock prevents duplicate trays; see CLI tap affordance above.

## Packaging & distribution

- Repo: `/Users/kali/pet/bootytap`, its own git repo. MIT license + Twemoji CC-BY 4.0 attribution.
- npm package `bootytap` with a `bin` entry launching the Electron app (Electron as a regular dependency, OpenWhip-style). Name availability verified before implementation; fallback name chosen with the user if taken.
- README: demo GIF, install steps, macOS Accessibility permission walkthrough, Linux xdotool note, Windows beta note, OpenWhip inspiration credit.
- Launch at login: Electron `setLoginItemSettings` on macOS/Windows; manual/documented on Linux for v1.

## Testing

- **Unit (CI, all three OS runners):** praise pool selection; per-platform command construction with escaping edge cases — built command strings asserted without executing them.
- **Manual on macOS (development machine):** permission flow, animation timing/placement, focus preservation, praise actually landing in a live Claude Code session, hotkey + tray triggers, multi-display placement.
- **Windows/Linux:** unit-tested in CI; real keystroke behavior unverified until tested on real hardware — README marks both as beta.

## Out of scope for v1

- Sound (decided: silent)
- Hotkey rebinding UI (fallback combo only)
- "Praise only when Claude is idle" detection
- User-editable custom praise file (extension point noted, not built)
- MCP server mode / Claude-taps-you direction (possible v2)
- Unicode praise via clipboard-paste injection

## Success criteria

1. `npm install -g bootytap && bootytap` puts a peach in the menu bar on macOS.
2. Hotkey or icon click plays the silent peach-tap animation centered on the active display without stealing focus or blocking clicks.
3. With a Claude Code session focused, a tap results in a praise line arriving as a queued user message.
4. With praise typing off or permission missing, the animation still plays and the app never crashes.
5. Package publishes cleanly to npm with CI green on all three OS runners.
