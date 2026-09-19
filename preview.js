const $ = id => document.getElementById(id);
const audio = $('audio');
const media = new Playback();
media.use(audio);
let youtubeMedia;
let youtubePlayer;
let youtubeReadyTimer;
let youtubeCheck;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let objectURL;
let frameRequest;
let started = false;
let selection = 0;
let assetsReady;
let demoSelected = false;
let currentCaption = -1;
let visibleLayers = [];

// Approximate eras, including the owner's corrected Linux and iTunes dates.
const YEARS = ['1998', '2002', '2003', '2004', '2006', '2008', '2010', '2011', '2015', '2019', '2020'];

// Each screenshot has its own native aspect ratio and fitted stage bounds.
const WINDOW_BOUNDS = PLAYERS.map(player => player.bounds);

const layers = PLAYERS.map((player, index) => {
  const layer = document.createElement('div');
  layer.className = 'player-layer';
  layer.setAttribute('aria-hidden', 'true');
  const surface = document.createElement('div');
  surface.className = 'player-surface';
  const [x, y, width, height] = player.bounds;
  Object.assign(surface.style, {left:`${x/1536*100}%`,top:`${y/1024*100}%`,width:`${width/1536*100}%`,height:`${height/1024*100}%`});
  const overlay = createPlayerOverlay(player);
  surface.append(overlay.element);
  layer.append(surface);
  $('stage').append(layer);

  const tick = document.createElement('span');
  tick.className = 'tick';
  tick.style.left = `${index / Math.max(1, PLAYERS.length - 1) * 100}%`;
  $('ticks').append(tick);
  const year = document.createElement('span');
  year.className = 'year';
  year.style.left = `${index / Math.max(1, PLAYERS.length - 1) * 100}%`;
  year.textContent = YEARS[index];
  $('years').append(year);
  return { layer, overlay, year };
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function message(text = '') {
  $('message').textContent = text;
  $('message').hidden = !text;
}

function preloadAssets() {
  if (!assetsReady) {
    assetsReady = Promise.all(PLAYERS.map(player => player.image).map(src => {
      const image = new Image();
      image.src = src;
      return image.decode();
    })).catch(error => {
      assetsReady = null;
      throw error;
    });
  }
  return assetsReady;
}

function render() {
  const frame = timelineFrame(media.currentTime, media.duration, PLAYERS.length, reducedMotion.matches);
  const playing = !media.paused && !media.ended;
  const current = layers[frame.index];
  const next = layers[frame.next];
  for (const previous of visibleLayers) previous.layer.style.opacity = '0';
  visibleLayers = frame.blend > 0 ? [current, next] : [current];
  // Opaque outgoing layer prevents the page showing through a crossfade.
  current.layer.style.opacity = '1';
  current.layer.style.zIndex = '1';
  const outgoing = morphTransform(WINDOW_BOUNDS[frame.index], WINDOW_BOUNDS[frame.next], frame.blend);
  current.layer.style.transform = transformStyle(outgoing);
  if (frame.blend > 0) {
    next.layer.style.opacity = String(frame.blend);
    next.layer.style.zIndex = '2';
    const incoming = morphTransform(WINDOW_BOUNDS[frame.next], WINDOW_BOUNDS[frame.index], 1 - frame.blend);
    next.layer.style.transform = transformStyle(incoming);
  }
  visibleLayers.forEach(layer => {
    layer.overlay.update(media.currentTime, media.duration, playing);
  });

  const caption = frame.blend >= 0.5 ? frame.next : frame.index;
  if (caption !== currentCaption) {
    currentCaption = caption;
    $('player-name').textContent = PLAYERS[caption].name;
    $('player-year').textContent = YEARS[caption];
    $('stage').setAttribute('aria-label', PLAYERS[caption].name);
    layers.forEach((layer, index) => layer.year.classList.toggle('active', index === caption));
  }
  $('elapsed').textContent = formatTime(media.currentTime);
  $('duration').textContent = formatTime(media.duration);
  $('seek').disabled = !Number.isFinite(media.duration) || media.duration <= 0;
  $('seek').value = String(Math.round(frame.progress * 1000));
  $('seek').style.setProperty('--progress', `${frame.progress * 100}%`);
  $('seek').setAttribute('aria-valuetext', `${formatTime(media.currentTime)} of ${formatTime(media.duration)}, ${PLAYERS[caption].name}`);
  $('toggle').setAttribute('aria-label', media.ended ? 'Replay' : playing ? 'Pause' : 'Play');
  $('toggle').firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
}

function transformStyle({ x, y, scaleX, scaleY }) {
  return `translate(${x / 1536 * 100}%, ${y / 1024 * 100}%) scale(${scaleX}, ${scaleY})`;
}

function tick() {
  render();
  if (!media.paused && !media.ended) frameRequest = requestAnimationFrame(tick);
}

function stopFrames() {
  cancelAnimationFrame(frameRequest);
  render();
}

async function play() {
  const request = selection;
  $('start').disabled = true;
  $('demo').disabled = true;
  try {
    await preloadAssets();
    if (request !== selection) return;
    if (media.ended) media.currentTime = 0;
    await media.play();
    message();
  } catch (error) {
    if (request === selection) message(demoSelected ? 'Could not start the demo. Press Play demo to try again, or choose a song.' : 'Could not start playback. Try another audio file or press Play again.');
  } finally {
    if (request === selection) {
      $('start').disabled = !Number.isFinite(media.duration) || media.duration <= 0;
      $('demo').disabled = false;
    }
  }
}

function selectSong(src, title, label, isDemo) {
  selection++;
  cancelScrubbing();
  media.pause();
  destroyYouTube();
  media.use(audio);
  started = false;
  demoSelected = isDemo;
  $('setup').hidden = false;
  $('experience').hidden = true;
  $('journey').hidden = true;
  $('start').hidden = isDemo;
  $('start').disabled = true;
  $('demo').disabled = false;
  $('filename').textContent = label;
  $('filename').hidden = isDemo;
  $('playing-credit').hidden = !isDemo;
  layers.forEach(layer => { layer.overlay.setTitle(title); });
  if (objectURL) URL.revokeObjectURL(objectURL);
  objectURL = isDemo ? null : src;
  audio.src = src;
  audio.load();
  message();
}

$('file').addEventListener('change', () => {
  const file = $('file').files[0];
  if (!file) return;
  selectSong(URL.createObjectURL(file), file.name.replace(/\.[^.]+$/, ''), file.name, false);
});

$('demo').addEventListener('click', () => {
  $('file').value = '';
  selectSong('assets/audio/paragonx9-chaoz-fantasy.mp3', 'ParagonX9 — Chaoz Fantasy', 'Chaoz Fantasy', true);
  play();
});

$('start').addEventListener('click', play);
$('toggle').addEventListener('click', () => media.paused ? play() : media.pause());
const cancelScrubbing = attachScrubbing(media, $('seek'), play, render);
media.addEventListener('loadedmetadata', () => {
  $('start').disabled = !Number.isFinite(media.duration) || media.duration <= 0;
  if (media.source === audio && $('start').disabled) message('This file has no usable duration. Please choose another song.');
  render();
});
media.addEventListener('play', () => {
  const firstPlay = !started;
  started = true;
  $('setup').hidden = true;
  $('experience').hidden = false;
  $('journey').hidden = false;
  cancelAnimationFrame(frameRequest);
  tick();
  if (firstPlay && media.source === audio) $('toggle').focus({ preventScroll: true });
});
media.addEventListener('pause', stopFrames);
media.addEventListener('ended', stopFrames);
media.addEventListener('timeupdate', render);
media.addEventListener('seeking', render);
media.addEventListener('seeked', render);
media.addEventListener('error', () => {
  cancelScrubbing();
  media.pause();
  started = false;
  $('setup').hidden = false;
  $('experience').hidden = true;
  $('journey').hidden = true;
  $('start').disabled = true;
  $('demo').disabled = false;
  message(demoSelected ? 'The demo could not be loaded. Try Play demo again, or choose a song.' : 'This audio file could not be played. Choose another song.');
});
reducedMotion.addEventListener('change', render);
document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(frameRequest);
  if (document.hidden && youtubeMedia) {
    cancelScrubbing();
    media.pause();
  }
  if (document.hidden || media.paused) render();
  else tick();
});
document.addEventListener('keydown', event => {
  if (!started || event.code !== 'Space' || ['INPUT', 'BUTTON'].includes(event.target.tagName)) return;
  event.preventDefault();
  if (media.paused) play(); else media.pause();
});


function destroyYouTube() {
  youtubeCheck?.abort();
  youtubeCheck = null;
  clearTimeout(youtubeReadyTimer);
  if (youtubeMedia) youtubeMedia.destroy();
  else youtubePlayer?.destroy();
  youtubeMedia = youtubePlayer = null;
  $('youtube-host').replaceChildren();
  $('youtube-panel').hidden = true;
  $('experience').classList.remove('with-youtube');
}

function resetYouTube() {
  selection++;
  cancelScrubbing();
  media.pause();
  destroyYouTube();
  media.use(audio);
  started = false;
  cancelAnimationFrame(frameRequest);
  $('experience').hidden = true;
  $('journey').hidden = true;
  $('setup').hidden = false;
  $('start').hidden = true;
  $('filename').hidden = true;
  $('youtube-submit').disabled = false;
  $('demo').disabled = false;
  render();
}

$('youtube-option').addEventListener('click', () => {
  const open = $('youtube-form').hidden;
  $('youtube-form').hidden = !open;
  $('youtube-option').setAttribute('aria-expanded', String(open));
  message();
  if (open) $('youtube-url').focus();
});
$('youtube-form').addEventListener('submit', async event => {
  event.preventDefault();
  const id = youtubeVideoId($('youtube-url').value);
  if (!id) {
    message('Paste a YouTube video link, such as youtube.com/watch?v=… or youtu.be/…');
    $('youtube-url').focus();
    return;
  }
  resetYouTube();
  const request = selection;
  $('youtube-submit').disabled = true;
  message('Checking video…');
  try {
    const check = new AbortController();
    youtubeCheck = check;
    const timeout = setTimeout(() => check.abort(), 12000);
    let metadata;
    try {
      metadata = await checkYouTubeVideo(id, check.signal);
    } finally {
      clearTimeout(timeout);
    }
    if (request !== selection) return;
    message('Preparing video…');
    const [YT] = await Promise.all([loadYouTubeAPI(), preloadAssets()]);
    if (request !== selection) return;
    // Cue without playing while the initial screen remains visible.
    $('experience').classList.add('with-youtube');
    $('playing-credit').hidden = true;
    layers.forEach(layer => layer.overlay.setTitle(metadata.title));
    const mount = document.createElement('div');
    $('youtube-host').append(mount);
    const fail = text => {
      if (request !== selection) return;
      resetYouTube();
      message(text);
    };
    let revealed = false;
    youtubeReadyTimer = setTimeout(() => fail('YouTube did not respond. Try again or choose a local song.'), 20000);
    youtubePlayer = new YT.Player(mount, {
      width: '200', height: '200',
      playerVars: {playsinline: 1, controls: 1, origin: window.location.origin},
      events: {
        onReady: event => {
          if (request !== selection) return;
          youtubeMedia = new YouTubeMedia(event.target);
          media.use(youtubeMedia);
          youtubeMedia.addEventListener('titlechange', () => {
            if (request === selection) layers.forEach(layer => layer.overlay.setTitle(youtubeMedia.title));
          });
          event.target.cueVideoById(id);
        },
        onStateChange: event => {
          if (request !== selection || !youtubeMedia) return;
          youtubeMedia.stateChanged(event.data);
          if (event.data === 5 && !revealed) {
            revealed = true;
            clearTimeout(youtubeReadyTimer);
            $('setup').hidden = true;
            $('experience').hidden = false;
            $('journey').hidden = false;
            $('youtube-panel').hidden = false;
            started = true;
            render();
            message('Press play in the YouTube player.');
            $('youtube-submit').disabled = false;
            if (youtubeVisible()) event.target.playVideo();
          }
          if (event.data === 1) message();
        },
        onError: event => fail(youtubeError(event.data)),
        onAutoplayBlocked: () => {
          if (request === selection) message('Press play in the YouTube player.');
        }
      }
    });
  } catch (error) {
    if (request === selection) {
      resetYouTube();
      message(error.name === 'AbortError' ? 'YouTube took too long to check this video. Try again.' : error instanceof TypeError ? 'Could not check this video. Check your connection or try another link.' : error.message || 'YouTube could not load. Try again or choose a local song.');
    }
  }
});

function youtubeVisible() {
  const rect = $('youtube-host').getBoundingClientRect();
  const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return !document.hidden && rect.width * rect.height > 0 && visibleWidth * visibleHeight / (rect.width * rect.height) >= 0.5;
}

// Keep YouTube playback tied to a visible video, including on small screens.
new IntersectionObserver(entries => {
  if (youtubeMedia && entries[0].intersectionRatio < 0.5 && !media.paused) {
    cancelScrubbing();
    media.pause();
  }
}, {threshold: 0.5}).observe($('youtube-host'));
