# Kế hoạch lộ trình từng bước (cập nhật 18/11/2026)

Mục tiêu: người mới học từ con số 0 đến HSK 6 theo các bài nhỏ 15–30 phút. Mỗi bài có mục tiêu, từ vựng, ngữ pháp/mẫu câu, luyện tập bằng chức năng sẵn có và kiểm tra nhanh. Đạt từ 70% thì mở bài sau. Cuối mỗi giai đoạn có kiểm tra tổng hợp dạng đề HSK. Làm từng giai đoạn; xong giai đoạn nào thì báo cáo số bài, số từ và nội dung đã đưa vào.

Trạng thái: ✅ xong · ⏳ đang làm · ⬜ chưa làm

## Tổng quan

| Giai đoạn | Chuẩn | Nguồn nội dung | Bài HSK sẵn có | Từ | Ngữ pháp | Bài đọc | Bài nhỏ dự kiến | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| 0 · Nhập môn | trước HSK 1 | `js/data/stage0.js`, bảng âm tiết | – | 60 | – | – | 10 + kiểm tra | ✅ |
| 1 · HSK 1 | HSK 2.0 | bài 1–12 + Bổ sung 2012 bài 1 | 13 | 159 | 52 | 3 | 26 | ✅ |
| 2 · HSK 2 | HSK 2.0 | bài 13–24 | 12 | 150 | 48 | 3 | 24 | ✅ |
| 3 · HSK 3 | HSK 2.0 | bài 25–44 + 1 bài bổ sung | 21 | 304 | 64 | 4 | 42 | ✅ |
| 4 · HSK 4 | HSK 2.0 | bài 45–84 + 1 bài bổ sung | 41 | 615 | 124 | 7 | 82 + 4 bài ôn chặng | ✅ |
| 5 · HSK 5 | HSK 2.0 | bài 85–149 + 6 bài bổ sung | 71 | 1.420 | 250 | 8 | 213 + 9 bài ôn chặng | ✅ |
| 6 · HSK 6 | HSK 2.0 | bài 150–270 | 121 | 2.421 | 402 | 12 | 363 + 12 bài ôn chặng | ✅ |

Số phần đã sinh: bài dưới 18 từ chia 2 phần, bài từ 18 từ trở lên (mọi bài HSK 5–6) chia 3 phần. Chi tiết và kết quả kiểm tra ở [lo-trinh-giai-doan-1-6.md](lo-trinh-giai-doan-1-6.md).

## Cách làm chung cho Giai đoạn 1–6 ✅

Đã làm theo đúng các bước dưới đây (18/11/2026), sinh tự động trong `js/path-hsk.js`; đã commit và push (`5ec1fd3`).

Áp dụng cho mọi giai đoạn, để không phải soạn lại nội dung tiếng Trung đã rà soát.

1. **Chia bài nhỏ tự động từ bài HSK sẵn có.** Không chép dữ liệu, chỉ tham chiếu `LESSONS`/`VOCAB`. Ví dụ:
   - Phần A: nửa đầu từ vựng và ngữ pháp 1–2.
   - Phần B: nửa sau từ vựng, ngữ pháp 3–4 và hội thoại.
   - Bài nhiều từ có thêm Phần C: câu mẫu và bài đọc mở khóa sau bài.
   - Mỗi phần 15–30 phút, ước lượng theo số từ, số ngữ pháp và độ dài hội thoại.
2. **Phần Học:** mục tiêu lấy từ `goals` của bài, kèm từ vựng, ngữ pháp và mẹo (`tips`). Hội thoại và câu mẫu đặt ở phần cuối.
3. **Luyện tập:** luyện nhanh trong bài, cộng với đường dẫn tới chức năng hợp cấp. Kiểm tra trước chức năng nào có dữ liệu cho cấp đó:
   - Mưa từ vựng, Điền từ, Sắp xếp câu, Chép chính tả, Hỏi đáp.
   - Từ HSK 3 trở lên thêm Chọn vị trí từ, Sửa câu sai, Luyện dịch.
4. **Kiểm tra nhanh:** dùng lại các dạng câu của bài học hiện có (nghĩa, chọn chữ, nghe, sắp xếp câu) và giới hạn trong từ của phần đó. Đạt từ 70% mới mở phần sau.
5. **Ôn tập ngắt quãng:** qua phần nào thì từ của phần đó vào SRS và bộ thẻ viết. Trang giai đoạn nhắc số thẻ đến hạn.
6. **Đồng bộ với tiến độ cũ:** người đã hoàn thành bài HSK cũ (`completedLessons`) được tính là xong các phần nhỏ của bài đó. Ngược lại, qua hết các phần nhỏ thì bài cũ cũng được đánh dấu hoàn thành.
7. **Kiểm tra tổng hợp cuối giai đoạn:** dùng bộ sinh đề HSK 2.0 sẵn có (`js/exam.js`) theo đúng cấu trúc đề từng cấp. Đạt từ 70% thì xong giai đoạn và mở giai đoạn sau. Giữ lịch sử thi trong `exams`.
8. **Kiểm tra độ chính xác:** mở rộng `check_stage0.py` thành `check_path.py` cho mọi giai đoạn, kiểm:
   - Mỗi phần tham chiếu đúng bài, từ, câu có thật.
   - Không phần nào rỗng, không từ nào bị sót hay lặp giữa các phần.
   - Thời lượng mỗi phần nằm trong 15–30 phút.
   - Câu nghe dùng chữ một âm hoặc đúng từ đầu mục.
9. **Kiểm tra đầu vào:** thêm câu của cấp mới để xếp người học lên đúng giai đoạn.
10. **Chạy thử và báo cáo:**
    - Tự làm hết các phần bằng script; thử trượt dưới 70% và kiểm tra bài sau vẫn khóa.
    - Xem trên khổ điện thoại và máy tính; các trang cũ phải vẫn chạy.
    - Ghi báo cáo `docs/lo-trinh-giai-doan-N.md`, rồi commit và push.

## Giai đoạn 0 · Nhập môn ✅

Đã xong: 10 bài, 60 từ, 118 câu kiểm tra, kiểm tra tổng hợp, kiểm tra đầu vào, bảng âm tiết. Chi tiết ở [lo-trinh-giai-doan-0.md](lo-trinh-giai-doan-0.md).

Còn treo:
- ✅ **Video trong file zip** (20/11): chép lời bằng faster-whisper (mô hình small) và ffmpeg. Video nói tiếng Việt về cách nhớ mặt chữ không phụ thuộc pinyin, theo thứ tự chữ → âm → nghĩa, gồm 4 bước: nhìn chữ trước, tách chữ thành các phần (明 = 日 + 月, 休 = 亻 + 木), học chữ trong từ, ôn giãn cách. Đã tóm tắt vào Bài 9 (Bộ thủ). Ví dụ chỉ dùng chữ và từ có trong VOCAB (明天, 休息, 日, 月); không chép câu tiếng Trung mới.
- ⬜ **Nghe thử trên thiết bị thật** (Chrome, Edge, điện thoại): kiểm tra máy đọc đúng chữ trong câu hỏi nghe và ô bảng âm tiết. Chữ nhiều cách đọc đã được thay bằng từ ví dụ nhưng chưa nghe bằng tai. Máy phát triển (Windows) không có giọng tiếng Trung nào, nên chỉ thử được trên máy người học.
- ⬜ Theo dõi tỉ lệ đúng từng câu nếu sau này có thống kê. Câu nào sai quá nhiều thì xem lại cách hỏi.

## Giai đoạn 1 · HSK 1 (HSK 2.0) ✅

- ✅ Dựng khung dữ liệu giai đoạn sinh từ bài 1–12 và Bổ sung 2012 bài 1: 13 bài → 26 phần, 159 từ.
- ✅ Mở rộng `js/path.js`: phần Học hiển thị từ vựng, ngữ pháp, mẹo, hội thoại và câu mẫu của bài gốc; kiểm tra nhanh có câu nghĩa, chọn chữ, nghe chọn pinyin và sắp xếp câu.
- ✅ Đồng bộ với `completedLessons` theo hai chiều.
- ✅ Gắn 3 bài đọc HSK 1 (r05, r10, r12) vào phần cuối của bài tương ứng.
- ✅ Luyện tập: Mưa từ vựng, Điền từ, Sắp xếp câu, Chép chính tả, Hỏi đáp, tự chọn sẵn cấp 1. Đã kiểm, chức năng nào cũng có dữ liệu cấp 1.
- ✅ Kiểm tra tổng hợp: đề HSK 1 sinh ngẫu nhiên (Nghe + Đọc, 40 câu), đạt từ 70% tổng điểm.
- ✅ Kiểm tra đầu vào: thêm câu từng cấp HSK 1–6, xếp lên đúng giai đoạn.
- ✅ Trang «Bắt đầu học»: Giai đoạn 1–6 là trang giai đoạn có khóa và mở.
- ✅ `check_path.py` (0 lỗi), chạy thử, báo cáo [lo-trinh-giai-doan-1-6.md](lo-trinh-giai-doan-1-6.md).
- ✅ Commit và push (`5ec1fd3`).

## Giai đoạn 2 · HSK 2 (HSK 2.0) ✅

- ✅ Khung từ bài 13–24: 12 bài → 24 phần, 150 từ. Ngữ pháp trọng tâm (过, 正在, 比, 得, lượng từ, 因为…所以) lấy nguyên từ bài gốc.
- ✅ 3 bài đọc HSK 2 (r15, r20, r24); luyện tập như Giai đoạn 1 cho cấp 2.
- ✅ Kiểm tra tổng hợp: đề HSK 2 (60 câu).
- ✅ Kiểm tra đầu vào: thêm câu HSK 2.
- ✅ Kiểm tra, chạy thử, commit và push.

## Giai đoạn 3 · HSK 3 (HSK 2.0) ✅

- ✅ Khung từ bài 25–44 và Bổ sung 2012 bài 2: 21 bài → 42 phần, 304 từ.
- ✅ Thêm luyện tập Chọn vị trí từ, Sửa câu sai, Luyện dịch (đều có dữ liệu cấp 3).
- ✅ Đề HSK 3 có phần Viết: bộ sinh đề đã có sắp xếp câu (5) và viết chữ theo pinyin (5).
- ✅ 4 bài đọc; kiểm tra đầu vào thêm câu HSK 3.
- ✅ Kiểm tra, chạy thử, commit và push.

## Giai đoạn 4 · HSK 4 (HSK 2.0) ✅

- ✅ Khung từ bài 45–84 và Bổ sung 2012 bài 3: 41 bài → 82 phần, 615 từ. Chia 4 chặng (45–54, 55–64, 65–74, 75–84 + BS 3), mỗi chặng có một bài ôn ngắn 20 câu.
- ✅ 7 bài đọc; luyện tập đủ 8 chức năng.
- ✅ Kiểm tra tổng hợp: đề HSK 4. Bài ôn cuối mỗi chặng là kiểm tra giữa giai đoạn; đạt 70% mới mở chặng sau.
- ✅ Kiểm tra, chạy thử, commit và push.

## Giai đoạn 5 · HSK 5 (HSK 2.0) ✅

- ✅ Khung từ bài 85–149 và 6 bài bổ sung: 71 bài → 213 phần (3 phần mỗi bài), 1.420 từ.
- ✅ Chia 10 chặng theo chủ đề (20/11), ví dụ «Gia đình, con người và sức khỏe», «Ngữ pháp: hư từ và bổ ngữ»; mỗi chặng 6–10 bài và có bài ôn (`s5-c<n>`). Bài đã đạt vẫn mở được dù thứ tự mới đặt nó sau một bài chưa học.
- ✅ 8 bài đọc; đề HSK 5. ✅ Phần Viết có dạng viết đoạn 80 chữ (19/11): câu 99 dùng đủ 5 từ cùng một bài; câu 100 thay tranh bằng chủ đề của một bài kèm 3 từ gợi ý (dùng ít nhất 2). Máy chấm sơ bộ: 60–120 chữ Hán và đủ từ bắt buộc.
- ✅ Hiệu năng: trang giai đoạn gập theo chặng, mỗi dòng là một bài có các nút phần A/B/C, danh sách trên điện thoại ngắn.
- ✅ Kiểm tra, chạy thử, commit và push.

## Giai đoạn 6 · HSK 6 (HSK 2.0) ✅

- ✅ Khung từ bài 150–270: 121 bài → 363 phần, 2.421 từ. Chia 12 chặng, mỗi chặng có bài ôn.
- ✅ 12 bài đọc; đề HSK 6 (101 câu, 135 phút, có 缩写).
- ✅ Kho luyện tập cấp 6 đã bổ sung (`5cf2322`, `dc5b479`): Sắp xếp câu 85, Chọn vị trí từ 166, Sửa câu sai 19, Điền từ 119, Hỏi đáp 22 câu. Cả 8 chức năng đều có câu cấp 6.
- ✅ Kiểm tra, chạy thử, commit và push.

## Việc chung (20/11/2026)

- ✅ **Lộ trình HSK 3.0:** chọn hướng (b): giữ lộ trình HSK 2.0 và thêm khối «Bù HSK 3.0» không bắt buộc vào cuối Giai đoạn 1–4, lấy từ 26 bài bổ sung HSK 3.0 (cấp 1: 3 bài, cấp 2: 3, cấp 3: 6, cấp 4: 14; tổng 80 phần, 754 từ). HSK 3.0 cấp 5–6 chưa có bài bổ sung. Kiểm bằng `data/scripts/check_path_h30.py`. Chi tiết ở [lo-trinh-giai-doan-1-6.md](lo-trinh-giai-doan-1-6.md).
- ✅ **Học offline:** service worker (bản v2) lưu sẵn `js/data/h30-exams.js` và `js/data/h30-words-79.js` ngay lúc cài.
- ✅ **Chuyển tiến độ giữa các thiết bị** (không cần máy chủ): Cài đặt › Dữ liệu học. Có các cách sau:
  - Mã đồng bộ (nén gzip) để sao chép và dán.
  - Nút «Gửi sang máy khác» (chia sẻ tệp trên điện thoại).
  - Nhập tệp JSON.

  Mặc định là **gộp**: mỗi thẻ giữ lần ôn mới nhất, các bài đã học được hợp lại, điểm lấy cao nhất. Muốn ghi đè thì chọn «Thay toàn bộ». Đồng bộ tự động qua tài khoản vẫn cần máy chủ (xem `03-ke-hoach-trien-khai.md`, giai đoạn 2).
