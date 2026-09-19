const test = require('node:test');
const assert = require('node:assert/strict');
const { timelineFrame, morphTransform } = require('../timeline.js');
const close = (a, b) => assert.ok(Math.abs(a - b) < 0.000001, `${a} != ${b}`);

test('all eleven landmarks are equally spaced including both endpoints', () => {
  for (let i = 0; i < 11; i++) {
    const frame = timelineFrame(i * 10, 100, 11);
    assert.equal(frame.index, i);
    close(frame.blend, 0);
  }
  assert.equal(timelineFrame(500, 100, 11).progress, 1);
});
test('morph progresses across the entire interval', () => {
  const frames = [1, 2.5, 5, 7.5, 9].map(time => timelineFrame(time, 100, 11));
  assert.ok(frames.every(frame => frame.blend > 0 && frame.blend < 1));
  assert.ok(frames.every((frame, i) => !i || frame.blend > frames[i - 1].blend));
  close(frames[2].blend, 0.5);
});
test('seeking is deterministic and transitions are continuous across landmarks', () => {
  assert.equal(timelineFrame(83, 100, 11).index, 8);
  assert.equal(timelineFrame(2, 100, 11).index, 0);
  const frozen = timelineFrame(5, 100, 11);
  timelineFrame(45, 100, 11);
  assert.deepEqual(timelineFrame(5, 100, 11), frozen);
  const before = timelineFrame(9.99999, 100, 11);
  const after = timelineFrame(10, 100, 11);
  close(before.blend, 1);
  assert.equal(before.next, after.index);
  close(after.blend, 0);
});
test('both images share the same evolving rectangle', () => {
  const a = [354, 197, 828, 620];
  const b = [160, 294, 1214, 430];
  for (const blend of [0, 0.1, 0.5, 0.9, 1]) {
    const out = morphTransform(a, b, blend);
    const inc = morphTransform(b, a, 1 - blend);
    close(a[0] * out.scaleX + out.x, b[0] * inc.scaleX + inc.x);
    close(a[1] * out.scaleY + out.y, b[1] * inc.scaleY + inc.y);
    close(a[2] * out.scaleX, b[2] * inc.scaleX);
    close(a[3] * out.scaleY, b[3] * inc.scaleY);
  }
});
test('reduced motion selects the nearest unwarped player', () => {
  assert.deepEqual(timelineFrame(6, 100, 11, true), { index: 1, next: 1, blend: 0, progress: 0.06 });
});
test('invalid durations, one player, short songs and negative time are safe', () => {
  assert.equal(timelineFrame(5, NaN, 11).progress, 0);
  assert.equal(timelineFrame(0, 0, 11).blend, 0);
  assert.equal(timelineFrame(-5, 100, 11).index, 0);
  assert.equal(timelineFrame(0.95, 1, 11).index, 9);
  assert.deepEqual(timelineFrame(5, 10, 1), { index: 0, next: 0, blend: 0, progress: 0.5 });
});

// The final stop must remain reachable after adding a player to the journey.
test('the twelve-stop journey ends on Spotify 2026 and blends into it', () => {
  const { PLAYERS } = require('../players.js');
  assert.equal(PLAYERS.length, 12);
  const end = timelineFrame(220, 220, PLAYERS.length);
  assert.equal(PLAYERS[end.index].id, '12-spotify-2026');
  assert.equal(end.next, end.index);
  const midway = timelineFrame(210, 220, PLAYERS.length);
  assert.equal(PLAYERS[midway.index].id, '11-spotify');
  assert.equal(PLAYERS[midway.next].id, '12-spotify-2026');
  close(midway.blend, .5);
});
