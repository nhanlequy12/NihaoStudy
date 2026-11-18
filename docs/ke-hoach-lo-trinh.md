# Kế hoạch lộ trình từng bước (cập nhật 18/11/2026)

Mục tiêu: người mới học từ con số 0 đến HSK 6 theo các bài nhỏ 15–30 phút. Mỗi bài có mục tiêu, từ vựng, ngữ pháp/mẫu câu, luyện tập bằng chức năng sẵn có và kiểm tra nhanh. Đạt từ 70% thì mở bài sau. Cuối mỗi giai đoạn có kiểm tra tổng hợp dạng đề HSK. Làm từng giai đoạn; xong giai đoạn nào thì báo cáo số bài, số từ và nội dung đã đưa vào.

Trạng thái: ✅ xong · ⏳ đang làm · ⬜ chưa làm

## Tổng quan

| Giai đoạn | Chuẩn | Nguồn nội dung | Bài HSK sẵn có | Từ | Ngữ pháp | Bài đọc | Bài nhỏ dự kiến | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| 0 · Nhập môn | trước HSK 1 | `js/data/stage0.js`, bảng âm tiết | – | 60 | – | – | 10 + kiểm tra | ✅ |
| 1 · HSK 1 | HSK 2.0 | bài 1–12 + Bổ sung 2012 bài 1 | 13 | 155 | 52 | 3 | ~26 | ⬜ |
| 2 · HSK 2 | HSK 2.0 | bài 13–24 | 12 | 154 | 48 | 3 | ~24 | ⬜ |
| 3 · HSK 3 | HSK 2.0 | bài 25–44 + 1 bài bổ sung | 21 | 304 | 64 | 4 | ~42 | ⬜ |
| 4 · HSK 4 | HSK 2.0 | bài 45–84 + 1 bài bổ sung | 41 | 615 | 124 | 7 | ~82 | ⬜ |
| 5 · HSK 5 | HSK 2.0 | bài 85–149 + 6 bài bổ sung | 71 | 1.420 | 250 | 8 | ~142–213 | ⬜ |
| 6 · HSK 6 | HSK 2.0 | bài 150–270 | 121 | 2.421 | 402 | 12 | ~242–363 | ⬜ |

Số bài nhỏ là ước lượng: bài HSK 1–4 (12–15 từ/bài) chia làm 2 phần, bài HSK 5–6 (khoảng 20 từ/bài) chia làm 2–3 phần.

## Cách làm chung cho Giai đoạn 1–6

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
- ⬜ **Video trong file zip** («đọc chữ Hán không phụ thuộc pinyin»): chưa có nội dung vì chưa nghe được lời nói. Có hai cách:
  - (a) Cài ffmpeg và Whisper để chép lời offline trên máy.
  - (b) Người dùng tự tóm tắt ý chính.

  Có nội dung rồi thì gắn vào Bài 9 (Bộ thủ) hoặc một mục mẹo riêng, sau khi rà độ chính xác.
- ⬜ **Nghe thử trên thiết bị thật** (Chrome, Edge, điện thoại): kiểm tra máy đọc đúng chữ trong câu hỏi nghe và ô bảng âm tiết. Chữ nhiều cách đọc đã được thay bằng từ ví dụ nhưng chưa nghe bằng tai.
- ⬜ Theo dõi tỉ lệ đúng từng câu nếu sau này có thống kê. Câu nào sai quá nhiều thì xem lại cách hỏi.

## Giai đoạn 1 · HSK 1 (HSK 2.0) ⬜

- ⬜ Dựng khung dữ liệu giai đoạn sinh từ bài 1–12 và Bổ sung 2012 bài 1 (13 bài → khoảng 26 phần).
- ⬜ Mở rộng `js/path.js`: phần Học hiển thị ngữ pháp và hội thoại của bài gốc; kiểm tra nhanh dùng câu sắp xếp và câu nghe.
- ⬜ Đồng bộ với `completedLessons` theo hai chiều.
- ⬜ Gắn 3 bài đọc HSK 1 vào sau phần tương ứng (`READINGS.after`).
- ⬜ Luyện tập: Mưa từ vựng, Điền từ, Sắp xếp câu, Chép chính tả, Hỏi đáp cho HSK 2.0 cấp 1. Kiểm tra dữ liệu từng chức năng có lọc được theo cấp 1 không.
- ⬜ Kiểm tra tổng hợp: đề HSK 1 sinh ngẫu nhiên (Nghe + Đọc).
- ⬜ Kiểm tra đầu vào: thêm câu HSK 1 để xếp lên Giai đoạn 2.
- ⬜ Trang «Bắt đầu học»: Giai đoạn 1 chuyển từ «dẫn tới bài cũ» sang trang giai đoạn có khóa và mở.
- ⬜ `check_path.py`, chạy thử, báo cáo `lo-trinh-giai-doan-1.md`, commit và push.

## Giai đoạn 2 · HSK 2 (HSK 2.0) ⬜

- ⬜ Khung giai đoạn từ bài 13–24 (12 bài → khoảng 24 phần). Ngữ pháp trọng tâm: 过, 正在, 比, 得 (bổ ngữ), lượng từ, 因为…所以.
- ⬜ 3 bài đọc HSK 2; luyện tập như Giai đoạn 1 cho cấp 2.
- ⬜ Kiểm tra tổng hợp: đề HSK 2.
- ⬜ Kiểm tra đầu vào: thêm câu HSK 2.
- ⬜ Kiểm tra, chạy thử, báo cáo, commit và push.

## Giai đoạn 3 · HSK 3 (HSK 2.0) ⬜

- ⬜ Khung từ bài 25–44 và 1 bài bổ sung (21 bài → khoảng 42 phần).
- ⬜ Thêm luyện tập Chọn vị trí từ, Sửa câu sai, Luyện dịch (có từ cấp này).
- ⬜ Đề HSK 3 có phần Viết: kiểm tra bộ sinh đề có phần này không; nếu chưa có thì thêm dạng sắp xếp câu và điền chữ.
- ⬜ 4 bài đọc; kiểm tra đầu vào thêm câu HSK 3.
- ⬜ Kiểm tra, chạy thử, báo cáo, commit và push.

## Giai đoạn 4 · HSK 4 (HSK 2.0) ⬜

- ⬜ Khung từ bài 45–84 và 1 bài bổ sung (41 bài → khoảng 82 phần). Giai đoạn dài (8–12 tháng), nên chia thành 4–5 chặng nhỏ, mỗi chặng có một bài ôn ngắn.
- ⬜ 7 bài đọc; luyện tập đủ 8 chức năng.
- ⬜ Kiểm tra tổng hợp: đề HSK 4. Thêm kiểm tra giữa giai đoạn sau mỗi chặng.
- ⬜ Kiểm tra, chạy thử, báo cáo, commit và push.

## Giai đoạn 5 · HSK 5 (HSK 2.0) ⬜

- ⬜ Khung từ bài 85–149 và 6 bài bổ sung (71 bài, khoảng 20 từ/bài → 2–3 phần mỗi bài).
- ⬜ Chia chặng theo chủ đề và kiểm tra giữa giai đoạn.
- ⬜ 8 bài đọc; đề HSK 5 (có viết đoạn ngắn: kiểm tra bộ sinh đề).
- ⬜ Kiểm tra hiệu năng: nhiều phần thì trang giai đoạn cần gập theo chặng, tránh danh sách quá dài trên điện thoại.
- ⬜ Kiểm tra, chạy thử, báo cáo, commit và push.

## Giai đoạn 6 · HSK 6 (HSK 2.0) ⬜

- ⬜ Khung từ bài 150–270 (121 bài, 2.421 từ → khoảng 242–363 phần), chia chặng.
- ⬜ 12 bài đọc; đề HSK 6 (101 câu, 135 phút, có viết tóm tắt 缩写: đã có trong thi thử).
- ⬜ Kiểm tra, chạy thử, báo cáo, commit và push.

## Việc chung chưa quyết

- ⬜ **Lộ trình HSK 3.0** (đề cương 2025, thi từ 13/12/2026): web có 5.334 từ HSK 3.0 cấp 1–6, 26 bài bổ sung và 6 đề luyện. Cần chọn một trong hai hướng:
  - (a) Làm lộ trình song song theo HSK 3.0.
  - (b) Giữ lộ trình HSK 2.0 và thêm bài bù phần chênh lệch theo từng cấp.
- ⬜ Đồng bộ tiến độ giữa nhiều thiết bị: hiện chỉ lưu trên trình duyệt (xem `03-ke-hoach-trien-khai.md`, giai đoạn 2 có tài khoản).
- ⬜ Máy jili (`~/nhanle/NihaoStudy`) đang ở bản cũ: chạy `rm HUONG-DAN-SSH.txt`, `git pull`, rồi `git fetch -p` để bỏ các nhánh đã xoá.
