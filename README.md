# Example.en — Experimental Domain Platform

Example.en is a complete static demonstration platform for creating and managing experimental `.en` domain names. It uses only HTML, CSS, and JavaScript and works directly from `index.html` or on GitHub Pages.

> **Important:** `.en` is a fictional namespace used inside this project. It is not a real global TLD. This site does not register domains, publish DNS records, or connect to the public internet.

## Features

- Responsive, modern interface for desktop, tablet, and mobile.
- Domain search with `Available`, `Registered`, and `Reserved` states.
- Domain creation with strict validation: `a-z`, `0-9`, hyphens, and 1–63 characters.
- Reserved names: `example.en`, `test.en`, `admin.en`, `www.en`, and `opencodex.en`.
- Dashboard actions: Copy, Delete, and View.
- LocalStorage persistence with no backend, database, or paid API.
- Light/Dark mode saved in LocalStorage.
- English/Arabic language switch with RTL support.
- Accessible semantic HTML, favicon, description, and Open Graph metadata.
- Safe DOM construction for user-provided domain names; user input is not inserted into HTML markup.

## Run locally

No dependencies or build step are required. Open `index.html` in a browser, or use any static server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy to GitHub Pages

The site is configured to be served as a project site from:

- Branch: `main`
- Folder: `/ (root)`
- URL: <https://opencodex-org.github.io/nono/>

To enable or verify it, open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save. Do not configure a custom domain: `example.en` is only the fictional name displayed inside the application.

All links to project assets use relative paths (`style.css`, `script.js`, and `assets/logo.svg`), so they work under the `/nono/` project-site path as well as when opening `index.html` locally. The repository must not contain a populated `CNAME` file.

Since data is stored in LocalStorage, each browser has its own private list; domains are not shared between users or devices.

## How to use

1. Use **Search** in the hero section to check a name.
2. Reserved names cannot be registered, and names already in the local dashboard show as Registered.
3. Enter a valid name in **Create your .en domain**, then select **Create**.
4. Use **Copy**, **View**, or **Delete** in the dashboard.
5. Toggle **Dark Mode** or **EN / AR** from the header.

## Project files

```text
/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── logo.svg
```
