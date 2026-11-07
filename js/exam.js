// Thi thử HSK: cấu trúc đề theo đề thi chính thức (HSK 1–5, bộ cũ), sinh câu hỏi từ kho từ/câu/hội thoại/bài đọc của web, chấm điểm.
// Vì web không có tranh và băng ghi âm thật, các phần "nhìn tranh" được thay bằng nghĩa tiếng Việt, phần nghe dùng giọng đọc của trình duyệt.
(function () {
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr, n, exclude) => shuffle(arr.filter((x) => !exclude || !exclude.includes(x))).slice(0, n);
  const levelOfId = (id) => (id <= 12 ? 1 : id <= 24 ? 2 : id <= 44 ? 3 : id <= 84 ? 4 : 5);
  const levelOfWord = (w) => w.level || levelOfId(w.l);
  const levelOfLesson = (l) => l.level || levelOfId(l.id);

  // ---------- Cấu trúc đề chính thức ----------
  // minutes: thời gian làm từng phần theo đề thật; plays: số lần phát mỗi câu nghe; choices: số đáp án trắc nghiệm.
  window.EXAM_SPEC = {
    1: {
      name: "HSK 1", total: 200, pass: 120, plays: 2, choices: 3, questions: 40, minutes: 40,
      sections: [
        { key: "listening", name: "一、听力", vi: "Nghe hiểu", minutes: 15, parts: [
          { name: "第一部分", vi: "Nghe một câu, phán đoán nội dung tiếng Việt cho sẵn đúng (✓) hay sai (✗). Đề thật dùng tranh.", type: "l_tf", n: 5 },
          { name: "第二部分", vi: "Nghe một câu, chọn nghĩa đúng. Đề thật chọn tranh A/B/C.", type: "l_pick", n: 5 },
          { name: "第三部分", vi: "Nghe một đoạn hội thoại ngắn, chọn nội dung tương ứng. Đề thật nối với tranh A–F.", type: "l_dialog_pick", n: 5 },
          { name: "第四部分", vi: "Nghe một câu hỏi, chọn câu trả lời phù hợp trong 3 lựa chọn.", type: "l_reply", n: 5 },
        ] },
        { key: "reading", name: "二、阅读", vi: "Đọc hiểu", minutes: 17, parts: [
          { name: "第一部分", vi: "Từ và nghĩa cho sẵn có khớp nhau không (✓/✗). Đề thật dùng tranh.", type: "r_word_tf", n: 5 },
          { name: "第二部分", vi: "Chọn nghĩa đúng của câu trong nhóm A–F (có một đáp án thừa).", type: "r_match_vi", n: 5 },
          { name: "第三部分", vi: "Nối câu hỏi với câu trả lời trong nhóm A–F.", type: "r_match_qa", n: 5 },
          { name: "第四部分", vi: "Chọn từ trong nhóm A–F điền vào chỗ trống.", type: "r_cloze", n: 5 },
        ] },
      ],
    },
    2: {
      name: "HSK 2", total: 200, pass: 120, plays: 2, choices: 3, questions: 60, minutes: 55,
      sections: [
        { key: "listening", name: "一、听力", vi: "Nghe hiểu", minutes: 25, parts: [
          { name: "第一部分", vi: "Nghe một câu, phán đoán nội dung tiếng Việt đúng (✓) hay sai (✗). Đề thật dùng tranh.", type: "l_tf", n: 10 },
          { name: "第二部分", vi: "Nghe hội thoại ngắn, chọn nội dung tương ứng. Đề thật nối với tranh A–F.", type: "l_dialog_pick", n: 5 },
          { name: "第三部分", vi: "Nghe hội thoại hai câu và câu hỏi, chọn đáp án đúng.", type: "l_dialog_q", n: 10 },
          { name: "第四部分", vi: "Nghe hội thoại dài hơn (4–5 câu), chọn câu đúng với nội dung.", type: "l_dialog_long", n: 10 },
        ] },
        { key: "reading", name: "二、阅读", vi: "Đọc hiểu", minutes: 22, parts: [
          { name: "第一部分", vi: "Chọn nghĩa đúng của câu trong nhóm A–F. Đề thật nối với tranh.", type: "r_match_vi", n: 5 },
          { name: "第二部分", vi: "Chọn từ trong nhóm A–F điền vào chỗ trống.", type: "r_cloze", n: 5 },
          { name: "第三部分", vi: "Đọc câu, phán đoán nhận định ★ đúng (✓) hay sai (✗).", type: "r_tf", n: 5 },
          { name: "第四部分", vi: "Nối câu hỏi với câu trả lời trong nhóm A–F.", type: "r_match_qa", n: 10 },
        ] },
      ],
    },
    3: {
      name: "HSK 3", total: 300, pass: 180, plays: 2, choices: 3, questions: 80, minutes: 90,
      sections: [
        { key: "listening", name: "一、听力", vi: "Nghe hiểu", minutes: 35, parts: [
          { name: "第一部分", vi: "Nghe hội thoại ngắn, chọn nội dung tương ứng. Đề thật nối với tranh A–F.", type: "l_dialog_pick", n: 10 },
          { name: "第二部分", vi: "Nghe một đoạn ngắn, phán đoán nhận định ★ đúng (✓) hay sai (✗).", type: "l_tf_long", n: 10 },
          { name: "第三部分", vi: "Nghe hội thoại hai câu và câu hỏi, chọn đáp án đúng.", type: "l_dialog_q", n: 10 },
          { name: "第四部分", vi: "Nghe hội thoại dài (4–5 câu), chọn câu đúng với nội dung.", type: "l_dialog_long", n: 10 },
        ] },
        { key: "reading", name: "二、阅读", vi: "Đọc hiểu", minutes: 30, parts: [
          { name: "第一部分", vi: "Nối câu hỏi với câu trả lời trong nhóm A–F.", type: "r_match_qa", n: 10 },
          { name: "第二部分", vi: "Chọn từ trong nhóm A–F điền vào chỗ trống.", type: "r_cloze", n: 10 },
          { name: "第三部分", vi: "Đọc đoạn văn ngắn, chọn đáp án đúng cho câu hỏi.", type: "r_passage", n: 10 },
        ] },
        { key: "writing", name: "三、书写", vi: "Viết", minutes: 15, parts: [
          { name: "第一部分", vi: "Sắp xếp các từ cho sẵn thành câu đúng.", type: "w_order", n: 5 },
          { name: "第二部分", vi: "Viết chữ Hán vào chỗ trống theo pinyin cho sẵn.", type: "w_char", n: 5 },
        ] },
      ],
    },
    4: {
      name: "HSK 4", total: 300, pass: 180, plays: 1, choices: 4, questions: 100, minutes: 105,
      sections: [
        { key: "listening", name: "一、听力", vi: "Nghe hiểu", minutes: 30, parts: [
          { name: "第一部分", vi: "Nghe một đoạn ngắn, phán đoán nhận định ★ đúng (✓) hay sai (✗). Chỉ phát một lần.", type: "l_tf_long", n: 10 },
          { name: "第二部分", vi: "Nghe hội thoại hai câu và câu hỏi, chọn đáp án đúng trong 4 lựa chọn.", type: "l_dialog_q", n: 15 },
          { name: "第三部分", vi: "Nghe hội thoại hoặc đoạn văn dài, chọn câu đúng với nội dung.", type: "l_dialog_long", n: 20 },
        ] },
        { key: "reading", name: "二、阅读", vi: "Đọc hiểu", minutes: 40, parts: [
          { name: "第一部分", vi: "Chọn từ trong nhóm A–F điền vào chỗ trống.", type: "r_cloze", n: 10 },
          { name: "第二部分", vi: "Sắp xếp ba câu A, B, C theo đúng thứ tự.", type: "r_order", n: 10 },
          { name: "第三部分", vi: "Đọc đoạn văn, chọn đáp án đúng cho câu hỏi.", type: "r_passage", n: 20 },
        ] },
        { key: "writing", name: "三、书写", vi: "Viết", minutes: 25, parts: [
          { name: "第一部分", vi: "Sắp xếp các từ cho sẵn thành câu đúng.", type: "w_order", n: 10 },
          { name: "第二部分", vi: "Dùng từ cho sẵn viết một câu. Đề thật kèm tranh và do giám khảo chấm; ở đây máy chỉ kiểm tra sơ bộ.", type: "w_sentence", n: 5 },
        ] },
      ],
    },
    5: {
      name: "HSK 5", total: 300, pass: 180, plays: 1, choices: 4, questions: 100, minutes: 125,
      sections: [
        { key: "listening", name: "一、听力", vi: "Nghe hiểu", minutes: 30, parts: [
          { name: "第一部分", vi: "Nghe hội thoại ngắn và câu hỏi, chọn đáp án đúng trong 4 lựa chọn. Chỉ phát một lần.", type: "l_dialog_q", n: 20 },
          { name: "第二部分", vi: "Nghe hội thoại dài hoặc đoạn độc thoại, chọn câu đúng với nội dung.", type: "l_dialog_long", n: 25 },
        ] },
        { key: "reading", name: "二、阅读", vi: "Đọc hiểu", minutes: 45, parts: [
          { name: "第一部分", vi: "Chọn từ thích hợp điền vào chỗ trống trong đoạn văn (nhóm đáp án dùng chung).", type: "r_cloze", n: 15 },
          { name: "第二部分", vi: "Đọc đoạn văn ngắn, chọn câu phù hợp với nội dung.", type: "r_passage", n: 10 },
          { name: "第三部分", vi: "Đọc đoạn văn dài, trả lời câu hỏi theo nội dung.", type: "r_passage", n: 20 },
        ] },
        { key: "writing", name: "三、书写", vi: "Viết", minutes: 40, parts: [
          { name: "第一部分", vi: "Sắp xếp các từ cho sẵn thành câu đúng.", type: "w_order", n: 8 },
          { name: "第二部分", vi: "Viết đoạn văn ngắn (đề thật 80 chữ, theo 5 từ cho sẵn hoặc theo tranh). Ở đây viết một đoạn có dùng từ cho sẵn; máy chỉ kiểm tra sơ bộ, hãy tự đối chiếu với câu ví dụ.", type: "w_sentence", n: 2 },
        ] },
      ],
    },
  };

  // ---------- Kho ngữ liệu theo cấp ----------
  // Lấy phần lớn từ cấp đang thi, trộn thêm một ít của các cấp thấp hơn (đề thật cũng bao gồm từ cấp dưới).
  function mixLevels(byLevel, level, lowerRatio = 0.35) {
    const main = byLevel(level);
    const lower = [];
    for (let k = 1; k < level; k++) lower.push(...byLevel(k));
    return main.concat(pick(lower, Math.round(main.length * lowerRatio)));
  }

  function buildPool(level) {
    const words = mixLevels((k) => VOCAB.filter((w) => levelOfWord(w) === k), level, 0.25);
    const lessons = mixLevels((k) => LESSONS.filter((l) => levelOfLesson(l) === k), level, 0.3);
    const seen = new Set();
    const sentences = [];
    const addS = (zh, vi, lvl) => { if (!zh || !vi || seen.has(zh)) return; seen.add(zh); sentences.push({ zh, vi, level: lvl }); };
    words.forEach((w) => addS(w.ex[0], w.ex[2], levelOfWord(w)));
    lessons.forEach((l) => {
      l.sentences.forEach((s) => addS(s[0].replace(/ /g, ""), s[2], levelOfLesson(l)));
      l.grammar.forEach((g) => addS(g.ex[0], g.ex[2], levelOfLesson(l)));
    });
    const qa = [];
    const dialogs = [];
    lessons.forEach((l) => {
      const d = l.dialogue;
      dialogs.push({ lines: d.map((x) => ({ who: x[0], zh: x[1], vi: x[3] })), lesson: l.id });
      for (let i = 0; i + 1 < d.length; i++) if (/[？?]$/.test(d[i][1])) qa.push({ q: { zh: d[i][1], vi: d[i][3] }, a: { zh: d[i + 1][1], vi: d[i + 1][3] }, lesson: l.id });
    });
    const readings = (window.READINGS || []).filter((r) => r.level <= level && r.level >= Math.max(1, level - 1));
    const tokenSentences = lessons.flatMap((l) => l.sentences.filter((s) => s[0].split(" ").length >= 4 && s[0].split(" ").length <= 8).map((s) => ({ tokens: s[0].split(" "), zh: s[0].replace(/ /g, ""), vi: s[2] })));
    return { level, words, sentences, qa, dialogs, readings, tokenSentences };
  }

  // ---------- Sinh câu hỏi ----------
  // Mỗi câu: { type, kind, audio[], stem, options[], answer, group?, explain }
  // kind: "tf" (✓/✗), "choice" (A/B/C/D), "pool" (chọn trong nhóm A–F dùng chung), "order" (sắp xếp ô), "text" (gõ chữ)
  const LETTERS = "ABCDEF";
  const gen = {
    l_tf(P, n) {
      const ss = pick(P.sentences, n);
      return ss.map((s) => {
        const truth = Math.random() < 0.5;
        const other = truth ? null : pick(P.sentences, 1, [s])[0];
        return { kind: "tf", audio: [s.zh], stem: truth ? s.vi : other.vi, answer: truth, explain: `${s.zh} = ${s.vi}` };
      });
    },
    l_tf_long(P, n) {
      const ds = pick(P.dialogs.filter((d) => d.lines.length >= 2), n);
      return ds.map((d) => {
        const start = Math.floor(Math.random() * Math.max(1, d.lines.length - 1));
        const lines = d.lines.slice(start, start + 2);
        const truth = Math.random() < 0.5;
        const target = lines[Math.floor(Math.random() * lines.length)];
        const other = truth ? null : pick(P.sentences, 1)[0];
        return { kind: "tf", audio: lines.map((x) => x.zh), stem: "★ " + (truth ? target.vi : other.vi), answer: truth, explain: lines.map((x) => `${x.zh} (${x.vi})`).join(" / ") };
      });
    },
    l_pick(P, n, c) {
      const ss = pick(P.sentences, n);
      return ss.map((s) => {
        const opts = shuffle([s, ...pick(P.sentences, c - 1, [s])]);
        return { kind: "choice", audio: [s.zh], stem: "", options: opts.map((o) => o.vi), answer: opts.indexOf(s), explain: `${s.zh} = ${s.vi}` };
      });
    },
    l_dialog_pick(P, n, c) {
      const qs = pick(P.qa, n);
      return qs.map((x) => {
        const opts = shuffle([x, ...pick(P.qa, c - 1, [x])]);
        return { kind: "choice", audio: [x.q.zh, x.a.zh], stem: "", options: opts.map((o) => `${o.q.vi} – ${o.a.vi}`), answer: opts.indexOf(x), explain: `${x.q.zh} / ${x.a.zh}` };
      });
    },
    l_reply(P, n, c) {
      const qs = pick(P.qa, n);
      return qs.map((x) => {
        const opts = shuffle([x, ...pick(P.qa, c - 1, [x])]);
        return { kind: "choice", audio: [x.q.zh], stem: "", options: opts.map((o) => o.a.zh), zhOptions: true, answer: opts.indexOf(x), explain: `${x.q.zh} (${x.q.vi}) → ${x.a.zh} (${x.a.vi})` };
      });
    },
    l_dialog_q(P, n, c) {
      const qs = pick(P.qa, n);
      return qs.map((x) => {
        const opts = shuffle([x, ...pick(P.qa, c - 1, [x])]);
        return { kind: "choice", audio: [x.q.zh, x.a.zh, "问：第二个人说了什么？"], stem: "问：第二个人说了什么？ (Người thứ hai nói gì?)", options: opts.map((o) => o.a.vi), answer: opts.indexOf(x), explain: `${x.q.zh} / ${x.a.zh}` };
      });
    },
    l_dialog_long(P, n, c) {
      const ds = pick(P.dialogs.filter((d) => d.lines.length >= 4), n);
      return ds.map((d) => {
        const lines = d.lines.slice(0, 5);
        const target = lines[Math.floor(Math.random() * lines.length)];
        const opts = shuffle([target.vi, ...pick(P.sentences, c - 1).map((s) => s.vi)]);
        return { kind: "choice", audio: [...lines.map((x) => x.zh), "问：根据对话，哪一句是对的？"], stem: "问：根据对话，哪一句是对的？ (Theo hội thoại, câu nào đúng?)", options: opts, answer: opts.indexOf(target.vi), explain: lines.map((x) => x.zh).join(" ") };
      });
    },
    r_word_tf(P, n) {
      const ws = pick(P.words, n);
      return ws.map((w) => {
        const truth = Math.random() < 0.5;
        const other = truth ? null : (pick(P.words.filter((x) => x.pos === w.pos && x.vi !== w.vi), 1)[0] || pick(P.words, 1, [w])[0]);
        return { kind: "tf", stem: w.hz, sub: truth ? w.vi : other.vi, answer: truth, explain: `${w.hz} (${w.py}) = ${w.vi}` };
      });
    },
    r_tf(P, n) {
      const ss = pick(P.sentences, n);
      return ss.map((s) => {
        const truth = Math.random() < 0.5;
        const other = truth ? null : pick(P.sentences, 1, [s])[0];
        return { kind: "tf", stem: s.zh, sub: "★ " + (truth ? s.vi : other.vi), answer: truth, explain: `${s.zh} = ${s.vi}` };
      });
    },
    r_match_vi(P, n) {
      return groups(n, 5, () => {
        const ss = pick(P.sentences, 5);
        const extra = pick(P.sentences, 1, ss)[0];
        const pool = shuffle([...ss, extra]);
        return { pool: pool.map((s) => s.vi), items: ss.map((s) => ({ kind: "pool", stem: s.zh, answer: pool.indexOf(s), explain: `${s.zh} = ${s.vi}` })) };
      });
    },
    r_match_qa(P, n) {
      return groups(n, 5, () => {
        const qs = pick(P.qa, 5);
        const extra = pick(P.qa, 1, qs)[0];
        const pool = shuffle([...qs, extra]);
        return { pool: pool.map((x) => x.a.zh), poolZh: true, items: qs.map((x) => ({ kind: "pool", stem: x.q.zh, answer: pool.indexOf(x), explain: `${x.q.zh} (${x.q.vi}) → ${x.a.zh} (${x.a.vi})` })) };
      });
    },
    r_cloze(P, n) {
      const usable = P.words.filter((w) => w.ex[0].split(w.hz).length === 2 && w.ex[0].replace(w.hz, "").length >= 3);
      return groups(n, 5, () => {
        const ws = pick(usable, 5);
        const extra = pick(usable, 1, ws)[0];
        const pool = shuffle([...ws, extra]);
        return { pool: pool.map((w) => w.hz), poolZh: true, items: ws.map((w) => ({ kind: "pool", stem: w.ex[0].replace(w.hz, "（　　）"), sub: w.ex[2], answer: pool.indexOf(w), explain: w.ex[0] })) };
      });
    },
    r_passage(P, n, c) {
      const out = [];
      const rs = shuffle(P.readings);
      let i = 0;
      while (out.length < n && rs.length) {
        const r = rs[i % rs.length]; i++;
        const qs = shuffle(r.questions).slice(0, Math.min(3, n - out.length));
        const g = { passage: r.zh, title: r.title, items: [] };
        qs.forEach((q) => {
          let opts = q.opts.map((o, k) => ({ o, ok: k === q.a }));
          if (opts.length > c) opts = shuffle([opts[q.a], ...pick(opts.filter((x) => !x.ok), c - 1)]);
          opts = shuffle(opts);
          g.items.push({ kind: "choice", group: g, stem: q.q, options: opts.map((x) => x.o), answer: opts.findIndex((x) => x.ok), explain: r.title });
        });
        out.push(...g.items);
        if (i > 200) break;
      }
      return out.slice(0, n);
    },
    r_order(P, n) {
      const ds = pick(P.dialogs.filter((d) => d.lines.length >= 3), n);
      return ds.map((d) => {
        const start = Math.floor(Math.random() * (d.lines.length - 2));
        const lines = d.lines.slice(start, start + 3).map((x) => x.zh);
        const labeled = shuffle(lines.map((zh, k) => ({ zh, k })));
        const answer = lines.map((zh) => LETTERS[labeled.findIndex((x) => x.zh === zh)]).join(" ");
        return { kind: "order", stem: "", tokens: labeled.map((x, k) => `${LETTERS[k]}. ${x.zh}`), answer, explain: lines.join(" → ") };
      });
    },
    w_order(P, n) {
      const ss = pick(P.tokenSentences, n);
      return ss.map((s) => ({ kind: "order", stem: "", tokens: shuffle(s.tokens), answer: s.tokens.join(" "), explain: `${s.zh} (${s.vi})` }));
    },
    w_char(P, n) {
      const usable = P.words.filter((w) => w.hz.length === 1 && w.ex[0].split(w.hz).length === 2);
      const ws = pick(usable, n);
      return ws.map((w) => {
        const cands = shuffle([w.hz, ...pick(usable, 3, [w]).map((x) => x.hz)]);
        return { kind: "text", stem: w.ex[0].replace(w.hz, "（　　）"), sub: `${w.py} · ${w.ex[2]}`, candidates: cands, answer: w.hz, explain: w.ex[0] };
      });
    },
    w_sentence(P, n) {
      const ws = pick(P.words.filter((w) => w.hz.length >= 2), n);
      return ws.map((w) => ({ kind: "text", free: true, stem: w.hz, sub: `${w.py} · ${w.vi}`, answer: w.hz, explain: `Ví dụ: ${w.ex[0]}` }));
    },
  };
  // Chia n câu thành các nhóm dùng chung một bảng đáp án A–F (như đề thật)
  function groups(n, size, make) {
    const out = [];
    while (out.length < n) {
      const g = make();
      g.items.forEach((it) => { it.group = g; });
      out.push(...g.items.slice(0, n - out.length));
    }
    return out;
  }

  function generate(level) {
    const spec = EXAM_SPEC[level];
    const P = buildPool(level);
    let no = 0;
    const sections = spec.sections.map((sec) => {
      const parts = sec.parts.map((part) => {
        const items = gen[part.type](P, part.n, spec.choices).slice(0, part.n);
        items.forEach((it) => { it.no = ++no; it.type = part.type; it.part = part; it.section = sec.key; it.user = null; it.listening = sec.key === "listening"; });
        return { ...part, items };
      });
      return { ...sec, parts, items: parts.flatMap((p) => p.items) };
    });
    return { level, spec, sections, createdAt: Date.now() };
  }

  // ---------- Chấm ----------
  const norm = (s) => String(s ?? "").replace(/[\s，。！？、,.!?“”"'：:；;（）()]/g, "");
  function isCorrect(it) {
    if (it.user == null || it.user === "") return false;
    if (it.kind === "tf") return it.user === it.answer;
    if (it.kind === "choice" || it.kind === "pool") return it.user === it.answer;
    if (it.kind === "order") return it.user === it.answer;
    if (it.kind === "text") {
      if (it.free) { const u = norm(it.user); return u.includes(it.answer) && u.length >= it.answer.length + 4; }
      return norm(it.user) === it.answer;
    }
    return false;
  }
  function score(exam) {
    const sections = exam.sections.map((sec) => {
      const total = sec.items.length, correct = sec.items.filter(isCorrect).length;
      const parts = sec.parts.map((p) => ({ name: p.name, vi: p.vi, total: p.items.length, correct: p.items.filter(isCorrect).length }));
      return { key: sec.key, name: sec.name, vi: sec.vi, total, correct, score: Math.round((correct / total) * 100), parts };
    });
    const totalScore = sections.reduce((a, s) => a + s.score, 0);
    return { sections, total: totalScore, max: exam.spec.total, pass: totalScore >= exam.spec.pass, passMark: exam.spec.pass, answered: exam.sections.flatMap((s) => s.items).filter((it) => it.user != null && it.user !== "").length, questions: exam.spec.questions };
  }

  window.Exam = { generate, score, isCorrect, LETTERS, buildPool };
})();
