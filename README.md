# Music, over time

Choose a local song, paste a YouTube video link, or play the bundled Chaoz Fantasy demo and move through eleven desktop music players as it plays.

## Real screenshot version

All eleven players use real screenshots with live SVG overlays fitted to their native coordinates. This version began on `experiment/real-screenshots` and is now published from `main`. The generated-image version remains available in Git history at `6ef9cee`.

Run `python3 -m http.server 8766 --bind localhost` from this directory and open http://localhost:8766. No build or dependencies are needed. User-selected songs stay in the browser and are never uploaded. The demo MP3 is served with the site; it needs no account or external music service. See [MUSIC-CREDITS.md](MUSIC-CREDITS.md) for its attribution and license.

The first screen offers “Choose a song” and “Use a YouTube link” at the same size, in that order, followed by a subtle “or play demo” option. The demo starts in one click. Play reveals the player, subtle caption and year timeline. Eleven landmarks are spaced evenly over the song; seeking moves the music, crossfade, and window geometry together. Dragging the timeline pauses audio until release and the final seek finishes, then resumes only if it was playing before. Keyboard seeking follows the same behavior. Pausing freezes the transition and updates the embedded playback indicator. Replay returns to Winamp 2. Space toggles playback; reduced motion shows the nearest player without blending.

The page follows the system light or dark theme automatically, including the timeline and controls. The favicon is a small retro player with a green equalizer. Original player screenshots keep their original colors.

The year labels are preserved: 1998, 2002, 2003, 2004, 2006, 2008, 2010, 2011, 2015, 2019, 2020. Screenshot dates may differ. See [SCREENSHOT-SOURCES.md](SCREENSHOT-SOURCES.md) for every original source, version limitation, attribution, and license note.

## Images and overlays

- `players.js` defines each original image, native dimensions, SVG crop, stage bounds, and source details.
- `assets/real/` holds eleven original screenshot files. Desktop backgrounds are cropped in SVG; downloaded files remain unchanged.
- `overlays.js` draws live titles, elapsed/remaining time, progress bars, and playback states using each screenshot's own coordinate system. The filename supplies the title; embedded audio tags are not parsed.
- The SVG and its image share one surface and one morph transform, keeping overlays attached through a transition. There is one image per player, so play/pause cannot shift the window geometry.
- Historical library artwork and unselected rows remain part of the original screenshots. They do not reflect the selected song. Small matching patches can still be visible; this is a first visual experiment.
- The earlier generated images remain in `assets/`, unused by the current version.

`preview.js` controls local audio and rendering; `timeline.js` calculates the transition from audio time; `preview.css` styles the minimal layout. Local-file and demo playback use only bundled images. YouTube connects to YouTube only after a valid video link is submitted.

## Checks

Run `node --test tests/*.test.js`. The checks cover timeline mapping, morph geometry, audio-time formatting, and native image/overlay bounds.

## Published version

The site is https://seeingred.github.io/mpml/. GitHub Pages serves the root of `main`; pushing to `main` publishes updates.

## YouTube links

The link option uses the official YouTube IFrame Player API, loaded on demand. No API key, account connection, download, proxy, or backend is needed. It accepts watch, youtu.be, mobile, Music, Shorts, live-video and embed links; playlist-only links are rejected. A link starts the selected video from the beginning (URL timestamps and playlists are ignored).

The original YouTube player stays visible at 200 × 200 CSS pixels, the documented minimum, with its native controls and branding. It floats flush against the bottom-right corner without extra buttons, padding, or a reserved side column; screenshots and the timeline use the same centered layout and sizing as local audio; the iframe is never cropped or scaled down with a transform. A CSS grayscale filter changes its displayed colors at full opacity; the video stream and native controls remain unchanged. This display treatment is not a claim of YouTube policy approval. Submitting the link checks YouTube’s public oEmbed metadata first, then cues the video without playback while the first screen stays visible. The journey is revealed only after the iframe reports that the video is cued. Playback then starts when the video is visible and the browser permits it. Otherwise press play in the embedded player or the journey controls. Its time, duration and playback state drive the same eleven-player timeline; its title appears in the historical players. Scrubbing previews the journey silently and commits one YouTube seek on release. Native video seeking also updates the journey. Playback pauses when the page is hidden or the video scrolls mostly out of view.

The preflight is not a guarantee: some playback restrictions only appear when playback starts. Some videos cannot play embedded, are unavailable in a region, require YouTube sign-in, or are restricted by the browser. Errors return to the picker with a retry message where the API reports them; YouTube may display its own sign-in or availability message inside the player. Videos with a fixed duration work best; livestream durations can change. Reload the page to choose a different song.

Reference: https://developers.google.com/youtube/iframe_api_reference and https://developers.google.com/youtube/terms/required-minimum-functionality.
