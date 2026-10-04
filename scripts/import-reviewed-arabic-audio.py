#!/usr/bin/env python3
"""Validate a complete Arabic narration pack; install only with --apply.

No provider SDK, account credentials, or network requests. Requires FFmpeg.
Export the eight reviewed MP3s from your chosen provider before running this.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def inspect_audio(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                             'stream=codec_name,codec_type:format=duration', '-of', 'json', str(path)],
                            check=True, capture_output=True, text=True)
    data = json.loads(result.stdout)
    streams = data['streams']
    if len(streams) != 1 or streams[0]['codec_name'] != 'mp3' or streams[0]['codec_type'] != 'audio':
        raise ValueError(f'{path.name}: expected a single MP3 audio stream')
    duration = float(data['format']['duration'])
    if not 1 < duration < 45:
        raise ValueError(f'{path.name}: expected 1–45 seconds of guide narration')
    # Decode before modifying public assets; reject corrupt/silent downloads.
    decoded = subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(path),
                              '-f', 's16le', '-ac', '1', '-ar', '16000', 'pipe:1'],
                             check=True, capture_output=True).stdout
    import array
    import sys
    samples = array.array('h', decoded)
    if sys.byteorder != 'little':
        samples.byteswap()
    if not samples or max(abs(x) for x in samples) < 300:
        raise ValueError(f'{path.name}: empty or effectively silent recording')
    return round(duration, 3)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input-dir', type=Path, required=True)
    parser.add_argument('--provider', required=True)
    parser.add_argument('--voice', required=True)
    parser.add_argument('--license-note', required=True,
                        help='Record the commercial usage rights for these exports')
    parser.add_argument('--apply', action='store_true',
                        help='Install after listening to and approving all eight recordings')
    args = parser.parse_args()
    if not shutil.which('ffmpeg') or not shutil.which('ffprobe'):
        parser.error('Install FFmpeg (including ffprobe) first')
    messages = json.loads((ROOT / 'config/guide-messages.json').read_text(encoding='utf-8'))
    destination = ROOT / 'public/audio/guide/ar'
    if args.input_dir.resolve() == destination.resolve():
        parser.error('Keep candidate recordings separate from public assets')
    report = {'language': 'ar', 'provider': args.provider, 'voice': args.voice,
              'licenseNote': args.license_note, 'importedAt': datetime.now(timezone.utc).isoformat(),
              'review': 'operator-approved' if args.apply else 'validation-only', 'files': {}}
    manifest_path = ROOT / 'config/narration-assets.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    # Stage and validate the entire pack before touching any shipped recording.
    with tempfile.TemporaryDirectory() as temporary:
        stage = Path(temporary)
        for key, message in messages.items():
            source = args.input_dir / f'{key}.mp3'
            if not source.is_file():
                parser.error(f'Missing recording: {source.name}')
            target = stage / source.name
            shutil.copyfile(source, target)
            duration = inspect_audio(target)
            digest = hashlib.sha256(target.read_bytes()).hexdigest()
            report['files'][key] = {'sha256': digest, 'bytes': target.stat().st_size,
                                    'sourceText': message['ar']['spoken'], 'durationSeconds': duration}
            manifest['ar'][key] = f'/audio/guide/ar/{key}.mp3?v={digest[:12]}'
        if len({item['sha256'] for item in report['files'].values()}) != len(messages):
            parser.error('Each message must have its own recording; duplicate audio found')
        if args.apply:
            for key in messages:
                shutil.copyfile(stage / f'{key}.mp3', destination / f'{key}.mp3')
            (destination / 'generation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
            (destination / 'NOTICE.md').write_text(
                f'# Arabic narration\n\nProvider: {args.provider}\n\nVoice: {args.voice}\n\n'
                f'Usage rights: {args.license_note}\n\n'
                'MODEL_CARD.md and APACHE-2.0.txt document the previous Nabra exports only; '
                'they do not license this replacement voice. See generation.json for current provenance.\n', encoding='utf-8')
        print(json.dumps({'applied': args.apply, 'recordings': len(report['files']),
                          'bytes': sum(item['bytes'] for item in report['files'].values())}))


if __name__ == '__main__':
    main()
