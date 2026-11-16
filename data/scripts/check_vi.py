#!/usr/bin/env python3
"""Kiểm tra các tệp data/vi/<prefix>*.jsonl so với tệp đầu vào: đủ từ, đúng định dạng.

Chạy: python3 data/scripts/check_vi.py data/_input/batch-1.jsonl batch-1
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
inp, prefix = sys.argv[1], sys.argv[2]
want = [json.loads(l)["hz"] for l in open(inp, encoding="utf-8") if l.strip()]
got, errs = {}, []
TONE = re.compile(r"[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]")
for f in sorted(glob.glob(os.path.join(ROOT, "data", "vi", prefix + "*.jsonl"))):
    for n, line in enumerate(open(f, encoding="utf-8"), 1):
        if not line.strip():
            continue
        where = f"{os.path.basename(f)}:{n}"
        try:
            w = json.loads(line)
        except json.JSONDecodeError as e:
            errs.append(f"{where} JSON lỗi: {e}")
            continue
        for k in ("hz", "vi", "hv", "pos_vi", "ex"):
            if not w.get(k):
                errs.append(f"{where} thiếu '{k}'")
        ex = w.get("ex") or []
        if len(ex) != 3 or not all(isinstance(x, str) and x for x in ex):
            errs.append(f"{where} 'ex' phải là [zh, pinyin, vi]")
        elif w.get("hz") and w["hz"] not in ex[0]:
            errs.append(f"{where} câu ví dụ không chứa từ {w['hz']}")
        elif not TONE.search(ex[1]):
            errs.append(f"{where} pinyin ví dụ không có dấu thanh")
        if w.get("hz") in got:
            errs.append(f"{where} trùng từ {w['hz']}")
        got[w.get("hz")] = w
missing = [h for h in want if h not in got]
extra = [h for h in got if h not in set(want)]
print(f"đầu vào {len(want)} từ, đã soạn {len(got)}, còn thiếu {len(missing)}, thừa {len(extra)}, lỗi {len(errs)}")
for e in errs[:40]:
    print("  " + e)
if missing:
    print("  thiếu:", " ".join(missing[:80]), "..." if len(missing) > 80 else "")
if extra:
    print("  thừa:", " ".join(extra[:40]))
sys.exit(1 if (missing or errs) else 0)
