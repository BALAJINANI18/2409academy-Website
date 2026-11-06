# 2409 Academy

React (Vite) website + Spring Boot API + PostgreSQL (`2409_academy` database).

**Quick start:** set up the database and run the API as described in [`backend/README.md`](backend/README.md),
then in this folder run `npm install` and `npm run dev` and open http://localhost:5173.

---

# 2409 Academy — Explore Page Update

## What's changed
- Added a separate `/explore` page with dedicated learning-path cards for DSA, SQL, System Design, Java, Spring Boot, Python & AI/ML, and Git/GitHub & Cloud.
- Moved the DSA practice experience off the homepage into the Explore page.
- DSA practice includes searchable problems, hints, local progress tracking, language starter templates, and local code drafts.
- Added mobile-responsive layout and Netlify SPA fallback (`public/_redirects`).
- The homepage navigation now links to Explore.

## Run locally
From the folder containing `package.json`:

```bash
npm install
npm run dev
```

Open the local URL Vite displays. Click **Explore** in the navigation, or visit `/explore`.

## Build and deploy to Netlify
```bash
npm run build
```
Upload the contents of the generated `dist` folder to your existing Netlify site, or connect the project repository and use build command `npm run build` with publish directory `dist`.

## Current limitations
Course cards other than DSA are previews marked **Available soon**. DSA progress and draft code are stored in the visitor's browser. The editor does not execute or grade code; a secure code runner and backend/student accounts would be needed for that.
