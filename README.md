# Let's Get Shit Done!

An ADHD-friendly planner: Brain Dump, Today's Top 3, Energy Menu, Weekly Planner and Deadline Breakdown. Local-first, no account needed, all data lives in the browser (with a manual backup/restore on the About page) — with an optional sign-in on the About page for people who want their data to follow them across devices.

## Running it locally

```
npm install
npm run dev
```

Then open the localhost link it prints.

## Optional cross-device sync (Supabase)

The app works fully offline with no setup. To turn on the optional "sync across devices" sign-in on the About page, it needs a Supabase project:

1. Copy `.env.example` to `.env`.
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project's Settings → API page (the anon key is a public key, safe to ship in the frontend).
3. The project needs a `gsd_data` table (`id` uuid PK, `user_id` uuid unique references `auth.users`, `data` jsonb, `updated_at` timestamptz) with Row Level Security restricting each row to its own `user_id`, and Email auth enabled (magic link).

Whichever host this deploys to also needs those same two variables set in its own environment variable settings, since `.env` itself isn't committed to the repo.

## Deploying (Netlify or Vercel)

This is a static site once built, `npm run build` produces a `dist/` folder that any static host can serve.

**Netlify:**
1. Push this repo to GitHub (already done, `amys` branch).
2. In Netlify, "Add new site" → "Import an existing project" → pick this repo.
3. Build command: `npm run build`. Publish directory: `dist`. (Already set in `netlify.toml`, Netlify should pick it up automatically.)
4. Once deployed, add a custom domain, e.g. a subdomain like `app.atofficeadminsolutions.co.uk`, in Netlify's domain settings, then add the CNAME record it gives you wherever the domain is registered.

**Vercel** works the same way, no config needed, it auto-detects Vite.

## Notes

- Local-first: data lives in the browser by default (see the "Your data" backup section on the About page). Signing in via the "Sync across devices" card is optional and layers Supabase on top, it isn't required to use the app.
- Brand colours: navy `#1A2744`, gold `#F5C050`, white, matching Let's Get Shit Done Together.
