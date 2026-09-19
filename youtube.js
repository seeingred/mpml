function youtubeVideoId(value) {
  try {
    const text = value.trim();
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (['youtu.be', 'www.youtu.be'].includes(host)) id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else id = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1];
    }
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  } catch { return null; }
}

// This catches unavailable/non-embeddable links, but cannot guarantee playback
// in every region or browser. The iframe remains the final authority.
async function checkYouTubeVideo(id, signal, request = fetch) {
  const url = new URL('https://www.youtube.com/oembed');
  url.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`);
  url.searchParams.set('format', 'json');
  const response = await request(url, {signal, credentials: 'omit'});
  if ([400, 401, 403, 404].includes(response.status)) throw new Error(youtubeError(150));
  if (!response.ok) throw new Error('YouTube could not check this video. Try again in a moment.');
  const data = await response.json();
  if (data.type !== 'video' || typeof data.html !== 'string' || !data.html) {
    throw new Error('YouTube did not provide an embed for this video. Try another link.');
  }
  // Use only text metadata; never insert the returned HTML into the page.
  return {title: typeof data.title === 'string' ? data.title : 'YouTube'};
}

let youtubeAPI;
function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeAPI) youtubeAPI = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      youtubeAPI = null;
      reject(new Error('YouTube could not load. Check your connection or try another song.'));
    }
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timer); resolve(window.YT); };
    script.onerror = fail;
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.append(script);
  });
  return youtubeAPI;
}

function youtubeError(code) {
  if ([100, 101, 150].includes(code)) return 'This video is unavailable or does not allow embedded playback. Try another YouTube link.';
  if (code === 153) return 'YouTube could not verify this page. Try another browser or choose a local song.';
  return 'YouTube could not play this video. Try another link or choose a local song.';
}

// Present the iframe's playback state through the same interface as local audio.
class YouTubeMedia extends EventTarget {
  constructor(player) {
    super();
    this.player = player;
    this.paused = true;
    this.ended = false;
    this.seeking = false;
    this.pendingTime = null;
    this.scrubbing = false;
    this.lastDuration = 0;
    this.timer = setInterval(() => this.poll(), 100);
  }
  get duration() { return this.player.getDuration?.() || 0; }
  get currentTime() { return this.pendingTime ?? (this.ended ? this.duration : this.player.getCurrentTime?.() || 0); }
  set currentTime(value) {
    this.pendingTime = Math.max(0, Math.min(value, this.duration));
    this.ended = false;
    this.seeking = true;
    this.dispatchEvent(new Event('seeking'));
    if (!this.scrubbing) this.commitSeek();
  }
  beginScrub() { this.scrubbing = true; }
  finishScrub() {
    this.scrubbing = false;
    if (this.pendingTime !== null) this.commitSeek();
  }
  cancelScrub() { this.scrubbing = false; this.pendingTime = null; this.seeking = false; }
  commitSeek() {
    this.seekStarted = Date.now();
    this.player.seekTo(this.pendingTime, true);
    if (this.paused) this.player.pauseVideo();
  }
  poll() {
    const title = this.player.getIframe?.().title;
    if (title && title !== 'YouTube video player' && title !== this.title) {
      this.title = title;
      this.dispatchEvent(new Event('titlechange'));
    }
    const duration = this.duration;
    if (duration !== this.lastDuration) {
      this.lastDuration = duration;
      this.dispatchEvent(new Event('loadedmetadata'));
    }
    if (this.seeking && !this.scrubbing) {
      const actual = this.player.getCurrentTime?.() || 0;
      // YouTube seeks to keyframes, which may precede the requested position.
      if (Math.abs(actual - this.pendingTime) < 2 || Date.now() - this.seekStarted > 2500) {
        this.pendingTime = null;
        this.seeking = false;
        this.dispatchEvent(new Event('seeked'));
      }
    }
    this.dispatchEvent(new Event('timeupdate'));
  }
  stateChanged(state) {
    if (state === 1 && this.scrubbing) { this.player.pauseVideo(); return; }
    if (state === 1) {
      this.paused = false;
      this.ended = false;
      this.dispatchEvent(new Event('play'));
    } else if (state === 0) {
      this.paused = true;
      this.ended = true;
      this.dispatchEvent(new Event('ended'));
    } else if (state === 2 || state === 5 || state === -1) {
      this.paused = true;
      this.dispatchEvent(new Event('pause'));
    }
    this.poll();
  }
  play() { this.player.playVideo(); }
  pause() {
    this.paused = true;
    this.player.pauseVideo();
    this.dispatchEvent(new Event('pause'));
  }
  destroy() { clearInterval(this.timer); this.player.destroy(); }
}

// A stable event target lets the transport switch sources without duplicate listeners.
class Playback extends EventTarget {
  use(source) {
    this.listeners?.abort();
    this.source = source;
    this.listeners = new AbortController();
    for (const type of ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate', 'seeking', 'seeked', 'error']) {
      source.addEventListener(type, () => this.dispatchEvent(new Event(type)), {signal: this.listeners.signal});
    }
  }
  get currentTime() { return this.source.currentTime; }
  set currentTime(value) { this.source.currentTime = value; }
  get duration() { return this.source.duration; }
  get paused() { return this.source.paused; }
  get ended() { return this.source.ended; }
  get seeking() { return this.source.seeking; }
  play() { return this.source.play(); }
  pause() { this.source.pause(); }
  beginScrub() { this.source.beginScrub?.(); }
  finishScrub() { this.source.finishScrub?.(); }
  cancelScrub() { this.source.cancelScrub?.(); }
}
if (typeof module !== 'undefined') module.exports = { checkYouTubeVideo, youtubeVideoId, youtubeError, YouTubeMedia, Playback };
