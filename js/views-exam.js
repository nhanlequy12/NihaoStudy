// Màn hình thi thử HSK: chọn cấp → hướng dẫn → làm bài theo từng phần có đồng hồ → kết quả và xem lại.
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LET = Exam.LETTERS;
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  let current = null; // bài thi đang làm, giữ trong bộ nhớ để quay lại được

  // Nguồn đề mẫu thật (bản quyền của Hanban/CTI, không sao chép vào web)
  const SOURCES = [
    { name: "Chinese Testing International (chinesetest.cn)", url: "https://www.chinesetest.cn/HSK", vi: "Trang chính thức: giới thiệu cấu trúc từng cấp và đề mẫu (样卷) kèm audio để tải." },
    { name: "Mandarin Bean – HSK online test", url: "https://mandarinbean.com/hsk-chinese-test-online/", vi: "Làm đề mẫu HSK 1–6 trực tuyến, có audio." },
    { name: "Mandarin Temple – Mock tests", url: "https://mandarintemple.com/learning-materials/mock-tests", vi: "12 đề HSK 1 miễn phí, mỗi đề 40 câu / 40 phút." },
    { name: "YouTube: nghe đề thật", url: "https://www.youtube.com/results?search_query=HSK+listening+test+%E5%90%AC%E5%8A%9B", vi: "Tìm 'HSK 1 听力' hoặc 'HSK 2 listening test' để luyện với băng ghi âm thật." },
  ];

  function exam(levelArg) {
    if (levelArg && EXAM_SPEC[levelArg]) return runner(+levelArg);
    return chooser();
  }

  // ---------- Chọn cấp ----------
  function chooser() {
    const hist = (Store.state.exams || []).slice().reverse().slice(0, 12);
    const html = `<h1>Thi thử HSK</h1>
      <p class="subtitle">Đề được sinh ngẫu nhiên từ kho từ, câu mẫu, hội thoại và bài đọc của web theo đúng cấu trúc, số câu, thời gian và thang điểm của đề thi chính thức (bộ cũ, 2010–nay). Mỗi lần thi là một đề mới. Vì web không có tranh, các phần "nhìn tranh" được thay bằng nghĩa tiếng Việt; phần nghe dùng giọng đọc của trình duyệt.</p>
      <div class="grid grid-2">${Object.values(EXAM_SPEC).map((sp, k) => `
        <div class="card"><div class="row between"><h3 style="margin:0">${esc(sp.name)}</h3><span class="pill ${["blue", "gold", "green", "red", "purple"][k]}">${sp.questions} câu · ${sp.minutes} phút</span></div>
          <ul class="small muted" style="margin:8px 0 10px;padding-left:18px">${sp.sections.map((s) => `<li><b>${esc(s.name)}</b> ${esc(s.vi)} · ${s.parts.reduce((a, p) => a + p.n, 0)} câu · ${s.minutes} phút</li>`).join("")}</ul>
          <div class="row between"><span class="small muted">Tổng ${sp.total} điểm · đậu từ ${sp.pass}</span><a class="btn btn-primary" href="#/exam/${k + 1}">${current && current.level === k + 1 && !current.finished ? "Tiếp tục bài đang làm" : "Vào thi"}</a></div></div>`).join("")}</div>
      <div class="grid grid-2 mt">
        <div class="card"><h3 style="margin-top:0">Lịch sử thi</h3>${hist.length ? `<table class="vocab-table"><thead><tr><th>Ngày</th><th>Cấp</th><th>Nghe</th><th>Đọc</th><th>Viết</th><th>Tổng</th><th></th></tr></thead><tbody>${hist.map((h) => `<tr><td>${esc(h.date)}</td><td>HSK ${h.level}</td>${["listening", "reading", "writing"].map((k) => { const s = h.sections.find((x) => x.key === k); return `<td>${s ? s.score : "–"}</td>`; }).join("")}<td><b>${h.total}</b>/${h.max}</td><td>${h.pass ? `<span class="pill green">Đậu</span>` : `<span class="pill">Chưa đậu</span>`}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">Chưa có lần thi nào. Nên thi thử sau khi học xong một cấp để biết mình còn yếu phần nào.</p>`}</div>
        <div class="card"><h3 style="margin-top:0">Đề thật để luyện thêm</h3><p class="small muted">Đề thi HSK là tài liệu có bản quyền nên web không sao chép; hãy luyện trực tiếp ở các nguồn sau:</p>
          <ul class="small" style="padding-left:18px">${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a> – ${esc(s.vi)}</li>`).join("")}</ul></div>
      </div>`;
    return { html };
  }

  // ---------- Bài thi ----------
  function runner(level) {
    const html = `<a href="#/exam" class="small">← Chọn cấp khác</a><div id="ex" class="mt"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#ex");
        if (current && current.level === level && !current.finished) { render(box); startTimer(box); }
        else if (current && current.level === level && current.finished) results(box);
        else intro(box, level);
      },
    };
  }

  function intro(box, level) {
    const sp = EXAM_SPEC[level];
    const hasVoice = TTS.voices.length > 0;
    box.innerHTML = `<div class="eyebrow">Thi thử</div><h1>${esc(sp.name)} · ${sp.questions} câu · ${sp.minutes} phút</h1>
      <div class="card"><h3 style="margin-top:0">Cấu trúc đề</h3>
        <table class="vocab-table"><thead><tr><th>Phần</th><th>Nội dung</th><th>Số câu</th><th>Thời gian</th></tr></thead><tbody>
        ${sp.sections.flatMap((s) => s.parts.map((p, i) => `<tr>${i === 0 ? `<td rowspan="${s.parts.length}"><b>${esc(s.name)}</b><br><span class="small muted">${esc(s.vi)}</span></td>` : ""}<td><b>${esc(p.name)}</b> <span class="small muted">${esc(p.vi)}</span></td><td>${p.n}</td>${i === 0 ? `<td rowspan="${s.parts.length}">${s.minutes} phút</td>` : ""}</tr>`)).join("")}
        </tbody></table></div>
      <div class="card mt"><h3 style="margin-top:0">Quy định như thi thật</h3><ul class="small" style="padding-left:18px;margin:0">
        <li>Mỗi câu nghe được phát <b>${sp.plays} lần</b>${sp.plays === 1 ? " (HSK 4–5 chỉ phát một lần)" : ""}; bấm ▶ để phát, hết lượt thì không nghe lại được.</li>
        <li>Mỗi phần có đồng hồ riêng; hết giờ máy tự nộp phần đó. Nộp phần rồi thì không quay lại được.</li>
        <li>Trong lúc làm có thể chuyển qua lại giữa các câu trong cùng một phần.</li>
        <li>Mỗi phần tính thang 100 điểm theo tỉ lệ câu đúng (đề thật quy đổi gần tương tự). Tổng ${sp.total}, đậu từ ${sp.pass} điểm.</li>
        <li>Không có pinyin, không có bản dịch trong lúc thi, giống đề thật.</li></ul>
        ${hasVoice ? "" : `<div class="warn mt"><b>Chưa tìm thấy giọng tiếng Trung</b> trong trình duyệt, phần nghe sẽ không có tiếng. Xem mục Cài đặt để thêm giọng (hoặc mở bằng Microsoft Edge).</div>`}</div>
      <div class="row mt" style="justify-content:center"><button class="btn btn-primary btn-lg" id="start">Bắt đầu thi ${esc(sp.name)}</button></div>`;
    box.querySelector("#start").onclick = () => {
      current = { level, exam: Exam.generate(level), si: 0, qi: 0, finished: false, startedAt: Date.now(), timerId: null, deadline: 0, seq: 0 };
      current.deadline = Date.now() + current.exam.sections[0].minutes * 60000;
      render(box); startTimer(box);
    };
  }

  function startTimer(box) {
    clearInterval(current.timerId);
    current.timerId = setInterval(() => {
      const t = box.querySelector("#timer");
      if (!t) { clearInterval(current.timerId); return; }
      const left = current.deadline - Date.now();
      t.textContent = mmss(left);
      t.classList.toggle("danger", left < 60000);
      if (left <= 0) { toast("Hết giờ phần này, máy tự nộp."); submitSection(box, true); }
    }, 1000);
  }

  // Phát chuỗi câu nghe, cách nhau 600 ms
  function playSeq(texts, it, box) {
    const seq = ++current.seq;
    speechSynthesis && speechSynthesis.cancel();
    let i = 0;
    const go = () => {
      if (seq !== current.seq || i >= texts.length) { if (seq === current.seq) updatePlayBtn(box, it); return; }
      TTS.speak(texts[i++], { onend: () => setTimeout(go, 600) });
    };
    go();
  }
  function updatePlayBtn(box, it) {
    const b = box.querySelector("#play"); if (!b) return;
    b.disabled = it.playsLeft <= 0;
    b.textContent = it.playsLeft > 0 ? `▶ Nghe (còn ${it.playsLeft} lần)` : "Đã hết lượt nghe";
  }

  function render(box) {
    const { exam, si, qi } = current;
    const sec = exam.sections[si];
    const it = sec.items[qi];
    const sp = exam.spec;
    const total = exam.sections.flatMap((s) => s.items).length;
    const answered = (x) => x.user != null && x.user !== "";
    let body = "";
    const grp = it.group;
    if (grp && grp.passage) body += `<div class="passage zh-serif"><div class="small muted" style="font-family:var(--font)">Đọc đoạn văn rồi trả lời câu ${grp.items[0].no}–${grp.items[grp.items.length - 1].no}</div>${esc(grp.passage)}</div>`;
    if (grp && grp.pool) body += `<div class="pool-box"><div class="small muted">Chọn một đáp án cho mỗi câu ${grp.items[0].no}–${grp.items[grp.items.length - 1].no} (có một đáp án thừa):</div>${grp.pool.map((p, k) => `<div class="${grp.poolZh ? "zh" : ""}"><b>${LET[k]}.</b> ${esc(p)}</div>`).join("")}</div>`;
    if (it.listening) body += `<div class="center mb"><button class="btn btn-primary btn-lg" id="play">▶ Nghe</button><div class="small muted mt">Nội dung phát: ${it.audio.length} câu</div></div>`;
    if (it.stem) body += `<div class="exam-stem ${it.kind === "choice" && it.type.startsWith("l_") ? "" : "zh"}">${esc(it.stem)}</div>`;
    if (it.sub) body += `<div class="center muted" style="margin:-4px 0 12px">${esc(it.sub)}</div>`;

    if (it.kind === "tf") body += `<div class="options tf-btns"><button class="option ${it.user === true ? "sel" : ""}" data-tf="1">✓ Đúng</button><button class="option ${it.user === false ? "sel" : ""}" data-tf="0">✗ Sai</button></div>`;
    else if (it.kind === "choice") body += `<div class="options one-col">${it.options.map((o, k) => `<button class="option ${it.zhOptions ? "zh" : "vi-text"} ${it.user === k ? "sel" : ""}" data-k="${k}"><b>${LET[k]}.</b> ${esc(o)}</button>`).join("")}</div>`;
    else if (it.kind === "pool") body += `<div class="options pool-letters">${grp.pool.map((_, k) => `<button class="option ${it.user === k ? "sel" : ""}" data-k="${k}">${LET[k]}</button>`).join("")}</div>`;
    else if (it.kind === "order") {
      const chosen = it.user ? it.user.split(" ") : [];
      const isR = it.type === "r_order";
      const label = (t) => (isR ? t[0] : t);
      const left = it.tokens.filter((t) => !chosen.includes(label(t)));
      const chosenTokens = chosen.map((c) => it.tokens.find((t) => label(t) === c));
      body += `<p class="small muted center">Bấm để đưa ${isR ? "câu" : "từ"} lên dòng đáp án theo đúng thứ tự; bấm lại để bỏ xuống.</p>
        <div class="tiles" id="answer">${chosenTokens.map((t) => `<button class="tile ${isR ? "" : "zh"}" data-t="${esc(label(t))}" data-from="answer">${esc(t)}</button>`).join("")}</div>
        <div class="tiles" id="bank">${left.map((t) => `<button class="tile ${isR ? "" : "zh"}" data-t="${esc(label(t))}" data-from="bank">${esc(t)}</button>`).join("")}</div>`;
    } else if (it.kind === "text") {
      body += `<div class="center"><input class="search zh" id="txt" style="max-width:420px;text-align:center" placeholder="${it.free ? "Viết một câu có từ này" : "Gõ chữ Hán"}" value="${esc(it.user || "")}" autocomplete="off"></div>
        ${it.candidates ? `<p class="small muted center" style="margin:8px 0 4px">Không có bàn phím tiếng Trung? Bấm chữ:</p><div class="tiles" style="justify-content:center">${it.candidates.map((c) => `<button class="tile zh" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>` : `<p class="small muted center mt">Máy chỉ kiểm tra câu có chứa từ cho sẵn và đủ dài; đề thật do giám khảo chấm.</p>`}`;
    }

    box.innerHTML = `<div class="exam-top card">
        <div class="row between"><div><span class="pill ${["blue", "gold", "green", "red", "purple"][current.level - 1]}">${esc(sp.name)}</span> <b>${esc(sec.name)}</b> <span class="muted">${esc(sec.vi)}</span></div><div class="timer" id="timer">${mmss(current.deadline - Date.now())}</div></div>
        <div class="row between small muted mt"><span><b>${esc(it.part.name)}</b> · ${esc(it.part.vi)}</span><span>Câu ${it.no}/${total}</span></div>
        <div class="qnav">${sec.items.map((x, k) => `<button class="${k === qi ? "cur" : ""} ${answered(x) ? "done" : ""}" data-q="${k}">${x.no}</button>`).join("")}</div>
      </div>
      <div class="card mt exam-body">${body}</div>
      <div class="row between mt"><button class="btn" id="prev" ${qi === 0 ? "disabled" : ""}>← Câu trước</button>
        <span class="small muted">${sec.items.filter(answered).length}/${sec.items.length} câu đã trả lời</span>
        ${qi + 1 < sec.items.length ? `<button class="btn btn-primary" id="next">Câu tiếp →</button>` : `<button class="btn btn-gold" id="submit">${si + 1 < exam.sections.length ? `Nộp phần ${esc(sec.vi)} →` : "Nộp bài"}</button>`}</div>
      <div class="center mt"><button class="btn btn-sm btn-ghost" id="submit2">Nộp phần này ngay</button></div>`;

    // Sự kiện
    box.querySelectorAll("[data-q]").forEach((b) => b.onclick = () => { current.qi = +b.dataset.q; render(box); });
    const prev = box.querySelector("#prev"); if (prev) prev.onclick = () => { current.qi--; render(box); };
    const next = box.querySelector("#next"); if (next) next.onclick = () => { current.qi++; render(box); };
    box.querySelectorAll("#submit, #submit2").forEach((b) => b.onclick = () => submitSection(box));
    box.querySelectorAll("[data-tf]").forEach((b) => b.onclick = () => { it.user = b.dataset.tf === "1"; render(box); });
    box.querySelectorAll(".options [data-k]").forEach((b) => b.onclick = () => { it.user = +b.dataset.k; render(box); });
    box.querySelectorAll(".tile[data-t]").forEach((b) => b.onclick = () => {
      const chosen = it.user ? it.user.split(" ") : [];
      const t = b.dataset.t;
      it.user = (b.dataset.from === "bank" ? [...chosen, t] : chosen.filter((x) => x !== t)).join(" ") || null;
      render(box);
    });
    const txt = box.querySelector("#txt");
    if (txt) {
      txt.oninput = () => { it.user = txt.value; box.querySelectorAll(".qnav button")[qi].classList.toggle("done", !!txt.value.trim()); };
      box.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { txt.value = (txt.value || "") + b.dataset.c; it.user = txt.value; txt.focus(); });
    }
    if (it.listening) {
      if (it.playsLeft == null) it.playsLeft = sp.plays;
      const play = box.querySelector("#play");
      const doPlay = () => { if (it.playsLeft <= 0) return; it.playsLeft--; updatePlayBtn(box, it); playSeq(it.audio, it, box); };
      play.onclick = doPlay;
      updatePlayBtn(box, it);
      if (!it.autoPlayed) { it.autoPlayed = true; doPlay(); }
    } else { speechSynthesis && speechSynthesis.cancel(); current.seq++; }
  }

  function submitSection(box, force) {
    const { exam, si } = current;
    const sec = exam.sections[si];
    const left = sec.items.filter((x) => x.user == null || x.user === "").length;
    if (!force && left && !confirm(`Còn ${left} câu chưa trả lời. Nộp phần ${sec.vi}? Nộp rồi không quay lại được.`)) return;
    speechSynthesis && speechSynthesis.cancel(); current.seq++;
    sec.usedMs = Math.min(sec.minutes * 60000, sec.minutes * 60000 - (current.deadline - Date.now()));
    if (si + 1 < exam.sections.length) {
      current.si++; current.qi = 0;
      current.deadline = Date.now() + exam.sections[current.si].minutes * 60000;
      toast(`Bắt đầu phần ${exam.sections[current.si].vi}`);
      render(box);
    } else {
      clearInterval(current.timerId);
      finish(box);
    }
  }

  function finish(box) {
    const { exam } = current;
    const r = Exam.score(exam);
    current.result = r; current.finished = true;
    const s = Store.state;
    s.exams = s.exams || [];
    s.exams.push({ date: Store.today(), level: current.level, total: r.total, max: r.max, pass: r.pass, sections: r.sections.map((x) => ({ key: x.key, score: x.score, correct: x.correct, total: x.total })), minutes: Math.round((Date.now() - current.startedAt) / 60000) });
    Store.addXp(r.pass ? 60 : 20);
    Store.logToday("xp", 0);
    Store.save();
    results(box);
  }

  function results(box) {
    const { exam, result: r } = current;
    const sp = exam.spec;
    const minutes = Math.round((Date.now() - current.startedAt) / 60000);
    box.innerHTML = `<div class="card center"><div style="font-size:3rem">${r.pass ? "🎉" : "💪"}</div>
        <div class="eyebrow">${esc(sp.name)} · thi thử</div><h1 style="margin:4px 0">${r.total} <span class="muted" style="font-size:1.2rem">/ ${r.max}</span></h1>
        <p>${r.pass ? `<span class="pill green">ĐẬU</span> Vượt mốc ${r.passMark} điểm.` : `<span class="pill">CHƯA ĐẬU</span> Cần ${r.passMark} điểm, còn thiếu ${r.passMark - r.total}.`} <span class="muted small">· ${r.answered}/${r.questions} câu đã trả lời · ${minutes} phút</span></p>
        <div class="grid grid-3 mt">${r.sections.map((sec) => `<div class="card stat"><div class="stat-value">${sec.score}</div><div class="stat-label">${esc(sec.name)} ${esc(sec.vi)} · ${sec.correct}/${sec.total} câu</div>
          <div class="small" style="text-align:left;margin-top:8px">${sec.parts.map((p) => `<div class="row between"><span>${esc(p.name)}</span><span class="${p.correct / p.total >= 0.7 ? "" : "muted"}">${p.correct}/${p.total}</span></div>`).join("")}</div></div>`).join("")}</div>
        <div class="row mt" style="justify-content:center"><button class="btn" id="review">Xem lại từng câu</button><button class="btn btn-primary" id="again">Thi đề mới</button><a class="btn" href="#/exam">Chọn cấp khác</a></div></div>
      <div id="rv" class="mt"></div>`;
    box.querySelector("#again").onclick = () => { current = null; intro(box, exam.level); };
    box.querySelector("#review").onclick = () => {
      const rv = box.querySelector("#rv");
      rv.innerHTML = exam.sections.map((sec) => `<h2>${esc(sec.name)} ${esc(sec.vi)}</h2>${sec.items.map((it) => {
        const ok = Exam.isCorrect(it);
        const fmt = (v) => v == null || v === "" ? "<i>bỏ trống</i>" : it.kind === "tf" ? (v ? "✓" : "✗") : it.kind === "choice" ? `${LET[v]}. ${esc(it.options[v])}` : it.kind === "pool" ? `${LET[v]}. ${esc(it.group.pool[v])}` : esc(v);
        return `<div class="sentence ${ok ? "" : "wrong"}"><span class="who">${it.no}</span><div class="body">
          ${it.listening ? `<div class="zh">🔊 ${esc(it.audio.join(" "))}</div>` : ""}${it.stem ? `<div class="${it.listening ? "" : "zh"}">${esc(it.stem)}</div>` : ""}${it.sub ? `<div class="small muted">${esc(it.sub)}</div>` : ""}
          <div class="small">Bạn: ${fmt(it.user)} ${ok ? `<span class="pill green">đúng</span>` : `<span class="pill red">sai</span> · Đáp án: <b>${fmt(it.answer)}</b>`}</div>
          <div class="small muted">${esc(it.explain)}</div></div>${it.listening ? `<button class="btn btn-icon btn-sm" data-say="${esc(it.audio.join("。"))}">🔊</button>` : ""}</div>`; }).join("")}`).join("");
      rv.querySelectorAll("[data-say]").forEach((b) => b.onclick = () => TTS.speak(b.dataset.say));
      box.querySelector("#review").disabled = true;
    };
  }

  window.Views.exam = exam;
  Exam.current = () => current; // dùng để gỡ lỗi / kiểm thử
})();
