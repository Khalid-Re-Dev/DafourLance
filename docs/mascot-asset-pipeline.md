# Mascot media and message layout

## Source and framing

`Create_a_high_quality_second.mp4` is the original 720×1280, 24 fps, eight-second Veo video. The old exporter cropped it to `504:804:78:270`, cutting the hands during the wide-arm gesture. Its comments described a different crop, which made the problem harder to spot.

The original itself also reaches the right frame edge during the gesture (near-edge pixels from about 3.75–5.92 seconds). CSS cannot restore pixels absent from the source. The corrected loop therefore uses the intact first 84 frames, followed by the 82 reversed interior frames. This retains the greeting gesture and returns continuously to the first pose, without the damaged wide-arm portion. It is not newly generated animation.

The exporter preserves every source column, removes only empty vertical margins (`720:840:0:250`), and adds 20px transparent side padding. It outputs 456×504 at 24 fps, VP9 alpha CRF 22. The poster uses the exact first pose and framing, with lossless WebP. Run:

```sh
python scripts/process-robot-video.py
```

Requires Python 3 and FFmpeg with libvpx-vp9/libwebp. The source file remains unchanged. Current outputs: WebM 813,462 bytes; lossless WebP 141,656 bytes; source-quality PNG poster 281,425 bytes. Higher quality costs roughly 455 KB more lazy-loaded media than before. Browser autoplay, delayed video eligibility, reduced motion and save-data behavior remain active.

`AnimatedMascot` uses `object-fit: contain`, visible overflow and versioned URLs. Display sizes are 72/80/88px for mobile/tablet/desktop. The double orange glow was replaced with a small neutral shadow to avoid a hazy outline. The media resolution supports these dimensions at high device pixel ratios; it cannot create detail missing in the original source.

## Message bubble

The pointer used to extend beyond an `overflow-y: auto` wrapper, producing a scrollbar even for two-line messages. It is now a noninteractive sibling of the content panel. Normal messages grow naturally without scrolling. Genuine overflow in an unusually short viewport or with enlarged text remains scrollable for accessibility instead of hiding text or controls.

The bubble is 320px wide with a 16px viewport margin, responds to content/visual viewport changes, and positions its pointer toward the mascot after clamping the panel within the viewport. The pointer and shadow no longer affect scroll height.

## Replacement checks

Check the full motion, not only one poster: open hands, edges, alpha on light/dark backgrounds, loop seam and first-pose continuity. Inspect both `/ar` and `/en`, mobile and desktop, reduced motion and playback fallback. A new wide-arm animation requires a source with sufficient safe margin throughout the gesture.

## Verification for this change

- TypeScript, lint, 18 existing tests and production build passed. Build used fallback content; production database connectivity was not tested.
- Actual Chromium 134 rendering at 2× pixel density: Arabic 390×844, 320×568 and 1280×800; English 1440×900 and 568×320. No internal scroll overflow for normal messages, no horizontal page overflow or page exceptions. Arabic text at 200% remained fully reachable. See `docs/qa/mascot-presentation.json` and the two screenshots.
- Both static reduced-motion fallback and actual video readiness were checked. Firefox/Safari have not been retested in this environment.
- The audio importer passed validation-only, incomplete-pack rejection without mutation, and an isolated eight-file install with matching provenance/cache hashes. No replacement Arabic voice was installed.
