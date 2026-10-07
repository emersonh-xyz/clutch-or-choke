# clutch-or-choke
Guess whether the pro clutches it.

## Run
1. `python3 -m venv .venv && .venv/bin/pip install -r pipeline/requirements.txt`
2. Put `CLIP_API_KEY=...` (your Allstar Partner API key) in `.env` (gitignored). Optional: `ALLSTAR_AUTH_HEADER` if the API wants a header other than `X-API-Key`.
3. `.venv/bin/python server.py` (API on http://localhost:8787, also serves the built app).
4. Frontend dev: `cd web && npm install && npm run dev`, open http://localhost:5173. Production: `npm run build`, then use :8787.

## Add clutches
Upload a `.dem` in the app: the server finds the clutches, compresses and hosts the demo on the `demos` release (needs `gh` logged in), creates a clip per clutch and fills in `videoUrl` as each one renders.

By hand: `python pipeline/build.py path/to/*.dem` writes `clutches.json`.

Self-check: `python pipeline/check.py ex-ruby-vs-rustec-m2-dust2.dem`.
