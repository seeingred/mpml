# Music, over time

Play the bundled Chaoz Fantasy demo, or choose a local song and move through eleven desktop music players as it plays.

## Real screenshot version

All eleven players use real screenshots with live SVG overlays fitted to their native coordinates. This version began on `experiment/real-screenshots` and is now published from `main`. The generated-image version remains available in Git history at `6ef9cee`.

Run `python3 -m http.server 8766 --bind localhost` from this directory and open http://localhost:8766. No build or dependencies are needed. User-selected songs stay in the browser and are never uploaded. The demo MP3 is served with the site; it needs no account or external music service. See [MUSIC-CREDITS.md](MUSIC-CREDITS.md) for its attribution and license.

The first screen leads with the song picker, followed by a subtle “or play demo” text option. The demo starts in one click. Play reveals the player, subtle caption and year timeline. Eleven landmarks are spaced evenly over the song; seeking moves the music, crossfade, and window geometry together. Dragging the timeline pauses audio until release and the final seek finishes, then resumes only if it was playing before. Keyboard seeking follows the same behavior. Pausing freezes the transition and updates the embedded playback indicator. Replay returns to Winamp 2. Space toggles playback; reduced motion shows the nearest player without blending.

The page follows the system light or dark theme automatically, including the timeline and controls. The favicon is a small retro player with a green equalizer. Original player screenshots keep their original colors.

The year labels are preserved: 1998, 2002, 2003, 2004, 2006, 2008, 2010, 2011, 2015, 2019, 2020. Screenshot dates may differ. See [SCREENSHOT-SOURCES.md](SCREENSHOT-SOURCES.md) for every original source, version limitation, attribution, and license note.

## Images and overlays

- `players.js` defines each original image, native dimensions, SVG crop, stage bounds, and source details.
- `assets/real/` holds eleven original screenshot files. Desktop backgrounds are cropped in SVG; downloaded files remain unchanged.
- `overlays.js` draws live titles, elapsed/remaining time, progress bars, and playback states using each screenshot's own coordinate system. The filename supplies the title; embedded audio tags are not parsed.
- The SVG and its image share one surface and one morph transform, keeping overlays attached through a transition. There is one image per player, so play/pause cannot shift the window geometry.
- Historical library artwork and unselected rows remain part of the original screenshots. They do not reflect the selected song. Small matching patches can still be visible; this is a first visual experiment.
- The earlier generated images remain in `assets/`, unused by the current version.

`preview.js` controls local audio and rendering; `timeline.js` calculates the transition from audio time; `preview.css` styles the minimal layout. No external image hosts are contacted during playback.

## Checks

Run `node --test tests/*.test.js`. The checks cover timeline mapping, morph geometry, audio-time formatting, and native image/overlay bounds.

## Published version

The site is https://seeingred.github.io/mpml/. GitHub Pages serves the root of `main`; pushing to `main` publishes updates.
