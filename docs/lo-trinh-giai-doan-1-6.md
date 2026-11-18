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
  - Giai đoạn 4, 6: 10 bài/chặng. Giai đoạn 5: 8 bài/chặng.
  - Nhóm lẻ cuối có ít hơn nửa chặng thì nhập vào chặng trước.
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

**Luyện tập theo cấp.** Đã đếm số câu bằng hàm `itemsOf` của từng chức năng, chuẩn HSK 2.0, ngày 18/11:

| Chức năng | HSK 1 | HSK 2 | HSK 3 | HSK 4 | HSK 5 | HSK 6 |
|---|---|---|---|---|---|---|
| Sắp xếp câu | 80 | 62 | 76 | 72 | 78 | 37 |
| Chọn vị trí từ | 14 | 33 | 49 | 98 | 188 | 73 |
| Chép chính tả | 77 | 77 | 152 | 308 | 708 | 1.211 |
| Sửa câu sai | 20 | 18 | 19 | 19 | 16 | 0* |
| Điền từ | 51 | 45 | 104 | 115 | 118 | 0* |
| Hỏi đáp | 20 | 19 | 20 | 20 | 18 | 0* |
| Mưa từ vựng, Luyện dịch | có | có | có | có | có | có |

\* Kho HSK 6 đang được bổ sung. Giai đoạn 6 vẫn dẫn tới đủ 8 chức năng và để chức năng tự xử lý khi chưa có câu.

Giai đoạn 1–2 dẫn tới 5 chức năng: Mưa từ vựng, Điền từ, Sắp xếp câu, Chép chính tả, Hỏi đáp. Từ Giai đoạn 3 thêm Chọn vị trí từ, Sửa câu sai, Luyện dịch.

## Số liệu từng giai đoạn

| Giai đoạn | Bài | Phần | Từ | Ngữ pháp | Bài đọc | Chặng / bài ôn | Câu kiểm tra nhanh (sắp xếp) | Từ dùng câu nghe | Thời lượng | Kiểm tra tổng hợp |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 · HSK 1 | 13 (1–12 + BS 1) | 26 | 159 | 52 | 3 | – | 198 (39) | 128 | 631 phút ≈ 11 giờ | đề HSK 1: 40 câu, 40 phút |
| 2 · HSK 2 | 12 (13–24) | 24 | 150 | 48 | 3 | – | 186 (36) | 120 | 596 phút ≈ 10 giờ | đề HSK 2: 60 câu, 55 phút |
| 3 · HSK 3 | 21 (25–44 + BS 2) | 42 | 304 | 64 | 4 | – | 367 (63) | 254 | 1.037 phút ≈ 17 giờ | đề HSK 3: 80 câu, 90 phút (có Viết) |
| 4 · HSK 4 | 41 (45–84 + BS 3) | 82 | 615 | 124 | 7 | 4 | 738 (123) | 551 | 2.036 phút ≈ 34 giờ | đề HSK 4: 100 câu, 105 phút |
| 5 · HSK 5 | 71 (85–149 + BS 4–9) | 213 | 1.420 | 250 | 8 | 9 | 1.633 (213) | 1.283 | 4.611 phút ≈ 77 giờ | đề HSK 5: 100 câu, 125 phút |
| 6 · HSK 6 | 121 (150–270) | 363 | 2.421 | 402 | 12 | 12 | 2.784 (363) | 2.310 | 7.822 phút ≈ 130 giờ | đề HSK 6: 101 câu, 135 phút (có 缩写) |
| **Tổng** | **279** | **750** | **5.069** | **940** | **37** | **25** | **5.906** | **4.646** | **≈ 279 giờ** | |

Thời lượng là thời gian học phần mới, chưa tính ôn thẻ hằng ngày, bài đọc và thi thử.

**Chặng:**
- Giai đoạn 4: 45–54 · 55–64 · 65–74 · 75–84 + Bổ sung 3.
- Giai đoạn 5: 85–92 · 93–100 · … · 141–148 · 149 + Bổ sung 4–9.
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

## Kiểm tra độ chính xác

`python data/scripts/check_path.py`:

```
Nguồn cách đọc chữ đơn: py + py_alt trong data/hsk/all-words.json (lấy từ CC-CEDICT)
  Giai đoạn 1: 13 bài → 26 phần, 159 từ, 3 bài đọc, 0 chặng, 631 phút (phần 17–28 phút), 128 từ dùng cho câu nghe
  Giai đoạn 2: 12 bài → 24 phần, 150 từ, 3 bài đọc, 0 chặng, 596 phút (phần 22–29 phút), 120 từ dùng cho câu nghe
  Giai đoạn 3: 21 bài → 42 phần, 304 từ, 4 bài đọc, 0 chặng, 1037 phút (phần 17–27 phút), 254 từ dùng cho câu nghe
  Giai đoạn 4: 41 bài → 82 phần, 615 từ, 7 bài đọc, 4 chặng, 2036 phút (phần 23–29 phút), 551 từ dùng cho câu nghe
  Giai đoạn 5: 71 bài → 213 phần, 1420 từ, 8 bài đọc, 9 chặng, 4611 phút (phần 18–26 phút), 1283 từ dùng cho câu nghe
  Giai đoạn 6: 121 bài → 363 phần, 2421 từ, 12 bài đọc, 12 chặng, 7822 phút (phần 18–26 phút), 2310 từ dùng cho câu nghe
Đã kiểm: 750 phần, 5069 lượt từ, 16733 phút, 4646 câu nghe (từ an toàn), 5906 câu quiz, 5069 câu drill, 37 bài đọc, 25 bài ôn chặng
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

- **Giai đoạn 0:** chưa chạy lại `check_stage0.py` trên máy này vì thiếu `data/raw/cedict.txt.gz` (chưa chạy `fetch_sources.sh`). Dữ liệu `stage0.js` không đổi.
- **Đề HSK 5:** phần Viết của bộ sinh đề có 8 câu sắp xếp và 2 câu đặt câu với từ cho sẵn, chưa có dạng viết đoạn 80 chữ như đề thật. Đề HSK 3 đã có phần Viết; đề HSK 6 đã có 缩写.
- **Kho luyện tập HSK 6:** Sửa câu sai, Điền từ, Hỏi đáp đang được bổ sung.
- **Chặng Giai đoạn 5:** chia theo số bài (8 bài, trùng nhịp bài đọc), chưa theo chủ đề.
- **Thời lượng:** công thức ước lượng, chưa đo trên người học thật.
- **Người đã học bài HSK cũ:** khi bắt đầu lộ trình, vẫn phải làm bài ôn chặng (Giai đoạn 4–6) trước khi mở chặng sau và kiểm tra tổng hợp.
- **Nghe thử trên thiết bị thật:** chưa nghe thử các từ dùng cho câu nghe, giống việc còn treo của Giai đoạn 0.
