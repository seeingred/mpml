const test = require('node:test');
const assert = require('node:assert/strict');
const { attachScrubbing } = require('../scrubbing.js');

function emit(target, type, properties = {}) {
  target.dispatchEvent(Object.assign(new Event(type), properties));
}
function setup(paused = false) {
  const audio = Object.assign(new EventTarget(), { paused, ended: false, duration: 100, seeking: false });
  const slider = Object.assign(new EventTarget(), { value: '100' });
  const events = new EventTarget();
  let position = 10;
  let resumes = 0;
  let previews = 0;
  audio.pause = () => { audio.paused = true; slider.value = String(position * 10); };
  Object.defineProperty(audio, 'currentTime', {
    get: () => position,
    set: time => {
      assert.equal(audio.paused, true, 'audio must be paused before every seek');
      position = time;
      audio.seeking = true;
    },
  });
  const cancel = attachScrubbing(audio, slider, () => { resumes++; audio.paused = false; }, () => previews++, events);
  const input = value => { slider.value = String(value); emit(slider, 'input'); };
  const settled = () => { audio.seeking = false; emit(audio, 'seeked'); };
  return {audio, slider, events, cancel, input, settled, resumes: () => resumes, previews: () => previews};
}

test('dragging stays silent through intermediate seeks and resumes after release and final seek', () => {
  const s = setup();
  emit(s.slider, 'pointerdown', {button: 0});
  assert.equal(s.audio.paused, true);
  s.input(800);
  s.settled();
  assert.equal(s.resumes(), 0);
  s.input(250);
  emit(s.slider, 'change');
  assert.equal(s.resumes(), 0);
  emit(s.events, 'pointerup');
  assert.equal(s.resumes(), 0);
  s.settled();
  assert.equal(s.audio.currentTime, 25);
  assert.equal(s.previews(), 2);
  assert.equal(s.resumes(), 1);
  s.settled();
  assert.equal(s.resumes(), 1);
});

test('a song that was paused stays paused after seeking', () => {
  const s = setup(true);
  emit(s.slider, 'pointerdown', {button: 0});
  s.input(600);
  s.settled();
  emit(s.events, 'pointerup');
  assert.equal(s.audio.currentTime, 60);
  assert.equal(s.audio.paused, true);
  assert.equal(s.resumes(), 0);
});

test('holding an arrow key stays silent until key release', () => {
  const s = setup();
  for (const value of [90, 80, 70]) {
    emit(s.slider, 'keydown', {key: 'ArrowLeft'});
    s.input(value);
    emit(s.slider, 'change');
    s.settled();
    assert.equal(s.resumes(), 0);
  }
  emit(s.events, 'keyup', {key: 'ArrowLeft'});
  assert.equal(s.resumes(), 1);
});

test('assistive input preserves its target even when pause renders the old slider value', () => {
  const s = setup();
  s.input(500);
  emit(s.slider, 'change');
  assert.equal(s.audio.currentTime, 50);
  s.settled();
  assert.equal(s.resumes(), 1);
});

test('cancelled gestures and focus loss do not leave playback stuck', () => {
  for (const type of ['pointercancel', 'blur']) {
    const s = setup();
    emit(s.slider, 'pointerdown', {button: 0});
    s.input(400);
    emit(s.events, type);
    s.settled();
    assert.equal(s.resumes(), 1);
  }
});

test('changing songs cancels a pending resume', () => {
  const s = setup();
  emit(s.slider, 'pointerdown', {button: 0});
  s.input(500);
  emit(s.events, 'pointerup');
  s.cancel();
  s.settled();
  assert.equal(s.resumes(), 0);
});
