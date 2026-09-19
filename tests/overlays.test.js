const test = require('node:test');
const assert = require('node:assert/strict');
const { PLAYER_OVERLAYS, overlayPlayback, overlayClock } = require('../overlays.js');
test('audio position is shared across player displays, with safe edges', () => {
  assert.deepEqual(overlayPlayback(135, 240), {elapsed:135,duration:240,remaining:105,progress:.5625});
  assert.equal(overlayPlayback(500, 240).progress, 1);
  assert.equal(overlayPlayback(-3, 240).progress, 0);
  for(const d of [0,NaN,Infinity,-1]) assert.deepEqual(overlayPlayback(20,d),{elapsed:0,duration:0,remaining:0,progress:0});
  assert.equal(overlayClock(135), '2:15');
  assert.equal(overlayClock(135,true), '02:15');
  assert.equal(overlayClock(6015,true), '100:15');
});
test('all eleven skins have finite in-canvas overlay coordinates', () => {
  assert.equal(PLAYER_OVERLAYS.length,11);
  assert.equal(new Set(PLAYER_OVERLAYS.map(p=>p.id)).size,11);
  for(const p of PLAYER_OVERLAYS) {
    for(const box of [...p.patches,...p.titles,...p.clocks.map(c=>c.box),p.bar.box]) {
      const [x,y,w,h]=box;
      assert.ok([x,y,w,h].every(Number.isFinite),p.id);
      assert.ok(x>=0 && y>=0 && w>0 && h>0 && x+w<=1536 && y+h<=1024,p.id);
    }
  }
});
