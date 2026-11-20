// Lộ trình từng bước · Giai đoạn 1–6 (HSK 2.0 cấp 1–6): sinh tự động từ bài học sẵn có (LESSONS, VOCAB, READINGS).
// Không chép hay soạn nội dung tiếng Trung mới: mỗi phần chỉ giữ tham chiếu (mã bài, mã từ, chỉ số ngữ pháp / câu mẫu).
// Giai đoạn N = các bài HSK 2.0 cấp N (bài chính + «Bổ sung 2012» của cấp đó; không gồm bài HSK 3.0).
// Mỗi bài chia 2 phần (A/B), bài từ 18 từ trở lên chia 3 phần (A/B/C); hội thoại, câu mẫu và bài đọc ở phần cuối.
// Giai đoạn 4–6 dài nên gom thành «chặng» và có một bài ôn ngắn cuối chặng: Giai đoạn 4, 6 chia theo số bài (10 bài/chặng),
// Giai đoạn 5 chia theo chủ đề (bảng TOPICS, 5–11 bài/chặng; bài chưa có trong bảng vào chặng cuối để không sót bài).
// Kiểm tra bằng data/scripts/check_path.py. Tệp không dùng DOM để chạy được trong Node.
(function () {
  const W = window;
  if (!W.LESSONS || !W.VOCAB) return;
  W.STAGES = W.STAGES || [];
  const lvOf = (l) => l.level || (l.id <= 12 ? 1 : l.id <= 24 ? 2 : l.id <= 44 ? 3 : l.id <= 84 ? 4 : l.id <= 149 ? 5 : 6);
  const isBS = (l) => typeof l.id === "number" && l.id > 300;
  const nameOf = (l) => (isBS(l) ? `Bổ sung 2012 · Bài ${l.id - 300}` : `Bài ${l.id}`);
  const nfc = (s) => String(s).normalize("NFC").toLowerCase();
  const LETTER = "ABC";
  const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Thời lượng ước lượng (phút) của một phần; check_path.py tính lại theo đúng các hệ số này
  const MIN = { word: 1.2, grammar: 3, line: 0.5, sentence: 0.3, question: 0.4, tips: 1, base: 5 };
  const META = { 1: { time: "6–8 tuần" }, 2: { time: "8–12 tuần" }, 3: { time: "4–6 tháng" }, 4: { time: "8–12 tháng", chang: 10 }, 5: { time: "12–16 tháng" }, 6: { time: "18–24 tháng", chang: 10 } };
  // Chặng theo chủ đề: tên chặng → mã bài (bài chính rồi «Bổ sung 2012»). Chủ đề cụ thể, đời sống trước; từ trừu tượng và ngữ pháp sau.
  // Bài ôn của chặng chủ đề dùng mã `sN-c<n>` (không phải `sN-r<n>` của cách chia theo số bài) để tiến độ cũ không được tính cho nội dung khác.
  const TOPICS = {
    5: [
      ["Gia đình, con người và sức khỏe", [85, 86, 87, 88, 305, 307]],
      ["Ăn uống, trang phục và nhà cửa", [89, 90, 91, 92, 93, 94, 309]],
      ["Thành phố, đi lại và thiên nhiên", [95, 96, 97, 98, 99, 308]],
      ["Khoa học, kỹ thuật và trường học", [100, 101, 102, 103, 104, 304]],
      ["Ngôn ngữ, truyền thông và văn hoá", [105, 106, 107, 108, 109, 110]],
      ["Xã hội, nhà nước và kinh tế", [111, 112, 113, 114, 115, 116, 117, 118, 306]],
      ["Tính cách và cảm xúc", [119, 120, 121, 122, 123, 124]],
      ["Hành động, tư duy và phát triển", [125, 126, 127, 128, 129, 130, 131, 132, 133, 134]],
      ["Miêu tả sự vật và từ trừu tượng", [135, 136, 137, 138, 139, 140, 141, 142]],
      ["Ngữ pháp: hư từ và bổ ngữ", [143, 144, 145, 146, 147, 148, 149]],
    ],
  };

  // Câu nghe chỉ đọc: từ nhiều chữ là từ đầu mục có một cách đọc duy nhất trong VOCAB (máy đọc cả từ, đáp án là pinyin của từ),
  // hoặc chữ đơn một âm theo CC-CEDICT (lấy từ bảng âm tiết: ô không kèm từ ví dụ là chữ chỉ có một cách đọc).
  const pyOfHz = new Map();
  W.VOCAB.forEach((w) => { const s = pyOfHz.get(w.hz) || new Set(); s.add(nfc(w.py)); pyOfHz.set(w.hz, s); });
  // mã bài → từ của bài (giữ thứ tự VOCAB), dựng một lần thay vì lọc VOCAB cho từng bài
  const wordsOf = new Map();
  W.VOCAB.forEach((w) => { const a = wordsOf.get(w.l); if (a) a.push(w); else wordsOf.set(w.l, [w]); });
  const MONO = new Map();
  (W.SYLLABLES || []).forEach((r) => r[3].forEach((c, t) => { if (c && !c[1] && t < 4) MONO.set(c[0], nfc(r[2][t])); }));
  const canHear = (w) => /^[一-鿿]+$/.test(w.hz) && pyOfHz.get(w.hz).size === 1 && (w.hz.length > 1 || MONO.get(w.hz) === nfc(w.py));

  // chia n phần tử thành k nhóm gần bằng nhau, nhóm đầu nhiều hơn
  const sizes = (n, k) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));
  const cut = (arr, k) => { const out = []; let p = 0; sizes(arr.length, k).forEach((s) => { out.push(arr.slice(p, p + s)); p += s; }); return out; };
  const minutes = (p, L) => Math.round(p.words.length * MIN.word + p.grammar.length * MIN.grammar + (p.dialogue ? L.dialogue.length * MIN.line : 0) +
    p.sentences.length * MIN.sentence + p.quiz.length * MIN.question + (p.tips ? MIN.tips : 0) + MIN.base);

  function partsOf(L, N) {
    const words = wordsOf.get(L.id) || [];
    const k = words.length >= 18 ? 3 : 2;
    const ws = cut(words, k), gs = cut(L.grammar.map((_, i) => i), k);
    // câu sắp xếp: tối đa 3 câu mẫu có từ 3 mảnh trở lên, rải đều trong danh sách
    const orderable = L.sentences.map((s, i) => ({ s, i })).filter((o) => o.s[0].trim().split(/\s+/).length >= 3).map((o) => o.i);
    const orderIdx = [...new Set([orderable[0], orderable[Math.floor(orderable.length / 2)], orderable[orderable.length - 1]])].filter((i) => i != null);
    const reading = (W.READINGS || []).find((r) => r.after === L.id);
    return ws.map((wl, i) => {
      const last = i === k - 1;
      const p = {
        id: `s${N}-${L.id}${LETTER[i].toLowerCase()}`, kind: "part", lesson: L.id, part: i, of: k,
        title: `${L.title} · Phần ${LETTER[i]}`, label: `${nameOf(L)} · Phần ${LETTER[i]}`, lessonName: nameOf(L), icon: L.icon,
        words: wl.map((w) => w.id), grammar: gs[i], tips: i === 0, dialogue: last, sentences: last ? L.sentences.map((_, j) => j) : [],
        reading: last && reading ? reading.id : null,
        hear: wl.filter(canHear).map((w) => w.id),
      };
      // Kiểm tra nhanh: mỗi từ một câu, xoay vòng nghĩa → chọn chữ → nghe (chỉ từ nghe an toàn), thêm câu sắp xếp ở phần cuối
      const hear = new Set(p.hear);
      const kinds = (off) => wl.map((w, j) => { const t = ["mean", "char", "hear"][(j + off) % 3]; return { t: t === "hear" && !hear.has(w.id) ? ((j + off) % 2 ? "char" : "mean") : t, id: w.id }; });
      p.quiz = [...kinds(0), ...(last ? orderIdx.map((k2) => ({ t: "order", lesson: L.id, k: k2 })) : [])];
      p.drill = kinds(1); // luyện nhanh: cùng từ, đổi dạng câu
      return p;
    }).map((p, i, all) => {
      // phần cuối dài hơn 30 phút (hội thoại + câu mẫu) thì chuyển bớt điểm ngữ pháp đầu của nó sang phần trước
      if (i === all.length - 1) while (minutes(p, L) > 30 && p.grammar.length > 1) all[i - 1].grammar.push(p.grammar.shift());
      return p;
    }).map((p) => Object.assign(p, { min: minutes(p, L) }));
  }

  const PRACTICE = (N) => [
    ["rain", "Mưa từ vựng", "Gõ pinyin hoặc chữ Hán để bắn vỡ bong bóng từ"],
    ["fill", "Điền từ", "Chọn từ còn thiếu trong câu"],
    ["order", "Sắp xếp câu", "Kéo các từ thành câu đúng"],
    ["dictation", "Chép chính tả", "Nghe rồi gõ lại chữ Hán hoặc pinyin"],
    ["qa", "Hỏi đáp", "Chọn câu đáp hợp với câu hỏi"],
    ...(N >= 3 ? [["position", "Chọn vị trí từ", "Đặt từ vào đúng chỗ trong câu"], ["fix", "Sửa câu sai", "Tìm câu sai ngữ pháp"], ["translate", "Luyện dịch", "Dịch câu Trung sang Việt"]] : []),
  ].map(([key, label, desc]) => ({ key, href: `#/practice/${key}/hsk2`, label, desc: `${desc} · chọn HSK ${N}` }));

  // chia theo số bài: mỗi chặng `size` bài, nhóm lẻ cuối dưới nửa chặng thì nhập vào chặng trước
  function groupBySize(lessons, size) {
    const groups = [];
    for (let i = 0; i < lessons.length; i += size) groups.push(lessons.slice(i, i + size));
    if (groups.length > 1 && groups[groups.length - 1].length < size / 2) groups[groups.length - 2].push(...groups.pop());
    return groups.map((g) => ({ topic: null, lessons: g }));
  }
  // chia theo chủ đề: giữ thứ tự bài của giai đoạn trong mỗi chặng; mã bài trùng giữa hai chủ đề thì tính cho chủ đề trước;
  // bài không có trong bảng (bài mới thêm) vào chặng cuối; chủ đề không còn bài nào thì bỏ
  function groupByTopic(lessons, topics) {
    const left = new Set(lessons.map((l) => l.id));
    const groups = topics.map(([topic, ids]) => {
      const want = new Set(ids.filter((id) => left.has(id)));
      want.forEach((id) => left.delete(id));
      return { topic, want };
    });
    left.forEach((id) => groups[groups.length - 1].want.add(id));
    return groups.filter((g) => g.want.size).map((g) => ({ topic: g.topic, lessons: lessons.filter((l) => g.want.has(l.id)) }));
  }
  // «Bài 85–92», «Bài 85–88, 93» …: các dãy liên tiếp viết gọn bằng gạch nối
  const ranges = (ids) => ids.reduce((rs, id) => {
    const r = rs[rs.length - 1];
    if (r && id === r[1] + 1) r[1] = id; else rs.push([id, id]);
    return rs;
  }, []).map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(", ");

  function build(N) {
    const lessons = W.LESSONS.filter((l) => !l.h3 && lvOf(l) === N).sort((a, b) => isBS(a) - isBS(b) || a.id - b.id);
    if (!lessons.length) return null;
    const meta = META[N], topics = TOPICS[N], size = meta.chang;
    const groups = topics ? groupByTopic(lessons, topics) : size ? groupBySize(lessons, size) : [{ topic: null, lessons }];
    const steps = [], chang = [];
    groups.forEach((g, gi) => {
      const ps = g.lessons.flatMap((L) => partsOf(L, N));
      steps.push(...ps);
      if (!topics && !size) return;
      const no = gi + 1, reg = g.lessons.filter((l) => !isBS(l)).map((l) => l.id), bs = g.lessons.length - reg.length;
      const label = (reg.length ? `Bài ${ranges(reg)}` : "") + (bs ? `${reg.length ? " + " : ""}${bs} bài bổ sung 2012` : "");
      const name = `Chặng ${no}${g.topic ? ` · ${g.topic}` : ""}`, title = `Ôn tập chặng ${no}${g.topic ? ` · ${g.topic}` : ""}`;
      const rv = { id: `s${N}-${topics ? "c" : "r"}${no}`, kind: "review", chang: no, title, label: `${title} · ${label}`, icon: "复", min: 15,
        lessons: g.lessons.map((l) => l.id), parts: ps.map((p) => p.id), words: ps.flatMap((p) => p.words), n: 20 };
      steps.push(rv);
      chang.push({ no, name, label, lessons: rv.lessons, steps: [...rv.parts, rv.id] });
    });
    const parts = steps.filter((x) => x.kind === "part"), nRead = parts.filter((p) => p.reading).length;
    return {
      id: N, level: N, name: `Giai đoạn ${N}`, title: `HSK ${N}`, std: `HSK 2.0 cấp ${N}`, time: meta.time,
      sub: `${lessons.length} bài HSK ${N} sẵn có, ${num(parts.reduce((a, p) => a + p.words.length, 0))} từ, ${lessons.reduce((a, l) => a + l.grammar.length, 0)} điểm ngữ pháp${nRead ? `, ${nRead} bài đọc` : ""}.${chang.length ? ` Gom thành ${chang.length} chặng${topics ? " theo chủ đề" : ""}, cuối mỗi chặng có bài ôn ngắn.` : ""}`,
      lessons: lessons.map((l) => l.id), steps, chang,
      practice: PRACTICE(N),
      test: { id: `s${N}-test`, title: `Kiểm tra tổng hợp Giai đoạn ${N}`, exam: N },
    };
  }

  for (let N = 1; N <= 6; N++) { if (!W.STAGES.some((s) => s.id === N)) { const st = build(N); if (st) W.STAGES.push(st); } }
  W.STAGES.sort((a, b) => a.id - b.id);
  W.PATH_MIN = MIN;
  W.PATH_TOPICS = TOPICS;
})();
