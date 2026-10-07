import json
import sys

from demoparser2 import DemoParser

TICKRATE = 64
ROUND_SECONDS = 115
BOMB_SECONDS = 40
FREEZE_LEAD = 2 * TICKRATE  # freeze this long before the next death
PISTOLS = {1, 2, 3, 4, 30, 32, 36, 61, 63, 64}
UTILITY = {31, 43, 44, 45, 46, 47, 48, 49}  # zeus, grenades, C4
STATE_PROPS = ["name", "steamid", "health", "armor_value", "has_helmet", "has_defuser",
               "active_weapon_name", "active_weapon_ammo", "inventory", "inventory_as_ids", "last_place_name",
               "team_clan_name"]


def player_state(r):
    items = list(zip(r.inventory, r.inventory_as_ids))
    guns = [(n, i) for n, i in items if i < 500 and i not in (42, 59) and i not in UTILITY]
    main = next((n for n, i in guns if i not in PISTOLS), guns[0][0] if guns else None)
    return {
        "name": r["name"],
        "steamId": str(r.steamid),
        "team": r.team_clan_name or None,
        "hp": int(r.health),
        "armor": int(r.armor_value),
        "helmet": bool(r.has_helmet),
        "kit": bool(r.has_defuser),
        "weapon": main,
        # ammo is only known for the gun in hand
        "ammo": int(r.active_weapon_ammo) if r.active_weapon_name == main else None,
        "utility": [n for n, i in items if i in UTILITY],
        "place": r.last_place_name,
    }


def find_clutches(path):
    p = DemoParser(path)
    deaths = p.parse_event("player_death", player=["team_num"], other=["total_rounds_played"])
    ends = p.parse_event("round_end")
    starts = p.parse_event("round_freeze_end")
    plants = p.parse_event("bomb_planted")

    out = []
    for _, end in ends[ends["round"] > 0].iterrows():
        start_tick = starts[starts.tick < end.tick].tick.max()
        if start_tick != start_tick:  # NaN: no freeze end before this round_end
            continue
        roster = p.parse_ticks(["team_num", "name", "steamid"], ticks=[int(start_tick)])
        roster = roster[roster.team_num.isin([2, 3])].assign(steamid=lambda r: r.steamid.astype(str))
        alive = {t: set(roster[roster.team_num == t].steamid) for t in (2, 3)}
        rd = deaths[(deaths.tick > start_tick) & (deaths.tick <= end.tick)].sort_values("tick")

        clutch = None
        for _, d in rd.iterrows():
            alive.get(d.user_team_num, set()).discard(str(d.user_steamid))
            for t, o in ((2, 3), (3, 2)):
                if not clutch and len(alive[t]) == 1 and len(alive[o]) >= 2:
                    sid = next(iter(alive[t]))
                    clutch = {
                        "round": int(end["round"]),
                        "steamid": sid,
                        "name": roster[roster.steamid == sid].name.iloc[0],
                        "team": "T" if t == 2 else "CT",
                        "vs": len(alive[o]),
                        "enemies": set(alive[o]),
                        "start_tick": int(d.tick),
                        "end_tick": int(end.tick),
                    }
        if clutch:
            later = rd[rd.tick > clutch["start_tick"]].tick
            next_tick = int(later.min()) if len(later) else clutch["end_tick"]
            freeze = max(clutch["start_tick"], next_tick - FREEZE_LEAD)
            snap = p.parse_ticks(STATE_PROPS, ticks=[freeze]).assign(steamid=lambda r: r.steamid.astype(str))
            enemies = clutch.pop("enemies")
            plant = plants[(plants.tick > start_tick) & (plants.tick <= freeze)].tick if len(plants) else []
            if len(plant):
                time_left = BOMB_SECONDS - (freeze - int(plant.min())) / TICKRATE
            else:
                time_left = ROUND_SECONDS - (freeze - start_tick) / TICKRATE
            clutch.update(
                freeze_tick=freeze,
                bomb_planted=bool(len(plant)),
                time_left=round(time_left, 1),
                clutcher=player_state(snap[snap.steamid == clutch["steamid"]].iloc[0]),
                opponents=[player_state(r) for _, r in snap[snap.steamid.isin(enemies)].iterrows()],
            )
            # round_end winner is "T"/"CT" (or 2/3 on some builds)
            clutch["won"] = str(end.winner) in (clutch["team"], "2" if clutch["team"] == "T" else "3")
            # the clutch is decided when the clutcher dies, even if the round runs on (e.g. a defuse)
            died = rd[(rd.tick > clutch["start_tick"]) & (rd.user_steamid.astype(str) == clutch["steamid"])].tick
            clutch["outcome_tick"] = int(died.min()) if len(died) else clutch["end_tick"]
            out.append(clutch)
    return out


def is_playable(c):
    # ponytail: fixed thresholds, tune once we see enough clutches
    return 2 <= c["vs"] <= 4 and (c["end_tick"] - c["start_tick"]) / TICKRATE >= 5


if __name__ == "__main__":
    out = []
    for path in sys.argv[1:]:
        out += [dict(c, demo=path.rsplit("/", 1)[-1]) for c in find_clutches(path) if is_playable(c)]
    print(json.dumps(out, indent=1))
