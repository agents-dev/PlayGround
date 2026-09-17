import * as THREE from 'three';

/* ============ tiny synth audio ============ */
const AudioSys = {
  ctx:null, muted:false,
  ensure(){ if(!this.ctx){ try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(this.ctx && this.ctx.state==='suspended') this.ctx.resume(); },
  tone(f=440,d=0.08,type='square',v=0.05,slide=0){ if(this.muted||!this.ctx) return;
    const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+d+0.02); },
  noise(d=0.3,v=0.12){ if(this.muted||!this.ctx) return;
    const t=this.ctx.currentTime,len=this.ctx.sampleRate*d,buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*(1-i/len);
    const s=this.ctx.createBufferSource();s.buffer=buf;const g=this.ctx.createGain();g.gain.setValueAtTime(v,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+d);const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=900;
    s.connect(f).connect(g).connect(this.ctx.destination);s.start(t); },
  select(){this.tone(700,0.06,'square',0.03)}, move(){this.tone(420,0.07,'square',0.035,120)},
  attack(){this.tone(200,0.12,'sawtooth',0.05,-80)}, shoot(){this.tone(900+Math.random()*400,0.05,'square',0.018,-500)},
  boom(){this.noise(0.4,0.16);this.tone(90,0.35,'sine',0.12,-50)},
  mine(){this.tone(1200,0.05,'triangle',0.03,-300)}, train(){this.tone(520,0.12,'triangle',0.05,260)},
  horn(){this.tone(140,0.5,'sawtooth',0.08,60);this.tone(105,0.6,'sawtooth',0.07,40)},
  error(){this.tone(160,0.18,'sawtooth',0.05)}, build(){this.tone(300,0.1,'triangle',0.05,150)},
};

/* ============ DOM ============ */
const $ = id => document.getElementById(id);
const canvas = $('scene'), dragbox = $('dragbox'), mm = $('minimap'), mmc = mm.getContext('2d');
function toast(msg, warn=false){ const d=document.createElement('div'); d.className='toast'+(warn?' warn':''); d.textContent=msg;
  $('toast-wrap').appendChild(d); setTimeout(()=>{d.style.opacity='0';d.style.transition='opacity .4s'; setTimeout(()=>d.remove(),400);}, 2600); }

/* ============ teams & sides (2v2) ============ */
const TEAMS = {
  player:{name:'Blue Command',  color:0x2fa9f5, mm:'#5fd4ff', side:0},
  ally:  {name:'Teal Compact',  color:0x2fe0a1, mm:'#7dffc9', side:0},
  enemy1:{name:'Red Dominion',  color:0xff4658, mm:'#ff6b78', side:1},
  enemy2:{name:'Orange Raiders',color:0xff9c3a, mm:'#ffbe6e', side:1},
};
const isFoe=(a,b)=>!!TEAMS[a]&&!!TEAMS[b]&&TEAMS[a].side!==TEAMS[b].side;

/* ============ renderer / scene ============ */
const WORLD = 120, HALF = WORLD/2;
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04070d);
scene.fog = new THREE.Fog(0x04070d, 90, 260);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.5, 600);
const cam = { tx:0, tz:0, yaw:Math.PI*0.25, dist:62, pitch:0.94 };
function updateCamera(){
  const x = cam.tx + Math.cos(cam.yaw)*Math.cos(cam.pitch)*cam.dist;
  const z = cam.tz + Math.sin(cam.yaw)*Math.cos(cam.pitch)*cam.dist;
  const y = Math.sin(cam.pitch)*cam.dist;
  camera.position.set(x,y,z); camera.lookAt(cam.tx,0,cam.tz);
}
updateCamera();

scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x1a2418, 0.75));
const sun = new THREE.DirectionalLight(0xfff2d9, 1.6);
sun.position.set(60,90,20); sun.castShadow = true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-90; sun.shadow.camera.right=90; sun.shadow.camera.top=90; sun.shadow.camera.bottom=-90;
sun.shadow.camera.far=260; sun.shadow.bias=-0.0004;
scene.add(sun);
const rim = new THREE.DirectionalLight(0x3fa9ff, 0.5); rim.position.set(-50,30,-60); scene.add(rim);

/* stars */
{ const g=new THREE.BufferGeometry(), n=900, p=new Float32Array(n*3);
  for(let i=0;i<n;i++){ const r=380,t=Math.random()*Math.PI*2,ph=Math.random()*Math.PI*0.45;
    p[i*3]=r*Math.cos(t)*Math.cos(ph); p[i*3+1]=r*Math.sin(ph)+10; p[i*3+2]=r*Math.sin(t)*Math.cos(ph); }
  g.setAttribute('position',new THREE.BufferAttribute(p,3));
  scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x9fc8ff,size:1.4,sizeAttenuation:false,fog:false}))); }

/* ground */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD+30,WORLD+30,1,1),
  new THREE.MeshStandardMaterial({color:0x3a5244, roughness:1, metalness:0}));
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
{ const grid = new THREE.GridHelper(WORLD, 30, 0x3fa9ff, 0x1d3a2a);
  grid.material.transparent=true; grid.material.opacity=0.22; grid.position.y=0.02; scene.add(grid);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD+1,0.5,WORLD+1)),
    new THREE.LineBasicMaterial({color:0x54d8ff})); edge.position.y=0; scene.add(edge);
}
function scatterDecor(){
  const rockM=new THREE.MeshStandardMaterial({color:0x3d4450,roughness:1});
  const leafM=new THREE.MeshStandardMaterial({color:0x1f6b3a,roughness:1});
  const trunkM=new THREE.MeshStandardMaterial({color:0x4a3421,roughness:1});
  const bases=[[-33,-33],[33,-33],[-33,33],[33,33]];
  for(let i=0;i<80;i++){
    const x=(Math.random()*2-1)*HALF*0.98, z=(Math.random()*2-1)*HALF*0.98;
    if(bases.some(b=>Math.hypot(x-b[0],z-b[1])<17)) continue;
    if(Math.random()<0.45){
      const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.6+Math.random()*1.4,0),rockM);
      r.position.set(x,0.4,z); r.castShadow=r.receiveShadow=true; r.rotation.set(Math.random()*3,Math.random()*3,0); scene.add(r);
    } else {
      const t=new THREE.Group(), h=2+Math.random()*2;
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.26,1.2,6),trunkM); trunk.position.y=0.6;
      const c1=new THREE.Mesh(new THREE.ConeGeometry(1.1+Math.random()*0.5,h,7),leafM); c1.position.y=1.2+h/2;
      trunk.castShadow=c1.castShadow=true; t.add(trunk,c1); t.position.set(x,0,z); scene.add(t);
    }
  }
}
scatterDecor();

/* ============ mesh factories ============ */
const MAT = {
  dark: new THREE.MeshStandardMaterial({color:0x141c26,roughness:0.6,metalness:0.6}),
  steel: new THREE.MeshStandardMaterial({color:0x8b98a8,roughness:0.35,metalness:0.8}),
  mineral: new THREE.MeshStandardMaterial({color:0x54d8ff,roughness:0.15,metalness:0.1,emissive:0x1a7fb8,emissiveIntensity:0.9}),
  gas: new THREE.MeshStandardMaterial({color:0x51ff7a,roughness:0.3,emissive:0x0d7a2e,emissiveIntensity:0.8,transparent:true,opacity:0.9}),
};
function teamMat(color){ return new THREE.MeshStandardMaterial({color,roughness:0.4,metalness:0.45,emissive:color,emissiveIntensity:0.25}); }
function shadowify(o){ o.traverse(m=>{ if(m.isMesh){m.castShadow=true;m.receiveShadow=true;} }); }

function makeSCV(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.7,1.5),MAT.steel); body.position.y=0.7;
  const cab=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.5,0.7),c); cab.position.set(0,1.25,-0.2);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.25,1.2),MAT.dark); armL.position.set(-0.7,0.6,0.4);
  const armR=armL.clone(); armR.position.x=0.7;
  const drill=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.7,6),c); drill.position.set(0.7,0.5,1.1); drill.rotation.x=Math.PI/2;
  g.add(body,cab,armL,armR,drill); shadowify(g); return g;
}
function makeMarine(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const legs=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.5),MAT.dark); legs.position.y=0.35;
  const torso=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.8,0.6),c); torso.position.y=1.1;
  const helm=new THREE.Mesh(new THREE.SphereGeometry(0.32,10,8),MAT.steel); helm.position.y=1.75;
  const visor=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.14,0.1),
    new THREE.MeshStandardMaterial({color:0x111111,emissive:TEAMS[team].side===0?0x33ccff:0xff8833,emissiveIntensity:1.4}));
  visor.position.set(0,1.75,0.28);
  const gun=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.16,1.3),MAT.dark); gun.position.set(0.45,1.15,0.5);
  g.add(legs,torso,helm,visor,gun); shadowify(g); return g;
}
function makeCC(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const base=new THREE.Mesh(new THREE.BoxGeometry(7,1.6,7),MAT.dark); base.position.y=0.8;
  const mid=new THREE.Mesh(new THREE.BoxGeometry(5.4,2.2,5.4),MAT.steel); mid.position.y=2.6;
  const top=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.6,3.4),c); top.position.y=4.4;
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,2.6,6),c); mast.position.y=6;
  const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,8),
    new THREE.MeshStandardMaterial({color:0xffffff,emissive:TEAMS[team].color,emissiveIntensity:2}));
  beacon.position.y=7.3; beacon.name='beacon';
  g.add(base,mid,top,mast,beacon); shadowify(g); return g;
}
function makeBarracks(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const b=new THREE.Mesh(new THREE.BoxGeometry(6,2.4,4.6),MAT.steel); b.position.y=1.2;
  const roof=new THREE.Mesh(new THREE.BoxGeometry(6.4,0.4,5),c); roof.position.y=2.6;
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.8,0.2),MAT.dark); door.position.set(0,1,2.35);
  g.add(b,roof,door); shadowify(g); return g;
}
function makeDepot(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const b=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.8,3.6),MAT.steel); b.position.y=0.9;
  const lid=new THREE.Mesh(new THREE.BoxGeometry(3.9,0.5,3.9),c); lid.position.y=2;
  const glow=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.15,0.4),
    new THREE.MeshStandardMaterial({color:0x000000,emissive:TEAMS[team].color,emissiveIntensity:1.6}));
  glow.position.set(0,1.2,1.85); g.add(b,lid,glow); shadowify(g); return g;
}
function makeTurret(team){
  const g=new THREE.Group(), c=teamMat(TEAMS[team].color);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,1,8),MAT.dark); base.position.y=0.5;
  const head=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.8,1.6),c); head.position.y=1.4;
  const gun=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.4,6),MAT.steel);
  gun.rotation.x=Math.PI/2; gun.position.set(0,1.5,1.2);
  g.add(base,head,gun); shadowify(g); return g;
}
function makeMineral(){
  const g=new THREE.Group();
  for(let i=0;i<5;i++){ const s=0.7+Math.random()*0.9;
    const m=new THREE.Mesh(new THREE.OctahedronGeometry(s,0),MAT.mineral);
    m.position.set((Math.random()-0.5)*2.4, s*0.7, (Math.random()-0.5)*2.4);
    m.rotation.set(Math.random()*3,Math.random()*3,0); g.add(m); }
  shadowify(g); return g;
}
function makeGeyser(){
  const g=new THREE.Group();
  const rock=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2,1.2,8),
    new THREE.MeshStandardMaterial({color:0x3a4148,roughness:1})); rock.position.y=0.6;
  const plume=new THREE.Mesh(new THREE.CylinderGeometry(0.7,1,3.4,10,1,true),MAT.gas);
  plume.position.y=2.8; plume.name='plume';
  const glow=new THREE.PointLight(0x51ff7a,8,14); glow.position.y=2.5;
  g.add(rock,plume,glow); shadowify(g); plume.castShadow=false; return g;
}

/* ============ data ============ */
const COST = {
  scv:{min:50,gas:0,sup:1,time:8}, marine:{min:50,gas:0,sup:1,time:9},
  depot:{min:100,gas:0,time:12}, barracks:{min:150,gas:0,time:20}, turret:{min:100,gas:25,time:14},
};
const STATS = {
  scv:{hp:60,speed:11,sight:14,dmg:4,range:1.8,cd:1.0,name:'SCV',face:'🚜'},
  marine:{hp:55,speed:9.5,sight:19,dmg:7,range:11,cd:0.7,name:'Marine',face:'🔫'},
  cc:{hp:1300,name:'Command Center',face:'🏠',size:4.6,supply:11},
  barracks:{hp:700,name:'Barracks',face:'🏭',size:3.8},
  depot:{hp:420,name:'Supply Depot',face:'📦',size:2.6,supply:8},
  turret:{hp:380,name:'Missile Turret',face:'🗼',size:1.8,sight:16,dmg:9,range:14,cd:0.9},
  mineral:{hp:1500,name:'Mineral Field',face:'💎'},
  geyser:{hp:1e9,name:'Vespene Geyser',face:'🟢'},
};
const BUILD_SIZE = {depot:2.6, barracks:3.8, turret:1.8};

/* ============ game state ============ */
const S = {
  started:false, over:false, spectate:false, faction:'player', time:0, speed:1, follow:true,
  ents:[], parts:[], selected:new Set(),
  attackMode:false, placeType:null, ghost:null,
  idc:1, lastBattle:{x:0,z:0,t:-99}, result:'',
};
const RES = {}, SUP = {}, AI = {};
for(const t of Object.keys(TEAMS)){ RES[t]={min:150,gas:0}; SUP[t]={used:0,max:0}; }

function addHpBar(e,y){
  const g=new THREE.Group();
  const bg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.28),new THREE.MeshBasicMaterial({color:0x101418,depthTest:false,transparent:true}));
  const fg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.28),new THREE.MeshBasicMaterial({color:0x39ff70,depthTest:false,transparent:true}));
  fg.position.z=0.001; g.add(bg,fg); g.position.y=y; g.renderOrder=99;
  bg.renderOrder=fg.renderOrder=99; e.mesh.add(g); e.barFg=fg; e.bar=g;
}
function spawnEnt(kind,team,x,z){
  const st=STATS[kind];
  const e={ id:S.idc++, kind, team, x, z, hp:st.hp, maxHp:st.hp,
    order:null, cool:0, mineT:0, carry:0, carryType:null, prog:1,
    queue:[], rally:null, bobT:0, retarget:0, foe:null, lastHit:-99 };
  let m;
  if(kind==='scv')m=makeSCV(team); else if(kind==='marine')m=makeMarine(team);
  else if(kind==='cc')m=makeCC(team); else if(kind==='barracks')m=makeBarracks(team);
  else if(kind==='depot')m=makeDepot(team); else if(kind==='turret')m=makeTurret(team);
  else if(kind==='mineral')m=makeMineral(); else if(kind==='geyser')m=makeGeyser();
  e.mesh=m; m.position.set(x,0,z);
  m.traverse(o=>{o.userData.root=e;}); m.userData.root=e;
  if(kind==='mineral') e.amt=1500;
  if(['scv','marine'].includes(kind)) addHpBar(e, kind==='scv'?2.2:2.6);
  if(['cc','barracks','depot','turret'].includes(kind)){ addHpBar(e, kind==='cc'?8.4:kind==='barracks'?4.4:3.4); e.isBuilding=true; }
  if(kind==='mineral'||kind==='geyser') e.isResource=true;
  scene.add(m); S.ents.push(e); return e;
}
const isUnit = e => e.kind==='scv'||e.kind==='marine';
const isCombat = e => e.kind==='scv'||e.kind==='marine'||e.kind==='turret';
const alive = e => e.hp>0 && !e.dead;
const own = e => e.team===S.faction;
function enemiesOf(e){ return S.ents.filter(o=>alive(o)&&!o.isResource&&isFoe(e.team,o.team)&&(isUnit(o)||o.isBuilding)); }

/* ---- map setup: 4 corners ---- */
const BASES = { player:[-33,-33], ally:[33,-33], enemy1:[-33,33], enemy2:[33,33] };
function setupWorld(){
  for(const [team,[bx,bz]] of Object.entries(BASES)){
    spawnEnt('cc',team,bx,bz);
    for(let i=0;i<4;i++) spawnEnt('scv',team,bx-4+i*2.4,bz+7);
    for(let i=0;i<2;i++) spawnEnt('marine',team,bx+2+i*2.6,bz+8);
    // minerals toward map center
    const tx=-Math.sign(bx), tz=-Math.sign(bz);
    const sx=-tz, sz=tx; // perpendicular
    for(let i=0;i<7;i++)
      spawnEnt('mineral',null,bx+tx*13+sx*(i-3)*2.6, bz+tz*13+sz*(i-3)*2.6);
    spawnEnt('geyser',null,bx+tx*7+sx*6, bz+tz*7+sz*6);
    spawnEnt('geyser',null,bx+tx*7-sx*6, bz+tz*7-sz*6);
    recalcSupply(team);
  }
}
function recalcSupply(team){
  let used=0,max=0;
  for(const e of S.ents){ if(!alive(e)||e.team!==team) continue;
    if(e.kind==='scv'||e.kind==='marine') used+=1;
    if(STATS[e.kind]?.supply && e.prog>=1) max+=STATS[e.kind].supply;
  }
  SUP[team]={used,max};
}
const canAfford=(team,c)=>RES[team].min>=c.min && RES[team].gas>=(c.gas||0);
function payCost(team,c){ RES[team].min-=c.min; RES[team].gas-=c.gas||0; }

/* ============ selection ============ */
const ray=new THREE.Raycaster(), ptr=new THREE.Vector2(), tmpV=new THREE.Vector3();
function pickAt(cx,cy){
  ptr.x=(cx/innerWidth)*2-1; ptr.y=-(cy/innerHeight)*2+1; ray.setFromCamera(ptr,camera);
  const hits=ray.intersectObjects(S.ents.filter(e=>alive(e)).map(e=>e.mesh),true);
  for(const h of hits){ let o=h.object; while(o && !o.userData.root) o=o.parent;
    if(o?.userData.root) return o.userData.root; }
  return null;
}
function groundAt(cx,cy){
  ptr.x=(cx/innerWidth)*2-1; ptr.y=-(cy/innerHeight)*2+1; ray.setFromCamera(ptr,camera);
  const h=ray.intersectObject(ground); return h[0]?.point||null;
}
function selectable(e){
  if(!alive(e)) return false;
  if(S.spectate) return !e.isResource;
  return e.team===S.faction && !e.isResource;
}
function selectOnly(list, additive=false){
  if(!additive) S.selected.clear();
  for(const e of list){ if(selectable(e)) S.selected.add(e);
    else if(!S.spectate && alive(e) && e.isResource) { /* resource click: show intel */ S.selected.add(e); } }
  AudioSys.select(); refreshPanel();
}
function clearPlacement(){ S.placeType=null; if(S.ghost){scene.remove(S.ghost);S.ghost=null;} }

/* ============ orders (human) ============ */
function orderSelection(wx,wz,target){
  const sel=[...S.selected].filter(e=>alive(e)&&own(e)&&isUnit(e));
  if(!sel.length){
    const blds=[...S.selected].filter(e=>alive(e)&&own(e)&&e.isBuilding&&(e.kind==='cc'||e.kind==='barracks'));
    if(blds.length){ for(const b of blds) b.rally={x:wx,z:wz}; toast('Rally point set'); }
    return;
  }
  AudioSys.ensure();
  if(S.placeType) return;
  for(const u of sel){
    if(target && !target.isResource && isFoe(u.team,target.team)){
      u.order={type:'attack',target}; AudioSys.attack();
    } else if(target && target.isResource && u.kind==='scv' && target.kind==='mineral' && target.amt>0){
      u.order={type:'harvest',node:target}; u.carry=0; AudioSys.move();
    } else if(target && target.isResource && u.kind==='scv' && target.kind==='geyser'){
      u.order={type:'gas',node:target}; u.carry=0; AudioSys.move();
    } else if(target && target.team===u.team && target.isBuilding && u.kind==='scv' && u.carry>0){
      u.order={type:'return',cc:target}; AudioSys.move();
    } else if(S.attackMode){
      u.order={type:'attackmove',x:wx,z:wz}; AudioSys.attack();
    } else {
      u.order={type:'move',x:wx,z:wz}; AudioSys.move();
    }
  }
  movePing(wx,wz, S.attackMode?'red':'green');
  S.attackMode=false; document.body.style.cursor='crosshair';
}

/* ============ combat / fx ============ */
function movePing(x,z,color){
  const m=new THREE.Mesh(new THREE.RingGeometry(0.6,1,24),
    new THREE.MeshBasicMaterial({color:color==='red'?0xff4455:0x54ff9f,transparent:true,opacity:0.9,side:THREE.DoubleSide}));
  m.rotation.x=-Math.PI/2; m.position.set(x,0.1,z); scene.add(m);
  S.parts.push({mesh:m,life:0.6,ping:true});
}
function tracer(a,b,color){
  const d=new THREE.Vector3().subVectors(b,a), len=d.length();
  const m=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,Math.max(1,len)),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.95}));
  m.position.copy(a).addScaledVector(d,0.5);
  m.lookAt(b); scene.add(m); S.parts.push({mesh:m,life:0.12});
}
function explode(x,z,big=false){
  AudioSys.boom();
  const n=big?22:12;
  for(let i=0;i<n;i++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3),
      new THREE.MeshBasicMaterial({color:Math.random()<0.5?0xffa63d:0xff4d4d}));
    m.position.set(x,0.6,z);
    S.parts.push({mesh:m,life:0.5+Math.random()*0.4,
      vx:(Math.random()-0.5)*14,vy:4+Math.random()*9,vz:(Math.random()-0.5)*14,spin:true});
    scene.add(m);
  }
  const flash=new THREE.PointLight(0xffaa55,60,20); flash.position.set(x,3,z); scene.add(flash);
  S.parts.push({mesh:flash,life:0.25,light:true});
}
function damage(e,amt){
  if(!alive(e)||e.dead) return;
  e.hp-=amt; e.lastHit=S.time;
  if(isUnit(e)||e.isBuilding) S.lastBattle={x:e.x,z:e.z,t:S.time};
  if(e.hp<=0){ e.hp=0; e.dead=true; killEnt(e); }
}
function killEnt(e){
  S.selected.delete(e);
  scene.remove(e.mesh);
  S.ents.splice(S.ents.indexOf(e),1);
  explode(e.x,e.z,e.isBuilding);
  recalcSupply(e.team);
  if(e.isBuilding){
    const mine = !S.spectate && TEAMS[e.team].side===0;
    toast((mine?'Lost ':'Destroyed ')+STATS[e.kind].name+` (${TEAMS[e.team].name})`, mine);
  }
  checkEnd(); refreshPanel();
}
function sideBuildings(side){ return S.ents.filter(e=>alive(e)&&e.isBuilding&&TEAMS[e.team].side===side); }
function checkEnd(){
  if(S.over||!S.started) return;
  const b0=sideBuildings(0).length, b1=sideBuildings(1).length;
  if(b1===0||b0===0) endGame(b1===0?0:1);
}
function endGame(winner){
  S.over=true; S.result=winner===0?'side0':'side1';
  const youWin = winner===0;
  $('end-title').textContent = S.spectate
    ? (winner===0?'🔵 BLUE SIDE WINS':'🔴 RED SIDE WINS')
    : (youWin?'VICTORY':'DEFEAT');
  $('end-title').style.color = winner===0?'#7dff9b':'#ff6b78';
  $('end-sub').textContent = S.spectate
    ? `The ${winner===0?'Blue/Teal':'Red/Orange'} alliance rules the valley after ${fmtTime(S.time)}.`
    : (youWin?`Both enemy Command Centers destroyed in ${fmtTime(S.time)}. The valley is yours, Commander.`
             :`Your alliance has fallen. Try turrets, mass marines — and protect your ally.`);
  $('endcard').classList.remove('hidden');
  if(youWin) AudioSys.train(); else AudioSys.boom();
}

/* ============ unit sim ============ */
function dist2(ax,az,bx,bz){ return Math.hypot(ax-bx,az-bz); }
function nearestCC(team,x,z){
  let best=null,bd=1e9;
  for(const e of S.ents){ if(e.team===team&&e.kind==='cc'&&alive(e)&&e.prog>=1){ const d=dist2(x,z,e.x,e.z); if(d<bd){bd=d;best=e;} } }
  return best;
}
function stepUnit(e,dt){
  const st=STATS[e.kind];
  e.cool-=dt;
  const moveToward=(x,z,speed=st.speed)=>{
    const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);
    if(d<0.4) return true;
    let vx=dx/d*speed, vz=dz/d*speed;
    for(const o of S.ents){ if(o===e||!alive(o)||!isUnit(o)) continue;
      const dd=dist2(e.x,e.z,o.x,o.z); if(dd<1.6&&dd>0.001){ vx+=(e.x-o.x)/dd*3; vz+=(e.z-o.z)/dd*3; } }
    for(const b of S.ents){ if(!b.isBuilding||!alive(b)) continue;
      const dd=dist2(e.x,e.z,b.x,b.z), r=(STATS[b.kind].size||3)+0.8;
      if(dd<r){ vx+=(e.x-b.x)/(dd+0.01)*10; vz+=(e.z-b.z)/(dd+0.01)*10; } }
    e.x+=vx*dt; e.z+=vz*dt;
    e.x=Math.max(-HALF+1,Math.min(HALF-1,e.x)); e.z=Math.max(-HALF+1,Math.min(HALF-1,e.z));
    e.mesh.rotation.y=Math.atan2(vx,vz);
    return d<1.2;
  };
  const tryFire=(t,chase=true)=>{
    if(!t||!alive(t)) return false;
    const d=dist2(e.x,e.z,t.x,t.z);
    e.mesh.rotation.y=Math.atan2(t.x-e.x,t.z-e.z);
    if(d<=st.range){ if(e.cool<=0){ e.cool=st.cd;
        tracer(new THREE.Vector3(e.x,1.6,e.z),new THREE.Vector3(t.x,t.isBuilding?2.5:1.2,t.z),
          TEAMS[e.team].side===0?0x7fe7ff:0xffb27f);
        AudioSys.shoot(); damage(t,st.dmg);
      } return true; }
    if(chase) moveToward(t.x,t.z); return true;
  };
  const acquire=(sight=st.sight||16)=>{
    let best=null,bd=sight;
    for(const o of S.ents){ if(!isFoe(e.team,o.team)||!alive(o)||o.isResource) continue;
      if(!isUnit(o)&&!o.isBuilding) continue;
      const d=dist2(e.x,e.z,o.x,o.z); if(d<bd){bd=d;best=o;} }
    return best;
  };
  const acquireCached=(sight)=>{
    e.retarget-=dt;
    if(e.retarget<=0||!e.foe||!alive(e.foe)){ e.foe=acquire(sight); e.retarget=0.25; }
    return e.foe;
  };
  const o=e.order;
  if(e.kind==='scv' && e.carry>0 && (!o||o.type==='move')){
    const cc=nearestCC(e.team,e.x,e.z);
    if(cc) e.order={type:'return',cc};
    return;
  }
  if(!o){
    if(isCombat(e)){ const t=acquireCached(); if(t) tryFire(t, S.spectate||e.team!==S.faction); }
    return;
  }
  if(o.type==='move'){ if(moveToward(o.x,o.z)) e.order=null; else { const t=acquireCached(6); if(t&&isCombat(e)) tryFire(t,true); } }
  else if(o.type==='attackmove'){ const t=acquireCached(); if(t) tryFire(t,true); else if(moveToward(o.x,o.z)) e.order=null; }
  else if(o.type==='attack'){ if(!alive(o.target)){ e.order=null; return; } tryFire(o.target,true); }
  else if(o.type==='harvest'){
    const n=o.node;
    if(!alive(n)||n.amt<=0){ e.order=null; return; }
    if(dist2(e.x,e.z,n.x,n.z)>3){ moveToward(n.x,n.z); }
    else { e.mineT+=dt; e.mesh.rotation.y+=dt*4;
      if(e.mineT>1.6){ e.mineT=0; e.carry=8; e.carryType='min'; n.amt-=8; AudioSys.mine();
        if(n.amt<=0){ scene.remove(n.mesh); S.ents.splice(S.ents.indexOf(n),1); }
        const cc=nearestCC(e.team,e.x,e.z); e.order=cc?{type:'return',cc}:null; } }
  }
  else if(o.type==='gas'){
    const n=o.node;
    if(dist2(e.x,e.z,n.x,n.z)>3.4){ moveToward(n.x,n.z); }
    else { e.mineT+=dt; if(e.mineT>2){ e.mineT=0; e.carry=6; e.carryType='gas'; AudioSys.mine();
        const cc=nearestCC(e.team,e.x,e.z); e.order=cc?{type:'return',cc}:null; } }
  }
  else if(o.type==='return'){
    const cc=o.cc;
    if(!alive(cc)){ e.order=null; return; }
    if(dist2(e.x,e.z,cc.x,cc.z)>6){ moveToward(cc.x,cc.z); }
    else { if(e.carry>0){ if(e.carryType==='gas'){RES[e.team].gas+=e.carry;} else {RES[e.team].min+=e.carry;} AudioSys.mine(); e.carry=0; }
      e.order=null; }
  }
  else if(o.type==='build'){
    if(dist2(e.x,e.z,o.x,o.z)>BUILD_SIZE[o.what]+1.5){ moveToward(o.x,o.z); }
    else { o.t=(o.t||0)+dt; e.mesh.rotation.y+=dt*6;
      if(o.t>=COST[o.what].time*0.4){
        const b=spawnEnt(o.what,e.team,o.x,o.z); b.prog=0.15; b.hp=b.maxHp*0.15+20;
        e.order={type:'construct',site:b}; recalcSupply(e.team); AudioSys.build();
      } }
  }
  else if(o.type==='construct'){
    const b=o.site;
    if(!alive(b)){ e.order=null; return; }
    if(b.prog>=1){ e.order=null; return; }
    b.prog+=dt/COST[b.kind].time; b.hp=Math.min(b.maxHp,b.maxHp*b.prog+50);
    e.mesh.rotation.y+=dt*5;
    if(b.prog>=1){ b.prog=1; b.hp=b.maxHp; recalcSupply(b.team); e.order=null; AudioSys.train();
      if(!S.spectate&&b.team===S.faction){ toast(STATS[b.kind].name+' online'); refreshPanel(); } }
  }
}
function stepBuilding(e,dt){
  if(e.prog<1) return;
  if(e.queue.length){
    const q=e.queue[0]; q.t+=dt;
    if(q.t>=q.need){ e.queue.shift();
      const a=Math.atan2((e.rally?.x??e.x)-e.x,(e.rally?.z??e.z)-e.z);
      const u=spawnEnt(q.kind,e.team,e.x+Math.sin(a)*6,e.z+Math.cos(a)*6);
      recalcSupply(e.team);
      if(AI[e.team]) aiOnUnit(e.team,u);
      else if(e.rally) u.order={type:'move',x:e.rally.x+(Math.random()-0.5)*4,z:e.rally.z+(Math.random()-0.5)*4};
      else u.order={type:'move',x:e.x+(Math.random()-0.5)*10,z:e.z+6+(Math.random()-0.5)*6};
      if(!S.spectate&&e.team===S.faction){ toast(STATS[q.kind].name+' ready'); AudioSys.train(); refreshPanel(); }
    }
  }
  if(e.kind==='turret'){ e.cool=(e.cool||0)-dt;
    if(e.cool<=0){
      let best=null,bd=STATS.turret.sight;
      for(const o of S.ents){ if(!isFoe(e.team,o.team)||!alive(o)||o.isResource||!isUnit(o)) continue;
        const d=dist2(e.x,e.z,o.x,o.z); if(d<bd){bd=d;best=o;} }
      if(best){ e.cool=STATS.turret.cd;
        tracer(new THREE.Vector3(e.x,2.2,e.z),new THREE.Vector3(best.x,1.2,best.z),0xffe27f);
        AudioSys.shoot(); damage(best,STATS.turret.dmg); }
    } }
}

/* ============ bot AI ============ */
const AI_DEFS = {
  player:{strike:180, army:5, workers:10, interval:80,  raxMax:2, cap:24, label:'Blue'},
  ally:  {strike:170, army:5, workers:10, interval:80,  raxMax:2, cap:24, label:'Teal ally'},
  enemy1:{strike:140, army:4, workers:9,  interval:70,  raxMax:2, cap:22, label:'Red'},
  enemy2:{strike:215, army:7, workers:11, interval:95,  raxMax:3, cap:28, label:'Orange'},
};
function setupAI(team){ AI[team]={team, def:AI_DEFS[team], tick:Math.random()*0.4, nextStrike:AI_DEFS[team].strike, nextWave:0, target:null}; }
function aiUnits(team){ const u={cc:[],scv:[],marine:[],rax:[],depot:[],turret:[]};
  for(const e of S.ents){ if(!alive(e)||e.team!==team) continue;
    if(e.kind==='cc'&&e.prog>=1)u.cc.push(e); else if(e.kind==='scv')u.scv.push(e);
    else if(e.kind==='marine')u.marine.push(e); else if(e.kind==='barracks'&&e.prog>=1)u.rax.push(e);
    else if(e.kind==='depot')u.depot.push(e); else if(e.kind==='turret')u.turret.push(e); }
  return u; }
function aiBuildProg(team,what){
  for(const e of S.ents){ if(e.team===team&&(e.kind===what&&e.prog<1)) return true;
    if(e.team===team&&isUnit(e)&&(e.order?.type==='build'&&e.order.what===what||e.order?.type==='construct'&&e.order.site.kind===what)) return true; }
  return false;
}
function canPlaceAt(what,x,z){
  if(Math.abs(x)>HALF-4||Math.abs(z)>HALF-4) return false;
  for(const e of S.ents){ if(e.isBuilding&&alive(e)){
      if(dist2(x,z,e.x,e.z)<(STATS[e.kind].size||3)+BUILD_SIZE[what]) return false; }
    if(e.isResource&&dist2(x,z,e.x,e.z)<5) return false; }
  return true;
}
function aiFindSpot(team,what){
  const cc=nearestCC(team,BASES[team][0],BASES[team][1])||S.ents.find(e=>e.team===team&&e.kind==='cc'&&alive(e));
  if(!cc) return null;
  for(let r=10;r<26;r+=2.5) for(let a=0;a<12;a++){
    const x=cc.x+Math.cos(a/12*Math.PI*2)*r, z=cc.z+Math.sin(a/12*Math.PI*2)*r;
    if(canPlaceAt(what,x,z)) return {x,z};
  }
  return null;
}
function aiBuilder(team){
  const ws=S.ents.filter(e=>e.team===team&&e.kind==='scv'&&alive(e));
  return ws.find(w=>!w.order&&w.carry===0)||ws.find(w=>w.carry===0)||ws[0]||null;
}
function aiBuild(ai,what){
  const c=COST[what];
  if(!canAfford(ai.team,c)) return false;
  const b=aiBuilder(ai.team), s=b&&aiFindSpot(ai.team,what);
  if(!b||!s) return false;
  payCost(ai.team,c); b.order={type:'build',x:s.x,z:s.z,what}; return true;
}
function aiHarvest(ai,w){
  let best=null,bd=1e9;
  for(const e of S.ents){ if(e.kind!=='mineral'||!alive(e)||e.amt<=0) continue;
    const d=dist2(w.x,w.z,e.x,e.z); if(d<bd){bd=d;best=e;} }
  if(best){ w.order={type:'harvest',node:best}; w.carry=0; }
}
function aiOnUnit(team,u){
  if(u.kind==='scv'){ const ai=AI[team]; if(ai) aiHarvest(ai,u); }
  else if(AI[team]?.target) u.order={type:'attackmove',x:AI[team].target.x+(Math.random()-0.5)*8,z:AI[team].target.z+(Math.random()-0.5)*8};
  else { const cc=nearestCC(team,u.x,u.z); if(cc) u.order={type:'move',x:cc.x+(Math.random()-0.5)*10,z:cc.z+7}; }
}
function nearestFoeBase(team){
  const ccs=S.ents.filter(e=>alive(e)&&e.kind==='cc'&&isFoe(team,e.team));
  const me=nearestCC(team,BASES[team][0],BASES[team][1]);
  const mx=me?me.x:BASES[team][0], mz=me?me.z:BASES[team][1];
  let best=null,bestScore=1e9;
  for(const c of ccs){
    let guards=0;
    for(const o of S.ents){ if(alive(o)&&isUnit(o)&&isFoe(team,o.team)&&dist2(o.x,o.z,c.x,c.z)<25) guards++; }
    const score=guards*30+dist2(mx,mz,c.x,c.z)*0.15; // gang up on the weakest base
    if(score<bestScore){bestScore=score;best=c;}
  }
  return best;
}
function aiLaunch(ai,u){
  const tgt=nearestFoeBase(ai.team);
  if(!tgt) return;
  ai.target={x:tgt.x,z:tgt.z};
  let n=0;
  for(const m of u.marine){ if(!m.order||m.order.type==='move'){ m.order={type:'attackmove',x:tgt.x+(Math.random()-0.5)*10,z:tgt.z+(Math.random()-0.5)*10}; n++; } }
  if(n>0){
    AudioSys.horn();
    const humanSide = TEAMS[ai.team].side===0;
    if(S.spectate) toast(`⚔️ ${TEAMS[ai.team].name} attacks with ${n} marines!`, true);
    else if(humanSide && ai.team!==S.faction) toast(`🤝 ${TEAMS[ai.team].name} is attacking the enemy!`);
    else if(!humanSide) toast(`⚠️ ${TEAMS[ai.team].name} inbound — ${n} hostiles!`, true);
  }
}
function runAI(ai,dt){
  ai.tick-=dt; if(ai.tick>0) return; ai.tick=0.4;
  const t=ai.team, u=aiUnits(t), R=RES[t];
  if(!u.cc.length) return;
  const cc=u.cc[0];
  // worker micro: (re)assign idlers, rescue carriers
  for(const w of u.scv){
    if(w.carry>0&&!w.order){ const c2=nearestCC(t,w.x,w.z); if(c2) w.order={type:'return',cc:c2}; }
    else if(!w.order&&w.carry===0) aiHarvest(ai,w);
  }
  // gas: one harvester once we have a rax and want turrets
  if(u.rax.length&&R.gas<50&&!u.scv.some(w=>w.order?.type==='gas')){
    const g=S.ents.find(e=>e.kind==='geyser'&&alive(e)&&dist2(e.x,e.z,cc.x,cc.z)<30);
    const w=u.scv.find(w=>w.order?.type==='harvest');
    if(g&&w){ w.order={type:'gas',node:g}; w.carry=0; }
  }
  const busy=u.scv.some(w=>w.order?.type==='build'||w.order?.type==='construct');
  // build order
  if(SUP[t].used>=SUP[t].max-1&&SUP[t].max<64){ if(!aiBuildProg(t,'depot')) aiBuild(ai,'depot'); }
  else if(u.scv.length<ai.def.workers&&!cc.queue.length&&R.min>=50){ payCost(t,COST.scv); SUP[t].used++; cc.queue.push({kind:'scv',t:0,need:COST.scv.time}); }
  else if(!u.rax.length&&!aiBuildProg(t,'barracks')&&!busy){ aiBuild(ai,'barracks'); }
  else if(u.rax.length<ai.def.raxMax&&u.scv.length>=7&&!aiBuildProg(t,'barracks')&&!busy){ aiBuild(ai,'barracks'); }
  else if((S.time>150||ai.underHit&&(S.time-ai.underHit<25))&&u.turret.length<2&&!aiBuildProg(t,'turret')&&!busy){ aiBuild(ai,'turret'); }
  // marine production with mineral buffer + army cap
  if(u.marine.length<ai.def.cap)
    for(const r of u.rax){ if(!r.queue.length&&R.min>70&&SUP[t].used<SUP[t].max){ payCost(t,COST.marine); SUP[t].used++; r.queue.push({kind:'marine',t:0,need:COST.marine.time}); } }
  // ally rescue: help human when their CC is burning
  if(t==='ally'&&!S.spectate){
    const pcc=S.ents.find(e=>e.team==='player'&&e.kind==='cc'&&alive(e));
    if(pcc&&pcc.hp<pcc.maxHp*0.85){
      const idle=u.marine.filter(m=>!m.order);
      if(idle.length>=3){ idle.slice(0,2).forEach(m=>{m.order={type:'attackmove',x:pcc.x,z:pcc.z};});
        if(!ai.rescued){ ai.rescued=true; toast('🤝 Ally sends reinforcements!'); } }
    } else ai.rescued=false;
  }
  // attack waves
  const idle=u.marine.filter(m=>!m.order);
  if(ai.target){ // reinforce ongoing attack
    for(const m of idle){ if(Math.random()<0.5){ m.order={type:'attackmove',x:ai.target.x+(Math.random()-0.5)*10,z:ai.target.z+(Math.random()-0.5)*10}; } }
    if(S.time>ai.nextWave){ ai.nextWave=S.time+ai.def.interval;
      const still=S.ents.some(e=>alive(e)&&e.team===t&&e.kind==='marine'&&(e.order?.type==='attackmove'||e.order?.type==='attack'));
      if(!still) ai.target=null; }
  } else if(S.time>ai.nextStrike&&idle.length>=ai.def.army){
    ai.nextStrike=S.time+ai.def.interval; ai.nextWave=S.time+ai.def.interval;
    aiLaunch(ai,u);
  }
}

/* ============ HUD ============ */
const ICON={scv:'🚜',marine:'🔫',cc:'🏠',barracks:'🏭',depot:'📦',turret:'🗼',mineral:'💎',geyser:'🟢'};
function fmtTime(t){ const m=Math.floor(t/60),s=Math.floor(t%60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function cmdBtn(parent,{icon,label,sub,key,disabled,fn}){
  const b=document.createElement('button'); b.className='cmd'; b.disabled=!!disabled;
  b.innerHTML=`<span class="k">${key||''}</span><span class="e">${icon}</span>${label}<small>${sub||''}</small>`;
  b.onclick=ev=>{ev.stopPropagation();AudioSys.ensure();fn&&fn();}; parent.appendChild(b); return b;
}
function train(kind,from){
  const c=COST[kind], t=from.team;
  if(SUP[t].used>=SUP[t].max){toast('Additional Supply Depots required',true);AudioSys.error();return;}
  if(!canAfford(t,c)){toast('Not enough minerals',true);AudioSys.error();return;}
  payCost(t,c); SUP[t].used++;
  from.queue.push({kind,t:0,need:c.time});
  AudioSys.train(); refreshPanel();
}
function startPlacement(what){
  const w=[...S.selected].some(e=>alive(e)&&own(e)&&e.kind==='scv');
  if(!w){toast('Select an SCV first',true);AudioSys.error();return;}
  S.placeType=what; S.attackMode=false;
  if(S.ghost) scene.remove(S.ghost);
  const g=new THREE.Group(), s=BUILD_SIZE[what];
  const box=new THREE.Mesh(new THREE.BoxGeometry(s*2,2,s*2),
    new THREE.MeshBasicMaterial({color:0x54ff9f,transparent:true,opacity:0.4}));
  box.position.y=1; g.add(box); S.ghost=g; scene.add(g);
  toast(`Placing ${STATS[what].name} — left-click ground, right-click cancels`);
}
function tryPlace(wx,wz){
  const what=S.placeType, t=S.faction, c=COST[what];
  if(!canAfford(t,c)){toast('Not enough resources',true);AudioSys.error();return;}
  if(!canPlaceAt(what,wx,wz)){toast('Cannot build there',true);AudioSys.error();return;}
  payCost(t,c);
  const scvs=[...S.selected].filter(e=>alive(e)&&own(e)&&e.kind==='scv');
  if(scvs[0]){ scvs[0].order={type:'build',x:wx,z:wz,what}; S.selected.clear(); S.selected.add(scvs[0]); }
  clearPlacement(); AudioSys.build(); refreshPanel();
}
function setInfo(title,sub,extra=''){
  $('sel-info').innerHTML=`<b>${title}</b><span>${sub}</span>${extra}`;
}
function refreshPanel(){
  const cmds=$('commands'); cmds.innerHTML='';
  if(S.spectate){
    setInfo(`Observing 2v2`,'Click any unit for intel · 1-4 follow bases · Space follows battle');
    cmdBtn(cmds,{icon:'⚔️',label:'Follow battle',key:'Spc',fn:()=>{S.follow=true;}});
    for(const [i,t] of Object.keys(TEAMS).entries())
      cmdBtn(cmds,{icon:['🔵','🟢','🔴','🟠'][i],label:TEAMS[t].name.split(' ')[0],key:String(i+1),fn:()=>followTeam(t)});
    cmdBtn(cmds,{icon:'⏩',label:'Speed '+S.speed+'x',fn:cycleSpeed});
    return;
  }
  const sel=[...S.selected].filter(alive);
  const infoEl=$('sel-info');
  if(!sel.length){ setInfo('No selection','Drag to box-select. Right-click to order.');
    $('portrait-face').textContent='🛸';
    cmdBtn(cmds,{icon:'🚜',label:'Select workers',fn:()=>selectOnly(S.ents.filter(e=>own(e)&&e.kind==='scv'&&alive(e)))});
    cmdBtn(cmds,{icon:'⚔️',label:'Select army',fn:()=>selectOnly(S.ents.filter(e=>own(e)&&e.kind==='marine'&&alive(e)))});
    cmdBtn(cmds,{icon:'🤝',label:'View ally',fn:()=>followTeam('ally')});
    cmdBtn(cmds,{icon:'❓',label:'Help',key:'H',fn:()=>$('help').classList.remove('hidden')});
    return;
  }
  const kinds=[...new Set(sel.map(e=>e.kind))];
  $('portrait-face').textContent=ICON[sel[0].kind]||'🛸';
  const hpAvg=sel.reduce((a,e)=>a+e.hp/e.maxHp,0)/sel.length;
  const foeSel=sel.some(e=>!own(e)&&!e.isResource);
  setInfo(`${sel.length>1?sel.length+' ':''}${foeSel?'(enemy) ':''}${STATS[sel[0].kind].name}`,
    `${kinds.join(' · ')}${foeSel?' — hostile intel':''}`,
    `<div id="sel-hp"><i style="width:${Math.round(hpAvg*100)}%"></i></div>`);
  const mine=sel.filter(e=>own(e));
  if(!mine.length) return;
  const hasSCV=mine.some(e=>e.kind==='scv'), hasMar=mine.some(e=>e.kind==='marine');
  const cc=sel.find(e=>own(e)&&e.kind==='cc'), rax=sel.find(e=>own(e)&&e.kind==='barracks');
  if(cc&&sel.length===1){
    const q=cc.queue[0];
    cmdBtn(cmds,{icon:'🚜',label:'Train SCV',sub:`50⛏ · ${q?Math.round(q.t/q.need*100)+'%':'Q'}`,key:'Q',
      disabled:!canAfford(S.faction,COST.scv)||SUP[S.faction].used>=SUP[S.faction].max,fn:()=>train('scv',cc)});
  }
  if(rax&&sel.length===1){
    const q=rax.queue[0];
    cmdBtn(cmds,{icon:'🔫',label:'Train Marine',sub:`50⛏ · ${q?Math.round(q.t/q.need*100)+'%':'Q'}`,key:'Q',
      disabled:!canAfford(S.faction,COST.marine)||SUP[S.faction].used>=SUP[S.faction].max,fn:()=>train('marine',rax)});
  }
  if(hasSCV){
    cmdBtn(cmds,{icon:'📦',label:'Depot',sub:'100⛏ +8 B',key:'B',disabled:!canAfford(S.faction,COST.depot),fn:()=>startPlacement('depot')});
    cmdBtn(cmds,{icon:'🏭',label:'Barracks',sub:'150⛏ E',key:'E',disabled:!canAfford(S.faction,COST.barracks),fn:()=>startPlacement('barracks')});
    cmdBtn(cmds,{icon:'🗼',label:'Turret',sub:'100⛏ 25💧 R',key:'R',disabled:!canAfford(S.faction,COST.turret),fn:()=>startPlacement('turret')});
  }
  if(hasMar||hasSCV){
    cmdBtn(cmds,{icon:'⚔️',label:'Attack',sub:'A + click',key:'A',fn:()=>{
      clearPlacement();S.attackMode=true;document.body.style.cursor='cell';toast('Attack-move: click target');}});
    cmdBtn(cmds,{icon:'✋',label:'Stop',sub:'S',key:'S',fn:()=>{ for(const u of mine) if(isUnit(u)) u.order=null; }});
  }
}

/* ============ input (drag fixed: window-level finish) ============ */
let ldown=false,lstart=null,rmbPan=null;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{
  AudioSys.ensure();
  if(e.button===0){
    if(S.spectate){ ldown=true; lstart={x:e.clientX,y:e.clientY}; return; } // observe: drag intel only
    if(S.placeType){ const p=groundAt(e.clientX,e.clientY); if(p) tryPlace(p.x,p.z); return; }
    if(S.attackMode){ const p=groundAt(e.clientX,e.clientY); if(p){ const t=pickAt(e.clientX,e.clientY);
        orderSelection(p.x,p.z,t||{team:'enemy1',x:p.x,z:p.z}); refreshPanel(); } return; }
    ldown=true; lstart={x:e.clientX,y:e.clientY};
    return;
  }
  if(e.button===2){
    if(S.placeType){clearPlacement();refreshPanel();return;}
    const p=groundAt(e.clientX,e.clientY);
    if(p){ const t=pickAt(e.clientX,e.clientY);
      const tgt=(t&&!t.isResource&&isFoe(S.faction,t.team))?t:(t&&t.isResource?t:null);
      const scvCarry=[...S.selected].some(s=>s.kind==='scv'&&s.carry>0);
      const tgt2=tgt||(t&&t.team===S.faction&&t.isBuilding&&scvCarry?t:null);
      orderSelection(p.x,p.z,tgt2); refreshPanel(); }
    return;
  }
  if(e.button===1){ rmbPan={x:e.clientX,y:e.clientY,tx:cam.tx,tz:cam.tz}; e.preventDefault(); return; }
});
// drag tracking on window so releasing over HUD/panels still completes the gesture
window.addEventListener('pointermove',e=>{
  mouse.x=e.clientX;mouse.y=e.clientY;
  if(rmbPan){ const dx=(e.clientX-rmbPan.x);
    const c=Math.cos(cam.yaw),s=Math.sin(cam.yaw),k=cam.dist/600;
    cam.tx=rmbPan.tx-dx*k*c; cam.tz=rmbPan.tz-dx*k; clampCam(); return; }
  if(lstart && (Math.abs(e.clientX-lstart.x)>6||Math.abs(e.clientY-lstart.y)>6)){
    Object.assign(dragbox.style,{left:Math.min(lstart.x,e.clientX)+'px',top:Math.min(lstart.y,e.clientY)+'px',
      width:Math.abs(e.clientX-lstart.x)+'px',height:Math.abs(e.clientY-lstart.y)+'px'});
    dragbox.classList.remove('hidden');
  }
  if(S.ghost){ const p=groundAt(e.clientX,e.clientY); if(p) S.ghost.position.set(p.x,0,p.z); }
});
window.addEventListener('pointerup',e=>{
  if(e.button===1){rmbPan=null;return;}
  if(e.button!==0||!lstart) return;
  const wasDrag=!dragbox.classList.contains('hidden');
  dragbox.classList.add('hidden');
  const x0=Math.min(lstart.x,e.clientX),x1=Math.max(lstart.x,e.clientX);
  const y0=Math.min(lstart.y,e.clientY),y1=Math.max(lstart.y,e.clientY);
  if(wasDrag){
    const got=S.ents.filter(en=>{ if(!alive(en)||en.isResource) return false;
      if(!S.spectate&&en.team!==S.faction) return false;
      if(en.kind!=='scv'&&en.kind!=='marine') return false;
      tmpV.set(en.x,1,en.z).project(camera);
      if(tmpV.z>1) return false;
      const sx=(tmpV.x+1)/2*innerWidth, sy=(1-tmpV.y)/2*innerHeight;
      return sx>=x0&&sx<=x1&&sy>=y0&&sy<=y1; });
    selectOnly(got,e.shiftKey);
    if(!got.length&&!e.shiftKey){ S.selected.clear(); refreshPanel(); }
  } else {
    // click: only when press+release both on canvas (avoid UI clicks deselecting)
    if(e.target===canvas){
      const t=pickAt(e.clientX,e.clientY);
      const ok=t&&!t.isResource&&(S.spectate||t.team===S.faction);
      if(ok) selectOnly([t],e.shiftKey);
      else if(t&&t.isResource&&!S.spectate) selectOnly([t],e.shiftKey);
      else if(!e.shiftKey){ S.selected.clear(); refreshPanel(); }
    }
  }
  ldown=false;lstart=null;
});
window.addEventListener('pointercancel',()=>{ dragbox.classList.add('hidden'); ldown=false;lstart=null;rmbPan=null; });
canvas.addEventListener('wheel',e=>{ cam.dist=Math.max(22,Math.min(110,cam.dist+e.deltaY*0.05)); },{passive:true});
const keys={};
addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT') return;
  keys[e.key.toLowerCase()]=true;
  const k=e.key.toLowerCase();
  if(S.spectate){
    if(k===' '){S.follow=!S.follow;toast(S.follow?'Following battle':'Free camera');e.preventDefault();}
    const teams=Object.keys(TEAMS);
    const idx=['1','2','3','4'].indexOf(k);
    if(idx>=0) followTeam(teams[idx]);
    if(k==='f') cycleSpeed();
    return;
  }
  if(k==='escape'){ S.attackMode=false;clearPlacement();document.body.style.cursor='crosshair';refreshPanel(); }
  if(k==='a'&&S.started){ clearPlacement();S.attackMode=true;document.body.style.cursor='cell';toast('Attack-move: left-click target'); }
  if(k==='s'){ for(const u of S.selected) if(isUnit(u)&&own(u)) u.order=null; }
  if(k==='q'){ const cc=[...S.selected].find(e=>own(e)&&e.kind==='cc');
    const rax=[...S.selected].find(e=>own(e)&&e.kind==='barracks');
    if(cc) train('scv',cc); else if(rax) train('marine',rax); }
  if(k==='b') startPlacement('depot');
  if(k==='e') startPlacement('barracks');
  if(k==='r') startPlacement('turret');
  if(k==='h') $('help').classList.toggle('hidden');
  if(k==='m') toggleMute();
  if(k==='c') resetCam();
  const teams=Object.keys(TEAMS);
  const idx=['1','2','3','4'].indexOf(k);
  if(idx>=0&&e.altKey) followTeam(teams[idx]);
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
function clampCam(){ cam.tx=Math.max(-HALF-10,Math.min(HALF+10,cam.tx)); cam.tz=Math.max(-HALF-10,Math.min(HALF+10,cam.tz)); }
function resetCam(){
  if(S.spectate){ cam.tx=0;cam.tz=0;cam.dist=105;cam.yaw=Math.PI*0.25; return; }
  const cc=S.ents.find(e=>e.team===S.faction&&e.kind==='cc'&&alive(e));
  if(cc){ cam.tx=cc.x;cam.tz=cc.z+6; } cam.yaw=Math.PI*0.25;cam.dist=62;
}
function followTeam(t){
  const cc=S.ents.find(e=>e.team===t&&e.kind==='cc'&&alive(e))||S.ents.find(e=>e.team===t&&alive(e));
  if(cc){ cam.tx=cc.x;cam.tz=cc.z; S.follow=false; clampCam();
    if(S.spectate) toast(`Following ${TEAMS[t].name}`); }
}
function cycleSpeed(){ S.speed=S.speed>=4?1:S.speed*2; $('btn-speed').textContent=S.speed+'x'; toast('Speed '+S.speed+'x'); refreshPanel(); }
function toggleMute(){ AudioSys.muted=!AudioSys.muted; $('btn-mute').textContent=AudioSys.muted?'✕':'♪'; }
$('btn-mute').onclick=toggleMute;
$('btn-cam').onclick=()=>{S.follow=false;resetCam();};
$('btn-help').onclick=()=>$('help').classList.remove('hidden');
$('btn-close-help').onclick=()=>$('help').classList.add('hidden');
$('btn-play').onclick=()=>startMatch(false);
$('btn-watch').onclick=()=>startMatch(true);
$('btn-restart').onclick=()=>location.reload();
$('btn-speed').onclick=cycleSpeed;
$('btn-follow').onclick=()=>{S.follow=!S.follow;toast(S.follow?'Following battle':'Free camera');};
mm.addEventListener('pointerdown',e=>{
  const r=mm.getBoundingClientRect();
  cam.tx=((e.clientX-r.left)/r.width*2-1)*(HALF+5);
  cam.tz=((e.clientY-r.top)/r.height*2-1)*(HALF+5);
  S.follow=false; clampCam();
});
function startMatch(spectate){
  AudioSys.ensure(); S.started=true; S.spectate=spectate;
  if(spectate&&!AI.player) setupAI('player');
  $('menu').classList.add('hidden');
  $('topbar-play').classList.toggle('hidden',spectate);
  $('topbar-spec').classList.toggle('hidden',!spectate);
  resetCam();
  $('objective').textContent = spectate
    ? '🤖 All-AI war — Blue+Teal vs Red+Orange'
    : 'Destroy RED & ORANGE bases — with your TEAL ally';
  if(spectate){ toast('🤖 All-AI war: Blue+Teal vs Red+Orange · Space follows battle'); }
  else toast('Mine minerals · Build up · Destroy RED and ORANGE bases');
  AudioSys.train(); refreshPanel();
}

/* ============ minimap ============ */
function drawMinimap(){
  const W=mm.width,H=mm.height,sx=W/(WORLD+10),sz=H/(WORLD+10);
  const X=x=>(x+HALF+5)*sx, Z=z=>(z+HALF+5)*sz;
  mmc.fillStyle='#06121f';mmc.fillRect(0,0,W,H);
  mmc.strokeStyle='rgba(90,200,255,.4)';mmc.strokeRect(1,1,W-2,H-2);
  for(const e of S.ents){ if(!alive(e)) continue;
    if(e.isResource){ mmc.fillStyle=e.kind==='mineral'?'#54d8ff':'#51ff7a'; mmc.fillRect(X(e.x)-1,Z(e.z)-1,2,2); }
    else if(e.isBuilding){ mmc.fillStyle=TEAMS[e.team].mm; const s=e.kind==='cc'?7:5;
      mmc.fillRect(X(e.x)-s/2,Z(e.z)-s/2,s,s); }
    else { mmc.fillStyle=TEAMS[e.team].mm; mmc.beginPath();mmc.arc(X(e.x),Z(e.z),e.kind==='scv'?1.4:1.8,0,7);mmc.fill(); } }
  mmc.strokeStyle='#fff';mmc.lineWidth=1;
  const cw=26*sx*(cam.dist/62),ch=18*sz*(cam.dist/62);
  mmc.strokeRect(X(cam.tx)-cw/2,Z(cam.tz)-ch/2,cw,ch);
}

/* ============ main loop ============ */
const clock=new THREE.Clock();
let attract=0, hudT=0;
const mouse={x:innerWidth/2,y:innerHeight/2};
function stepSim(dt){
  S.time+=dt;
  for(const e of [...S.ents]){ if(!alive(e)) continue;
    if(isUnit(e)) stepUnit(e,dt); else if(e.isBuilding) stepBuilding(e,dt); }
  for(const t of Object.keys(AI)) runAI(AI[t],dt);
  // per-team refinery trickle
  gasAcc+=dt;
  if(gasAcc>12){ gasAcc=0; for(const t of Object.keys(TEAMS)) if(S.ents.some(e=>e.team===t&&e.kind==='cc'&&alive(e))) RES[t].gas+=4; }
}
let gasAcc=0;
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(0.05,clock.getDelta());
  if(S.started&&!S.over){
    for(let i=0;i<S.speed;i++) stepSim(dt);
    // spectate auto-cam follows the latest battle
    if(S.spectate&&S.follow){
      if(S.time-S.lastBattle.t<5){ cam.tx+=(S.lastBattle.x-cam.tx)*Math.min(1,dt*2); cam.tz+=(S.lastBattle.z-cam.tz)*Math.min(1,dt*2); clampCam(); }
      else { attract+=dt; cam.tx=Math.sin(attract*0.08)*20; cam.tz=Math.cos(attract*0.08)*20; }
    }
  } else if(!S.started){
    attract+=dt; cam.yaw+=dt*0.05;
    cam.tx=Math.sin(attract*0.1)*10; cam.tz=Math.cos(attract*0.1)*10;
  }
  // camera keys (arrows; Z/X rotate)
  if(S.started&&!(S.spectate&&S.follow&&S.time-S.lastBattle.t<5)){
    const sp=cam.dist*dt*0.9, c=Math.cos(cam.yaw),s=Math.sin(cam.yaw);
    let mx=0,mz=0;
    if(keys['arrowup']){mx-=s;mz-=c;} if(keys['arrowdown']){mx+=s;mz+=c;}
    if(keys['arrowleft']){mx-=c;mz+=s;} if(keys['arrowright']){mx+=c;mz-=s;}
    if(keys['z']){cam.yaw+=dt*1.2;} if(keys['x']){cam.yaw-=dt*1.2;}
    if(mx||mz){ cam.tx+=mx*sp; cam.tz+=mz*sp; S.follow=false; }
    if(!ldown&&(mouse.x<16||mouse.x>innerWidth-16||mouse.y<46||mouse.y>innerHeight-16)){
      const m=16, e2=cam.dist*dt*0.9;
      if(mouse.x<m){cam.tx-=e2*c;cam.tz-=e2*s;} if(mouse.x>innerWidth-m){cam.tx+=e2*c;cam.tz+=e2*s;}
      if(mouse.y<m+30){cam.tx-=e2*s;cam.tz-=e2*c;} if(mouse.y>innerHeight-m){cam.tx+=e2*s;cam.tz+=e2*c;}
      S.follow=false;
    }
    clampCam();
  }
  updateCamera();
  // fx parts
  for(let i=S.parts.length-1;i>=0;i--){ const p=S.parts[i]; p.life-=dt;
    if(p.life<=0){ scene.remove(p.mesh); if(p.mesh.geometry)p.mesh.geometry.dispose?.(); S.parts.splice(i,1); continue; }
    if(p.ping){ p.mesh.scale.multiplyScalar(1+dt*4); p.mesh.material.opacity=p.life; }
    else if(p.light){ p.mesh.intensity*=0.8; }
    else if(p.vx!==undefined){ p.mesh.position.x+=p.vx*dt; p.mesh.position.y+=p.vy*dt; p.mesh.position.z+=p.vz*dt;
      p.vy-=22*dt; if(p.spin){p.mesh.rotation.x+=dt*6;p.mesh.rotation.y+=dt*5;} }
    else { p.mesh.material.opacity=Math.min(1,p.life*8); } }
  for(const e of S.ents){ if(e.bar&&alive(e)){ e.bar.quaternion.copy(camera.quaternion);
      const f=Math.max(0,e.hp/e.maxHp); e.barFg.scale.x=f; e.barFg.position.x=-(1-f)*1.1;
      e.barFg.material.color.setHex(f>0.6?0x39ff70:f>0.3?0xffc93d:0xff4d5e);
      e.bar.visible=f<0.999; }
    if(e.kind==='cc'){ const b=e.mesh.getObjectByName('beacon'); if(b) b.position.y=7.3+Math.sin(S.time*3+e.id)*0.2; }
    if(e.kind==='geyser'){ const p=e.mesh.getObjectByName('plume'); if(p){p.rotation.y+=dt; p.scale.x=1+Math.sin(S.time*4+e.id)*0.06;} } }
  hudT+=dt; if(hudT>0.1){ hudT=0;
    if(S.spectate){
      for(const t of Object.keys(TEAMS)){
        $('c-'+t).textContent=`${Math.floor(RES[t].min)}⛏ ${SUP[t].used}/${SUP[t].max}`;
      }
      $('r-time').textContent=fmtTime(S.time);
    } else {
      $('r-min').textContent=Math.floor(RES[S.faction].min); $('r-gas').textContent=Math.floor(RES[S.faction].gas);
      $('r-sup').textContent=`${SUP[S.faction].used}/${SUP[S.faction].max}`; $('r-time').textContent=fmtTime(S.time);
    }
    drawMinimap();
  }
  // sync logical positions to meshes (+ walk bob)
  for(const e of S.ents){ if(isUnit(e)&&alive(e)){
      const dx=e.x-e.mesh.position.x, dz=e.z-e.mesh.position.z, moved=dx*dx+dz*dz>0.000001;
      if(moved) e.bobT+=dt;
      e.mesh.position.set(e.x, moved?Math.abs(Math.sin(e.bobT*12))*0.12:0, e.z);
    } }
  renderer.render(scene,camera);
}

addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight); });

/* boot */
setupWorld();
setupAI('ally'); setupAI('enemy1'); setupAI('enemy2');
resetCam();
refreshPanel();
drawMinimap();
animate();
window.__game=S; window.__RES=RES; window.__SUP=SUP; window.__AI=AI;
