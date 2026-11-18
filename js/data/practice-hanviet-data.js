// Dữ liệu cho Luyện tập: Đoán nghĩa qua Hán Việt (js/practice-hanviet.js). Rà soát 18/11/2026 – xem docs/kiem-tra-luyen-tap-10-han-viet.md.
//
// Quy tắc chọn từ (tự động, trong practice-hanviet.js → hintOf):
//   1. Từ toàn chữ Hán, có âm Hán Việt (hv) và nghĩa (vi); số âm Hán Việt bằng số chữ.
//   2. Nghĩa so sánh = phần trước dấu «;», bỏ phần trong ngoặc, bỏ dấu câu, chữ thường.
//   3. «full»: cả chuỗi Hán Việt nằm nguyên trong nghĩa (经济 kinh tế = «kinh tế»).
//      «part»: có âm Hán Việt trùng một âm tiết của nghĩa (图书馆 đồ thư quán = «thư viện»); từ 4 chữ trở lên cần ≥ 2 âm trùng.
//      «allow»: không trùng âm nào nhưng âm Hán Việt là từ tiếng Việt quen thuộc cùng nghĩa (danh sách allow bên dưới, duyệt tay).
//   4. Bỏ các từ trong danh sách block: chủ yếu là «bạn giả» – âm Hán Việt là một từ tiếng Việt có nghĩa KHÁC,
//      dễ làm người học đoán sai (博士 bác sĩ = tiến sĩ, không phải «bác sĩ»).
// Phương án nhiễu: cùng cấp, ưu tiên cùng từ loại, nghĩa không trùng âm tiết thực nào với nghĩa đúng
// và không trùng âm nào với âm Hán Việt của từ hỏi (để chỉ đáp án đúng được Hán Việt gợi ý).
window.HANVIET_DATA = {
  // hz → lý do loại
  block: {
    "博士": "bác sĩ (tiếng Việt: thầy thuốc) ≠ tiến sĩ",
    "监督": "giám đốc (tiếng Việt: người đứng đầu công ty) ≠ giám sát",
    "包子": "bao tử (tiếng Việt: dạ dày) ≠ bánh bao",
    "恐怖": "khủng bố (tiếng Việt: terrorism) ≠ kinh dị, khủng khiếp",
    "只是": "chỉ thị (tiếng Việt: mệnh lệnh) ≠ chỉ là",
    "相当": "tương đương (tiếng Việt: ngang bằng) ≠ khá, tương đối",
    "创建": "sáng kiến (tiếng Việt: ý tưởng mới) ≠ sáng lập",
    "方便": "phương tiện (tiếng Việt: xe cộ, công cụ) ≠ tiện lợi",
    "顺便": "thuận tiện (tiếng Việt: dễ dàng) ≠ tiện thể",
    "方便面": "phương tiện (bạn giả) – mì ăn liền",
    "成熟": "thành thục (tiếng Việt: thạo việc) ≠ chín chắn, chín",
    "改良": "cải lương (tiếng Việt: một loại kịch hát) – dễ hiểu lầm",
    "实行": "thực hành (tiếng Việt: luyện tập thực tế) ≠ thi hành",
    "灾害": "tai hại (tiếng Việt: có hại, tệ) ≠ thiên tai",
    "收拾": "thu thập (tiếng Việt: gom góp) ≠ dọn dẹp",
    "实在": "thực tại (tiếng Việt: hiện thực) ≠ thực sự, quả thực",
    "生产": "sinh sản (tiếng Việt: đẻ) ≠ sản xuất",
    "程度": "trình độ (tiếng Việt: học vấn, tay nghề) ≠ mức độ",
    "主意": "chủ ý (tiếng Việt: ý định) ≠ ý tưởng, cách làm",
    "环境": "hoàn cảnh (tiếng Việt: tình cảnh) ≠ môi trường",
    "地方": "địa phương (tiếng Việt: vùng, tỉnh) ≠ nơi, chỗ",
    "明白": "minh bạch (tiếng Việt: rõ ràng, công khai) ≠ hiểu",
    "照顾": "chiếu cố (tiếng Việt: nể, ưu ái) ≠ chăm sóc",
    "大家": "đại gia (tiếng Việt: người giàu) ≠ mọi người",
    "大人": "đại nhân (tiếng Việt: quan lớn) ≠ người lớn",
    "生气": "sinh khí (tiếng Việt: sức sống) ≠ tức giận",
    "认识": "nhận thức (tiếng Việt: hiểu biết, tri giác) ≠ quen biết",
    "名字": "danh tự (tiếng Việt: danh từ ngữ pháp) ≠ tên",
  },
  // hz → «âm Hán Việt = nghĩa tiếng Việt quen thuộc» (từ không trùng âm tiết với nghĩa ghi trên web nhưng vẫn gợi nghĩa tốt)
  allow: {
    "汉语": "Hán ngữ = tiếng Hán",
    "朋友": "bằng hữu = bạn bè",
    "现在": "hiện tại = bây giờ",
    "飞机": "phi cơ = máy bay",
    "电影": "điện ảnh = phim",
    "先生": "tiên sinh = ông, ngài",
    "衣服": "y phục = quần áo",
    "再见": "tái kiến = gặp lại",
    "高兴": "cao hứng = vui, hứng khởi",
    "医生": "y sinh: «y» là y tế, chữa bệnh",
    "非常": "phi thường = khác thường, hết sức",
    "可以": "khả dĩ = có thể được",
    "可能": "khả năng = có thể xảy ra",
    "考试": "khảo thí = thi cử",
    "回答": "hồi đáp = trả lời",
    "唱歌": "xướng ca = ca hát",
    "事情": "sự tình = sự việc",
    "男人": "nam nhân = đàn ông",
    "公共汽车": "công cộng = chung cho mọi người: xe công cộng",
    "足球": "túc cầu = bóng đá",
    "女士": "nữ sĩ = quý bà",
    "姓名": "tính danh = họ tên",
    "礼物": "lễ vật = quà tặng",
    "需要": "nhu yếu = cần thiết",
    "满意": "mãn ý = vừa ý",
    "愿意": "nguyện ý = bằng lòng",
    "游戏": "du hí = vui chơi",
    "有名": "hữu danh = có tiếng",
    "太阳": "thái dương = mặt trời",
    "可爱": "khả ái = đáng yêu",
    "最后": "tối hậu = sau cùng (tối hậu thư)",
    "不同": "bất đồng = không giống nhau",
    "夫妻": "phu thê = vợ chồng",
    "姐妹": "tỷ muội = chị em",
    "新年": "tân niên = năm mới",
    "四季": "tứ quý = bốn mùa",
    "动物园": "động vật viên = vườn động vật",
    "球场": "cầu trường = sân bóng",
  },
};
