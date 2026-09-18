#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p test -f index.html
PORT="${PORT:-3000}"
export PORT
OUT_DIR="${OPENCODE_WEB_DIR:-/tmp/opencode-web}"
mkdir -p "$OUT_DIR"
/usr/bin/time -p node -e '
const http=require("http"),fs=require("fs"),path=require("path");
const root=process.cwd();
const port=Number(process.env.PORT||3000);
const mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".wasm":"application/wasm",".glb":"model/gltf-binary"};
fs.writeFileSync(path.join(process.env.OPENCODE_WEB_DIR||"/tmp","deployment-output.json"),JSON.stringify({project:root,directory:root}));
http.createServer((req,res)=>{
  try{
    const u=new URL(req.url,"http://localhost");
    let p=path.resolve(root,"."+decodeURIComponent(u.pathname));
    if(p!==root&&!p.startsWith(root+"/")){res.writeHead(404);res.end();return;}
    let st; try{st=fs.statSync(p);}catch{res.writeHead(404);res.end("Not found");return;}
    if(st.isDirectory())p=path.join(p,"index.html");
    res.setHeader("Content-Type",mime[path.extname(p)]||"application/octet-stream");
    res.setHeader("Cache-Control","no-cache");
    res.end(fs.readFileSync(p));
  }catch(e){res.writeHead(500);res.end("err");}
}).listen(port,"0.0.0.0",()=>console.log("serving "+root+" on "+port));
setInterval(()=>{},1000000);
'
