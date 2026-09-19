/* Screenshot coordinates are in the original 1536 × 1024 canvas.
 * The SVG lives inside the image layer, so scaling and morphing stay aligned.
 * Patches hide baked-in clocks and knobs; no source images are modified.
 */
const PLAYER_OVERLAYS = [
  {
    id: '01-winamp-2', color: '#79e526', font: 'monospace',
    patches: [[482,266,181,52,'#030805'], [389,389,584,23,'#10141b']],
    titles: [[698,272,445,30,23]],
    clocks: [{box:[490,275,165,36],digital:true}],
    bar: {box:[400,393,565,15],track:'#090c11',edge:'#444952',fill:'#61702d',thumb:'metal',size:22}
  },
  {
    id:'02-winamp-3',color:'#80bdea',font:'monospace',
    patches:[[329,399,170,58,['#152b39','#071621']], [505,517,682,33,'#051521'], [1190,516,85,34,'#081825']],
    titles:[[534,416,631,42,27]],
    clocks:[{box:[339,410,151,39],digital:true},{box:[1196,521,71,25],kind:'duration',size:24}],
    bar:{box:[520,527,650,13],track:'#020d15',edge:'#34576c',fill:'#248cc3',thumb:'blue',size:21}
  },
  {
    id:'03-winamp-5',color:'#68b5ff',font:'monospace',
    patches:[[303,418,184,66,'#03080b'],[570,507,451,31,'#03080b']],
    titles:[[581,432,433,36,26]],
    clocks:[{box:[316,430,151,43],digital:true}],
    bar:{box:[582,516,426,15],track:'#111c24',edge:'#526779',fill:'#438ec0',thumb:'metal',size:15}
  },
  {
    id:'04-foobar2000',color:'#191919',font:'Tahoma, sans-serif',
    patches:[[422,230,683,44,['#e5e5e5','#ededed']], [1116,234, 74,34,'#e7e7e7']],
    titles:[[233,334,467,31,20]],
    clocks:[{box:[1121,238,65,28],size:21},{box:[1292,334,73,31],size:19,kind:'duration'}],
    bar:{box:[434,243,660,16],track:['#ccc','#fafafa'],edge:'#929292',fill:'#a8c5e1',thumb:'metal',size:12}
  },
  {
    id:'05-amarok',color:'#1b2633',font:'Tahoma, sans-serif',
    patches:[[389,859,864,40,'#e0e5e9'],[1260,865,62,30,'#e2e7eb']],
    titles:[[742,201,405,26,19],[695,409,159,29,18]],
    clocks:[{box:[1266,867,51,29],size:18},{box:[1340,409, 75,29],size:18,kind:'duration'}],
    bar:{box:[400,870,844,19],track:['#b9c2cb','#d9dfe4'],edge:'#8995a1',fill:'#709fc9',thumb:'metal',size:16}
  },
  {
    id:'06-rhythmbox',color:'#343d46',font:'Arial, sans-serif',
    patches:[[393,181,767,49,'#eaeaea'],[140,901,102,30,'#eaeaea']],
    titles:[[425,513,262,31,19]],
    labels:[{box:[146,907,91,22],text:'1 song',size:17}],
    clocks:[{box:[397,208,60,22],size:17,color:'#808890'},{box:[1094,208,61,22],size:17,color:'#808890',kind:'duration'},{box:[1309,513,75,31],kind:'duration',size:18}],
    bar:{box:[410,193,737,5],track:'#c2c5c7',edge:'#9b9fa1',fill:'#779bbb',thumb:'round',size:20}
  },
  {
    id:'07-itunes-7',color:'#262c1c',font:'Arial, sans-serif',
    patches:[[487,141,562,61,['#edf0d9','#d9dfbd']]],
    titles:[[511,144,515,30,18],[406,249,235,25,16]],
    clocks:[{box:[500,177,53,23],size:15},{box:[983,177, 59,23],size:15,kind:'remaining'},{box:[699,249,51,25],size:16,kind:'duration'}],
    bar:{box:[565,184,408,10],track:'#e5e9cf',edge:'#646956',fill:'#a4af86',thumb:'diamond',size:11}
  },
  {
    id:'08-itunes-10',color:'#24281e',font:'Arial, sans-serif',
    patches:[[515,133,505,58,['#eff1e3','#e1e5ce']],[654,903,300,26,['#c6c6c6','#b5b5b5']]],
    titles:[[534,134,468,29,17],[384,234,264,25,16]],
    clocks:[{box:[532,168, 51,23],size:14},{box:[951,168, 61,23],size:14,kind:'remaining'},{box:[692,234,47,25],size:15,kind:'duration'}],
    labels:[{box:[667,907,280,22],text:'1 song',size:14}],
    bar:{box:[594,176,346,7],track:'#c7cbb8',edge:'#989c89',fill:'#949e7b',thumb:'diamond',size:12}
  },
  {
    id:'09-itunes-12',color:'#505050',font:'Arial, sans-serif',
    patches:[[454,108,627,55,['#f0f0f0','#e7e7e7']]],
    titles:[[521,111,491,26,17],[390,249,209,26,16]],
    clocks:[{box:[460,144, 42,19],size:12},{box:[1038,144,41,19],size:12,kind:'remaining'},{box:[682,249,44,26],size:15,kind:'duration'}],
    bar:{box:[507,152,525,6],track:'#c5c5c5',fill:'#8d8d8d',thumb:'round',size:10}
  },
  {
    id:'10-apple-music',color:'#4f4f52',font:'Arial, sans-serif',
    patches:[[700,162,375,17,'#f5f5f5']],
    titles:[[706,130,359,25,16]],
    clocks:[{box:[703,162,40,18],size:12},{box:[1035,162,38,18],size:12,kind:'duration'}],
    bar:{box:[750,168,276,4],track:'#d4d4d6',fill:'#868689',thumb:'round',size:8}
  },
  {
    id:'11-spotify',color:'#eee',font:'Arial, sans-serif',
    patches:[[449,884,636,24,'#191919']],
    titles:[[251,827,320,30,19]],
    clocks:[{box:[455,885, 45,21],size:14,color:'#aaa'},{box:[1037,885,45,21],size:14,color:'#aaa',kind:'duration'}],
    bar:{box:[512,892,513,5],track:'#494949',fill:'#b8b8b8',thumb:'round',size:11}
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

function createPlayerOverlay(playerId) {
  const config = PLAYER_OVERLAYS.find(item => item.id === playerId);
  const ns = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(ns, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (parent) parent.append(node);
    return node;
  };
  const svg = el('svg', {viewBox:'0 0 1536 1024',class:'player-overlay','aria-hidden':'true',focusable:'false','data-player':playerId});
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
  const titles = config.titles.map(([x,y,w,h,size])=>textBox([x,y,w,h],size));
  (config.labels || []).forEach(label=>{textBox(label.box,label.size).textContent=label.text;});
  const clocks = config.clocks.map(clock=>({config:clock,node:clock.digital?el('g',{'data-clock':clock.kind || 'elapsed'},svg):textBox(clock.box,clock.size,clock.color || config.color)}));
  const bar = config.bar;
  const [x,y,width,height] = bar.box;
  rect(bar.box,{rx:height/3,fill:paint(bar.track),stroke:bar.edge || 'none','stroke-width':1});
  const fill = rect([x,y,0,height],{rx:height/3,fill:bar.fill,class:'overlay-progress'});
  const thumb = el('g',{class:'overlay-thumb'},svg);
  const size = bar.size;
  if (bar.thumb === 'diamond') {
    el('path',{d:`M 0 ${-size/2} L ${size/2} 0 L 0 ${size/2} L ${-size/2} 0 Z`,fill:paint(['#fff','#aab0ad']),stroke:bar.edge || '#666'},thumb);
  } else if (bar.thumb === 'metal') {
    rect([-size/2,-height/2-4,size,height+8],{rx:2,fill:paint(['#fafafa','#a8afb6','#e7e8e8']),stroke:'#727b83','stroke-width':1.5},thumb);
    el('path',{d:`M ${-size/2+2} ${height/2+2} V ${-height/2-2} H ${size/2-2}`,fill:'none',stroke:'#fff'},thumb);
  } else {
    el('circle',{r:size/2,fill:bar.thumb==='blue'?paint(['#e1f6ff','#46b5ff','#066bb2']):paint(config.color==='#eee'?['#ddd','#aaa']:['#fff','#d1d5d7']),stroke:bar.edge || bar.fill,'stroke-width':1.5},thumb);
  }
  let lastClock = '';
  function update(currentTime,duration) {
    const state = overlayPlayback(currentTime,duration);
    fill.setAttribute('width',String(width*state.progress));
    thumb.setAttribute('transform',`translate(${x+width*state.progress} ${y+height/2})`);
    svg.dataset.progress = String(state.progress);
    const signature = `${Math.floor(state.elapsed)}:${Math.floor(state.duration)}:${Math.floor(state.remaining)}`;
    if (signature === lastClock) return;
    lastClock = signature;
    clocks.forEach(({config:clock,node})=>{
      const kind = clock.kind || 'elapsed';
      const value = (kind==='remaining'?'-':'') + overlayClock(state[kind],clock.digital);
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
