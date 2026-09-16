#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Hello World Android preview server.
# Serves a static landing page + APK download in the foreground on $PORT.
PORT="${PORT:-3000}"
export PORT

/usr/bin/time -p mkdir -p public
/usr/bin/time -p test -f HelloWorld/app/build/outputs/apk/debug/app-debug.apk || /usr/bin/time -p bash HelloWorld/gradlew -p HelloWorld assembleDebug --no-daemon
/usr/bin/time -p cp -f HelloWorld/app/build/outputs/apk/debug/app-debug.apk public/app-debug.apk
/usr/bin/time -p bash -c 'cat > public/index.html <<'"'"'HTML'"'"'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello World - Android App</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; background: #f6f8fa; color: #111; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 64px 24px; text-align: center; }
  .badge { display: inline-block; background: #3ddc84; color: #073; font-weight: 700; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px; }
  h1 { font-size: 56px; margin: 12px 0; }
  p { font-size: 18px; line-height: 1.6; color: #333; }
  .btn { display: inline-block; margin-top: 24px; background: #111; color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; }
  code { background: #eaeef2; padding: 2px 8px; border-radius: 6px; }
  .meta { margin-top: 32px; font-size: 14px; color: #666; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="badge">Android APK ready</div>
    <h1>Hello World!</h1>
    <p>Minimal Hello World Android app (<code>com.example.helloworld</code>). Install the debug APK on any Android 7.0+ device or emulator.</p>
    <a class="btn" href="./app-debug.apk">Download app-debug.apk</a>
    <p class="meta">adb install app-debug.apk &bull; minSdk 24 &bull; targetSdk 34 &bull; version 1.0</p>
  </div>
</body>
</html>
HTML'
/usr/bin/time -p ls -lh public/
/usr/bin/time -p python3 -m http.server "$PORT" --directory public
