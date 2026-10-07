# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript frontend in `web/`. Python stdlib server (`server.py`) for the API and demo processing; Vite proxies `/api` and `/clutches.json` to it in dev, and it serves `web/dist` in production. Runs locally only.

## Users

Primarily people evaluating what can be built on Allstar's Partner API (a showcase). They play a few rounds and try uploading a pro demo to watch it turn into playable clips. Counter-Strike viewers are the in-fiction audience the game is written for.

## Product Purpose

Clutch or Choke: watch a pro Counter-Strike 2 player in a 1vX, the clip freezes just before the decisive fight, you call "Clutch" or "Choke", then watch how it ends. A daily set of five, a streak, and a shareable result. A second flow lets you upload a `.dem` file and watch the clutches get found and clipped live.

## Positioning

The freeze point and the situation card come from parsing the actual demo (every player's HP, armor, gun, ammo, utility, location, time left, bomb state), and clips are cut to exact demo ticks. The guess is an informed read of a real pro situation, not a coin flip.

## Operating Context

- Any CS2 `.dem` works (pro matches from HLTV, FACEIT, matchmaking). HLTV ships a `.rar` with one `.dem` per map; matchmaking demos have no team names.
- Clips render in about two minutes each; the upload flow must show progress while they process.
- Roughly 1 in 10 playable clutches is won, so most answers are "Choke"; each daily set includes at least one win when available.

## Capabilities and Constraints

- Clutch detection: 1v2 to 1v4, at least 5 seconds of play. Freeze is 2 seconds before the next death after the 1vX starts.
- Video plays from raw mp4 URLs; no third-party player embed.
- Daily set is seeded by date so everyone gets the same five. Progress and streak live in localStorage.
- Upload requires an API key in `.env`; without it the upload flow must explain itself rather than fail silently.

## Brand Commitments

- Name: "Clutch or Choke".
- A "Powered by Allstar" credit sits under the wordmark (user decision, reversing the earlier no-Allstar rule). Clips still carry Allstar's burned-in watermark, covered by the map/round chip.
- Visual theme pinned by the user: early 2000s Frutiger Aero.
- Copy style: no em dashes anywhere.

## Evidence on Hand

- `clutches.json`: 55 real clutches from 5 maps across two matches (ex-RUBY vs Rustec, Lavked vs MISA), 19 with clips.
- No testimonials, user counts, or press. Do not invent any.

## Product Principles

1. The decision moment is the product: everything serves the freeze, the card, and the call.
2. Show real data, never filler: every number on screen comes from the demo.
3. Waiting is part of the show: processing states should be legible and live, not a spinner.
4. One page, no detours.
