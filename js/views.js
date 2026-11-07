// Tất cả màn hình của Nǐ hǎo. Mỗi view trả về { html, after(el) }.
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (arr, n, exclude) => shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
  const SYL = /[bpmfdtnlgkhjqxzcsryw]?h?[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng|n|r)?/gi;

  // Tô màu pinyin theo thanh điệu
  function pyHtml(py) {
    return esc(py).replace(SYL, (syl) => `<span class="t${toneOf(syl)}">${syl}</span>`);
  }
  const speakBtn = (text, cls = "btn btn-icon btn-sm") => `<button class="${cls} speak" data-say="${esc(text)}" title="Nghe">🔊</button>`;
  const bindSpeak = (el) => el.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); TTS.speak(b.dataset.say); }));

  // Cấp độ HSK: suy ra từ trường level hoặc id bài
  const LEVELS = { 1: { name: "HSK 1", from: 1, to: 12, color: "blue" }, 2: { name: "HSK 2", from: 13, to: 24, color: "gold" }, 3: { name: "HSK 3", from: 25, to: 44, color: "green" }, 4: { name: "HSK 4", from: 45, to: 84, color: "red" }, 5: { name: "HSK 5", from: 85, to: 149, color: "purple" } };
  const levelOfId = (id) => (id <= 12 ? 1 : id <= 24 ? 2 : id <= 44 ? 3 : id <= 84 ? 4 : 5);
  const levelOfLesson = (l) => l.level || levelOfId(l.id);
  const levelOfWord = (w) => w.level || levelOfId(w.l);
  function levelStats() {
    const s = Store.state;
    return Object.keys(LEVELS).map((k) => {
      const lv = +k, ls = LESSONS.filter((l) => levelOfLesson(l) === lv), ws = VOCAB.filter((w) => levelOfWord(w) === lv);
      return { level: lv, name: LEVELS[k].name, color: LEVELS[k].color, lessons: ls.length, done: ls.filter((l) => s.completedLessons.includes(l.id)).length, words: ws.length, learned: ws.filter((w) => s.cards[w.id]).length };
    }).filter((x) => x.lessons > 0);
  }
  const maxLevel = () => Math.max(...LESSONS.map(levelOfLesson));

  function sentenceHtml(zh, py, vi, who) {
    return `<div class="sentence">${who ? `<span class="who">${esc(who)}</span>` : ""}<div class="body"><div class="zh">${esc(zh)}</div><div class="py">${pyHtml(py)}</div><div class="vi">${esc(vi)}</div></div>${speakBtn(zh)}</div>`;
  }

  // ---------- Trang chủ ----------
  function home() {
    const s = Store.state, st = SRS.stats();
    const learnedWords = Object.keys(s.cards).length;
    const done = s.completedLessons.length;
    const next = LESSONS.find((l) => !s.completedLessons.includes(l.id));
    const streak = Store.streakAlive();
    const routine = s.routine[Store.today()] || {};
    const fresh = learnedWords === 0 && done === 0 && s.toneDrill.total === 0;

    // heatmap 8 tuần
    const days = [];
    for (let i = 55; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.toISOString().slice(0, 10); const v = s.log[k]; const n = v ? (v.reviews || 0) + (v.newWords || 0) * 2 + (v.lessons || 0) * 10 : 0; days.push(`<span class="${n === 0 ? "" : n < 10 ? "l1" : n < 30 ? "l2" : "l3"}" title="${k}: ${n} điểm hoạt động"></span>`); }

    const html = `
      ${fresh ? `<section class="hero">
        <div class="eyebrow" style="color:#ffd8d0">Bắt đầu từ con số 0</div>
        <h1>你好! Học tiếng Trung đúng cách ngay từ ngày đầu</h1>
        <p>Lộ trình gộp những gì hiệu quả nhất từ HelloChinese, Anki, Skritter và HSK Lord: phát âm chuẩn trước, học từ theo ngữ cảnh, ôn tập ngắt quãng mỗi ngày, luyện viết và luyện nói. Viết riêng cho người Việt với âm Hán Việt.</p>
        <div class="row"><a class="btn btn-primary btn-lg" href="#/pinyin">Bắt đầu với Pinyin</a><a class="btn btn-ghost btn-lg" href="#/roadmap">Xem lộ trình</a></div>
      </section>` : `<h1>Chào bạn trở lại 👋</h1><p class="subtitle">${next ? `Bài tiếp theo: <b>Bài ${next.id} – ${esc(next.title)}</b> <span class="pill ${LEVELS[levelOfLesson(next)].color}">${LEVELS[levelOfLesson(next)].name}</span>` : `Bạn đã hoàn thành toàn bộ HSK 1–${maxLevel()}! Hãy duy trì ôn tập mỗi ngày.`}</p>`}

      <div class="grid grid-4 mt">
        <div class="card stat"><div class="stat-value">🔥 ${streak}</div><div class="stat-label">ngày liên tiếp</div></div>
        <div class="card stat"><div class="stat-value">${learnedWords}<span class="muted" style="font-size:1rem">/${VOCAB.length}</span></div><div class="stat-label">từ HSK 1–${maxLevel()} đã học</div></div>
        <div class="card stat"><div class="stat-value" style="color:var(--primary)">${st.due}</div><div class="stat-label">thẻ cần ôn hôm nay</div></div>
        <div class="card stat"><div class="stat-value" style="color:var(--gold-text)">${s.xp}</div><div class="stat-label">điểm kinh nghiệm</div></div>
      </div>

      <div class="grid grid-2 mt">
        <div class="card">
          <div class="eyebrow">Hôm nay · 30 phút</div>
          <h3 style="margin-top:4px">Thói quen học mỗi ngày</h3>
          <div class="checklist">
            ${DAILY_ROUTINE.map((r) => `<label class="${routine[r.key] ? "done" : ""}"><input type="checkbox" disabled ${routine[r.key] ? "checked" : ""}><span style="flex:1"><b>${r.min} phút</b> · ${esc(r.what)}</span><a class="btn btn-sm" href="${r.route}">Đi</a></label>`).join("")}
          </div>
          <p class="small muted" style="margin:10px 0 0">Ô được tích tự động khi bạn hoàn thành hoạt động tương ứng.</p>
        </div>
        <div class="card">
          <div class="eyebrow">Tiến độ</div>
          <h3 style="margin-top:4px">Bài học HSK 1–${maxLevel()}</h3>
          ${levelStats().map((x) => `<div class="row between small" style="margin-top:6px"><span><b>${x.name}</b> · ${x.done}/${x.lessons} bài · ${x.learned}/${x.words} từ</span><a href="#/lessons/${x.level}" class="small">xem</a></div><div class="progress ${x.color}"><span style="width:${x.lessons ? (x.done / x.lessons) * 100 : 0}%"></span></div>`).join("")}
          <p class="small muted">Tổng: ${done}/${LESSONS.length} bài · ${learnedWords}/${VOCAB.length} từ</p>
          ${next ? `<a class="btn btn-primary" href="#/lesson/${next.id}">${done ? "Tiếp tục" : "Bắt đầu"} Bài ${next.id}: ${esc(next.title)}</a>` : ""}
          <h3>Bộ thẻ ôn tập</h3>
          <div class="row small"><span class="pill red">Đang học ${st.learning}</span><span class="pill gold">Non ${st.young}</span><span class="pill green">Thuộc ${st.mature}</span></div>
          <p class="small muted" style="margin:8px 0 0">Dự báo 7 ngày tới: ${st.forecast.join(" · ")} thẻ · Thẻ viết đến hạn: <a href="#/write">${WSRS.dueIds().length}</a> · Bài đọc đã làm: <a href="#/read">${Object.keys(s.readings || {}).length}/${READINGS.length}</a></p>
        </div>
      </div>

      <div class="card mt">
        <div class="row between"><h3 style="margin:0">Hoạt động 8 tuần gần đây</h3><span class="small muted">mỗi ô = 1 ngày</span></div>
        <div class="heat mt">${days.join("")}</div>
      </div>

      <div class="grid grid-3 mt">
        <a class="card lesson-card" href="#/pinyin"><div class="lesson-icon">拼</div><div class="lesson-body"><div class="lesson-title">Pinyin Lab</div><div class="lesson-meta">Thanh mẫu, vận mẫu, luyện nghe thanh điệu</div></div></a>
        <a class="card lesson-card" href="#/write"><div class="lesson-icon">写</div><div class="lesson-body"><div class="lesson-title">Luyện viết</div><div class="lesson-meta">Thứ tự nét có hoạt hình, kiểm tra từng nét</div></div></a>
        <a class="card lesson-card" href="#/speak"><div class="lesson-icon">说</div><div class="lesson-body"><div class="lesson-title">Luyện nói</div><div class="lesson-meta">Shadowing câu mẫu, so với nhận dạng giọng nói</div></div></a>
      </div>`;
    return { html };
  }

  // ---------- Lộ trình ----------
  function roadmap() {
    const s = Store.state;
    const lessonsDone = (from, to) => LESSONS.filter((l) => l.id >= from && l.id <= to).every((l) => s.completedLessons.includes(l.id));
    const doneFlags = ROADMAP.map((p) => p.doneWhen === "tones" ? s.toneDrill.total >= 20 : p.doneWhen === "srs" ? Object.keys(s.cards).length > 0 && Store.streakAlive() >= 3 : p.lessons ? lessonsDone(p.lessons[0], p.lessons[1]) : false);
    const html = `
      <h1>Lộ trình học từ số 0 đến HSK ${maxLevel()}</h1>
      <p class="subtitle">Tổng hợp từ cách HelloChinese dạy người mới, cách Anki/Hack Chinese ôn tập, cách Skritter luyện viết, và lộ trình 30 phút/ngày của HSK Lord. Mốc tham khảo: 2–3 tháng cho HSK 1 (150 từ), 5–6 tháng cho HSK 2 (300 từ), 9–12 tháng cho HSK 3 (600 từ), 18–24 tháng cho HSK 4 (1.200 từ), 30–40 tháng cho HSK 5 (2.500 từ) với 30–45 phút mỗi ngày.</p>
      <div class="warn"><b>Nguyên tắc quan trọng nhất:</b> học ít nhưng đều. 30 phút mỗi ngày tốt hơn 4 giờ cuối tuần. Đừng bỏ qua thanh điệu, đừng học quá 10 từ mới/ngày, đừng học từ rời rạc không có câu.</div>
      <div class="stack mt">
      ${ROADMAP.map((p, i) => `
        <div class="card phase ${doneFlags[i] ? "done" : ""}">
          <div class="phase-num">${doneFlags[i] ? "✓" : p.phase}</div>
          <div>
            <div class="row between"><h3 style="margin:0">${esc(p.title)}</h3><span class="pill gold">${esc(p.time)}</span></div>
            <p class="muted small" style="margin:6px 0">${esc(p.why)}</p>
            <ul>${p.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            <a class="btn btn-sm mt" href="${p.link}">${esc(p.linkText)} →</a>
          </div>
        </div>`).join("")}
      </div>
      <h2>Phương pháp đã được so sánh</h2>
      <div class="grid grid-2">
        <div class="card"><h3 style="margin-top:0">Lấy từ các app tốt nhất</h3>
          <ul class="small">
            <li><b>HelloChinese:</b> bài học theo chủ đề, ngữ pháp ngắn kèm ví dụ, nhận dạng giọng nói, viết chữ theo nét.</li>
            <li><b>Anki / Hack Chinese:</b> ôn tập ngắt quãng theo từng từ (SM-2), chấm 4 mức, dự báo số thẻ.</li>
            <li><b>Skritter:</b> hoạt hình thứ tự nét và kiểm tra viết từng nét.</li>
            <li><b>Pleco:</b> từ điển tra nhanh, thêm thẳng vào bộ thẻ.</li>
            <li><b>Du Chinese / Migaku:</b> học từ trong câu thật, nghe nhiều lượt.</li>
          </ul></div>
        <div class="card"><h3 style="margin-top:0">Tránh điểm yếu của chúng</h3>
          <ul class="small">
            <li>Duolingo: ôn lặp cơ bản, không bám HSK, ít luyện thanh điệu → ở đây có SRS thật và Pinyin Lab riêng.</li>
            <li>HelloChinese: ôn theo bài chứ không theo từ → ở đây mỗi từ có lịch ôn riêng.</li>
            <li>Anki: mất 2–4 giờ cài đặt, bộ thẻ sai thanh → ở đây có sẵn, không cần cài.</li>
            <li>Tất cả: không có âm Hán Việt → ở đây mọi từ đều có Hán Việt để người Việt nhớ nhanh hơn.</li>
          </ul></div>
      </div>
      <h2>Nguồn miễn phí nên dùng kèm</h2>
      <div class="grid grid-2">${RESOURCES.map((r) => `<div class="card"><b><a href="${r.url}" target="_blank" rel="noopener">${esc(r.name)} ↗</a></b><p class="small muted" style="margin:4px 0 0">${esc(r.vi)}</p></div>`).join("")}</div>`;
    return { html };
  }

  // ---------- Pinyin Lab ----------
  function pinyin(tab = "tones") {
    const tabs = [["tones", "Thanh điệu"], ["initials", "Thanh mẫu (21)"], ["finals", "Vận mẫu (36)"], ["drill", "Luyện nghe thanh điệu"], ["pairs", "Âm dễ nhầm"]];
    let body = "";
    if (tab === "tones") {
      body = `<div class="grid grid-3">${PINYIN.tones.map((t) => `
        <div class="card tone-card"><div class="mark t${t.n}">${t.mark}</div>
          <svg viewBox="0 0 100 70"><line x1="5" y1="10" x2="5" y2="65" stroke="var(--border)"/><line x1="5" y1="65" x2="95" y2="65" stroke="var(--border)"/><path d="${t.path}" stroke="var(--tone${t.n})" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
          <b>${esc(t.name)}</b><p class="small" style="margin:6px 0">${esc(t.desc)}</p><p class="small muted" style="margin:0 0 8px"><b>Người Việt:</b> ${esc(t.vi)}</p>
          <div class="row" style="justify-content:center">${t.ex.map((e) => `<button class="btn btn-sm" data-say="${esc(e.split(" ")[1])}">${esc(e)}</button>`).join("")}</div>
        </div>`).join("")}</div>
        <h2>Quy tắc biến điệu</h2>
        <div class="grid grid-2">${PINYIN.toneRules.map((r) => `<div class="grammar"><div class="pattern">${esc(r.title)}</div><div class="small">${esc(r.body)}</div></div>`).join("")}</div>
        <div class="tip mt"><b>Mẹo:</b> Hãy luyện thanh điệu theo cặp đối lập: thanh 2 (lên) với thanh 4 (xuống), thanh 1 (bằng cao) với thanh 3 (trầm). Dùng tay vẽ đường thanh điệu trong không khí khi đọc.</div>`;
    } else if (tab === "initials" || tab === "finals") {
      const list = PINYIN[tab];
      body = `<p class="muted small">Bấm vào ô để nghe. Cột ghi chú là cách phát âm so với tiếng Việt.</p>
        <div class="py-grid">${list.map((x) => `<div class="py-cell" data-say="${esc(x.ex.split(" ")[1] || x.ex)}"><div class="py">${esc(x.py)}</div><div class="hint">${esc(x.ex)}</div></div>`).join("")}</div>
        <table class="vocab-table mt"><thead><tr><th>${tab === "initials" ? "Thanh mẫu" : "Vận mẫu"}</th><th>Ví dụ</th><th>Cách đọc với người Việt</th></tr></thead><tbody>
        ${list.map((x) => `<tr><td class="py">${esc(x.py)}</td><td class="zh">${esc(x.ex)} ${speakBtn(x.ex.split(" ")[1] || x.ex)}</td><td class="small">${esc(x.vi)}</td></tr>`).join("")}</tbody></table>`;
    } else if (tab === "drill") {
      body = `<div class="card" id="drill"></div>`;
    } else {
      body = `<p class="muted small">Bấm nghe lần lượt hai âm và để ý sự khác nhau về bật hơi / vị trí lưỡi.</p>
        <div class="grid grid-2">${PINYIN.minimalPairs.map((p) => `<div class="card row between"><div class="row"><button class="btn zh" data-say="${esc(p.a.split(" ")[1])}">${esc(p.a)}</button><span class="muted">vs</span><button class="btn zh" data-say="${esc(p.b.split(" ")[1])}">${esc(p.b)}</button></div><span class="small muted">${esc(p.note)}</span></div>`).join("")}</div>`;
    }
    const html = `<h1>Pinyin Lab</h1><p class="subtitle">Giai đoạn 1 của lộ trình. Dành 1–2 tuần, mỗi ngày 20 phút, trước khi học từ vựng.</p>
      <div class="tabs">${tabs.map(([k, v]) => `<button class="${k === tab ? "active" : ""}" data-tab="${k}">${v}</button>`).join("")}</div>${body}`;
    return {
      html,
      after(el) {
        el.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => (location.hash = "#/pinyin/" + b.dataset.tab));
        bindSpeak(el);
        if (tab === "drill") toneDrill(el.querySelector("#drill"));
      },
    };
  }

  function toneDrill(box) {
    let cur, streak = 0;
    const st = Store.state.toneDrill;
    function next() {
      const set = PINYIN.drill[Math.floor(Math.random() * PINYIN.drill.length)];
      const idx = Math.floor(Math.random() * 4);
      cur = { set, idx, answer: set[idx] };
      box.innerHTML = `<div class="quiz-q"><div class="prompt">Nghe và chọn đúng thanh điệu · Đúng ${st.correct}/${st.total} · Chuỗi ${streak}</div>
        <button class="btn btn-primary btn-lg" id="play">🔊 Nghe lại</button>
        <div class="options mt">${set.map((s, i) => `<button class="option" data-i="${i}"><span class="t${i + 1}">${esc(s)}</span><br><small class="muted">thanh ${i + 1}</small></button>`).join("")}</div>
        <div id="fb"></div></div>`;
      box.querySelector("#play").onclick = () => TTS.speak(cur.answer, { rate: 0.7 });
      TTS.speak(cur.answer, { rate: 0.7 });
      box.querySelectorAll(".option").forEach((o) => o.onclick = () => {
        const i = +o.dataset.i; const ok = i === cur.idx;
        st.total++; if (ok) { st.correct++; streak++; Store.addXp(1); } else streak = 0;
        Store.save();
        box.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (+x.dataset.i === cur.idx) x.classList.add("correct"); });
        if (!ok) o.classList.add("wrong");
        box.querySelector("#fb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "Chính xác!" : "Chưa đúng. Đáp án: " + esc(cur.answer) + " (thanh " + (cur.idx + 1) + ")"}</div><button class="btn btn-primary mt" id="nx">Câu tiếp →</button>`;
        box.querySelector("#nx").onclick = next;
        box.querySelector("#nx").focus();
      });
    }
    next();
  }

  // ---------- Bộ thủ ----------
  function radicals() {
    const html = `<h1>40 bộ thủ thường gặp</h1><p class="subtitle">Bộ thủ là "bảng chữ cái" của chữ Hán. Biết bộ thủ, bạn sẽ đoán được nghĩa và nhớ chữ nhanh hơn nhiều. Bấm 🔊 để nghe, bấm ✍ để luyện viết.</p>
      <div class="grid grid-2">${RADICALS.map((r) => `<div class="card radical-card"><div class="r">${esc(r.r.split(" ")[0])}</div><div style="flex:1"><div><b>${esc(r.r)}</b> · <span class="t${toneOf(r.py)}">${esc(r.py)}</span> · <i class="muted">${esc(r.hv)}</i> · ${esc(r.vi)}</div><div class="exs">${esc(r.ex)}</div>${r.note ? `<div class="small muted">${esc(r.note)}</div>` : ""}</div><div class="stack">${speakBtn(r.r.split(" ")[0])}<a class="btn btn-icon btn-sm" href="#/write/${encodeURIComponent(r.r.split(" ")[0])}" title="Luyện viết">✍</a></div></div>`).join("")}</div>`;
    return { html, after: bindSpeak };
  }

  // ---------- Danh sách bài học ----------
  function lessons(levelArg) {
    const s = Store.state;
    const stats = levelStats();
    const nextLesson = LESSONS.find((l) => !s.completedLessons.includes(l.id));
    const level = LEVELS[levelArg] ? +levelArg : nextLesson ? levelOfLesson(nextLesson) : maxLevel();
    const cur = stats.find((x) => x.level === level);
    const card = (l) => { const done = s.completedLessons.includes(l.id); const n = vocabByLesson(l.id).length; return `
        <a class="card lesson-card ${done ? "done" : ""}" href="#/lesson/${l.id}"><div class="lesson-icon">${done ? "✓" : l.icon}</div><div class="lesson-body"><div class="lesson-title">Bài ${l.id}: ${esc(l.title)}</div><div class="lesson-meta">${esc(l.sub)} · ${n} từ · ${l.grammar.length} ngữ pháp</div></div>${done ? `<span class="pill green">Xong</span>` : ""}</a>`; };
    const ls = LESSONS.filter((l) => levelOfLesson(l) === level);
    const html = `<h1>${LESSONS.length} bài học HSK 1–${maxLevel()}</h1><p class="subtitle">Mỗi bài 10–20 từ theo chủ đề, 3–4 điểm ngữ pháp, một hội thoại và bài luyện tập. Hoàn thành bài (đạt 70%) thì từ vựng tự động vào bộ thẻ ôn tập. Học tuần tự theo cấp độ, mỗi ngày một bài là vừa.</p>
      <div class="tabs">${stats.map((x) => `<button class="${x.level === level ? "active" : ""}" data-level="${x.level}">${x.name} <span class="muted small">${x.done}/${x.lessons}</span></button>`).join("")}</div>
      ${cur ? `<div class="row between mb"><span class="small muted">${cur.name} · ${cur.words} từ · bài ${LEVELS[level].from}–${LEVELS[level].from + cur.lessons - 1}</span><span class="small muted">${cur.done}/${cur.lessons} bài xong</span></div><div class="progress mb"><span style="width:${(cur.done / cur.lessons) * 100}%"></span></div>` : ""}
      <div class="grid grid-2">${ls.map(card).join("")}</div>`;
    return { html, after(el) { el.querySelectorAll("[data-level]").forEach((b) => b.onclick = () => (location.hash = "#/lessons/" + b.dataset.level)); } };
  }

  // ---------- Một bài học ----------
  function lesson(id, tab = "vocab") {
    const L = LESSONS.find((l) => l.id === +id);
    if (!L) return { html: `<p>Không tìm thấy bài.</p>` };
    const words = vocabByLesson(L.id);
    const done = Store.state.completedLessons.includes(L.id);
    const tabs = [["vocab", "Từ vựng"], ["grammar", "Ngữ pháp"], ["dialogue", "Hội thoại"], ["quiz", "Luyện tập"]];
    let body = "";
    if (tab === "vocab") {
      body = `<div class="row between mb"><span class="muted small">Bấm 🔊 để nghe. Cột Hán Việt giúp bạn liên hệ với từ tiếng Việt.</span><button class="btn btn-sm" id="play-all">🔊 Nghe tất cả</button></div>
        <table class="vocab-table"><thead><tr><th>Chữ</th><th>Pinyin</th><th>Hán Việt</th><th>Nghĩa</th><th>Ví dụ</th><th></th></tr></thead><tbody>
        ${words.map((w) => `<tr><td class="hz">${esc(w.hz)}</td><td class="py">${pyHtml(w.py)}</td><td class="hv">${esc(w.hv)}</td><td>${esc(w.vi)}<br><span class="small muted">${esc(w.pos)}</span></td><td class="small"><span class="zh">${esc(w.ex[0])}</span><br><span class="muted">${pyHtml(w.ex[1])}</span><br>${esc(w.ex[2])}</td><td><div class="stack">${speakBtn(w.hz)}${speakBtn(w.ex[0], "btn btn-icon btn-sm")}<a class="btn btn-icon btn-sm" href="#/write/${encodeURIComponent(w.hz[0])}" title="Luyện viết">✍</a></div></td></tr>`).join("")}</tbody></table>`;
    } else if (tab === "grammar") {
      body = L.grammar.map((g) => `<div class="grammar"><div class="pattern">${esc(g.pattern)}</div><div class="small">${esc(g.vi)}</div><div class="ex">${sentenceHtml(g.ex[0], g.ex[1], g.ex[2])}</div></div>`).join("") + `<div class="tip"><b>Mẹo cho người Việt:</b> ${esc(L.tips)}</div>`;
    } else if (tab === "dialogue") {
      body = `<div class="row between mb"><span class="muted small">Nghe cả đoạn, rồi đọc theo từng câu (shadowing). Che phần dịch khi đã quen.</span><div class="row"><button class="btn btn-sm" id="play-dialog">▶ Nghe cả đoạn</button><button class="btn btn-sm" id="toggle-vi">Ẩn/hiện dịch</button></div></div>
        <div id="dialog">${L.dialogue.map((d) => sentenceHtml(d[1], d[2], d[3], d[0])).join("")}</div>
        <h3>Câu mẫu</h3>${L.sentences.map((s) => sentenceHtml(s[0].replace(/ /g, ""), s[1], s[2])).join("")}`;
    } else {
      body = `<div id="quiz"></div>`;
    }
    const ti = tabs.findIndex((t) => t[0] === tab), prevTab = tabs[ti - 1], nextTab = tabs[ti + 1];
    const html = `<a href="#/lessons/${levelOfLesson(L)}" class="backlink">← Tất cả bài học</a>
      <div class="row between"><div><div class="eyebrow">Bài ${L.id}${done ? " · Đã hoàn thành" : ""}</div><h1>${esc(L.title)} <span class="zh-serif muted" style="font-weight:500">${esc(L.icon)}</span></h1><p class="subtitle">${esc(L.sub)}</p></div></div>
      <div class="card mb"><b>Mục tiêu:</b> ${L.goals.map((g) => `<span class="pill blue">${esc(g)}</span>`).join(" ")}</div>
      <div class="tabs">${tabs.map(([k, v]) => `<button class="${k === tab ? "active" : ""}" data-tab="${k}">${v}</button>`).join("")}</div>${body}
      ${tab === "quiz" ? "" : `<div class="lesson-nav">${prevTab ? `<a class="btn" href="#/lesson/${L.id}/${prevTab[0]}">← ${prevTab[1]}</a>` : `<a class="btn" href="#/lessons/${levelOfLesson(L)}">← Danh sách bài</a>`}<a class="btn btn-primary" href="#/lesson/${L.id}/${nextTab[0]}">${nextTab[0] === "quiz" ? "Làm bài luyện tập" : "Tiếp: " + nextTab[1]} →</a></div>`}`;
    return {
      html,
      after(el) {
        el.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => (location.hash = `#/lesson/${L.id}/${b.dataset.tab}`));
        bindSpeak(el);
        const pa = el.querySelector("#play-all");
        if (pa) pa.onclick = () => { let i = 0; const go = () => { if (i < words.length) TTS.speak(words[i++].hz, { onend: () => setTimeout(go, 400) }); }; go(); };
        const pd = el.querySelector("#play-dialog");
        if (pd) pd.onclick = () => { let i = 0; const go = () => { if (i < L.dialogue.length) TTS.speak(L.dialogue[i++][1], { onend: () => setTimeout(go, 500) }); }; go(); };
        const tv = el.querySelector("#toggle-vi");
        if (tv) tv.onclick = () => el.querySelectorAll("#dialog .vi, #dialog .py").forEach((x) => x.classList.toggle("hidden"));
        if (tab === "quiz") quiz(el.querySelector("#quiz"), L, words);
      },
    };
  }

  // ---------- Bài luyện tập cuối bài ----------
  function quiz(box, L, words) {
    const all = VOCAB;
    const qs = [];
    words.forEach((w) => {
      const type = ["meaning", "reverse", "listen"][Math.floor(Math.random() * 3)];
      const pool = sample(vocabByLesson(L.id).length >= 4 ? vocabByLesson(L.id) : all, 3, w);
      // bảo đảm distractor không trùng nghĩa/chữ
      const ds = pool.filter((d) => d.hz !== w.hz && d.vi !== w.vi);
      while (ds.length < 3) { const d = sample(all, 1, w)[0]; if (!ds.includes(d) && d.hz !== w.hz) ds.push(d); }
      qs.push({ type, w, opts: shuffle([w, ...ds]) });
    });
    shuffle(L.sentences).slice(0, 4).forEach((s) => qs.push({ type: "order", s }));
    const list = shuffle(qs);
    let i = 0, correct = 0; const results = [];

    function header() {
      return `<div class="quiz-progress">${list.map((_, k) => `<span class="${k < i ? (results[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></span>`).join("")}</div>`;
    }
    function render() {
      if (i >= list.length) return finish();
      const q = list[i];
      let html = header();
      if (q.type === "order") {
        const tokens = q.s[0].split(" ");
        html += `<div class="quiz-q"><div class="prompt">Sắp xếp thành câu: <b>${esc(q.s[2])}</b></div><div class="sub">${pyHtml(q.s[1])}</div></div>
          <div class="tiles" id="answer"></div><p class="small muted center" style="margin:6px">bấm vào từ để chuyển lên / xuống</p><div class="tiles" id="bank">${shuffle(tokens).map((t, k) => `<button class="tile" data-k="${k}">${esc(t)}</button>`).join("")}</div>
          <div class="row mt" style="justify-content:center"><button class="btn btn-primary" id="check">Kiểm tra</button></div><div id="fb"></div>`;
        box.innerHTML = html;
        const ans = box.querySelector("#answer"), bank = box.querySelector("#bank");
        box.querySelectorAll(".tile").forEach((t) => t.onclick = () => (t.parentElement === bank ? ans : bank).appendChild(t));
        box.querySelector("#check").onclick = () => {
          const got = Array.from(ans.children).map((t) => t.textContent).join(" ");
          grade(got === q.s[0], `${esc(q.s[0].replace(/ /g, ""))} · ${esc(q.s[1])}`, q.s[0].replace(/ /g, ""));
        };
      } else {
        const w = q.w;
        const prompt = q.type === "meaning" ? `<div class="prompt">Từ này nghĩa là gì?</div><div class="main">${esc(w.hz)}</div><div class="sub">${pyHtml(w.py)}</div>`
          : q.type === "reverse" ? `<div class="prompt">Chọn chữ Hán đúng</div><div class="main vi-text">${esc(w.vi)}</div><div class="sub muted small">${esc(w.hv)}</div>`
          : `<div class="prompt">Nghe và chọn từ đúng</div><button class="btn btn-primary btn-lg" id="play">🔊 Nghe</button>`;
        html += `<div class="quiz-q">${prompt}</div><div class="options">${q.opts.map((o, k) => `<button class="option ${q.type === "meaning" ? "vi-text" : ""}" data-k="${k}">${q.type === "meaning" ? esc(o.vi) : esc(o.hz)}${q.type === "listen" ? "" : ""}</button>`).join("")}</div><div id="fb"></div>`;
        box.innerHTML = html;
        if (q.type === "listen") { box.querySelector("#play").onclick = () => TTS.speak(w.hz); TTS.speak(w.hz); }
        box.querySelectorAll(".option").forEach((o) => o.onclick = () => {
          const ok = q.opts[+o.dataset.k] === w;
          box.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (q.opts[+x.dataset.k] === w) x.classList.add("correct"); });
          if (!ok) o.classList.add("wrong");
          grade(ok, `${esc(w.hz)} · ${esc(w.py)} · ${esc(w.vi)}`, w.hz);
        });
      }
    }
    function grade(ok, answerHtml, say) {
      results[i] = ok; if (ok) correct++;
      if (say) TTS.speak(say);
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "Chính xác! 🎉" : "Chưa đúng."} Đáp án: ${answerHtml}</div><div class="center mt"><button class="btn btn-primary" id="nx">${i + 1 < list.length ? "Câu tiếp →" : "Xem kết quả"}</button></div>`;
      box.querySelector("#check") && (box.querySelector("#check").disabled = true);
      fb.querySelector("#nx").onclick = () => { i++; render(); };
      fb.querySelector("#nx").focus();
    }
    function finish() {
      const pct = Math.round((correct / list.length) * 100);
      const pass = pct >= 70;
      const s = Store.state;
      let added = 0;
      if (pass) {
        if (!s.completedLessons.includes(L.id)) { s.completedLessons.push(L.id); Store.logToday("lessons", 1); Store.addXp(20); }
        added = SRS.addWords(words.map((w) => w.id));
        WSRS.addWords(words.filter((w) => /^[一-鿿]+$/.test(w.hz)).map((w) => w.id));
        Store.addXp(correct);
        Store.markRoutine("lesson");
        Store.save();
        App.updateBadge();
      }
      box.innerHTML = `<div class="card center"><div style="font-size:3rem">${pass ? "🎉" : "💪"}</div><h2 style="margin:6px 0">${pct}% · ${correct}/${list.length} câu đúng</h2>
        <p class="muted">${pass ? `Bạn đã hoàn thành Bài ${L.id}!${added ? ` ${added} từ mới đã được thêm vào bộ thẻ ôn tập và bộ thẻ luyện viết.` : ""}${READINGS.find((r) => r.after === L.id) ? ` Có bài đọc mới mở khóa: <a href="#/read/${READINGS.find((r) => r.after === L.id).id}">đọc ngay</a>.` : ""}` : "Cần đạt 70% để hoàn thành. Hãy xem lại từ vựng rồi thử lại nhé."}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="again">Làm lại</button>${pass ? `<a class="btn btn-primary" href="#/review">Ôn tập ngay</a>${LESSONS.find((x) => x.id === L.id + 1) ? `<a class="btn" href="#/lesson/${L.id + 1}">Bài ${L.id + 1} →</a>` : ""}` : `<a class="btn btn-primary" href="#/lesson/${L.id}/vocab">Xem lại từ vựng</a>`}</div></div>`;
      box.querySelector("#again").onclick = () => quiz(box, L, words);
    }
    render();
  }

  // ---------- Ôn tập SRS ----------
  const stripTone = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "u").replace(/[\s'’\-\d]/g, "").toLowerCase();
  const sylsOf = (py) => py.match(SYL) || [py];
  const TONE_MARKS = ["ā", "á", "ǎ", "à", "a"];

  function review() {
    const html = `<h1>Ôn tập ngắt quãng</h1><p class="subtitle">Thuật toán SM-2 (như Anki): thẻ hiện lại đúng lúc bạn sắp quên. Chọn kiểu mặt trước: <b>Câu</b> che từ trong câu ví dụ (nhớ bền hơn từ rời), <b>Gõ pinyin</b> và <b>Thanh điệu</b> bắt bạn trả lời thật thay vì tự chấm. Phím tắt: <span class="kbd">Space</span> lật, <span class="kbd">1</span>–<span class="kbd">4</span> chấm, <span class="kbd">Enter</span> kiểm tra.</p><div id="rv"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#rv");
        let queue = shuffle(SRS.dueIds());
        let front = Store.state.settings.reviewFront || "hz", flipped = false, doneCount = 0, answer = null; // answer: { ok, text }
        let tones = [];
        const st = SRS.stats();
        if (st.total === 0) { box.innerHTML = `<div class="card center"><p>Bạn chưa có thẻ nào. Hoàn thành bài học đầu tiên để bắt đầu bộ thẻ.</p><a class="btn btn-primary" href="#/lesson/1">Vào Bài 1</a></div>`; return; }
        const MODES = [["hz", "Chữ Hán"], ["vi", "Tiếng Việt"], ["audio", "Nghe"], ["cloze", "Câu"], ["type", "Gõ pinyin"], ["tone", "Thanh điệu"]];
        const canCloze = (w) => w.ex && w.ex[0] && w.ex[0].includes(w.hz) && w.ex[0].replace(w.hz, "").replace(/[，。！？、,.!?\s]/g, "").length >= 2;

        function render() {
          if (!queue.length) {
            Store.markRoutine("review");
            const s2 = SRS.stats(), hard = SRS.hardest(8).map(vocabById).filter(Boolean);
            box.innerHTML = `<div class="card center"><div style="font-size:3rem">✅</div><h2 style="margin:6px 0">${doneCount ? `Đã ôn ${doneCount} thẻ. ` : ""}Hết thẻ cần ôn!</h2><p class="muted">Bộ thẻ: ${s2.total} từ · Ngày mai: ${s2.forecast[1]} thẻ · 7 ngày tới: ${s2.forecast.reduce((a, b) => a + b, 0)} thẻ</p>
              <div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/lessons">Học bài mới</a><button class="btn" id="extra">Ôn thêm 10 thẻ bất kỳ</button>${WSRS.dueIds().length ? `<a class="btn" href="#/write">✍ ${WSRS.dueIds().length} thẻ viết đến hạn</a>` : ""}</div></div>
              ${hard.length ? `<div class="card mt"><h3 style="margin-top:0">Từ hay quên nhất</h3><div class="row">${hard.map((w) => `<span class="pill red zh" title="${esc(w.vi)}">${esc(w.hz)} ${esc(w.py)} · quên ${Store.state.cards[w.id].lapses} lần</span>`).join("")}</div><button class="btn btn-sm mt" id="hardbtn">Ôn riêng nhóm này</button></div>` : ""}`;
            box.querySelector("#extra").onclick = () => { queue = shuffle(SRS.allIds()).slice(0, 10); render(); };
            const hb = box.querySelector("#hardbtn"); if (hb) hb.onclick = () => { queue = shuffle(SRS.hardest(8)); render(); };
            return;
          }
          const id = queue[0], w = vocabById(id);
          if (!w) { queue.shift(); return render(); }
          const mode = front === "cloze" && !canCloze(w) ? "hz" : front;
          box.innerHTML = `<div class="row between mb"><span class="pill red">Còn ${queue.length} thẻ</span><div class="row"><span class="small muted">Mặt trước:</span>${MODES.map(([k, v]) => `<button class="btn btn-sm ${front === k ? "btn-primary" : ""}" data-front="${k}">${v}</button>`).join("")}</div></div>
            <div class="card flashcard" id="fc">${cardFace(w, mode)}</div>
            <div id="grades">${flipped ? gradeBtns(id) : ["type", "tone"].includes(mode) ? "" : `<button class="btn btn-primary btn-block btn-lg mt" id="flip">Lật thẻ (Space)</button>`}</div>`;
          box.querySelectorAll("[data-front]").forEach((b) => b.onclick = () => { front = b.dataset.front; Store.state.settings.reviewFront = front; Store.save(); flipped = false; answer = null; tones = []; render(); });
          if (!["type", "tone"].includes(mode)) box.querySelector("#fc").onclick = (e) => { if (!flipped && !e.target.closest("button")) flip(w); };
          const fl = box.querySelector("#flip"); if (fl) fl.onclick = () => flip(w);
          bindSpeak(box);
          box.querySelectorAll("[data-grade]").forEach((b) => b.onclick = () => doGrade(+b.dataset.grade));
          if (mode === "audio" && !flipped) TTS.speak(w.hz);
          // gõ pinyin
          const inp = box.querySelector("#pyin");
          if (inp) { inp.focus(); inp.onkeydown = (e) => { if (e.key === "Enter") checkTyped(w, inp.value); }; box.querySelector("#pycheck").onclick = () => checkTyped(w, inp.value); }
          // chọn thanh điệu
          box.querySelectorAll("[data-tone]").forEach((b) => b.onclick = () => { tones.push(+b.dataset.tone); const n = sylsOf(w.py).length; if (tones.length >= n) checkTones(w); else render(); });
          const undo = box.querySelector("#toneundo"); if (undo) undo.onclick = () => { tones.pop(); render(); };
        }
        function flip(w) { flipped = true; render(); TTS.speak(w.hz); }
        function checkTyped(w, val) {
          const ok = stripTone(val) === stripTone(w.py);
          answer = { ok, text: val };
          flip(w);
        }
        function checkTones(w) {
          const want = sylsOf(w.py).map(toneOf);
          const ok = want.every((t, i) => t === tones[i]);
          answer = { ok, text: tones.map((t) => t === 5 ? "nhẹ" : t).join("-"), want: want.map((t) => t === 5 ? "nhẹ" : t).join("-") };
          flip(w);
        }
        function clozeHtml(w) {
          const parts = w.ex[0].split(w.hz);
          return parts.map(esc).join(`<span style="color:var(--primary);letter-spacing:2px">＿＿</span>`);
        }
        function cardFace(w, mode) {
          if (!flipped) {
            if (mode === "hz") return `<div class="hz">${esc(w.hz)}</div><p class="muted small">Nhớ cách đọc và nghĩa, rồi lật thẻ</p>`;
            if (mode === "vi") return `<div class="vi" style="font-size:1.8rem;font-weight:700">${esc(w.vi)}</div><div class="hv">${esc(w.hv)}</div><p class="muted small">Nhớ chữ Hán và cách đọc, rồi lật thẻ</p>`;
            if (mode === "audio") return `<div style="font-size:3rem">🔊</div>${speakBtn(w.hz, "btn")}<p class="muted small">Nghe và nhớ chữ, nghĩa, rồi lật thẻ</p>`;
            if (mode === "cloze") return `<div class="zh" style="font-size:2rem;font-weight:500;line-height:1.5">${clozeHtml(w)}</div><div class="muted" style="margin-top:8px">${esc(w.ex[2])}</div><p class="muted small">Từ nào điền vào chỗ trống? Nhớ chữ và cách đọc, rồi lật thẻ</p>`;
            if (mode === "type") return `<div class="hz">${esc(w.hz)}</div><p class="muted small" style="margin:6px 0">Gõ pinyin không dấu (có thể thêm số thanh: ni3hao3)</p><div class="row" style="justify-content:center"><input class="search" id="pyin" style="max-width:260px;text-align:center;font-size:1.2rem" autocomplete="off" placeholder="nihao"><button class="btn btn-primary" id="pycheck">Kiểm tra</button></div>`;
            if (mode === "tone") {
              const syls = sylsOf(w.py), n = syls.length;
              return `<div class="hz">${esc(w.hz)}</div><div class="row" style="justify-content:center;margin:8px 0;font-size:1.4rem;font-weight:600">${syls.map((s, i) => `<span class="pill ${i === tones.length ? "red" : tones[i] ? "green" : ""}" style="font-size:1.1rem">${esc(stripTone(s))}${tones[i] ? " · " + (tones[i] === 5 ? "nhẹ" : tones[i]) : ""}</span>`).join("")}</div><p class="muted small">Chọn thanh điệu cho âm tiết ${tones.length + 1}/${n}</p><div class="row" style="justify-content:center">${TONE_MARKS.map((m, i) => `<button class="btn btn-lg t${i + 1}" data-tone="${i + 1}" style="font-size:1.4rem;min-width:60px">${m}<br><small>${i === 4 ? "nhẹ" : i + 1}</small></button>`).join("")}</div>${tones.length ? `<button class="btn btn-sm btn-ghost mt" id="toneundo">↶ Chọn lại</button>` : ""}`;
            }
          }
          const fb = answer ? `<div class="feedback ${answer.ok ? "ok" : "bad"}" style="margin-bottom:10px">${answer.ok ? "Chính xác!" : "Chưa đúng"} · bạn trả lời: <b>${esc(answer.text || "(trống)")}</b>${answer.want && !answer.ok ? ` · đúng là <b>${esc(answer.want)}</b>` : ""}</div>` : "";
          return `${fb}<div class="hz">${esc(w.hz)}</div><div class="py">${pyHtml(w.py)}</div><div class="vi">${esc(w.vi)} <span class="hv">(${esc(w.hv)})</span></div><div class="ex"><span class="zh">${esc(w.ex[0])}</span> · ${pyHtml(w.ex[1])}<br>${esc(w.ex[2])}</div><div class="mt">${speakBtn(w.hz, "btn btn-sm")} ${speakBtn(w.ex[0], "btn btn-sm")} <a class="btn btn-sm" href="#/write/${encodeURIComponent(w.hz[0])}">✍ Viết</a></div>`;
        }
        function gradeBtns(id) {
          // Trả lời sai thì chỉ được chấm Quên/Khó; đúng thì gợi ý Tốt
          const lock = answer && !answer.ok;
          const sug = answer ? (answer.ok ? 3 : 1) : 0;
          return `<div class="grade-btns"><button class="btn g1 ${sug === 1 ? "btn-primary" : ""}" data-grade="1">Quên<small>${SRS.preview(id, 1)} · 1</small></button><button class="btn g2" data-grade="2">Khó<small>${SRS.preview(id, 2)} · 2</small></button><button class="btn g3 ${sug === 3 ? "btn-primary" : ""}" data-grade="3" ${lock ? "disabled" : ""}>Tốt<small>${SRS.preview(id, 3)} · 3</small></button><button class="btn g4" data-grade="4" ${lock ? "disabled" : ""}>Dễ<small>${SRS.preview(id, 4)} · 4</small></button></div>${lock ? `<p class="small muted center" style="margin:6px 0 0">Trả lời sai nên chỉ chấm Quên hoặc Khó.</p>` : ""}`;
        }
        function doGrade(g) {
          if (answer && !answer.ok && g > 2) return;
          const id = queue.shift();
          SRS.review(id, g);
          if (g === 1) queue.push(id); // học lại trong phiên
          doneCount++; flipped = false; answer = null; tones = []; App.updateBadge(); render();
        }
        App.keyHandler = (e) => {
          if (e.target.tagName === "INPUT") return;
          if (e.code === "Space") { e.preventDefault(); if (!flipped && queue.length && !["type", "tone"].includes(front)) flip(vocabById(queue[0])); }
          else if (flipped && ["1", "2", "3", "4"].includes(e.key)) doGrade(+e.key);
          else if (!flipped && front === "tone" && ["1", "2", "3", "4", "5"].includes(e.key)) { const w = vocabById(queue[0]); tones.push(+e.key); if (tones.length >= sylsOf(w.py).length) checkTones(w); else render(); }
        };
        render();
      },
    };
  }

  // ---------- Luyện viết ----------
  const WRITER_OPTS = () => { const dark = document.documentElement.dataset.theme === "dark"; return { strokeColor: dark ? "#f1ebe3" : "#1f1a17", outlineColor: dark ? "#3a322a" : "#e6ddd1", drawingColor: "#c0392b", highlightColor: "#d4a017", drawingWidth: 6 }; };
  const STROKE_RULES = `<h3>Quy tắc thứ tự nét</h3><ul class="small"><li>Ngang trước, sổ sau (十)</li><li>Phẩy trước, mác sau (人)</li><li>Trên trước, dưới sau (三)</li><li>Trái trước, phải sau (你)</li><li>Ngoài trước, trong sau (月)</li><li>Vào nhà rồi mới đóng cửa (国): nét bao ngoài trước, nét trong, rồi đóng đáy</li><li>Giữa trước, hai bên sau (小)</li></ul>`;

  // #/write → ôn viết SRS; #/write/free[/chữ] hoặc #/write/<chữ> → luyện tự do
  function write(a, b) {
    const tab = !a || a === "srs" ? "srs" : "free";
    const ch = a === "free" ? b : a === "srs" ? undefined : a;
    const wst = WSRS.stats();
    const tabs = `<div class="tabs"><button class="${tab === "srs" ? "active" : ""}" data-wtab="srs">Ôn viết theo lịch <span class="badge ${wst.due ? "" : "zero"}">${wst.due}</span></button><button class="${tab === "free" ? "active" : ""}" data-wtab="free">Luyện từng chữ</button></div>`;
    const r = tab === "srs" ? writeSRS() : writeFree(ch);
    return {
      html: `<h1>Luyện viết chữ Hán</h1><p class="subtitle">Viết tay cả từ theo lịch ôn riêng (kiểu Skritter): từ học xong tự vào bộ thẻ viết, máy chấm theo số nét sai. Mỗi ngày 5–10 từ là đủ.</p>${tabs}${r.html}`,
      after(el) {
        el.querySelectorAll("[data-wtab]").forEach((x) => x.onclick = () => (location.hash = x.dataset.wtab === "srs" ? "#/write" : "#/write/free"));
        if (!window.HanziWriter) { toast("Không tải được Hanzi Writer (cần internet)"); return; }
        r.after(el);
      },
    };
  }

  function writeSRS() {
    const st = WSRS.stats();
    if (st.total === 0) {
      const learned = SRS.allIds().filter((id) => { const w = vocabById(id); return w && /^[一-鿿]+$/.test(w.hz); });
      return { html: `<div class="card center"><p>Chưa có thẻ viết. Từ vựng tự vào bộ thẻ viết khi bạn hoàn thành bài học.</p>${learned.length ? `<button class="btn btn-primary" id="seed">Thêm ${learned.length} từ đã học vào bộ thẻ viết</button>` : `<a class="btn btn-primary" href="#/lesson/1">Vào Bài 1</a>`}</div>`, after(el) { const s = el.querySelector("#seed"); if (s) s.onclick = () => { WSRS.addWords(learned); toast("Đã thêm"); App.route(); }; } };
    }
    return {
      html: `<div id="wsrs"></div>`,
      after(el) {
        const box = el.querySelector("#wsrs");
        let queue = shuffle(WSRS.dueIds()), done = 0;
        let writers = [], idx = 0, mistakes = 0, hinted = false, finished = false;
        function render() {
          if (!queue.length) {
            Store.markRoutine("write");
            const s2 = WSRS.stats();
            box.innerHTML = `<div class="card center"><div style="font-size:3rem">✍</div><h2 style="margin:6px 0">${done ? `Đã viết ${done} từ. ` : ""}Hết thẻ viết cần ôn!</h2><p class="muted">Bộ thẻ viết: ${s2.total} từ · Ngày mai: ${s2.forecast[1]} · 7 ngày tới: ${s2.forecast.reduce((x, y) => x + y, 0)}</p><div class="row" style="justify-content:center"><button class="btn" id="extra">Viết thêm 5 từ bất kỳ</button><a class="btn" href="#/write/free">Luyện từng chữ</a></div></div>`;
            box.querySelector("#extra").onclick = () => { queue = shuffle(WSRS.allIds()).slice(0, 5); render(); };
            return;
          }
          const id = queue[0], w = vocabById(id);
          if (!w) { queue.shift(); return render(); }
          const chars = w.hz.split(""), size = chars.length === 1 ? 240 : chars.length === 2 ? 190 : 150;
          idx = 0; mistakes = 0; hinted = false; finished = false; writers = [];
          box.innerHTML = `<div class="row between mb"><span class="pill red">Còn ${queue.length} thẻ viết</span><span class="small muted">Từ ${chars.length} chữ · viết lần lượt từng chữ</span></div>
            <div class="card center"><div style="font-size:1.6rem;font-weight:700">${pyHtml(w.py)}</div><div class="muted">${esc(w.vi)} <i>(${esc(w.hv)})</i></div>
              <div class="row mt" style="justify-content:center;gap:12px">${chars.map((c, i) => `<div class="writer-target" id="wt${i}" style="width:${size}px;height:${size}px;${i === 0 ? "border-color:var(--primary)" : ""}"></div>`).join("")}</div>
              <p class="small muted" id="wmsg" style="min-height:1.4em;margin:10px 0 4px">Viết chữ 1/${chars.length}: <b class="zh">${esc(w.hz)}</b> được che, hãy viết từ trí nhớ</p>
              <div class="row" style="justify-content:center"><button class="btn btn-sm" id="hint">💡 Gợi ý nét (tính là Khó)</button><button class="btn btn-sm" id="reveal">👁 Xem đáp án (tính là Quên)</button>${speakBtn(w.hz, "btn btn-sm")}</div>
              <div id="wgrades"></div></div>`;
          bindSpeak(box);
          writers = chars.map((c, i) => HanziWriter.create("wt" + i, c, Object.assign({ width: size, height: size, padding: 10, showCharacter: false, showOutline: false, showHintAfterMisses: 3, strokeAnimationSpeed: 1 }, WRITER_OPTS())));
          box.querySelector("#hint").onclick = () => { hinted = true; writers[idx].showOutline(); box.querySelector("#wmsg").innerHTML = `Đang hiện khung chữ ${idx + 1}. Viết tiếp theo nét.`; };
          box.querySelector("#reveal").onclick = () => { hinted = true; mistakes += 10; writers.forEach((wr) => { wr.cancelQuiz(); wr.showCharacter(); }); finish(w, true); };
          startQuiz(w, chars);
        }
        function startQuiz(w, chars) {
          const msg = box.querySelector("#wmsg");
          chars.forEach((c, i) => box.querySelector("#wt" + i).style.borderColor = i === idx ? "var(--primary)" : "var(--border)");
          writers[idx].quiz({
            onMistake: (d) => { mistakes++; msg.innerHTML = `Chữ ${idx + 1}: nét ${d.strokeNum + 1} chưa đúng (${d.mistakesOnStroke} lần)`; },
            onCorrectStroke: (d) => { msg.innerHTML = `Chữ ${idx + 1}: đúng nét ${d.strokeNum + 1}, còn ${d.strokesRemaining} nét`; },
            onComplete: () => { idx++; if (idx < chars.length) { msg.innerHTML = `Tốt! Viết chữ ${idx + 1}/${chars.length}`; startQuiz(w, chars); } else finish(w, false); },
          });
        }
        function finish(w, revealed) {
          if (finished) return; finished = true;
          const id = queue[0];
          const sug = revealed ? 1 : mistakes === 0 ? 4 : mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
          const maxAllowed = revealed ? 1 : hinted ? 2 : 4;
          box.querySelector("#wmsg").innerHTML = `${revealed ? "Đã xem đáp án." : `Hoàn thành <b class="zh">${esc(w.hz)}</b> với ${mistakes} nét sai${hinted ? " (có gợi ý)" : ""}.`} Gợi ý chấm: <b>${["", "Quên", "Khó", "Tốt", "Dễ"][sug]}</b>`;
          box.querySelector("#wgrades").innerHTML = `<div class="grade-btns"><button class="btn g1 ${sug === 1 ? "btn-primary" : ""}" data-grade="1">Quên<small>${WSRS.preview(id, 1)} · 1</small></button><button class="btn g2 ${sug === 2 ? "btn-primary" : ""}" data-grade="2" ${maxAllowed < 2 ? "disabled" : ""}>Khó<small>${WSRS.preview(id, 2)} · 2</small></button><button class="btn g3 ${sug === 3 ? "btn-primary" : ""}" data-grade="3" ${maxAllowed < 3 ? "disabled" : ""}>Tốt<small>${WSRS.preview(id, 3)} · 3</small></button><button class="btn g4 ${sug === 4 ? "btn-primary" : ""}" data-grade="4" ${maxAllowed < 4 ? "disabled" : ""}>Dễ<small>${WSRS.preview(id, 4)} · 4</small></button></div>`;
          box.querySelectorAll("[data-grade]").forEach((b) => b.onclick = () => grade(+b.dataset.grade, maxAllowed));
          App.keyHandler = (e) => { if (["1", "2", "3", "4"].includes(e.key)) grade(+e.key, maxAllowed); };
          TTS.speak(w.hz);
        }
        function grade(g, maxAllowed) {
          if (g > maxAllowed) return;
          const id = queue.shift();
          WSRS.review(id, g);
          if (g === 1) queue.push(id);
          done++; App.keyHandler = null; render();
        }
        render();
      },
    };
  }

  function writeFree(ch) {
    const learned = SRS.allIds().map(vocabById).filter(Boolean);
    const pool = (learned.length ? learned : vocabByLesson(1)).flatMap((w) => w.hz.split("")).filter((c, i, a) => a.indexOf(c) === i && /[一-鿿]/.test(c));
    const target = ch ? decodeURIComponent(ch) : pool[0];
    const info = VOCAB.find((w) => w.hz === target) || VOCAB.find((w) => w.hz.includes(target));
    const rad = RADICALS.find((r) => r.r.split(" ")[0] === target);
    const html = `<div class="writer-wrap">
        <div class="card writer-box"><div class="big-zh" style="font-size:2rem;margin-bottom:6px">${esc(target)} ${info ? `<span class="muted" style="font-size:1rem">${pyHtml(info.py)} · ${esc(info.vi)}</span>` : rad ? `<span class="muted" style="font-size:1rem">${esc(rad.py)} · ${esc(rad.hv)} · ${esc(rad.vi)}</span>` : ""}</div>
          <div class="writer-target" id="writer"></div>
          <div class="row mt" style="justify-content:center"><button class="btn" id="anim">▶ Xem nét</button><button class="btn btn-primary" id="quiz">✍ Tự viết</button>${speakBtn(target, "btn")}${info && !WSRS.has(info.id) ? `<button class="btn" id="addw" title="Thêm từ ${esc(info.hz)} vào bộ thẻ viết">+ Thẻ viết</button>` : ""}</div>
          <p class="small muted center" id="wmsg" style="min-height:1.4em;margin:8px 0 0">Nét: <span id="stroke-count">–</span></p></div>
        <div class="card"><h3 style="margin-top:0">Chọn chữ ${learned.length ? "đã học" : "(Bài 1)"}</h3><div class="char-picker">${pool.map((c) => `<button class="${c === target ? "active" : ""}" data-ch="${esc(c)}">${esc(c)}</button>`).join("")}</div>${STROKE_RULES}</div>
      </div>`;
    return {
      html,
      after(el) {
        bindSpeak(el);
        el.querySelectorAll("[data-ch]").forEach((b) => b.onclick = () => (location.hash = "#/write/free/" + encodeURIComponent(b.dataset.ch)));
        const addw = el.querySelector("#addw"); if (addw) addw.onclick = () => { WSRS.addWords([info.id]); toast("Đã thêm vào bộ thẻ viết"); addw.remove(); };
        let writer;
        try {
          writer = HanziWriter.create("writer", target, Object.assign({ width: 258, height: 258, padding: 14, showOutline: true, strokeAnimationSpeed: 1, delayBetweenStrokes: 250,
            onLoadCharDataSuccess: (d) => { el.querySelector("#stroke-count").textContent = d.strokes.length; },
            onLoadCharDataError: () => { el.querySelector("#wmsg").textContent = "Chưa có dữ liệu nét cho chữ này."; } }, WRITER_OPTS()));
        } catch (e) { el.querySelector("#wmsg").textContent = "Lỗi tải dữ liệu nét."; return; }
        el.querySelector("#anim").onclick = () => writer.animateCharacter();
        el.querySelector("#quiz").onclick = () => {
          const msg = el.querySelector("#wmsg");
          msg.textContent = "Hãy viết từng nét theo đúng thứ tự…";
          writer.quiz({
            onMistake: (d) => { msg.textContent = `Nét ${d.strokeNum + 1} chưa đúng (${d.mistakesOnStroke} lần). Thử lại!`; },
            onCorrectStroke: (d) => { msg.textContent = `Đúng nét ${d.strokeNum + 1}/${d.strokeNum + 1 + d.strokesRemaining}`; },
            onComplete: (d) => { msg.textContent = `Hoàn thành! Tổng ${d.totalMistakes} lỗi.`; Store.addXp(d.totalMistakes === 0 ? 5 : 3); Store.markRoutine("write"); },
          });
        };
        writer.animateCharacter();
      },
    };
  }

  // ---------- Luyện nói ----------
  function speak() {
    const s = Store.state;
    const unlocked = LESSONS.filter((l) => s.completedLessons.includes(l.id));
    const srcLessons = unlocked.length ? unlocked : [LESSONS[0]];
    const sents = srcLessons.flatMap((l) => [...l.sentences.map((x) => ({ zh: x[0].replace(/ /g, ""), py: x[1], vi: x[2], l: l.id })), ...l.dialogue.map((d) => ({ zh: d[1], py: d[2], vi: d[3], l: l.id }))]);
    const html = `<h1>Luyện nói · Shadowing</h1><p class="subtitle">Nghe câu mẫu → đọc theo ngay lập tức, bắt chước cả thanh điệu và nhịp → bấm 🎤 để máy nhận dạng xem bạn nói có rõ không. Câu lấy từ ${unlocked.length ? "các bài đã học" : "Bài 1 (học xong bài sẽ mở thêm câu)"}.</p>
      <div class="card" id="sp"></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#sp");
        let i = 0, rec = null;
        const order = shuffle(sents);
        function render() {
          const c = order[i % order.length];
          box.innerHTML = `<div class="row between"><span class="pill gold">Bài ${c.l}</span><span class="small muted">${(i % order.length) + 1}/${order.length}</span></div>
            <div class="quiz-q"><div class="main" style="font-size:2.4rem">${esc(c.zh)}</div><div class="sub">${pyHtml(c.py)}</div><div class="muted">${esc(c.vi)}</div></div>
            <div class="row" style="justify-content:center"><button class="btn" data-say="${esc(c.zh)}">🔊 Bình thường</button><button class="btn" id="slow">🐢 Chậm</button></div>
            <button class="mic" id="mic" title="Bấm rồi nói">🎤</button>
            <div class="center small muted" id="smsg">Bấm micro, đợi 1 giây rồi đọc câu trên</div><div id="sfb"></div>
            <div class="row mt" style="justify-content:space-between"><button class="btn" id="prev">← Trước</button><button class="btn btn-primary" id="next">Câu tiếp →</button></div>`;
          bindSpeak(box);
          box.querySelector("#slow").onclick = () => TTS.speak(c.zh, { rate: 0.6 });
          box.querySelector("#next").onclick = () => { i++; render(); };
          box.querySelector("#prev").onclick = () => { i = (i - 1 + order.length) % order.length; render(); };
          const mic = box.querySelector("#mic"), msg = box.querySelector("#smsg"), fb = box.querySelector("#sfb");
          mic.onclick = () => {
            if (rec) { try { rec.stop(); } catch (e) {} rec = null; mic.classList.remove("rec"); return; }
            speechSynthesis && speechSynthesis.cancel();
            mic.classList.add("rec"); msg.textContent = "Đang nghe… hãy đọc câu";
            rec = TTS.recognize((alts) => {
              mic.classList.remove("rec"); rec = null;
              const norm = (t) => t.replace(/[\s，。！？、,.!?'"“”]/g, "");
              const target = norm(c.zh);
              let best = alts[0], bestScore = 0;
              alts.forEach((a) => { const sc = similarity(norm(a), target); if (sc > bestScore) { bestScore = sc; best = a; } });
              const pct = Math.round(bestScore * 100);
              msg.textContent = "Máy nghe được:";
              fb.innerHTML = `<div class="feedback ${pct >= 80 ? "ok" : pct >= 50 ? "" : "bad"}" style="${pct >= 50 && pct < 80 ? "background:var(--gold-soft);color:var(--gold-text)" : ""}"><span class="zh" style="font-size:1.3rem">${esc(best)}</span><br>Khớp ${pct}% ${pct >= 80 ? "· Rất tốt! 🎉" : pct >= 50 ? "· Khá, thử lại chú ý thanh điệu" : "· Nghe lại mẫu rồi thử lại"}</div>`;
              if (pct >= 50) { Store.addXp(pct >= 80 ? 3 : 1); Store.markRoutine("speak"); }
            }, (err) => { mic.classList.remove("rec"); rec = null; msg.textContent = err; });
          };
        }
        render();
      },
    };
  }
  // Độ giống nhau theo khoảng cách Levenshtein
  function similarity(a, b) {
    if (!a.length && !b.length) return 1;
    const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return 1 - d[m][n] / Math.max(m, n);
  }

  // ---------- Từ điển ----------
  function dictionary() {
    const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "u").toLowerCase();
    const html = `<h1>Từ điển HSK 1–${maxLevel()}</h1><p class="subtitle">Tra ${VOCAB.length} từ theo chữ Hán, pinyin (có hoặc không dấu), Hán Việt hoặc tiếng Việt.</p>
      <div class="row"><input class="search" id="q" placeholder="Ví dụ: 你好, nihao, hảo, tốt…" style="flex:1" autofocus><select id="lv"><option value="0">Mọi cấp</option>${levelStats().map((x) => `<option value="${x.level}">${x.name} (${x.words})</option>`).join("")}</select></div><div id="res" class="mt"></div>`;
    return {
      html,
      after(el) {
        const q = el.querySelector("#q"), res = el.querySelector("#res"), lv = el.querySelector("#lv");
        function run() {
          const t = strip(q.value.trim()), L = +lv.value;
          let list = L ? VOCAB.filter((w) => levelOfWord(w) === L) : VOCAB;
          if (t) list = list.filter((w) => w.hz.includes(q.value.trim()) || strip(w.py).replace(/[\s']/g, "").includes(t.replace(/\s/g, "")) || strip(w.hv).includes(t) || strip(w.vi).includes(t));
          const shown = list.slice(0, 300);
          res.innerHTML = `<p class="small muted">${list.length} kết quả${list.length > 300 ? " (hiện 300 đầu, gõ thêm để lọc)" : ""}</p><table class="vocab-table"><thead><tr><th>Chữ</th><th>Pinyin</th><th>Hán Việt</th><th>Nghĩa</th><th>Bài</th><th></th></tr></thead><tbody>${shown.map((w) => { const c = Store.state.cards[w.id]; const L2 = LEVELS[levelOfWord(w)]; return `<tr><td class="hz">${esc(w.hz)}</td><td class="py">${pyHtml(w.py)}</td><td class="hv">${esc(w.hv)}</td><td>${esc(w.vi)}<br><span class="small muted zh">${esc(w.ex[0])}</span></td><td><a href="#/lesson/${w.l}" class="pill ${L2.color}" title="${L2.name}">Bài ${w.l}</a></td><td><div class="row">${speakBtn(w.hz)}<a class="btn btn-icon btn-sm" href="#/write/${encodeURIComponent(w.hz[0])}">✍</a>${c ? `<span class="pill green" title="Đã trong bộ thẻ">✓</span>` : `<button class="btn btn-sm" data-add="${w.id}">+ Thẻ</button>`}</div></td></tr>`; }).join("")}</tbody></table>`;
          bindSpeak(res);
          res.querySelectorAll("[data-add]").forEach((b) => b.onclick = () => { SRS.addWords([b.dataset.add]); toast("Đã thêm vào bộ thẻ ôn tập"); App.updateBadge(); run(); });
        }
        q.oninput = run; lv.onchange = run; run();
      },
    };
  }

  // ---------- Cài đặt ----------
  function settings() {
    const s = Store.state.settings;
    const voices = TTS.voices;
    const html = `<h1>Cài đặt</h1>
      <div class="card"><h3 style="margin-top:0">Giọng đọc</h3>
        <p class="small muted">Web dùng giọng tiếng Trung có sẵn trong trình duyệt/hệ điều hành. ${voices.length ? `Tìm thấy ${voices.length} giọng tiếng Trung.` : "<b>Chưa tìm thấy giọng tiếng Trung.</b> Trên Windows: Settings → Time &amp; Language → Language → Add a language → 中文(简体) → tick Text-to-speech. Hoặc mở web bằng Microsoft Edge (có sẵn giọng Xiaoxiao online)."}</p>
        <div class="row"><label>Giọng: <select id="voice"><option value="">Tự động</option>${voices.map((v) => `<option value="${esc(v.name)}" ${s.voice === v.name ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}</select></label>
        <label>Tốc độ: <input type="number" id="rate" min="0.5" max="1.2" step="0.05" value="${s.rate}"></label><button class="btn btn-sm" data-say="你好，我是你的汉语老师。">🔊 Thử</button></div></div>
      <div class="card mt"><h3 style="margin-top:0">Giao diện</h3><div class="row"><button class="btn" id="light">☀ Sáng</button><button class="btn" id="dark">🌙 Tối</button></div>
        <h3>Cỡ chữ Hán</h3><p class="small muted">Phóng to chữ Hán trong bảng từ vựng, thẻ ôn tập, bài đọc và đề thi. Chữ tiếng Việt giữ nguyên.</p>
        <div class="row">${[["normal", "Bình thường"], ["large", "Lớn"], ["xlarge", "Rất lớn"]].map(([k, v]) => `<button class="btn ${(s.zhSize || "normal") === k ? "btn-primary" : ""}" data-zh="${k}">${v}</button>`).join("")}<span class="zh" style="font-size:calc(1.6rem * var(--zh-scale))">你好，谢谢</span></div></div>
      <div class="card mt"><h3 style="margin-top:0">Dữ liệu học</h3><p class="small muted">Tiến độ lưu trong trình duyệt này (localStorage). Xuất tệp để sao lưu hoặc chuyển sang máy khác.</p>
        <div class="row"><button class="btn" id="export">⬇ Xuất tiến độ (JSON)</button><label class="btn">⬆ Nhập tiến độ <input type="file" id="import" accept=".json" class="hidden"></label><button class="btn" id="reset" style="color:var(--primary)">Xoá toàn bộ tiến độ</button></div></div>
      <div class="card mt"><h3 style="margin-top:0">Về Nǐ hǎo</h3><p class="small muted">Từ vựng theo danh sách HSK 1–4 bộ cũ (${VOCAB.length} từ, ${LESSONS.length} bài). Nghĩa tiếng Việt và âm Hán Việt được biên soạn thủ công. Dữ liệu nét chữ từ dự án mã nguồn mở Hanzi Writer (giấy phép MIT). Phát âm và nhận dạng giọng nói dùng Web Speech API của trình duyệt.</p></div>`;
    return {
      html,
      after(el) {
        bindSpeak(el);
        el.querySelector("#voice").onchange = (e) => { s.voice = e.target.value; Store.save(); };
        el.querySelector("#rate").onchange = (e) => { s.rate = +e.target.value; Store.save(); };
        el.querySelector("#light").onclick = () => App.setTheme("light");
        el.querySelector("#dark").onclick = () => App.setTheme("dark");
        el.querySelectorAll("[data-zh]").forEach((b) => b.onclick = () => { App.setZh(b.dataset.zh); el.querySelectorAll("[data-zh]").forEach((x) => x.classList.toggle("btn-primary", x === b)); });
        el.querySelector("#export").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([Store.exportJSON()], { type: "application/json" })); a.download = `nihaostudy-${Store.today()}.json`; a.click(); };
        el.querySelector("#import").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { Store.importJSON(t); toast("Đã nhập tiến độ"); App.updateBadge(); } catch (err) { toast("Tệp không hợp lệ"); } }); };
        el.querySelector("#reset").onclick = () => { if (confirm("Xoá toàn bộ tiến độ học? Không thể hoàn tác.")) { Store.reset(); toast("Đã xoá"); location.hash = "#/"; } };
      },
    };
  }

  window.toast = function (msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200); };
  // ---------- Bài đọc ----------
  // Tách đoạn văn thành từ theo từ điển (ghép dài nhất trước)
  let DICT = null;
  function buildDict(extra) {
    if (!DICT) { DICT = new Map(); VOCAB.forEach((w) => { if (!DICT.has(w.hz)) DICT.set(w.hz, w); }); }
    const d = new Map(DICT);
    (extra || []).forEach((e) => d.set(e.hz, Object.assign({ hv: "", extra: true }, e)));
    return d;
  }
  function segment(text, extra) {
    const d = buildDict(extra), out = [];
    let i = 0;
    while (i < text.length) {
      let hit = null;
      for (let len = Math.min(6, text.length - i); len >= 1; len--) { const s = text.slice(i, i + len); if (d.has(s)) { hit = d.get(s); break; } }
      if (hit) { out.push({ t: hit.hz, w: hit }); i += hit.hz.length; }
      else if (/[一-鿿]/.test(text[i])) {
        // chữ đứng riêng chỉ có trong từ ghép đã học: chỉ ra từ chứa nó
        const c = text[i], host = VOCAB.filter((w) => w.hz.includes(c)).sort((a, b) => a.hz.length - b.hz.length)[0];
        out.push({ t: c, w: host ? { hz: c, py: sylsOf(host.py)[host.hz.indexOf(c)] || "", hv: "", vi: `chữ trong từ ${host.hz} (${host.py}: ${host.vi})`, l: host.l, host } : null }); i++;
      } else { out.push({ t: text[i], w: null }); i++; }
    }
    return out;
  }

  function readList() {
    const s = Store.state;
    const groups = levelStats().map((x) => ({ x, rs: READINGS.filter((r) => r.level === x.level) })).filter((g) => g.rs.length);
    const html = `<h1>Bài đọc ngắn</h1><p class="subtitle">Sau mỗi 5 bài có một đoạn văn 80–150 chữ chỉ dùng từ đã học. Bấm vào từng từ để xem nghĩa, nghe cả đoạn, rồi trả lời 3 câu hỏi. Đọc là cách rẻ nhất để ôn lại hàng trăm từ trong vài phút.</p>
      ${groups.map((g) => `<h2>${g.x.name}</h2><div class="grid grid-2">${g.rs.map((r) => { const done = s.readings[r.id]; const open = s.completedLessons.includes(r.after); return `<a class="card lesson-card ${done ? "done" : ""}" href="#/read/${r.id}"><div class="lesson-icon">${done ? "✓" : "读"}</div><div class="lesson-body"><div class="lesson-title">${esc(r.title)}</div><div class="lesson-meta">Sau bài ${r.after} · ${[...r.zh].filter((c) => /[一-鿿]/.test(c)).length} chữ${done ? ` · ${done.score}/3 câu đúng` : ""}</div></div>${open ? `<span class="pill green">Mở</span>` : `<span class="pill" title="Nên học xong bài ${r.after} trước">Bài ${r.after}</span>`}</a>`; }).join("")}</div>`).join("")}`;
    return { html };
  }

  function reading(id) {
    const r = READINGS.find((x) => x.id === id);
    if (!r) return { html: `<p>Không tìm thấy bài đọc.</p>` };
    const toks = segment(r.zh, r.extra);
    const html = `<a href="#/read" class="backlink">← Tất cả bài đọc</a>
      <div class="row between"><div><div class="eyebrow">Bài đọc · sau bài ${r.after} · ${LEVELS[r.level].name}</div><h1>${esc(r.title)}</h1></div></div>
      <div class="row mb">${speakBtn(r.zh, "btn")}<button class="btn" id="slow">🐢 Đọc chậm</button><button class="btn" id="tpy">Hiện pinyin</button><button class="btn" id="tvi">Hiện bản dịch</button></div>
      <div class="card"><div class="zh rtext" id="rtext">${toks.map((k, i) => k.w ? `<span class="rtok" data-i="${i}">${esc(k.t)}</span>` : esc(k.t)).join("")}</div>
        <div id="rpy" class="muted hidden" style="margin-top:10px">${pyHtml(r.py)}</div><div id="rvi" class="hidden" style="margin-top:10px">${esc(r.vi)}</div></div>
      <div class="card mt" id="rpop"><p class="muted small" style="margin:0">Bấm vào một từ trong bài để xem nghĩa.</p></div>
      <h2>Câu hỏi hiểu bài</h2><div id="rq"></div>`;
    return {
      html,
      after(el) {
        bindSpeak(el);
        el.querySelector("#slow").onclick = () => TTS.speak(r.zh, { rate: 0.65 });
        el.querySelector("#tpy").onclick = () => el.querySelector("#rpy").classList.toggle("hidden");
        el.querySelector("#tvi").onclick = () => el.querySelector("#rvi").classList.toggle("hidden");
        const pop = el.querySelector("#rpop");
        el.querySelectorAll(".rtok").forEach((t) => t.onclick = () => {
          el.querySelectorAll(".rtok").forEach((x) => x.classList.remove("hl")); t.classList.add("hl");
          const w = toks[+t.dataset.i].w;
          pop.innerHTML = `<div class="row between"><div><span class="zh" style="font-size:1.6rem;font-weight:500">${esc(w.hz)}</span> <b>${pyHtml(w.py)}</b> ${w.hv ? `<i class="muted">(${esc(w.hv)})</i>` : ""}<div>${esc(w.vi)}${w.l ? ` · <a href="#/lesson/${w.l}" class="small">Bài ${w.l}</a>` : ""}</div></div><div class="row">${speakBtn(w.hz)}${w.id ? (SRS.has(w.id) ? `<span class="pill green">✓ trong bộ thẻ</span>` : `<button class="btn btn-sm" id="addc">+ Thẻ</button>`) : ""}</div></div>`;
          bindSpeak(pop);
          const ac = pop.querySelector("#addc"); if (ac) ac.onclick = () => { SRS.addWords([w.id]); toast("Đã thêm vào bộ thẻ"); ac.replaceWith(Object.assign(document.createElement("span"), { className: "pill green", textContent: "✓ trong bộ thẻ" })); App.updateBadge(); };
          TTS.speak(w.hz);
        });
        // câu hỏi
        const qbox = el.querySelector("#rq");
        let qi = 0, score = 0;
        function renderQ() {
          if (qi >= r.questions.length) {
            const prev = Store.state.readings[r.id];
            if (!prev || prev.score < score) { Store.state.readings[r.id] = { done: true, score, at: Date.now() }; Store.addXp(5 + score * 3); Store.save(); }
            const next = READINGS.find((x) => x.after > r.after);
            qbox.innerHTML = `<div class="card center"><div style="font-size:2.5rem">${score === 3 ? "🎉" : "👍"}</div><h3 style="margin:4px 0">${score}/3 câu đúng</h3><div class="row" style="justify-content:center"><button class="btn" id="rq-again">Làm lại</button>${next ? `<a class="btn btn-primary" href="#/read/${next.id}">Bài đọc tiếp →</a>` : `<a class="btn btn-primary" href="#/read">Danh sách bài đọc</a>`}</div></div>`;
            qbox.querySelector("#rq-again").onclick = () => { qi = 0; score = 0; renderQ(); };
            return;
          }
          const q = r.questions[qi];
          qbox.innerHTML = `<div class="card"><div class="quiz-q" style="padding:10px"><div class="prompt">Câu ${qi + 1}/${r.questions.length}</div><div class="main vi-text" style="font-size:1.25rem">${esc(q.q)}</div></div><div class="options">${q.opts.map((o, k) => `<button class="option vi-text" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="rfb"></div></div>`;
          qbox.querySelectorAll(".option").forEach((o) => o.onclick = () => {
            const ok = +o.dataset.k === q.a; if (ok) score++;
            qbox.querySelectorAll(".option").forEach((x) => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("correct"); });
            if (!ok) o.classList.add("wrong");
            qbox.querySelector("#rfb").innerHTML = `<div class="feedback ${ok ? "ok" : "bad"}">${ok ? "Chính xác!" : "Chưa đúng. Đọc lại đoạn văn nhé."}</div><div class="center mt"><button class="btn btn-primary" id="rnx">${qi + 1 < r.questions.length ? "Câu tiếp →" : "Xem kết quả"}</button></div>`;
            qbox.querySelector("#rnx").onclick = () => { qi++; renderQ(); };
          });
        }
        renderQ();
      },
    };
  }

  window.Views = { home, roadmap, pinyin, radicals, lessons, lesson, review, write, speak, dictionary, settings, readList, reading };
})();
