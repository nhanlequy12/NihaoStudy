# Chuẩn hoá thanh nhẹ trong pinyin câu (toàn web)

Ngày: 16/11/2026. Bạn đã xác nhận («Đồng ý, sửa») ba quy tắc dưới đây. Chưa commit, chưa deploy.

## Quy tắc đã áp dụng

| Quy tắc | Áp dụng | Giữ nguyên | Nguồn |
|---|---|---|---|
| 个 làm lượng từ sau số từ, 这/那/哪, 几, 每, 半… ghi **ge** (thanh nhẹ) | 一个, 两个, 这个, 几个, 每个… | 各 (gè); 一个个 (yí gègè, từ láy); 整个 (zhěnggè, một từ); 个人, 个子, 个性, 个别, 个体 (từ riêng) | CC-CEDICT 個/个 ge4, ge5; quy ước của giáo trình phổ thông |
| 来/去 của bổ ngữ xu hướng kép đứng sau động từ (hoặc sau 不/得/了, sau tính từ với 起来/下来/下去) ghi **thanh nhẹ** | 拿出来 náchulai → ná chūlai, 看起来 kàn qǐlai, 哭了起来, 算不出来, 留下来, 持续下去, 绕不过去… | 出去/进来/回来… làm động từ chính sau trợ động từ, phó từ hoặc chủ ngữ (我出去一下, 想回去, 太阳出来了, 按顺序进去, 坐电梯上去, 黑夜过去); 这样下去 (không có động từ đứng trước) | CC-CEDICT (看起來 kan4 qi3 lai5…); khi từ ghép có trong CC-CEDICT thì theo đúng thanh của CC-CEDICT (接下来 jiēxiàlái giữ thanh 2) |
| Chữ Hán đầu mục từ HSK 3.0 | không đổi | pinyin đầu mục giữ theo đề cương HSK 3.0 (2025) | đề cương 2025 |

## Số liệu

| Hạng mục | Số chỗ |
|---|---|
| Câu/đoạn đã sửa (tổng) | 189 |
| trong đó có 个 → ge | 134 |
| trong đó có bổ ngữ 来/去 → thanh nhẹ | 55 |
| Câu không gióng được chữ–âm tiết nên không sửa tự động (đã soát tay: không còn chỗ cần sửa) | 3 |

Sau khi sửa, quét lại toàn bộ dữ liệu: không còn «số từ/đại từ chỉ thị + gè» (trừ 一个个), không còn bổ ngữ xu hướng sau động từ ghi thanh đầy đủ. Các chỗ còn ghi thanh đầy đủ đều là động từ chính (xem cột «Giữ nguyên»).

## Sửa kèm

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 我没有狗，我有一个猫。(bài đọc HSK 1 và bài hội thoại trong lessons.js) | Sai lượng từ: 猫 dùng 只; pinyin bài hội thoại lại ghi «yì zhī māo», không khớp chữ Hán | 我有一只猫 / yì zhī māo (cả hai nơi) | CC-CEDICT 猫: CL 只[zhi1] |
| Chép chính tả: chấm pinyin | Sau chuẩn hoá, người học gõ thanh gốc (gè, lái, qù) cho chữ đọc nhẹ sẽ bị chấm sai thanh | Chấp nhận cả thanh nhẹ và thanh gốc cho 个/来/去 đọc nhẹ; thanh khác vẫn báo sai | quy tắc trên |

## Kiểm tra sau khi sửa

- Build lại dữ liệu: 5334 từ cấp 1–6, 5562 từ cấp 7–9, 26 bài, 6 đề.
- check.py (toàn bộ từ cũ + HSK 3.0): 4702 mục, trùng khớp hoàn toàn với lần chạy trước, không phát sinh lỗi mới.
- Chạy thử 15 mục luyện tập (8 tính năng × 2 chuẩn; Mưa từ vựng chỉ có HSK cũ trong lần chạy này): đều vào được câu 1, không lỗi console.
- Chép chính tả: «yí ge» và «yí gè» đều đúng, «yí gě» báo sai thanh; «chūlai» và «chūlái» đều đúng, «chūlài» báo sai.

## Danh sách đầy đủ

| Từ/câu | Lỗi phát hiện | Đã sửa thành | Nguồn đối chiếu |
|---|---|---|---|
| 两个人 (phương án trong đề HSK 3.0 cấp 1) | pinyin phương án: «liǎng gè rén» | «liǎng ge rén» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我丈夫每个星期日都要洗车。 | pinyin câu: «Wǒ zhàngfu měi gè xīngqīrì dōu yào xǐ chē.» | «Wǒ zhàngfu měi ge xīngqīrì dōu yào xǐ chē.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 教室里一个人也没有。 | pinyin câu: «Jiàoshì lǐ yí gè rén yě méiyǒu.» | «Jiàoshì lǐ yí ge rén yě méiyǒu.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 上个星期我生病了，没有去上课。今天我去学校，同学们都来问我身体怎么样，我很高兴。 | pinyin câu: «…Shàng gè xīngqī wǒ shēngbìng le, méiyǒu qù shàn…» | «…Shàng ge xīngqī wǒ shēngbìng le, méiyǒu qù shàn…» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 可是办公室的打印机坏了，表打不出来。 | pinyin câu: «Kěshì bàngōngshì de dǎyìnjī huài le, biǎo dǎ bu chūlái.» | «Kěshì bàngōngshì de dǎyìnjī huài le, biǎo dǎ bu chūlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 秋天的时候，叶子一片一片地落下来，特别美。 | pinyin câu: «Qiūtiān de shíhou, yèzi yí piàn yí piàn de luò xiàlái, tèbié měi.» | «Qiūtiān de shíhou, yèzi yí piàn yí piàn de luò xiàlai, tèbié měi.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 家中有三个人。 | pinyin câu: «Jiā zhōng yǒu sān gè rén.» | «Jiā zhōng yǒu sān ge rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们班有十个女同学。 | pinyin câu: «Wǒmen bān yǒu shí gè nǚ tóngxué.» | «Wǒmen bān yǒu shí ge nǚ tóngxué.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们班有八个男同学。 | pinyin câu: «Wǒmen bān yǒu bā gè nán tóngxué.» | «Wǒmen bān yǒu bā ge nán tóngxué.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是第一个来的。 | pinyin câu: «Tā shì dì-yī gè lái de.» | «Tā shì dì-yī ge lái de.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我早上吃了两个蛋。 | pinyin câu: «Wǒ zǎoshang chī le liǎng gè dàn.» | «Wǒ zǎoshang chī le liǎng ge dàn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们小组有五个人。 | pinyin câu: «Wǒmen xiǎozǔ yǒu wǔ gè rén.» | «Wǒmen xiǎozǔ yǒu wǔ ge rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这个词有两个音节。 | pinyin câu: «Zhège cí yǒu liǎng gè yīnjié.» | «Zhège cí yǒu liǎng ge yīnjié.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 请你说下去。 | pinyin câu: «Qǐng nǐ shuō xiàqù.» | «Qǐng nǐ shuō xiàqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 我连续工作了十个小时。 | pinyin câu: «Wǒ liánxù gōngzuò le shí gè xiǎoshí.» | «Wǒ liánxù gōngzuò le shí ge xiǎoshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 一名男子走了进来。 | pinyin câu: «Yì míng nánzǐ zǒu le jìnlái.» | «Yì míng nánzǐ zǒu le jìnlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 飞机飞行了五个小时。 | pinyin câu: «Fēijī fēixíng le wǔ gè xiǎoshí.» | «Fēijī fēixíng le wǔ ge xiǎoshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 两个孩子在争玩具。 | pinyin câu: «Liǎng gè háizi zài zhēng wánjù.» | «Liǎng ge háizi zài zhēng wánjù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都有长处。 | pinyin câu: «Měi gè rén dōu yǒu chángchù.» | «Měi ge rén dōu yǒu chángchù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都有短处。 | pinyin câu: «Měi gè rén dōu yǒu duǎnchù.» | «Měi ge rén dōu yǒu duǎnchù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都应该知法守法。 | pinyin câu: «Měi gè rén dōu yīnggāi zhī fǎ shǒu fǎ.» | «Měi ge rén dōu yīnggāi zhī fǎ shǒu fǎ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 单靠一个人是做不完的。 | pinyin câu: «Dān kào yí gè rén shì zuò bu wán de.» | «Dān kào yí ge rén shì zuò bu wán de.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们班共有三十个学生。 | pinyin câu: «Wǒmen bān gòng yǒu sānshí gè xuésheng.» | «Wǒmen bān gòng yǒu sānshí ge xuésheng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他一个人吃了一盘饺子。 | pinyin câu: «Tā yí gè rén chī le yì pán jiǎozi.» | «Tā yí ge rén chī le yì pán jiǎozi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 明天我们有一个英语测试。 | pinyin câu: «Míngtiān wǒmen yǒu yí gè Yīngyǔ cèshì.» | «Míngtiān wǒmen yǒu yí ge Yīngyǔ cèshì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们家安了一个新空调。 | pinyin câu: «Wǒmen jiā ān le yí gè xīn kōngtiáo.» | «Wǒmen jiā ān le yí ge xīn kōngtiáo.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 一列火车从远处开过来了。 | pinyin câu: «Yí liè huǒchē cóng yuǎnchù kāi guòlái le.» | «Yí liè huǒchē cóng yuǎnchù kāi guòlai le.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 孩子一个人在黑暗中很害怕。 | pinyin câu: «Háizi yí gè rén zài hēi'àn zhōng hěn hàipà.» | «Háizi yí ge rén zài hēi'àn zhōng hěn hàipà.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这棵树很粗，两个人才抱得住。 | pinyin câu: «Zhè kē shù hěn cū, liǎng gè rén cái bào de zhù.» | «Zhè kē shù hěn cū, liǎng ge rén cái bào de zhù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 周末我和几个好友去爬山。 | pinyin câu: «Zhōumò wǒ hé jǐ gè hǎoyǒu qù pá shān.» | «Zhōumò wǒ hé jǐ ge hǎoyǒu qù pá shān.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们开了一个小型会议。 | pinyin câu: «Wǒmen kāi le yí gè xiǎoxíng huìyì.» | «Wǒmen kāi le yí ge xiǎoxíng huìyì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这本书的借阅期限是一个月。 | pinyin câu: «Zhè běn shū de jièyuè qīxiàn shì yí gè yuè.» | «Zhè běn shū de jièyuè qīxiàn shì yí ge yuè.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我每个月给父母汇一次钱。 | pinyin câu: «Wǒ měi gè yuè gěi fùmǔ huì yí cì qián.» | «Wǒ měi ge yuè gěi fùmǔ huì yí cì qián.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 在回家的途中，我遇到了一个老朋友。 | pinyin câu: «Zài huí jiā de túzhōng, wǒ yù dào le yí gè lǎo péngyou.» | «Zài huí jiā de túzhōng, wǒ yù dào le yí ge lǎo péngyou.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 专家们到农村考察了一个星期。 | pinyin câu: «Zhuānjiāmen dào nóngcūn kǎochá le yí gè xīngqī.» | «Zhuānjiāmen dào nóngcūn kǎochá le yí ge xīngqī.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我上个月去了一趟北京。 | pinyin câu: «Wǒ shàng gè yuè qù le yí tàng Běijīng.» | «Wǒ shàng ge yuè qù le yí tàng Běijīng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 英语有二十六个字母。 | pinyin câu: «Yīngyǔ yǒu èrshíliù gè zìmǔ.» | «Yīngyǔ yǒu èrshíliù ge zìmǔ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我刚收到一个快递。 | pinyin câu: «Wǒ gāng shōu dào yí gè kuàidì.» | «Wǒ gāng shōu dào yí ge kuàidì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是一个品德高尚的人。 | pinyin câu: «Tā shì yí gè pǐndé gāoshàng de rén.» | «Tā shì yí ge pǐndé gāoshàng de rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都是独立的个体。 | pinyin câu: «Měi gè rén dōu shì dúlì de gètǐ.» | «Měi ge rén dōu shì dúlì de gètǐ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 一年分为四个季节。 | pinyin câu: «Yì nián fēnwéi sì gè jìjié.» | «Yì nián fēnwéi sì ge jìjié.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 新郎今天看起来特别帅。 | pinyin câu: «Xīnláng jīntiān kàn qǐlái tèbié shuài.» | «Xīnláng jīntiān kàn qǐlai tèbié shuài.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 孩子手里拿着一个红气球。 | pinyin câu: «Háizi shǒulǐ ná zhe yí gè hóng qìqiú.» | «Háizi shǒulǐ ná zhe yí ge hóng qìqiú.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这两个人物的性格特点很鲜明。 | pinyin câu: «Zhè liǎng gè rénwù de xìnggé tèdiǎn hěn xiānmíng.» | «Zhè liǎng ge rénwù de xìnggé tèdiǎn hěn xiānmíng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 学校下个月要开运动会。 | pinyin câu: «Xuéxiào xià gè yuè yào kāi yùndònghuì.» | «Xuéxiào xià ge yuè yào kāi yùndònghuì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我们先制订一个学习计划。 | pinyin câu: «Wǒmen xiān zhìdìng yí gè xuéxí jìhuà.» | «Wǒmen xiān zhìdìng yí ge xuéxí jìhuà.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 牙刷最好三个月换一次。 | pinyin câu: «Yáshuā zuìhǎo sān gè yuè huàn yí cì.» | «Yáshuā zuìhǎo sān ge yuè huàn yí cì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我报了一个英语培训班。 | pinyin câu: «Wǒ bào le yí gè Yīngyǔ péixùnbān.» | «Wǒ bào le yí ge Yīngyǔ péixùnbān.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这个箱子下面有四个轮子。 | pinyin câu: «Zhège xiāngzi xiàmiàn yǒu sì gè lúnzi.» | «Zhège xiāngzi xiàmiàn yǒu sì ge lúnzi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这门课有三个学分。 | pinyin câu: «Zhè mén kè yǒu sān gè xuéfēn.» | «Zhè mén kè yǒu sān ge xuéfēn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 病好以后，他去海边疗养了一个月。 | pinyin câu: «Bìng hǎo yǐhòu, tā qù hǎibiān liáoyǎng le yí gè yuè.» | «Bìng hǎo yǐhòu, tā qù hǎibiān liáoyǎng le yí ge yuè.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 坐高铁去上海只要五个小时。 | pinyin câu: «Zuò gāotiě qù Shànghǎi zhǐ yào wǔ gè xiǎoshí.» | «Zuò gāotiě qù Shànghǎi zhǐ yào wǔ ge xiǎoshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这门课一共三十二个学时。 | pinyin câu: «Zhè mén kè yígòng sānshí'èr gè xuéshí.» | «Zhè mén kè yígòng sānshí'èr ge xuéshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我下个月要去旅游。 | pinyin câu: «Wǒ xià gè yuè yào qù lǚyóu.» | «Wǒ xià ge yuè yào qù lǚyóu.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他赢了一场比赛就狂起来了。 | pinyin câu: «Tā yíng le yì chǎng bǐsài jiù kuáng qǐlái le.» | «Tā yíng le yì chǎng bǐsài jiù kuáng qǐlai le.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这座桥连接着两个城市。 | pinyin câu: «Zhè zuò qiáo liánjiē zhe liǎng gè chéngshì.» | «Zhè zuò qiáo liánjiē zhe liǎng ge chéngshì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我看出来他今天心情不好。 | pinyin câu: «Wǒ kàn chūlái tā jīntiān xīnqíng bù hǎo.» | «Wǒ kàn chūlai tā jīntiān xīnqíng bù hǎo.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这无疑是一个好消息。 | pinyin câu: «Zhè wúyí shì yí gè hǎo xiāoxi.» | «Zhè wúyí shì yí ge hǎo xiāoxi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他一个月能挣一万块钱。 | pinyin câu: «Tā yí gè yuè néng zhèng yíwàn kuài qián.» | «Tā yí ge yuè néng zhèng yíwàn kuài qián.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 有问题就大胆地说出来。 | pinyin câu: «Yǒu wèntí jiù dàdǎn de shuō chūlái.» | «Yǒu wèntí jiù dàdǎn de shuō chūlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他看起来四十岁上下。 | pinyin câu: «Tā kàn qǐlái sìshí suì shàngxià.» | «Tā kàn qǐlai sìshí suì shàngxià.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 她每天晚上都练一个小时琴。 | pinyin câu: «Tā měi tiān wǎnshang dōu liàn yí gè xiǎoshí qín.» | «Tā měi tiān wǎnshang dōu liàn yí ge xiǎoshí qín.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是一个难得的机会。 | pinyin câu: «Zhè shì yí gè nándé de jīhuì.» | «Zhè shì yí ge nándé de jīhuì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这些鸡蛋按大小分成三个等级。 | pinyin câu: «Zhèxiē jīdàn àn dàxiǎo fēn chéng sān gè děngjí.» | «Zhèxiē jīdàn àn dàxiǎo fēn chéng sān ge děngjí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 包括我在内，一共有八个人。 | pinyin câu: «Bāokuò wǒ zàinèi, yígòng yǒu bā gè rén.» | «Bāokuò wǒ zàinèi, yígòng yǒu bā ge rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 两个孩子在学校打架了。 | pinyin câu: «Liǎng gè háizi zài xuéxiào dǎjià le.» | «Liǎng ge háizi zài xuéxiào dǎjià le.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 老年人是一个需要关心的群体。 | pinyin câu: «Lǎoniánrén shì yí gè xūyào guānxīn de qúntǐ.» | «Lǎoniánrén shì yí ge xūyào guānxīn de qúntǐ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他每个周末都进城里买东西。 | pinyin câu: «Tā měi gè zhōumò dōu jìn chénglǐ mǎi dōngxi.» | «Tā měi ge zhōumò dōu jìn chénglǐ mǎi dōngxi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他胆很小，晚上不敢一个人出门。 | pinyin câu: «Tā dǎn hěn xiǎo, wǎnshang bù gǎn yí gè rén chūmén.» | «Tā dǎn hěn xiǎo, wǎnshang bù gǎn yí ge rén chūmén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 学习是一个人终身的事。 | pinyin câu: «Xuéxí shì yí gè rén zhōngshēn de shì.» | «Xuéxí shì yí ge rén zhōngshēn de shì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他每个星期都买彩票。 | pinyin câu: «Tā měi gè xīngqī dōu mǎi cǎipiào.» | «Tā měi ge xīngqī dōu mǎi cǎipiào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 老师把我们分成了四个小组。 | pinyin câu: «Lǎoshī bǎ wǒmen fēnchéng le sì gè xiǎozǔ.» | «Lǎoshī bǎ wǒmen fēnchéng le sì ge xiǎozǔ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 一个人的内在美更重要。 | pinyin câu: «Yí gè rén de nèizài měi gèng zhòngyào.» | «Yí ge rén de nèizài měi gèng zhòngyào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 学校网站上发了一个公告。 | pinyin câu: «Xuéxiào wǎngzhàn shang fā le yí gè gōnggào.» | «Xuéxiào wǎngzhàn shang fā le yí ge gōnggào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他第一个跑到了终点。 | pinyin câu: «Tā dì yī gè pǎo dào le zhōngdiǎn.» | «Tā dì yī ge pǎo dào le zhōngdiǎn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 因为下大雨，比赛中断了半个小时。 | pinyin câu: «Yīnwèi xià dà yǔ, bǐsài zhōngduàn le bàn gè xiǎoshí.» | «Yīnwèi xià dà yǔ, bǐsài zhōngduàn le bàn ge xiǎoshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这可不是一个小数目。 | pinyin câu: «Zhè kě bú shì yí gè xiǎo shùmù.» | «Zhè kě bú shì yí ge xiǎo shùmù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我下个礼拜要去出差。 | pinyin câu: «Wǒ xià gè lǐbài yào qù chūchāi.» | «Wǒ xià ge lǐbài yào qù chūchāi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 外面的雨下个不停。 | pinyin câu: «Wàimiàn de yǔ xià gè bùtíng.» | «Wàimiàn de yǔ xià ge bùtíng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他在路上拾到一个钱包。 | pinyin câu: «Tā zài lù shang shí dào yí gè qiánbāo.» | «Tā zài lù shang shí dào yí ge qiánbāo.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 公司每个月给员工交通补贴。 | pinyin câu: «Gōngsī měi gè yuè gěi yuángōng jiāotōng bǔtiē.» | «Gōngsī měi ge yuè gěi yuángōng jiāotōng bǔtiē.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他正在研究一个新课题。 | pinyin câu: «Tā zhèngzài yánjiū yí gè xīn kètí.» | «Tā zhèngzài yánjiū yí ge xīn kètí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个公民都应该依法纳税。 | pinyin câu: «Měi gè gōngmín dōu yīnggāi yīfǎ nàshuì.» | «Měi ge gōngmín dōu yīnggāi yīfǎ nàshuì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他先后去过十几个国家。 | pinyin câu: «Tā xiānhòu qù guo shí jǐ gè guójiā.» | «Tā xiānhòu qù guo shí jǐ ge guójiā.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 早饭我吃了一个火腿三明治。 | pinyin câu: «Zǎofàn wǒ chī le yí gè huǒtuǐ sānmíngzhì.» | «Zǎofàn wǒ chī le yí ge huǒtuǐ sānmíngzhì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他的神情看起来很紧张。 | pinyin câu: «Tā de shénqíng kàn qǐlái hěn jǐnzhāng.» | «Tā de shénqíng kàn qǐlai hěn jǐnzhāng.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 酒店里有一个大游泳池。 | pinyin câu: «Jiǔdiàn lǐ yǒu yí gè dà yóuyǒngchí.» | «Jiǔdiàn lǐ yǒu yí ge dà yóuyǒngchí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这道题我解不出来。 | pinyin câu: «Zhè dào tí wǒ jiě bù chūlái.» | «Zhè dào tí wǒ jiě bù chūlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 药片太大，我吞不下去。 | pinyin câu: «Yàopiàn tài dà, wǒ tūn bú xiàqù.» | «Yàopiàn tài dà, wǒ tūn bú xiàqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 听到这个消息，她不禁哭了起来。 | pinyin câu: «Tīngdào zhège xiāoxi, tā bùjīn kū le qǐlái.» | «Tīngdào zhège xiāoxi, tā bùjīn kū le qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他这几年阔起来了。 | pinyin câu: «Tā zhè jǐ nián kuò qǐlái le.» | «Tā zhè jǐ nián kuò qǐlai le.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 没有车了，我们只得走回去。 | pinyin câu: «Méiyǒu chē le, wǒmen zhǐdé zǒu huíqù.» | «Méiyǒu chē le, wǒmen zhǐdé zǒu huíqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这个政策先在三个城市试点。 | pinyin câu: «Zhège zhèngcè xiān zài sān gè chéngshì shìdiǎn.» | «Zhège zhèngcè xiān zài sān ge chéngshì shìdiǎn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 母鸡每天下一个蛋。 | pinyin câu: «Mǔjī měi tiān xià yí gè dàn.» | «Mǔjī měi tiān xià yí ge dàn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 人工智能是一个新兴行业。 | pinyin câu: «Réngōng zhìnéng shì yí gè xīnxīng hángyè.» | «Réngōng zhìnéng shì yí ge xīnxīng hángyè.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 坐快车两个小时就到。 | pinyin câu: «Zuò kuàichē liǎng gè xiǎoshí jiù dào.» | «Zuò kuàichē liǎng ge xiǎoshí jiù dào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是一个少儿节目。 | pinyin câu: «Zhè shì yí gè shào'ér jiémù.» | «Zhè shì yí ge shào'ér jiémù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 总统下个月将出访欧洲。 | pinyin câu: «Zǒngtǒng xià gè yuè jiāng chūfǎng Ōuzhōu.» | «Zǒngtǒng xià ge yuè jiāng chūfǎng Ōuzhōu.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 老师给我们讲了一个真实的案例。 | pinyin câu: «Lǎoshī gěi wǒmen jiǎng le yí gè zhēnshí de ànlì.» | «Lǎoshī gěi wǒmen jiǎng le yí ge zhēnshí de ànlì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这场战役持续了三个月。 | pinyin câu: «Zhè chǎng zhànyì chíxù le sān gè yuè.» | «Zhè chǎng zhànyì chíxù le sān ge yuè.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他一个人坐在窗前发呆。 | pinyin câu: «Tā yí gè rén zuò zài chuāng qián fādāi.» | «Tā yí ge rén zuò zài chuāng qián fādāi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是三个月工资的总和。 | pinyin câu: «Zhè shì sān gè yuè gōngzī de zǒnghé.» | «Zhè shì sān ge yuè gōngzī de zǒnghé.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是一个英明的决定。 | pinyin câu: «Zhè shì yí gè yīngmíng de juédìng.» | «Zhè shì yí ge yīngmíng de juédìng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我只记得电影的几个片断。 | pinyin câu: «Wǒ zhǐ jìde diànyǐng de jǐ gè piànduàn.» | «Wǒ zhǐ jìde diànyǐng de jǐ ge piànduàn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是一个胸怀宽广的人。 | pinyin câu: «Tā shì yí gè xiōnghuái kuānguǎng de rén.» | «Tā shì yí ge xiōnghuái kuānguǎng de rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 坐十几个小时的火车真受罪。 | pinyin câu: «Zuò shí jǐ gè xiǎoshí de huǒchē zhēn shòuzuì.» | «Zuò shí jǐ ge xiǎoshí de huǒchē zhēn shòuzuì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 读书可以改变一个人的世界观。 | pinyin câu: «Dúshū kěyǐ gǎibiàn yí gè rén de shìjièguān.» | «Dúshū kěyǐ gǎibiàn yí ge rén de shìjièguān.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 那是一个愚昧落后的时代。 | pinyin câu: «Nà shì yí gè yúmèi luòhòu de shídài.» | «Nà shì yí ge yúmèi luòhòu de shídài.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是一个很有才干的年轻人。 | pinyin câu: «Tā shì yí gè hěn yǒu cáigàn de niánqīngrén.» | «Tā shì yí ge hěn yǒu cáigàn de niánqīngrén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他在一个小乡镇长大。 | pinyin câu: «Tā zài yí gè xiǎo xiāngzhèn zhǎngdà.» | «Tā zài yí ge xiǎo xiāngzhèn zhǎngdà.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是一个很有上进心的年轻人。 | pinyin câu: «Tā shì yí gè hěn yǒu shàngjìnxīn de niánqīngrén.» | «Tā shì yí ge hěn yǒu shàngjìnxīn de niánqīngrén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 祝你有一个锦绣前程！ | pinyin câu: «Zhù nǐ yǒu yí gè jǐnxiùqiánchéng!» | «Zhù nǐ yǒu yí ge jǐnxiùqiánchéng!» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 不能只看一个人的外表。 | pinyin câu: «Bù néng zhǐ kàn yí gè rén de wàibiǎo.» | «Bù néng zhǐ kàn yí ge rén de wàibiǎo.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 那几个流氓又来闹事了。 | pinyin câu: «Nà jǐ gè liúmáng yòu lái nàoshì le.» | «Nà jǐ ge liúmáng yòu lái nàoshì le.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他们请了一个保姆照顾孩子。 | pinyin câu: «Tāmen qǐng le yí gè bǎomǔ zhàogù háizi.» | «Tāmen qǐng le yí ge bǎomǔ zhàogù háizi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都有自己的尊严。 | pinyin câu: «Měi gè rén dōu yǒu zìjǐ de zūnyán.» | «Měi ge rén dōu yǒu zìjǐ de zūnyán.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 签合同前要看清每一个条款。 | pinyin câu: «Qiān hétong qián yào kàn qīng měi yí gè tiáokuǎn.» | «Qiān hétong qián yào kàn qīng měi yí ge tiáokuǎn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是一个愚蠢的决定。 | pinyin câu: «Zhè shì yí gè yúchǔn de juédìng.» | «Zhè shì yí ge yúchǔn de juédìng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我需要一个确切的时间。 | pinyin câu: «Wǒ xūyào yí gè quèqiè de shíjiān.» | «Wǒ xūyào yí ge quèqiè de shíjiān.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他来自一个遥远的国家。 | pinyin câu: «Tā láizì yí gè yáoyuǎn de guójiā.» | «Tā láizì yí ge yáoyuǎn de guójiā.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他出生在一个贵族家庭。 | pinyin câu: «Tā chūshēng zài yí gè guìzú jiātíng.» | «Tā chūshēng zài yí ge guìzú jiātíng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是一个庞大的计划。 | pinyin câu: «Zhè shì yí gè pángdà de jìhuà.» | «Zhè shì yí ge pángdà de jìhuà.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 请给我一个书面答复。 | pinyin câu: «Qǐng gěi wǒ yí gè shūmiàn dáfù.» | «Qǐng gěi wǒ yí ge shūmiàn dáfù.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人都有自己的弱点。 | pinyin câu: «Měi gè rén dōu yǒu zìjǐ de ruòdiǎn.» | «Měi ge rén dōu yǒu zìjǐ de ruòdiǎn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他在纸上画了一个三角。 | pinyin câu: «Tā zài zhǐ shàng huà le yí gè sānjiǎo.» | «Tā zài zhǐ shàng huà le yí ge sānjiǎo.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 作者成功地塑造了一个英雄形象。 | pinyin câu: «Zuòzhě chénggōng de sùzào le yí gè yīngxióng xíngxiàng.» | «Zuòzhě chénggōng de sùzào le yí ge yīngxióng xíngxiàng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 新规定从下个月起生效。 | pinyin câu: «Xīn guīdìng cóng xià gè yuè qǐ shēngxiào.» | «Xīn guīdìng cóng xià ge yuè qǐ shēngxiào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 国防对一个国家很重要。 | pinyin câu: «Guófáng duì yí gè guójiā hěn zhòngyào.» | «Guófáng duì yí ge guójiā hěn zhòngyào.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他是一个值得信赖的人。 | pinyin câu: «Tā shì yí gè zhídé xìnlài de rén.» | «Tā shì yí ge zhídé xìnlài de rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 她生育了两个孩子。 | pinyin câu: «Tā shēngyù le liǎng gè háizi.» | «Tā shēngyù le liǎng ge háizi.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 两个队又较量了一次。 | pinyin câu: «Liǎng gè duì yòu jiàoliàng le yí cì.» | «Liǎng ge duì yòu jiàoliàng le yí cì.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个国家都要保护自己的领土。 | pinyin câu: «Měi gè guójiā dōu yào bǎohù zìjǐ de lǐngtǔ.» | «Měi ge guójiā dōu yào bǎohù zìjǐ de lǐngtǔ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他每个月都储蓄一部分工资。 | pinyin câu: «Tā měi gè yuè dōu chǔxù yí bùfen gōngzī.» | «Tā měi ge yuè dōu chǔxù yí bùfen gōngzī.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 请把文章的要点写下来。 | pinyin câu: «Qǐng bǎ wénzhāng de yàodiǎn xiě xiàlái.» | «Qǐng bǎ wénzhāng de yàodiǎn xiě xiàlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 公司从一百人中筛选出五个人。 | pinyin câu: «Gōngsī cóng yìbǎi rén zhōng shāixuǎn chū wǔ gè rén.» | «Gōngsī cóng yìbǎi rén zhōng shāixuǎn chū wǔ ge rén.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 小狗叼着一个球跑过来。 | pinyin câu: «Xiǎo gǒu diāo zhe yí ge qiú pǎo guòlái.» | «Xiǎo gǒu diāo zhe yí ge qiú pǎo guòlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 每个地方都有自己的习俗。 | pinyin câu: «Měi gè dìfang dōu yǒu zìjǐ de xísú.» | «Měi ge dìfang dōu yǒu zìjǐ de xísú.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 她拣了几个最红的苹果。 | pinyin câu: «Tā jiǎn le jǐ gè zuì hóng de píngguǒ.» | «Tā jiǎn le jǐ ge zuì hóng de píngguǒ.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这是历史遗留下来的问题。 | pinyin câu: «Zhè shì lìshǐ yíliú xiàlái de wèntí.» | «Zhè shì lìshǐ yíliú xiàlai de wèntí.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他看起来很疲倦。 | pinyin câu: «Tā kàn qǐlái hěn píjuàn.» | «Tā kàn qǐlai hěn píjuàn.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 两次吃药要间隔四个小时。 | pinyin câu: «Liǎng cì chī yào yào jiàngé sì gè xiǎoshí.» | «Liǎng cì chī yào yào jiàngé sì ge xiǎoshí.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他和小偷搏斗了起来。 | pinyin câu: «Tā hé xiǎotōu bódòu le qǐlái.» | «Tā hé xiǎotōu bódòu le qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 你把这两个字的顺序写颠倒了。 | pinyin câu: «Nǐ bǎ zhè liǎng gè zì de shùnxù xiě diāndǎo le.» | «Nǐ bǎ zhè liǎng ge zì de shùnxù xiě diāndǎo le.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个国家都有自己的主权。 | pinyin câu: «Měi gè guójiā dōu yǒu zìjǐ de zhǔquán.» | «Měi ge guójiā dōu yǒu zìjǐ de zhǔquán.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 不要混淆这两个概念。 | pinyin câu: «Bú yào hùnxiáo zhè liǎng gè gàiniàn.» | «Bú yào hùnxiáo zhè liǎng ge gàiniàn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 门口悬挂着两个红灯笼。 | pinyin câu: «Ménkǒu xuánguà zhe liǎng gè hóng dēnglong.» | «Ménkǒu xuánguà zhe liǎng ge hóng dēnglong.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 居民们自发组织起来打扫街道。 | pinyin câu: «Jūmínmen zìfā zǔzhī qǐlái dǎsǎo jiēdào.» | «Jūmínmen zìfā zǔzhī qǐlai dǎsǎo jiēdào.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这两个部门的工作有些重叠。 | pinyin câu: «Zhè liǎng gè bùmén de gōngzuò yǒuxiē chóngdié.» | «Zhè liǎng ge bùmén de gōngzuò yǒuxiē chóngdié.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这种油是从植物中提炼出来的。 | pinyin câu: «Zhè zhǒng yóu shì cóng zhíwù zhōng tíliàn chūlái de.» | «Zhè zhǒng yóu shì cóng zhíwù zhōng tíliàn chūlai de.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他们靠自力更生发展起来。 | pinyin câu: «Tāmen kào zìlìgēngshēng fāzhǎn qǐlái.» | «Tāmen kào zìlìgēngshēng fāzhǎn qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 每个公民都要依法缴纳税款。 | pinyin câu: «Měi gè gōngmín dōu yào yīfǎ jiǎonà shuìkuǎn.» | «Měi ge gōngmín dōu yào yīfǎ jiǎonà shuìkuǎn.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 这个党内有好几个派别。 | pinyin câu: «Zhège dǎng nèi yǒu hǎo jǐ gè pàibié.» | «Zhège dǎng nèi yǒu hǎo jǐ ge pàibié.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 每个人的审美都不一样。 | pinyin câu: «Měi gè rén de shěnměi dōu bù yíyàng.» | «Měi ge rén de shěnměi dōu bù yíyàng.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 那条狗看起来很凶恶。 | pinyin câu: «Nà tiáo gǒu kàn qǐlái hěn xiōng'è.» | «Nà tiáo gǒu kàn qǐlai hěn xiōng'è.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 两个队的水平不相上下。 | pinyin câu: «Liǎng gè duì de shuǐpíng bùxiāngshàngxià.» | «Liǎng ge duì de shuǐpíng bùxiāngshàngxià.» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 他今天看起来无精打采的。 | pinyin câu: «Tā jīntiān kàn qǐlái wújīngdǎcǎi de.» | «Tā jīntiān kàn qǐlai wújīngdǎcǎi de.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这个数太大了，我算不出来。 | pinyin câu: «Zhège shù tài dà le, wǒ suàn bu chūlái.» | «Zhège shù tài dà le, wǒ suàn bu chūlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这台机器操作起来很简单。 | pinyin câu: «Zhè tái jīqì cāozuò qǐlái hěn jiǎndān.» | «Zhè tái jīqì cāozuò qǐlai hěn jiǎndān.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 只要大家团结起来，就没有困难。 | pinyin câu: «Zhǐyào dàjiā tuánjié qǐlái, jiù méiyǒu kùnnan.» | «Zhǐyào dàjiā tuánjié qǐlai, jiù méiyǒu kùnnan.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 天太冷，车发动不起来。 | pinyin câu: «Tiān tài lěng, chē fādòng bu qǐlái.» | «Tiān tài lěng, chē fādòng bu qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他把球高高地抛了起来。 | pinyin câu: «Tā bǎ qiú gāogāo de pāole qǐlái.» | «Tā bǎ qiú gāogāo de pāole qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 孩子一看见妈妈就扑了过去。 | pinyin câu: «Háizi yí kànjiàn māma jiù pūle guòqù.» | «Háizi yí kànjiàn māma jiù pūle guòqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 这些水果是用飞机运送过来的。 | pinyin câu: «Zhèxiē shuǐguǒ shì yòng fēijī yùnsòng guòlái de.» | «Zhèxiē shuǐguǒ shì yòng fēijī yùnsòng guòlai de.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 太阳慢慢从海面上升起来。 | pinyin câu: «Tàiyáng mànmàn cóng hǎimiàn shang shēng qǐlái.» | «Tàiyáng mànmàn cóng hǎimiàn shang shēng qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他的故事被后人传了下来。 | pinyin câu: «Tā de gùshi bèi hòurén chuánle xiàlái.» | «Tā de gùshi bèi hòurén chuánle xiàlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 传统文化需要一代代传承下去。 | pinyin câu: «Chuántǒng wénhuà xūyào yí dài dài chuánchéng xiàqù.» | «Chuántǒng wénhuà xūyào yí dài dài chuánchéng xiàqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 她看起来很年轻。 | pinyin câu: «Tā kàn qǐlái hěn niánqīng.» | «Tā kàn qǐlai hěn niánqīng.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 她看起来很年轻。 | pinyin câu: «Tā kàn qǐlái hěn niánqīng.» | «Tā kàn qǐlai hěn niánqīng.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 那你今天按时把报告交上来。 | pinyin câu: «Nà nǐ jīntiān ànshí bǎ bàogào jiāo shànglái.» | «Nà nǐ jīntiān ànshí bǎ bàogào jiāo shànglai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他激动得连话都说不出来了。 | pinyin câu: «Tā jīdòng de lián huà dōu shuō bu chūlái le.» | «Tā jīdòng de lián huà dōu shuō bu chūlai le.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 你怎么了？看起来很伤心。 | pinyin câu: «Nǐ zěnme le? Kàn qǐlái hěn shāngxīn.» | «Nǐ zěnme le? Kàn qǐlai hěn shāngxīn.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 不行，我不得不留下来加班。 | pinyin câu: «Bùxíng, wǒ bùdébù liú xiàlái jiābān.» | «Bùxíng, wǒ bùdébù liú xiàlai jiābān.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 小王是一个大学生，专业是文学。他从小就喜欢读诗，特别是古典的诗。他觉得这些作品的语言很优美，描写也很生动，念起来像音… | pinyin câu: «…zuòpǐn: yǒude hěn chōuxiàng, kàn bu chūlái shì shénme; yǒude hěn shēngdòng, xiàn…» | «…zuòpǐn: yǒude hěn chōuxiàng, kàn bu chūlai shì shénme; yǒude hěn shēngdòng, xiàn…» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 我们委托了一家中介公司，方案已经交上去了。 | pinyin câu: «Wǒmen wěituō le yì jiā zhōngjiè gōngsī, fāng'àn yǐjīng jiāo shàngqù le.» | «Wǒmen wěituō le yì jiā zhōngjiè gōngsī, fāng'àn yǐjīng jiāo shàngqu le.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 后面有人挡着，我绕不过去。 | pinyin câu: «Hòumiàn yǒu rén dǎng zhe, wǒ rào bu guòqù.» | «Hòumiàn yǒu rén dǎng zhe, wǒ rào bu guòqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 希望这种变化能持续下去。 | pinyin câu: «Xīwàng zhè zhǒng biànhuà néng chíxù xiàqù.» | «Xīwàng zhè zhǒng biànhuà néng chíxù xiàqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 学生们 纷纷 站 起来 回答 问题 | pinyin câu: «Xuéshengmen fēnfēn zhàn qǐlái huídá wèntí.» | «Xuéshengmen fēnfēn zhàn qǐlai huídá wèntí.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他笑了一阵，接着又哭了起来。 | pinyin câu: «Tā xiào le yí zhèn, jiēzhe yòu kū le qǐlái.» | «Tā xiào le yí zhèn, jiēzhe yòu kū le qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 听到这个笑话，我忍不住笑了起来。 | pinyin câu: «Tīng dào zhège xiàohuà, wǒ rěnbuzhù xiào le qǐlái.» | «Tīng dào zhège xiàohuà, wǒ rěnbuzhù xiào le qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 他喝了口水，接着说下去。 | pinyin câu: «Tā hē le kǒu shuǐ, jiēzhe shuō xiàqù.» | «Tā hē le kǒu shuǐ, jiēzhe shuō xiàqu.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 她忍不住哭了起来。 | pinyin câu: «Tā rěnbuzhù kū le qǐlái.» | «Tā rěnbuzhù kū le qǐlai.» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 我叫王明，我是学生，我在北京学习汉语。我们学校很大，学校前面有一个商店，后面有一个饭馆。上午我在学校读书、写字。中午… | pinyin câu: «…uéxiào hěn dà, xuéxiào qiánmiàn yǒu yí gè shāngdiàn, hòumiàn yǒu yí gè fànguǎn. …» | «…uéxiào hěn dà, xuéxiào qiánmiàn yǒu yí ge shāngdiàn, hòumiàn yǒu yí ge fànguǎn. …» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 今天是星期六，天气不好，下雨了。我在家学习汉语。我的桌子上有三本书和一个电脑。中午爸爸做菜，我们吃米饭和菜，很好。下… | pinyin câu: «… de zhuōzi shang yǒu sān běn shū hé yí gè diànnǎo. Zhōngwǔ bàba zuò cài, wǒmen c…» | «… de zhuōzi shang yǒu sān běn shū hé yí ge diànnǎo. Zhōngwǔ bàba zuò cài, wǒmen c…» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 我叫李红，我给你介绍我的家。我家有五个人：爸爸、妈妈、哥哥、妹妹和我。爸爸是医生，他在医院工作，每天早上七点上班。妈… | pinyin câu: «…ěi nǐ jièshào wǒ de jiā. Wǒ jiā yǒu wǔ gè rén: bàba, māma, gēge, mèimei hé wǒ. B…» | «…ěi nǐ jièshào wǒ de jiā. Wǒ jiā yǒu wǔ ge rén: bàba, māma, gēge, mèimei hé wǒ. B…» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
| 上个周末，我骑自行车去图书馆复习。经过公园的时候，天突然下雨了，我没带伞。我把自行车放在树下，跑到商店里等。雨越下越… | pinyin câu: «…è dà, wǒ hěn zháojí. Yí wèi āyí zǒu guòlái, bǎ tā de sǎn jiè gěi le wǒ. Tā shuō:…» | «…è dà, wǒ hěn zháojí. Yí wèi āyí zǒu guòlai, bǎ tā de sǎn jiè gěi le wǒ. Tā shuō:…» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 我永远记得去年夏天和小明一起去森林里玩的那一天。那天空气特别新鲜，阳光从树叶中间照下来，到处都是绿色的植物和美丽的花… | pinyin câu: «…yángguāng cóng shùyè zhōngjiān zhào xiàlái, dàochù dōu shì lǜsè de zhíwù hé měil…» | «…yángguāng cóng shùyè zhōngjiān zhào xiàlai, dàochù dōu shì lǜsè de zhíwù hé měil…» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 一位阿姨走过来，把她的伞借给了我。 | pinyin câu: «Yí wèi āyí zǒu guòlái, …» | «Yí wèi āyí zǒu guòlai, …» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 阳光从树叶中间照下来 | pinyin câu: «yángguāng cóng shùyè zhōngjiān zhào xiàlái» | «yángguāng cóng shùyè zhōngjiān zhào xiàlai» | CC-CEDICT (bổ ngữ xu hướng đọc nhẹ, vd 看起來 kan4 qi3 lai5) |
| 我家有四个人……我有一个妹妹……（bài đọc HSK 1, 6 chỗ 个） | pinyin câu: «sì gè rén … yí gè mèimei … (6 chỗ gè)» | «sì ge rén … yí ge mèimei … (6 chỗ ge)» | CC-CEDICT (个 ge4/ge5; quy ước giáo trình đọc nhẹ lượng từ 个) |
