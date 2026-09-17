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
  error(){this.tone(160,0.18,'sawtooth',0.05)}, build(){this.tone(300,0.1,'triangle',0.05,150)},
};

/* ============ DOM ============ */
const $ = id => document.getElementById(id);
const canvas = $('scene'), dragbox = $('dragbox'), mm = $('minimap'), mmc = mm.getContext('2d');
function toast(msg, warn=false){ const d=document.createElement('div'); d.className='toast'+(warn?' warn':''); d.textContent=msg;
  $('toast-wrap').appendChild(d); setTimeout(()=>{d.style.opacity='0';d.style.transition='opacity .4s'; setTimeout(()=>d.remove(),400);}, 2400); }

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
const groundMat = new THREE.MeshStandardMaterial({color:0x3a5244, roughness:1, metalness:0});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD+30,WORLD+30,1,1), groundMat);
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
{ // grid overlay
  const grid = new THREE.GridHelper(WORLD, 30, 0x3fa9ff, 0x1d3a2a);
  grid.material.transparent=true; grid.material.opacity=0.22; grid.position.y=0.02; scene.add(grid);
  // playable border glow
  const b = new THREE.Mesh(new THREE.BoxGeometry(WORLD+1,0.4,WORLD+1),
    new THREE.MeshBasicMaterial({color:0x1c5f8a, wireframe:false}));
  b.position.y=-0.25; scene.add(b);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD+1,0.5,WORLD+1)),
    new THREE.LineBasicMaterial({color:0x54d8ff})); edge.position.y=0; scene.add(edge);
}
/* decor rocks + trees */
function scatterDecor(){
  const rockM=new THREE.MeshStandardMaterial({color:0x3d4450,roughness:1});
  const leafM=new THREE.MeshStandardMaterial({color:0x1f6b3a,roughness:1});
  const trunkM=new THREE.MeshStandardMaterial({color:0x4a3421,roughness:1});
  for(let i=0;i<70;i++){
    const x=(Math.random()*2-1)*HALF*0.98, z=(Math.random()*2-1)*HALF*0.98;
    if(Math.hypot(x-HALF*0.55,z-HALF*0.55)<16||Math.hypot(x+HALF*0.55,z+HALF*0.55)<16) continue;
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

/* ============ materials / mesh factories ============ */
const TEAM = { player:0x2fa9f5, enemy:0xff4658 };
const MAT = {
  dark: new THREE.MeshStandardMaterial({color:0x141c26,roughness:0.6,metalness:0.6}),
  steel: new THREE.MeshStandardMaterial({color:0x8b98a8,roughness:0.35,metalness:0.8}),
  mineral: new THREE.MeshStandardMaterial({color:0x54d8ff,roughness:0.15,metalness:0.1,emissive:0x1a7fb8,emissiveIntensity:0.9}),
  gas: new THREE.MeshStandardMaterial({color:0x51ff7a,roughness:0.3,emissive:0x0d7a2e,emissiveIntensity:0.8,transparent:true,opacity:0.9}),
};
function teamMat(color){ return new THREE.MeshStandardMaterial({color,roughness:0.4,metalness:0.45,emissive:color,emissiveIntensity:0.25}); }
function shadowify(o){ o.traverse(m=>{ if(m.isMesh){m.castShadow=true;m.receiveShadow=true;} }); }

function makeSCV(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.7,1.5),MAT.steel); body.position.y=0.7;
  const cab=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.5,0.7),c); cab.position.set(0,1.25,-0.2);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.25,1.2),MAT.dark); armL.position.set(-0.7,0.6,0.4);
  const armR=armL.clone(); armR.position.x=0.7;
  const drill=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.7,6),c); drill.position.set(0.7,0.5,1.1); drill.rotation.x=Math.PI/2;
  g.add(body,cab,armL,armR,drill); shadowify(g); return g;
}
function makeMarine(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const legs=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.5),MAT.dark); legs.position.y=0.35;
  const torso=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.8,0.6),c); torso.position.y=1.1;
  const helm=new THREE.Mesh(new THREE.SphereGeometry(0.32,10,8),MAT.steel); helm.position.y=1.75;
  const visor=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.14,0.1),
    new THREE.MeshStandardMaterial({color:0x111111,emissive:team==='player'?0x33ccff:0xff3333,emissiveIntensity:1.4}));
  visor.position.set(0,1.75,0.28);
  const gun=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.16,1.3),MAT.dark); gun.position.set(0.45,1.15,0.5);
  g.add(legs,torso,helm,visor,gun); shadowify(g); return g;
}
function makeZergling(team){
  const g=new THREE.Group(), c=new THREE.MeshStandardMaterial({color:team==='player'?0x2fa9f5:0xb8336a,roughness:0.55,emissive:0x550f28,emissiveIntensity:0.4});
  const body=new THREE.Mesh(new THREE.SphereGeometry(0.7,10,8),c); body.scale.set(1,0.7,1.4); body.position.y=0.6;
  for(const s of [-1,1]){
    const wing=new THREE.Mesh(new THREE.ConeGeometry(0.22,1.3,5),c);
    wing.position.set(s*0.7,0.9,-0.3); wing.rotation.z=s*-1.9; g.add(wing);
    for(let i=0;i<2;i++){ const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.9,5),MAT.dark);
      leg.position.set(s*0.7,0.35,0.4-i*0.7); leg.rotation.z=s*0.5; g.add(leg); }
  }
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.35,8,8),c); head.position.set(0,0.8,1); g.add(head);
  g.add(body); shadowify(g); return g;
}
function makeHydra(team){
  const g=new THREE.Group(), c=new THREE.MeshStandardMaterial({color:0x8a3b5e,roughness:0.6,emissive:0x3a0a20,emissiveIntensity:0.5});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.8,1.6,7),c); body.position.y=0.8;
  const hood=new THREE.Mesh(new THREE.SphereGeometry(0.55,8,8),c); hood.position.y=1.8;
  hood.scale.set(1.2,0.7,1.2); g.add(body,hood); shadowify(g); return g;
}
function makeCC(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const base=new THREE.Mesh(new THREE.BoxGeometry(7,1.6,7),MAT.dark); base.position.y=0.8;
  const mid=new THREE.Mesh(new THREE.BoxGeometry(5.4,2.2,5.4),MAT.steel); mid.position.y=2.6;
  const top=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.6,3.4),c); top.position.y=4.4;
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,2.6,6),c); mast.position.y=6;
  const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,8),
    new THREE.MeshStandardMaterial({color:0xffffff,emissive:TEAM[team],emissiveIntensity:2}));
  beacon.position.y=7.3; beacon.name='beacon';
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.2,16),c); pad.position.set(0,0.15,5);
  g.add(base,mid,top,mast,beacon,pad); shadowify(g); return g;
}
function makeBarracks(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const b=new THREE.Mesh(new THREE.BoxGeometry(6,2.4,4.6),MAT.steel); b.position.y=1.2;
  const roof=new THREE.Mesh(new THREE.BoxGeometry(6.4,0.4,5),c); roof.position.y=2.6;
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.8,0.2),MAT.dark); door.position.set(0,1,2.35);
  g.add(b,roof,door); shadowify(g); return g;
}
function makeDepot(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const b=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.8,3.6),MAT.steel); b.position.y=0.9;
  const lid=new THREE.Mesh(new THREE.BoxGeometry(3.9,0.5,3.9),c); lid.position.y=2;
  const glow=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.15,0.4),
    new THREE.MeshStandardMaterial({color:0x000000,emissive:TEAM[team],emissiveIntensity:1.6}));
  glow.position.set(0,1.2,1.85); g.add(b,lid,glow); shadowify(g); return g;
}
function makeTurret(team){
  const g=new THREE.Group(), c=teamMat(TEAM[team]);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,1,8),MAT.dark); base.position.y=0.5;
  const head=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.8,1.6),c); head.position.y=1.4;
  const gun=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.4,6),MAT.steel);
  gun.rotation.x=Math.PI/2; gun.position.set(0,1.5,1.2);
  g.add(base,head,gun); shadowify(g); return g;
}
function makeMineral(amt){
  const g=new THREE.Group();
  for(let i=0;i<5;i++){ const s=0.7+Math.random()*0.9;
    const m=new THREE.Mesh(new THREE.OctahedronGeometry(s,0),MAT.mineral);
    m.position.set((Math.random()-0.5)*2.4, s*0.7, (Math.random()-0.5)*2.4);
    m.rotation.set(Math.random()*3,Math.random()*3,0); g.add(m); }
  shadowify(g); g.userData.amt=amt; return g;
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

/* ============ game state ============ */
const S = {
  started:false, over:false, time:0,
  min:150, gas:0, supplyUsed:0, supplyMax:11,
  ents:[], projs:[], parts:[],
  selected:new Set(), attackMode:false, placeType:null, ghost:null, ghostOk:false,
  enemyTimer:60, wave:0, gasTick:0, idc:1,
};
const COST = {
  scv:{min:50,gas:0,sup:1,time:8}, marine:{min:50,gas:0,sup:1,time:9},
  depot:{min:100,gas:0,time:12}, barracks:{min:150,gas:0,time:20}, turret:{min:100,gas:25,time:14},
};
const STATS = {
  scv:{hp:60,speed:11,sight:14,dmg:4,range:1.8,cd:1.0,name:'SCV',face:'🚜'},
  marine:{hp:55,speed:9.5,sight:19,dmg:7,range:11,cd:0.7,name:'Marine',face:'🔫'},
  zergling:{hp:42,speed:11.5,sight:17,dmg:6,range:1.9,cd:0.8,name:'Zergling',face:'🦂'},
  hydra:{hp:75,speed:8.5,sight:20,dmg:8,range:10,cd:1.0,name:'Hydralisk',face:'🐍'},
  cc:{hp:1300,name:'Command Center',face:'🏠',size:4.6,supply:11},
  barracks:{hp:700,name:'Barracks',face:'🏭',size:3.8},
  depot:{hp:420,name:'Supply Depot',face:'📦',size:2.6,supply:8},
  turret:{hp:380,name:'Missile Turret',face:'🗼',size:1.8,sight:16,dmg:9,range:14,cd:0.9},
  mineral:{hp:1500,name:'Mineral Field',face:'💎'},
  geyser:{hp:1e9,name:'Vespene Geyser',face:'🟢'},
};
const BUILD_SIZE = {depot:2.6, barracks:3.8, turret:1.8};

function addHpBar(e,y){
  const g=new THREE.Group();
  const bg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.28),new THREE.MeshBasicMaterial({color:0x101418,depthTest:false,transparent:true}));
  const fg=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.28),new THREE.MeshBasicMaterial({color:0x39ff70,depthTest:false,transparent:true}));
  fg.position.z=0.001; g.add(bg,fg); g.position.y=y; g.renderOrder=99;
  bg.renderOrder=fg.renderOrder=99; e.mesh.add(g); e.barFg=fg; e.bar=g;
}
function spawnEnt(kind,team,x,z,opts={}){
  const st=STATS[kind];
  const e={ id:S.idc++, kind, team, x, z, y:0, hp:st.hp, maxHp:st.hp,
    order:null, cool:0, mineT:0, carry:0, carryType:null, prog:opts.prog??1,
    queue:[], rally:null, buildT:0, vx:0, vz:0, harvestPhase:0 };
  let m;
  if(kind==='scv')m=makeSCV(team); else if(kind==='marine')m=makeMarine(team);
  else if(kind==='zergling')m=makeZergling(team); else if(kind==='hydra')m=makeHydra(team);
  else if(kind==='cc')m=makeCC(team); else if(kind==='barracks')m=makeBarracks(team);
  else if(kind==='depot')m=makeDepot(team); else if(kind==='turret')m=makeTurret(team);
  else if(kind==='mineral')m=makeMineral(); else if(kind==='geyser')m=makeGeyser();
  e.mesh=m; m.position.set(x,0,z);
  m.traverse(o=>{o.userData.root=e;});
  m.userData.root=e;
  if(kind==='mineral'){ e.amt=1500; }
  if(kind==='turret'||kind==='marine'||kind==='hydra'||kind==='scv'||kind==='zergling') addHpBar(e, kind==='scv'?2.2:2.6);
  if(kind==='cc'||kind==='barracks'||kind==='depot'||kind==='turret'){ addHpBar(e, kind==='cc'?8.4:kind==='barracks'?4.4:3.4); e.isBuilding=true; }
  if(kind==='mineral'||kind==='geyser') e.isResource=true;
  scene.add(m); S.ents.push(e); return e;
}
function isUnit(e){ return ['scv','marine','zergling','hydra'].includes(e.kind); }
function isCombat(e){ return ['marine','zergling','hydra','turret','scv'].includes(e.kind); }
function alive(e){ return e.hp>0 && !e.dead; }
function enemiesOf(e){ return S.ents.filter(o=>o.team!==e.team && alive(o) && !o.isResource && (isUnit(o)||o.isBuilding)); }

/* ---- map setup ---- */
let playerCC, enemyCC;
function mineralLine(cx,cz,dx,dz,team){
  for(let i=0;i<7;i++) spawnEnt('mineral',null,cx+dx*i*2.6,cz+dz*i*1.2);
  spawnEnt('geyser',null,cx-dx*6,cz-dz*6+4);
  spawnEnt('geyser',null,cx-dx*6,cz-dz*6-4);
}
function setupWorld(){
  playerCC=spawnEnt('cc','player',-HALF*0.55,-HALF*0.55);
  spawnEnt('depot','player',-HALF*0.55+8,-HALF*0.55+2);
  for(let i=0;i<4;i++) spawnEnt('scv','player',-HALF*0.55-4+i*2.4,-HALF*0.55+7);
  for(let i=0;i<2;i++) spawnEnt('marine','player',-HALF*0.55+4+i*2.4,-HALF*0.55+8);
  mineralLine(-HALF*0.55-13,-HALF*0.55+2,-0.4,1,'player');
  enemyCC=spawnEnt('cc','enemy',HALF*0.55,HALF*0.55);
  spawnEnt('turret','enemy',HALF*0.55-7,HALF*0.55-2);
  spawnEnt('turret','enemy',HALF*0.55+3,HALF*0.55-7);
  for(let i=0;i<5;i++) spawnEnt('zergling','enemy',HALF*0.55-4+i*2,HALF*0.55-9);
  for(let i=0;i<3;i++) spawnEnt('hydra','enemy',HALF*0.55+5,HALF*0.55+2-i*2.5);
  for(let i=0;i<3;i++) spawnEnt('scv','enemy',HALF*0.55+3,HALF*0.55+5+i*2);
  mineralLine(HALF*0.55+13,HALF*0.55-2,0.4,-1,'enemy');
  recalcSupply();
}
function recalcSupply(){
  let used=0,max=0;
  for(const e of S.ents){ if(!alive(e)||e.team!=='player') continue;
    if(e.kind==='scv'||e.kind==='marine') used+=1;
    if(STATS[e.kind]?.supply && e.prog>=1) max+=STATS[e.kind].supply;
  }
  S.supplyUsed=used; S.supplyMax=max;
}

/* ============ selection ============ */
const ray=new THREE.Raycaster(), ptr=new THREE.Vector2();
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
function selectOnly(list, additive=false){
  if(!additive) S.selected.clear();
  for(const e of list) if(alive(e) && (e.team==='player'||e.isResource)) S.selected.add(e);
  if([...S.selected].every(e=>e.isResource)) { /* allow worker target preview */ }
  AudioSys.select(); refreshPanel();
}
function clearPlacement(){ S.placeType=null; if(S.ghost){scene.remove(S.ghost);S.ghost=null;} }

/* ============ orders ============ */
function orderSelection(wx,wz,target){
  const sel=[...S.selected].filter(e=>alive(e)&&e.team==='player'&&isUnit(e));
  if(!sel.length){
    // rally point for production buildings
    const blds=[...S.selected].filter(e=>alive(e)&&e.isBuilding&&(e.kind==='cc'||e.kind==='barracks'));
    if(blds.length){ for(const b of blds) b.rally={x:wx,z:wz}; toast('Rally point set'); }
    return;
  }
  AudioSys.ensure();
  if(S.placeType) return;
  for(const u of sel){
    if(target && target.team && target.team!=='player' && !target.isResource){
      u.order={type:'attack',target}; AudioSys.attack();
    } else if(target && target.isResource && u.kind==='scv' && target.kind==='mineral' && target.amt>0){
      u.order={type:'harvest',node:target}; u.carry=0; u.harvestPhase=0; AudioSys.move();
    } else if(target && target.isResource && u.kind==='scv' && target.kind==='geyser'){
      u.order={type:'gas',node:target}; u.carry=0; u.harvestPhase=0; AudioSys.move();
    } else if(target && target.team==='player' && target.isBuilding && u.kind==='scv' && u.carry>0){
      u.order={type:'return',cc:target}; AudioSys.move();
    } else if(S.attackMode){
      u.order={type:'attackmove',x:wx,z:wz}; AudioSys.attack();
    } else {
      // scv carrying auto-return if clicked on own CC handled above; else move
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
  e.hp-=amt;
  if(e.hp<=0){ e.hp=0; e.dead=true; killEnt(e); }
}
function killEnt(e){
  S.selected.delete(e);
  scene.remove(e.mesh);
  S.ents.splice(S.ents.indexOf(e),1);
  explode(e.x,e.z,e.isBuilding);
  if(e.team==='player') recalcSupply();
  if(e.isBuilding){
    toast((e.team==='player'?'Lost ':'Destroyed ')+STATS[e.kind].name, e.team==='player');
    if(e.team==='player') recalcSupply();
  }
  checkEnd(); refreshPanel();
}
function checkEnd(){
  if(S.over||!S.started) return;
  const pe=S.ents.some(e=>e.team==='player'&&e.isBuilding&&alive(e));
  const ee=S.ents.some(e=>e.team==='enemy'&&e.isBuilding&&alive(e));
  if(!ee) endGame(true); else if(!pe) endGame(false);
}
function endGame(win){
  S.over=true;
  $('end-title').textContent=win?'VICTORY':'DEFEAT';
  $('end-title').style.color=win?'#7dff9b':'#ff6b78';
  $('end-sub').textContent=win?`Zerg hive clusters destroyed in ${fmtTime(S.time)}. The valley is yours, Commander.`
    :`Your base has fallen on wave ${S.wave}. The swarm consumes all. Try turrets + mass marines.`;
  $('endcard').classList.remove('hidden');
  (win?AudioSys.train:AudioSys.boom).call(AudioSys);
}

/* ============ unit sim ============ */
const tmpV=new THREE.Vector3();
function dist2(ax,az,bx,bz){ const dx=ax-bx,dz=az-bz; return Math.hypot(dx,dz); }
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
    // separation
    for(const o of S.ents){ if(o===e||!alive(o)||!isUnit(o)) continue;
      const dd=dist2(e.x,e.z,o.x,o.z); if(dd<1.6&&dd>0.001){ vx+=(e.x-o.x)/dd*3; vz+=(e.z-o.z)/dd*3; } }
    // building push-out
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
        const a=new THREE.Vector3(e.x,1.6,e.z), b=new THREE.Vector3(t.x,(t.isBuilding?2.5:1.2),t.z);
        tracer(a,b,e.team==='player'?0x7fe7ff:0xff7f7f); AudioSys.shoot();
        setTimeout(()=>{ if(alive(t)) damage(t,st.dmg); },90);
      } return true; }
    if(chase) moveToward(t.x,t.z); return true;
  };
  const acquire=(sight=st.sight||16)=>{
    let best=null,bd=sight;
    for(const o of S.ents){ if(o.team===e.team||!alive(o)||o.isResource) continue;
      if(!isUnit(o)&&!o.isBuilding) continue;
      const d=dist2(e.x,e.z,o.x,o.z); if(d<bd){bd=d;best=o;} }
    return best;
  };
  const o=e.order;
  if(e.kind==='scv'){
    if(e.carry>0 && (!o||o.type==='harvest'||o.type==='gas'||o.type==='move')){
      // auto return when full handled in harvest; if idle with carry, go deposit
      if(!o||o.type==='move'&&e.carry>0){ const cc=nearestCC(e.team,e.x,e.z);
        if(cc){ e.order={type:'return',cc}; } }
    }
  }
  if(!o){
    if(e.team==='enemy'&&isCombat(e)){ const t=acquire(); if(t) tryFire(t,true); }
    else if(isCombat(e)){ const t=acquire(); if(t) tryFire(t,false); } // hold ground, full-sight self-defense
    else if(e.kind==='scv'&&e.team==='enemy'){ // enemy worker wander/mine visual
      if(Math.random()<0.005){ e.wx=e.x+(Math.random()-0.5)*20; e.wz=e.z+(Math.random()-0.5)*20; }
      if(e.wx!==undefined) moveToward(e.wx,e.wz,5);
    }
    return;
  }
  if(o.type==='move'){ if(moveToward(o.x,o.z)) e.order=null; else { const t=acquire(6); if(t&&isCombat(e)) tryFire(t); } }
  else if(o.type==='attackmove'){ const t=acquire(); if(t) tryFire(t); else if(moveToward(o.x,o.z)) e.order=null; }
  else if(o.type==='attack'){ if(!alive(o.target)){ e.order=null; return; } tryFire(o.target); }
  else if(o.type==='harvest'){
    const n=o.node;
    if(!alive(n)||n.amt<=0){ e.order=null; return; }
    if(dist2(e.x,e.z,n.x,n.z)>3){ moveToward(n.x,n.z); }
    else { e.mineT+=dt; e.mesh.rotation.y+=dt*4;
      if(e.mineT>1.6){ e.mineT=0; e.carry=8; e.carryType='min'; n.amt-=8; AudioSys.mine();
        if(n.amt<=0){ scene.remove(n.mesh); S.ents.splice(S.ents.indexOf(n),1); toast('Mineral field depleted'); }
        const cc=nearestCC(e.team,e.x,e.z); e.order=cc?{type:'return',cc}:{type:'move',x:e.x,z:e.z}; } }
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
    else { if(e.carry>0){ if(e.carryType==='gas'){S.gas+=e.carry;} else {S.min+=e.carry;} AudioSys.train(); e.carry=0; }
      // resume harvesting
      e.order=null; }
  }
  else if(o.type==='build'){
    if(dist2(e.x,e.z,o.x,o.z)>BUILD_SIZE[o.what]+1.5){ moveToward(o.x,o.z); }
    else { o.t=(o.t||0)+dt; e.mesh.rotation.y+=dt*6;
      if(o.t>= (COST[o.what].time*0.4)){ // construction done -> spawn building
        spawnEnt(o.what,e.team,o.x,o.z,{prog:0.15}).prog=0.15;
        const b=S.ents[S.ents.length-1]; b.prog=0.15; b.builder=e;
        e.order={type:'construct',site:b}; recalcSupply(); AudioSys.build();
      } }
  }
  else if(o.type==='construct'){
    const b=o.site;
    if(!alive(b)){ e.order=null; return; }
    if(b.prog>=1){ e.order=null; return; }
    b.prog+=dt/COST[b.kind].time; b.hp=Math.min(b.maxHp,b.maxHp*b.prog+50);
    e.mesh.rotation.y+=dt*5;
    if(b.prog>=1){ b.prog=1; b.hp=b.maxHp; toast(STATS[b.kind].name+' online'); recalcSupply(); e.order=null; AudioSys.train(); refreshPanel(); }
  }
}
function stepBuilding(e,dt){
  const st=STATS[e.kind];
  if(e.prog<1) return;
  if(e.queue.length){
    const q=e.queue[0]; q.t+=dt;
    if(q.t>=q.need){ e.queue.shift();
      const a=Math.atan2((e.rally?.x??e.x)-e.x,(e.rally?.z??e.z)-e.z);
      const u=spawnEnt(q.kind,e.team,e.x+Math.sin(a)*6,e.z+Math.cos(a)*6);
      recalcSupply();
      if(e.rally) u.order={type:'move',x:e.rally.x+ (Math.random()-0.5)*4,z:e.rally.z+(Math.random()-0.5)*4};
      else u.order={type:'move',x:e.x+(Math.random()-0.5)*10,z:e.z+6+(Math.random()-0.5)*6};
      toast(STATS[q.kind].name+' ready'); AudioSys.train(); refreshPanel();
    }
  }
  if(e.kind==='turret'){ e.cool=(e.cool||0)-dt;
    let best=null,bd=st.sight;
    for(const o of S.ents){ if(o.team===e.team||!alive(o)||o.isResource||(!isUnit(o))) continue;
      const d=dist2(e.x,e.z,o.x,o.z); if(d<bd){bd=d;best=o;} }
    if(best&&e.cool<=0){ e.cool=st.cd;
      tracer(new THREE.Vector3(e.x,2.2,e.z),new THREE.Vector3(best.x,1.2,best.z),0xffe27f);
      AudioSys.shoot(); setTimeout(()=>alive(best)&&damage(best,st.dmg),100); }
  }
}

/* ============ enemy AI / income ============ */
function enemyAI(dt){
  S.enemyTimer-=dt;
  // trickle income so AI keeps pressure
  if(Math.random()<dt*0.5) { /* virtual */ }
  const zlings=S.ents.filter(e=>e.team==='enemy'&&e.kind==='zergling'&&alive(e)).length;
  const hydras=S.ents.filter(e=>e.team==='enemy'&&e.kind==='hydra'&&alive(e)).length;
  if(S.enemyTimer<=0){
    S.enemyTimer=50; S.wave++;
    const n=2+Math.min(8,S.wave);
    for(let i=0;i<n;i++) spawnEnt('zergling','enemy',enemyCC.x+(Math.random()-0.5)*8,enemyCC.z-6-Math.random()*4);
    if(S.wave>=2) spawnEnt('hydra','enemy',enemyCC.x+5,enemyCC.z-6);
    // send wave
    const army=S.ents.filter(e=>e.team==='enemy'&&alive(e)&&(e.kind==='zergling'||e.kind==='hydra')&&!e.order);
    for(const u of army) u.order={type:'attackmove',x:playerCC.x+(Math.random()-0.5)*10,z:playerCC.z+(Math.random()-0.5)*10};
    toast(`⚠ Zerg wave ${S.wave} inbound (${army.length} hostiles)`,true); AudioSys.attack();
  } else if(zlings+hydras<6 && Math.random()<dt*0.08){
    spawnEnt(Math.random()<0.7?'zergling':'hydra','enemy',enemyCC.x+(Math.random()-0.5)*8,enemyCC.z-7);
  }
  // guards hold near the hive until a wave sends them (no idle trickle)
}

/* ============ HUD / command card ============ */
const ICON={scv:'🚜',marine:'🔫',cc:'🏠',barracks:'🏭',depot:'📦',turret:'🗼',mineral:'💎',geyser:'🟢',zergling:'🦂',hydra:'🐍'};
function fmtTime(t){ const m=Math.floor(t/60),s=Math.floor(t%60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function canAfford(c){ return S.min>=c.min && S.gas>=(c.gas||0); }
function cmdBtn(parent,{icon,label,sub,key,disabled,fn}){
  const b=document.createElement('button'); b.className='cmd'; b.disabled=!!disabled;
  b.innerHTML=`<span class="k">${key||''}</span><span class="e">${icon}</span>${label}<small>${sub||''}</small>`;
  b.onclick=ev=>{ev.stopPropagation();AudioSys.ensure();fn&&fn();}; parent.appendChild(b); return b;
}
function train(kind,from){
  const c=COST[kind];
  if(S.supplyUsed>=S.supplyMax){toast('Additional Supply Depots required',true);AudioSys.error();return;}
  if(!canAfford(c)){toast('Not enough minerals',true);AudioSys.error();return;}
  S.min-=c.min;S.gas-=c.gas;S.supplyUsed+=c.sup;
  from.queue.push({kind,t:c.time,need:c.time});
  AudioSys.train(); refreshPanel();
}
function startPlacement(what){
  const w=[...S.selected].some(e=>alive(e)&&e.kind==='scv'&&e.team==='player');
  if(!w){toast('Select an SCV first',true);AudioSys.error();return;}
  S.placeType=what; S.attackMode=false;
  if(S.ghost) scene.remove(S.ghost);
  const g=new THREE.Group();
  const s=BUILD_SIZE[what];
  const box=new THREE.Mesh(new THREE.BoxGeometry(s*2,2,s*2),
    new THREE.MeshBasicMaterial({color:0x54ff9f,transparent:true,opacity:0.4}));
  box.position.y=1; g.add(box); S.ghost=g; S.ghostOk=false; scene.add(g);
  toast(`Placing ${STATS[what].name} — click ground, right-click cancels`);
}
function tryPlace(wx,wz){
  const what=S.placeType, c=COST[what];
  if(!canAfford(c)){toast('Not enough resources',true);AudioSys.error();return;}
  if(Math.abs(wx)>HALF-4||Math.abs(wz)>HALF-4){toast('Cannot build off-map',true);AudioSys.error();return;}
  for(const e of S.ents){ if(e.isBuilding&&alive(e)){ const r=(STATS[e.kind].size||3)+BUILD_SIZE[what];
      if(dist2(wx,wz,e.x,e.z)<r){toast('Too close to another structure',true);AudioSys.error();return;} }
    if(e.isResource&&dist2(wx,wz,e.x,e.z)<5){toast('Blocked by resources',true);AudioSys.error();return;} }
  S.min-=c.min;S.gas-=c.gas;
  const scvs=[...S.selected].filter(e=>alive(e)&&e.kind==='scv'&&e.team==='player');
  const w=scvs[0];
  if(w){ w.order={type:'build',x:wx,z:wz,what}; S.selected.clear(); S.selected.add(w); }
  clearPlacement(); AudioSys.build(); refreshPanel();
}
function refreshPanel(){
  const cmds=$('commands'); cmds.innerHTML='';
  const sel=[...S.selected].filter(alive);
  const info=$('sel-info');
  if(!sel.length){ info.innerHTML='<b>No selection</b><span>Drag to box-select. Right-click to order.</span>';
    $('portrait-face').textContent='🛸';
    cmdBtn(cmds,{icon:'🚜',label:'Select workers',key:'',fn:()=>{ const w=S.ents.filter(e=>e.team==='player'&&e.kind==='scv'&&alive(e)); selectOnly(w); }});
    cmdBtn(cmds,{icon:'⚔️',label:'Select army',fn:()=>{ selectOnly(S.ents.filter(e=>e.team==='player'&&e.kind==='marine'&&alive(e))); }});
    cmdBtn(cmds,{icon:'🏠',label:'Go to base',key:'C',fn:resetCam});
    cmdBtn(cmds,{icon:'❓',label:'Help',key:'H',fn:()=>$('help').classList.remove('hidden')});
    return;
  }
  const kinds=[...new Set(sel.map(e=>e.kind))];
  $('portrait-face').textContent=ICON[sel[0].kind]||'🛸';
  const hpAvg=sel.reduce((a,e)=>a+e.hp/e.maxHp,0)/sel.length;
  info.innerHTML=`<b>${sel.length>1?sel.length+' units':STATS[sel[0].kind].name}${sel[0].team==='enemy'?' (enemy)':''}</b>
    <span>${kinds.join(' · ')}</span><div id="sel-hp"><i style="width:${Math.round(hpAvg*100)}%"></i></div>`;
  const mine=sel.filter(e=>e.team==='player');
  if(!mine.length){ info.querySelector('span').textContent='Hostile — right-click with army to focus fire'; return; }
  const hasSCV=mine.some(e=>e.kind==='scv'), hasMar=mine.some(e=>e.kind==='marine');
  const cc=sel.find(e=>e.kind==='cc'&&e.team==='player'), rax=sel.find(e=>e.kind==='barracks'&&e.team==='player');
  if(cc&&sel.length===1){
    const q=cc.queue[0];
    cmdBtn(cmds,{icon:'🚜',label:'Train SCV',sub:`50⛏ · ${q&&q.kind==='scv'?Math.round(q.t/q.need*100)+'%':'Q'}`,key:'Q',
      disabled:!canAfford(COST.scv)||S.supplyUsed>=S.supplyMax,fn:()=>train('scv',cc)});
    cmdBtn(cmds,{icon:'🚩',label:'Rally',sub:'right-click map',fn:()=>toast('Select CC, then right-click map')});
  }
  if(rax&&sel.length===1){
    const q=rax.queue[0];
    cmdBtn(cmds,{icon:'🔫',label:'Train Marine',sub:`50⛏ · ${q?Math.round(q.t/q.need*100)+'%':'Q'}`,key:'Q',
      disabled:!canAfford(COST.marine)||S.supplyUsed>=S.supplyMax,fn:()=>train('marine',rax)});
  }
  if(hasSCV){
    cmdBtn(cmds,{icon:'📦',label:'Depot',sub:'100⛏ +8 B',key:'B',disabled:!canAfford(COST.depot),fn:()=>startPlacement('depot')});
    cmdBtn(cmds,{icon:'🏭',label:'Barracks',sub:'150⛏ E',key:'E',disabled:!canAfford(COST.barracks),fn:()=>startPlacement('barracks')});
    cmdBtn(cmds,{icon:'🗼',label:'Turret',sub:'100⛏ 25💧 R',key:'R',disabled:!canAfford(COST.turret),fn:()=>startPlacement('turret')});
  }
  if(hasMar||hasSCV){
    cmdBtn(cmds,{icon:'⚔️',label:S.attackMode?'Attack…':'Attack',sub:'A + click',key:'A',fn:()=>{
      S.attackMode=true;clearPlacementGhostOnly();document.body.style.cursor='crosshair';toast('Attack-move: click target');}});
    cmdBtn(cmds,{icon:'✋',label:'Stop',sub:'S',key:'S',fn:()=>{ for(const u of mine) if(isUnit(u)) u.order=null; }});
  }
  if(!cmds.children.length) cmdBtn(cmds,{icon:'⚔️',label:'Attack',sub:'A',key:'A',fn:()=>{S.attackMode=true;}});
}
function clearPlacementGhostOnly(){ if(S.ghost){scene.remove(S.ghost);S.ghost=null;} }

/* ============ input ============ */
let ldown=false,lstart=null,rmbPan=null;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{
  AudioSys.ensure();
  if(e.button===2){
    if(S.placeType){clearPlacement();refreshPanel();return;}
    const p=groundAt(e.clientX,e.clientY);
    if(p){ const t=pickAt(e.clientX,e.clientY);
      const tgt=(t&&!t.isResource&&(t.team!=='player'||(t.isBuilding&&[...S.selected].some(s=>s.kind==='scv'&&s.carry>0))))?t
        :(t&&t.isResource?t:null);
      orderSelection(p.x,p.z,tgt); refreshPanel(); }
    return;
  }
  if(e.button===1){ rmbPan={x:e.clientX,y:e.clientY,tx:cam.tx,tz:cam.tz}; return; }
  if(e.button===0){
    if(S.placeType){ const p=groundAt(e.clientX,e.clientY); if(p) tryPlace(p.x,p.z); return; }
    if(S.attackMode){ const p=groundAt(e.clientX,e.clientY); if(p){ const t=pickAt(e.clientX,e.clientY);
        orderSelection(p.x,p.z,t||{team:'enemy',x:p.x,z:p.z}); refreshPanel(); } return; }
    ldown=true; lstart={x:e.clientX,y:e.clientY};
  }
});
canvas.addEventListener('pointermove',e=>{
  if(rmbPan){ const dx=(e.clientX-rmbPan.x),dz=(e.clientY-rmbPan.y);
    const c=Math.cos(cam.yaw),s=Math.sin(cam.yaw),k=cam.dist/600;
    cam.tx=rmbPan.tx-dx*k*c; cam.tz=rmbPan.tz-dx*k*s+dz*k; clampCam(); return; }
  // edge pan handled in loop
  if(lstart && (Math.abs(e.clientX-lstart.x)>6||Math.abs(e.clientY-lstart.y)>6)){
    Object.assign(dragbox.style,{left:Math.min(lstart.x,e.clientX)+'px',top:Math.min(lstart.y,e.clientY)+'px',
      width:Math.abs(e.clientX-lstart.x)+'px',height:Math.abs(e.clientY-lstart.y)+'px'});
    dragbox.classList.remove('hidden');
  }
  if(S.placeType||S.ghost){ const p=groundAt(e.clientX,e.clientY); if(p&&S.ghost) S.ghost.position.set(p.x,0,p.z); }
});
canvas.addEventListener('pointerup',e=>{
  if(e.button===1){rmbPan=null;return;}
  if(e.button!==0) return;
  if(!lstart){ldown=false;return;}
  const wasDrag=!dragbox.classList.contains('hidden');
  dragbox.classList.add('hidden');
  if(wasDrag){
    const x0=Math.min(lstart.x,e.clientX),x1=Math.max(lstart.x,e.clientX);
    const y0=Math.min(lstart.y,e.clientY),y1=Math.max(lstart.y,e.clientY);
    const got=S.ents.filter(en=>{ if(!alive(en)||(en.team!=='player'&&!en.isResource)) return false;
      if(en.isResource) return false;
      tmpV.set(en.x,(en.isBuilding?2:1),en.z).project(camera);
      const sx=(tmpV.x+1)/2*innerWidth, sy=(1-tmpV.y)/2*innerHeight;
      return sx>x0&&sx<x1&&sy>y0&&sy<y1; });
    selectOnly(got,e.shiftKey);
  } else {
    const t=pickAt(e.clientX,e.clientY);
    if(t&&(t.team==='player'||t.isResource)) selectOnly([t],e.shiftKey);
    else if(!e.shiftKey){ S.selected.clear(); refreshPanel(); }
  }
  ldown=false;lstart=null;
});
canvas.addEventListener('wheel',e=>{ cam.dist=Math.max(22,Math.min(110,cam.dist+e.deltaY*0.05)); },{passive:true});
const keys={};
addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT') return;
  keys[e.key.toLowerCase()]=true;
  const k=e.key.toLowerCase();
  if(k==='escape'){ S.attackMode=false;clearPlacement();document.body.style.cursor='crosshair';refreshPanel(); }
  if(k==='a'&&S.started){ S.attackMode=true;clearPlacementGhostOnly();document.body.style.cursor='cell';toast('Attack-move: left-click target'); }
  if(k==='s'){ for(const u of S.selected) if(isUnit(u)&&u.team==='player') u.order=null; }
  if(k==='q'){ const cc=[...S.selected].find(e=>e.kind==='cc'&&e.team==='player');
    const rax=[...S.selected].find(e=>e.kind==='barracks'&&e.team==='player');
    if(cc) train('scv',cc); else if(rax) train('marine',rax); }
  if(k==='b') startPlacement('depot');
  if(k==='e') startPlacement('barracks');
  if(k==='r') startPlacement('turret');
  if(k==='h') $('help').classList.toggle('hidden');
  if(k==='m') toggleMute();
  if(k==='c') resetCam();
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
function clampCam(){ cam.tx=Math.max(-HALF-10,Math.min(HALF+10,cam.tx)); cam.tz=Math.max(-HALF-10,Math.min(HALF+10,cam.tz)); }
function resetCam(){ cam.tx=playerCC.x;cam.tz=playerCC.z+6;cam.yaw=Math.PI*0.25;cam.dist=62; }
function toggleMute(){ AudioSys.muted=!AudioSys.muted; $('btn-mute').textContent=AudioSys.muted?'✕':'♪'; }
$('btn-mute').onclick=toggleMute;
$('btn-cam').onclick=resetCam;
$('btn-help').onclick=()=>$('help').classList.remove('hidden');
$('btn-close-help').onclick=()=>$('help').classList.add('hidden');
$('btn-start').onclick=()=>{ AudioSys.ensure(); S.started=true; resetCam(); $('menu').classList.add('hidden');
  toast('Mine minerals · Build barracks · Destroy the red base'); AudioSys.train(); };
$('btn-restart').onclick=()=>location.reload();
mm.addEventListener('pointerdown',e=>{
  const r=mm.getBoundingClientRect();
  const wx=((e.clientX-r.left)/r.width*2-1)*(HALF+5), wz=((e.clientY-r.top)/r.height*2-1)*(HALF+5);
  cam.tx=wx;cam.tz=wz;clampCam();
});

/* ============ minimap ============ */
let mmT=0;
function drawMinimap(){
  const W=mm.width,H=mm.height,sx=W/(WORLD+10),sz=H/(WORLD+10);
  const X=x=>(x+HALF+5)*sx, Z=z=>(z+HALF+5)*sz;
  mmc.fillStyle='#06121f';mmc.fillRect(0,0,W,H);
  mmc.strokeStyle='rgba(90,200,255,.4)';mmc.strokeRect(1,1,W-2,H-2);
  for(const e of S.ents){ if(!alive(e)) continue;
    if(e.isResource){ mmc.fillStyle=e.kind==='mineral'?'#54d8ff':'#51ff7a'; mmc.fillRect(X(e.x)-1,Z(e.z)-1,2,2); }
    else if(e.isBuilding){ mmc.fillStyle=e.team==='player'?'#2fa9f5':'#ff4658'; const s=e.kind==='cc'?7:5;
      mmc.fillRect(X(e.x)-s/2,Z(e.z)-s/2,s,s); }
    else { mmc.fillStyle=e.team==='player'?'#9fe7ff':'#ff9aa5'; mmc.beginPath();mmc.arc(X(e.x),Z(e.z),e.kind==='scv'?1.4:1.8,0,7);mmc.fill(); } }
  // camera rect approx
  mmc.strokeStyle='#fff';mmc.lineWidth=1;
  const cw=26*sx*(cam.dist/62),ch=18*sz*(cam.dist/62);
  mmc.strokeRect(X(cam.tx)-cw/2,Z(cam.tz)-ch/2,cw,ch);
}

/* ============ main loop ============ */
const clock=new THREE.Clock();
let attract=0;
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(0.05,clock.getDelta());
  if(S.started&&!S.over){
    S.time+=dt;
    for(const e of [...S.ents]){ if(!alive(e)) continue;
      if(isUnit(e)) stepUnit(e,dt); else if(e.isBuilding) stepBuilding(e,dt); }
    enemyAI(dt);
    S.gasTick+=dt; if(S.gasTick>12){S.gasTick=0;S.gas+=4;} // refinery trickle
    // projectiles cleanup handled by parts; bars face camera
  } else if(!S.started){
    attract+=dt; cam.yaw+=dt*0.05;
    cam.tx=Math.sin(attract*0.1)*10; cam.tz=Math.cos(attract*0.1)*10;
  }
  // camera keys (arrows) + edge pan. WASD/Q/E reserved for game hotkeys; Z/X rotate.
  if(S.started){
    const sp=cam.dist*dt*0.9, c=Math.cos(cam.yaw),s=Math.sin(cam.yaw);
    let mx=0,mz=0;
    if(keys['arrowup']){mx-=s;mz-=c;} if(keys['arrowdown']){mx+=s;mz+=c;}
    if(keys['arrowleft']){mx-=c;mz+=s;} if(keys['arrowright']){mx+=c;mz-=s;}
    if(keys['z']){cam.yaw+=dt*1.2;} if(keys['x']){cam.yaw-=dt*1.2;}
    cam.tx+=mx*sp; cam.tz+=mz*sp;
    // edge pan (skip while drag-selecting)
    if(!ldown){ const m=16, e2=cam.dist*dt*0.9;
      if(mouse.x<m){cam.tx-=e2*c;cam.tz-=e2*s;} if(mouse.x>innerWidth-m){cam.tx+=e2*c;cam.tz+=e2*s;}
      if(mouse.y<m+30){cam.tx-=e2*s;cam.tz-=e2*c;} if(mouse.y>innerHeight-m){cam.tx+=e2*s;cam.tz+=e2*c;} }
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
  // bars + beacons + geysers
  for(const e of S.ents){ if(e.bar&&alive(e)){ e.bar.quaternion.copy(camera.quaternion);
      const f=Math.max(0,e.hp/e.maxHp); e.barFg.scale.x=f; e.barFg.position.x=-(1-f)*1.1;
      e.barFg.material.color.setHex(f>0.6?0x39ff70:f>0.3?0xffc93d:0xff4d5e);
      e.bar.visible=f<0.999; }
    if(e.kind==='cc'){ const b=e.mesh.getObjectByName('beacon'); if(b) b.position.y=7.3+Math.sin(S.time*3+e.id)*0.2; }
    if(e.kind==='geyser'){ const p=e.mesh.getObjectByName('plume'); if(p){p.rotation.y+=dt; p.scale.x=1+Math.sin(S.time*4+e.id)*0.06;} } }
  // HUD numbers @10Hz
  hudT+=dt; if(hudT>0.1){ hudT=0;
    $('r-min').textContent=Math.floor(S.min); $('r-gas').textContent=Math.floor(S.gas);
    $('r-sup').textContent=`${S.supplyUsed}/${S.supplyMax}`; $('r-time').textContent=fmtTime(S.time);
    mmT+=0.1; drawMinimap();
  }
  // sync logical positions to meshes (+ walk bob)
  for(const e of S.ents){ if(isUnit(e)&&alive(e)){
      const dx=e.x-e.mesh.position.x, dz=e.z-e.mesh.position.z;
      if(dx*dx+dz*dz>0.000001){ e.bobT=(e.bobT||0)+dt; }
      e.mesh.position.set(e.x, (e.bobT!==undefined&&dx*dx+dz*dz>0.000001)?Math.abs(Math.sin(e.bobT*12))*0.12 : 0, e.z);
    } }
  renderer.render(scene,camera);
}
let hudT=0; const mouse={x:innerWidth/2,y:innerHeight/2};
addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight); });

/* boot */
setupWorld();
resetCam();
refreshPanel();
drawMinimap();
animate();
window.__game=S;
