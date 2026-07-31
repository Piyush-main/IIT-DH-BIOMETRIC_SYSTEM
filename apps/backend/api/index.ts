/**
 * Vercel serverless entrypoint. Vercel's Node runtime imports this file
 * directly and calls the exported Express app as a request handler — it
 * does NOT run src/server.ts (which calls app.listen and expects a long-
 * lived process). Local dev still uses `npm run dev` -> src/server.ts;
 * this file is ONLY used in the deployed environment.
 */
import { createApp } from '../src/app.js';

const app = createApp();

export default app;
