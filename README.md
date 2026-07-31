# IIT Dharwad ESP32 Biometric Attendance Portal

Web management portal for an ESP32 based fingerprint attendance
system deployed at IIT Dharwad. This repo is the **web platform** only —
students, professors, courses, enrollments, and attendance records. Fingerprint
capture and offline sync are handled by Raspberry Pi services that talk to
this backend's `/api/v1/iot` surface (not yet built — see Phase 8 in
`docs/development-plan.md`, to be added).

## Monorepo layout

```
attendance-management-system/
├── apps/
│   ├── frontend/    React + Vite + Tailwind
│   └── backend/     Node.js + Express + Prisma
├── packages/
│   ├── shared-types/  Domain types shared across both apps
│   ├── validation/    Zod schemas shared across both apps
│   └── constants/     Roles, API prefix, department/program lists
├── docs/            Architecture, ER diagram, API docs (added as built)
└── scripts/         One-off / maintenance scripts
```

## Architecture decisions locked in

These were decided explicitly and should be revisited deliberately, not
silently overridden by a future edit:

- **Hard deletes.** No soft-delete columns. Foreign keys default to
  `RESTRICT`, so deleting a student/professor with existing attendance or
  enrollment rows fails at the database level. The backend surfaces this
  as a `409 CONFLICT` (see `middleware/errorHandler.ts`), not a silent
  cascade.
- **Fingerprint templates stay embedded.** `template Bytes?` lives
  directly on `Student` and `Professor`, not in a separate table. Trade-off
  accepted: only one template per person, and `SELECT *` on those tables
  carries the blob.
- **Modular monolith now, microservices-ready later.** Business logic is
  strictly layered (`controllers → services → repositories`) inside a
  single Express app, so a module (e.g. Attendance) can be lifted into its
  own service later without a rewrite.

## Getting started

### Prerequisites
- Node.js ≥ 20
- A Supabase project (Postgres + Google OAuth already configured)

### Install
```bash
npm install
```

### Environment variables
Copy the example files and fill in real values:
```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # loads departments + programs
```

### Run locally
```bash
npm run dev:backend    # http://localhost:4000
npm run dev:frontend   # http://localhost:5173
```

## Adding a new resource module (backend)

Copy the `departments` module as a template:
1. `prisma/schema.prisma` — model already exists for most core entities.
2. `src/validators/<name>.validator.ts` — Zod schemas for create/update.
3. `src/repositories/<name>.repository.ts` — Prisma queries only.
4. `src/services/<name>.service.ts` — business rules, throws `AppError`.
5. `src/controllers/<name>.controller.ts` — req/res orchestration only.
6. `src/routes/<name>.routes.ts` — wire `authenticate` + `requireRole` +
   `validate` + controller methods.
7. Mount it in `src/routes/index.ts`.

Never let a controller call Prisma directly, and never put business rules
(e.g. "a course must have a professor") in the repository layer.

## Deployment

See `docs/deployment.md` for the full Vercel + Supabase walkthrough
(two Vercel projects, one per app, plus the env vars each needs). RLS
policies for the ESP32/Pi's direct Supabase writes are in
`docs/supabase-rls.sql`.

## Status

Phase 1 (architecture, schema, folder structure) and the start of Phase 2
(project setup) are done. See conversation history / `docs/` for the full
phase breakdown from the master prompt.
