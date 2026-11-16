# Phân tích chức năng các web luyện thi HSK

Ngày khảo sát: 16/11/2026. Nguồn là các trang công khai của từng web: trang chủ, trang giá, trang chính sách, App Store.

Mình chỉ ghi nhận chức năng, không sao chép đề, bài học hay nội dung nào.

## Điểm cần biết trước

**HSK 3.0 (9 cấp) thi toàn cầu từ 13/12/2026.** Thông tin này đã kiểm chứng qua thông báo của CTI. Theo lịch thi, 7/11/2026 là đợt HSK 1–6 cuối cùng theo dạng cũ. Chi tiết và cấu trúc đề mới nằm ở mục 1 của [03-ke-hoach-trien-khai.md](03-ke-hoach-trien-khai.md).

## A. Bảng so sánh

Ký hiệu:
- **M**: miễn phí.
- **T**: trả phí.
- **M/T**: miễn phí có giới hạn, trả phí để mở hết.
- **C?**: có, nhưng không rõ miễn phí hay trả phí.
- **K**: không thấy trang nào nhắc tới.
- **?**: không rõ.

| Chức năng | HiHSK | SuperTest (HSK Online) | Prep (VN) | HelloChinese | Mandarin Bean | Hack Chinese | Skritter | **Nǐ hǎo (hiện tại)** |
|---|---|---|---|---|---|---|---|---|
| Flashcard / ôn ngắt quãng | M/T | C? | C? | ? | K | T | T | **M** (SM-2, 6 kiểu thẻ) |
| Đề thi thử theo cấp | T (60+ đề, 2.0 và 3.0) | C? | T (9 cấp) | K | M/T | K | K | **M** (HSK 1–5, sinh ngẫu nhiên) |
| Tự chấm và giải thích | T | C? | T | K | M/T | K | K | Chấm điểm, **chưa có giải thích** |
| Luyện nghe, audio | T (có chép chính tả) | C? | T | C? | M | ? | K | M (giọng trình duyệt) |
| Viết chữ, thứ tự nét | T (AI nhận dạng, in phiếu) | C? | ? | T | C? | K | T | **M** (Hanzi Writer) |
| Chấm phát âm | T (AI) | C? | T (AI) | C? | K | ? | K | M (nhận dạng giọng nói) |
| Bài ngữ pháp | ? | ? | C? | M/T | M/T | K | K | **M** (149 bài) |
| Bài đọc theo cấp | ? (90 bài) | K | K | T | K | K | K | M (25 bài) |
| Từ điển | C? | K | K | K | K | K | K | Có trang tra từ |
| Chuỗi ngày, xếp hạng | C? | C? | C? | ? | K | ? | ? | Chuỗi ngày, không có xếp hạng |
| AI chữa bài, lộ trình | K | T | T | K | K | K | K | K |
| Tài khoản, đồng bộ | T | C? | C? | C? | C? | C? | C? | **K** (chỉ lưu trên trình duyệt) |
| Offline | ? | ? | ? | Có | K | ? | ? | K |
| HSK 3.0 | T (cấp 1–9) | C? | T (9 cấp) | C? | ? | C? | C? | **K** |
| Tiếng Việt | Có | Có | Có | Có | Không | ? | ? | Có, kèm âm Hán Việt |

### Giá công khai

- **HiHSK:**
  - Trang nâng cấp: 289 nghìn/3 tháng, 539 nghìn/6 tháng, 739 nghìn/năm.
  - Trang chính sách giá ghi khác: 179 nghìn/tháng đến 715 nghìn/năm.
  - App Store có thêm gói trọn đời 999 nghìn.
  - Bản miễn phí có quảng cáo.
- **SuperTest:** PLUS ¥118/tháng hoặc ¥488/năm, MAX ¥188/tháng.
- **HelloChinese:** $11.99/tháng, $69.99/năm.
- **Skritter:** $14.99/tháng, $99.99/năm.
- **Hack Chinese:** khoảng $8–12/tháng (theo nguồn bên thứ ba).
- **Du Chinese:** $14.99 đến $119.99.

Giá của HiHSK, Hack Chinese và HelloChinese không khớp giữa các nguồn, nên kiểm tra lại trước khi trích dẫn.

## B. Nguồn đã xem

- https://hihsk.com/
- https://hihsk.com/upgrade
- https://hihsk.com/chinh-sach/05-chinh-sach-gia.html
- https://apps.apple.com/us/app/hihsk-tiếng-trung/id6741479141
- https://play.google.com/store/apps/details?id=com.hihsk1 (không đọc được)
- https://www.hskonline.com/
- https://apps.apple.com/us/app/-/id1335503360
- https://www.supertest.com/en/upgrade/index (lỗi 404)
- https://prepedu.com/vi/hsk-v3
- https://apps.apple.com/us/app/-/id1001507516 (HelloChinese)
- https://mandarinbean.com/hsk-chinese-test-online/
- https://mandarinbean.com/pricing/ (lỗi 404)
- https://www.hackchinese.com/pricing và https://skritter.com/pricing: trang dựng bằng JavaScript, không đọc được, nên lấy thông tin qua kết quả tìm kiếm.
- https://www.pleco.com/
- https://mock.tangce.cn/
- https://tienphong.vn/hsk-30-ap-dung-tu-1312-nguoi-moi-hoc-tieng-trung-nen-bat-dau-the-nao-post1891793.tpo
- https://studycli.org/hsk/the-new-hsk
- https://hsklord.com/blog/hsk-3-0-changes-2026

## C. Khoảng trống so với Nǐ hǎo

1. **HSK 3.0 (9 cấp):**
   - HiHSK và Prep đã có, đều thu phí.
   - Đề mới có thêm phần Dịch, phần Viết từ HSK 2 và phần Nói từ HSK 3.
2. **HSK 6 và HSK 7–9:** chưa có từ vựng tiếng Việt, bài học hay đề.
3. **Giải thích đáp án bằng tiếng Việt và phân tích lỗi theo kỹ năng:** đối thủ đều thu phí phần này.
4. **Audio người thật, chép chính tả.**
5. **Đồng bộ nhiều thiết bị:** web chưa có tài khoản.
6. **AI:** chấm phát âm, chữa bài viết, gợi ý lộ trình.
7. **Động lực học:** mục tiêu ngày, bảng xếp hạng.
8. **Phiếu tập viết in PDF:** HiHSK thu phí.
9. **Nội dung:** 214 bộ thủ (web đang có 40), từ vựng theo chủ đề, lượng từ, sổ tay cá nhân.
10. **Cài như app, dùng offline (PWA).**
11. **Bài test đầu vào và lộ trình đếm ngược đến ngày thi.**
12. **Luyện HSKK** (thi nói).

## D. Thứ tự ưu tiên đề xuất

Độ khó: S = nhỏ, M = vừa, L = lớn.

| # | Chức năng | Lý do | Độ khó |
|---|---|---|---|
| 1 | Từ vựng HSK 3.0 cấp 1–6 có nghĩa Việt, Hán Việt, câu ví dụ; nút chuyển 2.0/3.0 | Kỳ thi đổi sang 3.0 từ 13/12/2026. Âm Hán Việt là điểm khác biệt với người Việt. Dữ liệu đã có trong `data/hsk/` | M |
| 2 | Giải thích đáp án bằng tiếng Việt cho đề thi thử, báo cáo lỗi theo dạng câu | Đối thủ thu phí phần này, làm miễn phí là lợi thế rõ | M |
| 3 | Đề luyện tự soạn có sẵn (cố định, có giải thích), song song với đề sinh ngẫu nhiên | Đề sinh ngẫu nhiên không giải thích được vì sao sai | M–L |
| 4 | Đề theo cấu trúc HSK 3.0 (thêm Dịch, Viết sớm hơn) | Theo kịp kỳ thi mới | M–L |
| 5 | PWA: cài như app, dùng offline | Rẻ, hợp với web tĩnh, thay được app di động | S |
| 6 | Xuất/nhập tiến độ bằng file JSON hoặc QR | Đồng bộ thiết bị mà không cần server | S |
| 7 | Mục tiêu ngày, thống kê theo kỹ năng | Giữ người học quay lại mỗi ngày | S |
| 8 | Chép chính tả, luyện nghe theo câu | Dùng giọng trình duyệt trước | S–M |
| 9 | In phiếu tập viết | HiHSK thu phí, mình làm miễn phí bằng CSS in | S |
| 10 | Bài học HSK 6, HSK 3.0 cấp 7–9; 214 bộ thủ | Mở rộng nội dung | L |
| Để sau | Tài khoản, đồng bộ đám mây; AI chữa bài viết | Cần backend hoặc khóa API, chưa hợp với web tĩnh | L |
