#!/usr/bin/env python3
"""Trích bảng từ vựng (序号 / 等级 / 词语 / 拼音 / 词性) từ PDF 《HSK考试大纲》 bản 2025 của CLEC.

PDF: https://hsk.cn-bj.ufileos.com/3.0/新版HSK考试大纲1219.pdf (fetch_sources.sh tải về data/raw/hsk-syllabus-2025.pdf)
Cần pdftotext (gói poppler-utils).

Chạy:  python3 data/scripts/extract_syllabus_2025.py data/raw/hsk-syllabus-2025.pdf data/raw/hsk-syllabus-2025.json
Đầu ra: danh sách {no, hz, sense, level, levels_other, py, pos} – một dòng cho mỗi mục của bảng (11.000 mục).
"""
import json, re, subprocess, sys

LEVEL = r"(?:1|2|3|4|5|6|7[—–-]9)"
ROW = re.compile(rf"^(\d{{1,5}}) ({LEVEL})((?:（{LEVEL}）)*) (\S+?)(\d?) (.*)$")
PY = re.compile(r"^([A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜêÊĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙńňǹḿ’'·/ -]+?)(?:\s+(\S.*))?$")


def lv(s):
    return 7 if s.startswith("7") else int(s)


def main(pdf, out):
    text = subprocess.run(["pdftotext", "-raw", pdf, "-"], capture_output=True, text=True, check=True).stdout
    rows = {}
    for line in text.splitlines():
        m = ROW.match(line.strip())
        if not m:
            continue
        no = int(m[1])
        if no > 11000 or no in rows:
            continue
        rest = m[6].strip()
        p = PY.match(rest)
        py, pos = (p[1].strip(), (p[2] or "").strip()) if p else ("", rest)
        rows[no] = {
            "no": no, "hz": m[4], "sense": int(m[5]) if m[5] else None, "level": lv(m[2]),
            "levels_other": [lv(x) for x in re.findall(LEVEL, m[3])], "py": py, "pos": pos,
        }
    missing = [i for i in range(1, 11001) if i not in rows]
    with open(out, "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join(json.dumps(rows[k], ensure_ascii=False) for k in sorted(rows)) + "\n]\n")
    print(f"{len(rows)} mục; thiếu số thứ tự: {missing[:20]}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
