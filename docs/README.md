# Documentation

- `deployment.md` — step-by-step Vercel + Supabase deployment guide
- `supabase-rls.sql` — Row Level Security policies for the `attendance`
  table, needed because the ESP32/Pi devices write directly to Supabase

Still to be added in later phases:
- `architecture.md` — system architecture diagram + explanation
- `er-diagram.md` — entity-relationship diagram (generated from `schema.prisma`)
- `api/` — per-module API documentation (request/response shapes, status codes)
- `developer-guide.md` — conventions for adding a new module, testing, PR checklist
