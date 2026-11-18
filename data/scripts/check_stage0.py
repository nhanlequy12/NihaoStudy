#!/usr/bin/env python3
"""Kiểm tra nội dung lộ trình từng bước (js/data/stage0.js) và bảng âm tiết (js/data/syllables.js).

Đọc dữ liệu web bằng Node (giống build_dataset.py), đối chiếu với CC-CEDICT và Unihan trong data/raw.
Quy tắc:
  1. Từ trong words / sentences / câu hỏi «word» phải có trong VOCAB (từ đã rà soát).
  2. Câu nghe (tone, listen): chữ máy đọc phải là chữ chỉ có một cách đọc (không tính thanh nhẹ) theo CC-CEDICT
     và cách đọc đó đúng bằng đáp án; hoặc đúng là một từ đầu mục VOCAB có pinyin bằng đáp án.
  3. Phương án không trùng nhau, không trùng đáp án; phương án pinyin phải là âm tiết có thật + dấu thanh đặt đúng chỗ.
  4. Câu hỏi số nét khớp Unihan kTotalStrokes; ví dụ trong pinyin.js mà bài dùng tới phải có thật.
  5. Bảng âm tiết: mỗi ô, chữ phải có cách đọc đó trong CC-CEDICT; từ ví dụ phải chứa chữ và có âm tiết đó.

Chạy:  python3 data/scripts/check_stage0.py   (cần node)
"""
import gzip, json, os, re, subprocess, sys, unicodedata
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_syllables import mark, split_py, load_cedict  # noqa: E402

JS = r"""
const fs=require('fs'),vm=require('vm'),path=require('path');const root=process.argv[1];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="(js\/data\/[^"]+)"/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext('var window=this.window;',ctx);
for(const f of files) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const W=ctx.window;
process.stdout.write(JSON.stringify({STAGES:W.STAGES,VOCAB:W.VOCAB.map(w=>({hz:w.hz,py:w.py,vi:w.vi,ex:w.ex,l:w.l})),RADICALS:W.RADICALS,PINYIN:W.PINYIN,SYLLABLES:W.SYLLABLES}));
"""


def main():
    data = json.loads(subprocess.run(["node", "-e", JS, ROOT], capture_output=True, text=True, encoding="utf-8", check=True).stdout)
    readings, sylls = load_cedict()
    vocab = {}
    for w in data["VOCAB"]:
        vocab.setdefault(w["hz"], w)
    strokes = {c["char"]: c["strokes"] for c in json.load(open(os.path.join(ROOT, "data", "hsk", "chars-unihan.json"), encoding="utf-8"))}
    nfc = lambda s: unicodedata.normalize("NFC", s)
    errs, n = [], defaultdict(int)

    def valid_py(p):
        """Chuỗi pinyin (có thể nhiều âm tiết, cách nhau bởi dấu cách) gồm âm tiết có thật, dấu đặt đúng chỗ."""
        for chunk in re.split(r"[\s'’]+", nfc(p).lower()):
            splits = (split_py(chunk, k, sylls) for k in range(1, 5))
            # âm tiết bắt đầu bằng a/o/e ở giữa từ phải có dấu nháy (xī'ān), nên không được tách ra như vậy (gúo ≠ gú + o)
            if not any(sp and "".join(mark(s, t) for s, t in sp) == chunk and not any(s[0] in "aoe" for s, _ in sp[1:]) for sp in splits):
                return False
        return True

    def heard_ok(say, ans, where):
        n["câu nghe"] += 1
        w = vocab.get(say)
        if w and nfc(w["py"]) == nfc(ans):
            return
        if len(say) == 1:
            rs = {r for r in readings.get(say, ()) if r[1] != 5}
            want = split_py(ans, 1, sylls)
            if want and len(rs) == 1 and want[0] in rs:
                return
            errs.append(f"{where}: chữ đọc «{say}» có cách đọc {sorted(rs)} (CC-CEDICT), đáp án {ans}")
            return
        errs.append(f"{where}: «{say}» không phải từ đầu mục VOCAB có pinyin {ans}")

    for st in data["STAGES"]:
        all_words = set()
        for x in st["steps"]:
            where0 = x["id"]
            for hz in x["words"] + x["sentences"]:
                n["từ"] += 1
                if hz not in vocab:
                    errs.append(f"{where0}: từ «{hz}» không có trong VOCAB")
            all_words.update(x["words"])
            for b in x["blocks"]:
                if b["t"] == "pinyin":
                    have = {p["py"] for p in data["PINYIN"][b["key"]]}
                    for p in b["only"]:
                        if p not in have:
                            errs.append(f"{where0}: pinyin.js không có {b['key']} «{p}»")
                if b["t"] == "typing":
                    for hz in b["items"]:
                        if hz not in vocab:
                            errs.append(f"{where0}: từ gõ thử «{hz}» không có trong VOCAB")
                if b["t"] == "strokes":
                    for _, ch in b["items"]:
                        if ch not in strokes:
                            errs.append(f"{where0}: chữ luyện viết «{ch}» không có dữ liệu nét")
            for k, q in enumerate(x["quiz"]):
                where = f"{where0} câu {k + 1}"
                n["câu hỏi"] += 1
                if q["t"] == "tone":
                    heard_ok(q["say"], q["py"], where)
                    if not valid_py(q["py"]):
                        errs.append(f"{where}: pinyin {q['py']} sai dạng")
                elif q["t"] == "listen":
                    heard_ok(q["say"], q["a"], where)
                    opts = [q["a"]] + q["o"]
                    if len(set(map(nfc, opts))) != len(opts):
                        errs.append(f"{where}: phương án trùng nhau {opts}")
                    for o in opts:
                        if not valid_py(o):
                            errs.append(f"{where}: phương án «{o}» không phải pinyin hợp lệ")
                elif q["t"] == "mcq":
                    opts = [q["a"]] + q["o"]
                    if len(set(opts)) != len(opts) or len(opts) < 4:
                        errs.append(f"{where}: phương án trùng hoặc thiếu {opts}")
                    m = re.match(r"Chữ (.) có mấy nét", q["q"])
                    if m:
                        n["câu số nét"] += 1
                        if str(strokes.get(m.group(1))) != q["a"]:
                            errs.append(f"{where}: {m.group(1)} có {strokes.get(m.group(1))} nét theo Unihan, đáp án ghi {q['a']}")
                elif q["t"] == "word":
                    if q["hz"] not in vocab:
                        errs.append(f"{where}: từ «{q['hz']}» không có trong VOCAB")
        # câu «word» cần đủ 3 nghĩa nhiễu khác nhau trong giai đoạn
        if len({vocab[h]["vi"] for h in all_words if h in vocab}) < 4:
            errs.append(f"{st['id']}: không đủ từ để làm phương án nhiễu")

    # bảng âm tiết
    for syl, ini, forms, cells in data["SYLLABLES"]:
        for t, c in enumerate(cells, 1):
            if not c:
                continue
            n["ô bảng âm tiết"] += 1
            ch, word, wpy = c[0], c[1], c[2]
            if (syl, t) not in readings.get(ch, ()):
                errs.append(f"bảng âm tiết {forms[t - 1]}: CC-CEDICT không ghi {ch} đọc {syl}{t}")
            if forms[t - 1] != mark(syl, t):
                errs.append(f"bảng âm tiết {syl}{t}: dấu đặt sai {forms[t - 1]}")
            if word:
                parts = split_py(wpy, len(word), sylls)
                if ch not in word or not parts or (syl, t) not in [p for h, p in zip(word, parts) if h == ch]:
                    errs.append(f"bảng âm tiết {forms[t - 1]}: từ ví dụ {word} {wpy} không có {ch} đọc {forms[t - 1]}")

    print("Đã kiểm:", ", ".join(f"{v} {k}" for k, v in n.items()))
    if errs:
        print(f"{len(errs)} lỗi:")
        print("\n".join("  - " + e for e in errs))
        sys.exit(1)
    print("Không có lỗi.")


if __name__ == "__main__":
    main()
