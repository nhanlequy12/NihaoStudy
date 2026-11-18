#!/usr/bin/env python3
"""Dựng bảng âm tiết pinyin × 4 thanh cho web (Giai đoạn 0 · Bài 7 và tab «Bảng âm tiết» của Pinyin Lab).

Nguồn:
  - Danh sách âm tiết: mọi âm tiết có trong cách đọc của các mục một chữ trong CC-CEDICT
    (data/raw/cedict.txt.gz), bỏ các thán từ không theo cấu trúc phụ âm đầu + vần (hm, hng, m, r, xx).
  - Chữ ví dụ: chỉ lấy chữ có trong từ vựng HSK (data/hsk/all-words.json), gióng từng chữ với
    từng âm tiết của pinyin đầu mục. Ưu tiên chữ cấp thấp, chữ chỉ có một cách đọc theo CC-CEDICT.
    Chữ có nhiều cách đọc được kèm một từ HSK chứa chữ đó đọc đúng âm này, để máy đọc đúng.
  - Ô không có chữ HSK nào đọc âm đó thì để trống (không lấy chữ hiếm).

Chạy:  python3 data/scripts/build_syllables.py
Ra:    js/data/syllables.js (CC BY-SA 4.0 vì dựa trên CC-CEDICT)
"""
import gzip, json, os, re, unicodedata
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
INITIALS = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s", "y", "w", ""]
VALID = re.compile(r"(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[aeiouü]+(n|ng|r)?")
MARKS = {"a": "āáǎà", "e": "ēéěè", "i": "īíǐì", "o": "ōóǒò", "u": "ūúǔù", "ü": "ǖǘǚǜ"}


def mark(syl, tone):
    """Đặt dấu thanh theo quy tắc chuẩn: a/e trước, ou → o, còn lại nguyên âm cuối."""
    if tone == 5:
        return syl
    for v in ("a", "e"):
        if v in syl:
            return syl.replace(v, MARKS[v][tone - 1], 1)
    if "ou" in syl:
        return syl.replace("o", MARKS["o"][tone - 1], 1)
    idx = max(syl.rfind(v) for v in "iouü")
    return syl[:idx] + MARKS[syl[idx]][tone - 1] + syl[idx + 1:]


def split_initial(syl):
    for ini in ("zh", "ch", "sh"):
        if syl.startswith(ini):
            return ini, syl[2:]
    if syl[0] in "bpmfdtnlgkhjqxrzcsyw":
        return syl[0], syl[1:]
    return "", syl


TONE_OF = {c: (i % 4) + 1 for v in MARKS.values() for i, c in enumerate(v)}
PLAIN = {c: v for v, ms in MARKS.items() for c in ms}


def split_py(py, n, sylls):
    """Tách pinyin có dấu của một từ thành đúng n âm tiết [(âm, thanh)]; không tách được thì trả về None."""
    s = unicodedata.normalize("NFC", py.lower())
    s = re.sub(r"[\s'’\-·]", "", s)
    plain, tones = "", []
    for c in s:
        plain += PLAIN.get(c, c)
        tones.append(TONE_OF.get(c, 0))
    if not re.fullmatch(r"[a-zü]+", plain):
        return None

    def go(i, k):
        if i == len(plain):
            return [] if k == 0 else None
        if k == 0:
            return None
        for j in range(min(len(plain), i + 6), i, -1):  # thử âm tiết dài trước
            if plain[i:j] in sylls:
                t = max(tones[i:j]) or 5
                rest = go(j, k - 1)
                if rest is not None:
                    return [(plain[i:j], t)] + rest
        return None

    return go(0, n)


def load_cedict():
    readings = defaultdict(set)  # chữ -> {(âm, thanh)}
    sylls = set()
    with gzip.open(os.path.join(ROOT, "data", "raw", "cedict.txt.gz"), "rt", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue
            m = re.match(r"(\S+) (\S+) \[([^\]]+)\]", line)
            if not m or len(m.group(2)) != 1:
                continue
            hz = m.group(2)
            for r in m.group(3).lower().replace("u:", "ü").split():
                mm = re.fullmatch(r"([a-zü]+)([1-5])", r)
                if not mm or not VALID.fullmatch(mm.group(1)):
                    continue
                readings[hz].add((mm.group(1), int(mm.group(2))))
                sylls.add(mm.group(1))
    return readings, sylls


def main():
    readings, sylls = load_cedict()
    words = json.load(open(os.path.join(ROOT, "data", "hsk", "all-words.json"), encoding="utf-8"))
    # (âm, thanh) -> chữ -> từ HSK tốt nhất chứa chữ đó đọc âm này
    cand = defaultdict(dict)
    for w in words:
        hz = w["hz"]
        # tách pinyin hiển thị (không dùng py_num: cột này đôi khi ghi thanh gốc, vd 妻子 zi3 nhưng đọc qīzi; 吗 ma2)
        pn = split_py(w["py"], len(hz), sylls)
        if not pn:
            continue
        lv = min(x for x in (w.get("hsk2"), w.get("hsk3"), 9) if x)
        for ch, key in zip(hz, pn):
            if key not in readings.get(ch, ()):  # bỏ cách gióng không khớp từ điển (thanh nhẹ chỉ nhận khi từ điển có ghi)
                continue
            rank = (lv, len(hz) != 1, w.get("freq") or 99999)
            best = cand[key].get(ch)
            if not best or rank < best[0]:
                cand[key][ch] = (rank, hz, w["py"], w.get("vi", ""))

    rows, rare, filled = [], [], 0
    for syl in sorted(sylls, key=lambda s: (INITIALS.index(split_initial(s)[0]), split_initial(s)[1])):
        ini, fin = split_initial(syl)
        cells = []
        for t in (1, 2, 3, 4, 5):
            opts = cand.get((syl, t), {})
            if not opts:
                cells.append(None)
                continue
            # cấp thấp trước, rồi chữ đứng một mình là từ, rồi chữ chỉ một cách đọc, rồi tần suất
            ch = min(opts, key=lambda c: (opts[c][0][0], opts[c][0][1], len({r for r in readings[c] if r[1] != 5}) > 1, opts[c][0][2]))
            rank, word, wpy, wvi = opts[ch]
            mono = len({r for r in readings[ch] if r[1] != 5}) == 1
            cells.append([ch, "" if (mono and word == ch) else word, "" if (mono and word == ch) else wpy, wvi if word == ch else ""])
            filled += 1
        if not cells[4]:
            cells.pop()
        if any(cells):
            rows.append([syl, ini, [mark(syl, t) for t in range(1, len(cells) + 1)], cells])
        else:
            rare.append(syl)

    out = os.path.join(ROOT, "js", "data", "syllables.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Tệp sinh tự động bởi data/scripts/build_syllables.py – đừng sửa tay.\n")
        f.write("// Bảng âm tiết pinyin × 4 thanh. Âm tiết và cách đọc: CC-CEDICT (CC BY-SA 4.0); chữ ví dụ: từ vựng HSK.\n")
        f.write("// Mỗi dòng: [âm tiết, phụ âm đầu, [4 dạng có dấu], [4 ô: null | [chữ, từ ví dụ nếu chữ nhiều âm, pinyin từ, nghĩa]]]\n")
        f.write("window.SYLLABLES = [\n" + ",\n".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in rows) + "\n];\n")
        f.write("// Âm tiết có trong CC-CEDICT nhưng không chữ nào trong từ vựng HSK đọc như vậy\n")
        f.write("window.SYLLABLES_RARE = " + json.dumps(rare, ensure_ascii=False) + ";\n")
    print(f"{len(rows)} âm tiết có chữ HSK, {filled}/{len(rows) * 4} ô có chữ; {len(rare)} âm tiết hiếm -> {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    main()
