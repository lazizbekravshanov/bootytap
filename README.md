# bootytap 🍑

A light, affectionate tap for your vibe-coding agent.

[OpenWhip](https://github.com/GitFrog1111/OpenWhip) whips Claude Code into shape with a Ctrl-C.
bootytap is the loving inversion: a gentle peach tap on your screen, and a little praise —
`good bot, keep vibing <3` — typed straight into your Claude Code session, where it queues
as a real user message. Claude genuinely receives the love.

Silent. Click-through. Never steals focus.

## Install

```bash
npm install -g bootytap
bootytap
```

A peach appears in your menu bar / system tray.

## Use

- **Click the peach** (macOS/Windows) or pick **Tap now** from the tray menu (Linux)
- **Hotkey:** `⌘⇧B` on macOS, `Ctrl+Shift+B` on Windows/Linux
  (falls back to `⌘⌥⇧B` / `Ctrl+Alt+Shift+B` if taken — the tray menu shows the active one)
- Running `bootytap` again while it's already running triggers a tap from the CLI

Each tap plays the animation and types a random praise line + Enter into whatever window
has focus. Focus your Claude Code terminal first — or turn off **Type praise** in the tray
menu for animation-only affection. Note that the trailing Enter will submit whatever was
already typed in the focused field, so aim your affection carefully. bootytap doesn't
start at login yet — add it to your OS's login items or autostart manually if you want it
always running.

## Platform notes

- **macOS** — praise typing needs Accessibility permission:
  System Settings → Privacy & Security → Accessibility → enable bootytap
  (it may be listed as Electron). The animation works without it.
- **Windows (beta)** — uses PowerShell SendKeys. CI-tested, not yet human-tested.
- **Linux (beta)** — install [`xdotool`](https://github.com/jordansissel/xdotool)
  (`sudo apt install xdotool`) for praise typing. A compositor is required for the
  transparent overlay. Tray needs app-indicator support.

## Credits

- Inspired by [OpenWhip](https://github.com/GitFrog1111/OpenWhip) — the whip; this is the pat.
- Peach, hand, and heart graphics are [Twemoji](https://github.com/jdecked/twemoji)
  by Twitter/X and contributors, licensed [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

MIT licensed. Be kind to your robots.
