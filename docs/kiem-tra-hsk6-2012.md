# Kiểm tra nội dung – gói HSK 6 và Bổ sung 2012 (17/11/2026)

Phạm vi: các commit `dcdcb70`, `8da3096`, `41c4d0f`: bài 150–270 (HSK 6), bài 301–309 (Bổ sung 2012), 12 bài đọc, thi thử HSK 6.

Thứ tự nguồn: danh sách HSK chính thức (bản 2012, đọc từ [hskhsk.com](https://github.com/glxxyz/hskhsk.com), MIT; đối chiếu bảng so sánh 2010–2012 của Mike's Chinese Adventures) > đề cương HSK 2025 > CC-CEDICT > CVDICT > Unihan.

## Phạm vi đã rà

| Mục | Số lượng | Cách rà | Kết quả |
|---|---|---|---|
| Cấp của từ so với danh sách 2012 | 2.421 từ cấp 6 + 154 từ bổ sung | 2.307 từ khớp danh sách 2010 bằng máy; 114 từ cấp 6 mới và 154 từ bổ sung đối chiếu danh sách 2012 | khớp 100%; 124 từ cấp 6 bản 2010 không có trên web đều bị bỏ trong bản 2012 |
| Từ trùng nguyên văn bản đã rà trong `data/hsk` | 2.269 từ | so máy pinyin, Hán Việt, nghĩa, câu ví dụ | giống hệt |
| Từ mới soạn hoặc khác bản đã rà | 306 từ | máy + đọc từng mục, so CC-CEDICT/CVDICT | xem bảng dưới |
| Câu bài học (ngữ pháp, hội thoại, câu xếp thẻ) | 2.302 câu, 130 bài | máy (âm tiết, thanh từng chữ, biến điệu, phồn thể) + đọc từng câu, kèm giải thích ngữ pháp, mục tiêu, tips | xem bảng dưới |
| Bài đọc | 12 bài, 36 câu hỏi | máy + đọc từng câu, kiểm đáp án | 0 lỗi chắc chắn, 3 câu cần xác nhận |
| Thi thử HSK 6 | | đọc mã sinh đề | không có câu tiếng Trung mới: lấy từ kho Sửa câu sai, câu ví dụ, bài đọc đã rà; đề bài 选出有语病的一项 / 缩写… đúng |
| Mưa từ vựng «Nghĩa Việt» trên 2.575 từ mới | | chạy hàm hiển thị nghĩa | không bóng nào trống nghĩa hay lộ chữ Hán; 42 nghĩa rút gọn đều đủ ý |
| 20 từ cũ ngẫu nhiên | 一边 少 主动 中文 丰富 健身房 碰见 正确 建筑 单纯 一起 儿子 土地 太太 因此 启发 举行 主持 宣布 遗憾 | máy | pinyin, cấp (danh sách 2010), câu ví dụ đều đúng; 4 cờ Hán Việt của Unihan (chủ/chúa, tử/tí, hành/hàng) là âm Nôm, không phải lỗi |

Cờ máy đã xem và loại: 193 cờ pinyin câu chưa chắc đều là ranh giới từ (如 地支 trong 默默地支持, 这么着 trong 这么着急) hoặc 儿 hoá; 嗯 ǹg, 巴不得 bābudé, 动静 dòngjing theo đề cương 2025; 不 trước 一 giữ bù (不一样 bù yíyàng).

## Đã sửa

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 从不抱怨 (bài 150, ngữ pháp 1) | cóng bù bàoyuàn | cóng bú bàoyuàn | quy tắc biến điệu 不 (dự án đã ghi cóng bú ở 7 chỗ khác) |
| 岂不太危险 (bài 208, ngữ pháp 3) | qǐbù tài | qǐbú tài | quy tắc biến điệu 不 |
| 碰不得 (bài 176, ngữ pháp 3), 打不得 (bài 176, hội thoại 4) | bu dé | bu de | CC-CEDICT: 使不得, 要不得 [bu5 de5]; thống nhất với bài 155 |
| 马虎不得 (bài 187, 223, 235) | mǎhu bùdé / bù dé / bu dé | mǎhu bu de | như trên |
| 22 pinyin đầu mục: 治安, 侃侃而谈, 配偶, 婴儿, 平安, 档案, 障碍… | dấu nháy cong ’ | dấu ' như toàn bộ dữ liệu cũ | quy ước dự án |
| 拽 (bài 156), nghĩa | «(khẩu ngữ) vênh váo» đứng sau «(zhuāi) ném», dễ hiểu là cùng âm | «(zhuǎi, khẩu ngữ) vênh váo» | CC-CEDICT zhuai3: cocky |
| 折磨 (bài 236), từ loại | nghĩa có «nỗi đau khổ» nhưng từ loại chỉ ghi động từ | động từ, danh từ | complete-hsk-vocabulary: v, vn |
| 宁可…也不 (bài 211, ngữ pháp 2) | nói vế sau dùng 也要 mà vẫn nghĩa «thà A còn hơn B» | 也要 B nghĩa là «thà chịu A cũng phải làm B» | ngữ pháp |
| Động từ + 不得 (bài 223, ngữ pháp 4) | lấy 怪不得 làm ví dụ «không được» | 急不得 | CC-CEDICT, CVDICT: 怪不得 = thảo nào |
| 踊跃 (bài 226, tips) | «không dùng cho một người», trái với hội thoại của chính bài | «thường dùng cho số đông (踊跃报名, 踊跃发言)» | ngữ pháp |
| 急剧 (bài 247, tips) | gọi là trạng từ | tính từ, thường làm trạng ngữ | đề cương 2025: 形 |
| 频繁 (bài 266, tips) | «không đứng ngay trước động từ» | làm được vị ngữ và trạng ngữ (频繁出现); 屡次 chỉ là phó từ | ngữ pháp |
| 落 (bài 263, tips) | «đọc là, không đọc luò» (dễ đọc thành thiếu chữ) | «đọc «là» (thanh 4)» | |
| 老师和蔼地回答… (bài 224, câu 8) | dịch 和蔼 là «ân cần» | «hòa nhã» | CVDICT: hiền lành, nhã nhặn |
| 收集了很多法律案例 (bài 192, câu 6) | «án lệ» là thuật ngữ pháp lý khác nghĩa | «vụ án pháp luật điển hình» | CVDICT: vụ việc, trường hợp |
| 大家都为他的离开感到惋惜 (bài 236, câu 2) | «ra đi» dễ hiểu là qua đời | «rời đi» | |
| 23 câu xếp thẻ (bài 183, 185, 186, 187, 199, 202, 206, 215, 218×2, 224, 233, 235, 236, 249, 255×2, 258, 262, 263×2, 268, 302) | thứ tự khác đúng ngữ pháp (trạng ngữ thời gian/mục đích trước hoặc sau chủ ngữ) bị chấm sai | thêm vào danh sách thứ tự được chấp nhận | ngữ pháp |
| Từ điển: gõ «zhi'an» | không ra 治安 (ô tìm không bỏ dấu nháy) | bỏ dấu nháy khi so | lỗi mã |

Giữ nguyên sau khi đối chiếu: 盛 Hán Việt «thịnh» (Unihan), 无比 từ loại động từ (đề cương 2025: 动).

## Các mục đã nêu để bạn xác nhận

### A. Câu tiếng Trung chưa tự nhiên hoặc sai ý (14): đã sửa theo đề xuất (bạn xác nhận 17/11/2026)

| Chỗ | Đang ghi | Đã sửa thành | Lý do |
|---|---|---|---|
| Bài 161 · câu 8 | 一股香的气味 | 一股诱人的气味 (yòurén; «một mùi thơm hấp dẫn») | 香 + 的 + 气味 không tự nhiên |
| Bài 171 · hội thoại 4 | 前面一段是丘陵，比较平坦，后面才开始起伏 | 前面一段比较平坦，后面是丘陵，地势才开始起伏 | 丘陵 vốn nhấp nhô, câu tự mâu thuẫn |
| Bài 173 · hội thoại 6 | 低的地方 | 地势低的地方 (dìshì dī de dìfang) | thiếu chủ thể |
| Bài 211 · hội thoại 6 | 多看老教授示范上课 | 多听老教授的示范课 | gượng |
| Bài 231 · hội thoại 2 | 无偿给予了一批电脑 | 无偿捐赠了一批电脑 (juānzèng) | 给予 đi với tân ngữ trừu tượng |
| Bài 241 · hội thoại 1 | 把会议的意思传达给大家 | 把会议精神传达给大家 (jīngshén) | cách nói cố định |
| Bài 250 · hội thoại 1 | 遭遇了不少周折 | 经历了不少周折 (jīnglìle) | 周折 đi với 经历/几经 |
| Bài 303 · hội thoại 4 | 找到最近的修理地点，又修理了两个小时左右 | 找到最近的修车地点，请人修理了两个小时左右 («nhờ người ta sửa») | gượng, như thể tự sửa; dùng 请人 thay 师傅 cho đúng cấp |
| Bài 304 · ngữ pháp 2 | 二十个词汇 | 二十个生词 | 词汇 là danh từ tập hợp |
| Bài 308 · ngữ pháp 1 | 这个岛屿位于越南的南部 | 这个岛位于越南的南部 | khớp tips của bài |
| Bài 301 · hội thoại 5 | 我想喝一点儿汤 («ăn chút canh») | 我想喝一点儿茶 («uống chút trà») | 汤 vượt cấp 1–2 |
| Bài đọc r189 · câu 8 | 附近的上班族需求很大，却没有时间吃早饭 | 附近的上班族很多，早餐需求很大，可他们常常没有时间吃早饭 | không rõ nhu cầu gì |
| Bài đọc r199 · câu 9 | 小李陪王阿姨回家报警 | 小李陪王阿姨去派出所报了案 («đưa cô Vương đến đồn công an trình báo») | 小李 chính là cảnh sát |
| Bài đọc r270 · câu 9 | 爷爷没有半途而废 | 有人劝爷爷改行，爷爷却没有半途而废 («Có người khuyên ông đổi nghề, nhưng ông không bỏ dở giữa chừng») | thêm vế cho 半途而废 có việc để bỏ dở, giữ từ của bài |

Đã sửa kèm pinyin và bản dịch; câu hỏi của 3 bài đọc vẫn đúng đáp án. Pinyin câu mới khớp CC-CEDICT (改行 gǎiháng, 捐赠 juānzèng, 派出所 pàichūsuǒ, 报案 bào àn).

### B. Hán Việt không có nguồn hoặc nguồn mâu thuẫn (8): giữ nguyên (bạn xác nhận 17/11/2026)

| Từ | Đang ghi | Ghi chú |
|---|---|---|
| 吃 | ngật (吃, 吃亏, 吃苦, 吃力), cật (吃惊) | Unihan: khật; trong web chưa thống nhất |
| 秃 (đầu mục và tips bài 153) | ngốc | Unihan (禿): thóc |
| 涮 | loát (data/hsk), xoát (涮火锅 trên web) | không có nguồn; hai chỗ đang khác nhau |
| 抢救 | thưởng cứu | không có nguồn |
| 酗酒 | hú tửu | không có nguồn |
| 濒临 | tân lâm | không có nguồn (có sách ghi tần) |
| 咋 | chạ | không có nguồn |
| 包庇 | bao tý | không có nguồn (có sách ghi tí) |

### C. Quy ước biến điệu 不得不: đã sửa (bạn chọn bùdébú, 17/11/2026)

Trước thanh 4, 不 cuối của 不得不 ghi bú theo quy tắc biến điệu, như các chỗ 不 khác của web. Đã sửa 6 chỗ: bùdébú qù (bài 306), bùdébú huàn (hsk4-c), bùdébú zuò (hsk5-a, hsk5-e), bùdébú mài (hsk5-e), bùdébú zài (hsk5-b). Đầu mục từ điển 不得不 giữ dạng gốc bùdébù; trước thanh 1–3 vẫn ghi bùdébù. Chép chính tả vẫn chấp nhận cả bù và bú cho 不.

### D. Câu ví dụ trùng nhau: đã thay câu mới theo đề xuất (bạn xác nhận 17/11/2026)

| Cặp từ | Câu cũ | Câu mới |
|---|---|---|
| 品德 / 高尚 | cùng một câu 他是一个品德高尚的人。 | 高尚: 帮助别人是一种高尚的行为。 Bāngzhù biérén shì yì zhǒng gāoshàng de xíngwéi. Giúp đỡ người khác là một hành động cao thượng. |
| 助手 / 得力 | cùng một câu 她是经理的得力助手。 | 得力: 他办事很得力，老板很满意。 Tā bànshì hěn délì, lǎobǎn hěn mǎnyì. Anh ấy làm việc rất đắc lực, ông chủ rất hài lòng. |
| 镇定 / 镇静 | chỉ khác một chữ | 镇静: 听到坏消息后，他表面上仍然很镇静。 Tīngdào huài xiāoxi hòu, tā biǎomiàn shang réngrán hěn zhènjìng. Nghe tin xấu, bề ngoài anh ấy vẫn rất bình tĩnh. |
| 威望 / 威信 | chỉ khác một chữ | 威信: 说话不算数的人会失去威信。 Shuōhuà bú suànshù de rén huì shīqù wēixìn. Người nói không giữ lời sẽ mất uy tín. |

## Tổng

| | Số mục |
|---|---|
| Lỗi chắc chắn đã sửa | 18 nhóm (gồm 22 pinyin đầu mục, 23 thứ tự xếp câu, 1 lỗi mã) |
| Đã đối chiếu, giữ nguyên | 2 |
| Đã sửa sau khi bạn xác nhận | A 14 câu, C 6 chỗ 不得不, D 4 câu ví dụ |
| Bạn xác nhận giữ nguyên | B 8 âm Hán Việt |
| Còn chờ xác nhận | 0 |

Các sửa nằm trong tệp `js/data/hsk6-*.js`, `js/data/hsk2012-bs.js` (và 5 chỗ 不得不 ở `hsk4-c.js`, `hsk5-a.js`, `hsk5-b.js`, `hsk5-e.js`). Ngày 18/11/2026 đã đồng bộ ngược về `data/vi/` (25 từ có trong `data/vi/`) và build lại `data/hsk/`, xem [hsk2-2012-va-cap6.md](hsk2-2012-va-cap6.md). Các câu 不得不 là câu bài học, không có trong `data/`.
