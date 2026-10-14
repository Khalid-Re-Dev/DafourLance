# Deployment and data safety

Use the dedicated free **DafourLance** Render workspace (`tea-db5jjl59fdbs73d438bg`). Do not reuse the old suspended service or modify other projects, databases or environment groups.

## Release blockers

The repository does not include the current database or uncommitted local uploads. Identify and back up both before deploying. A dedicated persistent PostgreSQL database is required. Render's free PostgreSQL expires after 30 days; it is unsuitable for a permanent free deployment. Choose a persistent free external database and monitor its storage/egress quota. No service has been deployed by this change.

## Fresh database

1. Use Node 24 LTS and pnpm 11.25.0; run `pnpm install --frozen-lockfile` and `pnpm exec prisma generate`.
2. Set server-only `DATABASE_URL` to the dedicated PostgreSQL database, with TLS as required by its provider.
3. Run `pnpm db:migrate` to apply the full PostgreSQL baseline.
4. Set `SEED_ADMIN_EMAIL` (optional; existing default `admin@daforlance.com`) and a unique `SEED_ADMIN_PASSWORD` of at least 12 characters and at most 72 UTF-8 bytes. Run `pnpm db:seed` once.
5. Set `AUTH_SECRET` to a cryptographically random secret of at least 32 bytes. Never commit credentials.

On Render without shell access, temporarily set `BOOTSTRAP_DATABASE=true` and the seed variables on this service. Startup applies migrations and seeds only when explicitly enabled. After successful first login remove the flag and seed password. Normal restarts never seed. Explicit seeding preserves existing content and passwords but adds missing defaults, so it should not run routinely.

## Existing data: stop before using fresh-database steps

Never run `migrate reset`, `db push --force-reset` or `--accept-data-loss` on a real database. Startup performs none of these operations.

The previous SQLite SQL is preserved byte-for-byte in `prisma/legacy-sqlite-migrations`. The new `0_postgresql` baseline includes all current tables and nullable `UploadedImage.data`.

- SQLite: export into a fresh PostgreSQL database, preserving IDs, content, hashes, dates, booleans and ordering. Compare records and image URLs before switching.
- Existing PostgreSQL: back up and test on a copy, inspect `_prisma_migrations`, and compare with `prisma/schema.prisma` using `prisma migrate diff`. Review and apply only necessary additive SQL. Never blindly apply the new initial migration to populated tables.
- Only after the actual schema matches the baseline, manually run `pnpm exec prisma migrate resolve --applied 0_postgresql`. Startup never baselines automatically. Keep backups and previous migration history.
- Existing bcrypt passwords remain valid. Old SHA-256 passwords require their exact original secret in `LEGACY_AUTH_SECRET`; successful login upgrades them to bcrypt. No default secret is accepted. Existing sessions must log in again.

## Persistent images

New CMS images are converted to WebP, stored in PostgreSQL and served by `/api/images/<id>`. No paid disk or separate storage subscription is needed. Limits: 5 MB input, 25 million pixels, 1920px bounding box, 1 MB optimized image, 100 MB total new images. Quota checks are serialized by PostgreSQL. This suits a small CMS, not a media library. Include image bytes in backups and database storage/egress planning.

Existing `/uploads/...` URLs remain unchanged. Copy/back up or re-upload files that exist only on your device before release. Committed public assets remain available. Greeting MP3s, robot media and local fonts are untouched static assets; no TTS model runs on Render.

## Render configuration

`render.yaml` defines one free Node web service, no paid disks or database. Automatic deployment is disabled. Use the dedicated workspace and supply `DATABASE_URL`; the Blueprint generates `AUTH_SECRET`.

- Build: `npx --yes pnpm@11.25.0 install --frozen-lockfile --prod=false && npx --yes pnpm@11.25.0 exec prisma generate && npx --yes pnpm@11.25.0 build`
- The pinned pnpm runs from npm's cache. Do not install it globally: Render's system package directory is read-only (`EROFS`). Keep `--prod=false` so the build includes TypeScript and Tailwind dependencies even when `NODE_ENV=production`.
- Start: `node scripts/start-production.cjs`
- Health: `/api/health` returns 503 if required database queries fail.
- Node: 24. The server binds to `0.0.0.0` on Render's `PORT`.
- Set `SITE_URL` for a custom HTTPS domain. Otherwise `RENDER_EXTERNAL_URL` supplies the canonical origin.

Free web services sleep after 15 minutes of inactivity and have cold starts and resource quotas. A dedicated workspace isolates its quota from other projects; it does not guarantee uninterrupted availability.

## Chat and greeting

Recorded greeting needs no API key. Generated chat uses OpenRouter (`openrouter/free`) and needs a correct OpenRouter key in the admin settings or `OPENROUTER_API_KEY`. `OPENAI_API_KEY` remains a legacy fallback but must contain the correct provider's key. Model availability is external. Input/output limits and bounded per-process throttling reduce load; limits reset on restart and are not shared across replicas. They supplement authentication.

## Verification

Run `pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`. Use a disposable local database for `TEST_DATABASE_URL=... node scripts/test-admin-database.cjs` after migration/seed; it modifies test data and must never point to production.

Before going live verify login, protected pages/actions, all CMS operations, contact submission, image persistence across restart, Arabic/English greeting playback and responsive presentation. Then repeat health, login, uploads, CMS-to-landing updates and log checks on the actual host. Local tests do not establish hosted readiness or data-migration safety.

## Restore the services shown in the reference

After restoring the SQLite backup into the dedicated PostgreSQL database, preview the scoped service repair:

```sh
node scripts/restore-reference-services.cjs
```

Verify that DATABASE_URL targets DafourLance, then apply explicitly:

```sh
node scripts/restore-reference-services.cjs --apply
```

This transaction activates and orders the six reference services (web development, UI design, marketing, training, consulting, analytics). It creates only missing services, matches imported records by ID or exact Arabic/English title, preserves existing descriptions and IDs, and stops on ambiguous duplicates. It never changes projects, users or other CMS tables. It is not part of startup. The existing SQLite backup includes all six services but marketing is inactive; ordinary seed intentionally does not override this state.

The project section now shows the first four active records in CMS order, with View all/Show less for additional records and the existing detail dialog. The backup contains two extra test projects: these remain intact and visible according to CMS order. Review their publishing status in the dashboard instead of deleting them during migration. No fabricated fallback project is displayed when the database is empty or unavailable.
