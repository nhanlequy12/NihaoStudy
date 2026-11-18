# Kiểm tra nội dung – Luyện tập: Đoán nghĩa qua Hán Việt (18/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–6 và **HSK 3.0** cấp 1–6. Không soạn nghĩa mới: dùng trường `hv` (âm Hán Việt) và `vi` (nghĩa) của từ vựng đã rà soát. Mã: `js/practice-hanviet.js`; quy tắc, danh sách chặn và danh sách bổ sung: `js/data/practice-hanviet-data.js`.

Cách chơi: xem âm Hán Việt (và chữ Hán), chọn nghĩa tiếng Việt trong 4 phương án. Dễ: chữ Hán + Hán Việt + pinyin. Vừa: chữ Hán + Hán Việt. Khó: chỉ Hán Việt, chữ hiện sau khi trả lời. Phím `1`–`4` (hoặc `A`–`D`) chọn, `Space` nghe từ, `Enter` câu tiếp. Sau khi trả lời: tô đậm các âm Hán Việt có trong nghĩa, một câu giải thích vì sao đoán được, và **tách từng chữ**: chữ, âm Hán Việt (xanh nếu có trong nghĩa), pinyin + nghĩa riêng nếu có mục từ một chữ cùng âm đọc, và tối đa 2 từ khác cùng yếu tố («描 miêu – cũng gặp trong: 描写 miêu tả, 描述 miêu thuật»). Câu sai vào màn kết quả, bấm «Thêm vào sổ tay» để lưu.

## Quy tắc chọn từ

1. Từ toàn chữ Hán, có `hv` và `vi`; số âm Hán Việt bằng số chữ (để tách từng chữ được).
2. Nghĩa so sánh = phần trước dấu «;», **bỏ phần trong ngoặc** (thường là giải thích: 小时 «giờ, tiếng (khoảng thời gian)» không được tính nhờ chữ «thời» trong ngoặc), bỏ dấu câu, chữ thường.
3. Loại gợi ý:
   - **full** – cả chuỗi Hán Việt nằm nguyên trong nghĩa: 经济 kinh tế = «kinh tế», 时间 thời gian, 介绍 giới thiệu, 茶 trà.
   - **part** – có âm Hán Việt trùng một âm tiết của nghĩa: 图书馆 đồ thư quán = «thư viện», 颜色 nhan sắc = «màu sắc», 身体 thân thể = «cơ thể». Từ 4 chữ trở lên (thành ngữ) cần ≥ 2 âm trùng, vì 1 âm trùng trong 4 thường là ngẫu nhiên (狼吞虎咽 «ăn như hổ đói» chỉ trùng «hổ» → loại).
   - **allow** – không trùng âm nào nhưng âm Hán Việt là từ tiếng Việt quen thuộc cùng nghĩa, duyệt tay (38 từ, chủ yếu cấp 1–3): 朋友 bằng hữu = bạn bè, 飞机 phi cơ = máy bay, 汉语 Hán ngữ, 电影 điện ảnh, 现在 hiện tại, 再见 tái kiến, 礼物 lễ vật, 夫妻 phu thê…
4. Loại các từ trong **block** (28 từ): «bạn giả» – âm Hán Việt là một từ tiếng Việt có nghĩa khác, dễ làm người học đoán sai.

## Phương án nhiễu

- Cùng cấp, ưu tiên cùng từ loại (từ loại đầu tiên của trường `pos`); thiếu thì lấy từ loại khác cùng cấp.
- Nghĩa khác hẳn: không trùng âm tiết thực nào với nghĩa đúng (bỏ hư từ: là, của, có, không, người, sự, việc…), không trùng nghĩa với nhau.
- **Không chứa âm Hán Việt nào của từ hỏi**, kể cả trong ngoặc – để chỉ đáp án đúng được Hán Việt gợi ý (lỗi tìm được khi chạy thử: 只 chỉ có nhiễu «hơi, có chút (thường chỉ điều không như ý)»; đã sửa).
- Không chung chữ Hán với từ hỏi (tránh nghĩa gần nhau).

Kiểm tự động (`HanVietDrill.check()`, node trong vm có `window` giả, mỗi từ 3 lần xáo, 15.084 câu): **0** câu sai số phương án / trùng phương án / không đúng 1 đáp án; **0** nhiễu chứa âm Hán Việt của từ hỏi. 87 câu (0,6%) phải lấy ít nhất một nhiễu khác từ loại (thường là trợ từ, thán từ, lượng từ hiếm).

## Số từ theo cấp

| Chuẩn · cấp | Từ của cấp | Dùng được | full | part | allow |
|---|---|---|---|---|---|
| HSK cũ 1 | 155 | **27** | 8 | 9 | 10 |
| HSK cũ 2 | 154 | **41** | 19 | 13 | 9 |
| HSK cũ 3 | 304 | **124** | 80 | 36 | 8 |
| HSK cũ 4 | 615 | **290** | 185 | 104 | 1 |
| HSK cũ 5 | 1.420 | **735** | 464 | 270 | 1 |
| HSK cũ 6 | 2.421 | **1.250** | 652 | 598 | 0 |
| HSK 3.0 cấp 1 | 300 | **57** | 25 | 19 | 13 |
| HSK 3.0 cấp 2 | 197 | **44** | 22 | 17 | 5 |
| HSK 3.0 cấp 3 | 491 | **206** | 106 | 82 | 18 |
| HSK 3.0 cấp 4 | 990 | **458** | 247 | 211 | 0 |
| HSK 3.0 cấp 5 | 1.579 | **841** | 500 | 341 | 0 |
| HSK 3.0 cấp 6 | 1.777 | **955** | 485 | 470 | 0 |

Tổng 3.427 từ khác nhau. Cấp 1–2 ít từ vì từ cơ bản phần lớn là từ thuần Việt hoá (我们, 喜欢, 漂亮…); đúng với mục tiêu bài – Hán Việt hữu ích nhất từ cấp 3 trở lên.

Tách từng chữ: chỉ hiện nghĩa riêng khi có mục từ một chữ **cùng âm Hán Việt và cùng âm đọc** (行 hành «đi» không dùng cho 银行 ngân hàng; 待 dāi «nán lại» không dùng cho 待遇 dàiyù); nghĩa rút gọn còn tối đa 2 ý, bỏ ghi chú. 2.202 / 3.198 từ nhiều chữ có ít nhất một chữ không có mục từ riêng phù hợp – khi đó chỉ hiện âm Hán Việt và các từ cùng yếu tố.

## Rà soát tay

Đã đọc: toàn bộ từ loại **part** ở cấp 1–3 của hai chuẩn (9 + 13 + 37 + 11 + 7 + 44 = 121 từ), 30 từ ngẫu nhiên loại part ở mỗi cấp 4–6 của hai chuẩn (180 từ), ví dụ loại full ở cấp 1–2, toàn bộ từ nhiều chữ **không** có gợi ý ở cấp 1–3 (để chọn danh sách allow, 447 từ), và đối chiếu 184 từ nghi «bạn giả» hoặc Hán Việt quen thuộc (博士, 明白, 东西, 新闻, 爱人…) với kho từ. Loại full là chính chuỗi Hán Việt nằm trong nghĩa web ghi nên không có bạn giả theo định nghĩa (手段 thủ đoạn, 对象 đối tượng: web đã ghi cả nghĩa đó).

Ví dụ part được giữ (gợi ý tốt): 饭馆 phạn quán = quán ăn · 医院 y viện = bệnh viện · 旅游 lữ du = du lịch · 菜单 thái đơn = thực đơn · 复习 phục tập = ôn tập · 后悔 hậu hối = hối hận · 细菌 tế khuẩn = vi khuẩn · 实验室 thực nghiệm thất = phòng thí nghiệm · 志愿者 chí nguyện giả = tình nguyện viên.

## Bị chặn (block) – 28 từ

| Từ | Âm Hán Việt | Nghĩa thật | Vì sao chặn |
|---|---|---|---|
| 博士 | bác sĩ | tiến sĩ | «bác sĩ» tiếng Việt là thầy thuốc |
| 监督 | giám đốc | giám sát | «giám đốc» là người đứng đầu công ty |
| 包子 | bao tử | bánh bao | «bao tử» là dạ dày |
| 恐怖 | khủng bố | kinh dị, khủng khiếp | «khủng bố» là terrorism |
| 只是 | chỉ thị | chỉ là | «chỉ thị» là mệnh lệnh |
| 相当 | tương đương | khá, tương đối | «tương đương» là ngang bằng |
| 创建 | sáng kiến | sáng lập | «sáng kiến» là ý tưởng mới |
| 方便 / 方便面 | phương tiện | tiện lợi / mì ăn liền | «phương tiện» là xe cộ, công cụ |
| 顺便 | thuận tiện | tiện thể | «thuận tiện» là dễ dàng |
| 成熟 | thành thục | chín chắn, chín | «thành thục» là thạo việc |
| 改良 | cải lương | cải tiến | «cải lương» là loại kịch hát |
| 实行 | thực hành | thi hành | «thực hành» là luyện tập thực tế |
| 灾害 | tai hại | thiên tai | «tai hại» là có hại, tệ |
| 收拾 | thu thập | dọn dẹp | «thu thập» là gom góp |
| 实在 | thực tại | thực sự | «thực tại» là hiện thực |
| 生产 | sinh sản | sản xuất | «sinh sản» là đẻ |
| 程度 | trình độ | mức độ | «trình độ» là học vấn, tay nghề |
| 主意 | chủ ý | ý tưởng, cách làm | «chủ ý» là ý định |
| 环境, 地方, 明白, 照顾, 大家, 大人, 生气, 认识, 名字 | hoàn cảnh, địa phương, minh bạch, chiếu cố, đại gia, đại nhân, sinh khí, nhận thức, danh tự | môi trường, nơi chỗ, hiểu, chăm sóc, mọi người, người lớn, tức giận, quen biết, tên | bạn giả kinh điển; hiện không lọt qua quy tắc tự động nhưng chặn sẵn phòng khi nghĩa web đổi |

## Ví dụ bị loại tự động

| Từ | Âm Hán Việt = nghĩa | Lý do |
|---|---|---|
| 东西 | đông tây = đồ, đồ vật | không trùng âm nào |
| 老师 | lão sư = giáo viên, thầy/cô | không trùng âm nào («lão sư» không quen với người Việt) |
| 电脑 | điện não = máy tính | không trùng âm nào |
| 小时 | tiểu thời = giờ, tiếng (khoảng thời gian) | «thời» chỉ có trong ngoặc |
| 派出所 | phái xuất sở = đồn công an (cấp cơ sở) | «sở» chỉ có trong ngoặc |
| 狼吞虎咽 | lang thôn hổ yến = ăn ngấu nghiến, ăn như hổ đói | 1/4 âm trùng |
| 哪儿, 一点儿 | na nhi, nhất điểm nhi | không trùng âm nào |

## Chạy thử trên web

`#/practice/hanviet/hsk2` và `/hsk3`: màn chọn, một lượt 20 câu, chọn bằng phím `2`, xem phần tách chữ, `Enter` sang câu. Không lỗi console. Dữ liệu thử đã xoá sau khi chạy.

## Tổng kết

- Đã kiểm tra: 12 bộ từ, 3.427 từ khác nhau, 15.084 lần xáo phương án; rà soát tay ≈ 930 từ (121 part cấp 1–3, 180 mẫu part cấp 4–6, 447 từ không gợi ý cấp 1–3, 184 từ nghi bạn giả).
- Đã sửa trong lúc làm: nhiễu chứa âm Hán Việt trong ngoặc; nghĩa chữ đơn sai âm đọc (行 / 银行, 待 / 待遇); nghĩa chữ đơn chỉ là ghi chú (子).
- Chưa chắc chắn:
  1. Loại part ở cấp 4–6 mới rà mẫu 30 từ mỗi cấp (180 / 2.000+); có thể còn bạn giả nhẹ kiểu 保持 bảo trì = duy trì, 部门 bộ môn = phòng ban, 基础 cơ sở = nền tảng, 亲切 thân thiết = thân mật (đã giữ vì nghĩa gần).
  2. Trùng âm ngẫu nhiên (âm Hán Việt trùng một từ tiếng Việt khác gốc chữ) không phát hiện tự động được; trong mẫu đã đọc chưa thấy ca nào đáng chặn.
  3. Danh sách allow là đánh giá chủ quan «từ Hán Việt quen thuộc»: 医生 y sinh, 非常 phi thường, 可能 khả năng, 可以 khả dĩ là bốn mục ít chắc nhất.
