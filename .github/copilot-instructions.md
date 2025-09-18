# Copilot / Agent Instructions — Quick Log Extension

Purpose

- Short, focused instructions to help an AI coding agent be productive in this repository (Chrome extension built with React + Vite + Tailwind + @crxjs).

Big-picture architecture (what to read first)

- This is a Chrome extension (Manifest V3) implemented with a React UI and packaged by Vite + @crxjs/vite-plugin.
  - `manifest.json` — declares permissions, `content_scripts`, and a background `service_worker` entry (`"src/background.jsx"`). Start here to understand extension boundaries.
  - `src/background.jsx` — MV3 background/service worker. Must avoid DOM APIs and use Chrome extension APIs (chrome.action, chrome.scripting). Example: use `chrome.action.onClicked` and `chrome.scripting.executeScript(...)` to inject `src/content.jsx`.
  - `src/content.jsx` — content script that runs in web pages. This file uses DOM APIs (e.g., `document.createElement`, `document.addEventListener`) and is responsible for selection handling + showing popups.
  - `src/*` — React UI code (popup/option pages) and reusable UI primitives are under `src/components`.

Key files and what they mean

- `manifest.json` — Manifest V3. Permissions include `storage`, `scripting`, and `activeTab`. Content scripts listed by path; background points at `src/background.jsx`.
- `vite.config.js` — Vite config. Uses `@crxjs/vite-plugin` to build a Chrome extension. The plugin rewrites manifest paths during build; careful when referencing `src/*` directly in the manifest during development vs after build.
- `package.json` — scripts: `npm run dev` (vite), `npm run build` (vite build). Use these for local development or packaging.
- `src/background.jsx` — background/service worker. Keep it free of `document`/`window`. Use `chrome.scripting.executeScript({ target, files }, callback)` to inject content scripts.
- `src/content.jsx` — content script: handles selection, fetches definitions (Merriam-Webster fallback), calls OpenAI via `import.meta.env.VITE_OPENAI_API_KEY`, and renders popups in-page.
- `src/components/ui/*` — UI primitives (e.g., `Input`, `Button`) using Tailwind utilities and `cn` helper from `src/lib/utils.js`.
- `src/App.css` and `src/index.css` — global styles, Tailwind theme variables, and custom CSS variables (e.g., `--border`, `--input`). These control colors used by `border-input`, `border-border`, etc.

Developer workflows (how to run, debug, build)

- Start dev server (hot reload for UI):
  - `npm run dev`
- Build for production (produces extension-ready artifacts using @crxjs plugin):
  - `npm run build`
- Load the extension in Chrome (after build):
  1. Open `chrome://extensions/` → Enable "Developer mode" → Load unpacked → pick the build output folder (the plugin typically outputs `dist/`).
  2. If using dev without build, ensure manifest paths are valid for the loaded folder.

Debugging notes (extension-specific)

- Service worker console: go to `chrome://extensions/`, find the extension, click "service worker" (or "background") to open DevTools for the background worker. Service worker logs and exceptions appear there.
- Content script errors: open the page you injected into, open DevTools → Console to see runtime errors thrown by `src/content.jsx`.
- Common runtime pitfalls in this repo:
  - Wrong Chrome API names (e.g., `chrome.action.onclicked` is incorrect — use `chrome.action.onClicked`).
  - Using DOM APIs in the background/service worker. Background should not access `document` or `window`.
  - Manifest paths vs built assets: manifest may reference `src/*.jsx` in source; after building, the plugin rewrites or outputs hashed assets. If Chrome reports "file not found", open the built `manifest.json` in the `dist` folder to confirm paths.

Project-specific patterns & conventions

- UI primitives: `src/components/ui/*` hold reusable components. `Input` uses a `cn(...)` helper (from `src/lib/utils.js`) that merges `clsx` + `tailwind-merge`.
- Tailwind + CSS variables: `src/App.css` defines theme tokens like `--border`, `--input` and applies `@apply border-border` globally. Prefer adding explicit Tailwind color utilities (e.g., `border-gray-700`) when a visible border must be forced in both light/dark themes.
- Content injection: `background.jsx` injects the content script using `chrome.scripting.executeScript({ target: { tabId }, files: ['src/content.jsx'] })`. Ensure `files` refers to a real file in the extension package after build.
- Environment variables: OpenAI key is read with `import.meta.env.VITE_OPENAI_API_KEY` in `src/content.jsx`. Use `.env` files and Vite conventions when running locally.

Integration points & external dependencies

- OpenAI: `src/content.jsx` calls `https://api.openai.com/v1/responses` with `import.meta.env.VITE_OPENAI_API_KEY`.
- Merriam-Webster dictionary APIs: code attempts a primary and fallback API key/endpoint.
- External asset injection: Font Awesome is injected via CDN inside the content script.
- Packaging: `@crxjs/vite-plugin` integrates extension packaging into the Vite build process — changes here affect how manifest paths are rewritten.

Examples to reference when modifying code

- Correct background listener and injection (example from `src/background.jsx`):

  chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
  { target: { tabId: tab.id }, files: ['src/content.jsx'] },
  (res) => { if (chrome.runtime.lastError) console.error(chrome.runtime.lastError) }
  )
  })

- Content script usage of env var (OpenAI key):

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

What AI agents should avoid changing without user confirmation

- `manifest.json` entries that alter permissions or host permissions.
- `vite.config.js` unless fixing build/chunking issues — changing the CRX plugin options can break packaging.
- API keys or endpoints embedded in code — these are deliberate and sensitive.

Useful commands & quick references

- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Inspect background/service worker: `chrome://extensions/` → find extension → Service Worker → Inspect

If you modify build output mapping

- After edits to `vite.config.js` or `manifest.json`, always run `npm run build` and then verify the built `manifest.json` (in the build output directory) to confirm `background.service_worker` and `content_scripts` paths point to actual files.

Where to look for related behavior

- UI primitives: `src/components/ui/*`
- Core logic (selection, API calls): `src/content.jsx`
- Background orchestration (injection): `src/background.jsx`
- Global styling/theme tokens: `src/App.css` and `src/index.css`

If anything is unclear or you want me to include more examples (e.g., recommended `manualChunks` for `vite.config.js`, or a template `.env.example`), tell me which areas to expand and I will iterate.
