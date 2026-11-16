#!/usr/bin/env python3
"""Ghép bộ dữ liệu từ vựng HSK (2.0 và 3.0) từ các nguồn mở và phần tiếng Việt tự biên soạn.

Đầu vào (tải bằng fetch_sources.sh vào thư mục --raw):
  hsk_complete.json      danh sách HSK 2.0/3.0 (drkameleon/complete-hsk-vocabulary, MIT; nghĩa tiếng Anh từ CC-CEDICT)
  cedict.txt.gz          CC-CEDICT (CC BY-SA 4.0), chỉ dùng để ghi phiên bản
  unihan/                Unihan (Unicode License v3): số nét, bộ thủ, âm đọc tiếng Việt
  mmah_dictionary.txt    Make Me a Hanzi dictionary.txt (LGPL-3.0+): phân tách chữ, gợi ý nguồn gốc

Phần tiếng Việt tự soạn:
  js/data/*.js           nội dung có sẵn của web (2.494 từ HSK 1–5)
  data/vi/*.jsonl        nghĩa, Hán Việt, từ loại, câu ví dụ soạn thêm

Đầu ra: data/hsk/... (xem data/README.md).

Chạy:  python3 data/scripts/build_dataset.py --raw data/raw
"""
import argparse, csv, glob, gzip, json, os, re, subprocess, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "data", "hsk")

POS_VI = {
    "a": "tính từ", "ad": "tính từ", "an": "tính từ", "ag": "tính từ", "b": "tính từ",
    "c": "liên từ", "d": "phó từ", "dg": "phó từ", "e": "thán từ", "f": "phương vị từ",
    "i": "thành ngữ", "l": "cụm cố định", "j": "từ viết tắt", "m": "số từ", "mg": "số từ",
    "n": "danh từ", "ng": "danh từ", "nr": "tên riêng", "ns": "địa danh", "nt": "tên tổ chức",
    "nz": "danh từ riêng", "nx": "danh từ", "o": "từ tượng thanh", "p": "giới từ",
    "q": "lượng từ", "r": "đại từ", "rg": "đại từ", "s": "từ chỉ nơi chốn", "t": "từ chỉ thời gian",
    "tg": "từ chỉ thời gian", "u": "trợ từ", "v": "động từ", "vd": "động từ", "vg": "động từ",
    "vn": "động từ", "y": "trợ từ ngữ khí", "z": "tính từ", "h": "tiền tố", "k": "hậu tố",
    "g": "ngữ tố", "x": "khác", "w": "ký hiệu",
}


def load_existing_site_vocab():
    """Đọc nội dung tiếng Việt đã có trong web bằng node (các tệp js/data/*.js)."""
    js = r"""
const fs=require('fs'),vm=require('vm'),path=require('path');const root=process.argv[1];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="(js\/data\/[^"]+)"/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext('var window=this.window;',ctx);
for(const f of files) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const lv=(w)=>w.level||(w.l<=12?1:2);
process.stdout.write(JSON.stringify(ctx.window.VOCAB.map(w=>({hz:w.hz,py:w.py,hv:w.hv,vi:w.vi,pos:w.pos,ex:w.ex,lesson:w.l,site_level:lv(w)}))));
"""
    out = subprocess.run(["node", "-e", js, ROOT], capture_output=True, text=True, check=True).stdout
    res = {}
    for w in json.loads(out):
        res.setdefault(w["hz"], w)
    return res


def load_authored_vi():
    res = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "vi", "*.jsonl"))):
        for n, line in enumerate(open(f, encoding="utf-8"), 1):
            line = line.strip()
            if not line:
                continue
            try:
                w = json.loads(line)
            except json.JSONDecodeError as e:
                print(f"  ! bỏ qua {os.path.basename(f)}:{n}: {e}", file=sys.stderr)
                continue
            if w.get("hz") and w.get("vi"):
                res.setdefault(w["hz"], dict(w, _file=os.path.basename(f)))
    return res


def load_unihan(raw):
    want = {"kTotalStrokes", "kRSUnicode", "kVietnamese", "kDefinition", "kMandarin"}
    data = defaultdict(dict)
    for f in ("Unihan_IRGSources.txt", "Unihan_RadicalStrokeCounts.txt", "Unihan_Readings.txt", "Unihan_DictionaryLikeData.txt"):
        p = os.path.join(raw, "unihan", f)
        if not os.path.exists(p):
            continue
        for line in open(p, encoding="utf-8"):
            if line.startswith("#") or not line.strip():
                continue
            cp, key, val = line.rstrip("\n").split("\t", 2)
            if key in want:
                data[chr(int(cp[2:], 16))][key] = val
    version = ""
    for line in open(os.path.join(raw, "unihan", "Unihan_Readings.txt"), encoding="utf-8"):
        if line.startswith("# Unicode Version"):
            version = line[2:].strip()
            break
    return data, version


def load_mmah(raw):
    res = {}
    for line in open(os.path.join(raw, "mmah_dictionary.txt"), encoding="utf-8"):
        d = json.loads(line)
        res[d["character"]] = d
    return res


def cedict_version(raw):
    with gzip.open(os.path.join(raw, "cedict.txt.gz"), "rt", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#! date="):
                return line.strip()[8:]
            if not line.startswith("#"):
                break
    return ""


def join_pinyin(p):
    """'Ā lā bó yǔ' -> 'Ālābóyǔ' theo cách viết liền của từ điển; giữ nguyên cách viết hoa."""
    return re.sub(r"\s+", "", p)


def add_apostrophe(py, py_num):
    """Chèn ' trước âm tiết bắt đầu bằng a/o/e (trừ âm tiết đầu) khi chưa có dấu ngăn; chỉ làm khi gióng được với py_num."""
    import unicodedata
    syls = [re.sub(r"[0-9]", "", s).replace("u:", "ü").replace("v", "ü").lower() for s in (py_num or "").split()]
    if len(syls) < 2 or not py:
        return py
    bare = lambda c: unicodedata.normalize("NFD", c)[0].lower()
    out, i = [], 0
    for k, s in enumerate(syls):
        while i < len(py) and py[i] in " -'’":
            out.append(py[i]); i += 1
        seg = py[i:i + len(s)]
        if len(seg) != len(s) or "".join(bare(c) for c in seg) != "".join(bare(c) for c in s):
            return py                                    # không gióng được (儿 hoá, viết khác…): giữ nguyên
        if k == len(syls) - 1 and k > 0 and s == "er" and (py_num or "").split()[-1].lower() in ("er5", "r5", "er"):
            out.append(seg[1:]); i += len(s)              # 儿 hoá: niǔkòuer → niǔkòur
            continue
        if k > 0 and s[0] in "aoe" and out and out[-1] not in " -'’":
            out.append("'")
        out.append(seg); i += len(s)
    return "".join(out) + py[i:]


# âm Hán Việt theo cách đọc, cho chữ đa âm mà hai cách đọc có âm Hán Việt khác nhau (bạn đã duyệt 16/11/2026)
HV_BY_PY = {"划": {"hua2": "hoa", "hua4": "hoạch"}}


def levels_of(w):
    h2 = sorted(int(l.split("-")[1]) for l in w["level"] if l.startswith("old-"))
    h3 = sorted(int(l.split("-")[1]) for l in w["level"] if l.startswith("new-"))
    return (h2[0] if h2 else None), (h3[0] if h3 else None)


POS_ZH_VI = {"名": "danh từ", "动": "động từ", "形": "tính từ", "副": "phó từ", "代": "đại từ", "数": "số từ",
             "量": "lượng từ", "介": "giới từ", "连": "liên từ", "助": "trợ từ", "叹": "thán từ", "拟声": "từ tượng thanh",
             "前缀": "tiền tố", "后缀": "hậu tố", "短语": "cụm từ"}


def load_syllabus(raw):
    """Đề cương HSK 2025 (do extract_syllabus_2025.py tạo). Gộp các nghĩa (本1, 本2…) về một từ, lấy cấp thấp nhất."""
    p = os.path.join(raw, "hsk-syllabus-2025.json")
    if not os.path.exists(p):
        print("  ! chưa có hsk-syllabus-2025.json: chạy extract_syllabus_2025.py", file=sys.stderr)
        return {}
    res = {}
    for r in json.load(open(p, encoding="utf-8")):
        cur = res.get(r["hz"])
        if cur is None:
            res[r["hz"]] = dict(r, pos_list=[r["pos"]])
        else:
            cur["pos_list"].append(r["pos"])
            if r["level"] < cur["level"]:
                cur.update(level=r["level"], py=r["py"])
    return res


def load_cedict(raw, name="cedict.txt.gz", key="en"):
    """Đọc từ điển định dạng CEDICT (CC-CEDICT, CVDICT): giản thể -> [{trad, py_num, en|vi}]."""
    res = {}
    rx = re.compile(r"^(\S+) (\S+) \[([^\]]+)\] /(.+)/$")
    path = os.path.join(raw, name)
    if not os.path.exists(path):
        print(f"  ! thiếu {name}", file=sys.stderr)
        return res
    opener = gzip.open if name.endswith(".gz") else open
    with opener(path, "rt", encoding="utf-8") as f:
        for line in f:
            m = rx.match(line.strip())
            if m:
                res.setdefault(m[2], []).append({"trad": m[1], "py_num": m[3], key: m[4].replace("/", "; ")})
    return res


def norm_num(p):
    return re.sub(r"\s+", "", (p or "").lower().replace("u:", "v").replace("ü", "v"))


def pick_cvdict(entries, py_num, limit=5):
    """Chọn nghĩa CVDICT khớp cách đọc của từ; bỏ mục chỉ là họ/tên riêng viết hoa khi có mục thường."""
    if not entries:
        return ""
    want = norm_num(py_num)
    same = [e for e in entries if norm_num(e["py_num"]) == want] if want else []
    pool = same or [e for e in entries if not e["py_num"][:1].isupper()] or entries
    senses = []
    for e in pool:
        for g in e["vi"].split("; "):
            g = g.strip()
            if g and not g.startswith("họ ") and g not in senses:
                senses.append(g)
    return "; ".join(senses[:limit])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default=os.path.join(ROOT, "data", "raw"))
    ap.add_argument("--no-cedict", action="store_true", help="không đưa nghĩa tiếng Anh CC-CEDICT vào đầu ra")
    ap.add_argument("--with-2021", action="store_true", help="xuất thêm thư mục hsk3-2021/ theo chuẩn GF0025-2021")
    ap.add_argument("--batches", help="xuất các từ còn thiếu tiếng Việt ra thư mục này (cho người/agent soạn)")
    a = ap.parse_args()

    src = json.load(open(os.path.join(a.raw, "hsk_complete.json"), encoding="utf-8"))
    syl = load_syllabus(a.raw)
    site = load_existing_site_vocab()
    authored = load_authored_vi()
    unihan, unihan_ver = load_unihan(a.raw)
    mmah = load_mmah(a.raw)
    cedict = load_cedict(a.raw)
    cvdict = load_cedict(a.raw, "cvdict.u8", "vi")
    cedict_date = cedict_version(a.raw)

    base = {}
    for w in src:
        h2, h3 = levels_of(w)
        hz = w["simplified"]
        if h2 is None and h3 is None and hz not in syl:
            continue
        f0 = w["forms"][0]
        rec = {"hz": hz, "trad": f0["traditional"], "py": join_pinyin(f0["transcriptions"]["pinyin"]),
               "py_num": f0["transcriptions"]["numeric"], "hsk2": h2, "hsk3": None, "hsk3_2021": h3,
               "pos": ",".join(w.get("pos", [])), "freq": w.get("frequency"), "radical": w.get("radical", ""),
               "en": "; ".join(f0["meanings"]), "_pos_codes": w.get("pos", [])}
        alt = list(dict.fromkeys(join_pinyin(f["transcriptions"]["pinyin"]) for f in w["forms"][1:]))
        alt = [p for p in alt if p != rec["py"]]
        if alt:
            rec["py_alt"] = alt
        base[hz] = rec
    added = 0
    for hz, r in syl.items():
        rec = base.get(hz)
        if rec is None:  # từ có trong đề cương 2025 nhưng không có trong danh sách mở
            ce = cedict.get(hz, [])
            rec = {"hz": hz, "trad": ce[0]["trad"] if ce else "", "py": r["py"], "py_num": ce[0]["py_num"] if ce else "",
                   "hsk2": None, "hsk3": None, "hsk3_2021": None, "pos": "", "freq": None,
                   "radical": (mmah.get(hz[0]) or {}).get("radical", ""), "en": "; ".join(c["en"] for c in ce[:2]), "_pos_codes": []}
            base[hz] = rec
            added += 1
        rec["hsk3"] = r["level"]
        rec["pos_zh"] = "、".join(dict.fromkeys(r["pos_list"])).strip("、")
        rec["py"] = r["py"] or rec["py"]

    # pinyin chính: đề cương 2025 > bài học của web > form đầu tiên của danh sách mở (đôi khi là âm hiếm, vd 说 shuì)
    for hz, rec in base.items():
        if hz not in syl and hz in site and site[hz].get("py"):
            spy = site[hz]["py"].replace(" ", "")
            if spy != rec["py"]:
                rec["py_alt"] = [p for p in dict.fromkeys([rec["py"]] + rec.get("py_alt", [])) if p != spy]
                rec["py"] = spy

    # dấu cách âm (GB/T 16159): âm tiết bắt đầu bằng a/o/e đứng sau âm tiết khác phải có ' (téngài → téng'ài)
    for rec in base.values():
        rec["py"] = add_apostrophe(rec["py"], rec.get("py_num", ""))

    # âm Hán Việt từng chữ, học từ các từ đã biên soạn (lấy âm gặp nhiều nhất); Unihan chỉ dùng khi chữ chưa gặp
    from collections import Counter
    char_hv = defaultdict(Counter)
    for src_map in (site, authored):
        for hz, w in src_map.items():
            sy = (w.get("hv") or "").lower().replace("-", " ").split()
            cj = [c for c in hz if "\u3400" <= c <= "\u9fff"]
            if len(sy) == len(cj) == len(hz):
                for c, h in zip(cj, sy):
                    char_hv[c][h] += 1

    hv_file = os.path.join(ROOT, "data", "vi", "hanviet-chars.json")  # âm Hán Việt tự soạn cho chữ chưa gặp
    hv_extra = json.load(open(hv_file, encoding="utf-8")) if os.path.exists(hv_file) else {}

    def hv_of(c):
        if char_hv.get(c):
            return char_hv[c].most_common(1)[0][0]
        if c in hv_extra:
            return hv_extra[c]
        return unihan.get(c, {}).get("kVietnamese", "?").split(" ")[0]

    words, chars = [], set()
    for hz, rec in base.items():
        codes = rec.pop("_pos_codes")
        if a.no_cedict:
            rec.pop("en", None)
        # chữ đa âm có âm Hán Việt khác nhau theo cách đọc (划 huá = hoa, huà = hoạch): chọn theo py_num
        cj0 = [c for c in hz if "\u3400" <= c <= "\u9fff"]
        pn = (rec.get("py_num") or "").lower().split()
        hv_auto = " ".join(HV_BY_PY.get(c, {}).get(pn[k] if len(pn) == len(cj0) else "", None) or hv_of(c) for k, c in enumerate(cj0))
        rec["vi_cvdict"] = pick_cvdict(cvdict.get(hz), rec.get("py_num"))
        cj = [c for c in hz if "\u3400" <= c <= "\u9fff"]
        sk = [unihan.get(c, {}).get("kTotalStrokes", "").split(" ")[0] for c in cj]
        rec["strokes"] = sum(int(x) for x in sk if x.isdigit()) if cj and all(x.isdigit() for x in sk) else None
        rec["strokes_chars"] = "+".join(sk) if len(cj) > 1 else ""
        if not rec.get("radical") and cj:
            rec["radical"] = (mmah.get(cj[0]) or {}).get("radical", "")
        s, t = site.get(hz), authored.get(hz)
        if s:
            rec.update(vi=s["vi"], hv=s["hv"], pos_vi=s["pos"], ex_zh=s["ex"][0], ex_py=s["ex"][1], ex_vi=s["ex"][2], vi_src="nihao-site")
        elif t:
            ex = t.get("ex") or ["", "", ""]
            rec.update(vi=t["vi"], hv=t.get("hv", hv_auto), pos_vi=t.get("pos_vi", ""), ex_zh=ex[0], ex_py=ex[1], ex_vi=ex[2], vi_src="nihao-authored")
        else:
            guess = [POS_ZH_VI[k] for k in POS_ZH_VI if k in rec.get("pos_zh", "")] or [POS_VI.get(p, "") for p in codes]
            rec.update(vi=rec["vi_cvdict"], hv=hv_auto, pos_vi=", ".join(dict.fromkeys(g for g in guess if g)), ex_zh="", ex_py="", ex_vi="",
                       vi_src="cvdict" if rec["vi_cvdict"] else "")
            rec["hv_src"] = "tu-ghep"
        in_syl = hz in syl
        rec["src"] = ";".join(x for x in [
            "cap=" + ",".join(([ "de-cuong-2025"] if in_syl else []) + (["complete-hsk-vocabulary"] if rec["hsk2"] or rec["hsk3_2021"] else [])),
            "pinyin=" + ("de-cuong-2025" if in_syl else "complete-hsk-vocabulary"),
            "en=cc-cedict" if rec.get("en") else "",
            "vi=" + {"nihao-site": "nihao", "nihao-authored": "nihao", "cvdict": "cvdict"}.get(rec["vi_src"], "thieu"),
            "hv=" + ("tu-ghep-tung-chu" if rec.get("hv_src") else "nihao"),
            "bo-thu,so-net=unihan,makemeahanzi",
        ] if x)
        words.append(rec)
        chars.update(c for c in hz if "㐀" <= c <= "鿿")

    words.sort(key=lambda r: (r["hsk3"] or 99, r["hsk2"] or 99, r["freq"] or 10**9))

    # ---- xuất theo cấp ----
    fields = ["hz", "trad", "py", "hv", "vi", "en", "hsk3", "hsk2", "hsk3_2021", "radical", "strokes", "strokes_chars",
              "pos_zh", "pos_vi", "ex_zh", "ex_py", "ex_vi", "vi_cvdict", "vi_src", "src", "py_num", "pos", "freq"]
    if a.no_cedict:
        fields.remove("en")

    def dump(name, rows):
        os.makedirs(os.path.dirname(name), exist_ok=True)
        with open(name + ".json", "w", encoding="utf-8") as f:
            f.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n]\n")
        with open(name + ".csv", "w", encoding="utf-8-sig", newline="") as f:
            wr = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
            wr.writeheader()
            wr.writerows(rows)

    stats = []
    for key, folder, label in (("hsk3", "hsk3", "HSK 3.0 (2025)"), ("hsk2", "hsk2", "HSK 2.0"), ("hsk3_2021", "hsk3-2021", "HSK 3.0 (2021)")):
        top = 6 if key == "hsk2" else 7
        for lv in range(1, top + 1):
            rows = [r for r in words if r[key] == lv]
            nm = f"{folder}-{lv}" if lv < 7 else f"{folder}-7-9"
            if key != "hsk3_2021" or a.with_2021:  # bản 2021 chỉ để đối chiếu: mặc định chỉ thống kê, không xuất tệp riêng
                dump(os.path.join(OUT, folder, nm), rows)
            stats.append((f"{label} cấp {lv if lv < 7 else '7–9'}", len(rows), sum(1 for r in rows if r["vi_src"].startswith("nihao")), sum(1 for r in rows if r["vi_src"] == "cvdict")))
    dump(os.path.join(OUT, "all-words"), words)
    print(f"  thêm {added} từ chỉ có trong đề cương 2025")

    # ---- chữ Hán: Unihan (Unicode License) ----
    crow = []
    for c in sorted(chars, key=lambda c: (int(unihan.get(c, {}).get("kTotalStrokes", "99").split()[0]), c)):
        u = unihan.get(c, {})
        crow.append({
            "char": c,
            "strokes": int(u["kTotalStrokes"].split()[0]) if "kTotalStrokes" in u else None,
            "rs": u.get("kRSUnicode", ""),
            "mandarin": u.get("kMandarin", ""),
            "vietnamese": u.get("kVietnamese", ""),
            "definition_en": u.get("kDefinition", ""),
            "stroke_data": f"https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/{c}.json",
        })
    with open(os.path.join(OUT, "chars-unihan.json"), "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in crow) + "\n]\n")

    # ---- chữ Hán: Make Me a Hanzi dictionary.txt (LGPL-3.0+), tệp riêng vì khác giấy phép ----
    mrow = []
    for c in sorted(chars):
        m = mmah.get(c)
        if m:
            ety = m.get("etymology") or {}
            mrow.append({"char": c, "decomposition": m.get("decomposition", ""), "radical": m.get("radical", ""),
                         "etymology_type": ety.get("type", ""), "etymology_hint": ety.get("hint", ""),
                         "phonetic": ety.get("phonetic", ""), "semantic": ety.get("semantic", "")})
    with open(os.path.join(OUT, "chars-makemeahanzi.json"), "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in mrow) + "\n]\n")

    # ---- thứ tự nét: Make Me a Hanzi graphics.txt (Arphic Public License), tệp riêng ----
    gpath = os.path.join(a.raw, "mmah_graphics.txt")
    n_strokes = 0
    if os.path.exists(gpath):
        with open(gpath, encoding="utf-8") as fin, open(os.path.join(OUT, "chars-strokes-makemeahanzi.json"), "w", encoding="utf-8") as fout:
            rows = []
            for line in fin:
                g = json.loads(line)
                if g["character"] in chars:
                    rows.append(json.dumps({"char": g["character"], "strokes": g["strokes"], "medians": g["medians"]}, ensure_ascii=False, separators=(",", ":")))
            fout.write("[\n" + ",\n".join(rows) + "\n]\n")
            n_strokes = len(rows)

    meta = {
        "words": len(words), "chars": len(crow), "chars_mmah": len(mrow), "chars_strokes": n_strokes,
        "unihan": unihan_ver, "cc_cedict_date": cedict_date, "cedict_included": not a.no_cedict,
        "cvdict": "CVDICT (ph0ngp/CVDICT, CC BY-SA 4.0)",
        "coverage": [{"set": s, "words": n, "vi_nihao": v, "vi_cvdict": c, "vi_missing": n - v - c} for s, n, v, c in stats],
    }
    with open(os.path.join(OUT, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)

    print(f"{len(words)} từ, {len(crow)} chữ Hán. Unihan: {unihan_ver}. CC-CEDICT: {cedict_date}")
    for s, n, v, c in stats:
        print(f"  {s:22} {n:5} từ | Nǐ hǎo {v:5} | CVDICT {c:5} | thiếu {n - v - c:4}")

    # ---- danh sách cần bổ sung tiếng Việt ----
    def lv_name(r):
        return ("HSK3.0-" + ("7-9" if r["hsk3"] == 7 else str(r["hsk3"]))) if r["hsk3"] else ("HSK2.0-" + str(r["hsk2"])) if r["hsk2"] else ("HSK3.0(2021)-" + str(r["hsk3_2021"]))
    todo_fields = ["level", "hz", "py", "hv", "vi_cvdict", "en", "pos_zh"]
    for name, cond in (("thieu-nghia-viet", lambda r: not r["vi"]), ("can-bien-tap", lambda r: r["vi_src"] == "cvdict")):
        rows = [dict(r, level=lv_name(r)) for r in words if cond(r)]
        with open(os.path.join(OUT, name + ".csv"), "w", encoding="utf-8-sig", newline="") as f:
            wr = csv.DictWriter(f, fieldnames=todo_fields, extrasaction="ignore")
            wr.writeheader()
            wr.writerows(rows)
        print(f"  {name}.csv: {len(rows)} từ")

    if a.batches:
        os.makedirs(a.batches, exist_ok=True)
        miss = [r for r in words if not r["vi"]]
        with open(os.path.join(a.batches, "missing.jsonl"), "w", encoding="utf-8") as f:
            for r in miss:
                f.write(json.dumps({k: r.get(k) for k in ("hz", "py", "py_alt", "hsk3", "hsk2", "hsk3_2021", "pos_zh", "pos_vi", "hv", "en", "freq")}, ensure_ascii=False) + "\n")
        print(f"  {len(miss)} từ chưa có tiếng Việt -> {a.batches}/missing.jsonl")


if __name__ == "__main__":
    main()
