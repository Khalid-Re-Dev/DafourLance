#!/usr/bin/env python3
"""Offline Arabic narration. See docs/NARRATION.md for pinned tooling and model.

Only MP3s, provenance and the asset manifest belong in the website. Keep the
model and Python environment outside this repository. No model runs in a browser.
"""
import argparse
import hashlib
import importlib.metadata
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from kokoro import KModel, KPipeline
from kokoro import pipeline as kokoro_pipeline

ROOT = Path(__file__).resolve().parents[1]
MODEL_REPO = 'oddadmix/Nabra-82M-v0.1'
MODEL_REVISION = 'adf6abf35c46db5f2b08803b5067a12c759b1ee1'
ENGINE_REVISION = 'df50e07df746aec0bd7a6f237752d7109ace0b3d'
INPUT_SHA256 = {'config.json': '5abb01e2403b072bf03d04fde160443e209d7a0dad49a423be15196b9b43c17f', 'kokoro_arabic.pth': '81623d48af377133da90e0667dcede098ceb5f450359a3178b48619e81236f4d', 'af_msa.pt': '9324145629d870a899078ef0a70eabc0706c219ccbf002fa6a18278a201c9664'}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, help='Preview only; do not update the website manifest')
    args = parser.parse_args()
    inputs = {name: args.model_dir / name for name in ['config.json', 'kokoro_arabic.pth', 'af_msa.pt']}
    for path in inputs.values():
        if not path.is_file():
            parser.error(f'Missing model input: {path}')
        if sha256(path) != INPUT_SHA256[path.name]:
            parser.error(f'Model input does not match the pinned revision: {path.name}')
    messages = json.loads((ROOT / 'config/guide-messages.json').read_text())
    spoken = json.loads((ROOT / 'config/guide-spoken-ar.json').read_text())
    if spoken.keys() != messages.keys():
        parser.error('Arabic speech copy must cover every guide message')
    torch.set_num_threads(4)
    torch.manual_seed(42)
    model = KModel(repo_id=MODEL_REPO, config=str(inputs['config.json']),
                   model=str(inputs['kokoro_arabic.pth']), disable_complex=True).eval()
    model.vocab.update({'ʕ': 7, 'ħ': 8})
    kokoro_pipeline.LANG_CODES.setdefault('ar', 'ar')
    pipeline = KPipeline(lang_code='ar', repo_id=MODEL_REPO, model=model)
    phonemize = pipeline.g2p

    # Arabic phoneme cleanup follows the model card's training/inference mapping.
    def arabic_phonemes(text):
        phonemes, rest = phonemize(text)
        phonemes = re.sub(r'(?<=\S)\.(?=\S)', '', phonemes)
        for marker in ['̪', 'ˤ', '[', ']', '{', '}']:
            phonemes = phonemes.replace(marker, '')
        return phonemes, rest

    pipeline.g2p = arabic_phonemes
    voice = torch.load(inputs['af_msa.pt'], map_location='cpu', weights_only=True)
    output = args.output or ROOT / 'public/audio/guide/ar'
    output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((ROOT / 'config/narration-assets.json').read_text())
    report = {
        'language': 'ar', 'synthetic': True, 'voice': 'af_msa', 'model': MODEL_REPO,
        'modelRevision': MODEL_REVISION, 'modelLicense': 'Apache-2.0',
        'modelSource': f'https://huggingface.co/{MODEL_REPO}/tree/{MODEL_REVISION}',
        'engineSource': f'https://github.com/Oddadmix/kokoro/tree/{ENGINE_REVISION}',
        'inputSha256': {name: sha256(path) for name, path in inputs.items()},
        'toolVersions': {name: importlib.metadata.version(name) for name in ['kokoro', 'torch', 'misaki', 'soundfile', 'transformers', 'espeakng-loader']},
        'seed': 42, 'speed': 0.92, 'files': {},
    }
    with tempfile.TemporaryDirectory() as temporary:
        for key, text in spoken.items():
            parts = [audio.detach().cpu().numpy() for _, _, audio in pipeline(text, voice=voice, speed=report['speed'])]
            samples = np.concatenate(parts).astype(np.float32)
            duration = len(samples) / 24000
            if not 1 < duration < 30 or not np.isfinite(samples).all() or np.max(np.abs(samples)) < 0.01:
                raise RuntimeError(f'Invalid audio output for {key}')
            wav = Path(temporary) / f'{key}.wav'
            sf.write(wav, samples, 24000)
            target = output / f'{key}.mp3'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav),
                            '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', '24000', '-ac', '1',
                            '-codec:a', 'libmp3lame', '-b:a', '64k', str(target)], check=True)
            digest = sha256(target)
            report['files'][key] = {'bytes': target.stat().st_size, 'sha256': digest,
                                   'sourceText': messages[key]['ar']['spoken'], 'spokenText': text,
                                   'sourceDurationSeconds': round(duration, 3)}
            if not args.output:
                manifest['ar'][key] = f'/audio/guide/ar/{key}.mp3?v={digest[:12]}'
            print(json.dumps({'message': key, 'duration': round(duration, 3), 'bytes': target.stat().st_size}), flush=True)
    (output / 'generation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    if not args.output:
        (ROOT / 'config/narration-assets.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    main()
