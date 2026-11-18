# Kiểm tra nội dung – Luyện tập: Sửa câu sai (16/11/2026)

Chuẩn: **HSK cũ (HSK 2.0)** cấp 1–5 và **HSK 3.0** cấp 1–6. 220 câu sai được soạn mới cho web (mỗi câu đúng một lỗi, kèm câu đã sửa, pinyin, bản dịch, loại lỗi và giải thích), nằm trong `js/data/practice-fix-data.js`. Dễ/Vừa: chọn đoạn A–D chứa lỗi; Khó: chọn câu sai trong 4 câu (3 câu đúng lấy từ câu ví dụ của web cùng cấp).

## Phạm vi và kết quả

| Mục | Số lượng | Kết quả |
|---|---|---|
| Câu soạn mới | 220 | rà soát toàn bộ (người soạn tự kiểm + 2 người rà soát độc lập) |
| Kiểm tự động: 4 đoạn ghép đúng câu, chỗ khác nhau nằm trong đoạn sai, pinyin khớp số chữ và CC-CEDICT, từ vựng đúng cấp | 220 | đạt |
| Câu «sai» mà người bản ngữ có thể chấp nhận, hoặc sửa được ở đoạn khác | 13 | loại |
| Giải thích / bản dịch chưa chuẩn | 2 | đã sửa |
| Câu dùng trong bài | 207 (16–20 mỗi cấp) | |
| Giao diện máy tính, điện thoại, giao diện tối; không lỗi console | — | đạt |

Khi soạn, người soạn đã tự sửa 18 chỗ: thanh nhẹ ghi sai (哪里, 这里, 进去, 出去, 知道, 里), 10 câu dùng từ vượt cấp được viết lại, 4 câu dùng từ cấp 6 chuyển sang cấp 6.

20 từ cũ ngẫu nhiên (chữ, pinyin, Hán Việt, nghĩa, cấp HSK 2.0 so với danh sách chính thức): 年代, 如何, 厉害, 挂号, 和, 离, 及格, 茶, 演出, 权力, 连忙, 绕, 骄傲, 龙, 个人, 否认, 面对, 质量, 模仿, 幸运 — không lỗi.

## Kết quả rà soát độc lập

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 电影已经开始，我们快进去吧。 (h2-2-05) | "电影已经开始，我们快进去吧" không có 了 vẫn được nhiều người bản ngữ chấp nhận (nhất là văn viết), chính lời giải thích cũng chỉ nói 已经 "thường" đi với 了. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 今天我介绍你我的好朋友。 (h2-2-14) | Câu có thể sửa ở đoạn D thay vì C: 今天我介绍你认识我的好朋友 là câu tự nhiên, nên lỗi không chỉ nằm ở đoạn 介绍你. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我一到家才给你打电话。 (h2-3-11) | Bỏ 一 ở đoạn B (我到家才给你打电话) cũng cho câu đúng, nên câu có thể sửa ở đoạn khác ngoài đoạn C. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我想去商店买一件裤子。 (h2-3-13) | Lời giải thích nói 件 dùng cho "quần áo nói chung" nghe mâu thuẫn vì quần cũng là quần áo. (chưa chắc) | Đã sửa: Quần dùng lượng từ 条 (vật dài). 件 dùng cho áo (衬衫, 外套) và cho danh từ chung 衣服, không dùng cho quần. | Rà soát ngữ pháp |
| 即使很累，他就坚持跑完了。 (h2-4-03) | 即使 thường dùng cho giả định; câu đúng kể việc đã xảy ra (跑完了) nên 即使很累，他也坚持跑完了 hơi gượng, tự nhiên hơn là 尽管/虽然…还是. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 与其在家看电视，宁可出去走走。 (h2-5-02) | 与其…宁可… là cặp hô ứng có thật (现代汉语八百词 ghi 与其 đi với 不如/宁可/宁愿), nên câu sai không chắc là sai, và lời giải thích "宁可 đi với 也" chưa đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 这位作家的新小说很受到欢迎，很快就卖完了。 (h2-5-07) | "很受到欢迎" kém chuẩn nhưng xuất hiện khá nhiều trong văn nói/viết của người bản ngữ, nên không chắc bị coi là sai rõ ràng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 不是我不想帮你，但是我实在没有时间。 (h2-5-10) | "不是我不想帮你，但是我实在没有时间" khá phổ biến trong khẩu ngữ (tương đương 只是/可是), nhiều người bản ngữ chấp nhận. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 会议结束以后，所有的人去食堂吃饭了。 (h2-5-19) | Thiếu 都 sau 所有的人 làm câu kém tự nhiên nhưng không hẳn sai ngữ pháp; giải thích cũng chỉ nói "thường phải có 都". (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 我家有二个孩子。 (h2-2-01) | Câu phương án 这里卖水果 đúng ngữ pháp nhưng pinyin "Zhèli" sai theo CC-CEDICT (这里 zhe4 li3). (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |
| 那个国家的经济很发展，人们的生活水平很高。 (h2-5-14) | Câu phương án 学校明天选举新的学生会主席 đúng ngữ pháp nhưng pinyin 学生会 theo CC-CEDICT là xuésheng huì (sheng thanh nhẹ), không phải xuéshēnghuì. (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |
| 我很喜欢踢足球，想参加你们的球队。 (h3-4-10) | 参加 + tổ chức là cách dùng chuẩn (现代汉语词典: 参加 = 加入某种组织或某种活动, ví dụ 参加工会), nên 想参加你们的球队 không sai; giải thích '参加 chỉ dùng cho hoạt động' cũng không đúng. | Loại khỏi bài | Rà soát ngữ pháp |
| 我已经去过了北京，不想再去了。 (h3-3-19) | 去过了北京 (V过了 + tân ngữ) được nhiều người bản ngữ chấp nhận, nhất là khẩu ngữ, nên câu sai không đủ rõ ràng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 来中国以后，我们要努力提高自己的汉语。 (h3-5-04) | 提高(自己的)汉语 rất phổ biến trong khẩu ngữ của người bản ngữ (怎么提高汉语/英语), nên lỗi 'thiếu 水平' không đủ rõ ràng. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 经过这次谈话，他们俩的关系改进了很多。 (h3-5-07) | 关系改进 có xuất hiện trong văn báo chí (两国关系有所改进), nên câu sai có thể bị người bản ngữ chấp nhận; 改善 chỉ tự nhiên hơn. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 你太瘦了，应该吃多一点儿水果。 (h3-4-06) | 吃多一点儿 là cách nói phổ biến ở miền Nam Trung Quốc, Hồng Kông, Đông Nam Á; chỉ sai theo chuẩn phổ thông, không phải mọi người bản ngữ đều thấy sai. (chưa chắc) | Loại khỏi bài | Rà soát ngữ pháp |
| 在工作中，我们要尽量避免不出现同样的问题。 (h3-5-01) | Bản dịch 'tránh để cùng một vấn đề lặp lại' chưa tự nhiên và chưa sát nghĩa 同样的问题 (những vấn đề tương tự). (chưa chắc) | Đã sửa: Trong công việc, chúng ta phải cố gắng tránh để xảy ra những vấn đề tương tự. | Rà soát ngữ pháp |
| 我一下课才去找你。 (h3-3-03) | Pinyin phương án H2 看起来 viết 'kàn qǐlái'; theo CC-CEDICT 起来 làm bổ ngữ đọc thanh nhẹ (qǐlai). (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |
| 为了防止类似的事故不再发生，工厂加强了管理。 (h3-6-02) | Pinyin phương án H3 哭了起来 viết 'kū le qǐlái'; bổ ngữ 起来 nên đọc thanh nhẹ. (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |
| 出了问题，公司应该担任全部责任。 (h3-6-04) | Pinyin phương án H2 团结起来 viết 'tuánjié qǐlái'; bổ ngữ 起来 nên đọc thanh nhẹ. (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |
| 到目前为止，这个问题还没有解决了。 (h3-6-18) | Pinyin phương án H2 哭了起来 viết 'kū le qǐlái'; bổ ngữ 起来 nên đọc thanh nhẹ. (chưa chắc) | Giữ, thuộc mục quyết định chung (pinyin câu của web) | Rà soát ngữ pháp |

## Tổng kết

- Đã kiểm tra: 220 câu soạn mới + 3 câu đúng đi kèm mỗi câu ở mức Khó, 20 từ cũ ngẫu nhiên.
- Đã sửa: 2 (giải thích lượng từ 件/条, bản dịch câu 避免); loại 13 câu.
- Chưa chắc chắn: các mục «chưa chắc» đã được loại; pinyin câu của web (起来, 这里) thuộc mục quyết định chung.

## Các điểm đã được bạn xác nhận (16/11/2026, áp dụng cho toàn web)

| Vấn đề | Quyết định | Kết quả | Nguồn |
|---|---|---|---|
| 个 trong pinyin câu | thống nhất «ge» (thanh nhẹ) khi làm lượng từ | đã sửa 134 chỗ; giữ 各 gè, 一个个 yí gègè, 整个 zhěnggè | CC-CEDICT 个 ge4/ge5 |
| Thanh nhẹ của bổ ngữ xu hướng (出来, 起来, 下去, 过来…) | theo CC-CEDICT: thanh nhẹ khi làm bổ ngữ sau động từ; giữ thanh đầy đủ khi là động từ chính | đã sửa 55 chỗ | CC-CEDICT |
| Thanh nhẹ ở đầu mục từ HSK 3.0 | giữ pinyin đầu mục theo đề cương 2025; câu ví dụ theo CC-CEDICT | không đổi | đề cương 2025 |

Chi tiết từng chỗ sửa: [chuan-hoa-pinyin-thanh-nhe.md](chuan-hoa-pinyin-thanh-nhe.md).

## Cấp 6 (HSK 2.0) – bổ sung 18/11/2026

HSK 2.0 cấp 6 trước đây chưa có câu luyện (báo «Cấp này chưa có câu luyện»). Đã soạn mới 22 câu sai kiểu đề HSK 6 phần 病句, dùng từ cấp 6 (固然, 不料, 未免, 何必, 立场, 精通, 杰出, 钻研, 启示, 成本, 不由得…) cùng từ cấp thấp hơn; mã `h2-6-NN` trong `js/data/practice-fix-data.js`. Các câu này cũng vào phần 第一部分 (chọn câu có lỗi) của đề thi thử HSK 6, vì `exam.js` lấy câu HSK 2.0 cấp ≥ 4.

| Mục | Số lượng | Kết quả |
|---|---|---|
| Câu soạn mới | 22 | người soạn tự kiểm, sau đó rà soát lại như người rà soát thứ hai |
| Kiểm tự động (node): mã không trùng, đủ trường, 4 đoạn ghép đúng câu sai, chỗ khác nhau giữa câu sai và câu đúng nằm trong đoạn `bad`, số âm tiết pinyin khớp số chữ, câu đúng có dấu kết câu | 19 | đạt |
| Câu «sai» mà người bản ngữ có thể chấp nhận | 3 | loại |
| Câu dùng trong bài | 19 | |
| Mức Khó (3 câu đúng lấy từ câu ví dụ cấp 6) | 19 | mỗi câu đủ 3 câu đúng |
| Đề thi thử: câu cấp 6 trong kho «chọn câu có lỗi» | 19 / 92 | |

Phân bố loại lỗi (19 câu dùng): Dùng sai từ 4 (启事/启示, 何况/何必, 难免/未免, 果然/不料) · Kết hợp từ 3 (缩短成本, 造成习惯, 改善缺点) · Trật tự từ 3 (一致完全, 不仅 đặt trước chủ ngữ chung, 研究进一步) · Lặp ý/mâu thuẫn 3 (大约…左右, 不由得忍不住, 基本完全) · Liên từ 2 (固然…而且, 因此 thay cho 否则) · Phủ định sai 1 (不能否认他不是) · Thiếu thành phần 1 (那种刻苦钻研 thiếu 的精神) · Câu chữ 被 1 (被引起) · Giới từ 1 (被 thay cho 由). Hai nhãn «Lặp ý/mâu thuẫn» và «Phủ định sai» mới thêm cho kiểu lỗi 重复/语义矛盾 và 否定不当 của HSK 6.

Ví dụ:

| Câu sai | Đoạn sai | Câu đúng |
|---|---|---|
| 这个办法固然省钱，而且效果不太理想。 | C 而且 | 这个办法固然省钱，但是效果不太理想。 |
| 谁也不能否认他不是一位杰出的科学家。 | C 他不是 | 谁也不能否认他是一位杰出的科学家。 |
| 听了他的话，大家不由得忍不住笑了起来。 | C 不由得忍不住 | 听了他的话，大家不由得笑了起来。 |
| 为一点小事就发这么大的火，你这样做难免太过分了。 | D 难免太过分了 | …你这样做未免太过分了。 |

### Rà soát lần hai

| Câu | Vấn đề | Xử lý |
|---|---|---|
| 经过反复讨论，公司最终采取了他的建议。 (h2-6-02) | «采取…建议» vẫn gặp trong văn nói và văn viết của người bản ngữ, nên không chắc bị coi là sai. (chưa chắc) | Loại khỏi bài |
| 使用新系统以后，大家的工作效率明显增强了。 (h2-6-04) | «效率增强» kém chuẩn nhưng không hẳn sai; ngoài ra có thể sửa ở chỗ khác (效率 → 能力). (chưa chắc) | Loại khỏi bài |
| 这么重的箱子，大人尚且搬不动，况且是孩子呢？ (h2-6-21) | 况且 cũng mang nghĩa tăng tiến, có từ điển chấp nhận cách dùng gần với 何况, nên lỗi không đủ rõ. (chưa chắc) | Loại khỏi bài |
| 听了他的话，大家不由得忍不住笑了起来。 (h2-6-11) | Pinyin 起来 ghi «qilai» (thiếu thanh); theo quy ước của web, bổ ngữ 起来 ghi qǐlai. | Đã sửa: qǐlai |
| h2-6-08, h2-6-10, h2-6-18, h2-6-22 | Dùng từ ngoài danh sách HSK 2.0 (酒店, 座谈会, 社会各界, 基本上) trong khi có từ trong danh sách cùng nghĩa. | Đã đổi: 宾馆, 讲座, 全社会, 基本 |

Còn để ý (giữ lại): h2-6-06 (不仅他精通英语…) – theo ngữ pháp chuẩn, hai vế cùng chủ ngữ thì chủ ngữ đứng trước 不仅, nhưng trong khẩu ngữ đôi khi vẫn nghe 不仅他…; h2-6-10 (大约…左右) – lỗi lặp ý kinh điển của đề 病句, dù người bản ngữ vẫn hay nói. Nếu muốn chặt hơn có thể xoá hai dòng này.
