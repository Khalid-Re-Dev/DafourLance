#!/usr/bin/env python3
"""Export a transparent, uncropped greeting loop from the original mascot video.

Requires FFmpeg with libvpx-vp9/libwebp. Run from any working directory.
The source's wide-arm gesture reaches its own right edge after ~4 seconds;
use the intact greeting, then reverse it to return seamlessly to the first pose.
"""
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Create_a_high_quality_second.mp4'
OUTPUT = ROOT / 'public/mascot'
# Preserve all source columns. Only empty space above/below the robot is removed.
# Padding separates alpha/shadows from the media boundary; 504px height supports
# the 88px desktop mascot at high pixel density without browser upscaling.
FRAME = ('format=rgba,colorkey=white:similarity=0.22:blend=0.08,'
         'crop=720:840:0:250,pad=760:840:20:0:color=black@0,'
         'scale=456:504:flags=lanczos,setsar=1')


def main():
    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg or not SOURCE.is_file():
        raise SystemExit('FFmpeg and Create_a_high_quality_second.mp4 are required.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    # 84 frames forward, 82 interior frames backward: no duplicated endpoints.
    graph = (f'[0:v]trim=end_frame=84,setpts=PTS-STARTPTS,{FRAME},split[a][b];'
             '[b]reverse,trim=start_frame=1:end_frame=83,setpts=PTS-STARTPTS[r];'
             '[a][r]concat=n=2:v=1:a=0[out]')
    subprocess.run([ffmpeg, '-v', 'error', '-y', '-i', str(SOURCE),
                    '-filter_complex', graph, '-map', '[out]', '-r', '24',
                    '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0',
                    '-b:v', '0', '-crf', '22', '-deadline', 'good', '-cpu-used', '2',
                    '-an', '-metadata:s:v', 'alpha_mode=1',
                    str(OUTPUT / 'robot-mascot.webm')], check=True)
    for name, options in [('robot-mascot-poster.png', ['-pix_fmt', 'rgba']),
                          ('robot-mascot-poster.webp', ['-c:v', 'libwebp', '-lossless', '1'])]:
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-i', str(SOURCE),
                        '-vf', f'select=eq(n\\,0),{FRAME}', '-frames:v', '1',
                        *options, str(OUTPUT / name)], check=True)
    for path in sorted(OUTPUT.iterdir()):
        print(f'{path.name}: {path.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
