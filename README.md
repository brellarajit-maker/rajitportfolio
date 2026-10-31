# Rajit Barella — portfolio

A dark, 3D-leaning personal site for Rajit Barella: website developer and
designer in New Delhi.

## Running it

```bash
npm install
npm run dev
```

Node is expected on the PATH. If it is installed under `%LOCALAPPDATA%\Programs\nodejs`
and not on the PATH, `dev.ps1` puts it there for you:

```powershell
powershell -ExecutionPolicy Bypass -File dev.ps1
```

## How the character works

The hero figure is not a 3D model. `public/character/` holds six full-length
cut-outs taken from a hand-drawn turnaround sheet, and `public/character/half/`
holds chest-up crops of five of them.

`src/components/site/half-body.tsx` turns the pointer position into a head yaw,
picks the nearest drawn view, cross-fades it in, and applies whatever angle the
drawing cannot express as a small CSS 3D rotation. Because each drawing's gaze
follows its own head, he keeps looking at the cursor — no pupils are painted on
top of the artwork.

There is no blink: closing the eyes convincingly needs a hand-drawn
eyes-closed frame. Add one as `front-blink.png` and it can be cross-faded in.

## Editing the content

All copy, projects, skills and timeline entries live in `src/data/site.ts`.
The counters in the About section are placeholders — change them there.

## Stack

Next.js (App Router) · Tailwind CSS v4 · Framer Motion · React Three Fiber ·
lucide-react. `src/components/ui/` holds the shadcn `Card`, the `Spotlight`
and the `SplineScene` wrapper.

## Background loop

`public/media/moon-walk.mp4` is a 1600px, 2.3 MB re-encode of the 4K master in
`moon-walk/` (GetLayers — https://getlayers.ai). `src/components/site/moon-backdrop.tsx`
pins it behind the whole page, dimmed under an ink wash, drifting slowly towards
the pointer. With `prefers-reduced-motion` it falls back to the poster still.

Re-encode after replacing the master:

```bash
ffmpeg -i moon-walk/moon-walk.mp4 -vf scale=1600:-2 -an -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart public/media/moon-walk.mp4
```

## The 3D character

`src/components/site/avatar.tsx` drives a rigged GLB: it finds the `LeftEye` and
`RightEye` bones and rotates them towards the pointer with clamping and damping,
blinks through the `eyeBlinkLeft` / `eyeBlinkRight` morph targets, and never
turns the head to fake it.

The model is not in the repo. Save a rigged avatar (Ready Player Me exports work
as-is) to `public/character/avatar.glb` and the hero switches to it on its own —
until then it shows the drawn turnaround. If the eyes track the wrong way, flip
`YAW_SIGN` or `PITCH_SIGN` at the top of that file; if the bones are named
differently, change `EYE_BONES` (the console lists the model's bone names).
