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
  // Chỉ mục tra nhanh (Giai đoạn 1–6 có hàng trăm phần): mã bài/phần → bài, giai đoạn; mã bài HSK → các phần của nó
  let IDX = null;
  function idx() {
    if (IDX) return IDX;
    IDX = { step: new Map(), stage: new Map(), at: new Map(), parts: new Map(), testLv: new Map(), word: new Map(), lw: new Map() };
    STAGES.forEach((st) => {
      st.steps.forEach((x, i) => {
        IDX.step.set(x.id, x); IDX.stage.set(x.id, st); IDX.at.set(x.id, i);
        if (x.lesson) { if (!IDX.parts.has(x.lesson)) IDX.parts.set(x.lesson, []); IDX.parts.get(x.lesson).push(x); }
      });
      IDX.stage.set(st.test.id, st);
      if (st.test.exam) IDX.testLv.set(st.test.id, st.test.exam);
    });
    VOCAB.forEach((w) => { IDX.word.set(w.id, w); if (!IDX.lw.has(w.l)) IDX.lw.set(w.l, []); IDX.lw.get(w.l).push(w); });
    // Bù HSK 3.0 (js/path-h30.js): từ chỉ có trong HSK 3.0 (mã h3_<chữ>) và từ của từng bài bổ sung
    if (window.H3) H3.extraList().forEach((w) => IDX.word.set(w.id, w));
    STAGES.forEach((st) => (st.bridge || []).forEach((lid) => IDX.lw.set(lid, (IDX.parts.get(lid) || []).flatMap((p) => p.words.map((id) => IDX.word.get(id))).filter(Boolean))));
    return IDX;
  }
  const stageOf = (id) => idx().stage.get(id);
  const wordById = (id) => idx().word.get(id);
  const lessonOf = (id) => LESSONS.find((l) => l.id === id) || (window.H3 ? H3.findLesson(id) : undefined);
  // Phần «Bù HSK 3.0» (opt) không bắt buộc: không tính vào điều kiện mở kiểm tra tổng hợp và tiến độ giai đoạn
  const req = (st) => st.steps.filter((x) => !x.opt);
  const totalOf = (st) => req(st).length + 1;
  // Đề HSK của giai đoạn: tính theo phần trăm tổng điểm trong lịch sử thi thử (exams)
  const examPct = (e) => (e.max ? Math.round((e.total / e.max) * 100) : 0);
  const examsOf = (lv) => (Store.state.exams || []).filter((e) => e.level === lv && e.max);
  function isDone(id) {
    const p = ps();
    if ((p.steps[id] && p.steps[id].done) || (p.tests[id] && p.tests[id].done)) return true;
    const x = idx().step.get(id);
    if (x && x.lesson && Store.state.completedLessons.includes(x.lesson)) return true; // đã xong bài HSK cũ → xong mọi phần của bài
    const lv = idx().testLv.get(id);
    return !!(lv && examsOf(lv).some((e) => examPct(e) >= PASS));
  }
  function best(id) {
    const b = (ps().steps[id] || ps().tests[id] || {}).best, lv = idx().testLv.get(id);
    const all = [b, ...(lv ? examsOf(lv).map(examPct) : [])].filter((v) => v != null);
    return all.length ? Math.max(...all) : undefined;
  }
  const stageDone = (st) => req(st).every((x) => isDone(x.id)) && isDone(st.test.id);
  // Giai đoạn 1–6 mở khi đạt kiểm tra tổng hợp giai đoạn trước, được xếp lên qua kiểm tra đầu vào, hoặc đã học dở (kể cả bài HSK cũ)
  function stageOpen(st) {
    if (st.id === 0 || ps().placed >= st.id) return true;
    const prev = STAGES.find((s) => s.id === st.id - 1);
    return !prev || isDone(prev.test.id) || st.steps.some((x) => isDone(x.id));
  }
  function unlocked(st, i) { // i = chỉ số bài; i = st.steps.length là bài kiểm tra tổng hợp
    if (ps().placed > st.id) return true;
    if (!stageOpen(st)) return false;
    if (i === 0) return true;
    // bài đã đạt luôn mở lại được (chặng xếp lại theo chủ đề có thể đặt bài đã học sau một bài chưa học)
    if (st.steps[i] && isDone(st.steps[i].id)) return true;
    // phần Bù HSK 3.0 đầu tiên mở khi xong phần HSK 2.0 cuối hoặc đã đạt kiểm tra tổng hợp; các phần bù sau nối tiếp nhau như thường
    const x = st.steps[i], prev = st.steps[i - 1];
    if (x && x.opt && !prev.opt && isDone(st.test.id)) return true;
    return isDone(prev.id);
  }
  const testOpen = (st) => req(st).every((x) => isDone(x.id)) || ps().placed > st.id;
  // Tên hiển thị của một bài/phần: Giai đoạn 0 «Bài 3: …», Giai đoạn 1–6 «Bài 5: Chủ đề · Phần A», «Ôn tập chặng 2 · …»
  const stepName = (x, i) => (x.kind === "part" ? `${x.lessonName}: ${x.title}` : x.kind === "review" ? x.label : `Bài ${i + 1}: ${x.title}`);
  // Bài tiếp theo cần học trong lộ trình, hoặc null nếu đã xong / đã được xếp lên giai đoạn sau
  function next() {
    for (const st of STAGES) {
      if (ps().placed > st.id) continue;
      // thứ tự gợi ý: phần HSK 2.0 → phần Bù HSK 3.0 (nếu chưa đạt kiểm tra) → kiểm tra tổng hợp; đã đạt kiểm tra thì sang giai đoạn sau
      const at = (i) => ({ href: `#/step/${st.steps[i].id}`, label: `${st.name} · ${stepName(st.steps[i], i)}`, stage: st, i });
      const i = st.steps.findIndex((x) => !x.opt && !isDone(x.id));
      if (i >= 0) return at(i);
      if (isDone(st.test.id)) continue;
      const j = st.steps.findIndex((x) => x.opt && !isDone(x.id));
      if (j >= 0) return at(j);
      return { href: `#/step/${st.test.id}`, label: `${st.name} · ${st.test.title}`, stage: st, i: st.steps.length };
    }
    return null;
  }
  const started = () => Object.keys(ps().steps).length > 0 || Object.keys(ps().tests).length > 0 || ps().placed > 0;
  const doneCount = (st) => req(st).filter((x) => isDone(x.id)).length + (isDone(st.test.id) ? 1 : 0);

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
    // Giai đoạn 1–6: câu hỏi theo mã từ (nghĩa, chọn chữ, nghe chọn pinyin) và câu sắp xếp lấy từ câu mẫu của bài gốc
    if (item.t === "mean" || item.t === "char" || item.t === "hear") {
      const w = wordById(item.id), nf = (s) => String(s).normalize("NFC").toLowerCase();
      // phương án nhiễu: từ cùng bài trước, rồi từ cùng giai đoạn; không trùng chữ, nghĩa hay pinyin với đáp án
      const lvWords = stage._words || (stage._words = [...(stage.lessons || []), ...(stage.bridge || [])].flatMap((l) => idx().lw.get(l) || []));
      const cand = [...shuffle(idx().lw.get(w.l != null ? w.l : w.h3l) || []), ...shuffle(lvWords).slice(0, 60)];
      const ds = [], seen = new Set([w.hz, w.vi, nf(w.py)]);
      const ok = (d) => !seen.has(d.hz) && !seen.has(d.vi) && !seen.has(nf(d.py));
      if (item.t === "hear") cand.sort((a, b) => (a.hz.length === w.hz.length ? 0 : 1) - (b.hz.length === w.hz.length ? 0 : 1));
      for (const d of cand) { if (ds.length === 3) break; if (ok(d)) { ds.push(d); seen.add(d.hz); seen.add(d.vi); seen.add(nf(d.py)); } }
      const ex = `${w.hz} ${w.py} · ${w.vi}`;
      if (item.t === "mean") return { kind: "word", prompt: "Từ này nghĩa là gì?", show: w, say: w.hz, opts: shuffle([w.vi, ...ds.map((d) => d.vi)]), answer: w.vi, explain: ex };
      if (item.t === "char") return { kind: "char", prompt: "Chọn chữ Hán đúng", show: w, say: w.hz, opts: shuffle([w.hz, ...ds.map((d) => d.hz)]), answer: w.hz, explain: ex };
      return { kind: "listen", prompt: "Nghe và chọn pinyin đúng", say: w.hz, opts: shuffle([w.py, ...ds.map((d) => d.py)]), answer: w.py, explain: ex };
    }
    if (item.t === "order") {
      const s = lessonOf(item.lesson).sentences[item.k], zh = s[0].replace(/ /g, "");
      let tokens = shuffle(s[0].split(" "));
      for (let k = 0; k < 6 && tokens.join(" ") === s[0]; k++) tokens = shuffle(tokens); // tránh đưa ra đúng thứ tự sẵn
      return { kind: "order", prompt: `Sắp xếp thành câu: ${s[2]}`, sub: s[1], tokens, answer: s[0], alts: s[3] || [], say: zh, explain: `${zh} · ${s[1]}` };
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
      const head = q.kind === "listen" ? `<button class="btn btn-lg" id="play">${ic("volume")} Nghe lại</button>`
        : q.kind === "word" ? `<div class="main">${esc(q.show.hz)}</div><div class="sub">${pyHtml(q.show.py)}</div>`
        : q.kind === "char" ? `<div class="main vi-text">${esc(q.show.vi)}</div><div class="sub hv">${esc(q.show.hv)}</div>`
        : q.kind === "order" ? `<div class="sub">${pyHtml(q.sub)}</div>`
        : "";
      const body = q.kind === "order"
        ? `<div class="tiles" id="answer"></div><p class="small muted center" style="margin:6px">Bấm vào từ để chuyển lên / xuống</p><div class="tiles" id="bank">${q.tokens.map((t, k) => `<button class="tile zh" data-k="${k}">${esc(t)}</button>`).join("")}</div>
          <div class="row mt center"><button class="btn btn-primary" id="check">Kiểm tra</button></div>`
        : `<div class="options">${q.opts.map((o, k) => `<button class="option ${q.kind === "listen" ? "py-opt" : q.kind === "char" ? "zh" : "vi-text"}" data-k="${k}"><span class="kbd-hint">${k + 1}</span>${q.kind === "listen" ? pyHtml(o) : esc(o)}</button>`).join("")}</div>`;
      box.innerHTML = `<div class="quiz-progress">${list.map((_, k) => `<span class="${k < i ? (results[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></span>`).join("")}</div>
        ${sec ? `<div class="eyebrow center">${esc(sec.name)}</div>` : ""}
        <div class="quiz-q"><div class="prompt">${q.html ? q.prompt : esc(q.prompt)}</div>${head}</div>
        ${body}<div id="fb"></div>`;
      const play = box.querySelector("#play");
      if (play) { play.onclick = () => say(q); say(q); }
      box.querySelectorAll(".option").forEach((o) => (o.onclick = () => pick(+o.dataset.k)));
      if (q.kind === "order") {
        const ans = box.querySelector("#answer"), bank = box.querySelector("#bank");
        box.querySelectorAll(".tile").forEach((t) => (t.onclick = () => { if (!answered) (t.parentElement === bank ? ans : bank).appendChild(t); }));
        box.querySelector("#check").onclick = checkOrder;
      }
      App.keyHandler = (e) => {
        if (e.target.closest("input, textarea, select")) return;
        if (!answered && q.opts && /^[1-9]$/.test(e.key) && +e.key <= q.opts.length) pick(+e.key - 1);
        else if (!answered && q.kind === "order" && e.key === "Enter") { e.preventDefault(); checkOrder(); }
        else if (answered && e.key === "Enter") { e.preventDefault(); i++; render(); }
        else if (e.key === " " && play) { e.preventDefault(); say(q); }
      };
    }
    function checkOrder() {
      if (answered) return;
      const q = list[i], got = [...box.querySelectorAll("#answer .tile")].map((t) => t.textContent).join(" ");
      answered = true;
      box.querySelector("#check").disabled = true;
      grade(got === q.answer || q.alts.includes(got));
    }
    function pick(k) {
      if (answered) return; answered = true;
      const q = list[i], ok = q.opts[k] === q.answer;
      box.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (q.opts[+x.dataset.k] === q.answer) x.classList.add("correct"); });
      if (!ok) box.querySelector(`.option[data-k="${k}"]`).classList.add("wrong");
      grade(ok);
    }
    function grade(ok) {
      const q = list[i];
      results[i] = ok; if (ok) correct++;
      if (q.kind !== "listen" && q.say) TTS.speak(q.say);
      box.querySelector("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "Chính xác!" : "Chưa đúng."} Đáp án: ${esc(q.explain)}</div>
        <div class="center mt"><button class="btn btn-primary" id="nx">${i + 1 < list.length ? "Câu tiếp" : mode === "practice" ? "Xong" : "Xem kết quả"} ${ic("next")}</button></div>`;
      const nx = box.querySelector("#nx"); nx.onclick = () => { i++; render(); }; nx.focus();
    }
    render();
  }

  // Biểu đồ cao độ – trường độ của 4 thanh và thanh nhẹ, theo thang 5 bậc của Triệu Nguyên Nhậm (55, 35, 214, 51).
  // Trục dọc: cao độ bậc 1 (thấp) → 5 (cao). Bề ngang mỗi đường: trường độ tương đối khi đọc riêng một âm tiết
  // (thanh 3 dài nhất, thanh 4 ngắn nhất trong 4 thanh, thanh nhẹ rất ngắn và cao độ tùy thanh đứng trước).
  function toneChart() {
    const Y = (lv) => 190 - (lv - 1) * 34, X0 = 38, SLOT = 64, UNIT = 52;
    const T = [
      { n: 1, name: "Thanh 1", code: "55", dur: 0.8, d: (x, w) => `M${x},${Y(5)} L${x + w},${Y(5)}` },
      { n: 2, name: "Thanh 2", code: "35", dur: 0.8, d: (x, w) => `M${x},${Y(3)} C${x + w * 0.45},${Y(3)} ${x + w * 0.7},${Y(4.2)} ${x + w},${Y(5)}` },
      { n: 3, name: "Thanh 3", code: "214", dur: 1, d: (x, w) => `M${x},${Y(2)} C${x + w * 0.2},${Y(1.2)} ${x + w * 0.35},${Y(1)} ${x + w * 0.5},${Y(1)} C${x + w * 0.7},${Y(1)} ${x + w * 0.85},${Y(2.6)} ${x + w},${Y(4)}` },
      { n: 4, name: "Thanh 4", code: "51", dur: 0.6, d: (x, w) => `M${x},${Y(5)} C${x + w * 0.4},${Y(4.6)} ${x + w * 0.75},${Y(2.6)} ${x + w},${Y(1)}` },
      { n: 5, name: "Thanh nhẹ", code: "ngắn", dur: 0.3, d: (x, w) => `M${x},${Y(2.5)} L${x + w},${Y(2.5)}` },
    ];
    const grid = [1, 2, 3, 4, 5].map((lv) => `<line x1="${X0 - 6}" y1="${Y(lv)}" x2="358" y2="${Y(lv)}" class="tc-grid"/><text x="${X0 - 12}" y="${Y(lv) + 4}" class="tc-lv" text-anchor="end">${lv}</text>`).join("");
    const lines = T.map((t, i) => {
      const x = X0 + i * SLOT + 4, w = Math.round(t.dur * UNIT), mid = X0 + i * SLOT + SLOT / 2 - 2;
      return `<path d="${t.d(x, w)}" stroke="var(--tone${t.n})" class="tc-line"/>
        <line x1="${x}" y1="207" x2="${x + w}" y2="207" stroke="var(--tone${t.n})" class="tc-dur"/>
        <text x="${mid}" y="224" text-anchor="middle" class="tc-name">${t.name}</text>
        <text x="${mid}" y="238" text-anchor="middle" class="tc-code" fill="var(--tone${t.n})">${t.code}</text>`;
    }).join("");
    return `<figure class="card tone-chart">
      <svg viewBox="0 26 364 220" role="img" aria-label="Biểu đồ cao độ và trường độ: thanh 1 cao và bằng (55); thanh 2 đi lên từ bậc 3 tới 5 (35); thanh 3 xuống bậc 1 rồi lên bậc 4 (214), dài nhất; thanh 4 rơi từ bậc 5 xuống 1 (51), ngắn nhất trong bốn thanh; thanh nhẹ rất ngắn.">
        <text x="2" y="${Y(5) - 14}" class="tc-axis">Cao độ</text>
        ${grid}${lines}
        <text x="356" y="${Y(5) - 14}" class="tc-axis" text-anchor="end">vạch dưới = trường độ</text>
      </svg>
      <figcaption class="small"><b>Cao độ</b> (trục dọc) chia 5 bậc, 1 thấp nhất, 5 cao nhất; con số dưới tên thanh là bậc đầu → cuối. <b>Trường độ</b> (vạch màu bên dưới) là độ dài tương đối khi đọc riêng một âm: thanh 3 dài nhất, thanh 4 ngắn và dứt khoát, thanh 1 và thanh 2 ở giữa. Thanh nhẹ rất ngắn, cao hay thấp tùy thanh đứng trước. Trong câu, thanh 3 thường chỉ đọc nửa đầu (21).</figcaption>
    </figure>`;
  }

  // ---------- Khối nội dung của phần Học ----------
  function block(b) {
    switch (b.t) {
      case "p": return `<p>${md(b.text)}</p>`;
      case "tip": return `<div class="tip"><b>Mẹo:</b> ${md(b.text)}</div>`;
      case "rule": return `<div class="grammar"><div class="pattern">${esc(b.title)}</div><div class="small">${md(b.text)}</div></div>`;
      case "toneChart": return toneChart();
      case "tones": return `<div class="grid grid-3 path-tones">${PINYIN.tones.map((t) => `<div class="card tone-card"><div class="mark t${t.n}">${t.mark}</div>
          <svg viewBox="0 0 100 70" aria-hidden="true"><line x1="5" y1="10" x2="5" y2="65" stroke="var(--border)"/><line x1="5" y1="65" x2="95" y2="65" stroke="var(--border)"/><path d="${t.path}" stroke="var(--tone${t.n})" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
          <b>${esc(t.name)}</b><p class="small" style="margin:6px 0">${esc(t.desc)}</p><p class="small muted" style="margin:0 0 8px"><b>Người Việt:</b> ${esc(t.vi)}</p>
          <div class="row center">${t.ex.map((e) => `<button class="btn btn-sm" data-say="${esc(e.split(" ")[1])}">${esc(e)}</button>`).join("")}</div></div>`).join("")}</div>`;
      case "toneRules": return `<div class="grid grid-2">${PINYIN.toneRules.map((r) => `<div class="grammar"><div class="pattern">${esc(r.title)}</div><div class="small">${esc(r.body)}</div></div>`).join("")}</div>`;
      case "pinyin": {
        const list = PINYIN[b.key].filter((x) => b.only.includes(x.py));
        return `<div class="py-list">${list.map((x) => { const say = x.ex.split(" ")[1] || x.ex; return `<button class="py-row" data-say="${esc(say)}"><span class="py">${esc(x.py)}</span><span class="zh">${esc(x.ex)}</span><span class="small muted">${esc(x.vi)}</span>${ic("volume")}</button>`; }).join("")}</div>`;
      }
      case "table": return `<div class="table-wrap"><table class="plain-table"><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, k) => `<td class="${k === 0 && /[一-鿿㇀-㇯丨-丶𠃍]/u.test(c) && c.length <= 2 ? "zh big" : ""}">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "strokes": return `<h3>Bảy quy tắc thứ tự nét</h3><div class="grid grid-2">${b.items.map(([rule, ch]) => `<a class="card lesson-card" href="#/write/${encodeURIComponent(ch)}"><div class="lesson-icon">${esc(ch)}</div><div class="lesson-body"><div class="lesson-title">${esc(rule)}</div><div class="lesson-meta">Bấm để xem hoạt hình và tập viết ${esc(ch)}</div></div></a>`).join("")}</div>`;
      case "radicals": return `<div class="grid grid-2">${RADICALS.slice(0, b.n).map((r) => `<div class="card radical-card"><div class="r">${esc(r.r.split(" ")[0])}</div><div style="flex:1"><div><b>${esc(r.r)}</b> · <span class="t${toneOf(r.py)}">${esc(r.py)}</span> · <span class="hv">${esc(r.hv)}</span> · ${esc(r.vi)}</div><div class="exs">${esc(r.ex)}</div></div>${speakBtn(r.r.split(" ")[0])}</div>`).join("")}</div>`;
      case "syllables": return `<div class="card" id="syl-box"></div>`;
      case "typing": return `<h3>Gõ thử</h3><p class="small muted">Bật bộ gõ tiếng Trung, nghe rồi gõ lại từ vào ô. Gõ đúng chữ Hán là ô chuyển xanh.</p><div class="stack typing">${b.items.map((hz) => { const w = vocabOf(hz); return `<label class="typing-row"><span class="typing-q">${speakBtn(hz)}<span><b>${esc(w.vi)}</b><details class="small muted"><summary>Gợi ý</summary>${pyHtml(w.py)} · gõ «${esc(plain(w.py).replace(/ü/g, "v").replace(/\s/g, "").toLowerCase())}»</details></span></span><input class="search zh" data-want="${esc(hz)}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" lang="zh-CN" aria-label="Gõ chữ Hán của: ${esc(w.vi)}"><span class="typing-ok" aria-hidden="true">${ic("check")}</span></label>`; }).join("")}</div>`;
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
    // Giai đoạn 1–6: qua hết các phần của một bài → bài HSK cũ cũng được đánh dấu hoàn thành (mở bài đọc, tính tiến độ cấp)
    let lessonNow = false;
    const x = idx().step.get(id);
    if (pass && x && x.lesson && !Store.state.completedLessons.includes(x.lesson) && idx().parts.get(x.lesson).every((y) => isDone(y.id))) {
      Store.state.completedLessons.push(x.lesson); lessonNow = true;
    }
    Store.save();
    return { pass, added, first, lessonNow };
  }

  // ---------- Trang «Bắt đầu học» ----------
  function start(sub) {
    if (sub === "test") return placement();
    const n = next(), began = started();
    const card = (st) => {
      const done = stageDone(st), open = stageOpen(st) || ps().placed > st.id, cur = !done && n && n.stage === st;
      const total = totalOf(st), d = doneCount(st), nParts = req(st).filter((x) => x.kind === "part").length, nBridge = st.steps.filter((x) => x.opt && x.kind === "part").length;
      const desc = st.id === 0 ? `${st.sub} ${st.steps.length} bài + kiểm tra tổng hợp.` : `${st.sub} ${nParts} phần 15–30 phút + kiểm tra tổng hợp dạng đề HSK ${st.id}${nBridge ? ` + ${nBridge} phần Bù HSK 3.0` : ""}.`;
      return `<li class="stage ${done ? "done" : cur ? "current" : open ? "" : "locked"}">
          <a class="card stage-card" href="#/path/${st.id}">
            <div class="stage-num">${done ? ic("check") : open ? st.id : ic("lock")}</div>
            <div class="stage-body"><div class="row between"><b>${esc(st.name)} · ${esc(st.title)}${st.id ? ` <span class="muted" style="font-weight:500">(HSK 2.0)</span>` : ""}</b><span class="pill ${st.id ? "" : "gold"}">${esc(st.time)}</span></div>
              <div class="small muted">${esc(desc)}</div>
              <div class="row between small mt"><span>${d}/${total} mục${ps().placed > st.id && !done ? ` · đã xếp lên Giai đoạn ${ps().placed}` : ""}${!open ? ` · mở khi đạt kiểm tra tổng hợp Giai đoạn ${st.id - 1}` : ""}</span></div>
              <div class="progress green"><span style="width:${(d / total) * 100}%"></span></div></div>
          </a></li>`;
    };
    const html = `<h1>Bắt đầu học</h1>
      <p class="subtitle">Lộ trình đi từng bước từ con số 0: phát âm trước, rồi từ vựng theo cấp HSK. Mỗi bài 15–30 phút, gồm phần học, luyện tập và kiểm tra nhanh; đạt từ ${PASS}% thì mở bài tiếp theo. Từ đã học tự vào bộ thẻ ôn tập ngắt quãng.</p>
      <div class="card start-cta">
        <div><div class="eyebrow">${n ? (began ? "Đang học" : "Bắt đầu từ đây") : "Đã đi hết lộ trình"}</div>
          <h2 style="margin:4px 0 0">${n ? esc(n.label) : "Ôn tập và thi thử để giữ vững HSK 6"}</h2></div>
        <div class="row">${n ? `<a class="btn btn-primary btn-lg" href="${n.href}">${ic("play")} ${began ? "Tiếp tục học" : "Bắt đầu Bài 1"}</a>` : `<a class="btn btn-primary btn-lg" href="#/exam">${ic("exam")} Thi thử HSK</a>`}
          ${!began ? `<a class="btn btn-lg" href="#/start/test">${ic("target")} Kiểm tra đầu vào</a>` : ""}</div>
        ${!began ? `<p class="small muted" style="margin:0">Đã biết pinyin hoặc đã học tiếng Trung? Làm kiểm tra đầu vào (5–15 phút, không bắt buộc) để được xếp lên đúng giai đoạn.</p>` : ""}
      </div>
      <h2>Các giai đoạn</h2>
      <ol class="stage-list">${STAGES.map(card).join("")}</ol>
      <p class="small muted">Giai đoạn 1–6 chia các bài học HSK 2.0 sẵn có thành phần nhỏ; bài HSK đã hoàn thành trước đây được tính là xong mọi phần của bài. Học theo HSK 3.0 (đề cương 2025)? Xem <a href="#/lessons/h3">bài bổ sung HSK 3.0</a> và <a href="#/words">từ vựng theo cấp</a>.</p>`;
    return { html };
  }

  // ---------- Trang giai đoạn ----------
  function stage(id) {
    const st = STAGES.find((x) => x.id === +id) || STAGES[0];
    if (st.id > 0) return stageHsk(st);
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
          ${done ? `<span class="pill green">Xong</span>` : isCur ? `<span class="pill primary">Học tiếp</span>` : ""}
        ${open ? `</a>` : `</div>`}</li>`;
    };
    const tOpen = unlocked(st, st.steps.length) && st.steps.every((x) => isDone(x.id) || ps().placed > st.id), tDone = isDone(st.test.id);
    const html = `<a href="#/start" class="backlink">${ic("back")} Bắt đầu học</a>
      <div class="eyebrow">${esc(st.name)} · ${esc(st.std)}</div><h1>${esc(st.title)}</h1>
      <p class="subtitle">${esc(st.sub)} ${st.steps.length} bài nhỏ và một bài kiểm tra tổng hợp, dự kiến ${esc(st.time)}.</p>
      <div class="card mb"><div class="row between small"><b>Tiến độ giai đoạn</b><span>${d}/${total}</span></div><div class="progress green mt"><span style="width:${(d / total) * 100}%"></span></div>
        ${n && n.stage === st ? `<a class="btn btn-sm mt" href="${n.href}">${ic("play")} Tiếp tục: ${n.i < st.steps.length ? `Bài ${n.i + 1}` : "Kiểm tra tổng hợp"}</a>` : ""}</div>
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
    if (id === st.test.id) return st.test.exam ? examTest(st) : stageTest(st);
    const i = idx().at.get(id), x = st.steps[i];
    if (!unlocked(st, i)) {
      const back = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)}</a>`;
      if (!stageOpen(st)) return { html: `${back}<div class="card center empty"><div class="big-ic">${ic("lock")}</div><h2>${esc(st.name)} chưa mở</h2><p class="muted">Đạt từ ${PASS}% kiểm tra tổng hợp Giai đoạn ${st.id - 1}, hoặc làm kiểm tra đầu vào để được xếp lên giai đoạn này.</p><div class="row center"><a class="btn btn-primary" href="#/path/${st.id - 1}">Về Giai đoạn ${st.id - 1}</a><a class="btn" href="#/start/test">Kiểm tra đầu vào</a></div></div>` };
      const prev = st.steps[i - 1], short = (y, k) => (y.kind ? y.label : `Bài ${k + 1}`);
      return { html: `${back}<div class="card center empty"><div class="big-ic">${ic("lock")}</div><h2>${esc(short(x, i))} chưa mở</h2><p class="muted">Hoàn thành ${esc(stepName(prev, i - 1))} với điểm từ ${PASS}% trở lên để mở bài này.</p><a class="btn btn-primary" href="#/step/${prev.id}">Học ${esc(short(prev, i - 1))}</a></div>` };
    }
    if (x.kind === "part") return partStep(st, i, x, tab);
    if (x.kind === "review") return reviewStep(st, i, x);
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
                <div class="row center"><button class="btn" id="again">Làm lại</button>${r.pass ? `<a class="btn btn-primary" href="${nx ? `#/step/${nx.id}` : `#/step/${st.test.id}`}">${nx ? `Bài ${i + 2}: ${esc(nx.title)}` : "Làm kiểm tra tổng hợp"} ${ic("next")}</a>` : `<a class="btn btn-primary" href="#/step/${x.id}/learn">Xem lại bài</a>`}</div></div>`;
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
    if (!open) return { html: `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)}</a><div class="card center empty"><div class="big-ic">${ic("lock")}</div><h2>Chưa mở</h2><p class="muted">Hoàn thành cả ${st.steps.length} bài của ${esc(st.name)} để làm bài kiểm tra tổng hợp.</p><a class="btn btn-primary" href="#/path/${st.id}">Về danh sách bài</a></div>` };
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
              <div class="row center"><button class="btn" id="again">Làm đề khác</button>${r.pass ? `<a class="btn btn-primary" href="#/path/1">Vào Giai đoạn 1 · HSK 1 ${ic("next")}</a>` : `<a class="btn btn-primary" href="#/path/${st.id}">Về danh sách bài</a>`}</div></div>`;
            box.querySelector("#again").onclick = () => App.route();
          },
        });
      },
    };
  }

  // ---------- Giai đoạn 1–6: trang giai đoạn ----------
  // Mỗi dòng là một bài HSK, các phần A/B/C là nút nhỏ trong dòng; giai đoạn dài gập theo chặng để danh sách ngắn trên điện thoại.
  function stageHsk(st) {
    const due = SRS.dueIds().length, n = next(), open = stageOpen(st) || ps().placed > st.id, pos = idx().at;
    const total = totalOf(st), d = doneCount(st), cur = n && n.stage === st ? n : null;
    const nParts = req(st).filter((x) => x.kind === "part").length, nRev = req(st).length - nParts;
    const bridge = st.steps.filter((x) => x.opt), nBridge = bridge.filter((x) => x.kind === "part").length, order = [...st.lessons, ...(st.bridge || [])];
    const lessonRow = (lid) => {
      const parts = idx().parts.get(lid), L = lessonOf(lid), last = parts[parts.length - 1];
      const doneAll = parts.every((p) => isDone(p.id)), isOpen = unlocked(st, pos.get(parts[0].id));
      const isCur = cur && parts.some((p) => pos.get(p.id) === cur.i);
      const R = last.reading && READINGS.find((r) => r.id === last.reading);
      const chip = (p) => {
        const k = pos.get(p.id), dn = isDone(p.id), b = best(p.id), lab = `<span class="pc-w">Phần </span>${"ABCD"[p.part]} · ${p.min}′`;
        return unlocked(st, k) ? `<a class="part-chip ${dn ? "done" : cur && cur.i === k ? "cur" : ""}" href="#/step/${p.id}" title="${esc(p.label)}${b != null ? ` · điểm cao nhất ${b}%` : ""}">${dn ? ic("check") : ""}${lab}</a>`
          : `<span class="part-chip locked" title="Cần đạt ${PASS}% phần trước">${ic("lock")}${lab}</span>`;
      };
      return `<li class="step ${doneAll ? "done" : isOpen ? "open" : "locked"} ${isCur ? "current" : ""}">
        <span class="step-dot" aria-hidden="true">${doneAll ? ic("check") : isOpen ? order.indexOf(lid) + 1 : ic("lock")}</span>
        <div class="card step-card lesson-row"><div class="lesson-icon">${esc(L.icon)}</div>
          <div class="lesson-body"><div class="lesson-title">${esc(parts[0].lessonName)}: ${esc(L.title)}</div>
            <div class="part-chips">${parts.map(chip).join("")}${R ? (doneAll ? `<a class="part-chip read" href="#/read/${R.id}">${ic("read")}Bài đọc</a>` : `<span class="part-chip locked" title="Mở khi xong bài">${ic("read")}Bài đọc</span>`) : ""}</div></div>
          ${doneAll ? `<span class="pill green">Xong</span>` : isCur ? `<span class="pill primary">Học tiếp</span>` : ""}</div></li>`;
    };
    const reviewRow = (x) => {
      const k = pos.get(x.id), done = isDone(x.id), op = unlocked(st, k), b = best(x.id), isC = cur && cur.i === k;
      return `<li class="step ${done ? "done" : op ? "open" : "locked"} ${isC ? "current" : ""}">
        <span class="step-dot" aria-hidden="true">${done ? ic("check") : op ? ic("repeat") : ic("lock")}</span>
        ${op ? `<a class="card step-card" href="#/step/${x.id}">` : `<div class="card step-card" aria-disabled="true">`}
          <div class="lesson-icon">${esc(x.icon)}</div>
          <div class="lesson-body"><div class="lesson-title">${esc(x.title)}</div><div class="lesson-meta">${ic("clock")} ${x.min} phút · ${x.n} câu ôn ${x.lessons.length} bài của chặng${b != null ? ` · điểm cao nhất ${b}%` : ""}${!op ? " · mở khi xong các phần của chặng" : ""}</div></div>
          ${done ? `<span class="pill green">Xong</span>` : isC ? `<span class="pill primary">Học tiếp</span>` : ""}
        ${op ? `</a>` : `</div>`}</li>`;
    };
    const rows = (ids) => {
      const seen = new Set();
      return ids.map((id) => {
        const x = idx().step.get(id);
        if (x.kind === "review") return reviewRow(x);
        if (seen.has(x.lesson)) return "";
        seen.add(x.lesson);
        return lessonRow(x.lesson);
      }).join("");
    };
    const sp = window.EXAM_SPEC && EXAM_SPEC[st.test.exam];
    const tOpen = open && testOpen(st), tDone = isDone(st.test.id), tb = best(st.test.id);
    const testRow = `<li class="step ${tDone ? "done" : tOpen ? "open" : "locked"} ${cur && cur.i === st.steps.length ? "current" : ""}">
        <span class="step-dot" aria-hidden="true">${tDone ? ic("check") : tOpen ? ic("trophy") : ic("lock")}</span>
        ${tOpen ? `<a class="card step-card test" href="#/step/${st.test.id}">` : `<div class="card step-card test" aria-disabled="true">`}
          <div class="lesson-icon">${ic("exam")}</div>
          <div class="lesson-body"><div class="lesson-title">${esc(st.test.title)}</div><div class="lesson-meta">${sp ? `${ic("clock")} ${sp.minutes} phút · đề ${esc(sp.name)} ${sp.questions} câu` : ""} · đạt từ ${PASS}%${tb != null ? ` · điểm cao nhất ${tb}%` : ""}${!tOpen ? " · mở khi xong mọi phần" : ""}</div></div>
          ${tDone ? `<span class="pill green">Đạt</span>` : ""}
        ${tOpen ? `</a>` : `</div>`}</li>`;
    let list;
    if (st.chang.length) {
      const curId = cur && cur.i < st.steps.length ? st.steps[cur.i].id : null;
      const openNo = curId ? (st.chang.find((c) => c.steps.includes(curId)) || {}).no : d ? 0 : 1;
      list = st.chang.map((c) => {
        const dn = c.steps.filter((id) => isDone(id)).length;
        return `<details class="chang card" ${c.no === openNo ? "open" : ""}><summary><span class="chang-head"><b>${esc(c.name)}</b><span class="small muted">${esc(c.label)} · ${c.lessons.length} bài</span></span>
          ${dn === c.steps.length ? `<span class="pill green">Xong</span>` : `<span class="small muted">${dn}/${c.steps.length}</span>`}${ic("next", "chang-ic")}</summary>
          <ol class="steps">${rows(c.steps)}</ol></details>`;
      }).join("") + `<ol class="steps mt">${testRow}</ol>`;
    } else {
      // Giai đoạn 1–3 không chia chặng: các phần Bù HSK 3.0 (không bắt buộc) thành một khối riêng sau bài HSK 2.0, trước kiểm tra tổng hợp
      const bd = bridge.filter((x) => isDone(x.id)).length;
      const bridgeBlock = bridge.length ? `<h2>Bù HSK 3.0 <span class="muted small">${st.bridge.length} bài bổ sung · ${bd === bridge.length ? "xong" : `${bd}/${bridge.length} phần`} · không bắt buộc</span></h2>
        <p class="small muted">Từ và ngữ pháp HSK 3.0 cấp ${st.level} chưa có trong các bài HSK 2.0 cùng cấp; nên học trước kỳ thi HSK 3.0 (từ 13/12/2026). Không cần xong các phần này để mở kiểm tra tổng hợp.</p>
        <ol class="steps">${rows(bridge.map((x) => x.id))}</ol>` : "";
      list = `<ol class="steps">${rows(req(st).map((x) => x.id))}</ol>${bridgeBlock}<ol class="steps mt">${testRow}</ol>`;
    }
    const html = `<a href="#/start" class="backlink">${ic("back")} Bắt đầu học</a>
      <div class="eyebrow">${esc(st.name)} · ${esc(st.std)}</div><h1>${esc(st.title)}</h1>
      <p class="subtitle">${esc(st.sub)} Chia thành ${nParts} phần nhỏ 15–30 phút${nRev ? `, ${nRev} bài ôn chặng` : ""} và một bài kiểm tra tổng hợp dạng đề HSK${nBridge ? `; thêm ${nBridge} phần Bù HSK 3.0 không bắt buộc` : ""}, dự kiến ${esc(st.time)}.</p>
      ${!open ? `<div class="warn">${ic("lock")} Giai đoạn này chưa mở. Đạt từ ${PASS}% <a href="#/path/${st.id - 1}">kiểm tra tổng hợp Giai đoạn ${st.id - 1}</a> hoặc làm <a href="#/start/test">kiểm tra đầu vào</a> để mở. Vẫn xem được bài gốc ở <a href="#/lessons/${st.level}">Bài học HSK ${st.level}</a>.</div>` : ""}
      <div class="card mb"><div class="row between small"><b>Tiến độ giai đoạn</b><span>${d}/${total}</span></div><div class="progress green mt"><span style="width:${(d / total) * 100}%"></span></div>
        ${cur ? `<a class="btn btn-sm mt" href="${cur.href}">${ic("play")} Tiếp tục: ${esc(cur.i < st.steps.length ? stepName(st.steps[cur.i], cur.i) : "Kiểm tra tổng hợp")}</a>` : ""}</div>
      ${due ? `<div class="tip">${ic("repeat")} Có <b>${due}</b> thẻ từ vựng đến hạn ôn. Ôn trước khi học bài mới để nhớ lâu hơn. <a href="#/review">Ôn ngay</a></div>` : ""}
      ${list}`;
    return { html };
  }

  // ---------- Giai đoạn 1–6: một phần nhỏ của bài HSK ----------
  function resultCard(box, r, pct, c, n, text, nextBtn, again, backHref) {
    box.innerHTML = `<div class="card center"><div class="result-ic ${r.pass ? "ok" : ""}">${ic(r.pass ? "trophy" : "repeat")}</div><h2 style="margin:6px 0">${pct}% · ${c}/${n} câu đúng</h2>
      <p class="muted">${r.pass ? text : `Cần đạt ${PASS}% để mở bài sau. Xem lại phần Học hoặc Luyện tập rồi thử lại.`}</p>
      <div class="row center"><button class="btn" id="again">Làm lại</button>${r.pass ? nextBtn : `<a class="btn btn-primary" href="${backHref}">Xem lại bài</a>`}</div></div>`;
    box.querySelector("#again").onclick = again;
  }
  const nextBtnOf = (st, i) => {
    const nx = st.steps[i + 1];
    return nx ? `<a class="btn btn-primary" href="#/step/${nx.id}">${esc(stepName(nx, i + 1))} ${ic("next")}</a>` : `<a class="btn btn-primary" href="#/step/${st.test.id}">Làm kiểm tra tổng hợp ${ic("next")}</a>`;
  };

  function partStep(st, i, x, tab) {
    const L = lessonOf(x.lesson), words = x.words.map(wordById).filter(Boolean), parts = idx().parts.get(x.lesson);
    const tabs = [["learn", "Học"], ["practice", "Luyện tập"], ["quiz", "Kiểm tra nhanh"]];
    if (!tabs.some((t) => t[0] === tab)) tab = "learn";
    const done = isDone(x.id), lessonDone = parts.every((p) => isDone(p.id));
    const R = x.reading && READINGS.find((r) => r.id === x.reading);
    let body = "";
    if (tab === "learn") {
      body = `<p class="small muted">${esc(x.lessonName)} chia ${x.of} phần; phần này có ${words.length} từ${x.grammar.length ? `, ${x.grammar.length} điểm ngữ pháp` : ""}${x.dialogue ? ", hội thoại và câu mẫu của bài" : ""}. Bài gốc đầy đủ: <a href="#/lesson/${L.id}">${esc(x.lessonName)}</a>.</p>
        <h2>Từ vựng</h2><div class="row between mb"><span class="small muted">Qua Kiểm tra nhanh thì các từ này vào bộ thẻ ôn tập và bộ thẻ luyện viết.</span><button class="btn btn-sm" id="play-all">${ic("volume")} Nghe tất cả</button></div>${wordsTable(words)}
        ${x.grammar.length ? `<h2>Ngữ pháp</h2>${x.grammar.map((k) => { const g = L.grammar[k]; return `<div class="grammar"><div class="pattern">${esc(g.pattern)}</div><div class="small">${esc(g.vi)}</div><div class="ex">${sentenceHtml(g.ex[0], g.ex[1], g.ex[2])}</div></div>`; }).join("")}` : ""}
        ${x.tips && L.tips ? `<div class="tip"><b>Mẹo cho người Việt:</b> ${esc(L.tips)}</div>` : ""}
        ${x.dialogue ? `<h2>Hội thoại</h2><div class="row mb"><button class="btn btn-sm" id="play-dialog">${ic("play")} Nghe cả đoạn</button><button class="btn btn-sm" id="toggle-vi">Ẩn/hiện dịch</button></div><div id="dialog">${L.dialogue.map((dl) => sentenceHtml(dl[1], dl[2], dl[3], dl[0])).join("")}</div>` : ""}
        ${x.sentences.length ? `<h2>Câu mẫu</h2>${x.sentences.map((k) => { const s = L.sentences[k]; return sentenceHtml(s[0].replace(/ /g, ""), s[1], s[2]); }).join("")}` : ""}
        ${R ? `<h2>Bài đọc</h2>${lessonDone ? `<a class="card lesson-card" href="#/read/${R.id}"><div class="lesson-icon">${ic("read")}</div><div class="lesson-body"><div class="lesson-title">${esc(R.title)}</div><div class="lesson-meta">Đã mở · đoạn văn chỉ dùng từ đã học, kèm 3 câu hỏi</div></div></a>`
          : `<div class="card lesson-card" aria-disabled="true"><div class="lesson-icon">${ic("lock")}</div><div class="lesson-body"><div class="lesson-title">${esc(R.title)}</div><div class="lesson-meta">Mở khi bạn qua Kiểm tra nhanh của phần này (xong cả bài)</div></div></div>`}` : ""}`;
    } else if (tab === "practice") {
      body = `<h3>Luyện nhanh trong phần</h3><p class="small muted">Các từ của phần này với dạng câu khác Kiểm tra nhanh; làm bao nhiêu lần cũng được, không tính điểm.</p><div id="pq"></div>
        <h3>Luyện thêm bằng công cụ có sẵn</h3><p class="small muted">Mở công cụ với ${x.h3 ? `HSK 3.0 cấp ${st.level}` : `cấp HSK ${st.level}`} chọn sẵn; công cụ dùng từ và câu của cả cấp.</p>
        <div class="grid grid-2">${((x.h3 && st.bridgePractice) || st.practice).map((p) => `<a class="card lesson-card" href="${p.href}" data-plevel="${st.level}" data-pstd="${p.std || "hsk2"}"><div class="lesson-icon">${ic("target")}</div><div class="lesson-body"><div class="lesson-title">${esc(p.label)}</div><div class="lesson-meta">${esc(p.desc)}</div></div></a>`).join("")}
          <a class="card lesson-card" href="#/lesson/${L.id}/quiz"><div class="lesson-icon">${esc(L.icon)}</div><div class="lesson-body"><div class="lesson-title">Luyện tập bài gốc</div><div class="lesson-meta">Bài luyện cuối ${esc(x.lessonName)} (cả bài)</div></div></a></div>`;
    } else {
      body = `<p class="small muted">${x.quiz.length} câu. Đạt từ ${PASS}% để hoàn thành phần này${i + 1 < st.steps.length ? ` và mở ${esc(stepName(st.steps[i + 1], i + 1))}` : " và mở bài kiểm tra tổng hợp"}. Phím tắt: 1–4 chọn, Enter kiểm tra / sang câu, Space nghe lại.</p><div id="quiz"></div>`;
    }
    const ti = tabs.findIndex((t) => t[0] === tab), nextTab = tabs[ti + 1], prevTab = tabs[ti - 1];
    const html = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)} · ${esc(st.title)}</a>
      <div class="eyebrow">${esc(x.label)} · khoảng ${x.min} phút${done ? ` · Đã hoàn thành${best(x.id) != null ? ` (${best(x.id)}%)` : ""}` : ""}</div>
      <h1>${esc(x.title)} <span class="zh-serif muted" style="font-weight:500">${esc(x.icon)}</span></h1>
      <div class="card mb"><b>Mục tiêu:</b> ${L.goals.map((g) => `<span class="pill blue">${esc(g)}</span>`).join(" ")}</div>
      <div class="tabs">${tabs.map(([k, v]) => `<button class="${k === tab ? "active" : ""}" data-tab="${k}">${v}</button>`).join("")}</div>
      <div class="step-body">${body}</div>
      ${tab === "quiz" ? "" : `<div class="lesson-nav">${prevTab ? `<a class="btn" href="#/step/${x.id}/${prevTab[0]}">${ic("back")} ${prevTab[1]}</a>` : `<a class="btn" href="#/path/${st.id}">${ic("back")} Danh sách bài</a>`}<a class="btn btn-primary" href="#/step/${x.id}/${nextTab[0]}">Tiếp: ${nextTab[1]} ${ic("next")}</a></div>`}`;
    return {
      html,
      after(el) {
        el.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => (location.hash = `#/step/${x.id}/${b.dataset.tab}`)));
        bindSpeak(el);
        const pa = el.querySelector("#play-all");
        if (pa) pa.onclick = () => { let k = 0; const go = () => { if (k < words.length) TTS.speak(words[k++].hz, { onend: () => setTimeout(go, 400) }); }; go(); };
        const pd = el.querySelector("#play-dialog");
        if (pd) pd.onclick = () => { let k = 0; const go = () => { if (k < L.dialogue.length) TTS.speak(L.dialogue[k++][1], { onend: () => setTimeout(go, 500) }); }; go(); };
        const tv = el.querySelector("#toggle-vi");
        if (tv) tv.onclick = () => el.querySelectorAll("#dialog .vi, #dialog .py").forEach((y) => y.classList.toggle("hidden"));
        // công cụ luyện tập: chọn sẵn cấp HSK của giai đoạn (giữ các lựa chọn khác của lần trước)
        el.querySelectorAll("[data-plevel]").forEach((a) => a.addEventListener("click", () => {
          const s = Store.state; s.practice = s.practice || { history: [], best: {} }; s.practice.last = s.practice.last || {};
          const std = a.dataset.pstd || "hsk2";
          s.practice.last[std] = Object.assign({}, s.practice.last[std], { level: +a.dataset.plevel }); Store.save();
        }));
        if (tab === "practice") runQuiz(el.querySelector("#pq"), shuffle(x.drill).map((q) => expand(q, x, st)), { mode: "practice" });
        if (tab === "quiz") {
          const box = el.querySelector("#quiz");
          const go = () => runQuiz(box, shuffle(x.quiz).map((q) => expand(q, x, st)), {
            onFinish(pct, c, n) {
              const r = saveResult(x.id, pct, false, words);
              const lessonNow = r.lessonNow, nx = st.steps[i + 1];
              resultCard(box, r, pct, c, n,
                `Bạn đã hoàn thành ${esc(x.label)}.${r.added ? ` ${r.added} từ mới đã vào bộ thẻ ôn tập và bộ thẻ luyện viết.` : ""}${lessonNow ? ` ${esc(x.lessonName)} được đánh dấu hoàn thành.` : ""}${R && r.pass && Store.state.completedLessons.includes(L.id) ? ` Bài đọc «${esc(R.title)}» đã mở.` : ""} ${nx ? `${esc(stepName(nx, i + 1))} đã mở.` : "Bài kiểm tra tổng hợp đã mở."}`,
                (R ? `<a class="btn" href="#/read/${R.id}">${ic("read")} Bài đọc</a>` : "") + nextBtnOf(st, i), go, `#/step/${x.id}/learn`);
            },
          });
          go();
        }
      },
    };
  }

  // ---------- Giai đoạn 4–6: bài ôn cuối chặng ----------
  function reviewStep(st, i, x) {
    const pool = x.parts.flatMap((pid) => idx().step.get(pid).quiz);
    const html = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)} · ${esc(st.title)}</a>
      <div class="eyebrow">${esc(st.name)} · khoảng ${x.min} phút${isDone(x.id) ? ` · Đã hoàn thành (${best(x.id)}%)` : ""}</div><h1>${esc(x.title)}</h1>
      <p class="subtitle">${x.n} câu lấy ngẫu nhiên từ ${x.lessons.length} bài của chặng (${esc(x.label.replace(/^[^·]+· /, ""))}): nghĩa từ, chọn chữ, nghe và sắp xếp câu. Đạt từ ${PASS}% để mở chặng tiếp theo; mỗi lần làm là một đề khác.</p>
      <div id="quiz"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#quiz");
        const go = () => runQuiz(box, shuffle(pool).slice(0, x.n).map((q) => expand(q, x, st)), {
          onFinish(pct, c, n) {
            const r = saveResult(x.id, pct, false);
            resultCard(box, r, pct, c, n, `Bạn đã ôn xong ${esc(x.title)}.${st.steps[i + 1] ? ` ${esc(stepName(st.steps[i + 1], i + 1))} đã mở.` : " Bài kiểm tra tổng hợp đã mở."}`, nextBtnOf(st, i), go, `#/path/${st.id}`);
          },
        });
        go();
      },
    };
  }

  // ---------- Giai đoạn 1–6: kiểm tra tổng hợp bằng đề thi thử HSK 2.0 (js/exam.js) ----------
  function examTest(st) {
    const lv = st.test.exam, sp = EXAM_SPEC[lv], back = `<a href="#/path/${st.id}" class="backlink">${ic("back")} ${esc(st.name)} · ${esc(st.title)}</a>`;
    if (!testOpen(st)) return { html: `${back}<div class="card center empty"><div class="big-ic">${ic("lock")}</div><h2>Chưa mở</h2><p class="muted">Hoàn thành mọi phần của ${esc(st.name)} để làm bài kiểm tra tổng hợp.</p><a class="btn btn-primary" href="#/path/${st.id}">Về danh sách bài</a></div>` };
    const hist = examsOf(lv).slice().reverse().slice(0, 8), done = isDone(st.test.id), nextSt = STAGES.find((s) => s.id === st.id + 1);
    const need = Math.ceil((sp.total * PASS) / 100);
    const html = `${back}<div class="eyebrow">${esc(st.name)} · ${sp.minutes} phút</div><h1>${esc(st.test.title)}</h1>
      <p class="subtitle">Một đề ${esc(sp.name)} sinh ngẫu nhiên theo đúng cấu trúc đề chính thức: ${sp.questions} câu, ${sp.minutes} phút, gồm ${sp.sections.map((s) => `${s.vi.toLowerCase()} ${s.parts.reduce((a, p) => a + p.n, 0)} câu`).join(", ")}. Đạt từ ${PASS}% tổng điểm (${need}/${sp.total}) để hoàn thành giai đoạn${nextSt ? ` và mở ${esc(nextSt.name)}` : ""}; mốc đậu của đề thật là ${sp.pass}/${sp.total}. Kết quả lưu vào lịch sử thi thử.</p>
      ${done ? `<div class="tip">${ic("trophy")} Bạn đã đạt bài kiểm tra này (cao nhất ${best(st.test.id)}%).${nextSt ? ` <a href="#/path/${nextSt.id}">Vào ${esc(nextSt.name)} · ${esc(nextSt.title)}</a>` : ""}</div>` : ""}
      <div class="row mt"><a class="btn btn-primary btn-lg" href="#/exam/${lv}">${ic("exam")} Vào thi ${esc(sp.name)}</a><a class="btn btn-lg" href="#/path/${st.id}">Về danh sách bài</a></div>
      <div class="card mt"><h3 style="margin-top:0">Các lần thi ${esc(sp.name)}</h3>${hist.length ? `<table class="vocab-table"><thead><tr><th>Ngày</th><th>Điểm</th><th>Tỉ lệ</th><th></th></tr></thead><tbody>${hist.map((h) => `<tr><td>${esc(h.date)}</td><td><b>${h.total}</b>/${h.max}</td><td>${examPct(h)}%</td><td>${examPct(h) >= PASS ? `<span class="pill green">Đạt lộ trình</span>` : `<span class="pill">Chưa đạt</span>`}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">Chưa có lần thi nào.</p>`}</div>`;
    return { html };
  }
  // Ghi chú trên trang kết quả thi thử (views-exam.js) cho người đang học theo lộ trình
  function examNote(level, r) {
    const st = STAGES.find((s) => s.test.exam === level);
    if (!st || !started()) return "";
    const pct = r.max ? Math.round((r.total / r.max) * 100) : 0, nextSt = STAGES.find((s) => s.id === st.id + 1);
    return `<div class="tip mt" style="text-align:left">${ic("map")} <b>Lộ trình · ${esc(st.name)}:</b> ${pct}% tổng điểm. ${pct >= PASS ? `Đã đạt kiểm tra tổng hợp${nextSt ? `, ${esc(nextSt.name)} đã mở. <a href="#/path/${nextSt.id}">Vào ${esc(nextSt.name)}</a>` : "."}` : isDone(st.test.id) ? `Bạn đã đạt bài kiểm tra này ở lần thi trước. <a href="#/path/${st.id}">Về ${esc(st.name)}</a>` : `Cần ${PASS}% để hoàn thành giai đoạn. <a href="#/path/${st.id}">Về ${esc(st.name)}</a>`}</div>`;
  }

  // ---------- Kiểm tra đầu vào (tùy chọn) ----------
  // Phần 1: 8 câu nghe pinyin/thanh điệu. Sau đó mỗi cấp HSK 6 câu từ vựng, lên dần từ HSK 1; đạt từ 70% mới sang cấp tiếp.
  function placement() {
    const st = STAGES[0], PER = 6;
    const pool = st.steps.flatMap((x) => x.quiz.filter((q) => q.t === "tone" || q.t === "listen").map((q) => ({ q, x })));
    const a = shuffle(pool).slice(0, 8).map((o) => expand(o.q, o.x, st));
    const levels = STAGES.filter((s) => s.id > 0);
    const wordQ = (s) => shuffle(s.lessons.flatMap((l) => idx().lw.get(l) || [])).slice(0, PER).map((w) => expand({ t: "mean", id: w.id }, null, s));
    const html = `<a href="#/start" class="backlink">${ic("back")} Bắt đầu học</a><h1>Kiểm tra đầu vào</h1>
      <p class="subtitle">Khoảng 5–15 phút: 8 câu nghe pinyin và thanh điệu, sau đó mỗi cấp HSK ${PER} câu từ vựng, lên dần từ HSK 1. Đúng từ ${PASS}% thì sang cấp tiếp theo, chưa đạt thì dừng. Không biết thì cứ đoán, kết quả chỉ để gợi ý chỗ bắt đầu.</p><div id="quiz"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#quiz"), res = [];
        let pa = 0;
        runQuiz(box, a, { sections: [{ name: "Phần 1 · Pinyin và thanh điệu", from: 0, to: a.length }], onFinish(pct) { pa = pct; round(0); } });
        function round(k) {
          if (k >= levels.length) return show();
          const s = levels[k], items = wordQ(s);
          runQuiz(box, items, {
            sections: [{ name: `Phần ${k + 2} · Từ vựng HSK ${s.level}`, from: 0, to: items.length }],
            onFinish(pct) { res.push({ s, pct }); if (pct >= PASS) round(k + 1); else show(); },
          });
        }
        function show() {
          let passed = 0; for (const x of res) { if (x.pct >= PASS) passed = x.s.id; else break; }
          const skip = pa >= PASS, target = skip ? Math.min(passed + 1, levels[levels.length - 1].id) : 0, tg = STAGES.find((s) => s.id === target);
          box.innerHTML = `<div class="card"><h2 style="margin-top:0">Kết quả: pinyin ${pa}%${res.map((x) => ` · HSK ${x.s.level} ${x.pct}%`).join("")}</h2>
            <p>${!skip ? `Nên học <b>Giai đoạn 0 · Nhập môn</b> trước: chỉ 1–2 tuần nhưng giúp bạn phát âm đúng ngay từ đầu.${passed ? ` Bạn đã biết khá nhiều từ đến HSK ${passed}: khi qua Nhập môn, làm lại kiểm tra này để được xếp lên.` : ""}`
              : target === 1 ? `Bạn đã nghe và đọc pinyin khá chắc. Bạn có thể <b>bỏ qua Giai đoạn 0</b> và bắt đầu từ HSK 1; các bài Nhập môn vẫn mở để xem lại khi cần.`
              : `Bạn đã nắm pinyin và từ vựng đến HSK ${passed}. Bạn có thể bắt đầu từ <b>${esc(tg.name)} · ${esc(tg.title)}</b>; các giai đoạn trước vẫn mở để xem lại, từ của chúng không tự vào bộ thẻ.`}</p>
            <div class="row">${skip ? `<button class="btn btn-primary" id="place">${target === 1 ? "Bỏ qua Nhập môn, vào HSK 1" : `Vào ${esc(tg.name)} · ${esc(tg.title)}`}</button><a class="btn" href="#/path/0">Vẫn học từ Nhập môn</a>` : `<a class="btn btn-primary" href="#/step/s0-1">Bắt đầu Bài 1</a>`}</div></div>`;
          const pl = box.querySelector("#place");
          if (pl) pl.onclick = () => { ps().placed = Math.max(ps().placed || 0, target); Store.save(); location.hash = `#/path/${target}`; };
        }
      },
    };
  }

  // ---------- Thẻ trên trang chủ ----------
  function homeCard() {
    const n = next();
    if (!n) return "";
    const st = n.stage, d = doneCount(st), total = totalOf(st);
    return `<a class="card lesson-card path-home" href="${n.href}"><div class="lesson-icon">${ic("map")}</div><div class="lesson-body"><div class="lesson-title">Lộ trình · ${esc(st.name)} ${esc(st.title)}</div>
      <div class="lesson-meta">Tiếp theo: ${esc(n.label.replace(/^[^·]+· /, ""))}</div><div class="progress green mt"><span style="width:${(d / total) * 100}%"></span></div></div><span class="pill">${d}/${total}</span></a>`;
  }

  window.Path = { bridge: true, start, stage, step, next, started, homeCard, syllableTable, markTone, examNote, isDone, unlocked, stageOpen, expand, saveResult };
})();
