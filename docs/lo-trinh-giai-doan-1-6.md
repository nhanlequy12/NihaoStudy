# Lộ trình từng bước · Giai đoạn 1–6 – HSK 1 đến HSK 6 (18/11/2026)

## Cách làm

Giai đoạn 1–6 được **sinh tự động** từ bài học HSK 2.0 sẵn có (`LESSONS`, `VOCAB`, `READINGS`) trong `js/path-hsk.js`. Không chép hay soạn nội dung tiếng Trung mới. Mỗi phần chỉ giữ tham chiếu: mã bài, mã từ, chỉ số ngữ pháp và chỉ số câu mẫu.

- **Giai đoạn N** gồm các bài HSK 2.0 cấp N: bài chính và bài «Bổ sung 2012» của cấp đó (bài 301–309). Không gồm bài HSK 3.0.
- **Chia phần:**
  - Bài dưới 18 từ chia 2 phần (A/B). Bài từ 18 từ trở lên (mọi bài HSK 5–6) chia 3 phần (A/B/C).
  - Từ vựng và ngữ pháp chia đều theo thứ tự trong bài; phần đầu nhận nhiều hơn khi lẻ. Phần A có thêm mẹo (`tips`).
  - Phần cuối có hội thoại, toàn bộ câu mẫu và bài đọc (nếu có `READINGS.after` bằng bài đó).
  - Nếu phần cuối quá 30 phút, chuyển bớt một điểm ngữ pháp sang phần trước (xảy ra với Bổ sung 2012 · Bài 3).
- **Thời lượng** ước lượng theo công thức `PATH_MIN`, kết quả 17–29 phút/phần:
  - 1,2 phút mỗi từ, 3 phút mỗi điểm ngữ pháp, 0,5 phút mỗi câu hội thoại, 0,3 phút mỗi câu mẫu.
  - 0,4 phút mỗi câu kiểm tra, 1 phút đọc mẹo, cộng 5 phút luyện tập.
- **Chặng:** Giai đoạn 4–6 gom bài thành chặng; mỗi chặng kết thúc bằng một bài ôn 20 câu (15 phút).
  - Giai đoạn 4, 6: 10 bài/chặng, nhóm lẻ cuối có ít hơn nửa chặng thì nhập vào chặng trước. Bài ôn mã `sN-r<n>`.
  - Giai đoạn 5: chia theo **chủ đề** (bảng `TOPICS` trong `js/path-hsk.js`, 10 chặng, 6–10 bài/chặng), tên chặng kèm chủ đề
    («Chặng 7 · Tính cách và cảm xúc»). Trong mỗi chặng giữ thứ tự bài của giai đoạn (bài chính rồi Bổ sung 2012). Bài chưa có
    trong bảng tự vào chặng cuối nên không bao giờ sót bài. Bài ôn mã `s5-c<n>` (khác `s5-r<n>` của cách chia 8 bài trước đây):
    tiến độ bài ôn cũ không được tính cho chặng mới vì nội dung khác; các phần `s5-<bài><a|b|c>` đã học vẫn được giữ, người đang
    học tiếp tục từ phần chưa xong đầu tiên theo thứ tự mới.
  - Phải đạt bài ôn mới mở chặng sau.

## Mỗi phần nhỏ (`#/step/sN-<bài><a|b|c>`)

| Tab | Nội dung |
|---|---|
| Học | Mục tiêu của bài · bảng từ vựng của phần (Hán Việt, ví dụ, nghe, luyện viết) · điểm ngữ pháp của phần · mẹo cho người Việt (phần A) · hội thoại (nghe cả đoạn, ẩn/hiện dịch), câu mẫu, bài đọc (phần cuối) · liên kết bài gốc |
| Luyện tập | Luyện nhanh không tính điểm: cùng từ của phần nhưng đổi dạng câu so với Kiểm tra nhanh. Thêm liên kết tới công cụ luyện tập, tự chọn sẵn cấp HSK của giai đoạn, và bài luyện cuối bài gốc |
| Kiểm tra nhanh | Mỗi từ của phần đúng một câu, xoay vòng: nghĩa → chọn chữ Hán → nghe chọn pinyin. Phần cuối thêm tối đa 3 câu sắp xếp lấy từ câu mẫu của bài. Đạt từ 70% thì mở phần sau |

- **Phương án nhiễu:** lấy từ cùng bài, rồi từ cùng giai đoạn. Không trùng chữ, nghĩa hay pinyin với đáp án.
- **Câu nghe** chỉ dùng hai loại từ:
  - Từ nhiều chữ chỉ có một cách đọc trong VOCAB. Máy đọc cả từ, đáp án là pinyin của từ đó.
  - Chữ đơn chỉ có một cách đọc theo CC-CEDICT, lấy từ bảng âm tiết (ô không kèm từ ví dụ). Trong 731 từ một chữ có 308 chữ dùng được cho câu nghe. Chữ nhiều âm như 好, 的, 没, 还 chỉ dùng câu nghĩa hoặc chọn chữ.

**Luyện tập theo cấp.** Đếm số câu bằng hàm `itemsOf` của từng chức năng, chuẩn HSK 2.0 (cập nhật 19/11, sau khi bổ sung kho cấp 6):

| Chức năng | HSK 1 | HSK 2 | HSK 3 | HSK 4 | HSK 5 | HSK 6 |
|---|---|---|---|---|---|---|
| Sắp xếp câu | 80 | 62 | 76 | 72 | 78 | 85 |
| Chọn vị trí từ | 14 | 33 | 49 | 98 | 188 | 166 |
| Chép chính tả | 77 | 77 | 152 | 307 | 709 | 1.210 |
| Sửa câu sai | 20 | 18 | 19 | 19 | 16 | 19 |
| Điền từ | 51 | 45 | 104 | 115 | 118 | 119 |
| Hỏi đáp | 20 | 19 | 20 | 20 | 18 | 22 |
| Mưa từ vựng, Luyện dịch | có | có | có | có | có | có |

Cả 8 chức năng đều có câu ở mọi cấp.

Giai đoạn 1–2 dẫn tới 5 chức năng: Mưa từ vựng, Điền từ, Sắp xếp câu, Chép chính tả, Hỏi đáp. Từ Giai đoạn 3 thêm Chọn vị trí từ, Sửa câu sai, Luyện dịch.

## Số liệu từng giai đoạn

| Giai đoạn | Bài | Phần | Từ | Ngữ pháp | Bài đọc | Chặng / bài ôn | Câu kiểm tra nhanh (sắp xếp) | Từ dùng câu nghe | Thời lượng | Kiểm tra tổng hợp |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 · HSK 1 | 13 (1–12 + BS 1) | 26 | 159 | 52 | 3 | – | 198 (39) | 128 | 631 phút ≈ 11 giờ | đề HSK 1: 40 câu, 40 phút |
| 2 · HSK 2 | 12 (13–24) | 24 | 150 | 48 | 3 | – | 186 (36) | 120 | 596 phút ≈ 10 giờ | đề HSK 2: 60 câu, 55 phút |
| 3 · HSK 3 | 21 (25–44 + BS 2) | 42 | 304 | 64 | 4 | – | 367 (63) | 254 | 1.037 phút ≈ 17 giờ | đề HSK 3: 80 câu, 90 phút (có Viết) |
| 4 · HSK 4 | 41 (45–84 + BS 3) | 82 | 615 | 124 | 7 | 4 | 738 (123) | 551 | 2.036 phút ≈ 34 giờ | đề HSK 4: 100 câu, 105 phút |
| 5 · HSK 5 | 71 (85–149 + BS 4–9) | 213 | 1.420 | 250 | 8 | 10 | 1.633 (213) | 1.283 | 4.611 phút ≈ 77 giờ | đề HSK 5: 100 câu, 125 phút |
| 6 · HSK 6 | 121 (150–270) | 363 | 2.421 | 402 | 12 | 12 | 2.784 (363) | 2.310 | 7.822 phút ≈ 130 giờ | đề HSK 6: 101 câu, 135 phút (có 缩写) |
| **Tổng** | **279** | **750** | **5.069** | **940** | **37** | **26** | **5.906** | **4.646** | **≈ 279 giờ** | |

Thời lượng là thời gian học phần mới, chưa tính ôn thẻ hằng ngày, bài đọc và thi thử.

**Chặng:**
- Giai đoạn 4: 45–54 · 55–64 · 65–74 · 75–84 + Bổ sung 3.
- Giai đoạn 5 (theo chủ đề):
  1. Gia đình, con người và sức khỏe: 85–88 + Bổ sung 5, 7 (6 bài).
  2. Ăn uống, trang phục và nhà cửa: 89–94 + Bổ sung 9 (7 bài).
  3. Thành phố, đi lại và thiên nhiên: 95–99 + Bổ sung 8 (6 bài).
  4. Khoa học, kỹ thuật và trường học: 100–104 + Bổ sung 4 (6 bài).
  5. Ngôn ngữ, truyền thông và văn hoá: 105–110 (6 bài).
  6. Xã hội, nhà nước và kinh tế: 111–118 + Bổ sung 6 (9 bài).
  7. Tính cách và cảm xúc: 119–124 (6 bài).
  8. Hành động, tư duy và phát triển: 125–134 (10 bài).
  9. Miêu tả sự vật và từ trừu tượng: 135–142 (8 bài).
  10. Ngữ pháp: hư từ và bổ ngữ: 143–149 (7 bài).
- Giai đoạn 6: 150–159 · 160–169 · … · 250–259 · 260–270.

**Bài đọc** mở ở phần cuối của bài tương ứng:
- HSK 1: r05, r10, r12.
- HSK 2: r15, r20, r24.
- HSK 3: r30, r35, r40, r44.
- HSK 4: r50, r55, r60, r65, r70, r75, r84.
- HSK 5: r92, r100, r108, r116, r124, r132, r140, r149.
- HSK 6: r159, r169, …, r259, r270.

## Khóa / mở và đồng bộ

- **Mở phần:** phần sau mở khi phần trước (hoặc bài ôn chặng trước) đạt từ 70%. Trượt thì phần sau vẫn khóa và không thêm từ vào bộ thẻ.
- **Mở giai đoạn:** giai đoạn N mở khi có một trong ba điều kiện:
  - Đạt kiểm tra tổng hợp Giai đoạn N−1.
  - Được xếp lên qua kiểm tra đầu vào.
  - Đã học dở giai đoạn đó, kể cả bằng bài HSK cũ.
- **SRS:** qua phần nào thì từ của phần đó vào bộ thẻ ôn tập (SRS) và bộ thẻ viết (WSRS), dùng `saveResult` sẵn có. Trang giai đoạn nhắc số thẻ đến hạn.
- **Đồng bộ hai chiều với `completedLessons`:**
  - Bài HSK cũ đã hoàn thành được tính là xong mọi phần của bài đó.
  - Qua hết các phần của một bài thì bài cũ được đánh dấu hoàn thành. Bài đọc (`#/read`) và tiến độ cấp ở trang Bài học dùng chung dấu này.
- **Kiểm tra tổng hợp (`#/step/sN-test`):**
  - Mở khi xong mọi phần và bài ôn. Trang này dẫn tới đề thi thử `#/exam/N` sinh bằng `js/exam.js`.
  - Đạt khi tổng điểm từ 70% (HSK 1–2: 140/200, HSK 3–6: 210/300). Mốc đậu của đề thật là 60%.
  - Kết quả lưu vào `exams` như trang thi thử. Lần thi đạt 70% nào của cấp N trong lịch sử cũng được tính, kể cả lần thi trước khi có lộ trình.
  - Trang kết quả thi thử có thêm một dòng «Lộ trình · Giai đoạn N» cho người đang học lộ trình.
- **Kiểm tra đầu vào (`#/start/test`):**
  - Mở đầu bằng 8 câu pinyin. Sau đó mỗi cấp HSK 1→6 có 6 câu nghĩa từ, lấy ngẫu nhiên từ VOCAB của cấp.
  - Đúng từ 70% (5/6 câu) mới sang cấp tiếp; trượt cấp nào thì dừng ở đó.
  - Người đạt phần pinyin và qua đến HSK k được xếp vào Giai đoạn k+1, tối đa Giai đoạn 6. Các giai đoạn trước vẫn mở để xem lại.
- **Trang «Bắt đầu học» và thẻ trang chủ:**
  - Giai đoạn 1–6 là trang giai đoạn thật, có khóa/mở và thanh tiến độ, không còn dẫn tới `#/lessons/N`.
  - Thẻ trang chủ hiện giai đoạn đang học. Kiểm tra tổng hợp Giai đoạn 0 dẫn sang `#/path/1`.
- **Trang giai đoạn:**
  - Mỗi dòng là một bài HSK; các phần A/B/C là nút nhỏ trong dòng, có thời lượng, dấu xong và khóa.
  - Giai đoạn 4–6 gập theo chặng (`<details>`), chỉ mở chặng đang học. Trên điện thoại, danh sách chỉ dài một chặng.

## Tệp

- `js/path-hsk.js` (mới): sinh `STAGES` 1–6. Không dùng DOM, chạy được trong Node.
- `js/path.js`:
  - Chỉ mục tra nhanh; `isDone` đồng bộ `completedLessons` và lịch sử thi.
  - Khóa giai đoạn; câu hỏi `mean`/`char`/`hear`/`order` (dạng sắp xếp mới trong `runQuiz`).
  - Trang giai đoạn có chặng; trang phần nhỏ; bài ôn chặng; kiểm tra tổng hợp bằng đề HSK.
  - Kiểm tra đầu vào nhiều cấp; trang Bắt đầu học; thẻ trang chủ; `examNote`.
- `js/views-exam.js`: thêm một dòng `Path.examNote` trên trang kết quả.
- `index.html`: nạp `js/path-hsk.js` sau `js/path.js`.
- `css/path.css`: nút phần (`.part-chip`), chặng gập (`details.chang`).
- `data/scripts/check_path.py` (mới): kiểm tra dữ liệu Giai đoạn 1–6.

## Bù HSK 3.0 (20/11/2026)

Đề thi HSK 3.0 (đề cương 2025) áp dụng từ 13/12/2026. Lộ trình vẫn theo HSK 2.0; **cuối mỗi Giai đoạn N** nối thêm các bài
«Bổ sung HSK 3.0» (`H3_LESSONS`, `level` = N) dưới tên **Bù HSK 3.0**: từ và ngữ pháp HSK 3.0 cấp N chưa có trong HSK 2.0 cấp N.

- **Sinh trong `js/path-h30.js`** (nạp ngay sau `js/path-hsk.js`, sau `h30-words.js`/`h30-lessons.js`; không dùng DOM, chạy được
  trong Node). Chỉ tham chiếu mã bài `h3b-xx`, mã từ và chỉ số ngữ pháp / câu mẫu; không soạn nội dung tiếng Trung mới.
- **Từ:** `H3_LESSONS.words` là chữ Hán, tra như `js/h30.js`: có trong `VOCAB` thì dùng chung mã (mục đầu tiên cùng chữ, vd. 说 →
  `h3_说` của Bổ sung 2012), chỉ có trong `HSK3_WORDS` thì mã `h3_<chữ>`. `path.js` thêm `H3.extraList()` vào chỉ mục từ để
  `wordById`, bảng từ vựng, câu hỏi và SRS/WSRS dùng được các từ này.
- **Chia phần** như bài HSK 2.0 (học · luyện nhanh · kiểm tra nhanh, đạt 70 %, từ vào bộ thẻ) nhưng chia theo **thời lượng** thay vì
  theo số từ: phần cuối mang hội thoại + 8 câu mẫu nên nhận ít từ hơn; lấy k nhỏ nhất (2–4) mà mọi phần ≤ 30 phút. Kết quả: 3 phần/bài,
  bài 35 từ (h3b-12, h3b-13) thành 4 phần (A–D), 24–30 phút/phần.
- **Mã mới, tiến độ cũ không đổi:** phần `sN-h3b-xx<a|b|c|d>` (vd. `s1-h3b-01a`); Giai đoạn 4–6 thêm chặng cuối «Bù HSK 3.0»
  (`opt: true`) với bài ôn `sN-h3r`. Giai đoạn 1–3 không chia chặng: các phần bù là một khối riêng sau bài HSK 2.0, trước kiểm tra.
- **Không bắt buộc (`opt: true`):** kiểm tra tổng hợp vẫn mở khi xong các phần HSK 2.0; giai đoạn tính «xong» và tiến độ `d/total`
  chỉ đếm phần HSK 2.0 + kiểm tra. Lý do: người đang học hoặc đã qua giai đoạn không bị khóa lại. Phần bù đầu tiên mở khi xong phần
  HSK 2.0 cuối *hoặc* đã đạt kiểm tra tổng hợp; các phần bù sau nối tiếp nhau. `next()` gợi ý: phần HSK 2.0 → phần bù (nếu chưa đạt
  kiểm tra) → kiểm tra tổng hợp; đã đạt kiểm tra thì sang giai đoạn sau.
- **Đồng bộ với trang Bài bổ sung:** xong mọi phần của một bài bù thì `h3b-xx` vào `completedLessons` (và ngược lại, bài đã hoàn thành
  ở `#/lesson/h3b-xx` tính là xong mọi phần). Tab Luyện tập liên kết công cụ với chuẩn HSK 3.0 cấp N chọn sẵn.
- **Câu nghe:** cùng quy tắc với HSK 2.0, tập cách đọc lấy từ `VOCAB` ∪ `HSK3_WORDS`; chữ đơn phải là ô một cách đọc trong bảng
  âm tiết (vd. 照, 刚, 停 dùng được; 转, 数, 空, 们 không).
- **Số liệu:** Giai đoạn 1: 3 bài → 9 phần, 91 từ · Giai đoạn 2: 3 → 9, 83 từ · Giai đoạn 3: 6 → 19, 186 từ · Giai đoạn 4: 14 → 43 phần
  + 1 bài ôn, 394 từ · Giai đoạn 5–6: chưa có bài bổ sung nên không có gì thêm. Tổng 754 lượt từ, 638 từ dùng cho câu nghe.
- **Kiểm tra:** `python data/scripts/check_path_h30.py` (cần node; đặt `PYTHONIOENCODING=utf-8` trên Windows): đúng bài theo cấp,
  mọi từ có thật và mỗi chữ của bài đúng một phần, không phần rỗng, thời lượng 15–30, câu nghe chỉ từ một cách đọc (chữ đơn đối chiếu
  CC-CEDICT như `check_path.py`), mã bước không trùng toàn `STAGES`, chặng bù đúng vị trí. `check_path.py` không đổi (chỉ nạp
  `path-hsk.js`) và vẫn 0 lỗi.

## Kiểm tra độ chính xác

`python data/scripts/check_path.py`:

```
Nguồn cách đọc chữ đơn: py + py_alt trong data/hsk/all-words.json (lấy từ CC-CEDICT)
  Giai đoạn 1: 13 bài → 26 phần, 159 từ, 3 bài đọc, 0 chặng, 631 phút (phần 17–28 phút), 128 từ dùng cho câu nghe
  Giai đoạn 2: 12 bài → 24 phần, 150 từ, 3 bài đọc, 0 chặng, 596 phút (phần 22–29 phút), 120 từ dùng cho câu nghe
  Giai đoạn 3: 21 bài → 42 phần, 304 từ, 4 bài đọc, 0 chặng, 1037 phút (phần 17–27 phút), 254 từ dùng cho câu nghe
  Giai đoạn 4: 41 bài → 82 phần, 615 từ, 7 bài đọc, 4 chặng, 2036 phút (phần 23–29 phút), 551 từ dùng cho câu nghe
  Giai đoạn 5: 71 bài → 213 phần, 1420 từ, 8 bài đọc, 10 chặng, 4611 phút (phần 18–26 phút), 1283 từ dùng cho câu nghe
  Giai đoạn 6: 121 bài → 363 phần, 2421 từ, 12 bài đọc, 12 chặng, 7822 phút (phần 18–26 phút), 2310 từ dùng cho câu nghe
Đã kiểm: 750 phần, 5069 lượt từ, 16733 phút, 4646 câu nghe (từ an toàn), 5906 câu quiz, 5069 câu drill, 37 bài đọc, 26 bài ôn chặng
Không có lỗi.
```

**Các điều kiện được kiểm:**
- Đúng bài của từng cấp.
- Từ, ngữ pháp, câu mẫu và bài đọc có thật, gắn đúng bài.
- Không phần rỗng; không từ nào bị sót hay lặp (trong bài và giữa các bài).
- Mỗi điểm ngữ pháp xuất hiện đúng một lần; hội thoại và câu mẫu ở phần cuối.
- Thời lượng 15–30 phút và khớp công thức.
- Mỗi từ có đúng một câu kiểm tra và một câu luyện; câu sắp xếp có từ 3 mảnh.
- Chặng phủ đủ các phần, bài ôn đúng từ của chặng, mã không trùng.
- Câu nghe an toàn, theo cùng quy tắc nguồn của Giai đoạn 0:
  - Từ nhiều chữ: một cách đọc trong VOCAB, pinyin tách đúng số âm tiết, dấu đặt đúng (tính cả 儿 hóa và dấu nháy).
  - Chữ đơn: một cách đọc không tính thanh nhẹ theo CC-CEDICT, khớp đáp án.
  - Nếu đã tải `data/raw/cedict.txt.gz`, script dùng CC-CEDICT gốc. Nếu chưa, script dùng `py` + `py_alt` của `all-words.json`, cũng lấy từ CC-CEDICT.

**Thử gài lỗi:** cho mọi từ đều được dùng làm câu nghe thì script báo 303 lỗi, ví dụ 好 (hǎo/hào), 的, 没, 吗. Bỏ phần gài lỗi thì về 0 lỗi.

## Chạy thử (trình duyệt, `python -m http.server 8787`)

- **Sinh câu hỏi:** sinh toàn bộ 10.975 câu (Kiểm tra nhanh và Luyện nhanh của 750 phần) bằng `Path.expand`, mất 0,4 giây.
  - Mọi câu chọn có đủ 4 phương án khác nhau và chứa đáp án.
  - Mọi câu sắp xếp có đúng các mảnh của câu gốc.
- **Tự làm bằng script có đọc đáp án:**
  - Trượt Bài 1 · Phần A (0%): Phần B vẫn khóa, trang Phần B báo «chưa mở».
  - Làm đúng (100%): 7 từ vào SRS và WSRS, Phần B mở. Qua Phần B thì Bài 1 vào `completedLessons`, Bài 2 · Phần A mở.
  - Thêm bài 2 vào `completedLessons` thì cả hai phần của Bài 2 tính là xong.
  - Giai đoạn 4, chặng 1: lưu đạt 20 phần thì bài 45–54 vào `completedLessons` và bài ôn chặng mở.
  - Bài ôn chặng: trượt (0%) thì chặng 2 vẫn khóa; đạt (100%) thì Bài 55 · Phần A mở.
- **Kiểm tra tổng hợp Giai đoạn 1:**
  - Khóa khi chưa xong các phần, mở khi xong.
  - Lịch sử thi 130/200 (65%) chưa đạt; 146/200 (73%) thì đạt và Giai đoạn 2 mở.
  - Làm thật một đề HSK 1 qua `#/exam/1`: trang kết quả có dòng «Lộ trình · Giai đoạn 1».
- **Kiểm tra đầu vào:** làm đúng phần pinyin, HSK 1, HSK 2, sai HSK 3 thì được xếp vào Giai đoạn 3 (`placed = 3`) và chuyển sang `#/path/3`.
- **Liên kết luyện tập:** bấm «Sắp xếp câu» trong phần HSK 3 thì trang luyện tập mở với HSK 3 chọn sẵn.
- **Trang cũ:** mở 43 trang, không trang nào báo lỗi và không có lỗi console:
  - Trang chủ, bắt đầu học, các giai đoạn 0–6, bài nhỏ và kiểm tra Giai đoạn 0.
  - `#/lessons/1`, `#/lessons/6`, `#/lesson/1` (4 tab), `#/lesson/305`.
  - `#/exam`, `#/exam/3`.
  - Luyện tập: hub, order, fill, qa, rain.
  - Đọc hiểu, ôn tập, từ vựng, bảng âm tiết, lộ trình, hội thoại, cài đặt, sổ tay, từ điển.
- **Khổ màn hình:** 430px (trang giai đoạn 3 và 5, phần học, câu sắp xếp) và 1280px (trang giai đoạn 6). Không cuộn ngang.

## Còn lại / cần xem thêm

- ~~Giai đoạn 0: chưa chạy lại `check_stage0.py`~~: đã chạy ngày 19/11 trên máy có `data/raw/cedict.txt.gz`; `check_stage0.py` và `check_path.py` (dùng CC-CEDICT gốc) đều 0 lỗi.
- ~~Đề HSK 5 chưa có viết đoạn 80 chữ~~: đã thêm ngày 19/11 (dạng `w_paragraph` trong `js/exam.js`). Câu 100 của đề thật cho tranh; web thay bằng chủ đề kèm từ gợi ý vì chưa có tranh.
- ~~Kho luyện tập HSK 6~~: đã bổ sung (xem bảng Luyện tập theo cấp).
- ~~Chặng Giai đoạn 5 chia theo số bài, chưa theo chủ đề~~: đã chia theo chủ đề ngày 20/11 (10 chặng, bài ôn mã `s5-c<n>`).
- **Thời lượng:** công thức ước lượng, chưa đo trên người học thật.
- **Người đã học bài HSK cũ:** khi bắt đầu lộ trình, vẫn phải làm bài ôn chặng (Giai đoạn 4–6) trước khi mở chặng sau và kiểm tra tổng hợp.
- **Nghe thử trên thiết bị thật:** chưa nghe thử các từ dùng cho câu nghe, giống việc còn treo của Giai đoạn 0.
