# HSK 2.0: bổ sung danh sách 2012 và cấp 6 (16/11/2026)

## Kết luận đối chiếu nguồn

Bài 1–149 viết theo danh sách HSK 2.0 năm 2010. Danh sách chính thức được sửa năm 2012 và đó là bản cuối cùng của HSK 2.0.

| Nguồn | Phiên bản | Số từ cấp 1–6 | Dùng để |
|---|---|---|---|
| [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT) | 2010 | 150 / 147 / 298 / 598 / 1.298 / 2.500 | bài 1–149 (đã có) |
| [clem109/hsk-vocabulary](https://github.com/clem109/hsk-vocabulary) (MIT) | 2010 | 150 / 150 / 299 / 601 / 1.300 / 2.500 (có mục đa âm lặp) | đối chiếu bản 2010 |
| [hskhsk.com](https://github.com/glxxyz/hskhsk.com) (MIT), «HSK Official 2012» | 2012 | 150 / 151 / 300 / 600 / 1.300 / 2.500 | danh sách chuẩn cho phần mới |
| [Bảng so sánh 2010–2012](https://chinese.miknight.com/word-list-differences-between-hsk-2010-and-2012/) (lấy từ tệp HSK-2012.xls của chinesetest.cn) | 2010 → 2012 | danh sách thêm/bớt từng cấp | kiểm tra chéo |
| [hsk.academy](https://hsk.academy/en/blog/new-hsk-vocabulary-lists) | | xác nhận 2012 là lần cập nhật cuối | |

Kiểm tra chéo: số từ thêm/bớt giữa bản 2010 (clem109) và bản 2012 (hskhsk.com) khớp với bảng so sánh ở cả 6 cấp. Sau khi thêm, **toàn bộ đầu mục bản 2012 cấp 1–6 đều có trên web** (kiểm bằng script, 0 từ thiếu).

## Đã thêm

| Phần | Tệp | Bài | Từ | Ghi chú |
|---|---|---|---|---|
| Bổ sung 2012 | `js/data/hsk2012-bs.js` | 301–309 (hiển thị «Bổ sung 2012 · Bài 1–9», xếp cuối cấp 1, 3, 4, 5) | 154 (cấp 2012: 5 / 4 / 6 / 17 / 122) | gồm 称 và 志愿者 bị thiếu trong nguồn 2010 của cấp 5 |
| HSK 6 | `js/data/hsk6-a.js` … `hsk6-l.js` | 150–270 | 2.421 | 79 từ còn lại của cấp 6 đã dạy ở cấp 1–5; mỗi tệp một bài đọc 290–380 chữ |
| Thi thử HSK 6 | `js/exam.js`, `js/views-exam.js` | | | 101 câu, 135 phút; dạng mới: chọn câu sai (阅读 phần 1), điền câu vào đoạn (phần 3), viết tóm tắt 缩写 có ẩn bài sau 10 phút |

Từ mới dùng mã `h3_<chữ>`, trùng mã của lớp HSK 3.0 cho 920 từ có ở cả hai, để thẻ ôn tập người dùng đã có vẫn liên kết đúng.

Nội dung từ: 2.209 từ cấp 6 và phần lớn từ bổ sung lấy nguyên nghĩa, Hán Việt, câu ví dụ đã rà soát trong `data/hsk` (`vi_src = nihao-authored`). 223 từ chỉ có nghĩa máy dịch CVDICT hoặc thiếu dữ liệu được biên soạn mới. Kiểm tra máy (`check6.js`): đủ từ từng bài, pinyin khớp, câu ví dụ chứa từ, số ngữ pháp/hội thoại/câu mẫu, bài đọc chỉ dùng từ đã học. 13 tệp đều 0 lỗi.

## Pinyin đầu mục

Giữ theo đề cương 2025 và CC-CEDICT (đầu mục dùng chung với HSK 3.0). 29 từ lệch với bản 2012, chủ yếu thanh nhẹ: 固执 gùzhi, 码头 mǎtóu, 拳头 quántóu, 报复 bàofù, 意识 yìshí, 媳妇 xífu… Ba từ khác âm và khác nghĩa, nghĩa còn lại ghi trong ngoặc:

| Từ | Bản 2012 | Web | Cách xử lý |
|---|---|---|---|
| 晃 | huàng (lắc lư) | huǎng (lóa, vụt qua) | nghĩa huàng ghi kèm |
| 正当 | zhèngdāng (đúng lúc) | zhèngdàng (chính đáng) | mẹo bài 194 giải thích hai âm |
| 削 | xuē (cắt giảm) | xiāo (gọt) | nghĩa xuē ghi kèm |

## Sửa nhỏ trên dữ liệu đã rà soát (do người biên soạn báo)

Pinyin câu ví dụ cho khớp đầu mục: 媳妇, 拳头, 薪水, 格式, 固执, 摸索, 一帆风顺; 个 → ge (唠叨, 无赖). Hán Việt thống nhất: 吃苦 ngật khổ, 采购 thái cấu, 定期 định kỳ, 炊烟 xuy yên. Rút gọn nghĩa quá dài: 哄, 扛, 拧, 拽, 盛, 公道, 空, 划; bỏ chú thích địa danh ở 富裕. Các mục này nằm trong tệp web, **chưa** đồng bộ ngược về `data/vi/`.

## Còn nên rà

Đã rà toàn bộ ngày 17/11/2026, kết quả và các mục chờ xác nhận ở [kiem-tra-hsk6-2012.md](kiem-tra-hsk6-2012.md).


- Hán Việt: 抢救 (thưởng/thương cứu), 涮 (xoát), 酗酒 (hú tửu), 濒临 (tân/tần lâm), 咋 (chạ), 包庇 (bao tý/tí).
- Câu ví dụ trùng nhau giữa 品德/高尚, 镇定/镇静, 威望/威信.
- Luyện tập dùng kho câu riêng (Sửa câu sai, Điền từ, Sắp xếp, Hỏi đáp, Chép chính tả, Vị trí từ) chưa có câu cấp 6; chọn cấp 6 sẽ báo «chưa có câu luyện». Mưa từ vựng và Luyện dịch chạy được.
