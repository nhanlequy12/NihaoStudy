# Đề luyện và bài học tự biên soạn

Toàn bộ nội dung trong `data/exams/` và `data/lessons/` do Nǐ hǎo tự soạn.
- **Đề luyện:** chỉ bám theo **cấu trúc** của đề mẫu HSK 3.0 do CLEC công bố (số phần, dạng câu, số câu, thời gian). Không lấy câu hỏi, lời thoại, bài đọc, tên nhân vật hay tình huống nào từ đề mẫu hoặc từ web khác.
- **Từ vựng:** kiểm tra bằng script, so với đề cương HSK 2025 trong `data/hsk/hsk3/`.

## Đề luyện HSK 3.0: mỗi cấp 1 đề (cấp 1–6)

Định dạng tệp mô tả trong [data/exams/SCHEMA.md](../data/exams/SCHEMA.md). Kiểm tra bằng `python3 data/scripts/check_exams.py`.

| Tệp | Cấp | Số câu (Nghe / Đọc / Viết) | Thời gian | Dạng câu chính | Từ vượt cấp |
|---|---|---|---|---|---|
| `hsk3-1-de01.json` | 1 | 40 (20 / 20 / –) | ~40′ | nghe chọn tranh, chọn câu đáp, nối hội thoại; đọc nối câu, điền từ | 0 |
| `hsk3-2-de01.json` | 2 | 60 (25 / 25 / 10) | ~60′ | thêm phần viết: chọn bộ phận chữ (`w_component`), nhìn pinyin viết chữ | 0 |
| `hsk3-3-de01.json` | 3 | 70 (30 / 30 / 10) | ~83′ | nghe độc thoại; đọc đoạn; viết chữ và nhìn tranh đặt câu | 0 |
| `hsk3-4-de01.json` | 4 | 70 (32 / 32 / 6) | ~85′ | 4 lựa chọn; chọn câu điền vào đoạn; 5 câu nhìn tranh đặt câu + bài ≥ 80 chữ | 1 (春节) |
| `hsk3-5-de01.json` | 5 | 72 (35 / 35 / 2) | ~110′ | sắp xếp đoạn; viết theo 4 tranh ≥ 100 chữ; viết theo chủ đề ≥ 200 chữ | 3 |
| `hsk3-6-de01.json` | 6 | 82 (40 / 40 / 2) | ~125′ | phỏng vấn; chọn câu điền đoạn; văn bản ứng dụng ≥ 150 chữ; nghị luận ≥ 300 chữ | 19 (từ chuyên đề) |

Mỗi câu có:
- đáp án;
- giải thích tiếng Việt (`explain_vi`);
- nhãn kỹ năng (`skills`) để thống kê lỗi.

Câu viết có thêm bài mẫu (`sample_answer`) và tiêu chí tự chấm (`rubric_vi`).

Tranh trong đề thật được thay bằng mô tả tiếng Việt (`image_vi`), vì web không có tranh.

Mỗi đề có pinyin (`stem_py`, `options_py`) để hỗ trợ người mới. Lúc làm bài nên ẩn pinyin.

### Những điểm còn phải giả định

Đề mẫu chính thức không ghi các điểm sau:
- **Số lần phát audio.** Đang tạm đặt:
  - cấp 1–3: 2 lần;
  - cấp 4–6: 1 lần (theo thói quen của HSK 2.0).
- **Cách chia nhóm câu ở phần nghe cấp 4–6.** Đề mẫu không kèm lời thoại, nên cách chia được suy ra từ các phương án.
- **Thang điểm và điểm đạt HSK 3.0 cấp 1–6.** CLEC chưa công bố, nên web chỉ nên hiển thị tỷ lệ đúng theo từng phần.

Khi CLEC công bố thêm thì sửa trường `plays` và `scoring_note` trong từng đề.

## Bài học bổ sung HSK 3.0 (cấp 1–4)

Tệp `data/lessons/hsk3-bo-sung.json` có 26 bài. Các bài này dạy đủ **754 từ** thuộc HSK 3.0 cấp 1–4 (đề cương 2025) mà 149 bài cũ (viết theo HSK 2.0) chưa có. Mỗi từ nằm trong đúng một bài, và cả 754 từ đều xuất hiện trong ví dụ, hội thoại hoặc câu luyện của bài đó.

| Cấp | Số bài | Tên bài |
|---|---|---|
| 1 | 3 | Ở đâu? Cái nào? · Một ngày đi học · Ăn, chơi và người thân |
| 2 | 3 | Ra, vào, lên, xuống · Đi chơi, đi mua sắm · Tuổi thơ, trường lớp & thể thao |
| 3 | 6 | Bốn mùa & ngày nghỉ · Phố phường & phương hướng · Ở trường · Thể thao & vui chơi · Con người & cảm xúc · Dịch vụ & cuộc sống số |
| 4 | 14 | Học tập & thi cử · Công việc & thủ tục · Mua sắm & giá cả · Giao thông & đi lại · Du lịch & nghỉ dưỡng · Ăn uống & nhà bếp · Thời tiết & thiên nhiên · Sức khỏe & cơ thể · Gia đình & các thế hệ · Internet & cuộc sống số · Thi đấu & nghệ thuật · Liên từ & phó từ văn viết · Số lượng, so sánh & thời điểm · Cảm xúc & suy nghĩ |

Cấu trúc mỗi bài giống bài hiện có của web: `goals`, `grammar`, `dialogue`, `sentences` (luyện ghép câu), `tips`.

Khác biệt duy nhất là trường `words` chỉ ghi chữ Hán. Nghĩa, Hán Việt và câu ví dụ của từng từ lấy từ `data/hsk/`, nên không bị lặp hai nơi.

## Còn có thể soạn tiếp

- Đề số 2 và 3 cho mỗi cấp, đề cấp 7–9 (có thêm phần Dịch và Nói), đề Nói cấp 3–6.
- Bài học bổ sung cho HSK 3.0 cấp 5–6 (khoảng 3.350 từ).
- Nghĩa tiếng Việt cho cấp 7–9: còn khoảng 3.800 từ.
- Rà soát lại âm Hán Việt các agent đánh dấu chưa chắc, ví dụ 搜索, 挑剔, 酗酒, 伺候, 甭.
