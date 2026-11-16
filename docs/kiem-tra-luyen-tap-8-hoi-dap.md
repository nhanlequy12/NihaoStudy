# Kiểm tra nội dung – Luyện tập: Hỏi đáp (16/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–5 và **HSK 3.0** cấp 1–6. 220 cặp hỏi–đáp soạn mới cho web (mỗi câu hỏi có 1 câu đáp hợp và 3 câu nhiễu kèm lý do không hợp), nằm trong `js/data/practice-qa-data.js`. Dễ: có pinyin và bản dịch; Vừa: chỉ chữ Hán, có gợi ý; Khó: nghe câu hỏi (giọng đọc của trình duyệt), chữ hiện sau khi trả lời.

## Phạm vi và kết quả

| Mục | Số lượng | Kết quả |
|---|---|---|
| Cặp hỏi–đáp soạn mới (1.100 câu tiếng Trung) | 220 | rà soát toàn bộ (người soạn tự kiểm + 2 người rà soát độc lập) |
| Kiểm tự động: mã không trùng, 4 phương án khác nhau và đúng 1 đáp án, đủ pinyin, dấu câu toàn khổ, từ vựng đúng cấp, pinyin so CC-CEDICT | 220 | đạt |
| Câu nhiễu có thể chấp nhận là câu đáp, hoặc câu đáp chưa sát | 7 | tắt |
| Bản dịch / giải thích chưa chuẩn | 8 | đã sửa |
| Câu dùng trong bài | 213 (18–20 mỗi cấp) | |
| Giao diện máy tính, điện thoại, giao diện tối, chế độ nghe; không lỗi console | — | đạt |

Khi soạn, người soạn đã tự sửa khoảng 70 chỗ: khoảng 55 từ vượt cấp được thay, 8 lỗi pinyin (打算, 后面, 好处, 学生会, 回来, 关上…), 8 câu nhiễu có thể hiểu là câu đáp.

20 từ cũ ngẫu nhiên (chữ, pinyin, Hán Việt, nghĩa, cấp HSK 2.0 so với danh sách chính thức): 鼓掌, 叫, 西瓜, 离开, 舍不得, 天真, 挥, 抱, 部门, 枪, 平衡, 组织, 关系, 他, 特意, 现实, 可以, 又, 贷款, 呀 — không lỗi.

## Kết quả rà soát độc lập

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 这件衣服多少钱？ (qa-hsk2-2-05) | Nếu câu hỏi là hỏi giá áo người kia đang mặc, nhiễu 是我妻子买的 là cách lảng tự nhiên (vợ mua nên không biết giá). (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 你为什么决定辞职？ (qa-hsk2-5-03) | Nhiễu 我在这家公司工作了整整八年 có thể hiểu là lý do ngầm (làm đủ lâu rồi, muốn đổi), nên vẫn đáp được câu hỏi vì sao nghỉ việc. (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 这个蛋糕甜不甜？ (qa-hsk2-3-02) | Bản dịch câu hỏi thừa chữ 'lắm' và lặp 'bánh ngọt… có ngọt', trong khi 甜不甜 chỉ hỏi có ngọt hay không. | Đã sửa: Cái bánh này có ngọt không? | Rà soát ngữ pháp / CC-CEDICT |
| 麻烦你帮我看一下行李，好吗？ (qa-hsk2-4-10) | Bản dịch nhiễu 3 'Hành lý là mẹ tôi sắp giúp' dễ hiểu nhầm 'sắp' là sắp sửa; 收拾 là thu xếp. | Đã sửa: Hành lý là mẹ tôi xếp giúp. | Rà soát ngữ pháp / CC-CEDICT |
| 你们公司一般怎么招聘新员工？ (qa-hsk2-5-08) | Giải thích nêu khung 先…，然后… nhưng câu đáp dùng 主要是…，然后…, không có 先. | Đã sửa: 怎么招聘 hỏi cách làm, nên đáp các bước: 主要是…，然后…. | Rà soát ngữ pháp / CC-CEDICT |
| 这份报告你什么时候能交给我？ (qa-hsk2-5-11) | 明天上午以前 nghĩa đen là 'trước buổi sáng mai', khác bản dịch 'trước trưa mai' và hơi lạ; người bản ngữ thường nói 明天中午以前. (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 你对这次活动的安排有什么意见？ (qa-hsk2-5-15) | 太紧了 là 'quá gấp/quá dày', bản dịch 'hơi dày' làm nhẹ đi nghĩa của 太. (chưa chắc) | Đã sửa: Nhìn chung là tốt, chỉ có điều thời gian xếp quá dày. | Rà soát ngữ pháp / CC-CEDICT |
| 我可以看看你的报纸吗？ (qa-hsk2-2-20) | Bản dịch 'Được, đây bạn.' nghe cụt và không tự nhiên trong tiếng Việt. (chưa chắc) | Đã sửa: Được, của bạn đây. | Rà soát ngữ pháp / CC-CEDICT |
| 明天会下雨吗？ (qa-hsk3-1-10) | Câu đáp 会，明天还很冷 chuyển sang chuyện lạnh, ý 'còn lạnh' không ăn nhập rõ với câu hỏi mưa; bản dịch 'mai còn lạnh nữa' cũng mơ hồ. (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 您好，请问您找谁？ (qa-hsk3-1-09) | Pinyin 中国人 viết 'Zhōngguó rén' ở đây nhưng 'Zhōngguórén' ở qa-hsk2-1-01 (và 'Yuènán rén' ở qa-hsk3-1-01), không thống nhất. (chưa chắc) | Giữ, thuộc mục quyết định chung | Rà soát ngữ pháp / CC-CEDICT |
| 你怎么换新手机了？ (qa-hsk3-4-04) | Nhiễu 我一般两年换一次 (tôi thường hai năm đổi một lần) là câu trả lời gián tiếp rất tự nhiên cho 你怎么换新手机了: đến hạn đổi theo thói quen chính là lý do. | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 这个方案还有没有改进的空间？ (qa-hsk3-6-17) | Nhiễu 这个方案是经过三次讨论才定下来的 có thể hiểu là lời đáp gián tiếp 'không còn chỗ cải tiến vì đã bàn kỹ ba lần'. (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 这件事你怎么不早告诉我？ (qa-hsk3-4-12) | Nhiễu 这件事小李也知道 có thể là lời thoái thác hợp lý (tưởng Tiểu Lý đã nói với bạn) khi bị trách 怎么不早告诉我. (chưa chắc) | Tắt (QA_OFF) | Rà soát ngữ pháp / CC-CEDICT |
| 外面下雨了吗？ (qa-hsk3-2-20) | Pinyin 出去 trong 我想出去走走 ghi chūqù, nhưng CC-CEDICT ghi khinh thanh chu1 qu5. (chưa chắc) | Giữ, thuộc mục quyết định chung | Rà soát ngữ pháp / CC-CEDICT |
| 你觉得这次考试难不难？ (qa-hsk3-3-09) | Pinyin 出来 trong 考试成绩下周出来 ghi chūlái, CC-CEDICT ghi chu1 lai5 (khinh thanh). (chưa chắc) | Giữ, thuộc mục quyết định chung | Rà soát ngữ pháp / CC-CEDICT |
| 这个洗衣机怎么用？ (qa-hsk3-4-14) | Pinyin 进去 trong 放进去 ghi jìnqù, CC-CEDICT ghi jin4 qu5 (khinh thanh), không nhất quán với huíqu/guòlai/xiàlai ở các câu khác. (chưa chắc) | Giữ, thuộc mục quyết định chung | Rà soát ngữ pháp / CC-CEDICT |
| 你觉得传统文化应该怎样传下去？ (qa-hsk3-6-11) | Pinyin 下去 trong 传下去 ghi xiàqù, CC-CEDICT ghi xia4 qu5 (khinh thanh). (chưa chắc) | Giữ, thuộc mục quyết định chung | Rà soát ngữ pháp / CC-CEDICT |
| 你家附近坐车方便吗？ (qa-hsk3-3-20) | Bản dịch nhiễu 'Nhà ở gần nhà tôi rất đắt' lủng củng, lặp 'nhà'. | Đã sửa: Nhà cửa quanh chỗ tôi ở rất đắt. | Rà soát ngữ pháp / CC-CEDICT |
| 为什么越来越多的人选择去农村生活？ (qa-hsk3-6-16) | Bản dịch đáp án 'áp lực ở thành phố lớn' dễ hiểu thành 'áp lực ở các thành phố lớn' (lớn bổ nghĩa cho thành phố); nhiễu 'một bản nhỏ trên núi' dùng 'bản' không hợp cho 山村 nói chung. (chưa chắc) | Đã sửa: Đáp án: 'Một mặt là ở thành phố áp lực lớn, mặt khác là môi trường nông thôn tốt hơn.'; nhiễu: 'Quê tôi ở một ngôi làng nhỏ trên núi.' | Rà soát ngữ pháp / CC-CEDICT |
| 你是在哪儿学的汉语？ (qa-hsk3-1-18) | 我是去年学的 dịch 'Tôi học từ năm ngoái' mang nghĩa 'bắt đầu từ năm ngoái đến nay', còn 是…的 chỉ thời điểm đã xảy ra. (chưa chắc) | Đã sửa: Tôi học hồi năm ngoái. | Rà soát ngữ pháp / CC-CEDICT |

## Tổng kết

- Đã kiểm tra: 220 cặp hỏi–đáp (1.100 câu), 20 từ cũ ngẫu nhiên.
- Đã sửa: 8 bản dịch/giải thích; tắt 7 câu.
- Chưa chắc chắn: các mục «chưa chắc» về câu nhiễu đã được tắt; thanh nhẹ thuộc mục quyết định chung.

## Các điểm đã được bạn xác nhận (16/11/2026, áp dụng cho toàn web)

| Vấn đề | Quyết định | Kết quả | Nguồn |
|---|---|---|---|
| 个 trong pinyin câu | thống nhất «ge» (thanh nhẹ) khi làm lượng từ | đã sửa 134 chỗ; giữ 各 gè, 一个个 yí gègè, 整个 zhěnggè | CC-CEDICT 个 ge4/ge5 |
| Thanh nhẹ của bổ ngữ xu hướng (出来, 起来, 下去, 过来…) | theo CC-CEDICT: thanh nhẹ khi làm bổ ngữ sau động từ; giữ thanh đầy đủ khi là động từ chính | đã sửa 55 chỗ | CC-CEDICT |
| Thanh nhẹ ở đầu mục từ HSK 3.0 | giữ pinyin đầu mục theo đề cương 2025; câu ví dụ theo CC-CEDICT | không đổi | đề cương 2025 |

Chi tiết từng chỗ sửa: [chuan-hoa-pinyin-thanh-nhe.md](chuan-hoa-pinyin-thanh-nhe.md).