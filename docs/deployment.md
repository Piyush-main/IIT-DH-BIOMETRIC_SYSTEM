# Deployment Guide — Vercel + Supabase

This repo deploys as **two separate Vercel projects** from the same GitHub
repo (standard for an npm-workspaces monorepo): one for `apps/backend`,
one for `apps/frontend`.

## 1. Push to GitHub

Vercel deploys from a Git repo, not a local folder — commit and push this
project first.

## 2. Backend project

In Vercel: **New Project → Import your repo**.

- **Root Directory**: `apps/backend`
- **Framework Preset**: Other
- Vercel auto-detects `apps/backend/vercel.json` and `apps/backend/api/index.ts`
  as the serverless function entrypoint.
- **Environment variables** (Project Settings → Environment Variables),
  same keys as `apps/backend/.env.example`:
  - `DATABASE_URL` — Supabase pooled connection string (port 6543, `pgbouncer=true`)
  - `DIRECT_URL` — Supabase direct connection string (port 5432) — Prisma
    migrate needs this even though the app uses the pooled one at runtime
  - `SUPABASE_URL`
  - `SUPABASE_JWT_SECRET`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_EMAILS`
  - `CORS_ORIGIN` — set this to your **frontend's** Vercel URL once you
    have it (step 3). Update and redeploy after the frontend is live.
- Deploy. Vercel runs `npx prisma generate && npm run build` per
  `apps/backend/vercel.json`.

Note the deployed URL, e.g. `https://attendance-backend.vercel.app`.

## 3. Frontend project

**New Project → Import the same repo again.**

- **Root Directory**: `apps/frontend`
- **Framework Preset**: Vite
- **Environment variables**, same keys as `apps/frontend/.env.example`:
  - `VITE_API_BASE_URL` — `https://<your-backend-url>.vercel.app/api/v1`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Deploy.

## 4. Close the loop

Go back to the **backend** project's env vars and set `CORS_ORIGIN` to the
frontend's actual deployed URL, then redeploy the backend (env var changes
require a redeploy to take effect).

## 5. Supabase side

- **Google OAuth**: in Supabase Auth settings, add your frontend's Vercel
  URL to the allowed redirect URLs.
- **Database migrations**: run `npx prisma migrate deploy` locally (with
  `DATABASE_URL`/`DIRECT_URL` pointed at Supabase) before or after first
  deploy — Vercel's build step does NOT run migrations automatically, only
  `prisma generate`. Running migrations from CI/CD on every deploy is a
  reasonable next step but isn't wired up here.
- **RLS for the ESP32 device**: see `docs/supabase-rls.sql`. Apply this in
  the Supabase SQL editor if the device uses the `anon` key.

## Common failure modes

- **Backend 500s with a Prisma engine error**: almost always means
  `binaryTargets` in `schema.prisma` doesn't include `rhel-openssl-3.0.x`
  (already set in this repo) or `prisma generate` didn't run — check the
  Vercel build logs for the `buildCommand` output.
- **CORS errors in the browser**: `CORS_ORIGIN` on the backend doesn't
  match the frontend's exact deployed URL (including `https://`, no
  trailing slash).
- **401 on every request after login**: `SUPABASE_JWT_SECRET` on the
  backend doesn't match the value in Supabase (Project Settings → API →
  JWT Secret) — this is different from the anon/service-role keys.
