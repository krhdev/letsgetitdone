# Let's Get Shit Done!

An ADHD-friendly planner: Brain Dump, Today's Top 3, Energy Menu, Weekly Planner and Deadline Breakdown. Local-first, no account needed, all data lives in the browser (with a manual backup/restore on the About page).

## Running it locally

```
npm install
npm run dev
```

Then open the localhost link it prints.

## Deploying (Netlify or Vercel)

This is a static site once built, `npm run build` produces a `dist/` folder that any static host can serve.

**Netlify:**
1. Push this repo to GitHub (already done, `amys` branch).
2. In Netlify, "Add new site" → "Import an existing project" → pick this repo.
3. Build command: `npm run build`. Publish directory: `dist`. (Already set in `netlify.toml`, Netlify should pick it up automatically.)
4. Once deployed, add a custom domain, e.g. a subdomain like `app.atofficeadminsolutions.co.uk`, in Netlify's domain settings, then add the CNAME record it gives you wherever the domain is registered.

**Vercel** works the same way, no config needed, it auto-detects Vite.

## Notes

- No backend, no login. Data is per-browser only (see the "Your data" backup section on the About page).
- Brand colours: navy `#1A2744`, gold `#F5C050`, white, matching Let's Get Shit Done Together.
