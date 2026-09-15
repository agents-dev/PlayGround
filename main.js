import * as THREE from 'three';

/* ============ STARCRAFT 3D : pocket RTS ============ */
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
window.__rendererType = renderer.constructor.name + ' / ' + renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040a);
scene.fog = new THREE.Fog(0x02040a, 90, 260);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
// RTS camera rig
const camTarget = new THREE.Vector3(0, 0, 24);
let camDist = 68, camYaw = 0, camPitch = 0.88;

function updateCamera(){
  const x = camTarget.x + camDist * Math.cos(camPitch) * Math.sin(camYaw);
  const z = camTarget.z + camDist * Math.cos(camPitch) * Math.cos(camYaw);
  const y = camTarget.y + camDist * Math.sin(camPitch);
  camera.position.set(x, y, z);
  camera.lookAt(camTarget.x, 0, camTarget.z);
}
updateCamera();

// Lights
scene.add(new THREE.HemisphereLight(0x8db8ff, 0x0a1420, 0.9));
const sun = new THREE.DirectionalLight(0xfff2d8, 1.6);
sun.position.set(40, 70, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left=-80; sun.shadow.camera.right=80;
sun.shadow.camera.top=80; sun.shadow.camera.bottom=-80;
scene.add(sun);
const blueRim = new THREE.DirectionalLight(0x35c8ff, 0.7);
blueRim.position.set(-50, 30, -40); scene.add(blueRim);

// Starfield
{
  const g = new THREE.BufferGeometry();
  const N = 1500, pos = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const r = 400+Math.random()*400, t=Math.random()*Math.PI*2, p=Math.random()*Math.PI;
    pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=Math.abs(r*Math.cos(p))*0.6+10; pos[i*3+2]=r*Math.sin(p)*Math.sin(t);
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({color:0xbfd8ff,size:1.6,sizeAttenuation:false,transparent:true,opacity:.8})));
}

// ---------- Terrain ----------
const WORLD = 140;
function groundTexture(){
  const c = document.createElement('canvas'); c.width=c.height=512;
  const x = c.getContext('2d');
  x.fillStyle='#1a2230'; x.fillRect(0,0,512,512);
  // plates
  for(let i=0;i<40;i++){
    x.fillStyle=`rgba(${30+Math.random()*30|0},${40+Math.random()*30|0},${55+Math.random()*30|0},.9)`;
    x.fillRect(Math.random()*512|0, Math.random()*512|0, 40+Math.random()*90, 40+Math.random()*90);
  }
  x.strokeStyle='rgba(53,200,255,.18)'; x.lineWidth=2;
  for(let i=0;i<=8;i++){ x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,512);x.stroke(); x.beginPath();x.moveTo(0,i*64);x.lineTo(512,i*64);x.stroke(); }
  // rust
  for(let i=0;i<300;i++){ x.fillStyle=`rgba(120,70,30,${Math.random()*.25})`; x.fillRect(Math.random()*512,Math.random()*512,3,3); }
  // creep (zerg north)
  const grad = x.createLinearGradient(0,0,0,512);
  grad.addColorStop(0,'rgba(120,20,60,.55)'); grad.addColorStop(.4,'rgba(120,20,60,0)');
  x.fillStyle=grad; x.fillRect(0,0,512,220);
  const t = new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,4);
  return t;
}
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(WORLD, WORLD),
  new THREE.MeshStandardMaterial({ map:groundTexture(), roughness:.9, metalness:.25 })
);
ground.rotation.x = -Math.PI/2; ground.receiveShadow = true;
scene.add(ground);
// border glow
{
  const g = new THREE.EdgesGeometry(new THREE.PlaneGeometry(WORLD,WORLD));
  const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({color:0x35c8ff,transparent:true,opacity:.5}));
  l.rotation.x=-Math.PI/2; l.position.y=.05; scene.add(l);
}
// ramps / plateaus (visual only, flat collision)
function plateau(x,z,w,d,color){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,2,d), new THREE.MeshStandardMaterial({color,roughness:.8,metalness:.3}));
  m.position.set(x,1,z); m.receiveShadow=true; m.castShadow=true; scene.add(m); return m;
}
plateau(0, 42, 46, 30, 0x2a3547);   // terran base slab
plateau(0, -44, 48, 32, 0x3a1f33);  // zerg slab

// ---------- Helpers ----------
function feed(msg, cls=''){
  const el=document.createElement('div'); el.className='feed-item '+cls; el.textContent=msg;
  const f=document.getElementById('feed'); f.appendChild(el);
  while(f.children.length>5) f.firstChild.remove();
  setTimeout(()=>el.remove(), 7000);
}
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.hidden=false; clearTimeout(t._h); t._h=setTimeout(()=>t.hidden=true,2600); }

// ---------- Buildings ----------
const buildings=[];
function addBuilding(mesh, hp, name, team){
  mesh.castShadow=true; mesh.receiveShadow=true;
  mesh.userData={hp, maxHp:hp, name, team, building:true};
  scene.add(mesh); buildings.push(mesh); return mesh;
}
function terranBase(){
  // Command Center
  const g = new THREE.Group();
  const main = new THREE.Mesh(new THREE.BoxGeometry(12,5,9), new THREE.MeshStandardMaterial({color:0x3d5a7a,roughness:.5,metalness:.7}));
  main.position.y=2.5; main.castShadow=true; g.add(main);
  const top = new THREE.Mesh(new THREE.BoxGeometry(8,2,6), new THREE.MeshStandardMaterial({color:0x5a7d9e,metalness:.6,roughness:.4}));
  top.position.y=6; top.castShadow=true; g.add(top);
  const win = new THREE.Mesh(new THREE.BoxGeometry(12.1,1,9.1), new THREE.MeshStandardMaterial({color:0x35c8ff,emissive:0x35c8ff,emissiveIntensity:1.2}));
  win.position.y=4.2; g.add(win);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,7), new THREE.MeshStandardMaterial({color:0xaaaaaa}));
  ant.position.set(3,9,0); g.add(ant);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(.4), new THREE.MeshStandardMaterial({color:0xff4d5e,emissive:0xff0000,emissiveIntensity:2}));
  beacon.position.set(3,12.5,0); beacon.name='beacon'; g.add(beacon);
  g.position.set(-8,2,44); scene.add(g);
  addBuilding(g, 1200, 'Command Center', 'terran');
  // Supply depots
  [[6,44],[14,44]].forEach(([x,z])=>{
    const d = new THREE.Mesh(new THREE.BoxGeometry(5,3,4), new THREE.MeshStandardMaterial({color:0x4a6a8a,metalness:.6,roughness:.4}));
    d.position.set(x,1.5+2,z); scene.add(d); addBuilding(d,300,'Supply Depot','terran');
  });
  // Barracks
  const b = new THREE.Mesh(new THREE.BoxGeometry(10,4,6), new THREE.MeshStandardMaterial({color:0x51606e,metalness:.55,roughness:.5}));
  b.position.set(8,2+2,52); scene.add(b); addBuilding(b,700,'Barracks','terran');
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(10.1,.8,6.1), new THREE.MeshStandardMaterial({color:0xffcf4d,emissive:0xffaa00,emissiveIntensity:.8}));
  stripe.position.set(8,4.4,52); scene.add(stripe);
}
function turret(x,z,team){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.2,2.4,8),new THREE.MeshStandardMaterial({color:team==='terran'?0x44586e:0x5a1f3a,metalness:.6,roughness:.4}));
  base.position.y=1.2; base.castShadow=true; g.add(base);
  const head=new THREE.Group();
  const dome=new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10),new THREE.MeshStandardMaterial({color:0x6a86a0,metalness:.7,roughness:.3}));
  dome.position.y=2.9; head.add(dome);
  const gun=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,3.4),new THREE.MeshStandardMaterial({color:0x111111}));
  gun.rotation.z=Math.PI/2; gun.position.set(1.6,2.9,0); head.add(gun);
  g.add(head); g.position.set(x,2,z); scene.add(g);
  const rec={group:g,head,cool:0,team,range:26,dmg:team==='terran'?14:10};
  addBuilding(g,400, team==='terran'?'Missile Turret':'Spore Colony', team);
  turrets.push(rec); return rec;
}
const turrets=[];
function zergBase(){
  const h = new THREE.Group();
  const flesh = new THREE.Mesh(new THREE.SphereGeometry(6,18,14), new THREE.MeshStandardMaterial({color:0x6a1f4d,roughness:.65,metalness:.1,emissive:0x2a0518,emissiveIntensity:.6}));
  flesh.scale.set(1,.62,1); flesh.position.y=3; flesh.castShadow=true; h.add(flesh);
  for(let i=0;i<7;i++){
    const spike=new THREE.Mesh(new THREE.ConeGeometry(.7,3.4,6),new THREE.MeshStandardMaterial({color:0xd8a0c0,roughness:.5}));
    const a=i/7*Math.PI*2; spike.position.set(Math.cos(a)*4.5,5.5,Math.sin(a)*4.5); spike.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5); h.add(spike);
  }
  const maw=new THREE.Mesh(new THREE.SphereGeometry(1.6),new THREE.MeshStandardMaterial({color:0x59ff7a,emissive:0x11ff55,emissiveIntensity:1.5}));
  maw.position.set(0,3.4,5.2); h.add(maw);
  h.position.set(4,2,-46); scene.add(h);
  addBuilding(h,1400,'Hatchery','zerg');
  const pool=new THREE.Mesh(new THREE.CylinderGeometry(4,4.6,1.6,12),new THREE.MeshStandardMaterial({color:0x4d1030,roughness:.7,emissive:0x550f2a,emissiveIntensity:.5}));
  pool.position.set(-12,2.8,-40); scene.add(pool); addBuilding(pool,500,'Spawning Pool','zerg');
}
terranBase(); zergBase();
turret(-16,44,'terran'); turret(20,50,'terran');
turret(-8,-42,'zerg'); turret(14,-44,'zerg');

// ---------- Resources ----------
const minerals=[];
function crystal(x,z){
  const m=new THREE.Mesh(new THREE.OctahedronGeometry(1.3),new THREE.MeshStandardMaterial({color:0x35c8ff,emissive:0x1899ff,emissiveIntensity:1.4,roughness:.15,metalness:.1,transparent:true,opacity:.95}));
  m.position.set(x,1.2,z); m.castShadow=true;
  m.rotation.set(Math.random(),Math.random(),0);
  m.userData.spin=Math.random()*2+1;
  scene.add(m); minerals.push(m);
}
for(let i=0;i<7;i++){ crystal(-22+i*2.4, 30); crystal(-20+i*2.4, -28); }
function geyser(x,z){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.4,1.2,10),new THREE.MeshStandardMaterial({color:0x2a3a2a,roughness:.8}));
  base.position.y=.6; g.add(base);
  const gas=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.2,3.4,10),new THREE.MeshStandardMaterial({color:0x59ff7a,emissive:0x22ff66,emissiveIntensity:1.2,transparent:true,opacity:.8}));
  gas.position.y=2.6; gas.name='gas'; g.add(gas);
  g.position.set(x,2,z); scene.add(g);
}
geyser(20,32); geyser(-20,-32);

// ---------- Units ----------
const units=[], enemies=[];
const selectRing = new THREE.RingGeometry(1.1,1.45,28);
function hpSprite(){
  const c=document.createElement('canvas'); c.width=64; c.height=8;
  const t=new THREE.CanvasTexture(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));
  s.scale.set(3,.4,1); return {sprite:s,canvas:c,tex:t};
}
function setHpBar(u){
  const {canvas,tex}=u.hpUi; const x=canvas.getContext('2d');
  x.clearRect(0,0,64,8); x.fillStyle='#300'; x.fillRect(0,0,64,8);
  const f=Math.max(0,u.hp/u.maxHp);
  x.fillStyle=f>.5?'#3f6':f>.25?'#fc3':'#f33'; x.fillRect(0,0,64*f,8);
  tex.needsUpdate=true;
}
function makeMarine(x,z){
  const g=new THREE.Group();
  const armor=new THREE.MeshStandardMaterial({color:0x2a5fa8,metalness:.6,roughness:.35});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,.7,4,10),armor);
  body.position.y=1.2; body.castShadow=true; g.add(body);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(.7,.22,.2),new THREE.MeshStandardMaterial({color:0x35c8ff,emissive:0x35c8ff,emissiveIntensity:2}));
  visor.position.set(0,1.75,.5); g.add(visor);
  const gun=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,2.1),new THREE.MeshStandardMaterial({color:0x11151c,metalness:.7,roughness:.4}));
  gun.position.set(.5,1.25,.9); g.add(gun);
  const pack=new THREE.Mesh(new THREE.BoxGeometry(.7,.8,.35),new THREE.MeshStandardMaterial({color:0x1a3a5c}));
  pack.position.set(0,1.3,-.6); g.add(pack);
  const ring=new THREE.Mesh(selectRing,new THREE.MeshBasicMaterial({color:0x35c8ff,transparent:true,opacity:.9,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.y=.08; ring.visible=false; g.add(ring);
  const hpUi=hpSprite(); hpUi.sprite.position.y=3; g.add(hpUi.sprite);
  g.position.set(x,2,z);
  scene.add(g);
  const u={mesh:g,ring,hpUi,hp:60,maxHp:60,speed:9,range:16,dmg:7,cool:0,target:null,dest:null,team:'terran',kind:'marine',radius:1};
  setHpBar(u); units.push(u); return u;
}
function makeTank(x,z){
  const g=new THREE.Group();
  const hull=new THREE.Mesh(new THREE.BoxGeometry(2.6,1,3.6),new THREE.MeshStandardMaterial({color:0x4d6a8c,metalness:.65,roughness:.4}));
  hull.position.y=.9; hull.castShadow=true; g.add(hull);
  const tur=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.6,10),new THREE.MeshStandardMaterial({color:0x33475e,metalness:.7,roughness:.35}));
  tur.position.y=1.6; g.add(tur);
  const cannon=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,3.6),new THREE.MeshStandardMaterial({color:0x0c0f14}));
  cannon.rotation.x=Math.PI/2; cannon.position.set(0,1.6,2.4); g.add(cannon);
  const glow=new THREE.Mesh(new THREE.BoxGeometry(2.7,.25,3.7),new THREE.MeshStandardMaterial({color:0x35c8ff,emissive:0x35c8ff,emissiveIntensity:1}));
  glow.position.y=.45; g.add(glow);
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.8,2.2,28),new THREE.MeshBasicMaterial({color:0x35c8ff,transparent:true,opacity:.9,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.y=.08; ring.visible=false; g.add(ring);
  const hpUi=hpSprite(); hpUi.sprite.position.y=3.4; g.add(hpUi.sprite);
  g.position.set(x,2,z); scene.add(g);
  const u={mesh:g,ring,hpUi,hp:180,maxHp:180,speed:6,range:22,dmg:22,cool:0,target:null,dest:null,team:'terran',kind:'tank',radius:1.6};
  setHpBar(u); units.push(u); return u;
}
function makeZergling(x,z){
  const g=new THREE.Group();
  const skin=new THREE.MeshStandardMaterial({color:0x8a2a1a,roughness:.6});
  const body=new THREE.Mesh(new THREE.SphereGeometry(.9,12,10),skin);
  body.scale.set(1,.7,1.4); body.position.y=.9; body.castShadow=true; g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),new THREE.MeshStandardMaterial({color:0xb04020,roughness:.5}));
  head.position.set(0,1.1,1.2); g.add(head);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.14),new THREE.MeshStandardMaterial({color:0xffe14d,emissive:0xffcc00,emissiveIntensity:2}));
  eye.position.set(.2,1.3,1.6); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-.2; g.add(eye2);
  for(let s=-1;s<=1;s+=2){
    for(let l=0;l<2;l++){
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.09,.05,1.4),skin);
      leg.position.set(s*.9,.6,-.4+l*.9); leg.rotation.z=s*.6; g.add(leg);
    }
    const wing=new THREE.Mesh(new THREE.ConeGeometry(.3,1.4,5),new THREE.MeshStandardMaterial({color:0xd86a3a,emissive:0x551100,emissiveIntensity:.4}));
    wing.position.set(s*.7,1.4,-.6); wing.rotation.set(-1.2,0,s*.4); g.add(wing);
  }
  const hpUi=hpSprite(); hpUi.sprite.position.y=2.6; g.add(hpUi.sprite);
  g.position.set(x,2,z); scene.add(g);
  const u={mesh:g,hpUi,hp:45,maxHp:45,speed:7.5,range:2.6,dmg:6,cool:0,target:null,dest:null,team:'zerg',kind:'ling',radius:.9,wanderT:0};
  setHpBar(u); enemies.push(u); return u;
}
for(let i=0;i<7;i++) makeMarine(-6+i*2.2, 36-i%2);
makeTank(-2,32); makeTank(2,32);
for(let i=0;i<6;i++) makeZergling(-10+i*4, -30+ (i%2)*4);

// ---------- Combat FX ----------
const beams=[]; const particles=[];
function shootBeam(from,to,color=0x66e0ff){
  const g=new THREE.BufferGeometry().setFromPoints([from.clone(),to.clone()]);
  const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:1}));
  scene.add(l); beams.push({line:l,life:.12});
}
function explode(p,color=0xff8830,n=26,power=9){
  const g=new THREE.BufferGeometry(); const pos=new Float32Array(n*3); const vel=[];
  for(let i=0;i<n;i++){ pos[i*3]=p.x; pos[i*3+1]=p.y; pos[i*3+2]=p.z;
    vel.push(new THREE.Vector3((Math.random()-.5)*power,Math.random()*power*.8,(Math.random()-.5)*power)); }
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color,size:.7,transparent:true,opacity:1}));
  scene.add(pts); particles.push({pts,vel,life:1});
}
function muzzle(p){ explode(p,0x9fe8ff,6,4); }

// ---------- Selection & orders ----------
const ray=new THREE.Raycaster(); const mouseNDC=new THREE.Vector2();
const selected=new Set();
const selectBoxEl=document.getElementById('select-box');
let dragStart=null;
function setNDC(e){ mouseNDC.x=(e.clientX/innerWidth)*2-1; mouseNDC.y=-(e.clientY/innerHeight)*2+1; }
function groundPoint(e){ setNDC(e); ray.setFromCamera(mouseNDC,camera);
  const hit=new THREE.Vector3(); ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-2),hit); return hit; }
function pickUnit(e, list){
  setNDC(e); ray.setFromCamera(mouseNDC,camera);
  const meshes=list.map(u=>u.mesh); const hits=ray.intersectObjects(meshes,true);
  if(!hits.length) return null;
  let o=hits[0].object; while(o && !list.find(u=>u.mesh===o)) o=o.parent;
  return list.find(u=>u.mesh===o)||null;
}
function selectOnly(u){
  selected.clear(); units.forEach(x=>x.ring.visible=false);
  if(u){ selected.add(u); u.ring.visible=true; }
  updatePanel();
}
function updatePanel(){
  const arr=[...selected];
  document.getElementById('portrait-face').textContent = arr.length? (arr[0].kind==='tank'?'🛞':'🪖') : '🪖';
  document.getElementById('portrait-name').textContent = arr.length? `${arr[0].kind.toUpperCase()} ×${arr.length}` : 'NO SELECTION';
  document.getElementById('sel-title').textContent = arr.length? `Selected — ${arr.length} unit(s)` : 'Terran Expedition Force';
  const avg = arr.length? arr.reduce((s,u)=>s+u.hp/u.maxHp,0)/arr.length : 1;
  document.getElementById('hp-bar').style.width=(avg*100)+'%';
}
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('mousedown',e=>{
  if(e.button===0){ dragStart={x:e.clientX,y:e.clientY}; }
  if(e.button===2 && selected.size){
    const uAll=[...selected];
    const pt=groundPoint(e);
    const enemy=pickUnit(e,enemies);
    const bHit=(()=>{ setNDC(e); ray.setFromCamera(mouseNDC,camera);
      const h=ray.intersectObjects(buildings.filter(b=>b.userData.team==='zerg'),true); return h.length?h:null; })();
    uAll.forEach((u,i)=>{
      const ox=(i%3-1)*2.5, oz=(Math.floor(i/3))*2.5;
      u.dest=new THREE.Vector3(pt.x+ox,2,pt.z+oz);
      u.target=enemy?enemy:(bHit?{mesh:bHit[0].object,buildingRef:true,hp:999}:null);
      u.attackMove = attackMoveArmed ? true : !!enemy;
      // move marker
      const mk=new THREE.Mesh(new THREE.RingGeometry(.6,1,20),new THREE.MeshBasicMaterial({color:enemy?0xff4d5e:0x59ff7a,side:THREE.DoubleSide,transparent:true}));
      mk.rotation.x=-Math.PI/2; mk.position.set(pt.x,.15+2,pt.z); scene.add(mk);
      setTimeout(()=>scene.remove(mk),600);
    });
    attackMoveArmed=false;
    feed(enemy?'Attacking zergling!':'Move order confirmed.', enemy?'war':'');
  }
});
canvas.addEventListener('mousemove',e=>{
  if(!dragStart) return;
  const x=Math.min(e.clientX,dragStart.x), y=Math.min(e.clientY,dragStart.y);
  const w=Math.abs(e.clientX-dragStart.x), h=Math.abs(e.clientY-dragStart.y);
  if(w>6||h>6){ Object.assign(selectBoxEl.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'}); selectBoxEl.hidden=false; }
});
canvas.addEventListener('mouseup',e=>{
  if(e.button!==0||!dragStart) return;
  const w=Math.abs(e.clientX-dragStart.x), h=Math.abs(e.clientY-dragStart.y);
  if(w<8&&h<8){ const u=pickUnit(e,units); selectOnly(u); }
  else{
    const x0=Math.min(e.clientX,dragStart.x), x1=Math.max(e.clientX,dragStart.x);
    const y0=Math.min(e.clientY,dragStart.y), y1=Math.max(e.clientY,dragStart.y);
    selected.clear(); units.forEach(x=>x.ring.visible=false);
    units.forEach(u=>{
      const v=u.mesh.position.clone(); v.y+=1; v.project(camera);
      const sx=(v.x*.5+.5)*innerWidth, sy=(-v.y*.5+.5)*innerHeight;
      if(sx>x0&&sx<x1&&sy>y0&&sy<y1&&v.z<1){ selected.add(u); u.ring.visible=true; }
    });
    updatePanel();
    feed(`Selected ${selected.size} unit(s).`);
  }
  dragStart=null; selectBoxEl.hidden=true;
});

// camera keys
const keys={};
addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key.toLowerCase()==='m') trainMarine();
  if(e.key.toLowerCase()==='t') trainTank();
  if(e.key.toLowerCase()==='a') { attackMoveArmed=true; toast('ATTACK-MOVE ARMED — right-click a location'); }
  if(e.key.toLowerCase()==='s') scan();
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('wheel',e=>{ camDist=THREE.MathUtils.clamp(camDist+e.deltaY*.05,18,110); },{passive:true});
let attackMoveArmed=false;

// economy + training
let mins=850, gas=320, supply=18, supplyMax=34;
function economyTick(){
  mins+=4; if(Math.random()<.3) gas+=1;
  document.getElementById('r-min').textContent=mins;
  document.getElementById('r-gas').textContent=gas;
  document.getElementById('r-sup').textContent=`${supply}/${supplyMax}`;
}
setInterval(economyTick,1000);
function trainMarine(){
  if(mins<50){ toast('NOT ENOUGH MINERALS'); return; }
  if(supply>=supplyMax){ toast('SUPPLY BLOCKED — BUILD MORE DEPOTS'); return; }
  mins-=50; supply+=1;
  const u=makeMarine(-8+Math.random()*16, 50); u.dest=new THREE.Vector3(u.mesh.position.x,2,40);
  feed('Marine trained.','good');
}
function trainTank(){
  if(mins<150||gas<25){ toast('REQUIRES 150⛁ 25⛽'); return; }
  if(supply+2>supplyMax){ toast('SUPPLY BLOCKED'); return; }
  mins-=150; gas-=25; supply+=2;
  const u=makeTank(8,54); u.dest=new THREE.Vector3(4,2,40);
  feed('Siege Tank deployed.','good');
}
function scan(){
  feed('Scanner sweep... no cloaked units found.','good');
  explode(new THREE.Vector3(camTarget.x,8,camTarget.z),0x35c8ff,40,18);
}
document.getElementById('b-marine').onclick=trainMarine;
document.getElementById('b-tank').onclick=trainTank;
document.getElementById('b-scan').onclick=scan;
document.getElementById('b-nuke').onclick=()=>{
  const t=document.getElementById('nuke-flash'); t.hidden=false; t.style.opacity=1;
  feed('⚠ NUCLEAR LAUNCH DETECTED ⚠','war'); toast('☢ NUCLEAR LAUNCH DETECTED ☢');
  const target=enemies[0]?enemies[0].mesh.position.clone():new THREE.Vector3(0,2,-35);
  setTimeout(()=>{
    explode(target,0xffdd88,120,26); explode(target,0xff4400,80,18);
    enemies.slice(0,4).forEach(e=>damage(e,80));
    let o=1; const f=setInterval(()=>{o-=.08; t.style.opacity=o; if(o<=0){t.hidden=true;clearInterval(f);}},50);
  },1200);
};

// damage / death
function damage(u,amt){
  if(u.buildingRef) return;
  if(u.hp===undefined){ // building group wrapper
    return;
  }
  u.hp-=amt; setHpBar(u);
  if(u.hp<=0){
    explode(u.mesh.position.clone().add(new THREE.Vector3(0,1,0)), u.team==='zerg'?0x88ff44:0x35c8ff, 30, 10);
    scene.remove(u.mesh);
    let i=units.indexOf(u); if(i>=0){units.splice(i,1); selected.delete(u); supply=Math.max(0,supply-1);}
    i=enemies.indexOf(u); if(i>=0) enemies.splice(i,1);
    if(u.team==='zerg') { mins+=25; feed('Zergling destroyed +25⛁','good'); }
    updatePanel();
    if(!enemies.length){ feed('All zerglings eliminated. Victory! Reinforcements inbound...','good');
      setTimeout(()=>{ for(let k=0;k<4;k++) makeZergling(-14+k*7,-36); feed('New zerg wave detected!','war'); },6000);
    }
  }
}

// ---------- Minimap ----------
const mm=document.getElementById('minimap').getContext('2d');
function drawMinimap(){
  mm.fillStyle='#02070f'; mm.fillRect(0,0,180,180);
  const s=v=>(v/WORLD+.5)*180;
  mm.fillStyle='rgba(53,200,255,.25)'; mm.fillRect(s(-23),s(27),46/WORLD*180,30/WORLD*180);
  mm.fillStyle='rgba(255,60,90,.3)'; mm.fillRect(s(-24),s(-60),48/WORLD*180,32/WORLD*180);
  mm.fillStyle='#35c8ff'; minerals.forEach(m=>{mm.fillRect(s(m.position.x)-1,s(m.position.z)-1,2,2);});
  mm.fillStyle='#59ff7a'; units.forEach(u=>{mm.fillRect(s(u.mesh.position.x)-2,s(u.mesh.position.z)-2,3,3);});
  mm.fillStyle='#ff4d5e'; enemies.forEach(u=>{mm.fillRect(s(u.mesh.position.x)-2,s(u.mesh.position.z)-2,3,3);});
  mm.fillStyle='#fff'; buildings.forEach(b=>{mm.fillRect(s(b.position.x)-2,s(b.position.z)-2,4,4);});
  // camera frustum
  mm.strokeStyle='#ffcf4d'; mm.strokeRect(s(camTarget.x-20),s(camTarget.z-14),40/WORLD*180,28/WORLD*180);
}

// ---------- Loop ----------
const clock=new THREE.Clock();
let fpsA=60, frames=0, fpsT=0;
function nearestEnemy(u, list, range){
  let best=null,bd=range;
  for(const e of list){ const d=u.mesh.position.distanceTo(e.mesh.position); if(d<bd){bd=d;best=e;} }
  return best;
}
function stepUnit(u, dt, foes){
  u.cool-=dt;
  if(!u.target || (u.target.hp!==undefined && u.target.hp<=0)) {
    u.target = nearestEnemy(u, foes, u.kind==='tank'?u.range:u.range*.9);
    if(!u.attackMove && u.target && u.dest==null){ /* hold */ }
  }
  const tp = u.target ? u.target.mesh.position : u.dest;
  if(u.target){
    const d=u.mesh.position.distanceTo(u.target.mesh.position);
    if(d<=u.range){
      // face + fire
      u.mesh.lookAt(u.target.mesh.position.x,2,u.target.mesh.position.z);
      if(u.cool<=0){
        u.cool=u.kind==='tank'?1.4:.55;
        const from=u.mesh.position.clone().add(new THREE.Vector3(0,1.6,0));
        const to=u.target.mesh.position.clone().add(new THREE.Vector3(0,1.2,0));
        shootBeam(from,to,u.kind==='tank'?0xffb14d:0x66e0ff); muzzle(from);
        damage(u.target,u.dmg);
        if(u.kind==='tank'){ u.mesh.position.add(new THREE.Vector3((Math.random()-.5)*.3,0,(Math.random()-.5)*.3)); }
      }
      // tank holds, marines kite slightly
      if(u.kind!=='tank' && d<u.range*.5 && !u.dest){
        const away=u.mesh.position.clone().sub(u.target.mesh.position).setY(0).normalize().multiplyScalar(u.speed*dt*.5);
        u.mesh.position.add(away);
      }
      return;
    } else {
      // chase
      const dir=u.target.mesh.position.clone().sub(u.mesh.position).setY(0).normalize();
      u.mesh.position.addScaledVector(dir,u.speed*dt);
      u.mesh.lookAt(u.target.mesh.position.x,2,u.target.mesh.position.z);
      return;
    }
  }
  if(u.dest){
    const dir=u.dest.clone().sub(u.mesh.position).setY(0);
    const d=dir.length();
    if(d<1){ u.dest=null; u.attackMove=false; }
    else { dir.normalize(); u.mesh.position.addScaledVector(dir,Math.min(u.speed*dt,d)); u.mesh.lookAt(u.dest.x,2,u.dest.z); }
  }
}
function stepZerg(u,dt){
  u.cool-=dt; u.wanderT-=dt;
  const foe=nearestEnemy(u,units,30);
  if(foe && u.mesh.position.distanceTo(foe.mesh.position)<=u.range){
    u.mesh.lookAt(foe.mesh.position.x,2,foe.mesh.position.z);
    if(u.cool<=0){ u.cool=.8; shootBeam(u.mesh.position.clone().add(new THREE.Vector3(0,1,0)),foe.mesh.position.clone().add(new THREE.Vector3(0,1,0)),0xff5a3a); damage(foe,6); }
    return;
  }
  if(foe && u.mesh.position.distanceTo(foe.mesh.position)<30){
    const dir=foe.mesh.position.clone().sub(u.mesh.position).setY(0).normalize();
    u.mesh.position.addScaledVector(dir,u.speed*dt);
    u.mesh.lookAt(foe.mesh.position.x,2,foe.mesh.position.z); return;
  }
  if(u.wanderT<=0){ u.wanderT=2+Math.random()*3; u.wander=new THREE.Vector3((Math.random()-.5)*60,2,-30+(Math.random()-.5)*24); }
  if(u.wander){ const dir=u.wander.clone().sub(u.mesh.position).setY(0);
    if(dir.length()>1){ dir.normalize(); u.mesh.position.addScaledVector(dir,u.speed*.4*dt); u.mesh.lookAt(u.wander.x,2,u.wander.z); } }
  // scuttle animation
  u.mesh.position.y=2+Math.abs(Math.sin(performance.now()*.008+u.mesh.position.x))*.15;
}
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  // camera
  const sp=24*dt;
  if(keys['w']) camTarget.z-=sp; if(keys['s']) camTarget.z+=sp;
  if(keys['a']&&!attackMoveArmed) camTarget.x-=sp; if(keys['d']) camTarget.x+=sp;
  if(keys['q']) camYaw+=1.6*dt; if(keys['e']) camYaw-=1.6*dt;
  camTarget.x=THREE.MathUtils.clamp(camTarget.x,-60,60);
  camTarget.z=THREE.MathUtils.clamp(camTarget.z,-60,60);
  updateCamera();
  // idle anims
  const t=performance.now()*.001;
  minerals.forEach(m=>{ m.rotation.y+=dt*m.userData.spin; m.position.y=1.2+2+Math.sin(t*2+m.position.x)*.25; });
  scene.traverse(o=>{ if(o.name==='beacon') o.material.emissiveIntensity=1.5+Math.sin(t*4); if(o.name==='gas') o.rotation.y+=dt; });
  turrets.forEach(tr=>{
    const foes=tr.team==='terran'?enemies:units;
    const tgt=nearestEnemy({mesh:tr.group},foes,tr.range);
    if(tgt){ const p=tgt.mesh.position; tr.head.lookAt(p.x,4,p.z); tr.cool-=dt;
      if(tr.cool<=0){ tr.cool=1.1; shootBeam(tr.group.position.clone().add(new THREE.Vector3(0,5,0)),p.clone().add(new THREE.Vector3(0,1,0)),0xff6a5a); damage(tgt,tr.dmg); } }
  });
  [...units].forEach(u=>stepUnit(u,dt,enemies));
  [...enemies].forEach(u=>stepZerg(u,dt));
  // beams
  for(let i=beams.length-1;i>=0;i--){ beams[i].life-=dt; beams[i].line.material.opacity=beams[i].life/.12;
    if(beams[i].life<=0){ scene.remove(beams[i].line); beams.splice(i,1);} }
  for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.life-=dt*.9;
    const a=p.pts.geometry.attributes.position;
    for(let j=0;j<p.vel.length;j++){ a.array[j*3]+=p.vel[j].x*dt; a.array[j*3+1]+=p.vel[j].y*dt; a.array[j*3+2]+=p.vel[j].z*dt; p.vel[j].y-=12*dt; }
    a.needsUpdate=true; p.pts.material.opacity=Math.max(0,p.life);
    if(p.life<=0){ scene.remove(p.pts); particles.splice(i,1);} }
  drawMinimap();
  renderer.render(scene,camera);
  // fps + ready flag
  frames++; fpsT+=dt; if(fpsT>=.5){ fpsA=Math.round(frames/fpsT); frames=0; fpsT=0; document.getElementById('r-fps').textContent=fpsA+' fps'; }
  window.__sceneReady=true; window.__unitCount=units.length; window.__enemyCount=enemies.length;
}
addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });

feed('Welcome to STARCRAFT 3D. Defend the Terran base.','good');
setTimeout(()=>feed('Warning: zerg biosignatures detected north.','war'),2500);
selectOnly(units[0]); selected.clear(); units.slice(0,5).forEach(u=>{selected.add(u);u.ring.visible=true;}); updatePanel();
animate();

// WebGPU probe (diagnostic only — game renders on WebGL2)
(async()=>{
  const el=document.getElementById('r-render');
  el.textContent=renderer.capabilities.isWebGL2?'WebGL2 ✓':'WebGL1';
  try{
    if(navigator.gpu){ const a=await navigator.gpu.requestAdapter();
      if(a){ window.__webgpu={vendor:a.info?.vendor||'?',arch:a.info?.architecture||'?',fallback:!!a.info?.isFallbackAdapter};
        el.textContent+=` · GPU:${a.info?.vendor||'ok'}`; } }
  }catch(e){ window.__webgpuError=String(e); }
})();
