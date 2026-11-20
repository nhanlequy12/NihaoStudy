// Lộ trình · «Bù HSK 3.0»: nối bài bổ sung HSK 3.0 (H3_LESSONS, cấp N) vào cuối Giai đoạn N, sau các bài HSK 2.0 và trước kiểm tra tổng hợp.
// Mỗi bài bổ sung chia thành các phần như bài HSK 2.0 (học · luyện nhanh · kiểm tra nhanh, đạt 70%, từ vào bộ thẻ ôn tập).
// Các phần này KHÔNG bắt buộc (opt: true): kiểm tra tổng hợp vẫn mở khi xong các phần HSK 2.0, nên người đang học không bị khóa lại.
// Không soạn nội dung tiếng Trung mới: chỉ tham chiếu mã bài, mã từ (VOCAB hoặc "h3_<chữ>" như js/h30.js), chỉ số ngữ pháp / câu mẫu.
// Mã phần: s<N>-<mã bài>a|b|c|d (vd. s1-h3b-01a); chặng (Giai đoạn 4–6): s<N>-h3c, bài ôn: s<N>-h3r. Tiến độ cũ không bị ảnh hưởng.
// Chạy sau js/path-hsk.js, không dùng DOM (kiểm bằng data/scripts/check_path_h30.py trong Node).
(function () {
  const W = window;
  if (!W.STAGES || !W.VOCAB || !W.H3_LESSONS || !W.HSK3_WORDS) return;
  // trên trình duyệt: chỉ thêm phần bù khi path.js là bản biết hiển thị chúng (tránh bản path.js cũ còn trong bộ nhớ đệm bị lỗi)
  if (W.document && !(W.Path && W.Path.bridge)) return;
  const MIN = W.PATH_MIN || { word: 1.2, grammar: 3, line: 0.5, sentence: 0.3, question: 0.4, tips: 1, base: 5 };
  const LETTER = "abcd";
  const nfc = (s) => String(s).normalize("NFC").toLowerCase();
  const NAME = "Bù HSK 3.0";

  // Tra từ theo chữ giống js/h30.js: từ đã có trong VOCAB dùng chung mã (mục đầu tiên cùng chữ); từ chỉ có trong HSK 3.0 có mã "h3_<chữ>"
  const byHz = new Map();
  W.VOCAB.forEach((w) => { if (!byHz.has(w.hz)) byHz.set(w.hz, w); });
  const pyOfHz = new Map(); // chữ → tập cách đọc (VOCAB + bảng từ HSK 3.0) để chọn từ nghe an toàn
  const addPy = (hz, py) => { const s = pyOfHz.get(hz) || new Set(); s.add(nfc(py)); pyOfHz.set(hz, s); };
  W.VOCAB.forEach((w) => addPy(w.hz, w.py));
  W.HSK3_WORDS.forEach((r) => {
    if (r.length <= 2) return;
    addPy(r[0], r[1]);
    if (!byHz.has(r[0])) byHz.set(r[0], { id: "h3_" + r[0], hz: r[0], py: r[1] });
  });
  const MONO = new Map();
  (W.SYLLABLES || []).forEach((r) => r[3].forEach((c, t) => { if (c && !c[1] && t < 4) MONO.set(c[0], nfc(r[2][t])); }));
  const canHear = (w) => /^[一-鿿]+$/.test(w.hz) && pyOfHz.get(w.hz).size === 1 && (w.hz.length > 1 || MONO.get(w.hz) === nfc(w.py));

  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const sizes = (n, k) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));
  const cut = (arr, k) => { const out = []; let p = 0; sizes(arr.length, k).forEach((s) => { out.push(arr.slice(p, p + s)); p += s; }); return out; };

  // Chia bài thành k phần sao cho thời lượng các phần gần bằng nhau: phần cuối mang hội thoại + câu mẫu nên nhận ít từ hơn.
  // Thử k = 2, 3, 4; lấy k nhỏ nhất mà mọi phần không quá 30 phút (nếu không có thì k = 4).
  function plan(L, words, orderN) {
    const per = MIN.word + MIN.question; // mỗi từ: học + một câu kiểm tra
    let best = null;
    for (let k = 2; k <= 4; k++) {
      const gs = cut(L.grammar.map((_, i) => i), k);
      const fixed = gs.map((g, i) => g.length * MIN.grammar + (i === 0 ? MIN.tips : 0) + MIN.base +
        (i === k - 1 ? L.dialogue.length * MIN.line + L.sentences.length * MIN.sentence + orderN * MIN.question : 0));
      const target = (sum(fixed) + words.length * per) / k;
      const ws = fixed.map((f) => Math.max(1, Math.floor((target - f) / per)));
      const mins = () => fixed.map((f, j) => f + ws[j] * per);
      // bù số từ còn thiếu vào phần ngắn nhất; nếu dư (chỉ khi bài rất ít từ) thì bớt ở phần dài nhất còn hơn 1 từ
      const pick = (better, ok) => mins().reduce((m, v, j, a) => (ok(j) && (m < 0 || better(v, a[m])) ? j : m), -1);
      for (let rest = words.length - sum(ws); rest !== 0; rest += rest > 0 ? -1 : 1) {
        const i = rest > 0 ? pick((a, b) => a < b, () => true) : pick((a, b) => a > b, (j) => ws[j] > 1);
        if (i < 0) break;
        ws[i] += rest > 0 ? 1 : -1;
      }
      best = { k, gs, ws };
      if (Math.max(...mins()) <= 30) break;
    }
    return best;
  }
  const minutes = (p, L) => Math.round(p.words.length * MIN.word + p.grammar.length * MIN.grammar + (p.dialogue ? L.dialogue.length * MIN.line : 0) +
    p.sentences.length * MIN.sentence + p.quiz.length * MIN.question + (p.tips ? MIN.tips : 0) + MIN.base);

  function partsOf(L, no, N) {
    const words = L.words.map((hz) => byHz.get(hz)).filter(Boolean);
    const orderable = L.sentences.map((s, i) => ({ s, i })).filter((o) => o.s[0].trim().split(/\s+/).length >= 3).map((o) => o.i);
    const orderIdx = [...new Set([orderable[0], orderable[Math.floor(orderable.length / 2)], orderable[orderable.length - 1]])].filter((i) => i != null);
    const { k, gs, ws } = plan(L, words, orderIdx.length);
    const lessonName = `Bổ sung HSK 3.0 · Bài ${no}`;
    let p0 = 0;
    return ws.map((n, i) => {
      const wl = words.slice(p0, p0 + n); p0 += n;
      const last = i === k - 1, A = LETTER[i].toUpperCase();
      const p = {
        id: `s${N}-${L.id}${LETTER[i]}`, kind: "part", opt: true, h3: true, lesson: L.id, part: i, of: k,
        title: `${L.title} · Phần ${A}`, label: `${lessonName} · Phần ${A}`, lessonName, icon: L.icon,
        words: wl.map((w) => w.id), grammar: gs[i], tips: i === 0, dialogue: last, sentences: last ? L.sentences.map((_, j) => j) : [],
        reading: null, hear: wl.filter(canHear).map((w) => w.id),
      };
      const hear = new Set(p.hear);
      const kinds = (off) => wl.map((w, j) => { const t = ["mean", "char", "hear"][(j + off) % 3]; return { t: t === "hear" && !hear.has(w.id) ? ((j + off) % 2 ? "char" : "mean") : t, id: w.id }; });
      p.quiz = [...kinds(0), ...(last ? orderIdx.map((k2) => ({ t: "order", lesson: L.id, k: k2 })) : [])];
      p.drill = kinds(1);
      p.min = minutes(p, L);
      return p;
    });
  }

  const PRACTICE = (N) => [
    ["rain", "Mưa từ vựng", "Gõ pinyin hoặc chữ Hán để bắn vỡ bong bóng từ"], ["fill", "Điền từ", "Chọn từ còn thiếu trong câu"],
    ["order", "Sắp xếp câu", "Kéo các từ thành câu đúng"], ["dictation", "Chép chính tả", "Nghe rồi gõ lại chữ Hán hoặc pinyin"],
    ["qa", "Hỏi đáp", "Chọn câu đáp hợp với câu hỏi"],
    ...(N >= 3 ? [["position", "Chọn vị trí từ", "Đặt từ vào đúng chỗ trong câu"], ["fix", "Sửa câu sai", "Tìm câu sai ngữ pháp"], ["translate", "Luyện dịch", "Dịch câu Trung sang Việt"]] : []),
  ].map(([key, label, desc]) => ({ key, href: `#/practice/${key}/hsk3`, std: "hsk3", label, desc: `${desc} · HSK 3.0 cấp ${N}` }));

  W.STAGES.forEach((st) => {
    const N = st.id;
    if (!(N >= 1 && N <= 6) || st.bridge) return;
    const lessons = W.H3_LESSONS.map((L, i) => ({ L, no: i + 1 })).filter((o) => o.L.level === N);
    if (!lessons.length) return;
    const parts = lessons.flatMap((o) => partsOf(o.L, o.no, N));
    const steps = [...parts];
    if (st.chang && st.chang.length) {
      const rv = { id: `s${N}-h3r`, kind: "review", opt: true, h3: true, chang: st.chang.length + 1, title: `Ôn tập ${NAME}`, label: `Ôn tập ${NAME} · ${lessons.length} bài bổ sung HSK 3.0 cấp ${N}`,
        icon: "复", min: 15, lessons: lessons.map((o) => o.L.id), parts: parts.map((p) => p.id), words: parts.flatMap((p) => p.words), n: 20 };
      steps.push(rv);
      st.chang.push({ no: st.chang.length + 1, name: NAME, label: `${lessons.length} bài bổ sung HSK 3.0 cấp ${N} · không bắt buộc`, opt: true, lessons: rv.lessons, steps: steps.map((x) => x.id) });
    }
    st.steps.push(...steps);
    st.bridge = lessons.map((o) => o.L.id);
    st.bridgePractice = PRACTICE(N);
    st.sub += ` Cuối giai đoạn có ${lessons.length} bài ${NAME} (${parts.reduce((a, p) => a + p.words.length, 0)} từ HSK 3.0 cấp ${N} chưa có trong HSK 2.0), không bắt buộc.`;
  });
})();
