# Nǐ hǎo – Học tiếng Trung từ số 0 đến HSK 6

Tên web viết theo pinyin chuẩn: Nǐ hǎo (你好). Thư mục dự án vẫn là `NihaoStudy`.

Web tự học tiếng Trung cho người Việt, chạy hoàn toàn trên trình duyệt, không cần cài đặt hay tài khoản. Đủ 5.000 từ HSK 2.0 cấp 1–6 của danh sách chính thức sửa năm 2012 (và các từ bản 2010) trong 279 bài học có ngữ pháp, hội thoại, bài tập, ôn tập ngắt quãng, luyện viết và luyện nói.

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
| 8. HSK 6 · 2.500 từ | Tháng 41–60 | Bài 150–270: 倘若…就, 与其…不如, 即便…也, 何况, 以致, 从而, 固然…但, 尚且…何况, 非…不可, 就…而言; 5 bài thành ngữ, 6 bài từ ngữ pháp; 12 bài đọc 260–380 chữ | Bài học |
| + Bổ sung 2012 · 154 từ | Song song HSK 1–5 | Bài «Bổ sung 2012» 1–9 ở cuối mỗi cấp: từ danh sách 2012 thêm vào so với bản 2010 (饭店, 没有, 说, 一点儿, 互联网, 志愿者…) | Bài học |
| 9. Ôn tập ngắt quãng | Mỗi ngày | Thuật toán SM-2 giống Anki, chấm 4 mức | Ôn tập |
| 10. Viết và nói | Tháng 2–3+ | Hoạt hình thứ tự nét và kiểm tra nét (Hanzi Writer), shadowing với nhận dạng giọng nói | Luyện viết, Luyện nói |

Nguyên tắc rút ra từ research:

- Học phát âm và thanh điệu trước, không bỏ qua.
- 5–10 từ mới một ngày, học trong câu, không học từ rời.
- Ôn tập ngắt quãng mỗi ngày, không bỏ ngày nào.
- Dùng âm Hán Việt làm cầu nối (lợi thế riêng của người Việt).
- Nghe và nói từ sớm, không đợi "đủ giỏi".

## Tính năng

- Trang chủ: streak, số từ đã học, thẻ đến hạn, tiến độ từng cấp HSK, thói quen 30 phút/ngày tự tích, bản đồ hoạt động 8 tuần.
- Pinyin Lab: bảng thanh mẫu/vận mẫu nghe được, giải thích theo tiếng Việt, luyện nghe thanh điệu, cặp âm dễ nhầm.
- 279 bài học HSK 2.0 cấp 1–6 (5.000 từ: 149 bài cấp 1–5, 9 bài bổ sung bản 2012, 121 bài cấp 6), chia tab theo cấp: pinyin tô màu theo thanh, Hán Việt, câu ví dụ, 3–4 điểm ngữ pháp/bài, hội thoại, mẹo cho người Việt, bài tập 4 dạng (chọn nghĩa, chọn chữ, nghe chọn, ghép câu). Đạt 70% thì từ vào bộ thẻ.
- Ôn tập SRS: 6 kiểu mặt trước: chữ Hán, tiếng Việt, nghe, **câu che từ (cloze)**, **gõ pinyin**, **chọn thanh điệu**. Hai kiểu nhập liệu chấm tự động, trả lời sai thì chỉ được chấm Quên/Khó. Có danh sách từ hay quên nhất. Phím tắt Space, 1–4, Enter.
- Luyện viết kiểu Skritter: **bộ thẻ viết tay riêng** (SM-2) cho cả từ nhiều chữ, viết từ trí nhớ không có khung, máy đếm nét sai và gợi ý mức chấm; dùng gợi ý thì tối đa Khó, xem đáp án thì Quên. Tab Luyện từng chữ giữ hoạt hình nét và tự viết.
- Bài đọc ngắn: 25 đoạn văn (80–150 chữ ở HSK 1–4, 150–260 chữ ở HSK 5) sau mỗi 5–8 bài, chỉ dùng từ đã học; bấm từng từ hiện nghĩa và thêm vào thẻ, nghe cả đoạn, bật/tắt pinyin và bản dịch, 3 câu hỏi hiểu bài.
- Luyện nói: shadowing câu mẫu, nhận dạng giọng nói so khớp theo phần trăm.
- Thi thử HSK 1–6: đề sinh ngẫu nhiên từ kho từ/câu/hội thoại/bài đọc theo đúng cấu trúc đề chính thức (số phần, số câu, thời gian từng phần, số lần phát audio, thang điểm 200/300 và mốc đậu 120/180; HSK 5: 100 câu, 125 phút, nghe 45 / đọc 45 / viết 10; HSK 6: 101 câu, 135 phút, nghe 50 / đọc 50 gồm phần chọn câu sai và điền câu vào đoạn / viết tóm tắt 缩写 có ẩn bài sau 10 phút). Các phần nhìn tranh thay bằng nghĩa tiếng Việt, phần nghe dùng giọng trình duyệt. Có đồng hồ tự nộp, kết quả theo từng phần, xem lại từng câu, lịch sử thi và liên kết tới đề thật (chinesetest.cn, Mandarin Bean, Mandarin Temple, YouTube).
- Từ điển HSK 1–6: tra theo chữ, pinyin có/không dấu, Hán Việt, tiếng Việt, lọc theo cấp; thêm thẳng vào bộ thẻ.
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
js/data/hsk2012-bs.js 9 bài «Bổ sung 2012» (bài 301–309): 154 từ của danh sách 2012 cấp 1–5 mà bài 1–149 (theo danh sách 2010) chưa có; mỗi từ ghi cấp bản 2012
js/data/hsk6-*.js   HSK 6: bài 150–270, 2.421 từ (79 từ còn lại của cấp 6 đã dạy ở cấp 1–5), 12 tệp a–l, mỗi tệp kèm một bài đọc
js/data/readings-*.js 17 bài đọc ngắn HSK 1–4 (sau bài 5, 10, 12, 15, 20, 24, 30, …, 84); 8 bài đọc HSK 5 nằm trong hsk5-*.js
js/store.js         lưu tiến độ (localStorage)
js/srs.js           thuật toán SM-2 (bộ thẻ nhận biết SRS và bộ thẻ viết WSRS)
js/tts.js           phát âm và nhận dạng giọng nói (Web Speech API)
js/views.js         các màn hình
js/exam.js          cấu trúc đề HSK 1–6, sinh câu hỏi, chấm điểm
js/views-exam.js    màn hình thi thử
js/app.js           định tuyến
```

Thêm cấp độ mới: tạo tệp `js/data/hskN-x.js` theo mẫu các tệp HSK 3/4 (IIFE push vào `window.VOCAB` và `window.LESSONS`, mỗi từ có `level`), rồi thêm thẻ `<script>` vào `index.html` sau `lessons.js`.

## Nếu không nghe thấy tiếng Trung

Windows: Settings → Time & Language → Language & region → Add a language → 中文(简体，中国) → tick Text-to-speech. Hoặc mở web bằng Microsoft Edge (có sẵn giọng online Xiaoxiao). Vào mục Cài đặt trong web để chọn giọng.

## Nguồn

- Danh sách từ HSK 2.0: bài 1–149 viết theo danh sách năm 2010 của [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT); nghĩa tiếng Việt và Hán Việt biên soạn thủ công. Một số chữ đa âm trong nguồn chọn sai âm (ví dụ 胖, 骑, 场, 脏, 大夫) đã được sửa theo âm đọc HSK.
- Cấp 6 và phần bổ sung theo **danh sách chính thức sửa năm 2012** (bản cuối cùng của HSK 2.0, Hán Biện công bố tại chinesetest.cn). Đối chiếu ba nguồn: [hskhsk.com](https://github.com/glxxyz/hskhsk.com) (MIT, «HSK Official 2012»), [clem109/hsk-vocabulary](https://github.com/clem109/hsk-vocabulary) (MIT, bản 2010) và bảng so sánh 2010–2012 của [Mike's Chinese Adventures](https://chinese.miknight.com/word-list-differences-between-hsk-2010-and-2012/). Áp danh sách thay đổi của bảng so sánh lên bản 2010 cho đúng 150/151/300/600/1.300/2.500 từ của bản 2012 ở cả sáu cấp. So với bài 1–149, bản 2012 có thêm 154 từ ở cấp 1–5 (dạy ở bài Bổ sung 2012) và 2.421 từ cấp 6 chưa dạy. Pinyin đầu mục giữ theo đề cương 2025 và CC-CEDICT; 29 từ lệch với bản 2012 chủ yếu ở thanh nhẹ (固执 gùzhi, 码头 mǎtóu…).
- Nét chữ: [Hanzi Writer](https://hanziwriter.org) (MIT).
- Font: Noto Sans SC, Noto Serif SC, Be Vietnam Pro (Google Fonts).

## Dữ liệu và tài liệu

- [data/README.md](data/README.md): bộ từ vựng HSK 3.0 (đề cương 2025), HSK 2.0 và HSK 3.0 (2021), xuất ra JSON và CSV theo cấp. Có nguồn và giấy phép của từng trường.
- [data/exams/](data/exams/): 6 đề luyện HSK 3.0 cấp 1–6 tự soạn, mỗi câu có giải thích tiếng Việt.
- [data/lessons/hsk3-bo-sung.json](data/lessons/hsk3-bo-sung.json): 26 bài học bổ sung cho từ HSK 3.0 cấp 1–4.
- [docs/01-phan-tich-chuc-nang.md](docs/01-phan-tich-chuc-nang.md): so sánh chức năng với các web luyện thi HSK khác.
- [docs/02-de-thi-va-bai-hoc.md](docs/02-de-thi-va-bai-hoc.md): mô tả đề luyện và bài học.
- [docs/hsk2-2012-va-cap6.md](docs/hsk2-2012-va-cap6.md): đối chiếu danh sách HSK 2.0 bản 2010 và 2012, bổ sung 154 từ và cấp 6.
- [docs/03-ke-hoach-trien-khai.md](docs/03-ke-hoach-trien-khai.md) và [docs/schema.sql](docs/schema.sql): kế hoạch triển khai, cấu trúc database, danh sách trang.
