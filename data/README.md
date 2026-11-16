# Dữ liệu từ vựng HSK

Bộ từ vựng HSK tổng hợp từ các nguồn mở và nội dung tiếng Việt tự biên soạn. Các nguồn đều tải trực tiếp từ nơi phát hành, không crawl website. Gồm hai phần:
- **HSK 3.0** theo đề cương thi chính thức 2025 (cấp 1–6 và 7–9), dùng cho kỳ thi bắt đầu từ 13/12/2026.
- **HSK 2.0** cấp 1–6.

Mỗi từ có:

> chữ giản thể · phồn thể · pinyin · Hán Việt · nghĩa tiếng Việt · nghĩa tiếng Anh · cấp HSK · bộ thủ · số nét · nguồn

Ngoài ra có thêm từ loại và câu ví dụ.

## Tệp đầu ra (`data/hsk/`)

| Tệp | Nội dung |
|---|---|
| `hsk3/hsk3-1.json` … `hsk3-6.json`, `hsk3-7-9.json` (+ `.csv`) | Từ mới của từng cấp HSK 3.0 theo đề cương 2025: 300 / 197 / 491 / 990 / 1.579 / 1.777 / 5.562 từ |
| `hsk2/hsk2-1.json` … `hsk2-6.json` (+ `.csv`) | Từ mới của từng cấp HSK 2.0: 150 / 147 / 298 / 598 / 1.298 / 2.500 |
| `all-words.json` / `.csv` | Toàn bộ 12.309 từ, đủ các cột cấp `hsk3`, `hsk2`, `hsk3_2021` |
| **`thieu-nghia-viet.csv`** | Từ **chưa có nghĩa tiếng Việt** nào (22 từ), để bạn bổ sung |
| **`can-bien-tap.csv`** | Từ chỉ có nghĩa máy dịch từ CVDICT, chưa biên tập và chưa có câu ví dụ (4.439 từ, phần lớn ở cấp 7–9) |
| `chars-unihan.json` | 3.132 chữ Hán: số nét, bộ thủ + số nét, âm Mandarin, âm đọc tiếng Việt, nghĩa tiếng Anh ngắn |
| `chars-makemeahanzi.json` | Phân tách chữ, bộ, loại cấu tạo (hình thanh, hội ý…), gợi ý nguồn gốc (LGPL) |
| `chars-strokes-makemeahanzi.json` | **Thứ tự nét** của 3.132 chữ: nét dạng SVG theo đúng thứ tự viết, kèm đường giữa nét (`medians`) cho biết hướng viết (Arphic Public License) |
| `meta.json` | Phiên bản nguồn; số từ theo cấp, chia theo nguồn nghĩa tiếng Việt (Nǐ hǎo / CVDICT / thiếu) |

Thêm `--with-2021` khi build để xuất thêm thư mục `hsk3-2021/` (chuẩn GF0025-2021).

Tệp CSV lưu dạng UTF-8 có BOM nên mở thẳng bằng Excel không lỗi font.

**Về cấp 7–9:** HSK 3.0 cấp 7, 8, 9 thi chung một bài, và đề cương cũng gộp chung thành một nhóm "七—九级". Vì vậy không có danh sách riêng cho từng cấp 7, 8, 9.

### Các cột

| Cột | Ý nghĩa | Nguồn |
|---|---|---|
| `hz`, `trad` | chữ giản thể, phồn thể | danh sách HSK mở, CC-CEDICT |
| `py`, `py_num`, `py_alt` | pinyin có dấu, pinyin số, cách đọc khác | đề cương 2025 (nếu có), danh sách HSK mở |
| `hv` | âm Hán Việt | Nǐ hǎo. Với từ chưa biên soạn thì ghép từng chữ (`hv_src = tu-ghep`), xem bên dưới |
| `vi` | nghĩa tiếng Việt | Nǐ hǎo; nếu chưa có thì lấy từ CVDICT |
| `vi_src` | `nihao-site` / `nihao-authored` = Nǐ hǎo biên soạn; `cvdict` = lấy từ CVDICT; rỗng = thiếu | |
| `vi_cvdict` | nghĩa CVDICT (luôn có nếu CVDICT có từ đó), để đối chiếu | CVDICT |
| `en` | nghĩa tiếng Anh | CC-CEDICT |
| `hsk3` | cấp HSK 3.0 theo đề cương 2025 (`7` = cấp 7–9) | đề cương 2025 |
| `hsk2`, `hsk3_2021` | cấp HSK 2.0 và cấp theo chuẩn 2021 | danh sách HSK mở |
| `radical` | bộ thủ của từ (chữ đầu) | danh sách HSK mở, Make Me a Hanzi |
| `strokes`, `strokes_chars` | tổng số nét, số nét từng chữ (ví dụ `8+8`) | Unihan |
| `pos_zh`, `pos_vi`, `pos` | từ loại theo đề cương, tiếng Việt, mã gốc | đề cương 2025, Nǐ hǎo, danh sách HSK mở |
| `ex_zh`, `ex_py`, `ex_vi` | câu ví dụ | Nǐ hǎo |
| `freq` | thứ hạng tần suất | danh sách HSK mở |
| `src` | nguồn của từng trường, ví dụ `cap=de-cuong-2025;en=cc-cedict;vi=cvdict;hv=tu-ghep-tung-chu` | |

**Âm Hán Việt tự ghép** (`hv_src = tu-ghep`) lấy âm của từng chữ theo thứ tự ưu tiên:
1. Âm gặp nhiều nhất của chữ đó trong hơn 7.000 từ Nǐ hǎo đã biên soạn.
2. `data/vi/hanviet-chars.json`: âm tự soạn cho 353 chữ còn lại.
3. Unihan `kVietnamese`, chỉ dùng khi hai cách trên không có.

Chữ nhiều âm (ví dụ 行 hành/hàng) có thể bị ghép sai, cần rà lại.

## Nguồn và giấy phép

| Nguồn | Dùng cho | Giấy phép | Nghĩa vụ |
|---|---|---|---|
| [《HSK考试大纲》 bản 2025](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf) (CLEC) | `hsk3`, `pos_zh`, pinyin | **Bản quyền CLEC, không có giấy phép mở** | Chỉ trích dữ kiện danh sách từ (từ, cấp, pinyin, từ loại). Không đưa PDF vào repo, không lấy phần mô tả hay đề mẫu. Muốn chắc chắn về quyền tái phân phối thì hỏi CLEC |
| [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) | HSK 2.0, HSK 3.0 (2021), phồn thể, tần suất, bộ thủ | MIT | Giữ thông báo bản quyền và giấy phép MIT |
| [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cc-cedict) (MDBG) | `en`, phồn thể và pinyin của từ ngoài danh sách mở | **CC BY-SA 4.0** | Ghi công; phát hành lại theo cùng giấy phép (xem bên dưới) |
| [CVDICT](https://github.com/ph0ngp/CVDICT) (Phong Phan) | `vi_cvdict`, và `vi` khi Nǐ hǎo chưa biên soạn | **CC BY-SA 4.0** | Như trên. CVDICT dịch từ CC-CEDICT, phần lớn bằng mô hình ChatGPT-4o tinh chỉnh, có sửa tay một phần, nên cần biên tập lại |
| [Unihan](https://www.unicode.org/charts/unihan.html) (Unicode 18.0) | số nét, bộ thủ, `chars-unihan.json` | [Unicode License v3](https://www.unicode.org/license.txt) | Giữ thông báo bản quyền Unicode |
| [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) `dictionary.txt` | `chars-makemeahanzi.json`, bộ thủ | **LGPL-3.0+** | Để thành tệp riêng; bản sửa đổi phải giữ LGPL |
| Make Me a Hanzi `graphics.txt` | `chars-strokes-makemeahanzi.json` (thứ tự nét) | **Arphic Public License** | Để thành tệp riêng, kèm văn bản giấy phép ở `data/licenses/ARPHIC-PUBLIC-LICENSE.txt` |
| Nội dung Nǐ hǎo (nghĩa, Hán Việt, câu ví dụ, bài học, đề thi) | `vi` có `vi_src = nihao-*`, `hv`, `ex_*`; thư mục `data/vi/`, `data/exams/`, `data/lessons/` | Chủ dự án tự chọn | Gợi ý: CC BY 4.0 |

### Điều kiện "ghi công, chia sẻ tương tự" (CC BY-SA 4.0)

Áp dụng cho CC-CEDICT và CVDICT:
- **Ghi công (BY):** ghi tên nguồn, dẫn link tới giấy phép, nói rõ có chỉnh sửa hay không.
- **Chia sẻ tương tự (SA):** tệp nào chứa dữ liệu lấy từ hai nguồn này (cột `en`, `vi_cvdict`, hoặc `vi` có `vi_src = cvdict`), kể cả khi đã sửa hay ghép chung với dữ liệu khác, thì khi phát hành lại cũng phải theo **CC BY-SA 4.0**.
- Được dùng cho mục đích thương mại. Không được thêm điều khoản hạn chế người khác dùng lại.

Hệ quả: các tệp trong `data/hsk/` (trừ `chars-*.json`) theo **CC BY-SA 4.0**. Trên web cũng vậy, tệp `js/data/h30-words-79.js` có nghĩa từ CVDICT nên theo CC BY-SA 4.0.

Nếu muốn giữ phần tiếng Việt tự soạn theo giấy phép khác thì build lại bằng `--no-cedict`. Lệnh này bỏ cột `en`. Hiện tại nó **chưa** bỏ phần CVDICT; muốn bỏ thì phải lọc thêm các dòng có `vi_src = cvdict`.

**Ghi công mẫu**, đã đặt ở trang "Nguồn dữ liệu" của web (`#/about`):

> Dữ liệu từ vựng dựa trên complete-hsk-vocabulary (MIT), CC-CEDICT (CC BY-SA 4.0, MDBG), CVDICT (CC BY-SA 4.0, Phong Phan), Unihan (Unicode License), Make Me a Hanzi (LGPL / Arphic Public License) và Hanzi Writer (MIT). Danh sách từ HSK 3.0 theo đề cương thi HSK 2025 của CLEC. Nghĩa tiếng Việt, câu ví dụ, bài học và đề luyện do Nǐ hǎo tự biên soạn.

## Cách build lại

Chạy từ thư mục gốc dự án:

```bash
bash data/scripts/fetch_sources.sh
```

```bash
python3 data/scripts/build_dataset.py
```

```bash
python3 data/scripts/export_web.py
```

- Lệnh 1 tải các nguồn vào `data/raw/` (không đưa lên git). Cần gói `poppler-utils` để trích bảng từ trong PDF đề cương.
- Lệnh 2 ghép dữ liệu và tạo `data/hsk/`.
- Lệnh 3 tạo các tệp `js/data/h30-*.js` cho web. Web đọc các tệp này, nên vẫn chạy khi mở thẳng `index.html`.

### Bổ sung nghĩa tiếng Việt

1. Mở `data/hsk/thieu-nghia-viet.csv`, hoặc `can-bien-tap.csv` nếu muốn sửa nghĩa máy dịch.
2. Thêm dòng vào một tệp `data/vi/*.jsonl`, ví dụ `data/vi/bo-sung.jsonl`:
   ```
   {"hz":"…","vi":"…","hv":"…","pos_vi":"…","ex":["câu chữ Hán","pinyin","dịch"]}
   ```
3. Build lại bằng lệnh 2 và lệnh 3. Từ bạn soạn sẽ được ưu tiên hơn CVDICT.

Âm Hán Việt cho chữ lẻ thì sửa trong `data/vi/hanviet-chars.json`.
