# Kiểm tra nội dung – Luyện tập: Chọn vị trí từ (16/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–5 và **HSK 3.0** cấp 1–6. Mỗi câu hỏi lấy một câu ví dụ tự soạn của web, bỏ đi một hư từ (phó từ, giới từ, liên từ, lượng từ, động từ năng nguyện) và cho 4 chỗ A–D. Không dùng đề của website hay kỳ thi nào.

## Cách bảo đảm "chỉ một đáp án đúng"

1. Sinh câu hỏi tự động: từ cần đặt là từ trọng tâm của câu hoặc một hư từ thông dụng; không đặt phương án nhiễu ở chỗ "trước/sau chủ ngữ" của cùng vế để tránh hai chỗ cùng đúng.
2. Lọc tách từ bằng CC-CEDICT: loại 371 trường hợp từ cần đặt nằm trong một từ dài hơn (春节, 日本, 越南, 不能, 得很…).
3. Rà soát từng câu hỏi hai vòng (vòng 1: 846 câu với bộ sinh cũ; vòng 2: 732 câu với bộ sinh mới). Câu nào có phương án nhiễu cũng chấp nhận được, dù chưa chắc, đều bị loại.
4. Danh sách câu hỏi đã duyệt được "đóng băng" trong `js/data/position-ok.js` (mã câu → từ cần đặt, vị trí đáp án, giải thích riêng nếu có). Web chỉ dùng các câu trong danh sách này, nên dữ liệu thay đổi sau này không tự sinh thêm câu chưa rà soát.

## Phạm vi và kết quả

| Mục | Số lượng | Kết quả |
|---|---|---|
| Câu hỏi đã duyệt (không trùng) | 706 câu (1.049 lượt theo hai chuẩn) | dùng trong bài |
| Câu bị loại vì có hơn một chỗ đúng hoặc thông tin từ chưa chắc | 40 (vòng 1) + 26 (vòng 2) | đã loại |
| Giải thích quy tắc sai hoặc lỏng | vòng 1: sửa mẫu giải thích chung; vòng 2: 21 câu | đã sửa |
| Phân bố đáp án A/B/C/D | 313 / 228 / 259 / 249 | cân đối |
| Câu, pinyin, bản dịch | 706 câu | 1 bản dịch sửa |
| Dữ liệu từ (nghĩa, từ loại) | 没, 小时, 团 | đã sửa |
| 20 từ cũ ngẫu nhiên: chữ, pinyin, Hán Việt, nghĩa, cấp HSK 2.0 | 20 từ | không lỗi |

20 từ ngẫu nhiên: 鼓舞, 熟练, 真正, 学习, 增加, 常识, 辞职, 鸽子, 错, 稍微, 缩小, 快, 周围, 否则, 前面, 说不定, 魅力, 集中, 玻璃, 身份 (cấp đều khớp danh sách HSK 2.0 chính thức).

Số câu theo cấp: HSK cũ 1: 13 · 2: 32 · 3: 49 · 4: 98 · 5: 175; HSK 3.0 1: 41 · 2: 33 · 3: 83 · 4: 177 · 5: 184 · 6: 164. Cấp thấp ít câu vì câu ví dụ ngắn, ít hư từ.

## Đã sửa – dữ liệu

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 没 (HSK 2.0 cấp 1) | Nghĩa chỉ ghi «không (phủ định 有)», từ loại chỉ «phó từ», trong khi câu thường dùng 没 phủ định động từ (没来, 没吃饭) | nghĩa «không, chưa (phủ định 有 hoặc việc đã xảy ra)», từ loại «phó từ, động từ» | CC-CEDICT |
| 小时 (HSK 2.0 cấp 2) | Từ loại ghi «lượng từ» (两个小时 cho thấy là danh từ) | «danh từ» | CC-CEDICT |
| 团 (HSK 2.0 cấp 5) | Câu «我们这团有二十个人» dùng 团 như danh từ, từ loại chỉ ghi «lượng từ» | «danh từ, lượng từ» | CC-CEDICT |
| 培训 – 新员工要先参加一个月的培训。 | Dịch «…một tháng trước» dễ hiểu nhầm thành «một tháng trước đây» | «Nhân viên mới trước tiên phải tham gia khóa đào tạo một tháng.» | Rà soát bản dịch |

## Đã sửa – bộ sinh câu hỏi và giải thích chung (vòng 1)

| Lỗi phát hiện | Đã sửa thành |
|---|---|
| Tách chữ ra khỏi từ (本 trong 日本, 节 trong 春节, 越 trong 越南) | Lọc bằng CC-CEDICT; bỏ các hư từ dễ đổi nghĩa (把, 给, 对, 为, 张, 没, 真, 要, 想…) khỏi danh sách hư từ thông dụng |
| 不/没 trong bổ ngữ khả năng (打不开, 睡不着) bị giải thích là "đứng trước động từ" | Không ra câu hỏi cho trường hợp này |
| 把 lượng từ (一把钥匙), 为 trong 评为 bị coi là giới từ | Không ra câu hỏi khi trước giới từ là số từ/đại từ chỉ thị, hoặc 为 đứng sau động từ |
| Liên từ: "đứng đầu vế hoặc ngay sau chủ ngữ" sai với 但是, 所以, 否则, 然而, 而, 以及… | Chỉ nêu «… là liên từ (từ nối)» |
| Lượng từ: "trước danh từ" khi không có danh từ (一米八, 一粒就够, 一百块) | Chỉ nói "trước danh từ" khi từ kế tiếp là danh từ; còn lại «đứng ngay sau …» |
| 次/趟/遍: "đếm số lần của hành động" sai với 这次考试, 一次旅行 | «lượng từ chỉ số lần (lượt), đứng sau …» |
| Động từ năng nguyện: nêu tên «động từ chính» sai (可以 + 在网上…, 想到) | Không nêu tên từ; bỏ trường hợp 想到/看完… |
| Phó từ đứng trước danh từ/trợ từ (没钱, 是真的, 好吃极了) bị gọi là "trước động từ" | Chỉ nêu quy tắc khi từ kế tiếp là động từ/tính từ/phó từ/giới từ |
| Dòng "Vị trí đúng" hiển thị từ bị tách sai (个人 thay vì 每个人) | Hiển thị cả câu và tô chỗ đúng |
| Đáp án dồn vào D (504/846) | Chia đều A–D |

## Đã sửa – giải thích riêng từng câu (vòng 2)

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 凡是 – 凡是认识他的人都喜欢他。 | Giải thích nói «凡是» đứng trước động từ/tính từ/cụm giới từ, nhưng ở câu này nó đứng đầu câu, trước cụm danh từ «认识他的人». | «凡是» là phó từ, đứng đầu câu trước cụm danh từ chỉ phạm vi (认识他的人), thường đi với «都» ở phía sau. | Rà soát ngữ pháp |
| 自从 – 自从搬家后，我很少看见他。 | Giải thích nói «自从» ghép với danh từ hoặc đại từ, nhưng ở đây nó ghép với cụm động từ chỉ thời gian «搬家后». | «自从» là giới từ, đứng đầu câu, ghép với cụm chỉ thời gian «搬家后» để nêu mốc bắt đầu. | Rà soát ngữ pháp |
| 被 – 房间被彻底打扫干净了。 | Giải thích nói «被» ghép với danh từ/đại từ phía sau, nhưng câu này không có tác nhân: «被» đứng ngay trước cụm động từ «彻底打扫干净». | «被» đánh dấu câu bị động; ở đây không nêu người thực hiện nên «被» đứng ngay sau chủ ngữ «房间», trước cụm động từ. | Rà soát ngữ pháp |
| 立方 – 这个房间有五十立方米。 | «立方» ở đây không đứng một mình làm lượng từ mà ghép với «米» thành đơn vị «立方米» (mét khối). | «立方» ghép với «米» thành đơn vị «立方米» (mét khối), đứng sau số từ «五十». | Rà soát ngữ pháp |
| 场 – 我们看了一场电影。 | Trong «一场电影», «场» là lượng từ đi với danh từ «电影» (một suất/buổi chiếu), không phải động lượng từ đếm số lần hành động. | «场» là lượng từ, đứng sau «一» và trước danh từ «电影» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这是一次难忘的旅行。 | Ở đây «次» đứng trước danh từ chỉ sự việc «旅行», không phải đứng sau động từ để đếm số lần hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «一» và trước danh từ «旅行» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次考试分数很高。 | «这次考试» chỉ «kỳ thi lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «考试» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次期中考试我考得不错。 | «这次期中考试» chỉ «kỳ thi giữa kỳ lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «期中考试» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次旅游的费用是多少？ | «这次旅游» chỉ «chuyến du lịch lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «旅游» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 总体来说，这次旅行很愉快。 | «这次旅行» chỉ «chuyến đi lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «旅行» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 他在一次车祸中不幸受伤。 | «一次车祸» là lượng từ + danh từ chỉ sự việc, «次» không đứng sau động từ để đếm số lần hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «一» và trước danh từ «车祸» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次旅行加深了我们的友谊。 | «这次旅行» chỉ «chuyến đi lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «旅行» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次谈判对公司至关重要。 | «这次谈判» chỉ «cuộc đàm phán lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «谈判» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次事故没有造成人员死亡。 | «这次事故» chỉ «vụ tai nạn lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «事故» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 我们队这次败给了对手。 | «这次» ở đây là trạng ngữ thời gian (lần này) đứng trước động từ «败», không đếm số lần của hành động. | «次» là lượng từ; «这次» (lần này) làm trạng ngữ chỉ thời gian, đứng trước động từ «败». | Rà soát ngữ pháp |
| 次 – 他对这次比赛信心十足。 | «这次比赛» chỉ «trận đấu lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «比赛» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 很多专业人士参加了这次会议。 | «这次会议» chỉ «hội nghị lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «会议» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这次旅行共计花了五千元。 | «这次旅行» chỉ «chuyến du lịch lần này», «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «这» và trước danh từ «旅行» mà nó đi kèm. | Rà soát ngữ pháp |
| 次 – 这是一次难得的机遇。 | «一次难得的机遇» là lượng từ + danh từ, «次» không đếm số lần của hành động. | «次» là lượng từ dùng cho sự việc, đứng sau «一» và trước cụm danh từ «难得的机遇» mà nó đi kèm. | Rà soát ngữ pháp |
| 趁 – 趁年轻多学点儿东西。 | Sau «趁» ở đây là tính từ «年轻», không phải danh từ hay đại từ như giải thích nói. | «趁» là giới từ, kết hợp với «年轻» thành cụm giới từ chỉ thời cơ (nhân lúc còn trẻ), đứng trước động từ. | Rà soát ngữ pháp |
| 番 – 这几年他的收入翻了一番。 | Trong «翻了一番», «番» chỉ bội số (gấp đôi), không phải đếm số lần thực hiện hành động. | «番» là lượng từ, trong cụm cố định «翻一番» (tăng gấp đôi), đứng ngay sau «一». | Rà soát ngữ pháp |
## Đã loại – vòng 2 (có thể có hơn một chỗ đúng)

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 不 – 我不恨他，我只是很失望。 | Phương án D «我恨他，我不只是很失望» là câu hoàn toàn đúng ngữ pháp và tự nhiên ("Tôi hận anh ta, tôi không chỉ thất vọng"), nên câu hỏi có hai đáp án. | Loại khỏi bài | Rà soát ngữ pháp |
| 更 – 我们要创造更好的生活。 | Phương án A «我们更要创造好的生活» đúng ngữ pháp và tự nhiên (更要 = càng phải), nên A cũng chấp nhận được bên cạnh B. | Loại khỏi bài | Rà soát ngữ pháp |
| 很 – 世界很大，我想去看看。 | Phương án C «世界大，我很想去看看» có cụm «很想去看看» rất tự nhiên; vế «世界大» trần trong câu nhân quả vẫn chấp nhận được, nên người học có lý do chọn C. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 就 – 警察很快就来了。 | Phương án A «警察就很快来了» vẫn chấp nhận được trong lời kể (VD: 我报了警，警察就很快来了), dù «很快就» tự nhiên hơn. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 非常 – 失去爱情让他非常痛苦。 | Phương án B «失去爱情非常让他痛苦» theo mẫu «非常让人…» (非常让人感动) vẫn được một số người bản ngữ chấp nhận. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 从 – 我们可以从另外一个角度看。 | Phương án B «我们可以另外从一个角度看» có thể hiểu «另外» là phó từ (thêm, riêng) nên câu không hẳn sai ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 马上 – 有了计划就要马上行动。 | Phương án C «有了计划就马上要行动» (马上要 = sắp/phải ngay) vẫn có thể chấp nhận được trong khẩu ngữ. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 可是 – 我想去，可是没时间。 | Phương án A «我可是想去，没时间» có thể hiểu «可是» là phó từ nhấn mạnh ("tôi thật sự muốn đi"), câu không hẳn sai. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 未必 – 贵的东西未必好。 | Phương án A «未必贵的东西好» — «未必» đôi khi đứng trước chủ ngữ (未必人人都喜欢), nên A không sai hoàn toàn rõ ràng. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 极 – 这个菜好吃极了。 | Phương án B «这个菜极好吃了»: «极好吃» là cách dùng đúng (极 làm trạng ngữ), chỉ có «了» cuối câu hơi gượng, nên B không sai rõ ràng. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 件 – 听到这件事，我很难过。 | Phương án C «听到这事件，我很难过» ghép «事» với «件» thành từ «事件» (sự kiện), tạo câu gần như chấp nhận được. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 最好 – 你最好早点儿睡。 | Phương án D «你早点儿睡最好» cũng là câu khẩu ngữ chấp nhận được («最好» làm vị ngữ: ngủ sớm là tốt nhất). | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 不 – 今天来的人数不多。 | Phương án A «今天不来的人数多» vẫn đúng ngữ pháp (số người không đến hôm nay nhiều), chỉ khác nghĩa. | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 都 – 每个人都应该知法守法。 | Phương án B «每个人应该都知法守法» cũng tự nhiên trong tiếng Trung hiện đại («应该都» là trật tự phổ biến). | Loại khỏi bài | Rà soát ngữ pháp |
| 可以 – 我们下午两点可以入住。 | Phương án A «我们下午可以两点入住» cũng đúng: động từ năng nguyện có thể đứng trước từ chỉ thời gian («可以两点入住»). | Loại khỏi bài | Rà soát ngữ pháp |
| 先 – 打电话的时候要先问对方是谁。 | Phương án C «打电话的时候先要问对方是谁» cũng đúng và tự nhiên («先要» và «要先» đều dùng được). | Loại khỏi bài | Rà soát ngữ pháp |
| 先 – 租房要先交押金。 | Phương án B «租房先要交押金» cũng đúng và tự nhiên («先要» tương đương «要先»). | Loại khỏi bài | Rà soát ngữ pháp |
| 先 – 看病要先在网上预约。 | Phương án C «看病要在网上先预约» cũng đúng: phó từ «先» có thể đứng sau cụm giới từ «在网上», trước động từ. | Loại khỏi bài | Rà soát ngữ pháp |
| 可以 – 你可以在网上搜索一下。 | Phương án B «你在网上可以搜索一下» cũng đúng: động từ năng nguyện có thể đứng sau cụm giới từ «在网上». | Loại khỏi bài | Rà soát ngữ pháp |
| 大致 – 我大致了解了一下情况。 | Phương án C «我了解了一下大致情况» hoàn toàn đúng và tự nhiên («大致» làm định ngữ: tình hình đại khái). | Loại khỏi bài | Rà soát ngữ pháp |
| 已经 – 我跟他已经没有来往了。 | Phương án A «我已经跟他没有来往了» cũng đúng và tự nhiên: phó từ «已经» thường đứng trước cụm giới từ «跟他». | Loại khỏi bài | Rà soát ngữ pháp |
| 反正 – 反正我不去，你自己决定吧。 | Phương án C «我不去，反正你自己决定吧» cũng có thể chấp nhận trong khẩu ngữ («反正» đứng đầu vế sau: đằng nào thì bạn cũng tự quyết). | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 倒是 – 这件衣服样子倒是不错，就是太贵了。 | Phương án A «这件衣服倒是样子不错，就是太贵了» cũng chấp nhận được: «倒是» có thể đứng trước vị ngữ chủ-vị «样子不错». | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 太 – 这里光线太暗，不适合看书。 | Phương án B «这里光线暗，太不适合看书» gần như chấp nhận được («太不适合…» là cách nói thường gặp, nhất là khi thêm 了). | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 会 – 他很会处理人际关系。 | Trong «他很会处理人际关系», «会» mang nghĩa «giỏi, khéo (làm gì)», không phải «biết» hay «sẽ». | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |
| 再 – 我现在很忙，回头再给你打电话。 | Trong «回头再给你打电话», «再» chỉ việc hoãn lại sau (rồi mới, sau đó), không phải «lại, lần nữa». | Loại khỏi bài | Rà soát ngữ pháp (chưa chắc, loại cho an toàn) |

Vòng 1 loại thêm 40 câu (nằm trong danh sách `BAD` của `js/practice-position.js`): 今天真倒霉，手机丢了。、今天网络不太好，视频很卡。、他今天晚上要加班。、他吃完饭便出去了。、他太懒了，什么都不做。、他始终相信自己能成功。、他急忙穿上衣服出门了。、他病了，因此没来。、他经常幻想自己住在北京。、他起床后先去洗漱。、你可以在网上查询考试成绩。、你可以在网上购买火车票。、做饺子要先准备面粉。、坐飞机前要先过安检。、外国游客购物可以申请退税。、大夫说我要休息。、学校规定不能抽烟。、小偷被警察当场抓住了。、我不笨，只是学得慢。、我们另找时间再谈吧。、我几乎每天都上网。、我想和你单独谈谈。、我曾在北京住过两年。、我的自行车坏了，要拿去修理。、我的银行账户里没钱了。、我等了你整整一天。、明天下雨的话，我不去。、有些人不喜欢吃肉。、每个人都应该交税。、每个地方的风俗都不一样。、每天早晚都要刷牙。、每天至少学一个小时。、消防车很快就赶到了现场。、秋天，公园里落叶遍地。、这个地区夏天常常水资源短缺。、这个消息让人难以相信。、这个软件可以实时查看路况。、这是我特意为你做的菜。、这里的变化真大。、这里的风景的确很美丽。

## Mục chưa chắc chắn – đã được bạn xác nhận (16/11/2026)

| Từ/câu | Vấn đề | Quyết định | Nguồn |
|---|---|---|---|
| 大都 (HSK 3.0 cấp 6) – 这里的人大都很热情。 | Từ ghi «dàdū», câu ví dụ ghi «dàdōu» | theo đề cương: câu ví dụ sửa thành «dàdū»; nghĩa gọn lại «phần lớn, hầu hết», từ loại «phó từ»; câu được đưa lại vào bài (chỉ B đúng) | đề cương 2025 |

## Tổng kết

- Đã kiểm tra: 1.578 lượt câu hỏi qua hai vòng rà soát (846 + 732), 4.697 ứng viên qua bộ lọc CC-CEDICT, 20 từ cũ ngẫu nhiên.
- Đã sửa: 4 mục dữ liệu, 10 lỗi mẫu giải thích/bộ sinh, 21 giải thích riêng; loại 66 câu có thể có hơn một đáp án.
- Chưa chắc chắn: 1 mục (大都), đã được bạn xác nhận.

## Cấp 6 (HSK 2.0) – bổ sung 18/11/2026

Mã câu không phụ thuộc chuẩn, nên 73 câu cấp 6 trùng với câu HSK 3.0 đã duyệt có sẵn trong bài. Đợt này sinh bằng `PositionDrill.itemsOf("hsk2", 6, true)` (160 câu), bỏ 43 câu đã duyệt, còn 117 câu mới; lọc tách từ bằng CC-CEDICT (bản mdbg tải ngày 18/11/2026: từ cần đặt có nằm trong một từ dài hơn của câu không) rồi rà soát từng câu như cấp 1–5.

| Mục | Số lượng | Kết quả |
|---|---|---|
| Câu ứng viên mới | 117 | rà soát toàn bộ |
| CC-CEDICT báo từ cần đặt nằm trong từ dài hơn | 20 | 12 loại: 皆 (人人皆知), 不 (不大, 不能 ×2, 不想, 不愿), 就 (早就, 就要 ×2), 向 (走向), 能 (不能 ×2), 次 (多次); 8 giữ vì chỉ trùng ngẫu nhiên qua ranh giới từ (下去+势必 → «去势», 明明+知道 → «明知», 双方+正在 → «方正», 各国+都 → «国都», 这不是, 晚上+都 → «上都») hoặc là chỉ từ/số + lượng từ (一个, 这位) như cấp 1–5 |
| Có chỗ khác cũng đặt được | 11 | loại: 大致 (了解了一下大致情况), 屡次 (屡次被老板批评), 就近 (找个酒店就近住下), 任意 (选择任意一本书), 很 (很像亲姐妹), 应该 (应该不撒谎), 不 (太不自然), 一定 (要有一定节制); chưa chắc nên loại: 预先 (预先最好), 迎面 (一阵迎面冷风), 姑且 (姑且这件事不提) |
| Phương án hiển thị bắt đầu bằng dấu phẩy (总而言之，…) | 1 | loại |
| Câu dùng thêm | 93 | 35 câu hỏi về chính từ cấp 6 (以至, 免得, 不由得, 倘若, 况且, 偏偏, 宁肯, 无非, 照样, 势必, 随即, 宁愿, 明明, 未免, 及早, 接连, 逐年, 恰巧, 索性, 连同, 万分, 亦, 唯独, 私自, 鉴于, 以致, 一度, 甭, 反之, 大肆, 统统, 成心, 枚, 磅, 幢) + 58 câu về hư từ thông dụng (很, 被, 都, 才, 个, 位…) |
| Ghép từ vào chỗ đáp án ra đúng câu gốc; giải thích hiển thị được; chạy thử trên web ba độ khó | 93 | đạt, không lỗi console |

Số câu cấp 6 sau khi thêm: **166**; phân bố đáp án A/B/C/D: 51 / 41 / 38 / 36. Vì mã câu dùng chung, 6 câu mới cũng có ở HSK 3.0 cấp 6 (164 → 170 câu).

### Tổng kết cấp 6

- Đã kiểm tra: 117 câu ứng viên mới.
- Đã sửa: không sửa dữ liệu từ/câu; loại 24 câu (12 tách từ, 11 có hơn một chỗ đúng hoặc chưa chắc, 1 lỗi hiển thị).
- Chưa chắc chắn: các mục «chưa chắc» đã được loại.
