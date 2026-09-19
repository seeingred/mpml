# My music player journey

Choose a local song, press Play, and move through eleven desktop music players as it plays.

## Local screenshot experiment

Branch: `experiment/real-screenshots`. This branch replaces all eleven generated player images with real screenshots and fits the live SVG overlays to their native coordinates. `main` retains the generated version currently published on GitHub Pages.

Run `python3 -m http.server 8766 --bind localhost` from this directory and open http://localhost:8766. No build or dependencies are needed. The song stays in the browser and is never uploaded.

Only the song picker appears initially. Play reveals the player, subtle caption and year timeline. Eleven landmarks are spaced evenly over the song; seeking moves the music, crossfade, and window geometry together. Pausing freezes the transition and updates the embedded playback indicator. Replay returns to Winamp 2. Space toggles playback; reduced motion shows the nearest player without blending.

The year labels are preserved: 1998, 2002, 2003, 2004, 2006, 2008, 2010, 2011, 2015, 2019, 2020. Screenshot dates may differ. See [SCREENSHOT-SOURCES.md](SCREENSHOT-SOURCES.md) for every original source, version limitation, attribution, and license note.

## Images and overlays

- `players.js` defines each original image, native dimensions, SVG crop, stage bounds, and source details.
- `assets/real/` holds eleven original screenshot files. Desktop backgrounds are cropped in SVG; downloaded files remain unchanged.
- `overlays.js` draws live titles, elapsed/remaining time, progress bars, and playback states using each screenshot's own coordinate system. The filename supplies the title; embedded audio tags are not parsed.
- The SVG and its image share one surface and one morph transform, keeping overlays attached through a transition. There is one image per player, so play/pause cannot shift the window geometry.
- Historical library artwork and unselected rows remain part of the original screenshots. They do not reflect the selected song. Small matching patches can still be visible; this is a first visual experiment.
- The earlier generated images remain in `assets/`, unused by this branch.

`preview.js` controls local audio and rendering; `timeline.js` calculates the transition from audio time; `preview.css` styles the minimal layout. No external image hosts are contacted during playback.

## Checks

Run `node --test tests/*.test.js`. The checks cover timeline mapping, morph geometry, audio-time formatting, and native image/overlay bounds.

## Published version

The existing site is https://seeingred.github.io/mpml/. GitHub Pages serves `main`; this local experiment does not update that site.
