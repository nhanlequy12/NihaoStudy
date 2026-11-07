# Nǐ hǎo – Học tiếng Trung từ số 0 đến HSK 5

Tên web viết theo pinyin chuẩn: Nǐ hǎo (你好). Thư mục dự án vẫn là `NihaoStudy`.

Web tự học tiếng Trung cho người Việt, chạy hoàn toàn trên trình duyệt, không cần cài đặt hay tài khoản. Trọn bộ 2.500 từ HSK 1–5 (bộ cũ) trong 149 bài học có ngữ pháp, hội thoại, bài tập, ôn tập ngắt quãng, luyện viết và luyện nói.

## Chạy

Cách 1 (khuyên dùng, cần Python có sẵn):

```bash
python -m http.server 8787
```

rồi mở <http://localhost:8787>.

Cách 2: dùng Node

```bash
npx serve .
```

Cách 3: mở thẳng `index.html` bằng Microsoft Edge hoặc Chrome (vẫn chạy được, chỉ cần internet để tải font và dữ liệu nét chữ).

Nên dùng **Microsoft Edge** hoặc **Chrome**: hai trình duyệt này có giọng đọc tiếng Trung và nhận dạng giọng nói.

## Phương pháp học (đã research và tổng hợp)

Tổng hợp từ các app/web được đánh giá tốt nhất cho người mới: HelloChinese, Duolingo, Anki, Hack Chinese, Skritter, Pleco, Du Chinese, Migaku và lộ trình 30 phút/ngày của HSK Lord.

| Giai đoạn | Thời gian | Nội dung | Mục trong web |
|---|---|---|---|
| 1. Pinyin và thanh điệu | Tuần 1–2 | 21 thanh mẫu, 36 vận mẫu, 4 thanh + thanh nhẹ, quy tắc biến điệu, luyện nghe đoán thanh | Pinyin |
| 2. Bộ thủ | Tuần 2–4 | 40 bộ thủ phổ biến với Hán Việt | Bộ thủ |
| 3. HSK 1 · 150 từ | Tháng 1–2 | Bài 1–12 theo chủ đề: từ vựng, ngữ pháp, hội thoại, bài tập | Bài học |
| 4. HSK 2 · 150 từ | Tháng 3–5 | Bài 13–24: 过, 正在, 比, 得, lượng từ 次/件/张, 因为…所以 | Bài học |
| 5. HSK 3 · 300 từ | Tháng 6–11 | Bài 25–44: 把, 被, bổ ngữ, 越来越, 虽然…但是, 只要…就 | Bài học |
| 6. HSK 4 · 600 từ | Tháng 12–24 | Bài 45–84: 不管…都, 既然…就, 连…都, 是…的, 对…来说, 随着; 6 bài ngữ pháp riêng | Bài học |
| 7. HSK 5 · 1.300 từ | Tháng 25–40 | Bài 85–149: 宁可…也, 与其…不如, 无论…都, 除非…否则, 以便/以免, 反而, 居然, 未必; 7 bài từ ngữ pháp riêng; mỗi tệp một bài đọc 150–260 chữ | Bài học |
| 8. Ôn tập ngắt quãng | Mỗi ngày | Thuật toán SM-2 giống Anki, chấm 4 mức | Ôn tập |
| 9. Viết và nói | Tháng 2–3+ | Hoạt hình thứ tự nét và kiểm tra nét (Hanzi Writer), shadowing với nhận dạng giọng nói | Luyện viết, Luyện nói |

Nguyên tắc rút ra từ research:

- Học phát âm và thanh điệu trước, không bỏ qua.
- 5–10 từ mới một ngày, học trong câu, không học từ rời.
- Ôn tập ngắt quãng mỗi ngày, không bỏ ngày nào.
- Dùng âm Hán Việt làm cầu nối (lợi thế riêng của người Việt).
- Nghe và nói từ sớm, không đợi "đủ giỏi".

## Tính năng

- Trang chủ: streak, số từ đã học, thẻ đến hạn, tiến độ từng cấp HSK, thói quen 30 phút/ngày tự tích, bản đồ hoạt động 8 tuần.
- Pinyin Lab: bảng thanh mẫu/vận mẫu nghe được, giải thích theo tiếng Việt, luyện nghe thanh điệu, cặp âm dễ nhầm.
- 149 bài học HSK 1–5 (2.500 từ), chia tab theo cấp: pinyin tô màu theo thanh, Hán Việt, câu ví dụ, 3–4 điểm ngữ pháp/bài, hội thoại, mẹo cho người Việt, bài tập 4 dạng (chọn nghĩa, chọn chữ, nghe chọn, ghép câu). Đạt 70% thì từ vào bộ thẻ.
- Ôn tập SRS: 6 kiểu mặt trước: chữ Hán, tiếng Việt, nghe, **câu che từ (cloze)**, **gõ pinyin**, **chọn thanh điệu**. Hai kiểu nhập liệu chấm tự động, trả lời sai thì chỉ được chấm Quên/Khó. Có danh sách từ hay quên nhất. Phím tắt Space, 1–4, Enter.
- Luyện viết kiểu Skritter: **bộ thẻ viết tay riêng** (SM-2) cho cả từ nhiều chữ, viết từ trí nhớ không có khung, máy đếm nét sai và gợi ý mức chấm; dùng gợi ý thì tối đa Khó, xem đáp án thì Quên. Tab Luyện từng chữ giữ hoạt hình nét và tự viết.
- Bài đọc ngắn: 25 đoạn văn (80–150 chữ ở HSK 1–4, 150–260 chữ ở HSK 5) sau mỗi 5–8 bài, chỉ dùng từ đã học; bấm từng từ hiện nghĩa và thêm vào thẻ, nghe cả đoạn, bật/tắt pinyin và bản dịch, 3 câu hỏi hiểu bài.
- Luyện nói: shadowing câu mẫu, nhận dạng giọng nói so khớp theo phần trăm.
- Thi thử HSK 1–5: đề sinh ngẫu nhiên từ kho từ/câu/hội thoại/bài đọc theo đúng cấu trúc đề chính thức (số phần, số câu, thời gian từng phần, số lần phát audio, thang điểm 200/300 và mốc đậu 120/180; HSK 5: 100 câu, 125 phút, nghe 45 / đọc 45 / viết 10). Các phần nhìn tranh thay bằng nghĩa tiếng Việt, phần nghe dùng giọng trình duyệt. Có đồng hồ tự nộp, kết quả theo từng phần, xem lại từng câu, lịch sử thi và liên kết tới đề thật (chinesetest.cn, Mandarin Bean, Mandarin Temple, YouTube).
- Từ điển HSK 1–5: tra theo chữ, pinyin có/không dấu, Hán Việt, tiếng Việt, lọc theo cấp; thêm thẳng vào bộ thẻ.
- Cài đặt: chọn giọng đọc, tốc độ, giao diện sáng/tối, cỡ chữ Hán (bình thường/lớn/rất lớn), xuất/nhập tiến độ JSON.
- Giao diện: cỡ chữ 17px, chữ Hán to và rõ, bảng từ vựng tự xếp thành thẻ trên điện thoại, menu dạng lưới có biểu tượng, nút chuyển bước Từ vựng → Ngữ pháp → Hội thoại → Luyện tập trong mỗi bài.

## Cấu trúc

```
index.html          giao diện khung
css/style.css       giao diện (hỗ trợ dark mode, mobile)
js/data/pinyin.js   thanh mẫu, vận mẫu, thanh điệu, bài luyện
js/data/radicals.js 40 bộ thủ
js/data/vocab.js    300 từ HSK 1–2 (biên soạn tiếng Việt + Hán Việt)
js/data/lessons.js  24 bài học HSK 1–2, lộ trình, thói quen hằng ngày, nguồn tham khảo
js/data/hsk3-*.js   HSK 3: bài 25–44, 298 từ
js/data/hsk4-*.js   HSK 4: bài 45–84, 598 từ
js/data/hsk5-*.js   HSK 5: bài 85–149, 1.298 từ, 8 tệp a–h, mỗi tệp kèm một bài đọc
js/data/readings-*.js 17 bài đọc ngắn HSK 1–4 (sau bài 5, 10, 12, 15, 20, 24, 30, …, 84); 8 bài đọc HSK 5 nằm trong hsk5-*.js
js/store.js         lưu tiến độ (localStorage)
js/srs.js           thuật toán SM-2 (bộ thẻ nhận biết SRS và bộ thẻ viết WSRS)
js/tts.js           phát âm và nhận dạng giọng nói (Web Speech API)
js/views.js         các màn hình
js/exam.js          cấu trúc đề HSK 1–5, sinh câu hỏi, chấm điểm
js/views-exam.js    màn hình thi thử
js/app.js           định tuyến
```

Thêm cấp độ mới: tạo tệp `js/data/hskN-x.js` theo mẫu các tệp HSK 3/4 (IIFE push vào `window.VOCAB` và `window.LESSONS`, mỗi từ có `level`), rồi thêm thẻ `<script>` vào `index.html` sau `lessons.js`.

## Nếu không nghe thấy tiếng Trung

Windows: Settings → Time & Language → Language & region → Add a language → 中文(简体，中国) → tick Text-to-speech. Hoặc mở web bằng Microsoft Edge (có sẵn giọng online Xiaoxiao). Vào mục Cài đặt trong web để chọn giọng.

## Nguồn

- Danh sách từ HSK 1–5 (bộ cũ): [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT) để đối chiếu chữ và pinyin; nghĩa tiếng Việt và Hán Việt biên soạn thủ công. Tệp HSK 2 của nguồn này có 147 mục, ba từ còn lại (过, 等, 对) được bổ sung thủ công; tệp HSK 3, 4, 5 có 298, 598 và 1.298 mục (HSK 5 chính thức 1.300 từ). Một số chữ đa âm trong nguồn chọn sai âm (ví dụ 胖, 骑, 场, 脏, 大夫) đã được sửa thủ công theo âm đọc HSK.
- Nét chữ: [Hanzi Writer](https://hanziwriter.org) (MIT).
- Font: Noto Sans SC, Noto Serif SC, Be Vietnam Pro (Google Fonts).
