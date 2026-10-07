"""Self-check against a known clutch: python check.py <ex-ruby-vs-rustec-m2-dust2.dem>"""
import sys

from find_clutches import find_clutches

c = next(c for c in find_clutches(sys.argv[1]) if c["round"] == 10)
assert (c["name"], c["team"], c["vs"], c["won"]) == ("H4SAN4TOR", "CT", 2, True), c
assert c["start_tick"] == 74222 and c["freeze_tick"] == 75799, c
assert c["clutcher"]["hp"] == 38 and c["clutcher"]["weapon"] == "AK-47", c["clutcher"]
assert sorted(o["name"] for o in c["opponents"]) == ["anttzz", "youka"], c["opponents"]
print("ok")
