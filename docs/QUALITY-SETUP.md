# Run and configure

This branch preserves the existing UI layout, CMS schema, authentication and chatbot API. It adds `/ar` and `/en`; `/` redirects to `/ar`. The server renders the requested language and the assistant shares that same locale.

1. Use the package manager pinned by `packageManager` and run `pnpm install --frozen-lockfile`.
2. Set the existing database and AI configuration in your local, ignored environment file as appropriate. Never commit real keys.
3. Set **`SITE_URL` to the real public origin before `pnpm build`** (for example your actual HTTPS domain, no locale suffix). This enables canonical/hreflang, sitemap entries and indexing. Without it the landing page deliberately sends `noindex` and omits canonical/hreflang; the sitemap is empty. Do not deploy without configuring the correct origin. No production domain was supplied for this audit.
4. Run `pnpm exec prisma generate`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test`, `pnpm build`, then `pnpm start`.
5. Arabic and English recordings are included. Review [NARRATION.md](NARRATION.md), then test Play audio and mute on both languages.

Fonts are the same Cairo Arabic/Latin variable font bytes as the baseline, served locally. Their SIL OFL license is in `public/fonts/OFL.txt`. Original image/video assets have been retained. The new WebP poster is a display-size derivative.

## Manual acceptance checklist

- Fresh `/ar` and `/en`, including hard refresh: one localized Welcome around five seconds after navigation, responsive top-center placement, both decisions keyboard accessible. It is a non-modal dialog and does not steal focus from an active reader/form.
- Autoplay blocked: clear one-shot Play affordance, no retry loop or false speaking indicator. Click Start Tour during playback and after completion; welcome must not restart.
- Accept, stop on a section for ten seconds: no scroll chasing, safe relocation only when useful, localized bubble/narration. Returning to a narrated section must not replay until Restart tour.
- Open chat during speech or travel: speech and guide bubble stop; chat keeps priority. Escape closes chat. On closing, stale narration must not replay. Restart tour permits sections again.
- Change language during narration and Welcome: cancel old audio, update text/locale, no overlap or new duplicate lifecycle.
- Verify 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 844×390. Include real iOS Safari, Android and desktop Firefox, enlarged text, on-screen keyboard and safe areas.
- Reduced motion: static poster, no relocation or idle float; tour and chat remain usable. Save-Data suppresses mascot video.
- Test real CMS data, forms, admin updates and live chatbot credentials. The audit environment has no production database or AI credentials, so successful fallback rendering is not proof those integrations work.
- Human listening: audio quality, Arabic voice rights, brand pronunciation and consistent loudness.
- Production measurements: mobile/desktop Lighthouse under identical conditions, then field LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile. Lab TBT is not INP. Do not treat a local run as field compliance.

## Intentional limits

Most existing section components still use client-side interactivity and Framer Motion; they are server-rendered HTML but are not fully converted to Server Components. This keeps CMS/animation behavior stable. Some existing orange/white color combinations fail automated contrast checks; resolving them changes approved brand colors and should be reviewed with the design owner. Existing partners arrow controls remain behaviorally unchanged. The current scope does not claim a complete backend/security audit.

## Admin seed credentials

Both seed scripts require `SEED_ADMIN_PASSWORD` from the process environment: use a unique password of at least 12 characters and at most 72 UTF-8 bytes. No default password is supplied; validation fails before database writes. Keep the value out of source control and logs. Existing admin accounts are left unchanged by the seed upsert: rotate any account previously created with a fixed seed password through your normal account-management process. Removing the default here does not remove it from earlier Git history.
