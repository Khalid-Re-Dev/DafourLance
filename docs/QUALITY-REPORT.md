# Landing quality audit and implementation

## 1. Git baseline

Starting branch: `main`. Baseline: `2e671919a645fb8a033dbf5af89f549c4412f615`.
Working branch: `feat/landing-quality-v2`. Existing history preserved; no automatic merge or production deployment. No AGENTS.md was present in the checked-out repository. See the branch/PR for the delivery commit.

## 2. Architecture audit

The baseline mounted separate LanguageProviders around the page and global assistant, so the visible locale and spoken locale could diverge. Guide and motion hooks each independently observed the same sections; narration was split between the guide, assistant component and native speech service. Section eligibility was never reliably written back to the guide cycle.

Now a shared URL-driven provider owns locale. One settled-scroll detector supplies the active section. The guide hook owns Welcome, dwell, section consumption and narration requests. The motion hook owns geometry and safe anchors. The narration service owns audio and cancellation generations. Chat remains higher priority.

## 3. Motion root causes

Baseline travel used 800–2000 ms durations, self-collided with its own FAB, could choose an unsafe preferred anchor when all candidates collided, and retained overlapping timers. Constant pulse/tilt and an animated hit target added distraction and made automated clicking unreliable. The hit target is now stationary during idle; only the inner illustration floats.

## 4. Final motion behavior

One passive scroll listener; geometry measured on settling and dwell, not every frame. Active scrolling cancels pending contextual actions. After ten seconds of dwell, a safe destination can be selected; short moves are skipped. Travel is distance-dependent, 500–900 ms, eased without spring overshoot. Idle drift is 3 px over seven seconds. Initial placement and resizing also inspect protected controls. Chat docks the trigger outside its window. Dense layouts can still require manual inspection; no claim of universal collision freedom.

## 5. Welcome / intro

Eligibility belongs to the browser document, not persistent storage. Delay targets five seconds from navigation, with lazy-load scheduling taken into account. Strict Mode cleanup cancels outstanding timers. Hard refresh creates a new lifecycle; locale navigation does not. Start Tour cancels current Welcome without restarting it. The responsive non-modal dialog does not forcibly steal focus; Escape dismisses it when focused.

## 6. Audio architecture

Versioned local MP3 → matching-language system voice → visual only. Assets are requested on demand. There are no browser TTS models, paid API calls or silent placeholder audio. Playback is reported only after native playback events. Generation guards invalidate late promises/events after stop, chat opening, locale change or unmount. Autoplay denial gets one explicit retry button.

## 7. Piper / free TTS evaluation

Piper 1.8.0 successfully generated eight English recordings (285,190 bytes) and eight Arabic evaluation recordings (393,696 bytes). English `en_US-ljspeech-medium` assets are committed. Arabic `ar_JO-kareem-low` was evaluated but not published because its licensing reference could not be recovered (404); deterministic Arabic narration is therefore unfinished. Engine, model metadata, licensing sources and reproduction are documented in [NARRATION.md](NARRATION.md). Listening quality is not certified by programmatic tests.

## 8. Language synchronization

`/ar` and `/en` render localized HTML, metadata, `lang` and direction on the server. `/` redirects to `/ar`. The same provider feeds every section and the assistant. Locale switching invalidates old narration and updates the visible message. Canonicals, alternates and sitemap URLs require the real `SITE_URL`; none was fabricated.

## 9. Chatbot coordination

Opening chat cancels narration/bubble and travel. Closing does not replay consumed sections. Restart tour clears the current guide cycle. Escape closes chat and returns focus to the trigger. The existing chatbot API and CMS behavior remain in place; no production credentials were available to test live AI replies or database edits.

## 10. Accessibility / reduced motion

Verified top-center Welcome bounds at six viewport sizes. Verified Arabic portrait/landscape bubble and chat bounds, no tested CTA overlap after the initial-placement fix, and no video in reduced motion. Added button names, skip link and focus outlines. Static poster under reduced motion/Save-Data. Existing orange/white contrast failures remain; they require review of approved colors. Browser coverage here is Chromium, not real Safari/Firefox or assistive-technology certification.

## 11. Files created

Locale route and SEO: `app/[lang]/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `lib/seo.ts`, `proxy.ts`.

Runtime: deferred-assistant and motion-provider components; canonical guide copy and asset manifest; eight English audio files plus generation metadata; local Cairo fonts/license; optimized mascot poster.

Tooling: ESLint config, offline audio generation script, five narration regression tests and one server-icon test, setup/narration/quality documentation and QA evidence.

## 12. Files modified

Root/page layouts, locale context, hero image/initial rendering, non-critical card image loading, assistant/Welcome/bubble/mascot components, active-section/motion/guide hooks, narration service, motion config, CSS, package/lock/workspace configs and ignore rules. Fixed the two baseline type defects in consultant motion variants and the seed script's missing bcrypt import. Original image/video assets were retained.

## 13. Dependencies

No application runtime dependency was added or upgraded. Added development-only `eslint`, `typescript-eslint`, and `eslint-plugin-react-hooks` because the repository advertised `pnpm lint` without its dependencies/config. Pinned the verified pnpm version and explicitly allowed the existing Prisma/Sharp build scripts. Piper, browser tooling and Lighthouse were installed in temporary evaluation environments, not the production browser bundle.

## 14. TypeScript

Baseline: two errors (consultants transition type and missing bcrypt import). Final `pnpm exec tsc --noEmit`: passes. Removed `ignoreBuildErrors: true`; production builds now enforce types.

## 15. Lint

Initial pnpm commands were blocked by dependency build-script policy; the checked-in project also had no ESLint dependency/config. Final `pnpm lint`: passes with zero warnings. This is a focused TypeScript/React hooks ruleset, not a claim of comprehensive static security analysis.

## 16. Production build and performance

Baseline build failed fetching Google Fonts over the environment's TLS connection; it succeeded with system certificate support. Final `pnpm build` succeeds with the same font bytes hosted locally, no Google build fetch required.

Service icons now render on the server, preserving arbitrary CMS names while removing the complete Lucide registry from the landing client bundle. In the final Lighthouse trace JavaScript transfer totaled 224,287 bytes.

The poster shrank from 385,679 to 25,966 bytes (93.3%). Existing WebM is 473,631 bytes, VP9 360×574, 15 fps, 7.934 s; retained without a risky visual re-encode, now deferred until at least seven seconds and suppressed for Save-Data/reduced motion. Initial Hero renders visibly in HTML and uses a responsive/preloaded optimized image.

A single unthrottled 390×844 resource capture through Welcome fell from 1,418,657 to 1,006,645 transferred bytes in an intermediate revision; it is not a controlled field comparison. Those captures predate the final additional video deferral. Final independent Lighthouse 12.8.2 run: Performance 93, Accessibility 96, SEO 66 (indexing intentionally disabled without SITE_URL), LCP 3.2 s, TBT 50 ms, CLS 0. Results are recorded in `docs/qa/lighthouse-summary.json`; LCP target compliance is not yet established. No field INP was measured. Lab TBT must not be represented as INP.

## 17. Browser validation and remaining manual tests

Six regression cases across native-media and server-icon tests pass. Chromium checks passed: one Welcome, no Welcome replay on Start Tour, hero after dwell, chat cancellation, no stale replay on close, reset on Restart tour, shared locale, and a new Welcome on refresh. Arabic tests passed for bubble bounds, scroll cancellation and reduced motion; responsive evidence covers six viewport sizes. `/en` returns English h1/metadata/lang with JavaScript disabled.

Full manual acceptance matrix: [QUALITY-SETUP.md](QUALITY-SETUP.md). Real-device audio, human listening, live CMS/admin/AI integrations, production domain SEO and field CWV remain necessary.

## 18. Git commits

See this branch's commit history for the implementation SHA and PR. Delivery excludes environment files, neural models, virtual environments, node_modules and build output.

## 19. Remaining limitations

- Deterministic Arabic audio awaits documented voice rights or supplied recordings.
- Set the real `SITE_URL` before building/deploying. Without it indexing is intentionally disabled and sitemap empty.
- Simulated mobile LCP remains above the 2.5 s target in the measured run; no claim of field CWV compliance.
- Existing contrast combinations need design review; sections retain their existing client/Framer architecture.
- Production data and credentials, real-browser audio quality and mobile safe-area/keyboard testing are unavailable here.
- Local lab measurements have no controlled pre-change Lighthouse comparison; do not advertise a percentage improvement from the single runs.

## 20. Assessment

The branch fixes concrete state/locale/narration races, improves render priority and assets, adds a reproducible QA path and international SEO foundations without redesigning the page. It is ready for code review and integration testing, not an unconditional production approval. Arabic audio, deployment configuration, contrast review and further measured LCP work are explicit follow-ups.

## 21. Publication security correction

Publication review detected a fixed admin password in the legacy TypeScript seed. Both seed entry points now require a validated `SEED_ADMIN_PASSWORD` environment variable and reject missing/invalid values before database writes. Existing accounts are not rotated automatically; previous fixed credentials remain in prior Git history and require rotation if used.
