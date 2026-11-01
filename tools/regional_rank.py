"""
Work out regional rank, which FTCScout's API doesn't expose directly.

Its quick-stats endpoint returns a worldwide rank only. To get a regional
placing you have to pull every team in the region and sort them yourself.

Fetches the California roster once (LA teams are a subset), gets each
team's OPR for the season, then ranks. Modest concurrency and a retry, so
it stays polite to a free community API.

Usage: python tools/regional_rank.py 23441 2025
"""
import sys, json, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

TEAM   = int(sys.argv[1]) if len(sys.argv) > 1 else 23441
SEASON = int(sys.argv[2]) if len(sys.argv) > 2 else 2025
API    = "https://api.ftcscout.org/rest/v1"
UA     = {"User-Agent": "Mozilla/5.0 (compatible; ftc23441-site/1.0)"}

def get(path, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(API + path, headers=UA)
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read())
        except Exception:
            if i == tries - 1: return None
            time.sleep(0.6 * (i + 1))

state = get(f"/teams/search?region=USCA") or []
la    = {t["number"] for t in (get(f"/teams/search?region=USCALA") or [])}
print(f"California roster: {len(state)} teams   ({len(la)} in the LA region)")

def stat(t):
    d = get(f"/teams/{t['number']}/quick-stats?season={SEASON}")
    if not d or "tot" not in d: return None
    return {"number": t["number"], "name": t["name"],
            "tot": d["tot"]["value"], "auto": d["auto"]["value"],
            "worldRank": d["tot"]["rank"], "of": d["count"]}

print(f"fetching {SEASON} stats ...")
t0 = time.time()
rows = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for i, r in enumerate(ex.map(stat, state), 1):
        if r: rows.append(r)
        if i % 150 == 0:
            print(f"  {i}/{len(state)}  ({time.time()-t0:.0f}s)", flush=True)

def place(pool, key):
    pool = sorted(pool, key=lambda r: -r[key])
    for i, r in enumerate(pool, 1):
        if r["number"] == TEAM:
            return i, len(pool)
    return None, len(pool)

print(f"\n{len(rows)} of {len(state)} CA teams have {SEASON} match data\n")
for key, label in (("tot", "overall OPR"), ("auto", "autonomous")):
    cr, cn = place(rows, key)
    lr, ln = place([r for r in rows if r["number"] in la], key)
    if cr: print(f"  California, {label:11}: #{cr} of {cn}   (top {cr/cn*100:.1f}%)")
    if lr: print(f"  LA region,  {label:11}: #{lr} of {ln}   (top {lr/ln*100:.1f}%)")

me = next((r for r in rows if r["number"] == TEAM), None)
if me:
    print(f"\n  worldwide: #{me['worldRank']} of {me['of']}   (top {me['worldRank']/me['of']*100:.1f}%)")
    print(f"  OPR {me['tot']:.1f} | auto {me['auto']:.1f}")
    top = sorted(rows, key=lambda r: -r["tot"])[:5]
    print("\n  top 5 in California:")
    for i, r in enumerate(top, 1):
        print(f"    {i}. {r['number']:>6}  {r['name'][:34]:34} OPR {r['tot']:.1f}")
