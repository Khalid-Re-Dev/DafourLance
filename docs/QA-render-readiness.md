# Pre-deployment verification — 2026-10-11

Scope: a separate branch based on `7d122de514c8ae7ae7c980b52e8e400a84ef5a05`. No hosted service, real database or other project was changed.

## Verified

- Production build and TypeScript checking pass with Next 16.4.0 / React 19.3.0 / Node 24.
- ESLint passes. The frozen pnpm lockfile installs successfully.
- 22 automated tests pass, including the existing narration/asset tests and new session/action authorization tests.
- `pnpm audit --json`: zero reported known vulnerabilities across all severity levels at verification time. This is not a guarantee against all security defects.
- Blueprint validates against `https://render.com/schema/render.yaml.json`: one free service, no database/disk purchase, automatic deployment off.
- Fresh PostgreSQL migration and explicit seed succeed on a disposable local PGlite PostgreSQL engine exposed through its socket adapter. This is not a test of the eventual hosted database or existing user data.
- Actual Prisma persistence tests cover projects, consultants, partners, services and navigation create/update/toggle/delete; text, footer and contact settings; message read/unread/delete; AI knowledge sections/behavior and API-key settings. Repeated seed preserves edited content.
- Production Chromium tests: all 12 admin page routes redirect anonymous visitors; wrong credentials fail; correct login reaches the dashboard; authenticated pages load. Cookie flags include HttpOnly, Secure and SameSite=Lax.
- Authenticated image upload converts PNG to WebP, stores bytes and serves them successfully. Anonymous, invalid-type and oversized requests are rejected. Image bytes remain accessible after restarting the application. Health returns 503 when the database is stopped.
- Arabic and English welcome dialogs appear and local welcome audio advances its playback time after the Play button is clicked. Instrumentation observes real media events without replacing playback. No claim of human voice-quality assessment.
- Public contact submission succeeds and its message can be opened in the authenticated dashboard.
- No uncaught browser page exceptions in the successful browser run.
- Startup control-flow checks confirm missing configuration/migration failure stops startup, seeding requires an explicit flag, and the server uses the supplied port with 0.0.0.0.
- Greeting, narration service/hooks, robot components and static audio/mascot assets are unchanged against the base commit.

## Still required before publication

1. Select/connect a persistent free dedicated PostgreSQL database; do not rely on Render's expiring free PostgreSQL.
2. Identify and back up any existing database and local-only uploads. Review migration against a copy; the initial baseline must not be blindly applied to populated tables.
3. Configure the new service's secrets and admin account. Live AI chat requires its own provider key; recorded greeting does not.
4. Test the actual host after deployment: TLS/database connection, login, CMS edits appearing publicly, uploads, health, logs and resource limits. Docker image execution, mobile visual inspection and production load testing have not been performed in this change.

See `DEPLOYMENT.md` for the startup, baselining and backup workflow. Do not describe the site as published or fully verified in production before these steps are completed.
