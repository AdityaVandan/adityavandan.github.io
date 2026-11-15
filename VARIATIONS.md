# Portfolio design variations

Shared stack on every branch: **React 19 + Vite 8** (CSS only — no extra UI libraries).
Shared content: `src/data/content.json` (Spotlight handoff) with adapters in `src/data/content.js`.

Story every variation must tell: Aditya is an **expert full-stack AI software engineer** — product surface, services, and production AI agents — for recruiters, hiring managers, and consultancies.

## Current: Spotlight

Apple-product-page feel: dark graphite, centred sections, frosted-glass panels, tightly tracked type, and a scroll-linked spotlight glow (`--a`, `--b`, `--gx`).

## Failure criteria (do not ship)
- Redesigning away from the Spotlight handoff / `reference.html`
- Raw values outside `tokens.json`; strings not from `content.json`
- No story (pretty layout that could belong to anyone)
