# Kế hoạch triển khai

## 1. Kiểm chứng HSK 3.0 (16/11/2026)

### Lịch thi

- HSK 3.0 thi toàn cầu lần đầu ngày **13/12/2026**.
  - Hạn đăng ký thi giấy: 16/11/2026 (giờ Bắc Kinh).
  - Hạn đăng ký thi máy: 03/12/2026.
- Nguồn:
  - Thông báo của CTI: https://www.chinesetest.cn/news/51336883
  - Bản tiếng Anh trên trang Sở Giáo dục Thượng Hải: https://edu.sh.gov.cn/study_en_news/20260915/f7034aa15cad4a92a6183abeea104895.html
- Theo lịch thi 2026 của CTI, 7/11 là đợt HSK 1–6 cuối cùng trước ngày ra mắt. CTI không ghi rõ "đây là kỳ HSK 2.0 cuối".

### Từ vựng

- Đề thi mới dựa trên 《HSK考试大纲》 bản 2025.
- Số từ mỗi cấp: 300 / 200 / 500 / 1.000 / 1.600 / 1.800 / 5.600 mục. Cộng dồn là 11.000.
- Dữ liệu trong `data/hsk/hsk3/` đã theo đề cương này.

### Cấu trúc đề

Lấy từ bìa đề mẫu chính thức: https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip

| Cấp | Nghe | Đọc | Viết | Tổng |
|---|---|---|---|---|
| 1 | 20 câu, ~12′ | 20 câu, 20′ | không có | 40 câu, ~40′ |
| 2 | 25 câu, ~17′ | 25 câu, 25′ | 10 câu, 10′ | 60 câu, ~60′ |
| 3 | 30 câu, ~23′ | 30 câu, 30′ | 10 câu, 20′ | 70 câu, ~83′ |
| 4 | 32 câu, ~20′ | 32 câu, 30′ | 5 câu nhìn tranh đặt câu + 1 bài ngắn, 25′ | 70 câu, ~85′ |
| 5 | 35 câu, ~25′ | 35 câu, 35′ | nhìn tranh viết + viết theo chủ đề, 40′ | 72 câu, ~110′ |
| 6 | 40 câu, ~30′ | 40 câu, 40′ | văn bản ứng dụng + viết theo chủ đề, 45′ | 82 câu, ~125′ |
| 7–9 | 40 câu | 40 câu | 2 câu | thêm Dịch 4 câu, Nói 5 câu |

Ghi chú:
- **Nói (口语)** cấp 3–6 là bài thi riêng.
- **Thang điểm và điểm đạt** của cấp 1–6 chưa được công bố. Web không nên tự đặt ngưỡng, chỉ hiển thị tỷ lệ đúng theo từng phần.

## 2. Hướng kiến trúc

Web hiện là web tĩnh: HTML/JS thuần, dữ liệu viết trong các tệp `js/data/*.js`, tiến độ lưu `localStorage`. Nên giữ hướng này càng lâu càng tốt vì miễn phí hosting và không phải bảo trì server.

### Giai đoạn 1: vẫn là web tĩnh (khoảng 2–4 tuần)

1. **Dữ liệu tải theo cấp:**
   - Chuyển `data/hsk/hsk3/hsk3-<n>.json`, `data/exams/*.json`, `data/lessons/*.json` thành tệp tĩnh và tải bằng `fetch()` khi người học mở cấp đó.
   - Không nạp hết 12.000 từ lúc vào trang.
2. **Chọn chương trình 2.0 / 3.0** ở trang Cài đặt và trang chủ. Mặc định là 3.0 (2025).
3. **Đề luyện cố định** (`data/exams/`): chạy song song với đề sinh ngẫu nhiên hiện có.
   - Có giải thích tiếng Việt từng câu.
   - Có thống kê lỗi theo nhãn `skills`.
4. **PWA:** `manifest.json` và service worker để cài như app và học offline.
5. **Lưu tiến độ bằng IndexedDB** thay cho localStorage, vì dữ liệu ôn tập sẽ vượt giới hạn khoảng 5 MB. Thêm nút xuất/nhập tiến độ ra tệp JSON.
6. **Trang Giới thiệu** có ghi công nguồn dữ liệu, theo mẫu trong `data/README.md`.

### Giai đoạn 2: có tài khoản (khi cần đồng bộ nhiều thiết bị)

- **Supabase** (PostgreSQL + đăng nhập + Row Level Security). Gói miễn phí đủ cho giai đoạn đầu.
  - Phương án khác: Cloudflare Pages + D1.
- Web vẫn tĩnh, chỉ gọi API Supabase để đồng bộ.
- Đồng bộ theo kiểu "ghi vào máy trước, đẩy lên sau" để vẫn học được khi offline.
- Cấu trúc bảng: [schema.sql](schema.sql).

### Giai đoạn 3: tùy chọn

- Audio thật cho từ và câu: thu âm hoặc TTS chất lượng cao, sinh sẵn rồi lưu trên CDN.
- Chấm bài viết và bài nói bằng AI. Cần backend để giữ khóa API, hoặc cho người học tự nhập khóa của họ.
- Bảng xếp hạng, lớp học cho giáo viên.

## 3. Cấu trúc database

Chi tiết trong [schema.sql](schema.sql).

| Nhóm | Bảng | Ghi chú |
|---|---|---|
| Nội dung | `word`, `example`, `hanzi`, `radical` | Nạp từ `data/hsk/`. Cột `src` ghi nguồn từng trường để giữ đúng giấy phép |
| Khóa học | `course` (hsk2, hsk3), `lesson`, `lesson_word`, `reading` | Thân bài học để dạng `jsonb`, giống định dạng hiện tại |
| Đề thi | `exam`, `exam_item` | `payload` và `answer` dạng `jsonb` theo [data/exams/SCHEMA.md](../data/exams/SCHEMA.md). `skill_tags` dùng để thống kê lỗi |
| Người học | `app_user`, `srs_card`, `review_log`, `lesson_progress`, `exam_attempt`, `exam_answer`, `daily_activity`, `notebook` | Bật Row Level Security: mỗi người chỉ đọc/ghi dữ liệu của mình |

Ở giai đoạn 1, các bảng "người học" nằm trong IndexedDB với cùng cấu trúc. Nhờ vậy sang giai đoạn 2 chỉ cần đồng bộ, không phải đổi mô hình dữ liệu.

## 4. Các trang cần có

Trang đánh dấu ✅ là đã có, chỉ cần mở rộng.

| Trang | Đường dẫn | Nội dung | Trạng thái |
|---|---|---|---|
| Trang chủ | `#/` | Chuỗi ngày, thẻ đến hạn, tiến độ theo cấp, đếm ngược ngày thi, gợi ý việc hôm nay | ✅ cần thêm đếm ngược, chọn 2.0/3.0 |
| Lộ trình | `#/roadmap` | Lộ trình theo cấp mục tiêu và ngày thi | ✅ cần làm lại cho HSK 3.0 |
| Kiểm tra đầu vào | `#/placement` | 15–20 câu thích ứng, gợi ý cấp bắt đầu | mới |
| Pinyin, Bộ thủ | `#/pinyin`, `#/radicals` | Mở rộng lên 214 bộ thủ | ✅ |
| Bài học | `#/lessons`, `#/lesson/:id` | Tab HSK 2.0 / HSK 3.0, thêm bài bổ sung `h3b-*` | ✅ cần thêm tab 3.0 |
| Từ vựng theo cấp | `#/words/:course/:level` | Danh sách lọc theo cấp, chủ đề, từ loại; thêm vào thẻ; xuất CSV | mới |
| Chi tiết từ | `#/word/:hz` | Nghĩa, Hán Việt, ví dụ, nét chữ, phân tách chữ, từ liên quan | mới (hiện chỉ có tra từ) |
| Ôn tập | `#/review` | SRS, như hiện tại | ✅ |
| Luyện viết | `#/write` | Thêm in phiếu tập viết | ✅ |
| Luyện nghe | `#/listen` | Chép chính tả, nghe câu chọn nghĩa | mới |
| Luyện nói | `#/speak` | Thêm dạng đề nói HSK 3.0 (nhắc lại, nhìn tranh nói, trả lời) | ✅ |
| Bài đọc | `#/read` | | ✅ |
| Thi thử | `#/exam` | Hai chế độ: đề cố định có giải thích, đề ngẫu nhiên. Chọn 2.0 hoặc 3.0 | ✅ cần thêm 3.0 |
| Kết quả thi | `#/exam/result/:id` | Điểm từng phần, xem lại từng câu kèm giải thích, lỗi theo kỹ năng | ✅ cần thêm giải thích |
| Sổ tay | `#/notebook` | Từ đã lưu, ghi chú, từ hay quên | mới |
| Thống kê | `#/stats` | Biểu đồ ôn tập, thời gian học, độ chính xác theo kỹ năng | mới |
| Cài đặt | `#/settings` | Chương trình, mục tiêu ngày, giọng đọc, xuất/nhập dữ liệu | ✅ |
| Giới thiệu | `#/about` | Nguồn dữ liệu và giấy phép | mới |
| Đăng nhập | `#/login` | Chỉ có từ giai đoạn 2 | sau |

## 5. Thứ tự làm đề xuất

**Đã làm ngày 16/11/2026:**
- Bước 1: trang Từ vựng `#/words`, từ điển có thêm từ HSK 3.0, thẻ HSK 3.0 ở trang chủ.
- Bước 2: đề cố định `#/exam/h3-<cấp>`.
- Bước 3: bài bổ sung `#/lessons/h3`.
- Bước 5: trang `#/about`.

Dữ liệu được nạp bằng tệp JS, không dùng `fetch()`, để web vẫn chạy khi mở thẳng `index.html`.


1. Nạp `data/hsk/hsk3/*.json` vào web, thêm nút chọn 2.0/3.0 và trang Từ vựng theo cấp.
2. Giao diện chạy đề cố định từ `data/exams/`, có giải thích và thống kê lỗi.
3. Thêm 24 bài học bổ sung HSK 3.0 cấp 1–4 (`data/lessons/hsk3-bo-sung.json`) vào trang Bài học.
4. PWA, IndexedDB, xuất/nhập tiến độ.
5. Trang Giới thiệu ghi nguồn.
6. Soạn thêm: đề số 2–3 cho mỗi cấp, nghĩa tiếng Việt cho cấp 7–9, bài học cấp 5–6.
7. Giai đoạn 2 (tài khoản) khi đã có người dùng thật.
