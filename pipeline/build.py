"""Find playable clutches in demos and write clutches.json for the app.

Usage: python build.py <demo.dem> [...]
Existing clip IDs in clutches.json are kept, so re-running is safe.
"""
import json
import os
import re
import sys
import urllib.request

from demoparser2 import DemoParser

from find_clutches import TICKRATE, find_clutches, is_playable

OUT = os.path.join(os.path.dirname(__file__), "..", "clutches.json")
RELEASE = "https://github.com/emersonh-xyz/clutch-or-choke/releases/download/demos/"
LEAD_IN = 12 * TICKRATE  # clip starts this long before the freeze
CLUTCH_LEAD = 3 * TICKRATE  # but never earlier than just before the 1vX starts
TAIL = 2 * TICKRATE

MAPS = {"de_dust2": "Dust 2", "de_mirage": "Mirage", "de_inferno": "Inferno", "de_nuke": "Nuke",
        "de_overpass": "Overpass", "de_ancient": "Ancient", "de_anubis": "Anubis",
        "de_vertigo": "Vertigo", "de_train": "Train"}


_avatars = {}


def avatar(steam_id):
    # public profile XML needs no API key; the first avatarFull is the player's own
    if steam_id not in _avatars:
        try:
            with urllib.request.urlopen(f"https://steamcommunity.com/profiles/{steam_id}/?xml=1", timeout=10) as r:
                m = re.search(r"<avatarFull><!\[CDATA\[(.*?)\]\]>", r.read().decode("utf-8", "replace"))
            _avatars[steam_id] = m.group(1) if m else None
        except Exception:
            _avatars[steam_id] = None
    return _avatars[steam_id]


def with_avatar(player):
    return dict(player, avatar=avatar(player["steamId"]))


def entry(c, demo, map_name):
    start = max(c["start_tick"] - CLUTCH_LEAD, c["freeze_tick"] - LEAD_IN)
    return {
        "id": f"{demo[:-4]}-r{c['round']}",
        "demo": demo,
        "demoUrl": RELEASE + demo + ".bz2",
        "map": MAPS.get(map_name, map_name),
        "round": c["round"],
        "steamId": c["steamid"],
        "player": c["name"],
        "side": c["team"],
        "vs": c["vs"],
        "won": c["won"],
        "startTick": start,
        "stopTick": c["end_tick"] + TAIL,
        "freezeTick": c["freeze_tick"],
        "timeLeft": c["time_left"],
        "bombPlanted": c["bomb_planted"],
        "clutcher": with_avatar(c["clutcher"]),
        "opponents": [with_avatar(o) for o in c["opponents"]],
        "clipId": None,
        "requestId": None,
        "videoUrl": None,
    }


def entries(path, old):
    demo = os.path.basename(path)
    map_name = DemoParser(path).parse_header()["map_name"]
    out = []
    for c in find_clutches(path):
        if not is_playable(c):
            continue
        e = entry(c, demo, map_name)
        prev = old.get(e["id"])
        if prev and (prev.get("clipId") or prev.get("requestId")):
            # the clip was cut with its own ticks, keep them
            for k in ("clipId", "requestId", "videoUrl", "startTick", "stopTick"):
                e[k] = prev.get(k)
        out.append(e)
    return out


def load():
    return json.load(open(OUT)) if os.path.exists(OUT) else []


def save(clutches):
    json.dump(clutches, open(OUT, "w"), indent=1)


def main(paths):
    old = {c["id"]: c for c in load()}
    out = [e for path in paths for e in entries(path, old)]
    save(out)
    print(f"{len(out)} clutches, {sum(c['won'] for c in out)} won, {sum(bool(c['videoUrl']) for c in out)} with video")


if __name__ == "__main__":
    main(sys.argv[1:])
