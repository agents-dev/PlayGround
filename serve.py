"""Minimal static file server for the browser FPS prototype.

Uses raw sockets and threads only. Deliberately avoids http.server /
socket.getfqdn, which hangs in environments with broken reverse DNS.
Serves ./index.html at / with correct MIME types. No DNS lookups anywhere.
"""
import mimetypes
import os
import socket
import threading

ROOT = os.path.dirname(os.path.abspath(__file__))

MIMES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
}


def handle(conn):
    try:
        data = b""
        conn.settimeout(5)
        while b"\r\n\r\n" not in data and len(data) < 65536:
            chunk = conn.recv(4096)
            if not chunk:
                break
            data += chunk
        line = data.split(b"\r\n", 1)[0].decode("latin1")
        parts = line.split(" ")
        path = parts[1] if len(parts) > 1 else "/"
        path = path.split("?", 1)[0].split("#", 1)[0]
        if path == "/":
            path = "/index.html"
        fpath = os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
        if not fpath.startswith(ROOT) or not os.path.isfile(fpath):
            body = b"not found"
            conn.sendall(b"HTTP/1.0 404 Not Found\r\nContent-Length: 9\r\nConnection: close\r\n\r\n" + body)
            return
        with open(fpath, "rb") as f:
            body = f.read()
        ctype = MIMES.get(os.path.splitext(fpath)[1].lower()) or mimetypes.guess_type(fpath)[0] or "application/octet-stream"
        head = ("HTTP/1.0 200 OK\r\nContent-Type: %s\r\nContent-Length: %d\r\nConnection: close\r\n\r\n" % (ctype, len(body))).encode("latin1")
        conn.sendall(head + body)
    except Exception:
        pass
    finally:
        try:
            conn.close()
        except Exception:
            pass


def main():
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("127.0.0.1", port))
    srv.listen(64)
    print("serving %s on 127.0.0.1:%d" % (ROOT, port), flush=True)
    while True:
        conn, _ = srv.accept()
        threading.Thread(target=handle, args=(conn,), daemon=True).start()


if __name__ == "__main__":
    main()
