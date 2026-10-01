# Base44 Dev Environment

## Running the app
- `docker compose -f docker-compose.base44.yml up -d` starts the Next.js dev server on port 3000.
- The container uses `node:22` with corepack-enabled pnpm, bind-mounts the repo, installs deps on startup, then runs `pnpm dev`.
- pnpm install requires `--config.dangerouslyAllowAllBuilds=true` because `pnpm-workspace.yaml` lists `ignoredBuiltDependencies`/`onlyBuiltDependencies` that otherwise cause `ERR_PNPM_IGNORED_BUILDS`.

## Environment variables
All env vars are **lazily loaded** — the homepage and static pages render without any of them. They are only needed when visiting specific pages:
- `SUPA_URL` / `SUPA_KEY` — Supabase project URL and anon key. Required for `/leagues`, `/teams`, and any Supabase-backed page.
- `ESPN_BASE` — ESPN API base URL. Required for ESPN fantasy pages and API routes.
- `ESPN_FANTASY_BASE_V3` — ESPN Fantasy API v3 base URL.
- `ESPN_FASTCAST_CONNECTION_URL` — ESPN Fastcast websocket URL for live scores.
- `TOMORROW_IO` — Tomorrow.io API key for weather features.
- `ESPN_CDN` / `ESPN_CDN_G` — ESPN CDN URLs used by the image builder.

## Next.js config
- `next.config.ts` has `allowedDevOrigins` set to the preview origin (`3000-` + `BASE44_PUBLIC_HOST_SUFFIX`) so HMR/dev assets load in the preview iframe.

## Health check
- Compose healthcheck polls `http://localhost:3000/` and expects a 200.
