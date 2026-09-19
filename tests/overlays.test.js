const { PLAYERS } = require('../players.js');
const fs = require('node:fs');
const path = require('node:path');
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
test('all twelve screenshots have valid crops, fitted bounds, and native overlay coordinates', () => {
  assert.equal(PLAYER_OVERLAYS.length,12);
  assert.equal(new Set(PLAYER_OVERLAYS.map(p=>p.id)).size,12);
  assert.equal(PLAYERS.length,PLAYER_OVERLAYS.length);
  for(const p of PLAYER_OVERLAYS) {
    const player = PLAYERS.find(item => item.id === p.id);
    assert.ok(player,p.id);
    assert.ok(fs.existsSync(path.join(__dirname,'..',player.image)),player.image);
    const [iw,ih] = player.dimensions;
    const [cx,cy,cw,ch] = player.crop;
    assert.ok(cx>=0 && cy>=0 && cw>0 && ch>0 && cx+cw<=iw && cy+ch<=ih,p.id+' crop');
    const [bx,by,bw,bh] = player.bounds;
    assert.ok(bx>=0 && by>=0 && bw>0 && bh>0 && bx+bw<=1536 && by+bh<=1024,p.id+' stage');
    assert.ok(Math.abs(bw/bh-cw/ch)<.00001,p.id+' preserves aspect ratio');
    for(const box of [...p.patches,...p.titles,...p.clocks.map(c=>c.box),...(p.controls || []).map(c=>c.box),p.bar.box]) {
      const [x,y,w,h]=box;
      assert.ok([x,y,w,h].every(Number.isFinite),p.id);
      assert.ok(x>=0 && y>=0 && w>0 && h>0 && x+w<=iw && y+h<=ih,p.id);
    }
  }
});
