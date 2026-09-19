/* Native screenshot coordinates. Source files remain untouched; SVG covers only
 * playback fields. Historical library artwork remains as background context. */
const PLAYER_OVERLAYS = [
  {
    id:'01-winamp-2',indicator:true,color:'#00ed00',font:'monospace',
    patches:[[173,73,55,17,'#000'],[146,74,20,15,'#000'],[236,73,155,12,'#000'],[140,121,250,10,'#22232f'],[138,300,247,15,'#000'],[256,368,93,12,'#000'],[322,382,27,8,'#000']],
    titles:[[238,74,151,10,7],[140,301,212,10,7]],
    clocks:[{box:[175,75,45,13],digital:true},{box:[357,301,25,10],kind:'duration',size:7},{box:[258,369,88,10],kind:'summary',size:7},{box:[323,381,26,9],size:7}],
    bar:{box:[143,125,241,3],track:'#11131c',edge:'#424555',fill:'#363b27',thumb:'metal',size:20,thumbHeight:6},
    controls:[{box:[152,77,6,9],background:'#000',color:'#00ec00'}]
  },
  {
    id:'02-winamp-3',indicator:true,color:'#eee',font:'monospace',
    patches:[[54,24,46,17,'#000'],[110,23,155,14,'#000'],[17,70,246,11,'#484857']],
    titles:[[112,24,151,12,7]],clocks:[{box:[55,26,42,13],digital:true}],
    bar:{box:[20,73,239,4],track:'#15151b',edge:'#929098',fill:'#565363',thumb:'metal',size:24,thumbHeight:7},
    controls:[{box:[19,27,7,9],background:'#000',color:'#b9efa0'}]
  },
  {
    id:'03-winamp-5',indicator:true,color:'#b0d5ff',font:'monospace',
    patches:[[43,53,38,23,['#254575','#264875']],[23,85,267,14,['#173f7b','#07275f']],[9,113,248,10,['#b5becb','#dce0e9']]],
    titles:[[26,85,263,13,10]],clocks:[{box:[44,56,35,17],digital:true}],
    bar:{box:[13,116,240,3],track:'#222833',edge:'#82909c',fill:'#838fa0',thumb:'metal',size:22,thumbHeight:6},
    controls:[{box:[25,62,7,8],background:'#244573',color:'#c9e9ff'}]
  },
  {
    id:'04-foobar2000',indicator:true,color:'#111',font:'Tahoma, Arial, sans-serif',
    patches:[[29,3,644,18,['#515252','#292929']],[545,33,228,18,'#e9e9ee'],[66,126,508,18,'#3097e5'],[7,343,755,20,'#f1f1f1']],
    titles:[[29,4,640,15,12,'#fff'],[328,127,193,15,12,'#fff']],
    labels:[{box:[10,346,70,14],text:'Playback',size:12}],
    clocks:[{box:[193,346,160,14],kind:'summary',size:12},{box:[545,127,28,15],kind:'duration',size:11,color:'#fff'}],
    bar:{box:[550,39,218,4],track:'#d2d3db',edge:'#a5a6ae',fill:'#b9d0e7',thumb:'metal',size:7,thumbHeight:15},
    controls:[{box:[31,128,14,14],background:'#3097e5',color:'#fff'}],
    status:{box:[85,346,90,14],size:12}
  },
  {
    id:'05-amarok',color:'#111',font:'Arial, sans-serif',
    patches:[[22,1,870,16,['#668eb4','#577996']],[40,77,274,47,'#688eaf'],[354,348,584,16,['#a6b8c7','#7995ad']],[3,657,570,20,'#efefef'],[749,657,207,20,'#efefef']],
    titles:[[24,2,864,14,11,'#fff'],[42,79,270,40,12,'#fff'],[369,349,180,14,10,'#fff'],[8,660,551,14,10]],
    clocks:[{box:[900,349,35,14],kind:'duration',size:10,color:'#fff'},{box:[751,660,41,14],size:10},{box:[917,660,39,14],kind:'remaining',size:10}],
    bar:{box:[799,665,109,3],track:'#dedede',edge:'#aaa',fill:'#94b8d7',thumb:'metal',size:8,thumbHeight:10},
    controls:[{box:[379,626,21,19],background:'#ebebeb',color:'#416eab'}]
  },
  {
    id:'06-rhythmbox',color:'#111',font:'Arial, sans-serif',
    patches:[[393,4,486,20,['#dad7cc','#e8e4dd']],[4,104,1272,31,'#ede9e2'],[5,137,1270,17,'#ede9e2'],[169,429,1091,21,'#a3c84b']],
    titles:[[5,106,1110,24,15],[233,431,230,18,13]],
    labels:[{box:[438,6,400,15],text:'Reproductor de música',size:13}],
    clocks:[{box:[1118,107,151,22],kind:'summary',size:12},{box:[1181,431,73,18],kind:'duration',size:13}],
    bar:{box:[16,142,1247,4],track:'#c5bfb3',edge:'#918b80',fill:'#9fbc62',thumb:'metal',size:19,thumbHeight:10},
    controls:[{box:[24,52,31,28],background:['#efede6','#e7e3dc'],color:'#83a52c'}]
  },
  {
    id:'07-itunes-7',color:'#222',font:'Arial, sans-serif',
    patches:[[346,24,411,28,['#fafbed','#e5e8d3']],[372,53,368,12,'#e1e5ce']],
    titles:[[352,25,399,24,12]],
    clocks:[{box:[373,53,32,12],size:10},{box:[700,53,40,12],size:10,kind:'remaining'}],
    bar:{box:[411,56,281,5],track:'#e7ead8',edge:'#64675a',fill:'#7d8370',thumb:'diamond',size:5},
    controls:[{box:[72,35,15,19],background:['#e6e6e6','#c6c6c6'],color:'#444'}]
  },
  {
    id:'08-itunes-10',color:'#343c2e',font:'Arial, sans-serif',
    patches:[[306,14,334,35,['#eff1e4','#e0eac5']]],
    titles:[[324,15,298,15,11]],
    clocks:[{box:[311,32,32,12],size:9},{box:[602,32,33,12],size:9,kind:'remaining'}],
    bar:{box:[349,37,247,3],track:'#d2dac1',edge:'#919b7f',fill:'#747f66',thumb:'diamond',size:4},
    controls:[{box:[82,22,18,21],background:['#e7e7e7','#bfbfbf'],color:'#555'}]
  },
  {
    id:'09-itunes-12',color:'#4b4b4b',font:'Arial, sans-serif',
    patches:[[574,3,744,83,['#f2f2f2','#d9d9d9']]],
    titles:[[600,9,692,36,23]],
    clocks:[{box:[587,57,69,25],size:17},{box:[1235,57,76,25],kind:'remaining',size:17}],
    bar:{box:[668,65,554,4],track:'#bcbcbc',fill:'#757575',thumb:'circle',size:7},
    controls:[{box:[232,19,54,52],background:['#ededed','#dbdbdb'],color:'#484848'}]
  },
  {
    id:'10-apple-music',color:'#4b4b4b',font:'Arial, sans-serif',
    patches:[[357,77,348,48,'#fff'],[713,118,359,8,'#fff']],
    titles:[[415,82,283,22,14]],
    labels:[{box:[366,82,29,36],text:'♪',size:30}],
    clocks:[{box:[416,106,89,15],size:11},{box:[604,106,92,15],kind:'remaining',size:11}],
    bar:{box:[716,121,352,3],track:'#dedede',fill:'#777',thumb:'circle',size:4},
    controls:[{box:[880,83,24,30],background:'#fff',color:'#505050'}]
  },
  {
    id:'11-spotify',color:'#fff',font:'Arial, sans-serif',
    patches:[[15,695,59,60,'#292929'],[84,704,136,39,'#191919'],[386,738,594,21,'#191919']],
    titles:[[88,706,128,19,13]],
    labels:[{box:[29,704,33,43],text:'♪',size:31}],
    clocks:[{box:[389,739,32,17],size:11,color:'#aaa'},{box:[950,739,35,17],size:11,color:'#aaa',kind:'duration'}],
    bar:{box:[426,746,515,4],track:'#515151',fill:'#b3b3b3',thumb:'circle',size:4},
    controls:[{box:[675,704,17,17],background:'#fff',color:'#111'},{box:[281,380,21,23],background:'#1cba54',color:'#fff'}]
  },
  {
    id:"12-spotify-2026",
    color:"#fff",
    font:"Arial, sans-serif",
    patches:[[30.48,2025.55,115.13,115.07,"#202020"],[169.31,2042.47,325.07,76.15,"#000"],[1048.02,2100.0,1256.27,44.0,"#000"],[2593.81,1099.92,582.42,109.99,["#131413","#111111"]]],
    titles:[[176.08,2054.32,313.22,40.61,27.09],[2598.88,1106.69,567.18,54.15,44.02]],
    labels:[{"box":[57.56,2040.78,62.64,81.22],"text":"♪","size":59.26}],
    clocks:[{"box":[1049.71,2108.47,71.11,28.77],"size":22.01,"color":"#aaa"},{"box":[2236.56,2108.47,71.11,28.77],"size":22.01,"color":"#aaa","kind":"duration"}],
    bar:{"box":[1129.29,2118.62,1095.43,6.77],"track":"#4d4d4d","fill":"#fff","thumb":"circle","size":8.47},
    controls:[{"box":[1662.61,2042.47,30.48,33.84],"background":"#fff","color":"#000"},{"box":[883.79,775.02,38.94,40.61],"background":"#1ed760","color":"#000"}]
  }
];

function overlayPlayback(currentTime, duration) {
  const total = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const elapsed = total ? Math.min(total, Math.max(0, Number.isFinite(currentTime) ? currentTime : 0)) : 0;
  return { elapsed, duration: total, remaining: Math.max(0, total - elapsed), progress: total ? elapsed / total : 0 };
}

function overlayClock(seconds, padded = false) {
  const value = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(value / 60)).padStart(padded ? 2 : 1, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function createPlayerOverlay(player) {
  const playerId = player.id;
  const config = PLAYER_OVERLAYS.find(item => item.id === playerId);
  const ns = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(ns, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (parent) parent.append(node);
    return node;
  };
  const svg = el('svg', {viewBox:player.crop.join(' '),class:'player-overlay','aria-hidden':'true',focusable:'false','data-player':playerId});
  el('image', {href:player.image,x:0,y:0,width:player.dimensions[0],height:player.dimensions[1]}, svg);
  const defs = el('defs', {}, svg);
  let sequence = 0;
  function paint(color) {
    if (!Array.isArray(color)) return color;
    const id = `${playerId}-paint-${sequence++}`;
    const gradient = el('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},defs);
    color.forEach((stop,i)=>el('stop',{offset:`${i / (color.length-1)*100}%`,'stop-color':stop},gradient));
    return `url(#${id})`;
  }
  function rect(box, attrs = {}, parent = svg) {
    const [x,y,width,height] = box;
    return el('rect',{x,y,width,height,...attrs},parent);
  }
  function textBox(box, size, color = config.color, align = 'start') {
    const [x,y,width,height] = box;
    const id = `${playerId}-clip-${sequence++}`;
    rect(box,{},el('clipPath',{id},defs));
    return el('text',{x:align==='middle'?x+width/2:x,y:y+height/2,'dominant-baseline':'central','font-size':size,'font-family':config.font,fill:color,'text-anchor':align,'clip-path':`url(#${id})`},svg);
  }
  config.patches.forEach(([x,y,w,h,color])=>rect([x,y,w,h],{fill:paint(color)}));
  const titles = config.titles.map(([x,y,w,h,size,color])=>textBox([x,y,w,h],size,color));
  (config.labels || []).forEach(label=>{textBox(label.box,label.size).textContent=label.text;});
  const clocks = config.clocks.map(clock=>({config:clock,node:clock.digital?el('g',{'data-clock':clock.kind || 'elapsed'},svg):textBox(clock.box,clock.size,clock.color || config.color)}));
  const bar = config.bar;
  const [x,y,width,height] = bar.box;
  rect(bar.box,{rx:height/3,fill:paint(bar.track),stroke:bar.edge || 'none','stroke-width':1});
  const fill = rect([x,y,0,height],{rx:height/3,fill:bar.fill,class:'overlay-progress'});
  const thumb = el('g',{class:'overlay-thumb'},svg);
  const size = bar.size;
  const thumbHeight = bar.thumbHeight || height + 4;
  if (bar.thumb === 'diamond') {
    el('path',{d:`M 0 ${-size/2} L ${size/2} 0 L 0 ${size/2} L ${-size/2} 0 Z`,fill:paint(['#fff','#aab0ad']),stroke:bar.edge || '#666'},thumb);
  } else if (bar.thumb === 'metal') {
    rect([-size/2,-thumbHeight/2,size,thumbHeight],{rx:1,fill:paint(['#fafafa','#a8afb6','#e7e8e8']),stroke:'#727b83','stroke-width':.7},thumb);
  } else {
    el('circle',{r:size/2,fill:bar.thumb==='blue'?paint(['#e1f6ff','#46b5ff','#066bb2']):paint(config.color==='#eee'?['#ddd','#aaa']:['#fff','#d1d5d7']),stroke:bar.edge || bar.fill,'stroke-width':.5},thumb);
  }
  const controls = (config.controls || []).map(control => {
    const [cx,cy,cw,ch] = control.box;
    rect(control.box,{fill:paint(control.background)});
    const icon = el('path',{fill:control.color,transform:`translate(${cx} ${cy}) scale(${cw/12} ${ch/12})`},svg);
    return icon;
  });
  const status = config.status ? textBox(config.status.box,config.status.size) : null;
  let lastPlaying;
  let lastClock = '';
  function update(currentTime,duration,playing = false) {
    if (playing !== lastPlaying) {
      lastPlaying = playing;
      svg.dataset.playing = String(playing);
      controls.forEach(icon => icon.setAttribute('d',(config.indicator ? !playing : playing) ? 'M 2 1 H 5 V 11 H 2 Z M 7 1 H 10 V 11 H 7 Z' : 'M 2 1 L 11 6 L 2 11 Z'));
      if (status) status.textContent = playing ? 'Playing' : 'Paused';
    }
    const state = overlayPlayback(currentTime,duration);
    fill.setAttribute('width',String(width*state.progress));
    thumb.setAttribute('transform',`translate(${x+width*state.progress} ${y+height/2})`);
    svg.dataset.progress = String(state.progress);
    const signature = `${Math.floor(state.elapsed)}:${Math.floor(state.duration)}:${Math.floor(state.remaining)}`;
    if (signature === lastClock) return;
    lastClock = signature;
    clocks.forEach(({config:clock,node})=>{
      const kind = clock.kind || 'elapsed';
      const value = kind === 'summary' ? `${overlayClock(state.elapsed)} / ${overlayClock(state.duration)}` : (kind==='remaining'?'-':'') + overlayClock(state[kind],clock.digital);
      node.dataset.value = value;
      if (clock.digital) drawDigital(node,value,clock.box,config.color,el);
      else node.textContent = value;
    });
  }
  return {element:svg,update,setTitle(title){titles.forEach(node=>{node.textContent=title;});}};
}

// Seven-segment numerals match the Winamp LCDs without a font download.
function drawDigital(group, value, box, color, el) {
  group.replaceChildren();
  const digits = ['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
  const paths = {
    a:'M 4 0 H 19 L 22 3 L 19 6 H 4 L 1 3 Z',
    b:'M 20 5 L 23 2 V 20 L 20 23 L 17 20 V 8 Z',
    c:'M 20 25 L 23 28 V 46 L 20 49 L 17 46 V 28 Z',
    d:'M 4 46 H 16 L 19 49 L 16 52 H 4 L 1 49 Z',
    e:'M 0 28 L 3 25 L 6 28 V 44 L 3 47 L 0 44 Z',
    f:'M 0 8 L 3 5 L 6 8 V 20 L 3 23 L 0 20 Z',
    g:'M 5 23 H 17 L 20 26 L 17 29 H 5 L 2 26 Z'
  };
  const units = [...value].reduce((sum,ch)=>sum+(ch===':'?13:30),0)-7;
  const [x,y,width,height]=box;
  group.setAttribute('transform',`translate(${x} ${y}) scale(${width/units} ${height/52})`);
  let offset=0;
  for(const ch of value) {
    const digit=el('g',{transform:`translate(${offset} 0)`},group);
    if(ch===':') {
      el('rect',{x:1,y:14,width:5,height:5,fill:color},digit);
      el('rect',{x:1,y:35,width:5,height:5,fill:color},digit);
    } else {
      for(const [key,d] of Object.entries(paths)) el('path',{d,fill:color,opacity:digits[Number(ch)].includes(key)?1:.07},digit);
    }
    offset += ch===':'?13:30;
  }
}
if (typeof module !== 'undefined') module.exports = { PLAYER_OVERLAYS, overlayPlayback, overlayClock };
