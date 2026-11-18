#!/usr/bin/env python3
"""Kiểm tra lộ trình từng bước Giai đoạn 1–6 (sinh trong js/path-hsk.js từ LESSONS / VOCAB / READINGS).

Mở rộng ý của check_stage0.py (Giai đoạn 0 vẫn kiểm bằng check_stage0.py). Đọc dữ liệu web bằng Node, rồi kiểm:
  1. Mỗi giai đoạn N gồm đúng các bài HSK 2.0 cấp N (bài chính + «Bổ sung 2012», không có bài HSK 3.0), đúng thứ tự.
  2. Mỗi phần tham chiếu bài có thật; từ (mã từ) có trong VOCAB và thuộc đúng bài; chỉ số ngữ pháp / câu mẫu có thật;
     bài đọc có thật và gắn đúng bài (READINGS.after) ở phần cuối.
  3. Không phần nào rỗng; mỗi từ của bài nằm ở đúng một phần (không sót, không lặp, kể cả giữa các bài);
     mỗi điểm ngữ pháp đúng một lần; hội thoại và câu mẫu ở phần cuối của bài.
  4. Thời lượng mỗi phần 15–30 phút và đúng công thức PATH_MIN.
  5. Kiểm tra nhanh / luyện nhanh: mỗi từ của phần đúng một câu; câu sắp xếp lấy từ câu mẫu của bài (≥ 3 mảnh).
  6. Câu nghe an toàn: từ nhiều chữ là từ đầu mục VOCAB chỉ có một cách đọc, đáp án là pinyin của nó; chữ đơn phải chỉ có
     một cách đọc (không tính thanh nhẹ) theo CC-CEDICT (data/raw/cedict.txt.gz nếu đã tải, nếu không thì py + py_alt
     của data/hsk/all-words.json, vốn lấy từ CC-CEDICT) và cách đọc đó bằng đáp án. Pinyin đáp án phải hợp lệ.
  7. Bài ôn chặng (Giai đoạn 4–6) gồm đúng từ của các phần trong chặng; chặng nối tiếp, phủ hết các phần.
  8. Mã bài không trùng; kiểm tra tổng hợp dùng cấp có trong EXAM_SPEC.

Chạy:  python data/scripts/check_path.py   (cần node)
"""
import gzip, json, os, re, subprocess, sys, unicodedata
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_syllables import split_py, VALID, mark  # noqa: E402

JS = r"""
const fs=require('fs'),vm=require('vm'),path=require('path');const root=process.argv[1];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext('var window=this.window;',ctx);
for(const m of html.matchAll(/<script src="(js\/data\/[^"]+)"|<script>([^<]*)<\/script>/g))
  vm.runInContext(m[1]?fs.readFileSync(path.join(root,m[1]),'utf8'):m[2],ctx,{filename:m[1]||'inline'});
for(const f of ['js/path-hsk.js','js/exam.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const W=ctx.window;
process.stdout.write(JSON.stringify({SYLLS:W.SYLLABLES.map(r=>r[0]).concat(W.SYLLABLES_RARE||[]),STAGES:W.STAGES.filter(s=>s.id>0),MIN:W.PATH_MIN,EXAM:Object.keys(W.EXAM_SPEC),
  LESSONS:W.LESSONS.map(l=>({id:l.id,level:l.level,h3:!!l.h3,g:l.grammar.length,d:(l.dialogue||[]).length,s:(l.sentences||[]).map(s=>s[0])})),
  VOCAB:W.VOCAB.map(w=>({id:w.id,hz:w.hz,py:w.py,vi:w.vi,l:w.l})),READINGS:W.READINGS.map(r=>({id:r.id,after:r.after,level:r.level}))}));
"""

nfc = lambda s: unicodedata.normalize("NFC", s).lower()
TONED = re.compile(r"[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]")


def load_readings(web_sylls):
    """chữ đơn → tập cách đọc (âm, thanh). Ưu tiên CC-CEDICT gốc, không có thì dùng py + py_alt của all-words.json."""
    sylls = set()
    words = json.load(open(os.path.join(ROOT, "data", "hsk", "all-words.json"), encoding="utf-8"))
    raw = os.path.join(ROOT, "data", "raw", "cedict.txt.gz")
    readings = defaultdict(set)
    if os.path.exists(raw):
        src = "CC-CEDICT (data/raw/cedict.txt.gz)"
        with gzip.open(raw, "rt", encoding="utf-8") as f:
            for line in f:
                m = re.match(r"(\S+) (\S+) \[([^\]]+)\]", line)
                if not m or line.startswith("#") or len(m.group(2)) != 1:
                    continue
                for r in m.group(3).lower().replace("u:", "ü").split():
                    mm = re.fullmatch(r"([a-zü]+)([1-5])", r)
                    if mm and VALID.fullmatch(mm.group(1)):
                        readings[m.group(2)].add((mm.group(1), int(mm.group(2))))
                        sylls.add(mm.group(1))
    else:
        src = "py + py_alt trong data/hsk/all-words.json (lấy từ CC-CEDICT)"
    # tập âm tiết: lấy từ bảng âm tiết của web (dựng từ CC-CEDICT) nếu chưa có CC-CEDICT gốc
    if not sylls:
        sylls.update(web_sylls)
    if not readings:
        for w in words:
            if len(w["hz"]) == 1:
                for p in [w["py"], *w.get("py_alt", [])]:
                    sp = split_py(p, 1, sylls)
                    if sp:
                        readings[w["hz"]].add(sp[0])
    return readings, sylls, src


def main():
    data = json.loads(subprocess.run(["node", "-e", JS, ROOT], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    readings, sylls, src = load_readings(data["SYLLS"])
    if len(sylls) < 380:
        sys.exit(f"Không đọc được danh sách âm tiết ({len(sylls)})")
    MIN = data["MIN"]
    L = {l["id"]: l for l in data["LESSONS"]}
    V = {w["id"]: w for w in data["VOCAB"]}
    by_lesson = defaultdict(list)
    for w in data["VOCAB"]:
        by_lesson[w["l"]].append(w["id"])
    pys_of_hz = defaultdict(set)
    for w in data["VOCAB"]:
        pys_of_hz[w["hz"]].add(nfc(w["py"]))
    level_of = lambda l: l.get("level") or (1 if l["id"] <= 12 else 2 if l["id"] <= 24 else 3 if l["id"] <= 44 else 4 if l["id"] <= 84 else 5 if l["id"] <= 149 else 6)
    errs, n = [], Counter()
    ids = Counter()

    PLAIN = {c: v for v, ms in {"a": "āáǎà", "e": "ēéěè", "i": "īíǐì", "o": "ōóǒò", "u": "ūúǔù", "ü": "ǖǘǚǜ"}.items() for c in ms}

    def valid_py(hz, py):
        """Pinyin của từ tách được thành đúng số âm tiết của từ (儿 hoá viết -r gộp vào âm trước); mỗi âm tiết có thật,
        dấu đặt đúng chỗ; âm tiết bắt đầu bằng a/o/e ở giữa từ phải có dấu nháy hoặc dấu cách đứng trước."""
        s0, k = nfc(py), len(hz)
        if hz.endswith("儿") and len(hz) > 1 and re.search(r"[^eēéěè]r$", s0):
            s0, k = s0[:-1], k - 1
        toks, sep = [], True  # (ký tự, được phép bắt đầu âm tiết sau dấu tách)
        for c in s0:
            if c in " '’-":
                sep = True
                continue
            toks.append((c, sep))
            sep = False
        chars = "".join(c for c, _ in toks)

        def go(i, left):
            if i == len(chars):
                return left == 0
            if left == 0:
                return False
            for j in range(i + 1, min(len(chars), i + 6) + 1):
                seg = chars[i:j]
                plain = "".join(PLAIN.get(c, c) for c in seg)
                if plain not in sylls or (i and plain[0] in "aoe" and not toks[i][1]):
                    continue
                tones = [t for t in (("āēīōūǖ".find(c) >= 0 and 1) or ("áéíóúǘ".find(c) >= 0 and 2) or ("ǎěǐǒǔǚ".find(c) >= 0 and 3) or ("àèìòùǜ".find(c) >= 0 and 4) or 0 for c in seg) if t]
                if len(tones) > 1 or mark(plain, tones[0] if tones else 5) != seg:
                    continue
                if go(j, left - 1):
                    return True
            return False

        return go(0, k)

    def hear_ok(w, where):
        n["câu nghe (từ an toàn)"] += 1
        hz, py = w["hz"], w["py"]
        if not re.fullmatch(r"[一-鿿]+", hz):
            return errs.append(f"{where}: «{hz}» không phải chữ Hán thuần")
        if pys_of_hz[hz] != {nfc(py)}:
            return errs.append(f"{where}: «{hz}» có nhiều cách đọc trong VOCAB {sorted(pys_of_hz[hz])}")
        if not valid_py(hz, py):
            errs.append(f"{where}: pinyin «{py}» không hợp lệ")
        if len(hz) == 1:
            rs = {r for r in readings.get(hz, ()) if r[1] != 5}
            want = split_py(py, 1, sylls)
            if not (want and len(rs) == 1 and want[0] in rs):
                errs.append(f"{where}: chữ «{hz}» có cách đọc {sorted(rs)}, đáp án {py}")

    for st in data["STAGES"]:
        N = st["id"]
        want = [l["id"] for l in data["LESSONS"] if not l["h3"] and level_of(l) == N]
        want.sort(key=lambda i: (i > 300, i))
        if st["lessons"] != want:
            errs.append(f"Giai đoạn {N}: danh sách bài {st['lessons']} khác bài HSK cấp {N} {want}")
        if str(st["test"]["exam"]) not in data["EXAM"] or st["test"]["exam"] != N:
            errs.append(f"Giai đoạn {N}: kiểm tra tổng hợp dùng đề cấp {st['test']['exam']}")
        ids[st["test"]["id"]] += 1
        parts = [x for x in st["steps"] if x["kind"] == "part"]
        seen_words = Counter()
        for lid in want:
            ps = [p for p in parts if p["lesson"] == lid]
            if not ps:
                errs.append(f"Giai đoạn {N}: bài {lid} không có phần nào")
                continue
            if [p["part"] for p in ps] != list(range(len(ps))) or any(p["of"] != len(ps) for p in ps):
                errs.append(f"bài {lid}: thứ tự phần sai")
            got = [w for p in ps for w in p["words"]]
            if sorted(got) != sorted(by_lesson[lid]):
                miss = set(by_lesson[lid]) - set(got)
                errs.append(f"bài {lid}: từ bị sót {sorted(miss)} hoặc lặp {[w for w, c in Counter(got).items() if c > 1]}")
            g = sorted(i for p in ps for i in p["grammar"])
            if g != list(range(L[lid]["g"])):
                errs.append(f"bài {lid}: ngữ pháp chia sai {g}")
            for p in ps[:-1]:
                if p["dialogue"] or p["sentences"] or p["reading"]:
                    errs.append(f"{p['id']}: hội thoại / câu mẫu / bài đọc phải ở phần cuối")
            last = ps[-1]
            if not last["dialogue"] or last["sentences"] != list(range(len(L[lid]["s"]))):
                errs.append(f"{last['id']}: phần cuối thiếu hội thoại hoặc câu mẫu")
            rd = [r for r in data["READINGS"] if r["after"] == lid]
            if (rd[0]["id"] if rd else None) != last["reading"]:
                errs.append(f"{last['id']}: bài đọc {last['reading']} không khớp READINGS.after ({[r['id'] for r in rd]})")
        for p in parts:
            where = p["id"]
            ids[where] += 1
            n["phần"] += 1
            lid = p["lesson"]
            if lid not in L or lid not in want:
                errs.append(f"{where}: bài {lid} không thuộc giai đoạn {N}")
                continue
            if not p["words"]:
                errs.append(f"{where}: phần rỗng")
            for wid in p["words"]:
                n["lượt từ"] += 1
                seen_words[wid] += 1
                if wid not in V or V[wid]["l"] != lid:
                    errs.append(f"{where}: từ {wid} không có hoặc không thuộc bài {lid}")
            for i in p["grammar"]:
                if not 0 <= i < L[lid]["g"]:
                    errs.append(f"{where}: ngữ pháp #{i} không có")
            for i in p["sentences"]:
                if not 0 <= i < len(L[lid]["s"]):
                    errs.append(f"{where}: câu mẫu #{i} không có")
            m = int(0.5 + len(p["words"]) * MIN["word"] + len(p["grammar"]) * MIN["grammar"] + (L[lid]["d"] * MIN["line"] if p["dialogue"] else 0)
                      + len(p["sentences"]) * MIN["sentence"] + len(p["quiz"]) * MIN["question"] + (MIN["tips"] if p["tips"] else 0) + MIN["base"])
            if p["min"] != m or not 15 <= p["min"] <= 30:
                errs.append(f"{where}: thời lượng {p['min']} phút (công thức {m}), cần 15–30")
            n["phút"] += p["min"]
            for wid in p["hear"]:
                if wid not in p["words"]:
                    errs.append(f"{where}: từ nghe {wid} không thuộc phần")
                elif wid in V:
                    hear_ok(V[wid], f"{where} từ nghe {V[wid]['hz']}")
            for key in ("quiz", "drill"):
                qs = p[key]
                wq = [q["id"] for q in qs if q["t"] != "order"]
                if sorted(wq) != sorted(p["words"]):
                    errs.append(f"{where} {key}: mỗi từ phải đúng một câu")
                for q in qs:
                    n[f"câu {key}"] += 1
                    if q["t"] == "hear" and q["id"] not in p["hear"]:
                        errs.append(f"{where} {key}: câu nghe dùng từ {q['id']} không nằm trong danh sách nghe an toàn")
                    if q["t"] == "order":
                        if key == "drill" or q["lesson"] != lid or q["k"] not in p["sentences"] or len(L[lid]["s"][q["k"]].split()) < 3:
                            errs.append(f"{where} {key}: câu sắp xếp sai {q}")
                    elif q["t"] not in ("mean", "char", "hear"):
                        errs.append(f"{where} {key}: dạng câu lạ {q['t']}")
        dup = [w for w, c in seen_words.items() if c > 1]
        if dup:
            errs.append(f"Giai đoạn {N}: từ lặp giữa các phần {dup[:10]}")
        # chặng và bài ôn
        if st["chang"]:
            flat = [i for c in st["chang"] for i in c["steps"]]
            if flat != [x["id"] for x in st["steps"]]:
                errs.append(f"Giai đoạn {N}: các chặng không phủ đúng thứ tự các bài")
            for c in st["chang"]:
                rv = next(x for x in st["steps"] if x["id"] == c["steps"][-1])
                ids[rv["id"]] += 1
                n["bài ôn chặng"] += 1
                if rv["kind"] != "review" or rv["parts"] != c["steps"][:-1]:
                    errs.append(f"{rv['id']}: bài ôn không khớp chặng")
                ws = [w for x in st["steps"] if x["id"] in rv["parts"] for w in x["words"]]
                if rv["words"] != ws or rv["n"] > len(ws) or not 15 <= rv["min"] <= 30:
                    errs.append(f"{rv['id']}: từ / số câu / thời lượng bài ôn sai")
                if sorted({x["lesson"] for x in st["steps"] if x["id"] in rv["parts"]}) != sorted(rv["lessons"]):
                    errs.append(f"{rv['id']}: danh sách bài sai")
        elif any(x["kind"] != "part" for x in st["steps"]):
            errs.append(f"Giai đoạn {N}: có bài ôn nhưng không chia chặng")
        n["bài đọc"] += sum(1 for p in parts if p["reading"])
    for i, c in ids.items():
        if c > 1:
            errs.append(f"mã bài trùng: {i}")

    print(f"Nguồn cách đọc chữ đơn: {src}")
    for st in data["STAGES"]:
        parts = [x for x in st["steps"] if x["kind"] == "part"]
        print(f"  Giai đoạn {st['id']}: {len(st['lessons'])} bài → {len(parts)} phần, {sum(len(p['words']) for p in parts)} từ, "
              f"{sum(1 for p in parts if p['reading'])} bài đọc, {len(st['chang'])} chặng, {sum(p['min'] for p in parts)} phút "
              f"(phần {min(p['min'] for p in parts)}–{max(p['min'] for p in parts)} phút), {sum(len(p['hear']) for p in parts)} từ dùng cho câu nghe")
    print("Đã kiểm:", ", ".join(f"{v} {k}" for k, v in n.items()))
    if errs:
        print(f"{len(errs)} lỗi:")
        print("\n".join("  - " + e for e in errs))
        sys.exit(1)
    print("Không có lỗi.")


if __name__ == "__main__":
    main()
