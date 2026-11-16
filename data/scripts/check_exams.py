#!/usr/bin/env python3
"""Kiểm tra các đề trong data/exams/*.json: đúng số câu theo cấu trúc HSK 3.0, đủ đáp án và giải thích,
phân bố đáp án, từ ngoài cấp (so với data/hsk/hsk3/).

Chạy: python3 data/scripts/check_exams.py
"""
import collections, glob, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# số câu mỗi phần thi theo bìa đề mẫu HSK 3.0 (CLEC)
SPEC = {
    1: {"listening": 20, "reading": 20},
    2: {"listening": 25, "reading": 25, "writing": 10},
    3: {"listening": 30, "reading": 30, "writing": 10},
    4: {"listening": 32, "reading": 32, "writing": 6},
    5: {"listening": 35, "reading": 35, "writing": 2},
    6: {"listening": 40, "reading": 40, "writing": 2},
}


def load_levels():
    lv = {}
    for f in glob.glob(os.path.join(ROOT, "data", "hsk", "hsk3", "hsk3-*.json")):
        for w in json.load(open(f, encoding="utf-8")):
            lv[w["hz"]] = w["hsk3"]
    return lv


def main():
    levels = load_levels()
    bad = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "exams", "*.json"))):
        name = os.path.basename(f)
        try:
            e = json.load(open(f, encoding="utf-8"))
        except json.JSONDecodeError as ex:
            print(f"✗ {name}: JSON lỗi {ex}")
            bad += 1
            continue
        lv = e.get("level")
        errs, counts, nos, dist = [], collections.Counter(), [], collections.Counter()
        for sec in e.get("sections", []):
            for part in sec.get("parts", []):
                for g in part.get("groups", []):
                    for it in g.get("items", []):
                        counts[sec["key"]] += 1
                        nos.append(it.get("no"))
                        tag = f"câu {it.get('no')}"
                        if not it.get("explain_vi"):
                            errs.append(f"{tag}: thiếu explain_vi")
                        opts, ans = it.get("options") or [], it.get("answer")
                        if opts:
                            if not isinstance(ans, int) or not 0 <= ans < len(opts):
                                errs.append(f"{tag}: answer {ans!r} không hợp lệ với {len(opts)} lựa chọn")
                            elif len(opts) > 2:
                                dist["ABCDEF"[ans]] += 1
                        elif not it.get("sample_answer"):
                            errs.append(f"{tag}: câu tự luận thiếu sample_answer")
        spec = SPEC.get(lv)
        if spec:
            for k, n in spec.items():
                if counts[k] != n:
                    errs.append(f"phần {k}: {counts[k]} câu, đề chính thức {n}")
            extra = set(counts) - set(spec)
            if extra:
                errs.append(f"có phần không thuộc đề chính thức: {sorted(extra)}")
        if nos != list(range(1, len(nos) + 1)):
            errs.append("số câu không liên tục từ 1")
        oow = (e.get("self_check") or {}).get("out_of_level_words") or []
        high = [w for w in oow if isinstance(lv, int) and levels.get(w, 99) > lv]
        status = "✓" if not errs else "✗"
        bad += bool(errs)
        print(f"{status} {name}: cấp {lv}, {sum(counts.values())} câu {dict(counts)}, đáp án {dict(sorted(dist.items()))}, từ vượt cấp tự khai {len(high)}")
        for x in errs[:15]:
            print("    " + x)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
