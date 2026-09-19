/* Pure audio-time mapping, shared by the browser and the boundary tests. */
function timelineFrame(time, duration, count, reducedMotion = false) {
  if (!Number.isFinite(duration) || duration <= 0 || count < 1) {
    return { index: 0, next: 0, blend: 0, progress: 0 };
  }
  const position = Math.min(duration, Math.max(0, Number.isFinite(time) ? time : 0));
  const progress = position / duration;
  const journey = progress * (count - 1);
  if (reducedMotion) {
    const index = Math.round(journey);
    return { index, next: index, blend: 0, progress };
  }
  const index = Math.min(count - 1, Math.floor(journey));
  const next = Math.min(count - 1, index + 1);
  const phase = journey - index;
  // Ease across the entire interval, arriving exactly at each player landmark.
  const blend = phase * phase * (3 - 2 * phase);
  return { index, next, blend, progress };
}

function morphTransform(source, destination, blend) {
  const target = source.map((value, index) => value + (destination[index] - value) * blend);
  const scaleX = target[2] / source[2];
  const scaleY = target[3] / source[3];
  return { scaleX, scaleY, x: target[0] - source[0] * scaleX, y: target[1] - source[1] * scaleY };
}
if (typeof module !== 'undefined') module.exports = { timelineFrame, morphTransform };
