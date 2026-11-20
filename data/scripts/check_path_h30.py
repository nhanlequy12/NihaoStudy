#!/usr/bin/env python3
"""Kiểm tra phần «Bù HSK 3.0» của lộ trình (sinh trong js/path-h30.js từ H3_LESSONS / HSK3_WORDS / VOCAB, nối vào STAGES sau js/path-hsk.js).

Cùng tinh thần với check_path.py (kiểm phần HSK 2.0); tệp này chỉ kiểm các bước opt (Bù HSK 3.0):
  1. Giai đoạn N có đúng các bài H3_LESSONS cấp N, đúng thứ tự; giai đoạn không có bài cấp N thì không có bước bù nào.
  2. Mọi từ của phần có thật: mã VOCAB (đúng chữ của bài) hoặc "h3_<chữ>" có dòng đầy đủ trong HSK3_WORDS; mọi chữ trong
     H3_LESSONS.words đều được đưa vào đúng một phần (không sót, không lặp); ngữ pháp mỗi điểm một lần; hội thoại và câu mẫu ở
     phần cuối; không phần nào rỗng; thời lượng đúng công thức PATH_MIN và trong 15–30 phút.
  3. Câu nghe chỉ dùng từ một cách đọc: chữ Hán thuần, một pinyin duy nhất trong VOCAB ∪ HSK3_WORDS; chữ đơn phải chỉ có một cách
     đọc (không tính thanh nhẹ) theo CC-CEDICT (nguồn như check_path.py) và bằng đáp án.
  4. Kiểm tra nhanh / luyện nhanh: mỗi từ đúng một câu; câu sắp xếp lấy từ câu mẫu của bài (≥ 3 mảnh) và chỉ ở phần cuối.
  5. Các bước bù nằm sau mọi bước HSK 2.0 và trước kiểm tra tổng hợp; giai đoạn có chặng thì chặng cuối là «Bù HSK 3.0» gồm đúng
     các phần bù và một bài ôn. Mã bước không trùng trong toàn bộ STAGES (kể cả Giai đoạn 0 và phần HSK 2.0).

Chạy:  python data/scripts/check_path_h30.py   (cần node)
"""
import json, os, re, subprocess, sys, unicodedata
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_syllables import split_py  # noqa: E402
from check_path import load_readings  # noqa: E402

NAME = "Bù HSK 3.0"
JS = r"""
const fs=require('fs'),vm=require('vm'),path=require('path');const root=process.argv[1];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext('var window=this.window;',ctx);
for(const m of html.matchAll(/<script src="(js\/data\/[^"]+)"|<script>([^<]*)<\/script>/g))
  vm.runInContext(m[1]?fs.readFileSync(path.join(root,m[1]),'utf8'):m[2],ctx,{filename:m[1]||'inline'});
const order=[...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m=>m[1]);
for(const f of ['js/path-hsk.js','js/path-h30.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const W=ctx.window;
process.stdout.write(JSON.stringify({ORDER:order,SYLLS:W.SYLLABLES.map(r=>r[0]).concat(W.SYLLABLES_RARE||[]),STAGES:W.STAGES,MIN:W.PATH_MIN,
  H3:W.H3_LESSONS.map(l=>({id:l.id,level:l.level,words:l.words,g:l.grammar.length,d:(l.dialogue||[]).length,s:(l.sentences||[]).map(s=>s[0])})),
  H3W:W.HSK3_WORDS.filter(r=>r.length>2).map(r=>[r[0],r[1]]),
  VOCAB:W.VOCAB.map(w=>({id:w.id,hz:w.hz,py:w.py,l:w.l}))}));
"""
nfc = lambda s: unicodedata.normalize("NFC", s).lower()


def main():
    data = json.loads(subprocess.run(["node", "-e", JS, ROOT], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    readings, sylls, src = load_readings(data["SYLLS"])
    if len(sylls) < 380:
        sys.exit(f"Không đọc được danh sách âm tiết ({len(sylls)})")
    MIN = data["MIN"]
    errs, n = [], Counter()
    order = data["ORDER"]
    for f in ("js/data/h30-words.js", "js/data/h30-lessons.js", "js/path-hsk.js"):
        if f not in order or order.index(f) > order.index("js/path-h30.js"):
            errs.append(f"index.html: {f} phải nạp trước js/path-h30.js")

    # từ: VOCAB (mục đầu tiên theo chữ, như js/h30.js) và từ chỉ có trong HSK 3.0
    V = {w["id"]: w for w in data["VOCAB"]}
    first_by_hz = {}
    for w in data["VOCAB"]:
        first_by_hz.setdefault(w["hz"], w)
    h3w = {}
    for hz, py in data["H3W"]:
        h3w.setdefault(hz, py)
    pys_of_hz = defaultdict(set)
    for w in data["VOCAB"]:
        pys_of_hz[w["hz"]].add(nfc(w["py"]))
    for hz, py in data["H3W"]:
        pys_of_hz[hz].add(nfc(py))

    def resolve(hz):
        """mã từ mong đợi cho một chữ của bài bổ sung (giống js/h30.js), None nếu không có dữ liệu"""
        if hz in first_by_hz:
            return first_by_hz[hz]["id"]
        return "h3_" + hz if hz in h3w else None

    def word_of(wid):
        if wid in V:
            return V[wid]["hz"], V[wid]["py"]
        if wid.startswith("h3_") and wid[3:] in h3w:
            return wid[3:], h3w[wid[3:]]
        return None

    def hear_ok(hz, py, where):
        n["câu nghe (từ an toàn)"] += 1
        if not re.fullmatch(r"[一-鿿]+", hz):
            return errs.append(f"{where}: «{hz}» không phải chữ Hán thuần")
        if pys_of_hz[hz] != {nfc(py)}:
            return errs.append(f"{where}: «{hz}» có nhiều cách đọc {sorted(pys_of_hz[hz])}")
        if len(hz) == 1:
            rs = {r for r in readings.get(hz, ()) if r[1] != 5}
            want = split_py(py, 1, sylls)
            if not (want and len(rs) == 1 and want[0] in rs):
                errs.append(f"{where}: chữ «{hz}» có cách đọc {sorted(rs)}, đáp án {py}")

    L = {l["id"]: l for l in data["H3"]}
    ids = Counter()
    for st in data["STAGES"]:
        ids[st["test"]["id"]] += 1
        for x in st["steps"]:
            ids[x["id"]] += 1
        N = st["id"]
        if N == 0:
            continue
        want = [l["id"] for l in data["H3"] if l["level"] == N]
        opt = [x for x in st["steps"] if x.get("opt")]
        if st.get("bridge", []) != want:
            errs.append(f"Giai đoạn {N}: bài bù {st.get('bridge')} khác bài H3 cấp {N} {want}")
        # vị trí: mọi bước bù nằm cuối danh sách, sau mọi bước HSK 2.0
        k = len(st["steps"]) - len(opt)
        if any(x.get("opt") for x in st["steps"][:k]) or any(not x.get("opt") for x in st["steps"][k:]):
            errs.append(f"Giai đoạn {N}: bước bù không nằm liền sau các bước HSK 2.0")
        parts = [x for x in opt if x["kind"] == "part"]
        if not want:
            if opt or any(c.get("opt") or c["name"] == NAME for c in st["chang"]):
                errs.append(f"Giai đoạn {N}: không có bài H3 cấp {N} nhưng vẫn có bước / chặng bù")
            continue
        if [p["lesson"] for p in parts] != [lid for lid in want for _ in range(sum(1 for p in parts if p["lesson"] == lid))]:
            errs.append(f"Giai đoạn {N}: các phần bù không theo thứ tự bài")
        for lid in want:
            ps = [p for p in parts if p["lesson"] == lid]
            if not ps:
                errs.append(f"Giai đoạn {N}: bài {lid} không có phần nào")
                continue
            if [p["part"] for p in ps] != list(range(len(ps))) or any(p["of"] != len(ps) for p in ps) or len(ps) > 4:
                errs.append(f"bài {lid}: thứ tự / số phần sai")
            exp = [resolve(hz) for hz in L[lid]["words"]]
            if None in exp:
                errs.append(f"bài {lid}: chữ không có dữ liệu {[hz for hz, e in zip(L[lid]['words'], exp) if e is None]}")
            got = [w for p in ps for w in p["words"]]
            if sorted(got) != sorted(e for e in exp if e):
                errs.append(f"bài {lid}: từ bị sót {sorted(set(e for e in exp if e) - set(got))} hoặc lặp/lạ {sorted(set(got) - set(exp))}")
            g = sorted(i for p in ps for i in p["grammar"])
            if g != list(range(L[lid]["g"])):
                errs.append(f"bài {lid}: ngữ pháp chia sai {g}")
            if not ps[0]["tips"] or any(p["tips"] for p in ps[1:]):
                errs.append(f"bài {lid}: mẹo phải ở phần đầu")
            for p in ps[:-1]:
                if p["dialogue"] or p["sentences"] or p["reading"]:
                    errs.append(f"{p['id']}: hội thoại / câu mẫu / bài đọc phải ở phần cuối")
            last = ps[-1]
            if not last["dialogue"] or last["sentences"] != list(range(len(L[lid]["s"]))):
                errs.append(f"{last['id']}: phần cuối thiếu hội thoại hoặc câu mẫu")
        for p in parts:
            where = p["id"]
            n["phần"] += 1
            lid = p["lesson"]
            if not re.fullmatch(rf"s{N}-{re.escape(lid)}[a-d]", where):
                errs.append(f"{where}: mã phần không đúng dạng s{N}-{lid}<a-d>")
            if not p["words"]:
                errs.append(f"{where}: phần rỗng")
            for wid in p["words"]:
                n["lượt từ"] += 1
                if word_of(wid) is None:
                    errs.append(f"{where}: từ {wid} không có")
            for i in p["grammar"]:
                if not 0 <= i < L[lid]["g"]:
                    errs.append(f"{where}: ngữ pháp #{i} không có")
            m = int(0.5 + len(p["words"]) * MIN["word"] + len(p["grammar"]) * MIN["grammar"] + (L[lid]["d"] * MIN["line"] if p["dialogue"] else 0)
                      + len(p["sentences"]) * MIN["sentence"] + len(p["quiz"]) * MIN["question"] + (MIN["tips"] if p["tips"] else 0) + MIN["base"])
            if p["min"] != m or not 15 <= p["min"] <= 30:
                errs.append(f"{where}: thời lượng {p['min']} phút (công thức {m}), cần 15–30")
            n["phút"] += p["min"]
            for wid in p["hear"]:
                if wid not in p["words"]:
                    errs.append(f"{where}: từ nghe {wid} không thuộc phần")
                elif word_of(wid):
                    hear_ok(*word_of(wid), f"{where} từ nghe {word_of(wid)[0]}")
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
        # chặng và bài ôn
        if st["chang"]:
            c = st["chang"][-1]
            if c["name"] != NAME or not c.get("opt") or c["steps"] != [x["id"] for x in opt] or c["lessons"] != want:
                errs.append(f"Giai đoạn {N}: chặng cuối phải là «{NAME}» gồm đúng các bước bù")
            if any(cc["name"] == NAME for cc in st["chang"][:-1]):
                errs.append(f"Giai đoạn {N}: có hơn một chặng «{NAME}»")
            flat = [i for cc in st["chang"] for i in cc["steps"]]
            if flat != [x["id"] for x in st["steps"]]:
                errs.append(f"Giai đoạn {N}: các chặng không phủ đúng thứ tự các bước")
            rv = opt[-1] if opt else None
            if not rv or rv["kind"] != "review" or rv["id"] != f"s{N}-h3r" or rv["parts"] != [p["id"] for p in parts] or rv["lessons"] != want:
                errs.append(f"Giai đoạn {N}: bài ôn chặng bù thiếu hoặc sai")
            else:
                n["bài ôn chặng"] += 1
                ws = [w for p in parts for w in p["words"]]
                if rv["words"] != ws or rv["n"] > len(ws) or not 15 <= rv["min"] <= 30:
                    errs.append(f"{rv['id']}: từ / số câu / thời lượng bài ôn sai")
        elif any(x["kind"] != "part" for x in opt):
            errs.append(f"Giai đoạn {N}: có bài ôn bù nhưng không chia chặng")
    for i, c in ids.items():
        if c > 1:
            errs.append(f"mã bước trùng: {i}")

    print(f"Nguồn cách đọc chữ đơn: {src}")
    for st in data["STAGES"]:
        if st["id"] == 0:
            continue
        parts = [x for x in st["steps"] if x.get("opt") and x["kind"] == "part"]
        if not parts:
            print(f"  Giai đoạn {st['id']}: không có bài bù HSK 3.0")
            continue
        print(f"  Giai đoạn {st['id']}: {len(st['bridge'])} bài bù → {len(parts)} phần, {sum(len(p['words']) for p in parts)} từ, "
              f"{sum(1 for x in st['steps'] if x.get('opt') and x['kind'] == 'review')} bài ôn, {sum(p['min'] for p in parts)} phút "
              f"(phần {min(p['min'] for p in parts)}–{max(p['min'] for p in parts)} phút), {sum(len(p['hear']) for p in parts)} từ dùng cho câu nghe")
    print("Đã kiểm:", ", ".join(f"{v} {k}" for k, v in n.items()))
    if errs:
        print(f"{len(errs)} lỗi:")
        print("\n".join("  - " + e for e in errs))
        sys.exit(1)
    print("Không có lỗi.")


if __name__ == "__main__":
    main()
