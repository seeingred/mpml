const test = require('node:test');
const assert = require('node:assert/strict');
const { youtubeVideoId, youtubeError, YouTubeMedia, Playback } = require('../youtube.js');

const id = 'M7lc1UVf-VE';
test('accepts watch, share, mobile, Music, Shorts and embed video links', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${id}&list=example&t=30`,
    `youtu.be/${id}?si=example`, `https://m.youtube.com/watch?v=${id}`,
    `https://music.youtube.com/watch?v=${id}`, `https://youtube.com/shorts/${id}`,
    `https://youtube.com/live/${id}`, `https://www.youtube-nocookie.com/embed/${id}`,
  ]) assert.equal(youtubeVideoId(url), id, url);
});
test('rejects unrelated URLs, deceptive hosts, playlists and malformed IDs', () => {
  for (const url of ['', 'hello', `https://youtube.com.evil.test/watch?v=${id}`,
    `https://youtube.com@evil.test/watch?v=${id}`, `https://evil.test/${id}`,
    `https://youtube.com/playlist?list=${id}`, 'https://youtube.com/watch?v=short',
    `https://youtu.be/${id}/extra`, `javascript:alert(1)`, `https://youtu.be:8888/${id}`,
  ]) assert.equal(youtubeVideoId(url), null, url);
});
function fixture(t) {
  let position = 0;
  const seeks = [];
  const player = {
    getDuration: () => 100, getCurrentTime: () => position,
    seekTo: (...args) => seeks.push(args), pauseVideo() {}, playVideo() {}, destroy() {},
  };
  const media = new YouTubeMedia(player);
  t.after(() => media.destroy());
  return {media, seeks, setPosition: time => position = time};
}
test('scrubbing previews locally and sends one final seek to YouTube', t => {
  const {media, seeks, setPosition} = fixture(t);
  media.stateChanged(1);
  media.beginScrub();
  media.pause();
  media.currentTime = 70;
  media.currentTime = 40;
  media.currentTime = 20;
  assert.equal(media.currentTime, 20);
  assert.equal(media.paused, true);
  assert.equal(seeks.length, 0);
  media.finishScrub();
  assert.deepEqual(seeks, [[20, true]]);
  setPosition(19.5);
  media.poll();
  assert.equal(media.seeking, false);
  assert.equal(media.currentTime, 19.5);
});
test('native YouTube controls and ending update playback state', t => {
  const {media, setPosition} = fixture(t);
  media.stateChanged(1);
  assert.equal(media.paused, false);
  setPosition(50);
  assert.equal(media.currentTime, 50);
  media.stateChanged(2);
  assert.equal(media.paused, true);
  media.stateChanged(0);
  assert.equal(media.ended, true);
  assert.equal(media.currentTime, 100);
});
test('switching sources detaches events from the previous player', t => {
  const a = fixture(t).media;
  const b = fixture(t).media;
  const playback = new Playback();
  let plays = 0;
  playback.addEventListener('play', () => plays++);
  playback.use(a);
  a.stateChanged(1);
  playback.use(b);
  a.stateChanged(1);
  assert.equal(plays, 1);
  b.stateChanged(1);
  assert.equal(plays, 2);
  assert.equal(playback.paused, false);
});
test('blocked videos and missing referrer have actionable messages', () => {
  assert.match(youtubeError(150), /another YouTube link/);
  assert.match(youtubeError(153), /another browser/);
});

const { checkYouTubeVideo } = require('../youtube.js');
test('embed preflight uses only validated text metadata', async () => {
  const metadata = await checkYouTubeVideo(id, undefined, async (url, options) => {
    assert.equal(url.origin, 'https://www.youtube.com');
    assert.equal(url.searchParams.get('url'), `https://www.youtube.com/watch?v=${id}`);
    assert.equal(options.credentials, 'omit');
    return {ok: true, status: 200, json: async () => ({type: 'video', title: 'A song', html: '<iframe></iframe>'})};
  });
  assert.deepEqual(metadata, {title: 'A song'});
});
test('embed preflight rejects unavailable and embedding-disabled videos', async () => {
  for (const status of [400, 401, 403, 404]) {
    await assert.rejects(checkYouTubeVideo(id, undefined, async () => ({ok: false, status})), /another YouTube link/);
  }
});
test('embed preflight handles server errors and malformed responses', async () => {
  await assert.rejects(checkYouTubeVideo(id, undefined, async () => ({ok: false, status: 503})), /Try again/);
  await assert.rejects(checkYouTubeVideo(id, undefined, async () => ({ok: true, json: async () => ({type: 'link'})})), /did not provide an embed/);
});
test('embed preflight passes cancellation through to the request', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(checkYouTubeVideo(id, controller.signal, async (url, options) => {
    options.signal.throwIfAborted();
  }), {name: 'AbortError'});
});
