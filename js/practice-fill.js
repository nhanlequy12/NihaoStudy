// Luyện tập: Điền từ – câu ví dụ tự soạn của web bị khuyết từ trọng tâm, người học chọn hoặc gõ từ còn thiếu.
// Dễ / Vừa: chọn 1 trong 4 từ; Khó: tự gõ chữ Hán hoặc pinyin. Phương án nhiễu được sinh cố định theo câu
// (cùng từ loại, độ dài gần nhau, khác hẳn trường nghĩa) rồi rà soát và đóng băng trong js/data/practice-fill-data.js.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const L4 = "ABCD";
  const CAP = 120;   // tối đa mỗi cấp
  // Câu đã rà soát: mã câu → [đáp án, nhiễu 1, nhiễu 2, nhiễu 3]. Chỉ những câu này được dùng.
  const OK = () => window.FILL_OK || {};

  // ---------- Tiện ích cố định theo hạt giống ----------
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffleR(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const idOf = (std, zh) => (std === "hsk3" ? "h3" : "h2") + hash(zh).toString(36);

  // ---------- Từ loại ----------
  const CAT = { "danh từ": "n", "động từ": "v", "tính từ": "a", "lượng từ": "m" };
  const CAT_VI = { n: "danh từ", v: "động từ", a: "tính từ", m: "lượng từ" };
  const pos1 = (w) => String((w && w.pos) || "").split(/\s*[,/(;]\s*/)[0].trim();
  const catOf = (w) => CAT[pos1(w)] || null;
  const gloss1 = (w) => String((w && w.vi) || "").split(/[;；]/)[0].trim();
  const nHz = (hz) => [...hz].length;

  // Không làm đáp án: từ quá chung hoặc chỉ vị trí, số lượng
  const NOT_ANSWER = new Set("是 有 在 人 东西 事 事情 个 些 点 种 样 次 下 上 里 外 前 后 中 内 边 面 时 天 年 东 西 南 北 回 遍 位 只 口".split(" "));
  // Từ quá chung, đặt vào gần như câu nào cũng được: không làm phương án nhiễu
  const GENERIC = new Set(("是 有 在 做 要 会 能 去 来 说 看 想 用 让 给 叫 到 过 得 搞 弄 进行 加以 成为 变成 觉得 认为 知道 开始 喜欢 " +
    "人 东西 事 事情 时候 地方 问题 情况 方面 方法 东 西 南 北 上 下 里 外 前 后 中 内 边 面 时 天 年 次 样 种 " +
    "好 对 大 小 多 少 新 旧 真 一样 不错 不同 一般 重要 主要 正常 特别 个 些 点 下 位 种 样 次 回 遍 件 块 把 只 张 条 本 口").split(" "));
  // Lượng từ dùng làm nhiễu dễ gây tranh cãi (dùng được với nhiều danh từ)
  const MW_LOOSE = new Set("个 些 点 种 类 样 批 群 份 套 对 双 部 场 阵 次 回 下 遍 趟 番 位 名 只 把 张 条 件 块 片 层 段 节 堆 串".split(" "));

  // ---------- Trường nghĩa thô theo nghĩa tiếng Việt (chỉ dùng để chọn nhiễu khác hẳn nghĩa) ----------
  const F = (s) => s.split("|");
  const FIELDS = {
    n: [
      ["animal", F("con chó|con mèo|chó|mèo|chim|con gà|ngựa|con bò|lợn|heo|gấu|hổ|khỉ|voi|động vật|con vật|dã thú|thú cưng|cá heo|rắn|chuột|vịt|cừu|dê|bướm|côn trùng|muỗi|ong|kiến")],
      ["person", F("người|bác sĩ|giáo viên|thầy|cô giáo|học sinh|sinh viên|bạn|ông|bà|bố|mẹ|cha|vợ|chồng|cháu|chú|dì|khách|nhân viên|công nhân|cảnh sát|y tá|tài xế|lái xe|ca sĩ|diễn viên|nhà văn|luật sư|kỹ sư|giám đốc|ông chủ|hàng xóm|đồng nghiệp|thành viên|tác giả|phóng viên|trẻ em|em bé|con trai|con gái|anh trai|chị gái|em trai|em gái|anh chị|họ hàng|thanh niên|cô gái|chàng|thầy giáo|hiệu trưởng|lãnh đạo|thư ký|kế toán|nông dân|bộ đội|quân|vận động viên|huấn luyện viên|đội trưởng|chủ nhiệm|chuyên gia|trẻ|trẻ con|đứa trẻ|con cái|tiến sĩ|thạc sĩ|cử nhân|tổng thống|chủ tịch|vua|hoàng")],
      ["time", F("ngày|giờ|phút|giây|năm|tháng|tuần|buổi sáng|buổi trưa|buổi chiều|buổi tối|sáng|trưa|chiều|tối|đêm|lúc|thời gian|thời kỳ|thời đại|mùa|hôm|kỳ nghỉ|cuối tuần|sinh nhật|tết|lễ|thế kỷ|giai đoạn|thứ hai|thứ ba|chủ nhật|quá khứ|tương lai|hiện nay|bây giờ|ngày mai|hôm qua")],
      ["food", F("cơm|mì|bánh|thịt|cá|rau|quả|trái|táo|chuối|dưa|trứng|sữa|trà|cà phê|rượu|bia|nước uống|nước ngọt|nước ép|đồ ăn|thức ăn|món|canh|kẹo|đậu|gạo|muối|đường ăn|dầu ăn|nho|cam|lê|đào|thực phẩm|đồ uống|bữa|sủi cảo|bánh bao|há cảo|phở|lẩu|kem|sô-cô-la|gia vị|dấm|nước tương")],
      ["clothes", F("áo|quần|giày|dép|mũ|nón|váy|tất|vớ|khăn|găng|thắt lưng|cà vạt|trang phục|quần áo|đồ bơi|kính")],
      ["vehicle", F("xe|tàu|máy bay|thuyền|ô tô|xe đạp|xe buýt|tàu điện|phương tiện|taxi")],
      ["place", F("nơi|chỗ|phòng|trường|bệnh viện|cửa hàng|siêu thị|nhà hàng|khách sạn|công ty|thành phố|quốc gia|đất nước|sân bay|nhà ga|ga|bến|công viên|thư viện|ngân hàng|bưu điện|đường phố|con đường|phố|làng|quê|tỉnh|bãi|sân|biển|núi|sông|hồ|rừng|vườn|chợ|bảo tàng|rạp|khu|vùng|châu|thủ đô|nhà máy|văn phòng|lớp học|ký túc xá|nhà bếp|phòng ngủ|nhà vệ sinh|bãi biển|hải đảo|đảo|sa mạc|thảo nguyên|quảng trường|trung tâm|cửa hiệu|tiệm|quán|nhà sách|nhà thờ|chùa|đền|cung|tòa nhà|căn hộ|tầng|góc|địa điểm|địa phương|thôn|huyện|xã|miền")],
      ["nature", F("trời|mưa|gió|tuyết|mây|nắng|thời tiết|nhiệt độ|mặt trời|mặt trăng|trăng|sao|hoa|cây|cỏ|lá|đất|đá|nước biển|không khí|khí hậu|sương|bão|sấm|chớp|cầu vồng|ánh sáng|bầu trời|thiên nhiên|môi trường|lửa|băng")],
      ["body", F("tay|chân|mắt|mũi|miệng|tai|đầu|tóc|mặt|răng|bụng|tim|lưng|cổ|da|cơ thể|thân thể|vai|ngón|lưỡi|môi|xương|máu|não|dạ dày|phổi|gan|eo|đùi|đầu gối|cổ họng|cánh tay|sức khỏe")],
      ["thing", F("bàn|ghế|giường|cửa|sách|vở|bút|giấy|điện thoại|máy tính|ti vi|tivi|chìa khóa|túi|hộp|cốc|ly|chén|bát|đĩa|đũa|dao|thìa|muỗng|đồng hồ|máy ảnh|ảnh|tranh|bản đồ|vé|thư|báo|tạp chí|đèn|tủ|gương|ô|dù|bóng|đàn|quà|hành lý|va li|chăn|gối|khăn giấy|xà phòng|kéo|chai|bình|thùng|tờ|thẻ|máy|thiết bị|đồ chơi|đồ dùng|đồ đạc|nhà cửa|tường|cửa sổ|thang máy|cầu thang|mái")],
      ["money", F("tiền|giá|lương|phí|chi phí|thuế|tài khoản|ngân sách|vốn|lãi|nợ|thu nhập|tiền mặt|hóa đơn")],
      ["lang", F("tiếng|chữ|từ vựng|câu|bài|ngữ pháp|môn|kỳ thi|bài thi|điểm|đề|văn|ngôn ngữ|phát âm|chính tả|bài tập|bài học|bài văn|tiểu thuyết|thơ|truyện|sách giáo khoa|từ điển|kiến thức|học kỳ|học phí|khóa học|chuyên ngành|bằng|luận văn")],
      ["sport", F("bóng đá|bóng rổ|bóng bàn|cầu lông|quần vợt|bơi|chạy|thể thao|trận|đội|giải|vận động|thể dục|võ|cờ")],
      ["art", F("nhạc|bài hát|phim|điện ảnh|kịch|múa|hội họa|tranh vẽ|âm nhạc|nghệ thuật|biểu diễn|chương trình|tiết mục|trò chơi")],
      ["feeling", F("cảm xúc|tâm trạng|tình cảm|niềm vui|nỗi buồn|tình yêu|hạnh phúc|sự lo lắng|nỗi|niềm|hứng thú|sở thích|ước mơ|mơ ước|lý tưởng|hy vọng|ý chí|tinh thần|tính cách|tính tình|lòng|tâm hồn|tâm lý")],
      ["health", F("bệnh|ốm|thuốc|sốt|cảm|ho|đau|vết thương|bác sĩ|bệnh viện|y tế|chữa|tiêm|phẫu thuật")],
      ["comm", F("tin tức|tin nhắn|thông tin|thông báo|tin|điện thoại|email|thư điện tử|mạng|internet|trang web|số điện thoại|địa chỉ|tên|họ tên|danh sách")],
      ["org", F("chính phủ|nhà nước|đảng|tổ chức|công ty|doanh nghiệp|xí nghiệp|cơ quan|bộ|ngành|hội|câu lạc bộ|đoàn|nhóm|tập đoàn|thị trường|kinh tế|xã hội|pháp luật|luật|quy định|chính sách|chế độ|hệ thống")],
    ],
    v: [
      ["motion", F("đi|đến|về|chạy|bay|bơi|leo|lên|xuống|ra|vào|rời|quay lại|trở về|đi bộ|đi dạo|du lịch|bước|nhảy|lái|đạp|chuyển nhà|di chuyển|xuất phát|đến nơi|qua|băng qua|vượt")],
      ["speech", F("nói|hỏi|trả lời|gọi|kể|giải thích|giới thiệu|bàn|thảo luận|kêu|hét|khen|phê bình|chào|cảm ơn|xin lỗi|báo|thông báo|nhắc|khuyên|dặn|hứa|tranh luận|cãi|nói chuyện|trò chuyện|phát biểu|đề nghị|yêu cầu|mời|cầu xin|xin")],
      ["percept", F("nhìn|xem|thấy|nghe|ngửi|nếm|quan sát|ngắm|đọc")],
      ["cogn", F("biết|hiểu|nghĩ|nhớ|quên|tin|cho rằng|cảm thấy|học|ôn|luyện|quyết định|chọn|lựa chọn|suy nghĩ|tưởng|đoán|phát hiện|nhận ra|phân biệt|so sánh|nghiên cứu|tính|đếm|phán đoán|lo|cân nhắc|lên kế hoạch|định|dự định")],
      ["emotion", F("thích|yêu|ghét|sợ|lo lắng|hy vọng|mong|muốn|giận|tức|ngưỡng mộ|ghen|thương|nhớ nhung|xấu hổ|hối hận|thất vọng|cảm động|hài lòng|chán|vui|buồn|khóc|cười")],
      ["consume", F("ăn|uống|hút|nhai|nuốt|nấu|nướng|rán|chiên|luộc|xào|pha")],
      ["trade", F("mua|bán|trả|tiêu|đổi|mượn|cho vay|vay|thuê|gửi|nhận|tặng|đưa|lấy|tiết kiệm|kiếm|giảm giá|đặt|thanh toán|đầu tư|quyên góp|nộp|chi|bồi thường|trả lại|cho mượn")],
      ["body", F("ngủ|dậy|thức dậy|tắm|rửa|mặc|cởi|đánh răng|nằm|ngồi|đứng|thở|ho|nghỉ|nghỉ ngơi|tập thể dục|đeo|đội|chải|cắt tóc|trang điểm|ốm|bị ốm|khám bệnh|uống thuốc")],
      ["work", F("làm|giúp|chuẩn bị|sửa|dọn|lau|quét|giặt|viết|vẽ|in|chụp|xây|trồng|tưới|sắp xếp|thu dọn|đóng gói|làm việc|làm thêm|làm bài|tăng ca|quản lý|lãnh đạo|tổ chức|sản xuất|thiết kế|kiểm tra|xử lý|giải quyết|hoàn thành")],
      ["change", F("bắt đầu|kết thúc|thay đổi|trở thành|tăng|giảm|phát triển|biến|tiến bộ|cải thiện|nâng cao|mở rộng|thu hẹp|xuất hiện|biến mất|mất|hỏng|vỡ|gãy|tan|chết|sinh|lớn lên|già đi")],
      ["social", F("gặp|gặp mặt|quen|kết bạn|kết hôn|ly hôn|hẹn|chia tay|đón|tiễn|thăm|chăm sóc|chơi|tham gia|tham dự|họp|tụ tập|cùng|giúp đỡ|ủng hộ|phản đối|đồng ý|từ chối|tha thứ|tôn trọng|chúc|cảm ơn")],
      ["weather", F("mưa|tuyết rơi|nổi gió|có gió|nắng|sấm|tạnh")],
      ["play", F("hát|nhảy múa|múa|chơi|chơi đàn|đánh đàn|vẽ tranh|câu cá|chụp ảnh|xem phim|leo núi|đá bóng|biểu diễn")],
      ["open", F("mở|đóng|bật|tắt|khóa|bấm|ấn|kéo|đẩy|cầm|nắm|ném|treo|đặt|để|bỏ|đặt xuống|nhặt|ôm")],
    ],
    a: [
      ["emotion", F("vui|buồn|giận|tức|lo|sợ|hạnh phúc|cô đơn|hài lòng|căng thẳng|thoải mái|mệt|chán|hồi hộp|phấn khởi|thất vọng|ngạc nhiên|xấu hổ|đau lòng|đau khổ|bình tĩnh|yên tâm|vội|sốt ruột|lo lắng|kích động|cảm động|hưng phấn|ngại|tự hào")],
      ["weather", F("nóng|lạnh|ấm|mát|nắng|khô|ẩm|râm|oi|rét|âm u|trong lành")],
      ["size", F("to|lớn|nhỏ|cao|thấp|dài|ngắn|rộng|hẹp|béo|gầy|mập|dày|mỏng|nặng|nhẹ|xa|gần|sâu|nông|lùn|khổng lồ|bé")],
      ["quantity", F("nhiều|ít|đủ|thiếu|đông|vắng|thưa|dồi dào|phong phú")],
      ["look", F("đẹp|xấu|xinh|sạch|bẩn|mới|cũ|gọn|lộn xộn|bừa|đẹp trai|dễ thương|đáng yêu|sáng sủa|tối|sáng|rực rỡ|sặc sỡ|lịch sự|trang nhã")],
      ["taste", F("ngon|ngọt|chua|cay|mặn|đắng|thơm|nhạt|béo ngậy|giòn|tươi|thối|ôi|tanh")],
      ["speed", F("nhanh|chậm|sớm|muộn|trễ|lâu|gấp|kịp|đúng giờ|khẩn cấp")],
      ["price", F("đắt|rẻ|quý|giá rẻ|đắt đỏ|tốn kém|miễn phí")],
      ["diff", F("khó|dễ|đơn giản|phức tạp|rắc rối|thuận tiện|tiện|tiện lợi|bất tiện|phiền")],
      ["color", F("đỏ|xanh|vàng|trắng|đen|tím|hồng|nâu|xám|màu")],
      ["trait", F("thông minh|chăm chỉ|lười|hiền|tốt bụng|thật thà|trung thực|nghiêm túc|kiên nhẫn|dũng cảm|nhút nhát|hài hước|vui tính|khiêm tốn|kiêu ngạo|ích kỷ|hào phóng|keo kiệt|nhiệt tình|lạnh lùng|thân thiện|ngoan|nghịch|ngốc|ngu|khéo|vụng|cẩn thận|cẩu thả|chu đáo|tự tin|độc lập|thành thật|lương thiện|giỏi|kém|có năng lực|tài|xuất sắc")],
      ["state", F("bận|rảnh|khỏe|ốm|yếu|đói|no|khát|say|buồn ngủ|tỉnh|mệt mỏi|bệnh|đau")],
      ["sound", F("ồn|ồn ào|yên tĩnh|im lặng|náo nhiệt|sôi động|vắng vẻ|to tiếng|nhỏ tiếng|êm")],
      ["truth", F("đúng|sai|thật|giả|chính xác|rõ|rõ ràng|mơ hồ|cụ thể|chắc chắn|hợp lý|công bằng|hợp pháp|phạm pháp")],
      ["safety", F("an toàn|nguy hiểm|ổn định|bình an|bình yên|chắc|vững")],
    ],
  };
  const fieldMemo = new Map();
  function fieldOf(w) {
    const c = catOf(w);
    if (!FIELDS[c]) return null;
    const k = c + "|" + w.hz + "|" + w.vi;
    if (fieldMemo.has(k)) return fieldMemo.get(k);
    const g = " " + String(w.vi || "").toLowerCase().split(/[;,；，(]/)[0].replace(/[^\p{L}\s-]/gu, " ").replace(/\s+/g, " ").trim() + " ";
    let f = null;
    for (const [name, keys] of FIELDS[c]) if (keys.some((x) => g.includes(" " + x + " "))) { f = name; break; }
    fieldMemo.set(k, f);
    return f;
  }

  // Âm tiết nội dung của nghĩa tiếng Việt (để loại từ gần nghĩa)
  const VI_STOP = new Set("là của và thì mà các những cái này kia đó ấy rồi đã sẽ đang được bị ở với cho để một rất lắm quá có không người sự việc cách làm ra vào lên xuống đi theo nhau hay hoặc như từ trong ngoài trên dưới bằng về".split(" "));
  function viSyll(w) {
    return new Set(P().viNorm(String(w.vi || "").replace(/\(.*?\)/g, " ")).split(" ").filter((x) => x && !VI_STOP.has(x)));
  }

  // ---------- Kho từ để chọn phương án: cùng chuẩn, cùng cấp hoặc cấp dưới ----------
  const poolMemo = {};
  function poolOf(std, level) {
    const k = std + level;
    if (poolMemo[k]) return poolMemo[k];
    const seen = new Set(), out = [];
    [level, level - 1].forEach((l) => {
      if (!P().STD[std].levels.includes(l)) return;
      P().wordsOf(std, l).forEach((w) => { if (!seen.has(w.hz)) { seen.add(w.hz); out.push(Object.assign({ lv: l }, w)); } });
    });
    return (poolMemo[k] = out);
  }
  const wordIn = (std, level, hz) => poolOf(std, level).find((w) => w.hz === hz) || null;   // nhiễu phải thuộc cấp này hoặc cấp dưới

  // ---------- Dựng một câu hỏi từ bộ đã đóng băng ----------
  function make(std, level, s, entry) {
    const hz = s.word.hz;
    if (!entry || entry[0] !== hz || entry.length !== 4) return null;
    const parts = s.zh.split(hz);
    if (parts.length !== 2 || !P().tokens(s.zh).some((x) => x.t === hz)) return null;
    const ds = entry.slice(1).map((d) => wordIn(std, level, d));
    if (ds.some((d) => !d || s.zh.includes(d.hz))) return null;
    if (new Set(entry).size !== 4) return null;
    const ans = { hz, py: s.word.py, vi: s.word.vi, pos: s.word.pos };
    return {
      id: idOf(std, s.zh), std, level, zh: s.zh, py: s.py, vi: s.vi, word: s.word,
      hz, before: parts[0], after: parts[1],
      opts: [ans, ...ds.map((d) => ({ hz: d.hz, py: d.py, vi: d.vi, pos: d.pos }))],   // opts[0] là đáp án
    };
  }

  // ---------- Chế độ sinh (dùng khi rà soát) ----------
  // window.__fillDeny: Set "mã|từ" không dùng làm nhiễu; window.__fillDrop: Set mã câu bỏ hẳn
  let corpus = null;
  const CLAUSE_SPLIT = /[，。！？、；：,.!?;:“”‘’（）()…—\s]+/;
  function buildCorpus() {
    if (corpus) return corpus;
    const occ = new Map();
    let n = 0;
    const seen = new Set();
    ["hsk2", "hsk3"].forEach((std) => P().STD[std].levels.forEach((l) => P().wordsOf(std, l).forEach((w) => {
      const zh = w.ex && w.ex[0];
      if (!zh || seen.has(zh)) return;
      seen.add(zh);
      zh.split(CLAUSE_SPLIT).filter(Boolean).forEach((cl) => {
        const id = n++;
        new Set(P().tokens(cl).filter((x) => x.w).map((x) => x.t)).forEach((t) => { if (!occ.has(t)) occ.set(t, new Set()); occ.get(t).add(id); });
      });
    })));
    return (corpus = occ);
  }
  // Trường nghĩa đã từng đứng liền trước / liền sau một từ (bỏ qua hư từ): chặn nhiễu cùng loại với từ đã gặp ở vị trí đó
  const SKIPADJ = new Set("的 了 很 太 真 非常 都 也 一 个 这 那 些 着 过 得 地 吗 呢 吧 啊 还 就 才 又 再 最 更 不 没".split(" "));
  let adj = null;
  const keyOf = (w) => { const f = fieldOf(w); return f ? catOf(w) + ":" + f : null; };
  function buildAdj() {
    if (adj) return adj;
    adj = { after: new Map(), before: new Map(), bi: new Set(), vt: new Map() };
    const add = (m, k, v) => { if (!v) return; if (!m.has(k)) m.set(k, new Set()); m.get(k).add(v); };
    const seen = new Set();
    ["hsk2", "hsk3"].forEach((std) => P().STD[std].levels.forEach((l) => P().wordsOf(std, l).forEach((w) => {
      const zh = w.ex && w.ex[0];
      if (!zh || seen.has(zh)) return;
      seen.add(zh);
      const raw = P().tokens(zh);
      for (let j = 0; j + 1 < raw.length; j++) adj.bi.add(raw[j].t + "|" + raw[j + 1].t);
      raw.forEach((x, j) => {
        if (!x.w || catOf(x.w) !== "v") return;
        const st = adj.vt.get(x.t) || { n: 0, end: 0 };
        const a = raw[j + 1], b = raw[j + 2];
        st.n++;
        if (!a || a.p || ((a.t === "了" || a.t === "过" || a.t === "着") && (!b || b.p))) st.end++;
        adj.vt.set(x.t, st);
      });
      const ts = raw.filter((x) => !SKIPADJ.has(x.t));
      for (let j = 0; j + 1 < ts.length; j++) {
        const a = ts[j], b = ts[j + 1];
        if (a.p || b.p || !a.w || !b.w) continue;
        add(adj.after, a.t, keyOf(b.w)); add(adj.before, b.t, keyOf(a.w));
      }
    })));
    return adj;
  }
  // Hàng xóm gần nhất của chỗ trống (bỏ qua hư từ); đại từ bên trái không xét khi đáp án là động từ / tính từ
  function neighbors(toks, k, c) {
    let L = null, R = null;
    for (let j = k - 1; j >= 0; j--) { if (toks[j].p) break; if (!SKIPADJ.has(toks[j].t)) { L = toks[j]; break; } }
    for (let j = k + 1; j < toks.length; j++) { if (toks[j].p) break; if (!SKIPADJ.has(toks[j].t)) { R = toks[j]; break; } }
    if (L && (!L.w || (c !== "n" && pos1(L.w) === "đại từ"))) L = null;
    if (R && !R.w) R = null;
    return { L, R };
  }
  // ---------- Khung câu: chỗ trống có bị ngữ cảnh "chọn" chặt không, và nhiễu được lấy từ trường nghĩa nào ----------
  const HUMAN_PRON = new Set("我 你 他 她 我们 你们 他们 她们 您 大家 自己 别人 人家 咱们 谁 咱".split(" "));
  const THING_PRON = new Set("这 那 这个 那个 这儿 那儿 这里 那里 这些 那些 它".split(" "));
  const NUM = /^([一二两三四五六七八九十百千万几半]+|[0-9]+)$/;
  const DET = new Set("这 那 这个 那个 一个 一些 这些 那些 每 每个 几个 哪 哪个".split(" "));
  // Động từ đứng trước tân ngữ: trường nghĩa danh từ có thể làm tân ngữ (nhiễu không được thuộc các trường này)
  const SEL_V = {
    吃: "food", 喝: "food", 坐: "vehicle thing", 穿: "clothes", 戴: "clothes thing", 读: "lang thing comm", 念: "lang thing comm", 写: "lang thing comm",
    唱: "art", 打: "sport comm thing", 踢: "sport", 开: "vehicle thing place org", 骑: "vehicle animal", 学: "lang art sport", 学习: "lang art sport org",
    教: "lang art sport", 洗: "body clothes food thing vehicle", 去: "place org", 到: "place org time", 回: "place org", 来: "place org", 在: "place org thing food person animal vehicle body clothes nature", 住: "place",
    参观: "place org art", 访问: "place org person", 离开: "place org person", 进: "place org", 上: "place vehicle lang", 下: "vehicle place", 放: "thing food clothes",
    养: "animal person", 种: "nature food", 煮: "food", 炒: "food", 切: "food thing", 玩: "art sport thing", 弹: "art", 听: "art comm lang", 讲: "lang comm art",
  };
  const NONSEL_V = new Set("是 有 要 看 买 喜欢 爱 想 找 等 用 给 拿 带 卖 选 换 没有 需要 知道 觉得 认为 讨厌 怕 关心 准备 得到 遇到 见 发现 送 借 还 收 接 叫 请 让 帮 帮助 介绍 告诉 问 研究 了解 认识 记得 忘 忘记 担心 希望 保护 照顾 收到 拿到 遇见 看到 看见 听到 听见".split(" "));
  // Động từ nhận được gần như mọi tân ngữ: không dùng làm nhiễu cho câu có tân ngữ
  const V_ANYOBJ = new Set(["emotion", "percept", "trade", "cogn"]);
  const V_AVOID = { food: "consume work body open", clothes: "body work open", thing: "open work body", lang: "speech work play", place: "motion social", vehicle: "motion open body", body: "body open", art: "play speech", comm: "speech work" };
  const isHuman = (x) => x && (HUMAN_PRON.has(x.t) || (x.w && ["person", "animal"].includes(fieldOf(x.w))));
  function frame(toks, k, c, word) {
    const inClause = (j) => j >= 0 && j < toks.length && !toks[j].p;
    const prevBy = (skip) => { for (let j = k - 1; inClause(j); j--) if (!skip(toks[j])) return toks[j]; return null; };
    const nextBy = (skip) => { for (let j = k + 1; inClause(j); j++) if (!skip(toks[j])) return toks[j]; return null; };
    const af = fieldOf(word);
    if (c === "n") {
      const pm = prevBy((x) => NUM.test(x.t) || x.t === "了");
      if (pm && pm.w && catOf(pm.w) === "m" && !MW_LOOSE.has(pm.t)) return { ok: true };
      const L = prevBy((x) => SKIPADJ.has(x.t) || DET.has(x.t) || NUM.test(x.t) || (x.w && catOf(x.w) === "m"));
      if (L && SEL_V[L.t]) return { ok: true, avoid: new Set(SEL_V[L.t].split(" ")) };
      if (L && L.w && catOf(L.w) === "v" && !GENERIC.has(L.t) && !NONSEL_V.has(L.t) && toks[k - 1] === L) return { ok: true };
      const R = nextBy((x) => SKIPADJ.has(x.t));
      if (["person", "time"].includes(af) && R && R.w && catOf(R.w) !== "a" && !(toks[k + 1] && ["很", "真", "太", "非常"].includes(toks[k + 1].t))) return { ok: true };
      // chủ ngữ của vị ngữ tính từ chọn lọc: 好吃 (chỉ đồ ăn), 贵 (chỉ thứ mua được)
      const RA = nextBy((x) => SKIPADJ.has(x.t) || /^(很|太|真|非常|特别|比较|挺|有点儿|有点)$/.test(x.t));
      if (RA && RA.w && catOf(RA.w) === "a" && toks.indexOf(RA) <= k + 3) {
        const rf = fieldOf(RA.w);
        if (rf === "taste") return { ok: true, allow: new Set(["person", "time", "place", "lang", "comm", "feeling", "money", "sport", "org", "health"]) };
        if (rf === "price") return { ok: true, allow: new Set(["person", "time", "nature", "feeling"]) };
      }
      return { ok: false };
    }
    if (c === "a") {
      const DEG = (x) => /^(很|太|真|非常|特别|比较|更|最|挺|不|有点儿|有点|十分|相当|越来越|多么|好|这么|那么|也|都|还|又)$/.test(x.t);
      const TIMEW = (x) => DEG(x) || (x.w && fieldOf(x.w) === "time" && toks.slice(0, toks.indexOf(x)).some((y) => !y.p && y.w && (HUMAN_PRON.has(y.t) || THING_PRON.has(y.t) || catOf(y.w) === "n")));
      const L = prevBy(TIMEW), R = toks[k + 1];
      if (L && L.t === "得") return { ok: true, allow: new Set(["price", "color"]) };
      if (R && !R.p && R.w && catOf(R.w) === "n" && (!L || L !== toks[k - 1] || !(L.w && catOf(L.w) === "n"))) return { ok: true, allow: new Set(isHuman(R) ? ["price"] : ["emotion", "trait", "state"]) };
      if (L && (HUMAN_PRON.has(L.t) || THING_PRON.has(L.t) || (L.w && catOf(L.w) === "n"))) {
        if (isHuman(L)) return { ok: true, allow: new Set(["price"]) };
        const lf = L.w && fieldOf(L.w);
        if (["time", "nature"].includes(lf)) return { ok: true, allow: new Set(["price", "taste", "color"]) };
        return { ok: true, allow: new Set(["emotion", "trait", "state"]) };
      }
      return { ok: false };
    }
    if (c === "v") {
      const O = nextBy((x) => SKIPADJ.has(x.t) || DET.has(x.t) || NUM.test(x.t) || (x.w && catOf(x.w) === "m"));
      const nx = toks[k + 1], nx2 = toks[k + 2];
      const atEnd = !nx || nx.p || (nx.t === "了" && (!nx2 || nx2.p));
      const prevT = toks[k - 1];
      if (atEnd && prevT && !prevT.p && !["去", "来", "想", "要", "会", "能", "可以", "喜欢", "爱", "开始", "继续", "不", "没", "别"].includes(prevT.t)) return { ok: true, transOnly: true, avoid: new Set(["play", "motion", "body", "work", "social", "change"]) };
      if (!O || !O.w || catOf(O.w) !== "n") return { ok: false };
      const of = fieldOf(O.w);
      const avoid = new Set(V_ANYOBJ);
      ((of && V_AVOID[of]) || "").split(" ").filter(Boolean).forEach((f) => avoid.add(f));
      return { ok: true, avoid };
    }
    if (c === "m") {
      const R = toks[k + 1], Lp = toks[k - 1];
      return { ok: !!(R && !R.p && R.w && catOf(R.w) === "n" && Lp && (NUM.test(Lp.t) || DET.has(Lp.t))) };
    }
    return { ok: false };
  }
  const freq = (t) => (buildCorpus().get(t) || new Set()).size;
  function cooc(a, b) {
    const A = buildCorpus().get(a), B = buildCorpus().get(b);
    if (!A || !B) return false;
    const [x, y] = A.size < B.size ? [A, B] : [B, A];
    for (const v of x) if (y.has(v)) return true;
    return false;
  }
  // Từ nội dung gần chỗ trống (cùng vế câu), đủ hiếm để mang thông tin ngữ cảnh
  function contextWords(toks, k) {
    const out = [];
    const ok = (x) => x && x.w && !x.p && ["n", "v", "a"].includes(catOf(x.w)) && !GENERIC.has(x.t) && freq(x.t) <= 60;
    for (const dir of [-1, 1]) {
      let got = 0;
      for (let j = k + dir; j >= 0 && j < toks.length && got < 2; j += dir) {
        if (toks[j].p) break;
        if (ok(toks[j])) { out.push(toks[j].t); got++; }
      }
    }
    return out;
  }

  function candidate(std, level, s, loose) {
    const hz = s.word.hz, c = catOf(s.word);
    if (!c || NOT_ANSWER.has(hz)) return null;
    if (s.zh.split(hz).length !== 2) return null;
    const toks = P().tokens(s.zh);
    const k = toks.findIndex((x) => x.t === hz);
    if (k < 0) return null;
    if (toks.filter((x) => !x.p).map((x) => x.t).join("").length < 5) return null;   // câu quá ngắn, thiếu ngữ cảnh
    const id = idOf(std, s.zh);
    const deny = window.__fillDeny || new Set();
    if ((window.__fillDrop || new Set()).has(id)) return null;
    const af = fieldOf(s.word), aS = viSyll(s.word), aChars = new Set([...hz]);
    const ctx = contextWords(toks, k);
    const { L, R } = neighbors(toks, k, c), A = buildAdj();
    const fitsNb = (d) => { const kd = keyOf(d); return !!kd && ((L && (A.after.get(L.t) || new Set()).has(kd)) || (R && (A.before.get(R.t) || new Set()).has(kd))); };
    const fr = loose ? { ok: true } : frame(toks, k, c, s.word);
    const why = window.__fillWhy;
    if (!fr.ok) { if (why) why["frame:" + c] = (why["frame:" + c] || 0) + 1; return null; }
    const bi = A.bi, Lraw = toks[k - 1], Rraw = toks[k + 1];
    const len = nHz(hz);
    const cands = poolOf(std, level).filter((d) => {
      if (d.hz === hz || catOf(d) !== c || GENERIC.has(d.hz) || deny.has(id + "|" + d.hz)) return false;
      if (c === "m" && MW_LOOSE.has(d.hz)) return false;
      if (Math.abs(nHz(d.hz) - len) > 1) return false;
      if (s.zh.includes(d.hz) || [...d.hz].some((ch) => aChars.has(ch) || s.zh.includes(ch))) return false;   // không trùng chữ với đáp án hay câu
      const df = fieldOf(d);
      if (c !== "m" && (!df || !af || df === af)) return false;   // chỉ lấy nhiễu thuộc trường nghĩa khác hẳn, đã xác định
      const dS = viSyll(d);
      for (const x of dS) if (aS.has(x)) return false;           // nghĩa chồng lấn
      if (fr.allow && !fr.allow.has(df)) return false;              // tính từ: chỉ lấy trường nghĩa không thể nói về chủ thể này
      if (fr.avoid && fr.avoid.has(df)) return false;
      if (fr.transOnly) { const st = A.vt.get(d.hz); if (!st || st.n < 3 || st.end > 0) return false; }   // chỉ lấy động từ luôn cần tân ngữ
      if ((Lraw && bi.has(Lraw.t + "|" + d.hz)) || (Rraw && bi.has(d.hz + "|" + Rraw.t))) return false;   // đã gặp đúng cụm này
      if (fitsNb(d)) return false;                                  // trường nghĩa của nhiễu đã từng đứng ở vị trí này
      if (cooc(d.hz, hz)) return false;                            // hay đi cùng đáp án (trái nghĩa, cùng loại)
      if (ctx.some((t) => cooc(d.hz, t))) return false;            // từng đi cùng ngữ cảnh của câu → có thể điền được
      return true;
    });
    const r = rng(hash(id));
    const ranked = shuffleR(cands, r).sort((a, b) => (Math.abs(nHz(a.hz) - len) - Math.abs(nHz(b.hz) - len)) || ((a.lv !== level) - (b.lv !== level)));
    const pick = [];
    const usedF = new Set();
    for (const d of ranked) {   // ưu tiên 3 nhiễu thuộc 3 trường nghĩa khác nhau
      if (pick.length >= 3) break;
      const df = fieldOf(d) || d.hz;
      if (usedF.has(df)) continue;
      if (pick.some((p) => [...p.hz].some((ch) => d.hz.includes(ch)))) continue;
      usedF.add(df); pick.push(d);
    }
    for (const d of ranked) { if (pick.length >= 3) break; if (!pick.includes(d) && !pick.some((p) => [...p.hz].some((ch) => d.hz.includes(ch)))) pick.push(d); }
    if (pick.length < 3) { if (why) why["few:" + c] = (why["few:" + c] || 0) + 1; return null; }
    return { id, s, entry: [hz, ...pick.map((d) => d.hz)], cat: c, alts: ranked.filter((d) => !pick.includes(d)).slice(0, 8).map((d) => d.hz) };
  }

  const memo = {};
  function itemsOf(std, level, gen) {
    const mk = std + level + (gen ? "g" : "");
    if (memo[mk] && !gen) return memo[mk];
    if (!gen) {
      const okm = OK(), out = [];
      P().sentencesOf(std, level).forEach((s) => { const it = make(std, level, s, okm[idOf(std, s.zh)]); if (it) out.push(it); });
      return (memo[mk] = out);
    }
    const all = [];
    P().sentencesOf(std, level).forEach((s) => { const c = candidate(std, level, s, gen === "loose"); if (c) all.push(c); });
    all.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    // chia theo từ loại cho đa dạng: danh từ 45%, động từ 35%, tính từ 15%, lượng từ 5%
    const quota = { n: 0.45, v: 0.35, a: 0.15, m: 0.05 }, cnt = { n: 0, v: 0, a: 0, m: 0 };
    const chosen = [], rest = [];
    all.forEach((c) => { if (chosen.length < CAP && cnt[c.cat] < Math.ceil(quota[c.cat] * CAP)) { chosen.push(c); cnt[c.cat]++; } else rest.push(c); });
    rest.forEach((c) => { if (chosen.length < CAP) chosen.push(c); });
    return chosen.map((c) => { const it = make(std, level, c.s, c.entry); if (it) it.alts = c.alts.map((h) => wordIn(std, level, h)); return it; }).filter(Boolean);
  }

  // Mọi câu đã duyệt của mọi chuẩn / cấp (để xuất bảng rà soát)
  function exportAll() {
    const rows = [];
    ["hsk2", "hsk3"].forEach((std) => P().STD[std].levels.forEach((l) => itemsOf(std, l).forEach((it) => rows.push(it))));
    return rows;
  }
  // Kiểm tra tự động trên một câu
  function check(it) {
    const errs = [];
    const hzs = it.opts.map((o) => o.hz);
    if (new Set(hzs).size !== 4) errs.push("trùng phương án");
    if (hzs[0] !== it.word.hz) errs.push("đáp án không có trong phương án");
    if (it.before + hzs[0] + it.after !== it.zh) errs.push("câu điền đáp án khác câu gốc");
    hzs.slice(1).forEach((d) => { if ((it.before + it.after).includes(d)) errs.push("nhiễu xuất hiện trong câu: " + d); });
    if (it.zh.split(it.hz).length !== 2) errs.push("từ xuất hiện hơn một lần");
    if (!P().tokens(it.zh).some((x) => x.t === it.hz)) errs.push("từ không đứng thành token riêng");
    it.opts.forEach((o) => { if (!o.py || !o.vi) errs.push("thiếu pinyin/nghĩa: " + o.hz); });
    hzs.slice(1).forEach((d) => { if (!wordIn(it.std, it.level, d)) errs.push("nhiễu ngoài cấp: " + d); });
    if (it.id !== idOf(it.std, it.zh)) errs.push("mã câu không khớp");
    return errs;
  }

  // ---------- Pinyin: chấp nhận "ni3" và "nǐ" (cần đúng thanh; thanh nhẹ tuỳ ý; 一/不 nhận cả thanh gốc lẫn biến điệu) ----------
  const MARK = {};
  "āáǎà|ēéěè|īíǐì|ōóǒò|ūúǔù|ǖǘǚǜ".split("|").forEach((g, i) => [...g].forEach((c, t) => (MARK[c] = ["a", "e", "i", "o", "u", "ü"][i] + (t + 1))));
  function analyze(str) {
    const s = String(str || "").normalize("NFC").toLowerCase().replace(/u:/g, "ü").replace(/v/g, "ü");
    let letters = "";
    const tone = {};
    for (const c of s) {
      if (MARK[c]) { letters += MARK[c][0]; tone[letters.length - 1] = +MARK[c][1]; }
      else if (/[a-zü]/.test(c)) letters += c;
      else if (/[0-5]/.test(c) && letters) tone[letters.length - 1] = +c === 0 ? 5 : +c;
    }
    return { letters, tone };
  }
  const SYL_RE = /[bpmfdtnlgkhjqxzcsryw]?h?[aeiouü]+(?:ngr|nr|ng|n|r)?/g;
  function pyTarget(w) {
    let letters = "";
    const spans = [], tone = {};
    String(w.py || "").split(/[\s'’\-]+/).filter(Boolean).forEach((chunk) => {
      const a = analyze(chunk), off = letters.length;
      Object.keys(a.tone).forEach((k) => (tone[+k + off] = a.tone[k]));
      let m;
      SYL_RE.lastIndex = 0;
      while ((m = SYL_RE.exec(a.letters))) spans.push([off + m.index, off + m.index + m[0].length]);
      letters += a.letters;
    });
    let chars = [...w.hz].filter((c) => /[\u3400-\u9fff]/.test(c));
    if (chars.length !== spans.length) chars = chars.filter((c) => c !== "儿");
    return { letters, syl: spans.map(([s, e], i) => ({ s, e, t: toneIn(tone, s, e) || 5, ch: chars.length === spans.length ? chars[i] : "" })) };
  }
  function toneIn(map, s, e) { for (let i = s; i < e; i++) if (map[i]) return map[i]; return null; }
  const toneCount = (map, s, e) => { let n = 0; for (let i = s; i < e; i++) if (map[i]) n++; return n; };
  // → "ok" | "tone" (đúng âm, sai/thiếu thanh) | "no"
  function pyMatch(input, w) {
    const a = analyze(input), tgt = pyTarget(w);
    if (!a.letters || a.letters !== tgt.letters) return "no";
    const ok = tgt.syl.every((y) => {
      if (toneCount(a.tone, y.s, y.e) > 1) return false;
      const ti = toneIn(a.tone, y.s, y.e);
      if (y.t === 5) return true;
      if (y.ch === "一") return ti != null && [1, 2, 4].includes(ti);
      if (y.ch === "不") return ti != null && [2, 4].includes(ti);
      return ti === y.t;
    });
    return ok ? "ok" : "tone";
  }
  // Chấm câu trả lời gõ tay: chữ Hán phải đúng từ gốc; pinyin phải đúng âm và thanh
  function judgeTyped(input, it) {
    const raw = String(input || "").trim();
    const hzOnly = raw.replace(/[\s，。！？、,.!?]/g, "");
    if (/[\u3400-\u9fff]/.test(hzOnly)) return { ok: hzOnly === it.hz, kind: "hz", typed: hzOnly };
    const r = pyMatch(raw, it.word);
    return { ok: r === "ok", kind: "py", tone: r === "tone", typed: raw };
  }

  // ---------- Giải thích ----------
  const why = (o, it) => {
    const c = catOf(o);
    const g = gloss1(o);
    if (c === "m") return `lượng từ «${g}», không dùng cho danh từ trong câu này.`;
    return `nghĩa là «${g}», đặt vào câu thì không hợp nghĩa.`;
  };
  function filled(it, cls) { return `${esc(it.before)}<mark class="fl-hit ${cls || ""}">${esc(it.hz)}</mark>${esc(it.after)}`; }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    P().setup(box, {
      std,
      counts: [10, 15, 20],
      intro: "Mỗi câu thiếu một từ. Chọn hoặc gõ từ còn thiếu vào chỗ trống.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> chọn 1 trong 4 từ, có nghĩa của câu và pinyin của từng từ. <b>Vừa:</b> chọn 1 trong 4 từ chỉ có chữ Hán, nghĩa câu để trong gợi ý. <b>Khó:</b> tự gõ từ còn thiếu bằng chữ Hán hoặc pinyin, có nghĩa của câu.<br>Pinyin gõ số thanh (<span class="kbd">xue2xi2</span>) hay dấu (<span class="kbd">xuéxí</span>) đều được, <span class="kbd">v</span> thay cho ü. Chọn bằng phím A–D hoặc 1–4, <span class="kbd">Enter</span> để qua câu.</details>`,
      bestKeyOf: (v) => `fill:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = itemsOf(std, v.level);
        if (!pool.length) { toast("Cấp này chưa có câu luyện"); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count));
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items) {
    App.setFocus(true);
    const t0 = Date.now();
    let i = 0, score = 0, right = 0;
    const wrong = [];
    const easy = cfg.diff === "easy", hard = cfg.diff === "hard";

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const opts = shuffle(it.opts);
      const blank = `<span class="fl-blank" style="--n:${nHz(it.hz)}" aria-label="chỗ trống">${"＿".repeat(Math.max(2, nHz(it.hz)))}</span>`;
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card tr-card fl-card">
          <div class="small muted fl-ask">Điền từ còn thiếu</div>
          <div class="zh fl-sent" id="flsent">${esc(it.before)}${blank}${esc(it.after)}</div>
          ${easy || hard ? `<div class="fl-vi">${esc(it.vi)}</div>` : `<details class="fl-hint"><summary>${ic("info")}Gợi ý: xem nghĩa câu</summary><div class="fl-vi">${esc(it.vi)}</div></details>`}
          ${hard
            ? `<div class="fl-type"><input id="flin" class="search" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Chữ Hán hoặc pinyin" aria-label="Từ còn thiếu"><button class="btn btn-primary" id="check">${ic("check")} Kiểm tra</button></div>
               <div class="small muted fl-len">Từ cần điền có ${nHz(it.hz)} chữ.</div>`
            : `<div class="options fl-opts" id="opts">${opts.map((o, k) => `<button class="option fl-opt" data-o="${esc(o.hz)}"><span class="opt-key">${L4[k]}</span><span class="fl-ot"><span class="zh">${esc(o.hz)}</span>${easy ? `<span class="fl-opy">${esc(o.py)}</span>` : ""}</span></button>`).join("")}</div>`}
          <div id="fb"></div>
        </div>`;
      if (hard) {
        const inp = box.querySelector("#flin");
        inp.focus();
        const check = () => {
          if (box.querySelector("#next")) return;
          const v = inp.value.trim();
          if (!v) { inp.focus(); toast("Hãy gõ từ còn thiếu trước", { type: "info" }); return; }
          inp.readOnly = true; box.querySelector("#check").disabled = true;
          const j = judgeTyped(v, it);
          verdict(it, j.ok, j);
        };
        box.querySelector("#check").onclick = check;
        inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); e.stopPropagation(); const n = box.querySelector("#next"); n ? n.click() : check(); } });
        App.keyHandler = (e) => { if (e.key === "Enter" && e.target !== inp) { const n = box.querySelector("#next"); if (n) n.click(); } };
      } else {
        const pick = (b) => {
          if (box.querySelector("#next")) return;
          const ok = b.dataset.o === it.hz;
          box.querySelectorAll("[data-o]").forEach((x) => { x.disabled = true; if (x.dataset.o === it.hz) x.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          verdict(it, ok, { picked: b.dataset.o });
        };
        box.querySelectorAll("[data-o]").forEach((b) => b.onclick = () => pick(b));
        App.keyHandler = (e) => {
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          const k = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[e.key.toLowerCase()];
          const bs = box.querySelectorAll("[data-o]");
          if (k != null && bs[k] && !bs[k].disabled) pick(bs[k]);
          else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) { e.preventDefault(); n.click(); } }
        };
      }
    }

    function verdict(it, ok, info) {
      if (ok) { score += 10; right++; }
      const ans = it.opts[0];
      let note = "";
      if (!ok) {
        note = info.picked ? `Bạn chọn ${info.picked}, đúng là ${it.hz}` : `Bạn gõ «${info.typed}», đúng là ${it.hz}`;
        wrong.push({ hz: it.zh, py: it.py, vi: it.vi, say: it.zh, note });
      }
      const sent = box.querySelector("#flsent");
      sent.innerHTML = filled(it, ok ? "" : "bad");
      const hint = box.querySelector(".fl-hint"); if (hint) hint.open = true;
      let typedLine = "";
      if (hard && !ok) {
        if (info.kind === "py" && info.tone) typedLine = `Bạn gõ đúng âm nhưng chưa đúng thanh. Pinyin của từ: ${esc(ans.py)}.`;
        else if (info.kind === "hz") {
          const tw = info.typed && P().lookup(info.typed);
          typedLine = tw ? `Bạn gõ ${esc(tw.hz)} (${esc(tw.py)} – ${esc(gloss1(tw))}); câu này cần đúng từ ${esc(it.hz)}.` : `Bạn gõ «${esc(info.typed)}»; câu này cần từ ${esc(it.hz)}.`;
        } else typedLine = `Bạn gõ «${esc(info.typed)}»; câu này cần từ ${esc(it.hz)} (${esc(ans.py)}).`;
      } else if (hard && ok && info.kind === "py") typedLine = `Chữ Hán: ${esc(it.hz)}.`;
      const ds = it.opts.slice(1);
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
          <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span></div>
          <div class="tr-zh-row"><div class="zh fl-full">${filled(it)}</div>${speakBtn(it.zh)}</div>
          <div class="fl-py">${pyHtml(it.py)}</div><div class="muted">${esc(it.vi)}</div>
          ${typedLine ? `<p class="small fl-typed">${typedLine}</p>` : ""}
          <div class="small tr-key">Từ cần điền: <b class="zh">${esc(it.hz)}</b> ${pyHtml(ans.py)} – ${esc(ans.vi)}${catOf(ans) ? ` <span class="muted">(${CAT_VI[catOf(ans)]})</span>` : ""}</div>
          ${hard ? "" : `<div class="small fl-why-h">Vì sao các từ khác không hợp</div><ul class="small tr-why fl-why">${ds.map((o) => `<li class="${info.picked === o.hz ? "picked" : ""}"><b class="zh">${esc(o.hz)}</b> ${esc(o.py)}: ${esc(why(o, it))}</li>`).join("")}</ul>`}
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { if (!fb.isConnected || !fb.contains(fb.querySelector("#next"))) return; i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const from = P().nameIn(P().feature("fill"), std);
      const isBest = P().record({ type: "fill", std, level: cfg.level, title: `${from} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey: `fill:${std}:${cfg.level}:${cfg.diff}` });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.zh));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from,
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register("fill", { run });
  window.FillDrill = { itemsOf, exportAll, check, judgeTyped, pyMatch, fieldOf, idOf, candidate };   // dùng cho kiểm thử và rà soát
})();
