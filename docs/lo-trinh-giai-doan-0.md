# Lộ trình từng bước · Giai đoạn 0 – Nhập môn (18/11/2026)

## Đã làm

| Phần | Nội dung |
|---|---|
| Trang «Bắt đầu học» (`#/start`) | Giới thiệu lộ trình, nút Bắt đầu / Tiếp tục học, kiểm tra đầu vào tùy chọn, danh sách giai đoạn 0–6 kèm thời gian dự kiến và thanh tiến độ |
| Trang giai đoạn (`#/path/0`) | 10 bài nối tiếp có chấm trạng thái (xong / đang học / khóa), thanh tiến độ, nhắc ôn thẻ đến hạn |
| Bài nhỏ (`#/step/s0-N`) | 3 phần: Học (mục tiêu, nội dung, từ vựng mới, mẫu câu) · Luyện tập (luyện nhanh không tính điểm + công cụ sẵn có) · Kiểm tra nhanh |
| Mở khóa | Bài sau mở khi bài trước đạt từ 70%; bài kiểm tra tổng hợp mở khi xong cả 10 bài |
| Ôn tập ngắt quãng | Qua bài thì từ vựng của bài vào bộ thẻ SRS và bộ thẻ luyện viết sẵn có |
| Kiểm tra tổng hợp (`#/step/s0-test`) | 20 câu dạng đề HSK: Phần 1 Nghe (12), Phần 2 Đọc (8), lấy ngẫu nhiên từ 10 bài |
| Kiểm tra đầu vào (`#/start/test`) | 14 câu: 8 câu pinyin/thanh điệu, 6 câu từ HSK 1; đạt 70% phần pinyin thì được bỏ qua Nhập môn |
| Bảng âm tiết | Trong Bài 7 và tab mới «Bảng âm tiết» của Pinyin Lab |
| Trang chủ | Nút «Tiếp tục học» và thẻ lộ trình cho người mới / người đang học lộ trình; người đã học bài HSK từ trước giữ nút cũ |

Tiến độ lưu trong `localStorage` (khóa `path` của `nihaostudy.v1`), đi kèm sao lưu/khôi phục sẵn có.

## 10 bài

| Bài | Tên | Phút | Từ vựng | Câu kiểm tra |
|---|---|---|---|---|
| 1 | Bốn thanh điệu và thanh nhẹ | 20 | 6 | 14 |
| 2 | Nguyên âm đơn a o e i u ü | 20 | 6 | 11 |
| 3 | Phụ âm b p m f d t n l g k h | 25 | 9 | 13 |
| 4 | Phụ âm j q x · zh ch sh r · z c s | 25 | 10 | 13 |
| 5 | Vần ghép và vần mũi | 25 | 12 | 16 |
| 6 | Biến điệu và thanh nhẹ trong câu | 20 | 7 | 12 |
| 7 | Bảng âm tiết: ghép âm và đặt dấu | 25 | 5 | 12 |
| 8 | Nét cơ bản và thứ tự viết | 20 | 6 | 9 |
| 9 | Bộ thủ thường gặp | 20 | 6 | 10 |
| 10 | Cách gõ tiếng Trung | 15 | 5 | 8 |
| | **Tổng** | **215** | **72 lượt, 60 từ khác nhau** | **118** |

Kèm bài kiểm tra tổng hợp 20 câu (20 phút).

## Nội dung từ file zip đã đưa vào

| Trong zip | Xử lý |
|---|---|
| 25 bảng âm tiết × 4 thanh (theo phụ âm đầu) | Dựng lại bảng âm tiết từ dữ liệu mở thay vì chép ảnh (ảnh có watermark của kênh TikTok). Bổ sung phần zip thiếu: trang **zh** và các âm tiết không có phụ âm đầu; thêm cột thanh nhẹ cho 吗 呢 吧 的 了 么… Chữ ví dụ lấy từ từ vựng HSK thay cho chữ hiếm |
| Bảng «23 phụ âm», «37 nguyên âm» kèm cách đọc phỏng tiếng Việt | Không chép: một số cách đọc sai hoặc dễ hiểu nhầm (q ≠ «tri», uo không phải «ua», ü không phải «duy»). Bài 2–5 dùng ghi chú phát âm sẵn có của Pinyin Lab |
| Bảng 声母 / 韵母 có chữ ví dụ | Trùng nội dung Pinyin Lab (21 thanh mẫu, 36 vận mẫu), dùng lại dữ liệu sẵn có |
| Video TikTok «đọc chữ Hán không phụ thuộc pinyin» | Chưa đưa vào: nội dung ở phần lời nói, không trích được |

Bảng âm tiết: 398 âm tiết có chữ HSK, 1.117 ô có chữ ví dụ; 19 âm tiết hiếm (có trong CC-CEDICT nhưng không chữ HSK nào đọc như vậy) liệt kê riêng.

## Kiểm tra độ chính xác

Theo thứ tự nguồn của dự án (danh sách HSK > đề cương 2025 > CC-CEDICT > Unihan):

- **Từ vựng và mẫu câu** chỉ lấy từ VOCAB (đã rà soát), không soạn câu tiếng Trung mới.
- **Câu nghe**: chữ máy đọc phải là chữ một âm theo CC-CEDICT, hoặc đúng từ đầu mục HSK có pinyin bằng đáp án. Lần đầu bắt được 中 (zhōng/zhòng), đã thay bằng 这.
- **Phương án pinyin**: phải là âm tiết có thật, dấu đặt đúng chỗ.
- **Số nét**: khớp Unihan.
- **Bảng âm tiết**: mỗi ô, chữ phải có cách đọc đó trong CC-CEDICT; từ ví dụ phải chứa chữ đọc đúng âm. Khi dựng bảng phát hiện cột `py_num` của bộ dữ liệu ghi thanh gốc cho một số từ (妻子 zi3 trong khi đọc qīzi, 吗 ma2), nên tách âm tiết từ pinyin hiển thị thay vì dùng `py_num`.

Script: `data/scripts/check_stage0.py` → 99 từ, 118 câu hỏi (52 câu nghe), 1.117 ô bảng âm tiết: **0 lỗi**.

## Chạy thử

- Làm hết 10 bài và bài kiểm tra tổng hợp bằng script tự trả lời: mọi câu đều có đúng một đáp án khớp dữ liệu; tiến độ lưu đúng; 60 từ vào bộ thẻ ôn tập và bộ thẻ viết.
- Trượt (21%): bài sau vẫn khóa, không thêm từ vào bộ thẻ.
- Kiểm tra đầu vào → «Bỏ qua Nhập môn»: chuyển sang HSK 1, bài Nhập môn vẫn mở.
- Khổ điện thoại (~430px) và máy tính (1280px); 23 trang cũ vẫn mở bình thường, không lỗi console.

## Chưa làm (các giai đoạn sau)

- Giai đoạn 1–6 hiện dẫn tới bài học HSK 2.0 sẵn có; chưa chia thành bài nhỏ 15–30 phút, chưa khóa/mở theo lộ trình mới.
- Kiểm tra đầu vào mới xếp được Giai đoạn 0 → 1.
