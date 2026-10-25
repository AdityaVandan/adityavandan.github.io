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

## Writing

Essays are a snapshot of [Medium](https://medium.com/@van13heisenberg), rendered in this page’s type. `src/data/writing.json` is the archive. Images live in `public/images/writing/`.

```bash
npm run snapshot     # fetch the feed and merge it into the archive
npm run build:pages  # bundle the essays and emit /writing/<slug>/
```

Medium’s public feed returns the latest stories, and member-only stories arrive as previews. The snapshot keeps stories after they drop out of that list, and a later run fills in the full text if the feed starts including it.

The **Medium writing snapshot** action (Actions → Medium writing snapshot → Run workflow) fetches the feed, rebuilds the Pages bundle, and opens a pull request. Merge that pull request to publish.
