#!/usr/bin/env python3
"""
Robot Mascot Asset Processing Pipeline
=======================================
Removes the white/light-gray background from the source robot video,
produces a transparent WebM (VP9 + alpha) and a static PNG poster frame.

Requirements:
  - FFmpeg 5+ with libvpx-vp9 support (installed via winget or system package)
  - Python 3.10+

Usage:
  python scripts/process-robot-video.py

Output:
  public/mascot/robot-mascot.webm   — animated, transparent, loopable
  public/mascot/robot-mascot-poster.png — static mid-frame, transparent
"""

import subprocess
import sys
import os
import shutil
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
INPUT_VIDEO = ROOT / "Create_a_high_quality_second.mp4"
OUTPUT_DIR = ROOT / "public" / "mascot"
OUTPUT_WEBM = OUTPUT_DIR / "robot-mascot.webm"
OUTPUT_POSTER = OUTPUT_DIR / "robot-mascot-poster.png"

# ── FFmpeg detection ───────────────────────────────────────────────────────────
def find_ffmpeg():
    """Find ffmpeg binary — prefer system install, fall back to imageio-ffmpeg."""
    system_ffmpeg = shutil.which("ffmpeg")
    if system_ffmpeg:
        return system_ffmpeg
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pass
    print("ERROR: FFmpeg not found. Install via 'winget install Gyan.FFmpeg' or 'pip install imageio-ffmpeg'.")
    sys.exit(1)


def run(cmd, desc=""):
    """Run a subprocess command, printing output on failure."""
    print(f"  -> {desc}")
    print(f"    $ {' '.join(str(c) for c in cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  FAILED (exit {result.returncode})")
        print(result.stderr)
        sys.exit(1)
    return result


def main():
    ffmpeg = find_ffmpeg()
    print(f"Using FFmpeg: {ffmpeg}")
    print(f"Input: {INPUT_VIDEO}")
    print(f"Output dir: {OUTPUT_DIR}")
    print()

    if not INPUT_VIDEO.exists():
        print(f"ERROR: Source video not found: {INPUT_VIDEO}")
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Step 1: Produce transparent WebM ───────────────────────────────────────
    # The source has a near-white background (~#f0f0f0 to #ffffff).
    # Strategy:
    #   1. colorkey filter: key out white (similarity 0.22, blend 0.12)
    #   2. Crop to robot bounding area (remove excess whitespace)
    #      The robot occupies roughly the center 85% of the 720x1280 frame.
    #      We crop from (54,64) with size 612x1152 to trim empty margins.
    #   3. Scale to a reusable intermediate resolution (360px wide)
    #      This preserves detail for CSS-based sizing from ~48px to ~200px+
    #   4. Encode as VP9 with alpha channel
    #
    # VP9 alpha encoding requires:
    #   - pix_fmt yuva420p (YUV + alpha plane)
    #   - auto-alt-ref 0 (required for alpha in VP9)

    print("Step 1: Encoding transparent WebM (VP9 + alpha)...")

    # The colorkey filter chain:
    # 1. colorkey=white:similarity=0.22:blend=0.08  → keys out white bg
    # 2. crop=612:1152:54:64  → trim margins to robot bounding box
    # 3. scale=360:-1  → scale to 360px wide, maintain aspect ratio
    # 4. fps=15  → reduce from 24fps to 15fps for smaller file while staying smooth

    filter_chain = (
        "colorkey=white:similarity=0.22:blend=0.08,"
        "crop=504:804:78:270,"
        "scale=360:-2,"
        "fps=15"
    )

    webm_cmd = [
        ffmpeg,
        "-y",                          # overwrite
        "-i", str(INPUT_VIDEO),
        "-vf", filter_chain,
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",        # YUV + alpha
        "-auto-alt-ref", "0",          # required for alpha
        "-b:v", "600k",                # target bitrate
        "-crf", "30",                  # quality (lower = better, 30 is good balance)
        "-deadline", "good",           # encoding speed/quality tradeoff
        "-cpu-used", "2",              # encoding effort
        "-an",                         # strip audio
        "-metadata:s:v", "alpha_mode=1",
        str(OUTPUT_WEBM),
    ]

    run(webm_cmd, "Encoding WebM VP9 with alpha transparency")

    # Report file size
    webm_size = OUTPUT_WEBM.stat().st_size
    print(f"  [OK] WebM created: {OUTPUT_WEBM} ({webm_size / 1024:.1f} KB)")
    print()

    # ── Step 2: Extract static poster frame ────────────────────────────────────
    # Take a frame from ~2 seconds in (frame 48 at 24fps) where the robot
    # is in a good pose with the heart visible.

    print("Step 2: Extracting transparent PNG poster frame...")

    poster_filter = (
        "colorkey=white:similarity=0.22:blend=0.08,"
        "crop=504:804:78:270,"
        "scale=360:-2"
    )

    poster_cmd = [
        ffmpeg,
        "-y",
        "-i", str(INPUT_VIDEO),
        "-vf", f"select=eq(n\\,48),{poster_filter}",
        "-frames:v", "1",
        "-pix_fmt", "rgba",            # PNG with alpha
        str(OUTPUT_POSTER),
    ]

    run(poster_cmd, "Extracting poster PNG with transparency")

    poster_size = OUTPUT_POSTER.stat().st_size
    print(f"  [OK] Poster created: {OUTPUT_POSTER} ({poster_size / 1024:.1f} KB)")
    print()

    # ── Summary ────────────────────────────────────────────────────────────────
    print("=" * 60)
    print("Asset processing complete!")
    print(f"  WebM:   {OUTPUT_WEBM.relative_to(ROOT)}  ({webm_size / 1024:.1f} KB)")
    print(f"  Poster: {OUTPUT_POSTER.relative_to(ROOT)}  ({poster_size / 1024:.1f} KB)")
    print()
    print("These assets are ready for the AnimatedMascot component.")
    print("The displayed size should be controlled via CSS/component props,")
    print("not baked into the asset resolution.")
    print("=" * 60)


if __name__ == "__main__":
    main()
