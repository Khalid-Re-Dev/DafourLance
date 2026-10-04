# Guide narration

The guide plays a versioned local MP3 on demand, then uses a system voice only if its language tag matches, then leaves the message visible without claiming to speak. No audio model or TTS engine ships to visitors. There are no eager requests for every section or both languages. Playback status starts on native `playing`/`onstart`, not when requesting playback.

`config/guide-messages.json` is the canonical visible/spoken copy. Only brand pronunciation is normalized. `config/narration-assets.json` lists assets that actually exist. Cancelling advances a request generation before cancelling native media, so delayed events/promises cannot resurrect narration.

## Generated English assets

- Engine evaluated: `piper-tts==1.8.0`, offline Python environment.
- Voice: `en_US-ljspeech-medium`, 22,050 Hz, female, LJ Speech public-domain dataset per its model card.
- Eight genuine MP3s, mono 48 kbps, 285,190 bytes total; ordinary browsers fetch only the requested message.
- Model SHA-256, exact spoken copy and output checksums are in `public/audio/guide/en/generation.json`.
- Source: https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD
- Dataset: https://keithito.com/LJ-Speech-Dataset/
- Engine: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0; used as offline tooling, not bundled).

## Arabic: evaluated, not published

`ar_JO-kareem-low` (16,000 Hz) successfully generated all eight messages locally: 393,696 bytes of MP3. It was not committed or enabled. Its model card says “License: See URL” and points to `AliMokhammad/arabicttstrain`; that source and license endpoint returned 404 during this audit. It also describes fine-tuning from Lessac. This is insufficient evidence to document commercial voice rights. This report does not conclude that the voice is prohibited; it records missing license evidence.

Until a documented Arabic voice or supplied recordings are available, Arabic uses a matching device voice if available, otherwise visual narration. **Deterministic Arabic audio is not complete.** English/Arabic sound quality and Dafourlance pronunciation still require human listening; generated files and browser playback events do not certify voice quality.

Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/ar/ar_JO/kareem/low/MODEL_CARD

## Reproduce offline

Use a virtual environment and FFmpeg:

```sh
python -m venv .venv-tts
# Activate using your platform's standard command.
pip install piper-tts==1.8.0
python -m piper.download_voices --download-dir /path/to/models en_US-ljspeech-medium
python scripts/generate-guide-audio.py --language en --model /path/to/models/en_US-ljspeech-medium.onnx --license-note 'LJ Speech public domain; see model card'
```

Arabic evaluation can use `--language ar --model /path/to/ar_JO-kareem-low.onnx --output /tmp/ar-preview`. Publishing Arabic requires `--license-note` identifying the reviewed rights. Do not pass a fabricated approval. Replace with an appropriately licensed voice or studio recordings if documentation cannot be recovered. Do not commit neural models or virtual environments.

Welcome and section bubbles expose explicit playback controls whenever audio is not loading, speaking or muted. Failure reasons are visible, including missing matching-language device voices. Manual retries do not run automatically. Start Tour cancels any welcome and begins observation without replaying it. Opening chat, changing language, hiding the document or unmounting cancels stale narration. Narrated-section eligibility is per document guide cycle and language; Restart tour clears the set. A hard refresh resets Welcome eligibility, while client route changes do not.

## Browser voice readiness correction

The initial implementation read `getVoices()` once and treated an empty or incomplete list as final. Device voices can arrive asynchronously. The service now listens to `voiceschanged` for up to three seconds, checks once again at the deadline, and unregisters on success, failure or cancellation. An already available voice still starts synchronously from a Play click. Repeated events cannot replay speech, and late events cannot resurrect cancelled or previous-language requests.

If no matching voice exists after this bounded wait, the UI reports it and offers an explicit retry. This does not install device voices or supply missing Arabic recordings. The Arabic manifest is still empty; reliable Arabic audio across devices remains unfinished until approved local recordings are added.

User report: the supplied `/ar` log confirms the new routes and local fonts are active, but contains no evidence of successful speech or the device voice list. Missing Arabic assets are confirmed in source; whether this user's device has no Arabic voice, loads voices late, blocks speech, or has narration muted requires a device check. Font preload, metadataBase and favicon warnings do not diagnose speech playback.

Verification: 15 regression tests cover media cancellation plus delayed/absent/unsupported voices, bounded waiting, synchronous manual retry, duplicate events and stale callbacks. The production build, TypeScript and lint pass. Two rendering checks verify failure feedback and playback controls. These tests mock speech and do not certify audible output on a user's Windows/Firefox device. A full browser smoke test could not start because no Chromium executable is installed in this execution environment; no browser playback success is claimed for this correction.
