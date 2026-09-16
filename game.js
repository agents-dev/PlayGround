import * as THREE from 'three';

// ---------- helpers ----------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const wrapAngle=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a;};
const $=id=>document.getElementById(id);
window.addEventListener('error',e=>{const el=$('err');el.classList.remove('hidden');el.textContent='Error: '+(e.message||e.error);});

// ---------- constants ----------
const FW=50, FL=70, WALL_H=9, GOAL_W=14, GOAL_H=6, GOAL_D=7;
const BALL_R=1.55;
const MATCH_TIME=180, WIN_SCORE=5;
const GRAV=-24;

// ---------- audio ----------
let AC=null, muted=false;
function audio(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch{} } if(AC&&AC.state==='suspended')AC.resume(); return AC; }
function tone(f,d=0.15,type='square',vol=0.18,slide=0){
  if(muted)return; const ac=audio(); if(!ac)return;
  const o=ac.createOscillator(),g=ac.createGain(); o.type=type; o.frequency.value=f;
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),ac.currentTime+d);
  g.gain.value=vol; g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+d);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+d);
}
const sfx={
  count:()=>tone(440,0.12,'square',0.2),
  go:()=>tone(880,0.35,'square',0.25,400),
  goal:()=>{tone(220,0.7,'sawtooth',0.25,660);setTimeout(()=>tone(330,0.7,'sawtooth',0.22,660),120);setTimeout(()=>tone(440,0.9,'sawtooth',0.22,440),240);},
  bounce:(v=0.1)=>tone(140+v*8,0.08,'sine',clamp(v*0.02,0.02,0.2)),
  pad:()=>tone(660,0.18,'sine',0.2,660),
  jump:()=>tone(300,0.15,'square',0.12,300),
  click:()=>tone(600,0.07,'square',0.15),
  whistle:()=>{tone(2000,0.25,'sine',0.15);setTimeout(()=>tone(2000,0.4,'sine',0.15),260);},
};

// ---------- input ----------
const keys={};
addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  keys[e.code]=true;
  if(e.code==='KeyM'){muted=!muted;}
  if(e.code==='KeyR'&&state==='play')resetKickoff(true);
});
addEventListener('keyup',e=>{keys[e.code]=false;});
function playerInput(){
  let throttle=0,steer=0;
  if(keys['KeyW']||keys['ArrowUp'])throttle+=1;
  if(keys['KeyS']||keys['ArrowDown'])throttle-=1;
  if(keys['KeyA']||keys['ArrowLeft'])steer+=1;
  if(keys['KeyD']||keys['ArrowRight'])steer-=1;
  if(touch.throttle!==0)throttle=touch.throttle;
  if(touch.steer!==0)steer=touch.steer;
  const boost=!!(keys['ShiftLeft']||keys['ShiftRight']||touch.boost);
  const jump=!!(keys['Space']||touch.jumpQueued);
  if(touch.jumpQueued)touch.jumpQueued=false;
  return {throttle,steer,boost,jump,jumpHeld:!!keys['Space']};
}
const touch={throttle:0,steer:0,boost:false,jumpQueued:false};
let jumpPressed=false;
addEventListener('keydown',e=>{if(e.code==='Space'&&!jumpPressed){jumpPressed=true;player._jumpBuf=0.18;}});
addEventListener('keyup',e=>{if(e.code==='Space')jumpPressed=false;});

// ---------- three setup ----------
const canvas=$('scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x070d20);
scene.fog=new THREE.Fog(0x070d20,90,220);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,0.1,500);
camera.position.set(0,8,-34);

scene.add(new THREE.HemisphereLight(0xbdd8ff,0x1a2b12,0.9));
const sun=new THREE.DirectionalLight(0xffffff,1.6);
sun.position.set(30,50,-20); sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;
scene.add(sun);
const blueGlow=new THREE.PointLight(0x2288ff,60,60); blueGlow.position.set(0,12,-FL/2-4); scene.add(blueGlow);
const orGlow=new THREE.PointLight(0xff7700,60,60); orGlow.position.set(0,12,FL/2+4); scene.add(orGlow);

// sky ring stadium
{
  const geo=new THREE.CylinderGeometry(85,85,30,24,1,true);
  const mat=new THREE.MeshBasicMaterial({color:0x0d1a3a,side:THREE.BackSide});
  const cyl=new THREE.Mesh(geo,mat); cyl.position.y=8; scene.add(cyl);
  // light ring
  const ringGeo=new THREE.TorusGeometry(80,1.2,8,48);
  const ringMat=new THREE.MeshBasicMaterial({color:0x00e5ff});
  const ring=new THREE.Mesh(ringGeo,ringMat); ring.rotation.x=Math.PI/2; ring.position.y=22; scene.add(ring);
  const ring2=ring.clone(); ring2.material=new THREE.MeshBasicMaterial({color:0xff9a00}); ring2.position.y=18; ring2.scale.setScalar(0.92); scene.add(ring2);
}

// ---------- field ----------
function fieldTexture(){
  const c=document.createElement('canvas'); c.width=512; c.height=720;
  const g=c.getContext('2d');
  g.fillStyle='#2a9d3f'; g.fillRect(0,0,512,720);
  // mow stripes
  for(let i=0;i<12;i++){ if(i%2)continue; g.fillStyle='rgba(255,255,255,0.06)'; g.fillRect(0,i*60,512,60); }
  g.strokeStyle='rgba(255,255,255,0.9)'; g.lineWidth=6;
  g.strokeRect(24,24,464,672);
  g.beginPath(); g.moveTo(24,360); g.lineTo(488,360); g.stroke();
  g.beginPath(); g.arc(256,360,80,0,Math.PI*2); g.stroke();
  g.beginPath(); g.arc(256,140,10,0,Math.PI*2); g.fillStyle='#fff'; g.fill();
  g.beginPath(); g.arc(256,580,10,0,Math.PI*2); g.fill();
  // center glow
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}
{
  const geo=new THREE.PlaneGeometry(FW,FL);
  const mat=new THREE.MeshStandardMaterial({map:fieldTexture(),roughness:0.9,metalness:0.05});
  const m=new THREE.Mesh(geo,mat); m.rotation.x=-Math.PI/2; m.receiveShadow=true; scene.add(m);
  // outer apron
  const apron=new THREE.Mesh(new THREE.PlaneGeometry(FW+30,FL+30),new THREE.MeshStandardMaterial({color:0x0e1a33,roughness:1}));
  apron.rotation.x=-Math.PI/2; apron.position.y=-0.05; apron.receiveShadow=true; scene.add(apron);
}
function addWall(w,h,d,x,y,z,color,opacity=0.28){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,transparent:true,opacity,roughness:0.2,metalness:0.1,emissive:color,emissiveIntensity:0.25}));
  m.position.set(x,y,z); scene.add(m);
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.5}));
  e.position.copy(m.position); scene.add(e); return m;
}
// side + back walls (leave goal mouth open on back walls)
addWall(2,WALL_H,FL,-FW/2-1,WALL_H/2,0,0x00c6ff);
addWall(2,WALL_H,FL,FW/2+1,WALL_H/2,0,0xff9a00);
// back wall segments
for(const sz of [-1,1]){
  const segW=(FW-GOAL_W)/2;
  addWall(segW,WALL_H,2,-(GOAL_W/2+segW/2),WALL_H/2,sz*(FL/2+1),sz<0?0x2288ff:0xff7700);
  addWall(GOAL_W,Math.max(0.5,WALL_H-GOAL_H),2,0,GOAL_H+(WALL_H-GOAL_H)/2,sz*(FL/2+1),0xffffff,0.15);
}
// goal boxes
function makeGoal(sz, color){
  const grp=new THREE.Group();
  const postMat=new THREE.MeshStandardMaterial({color:0xffffff,emissive:color,emissiveIntensity:0.9});
  const pg=new THREE.CylinderGeometry(0.28,0.28,GOAL_H,12);
  for(const sx of [-GOAL_W/2,GOAL_W/2]){const p=new THREE.Mesh(pg,postMat);p.position.set(sx,GOAL_H/2,0);p.castShadow=true;grp.add(p);}
  const cross=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,GOAL_W+0.5,12),postMat);
  cross.rotation.z=Math.PI/2; cross.position.set(0,GOAL_H,0); grp.add(cross);
  const netMat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.22,wireframe:true});
  const net=new THREE.Mesh(new THREE.BoxGeometry(GOAL_W,GOAL_H,GOAL_D),netMat);
  net.position.set(0,GOAL_H/2,sz*GOAL_D/2); grp.add(net);
  grp.position.set(0,0,sz*(FL/2+1)); scene.add(grp);
}
makeGoal(-1,0x2288ff); makeGoal(1,0xff7700);

// ---------- boost pads ----------
const pads=[];
{
  const spots=[[-14,-20],[14,-20],[-14,20],[14,20],[0,-8],[0,8],[-18,0],[18,0],[-8,-28],[8,28],[8,-28],[-8,28]];
  const geo=new THREE.CylinderGeometry(1.1,1.3,0.25,20);
  for(const [x,z] of spots){
    const mat=new THREE.MeshStandardMaterial({color:0xffc400,emissive:0xff9a00,emissiveIntensity:1.4});
    const m=new THREE.Mesh(geo,mat); m.position.set(x,0.15,z); scene.add(m);
    const glow=new THREE.PointLight(0xffb300,6,10); glow.position.set(x,1.2,z); scene.add(glow);
    pads.push({x,z,mesh:m,glow,cool:0});
  }
}

// ---------- cars ----------
function buildCar(color, glowColor){
  const g=new THREE.Group();
  const bodyMat=new THREE.MeshStandardMaterial({color,roughness:0.35,metalness:0.55});
  const body=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.75,3.4),bodyMat);
  body.position.y=0.75; body.castShadow=true; g.add(body);
  const nose=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.5,0.7),bodyMat);
  nose.position.set(0,0.6,2.0); nose.castShadow=true; g.add(nose);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.6,1.4),new THREE.MeshStandardMaterial({color:0x0b1526,roughness:0.15,metalness:0.8}));
  cab.position.set(0,1.35,-0.2); cab.castShadow=true; g.add(cab);
  const spoiler=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.12,0.5),new THREE.MeshStandardMaterial({color:0x111111,roughness:0.4,metalness:0.6}));
  spoiler.position.set(0,1.35,-1.85); g.add(spoiler);
  const wg=new THREE.CylinderGeometry(0.48,0.48,0.4,16);
  const wm=new THREE.MeshStandardMaterial({color:0x0a0a0a,roughness:0.9});
  const hm=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.3,metalness:0.8});
  const wheels=[];
  for(const [x,z] of [[-1.05,1.15],[1.05,1.15],[-1.05,-1.15],[1.05,-1.15]]){
    const w=new THREE.Mesh(wg,wm); w.rotation.z=Math.PI/2; w.position.set(x,0.48,z); w.castShadow=true; g.add(w);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.42,10),hm); hub.rotation.z=Math.PI/2; hub.position.copy(w.position); g.add(hub);
    wheels.push(w);
  }
  const hl=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.22,0.1),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:2}));
  hl.position.set(0,0.75,2.36); g.add(hl);
  const under=new THREE.PointLight(glowColor,10,9); under.position.set(0,0.4,0); g.add(under);
  const flame=new THREE.Mesh(new THREE.ConeGeometry(0.55,2.4,12),new THREE.MeshBasicMaterial({color:0x55ccff,transparent:true,opacity:0.9}));
  flame.rotation.x=-Math.PI/2; flame.position.set(0,0.75,-2.9); flame.visible=false; g.add(flame);
  const flame2=new THREE.Mesh(new THREE.ConeGeometry(0.3,1.6,10),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.95}));
  flame2.rotation.x=-Math.PI/2; flame2.position.set(0,0.75,-2.8); flame2.visible=false; g.add(flame2);
  scene.add(g);
  return {group:g,wheels,flame,flame2,under};
}
function makeCarMeta(color,glow,isAI){
  const v=buildCar(color,glow);
  return {...v,isAI,pos:v.group.position,vel:new THREE.Vector3(),yaw:0,vy:0,grounded:true,jumps:0,boost:100,speedFwd:0,steerVis:0,_jumpBuf:0,_jumpCool:0,hitCool:0,trail:[]};
}
const player=makeCarMeta(0x1a6bff,0x3399ff,false);
const ai=makeCarMeta(0xff6a00,0xff8800,true);

// ---------- ball ----------
const ballMesh=new THREE.Mesh(new THREE.SphereGeometry(BALL_R,28,20),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.35,metalness:0.15,emissive:0x222222,emissiveIntensity:0.2}));
ballMesh.castShadow=true; scene.add(ballMesh);
const ball={pos:ballMesh.position,vel:new THREE.Vector3(),spin:new THREE.Vector3(1,0,0)};
ball.pos.set(0,5,0);
// ball glow + trail
const ballLight=new THREE.PointLight(0xffffff,12,18); scene.add(ballLight);
const trailPts=[];
const trailGeo=new THREE.BufferGeometry();
const trailMat=new THREE.PointsMaterial({color:0x88ddff,size:0.5,transparent:true,opacity:0.7});
const trail=new THREE.Points(trailGeo,trailMat); scene.add(trail);

// ---------- particles ----------
const parts=[];
function burst(p,n,color,speed=14,life=1.1,size=0.5){
  for(let i=0;i<n;i++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(size,size,size),new THREE.MeshBasicMaterial({color}));
    m.position.copy(p);
    const v=new THREE.Vector3((Math.random()-0.5)*speed,Math.random()*speed*0.9,(Math.random()-0.5)*speed);
    parts.push({m,v,life:life*(0.6+Math.random()*0.7),age:0});
    scene.add(m);
  }
}
function updateParts(dt){
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i]; p.age+=dt;
    p.v.y+=GRAV*0.5*dt; p.m.position.addScaledVector(p.v,dt);
    p.m.rotation.x+=dt*5; p.m.rotation.y+=dt*4;
    if(p.m.position.y<0.2){p.m.position.y=0.2;p.v.y*=-0.5;}
    const t=1-p.age/p.life; p.m.scale.setScalar(Math.max(0.01,t));
    if(p.age>=p.life){scene.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();parts.splice(i,1);}
  }
}

// ---------- game state ----------
let state='menu', scoreB=0, scoreO=0, timeLeft=MATCH_TIME, countT=0, goalT=0, shake=0, endShown=false;
const fwdOf=yaw=>new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));

function resetPositions(){
  player.pos.set(0,0.6,-25); player.yaw=0; player.vel.set(0,0,0); player.vy=0; player.boost=100; player.grounded=true; player.jumps=0;
  ai.pos.set(0,0.6,25); ai.yaw=Math.PI; ai.vel.set(0,0,0); ai.vy=0; ai.boost=100; ai.grounded=true; ai.jumps=0;
  ball.pos.set(0,4,0); ball.vel.set(0,0,0);
  syncMesh(player); syncMesh(ai);
}
function syncMesh(c){ c.group.position.copy(c.pos); c.group.position.y=c.pos.y; c.group.rotation.y=c.yaw; }
function resetKickoff(quick=false){
  resetPositions();
  if(state==='play'||quick){ state='countdown'; countT=quick?1.2:3.2; $('countdown').classList.remove('hidden'); }
  updateHUD();
}
function startMatch(){
  audio(); sfx.click();
  scoreB=0;scoreO=0;timeLeft=MATCH_TIME;endShown=false;
  $('menu').classList.add('hidden');$('endscreen').classList.add('hidden');$('hud').classList.remove('hidden');
  if(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))$('touch').classList.remove('hidden');
  resetKickoff(false); state='countdown'; countT=3.2;
}
$('play-btn').onclick=startMatch;
$('again-btn').onclick=startMatch;

function fmt(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function updateHUD(){
  $('score-blue').textContent=scoreB; $('score-orange').textContent=scoreO;
  $('timer').textContent=fmt(timeLeft);
  $('boost-fill').style.width=clamp(player.boost,0,100)+'%';
  $('speed-val').textContent=Math.round(player.speedFwd*7.2);
}

// ---------- physics ----------
function stepCar(c,inp,dt){
  const fwd=fwdOf(c.yaw);
  const fSpeed=c.vel.dot(fwd);
  c.speedFwd=fSpeed;
  const boosting=inp.boost&&c.boost>0&&inp.throttle>0;
  const maxS=boosting?36:25;
  const accel=boosting?42:(inp.throttle<0&&fSpeed>2?30:24);
  let newF=fSpeed+inp.throttle*accel*dt;
  if(!boosting)newF-=newF*0.55*dt;
  else newF-=newF*0.25*dt;
  if(inp.throttle===0)newF-=newF*1.4*dt;
  newF=clamp(newF,-13,maxS);
  // lateral grip
  const lat=c.vel.clone().addScaledVector(fwd,-fSpeed).multiplyScalar(Math.exp(-8*dt));
  c.vel.copy(fwd).multiplyScalar(newF).add(lat);
  // steering
  const sf=clamp(Math.abs(newF)/8,0,1)*(newF<-1?-1:1);
  const rate=2.4*(1-clamp(Math.abs(newF)/50,0,0.45));
  c.yaw+=inp.steer*rate*sf*dt;
  c.steerVis=lerp(c.steerVis,inp.steer,dt*10);
  if(boosting){c.boost=Math.max(0,c.boost-32*dt);burst(c.pos.clone().add(new THREE.Vector3(0,0.7,0)).addScaledVector(fwd,-2),2,Math.random()<0.5?0x33ccff:0xffaa00,6,0.4,0.3);}
  c.flame.visible=c.flame2.visible=boosting;
  if(boosting){c.flame.scale.set(1,0.8+Math.random()*0.5,1);}
  // walls
  const inMouth=Math.abs(c.pos.x)<GOAL_W/2-1;
  const limX=FW/2-1.4, limZ=FL/2-1.4;
  if(Math.abs(c.pos.x)>limX){c.pos.x=Math.sign(c.pos.x)*limX;const n=new THREE.Vector3(-Math.sign(c.pos.x),0,0);const vn=c.vel.dot(n);if(vn<0)c.vel.addScaledVector(n,-vn*1.4);}
  if(Math.abs(c.pos.z)>limZ){
    if(!(inMouth&&c.pos.y<GOAL_H)){c.pos.z=Math.sign(c.pos.z)*limZ;const n=new THREE.Vector3(0,0,-Math.sign(c.pos.z));const vn=c.vel.dot(n);if(vn<0)c.vel.addScaledVector(n,-vn*1.4);}
    else if(Math.abs(c.pos.z)>limZ+GOAL_D-1.5){c.pos.z=Math.sign(c.pos.z)*(limZ+GOAL_D-1.5);c.vel.z*=-0.4;}
  }
  // jump / gravity
  c._jumpBuf-=dt; c._jumpCool-=dt; c.hitCool-=dt;
  if(inp.jump&&c._jumpBuf<=0){/* edge via buffer */}
  if(c._jumpBuf>0&&c._jumpCool<=0){
    if(c.grounded){c.vy=9;c.grounded=false;c.jumps=1;sfx.jump();c._jumpCool=0.25;}
    else if(c.jumps<2){ // flip
      c.vy=7;c.vel.addScaledVector(fwd,9);c.jumps=2;sfx.jump();
      burst(c.pos,10,0xffffff,8,0.5,0.3);
    }
    c._jumpBuf=0;
  }
  if(!c.grounded||c.pos.y>0.61){
    c.vy+=GRAV*dt; c.pos.y+=c.vy*dt;
    if(c.pos.y<=0.6){c.pos.y=0.6;c.vy=0;c.grounded=true;c.jumps=0;}
    else c.grounded=false;
  }
  c.pos.addScaledVector(c.vel,dt);
  // wheels spin + steer tilt
  for(const w of c.wheels)w.rotation.x+=newF*dt*1.8;
  c.group.position.copy(c.pos); c.group.rotation.y=c.yaw;
  c.group.rotation.z=lerp(c.group.rotation.z,-c.steerVis*0.08,0.2);
  c.group.rotation.x=lerp(c.group.rotation.x,clamp(-c.vy*0.015,-0.2,0.2),0.2);
  // pads
  for(const p of pads){
    if(p.cool>0)continue;
    const dx=c.pos.x-p.x,dz=c.pos.z-p.z;
    if(dx*dx+dz*dz<5.5){c.boost=Math.min(100,c.boost+32);p.cool=7;p.mesh.material.emissiveIntensity=0.1;p.glow.intensity=0;if(!c.isAI)sfx.pad();burst(new THREE.Vector3(p.x,1,p.z),12,0xffc400,8,0.6,0.35);}
  }
}
// buffer player jump on key edge
setInterval(()=>{ if(playerInputCache.jump&&state==='play')player._jumpBuf=0.18; },16);
let playerInputCache={throttle:0,steer:0,boost:false,jump:false};

function stepBall(dt){
  ball.vel.y+=GRAV*dt;
  ball.vel.multiplyScalar(1-0.12*dt);
  if(Math.abs(ball.vel.x)<0.02)ball.vel.x=0;
  ball.pos.addScaledVector(ball.vel,dt);
  // ground
  if(ball.pos.y<BALL_R){
    ball.pos.y=BALL_R;
    if(ball.vel.y<-2)sfx.bounce(Math.abs(ball.vel.y));
    ball.vel.y*=-0.68;
    if(Math.abs(ball.vel.y)<1.2)ball.vel.y=0;
    ball.vel.x*=0.985;ball.vel.z*=0.985;
    // Magnus-ish rolling
    ball.spin.lerp(new THREE.Vector3(ball.vel.z,-0,-ball.vel.x).multiplyScalar(0.4),dt*3);
  }
  // side walls
  if(Math.abs(ball.pos.x)>FW/2-BALL_R){ball.pos.x=Math.sign(ball.pos.x)*(FW/2-BALL_R);ball.vel.x*=-0.78;sfx.bounce(Math.abs(ball.vel.x));}
  // back walls with goal mouth
  const mouth=Math.abs(ball.pos.x)<GOAL_W/2-0.3&&ball.pos.y<GOAL_H-0.2;
  if(Math.abs(ball.pos.z)>FL/2-BALL_R){
    if(!mouth){ball.pos.z=Math.sign(ball.pos.z)*(FL/2-BALL_R);ball.vel.z*=-0.78;sfx.bounce(Math.abs(ball.vel.z));}
  }
  // goal box inner walls
  if(Math.abs(ball.pos.z)>FL/2){
    if(ball.pos.x>GOAL_W/2-BALL_R||ball.pos.x<-GOAL_W/2+BALL_R){
      // posts bounce
      ball.vel.x*=-0.7; ball.pos.x=clamp(ball.pos.x,-GOAL_W/2+BALL_R,GOAL_W/2-BALL_R);
      burst(ball.pos,8,0xffffff,8,0.5,0.3); tone(900,0.1,'square',0.15);
    }
    if(ball.pos.y>GOAL_H-BALL_R*0.5&&ball.pos.z<FL/2+GOAL_D){ball.pos.y=GOAL_H-BALL_R*0.5;ball.vel.y*=-0.6;}
    if(Math.abs(ball.pos.z)>FL/2+GOAL_D-BALL_R){ball.pos.z=Math.sign(ball.pos.z)*(FL/2+GOAL_D-BALL_R);ball.vel.z*=-0.4;}
  }
  if(ball.pos.y>32){ball.pos.y=32;ball.vel.y*=-0.5;}
  ballMesh.rotation.x+=ball.spin.x*dt+ball.vel.z*dt*0.5;
  ballMesh.rotation.z+=-ball.vel.x*dt*0.5;
  ballLight.position.copy(ball.pos).add(new THREE.Vector3(0,2,0));
  // trail
  trailPts.push(ball.pos.x,ball.pos.y,ball.pos.z);
  if(trailPts.length>300)trailPts.splice(0,3);
  trailGeo.setAttribute('position',new THREE.Float32BufferAttribute(trailPts,3));
}

function collideCarBall(c,power=1){
  const toBall=ball.pos.clone().sub(c.pos); toBall.y*=0.6;
  const d=toBall.length();
  const minD=BALL_R+1.9;
  if(d<minD&&c.hitCool<=0){
    const n=toBall.normalize();
    ball.pos.copy(c.pos).addScaledVector(n,minD); ball.pos.y=Math.max(ball.pos.y,BALL_R);
    const fwd=fwdOf(c.yaw);
    const carSpeed=c.vel.length();
    const noseBoost=clamp(fwd.dot(n),0,1);
    const hit=8+carSpeed*(0.9+noseBoost*1.1)+(c.vel.dot(n)>0?c.vel.dot(n)*0.6:0);
    ball.vel.addScaledVector(n,hit*power);
    ball.vel.y+=2.2+noseBoost*3+(c.grounded?0:2);
    if(c.boost>0&&playerInputCache.boost&&!c.isAI)ball.vel.addScaledVector(n,4);
    c.vel.addScaledVector(n,-2);
    c.hitCool=0.08;
    if(hit>14){burst(ball.pos,14,0xffffff,10,0.6,0.35);shake=Math.min(0.7,shake+0.3);tone(200+hit*10,0.12,'square',0.2);}
    else sfx.bounce(hit);
  }
}

// ---------- AI ----------
let aiThink=0, aiJumpCool=0, aiTarget=new THREE.Vector3();
function stepAI(dt){
  aiThink-=dt; aiJumpCool-=dt;
  // decide target: point behind ball relative to player's goal
  const attackGoal=new THREE.Vector3(0,0,-FL/2); // AI attacks -Z (player goal)
  const defendGoal=new THREE.Vector3(0,0,FL/2);
  const ballToAttack=attackGoal.clone().sub(ball.pos).normalize();
  let target;
  if(ball.pos.z>-8){ // ball on AI half or mid -> attack
    target=ball.pos.clone().addScaledVector(ballToAttack,-3.2); target.y=0.6;
  }else{ // ball near AI goal -> clear or defend
    if(ball.vel.z<-4)target=ball.pos.clone();
    else target=ball.pos.clone().addScaledVector(ballToAttack,-3.2);
  }
  // if AI is between ball and its own goal and too close, go around: add offset
  const aiBehind=(ai.pos.z-ball.pos.z)>0; // AI on its goal side?
  if(aiBehind&&Math.abs(ai.pos.x-ball.pos.x)<4){
    target.x=ball.pos.x+(ai.pos.x>=ball.pos.x?4:-4);
  }
  // recovery: if flipped far from ball go to mid
  aiTarget.lerp(target,1-Math.exp(-3*dt));
  const dx=aiTarget.x-ai.pos.x, dz=aiTarget.z-ai.pos.z;
  const desired=Math.atan2(dx,dz);
  const diff=wrapAngle(desired-ai.yaw);
  const dist=Math.hypot(dx,dz);
  const steer=clamp(diff*2.8,-1,1);
  const throttle=dist<2?0.2:(Math.abs(diff)>2.2?-0.6:1);
  const boost=Math.abs(diff)<0.4&&dist>12&&ai.boost>20;
  let jump=false;
  if(ball.pos.y>2.6&&dist<5&&aiJumpCool<=0&&Math.abs(diff)<0.6){jump=true;aiJumpCool=1.4;}
  // unstuck
  if(ai.vel.length()<2&&dist>6)ai._jumpBuf=0;
  if(jump)ai._jumpBuf=0.18;
  stepCar(ai,{throttle,steer,boost,jump:false},dt);
}

// ---------- goals / flow ----------
function onGoal(byBlue){
  if(byBlue)scoreB++;else scoreO++;
  sfx.goal();
  const b=$('goal-banner'); b.classList.remove('hidden');
  b.querySelector('span').textContent='GOAL!';
  $('goal-sub').textContent=byBlue?'BLUE SCORES':'ORANGE SCORES';
  $('goal-sub').style.color=byBlue?'#7adcff':'#ffb300';
  burst(ball.pos.clone(),160,byBlue?0x2299ff:0xff8800,20,1.6,0.55);
  burst(ball.pos.clone(),80,0xffffff,16,1.2,0.4);
  burst(ball.pos.clone(),60,0xffde00,14,1.4,0.45);
  shake=1.2; state='goal'; goalT=2.6;
  updateHUD();
  if(scoreB>=WIN_SCORE||scoreO>=WIN_SCORE)goalT=2.6;
}
function checkGoal(){
  if(state!=='play')return;
  if(ball.pos.z>FL/2+1.2&&Math.abs(ball.pos.x)<GOAL_W/2&&ball.pos.y<GOAL_H)onGoal(true);
  else if(ball.pos.z<-FL/2-1.2&&Math.abs(ball.pos.x)<GOAL_W/2&&ball.pos.y<GOAL_H)onGoal(false);
}
function endMatch(){
  state='ended'; sfx.whistle();
  $('endscreen').classList.remove('hidden');
  const r=$('end-result');
  if(scoreB>scoreO){r.textContent='🏆 BLUE WINS!';r.style.color='#4dd2ff';}
  else if(scoreO>scoreB){r.textContent='ORANGE WINS';r.style.color='#ff9a00';}
  else{r.textContent='DRAW!';r.style.color='#fff';}
  $('end-score').textContent=`${scoreB} – ${scoreO}`;
  $('touch').classList.add('hidden');
}

// ---------- camera ----------
const camPos=new THREE.Vector3(0,9,-36), camLook=new THREE.Vector3();
function stepCamera(dt){
  const fwd=fwdOf(player.yaw);
  const want=player.pos.clone().addScaledVector(fwd,-9.5).add(new THREE.Vector3(0,4.6,0));
  // keep inside arena-ish
  want.x=clamp(want.x,-FW/2-14,FW/2+14); want.z=clamp(want.z,-FL/2-16,FL/2+16); want.y=clamp(want.y,2.5,16);
  camPos.lerp(want,1-Math.exp(-5*dt));
  const lookT=player.pos.clone().addScaledVector(fwd,7).lerp(ball.pos,0.42); lookT.y=Math.max(1.2,lookT.y*0.7+1);
  camLook.lerp(lookT,1-Math.exp(-7*dt));
  camera.position.copy(camPos);
  if(shake>0){camera.position.x+=(Math.random()-0.5)*shake;camera.position.y+=(Math.random()-0.5)*shake*0.6;shake-=dt*1.6;}
  camera.lookAt(camLook);
  const targetFov=playerInputCache.boost&&player.boost>0&&Math.abs(player.speedFwd)>18?76:68;
  camera.fov=lerp(camera.fov,targetFov,dt*4); camera.updateProjectionMatrix();
}

// ---------- touch ----------
{
  const stick=$('stick'),knob=$('stick-knob');
  let sid=null,cx=0,cy=0;
  const setKnob=(dx,dy)=>{knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;};
  stick.addEventListener('pointerdown',e=>{sid=e.pointerId;cx=e.clientX;cy=e.clientY;stick.setPointerCapture(sid);});
  stick.addEventListener('pointermove',e=>{
    if(e.pointerId!==sid)return;
    let dx=e.clientX-cx,dy=e.clientY-cy;
    const m=Math.hypot(dx,dy),max=46;
    if(m>max){dx*=max/m;dy*=max/m;}
    setKnob(dx,dy);
    touch.steer=clamp(-dx/30,-1,1); touch.throttle=clamp(-dy/30,-1,1);
  });
  const end=e=>{if(e.pointerId===sid){sid=null;setKnob(0,0);touch.steer=0;touch.throttle=0;}};
  stick.addEventListener('pointerup',end); stick.addEventListener('pointercancel',end);
  const bB=$('btn-boost'),bJ=$('btn-jump');
  bB.addEventListener('pointerdown',e=>{e.preventDefault();touch.boost=true;});
  bB.addEventListener('pointerup',()=>touch.boost=false);
  bJ.addEventListener('pointerdown',e=>{e.preventDefault();touch.jumpQueued=true;player._jumpBuf=0.18;});
}

// ---------- main loop ----------
const clock=new THREE.Clock();
let msgT=0;
function showMsg(t,dur=2){const e=$('center-msg');e.textContent=t;e.classList.remove('hidden');msgT=dur;}
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),0.033);
  playerInputCache=playerInput();
  if(playerInputCache.jump)player._jumpBuf=0.18;

  if(state==='countdown'){
    countT-=dt;
    const n=Math.ceil(countT);
    const el=$('countdown');
    if(countT>0.2){el.textContent=n>3?'GO!':n; if(el.dataset.l!==String(n)){el.dataset.l=String(n);sfx.count();}}
    else{el.textContent='GO!';sfx.go();showMsg('KICKOFF!',1.2);}
    if(countT<=0){$('countdown').classList.add('hidden');state='play';}
    stepCamera(dt);
  } else if(state==='play'){
    timeLeft-=dt;
    stepCar(player,playerInputCache,dt);
    stepAI(dt);
    // car-car
    const d=player.pos.distanceTo(ai.pos);
    if(d<3.4){const n=player.pos.clone().sub(ai.pos).normalize();player.pos.addScaledVector(n,(3.4-d)/2);ai.pos.addScaledVector(n,-(3.4-d)/2);}
    stepBall(dt);
    collideCarBall(player); collideCarBall(ai,0.95);
    checkGoal();
    if(timeLeft<=0||scoreB>=WIN_SCORE||scoreO>=WIN_SCORE){
      if(scoreB>=WIN_SCORE||scoreO>=WIN_SCORE||timeLeft<=0)endMatch();
    }
    // pads cooldown visuals
    for(const p of pads){if(p.cool>0){p.cool-=dt;if(p.cool<=0){p.mesh.material.emissiveIntensity=1.4;p.glow.intensity=6;}}}
    stepCamera(dt);
    if(msgT>0){msgT-=dt;if(msgT<=0)$('center-msg').classList.add('hidden');}
    updateHUD();
  } else if(state==='goal'){
    goalT-=dt;
    // slow-mo celebration physics
    stepBall(dt*0.35);
    updateParts(dt);
    stepCamera(dt);
    if(goalT<=0){
      $('goal-banner').classList.add('hidden');
      if(scoreB>=WIN_SCORE||scoreO>=WIN_SCORE){endMatch();}
      else if(timeLeft<=0){endMatch();}
      else resetKickoff(true);
    }
  } else if(state==='ended'||state==='menu'){
    // idle orbit
    const t=performance.now()*0.0002;
    ball.pos.set(Math.sin(t*3)*4,4+Math.sin(t*7)*1.5,Math.cos(t*2)*4);
    ballMesh.rotation.x+=dt; ballMesh.rotation.y+=dt*0.7;
    camera.position.lerp(new THREE.Vector3(Math.sin(t)*46,16,Math.cos(t)*46),dt*2);
    camera.lookAt(0,1,0);
    if(state==='menu'){resetPositionsIdle(dt);}
  }
  updateParts(dt);
  // pads pulse
  const tt=performance.now()*0.004;
  for(const p of pads)if(p.cool<=0)p.mesh.position.y=0.15+Math.sin(tt+p.x)*0.07;
  renderer.render(scene,camera);
}
let idleT=0;
function resetPositionsIdle(dt){
  idleT+=dt;
  player.group.position.set(-6,0.6,-14+Math.sin(idleT)*1); player.group.rotation.y=Math.sin(idleT*0.5)*0.4;
  ai.group.position.set(6,0.6,14-Math.sin(idleT)*1); ai.group.rotation.y=Math.PI+Math.cos(idleT*0.5)*0.4;
  for(const w of [...player.wheels,...ai.wheels])w.rotation.x+=dt*2;
}
addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
renderer.setSize(innerWidth,innerHeight);
resetPositions();
updateHUD();
loop();
// expose for automated checks
window.__game={get state(){return state;},player,ai,ball,start:startMatch,get scores(){return [scoreB,scoreO];}};
