# My music player journey

A minimal, local music experience: choose a song, press Play, and travel through eleven desktop music player interfaces.

## Live site

Published at [seeingred.github.io/mpml](https://seeingred.github.io/mpml/). GitHub Pages serves the root of `main`; pushing to `main` updates the site. `.nojekyll` keeps the HTML, CSS, JavaScript, and images as plain static files. Songs are still selected locally and never uploaded.

## Run

Open `index.html` in a browser, or serve this directory with `python3 -m http.server 8766 --bind localhost` and open `http://localhost:8766`.

No build, dependencies, accounts or uploads. The chosen file stays in your browser.

## Playback

- Only the song picker appears initially. Selecting a file reveals Play.
- Eleven player landmarks are evenly spaced from the start to the end of the song, in the remembered player order.
- Every interval continuously morphs into the next player: the window bounds reshape together while the two images blend. Both geometry and opacity come directly from the audio position, not a separate timer.
- The thin timeline seeks the song and the player together, forward or backward.
- Pausing freezes the current position and morph and uses the paused player images.
- At the end, Replay returns to Winamp 2. Reload the page to choose another song.
- Space toggles playback. The timeline supports standard range-input keyboard controls. Reduced-motion preferences show the nearest player without warping or blending.

Year labels use approximate eras with the owner's corrections: Rhythmbox 2008, Leopard-era iTunes 2010, and iTunes 10 in 2011. Edit `YEARS` in `preview.js` to change them.

## Files

- `index.html`: song picker and minimal playback view.
- `preview.css`: responsive layout and timeline styling.
- `preview.js`: file selection, audio controls, and rendering.
- `timeline.js`: pure audio-time-to-player mapping and window morph geometry.
- `players.js`: eleven player definitions and image paths.
- `overlays.js`: per-player SVG masks, live titles, clocks, and progress bars.
- `assets/`: 22 PNGs, one playing and one paused image per player.
- `prompts.json`: image generation prompts.

Run the timeline and overlay tests with `node --test tests/*.test.js`.

## Images

Images are AI-generated recreations, not original screenshots or exact historical replicas. Each is 1536 × 1024 with a white background. Some interface details and paired-image alignment are approximate; Winamp is particularly stylized. The filename is overlaid as the song title. The original static clocks and progress bars are covered with live SVG overlays.

Rhythmbox represents both Ubuntu and Arch. The Mac chapter includes three representative iTunes interfaces before Apple Music and Spotify. No audio is bundled.

### Live screenshot overlays

`overlays.js` maps each player to a transparent SVG in the same 1536 × 1024 coordinate system as its screenshot. Small matching background patches cover the baked-in clocks and seek knobs; live clocks, progress fills, slider thumbs, and song titles are drawn above them. Winamp clocks use seven-segment SVG numerals. The title currently comes from the selected filename without its extension (embedded audio tags are not parsed).

The overlay is a child of its player layer, so it follows exactly the same morph transform and opacity. Both visible players show the same full-song position from the audio element. No independent animation timer is used. Pause, seek, and replay therefore update the artwork and overlays together. These are display overlays; the timeline below remains the playback control.

To calibrate a replacement screenshot, edit that player's `PLAYER_OVERLAYS` entry: `patches` cover static artwork, `titles` and `clocks` specify text bounds, and `bar` defines the track and thumb. Coordinates, colors, and fonts are approximations matched to these generated images.

Run the focused checks with `node --test tests/*.test.js`.
