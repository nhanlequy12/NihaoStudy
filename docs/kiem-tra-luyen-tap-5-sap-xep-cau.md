# Kiểm tra nội dung – Luyện tập: Sắp xếp câu (16/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–5 và **HSK 3.0** cấp 1–6. Câu lấy từ câu ví dụ tự soạn của web, chia cụm (trợ từ đi liền từ trước, số + lượng từ đi liền), dấu câu cuối cố định. Chỉ chấp nhận trật tự gốc, nên mọi câu có trật tự khác cũng đúng đều bị loại.

Danh sách câu đã duyệt (mã câu → ranh giới cụm) nằm trong `js/data/practice-order-data.js`; web chỉ dùng các câu này.

## Phạm vi và kết quả

| Mục | Số lượng | Kết quả |
|---|---|---|
| Câu ứng viên (tối đa 100/cấp) | 823 | rà soát toàn bộ |
| Có trật tự khác cũng đúng (trạng ngữ thời gian, A是B↔B是A, hoán đổi người/vật, số…) | 206 | loại |
| Chia cụm tách đôi từ (越/南, 学历/史, 十/四…) | 52 | loại |
| Lỗi câu/pinyin | 8 | 2 sửa trong dữ liệu, còn lại thuộc mục quyết định chung |
| Câu đã duyệt | 568 | dùng trong bài |
| Ghép cụm ra đúng câu, xáo không trùng thứ tự đúng | 568 | đạt |
| Giao diện: kéo thả (chuột, cảm ứng), bấm, phím số/Backspace/Enter; máy tính, điện thoại, giao diện tối | — | đạt |

Số câu theo cấp (Dễ/Vừa/Khó): HSK cũ 1: 74/51/5 · 2: 34/52/26 · 3: 48/65/28 · 4: 40/63/29 · 5: 23/64/51; HSK 3.0 1: 105/99/24 · 2: 40/61/31 · 3: 56/73/29 · 4: 52/96/55 · 5: 22/69/58 · 6: 17/61/56.

20 từ cũ ngẫu nhiên (chữ, pinyin, Hán Việt, nghĩa, cấp HSK 2.0 so với danh sách chính thức): 仿佛, 方向, 不得不, 登机牌, 鞋, 付款, 奶奶, 名字, 长城, 戴, 蜜蜂, 景色, 输, 动作, 片, 果实, 发言, 岛, 工厂, 其余 — không lỗi.

## Đã sửa – dữ liệu

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 一帆风顺 – 祝你一路一帆风顺！ | Lặp ý (一路 + 一帆风顺) | «祝你工作一帆风顺！ / Zhù nǐ gōngzuò yìfān-fēngshùn! / Chúc công việc của bạn thuận buồm xuôi gió!» | Rà soát ngữ pháp |
| 月亮 – 今晚的月亮很圆。 | Pinyin tách «Jīn wǎn» trong khi 今晚 là một từ | «Jīnwǎn de yuèliang hěn yuán.» | CC-CEDICT |

## Đã loại

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 王先生是老师。 | Đổi chủ ngữ và vị ngữ của 是 vẫn ra câu tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我家有四个人。 | Cụm 个人 vô tình trùng từ 个人 (cá nhân), tách lượng từ khỏi số 四 không tự nhiên. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我给妈妈打电话。 | Đổi chỗ 我 và 妈妈 vẫn đúng ngữ pháp (mẹ gọi cho tôi). | Loại khỏi bài | Rà soát ngữ pháp |
| 星期天我不工作。 | Từ chỉ thời gian đặt trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是我的朋友。 | Câu A是B đảo thành B是A vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我和他是朋友。 | Hai đại từ hai bên 和 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天天气怎么样？ | Từ chỉ thời gian đặt sau chủ ngữ vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 这些东西是我的。 | Đảo hai vế của 是 vẫn là câu tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是我的同学。 | Câu A是B đảo thành B是A vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 认识你很高兴。 | 很高兴认识你 là cách nói phổ biến nhất, người học dễ xếp ra và bị chấm sai. | Loại khỏi bài | Rà soát ngữ pháp |
| 我十一点睡觉。 | Cụm 十 / 一点 cắt đôi số 十一. | Loại khỏi bài | Rà soát ngữ pháp |
| 学校在商店后面。 | Hai địa điểm đổi vai được. | Loại khỏi bài | Rà soát ngữ pháp |
| 学校在商店后面。 | Pinyin hòumian ghi thanh nhẹ, không khớp CC-CEDICT (hou4 mian4) và các câu khác (qiánmiàn, wàimiàn). (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我爸爸是医生。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 一零五 | Mọi hoán vị ba chữ số đều là số phòng hợp lệ (501, 150, 510...). | Loại khỏi bài | Rà soát ngữ pháp |
| 二零二六年 | Hoán vị các chữ số vẫn ra năm hợp lệ (2062, 2620...). | Loại khỏi bài | Rà soát ngữ pháp |
| 五月一日 | Đổi 五 và 一 ra ngày khác nhưng vẫn hợp lệ. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是老师。 | Đảo thành 老师是他 vẫn dùng được khi trả lời ai là giáo viên. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我叫小明。 | Tên 小明 bị cắt làm hai cụm 小 / 明. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是谁？ | 谁是他 cũng là câu hỏi tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我二十岁。 | Cụm 二 / 十岁 cắt đôi số 二十. | Loại khỏi bài | Rà soát ngữ pháp |
| 上午我学习。 | Từ chỉ thời gian đặt trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我每天都学习汉语。 | 每天 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 学校离我家很近。 | Hai địa điểm hai bên 离 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 明天可能下雪。 | 可能 và 明天 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 我觉得这个菜很好吃。 | Đưa 这个菜 lên đầu làm chủ đề vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他早上去跑步。 | Từ chỉ thời gian đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我希望你身体好。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 晚上我看电视。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 欢迎你来越南！ | Tên nước 越南 bị cắt làm 越 / 南. | Loại khỏi bài | Rà soát ngữ pháp |
| 这件衣服一百块。 | Số 一百 bị cắt làm 一 / 百块. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个题我不会做。 | Đặt tân ngữ về sau động từ là thứ tự thường, cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他每天六点起床。 | 每天 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 商店在医院旁边。 | Hai địa điểm đổi vai được. | Loại khỏi bài | Rà soát ngữ pháp |
| 我早上喝咖啡。 | Từ chỉ thời gian đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 那个男人是谁？ | 谁是那个男人 cũng là câu hỏi tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 去年我在北京。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 椅子在桌子左边。 | Hai đồ vật đổi vai được. | Loại khỏi bài | Rà soát ngữ pháp |
| 爸爸每天看报纸。 | 每天 đặt trước chủ ngữ vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 明天我们考试。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个女人是我老师。 | Đảo hai vế của 是 vẫn có thể chấp nhận. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 一个西瓜十元。 | Nói giá theo thứ tự 十元一个西瓜 cũng rất tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我早上七点起床。 | 早上 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 晚上我们去跳舞。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我今天有很多事情。 | Từ chỉ thời gian đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我每天都运动。 | 每天 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我的猫是白色的。 | Đảo thành 白色的是我的猫 (con màu trắng là mèo tôi) vẫn tự nhiên. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 你为什么学习汉语？ | 为什么 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我去过北京两次。 | Bổ ngữ số lần 两次 đặt trước tân ngữ địa danh cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 孩子们都笑了。 | Hậu tố 们 bị tách khỏi 孩子 thành cụm riêng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我不懂这个字。 | Đưa tân ngữ lên đầu làm chủ đề vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 星期天我在家休息。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 孩子们在外面玩。 | Hậu tố 们 bị tách khỏi 孩子 thành cụm riêng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我哥哥是医生。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我上午有汉语课。 | Từ chỉ thời gian đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我想问你一个问题。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天是我的生日。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 她丈夫是老师。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 你知道他是谁吗？ | Đổi chỗ 你 và 他 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个电脑三千块。 | Số 三千 bị cắt làm 三 / 千块. | Loại khỏi bài | Rà soát ngữ pháp |
| 机场离这里很远。 | Hai địa điểm hai bên 离 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 他坐在我右边。 | Đổi chỗ 他 và 我 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 其实我不喜欢他。 | Đổi chỗ 我/他 hoặc đặt 其实 sau chủ ngữ (我其实不喜欢他) đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我学了一段时间汉语。 | Bổ ngữ thời lượng đặt sau tân ngữ vẫn có thể chấp nhận. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 他喜欢学历史。 | Cụm 学历 / 史 cắt sai: tách 历史 và vô tình tạo từ 学历 (bằng cấp). | Loại khỏi bài | Rà soát ngữ pháp |
| 你当然可以来。 | 当然 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天比昨天更冷。 | Hai vế so sánh đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 我终于学会了。 | 终于 đặt trước chủ ngữ vẫn có thể chấp nhận. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 早上我吃面包。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 周末你做什么？ | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这种药很有作用。 | 很有作用 không tự nhiên; thường nói 很有效 hoặc 很管用. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 今天太阳很大。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 明天或者后天都可以。 | Hai vế của 或者 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 下课以后我们去吃饭吧。 | Mệnh đề thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我每天都上网。 | 每天 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 周末我打扫房间。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天家里来了客人。 | 今天 và 家里 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 他最近瘦了很多。 | 最近 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 学校在城市的西边。 | Từ phương vị 西边 bị cắt làm 西 / 边. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我相信他的话。 | Cụm 他 / 的话 cắt sai chỗ, 的话 trùng từ 的话 (nếu). | Loại khỏi bài | Rà soát ngữ pháp |
| 我相信他的话。 | Với cách chia hiện tại, đổi chỗ 我 và 他 vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这辆车十万块。 | Số 十万 bị cắt làm 十 / 万块. | Loại khỏi bài | Rà soát ngữ pháp |
| 主要的问题是钱。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚的月亮很圆。 | Từ 今晚 bị cắt làm 今 / 晚的. | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚的月亮很圆。 | Pinyin viết tách Jīn wǎn trong khi 今晚 là một từ. | Loại khỏi bài | Rà soát ngữ pháp |
| 我去车站接你。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 女儿长得像妈妈。 | Hai danh từ đổi vai vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 你为什么不去？ | 为什么 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是我们的经理。 | Câu A是B đảo thành B是A vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 香蕉是黄色的。 | Đảo thành 黄色的是香蕉 (cái màu vàng là chuối) vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 会议十点开始。 | Giờ đặt trước chủ ngữ vẫn đúng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我的邻居是老师。 | Đảo hai vế của 是 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 妈妈很担心我。 | Đổi chỗ 妈妈 và 我 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 你可以选择红的或蓝的。 | Hai vế của 或 đổi chỗ được. | Loại khỏi bài | Rà soát ngữ pháp |
| 我发现他哭了。 | Đổi chỗ 我 và 他 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 越南有五十四个民族。 | 越南 bị cắt làm 越 / 南 và số 五十四 bị tách thành 五 / 十 / 四个, nên xếp ra 四十五 cũng đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 钱掉在地上了。 | Cụm 在地 / 上了 cắt sai, tách 地上. | Loại khỏi bài | Rà soát ngữ pháp |
| 你尝尝这个菜。 | Đưa tân ngữ lên đầu làm chủ đề vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 这本书值得一看。 | 值得 theo CC-CEDICT là zhíde (thanh nhẹ), không phải zhídé. | Loại khỏi bài | Rà soát ngữ pháp |
| 每个人都有缺点。 | Cụm 每 / 个人 tách lượng từ khỏi 每, vô tình tạo từ 个人. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 他送了我一朵花。 | Đổi chỗ 他 và 我 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 他对我们很友好。 | Đổi chỗ 他 và 我们 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 他小时候家里很穷。 | 小时候 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 快点儿，否则要迟到了。 | 儿 hóa bị tách thành cụm riêng 儿，. | Loại khỏi bài | Rà soát ngữ pháp |
| 面试的时候我很紧张。 | Cụm thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他因为迟到被批评了。 | 因为迟到 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 一个人在国外很孤单。 | Từ 国外 bị cắt làm 国 / 外, xếp thành 外国 cũng đúng; 一 / 个人 cũng tách lạ. | Loại khỏi bài | Rà soát ngữ pháp |
| 今年的价格是去年的两倍。 | Hai mốc năm đổi chỗ vẫn đúng ngữ pháp (nghĩa ngược lại). | Loại khỏi bài | Rà soát ngữ pháp |
| 你的职业是什么？ | 什么是你的职业 cũng là câu hỏi đúng ngữ pháp. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我很羡慕你有这么好的朋友。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 考试结果明天出来。 | 明天 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他是我真正的朋友。 | Câu A是B đảo thành B是A vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我去了一趟超市。 | Bổ ngữ số lần đặt sau tân ngữ địa điểm cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 将来我想当医生。 | 将来 đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 最后他同意了。 | 最后 đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 一个人去很危险。 | Cụm 一 / 个人 tách 一个人 (một mình) một cách lạ. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 飞机九点起飞。 | Giờ đặt trước chủ ngữ vẫn đúng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 每个人都要了解法律。 | Cụm 每 / 个人 tách lượng từ khỏi 每, vô tình tạo từ 个人. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我为你感到骄傲。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 他好像生病了。 | 好像 đặt trước chủ ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我想和你商量一件事。 | Đổi chỗ 我 và 你 vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 过年我们包饺子。 | Từ chỉ thời gian đặt sau chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我保证明天准时到。 | 明天 đặt đầu câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 演出八点开始。 | Giờ đặt trước chủ ngữ vẫn đúng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 这家店今天打折。 | 今天 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们明天早上出发。 | Từ chỉ thời gian đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他大概不来了。 | 大概 đặt trước chủ ngữ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 顺便帮我买瓶水。 | 顺便 đặt sau 帮我 vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 上海比较热，北京则比较冷。 | Địa danh 上海 bị cắt làm 上 / 海. | Loại khỏi bài | Rà soát ngữ pháp |
| 上海比较热，北京则比较冷。 | Hai địa danh đổi chỗ vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 他天天迟到，可见他不重视这份工作。 | Cụm «他天 / 天» cắt đôi từ láy «天天» và dính «他» vào nửa đầu, rất gượng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我宁可不吃饭，也要看完这本书。 | Có thể đưa tân ngữ «这本书» lên đầu làm chủ đề, câu vẫn tự nhiên. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我早上吃了两个包子。 | Từ chỉ thời gian «早上» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 经理亲自送客人到门口。 | «到门口» có thể đứng trước «送客人», câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 越南很多人骑摩托车。 | Tên nước «越南» bị cắt thành «越 / 南». | Loại khỏi bài | Rà soát ngữ pháp |
| 越南很多人骑摩托车。 | Các cụm xếp được thành «很多越南人骑摩托车», cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 这张照片的背景是长城。 | Câu A是B đảo thành B是A vẫn đúng ngữ pháp và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 晚上我们去酒吧聊天。 | «晚上» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 中国的人口超过十四亿。 | Hai cụm «十 / 四» có thể xếp thành «四十亿», vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 每个地方的风俗都不一样。 | Đổi chỗ «都 / 不» thành «不都一样» vẫn đúng ngữ pháp (nghĩa khác). | Loại khỏi bài | Rà soát ngữ pháp |
| 王子后来成为了皇帝。 | «后来» đứng trước chủ ngữ cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他虽然很有名，但是很谦虚。 | «他» có thể đứng sau «虽然», câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 警察找到了那个罪犯。 | «那个» có thể đi với «警察» thay vì «罪犯». | Loại khỏi bài | Rà soát ngữ pháp |
| 老实人有时候会吃亏。 | Từ «有时候» bị cắt thành «有时 / 候», chữ «候» đứng riêng vô nghĩa. | Loại khỏi bài | Rà soát ngữ pháp |
| 他每天辅导弟弟学习。 | «每天» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我给你发了一条短信。 | Hai đại từ «我 / 你» đổi vai cho nhau vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 老师喜欢向学生提问。 | Hai danh từ «老师 / 学生» đổi vai vẫn đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 老师喜欢向学生提问。 | Pinyin «xuéshēng» không theo quy ước CC-CEDICT (thanh nhẹ), không thống nhất với các câu khác. | Loại khỏi bài | Rà soát ngữ pháp |
| 我下决心每天学一小时汉语。 | «一小时» có thể đặt sau «汉语», câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 在高速路上要小心驾驶。 | «要» đứng trước hay sau trạng ngữ nơi chốn đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 女儿明年上幼儿园。 | «明年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 金属比木头硬。 | Hai vế so sánh đổi chỗ vẫn đúng ngữ pháp (chỉ sai thực tế). | Loại khỏi bài | Rà soát ngữ pháp |
| 这种样式去年很流行。 | «去年» có thể đứng đầu câu, câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个房间有五十立方米。 | Cụm «十立方» cắt ngang cả số «五十» lẫn đơn vị «立方米». | Loại khỏi bài | Rà soát ngữ pháp |
| 他们离婚以后还是朋友。 | Chủ ngữ «他们» có thể đứng sau «离婚以后». | Loại khỏi bài | Rà soát ngữ pháp |
| 很多日本公司来越南投资。 | Tên nước «日本» và «越南» bị cắt thành từng chữ. | Loại khỏi bài | Rà soát ngữ pháp |
| 很多日本公司来越南投资。 | Hai tên nước đổi chỗ cho nhau vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 我先走了，至于他，你问问吧。 | Hai đại từ «我 / 你» có thể đổi chỗ, câu vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 除夕晚上大家一起吃饭。 | Chủ ngữ «大家» có thể đứng trước trạng ngữ thời gian. | Loại khỏi bài | Rà soát ngữ pháp |
| 这里是我的家。 | Câu A是B đảo thành B是A vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 那个人是我哥哥。 | Câu A是B đảo thành B是A vẫn đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我今年二十岁。 | «今年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天天气很好。 | «今天» có thể đứng sau «天气», câu vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我们八点上课。 | «八点» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我每天都吃早饭。 | «每天» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 电影院里人很多。 | «很 / 多» có thể đứng trước «人», câu khẩu ngữ vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 明年我去中国。 | «明年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们七点吃晚饭。 | «七点» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 你今天来得很早。 | «今天» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我晚上十点睡。 | «晚上» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我下午去医院看病。 | «下午» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他边吃饭边看书。 | Hai vế «边吃饭 / 边看书» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我没听见你说话。 | Hai đại từ «我 / 你» đổi vai vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 星期天我不上班。 | «星期天» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我白天工作，晚上学习。 | Hai từ thời gian «白天 / 晚上» đổi chỗ vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 那个女孩儿是我妹妹。 | Câu A是B đảo thành B是A vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 明天我要考中文。 | «明天» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 你上来看看吧。 | CC-CEDICT ghi «上来» là shàng lai (thanh nhẹ), pinyin đang viết «shànglái». (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我小时候很胖。 | «小时候» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 你要红茶还是绿茶？ | Hai lựa chọn quanh «还是» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 吃饭前要洗手。 | Hai cụm động tân «吃饭 / 洗手» đổi chỗ vẫn đúng ngữ pháp (nghĩa lạ). | Loại khỏi bài | Rà soát ngữ pháp |
| 我有时坐车上班。 | «有时» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他明年要出国留学。 | «明年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 过年我们回老家。 | «过年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们班有二十个人。 | Hai cụm số «二 / 十» xếp được thành «十二». | Loại khỏi bài | Rà soát ngữ pháp |
| 我跟他一起去。 | Hai đại từ «我 / 他» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 车站离这儿不远。 | Hai địa điểm quanh «离» đổi chỗ vẫn đúng, cùng nghĩa. | Loại khỏi bài | Rà soát ngữ pháp |
| 树叶是绿色的。 | Từ «树叶» bị cắt thành «树 / 叶». | Loại khỏi bài | Rà soát ngữ pháp |
| 他没有你那么高。 | Hai đại từ «他 / 你» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 下一站是火车站。 | Câu A是B đảo thành B是A vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我在门口等你。 | Hai đại từ «我 / 你» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们班级有四十人。 | Hai cụm số «四 / 十» xếp được thành «十四». | Loại khỏi bài | Rà soát ngữ pháp |
| 他住在上海市。 | Địa danh «上海» bị cắt thành «上 / 海». | Loại khỏi bài | Rà soát ngữ pháp |
| 工作日我每天七点起床。 | «工作日» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这里游客很多。 | «很 / 多» có thể đứng trước «游客», khẩu ngữ vẫn chấp nhận. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚有个晚会。 | Từ «今晚» bị cắt thành «今 / 晚», chữ «今» đứng riêng không tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 这对夫妻结婚二十年了。 | Hai cụm số «二 / 十» xếp được thành «十二». | Loại khỏi bài | Rà soát ngữ pháp |
| 假期你去哪儿玩儿？ | Hậu tố «儿» của «玩儿» bị tách thành cụm riêng. | Loại khỏi bài | Rà soát ngữ pháp |
| 假期你去哪儿玩儿？ | «假期» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他常常来我家。 | Hai đại từ «他 / 我» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚我们叫外卖吧。 | Từ «今晚» bị cắt thành «今 / 晚». | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚我们叫外卖吧。 | «今晚» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 看来今天会下雨。 | «今天» có thể đứng trước «看来», câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我前年去过北京。 | «前年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 医生在看病人。 | Chia «看病 / 人» cắt ngang từ «病人» (câu là 看 + 病人), dễ khiến người học hiểu sai. | Loại khỏi bài | Rà soát ngữ pháp |
| 明天下雨的话，我不去。 | «明天» có thể chuyển xuống vế sau, câu vẫn tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他坚持每天跑步。 | «每天» đứng trước hay sau «坚持» đều đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我和她是最好的姐妹。 | Hai vế quanh «和» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 快走，还能赶上末班车。 | Từ «末班车» bị cắt thành ba chữ đơn «末 / 班 / 车». | Loại khỏi bài | Rà soát ngữ pháp |
| 我们下个月在线下见面吧。 | Cụm «在线 / 下» cắt ngang từ «线下» (câu là 在 + 线下), gây hiểu nhầm thành «在线». | Loại khỏi bài | Rà soát ngữ pháp |
| 我能够自己做饭。 | «自己» đứng trước «能够» cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我昨天晚上做梦了。 | Trạng ngữ thời gian đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这道题我答对了。 | Chủ ngữ «我» đứng trước chủ đề «这道题» cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天气温很低。 | «今天» có thể đứng sau «气温», câu vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 现在很多人在互联网上工作。 | «现在» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我七点左右到。 | Trạng ngữ thời gian đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我每天早上喝一杯酸奶。 | Trạng ngữ thời gian đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这学期的课都在线上进行。 | Các cụm «在线 / 上进 / 行» cắt ngang cả «线上» lẫn «进行», tạo ra từ giả «在线», «上进». | Loại khỏi bài | Rà soát ngữ pháp |
| 这棵树很粗，两个人才抱得住。 | Cụm «树很» ghép danh từ với phó từ của vị ngữ, không phải một đơn vị tự nhiên. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 不论多忙，他都来看我。 | Hai đại từ «他 / 我» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 和去年相比，今年更热。 | Hai từ «去年 / 今年» đổi chỗ vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 这家工厂引进了国外的新技术。 | Từ «国外» bị cắt thành «国 / 外的». | Loại khỏi bài | Rà soát ngữ pháp |
| 此时他正在开会。 | «此时» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们明天就动手准备。 | «准备 / 动手» đổi chỗ vẫn đúng (cũng có thể «明天我们就动手准备»). | Loại khỏi bài | Rà soát ngữ pháp |
| 我们在上海停留了两天。 | Địa danh «上海» bị cắt thành «上 / 海». | Loại khỏi bài | Rà soát ngữ pháp |
| 他在这里没有亲人。 | Trạng ngữ nơi chốn «在这里» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他在这个城市居住了二十年。 | Hai cụm số «二 / 十» xếp được thành «十二». | Loại khỏi bài | Rà soát ngữ pháp |
| 沿这条路一直往前走。 | «一直» đứng đầu câu cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他不太喜欢和别人交往。 | Đổi «不 / 太» thành «太不» vẫn đúng ngữ pháp (nghĩa mạnh hơn). (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 他在城里做点儿小买卖。 | «点儿» bị cắt thành «点 / 儿». | Loại khỏi bài | Rà soát ngữ pháp |
| 我在站台上等你。 | Hai đại từ «我 / 你» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 请保管好您的随身物品。 | Từ «随身» bị cắt thành «随 / 身». | Loại khỏi bài | Rà soát ngữ pháp |
| 这条裤子配这件衣服。 | Hai danh từ quanh «配» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 公司总部在上海。 | Địa danh «上海» bị cắt thành «上 / 海». | Loại khỏi bài | Rà soát ngữ pháp |
| 这几年物价涨得很快。 | «这几年» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今天网络不太好，视频很卡。 | «今天» đứng sau «网络» cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚电视台直播足球比赛。 | Từ «今晚» bị cắt thành «今 / 晚». | Loại khỏi bài | Rà soát ngữ pháp |
| 今晚电视台直播足球比赛。 | «今晚» đứng trước hay sau chủ ngữ đều đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 你早晚会明白的。 | «早晚» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个地方盛产苹果。 | Động từ «盛产» bị cắt thành «盛 / 产». | Loại khỏi bài | Rà soát ngữ pháp |
| 房子四周都是树。 | Hai danh từ «房子 / 树» đổi chỗ vẫn đúng ngữ pháp. | Loại khỏi bài | Rà soát ngữ pháp |
| 门打不开，你再使劲推一下。 | Cụm «门打» ghép chủ ngữ với nửa động từ của «打不开», không tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 我们要为后代保护环境。 | «为后代» có thể đưa lên đầu câu, vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 这所大学今年招生三千人。 | «今年» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他的话打动了我。 | Hai đại từ «他 / 我» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 他的话打动了我。 | Cụm «的话» ở đây là 的 + 话, dễ nhầm với liên từ «的话» (nếu). (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我去年学会了游泳。 | «去年» đứng trước chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 老人走路需要用拐杖辅助。 | Từ «拐杖» bị cắt thành «拐 / 杖». | Loại khỏi bài | Rà soát ngữ pháp |
| 网上付款又快捷又方便。 | Hai vế «又快捷 / 又方便» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这个故事的结局是个悲剧。 | Từ «结局» bị cắt thành «结 / 局». | Loại khỏi bài | Rà soát ngữ pháp |
| 这把刀很尖，小心点儿。 | «点儿» bị cắt thành «点 / 儿». | Loại khỏi bài | Rà soát ngữ pháp |
| 这顿饭的酒水另外算钱。 | «钱» có thể đi sau «酒水» thành «酒水钱另外算», rất tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 他认定这件事是我做的。 | Hai đại từ «他 / 我» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 村子里有一口老井。 | Từ «村子» bị cắt thành «村 / 子». | Loại khỏi bài | Rà soát ngữ pháp |
| 一个人在国外有时会觉得孤独。 | Cụm «在国 / 外» cắt ngang từ «国外». | Loại khỏi bài | Rà soát ngữ pháp |
| 她是经理的得力助手。 | Cụm «经理的得 / 力» cắt ngang từ «得力». | Loại khỏi bài | Rà soát ngữ pháp |
| 此刻我的心情很激动。 | «此刻» đứng sau chủ ngữ cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 寒冬里，他每天早上还去跑步。 | Chủ ngữ «他» đứng sau «每天早上» cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我从心底感谢你。 | Hai đại từ «我 / 你» đổi vai vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 北方的房子冬天都有暖气。 | «冬天» đứng đầu câu cũng đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 祝你一路一帆风顺！ | «一路一帆风顺» lặp ý, cách nói chuẩn là «一路顺风» hoặc «一帆风顺». (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 这条毛巾又柔软又舒服。 | Hai vế «又柔软 / 又舒服» đổi chỗ vẫn đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 今年房价上涨的幅度很大。 | «今年» đứng sau «房价» cũng đúng và tự nhiên. | Loại khỏi bài | Rà soát ngữ pháp |
| 请把文章的要点写下来。 | CC-CEDICT ghi «下来» là xià lai (thanh nhẹ), pinyin đang viết «xiàlái». (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 你近来身体怎么样？ | «近来» đứng trước chủ ngữ cũng đúng (hoặc «你身体近来怎么样»). | Loại khỏi bài | Rà soát ngữ pháp |
| 我们队在第一轮就被淘汰了。 | Trạng ngữ «在第一轮» đưa lên đầu câu vẫn chấp nhận được. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |

## Tổng kết

- Đã kiểm tra: 823 câu ứng viên, 20 từ cũ ngẫu nhiên.
- Đã sửa: 2 câu trong dữ liệu; loại 255 câu (có trật tự khác cũng đúng hoặc chia cụm sai).
- Chưa chắc chắn: các mục ghi «chưa chắc» đã được loại cho an toàn; còn lại xem mục cần quyết định chung.

## Các điểm đã được bạn xác nhận (16/11/2026, áp dụng cho toàn web)

| Vấn đề | Quyết định | Kết quả | Nguồn |
|---|---|---|---|
| 个 trong pinyin câu | thống nhất «ge» (thanh nhẹ) khi làm lượng từ | đã sửa 134 chỗ; giữ 各 gè, 一个个 yí gègè, 整个 zhěnggè | CC-CEDICT 个 ge4/ge5 |
| Thanh nhẹ của bổ ngữ xu hướng (出来, 起来, 下去, 过来…) | theo CC-CEDICT: thanh nhẹ khi làm bổ ngữ sau động từ; giữ thanh đầy đủ khi là động từ chính | đã sửa 55 chỗ | CC-CEDICT |
| Thanh nhẹ ở đầu mục từ HSK 3.0 | giữ pinyin đầu mục theo đề cương 2025; câu ví dụ theo CC-CEDICT | không đổi | đề cương 2025 |

Chi tiết từng chỗ sửa: [chuan-hoa-pinyin-thanh-nhe.md](chuan-hoa-pinyin-thanh-nhe.md).