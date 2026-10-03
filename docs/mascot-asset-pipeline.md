# Robot Mascot Asset Pipeline

## Overview

The DaFourLance robot mascot is a branded animated character (orange robot with "D" chest logo and glowing heart) that serves as the visual identity of the website's smart assistant.

## Source Asset

| Property | Value |
|---|---|
| **File** | `Create_a_high_quality_second.mp4` (root of project) |
| **Resolution** | 720×1280 (portrait) |
| **Duration** | 8 seconds |
| **FPS** | 24 |
| **Codec** | H.264 High Profile |
| **Background** | Near-white/light gray, uniform |
| **Origin** | Google Veo AI-generated |

## Processing Pipeline

### Script

`scripts/process-robot-video.py`

### Requirements

- Python 3.10+
- FFmpeg 5+ with libvpx-vp9 support (installed via `winget install Gyan.FFmpeg`)
- OR `pip install imageio-ffmpeg` (bundled FFmpeg fallback)

### Steps

1. **Background removal**: FFmpeg `colorkey` filter keys out the white/near-white background and generates an alpha channel. Parameters: `colorkey=white:similarity=0.22:blend=0.08`
2. **Crop**: Remove excess empty margins. Crop window: `612×1152` at offset `(54, 64)`
3. **Scale**: Scale to 360px wide (preserving aspect ratio). This intermediate resolution supports CSS-based display from ~32px to ~200px+ without visible degradation
4. **Frame rate**: Reduced from 24fps to 15fps for smaller file size while maintaining smooth playback
5. **Encode WebM**: VP9 codec with `yuva420p` pixel format (YUV + alpha), CRF 30, 600kbps target bitrate
6. **Extract poster**: Single frame at 2s mark (frame 48), PNG with RGBA transparency

### Running

```bash
python scripts/process-robot-video.py
```

## Output Assets

| Asset | Path | Size | Purpose |
|---|---|---|---|
| Animated WebM | `public/mascot/robot-mascot.webm` | ~381 KB | Primary runtime animation |
| Static poster PNG | `public/mascot/robot-mascot-poster.png` | ~217 KB | Poster frame / static fallback |

## Runtime Format: Why WebM VP9 with Alpha?

| Criterion | WebM VP9 | GIF | APNG |
|---|---|---|---|
| **Alpha transparency** | Yes (native) | Binary only (1-bit) | Yes |
| **File size** | Small (~381 KB) | Very large (~2-5 MB) | Large (~1-2 MB) |
| **Color depth** | Full 8-bit YUV+A | 256 colors max | Full RGBA |
| **Playback quality** | Smooth, efficient | Dithered, stuttery | Smooth but heavy |
| **Browser support** | Chrome, Firefox, Edge, Opera, Safari 15+ | Universal | Most modern |
| **Runtime cost** | Native hardware decode | CPU decode | CPU decode |

**Decision**: WebM VP9 with alpha is the clear winner for animated transparency at production quality.

## Fallback Strategy

The `AnimatedMascot` component implements a 3-tier fallback:

1. **Primary**: Transparent WebM video (`robot-mascot.webm`) — autoplay, loop, muted
2. **Secondary**: Static PNG poster (`robot-mascot-poster.png`) — shown when:
   - Video fails to load/play
   - Autoplay is blocked
   - `prefers-reduced-motion: reduce` is active
   - `animationEnabled` prop is `false`
3. **Tertiary**: Inline SVG robot icon — shown only if the PNG also fails to load

The fallback never breaks the page layout — all three render at the same configured `size`.

## Asset Storage

```
public/
  mascot/
    robot-mascot.webm           # Animated (primary)
    robot-mascot-poster.png     # Static (fallback)
```

## Replacing the Mascot

To update the robot mascot with a new video:

1. Place the new source video in the project root
2. Update `INPUT_VIDEO` in `scripts/process-robot-video.py` to point to the new file
3. Adjust `colorkey` parameters if the new video has a different background color
4. Adjust `crop` parameters if the robot bounding box has changed
5. Run: `python scripts/process-robot-video.py`
6. Verify output in `public/mascot/`
7. The `AnimatedMascot` component requires no code changes — it reads from the same paths

## Component Usage

```tsx
import AnimatedMascot from "@/components/animated-mascot"

// Floating button mascot (animated)
<AnimatedMascot size={72} variant="display" ariaLabel="Assistant" />

// Chat header mascot (static)
<AnimatedMascot size={32} variant="display" animationEnabled={false} ariaLabel="Assistant" />

// Interactive button (wraps as a button role)
<AnimatedMascot size={64} variant="button" onClick={handleClick} ariaLabel="Open" />
```

## Accessibility

- `aria-label` on the mascot container (customizable via props)
- Keyboard-accessible floating button (Tab → focus ring → Enter)
- `prefers-reduced-motion` respected (shows static poster)
- Touch devices: no hover dependency
- Focus ring visible via `:focus-visible` CSS
