# Design Document

## Overview

A single-page static app. `index.html` holds four sections (greeting, timer, to-do, quick links). `css/style.css` styles them. `js/app.js` contains all behavior inside one IIFE in strict mode. There is no build step. The app opens directly from the file system.

## Project Structure

```
CodingCamp-16November26-AndiEP/
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Layout

A two-column CSS grid on desktop, collapsing to one column at 700px or narrower.

| Section | Position |
|---|---|
| Greeting | Full width, top |
| Focus Timer | Left column |
| To-Do List | Right column |
| Quick Links | Full width, bottom |

## Components

`js/app.js` is organized into sections:

1. **Storage helpers**: `load(key, fallback)` parses JSON from Local Storage and returns the fallback on missing or corrupt data. `save(key, value)` writes JSON.
2. **Greeting/clock**: `getGreeting(hour)` and `updateClock()`, refreshed by `setInterval` every 1000 ms.
3. **Focus timer**: `startTimer`, `stopTimer`, `resetTimer`, `renderTimer`. State is `remaining` (seconds) and `timerId`. Start is ignored if `timerId` is already set.
4. **To-do list**: `renderTodos()` rebuilds the list from the `todos` array. `editingId` marks the Task being edited. Enter or Save commits an edit, and Esc cancels it.
5. **Quick links**: `renderLinks()` rebuilds the chips from the `links` array. `normalizeUrl()` adds `https://` and validates with `new URL`.

## Data Models

Stored in Local Storage as JSON arrays.

| Key | Item shape |
|---|---|
| `dashboard.todos` | `{ id: number, text: string, done: boolean }` |
| `dashboard.links` | `{ id: number, name: string, url: string }` |

`id` is `Date.now()` at creation time. Default links are used only when the `dashboard.links` key does not exist, so a user who deletes every link keeps an empty list.

## Security and Robustness

- User text is inserted with `textContent`, never `innerHTML`, to prevent XSS.
- Link URLs are limited to `http:` and `https:`. This blocks `javascript:` URLs.
- Links use `target="_blank"` with `rel="noopener noreferrer"`.
- Corrupt Local Storage data falls back to an empty or default list.

## Performance

Lists are small, so a full re-render on each change is fast enough. The clock uses one 1-second interval. The timer interval runs only while counting.

## Browser Compatibility

Uses only widely supported APIs: `localStorage`, `URL`, `Array.prototype.find/filter/forEach`, CSS grid and custom properties. The code is also usable as a browser extension page, since it has no server dependency.

## Known Limitations

- The timer is driven by `setInterval`, so it can drift or slow down in background tabs. It does not persist across page reloads.
- Edits to a Task are not restricted to a single task at once beyond one `editingId`.
