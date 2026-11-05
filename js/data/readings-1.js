// Bài đọc ngắn HSK 1 – 2 (sau bài 5, 10, 12, 15, 20, 24)
// Chỉ dùng từ vựng đã học tính đến bài after; tên riêng nằm trong extra.
window.READINGS = window.READINGS || [];
window.READINGS.push(
  {
    id: "r05", after: 5, level: 1, title: "Tôi là Vương Minh",
    zh: "你好！我叫王明，我是中国人，我家在北京。我今年二十岁。我家有四个人：爸爸、妈妈、我，我有一个妹妹。爸爸四十八岁，妈妈四十五岁。我没有狗，我有一个猫，猫是我的好朋友。这是李红，她是我的朋友，她是北京人，她十九岁。今天是星期三，现在是上午十点。认识你我很高兴！",
    py: "Nǐ hǎo! Wǒ jiào Wáng Míng, wǒ shì Zhōngguó rén, wǒ jiā zài Běijīng. Wǒ jīnnián èrshí suì. Wǒ jiā yǒu sì gè rén: bàba, māma, wǒ, wǒ yǒu yí gè mèimei. Bàba sìshíbā suì, māma sìshíwǔ suì. Wǒ méiyǒu gǒu, wǒ yǒu yí gè māo, māo shì wǒ de hǎo péngyou. Zhè shì Lǐ Hóng, tā shì wǒ de péngyou, tā shì Běijīng rén, tā shíjiǔ suì. Jīntiān shì xīngqīsān, xiànzài shì shàngwǔ shí diǎn. Rènshi nǐ wǒ hěn gāoxìng!",
    vi: "Xin chào! Tôi tên là Vương Minh, tôi là người Trung Quốc, nhà tôi ở Bắc Kinh. Năm nay tôi hai mươi tuổi. Nhà tôi có bốn người: bố, mẹ, tôi, và tôi có một em gái. Bố bốn mươi tám tuổi, mẹ bốn mươi lăm tuổi. Tôi không có chó, tôi có một con mèo, mèo là bạn tốt của tôi. Đây là Lý Hồng, cô ấy là bạn tôi, cô ấy là người Bắc Kinh, cô ấy mười chín tuổi. Hôm nay là thứ Tư, bây giờ là mười giờ sáng. Quen biết bạn tôi rất vui!",
    extra: [
      { hz: "王明", py: "Wáng Míng", vi: "Vương Minh (tên người)" },
      { hz: "李红", py: "Lǐ Hóng", vi: "Lý Hồng (tên người)" },
      { hz: "妹妹", py: "mèimei", vi: "em gái" },
    ],
    questions: [
      { q: "Vương Minh bao nhiêu tuổi?", opts: ["Mười chín tuổi", "Hai mươi tuổi", "Bốn mươi lăm tuổi", "Bốn mươi tám tuổi"], a: 1 },
      { q: "Vương Minh nuôi con vật gì?", opts: ["Một con chó", "Một con mèo", "Một con chó và một con mèo", "Không nuôi con gì"], a: 1 },
      { q: "Lý Hồng là người ở đâu?", opts: ["Người Việt Nam", "Người Bắc Kinh", "Người Mỹ", "Bài đọc không nói"], a: 1 },
    ],
  },
  {
    id: "r10", after: 10, level: 1, title: "Một ngày ở trường",
    zh: "我叫王明，我是学生，我在北京学习汉语。我们学校很大，学校前面有一个商店，后面有一个饭馆。上午我在学校读书、写字。中午我去饭馆吃米饭，我喜欢吃菜，不喜欢喝茶。下午我去商店买东西，苹果一块钱一个。今天天气很热，我想喝水。五点我坐出租车回家。十点我睡觉。",
    py: "Wǒ jiào Wáng Míng, wǒ shì xuésheng, wǒ zài Běijīng xuéxí Hànyǔ. Wǒmen xuéxiào hěn dà, xuéxiào qiánmiàn yǒu yí gè shāngdiàn, hòumiàn yǒu yí gè fànguǎn. Shàngwǔ wǒ zài xuéxiào dú shū, xiě zì. Zhōngwǔ wǒ qù fànguǎn chī mǐfàn, wǒ xǐhuan chī cài, bù xǐhuan hē chá. Xiàwǔ wǒ qù shāngdiàn mǎi dōngxi, píngguǒ yí kuài qián yí gè. Jīntiān tiānqì hěn rè, wǒ xiǎng hē shuǐ. Wǔ diǎn wǒ zuò chūzūchē huí jiā. Shí diǎn wǒ shuìjiào.",
    vi: "Tôi tên là Vương Minh, tôi là học sinh, tôi học tiếng Trung ở Bắc Kinh. Trường chúng tôi rất lớn, trước trường có một cửa hàng, sau trường có một quán ăn. Buổi sáng tôi ở trường đọc sách, viết chữ. Buổi trưa tôi đến quán ăn ăn cơm, tôi thích ăn rau, không thích uống trà. Buổi chiều tôi đi cửa hàng mua đồ, táo một tệ một quả. Hôm nay trời rất nóng, tôi muốn uống nước. Năm giờ tôi đi taxi về nhà. Mười giờ tôi đi ngủ.",
    extra: [
      { hz: "王明", py: "Wáng Míng", vi: "Vương Minh (tên người)" },
    ],
    questions: [
      { q: "Phía sau trường học có gì?", opts: ["Một cửa hàng", "Một quán ăn", "Một bệnh viện", "Một ga tàu"], a: 1 },
      { q: "Vương Minh không thích gì?", opts: ["Ăn cơm", "Ăn rau", "Uống trà", "Uống nước"], a: 2 },
      { q: "Vương Minh về nhà bằng gì?", opts: ["Đi bộ", "Taxi", "Máy bay", "Tàu hỏa"], a: 1 },
    ],
  },
  {
    id: "r12", after: 12, level: 1, title: "Ngày mưa thứ Bảy",
    zh: "今天是星期六，天气不好，下雨了。我在家学习汉语。我的桌子上有三本书和一个电脑。中午爸爸做菜，我们吃米饭和菜，很好。下午王明打电话，他说：“喂，你好！我们去看电影，怎么样？”我说：“太好了！”三点我们在商店前面看见了李小姐，她买了很多衣服。六点我们都回家了。",
    py: "Jīntiān shì xīngqīliù, tiānqì bù hǎo, xiàyǔ le. Wǒ zài jiā xuéxí Hànyǔ. Wǒ de zhuōzi shang yǒu sān běn shū hé yí gè diànnǎo. Zhōngwǔ bàba zuò cài, wǒmen chī mǐfàn hé cài, hěn hǎo. Xiàwǔ Wáng Míng dǎ diànhuà, tā shuō: “Wèi, nǐ hǎo! Wǒmen qù kàn diànyǐng, zěnmeyàng?” Wǒ shuō: “Tài hǎo le!” Sān diǎn wǒmen zài shāngdiàn qiánmiàn kànjiàn le Lǐ xiǎojiě, tā mǎi le hěn duō yīfu. Liù diǎn wǒmen dōu huí jiā le.",
    vi: "Hôm nay là thứ Bảy, thời tiết không đẹp, trời mưa rồi. Tôi ở nhà học tiếng Trung. Trên bàn tôi có ba quyển sách và một cái máy tính. Buổi trưa bố nấu ăn, chúng tôi ăn cơm và rau, rất ngon. Buổi chiều Vương Minh gọi điện, cậu ấy nói: “Alô, chào cậu! Chúng mình đi xem phim, thế nào?” Tôi nói: “Hay quá!” Ba giờ chúng tôi nhìn thấy cô Lý trước cửa hàng, cô ấy mua rất nhiều quần áo. Sáu giờ chúng tôi đều về nhà rồi.",
    extra: [
      { hz: "王明", py: "Wáng Míng", vi: "Vương Minh (tên người)" },
      { hz: "李", py: "Lǐ", vi: "Lý (họ người)" },
    ],
    questions: [
      { q: "Hôm nay thời tiết thế nào?", opts: ["Rất nóng", "Rất lạnh", "Trời mưa", "Trời đẹp"], a: 2 },
      { q: "Trên bàn của nhân vật “tôi” có gì?", opts: ["Ba quyển sách và một máy tính", "Một cái ti vi", "Nhiều quần áo", "Một cái điện thoại"], a: 0 },
      { q: "Buổi chiều Vương Minh rủ “tôi” làm gì?", opts: ["Đi mua quần áo", "Đi ăn cơm", "Đi xem phim", "Đi học tiếng Trung"], a: 2 },
    ],
  },
  {
    id: "r15", after: 15, level: 2, title: "Gia đình của Lý Hồng",
    zh: "我叫李红，我给你介绍我的家。我家有五个人：爸爸、妈妈、哥哥、妹妹和我。爸爸是医生，他在医院工作，每天早上七点上班。妈妈在家做饭。哥哥去年开始在一个商店工作，他卖水果和西瓜。妹妹还小，她今年八岁，是学生。早上我六点起床，喝牛奶，吃鸡蛋。晚上我们都在家。",
    py: "Wǒ jiào Lǐ Hóng, wǒ gěi nǐ jièshào wǒ de jiā. Wǒ jiā yǒu wǔ gè rén: bàba, māma, gēge, mèimei hé wǒ. Bàba shì yīshēng, tā zài yīyuàn gōngzuò, měi tiān zǎoshang qī diǎn shàngbān. Māma zài jiā zuò fàn. Gēge qùnián kāishǐ zài yí gè shāngdiàn gōngzuò, tā mài shuǐguǒ hé xīguā. Mèimei hái xiǎo, tā jīnnián bā suì, shì xuésheng. Zǎoshang wǒ liù diǎn qǐchuáng, hē niúnǎi, chī jīdàn. Wǎnshang wǒmen dōu zài jiā.",
    vi: "Tôi tên là Lý Hồng, tôi xin giới thiệu với bạn gia đình mình. Nhà tôi có năm người: bố, mẹ, anh trai, em gái và tôi. Bố là bác sĩ, bố làm việc ở bệnh viện, mỗi ngày bảy giờ sáng đi làm. Mẹ ở nhà nấu cơm. Anh trai từ năm ngoái bắt đầu làm ở một cửa hàng, anh bán hoa quả và dưa hấu. Em gái còn nhỏ, năm nay tám tuổi, là học sinh. Buổi sáng tôi dậy lúc sáu giờ, uống sữa, ăn trứng. Buổi tối cả nhà đều ở nhà.",
    extra: [
      { hz: "李红", py: "Lǐ Hóng", vi: "Lý Hồng (tên người)" },
    ],
    questions: [
      { q: "Bố của Lý Hồng làm nghề gì?", opts: ["Giáo viên", "Bác sĩ", "Người bán hoa quả", "Phục vụ bàn"], a: 1 },
      { q: "Anh trai Lý Hồng bán gì?", opts: ["Quần áo", "Sách", "Hoa quả và dưa hấu", "Cà phê"], a: 2 },
      { q: "Buổi sáng Lý Hồng ăn gì?", opts: ["Cơm và cá", "Sữa và trứng", "Thịt dê", "Dưa hấu"], a: 1 },
    ],
  },
  {
    id: "r20", after: 20, level: 2, title: "Sinh nhật của tôi",
    zh: "昨天是我的生日。早上我和妈妈一起去商店买衣服。我最喜欢那件红衣服，它非常漂亮，也不贵，一百二十块，妈妈给我买了。下午朋友们都来我家。我们一起吃西瓜、唱歌、跳舞。王明问我：“你今年多少岁？”我告诉他：“我二十岁了。”晚上我觉得很累，十点睡觉了。",
    py: "Zuótiān shì wǒ de shēngrì. Zǎoshang wǒ hé māma yìqǐ qù shāngdiàn mǎi yīfu. Wǒ zuì xǐhuan nà jiàn hóng yīfu, tā fēicháng piàoliang, yě bú guì, yìbǎi èrshí kuài, māma gěi wǒ mǎi le. Xiàwǔ péngyoumen dōu lái wǒ jiā. Wǒmen yìqǐ chī xīguā, chànggē, tiàowǔ. Wáng Míng wèn wǒ: “Nǐ jīnnián duōshao suì?” Wǒ gàosu tā: “Wǒ èrshí suì le.” Wǎnshang wǒ juéde hěn lèi, shí diǎn shuìjiào le.",
    vi: "Hôm qua là sinh nhật tôi. Buổi sáng tôi cùng mẹ đi cửa hàng mua quần áo. Tôi thích nhất chiếc áo đỏ kia, nó rất đẹp, cũng không đắt, một trăm hai mươi tệ, mẹ mua cho tôi. Buổi chiều các bạn đều đến nhà tôi. Chúng tôi cùng ăn dưa hấu, hát, nhảy múa. Vương Minh hỏi tôi: “Năm nay cậu bao nhiêu tuổi?” Tôi bảo cậu ấy: “Mình hai mươi tuổi rồi.” Buổi tối tôi thấy rất mệt, mười giờ đi ngủ.",
    extra: [
      { hz: "王明", py: "Wáng Míng", vi: "Vương Minh (tên người)" },
    ],
    questions: [
      { q: "Nhân vật “tôi” mua chiếc áo màu gì?", opts: ["Màu trắng", "Màu đen", "Màu đỏ", "Màu xanh"], a: 2 },
      { q: "Chiếc áo giá bao nhiêu?", opts: ["Hai mươi tệ", "Một trăm tệ", "Một trăm hai mươi tệ", "Hai trăm tệ"], a: 2 },
      { q: "Buổi chiều mọi người làm gì ở nhà “tôi”?", opts: ["Xem phim", "Ăn dưa hấu, hát, nhảy", "Học tiếng Trung", "Chơi bóng rổ"], a: 1 },
    ],
  },
  {
    id: "r24", after: 24, level: 2, title: "Lần đầu đến Bắc Kinh",
    zh: "去年，我第一次去北京旅游。我从机场坐公共汽车到朋友王明的家。那天是晴天，我们走路去了很多商店和饭馆。第二天下雪了，很冷，我们在家玩电脑、看电视。我要回家了，王明送我到机场，他说：“欢迎你再来北京！”我很高兴，因为我在北京找到了好朋友。",
    py: "Qùnián, wǒ dì-yī cì qù Běijīng lǚyóu. Wǒ cóng jīchǎng zuò gōnggòng qìchē dào péngyou Wáng Míng de jiā. Nà tiān shì qíngtiān, wǒmen zǒu lù qù le hěn duō shāngdiàn hé fànguǎn. Dì-èr tiān xià xuě le, hěn lěng, wǒmen zài jiā wán diànnǎo, kàn diànshì. Wǒ yào huí jiā le, Wáng Míng sòng wǒ dào jīchǎng, tā shuō: “Huānyíng nǐ zài lái Běijīng!” Wǒ hěn gāoxìng, yīnwèi wǒ zài Běijīng zhǎodào le hǎo péngyou.",
    vi: "Năm ngoái, tôi đi du lịch Bắc Kinh lần đầu tiên. Tôi đi xe buýt từ sân bay đến nhà bạn Vương Minh. Hôm đó trời nắng, chúng tôi đi bộ đến rất nhiều cửa hàng và quán ăn. Ngày thứ hai trời đổ tuyết, rất lạnh, chúng tôi ở nhà chơi máy tính, xem ti vi. Tôi phải về nhà rồi, Vương Minh tiễn tôi ra sân bay, cậu ấy nói: “Hoan nghênh cậu lại đến Bắc Kinh!” Tôi rất vui, vì ở Bắc Kinh tôi đã tìm được một người bạn tốt.",
    extra: [
      { hz: "王明", py: "Wáng Míng", vi: "Vương Minh (tên người)" },
    ],
    questions: [
      { q: "Nhân vật “tôi” đi từ sân bay đến nhà bạn bằng gì?", opts: ["Taxi", "Xe buýt", "Xe đạp", "Tàu hỏa"], a: 1 },
      { q: "Ngày thứ hai thời tiết thế nào?", opts: ["Trời nắng", "Trời mưa", "Trời đổ tuyết", "Trời âm u"], a: 2 },
      { q: "Vì sao “tôi” rất vui?", opts: ["Vì mua được áo mới", "Vì tìm được bạn tốt ở Bắc Kinh", "Vì được ăn dưa hấu", "Vì sắp đi du lịch lại"], a: 1 },
    ],
  },
);
