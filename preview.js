const $=id=>document.getElementById(id);
const audio=$('audio');let selected=0,visualPlaying=false,objectURL=null;
for(const [i,p] of PLAYERS.entries()){const b=document.createElement('button');b.textContent=p.name;b.type='button';b.onclick=()=>{selected=i;render()};$('players').append(b)}
function render(){const p=PLAYERS[selected],src=visualPlaying?p.playing:p.paused;$('skin').src=src;$('skin').alt=p.name+' — '+(visualPlaying?'playing':'paused')+' — blank player recreation';$('player-name').textContent=p.name;$('download').href=src;$('download').download=src.split('/').pop();$('preview-state').textContent=visualPlaying?'Preview paused state':'Preview playing state';$('hotspot').style.left=p.button.x+'%';$('hotspot').style.top=p.button.y+'%';$('hotspot').ariaLabel=audio.paused?'Play':'Pause';$('hotspot').title=audio.paused?'Play':'Pause';Object.assign($('metadata').style,{left:p.metadata.x+'%',top:p.metadata.y+'%',width:p.metadata.width+'%',color:p.metadata.color});[...$('players').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));$('song-title').textContent=$('title').value;$('song-artist').textContent=$('artist').value}
$('title').oninput=$('artist').oninput=render;
$('preview-state').onclick=()=>{const next=!visualPlaying;if(!audio.paused)audio.pause();visualPlaying=next;render();$('status').textContent='Visual state preview only — audio is paused.'};
$('file').onchange=()=>{const f=$('file').files[0];if(!f)return;audio.pause();if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(f);audio.src=objectURL;visualPlaying=false;if(!$('title').value)$('title').value=f.name.replace(/\.[^.]+$/,'');$('status').textContent='Ready. Click the player’s play button or use the audio controls.';render()};
$('hotspot').onclick=async()=>{if(!audio.src){$('status').textContent='Choose an audio file first, or use Preview state to view the images.';return}try{if(audio.paused)await audio.play();else audio.pause()}catch(e){$('status').textContent='Could not play this file. Try an MP3, WAV, or another supported audio file.'}};
audio.addEventListener('play',()=>{visualPlaying=true;render();$('status').textContent='Playing your song.'});
audio.addEventListener('pause',()=>{visualPlaying=false;render();$('status').textContent='Paused.'});
audio.addEventListener('ended',()=>{visualPlaying=false;render();$('status').textContent='Finished.'});
audio.addEventListener('error',()=>{$('status').textContent='The browser could not decode this audio file.'});
render();
