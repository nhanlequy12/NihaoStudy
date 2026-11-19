# Nǐ hǎo: hệ thống thiết kế

Web tự học tiếng Trung cho người Việt. Đây là giao diện để **làm việc** (học, ôn, luyện mỗi ngày), nên ưu tiên dễ đọc, nhất quán, phản hồi nhanh; cá tính nằm ở chi tiết nhỏ, không ở hiệu ứng.

Mọi giá trị dưới đây là biến CSS trong `css/style.css` (`:root` và `:root[data-theme="dark"]`). Khi thêm thành phần mới, dùng biến, không gõ số cứng.

## Màu

| Biến | Dùng cho |
|---|---|
| `--bg`, `--surface`, `--surface-2`, `--surface-3` | Nền trang, thẻ, nền phụ (ô, thanh tab), nền nhấn |
| `--text`, `--text-2`, `--muted` | Chữ chính, chữ phụ, chú thích |
| `--border`, `--border-strong` | Viền thẻ, viền nút |
| `--border-input` | Viền ô nhập (ô tìm, ô chọn, ô số): đậm hơn để đạt 3:1 |
| `--primary` (đỏ son) | Chỉ cho **một** hành động chính mỗi màn hình, huy hiệu đếm thẻ |
| `--green` / `--danger` / `--gold` / `--blue` | Đúng, sai, đang học/nhắc nhở, thông tin |
| `--tone1`…`--tone5` | Màu thanh điệu của pinyin (1 xanh dương, 2 xanh lá, 3 tím, 4 đỏ, nhẹ xám đậm) |
| `--hero-from`, `--hero-to`, `--hero-ink`, `--hero-sub` | Khối giới thiệu trang chủ; bản tối dịu hơn, không đỏ chói |

Giao diện sáng/tối: người dùng chọn trong thanh bên hoặc Cài đặt; lần đầu theo hệ điều hành. Thanh trạng thái điện thoại (`theme-color`) đổi theo.

## Chữ

- Giao diện: **Be Vietnam Pro**. Chữ Hán: **Noto Sans SC** (`.zh`), chữ Khải cho trang trí (`.zh-serif`).
- Cỡ chữ Hán nhân với `--zh-scale` (Cài đặt → Cỡ chữ Hán: 1 / 1,2 / 1,4).
- Tiêu đề `text-wrap: balance`; đoạn mô tả tối đa ~68 ký tự một dòng.

### Thứ bậc một từ

Luôn theo thứ tự, mỗi lớp khác nhau rõ:

1. **Chữ Hán**: lớn nhất, Noto Sans SC, màu chữ chính.
2. **Pinyin**: đậm, tô màu theo thanh điệu (`pyHtml()`).
3. **Hán Việt**: phần tử `.hv`, có nhãn nhỏ **HV** đứng trước, không nghiêng (để không lẫn với pinyin thanh nhẹ).
4. **Nghĩa**: màu chữ chính; từ loại là chú thích `--muted`.

Câu ví dụ: chữ Hán màu chữ chính, pinyin tô màu thanh, nghĩa ở dòng dưới.

## Khoảng cách, bo góc, đổ bóng

- Khoảng cách theo thang 4px: `--space-1` (4) … `--space-7` (48).
- Bo góc 3 mức: `--radius-sm` 12px (nút, ô nhập, ô nhỏ), `--radius` 16px (thẻ), `--radius-lg` 22px (khối lớn, bảng trượt, hộp thoại). Viên thuốc (`999px`) cho nhãn và chip.
- Bóng: `--shadow-sm` (thẻ), `--shadow` (nổi khi trỏ), `--shadow-lg` (bảng nổi, hộp thoại).

## Icon

Bộ icon nét mảnh 24×24 vẽ riêng trong `js/ui.js`, nét 1,8, gọi bằng `ic("tên")`. Không dùng emoji thay icon trong thành phần mới.

## Điều hướng

- **Máy tính**: thanh bên 3 nhóm. *Học*: Trang chủ, Bài học, Từ vựng, Hội thoại, Đọc hiểu, Bộ thủ, Pinyin, Lộ trình. *Luyện*: Luyện tập (menu bung ra), Ôn tập, Luyện viết, Luyện nói, Thi thử. *Công cụ*: Sổ tay, Từ điển, Cài đặt, Nguồn dữ liệu.
- **Điện thoại**: thanh tab 5 mục (Trang chủ, Học, Ôn tập, Luyện tập, Thêm). Các trang nhóm Học có **dải chip** ở đầu trang: Bài học · Từ vựng · Hội thoại · Đọc hiểu · Bộ thủ · Pinyin.
- **Luyện tập**: 8 dạng bài, mỗi dòng có lựa chọn HSK 2.0 / HSK 3.0; chuẩn dùng gần nhất được nhớ lại.

## Chuyển động

Nguyên tắc: ít mà có lý do. Thao tác lặp hàng trăm lần mỗi ngày (chuyển trang, đổi tab, phím tắt) **không** có hiệu ứng.

| Biến | Giá trị | Dùng cho |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Phản hồi, hiện ra, bật về |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Bảng «Thêm» trượt lên |
| `--dur-press` | 120ms | Co 3% khi nhấn (`:active`) |
| `--dur-fast` | 160ms | Đổi màu, menu bung |
| `--dur-base` | 220ms | Bật về sau khi vuốt, mũi tên mở/đóng |

- Chỉ animate `transform` và `opacity`; không dùng `transition: all`.
- Hiệu ứng hover luôn nằm trong `@media (hover: hover) and (pointer: fine)` để không bị «dính» trên điện thoại.
- Có `prefers-reduced-motion`: bỏ chuyển động vị trí và co giãn (rung khi sai, co khi nhấn, bảng trượt chỉ mờ dần), giữ đổi màu và mờ dần.
- Sai: rung ±3px trong 180ms; đúng: chỉ đổi màu, không nảy. Khung chờ tải: mờ nhịp 1.2s, trễ 300ms.

## Cử chỉ

- **Ôn tập**: thẻ đã lật vuốt phải = Tốt, vuốt trái = Quên. Kéo đủ 35% bề rộng hoặc vuốt nhanh thì chấm; chưa đủ thì bật về. Trả lời sai thì không vuốt phải được (có lực cản).
- **Sắp xếp câu**: kéo cụm bằng Pointer Events, bóng kéo đi bằng `transform`, có vạch báo chỗ chèn; thả xong cụm trượt về chỗ mới.
- **Bảng «Thêm»**: kéo tay nắm xuống để đóng; nền mờ nhạt dần theo quãng kéo.

## Điện thoại

- `viewport-fit=cover` + `env(safe-area-inset-*)` cho tai thỏ, vạch Home, cạnh cong khi xoay ngang.
- `100dvh` thay `100vh`; ô nhập tối thiểu 16px trên màn cảm ứng (iPhone không tự phóng to).
- `touch-action: manipulation` cho mọi thứ bấm được; nhãn nút không bị bôi chọn khi giữ tay.

## Trò chơi Mưa từ vựng

Thế giới riêng (retro, nền tím than, font Press Start 2P chỉ tải khi mở trò chơi). Hiệu năng: nền tĩnh và chữ trên bong bóng vẽ sẵn một lần; khi tạm dừng không vẽ lại; sân chơi trên điện thoại tính theo vùng nhìn thấy thật để bàn phím không che ô gõ.
