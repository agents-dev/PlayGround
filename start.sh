#!/usr/bin/env bash
set -euo pipefail
time -p cd "$(dirname "$0")"
/usr/bin/time -p pwd
export PORT="${PORT:-3000}"
/usr/bin/time -p bash -c 'echo serving-port:$PORT'
PROJECT_ROOT="$(pwd)"
export PROJECT_ROOT
SERVE_DIR="$PROJECT_ROOT"
export SERVE_DIR
if /usr/bin/time -p test -f "$PROJECT_ROOT/package.json"; then
  if /usr/bin/time -p grep -q '"vite"' "$PROJECT_ROOT/package.json"; then
    /usr/bin/time -p npm install --no-audit --no-fund
    /usr/bin/time -p npm run build
    SERVE_DIR="$PROJECT_ROOT/dist"
    export SERVE_DIR
  fi
fi
/usr/bin/time -p test -f "$SERVE_DIR/index.html"
WEB_DIR="${OPENCODE_WEB_DIR:-$PROJECT_ROOT/.opencode-web}"
export WEB_DIR
/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p node -e 'const fs=require("fs");fs.writeFileSync(process.argv[1],JSON.stringify({project:process.argv[2],directory:process.argv[3]}))' "$WEB_DIR/deployment-output.json" "$PROJECT_ROOT" "$SERVE_DIR"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"
/usr/bin/time -p node -e 'const fs=require("fs");const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));if(!j.project||!j.directory)process.exit(1);if(!fs.existsSync(j.directory+"/index.html")){console.error("missing index.html");process.exit(1)}' "$WEB_DIR/deployment-output.json"
echo "Serving $SERVE_DIR on port $PORT"
exec /usr/bin/time -p node -e '
const http=require("http"),fs=require("fs"),path=require("path");
const root=process.env.SERVE_DIR||process.cwd();
const port=Number(process.env.PORT||3000);
const mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".wasm":"application/wasm",".glb":"model/gltf-binary"};
http.createServer((req,res)=>{try{const u=new URL(req.url,"http://localhost");let p=path.resolve(root,"."+decodeURIComponent(u.pathname));if(p!==path.resolve(root)&&!p.startsWith(path.resolve(root)+"/")){res.writeHead(404);res.end();return;}const st=fs.statSync(p);const f=st.isDirectory()?path.join(p,"index.html"):p;res.setHeader("Content-Type",mime[path.extname(f)]||"application/octet-stream");res.setHeader("Cache-Control","no-cache");res.end(fs.readFileSync(f));}catch(e){res.writeHead(404);res.end("Not found");}}).listen(port,"0.0.0.0",()=>console.log("listening "+port));
'
