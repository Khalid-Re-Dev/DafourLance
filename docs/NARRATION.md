# Guide narration

Both `/ar` and `/en` now have eight versioned local MP3s: Welcome, hero, about, services, consultants, projects, partners and contact. Arabic playback does not require an Arabic operating-system voice. The guide requests only the current message; it does not eagerly download all recordings or a speech model.

Playback order: local MP3 → matching-language device voice if the asset fails → visible text with an explanation. Browser autoplay restrictions still apply. Welcome and section bubbles offer a manual Play button after a blocked/failed attempt. Start Tour cancels Welcome; chat, scrolling, locale change, hiding the page and unmount cancel stale narration.

`config/guide-messages.json` owns visible/spoken copy. `config/guide-spoken-ar.json` adds offline pronunciation diacritics and pauses. These diacritics do not replace visible page text. `config/narration-assets.json` contains content-versioned URLs. A regression test checks coverage of every message, actual file existence, cache versions, hashes and correspondence with source copy in both languages.

## Arabic recordings

- Fixed female MSA voice: `af_msa`, model `oddadmix/Nabra-82M-v0.1`.
- Model and voicepack revision: `adf6abf35c46db5f2b08803b5067a12c759b1ee1`.
- Publisher declares Apache-2.0 in the model card; the source snapshot, attribution and license are shipped beside the audio.
- Engine: Kokoro 0.9.4, Arabic fork commit `df50e07df746aec0bd7a6f237752d7109ace0b3d`.
- Rendered offline on CPU; seed 42, speed 0.92, 24 kHz mono MP3 at 64 kbps, loudness normalization target -18 LUFS / -2 dBTP.
- No cloned user/person reference voice, paid API, browser model or new application dependency.
- Exact input and output hashes, pronunciation copy and installed tool versions: `public/audio/guide/ar/generation.json`.
- Source: https://huggingface.co/oddadmix/Nabra-82M-v0.1/tree/adf6abf35c46db5f2b08803b5067a12c759b1ee1
- Engine: https://github.com/Oddadmix/kokoro/tree/df50e07df746aec0bd7a6f237752d7109ace0b3d

The earlier Piper `ar_JO-kareem-low` evaluation was not published because its referenced license source was unavailable. These Arabic assets use Nabra instead; they do not rely on the Kareem evaluation's rights.

## Reproduce Arabic outside the application

Use Python 3.12 in a separate virtual environment and install FFmpeg. The following tooling is for offline regeneration only; visitors and normal website development do not need it:

```sh
pip install 'torch==2.14.1+cpu' --index-url https://download.pytorch.org/whl/cpu
pip install 'kokoro @ git+https://github.com/Oddadmix/kokoro.git@df50e07df746aec0bd7a6f237752d7109ace0b3d' 'transformers==4.57.6' 'misaki[espeak]==0.9.4' 'soundfile==0.14.0' 'espeakng-loader==0.2.4'
hf download oddadmix/Nabra-82M-v0.1 --revision adf6abf35c46db5f2b08803b5067a12c759b1ee1 config.json kokoro_arabic.pth af_msa.pt --local-dir /path/outside-project/nabra
python scripts/generate-arabic-guide-audio.py --model-dir /path/outside-project/nabra
```

The generator verifies the pinned model input hashes before loading weights with `weights_only=True`. `--output /path/to/preview` generates a preview without updating the website manifest. Keep model weights and environments outside the repository. The manually diacritized copy avoids adding a diacritization model. Changing voice, text or pronunciation requires regeneration and listening review.

## English recordings

- Engine: `piper-tts==1.8.0`, offline.
- Voice: `en_US-ljspeech-medium`, 22,050 Hz, female; LJ Speech public-domain dataset per its model card.
- Eight MP3s, mono 48 kbps, 285,190 bytes total.
- Exact copy, model metadata and hashes: `public/audio/guide/en/generation.json`.
- Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD
- Dataset: https://keithito.com/LJ-Speech-Dataset/
- Piper engine: https://github.com/OHF-Voice/piper1-gpl (offline GPL-3.0 tooling, not bundled).

```sh
pip install piper-tts==1.8.0
python -m piper.download_voices --download-dir /path/to/models en_US-ljspeech-medium
python scripts/generate-guide-audio.py --language en --model /path/to/models/en_US-ljspeech-medium.onnx --license-note 'LJ Speech public domain; see model card'
```

## Device-voice fallback and recovery

The initial service read `getVoices()` only once. PR #2 added a bounded three-second `voiceschanged` wait, a final voice check and listener cleanup. A ready voice starts synchronously from a user's Play click. Duplicate events cannot replay speech; cancelled or old-language requests cannot resume. Missing voices, mute and autoplay denial are explained in the UI. Manual retries never run automatically.

## Acceptance limits

Generated speech is synthetic. Automated decoding, event checks and transcription are useful checks, not human approval of naturalness, pronunciation or brand voice. Listen on the target Windows/Firefox device and mobile browsers. A successful MP3 response alone is not proof the user heard it. Browser autoplay can still require a click, and explicit mute remains respected.

## Verification of the Arabic asset delivery

- 18 regression tests pass; TypeScript, lint and production build pass.
- FFmpeg decoded all eight Arabic MP3s with finite, non-silent audio. Total size: 388,008 bytes. Per-file durations, signal measurements and approximate Arabic ASR transcripts are in `docs/qa/arabic-recordings-audio.json`.
- Actual Chromium 134 playback was tested on `/ar` and `/en` at 390×844 with `speechSynthesis` disabled and a strict user-gesture autoplay policy. Welcome and hero recordings reached real `playing` and `ended` events; the test used the manual Play controls when blocked. Welcome did not replay on Start Tour, and there were no page JavaScript errors. Evidence: `docs/qa/arabic-recordings-browser.json`.
- No live API/database integration or physical Windows/Firefox listening approval is inferred from these checks. ASR is approximate and contains recognition differences, particularly the brand name; it does not replace human pronunciation review.

## Arabic quality review and replacement (October 2026)

The user accepted playback but rejected the Nabra voice's naturalness and pronunciation. The bundled voice is therefore a functional baseline, **not an approved final brand voice**. This presentation fix does not claim to replace or improve those recordings.

Recommended next audition: ElevenLabs with a native Arabic voice, comparing the available expressive models (v4/v3) using the same Welcome text. A warm, clear Modern Standard Arabic delivery with a light Saudi accent is a candidate direction, not a selected or exclusive voice. Model marketing is not a listening evaluation. A generic English voice reading Arabic can retain the wrong accent; select Arabic in the voice library. Azure Speech's `ar-SA-HamedNeural` / `ar-SA-ZariyahNeural` are alternatives worth auditioning if the preferred provider is unavailable.

Generate once and serve the approved MP3s locally. The site needs no TTS subscription key, external request per visitor, or new browser SDK. Commercial ElevenLabs exports require the appropriate paid usage rights; a free audition does not grant commercial deployment rights. No account was accessed, credits spent or new provider voice generated during this change.

1. Audition Welcome with two Arabic voices. Listen for the agreed pronunciation of **دافورلانس**, natural sentence endings, pacing and absence of metallic artifacts. Do not claim exclusivity for a shared library voice.
2. After choosing the voice, export all eight messages using the exact Arabic spoken copy in `config/guide-messages.json`. `config/guide-spoken-ar.json` is a pronunciation aid; full diacritics are not necessarily ideal for every model. Review each recording, especially “الاستراتيجية” and “النتائج”.
3. Save `welcome.mp3`, `hero.mp3`, `about.mp3`, `services.mp3`, `consultants.mp3`, `projects.mp3`, `partners.mp3`, `contact.mp3` together outside `public`. Keep volume consistent and avoid music/long silence.
4. Validate without changing the app (Python 3 and FFmpeg):

```sh
python scripts/import-reviewed-arabic-audio.py --input-dir /path/to/reviewed-pack --provider ElevenLabs --voice "chosen voice and model" --license-note "rights covering these exports"
```

5. After listening approval, repeat with `--apply`. The importer validates the entire pack, checks decoding/duration/non-silence/duplicates, updates provenance and cache hashes, and preserves the MP3 playback architecture. Run `pnpm test` and review the resulting Git diff before publishing. It cannot automatically certify pronunciation or usage rights.

Official references checked 2026-10-04:
- https://elevenlabs.io/docs/overview/models
- https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech
- https://elevenlabs.io/pricing
- https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
