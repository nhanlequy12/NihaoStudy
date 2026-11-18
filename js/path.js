// Lộ trình từng bước: trang «Bắt đầu học», trang giai đoạn, bài nhỏ (Học · Luyện tập · Kiểm tra nhanh),
// kiểm tra tổng hợp cuối giai đoạn, kiểm tra đầu vào, bảng âm tiết. Qua bài khi đạt từ 70%, bài sau mới mở.
// Tiến độ lưu trong Store.state.path = { steps: { id: { best, done, at } }, tests: { id: {…} }, placed }.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, sentenceHtml, shuffle } = Views.util;
  const PASS = 70;
  const md = (s) => String(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); // nội dung soạn sẵn trong js/data, không phải nhập của người dùng
  const vocabOf = (hz) => VOCAB.find((w) => w.hz === hz);

  // ---------- Trạng thái ----------
  function ps() {
    const s = Store.state;
    if (!s.path) s.path = { steps: {}, tests: {}, placed: 0 };
    s.path.steps = s.path.steps || {}; s.path.tests = s.path.tests || {};
    return s.path;
  }
  const stageOf = (id) => STAGES.find((st) => st.steps.some((x) => x.id === id) || st.test.id === id);
  const stepOf = (id) => { for (const st of STAGES) { const x = st.steps.find((y) => y.id === id); if (x) return x; } return null; };
  const isDone = (id) => !!(ps().steps[id] && ps().steps[id].done) || !!(ps().tests[id] && ps().tests[id].done);
  const best = (id) => (ps().steps[id] || ps().tests[id] || {}).best;
  const stageDone = (st) => st.steps.every((x) => isDone(x.id)) && isDone(st.test.id);
  function unlocked(st, i) { // i = chỉ số bài; i = st.steps.length là bài kiểm tra tổng hợp
    if (ps().placed > st.id) return true;
    return i === 0 || isDone(st.steps[i - 1].id);
  }
  // Bài tiếp theo cần học trong lộ trình, hoặc null nếu đã xong / đã được xếp lên giai đoạn sau
  function next() {
    for (const st of STAGES) {
      if (ps().placed > st.id) continue;
      const i = st.steps.findIndex((x) => !isDone(x.id));
      if (i >= 0) return { href: `#/step/${st.steps[i].id}`, label: `${st.name} · Bài ${i + 1}: ${st.steps[i].title}`, stage: st, i };
      if (!isDone(st.test.id)) return { href: `#/step/${st.test.id}`, label: `${st.name} · ${st.test.title}`, stage: st, i: st.steps.length };
    }
    return null;
  }
  const started = () => Object.keys(ps().steps).length > 0 || Object.keys(ps().tests).length > 0 || ps().placed > 0;
  const doneCount = (st) => st.steps.filter((x) => isDone(x.id)).length + (isDone(st.test.id) ? 1 : 0);

  // ---------- Dấu thanh ----------
  const MARKS = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", ü: "ǖǘǚǜ" };
  const PLAIN = {}; Object.entries(MARKS).forEach(([v, ms]) => [...ms].forEach((m) => (PLAIN[m] = v)));
  const plain = (py) => [...py].map((c) => PLAIN[c] || c).join("");
  function markTone(syl, t) {
    if (t === 5) return syl;
    for (const v of ["a", "e"]) if (syl.includes(v)) return syl.replace(v, MARKS[v][t - 1]);
    if (syl.includes("ou")) return syl.replace("o", MARKS.o[t - 1]);
    const idx = Math.max(...["i", "o", "u", "ü"].map((v) => syl.lastIndexOf(v)));
    return syl.slice(0, idx) + MARKS[syl[idx]][t - 1] + syl.slice(idx + 1);
  }

  // ---------- Bảng âm tiết (Bài 7 và tab «Bảng âm tiết» của Pinyin Lab) ----------
  const INI = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s", "y", "w", ""];
  const cellSay = (c) => (c[1] ? c[1] : c[0]);
  function syllableTable(box, opts = {}) {
    let cur = opts.initial || "b";
    function draw() {
      const rows = SYLLABLES.filter((r) => r[1] === cur);
      box.innerHTML = `<div class="tabs syl-ini" role="tablist" aria-label="Phụ âm đầu">${INI.map((k) => `<button role="tab" aria-selected="${k === cur}" class="${k === cur ? "active" : ""}" data-ini="${k}">${k || "Không có"}</button>`).join("")}</div>
        <p class="small muted">${rows.length} âm tiết ${cur ? `bắt đầu bằng <b>${cur}</b>` : "không có phụ âm đầu"}. Bấm ô để nghe; ô có từ ví dụ là chữ nhiều cách đọc, máy đọc cả từ cho đúng âm.</p>
        <div class="syl-grid">${rows.map((r) => `<div class="syl-card"><div class="syl-head">${esc(r[0])}</div><div class="syl-tones">${r[3].map((c, t) => c
          ? `<button class="syl-cell" data-say="${esc(cellSay(c))}" data-info="${esc(`${c[0]} ${r[2][t]}${c[1] ? ` · trong ${c[1]} ${c[2]}` : c[3] ? ` · ${c[3]}` : ""}`)}"><span class="t${t + 1}">${esc(r[2][t])}</span><span class="zh">${esc(c[0])}</span></button>`
          : `<span class="syl-cell empty" title="Không có chữ HSK đọc ${esc(r[2][t])}"><span class="t${t + 1}">${esc(r[2][t])}</span><span class="zh">·</span></span>`).join("")}</div></div>`).join("")}</div>
        <div class="syl-info small" id="syl-info" aria-live="polite"></div>
        ${opts.full ? `<p class="small muted mt">Âm tiết có trong từ điển nhưng không chữ HSK nào đọc như vậy: ${SYLLABLES_RARE.map(esc).join(", ")}. Âm tiết và cách đọc theo CC-CEDICT, chữ ví dụ lấy từ từ vựng HSK.</p>` : ""}`;
      box.querySelectorAll("[data-ini]").forEach((b) => (b.onclick = () => { cur = b.dataset.ini; draw(); }));
      box.querySelectorAll(".syl-cell[data-say]").forEach((b) => (b.onclick = () => {
        TTS.speak(b.dataset.say, { rate: 0.75 });
        box.querySelector("#syl-info").textContent = b.dataset.info;
      }));
    }
    draw();
  }

  // ---------- Câu hỏi ----------
  // Đổi mục trong dữ liệu bài thành câu hỏi cụ thể { kind, prompt, say, opts, answer, explain }
  function expand(item, step, stage) {
    if (item.t === "tone") {
      const base = plain(item.py);
      return { kind: "listen", prompt: "Nghe và chọn thanh đúng", say: item.say, opts: [1, 2, 3, 4].map((t) => markTone(base, t)), answer: item.py, explain: `${item.say} ${item.py}`, tone: true };
    }
    if (item.t === "listen") return { kind: "listen", prompt: "Nghe và chọn pinyin đúng", say: item.say, opts: shuffle([item.a, ...item.o]), answer: item.a, explain: `${item.say} ${item.a}` };
    if (item.t === "mcq") return { kind: "text", prompt: item.q, opts: shuffle([item.a, ...item.o]), answer: item.a, explain: item.a };
    if (item.t === "word") {
      const w = vocabOf(item.hz);
      const pool = shuffle([...new Set(stage.steps.flatMap((x) => x.words))].map(vocabOf).filter((d) => d && d.hz !== w.hz && d.vi !== w.vi)).slice(0, 3);
      return { kind: "word", prompt: "Từ này nghĩa là gì?", show: w, say: w.hz, opts: shuffle([w.vi, ...pool.map((d) => d.vi)]), answer: w.vi, explain: `${w.hz} ${w.py} · ${w.vi}` };
    }
    if (item.t === "syl") {
      // chọn một ô có chữ một âm, phương án là âm tiết khác cùng thanh, gần âm (cùng phụ âm đầu hoặc cùng vần)
      const cells = [];
      SYLLABLES.forEach((r) => r[3].forEach((c, t) => { if (c && !c[1] && t < 4) cells.push({ r, t, c }); }));
      const pick = cells[Math.floor(Math.random() * cells.length)];
      const fin = (r) => r[0].slice(r[1].length);
      const near = shuffle(SYLLABLES.filter((r) => r !== pick.r && (r[1] === pick.r[1] || fin(r) === fin(pick.r)))).slice(0, 3).map((r) => r[2][pick.t]);
      return { kind: "listen", prompt: "Nghe và chọn âm tiết đúng", say: pick.c[0], opts: shuffle([pick.r[2][pick.t], ...near]), answer: pick.r[2][pick.t], explain: `${pick.c[0]} ${pick.r[2][pick.t]}` };
    }
    if (item.t === "radical") {
      const list = RADICALS.slice(0, 12), r = list[Math.floor(Math.random() * list.length)];
      const others = shuffle(list.filter((x) => x !== r)).slice(0, 3);
      const lab = (x) => `${x.hv} · ${x.vi}`;
      return { kind: "text", prompt: `Bộ <span class="zh">${esc(r.r)}</span> nghĩa là gì?`, html: true, opts: shuffle([lab(r), ...others.map(lab)]), answer: lab(r), explain: `${r.r} ${r.py} · ${lab(r)} · ví dụ ${r.ex}`, say: r.r.split(" ")[0] };
    }
    return null;
  }

  // Chạy một loạt câu hỏi. mode "graded" chấm điểm và gọi onFinish(pct, correct, total); "practice" làm vòng tròn không lưu
  function runQuiz(box, items, { mode = "graded", onFinish, sections } = {}) {
    const list = items.filter(Boolean);
    let i = 0, correct = 0, answered = false; const results = [];
    const say = (q) => q.say && TTS.speak(q.say, { rate: q.kind === "listen" ? 0.75 : undefined });
    function render() {
      if (i >= list.length) {
        App.keyHandler = null;
        if (mode === "practice") { box.innerHTML = `<div class="card center"><h3 style="margin:0 0 6px">Xong vòng luyện: ${correct}/${list.length} câu đúng</h3><p class="muted small">Luyện tập không tính điểm. Khi thấy chắc tay, làm Kiểm tra nhanh để mở bài sau.</p><button class="btn btn-primary" id="again">Luyện lại</button></div>`; box.querySelector("#again").onclick = () => runQuiz(box, items, { mode }); return; }
        return onFinish(Math.round((correct / list.length) * 100), correct, list.length, results);
      }
      const q = list[i]; answered = false;
      const sec = sections ? sections.find((s) => i >= s.from && i < s.to) : null;
      const head = q.kind === "listen" ? `<button class="btn btn-primary btn-lg" id="play">${ic("volume")} Nghe lại</button>`
        : q.kind === "word" ? `<div class="main">${esc(q.show.hz)}</div><div class="sub">${pyHtml(q.show.py)}</div>`
        : "";
      box.innerHTML = `<div class="quiz-progress">${list.map((_, k) => `<span class="${k < i ? (results[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></span>`).join("")}</div>
        ${sec ? `<div class="eyebrow center">${esc(sec.name)}</div>` : ""}
        <div class="quiz-q"><div class="prompt">${q.html ? q.prompt : esc(q.prompt)}</div>${head}</div>
        <div class="options">${q.opts.map((o, k) => `<button class="option ${q.kind === "listen" ? "py-opt" : "vi-text"}" data-k="${k}"><span class="kbd-hint">${k + 1}</span>${q.kind === "listen" ? pyHtml(o) : esc(o)}</button>`).join("")}</div><div id="fb"></div>`;
      const play = box.querySelector("#play");
      if (play) { play.onclick = () => say(q); say(q); }
      box.querySelectorAll(".option").forEach((o) => (o.onclick = () => pick(+o.dataset.k)));
      App.keyHandler = (e) => {
        if (e.target.closest("input, textarea, select")) return;
        if (!answered && /^[1-9]$/.test(e.key) && +e.key <= q.opts.length) pick(+e.key - 1);
        else if (answered && e.key === "Enter") { e.preventDefault(); i++; render(); }
        else if (e.key === " " && play) { e.preventDefault(); say(q); }
      };
    }
    function pick(k) {
      if (answered) return; answered = true;
      const q = list[i], ok = q.opts[k] === q.answer;
      results[i] = ok; if (ok) correct++;
      box.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (q.opts[+x.dataset.k] === q.answer) x.classList.add("correct"); });
      if (!ok) box.querySelector(`.option[data-k="${k}"]`).classList.add("wrong");
      if (q.kind !== "listen" && q.say) TTS.speak(q.say);
      box.querySelector("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "Chính xác!" : "Chưa đúng."} Đáp án: ${esc(q.explain)}</div>
        <div class="center mt"><button class="btn btn-primary" id="nx">${i + 1 < list.length ? "Câu tiếp" : mode === "practice" ? "Xong" : "Xem kết quả"} ${ic("next")}</button></div>`;
      const nx = box.querySelector("#nx"); nx.onclick = () => { i++; render(); }; nx.focus();
    }
    render();
  }

  // ---------- Khối nội dung của phần Học ----------
  function block(b) {
    switch (b.t) {
      case "p": return `<p>${md(b.text)}</p>`;
      case "tip": return `<div class="tip"><b>Mẹo:</b> ${md(b.text)}</div>`;
      case "rule": return `<div class="grammar"><div class="pattern">${esc(b.title)}</div><div class="small">${md(b.text)}</div></div>`;
      case "tones": return `<div class="grid grid-3 path-tones">${PINYIN.tones.map((t) => `<div class="card tone-card"><div class="mark t${t.n}">${t.mark}</div>
          <svg viewBox="0 0 100 70" aria-hidden="true"><line x1="5" y1="10" x2="5" y2="65" stroke="var(--border)"/><line x1="5" y1="65" x2="95" y2="65" stroke="var(--border)"/><path d="${t.path}" stroke="var(--tone${t.n})" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
          <b>${esc(t.name)}</b><p class="small" style="margin:6px 0">${esc(t.desc)}</p><p class="small muted" style="margin:0 0 8px"><b>Người Việt:</b> ${esc(t.vi)}</p>
          <div class="row" style="justify-content:center">${t.ex.map((e) => `<button class="btn btn-sm" data-say="${esc(e.split(" ")[1])}">${esc(e)}</button>`).join("")}</div></div>`).join("")}</div>`;
      case "toneRules": return `<div class="grid grid-2">${PINYIN.toneRules.map((r) => `<div class="grammar"><div class="pattern">${esc(r.title)}</div><div class="small">${esc(r.body)}</div></div>`).join("")}</div>`;
      case "pinyin": {
        const list = PINYIN[b.key].filter((x) => b.only.includes(x.py));
        return `<div class="py-list">${list.map((x) => { const say = x.ex.split(" ")[1] || x.ex; return `<button class="py-row" data-say="${esc(say)}"><span class="py">${esc(x.py)}</span><span class="zh">${esc(x.ex)}</span><span class="small muted">${esc(x.vi)}</span>${ic("volume")}</button>`; }).join("")}</div>`;
      }
      case "table": return `<div class="table-wrap"><table class="plain-table"><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, k) => `<td class="${k === 0 && /[一-鿿㇀-㇯丨-丶𠃍]/u.test(c) && c.length <= 2 ? "zh big" : ""}">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "strokes": return `<h3>Bảy quy tắc thứ tự nét</h3><div class="grid grid-2">${b.items.map(([rule, ch]) => `<a class="card lesson-card" href="#/write/${encodeURIComponent(ch)}"><div class="lesson-icon">${esc(ch)}</div><div class="lesson-body"><div class="lesson-title">${esc(rule)}</div><div class="lesson-meta">Bấm để xem hoạt hình và tập viết ${esc(ch)}</div></div></a>`).join("")}</div>`;
      case "radicals": return `<div class="grid grid-2">${RADICALS.slice(0, b.n).map((r) => `<div class="card radical-card"><div class="r">${esc(r.r.split(" ")[0])}</div><div style="flex:1"><div><b>${esc(r.r)}</b> · <span class="t${toneOf(r.py)}">${esc(r.py)}</span> · <span class="hv">${esc(r.hv)}</span> · ${esc(r.vi)}</div><div class="exs">${esc(r.ex)}</div></div>${speakBtn(r.r.split(" ")[0])}</div>`).join("")}</div>`;
      case "syllables": return `<div class="card" id="syl-box"></div>`;
      case "typing": return `<h3>Gõ thử</h3><p class="small muted">Bật bộ gõ tiếng Trung, nghe rồi gõ lại từ vào ô. Gõ đúng chữ Hán là ô chuyển xanh.</p><div class="stack typing">${b.items.map((hz) => { const w = vocabOf(hz); return `<label class="typing-row"><span class="typing-q">${speakBtn(hz)}<span><b>${esc(w.vi)}</b><details class="small muted"><summary>Gợi ý</summary>${pyHtml(w.py)} · gõ «${esc(plain(w.py).replace(/ü/g, "v").replace(/\s/g, "").toLowerCase())}»</details></span></span><input class="search zh" data-want="${esc(hz)}" autocomplete="off" autocapitalize="off" spellcheck="false" lang="zh-CN" aria-label="Gõ chữ Hán của: ${esc(w.vi)}"><span class="typing-ok" aria-hidden="true">${ic("check")}</span></label>`; }).join("")}</div>`;
      default: return "";
    }
  }

  function wordsTable(words) {
    return `<table class="vocab-table"><thead><tr><th>Chữ</th><th>Pinyin</th><th>Hán Việt</th><th>Nghĩa</th><th>Ví dụ</th><th></th></tr></thead><tbody>
      ${words.map((w) => `<tr><td class="hz">${esc(w.hz)}</td><td class="py">${pyHtml(w.py)}</td><td class="hv">${esc(w.hv)}</td><td>${esc(w.vi)}<br><span class="small muted">${esc(w.pos)}</span></td><td class="small"><span class="zh">${esc(w.ex[0])}</span><br><span class="muted">${pyHtml(w.ex[1])}</span><br>${esc(w.ex[2])}</td><td><div class="stack word-actions">${speakBtn(w.hz, "btn btn-sm", "Từ")}<a class="btn btn-sm" href="#/write/${encodeURIComponent(w.hz[0])}" title="Luyện viết chữ này">${ic("pen")}<span>Viết</span></a></div></td></tr>`).join("")}</tbody></table>`;
  }

  // ---------- Hoàn thành bài ----------
  function saveResult(id, pct, isTest, words) {
    const p = ps(), bag = isTest ? p.tests : p.steps;
    const prev = bag[id] || {};
    const pass = pct >= PASS, first = pass && !prev.done;
    bag[id] = { best: Math.max(prev.best || 0, pct), done: prev.done || pass, at: pass && !prev.done ? Store.today() : prev.at };
    let added = 0;
    if (pass) {
      if (words && words.length) {
        const ids = words.map((w) => w.id);
        added = SRS.addWords(ids);
        WSRS.addWords(words.filter((w) => /^[一-鿿]+$/.test(w.hz)).map((w) => w.id));
      }
      if (first) { Store.logToday("lessons", 1); Store.addXp(isTest ? 40 : 15); }
      Store.markRoutine("lesson");
      App.updateBadge();
    }
    Store.save();
    return { pass, added, first };
  }

  // ---------- Trang «Bắt đầu học» ----------
  const LATER = [ // các giai đoạn sau: dùng bài học HSK 2.0 sẵn có, sẽ chia lại thành bài nhỏ ở các đợt tiếp theo
    { name: "Giai đoạn 1", title: "HSK 1", level: 1, time: "6–8 tuần" },
    { name: "Giai đoạn 2", title: "HSK 2", level: 2, time: "8–12 tuần" },
    { name: "Giai đoạn 3", title: "HSK 3", level: 3, time: "4–6 tháng" },
    { name: "Giai đoạn 4", title: "HSK 4", level: 4, time: "8–12 tháng" },
    { name: "Giai đoạn 5", title: "HSK 5", level: 5, time: "12–16 tháng" },
    { name: "Giai đoạn 6", title: "HSK 6", level: 6, time: "18–24 tháng" },
  ];
  function lessonsOfLevel(lv) { return LESSONS.filter((l) => !l.h3 && (l.level || (l.id <= 12 ? 1 : l.id <= 24 ? 2 : l.id <= 44 ? 3 : l.id <= 84 ? 4 : l.id <= 149 ? 5 : 6)) === lv); }

  function start(sub) {
    if (sub === "test") return placement();
    const n = next(), st0 = STAGES[0], s = Store.state, began = started();
    const html = `<h1>Bắt đầu học</h1>
      <p class="subtitle">Lộ trình đi từng bước từ con số 0: phát âm trước, rồi từ vựng theo cấp HSK. Mỗi bài 15–30 phút, gồm phần học, luyện tập và kiểm tra nhanh; đạt từ ${PASS}% thì mở bài tiếp theo. Từ đã học tự vào bộ thẻ ôn tập ngắt quãng.</p>
      <div class="card start-cta">
        <div><div class="eyebrow">${n ? (began ? "Đang học" : "Bắt đầu từ đây") : "Bước tiếp theo"}</div>
          <h2 style="margin:4px 0 0">${n ? esc(n.label) : "Học tiếp bài HSK 1"}</h2></div>
        <div class="row">${n ? `<a class="btn btn-primary btn-lg" href="${n.href}">${ic("play")} ${began ? "Tiếp tục học" : "Bắt đầu Bài 1"}</a>` : `<a class="btn btn-primary btn-lg" href="#/lessons/1">${ic("book")} Vào bài học HSK 1</a>`}
          ${!began ? `<a class="btn btn-lg" href="#/start/test">${ic("target")} Kiểm tra đầu vào</a>` : ""}</div>
        ${!began ? `<p class="small muted" style="margin:0">Đã biết pinyin? Làm kiểm tra đầu vào (khoảng 5 phút, không bắt buộc) để bỏ qua phần Nhập môn.</p>` : ""}
      </div>
      <h2>Các giai đoạn</h2>
      <ol class="stage-list">
        <li class="stage ${stageDone(st0) ? "done" : "current"}">
          <a class="card stage-card" href="#/path/${st0.id}">
            <div class="stage-num">${stageDone(st0) ? ic("check") : "0"}</div>
            <div class="stage-body"><div class="row between"><b>${esc(st0.name)} · ${esc(st0.title)}</b><span class="pill gold">${esc(st0.time)}</span></div>
              <div class="small muted">${esc(st0.sub)} ${st0.steps.length} bài + kiểm tra tổng hợp.</div>
              <div class="row between small mt"><span>${doneCount(st0)}/${st0.steps.length + 1} mục${ps().placed > 0 && !stageDone(st0) ? " · đã xếp lên Giai đoạn 1" : ""}</span></div>
              <div class="progress green"><span style="width:${(doneCount(st0) / (st0.steps.length + 1)) * 100}%"></span></div></div>
          </a></li>
        ${LATER.map((g) => { const ls = lessonsOfLevel(g.level), d = ls.filter((l) => s.completedLessons.includes(l.id)).length; return `
        <li class="stage ${ls.length && d === ls.length ? "done" : ""}">
          <a class="card stage-card" href="#/lessons/${g.level}">
            <div class="stage-num">${ls.length && d === ls.length ? ic("check") : g.level}</div>
            <div class="stage-body"><div class="row between"><b>${g.name} · ${g.title} <span class="muted" style="font-weight:500">(HSK 2.0)</span></b><span class="pill">${g.time}</span></div>
              <div class="small muted">${ls.length} bài theo chủ đề, mỗi bài có từ vựng, ngữ pháp, hội thoại, luyện tập; cuối cấp có thi thử HSK ${g.level}.</div>
              <div class="row between small mt"><span>${d}/${ls.length} bài</span></div>
              <div class="progress"><span style="width:${ls.length ? (d / ls.length) * 100 : 0}%"></span></div></div>
          </a></li>`; }).join("")}
      </ol>
      <p class="small muted">Giai đoạn 1–6 đang dùng bài học HSK 2.0 sẵn có. Học theo HSK 3.0 (đề cương 2025)? Xem <a href="#/lessons/h3">bài bổ sung HSK 3.0</a> và <a href="#/words">từ vựng theo cấp</a>.</p>`;
    return { html };
  }

  // ---------- Trang giai đoạn ----------
  function stage(id) {
    const st = STAGES.find((x) => x.id === +id) || STAGES[0];
    const due = SRS.dueIds().length, n = next();
    const total = st.steps.length + 1, d = doneCount(st);
    const item = (x, i) => {
      const done = isDone(x.id), open = unlocked(st, i), b = best(x.id), isCur = n && n.stage === st && n.i === i;
      return `<li class="step ${done ? "done" : open ? "open" : "locked"} ${isCur ? "current" : ""}">
        <span class="step-dot" aria-hidden="true">${done ? ic("check") : open ? i + 1 : ic("lock")}</span>
        ${open ? `<a class="card step-card" href="#/step/${x.id}">` : `<div class="card step-card" aria-disabled="true">`}
          <div class="lesson-icon">${esc(x.icon)}</div>
          <div class="lesson-body"><div class="lesson-title">Bài ${i + 1}: ${esc(x.title)}</div>
            <div class="lesson-meta">${ic("clock")} ${x.min} phút${b != null ? ` · điểm cao nhất ${b}%` : ""}${!open ? ` · cần đạt ${PASS}% bài trước` : ""}</div></div>
          ${done ? `<span class="pill green">Xong</span>` : isCur ? `<span class="pill red">Học tiếp</span>` : ""}
        ${open ? `</a>` : `</div>`}</li>`;
    };
    const tOpen = unlocked(st, st.steps.length) && st.steps.every((x) => isDone(x.id) || ps().placed > st.id), tDone = isDone(st.test.id);
    const html = `<a href="#/start" class="backlink">${ic("back")} Bắt đầu học</a>
      <div class="eyebrow">${esc(st.name)} · ${esc(st.std)}</div><h1>${esc(st.title)}</h1>
      <p class="subtitle">${esc(st.sub)} ${st.steps.length} bài nhỏ và một bài kiểm tra tổng hợp, dự kiến ${esc(st.time)}.</p>
      <div class="card mb"><div class="row between small"><b>Tiến độ giai đoạn</b><span>${d}/${total}</span></div><div class="progress green mt"><span style="width:${(d / total) * 100}%"></span></div>
        ${n && n.stage === st ? `<a class="btn btn-primary mt" href="${n.href}">${ic("play")} Tiếp tục: ${n.i < st.steps.length ? `Bài ${n.i + 1}` : "Kiểm tra tổng hợp"}</a>` : ""}</div>
      ${due ? `<div class="tip">${ic("repeat")} Có <b>${due}</b> thẻ từ vựng đến hạn ôn. Ôn trước khi học bài mới để nhớ lâu hơn. <a href="#/review">Ôn ngay</a></div>` : ""}
      <ol class="steps">${st.steps.map(item).join("")}
        <li class="step ${tDone ? "done" : tOpen ? "open" : "locked"} ${n && n.stage === st && n.i === st.steps.length ? "current" : ""}">
          <span class="step-dot" aria-hidden="true">${tDone ? ic("check") : tOpen ? ic("trophy") : ic("lock")}</span>
          ${tOpen ? `<a class="card step-card test" href="#/step/${st.test.id}">` : `<div class="card step-card test" aria-disabled="true">`}
            <div class="lesson-icon">${ic("exam")}</div>
            <div class="lesson-body"><div class="lesson-title">${esc(st.test.title)}</div><div class="lesson-meta">${ic("clock")} ${st.test.min} phút · ${st.test.listen + st.test.read} câu, dạng đề HSK (Nghe + Đọc)${best(st.test.id) != null ? ` · điểm cao nhất ${best(st.test.id)}%` : ""}${!tOpen ? " · mở khi xong cả " + st.steps.length + " bài" : ""}</div></div>
            ${tDone ? `<span class="pill green">Đạt</span>` : ""}
          ${tOpen ? `</a>` : `</div>`}</li>
      </ol>`;
    return { html };
  }

  // ---------- Một bài nhỏ ----------
  function step(id, tab = "learn") {
    const st = stageOf(id);
    if (!st) return { html: `<p>Không tìm thấy bài.</p>` };
    if (id === st.test.id) return stageTest(st);
    const i = st.steps.findIndex((x) => x.id === id), x = st.steps[i];
    if (!unlocked(st, i)) {
      const prev = st.steps[i - 1];
      return { html: `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)}</a><div class="card center empty">${ic("lock", "big-ic")}<h2>Bài ${i + 1} chưa mở</h2><p class="muted">Hoàn thành Bài ${i}: ${esc(prev.title)} với điểm từ ${PASS}% trở lên để mở bài này.</p><a class="btn btn-primary" href="#/step/${prev.id}">Học Bài ${i}</a></div>` };
    }
    const words = x.words.map(vocabOf).filter(Boolean);
    const tabs = [["learn", "Học"], ["practice", "Luyện tập"], ["quiz", "Kiểm tra nhanh"]];
    const done = isDone(x.id);
    let body = "";
    if (tab === "learn") {
      body = x.blocks.map(block).join("") +
        `<h2>Từ vựng mới</h2><p class="small muted">${words.length} từ HSK dùng làm ví dụ cho bài. Qua bài thì các từ này vào bộ thẻ ôn tập.</p>${wordsTable(words)}
        <h2>Mẫu câu</h2>${x.sentences.map(vocabOf).filter(Boolean).map((w) => sentenceHtml(w.ex[0], w.ex[1], w.ex[2])).join("")}`;
    } else if (tab === "practice") {
      body = `<h3>Luyện nhanh trong bài</h3><p class="small muted">Các câu nghe và trắc nghiệm của bài, làm bao nhiêu lần cũng được, không tính điểm.</p><div id="pq"></div>
        <h3>Luyện thêm bằng công cụ có sẵn</h3><div class="grid grid-2">${x.practice.map((p) => `<a class="card lesson-card" href="${p.href}"><div class="lesson-icon">${ic("target")}</div><div class="lesson-body"><div class="lesson-title">${esc(p.label)}</div><div class="lesson-meta">${esc(p.desc)}</div></div></a>`).join("")}</div>`;
    } else {
      body = `<p class="small muted">${x.quiz.length} câu. Đạt từ ${PASS}% để hoàn thành bài${i + 1 < st.steps.length ? ` và mở Bài ${i + 2}` : " và mở bài kiểm tra tổng hợp"}. Phím tắt: 1–4 chọn, Enter sang câu, Space nghe lại.</p><div id="quiz"></div>`;
    }
    const ti = tabs.findIndex((t) => t[0] === tab), nextTab = tabs[ti + 1], prevTab = tabs[ti - 1];
    const html = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)} · ${esc(st.title)}</a>
      <div class="eyebrow">Bài ${i + 1}/${st.steps.length} · khoảng ${x.min} phút${done ? ` · Đã hoàn thành (${best(x.id)}%)` : ""}</div>
      <h1>${esc(x.title)} <span class="zh-serif muted" style="font-weight:500">${esc(x.icon)}</span></h1>
      <div class="card mb"><b>Mục tiêu:</b> ${x.goals.map((g) => `<span class="pill blue">${esc(g)}</span>`).join(" ")}</div>
      <div class="tabs">${tabs.map(([k, v]) => `<button class="${k === tab ? "active" : ""}" data-tab="${k}">${v}</button>`).join("")}</div>
      <div class="step-body">${body}</div>
      ${tab === "quiz" ? "" : `<div class="lesson-nav">${prevTab ? `<a class="btn" href="#/step/${x.id}/${prevTab[0]}">${ic("back")} ${prevTab[1]}</a>` : `<a class="btn" href="#/path/${st.id}">${ic("back")} Danh sách bài</a>`}<a class="btn btn-primary" href="#/step/${x.id}/${nextTab[0]}">Tiếp: ${nextTab[1]} ${ic("next")}</a></div>`}`;
    return {
      html,
      after(el) {
        el.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => (location.hash = `#/step/${x.id}/${b.dataset.tab}`)));
        bindSpeak(el);
        const sb = el.querySelector("#syl-box"); if (sb) syllableTable(sb);
        el.querySelectorAll("[data-want]").forEach((inp) => {
          const check = () => inp.closest(".typing-row").classList.toggle("ok", inp.value.replace(/\s/g, "") === inp.dataset.want);
          inp.addEventListener("input", check); inp.addEventListener("compositionend", check);
        });
        if (tab === "practice") runQuiz(el.querySelector("#pq"), shuffle(x.quiz.filter((q) => q.t !== "word")).map((q) => expand(q, x, st)), { mode: "practice" });
        if (tab === "quiz") {
          const box = el.querySelector("#quiz");
          const go = () => runQuiz(box, shuffle(x.quiz).map((q) => expand(q, x, st)), {
            onFinish(pct, c, n) {
              const r = saveResult(x.id, pct, false, words);
              const nx = st.steps[i + 1];
              box.innerHTML = `<div class="card center"><div class="result-ic ${r.pass ? "ok" : ""}">${ic(r.pass ? "trophy" : "repeat")}</div><h2 style="margin:6px 0">${pct}% · ${c}/${n} câu đúng</h2>
                <p class="muted">${r.pass ? `Bạn đã hoàn thành Bài ${i + 1}.${r.added ? ` ${r.added} từ mới đã vào bộ thẻ ôn tập; hệ thống sẽ nhắc ôn đúng lúc bạn sắp quên.` : ""}${nx ? ` Bài ${i + 2} đã mở.` : " Bài kiểm tra tổng hợp đã mở."}` : `Cần đạt ${PASS}% để mở bài sau. Xem lại phần Học hoặc Luyện tập rồi thử lại.`}</p>
                <div class="row" style="justify-content:center"><button class="btn" id="again">Làm lại</button>${r.pass ? `<a class="btn btn-primary" href="${nx ? `#/step/${nx.id}` : `#/step/${st.test.id}`}">${nx ? `Bài ${i + 2}: ${esc(nx.title)}` : "Làm kiểm tra tổng hợp"} ${ic("next")}</a>` : `<a class="btn btn-primary" href="#/step/${x.id}/learn">Xem lại bài</a>`}</div></div>`;
              box.querySelector("#again").onclick = go;
            },
          });
          go();
        }
      },
    };
  }

  // ---------- Kiểm tra tổng hợp cuối giai đoạn (mô phỏng đề HSK: Nghe + Đọc) ----------
  function stageTest(st) {
    const open = st.steps.every((x) => isDone(x.id)) || ps().placed > st.id;
    if (!open) return { html: `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)}</a><div class="card center empty">${ic("lock", "big-ic")}<h2>Chưa mở</h2><p class="muted">Hoàn thành cả ${st.steps.length} bài của ${esc(st.name)} để làm bài kiểm tra tổng hợp.</p><a class="btn btn-primary" href="#/path/${st.id}">Về danh sách bài</a></div>` };
    const all = st.steps.flatMap((x) => x.quiz.map((q) => ({ q, x })));
    const listen = shuffle(all.filter((o) => o.q.t === "tone" || o.q.t === "listen" || o.q.t === "syl")).slice(0, st.test.listen);
    const read = shuffle(all.filter((o) => o.q.t === "mcq" || o.q.t === "word" || o.q.t === "radical")).slice(0, st.test.read);
    const items = [...listen, ...read].map((o) => expand(o.q, o.x, st));
    const sections = [{ name: "Phần 1 · Nghe (听力)", from: 0, to: listen.length }, { name: "Phần 2 · Đọc (阅读)", from: listen.length, to: items.length }];
    const html = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)} · ${esc(st.title)}</a>
      <div class="eyebrow">${esc(st.name)} · khoảng ${st.test.min} phút</div><h1>${esc(st.test.title)}</h1>
      <p class="subtitle">Mô phỏng cách ra đề HSK: phần Nghe ${listen.length} câu (thanh điệu, pinyin), phần Đọc ${read.length} câu (quy tắc, chữ, bộ thủ). Câu hỏi lấy ngẫu nhiên từ ${st.steps.length} bài, mỗi lần làm một đề khác. Đạt từ ${PASS}% để hoàn thành giai đoạn.</p>
      <div id="quiz"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#quiz");
        App.setFocus(true);
        runQuiz(box, items, {
          sections,
          onFinish(pct, c, n) {
            App.setFocus(false);
            const r = saveResult(st.test.id, pct, true);
            box.innerHTML = `<div class="card center"><div class="result-ic ${r.pass ? "ok" : ""}">${ic(r.pass ? "trophy" : "repeat")}</div><h2 style="margin:6px 0">${pct}% · ${c}/${n} câu đúng</h2>
              <p class="muted">${r.pass ? `Chúc mừng, bạn đã hoàn thành ${esc(st.name)} · ${esc(st.title)}! Giờ bạn đã đọc được pinyin, biết viết và gõ chữ Hán. Bước tiếp theo là từ vựng HSK 1.` : `Cần đạt ${PASS}%. Xem lại các bài có điểm thấp rồi làm lại; mỗi lần là một đề mới.`}</p>
              <div class="row" style="justify-content:center"><button class="btn" id="again">Làm đề khác</button>${r.pass ? `<a class="btn btn-primary" href="#/lessons/1">Vào HSK 1 · Bài 1 ${ic("next")}</a>` : `<a class="btn btn-primary" href="#/path/${st.id}">Về danh sách bài</a>`}</div></div>`;
            box.querySelector("#again").onclick = () => App.route();
          },
        });
      },
    };
  }

  // ---------- Kiểm tra đầu vào (tùy chọn) ----------
  function placement() {
    const st = STAGES[0];
    const pool = st.steps.flatMap((x) => x.quiz.filter((q) => q.t === "tone" || q.t === "listen").map((q) => ({ q, x })));
    const a = shuffle(pool).slice(0, 8).map((o) => expand(o.q, o.x, st));
    const hsk1 = VOCAB.filter((w) => w.l >= 1 && w.l <= 12);
    const b = shuffle(hsk1).slice(0, 6).map((w) => {
      const ds = shuffle(hsk1.filter((d) => d.hz !== w.hz && d.vi !== w.vi)).slice(0, 3);
      return { kind: "word", prompt: "Từ này nghĩa là gì?", show: w, say: w.hz, opts: shuffle([w.vi, ...ds.map((d) => d.vi)]), answer: w.vi, explain: `${w.hz} ${w.py} · ${w.vi}` };
    });
    const html = `<a href="#/start" class="backlink">${ic("back")} Bắt đầu học</a><h1>Kiểm tra đầu vào</h1>
      <p class="subtitle">14 câu, khoảng 5 phút: 8 câu nghe pinyin và thanh điệu, 6 câu từ vựng HSK 1. Không biết thì cứ đoán, kết quả chỉ để gợi ý chỗ bắt đầu.</p><div id="quiz"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#quiz");
        const items = [...a, ...b];
        runQuiz(box, items, {
          sections: [{ name: "Phần 1 · Pinyin và thanh điệu", from: 0, to: a.length }, { name: "Phần 2 · Từ vựng HSK 1", from: a.length, to: items.length }],
          onFinish(pct, c, n, results) {
            const partA = results.slice(0, a.length).filter(Boolean).length;
            const pa = Math.round((partA / a.length) * 100), pb = Math.round(((c - partA) / b.length) * 100);
            const skip = pa >= PASS;
            box.innerHTML = `<div class="card"><h2 style="margin-top:0">Kết quả: pinyin ${pa}% · từ vựng HSK 1 ${pb}%</h2>
              <p>${skip ? `Bạn đã nghe và đọc pinyin khá chắc. Bạn có thể <b>bỏ qua Giai đoạn 0</b> và bắt đầu từ HSK 1; các bài Nhập môn vẫn mở để xem lại khi cần.` : `Nên học <b>Giai đoạn 0 · Nhập môn</b> trước: chỉ 1–2 tuần nhưng giúp bạn phát âm đúng ngay từ đầu.`}${skip && pb >= 80 ? " Bạn cũng đã biết khá nhiều từ HSK 1: làm phần Luyện tập cuối mỗi bài HSK 1, đạt 70% là qua nhanh." : ""}</p>
              <div class="row">${skip ? `<button class="btn btn-primary" id="place">Bỏ qua Nhập môn, vào HSK 1</button><a class="btn" href="#/path/0">Vẫn học Nhập môn</a>` : `<a class="btn btn-primary" href="#/step/s0-1">Bắt đầu Bài 1</a>`}</div></div>`;
            const pl = box.querySelector("#place");
            if (pl) pl.onclick = () => { ps().placed = Math.max(ps().placed || 0, 1); Store.save(); location.hash = "#/lessons/1"; };
          },
        });
      },
    };
  }

  // ---------- Thẻ trên trang chủ ----------
  function homeCard() {
    const st = STAGES[0], n = next(), d = doneCount(st), total = st.steps.length + 1;
    if (!n && stageDone(st)) return "";
    return `<a class="card lesson-card path-home" href="${n ? n.href : "#/start"}"><div class="lesson-icon">${ic("map")}</div><div class="lesson-body"><div class="lesson-title">Lộ trình · ${esc(st.name)} ${esc(st.title)}</div>
      <div class="lesson-meta">${n ? `Tiếp theo: ${esc(n.label.replace(/^[^·]+· /, ""))}` : "Đã xếp lên Giai đoạn 1"}</div><div class="progress green mt"><span style="width:${(d / total) * 100}%"></span></div></div><span class="pill">${d}/${total}</span></a>`;
  }

  window.Path = { start, stage, step, next, started, homeCard, syllableTable, markTone };
})();
