#!/usr/bin/env python3
"""Xuất dữ liệu trong data/ thành các tệp JS cho web (chạy được cả khi mở thẳng index.html, không cần server).

  js/data/h30-words.js     từ HSK 3.0 (đề cương 2025) cấp 1–6; từ đã có trong bài học của web chỉ ghi [chữ, cấp]
  js/data/h30-words-79.js  từ HSK 3.0 cấp 7–9 (nghĩa Nǐ hǎo hoặc CVDICT), tải khi mở tab 7–9
  js/data/h30-lessons.js   26 bài học bổ sung (data/lessons/hsk3-bo-sung.json)
  js/data/h30-exams.js     đề luyện cố định (data/exams/*.json), tải khi mở trang Thi thử

Chạy sau build_dataset.py:  python3 data/scripts/export_web.py
"""
import glob, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
J = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
HEAD = "// Tệp sinh tự động bởi data/scripts/export_web.py – đừng sửa tay, sửa dữ liệu trong data/ rồi chạy lại.\n"


def main():
    words = json.load(open(os.path.join(ROOT, "data", "hsk", "all-words.json"), encoding="utf-8"))
    rows = []
    for w in words:
        if w.get("hsk3") and w["hsk3"] <= 6 and w.get("vi_src") == "nihao-site":
            rows.append([w["hz"], w["hsk3"]])  # nội dung lấy từ VOCAB của web
        elif w.get("hsk3") and w["hsk3"] <= 6 and w.get("vi"):
            rows.append([w["hz"], w["py"], w.get("hv", ""), w["vi"], w.get("pos_vi", ""),
                         w.get("ex_zh", ""), w.get("ex_py", ""), w.get("ex_vi", ""), w["hsk3"]])
    with open(os.path.join(ROOT, "js", "data", "h30-words.js"), "w", encoding="utf-8") as f:
        f.write(HEAD + "// [chữ, pinyin, Hán Việt, nghĩa, từ loại, ví dụ, pinyin ví dụ, dịch ví dụ, cấp HSK 3.0], hoặc [chữ, cấp] nếu từ đã có trong VOCAB\n")
        f.write("window.HSK3_WORDS = [\n" + ",\n".join(J(r) for r in rows) + "\n];\n")

    rows79 = [[w["hz"], w["py"], w.get("hv", ""), w.get("vi", ""), w.get("pos_vi", ""), w.get("ex_zh", ""), w.get("ex_py", ""),
               w.get("ex_vi", ""), "c" if w.get("vi_src") == "cvdict" else "n" if w.get("vi") else ""]
              for w in words if w.get("hsk3") == 7]
    with open(os.path.join(ROOT, "js", "data", "h30-words-79.js"), "w", encoding="utf-8") as f:
        f.write(HEAD + "// HSK 3.0 cấp 7–9: [chữ, pinyin, Hán Việt, nghĩa, từ loại, ví dụ, pinyin ví dụ, dịch ví dụ, nguồn nghĩa: n = Nǐ hǎo, c = CVDICT (CC BY-SA 4.0)]\n")
        f.write("window.HSK3_WORDS_79 = [\n" + ",\n".join(J(r) for r in rows79) + "\n];\n")

    lessons = json.load(open(os.path.join(ROOT, "data", "lessons", "hsk3-bo-sung.json"), encoding="utf-8"))
    with open(os.path.join(ROOT, "js", "data", "h30-lessons.js"), "w", encoding="utf-8") as f:
        f.write(HEAD + "window.H3_LESSONS = [\n" + ",\n".join(J(l) for l in lessons) + "\n];\n")

    exams = []
    for p in sorted(glob.glob(os.path.join(ROOT, "data", "exams", "*.json"))):
        exams.append(json.load(open(p, encoding="utf-8")))
    with open(os.path.join(ROOT, "js", "data", "h30-exams.js"), "w", encoding="utf-8") as f:
        f.write(HEAD + "window.HSK3_EXAMS = [\n" + ",\n".join(J(e) for e in exams) + "\n];\n")

    print(f"{len(rows)} từ cấp 1–6, {len(rows79)} từ cấp 7–9, {len(lessons)} bài, {len(exams)} đề")


if __name__ == "__main__":
    main()
