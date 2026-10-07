"""Local server: serves the app, takes demo uploads, and turns them into playable clutches.

Run with the pipeline venv: python server.py  (reads CLIP_API_KEY from .env)
Serves the built app from web/dist; in dev, Vite proxies /api and /clutches.json here.
"""
import bz2
import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import uuid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "web", "dist")
sys.path.insert(0, os.path.join(ROOT, "pipeline"))
from build import entries, load, save  # noqa: E402

UPLOADS = os.path.join(ROOT, "uploads")
REPO = "emersonh-xyz/clutch-or-choke"
API = "https://prt.allstar.gg"
POLL_SECONDS = 10

for line in open(os.path.join(ROOT, ".env")) if os.path.exists(os.path.join(ROOT, ".env")) else []:
    k, _, v = line.strip().partition("=")
    if k and k not in os.environ:
        os.environ[k] = v
API_KEY = os.environ.get("CLIP_API_KEY") or os.environ.get("ALLSTAR_API_KEY", "")
AUTH_HEADER = os.environ.get("ALLSTAR_AUTH_HEADER", "X-API-Key")

# ponytail: one lock around clutches.json and jobs, fine for a single local user
lock = threading.Lock()
jobs = {}


def allstar(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body else None)
    req.add_header(AUTH_HEADER, API_KEY)
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
        return r.status, json.loads(raw) if raw else None


def update(ids, fn):
    with lock:
        clutches = load()
        for c in clutches:
            if c["id"] in ids:
                fn(c)
        save(clutches)


def run_job(job_id, path):
    job = jobs[job_id]
    try:
        job["step"] = "parsing"
        with lock:
            old = {c["id"]: c for c in load()}
        new = entries(path, old)
        if not new:
            raise RuntimeError("No playable clutches in this demo.")
        with lock:
            ids = {c["id"] for c in new}
            save([c for c in load() if c["id"] not in ids] + new)
        job["ids"] = [c["id"] for c in new]

        job["step"] = "compressing"
        packed = path + ".bz2"
        with open(path, "rb") as src, bz2.open(packed, "wb", compresslevel=9) as dst:
            shutil.copyfileobj(src, dst, 1 << 20)

        job["step"] = "uploading"
        subprocess.run(["gh", "release", "upload", "demos", packed, "-R", REPO, "--clobber"], check=True,
                       capture_output=True, text=True)

        job["step"] = "clipping"
        for c in new:
            if c["requestId"] or c["clipId"]:
                continue
            # a fresh query string dodges Allstar's demo+player+round dedup on re-uploads
            body = {"demoUrl": f"{c['demoUrl']}?v={job_id[:8]}", "steamId": c["steamId"], "round": c["round"],
                    "overrides": {"csStartTick": c["startTick"], "csStopTick": c["stopTick"]}}
            _, res = allstar("POST", "/cs/clip/pmh", body)
            update({c["id"]}, lambda x: x.update(requestId=res["requestId"]))
        job["step"] = "rendering"
    except subprocess.CalledProcessError as e:
        job.update(step="error", error=f"GitHub upload failed: {e.stderr.strip()}")
    except urllib.error.HTTPError as e:
        job.update(step="error", error=f"The clip service returned {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        job.update(step="error", error=str(e))


def video_url(clip):
    # the mp4 sits next to the og image: <media>/<partner>/og/<id>_og.jpg -> <media>/<partner>/clips/<id>.mp4
    m = re.match(r"(https://media\d*\.allstar\.gg/[^/]+)/og/", clip.get("clipSnapshotURL") or "")
    return f"{m.group(1)}/clips/{clip['_id']}.mp4" if m else None


def resolver():
    while True:
        time.sleep(POLL_SECONDS)
        with lock:
            pending = [c for c in load() if not c.get("videoUrl") and (c.get("requestId") or c.get("clipId"))]
        for c in pending:
            try:
                _, res = allstar("GET", f"/cs/clip/status?clip_identifier={c.get('requestId') or c['clipId']}")
            except Exception:
                continue
            res = res or {}
            clip = res.get("clip") or {}
            url = video_url(clip) if res.get("status") == "Processed" else None
            if url:
                update({c["id"]}, lambda x: x.update(clipId=clip["_id"], videoUrl=url))
        for job in list(jobs.values()):
            if job["step"] == "rendering":
                with lock:
                    done = all(c.get("videoUrl") for c in load() if c["id"] in job["ids"])
                if done:
                    job["step"] = "done"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIST, **kw)

    def send_json(self, code, data):
        raw = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if self.path.startswith("/api/jobs/"):
            job = jobs.get(self.path.rsplit("/", 1)[-1])
            if not job:
                return self.send_json(404, {"error": "No such job."})
            with lock:
                clutches = [c for c in load() if c["id"] in job["ids"]]
            return self.send_json(200, dict(job, clutches=clutches))
        if self.path.split("?")[0] == "/clutches.json":
            with lock:
                return self.send_json(200, load())
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/upload":
            return self.send_error(404)
        if not API_KEY:
            return self.send_json(500, {"error": "Uploads need an API key. Add CLIP_API_KEY to .env, then restart server.py."})
        name = os.path.basename(self.headers.get("X-Filename", ""))
        if not re.fullmatch(r"[\w.-]+\.dem", name):
            return self.send_json(400, {"error": "Upload a .dem file."})
        size = int(self.headers.get("Content-Length", 0))
        os.makedirs(UPLOADS, exist_ok=True)
        path = os.path.join(UPLOADS, name)
        with open(path, "wb") as f:
            left = size
            while left:
                chunk = self.rfile.read(min(left, 1 << 20))
                if not chunk:
                    break
                f.write(chunk)
                left -= len(chunk)
        job_id = uuid.uuid4().hex
        jobs[job_id] = {"id": job_id, "demo": name, "step": "queued", "ids": [], "error": None}
        threading.Thread(target=run_job, args=(job_id, path), daemon=True).start()
        self.send_json(202, {"jobId": job_id})


if __name__ == "__main__":
    threading.Thread(target=resolver, daemon=True).start()
    port = int(os.environ.get("PORT", 8787))
    print(f"http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
