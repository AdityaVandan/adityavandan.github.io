# Aditya Vandan Sharma — Portfolio

Letterpress design-language variation. React 19 + Vite 8.

## Live site

GitHub Pages serves this repository from the **master** branch root:

**https://adityavandan.github.io/**

Production static files (`index.html`, `assets/`, images, `.nojekyll`) are
committed at the repo root. Source lives in `src/` + `index.source.html`.

## Develop

```bash
npm install
npm run dev          # opens /index.source.html
```

## Publish to GitHub Pages

```bash
npm run build:pages  # vite build + sync dist/ → repo root
git add -A && git commit -m "Update Pages build" && git push
```

Then merge to `master` (or push to master) for the live site to update.
