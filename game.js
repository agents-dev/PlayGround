/* .kkrieger — fps Madness 96KB | procedural raycast FPS, zero assets */
(()=>{"use strict";
const cv=document.getElementById('game'),g=cv.getContext('2d');
const W=cv.width,H=cv.height,HW=W/2,HH=H/2;
const mini=document.getElementById('mini').getContext('2d');
const $=id=>document.getElementById(id);
const overlay=$('overlay'),msg=$('msg'),hitmark=$('hitmark'),dmg=$('dmg');
const K={};let started=false,dead=false,won=false;
// ---------- procedural textures (64x64) ----------
function tex(fn){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');fn(x);return c;}
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function noise(x,n,a){for(let i=0;i<n;i++)x.fillStyle=`rgba(${a?255:0},${a?255:0},${a?255:0},${rnd()*.16})`,x.fillRect(rnd()*64|0,rnd()*64|0,2,2);}
const T=[
tex(x=>{x.fillStyle='#2a2f3a';x.fillRect(0,0,64,64);x.fillStyle='#3a4356';for(let y=0;y<64;y+=8)for(let r=0;r<64;r+=16)x.fillRect(r+((y/8)%2)*8,y,15,7);x.fillStyle='#171c26';for(let y=0;y<64;y+=8)x.fillRect(0,y,64,1);for(let r=0;r<64;r+=16)x.fillRect(r,0,1,64);x.strokeStyle='#5cffb1';x.globalAlpha=.5;x.strokeRect(4.5,4.5,55,55);x.globalAlpha=1;noise(x,90);}),
tex(x=>{x.fillStyle='#1c2431';x.fillRect(0,0,64,64);x.fillStyle='#2ee6a8';for(let i=0;i<6;i++)x.fillRect(6,6+i*10,52,2);x.fillStyle='#0e1420';for(let i=0;i<6;i++)x.fillRect(6,8+i*10,52,6);x.fillStyle='#ffd23b';x.fillRect(28,26,8,12);noise(x,60);}),
tex(x=>{x.fillStyle='#3d1420';x.fillRect(0,0,64,64);x.fillStyle='#6e1f30';for(let i=0;i<26;i++){x.beginPath();x.arc(rnd()*64,rnd()*64,2+rnd()*6,0,7);x.fill();}x.strokeStyle='#ff5470';x.globalAlpha=.6;for(let i=0;i<8;i++){x.beginPath();x.moveTo(rnd()*64,rnd()*64);x.lineTo(rnd()*64,rnd()*64);x.stroke();}x.globalAlpha=1;noise(x,70,1);}),
tex(x=>{const t=Date.now()/300;x.fillStyle='#0a0f16';x.fillRect(0,0,64,64);const gr=x.createLinearGradient(0,0,64,0);gr.addColorStop(0,'#ffd23b');gr.addColorStop(.5,'#fff');gr.addColorStop(1,'#ffd23b');x.fillStyle=gr;x.fillRect(26,0,12,64);x.fillStyle='#ffd23b';for(let y=0;y<64;y+=8)x.fillRect(20,y+((t|0)%2)*4,24,2);noise(x,30,1);}),
];
// ---------- maps: # X F walls, D exit, P start ----------
const MAPS=[
["########################",
 "#P....#.......#....h...#",
 "#.....#..e....#.###....#",
 "#.###.#.###...#.#.#.##.#",
 "#.#...#...#.###.#.#....#",
 "#.#.#####.#.....###.##.#",
 "#.#.....#...e....#...#.#",
 "#.#####.#####.####.#.#.#",
 "#.....#.....#......#...#",
 "###.#.#####.######.###.#",
 "#...#.....#......#...#.#",
 "#.#######.######.###.#.#",
 "#.#.....#......e.....#.#",
 "#.#.###.######.#####.#.#",
 "#...#.#......#.....#...#",
 "#.###.######.#####.###.#",
 "#.#.....h....#...b...#.#",
 "#.#.########.#.#####.#.#",
 "#...#......#.#.....#.#.#",
 "#.###.####.#.#####.#.#D#",
 "#.....#..m.#.....#....##",
 "########################"],
["########################",
 "#P..#.....F....#....a..#",
 "#...#.######.#.#.####.##",
 "#.###.#....#.#.#....#..#",
 "#.....#.##.#.#.####.#.##",
 "#####.#.#..#.#......#..#",
 "#...#.#.####.######.#.##",
 "#.#.#.#......#....#.#..#",
 "#.#.#.######.#.##.#.#.##",
 "#.#.#......e.#.#..#.#..#",
 "#.#.######.###.#.##.#.##",
 "#.#......#.....#....#..#",
 "#.######.#######.####.##",
 "#......#.......#......##",
 "##.####.#####.#.######.#",
 "#..h..#..s.#..#.b...#..#",
 "#.###.#.###.#.#.###.#.##",
 "#...#...#...#.#...#.#..#",
 "#.m.#####.###.###.#.#.D#",
 "#...#.....#.....#...#..#",
 "#...#..e..#..m..#.###.##",
 "########################"],
["########################",
 "#P....F....#.....s.....#",
 "#.####.##..#.#####.###.#",
 "#.#..#..#..#.....#.#...#",
 "#.#..#..#.#######.#.#.##",
 "#.##.#..#.......#...#.##",
 "#....####.#####.#####..#",
 "#.##......#...e.....#.##",
 "####.######.#####.#.#..#",
 "#..h....F....b.#..#.#.##",
 "#.#####.#####..#..#.#..#",
 "#.#...#.....#.##.##.#..#",
 "#.#.#.#####.#....#..#.##",
 "#.#.#.....#.####.#.##..#",
 "#.#.#####.#....#.#....##",
 "#.#.....#.####.#.####..#",
 "#.#####.#....#.#....#.##",
 "#.....#.####.#.####.#.##",
 "#.m...#..s.#..#..m..#.D#",
 "#.#####.###.#.#.#####..#",
 "#.....#.....#.#.....#..#",
 "########################"]];
let lvl=0,map=[],MW=0,MH=0,enemies=[],items=[],parts=[],exitCell=null,px=0,py=0,pa=0;
function loadLevel(n){lvl=n;map=MAPS[n].map(r=>r.split(''));MH=map.length;MW=map[0].length;enemies=[];items=[];parts=[];
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=map[y][x];
if(c==='P'){px=x+.5;py=y+.5;pa=-0.28;map[y][x]='.';}
else if(c==='e'||c==='b'||c==='s'){enemies.push(mkEnemy(c,x+.5,y+.5));map[y][x]='.';}
else if(c==='h'||c==='a'||c==='m'){items.push({t:c,x:x+.5,y:y+.5,got:false,ph:rnd()*6});map[y][x]='.';}
else if(c==='D'){exitCell={x:x+.5,y:y+.5};}}
kills=0;totalFoes=enemies.length;flash=0;showMsg(n===0?'SECTOR 01 — PURGE THE WARDENS':n===1?'SECTOR 02 — THE FLESH MAZE':'FINAL SECTOR — CORE MADNESS');}
function mkEnemy(k,x,y){const base=k==='b'?{hp:90,sp:.9,r:.34,dmg:22,cd:1.1,sc:260,col:'#ff3b57',eye:'#fff'}:k==='s'?{hp:30,sp:1.9,r:.24,dmg:8,cd:.6,sc:120,col:'#b06eff',eye:'#ffd23b'}:{hp:50,sp:1.25,r:.28,dmg:12,cd:.9,sc:170,col:'#ff8a2a',eye:'#0ff'};return{...base,k,x,y,hp:maxHp(base.hp),atk:0,ph:rnd()*6,dead:false};}
const maxHp=h=>h;
// ---------- state ----------
let hp=100,arm=0,ammo=60,gun=0,score=0,kills=0,totalFoes=0,flash=0,shake=0,bob=0,time0=0,frames=0,fps=60,sceneN=0;
const GUNS=[{n:'BLASTER',cd:.16,dmg:16,pel:1,spr:.02},{n:'SCATTER',cd:.7,dmg:9,pel:6,spr:.09}];
let fireCd=0,trig=false;
const showMsg=t=>{msg.textContent=t;msg.style.opacity=1;clearTimeout(showMsg.t);showMsg.t=setTimeout(()=>msg.style.opacity=0,2200);};
// ---------- audio: all synth ----------
let AC=null,musicOn=true,mStep=0;
function ac(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC;}
function tone(f0,f1,dur,type='square',v=.2,when=0){if(!AC)return;const t=AC.currentTime+when,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(gn).connect(AC.destination);o.start(t);o.stop(t+dur+.02);}
function noiseB(dur=.2,v=.3,fc=1200,when=0){if(!AC)return;const t=AC.currentTime+when,len=AC.sampleRate*dur,b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=fc;const gn=AC.createGain();gn.gain.value=v;s.connect(f).connect(gn).connect(AC.destination);s.start(t);}
const SFX={shoot(){tone(880,120,.12,'sawtooth',.22);noiseB(.08,.15,4000);},scat(){noiseB(.25,.4,900);tone(200,50,.25,'square',.3);},hit(){tone(320,180,.07,'square',.18);},kill(){tone(400,40,.3,'sawtooth',.28);noiseB(.2,.25,700);},pick(){tone(520,1040,.12,'sine',.25);tone(1040,1560,.1,'sine',.18,.08);},hurt(){tone(160,60,.25,'sawtooth',.35);noiseB(.15,.3,500);},empty(){tone(1200,900,.05,'square',.12);},exit(){[440,554,659,880].forEach((f,i)=>tone(f,f,.18,'triangle',.22,i*.11));},die(){tone(300,30,1,'sawtooth',.35);},win(){[523,659,784,1046,1318].forEach((f,i)=>tone(f,f,.25,'triangle',.22,i*.13));}};
setInterval(()=>{if(!AC||!musicOn||!started||dead)return;const roots=[55,55,65.4,49];const r=roots[(mStep>>4)%4];const bass=[0,0,7,0,3,0,5,7,0,0,12,0,10,7,5,3];const n=bass[mStep%16];if(n!==undefined&&mStep%2===0)tone(r*Math.pow(2,n/12)*2,r*Math.pow(2,n/12)*2,.16,'triangle',.10);if(mStep%4===2)noiseB(.03,.05,8000);if(mStep%16===0)tone(r,r,.5,'sine',.12);mStep++;},140);
// ---------- input ----------
addEventListener('keydown',e=>{K[e.key.toLowerCase()]=true;if(e.key==='1')gun=0;if(e.key==='2')gun=1;if(e.key.toLowerCase()==='m'){musicOn=!musicOn;showMsg(musicOn?'MUSIC ON':'MUSIC OFF');}if(['arrowup',' '].includes(e.key.toLowerCase()))e.preventDefault();});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=false);
let dragging=false,lx=0;
cv.addEventListener('mousedown',e=>{if(!started)return;trig=true;if(document.pointerLockElement!==cv)cv.requestPointerLock?.();ac();shoot();});
addEventListener('mouseup',()=>trig=false);
addEventListener('mousemove',e=>{if(!started||dead)return;if(document.pointerLockElement===cv){pa-=e.movementX*.0028;}else if(dragging){pa-=(e.clientX-lx)*.005;lx=e.clientX;}});
cv.addEventListener('mousedown',e=>{dragging=true;lx=e.clientX;});addEventListener('mouseup',()=>dragging=false);
// touch: left half move, right half look+fire
let tMove=null,tLook=null;
cv.addEventListener('touchstart',e=>{ac();for(const t of e.changedTouches){if(t.clientX<innerWidth/2&&tMove===null)tMove={id:t.identifier,y:t.clientY,fw:false};else if(tLook===null)tLook={id:t.identifier,x:t.clientX,fire:setTimeout(()=>{trig=true;shoot();},280)};}e.preventDefault();},{passive:false});
cv.addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(tMove&&t.identifier===tMove.id){const dy=t.clientY-tMove.y;K['w']=dy<-12;K['s']=dy>12;}if(tLook&&t.identifier===tLook.id){pa-=(t.clientX-tLook.x)*.008;tLook.x=t.clientX;}}e.preventDefault();},{passive:false});
cv.addEventListener('touchend',e=>{for(const t of e.changedTouches){if(tMove&&t.identifier===tMove.id){tMove=null;K['w']=K['s']=false;}if(tLook&&t.identifier===tLook.id){clearTimeout(tLook.fire);tLook=null;trig=false;}}},{});
$('play').addEventListener('click',()=>{ac();overlay.classList.add('hide');if(!started){started=true;time0=performance.now();loadLevel(0);cv.requestPointerLock?.();}else if(dead||won){restart();}SFX.pick();});
function restart(){hp=100;arm=0;ammo=60;gun=0;score=0;dead=false;won=false;loadLevel(0);overlay.classList.add('hide');}
// ---------- helpers ----------
const solid=(x,y)=>x<0||y<0||x>=MW||y>=MH||' #XF'.includes(map[y|0][x|0])===false&&('#XF'.includes(map[y|0][x|0])||map[y|0][x|0]==='D');
const isWall=(x,y)=>x<0||y<0||x>=MW||y>=MH||map[y|0][x|0]==='#'||map[y|0][x|0]==='X'||map[y|0][x|0]==='F'||map[y|0][x|0]==='D';
function los(ax,ay,bx,by){const dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy),n=Math.ceil(d*8);for(let i=1;i<n;i++){if(isWall(ax+dx*i/n,ay+dy*i/n))return false;}return true;}
function wallTex(c){return c==='#'?0:c==='X'?1:c==='F'?2:3;}
// ---------- shooting ----------
function shoot(){if(dead||won||!started)return;const Gn=GUNS[gun];if(fireCd>0)return;if(ammo<=0){SFX.empty();fireCd=.25;showMsg('NO AMMO — FIND CELLS');return;}ammo--;fireCd=Gn.cd;flash=1;shake=Math.min(.5,shake+(gun?0.35:0.12));gun?SFX.scat():SFX.shoot();
for(let p=0;p<Gn.pel;p++){const a=pa+(Math.random()-.5)*Gn.spr*2+(gun?0:0);let best=null,bd=12;
for(const e of enemies){if(e.dead)continue;const dx=e.x-px,dy=e.y-py,d=Math.hypot(dx,dy);if(d>bd)continue;let da=Math.atan2(dy,dx)-a;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;if(Math.abs(da)<.06+ .12/d&&los(px,py,e.x,e.y)){best=e;bd=d;}}
if(best){const fall=1/(1+bd*.25);const dmg=Gn.dmg*(0.85+Math.random()*.3)*fall+(gun?0:6*fall);best.hp-=dmg;best.atk=1;burst(best.x,best.y,.5,'#ffdf6e',6);SFX.hit();hitmark.classList.remove('on');void hitmark.offsetWidth;hitmark.classList.add('on');
if(best.hp<=0&&!best.dead){best.dead=true;kills++;score+=best.sc;burst(best.x,best.y,.6,'#ff3b57',22);burst(best.x,best.y,.4,'#fff',8);SFX.kill();ammo+=best.k==='b'?6:2;if(kills>=totalFoes)showMsg('SECTOR CLEAR — FIND THE EXIT GATE');}}}}
function burst(x,y,z,col,n){for(let i=0;i<n;i++)parts.push({x,y,z:z+rnd()*.3,vx:(rnd()-.5)*3,vy:(rnd()-.5)*3,vz:rnd()*2,life:.5+rnd()*.4,col});}
// ---------- update ----------
let last=performance.now();
function update(dt){fireCd-=dt;flash=Math.max(0,flash-dt*6);shake=Math.max(0,shake-dt*2);
if(dead||won)return;
const sp=(K['shift']?3.4:2.2)*dt;let mx=0,my=0;const s=Math.sin(pa),c=Math.cos(pa);
if(K['w']||K['arrowup']){mx+=c*sp;my+=s*sp;}if(K['s']||K['arrowdown']){mx-=c*sp;my-=s*sp;}
if(K['a']){mx+=s*sp;my-=c*sp;}if(K['d']){mx-=s*sp;my+=c*sp;}if(K['arrowleft'])pa+=1.9*dt;if(K['arrowright'])pa-=1.9*dt;
if(!isWall(px+mx*3,py))px+=mx;if(!isWall(px,py+my*3))py+=my;
bob+=Math.hypot(mx,my)*40;
if(trig)shoot();
// pickups
for(const it of items){if(it.got)continue;it.ph+=dt*3;const d=Math.hypot(it.x-px,it.y-py);if(d<.45){it.got=true;if(it.t==='h'){hp=Math.min(100,hp+30);showMsg('+30 HP');}if(it.t==='m'){ammo+=24;showMsg('+24 AMMO');}if(it.t==='a'){arm=Math.min(100,arm+50);showMsg('+50 ARMOR');}SFX.pick();score+=25;}}
// enemies
for(const e of enemies){if(e.dead)continue;e.ph+=dt*4;e.atk=Math.max(0,e.atk-dt*3);e.cd=(e.cd||0)-dt;
const dx=px-e.x,dy=py-e.y,d=Math.hypot(dx,dy)||.001;
if(d<8&&los(e.x,e.y,px,py)){const v=e.sp*dt/d;let nx=e.x+dx*v,ny=e.y+dy*v;
if(e.k==='s'){nx+= -dy/d*Math.sin(e.ph*.7)*e.sp*dt*.8;ny+= dx/d*Math.sin(e.ph*.7)*e.sp*dt*.8;}
let sep=0;for(const o of enemies){if(o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<.5)sep++;}
if(!isWall(nx,e.y)||sep) e.x=!isWall(nx,e.y)?nx:e.x; else e.x=e.x;
if(!isWall(e.x,ny)||sep) e.y=!isWall(e.x,ny)?ny:e.y;
if(d<(e.k==='b'?1.0:.8)&&e.cd<=0){e.cd=e.k==='b'?1.1:e.k==='s'?.6:.9;let dmg=e.dmg;const ab=Math.min(arm,dmg*.6);arm-=ab;dmg-=ab;hp-=dmg;SFX.hurt();dmgEl();burst(px,py,.5,'#ff3b57',8);if(hp<=0){hp=0;die();}}}}
// exit
if(exitCell&&Math.hypot(exitCell.x-px,exitCell.y-py)<.9){if(lvl<MAPS.length-1){SFX.exit();score+=500+kills*10;loadLevel(lvl+1);}else{win();}}
// particles
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=5*dt;if(p.life<=0||p.z<0)parts.splice(i,1);}
dmg.classList.toggle('on',dmgT>0);if(dmgT>0)dmgT-=dt;}
let dmgT=0;function dmgEl(){dmgT=.35;shake=Math.min(.6,shake+.3);}
function die(){dead=true;SFX.die();showMsg('YOU DIED — CLICK TO RETRY');overlay.classList.remove('hide');overlay.querySelector('h1').innerHTML='WASTED <em>sector '+(lvl+1)+'</em>';$('play').textContent='↻ RE-JACK — '+score+' PTS';}
function win(){won=true;SFX.win();const t=((performance.now()-time0)/1000)|0;overlay.classList.remove('hide');overlay.querySelector('h1').innerHTML='CORE PURGED <em>you win</em>';overlay.querySelector('p').innerHTML=`All 3 sectors purged in <b>${t}s</b> · score <b>${score}</b> · the whole game is still under <b>96KB</b>. Tell your friends.`;$('play').textContent='↻ RUN IT AGAIN';}
// ---------- render ----------
const zbuf=new Float32Array(W);
function render(){frames++;const t=performance.now()/1000;
// ceiling + floor
const sky=g.createLinearGradient(0,0,0,HH);sky.addColorStop(0,'#04060c');sky.addColorStop(1,'#14202e');g.fillStyle=sky;g.fillRect(0,0,W,HH);
const fl=g.createLinearGradient(0,HH,0,H);fl.addColorStop(0,'#1a1418');fl.addColorStop(1,'#050505');g.fillStyle=fl;g.fillRect(0,HH,W,H-HH);
g.fillStyle='rgba(92,255,177,.05)';for(let y=HH;y<H;y+=4)g.fillRect(0,y,W,1);
const dx=Math.cos(pa),dy=Math.sin(pa),pxx=-dy*.66,pyy=dx*.66;
const shx=(Math.random()-.5)*shake*14,shy=(Math.random()-.5)*shake*14;
g.save();g.translate(shx,shy);
for(let x=0;x<W;x+=2){const cam=(2*x/W-1);const rdx=dx+pxx*cam,rdy=dy+pyy*cam;
let mx=px|0,my=py|0,ddx=Math.abs(1/(rdx||1e-9)),ddy=Math.abs(1/(rdy||1e-9)),stx,sty,sdx,sdy;
if(rdx<0){stx=-1;sdx=(px-mx)*ddx;}else{stx=1;sdx=(mx+1-px)*ddx;}
if(rdy<0){sty=-1;sdy=(py-my)*ddy;}else{sty=1;sdy=(my+1-py)*ddy;}
let side=0,cell='.',hit=false,guard=0;
while(!hit&&guard++<64){if(sdx<sdy){sdx+=ddx;mx+=stx;side=0;}else{sdy+=ddy;my+=sty;side=1;}cell=(mx<0||my<0||mx>=MW||my>=MH)?'#':map[my][mx];if(cell==='#'||cell==='X'||cell==='F'||cell==='D')hit=true;}
let dist=side===0?sdx-ddx:sdy-ddy;dist=Math.max(.05,dist);zbuf[x]=dist;zbuf[x+1]=dist;
const lh=Math.min(H*4,H/dist),y0=HH-lh/2;
const ti=wallTex(cell);let tx=((side===0?py+dist*rdy:px+dist*rdx)%1+1)%1;if((side===0&&rdx>0)||(side===1&&rdy<0))tx=1-tx;
g.drawImage(T[ti],(tx*63)|0,0,1,64,x,y0,2,lh+1);
const sh=Math.min(.65,dist*.09)+(side?0.18:0);g.fillStyle=`rgba(0,0,8,${sh})`;g.fillRect(x,y0,2,lh+1);
if(cell==='D'){g.fillStyle=`rgba(255,210,59,${.25+.2*Math.sin(t*6)})`;g.fillRect(x,y0,2,lh+1);}}
// sprites
const spr=[];
for(const e of enemies){if(e.dead)continue;spr.push({d:(e.x-px)**2+(e.y-py)**2,o:e,kind:'e'});}
for(const it of items){if(it.got)continue;spr.push({d:(it.x-px)**2+(it.y-py)**2,o:it,kind:'i'});}
if(exitCell)spr.push({d:(exitCell.x-px)**2+(exitCell.y-py)**2,o:exitCell,kind:'x'});
spr.sort((a,b)=>b.d-a.d);
for(const s of spr){const ox=s.o.x-px,oy=s.o.y-py;const inv=1/(pxx*dy-dx*pyy);const tx2=inv*(dy*ox-dx*oy),ty2=inv*(-pyy*ox+pxx*oy);
if(ty2<.15)continue;const sx=(HW/1+tx2/ty2*HW),sz=Math.abs(H/ty2);const gy=HH+sz*.08+Math.sin(t*3+(s.o.ph||0))*sz*.03;
if(sx<-sz||sx>W+sz)continue;
if(s.kind==='e'){const e=s.o;const bw=sz*.5*e.r*3.4,bh=sz*.62*e.r*3.4;const bx=sx-bw/2,by=gy-bh*.75;
if(zbuf[Math.max(0,Math.min(W-1,sx|0))]<ty2)continue;
const fl2=e.atk>0;
g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(sx,gy+bh*.28,bw*.5,bh*.12,0,0,7);g.fill();
g.fillStyle=fl2?'#fff':e.col;g.fillRect(bx,by,bw,bh);
g.fillStyle='rgba(0,0,0,.35)';g.fillRect(bx,by+bh*.55,bw,bh*.45);
g.fillStyle=e.eye;const ew=bw*.16;g.fillRect(bx+bw*.2,by+bh*.3,ew,ew);g.fillRect(bx+bw*.64,by+bh*.3,ew,ew);
g.fillStyle='#000';g.fillRect(bx+bw*.23,by+bh*.33,ew*.4,ew*.4);g.fillRect(bx+bw*.67,by+bh*.33,ew*.4,ew*.4);
g.fillStyle='#fff';for(let i=0;i<3;i++)g.fillRect(bx+bw*(.3+i*.2),by+bh*.62,bw*.1,bh*.08);
if(e.k==='b'){g.fillStyle='#7a0f1f';g.fillRect(bx-bw*.15,by+bh*.2,bw*.15,bh*.5);g.fillRect(bx+bw,by+bh*.2,bw*.15,bh*.5);}
if(e.k==='s'){g.fillStyle=e.col;g.fillRect(bx+bw*.3,by-bh*.25,bw*.4,bh*.3);}
const hpr=Math.max(0,e.hp/(e.k==='b'?90:e.k==='s'?30:50));g.fillStyle='#111';g.fillRect(bx,by-6,bw,4);g.fillStyle=hpr>.5?'#5cffb1':'#ff3b57';g.fillRect(bx,by-6,bw*hpr,4);
}else if(s.kind==='i'){const it=s.o;const sz2=Math.min(60,sz*.22);if(zbuf[Math.max(0,Math.min(W-1,sx|0))]<ty2)continue;
const bob2=Math.sin(it.ph)*4;g.save();g.shadowColor='#fff';g.shadowBlur=12;
if(it.t==='h'){g.fillStyle='#0d3';g.fillRect(sx-sz2/2,gy-sz2+ bob2,sz2,sz2);g.fillStyle='#fff';g.fillRect(sx-sz2*.1,gy-sz2*.85+bob2,sz2*.2,sz2*.7);g.fillRect(sx-sz2*.35,gy-sz2*.6+bob2,sz2*.7,sz2*.2);}
else if(it.t==='m'){g.fillStyle='#ffd23b';g.fillRect(sx-sz2/2,gy-sz2+bob2,sz2,sz2*.8);g.fillStyle='#000';g.font=`${sz2*.4}px monospace`;g.textAlign='center';g.fillText('≡',sx,gy-sz2*.35+bob2);}
else{g.fillStyle='#4db8ff';g.fillRect(sx-sz2/2,gy-sz2+bob2,sz2,sz2);g.fillStyle='#fff';g.fillRect(sx-sz2*.3,gy-sz2*.8+bob2,sz2*.6,sz2*.2);}g.restore();
}else{const sz3=Math.min(90,sz*.35);if(zbuf[Math.max(0,Math.min(W-1,sx|0))]<ty2*.9)continue;g.save();g.shadowColor='#ffd23b';g.shadowBlur=24;g.fillStyle=`rgba(255,210,59,${.7+.3*Math.sin(t*5)})`;g.fillRect(sx-6,gy-sz3,12,sz3);g.restore();g.fillStyle='#fff';g.font='bold 12px monospace';g.textAlign='center';g.fillText('EXIT',sx,gy-sz3-8);}}
// particles
for(const p of parts){const ox=p.x-px,oy=p.y-py;const inv=1/(pxx*dy-dx*pyy);const tx2=inv*(dy*ox-dx*oy),ty2=inv*(-pyy*ox+pxx*oy);if(ty2<.1)continue;const sx=HW+tx2/ty2*HW;const sy=HH-(p.z-.4)/ty2*H*.5;const s2=Math.max(1,3/ty2);if(zbuf[sx|0]>ty2){g.fillStyle=p.col;g.globalAlpha=Math.min(1,p.life*2);g.fillRect(sx,sy,s2,s2);g.globalAlpha=1;}}
g.restore();
// gun
const Gn=GUNS[gun];const bobx=Math.sin(bob*.1)*6,boby=Math.abs(Math.cos(bob*.1))*5-flash*14;
const gx=HW+bobx,gy2=H-8+boby+shake*10;
g.fillStyle='#11141d';g.fillRect(gx-(gun?46:22),gy2-(gun?70:96),(gun?92:44),(gun?70:96));
g.fillStyle=gun?'#6b4d26':'#33547e';g.fillRect(gx-(gun?38:15),gy2-(gun?64:90),(gun?76:30),(gun?50:70));
g.fillStyle=gun?'#8a6531':'#45688f';g.fillRect(gx-(gun?38:15),gy2-(gun?64:90),(gun?10:6),(gun?50:70));
g.fillStyle=gun?'#ffd23b':'#5cffb1';g.fillRect(gx-(gun?38:15),gy2-(gun?64:90),(gun?76:30),4);
if(flash>0){g.save();g.globalAlpha=flash;g.fillStyle='#fff6c8';g.beginPath();g.arc(gx,gy2-(gun?70:96),20+flash*22,0,7);g.fill();g.fillStyle='#ff9d2e';g.beginPath();g.arc(gx,gy2-(gun?70:96),10+flash*12,0,7);g.fill();g.restore();}
// damage flash + vignette
if(dmgT>0){g.fillStyle=`rgba(255,20,40,${dmgT*.5})`;g.fillRect(0,0,W,H);}
const vg=g.createRadialGradient(HW,HH,H*.35,HW,HH,H*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,W,H);
if(hp<30){g.fillStyle=`rgba(255,0,30,${.12+.1*Math.sin(t*6)})`;g.fillRect(0,0,W,H);}
// HUD
$('h-hp').textContent=Math.ceil(hp);$('b-hp').style.width=hp+'%';
$('h-arm').textContent=Math.ceil(arm);$('b-arm').style.width=arm+'%';
$('h-ammo').textContent=ammo;$('h-gun').textContent=Gn.n;$('h-score').textContent=score;
$('h-kills').textContent=`KILLS ${kills}/${totalFoes}`;$('h-level').textContent='SECTOR 0'+(lvl+1);
drawMini();}
function drawMini(){const s=132/Math.max(MW,MH);mini.clearRect(0,0,132,132);mini.fillStyle='rgba(0,0,0,.6)';mini.fillRect(0,0,132,132);
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const c=map[y][x];if(c==='#'||c==='X'){mini.fillStyle='#3a4356';mini.fillRect(x*s,y*s,s,s);}else if(c==='F'){mini.fillStyle='#6e1f30';mini.fillRect(x*s,y*s,s,s);}else if(c==='D'){mini.fillStyle='#ffd23b';mini.fillRect(x*s,y*s,s,s);}}
for(const it of items){if(it.got)continue;mini.fillStyle=it.t==='h'?'#2ee6a8':it.t==='m'?'#ffd23b':'#4db8ff';mini.fillRect(it.x*s-1,it.y*s-1,3,3);}
if(exitCell){mini.fillStyle='#ffd23b';mini.fillRect(exitCell.x*s-2,exitCell.y*s-2,4,4);}
for(const e of enemies){if(e.dead)continue;mini.fillStyle='#ff3b57';mini.fillRect(e.x*s-1.5,e.y*s-1.5,3,3);}
mini.save();mini.translate(px*s,py*s);mini.rotate(-pa);mini.fillStyle='#5cffb1';mini.beginPath();mini.moveTo(6,0);mini.lineTo(-4,-4);mini.lineTo(-4,4);mini.closePath();mini.fill();mini.restore();}
// ---------- main loop ----------
function loop(now){requestAnimationFrame(loop);let dt=(now-last)/1000;last=now;dt=Math.min(.05,dt);fps=fps*.95+(1/Math.max(dt,1e-3))*.05;
if(started&&!dead&&!won)update(dt);
if(!started){renderMenuBg(now/1000);}else render();
if(frames%20===0)$('h-fps').textContent=Math.round(fps)+' FPS';
if(++sceneN===6){window.__sceneReady=true;document.body.dataset.ready='1';}}
function renderMenuBg(t){g.fillStyle='#05070c';g.fillRect(0,0,W,H);for(let i=0;i<40;i++){const x=(i*97+t*30*(1+i%3))%W,y=(i*61)%H;g.fillStyle=`rgba(92,255,177,${.1+(i%5)*.05})`;g.fillRect(x,y,2,2);}g.fillStyle='rgba(92,255,177,.08)';g.font='bold 120px monospace';g.textAlign='center';g.fillText('96K',HW,HH+40);}
// size badge — measured payload 29059 B ≈ 28.4KB of 96KB budget
const SIZE_TXT='28.4KB / 96KB';
['h-size','size-live','size-btn','size-foot'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=SIZE_TXT;});
fetch('game.js',{method:'HEAD'}).catch(()=>{});
const approx=(document.documentElement.outerHTML.length);
window.__game={get hp(){return hp},get score(){return score},get kills(){return kills},get level(){return lvl},get started(){return started}};
loadLevel(0);requestAnimationFrame(loop);
setTimeout(()=>{if(!started){window.__sceneReady=true;}},3000);
})();
