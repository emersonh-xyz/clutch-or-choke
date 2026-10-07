"""Write the playable clutches into the static web app: python export_web.py"""
import json
import os

from build import load

KEEP = ("id", "map", "round", "player", "side", "vs", "won", "startTick", "freezeTick",
        "timeLeft", "bombPlanted", "clutcher", "opponents", "videoUrl")
OUT = os.path.join(os.path.dirname(__file__), "..", "web", "src", "data", "clutches.json")

playable = [{k: c[k] for k in KEEP} for c in load() if c.get("videoUrl")]
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(playable, open(OUT, "w"), indent=1)
print(f"{len(playable)} clutches -> web/src/data/clutches.json")
