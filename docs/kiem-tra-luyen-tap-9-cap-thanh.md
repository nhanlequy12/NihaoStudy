# Kiểm tra nội dung – Luyện tập: Cặp thanh điệu (18/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–6 và **HSK 3.0** cấp 1–6. Không soạn nội dung mới: dùng từ hai chữ trong từ vựng của cấp (`Practice.wordsOf`), máy đọc bằng giọng tiếng Trung của trình duyệt (`TTS.speak`). Mã: `js/practice-tones.js`.

Cách chơi: nghe một từ hai âm tiết, chọn cặp thanh trong 4 phương án (ví dụ «2 + 3», kèm mẫu «má mǎ» tô màu theo thanh). Dễ: có chữ Hán, nghĩa và pinyin không dấu. Vừa: chữ Hán và nghĩa. Khó: chỉ nghe, chữ hiện sau khi trả lời. Phím `1`–`4` (hoặc `A`–`D`) chọn, `Space` nghe lại, `Enter` câu tiếp. Câu sai vào màn kết quả, bấm «Thêm vào sổ tay» để lưu như các bài khác.

Hai chế độ: **Trộn đều các cặp** (bốc cặp thanh ngẫu nhiên đều nhau rồi bốc từ, để 4 + 4 không chiếm phần lớn) và **Luyện cặp yếu** (bốc cặp theo trọng số `(1 − tỉ lệ đúng)² + 0,05`, tỉ lệ đúng làm trơn `(đúng + 1)/(lần + 2)`, cặp chưa luyện tính 50%). **Ma trận 20 cặp** (thanh 1–4 của âm đầu × thanh 1–4 + nhẹ của âm sau) hiện dưới màn chọn và màn kết quả, tô xanh ≥ 85%, vàng 60–84%, đỏ < 60%; thống kê lưu ở `Store.state.practice.tonePairs` (dùng chung mọi cấp vì là kỹ năng nghe), màn kết quả ghi thêm số từ của cấp cho mỗi cặp.

## Quy ước thanh: ghi thanh gốc, chú thích 3 + 3

- Phương án ghi **thanh gốc theo từ điển** (như pinyin trên web), không ghi thanh biến điệu.
- Cặp **3 + 3** khi nói thành 2 + 3, nên phương án «3 + 3» luôn kèm dòng «đọc như 2 + 3», và phản hồi giải thích biến điệu. Câu có đáp án 3 + 3 **không bao giờ** có phương án 2 + 3 và ngược lại (nghe không phân biệt được); hai cặp này cũng không cùng làm phương án nhiễu.
- **一 / 不** đổi thanh theo chữ sau → bỏ mọi từ chứa 一 hoặc 不.
- **Thanh nhẹ** chỉ xuất hiện ở âm sau, dưới dạng «x + nhẹ», và chỉ khi mọi nguồn đều ghi nhẹ (xem lọc bên dưới). Từ có âm đầu thanh nhẹ bị bỏ (không có từ nào trong dữ liệu).

## Lọc từ (an toàn cho máy đọc)

Thứ tự kiểm tra trong `reasonOf(w)`:

| Mã | Điều kiện loại | Lý do |
|---|---|---|
| `len` | không đúng 2 chữ Hán | bài chỉ luyện từ hai âm tiết |
| `yibu` | có 一 hoặc 不 | biến điệu theo chữ sau |
| `er` | có 儿 | nhi hoá: 2 chữ nhưng 1 âm tiết |
| `parse` | pinyin không tách được đúng 2 âm tiết | an toàn |
| `poly` | có chữ đa âm (danh sách `POLY`, 227 chữ) | máy có thể chọn sai âm đọc |
| `n1` | âm đầu thanh nhẹ | không thuộc 20 cặp |
| `disp` | web và CC-CEDICT / danh sách HSK ghi thanh khác nhau (`SKIP_D`, 60 từ) | máy có thể đọc khác pinyin trên web |
| `b3` | 3 + nhẹ mà chữ sau vốn thanh 3 (`SKIP_B3`, 15 từ) | có từ đọc thành 2 + nhẹ (小姐 xiáojie, 耳朵), có từ không (姐姐) |

**Danh sách chữ đa âm `POLY`** sinh một lần bằng node từ dữ liệu của web (VOCAB + HSK 3.0) và `data/hsk/all-words.json` (12.309 từ, có `py_alt` lấy từ CC-CEDICT): tách pinyin của mọi từ theo từng chữ, gom các âm đọc của mỗi chữ; chữ là đa âm nếu có **hơn một âm tiết khác nhau** (了 le / liǎo, 行 xíng / háng) **hoặc hơn một thanh đầy đủ** (好 hǎo / hào, 中 zhōng / zhòng). Khác nhau chỉ ở thanh nhẹ của cùng âm tiết (东 dōng / 东西 dōngxi) không tính là đa âm, vì đã có lọc `disp`. 14 âm đọc cổ / tên riêng chỉ có trong CC-CEDICT không tính: 车 jū, 雨 yù, 女 rǔ, 远 yuàn, 比 bī, 见 xiàn, 王 wàng, 弟 tì, 汤 shāng, 查 zhā, 可 kè, 并 bīng, 乘 shèng, 脚 jué. Cách làm này thận trọng: loại cả 中国, 好看, 觉得 dù máy đọc đúng, đổi lại không có từ nào phụ thuộc vào khả năng đoán âm của máy.

**`SKIP_D`** sinh cùng lúc: so pinyin trên web với `py` và `py_num` của cùng từ trong `all-words.json`; khác thanh hoặc khác âm tiết ở bất kỳ âm nào thì bỏ. Ví dụ: 学生 xuésheng / xue2 sheng1, 东西 dōngxi / dōngxī (hai nghĩa), 精神 jīngshén / jing1 shen5, 告诉 gàosu / gao4 su4, 回来 huílái / hui2 lai5, 那里 (cũng là đa âm).

Danh sách `POLY`, `SKIP_D`, `SKIP_B3` nằm ngay trong `js/practice-tones.js`. Khi thêm từ mới, chữ đa âm chưa có trong dữ liệu (ví dụ 什 shén / shí – chỉ có 什么 trong từ vựng) sẽ không bị bắt; xem mục «Chưa chắc chắn».

## Phân tích pinyin

`ToneDrill.parse(py)` tách pinyin có dấu thành âm tiết + thanh, dùng bảng âm tiết chuẩn (≈ 410 âm tiết, cộng các âm tiết của `SYLLABLES`): mỗi âm tiết một dấu thanh; âm tiết bắt đầu bằng a / o / e ở giữa cụm phải có `'` hoặc dấu cách đứng trước (fāng'àn, Xī'ān); âm cuối có -r là nhi hoá; nếu tách được nhiều cách thì báo lỗi.

| Kiểm tra | Số lượng | Kết quả |
|---|---|---|
| Pinyin VOCAB (HSK cũ, cấp 1–6), số âm tiết = số chữ | 5.069 từ | **0 lỗi** |
| Pinyin từ chỉ có ở HSK 3.0 | 2.107 từ | 1 lỗi: 熟 «shú/shóu» (ghi hai cách đọc, từ một chữ nên không ảnh hưởng bài này) |
| `data/hsk/all-words.json` (chỉ dùng khi sinh danh sách) | 12.309 từ | 9 lỗi nguồn: 谁 «shéi/shuí», 熟 «shú/shóu», 7 từ nhi hoá ghi kèm số «r5» (胡同儿 hútòngr5…) |
| Ca thử: běifāng 3-1, Xī'ān 1-1, shuǐguǒ 3-3, xiānsheng 1-nhẹ, nǎr 3+r, fāng'àn 1-4, dàn'gāo 4-1, Tiān'ānmén 1-1-2, nǚ'ér 3-2, lǜsè 4-4 | 10 | đạt |

## Phương án nhiễu

Thanh dễ lẫn (thứ tự ưu tiên): âm đầu 1 → 4, 2, 3; 2 → 3, 1, 4; 3 → 2, 4, 1; 4 → 1, 3, 2. Âm sau thêm thanh nhẹ: 1 → 4, nhẹ, 2…; nhẹ → 1, 4, 2, 3. Nhóm «gần» gồm: đổi âm đầu sang thanh dễ lẫn nhất, đổi âm sau sang thanh dễ lẫn nhất, đổi cả hai, rồi thanh dễ lẫn thứ hai của từng âm. Mỗi câu lấy 2 phương án ngẫu nhiên trong nhóm gần + 1 phương án ngẫu nhiên trong phần còn lại (để không đoán được theo khuôn «đáp án là ô ở giữa»), bỏ cặp xung đột 3 + 3 / 2 + 3.

Kiểm tự động (`ToneDrill.check()`, chạy node trong vm có `window` giả, mỗi từ 5 lần xáo): **0** câu sai số phương án / trùng phương án / không đúng 1 đáp án; **0** câu có cả 3 + 3 và 2 + 3.

## Số từ dùng được theo cấp

Cột cặp: số từ của từng cặp theo thứ tự 1+1 1+2 1+3 1+4 1+nhẹ | 2+1 … | 3+1 … | 4+1 … 4+nhẹ.

| Chuẩn · cấp | Từ 2 chữ | Dùng được | Loại: đa âm / 一不 / 儿 / nguồn khác / 3+nhẹ gốc 3 | Số cặp có từ | Từ theo cặp |
|---|---|---|---|---|---|
| HSK cũ 1 | 63 | **42** | 13 / 0 / 3 / 4 / 1 | 15 | 4 0 0 4 4 · 2 1 1 2 4 · 2 0 1 1 3 · 0 0 7 4 2 |
| HSK cũ 2 | 73 | **55** | 12 / 3 / 0 / 2 / 1 | 20 | 4 2 3 6 2 · 1 1 2 1 1 · 2 5 3 3 4 · 2 2 2 3 6 |
| HSK cũ 3 | 202 | **133** | 57 / 6 / 0 / 4 / 2 | 19 | 7 11 3 7 3 · 7 5 4 13 6 · 4 5 3 14 0 · 9 6 7 14 5 |
| HSK cũ 4 | 466 | **325** | 124 / 5 / 1 / 9 / 2 | 20 | 11 17 16 31 4 · 13 21 5 27 6 · 12 19 15 32 2 · 6 25 12 38 13 |
| HSK cũ 5 | 1.168 | **886** | 253 / 16 / 0 / 9 / 4 | 20 | 41 57 43 76 12 · 29 49 34 107 12 · 26 33 26 71 9 · 51 49 35 115 11 |
| HSK cũ 6 | 2.104 | **1.590** | 482 / 13 / 2 / 15 / 2 | 20 | 72 106 63 199 13 · 51 92 52 188 6 · 33 68 45 147 3 · 55 80 71 237 9 |
| HSK 3.0 cấp 1 | 144 | **94** | 36 / 4 / 5 / 2 / 3 | 19 | 6 3 0 10 10 · 4 2 2 1 5 · 4 3 2 6 6 · 5 3 7 9 6 |
| HSK 3.0 cấp 2 | 105 | **76** | 17 / 2 / 0 / 8 / 2 | 18 | 2 7 4 5 0 · 1 3 3 2 1 · 3 4 2 6 2 · 0 7 4 12 8 |
| HSK 3.0 cấp 3 | 339 | **226** | 94 / 12 / 0 / 6 / 1 | 19 | 23 16 7 10 4 · 12 9 5 20 6 · 9 10 4 28 0 · 15 14 9 21 4 |
| HSK 3.0 cấp 4 | 753 | **543** | 186 / 13 / 1 / 10 / 0 | 20 | 20 21 27 57 9 · 21 30 15 42 8 · 27 19 28 48 2 · 28 42 24 57 18 |
| HSK 3.0 cấp 5 | 1.283 | **945** | 308 / 17 / 1 / 10 / 2 | 20 | 37 66 40 98 3 · 33 50 42 99 7 · 25 41 31 86 8 · 45 46 45 135 8 |
| HSK 3.0 cấp 6 | 1.474 | **1.072** | 354 / 27 / 3 / 13 / 5 | 20 | 58 69 48 103 5 · 34 72 44 112 8 · 40 43 35 87 6 · 51 67 44 140 6 |

Cấp thấp thiếu vài cặp (HSK cũ 1 không có 1 + 2, 1 + 3, 3 + 2, 4 + 1, 4 + 2), nên ma trận ghi «0 từ» ở các ô đó; chế độ «Luyện cặp yếu» chỉ bốc trong các cặp cấp đó có.

## Ví dụ mỗi cặp (HSK cấp 1–3)

| Cặp | Ví dụ | Cặp | Ví dụ |
|---|---|---|---|
| 1 + 1 | 今天 jīntiān, 飞机 fēijī | 3 + 1 | 北京 Běijīng, 老师 lǎoshī |
| 1 + 2 | 非常 fēicháng, 欢迎 huānyíng | 3 + 2 | 小时 xiǎoshí, 旅游 lǚyóu |
| 1 + 3 | 开始 kāishǐ, 身体 shēntǐ | 3 + 3 (đọc 2 + 3) | 水果 shuǐguǒ, 可以 kěyǐ, 手表 shǒubiǎo |
| 1 + 4 | 说话 shuōhuà, 天气 tiānqì | 3 + 4 | 米饭 mǐfàn, 考试 kǎoshì |
| 1 + nhẹ | 妈妈 māma, 杯子 bēizi | 3 + nhẹ | 我们 wǒmen, 喜欢 xǐhuan |
| 2 + 1 | 明天 míngtiān, 旁边 pángbiān | 4 + 1 | 上班 shàngbān, 唱歌 chànggē |
| 2 + 2 | 学习 xuéxí, 厨房 chúfáng | 4 + 2 | 去年 qùnián, 问题 wèntí |
| 2 + 3 | 苹果 píngguǒ, 牛奶 niúnǎi | 4 + 3 | 汉语 Hànyǔ, 下午 xiàwǔ |
| 2 + 4 | 学校 xuéxiào, 前面 qiánmiàn | 4 + 4 | 再见 zàijiàn, 电视 diànshì |
| 2 + nhẹ | 朋友 péngyou, 名字 míngzi | 4 + nhẹ | 谢谢 xièxie, 爸爸 bàba |

## Ví dụ bị loại

| Từ | Mã | Ghi chú |
|---|---|---|
| 中国, 好看, 觉得, 还是, 长城, 为了, 银行 | `poly` | 中 zhōng/zhòng, 好 hǎo/hào, 觉 jué/jiào, 还 hái/huán, 长 cháng/zhǎng, 为/了, 行 xíng/háng |
| 一起, 不错, 第一 | `yibu` | biến điệu 一 / 不 |
| 哪儿, 一点儿, 女孩儿 | `er` / `yibu` | nhi hoá |
| 学生, 东西, 告诉, 太阳, 回来, 精神 | `disp` | nguồn ghi thanh nhẹ / đầy đủ khác nhau |
| 小姐, 姐姐, 奶奶, 耳朵, 椅子, 饺子 | `b3` | 3 + nhẹ, chữ sau vốn thanh 3 |

## Chạy thử trên web

Mở `#/practice/tones/hsk2` và `#/practice/hanviet/hsk3` trên máy chủ thử (khổ hẹp ≈ 800 px): màn chọn có thêm hàng «Chế độ» và ma trận; một lượt 20 câu, phím `1` chọn, `Space` đọc lại mà không sang câu (đã chặn hành vi bấm nút đang focus), `Enter` sang câu; màn kết quả có danh sách câu sai, nút «Thêm vào sổ tay» và ma trận cập nhật. Không lỗi console. Dữ liệu thử (thống kê cặp, lịch sử, điểm cao) đã xoá sau khi chạy.

## Tổng kết

- Đã kiểm tra: 12 bộ từ (2 chuẩn × 6 cấp, tổng 5.987 lượt từ), 5.069 + 2.107 pinyin, ≈ 30.000 lần xáo phương án (5 lần mỗi từ).
- Đã sửa trong lúc làm: phương án nhiễu có thể chứa cả 3 + 3 lẫn 2 + 3 (dù không phải đáp án) → cấm cặp này đi cùng nhau ở mọi vị trí.
- Chưa chắc chắn:
  1. Chữ đa âm không có trong dữ liệu (什 shén / shí, 么…) không bị bắt; hiện chỉ gặp ở 什么, 怎么 – máy đọc chuẩn.
  2. Từ «x + nhẹ» mà mọi nguồn đều ghi nhẹ (先生 xiānsheng, 朋友 péngyou…) vẫn có thể bị một số giọng đọc trình duyệt đọc thanh đầy đủ; chưa nghe thử từng từ bằng giọng Edge / Chrome thực tế (140 từ «x + nhẹ» ở HSK cũ, 140 ở HSK 3.0, phần lớn trùng nhau – nên nghe thử).
  3. 上 shàng (thượng thanh shǎng chỉ trong 上声) không tính là đa âm.
