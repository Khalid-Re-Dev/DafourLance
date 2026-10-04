#!/usr/bin/env python3
"""Offline only. Requires piper-tts==1.8.0 and ffmpeg. Never runs in the browser.
English: python scripts/generate-guide-audio.py --language en --model /path/en_US-ljspeech-medium.onnx
Arabic evaluation: --language ar --model /path/ar_JO-kareem-low.onnx --output /tmp/ar-preview
Publishing Arabic requires documented voice rights; supply --license-note with that evidence.
"""
import argparse, hashlib, json, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--language', choices=['ar', 'en'], required=True)
p.add_argument('--model', type=Path, required=True)
p.add_argument('--output', type=Path)
p.add_argument('--license-note')
a = p.parse_args()
if a.language == 'ar' and not a.output and not a.license_note:
    p.error('Arabic publication requires a documented voice license. Use --output outside public for evaluation.')
output = a.output or ROOT / 'public/audio/guide' / a.language
output.mkdir(parents=True, exist_ok=True)
voice = PiperVoice.load(str(a.model))
messages = json.loads((ROOT / 'config/guide-messages.json').read_text())
manifest = json.loads((ROOT / 'config/narration-assets.json').read_text())
report = {'language': a.language, 'model': a.model.name, 'modelSha256': hashlib.sha256(a.model.read_bytes()).hexdigest(), 'licenseNote': a.license_note, 'files': {}}
with tempfile.TemporaryDirectory() as tmp:
    for message_id, localized in messages.items():
        wav = Path(tmp) / f'{message_id}.wav'
        with wave.open(str(wav), 'wb') as stream:
            voice.synthesize_wav(localized[a.language]['spoken'], stream)
        target = output / f'{message_id}.mp3'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '48k', str(target)], check=True)
        if target.stat().st_size < 1000:
            raise RuntimeError(f'Unexpectedly short audio: {target}')
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        report['files'][message_id] = {'bytes': target.stat().st_size, 'sha256': digest, 'spokenText': localized[a.language]['spoken']}
        if not a.output:
            manifest[a.language][message_id] = f'/audio/guide/{a.language}/{message_id}.mp3?v={digest[:12]}'
if not a.output:
    (ROOT / 'config/narration-assets.json').write_text(json.dumps(manifest, indent=2) + '\n')
(output / 'generation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'language': a.language, 'files': len(report['files']), 'bytes': sum(x['bytes'] for x in report['files'].values())}))
