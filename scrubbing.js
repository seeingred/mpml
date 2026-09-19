// Keep repeated seeks silent, and preserve the playback state across a gesture.
function attachScrubbing(audio, slider, resume, preview, events = window) {
  let active = false;
  let pointer = false;
  let keyboard = false;
  let shouldResume = false;
  const seekKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);

  function begin() {
    if (active) return;
    active = true;
    shouldResume = shouldResume || (!audio.paused && !audio.ended);
    audio.pause();
  }
  function resumeWhenReady() {
    if (active || audio.seeking || !shouldResume) return;
    shouldResume = false;
    resume();
  }
  function finish() {
    pointer = keyboard = active = false;
    resumeWhenReady();
  }
  slider.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = true;
    begin();
  });
  slider.addEventListener('keydown', event => {
    if (!seekKeys.has(event.key)) return;
    keyboard = true;
    begin();
  });
  slider.addEventListener('input', () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    // Pausing can render the old position, so save the user's new value first.
    const time = Number(slider.value) / 1000 * audio.duration;
    begin();
    audio.currentTime = time;
    preview();
  });
  slider.addEventListener('change', () => {
    if (!pointer && !keyboard) finish();
  });
  events.addEventListener('pointerup', () => { if (pointer) finish(); });
  events.addEventListener('pointercancel', () => { if (pointer) finish(); });
  events.addEventListener('keyup', event => {
    if (keyboard && seekKeys.has(event.key)) finish();
  });
  slider.addEventListener('blur', finish);
  events.addEventListener('blur', finish);
  audio.addEventListener('seeked', resumeWhenReady);

  return function cancel() {
    active = pointer = keyboard = shouldResume = false;
  };
}

if (typeof module !== 'undefined') module.exports = { attachScrubbing };
