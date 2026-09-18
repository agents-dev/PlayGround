import * as THREE from 'three';

// ---------- config ----------
const WORLD = 64, MAXH = 24, WATER = 7;
const BLOCKS = {
  1:{name:'Grass',}, 2:{name:'Dirt'}, 3:{name:'Stone'}, 4:{name:'Oak Log'},
  5:{name:'Leaves'}, 6:{name:'Sand'}, 7:{name:'Planks'}, 8:{name:'Glass'}, 9:{name:'Brick'},
};
const HOTBAR = [1,2,3,4,5,6,7,8,9];

// ---------- tiny seeded noise ----------
function hash2(x,y,s){ let h = x*374761393 + y*668265263 + s*1442695041; h=(h^(h>>13))*1274126177; return ((h^(h>>16))>>>0)/4294967295; }
function smooth(t){return t*t*(3-2*t);}
function valueNoise(x,y,s){
  const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const a=hash2(xi,yi,s), b=hash2(xi+1,yi,s), c=hash2(xi,yi+1,s), d=hash2(xi+1,yi+1,s);
  return a+(b-a)*smooth(xf)+(c-a)*smooth(yf)+(a-b-c+d)*smooth(xf)*smooth(yf);
}
function fbm(x,y,s){ return valueNoise(x*0.045,y*0.045,s)*0.6 + valueNoise(x*0.11,y*0.11,s+7)*0.28 + valueNoise(x*0.28,y*0.28,s+13)*0.12; }

// ---------- textures (16x16 pixel art) ----------
function pxTexture(draw){
  const c=document.createElement('canvas'); c.width=c.height=16;
  const g=c.getContext('2d'); draw(g);
  const t=new THREE.CanvasTexture(c);
  t.magFilter=THREE.NearestFilter; t.minFilter=THREE.NearestFilter;
  t.colorSpace=THREE.SRGBColorSpace; return t;
}
function noiseFill(g,base,vary,n=70){
  g.fillStyle=base; g.fillRect(0,0,16,16);
  for(let i=0;i<n;i++){ const v=(Math.random()-0.5)*vary;
    const r=Math.max(0,Math.min(255,parseInt(base.slice(1,3),16)+v));
    const gg=Math.max(0,Math.min(255,parseInt(base.slice(3,5),16)+v));
    const b=Math.max(0,Math.min(255,parseInt(base.slice(5,7),16)+v));
    g.fillStyle=`rgb(${r|0},${gg|0},${b|0})`; g.fillRect((Math.random()*16)|0,(Math.random()*16)|0,1,1); }
}
const TEX = {
  grassTop: pxTexture(g=>noiseFill(g,'#6abe30',26,120)),
  grassSide: pxTexture(g=>{ noiseFill(g,'#8a5f3c',22,110); g.fillStyle='#6abe30'; g.fillRect(0,0,16,4);
    for(let x=0;x<16;x++){ const h=4+((Math.random()*3)|0); g.fillStyle='#6abe30'; g.fillRect(x,0,1,h);} }),
  dirt: pxTexture(g=>noiseFill(g,'#8a5f3c',24,120)),
  stone: pxTexture(g=>noiseFill(g,'#8d8d8d',16,90)),
  logSide: pxTexture(g=>{ noiseFill(g,'#5b4023',20,90); g.fillStyle='#3f2c17'; for(let x=2;x<16;x+=4) g.fillRect(x,0,1,16); }),
  logTop: pxTexture(g=>{ g.fillStyle='#c8a86b'; g.fillRect(0,0,16,16); g.fillStyle='#8a6b3a';
    for(let r=7;r>0;r-=2){ g.strokeStyle='#8a6b3a'; g.strokeRect(8-r,8-r,r*2,r*2);} }),
  leaves: pxTexture(g=>{ noiseFill(g,'#2f8f2a',34,200); g.fillStyle='rgba(10,40,10,.9)';
    for(let i=0;i<26;i++) g.fillRect((Math.random()*16)|0,(Math.random()*16)|0,2,2); }),
  sand: pxTexture(g=>noiseFill(g,'#e3d9a3',14,90)),
  planks: pxTexture(g=>{ noiseFill(g,'#b08a4f',14,80); g.fillStyle='#6e5426'; for(let y=3;y<16;y+=4) g.fillRect(0,y,16,1); g.fillRect(7,0,1,16); }),
  glass: pxTexture(g=>{ g.clearRect(0,0,16,16); g.fillStyle='rgba(200,235,255,.25)'; g.fillRect(0,0,16,16);
    g.fillStyle='#eaf7ff'; g.fillRect(0,0,16,1); g.fillRect(0,0,1,16); g.fillRect(15,0,1,16); g.fillRect(0,15,16,1); }),
  brick: pxTexture(g=>{ g.fillStyle='#9b4a3f'; g.fillRect(0,0,16,16); g.fillStyle='#d8c9bd';
    for(let y=3;y<16;y+=4) g.fillRect(0,y,16,1); for(let x=0;x<16;x+=4) g.fillRect(x,(Math.floor(x/4)%2)?0:4,1,8); }),
  water: pxTexture(g=>noiseFill(g,'#3b6fe0',12,60)),
};
function matsFor(id){
  const lam=(m)=>new THREE.MeshLambertMaterial(m);
  switch(id){
    case 1: return [lam({map:TEX.grassSide}),lam({map:TEX.grassSide}),lam({map:TEX.grassTop}),lam({map:TEX.dirt}),lam({map:TEX.grassSide}),lam({map:TEX.grassSide})];
    case 2: return lam({map:TEX.dirt});
    case 3: return lam({map:TEX.stone});
    case 4: return [lam({map:TEX.logSide}),lam({map:TEX.logSide}),lam({map:TEX.logTop}),lam({map:TEX.logTop}),lam({map:TEX.logSide}),lam({map:TEX.logSide})];
    case 5: return lam({map:TEX.leaves});
    case 6: return lam({map:TEX.sand});
    case 7: return lam({map:TEX.planks});
    case 8: return new THREE.MeshLambertMaterial({map:TEX.glass,transparent:true,opacity:0.55,side:THREE.DoubleSide});
    case 9: return lam({map:TEX.brick});
    case 10: return new THREE.MeshLambertMaterial({map:TEX.water,transparent:true,opacity:0.72});
    default: return lam({color:0xff00ff});
  }
}

// ---------- three setup ----------
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 30, 140);
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x6b8e4e, 0.9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2d9, 1.6);
sun.position.set(40,60,20); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-60; sun.shadow.camera.right=60; sun.shadow.camera.top=60; sun.shadow.camera.bottom=-60;
scene.add(sun); scene.add(sun.target);

// clouds
const cloudGroup = new THREE.Group(); scene.add(cloudGroup);
{
  const cm = new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.75});
  const cg = new THREE.BoxGeometry(1,1,1);
  for(let i=0;i<26;i++){
    const m=new THREE.Mesh(cg,cm);
    m.position.set((Math.random()-0.5)*140, 30+Math.random()*6, (Math.random()-0.5)*140);
    m.scale.set(4+Math.random()*8, 1.2, 3+Math.random()*5); cloudGroup.add(m);
  }
}

// ---------- world data ----------
let seed = 1337;
let groveAim = null;
let data = new Map(); // "x,y,z" -> id
const key=(x,y,z)=>x+','+y+','+z;
const get=(x,y,z)=>data.get(key(x,y,z))||0;
const solid=(x,y,z)=>{ const b=get(x,y,z); return b!==0 && b!==10; };
function setB(x,y,z,id){ const k=key(x,y,z); if(id) data.set(k,id); else data.delete(k); }

function genWorld(s){
  seed=s; data.clear();
  const H={};
  for(let x=0;x<WORLD;x++) for(let z=0;z<WORLD;z++){
    const n=fbm(x,z,seed);
    let h = Math.floor(4 + n*14);
    const cx=x-WORLD/2, cz=z-WORLD/2, d=Math.sqrt(cx*cx+cz*cz);
    if(d>26) h = Math.min(h, WATER-1 - Math.floor((d-26)/3)); // island falloff -> beach/water
    H[x+','+z]=h;
    for(let y=0;y<=h;y++){
      let id=3;
      if(y===h) id = h<=WATER+1 ? 6 : 1;
      else if(y>=h-2) id = h<=WATER+1 ? 6 : 2;
      setB(x,y,z,id);
    }
    if(h<WATER) for(let y=h+1;y<=WATER;y++) setB(x,y,z,10);
  }
  // trees
  let trees=0;
  for(let i=0;i<220 && trees<40;i++){
    const x=(hash2(i,1,seed)*WORLD)|0, z=(hash2(i,2,seed^99)*WORLD)|0;
    const h=H[x+','+z];
    if(h===undefined||h<=WATER+1||get(x,h,z)!==1) continue;
    if(hash2(x,z,seed)<0.4) continue;
    const th=4+((hash2(i,9,seed)*2)|0);
    for(let y=h+1;y<=h+th;y++) setB(x,y,z,4);
    for(let dx=-2;dx<=2;dx++) for(let dz=-2;dz<=2;dz++) for(let dy=0;dy<3;dy++){
      if(Math.abs(dx)===2&&Math.abs(dz)===2&&dy>0) continue;
      const px=x+dx,py=h+th-2+dy,pz=z+dz;
      if(get(px,py,pz)===0) setB(px,py,pz,5);
    }
    setB(x,h+th+1,z,5); trees++;
  }
  // guaranteed grove on grass near center so the first view has trees
  const topAt=(x,z)=>{ for(let y=MAXH+6;y>0;y--){ const b=get(x,y,z); if(b!==0&&b!==10) return y; } return -1; };
  let anchor=null;
  for(let dx=-16;dx<=16 && !anchor;dx++) for(let dz=-16;dz<=16 && !anchor;dz++){
    const x=(WORLD>>1)+dx, z=(WORLD>>1)+dz, y=topAt(x,z);
    if(y>0 && get(x,y,z)===1 && y>WATER+2) anchor={x,y,z};
  }
  const grove = anchor ? [[anchor.x-6,anchor.z-6],[anchor.x+5,anchor.z-7],[anchor.x+8,anchor.z+1]] : [];
  groveAim = grove.length ? {x:grove[0][0], z:grove[0][1]} : null;
  for(const [tx,tz] of grove){
    const ty=topAt(tx,tz);
    if(ty>0 && get(tx,ty,tz)===1){
      for(let y=ty+1;y<=ty+4;y++) setB(tx,y,tz,4);
      for(let dx=-2;dx<=2;dx++) for(let dz=-2;dz<=2;dz++) for(let dy=0;dy<2;dy++){
        if(Math.abs(dx)===2&&Math.abs(dz)===2) continue;
        if(get(tx+dx,ty+3+dy,tz+dz)===0) setB(tx+dx,ty+3+dy,tz+dz,5);
      }
      setB(tx,ty+5,tz,5);
    }
  }
}

// ---------- instanced rendering ----------
const chunkGroup = new THREE.Group(); scene.add(chunkGroup);
const boxGeo = new THREE.BoxGeometry(1,1,1);
let blockCount=0;
const DIRS=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function exposed(x,y,z){
  const id=get(x,y,z); if(!id) return false;
  if(id===10) return true;
  for(const [dx,dy,dz] of DIRS){ const n=get(x+dx,y+dy,z+dz); if(n===0||n===10||(id!==8&&n===8)) return true; }
  return false;
}
function rebuild(){
  for(const m of [...chunkGroup.children]){ chunkGroup.remove(m); m.dispose?.(); }
  const perType=new Map(); blockCount=0;
  for(const [k,id] of data){
    const [x,y,z]=k.split(',').map(Number);
    if(!exposed(x,y,z)) continue;
    if(!perType.has(id)) perType.set(id,[]);
    perType.get(id).push([x,y,z]); blockCount++;
  }
  const m4=new THREE.Matrix4();
  for(const [id,list] of perType){
    const mat=matsFor(id);
    const im=new THREE.InstancedMesh(boxGeo,mat,list.length);
    im.castShadow = id!==10; im.receiveShadow=true;
    list.forEach(([x,y,z],i)=>{ m4.makeTranslation(x-WORLD/2+0.5,y+0.5,z-WORLD/2+0.5); im.setMatrixAt(i,m4); });
    im.instanceMatrix.needsUpdate=true;
    chunkGroup.add(im);
  }
  document.getElementById('coords').textContent = `${blockCount} blocks`;
}

// ground plane under world (void safety)
{
  const g=new THREE.Mesh(new THREE.PlaneGeometry(400,400), new THREE.MeshLambertMaterial({color:0x1c3a5e}));
  g.rotation.x=-Math.PI/2; g.position.y=-2; g.receiveShadow=true; scene.add(g);
}

// ---------- player ----------
const player={ pos:new THREE.Vector3(0,16,8), vel:new THREE.Vector3(), yaw:Math.PI, pitch:-0.15, onGround:false, fly:false, w:0.6, h:1.8 };
function topY(x,z){ for(let y=MAXH+6;y>0;y--){ if(get(x,y,z)!==0 && get(x,y,z)!==10) return y; } return -1; }
function findSpawn(){
  let best=null;
  for(let dx=-16;dx<=16;dx++) for(let dz=-16;dz<=16;dz++){
    const x=(WORLD>>1)+dx, z=(WORLD>>1)+dz;
    if(x<2||z<2||x>=WORLD-2||z>=WORLD-2) continue;
    const y=topY(x,z);
    if(y>0 && get(x,y,z)===1 && (!best || y>best.y)) best={x,y,z};
  }
  return best || {x:WORLD>>1, y:topY(WORLD>>1,WORLD>>1), z:WORLD>>1};
}
function spawn(){
  const s=findSpawn();
  player.pos.set(s.x-WORLD/2+0.5, s.y+1.01, s.z-WORLD/2+0.5);
  player.vel.set(0,0,0);
}
// voxel-accurate collision using block grid in world indices
function collideAxis(axis){
  const w=player.w/2, h=player.h;
  const x0=Math.floor(player.pos.x-w), x1=Math.floor(player.pos.x+w);
  const y0=Math.floor(player.pos.y), y1=Math.floor(player.pos.y+h-0.001);
  const z0=Math.floor(player.pos.z-w), z1=Math.floor(player.pos.z+w);
  for(let bx=x0;bx<=x1;bx++) for(let by=y0;by<=y1;by++) for(let bz=z0;bz<=z1;bz++){
    const wx=Math.round(bx+WORLD/2-0.5), wz=Math.round(bz+WORLD/2-0.5);
    if(!solid(wx,by,wz)) continue;
    const minBX=bx, maxBX=bx+1, minBY=by, maxBY=by+1, minBZ=bz, maxBZ=bz+1;
    if(axis==='x'){ player.pos.x = player.vel.x>0 ? minBX-w-0.001 : maxBX+w+0.001; player.vel.x=0; }
    if(axis==='z'){ player.pos.z = player.vel.z>0 ? minBZ-w-0.001 : maxBZ+w+0.001; player.vel.z=0; }
    if(axis==='y'){ if(player.vel.y<=0){ player.pos.y=maxBY; player.onGround=true; } else player.pos.y=minBY-h-0.001; player.vel.y=0; }
  }
}

// ---------- input ----------
const keys={};
let selected=HOTBAR[0];
addEventListener('keydown',e=>{
  if(e.code==='Space') e.preventDefault();
  keys[e.code]=true;
  if(e.code==='KeyF'){ player.fly=!player.fly; player.vel.y=0; badge(); toast(player.fly?'🕊 Fly mode ON':'🚶 Walk mode'); }
  if(e.code.startsWith('Digit')){ const i=+e.code.slice(5)-1; if(HOTBAR[i]){selected=HOTBAR[i]; renderHotbar();} }
});
addEventListener('keyup',e=>keys[e.code]=false);
function badge(){ document.getElementById('mode-badge').textContent=player.fly?'FLY':'WALK'; }
addEventListener('wheel',e=>{ let i=HOTBAR.indexOf(selected); i=(i+(e.deltaY>0?1:-1)+HOTBAR.length)%HOTBAR.length; selected=HOTBAR[i]; renderHotbar(); });

let locked=false;
const menu=document.getElementById('menu'), pauseTip=document.getElementById('pause-tip');
document.getElementById('play-btn').onclick=()=>{ menu.classList.add('hidden'); pauseTip.classList.remove('hidden');
  setTimeout(()=>pauseTip.classList.add('hidden'),4000);
  canvas.requestPointerLock?.(); };
canvas.addEventListener('click',()=>{ if(menu.classList.contains('hidden')) canvas.requestPointerLock?.(); });
document.addEventListener('pointerlockchange',()=>{ locked=document.pointerLockElement===canvas; });
addEventListener('mousemove',e=>{
  if(!locked) return;
  player.yaw-=e.movementX*0.0025; player.pitch-=e.movementY*0.0025;
  player.pitch=Math.max(-1.55,Math.min(1.55,player.pitch));
});

// raycast highlight
const ray=new THREE.Raycaster(); ray.far=7;
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002,1.002,1.002)),
  new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:0.7}));
hl.visible=false; scene.add(hl);
let target=null, targetNormal=null;
function updateTarget(){
  ray.setFromCamera({x:0,y:0},camera);
  const hits=ray.intersectObjects(chunkGroup.children);
  if(hits.length){ const h=hits[0];
    const p=h.object.worldToLocal?.(h.point.clone()) ?? h.point;
    target=h; targetNormal=h.face.normal.clone();
    hl.visible=true; hl.position.copy(h.object.localToWorld(new THREE.Vector3(Math.floor(h.point.x-h.object.position.x+0.5)+h.object.position.x,0,0)).clone());
    hl.position.copy(new THREE.Vector3(Math.floor(h.point.x)+0.5,Math.floor(h.point.y)+0.5,Math.floor(h.point.z)+0.5));
  } else { target=null; hl.visible=false; }
}
function worldBlockAt(point){ return [Math.round(point.x+WORLD/2-0.5), Math.floor(point.y+ (Math.abs(point.y-Math.round(point.y))<0.01?0.001:0)), Math.round(point.z+WORLD/2-0.5)]; }
addEventListener('mousedown',e=>{
  if(!menu.classList.contains('hidden')||!target) return;
  if(!locked && e.button!==0) return;
  const bp=new THREE.Vector3(Math.floor(target.point.x+0.5-0.5)+0.5,0,0);
  const bx=Math.floor(target.point.x)+ (target.point.x<0?0:0), by=Math.floor(target.point.y), bz=Math.floor(target.point.z);
  // convert world->local: instance positions are at (x-WORLD/2+0.5)
  const wx=Math.round(target.point.x - targetNormal.x*0.5 + WORLD/2 - 0.5);
  const wy=Math.floor(target.point.y - targetNormal.y*0.5 + (targetNormal.y<0?0:0.0001));
  const wy2=Math.floor(target.point.y - targetNormal.y*0.5);
  const wz=Math.round(target.point.z - targetNormal.z*0.5 + WORLD/2 - 0.5);
  if(e.button===0){ // break
    // block center = point - normal*0.5
    const cxp=target.point.x-targetNormal.x*0.5, cyp=target.point.y-targetNormal.y*0.5, czp=target.point.z-targetNormal.z*0.5;
    const dx=Math.round(cxp+WORLD/2-0.5), dy=Math.floor(cyp+0.0001), dz=Math.round(czp+WORLD/2-0.5);
    if(get(dx,dy,dz) && !(Math.abs(dx-WORLD/2)<1&&dy<2)){ setB(dx,dy,dz,0); rebuild(); }
  } else if(e.button===2){ // place adjacent
    const cxp=target.point.x+targetNormal.x*0.5, cyp=target.point.y+targetNormal.y*0.5, czp=target.point.z+targetNormal.z*0.5;
    const dx=Math.round(cxp+WORLD/2-0.5), dy=Math.floor(cyp+0.0001), dz=Math.round(czp+WORLD/2-0.5);
    if(!get(dx,dy,dz)){ setB(dx,dy,dz,selected); rebuild(); }
  }
});
addEventListener('contextmenu',e=>e.preventDefault());

// ---------- HUD / hotbar ----------
function iconURL(id){
  const c=document.createElement('canvas'); c.width=c.height=32; const g=c.getContext('2d');
  g.imageSmoothingEnabled=false;
  const t=id===1?TEX.grassSide:[1,2,3,4,5,6,7,8,9].includes(id)?({1:TEX.grassSide,2:TEX.dirt,3:TEX.stone,4:TEX.logSide,5:TEX.leaves,6:TEX.sand,7:TEX.planks,8:TEX.glass,9:TEX.brick}[id]):TEX.dirt;
  g.drawImage(t.image,0,0,32,32); return c;
}
function renderHotbar(){
  const bar=document.getElementById('hotbar'); bar.innerHTML='';
  HOTBAR.forEach((id,i)=>{
    const d=document.createElement('div'); d.className='slot'+(id===selected?' selected':'');
    d.appendChild(iconURL(id));
    const s=document.createElement('span'); s.textContent=i+1; d.appendChild(s);
    const n=document.createElement('em'); n.textContent=BLOCKS[id].name.split(' ')[0]; d.appendChild(n);
    d.onclick=()=>{selected=id; renderHotbar();};
    bar.appendChild(d);
  });
}
let toastT=null;
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1800); }
document.getElementById('regen-btn').onclick=()=>{ seed=(Math.random()*1e9)|0; document.getElementById('seed-input').value=seed; genWorld(seed); rebuild(); spawn(); toast('🌍 New world #'+seed); };
document.getElementById('seed-input').onchange=(e)=>{ genWorld(+e.target.value||1); rebuild(); spawn(); };

// ---------- touch ----------
const stick=document.getElementById('stick'), knob=document.getElementById('stick-knob');
let mv={x:0,y:0}, stickId=null;
stick?.addEventListener('touchstart',e=>{stickId=e.changedTouches[0].identifier;},{passive:true});
addEventListener('touchmove',e=>{
  for(const t of e.changedTouches){
    if(t.identifier===stickId){ const r=stick.getBoundingClientRect();
      let dx=(t.clientX-(r.left+60))/45, dy=(t.clientY-(r.top+60))/45;
      const l=Math.hypot(dx,dy)||1; dx/=Math.max(1,l); dy/=Math.max(1,l); mv={x:dx,y:dy};
      knob.style.left=(35+dx*32)+'px'; knob.style.top=(35+dy*32)+'px'; }
  }
},{passive:true});
addEventListener('touchend',e=>{ for(const t of e.changedTouches) if(t.identifier===stickId){stickId=null;mv={x:0,y:0};knob.style.left='35px';knob.style.top='35px';} });
let lookId=null,lx=0,ly=0;
addEventListener('touchstart',e=>{ for(const t of e.changedTouches){ if(t.clientX>innerWidth*0.4&&t.target===canvas){lookId=t.identifier;lx=t.clientX;ly=t.clientY;} } },{passive:true});
addEventListener('touchmove',e=>{ for(const t of e.changedTouches) if(t.identifier===lookId){ player.yaw-=(t.clientX-lx)*0.006; player.pitch=Math.max(-1.55,Math.min(1.55,player.pitch-(t.clientY-ly)*0.006)); lx=t.clientX;ly=t.clientY; } },{passive:true});
addEventListener('touchend',e=>{ for(const t of e.changedTouches) if(t.identifier===lookId) lookId=null; });
document.querySelectorAll('#touch-btns button').forEach(b=>b.onclick=()=>{
  const a=b.dataset.act;
  if(a==='fly'){player.fly=!player.fly;badge();}
  if(a==='jump'){ if(player.onGround) player.vel.y=8.5; else if(player.fly) player.pos.y+=1; }
  if(a==='break'||a==='place'){ if(!target) return;
    const s=targetNormal.x*0.5*(a==='break'?-1:1), sy=targetNormal.y*0.5*(a==='break'?-1:1), sz=targetNormal.z*0.5*(a==='break'?-1:1);
    const dx=Math.round(target.point.x+s+WORLD/2-0.5), dy=Math.floor(target.point.y+sy+0.0001), dz=Math.round(target.point.z+sz+WORLD/2-0.5);
    setB(dx,dy,dz,a==='break'?0:selected); rebuild(); }
});

// ---------- loop ----------
const clock=new THREE.Clock();
let fpsA=60, frames=0, fpsT=0, dayT=0.35;
function tick(){
  requestAnimationFrame(tick);
  const dt=Math.min(0.05,clock.getDelta());
  // movement
  const sp=player.fly?14:(keys.ShiftLeft?7:4.5);
  const f=(keys.KeyW?1:0)-(keys.KeyS?1:0)-mv.y, s=(keys.KeyD?1:0)-(keys.KeyA?1:0)+mv.x;
  const sin=Math.sin(player.yaw), cos=Math.cos(player.yaw);
  let mx=(-sin*f+cos*s), mz=(-cos*f-sin*s);
  const l=Math.hypot(mx,mz); if(l>1){mx/=l;mz/=l;}
  if(player.fly){
    player.vel.x=mx*sp; player.vel.z=mz*sp;
    player.vel.y=((keys.Space?1:0)-(keys.ShiftLeft||keys.KeyC?1:0))*10;
    player.pos.x+=player.vel.x*dt; player.pos.z+=player.vel.z*dt; player.pos.y+=player.vel.y*dt;
    // simple fly collision: revert if inside solid
    player.pos.y=Math.max(1,Math.min(60,player.pos.y));
  } else {
    player.vel.x=mx*sp; player.vel.z=mz*sp;
    player.vel.y-=26*dt;
    if(keys.Space&&player.onGround){player.vel.y=8.8;player.onGround=false;}
    player.onGround=false;
    player.pos.x+=player.vel.x*dt; collideAxis('x');
    player.pos.z+=player.vel.z*dt; collideAxis('z');
    player.pos.y+=player.vel.y*dt; collideAxis('y');
    if(player.pos.y<-10) spawn();
  }
  camera.position.set(player.pos.x, player.pos.y+1.62, player.pos.z);
  camera.rotation.set(0,0,0); camera.rotation.order='YXZ';
  camera.rotation.y=player.yaw; camera.rotation.x=player.pitch;
  // clouds drift
  cloudGroup.position.x=(performance.now()*0.0008)%20;
  // day cycle (slow)
  dayT+=dt*0.002; if(dayT>1)dayT=0;
  const ang=dayT*Math.PI*2;
  sun.position.set(player.pos.x+Math.cos(ang)*60, Math.sin(ang)*60+10, player.pos.z+20);
  const day=Math.max(0,Math.sin(ang));
  scene.background.setHSL(0.58,0.6,0.12+day*0.5);
  scene.fog.color.copy(scene.background);
  hemi.intensity=0.35+day*0.6; sun.intensity=0.2+day*1.5;
  updateTarget();
  renderer.render(scene,camera);
  // hud
  frames++; fpsT+=dt; if(fpsT>0.5){ fpsA=Math.round(frames/fpsT); frames=0; fpsT=0;
    document.getElementById('fps').textContent=fpsA+' FPS';
    document.getElementById('coords').textContent=`${player.pos.x.toFixed(0)}, ${player.pos.y.toFixed(0)}, ${player.pos.z.toFixed(0)} · ${blockCount} blocks`;
    document.getElementById('scene-ready').dataset.ready='true'; window.__sceneReady=true;
  }
}

addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });

// ---------- boot ----------
genWorld(seed); rebuild(); spawn(); renderHotbar(); badge();
if(groveAim){
  const dx=groveAim.x-WORLD/2-player.pos.x, dz=groveAim.z-WORLD/2-player.pos.z;
  player.yaw=Math.atan2(-dx,-dz)+0.22; player.pitch=-0.06;
} else { player.yaw=0.65; player.pitch=-0.08; }
tick();
