const $ = id => document.getElementById(id);
const audio = $('audio');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let objectURL;
let frameRequest;
let started = false;
let selection = 0;
let assetsReady;
let currentCaption = -1;
let visibleLayers = [];

// Approximate eras, including the owner's corrected Linux and iTunes dates.
const YEARS = ['1998', '2002', '2003', '2004', '2006', '2008', '2010', '2011', '2015', '2019', '2020'];

// Visible window bounds in the original 1536 × 1024 assets: x, y, width, height.
// Align both silhouettes to one evolving rectangle during each morph.
const WINDOW_BOUNDS = [
  [354, 197, 828, 620], [160, 294, 1214, 430], [193, 336, 1150, 350],
  [146, 125, 1244, 755], [98, 96, 1340, 832], [133, 84, 1270, 855],
  [73, 103, 1391, 813], [95, 95, 1348, 839], [74, 104, 1389, 800],
  [52, 112, 1432, 800], [81, 80, 1376, 846]
];

const layers = PLAYERS.map((player, index) => {
  const layer = document.createElement('div');
  layer.className = 'player-layer';
  layer.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.alt = '';
  image.width = 1536;
  image.height = 1024;
  image.src = player.paused;
  const overlay = createPlayerOverlay(player.id);
  layer.append(image, overlay.element);
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
  return { layer, image, overlay, year };
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
    assetsReady = Promise.all(PLAYERS.flatMap(player => [player.playing, player.paused]).map(src => {
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
  const frame = timelineFrame(audio.currentTime, audio.duration, PLAYERS.length, reducedMotion.matches);
  const playing = !audio.paused && !audio.ended;
  const current = layers[frame.index];
  const next = layers[frame.next];
  for (const previous of visibleLayers) previous.layer.style.opacity = '0';
  visibleLayers = frame.blend > 0 ? [current, next] : [current];
  // Opaque outgoing layer prevents white flashing during a crossfade.
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
    const index = layers.indexOf(layer);
    const source = playing ? PLAYERS[index].playing : PLAYERS[index].paused;
    if (layer.image.getAttribute('src') !== source) layer.image.src = source;
    layer.overlay.update(audio.currentTime, audio.duration);
  });

  const caption = frame.blend >= 0.5 ? frame.next : frame.index;
  if (caption !== currentCaption) {
    currentCaption = caption;
    $('player-name').textContent = PLAYERS[caption].name;
    $('player-year').textContent = YEARS[caption];
    $('stage').setAttribute('aria-label', PLAYERS[caption].name);
    layers.forEach((layer, index) => layer.year.classList.toggle('active', index === caption));
  }
  $('elapsed').textContent = formatTime(audio.currentTime);
  $('duration').textContent = formatTime(audio.duration);
  $('seek').value = String(Math.round(frame.progress * 1000));
  $('seek').style.setProperty('--progress', `${frame.progress * 100}%`);
  $('seek').setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}, ${PLAYERS[caption].name}`);
  $('toggle').setAttribute('aria-label', audio.ended ? 'Replay' : playing ? 'Pause' : 'Play');
  $('toggle').firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
}

function transformStyle({ x, y, scaleX, scaleY }) {
  return `translate(${x / 1536 * 100}%, ${y / 1024 * 100}%) scale(${scaleX}, ${scaleY})`;
}

function tick() {
  render();
  if (!audio.paused && !audio.ended) frameRequest = requestAnimationFrame(tick);
}

function stopFrames() {
  cancelAnimationFrame(frameRequest);
  render();
}

async function play() {
  const request = selection;
  $('start').disabled = true;
  try {
    await preloadAssets();
    if (request !== selection) return;
    if (audio.ended) audio.currentTime = 0;
    await audio.play();
    message();
  } catch (error) {
    message('Could not start playback. Try another audio file or press Play again.');
  } finally {
    if (request === selection) $('start').disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
  }
}

$('file').addEventListener('change', () => {
  const file = $('file').files[0];
  if (!file) return;
  selection++;
  audio.pause();
  started = false;
  $('setup').hidden = false;
  $('journey').hidden = true;
  $('start').hidden = false;
  $('start').disabled = true;
  $('filename').textContent = file.name;
  $('filename').hidden = false;
  layers.forEach(layer => { layer.overlay.setTitle(file.name.replace(/\.[^.]+$/, '')); });
  if (objectURL) URL.revokeObjectURL(objectURL);
  objectURL = URL.createObjectURL(file);
  audio.src = objectURL;
  audio.load();
  message();
});

$('start').addEventListener('click', play);
$('toggle').addEventListener('click', () => audio.paused ? play() : audio.pause());
$('seek').addEventListener('input', () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = Number($('seek').value) / 1000 * audio.duration;
  render();
});
audio.addEventListener('loadedmetadata', () => {
  $('start').disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
  if ($('start').disabled) message('This file has no usable duration. Please choose another song.');
  render();
});
audio.addEventListener('play', () => {
  const firstPlay = !started;
  started = true;
  $('setup').hidden = true;
  $('journey').hidden = false;
  cancelAnimationFrame(frameRequest);
  tick();
  if (firstPlay) $('toggle').focus({ preventScroll: true });
});
audio.addEventListener('pause', stopFrames);
audio.addEventListener('ended', stopFrames);
audio.addEventListener('timeupdate', render);
audio.addEventListener('seeking', render);
audio.addEventListener('seeked', render);
audio.addEventListener('error', () => {
  audio.pause();
  started = false;
  $('setup').hidden = false;
  $('journey').hidden = true;
  $('start').disabled = true;
  message('This audio file could not be played. Choose another song.');
});
reducedMotion.addEventListener('change', render);
document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(frameRequest);
  if (document.hidden || audio.paused) render();
  else tick();
});
document.addEventListener('keydown', event => {
  if (!started || event.code !== 'Space' || ['INPUT', 'BUTTON'].includes(event.target.tagName)) return;
  event.preventDefault();
  if (audio.paused) play(); else audio.pause();
});
