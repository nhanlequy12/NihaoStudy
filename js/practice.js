// Luyện tập: danh mục chức năng, menu "Luyện tập", trang tổng hợp, khung chung (chọn cấp / kết quả / lịch sử / sổ tay).
// Mỗi chức năng đăng ký bằng Practice.register(key, { run(std, opts, box) }) trong tệp riêng.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak } = Views.util;

  // ---------- Danh mục ----------
  // std: "hsk2" = HSK cũ (HSK 2.0, cấp 1–6 của web), "hsk3" = HSK 3.0 (đề cương 2025, cấp 1–6)
  const FEATURES = [
    { key: "rain", icon: "bubbles", tone: 1, name: "Mưa từ vựng", desc: "Bắn vỡ bong bóng từ: gõ pinyin, viết chữ Hán hoặc nhớ từ theo nghĩa", std: ["hsk2"], badge: { hsk2: "HOT" } },
    { key: "translate", icon: "translate", tone: 2, name: "Luyện dịch", desc: "Dịch câu Trung sang Việt, chấm theo ý chính", std: ["hsk2", "hsk3"] },
    { key: "position", icon: "pin", tone: 3, name: "Chọn vị trí từ", desc: "Đặt từ cho sẵn vào đúng chỗ A · B · C · D", std: ["hsk2", "hsk3"], badge: { hsk2: "NEW", hsk3: "NEW" } },
    { key: "dictation", icon: "headphones", tone: 4, name: "Chép chính tả", desc: "Nghe máy đọc rồi gõ lại chữ Hán hoặc pinyin", std: ["hsk2", "hsk3"], badge: { hsk2: "NEW" } },
    { key: "order", icon: "sort", tone: 5, name: "Sắp xếp câu", desc: "Kéo thả các từ thành câu đúng", std: ["hsk2", "hsk3"] },
    { key: "fix", icon: "bug", tone: 6, name: "Sửa câu sai", desc: "Tìm câu sai ngữ pháp và hiểu vì sao sai", std: ["hsk2", "hsk3"] },
    { key: "fill", icon: "blank", tone: 7, name: "Điền từ", desc: "Chọn hoặc gõ từ còn thiếu vào chỗ trống", std: ["hsk2", "hsk3"] },
    { key: "qa", icon: "chat", tone: 8, name: "Hỏi đáp", desc: "Chọn câu đáp hợp với câu hỏi, luyện phản xạ", std: ["hsk2", "hsk3"] },
  ];
  const STD = {
    hsk2: { name: "HSK cũ", long: "HSK cũ (HSK 2.0)", levels: [1, 2, 3, 4, 5, 6] },
    hsk3: { name: "HSK 3.0", long: "HSK 3.0 (đề cương 2025)", levels: [1, 2, 3, 4, 5, 6] },
  };
  const impl = {};
  const register = (key, obj) => { impl[key] = obj; };
  const ready = (key) => !!impl[key];
  const feature = (key) => FEATURES.find((f) => f.key === key);
  const nameIn = (f, std) => (std === "hsk3" ? `${f.name} HSK 3.0` : f.name);

  // ---------- Dữ liệu từ theo chuẩn và cấp ----------
  const LEVEL_OF_LESSON = (l) => (l <= 12 ? 1 : l <= 24 ? 2 : l <= 44 ? 3 : l <= 84 ? 4 : l <= 149 ? 5 : 6);
  function wordsOf(std, level) {
    if (std === "hsk3") return H3.byLevel(level);
    return VOCAB.filter((w) => (w.level || LEVEL_OF_LESSON(w.l)) === level);
  }

  // Câu luyện: lấy câu ví dụ tự soạn của từng từ (mỗi câu chứa đúng từ đó), không trùng câu
  function sentencesOf(std, level) {
    const seen = new Set(), out = [];
    wordsOf(std, level).forEach((w) => {
      const ex = w.ex;
      if (!ex || !ex[0] || !ex[2] || !ex[0].includes(w.hz) || seen.has(ex[0])) return;
      seen.add(ex[0]);
      out.push({ zh: ex[0], py: ex[1], vi: ex[2], word: w });
    });
    return out;
  }

  // Tách câu thành các từ có trong từ điển của web (khớp dài nhất) để làm phần "từ trong câu"
  let dict = null;
  function lookup(hz) {
    if (!dict) {
      dict = new Map();
      VOCAB.forEach((w) => { if (!dict.has(w.hz)) dict.set(w.hz, w); });
      (window.H3 ? H3.words : []).forEach((w) => { if (!dict.has(w.hz)) dict.set(w.hz, w); });
    }
    return dict.get(hz) || null;
  }
  const PUNCT = /^[\s，。！？、；：“”‘’（）《》…—,.!?;:"'()·]+$/;
  // Tách câu thành dãy token theo thứ tự: {t, w} (w = từ trong từ điển, null nếu không có; chữ lạ liền nhau gộp thành 1 token)
  function tokens(zh) {
    const out = [];
    for (let i = 0; i < zh.length;) {
      let hit = null;
      for (let L = Math.min(5, zh.length - i); L >= 1; L--) { const w = lookup(zh.slice(i, i + L)); if (w) { hit = w; break; } }
      if (hit) { out.push({ t: hit.hz, w: hit }); i += hit.hz.length; continue; }
      const ch = zh[i], p = PUNCT.test(ch), last = out[out.length - 1];
      if (last && !last.w && !last.p && !p) last.t += ch;
      else out.push({ t: ch, w: null, p });
      i++;
    }
    return out;
  }
  function glossary(zh) {
    const out = [];
    tokens(zh).forEach((x) => { if (x.w && !out.includes(x.w)) out.push(x.w); });
    return out;
  }

  // ---------- Tiếng Việt: chuẩn hoá để so sánh ----------
  const viNorm = (s) => String(s || "").normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const viBare = (s) => viNorm(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

  // ---------- Lưu tiến độ, lịch sử, điểm cao, sổ tay ----------
  function pstate() {
    const s = Store.state;
    if (!s.practice) s.practice = { history: [], best: {} };
    if (!s.notebook) s.notebook = [];
    return s.practice;
  }
  function record(entry) {
    const p = pstate();
    p.history.unshift(Object.assign({ at: new Date().toISOString() }, entry));
    p.history = p.history.slice(0, 200);
    const k = entry.bestKey;
    let isBest = false;
    if (k && entry.score > (p.best[k] || 0)) { p.best[k] = entry.score; isBest = true; }
    Store.addXp(Math.min(30, Math.round((entry.correct || 0) * 1.5)));
    Store.markRoutine("practice");
    Store.save();
    return isBest;
  }
  const best = (k) => pstate().best[k] || 0;
  function addToNotebook(items, from) {
    pstate();
    const nb = Store.state.notebook, have = new Set(nb.map((x) => x.hz + "|" + (x.note || "")));
    let n = 0;
    items.forEach((it) => {
      const key = it.hz + "|" + (it.note || "");
      if (have.has(key)) return;
      have.add(key);
      nb.unshift({ hz: it.hz, py: it.py || "", vi: it.vi || "", note: it.note || "", id: it.id || null, from, at: new Date().toISOString() });
      n++;
    });
    Store.save();
    return n;
  }

  // ---------- Menu "Luyện tập": mỗi dạng bài một dòng, chọn chuẩn HSK ngay trên dòng ----------
  // Chuẩn dùng gần nhất được nhớ lại, để bấm thẳng vào dòng là vào đúng chuẩn đang học
  const lastStd = () => { try { return localStorage.getItem("practice.std") === "hsk3" ? "hsk3" : "hsk2"; } catch (e) { return "hsk2"; } };
  const rememberStd = (std) => { try { localStorage.setItem("practice.std", std); } catch (e) {} };
  function rowHtml(f, cls = "") {
    const std = f.std.includes(lastStd()) ? lastStd() : f.std[0];
    const isNew = f.badge && Object.values(f.badge).includes("NEW");
    const soon = !ready(f.key);
    return `<div class="pm-row ${cls}">
      <a class="pm-item" href="#/practice/${f.key}/${std}" data-practice="${f.key}" data-std-go="${std}">
        <span class="pm-ic tone-${f.tone}">${ic(f.icon)}</span>
        <span class="pm-text"><span class="pm-name">${esc(f.name)}${isNew ? ` <span class="pm-new">Mới</span>` : ""}${soon ? ` <span class="pm-soon">Sắp có</span>` : ""}</span>
        <span class="pm-desc">${esc(f.desc)}</span></span></a>
      <span class="pm-stds" aria-label="Chọn chuẩn HSK">${["hsk2", "hsk3"].map((k) => f.std.includes(k) ? `<a class="pm-std ${k === std ? "on" : ""}" href="#/practice/${f.key}/${k}" data-std-go="${k}" title="${esc(nameIn(f, k))}">${k === "hsk2" ? "HSK 2.0" : "HSK 3.0"}</a>` : "").join("")}</span>
    </div>`;
  }
  const rowsHtml = (cls) => FEATURES.map((f) => rowHtml(f, cls)).join("");
  // nhớ chuẩn vừa chọn (bắt ở tầng tài liệu, dùng cho cả menu và trang tổng hợp)
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-std-go]"); if (a) rememberStd(a.dataset.stdGo); });

  function initMenu() {
    const btn = document.getElementById("practice-btn"), pop = document.getElementById("practice-menu");
    if (!btn || !pop) return;
    const close = () => { pop.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
    const open = () => {
      pop.innerHTML = `<div class="pm-list">${rowsHtml("")}</div><div class="pm-foot"><a href="#/practice">${ic("target")} Tất cả bài luyện</a><a href="#/notebook">${ic("notebook")} Sổ tay</a></div>`;
      pop.classList.add("open");
      const r = btn.getBoundingClientRect(), h = pop.offsetHeight;
      pop.style.top = Math.max(12, Math.min(r.top - 14, innerHeight - h - 12)) + "px";
      btn.setAttribute("aria-expanded", "true");
      const first = pop.querySelector("a"); if (first) first.focus({ preventScroll: true });
    };
    btn.onclick = (e) => { e.stopPropagation(); pop.classList.contains("open") ? close() : open(); };
    document.addEventListener("click", (e) => { if (pop.classList.contains("open") && !pop.contains(e.target) && e.target !== btn) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pop.classList.contains("open")) { close(); btn.focus(); } });
    window.addEventListener("hashchange", close);
    window.addEventListener("resize", close);
  }

  // ---------- Trang #/practice ----------
  function hub() {
    const p = pstate();
    const last = p.history.slice(0, 5);
    const html = `<h1>Luyện tập</h1><p class="subtitle">Chọn dạng bài và chuẩn HSK, rồi chọn cấp. Kết quả và câu sai được lưu lại để ôn.</p>
      <div class="pm-hub">${rowsHtml("card-row")}</div>
      <div class="grid grid-2 mt">
        <div class="card"><h3 style="margin-top:0">Lần luyện gần đây</h3>${last.length ? `<ul class="hist">${last.map((h) => `<li><span>${esc(h.title)}</span><span class="muted small">${new Date(h.at).toLocaleDateString("vi-VN")} · ${h.correct}/${h.total} · ${h.score} điểm</span></li>`).join("")}</ul>` : `<p class="muted small">Chưa có lần luyện nào.</p>`}</div>
        <div class="card"><h3 style="margin-top:0">Sổ tay</h3><p class="muted small">${Store.state.notebook.length} mục đã lưu từ các bài luyện.</p><a class="btn" href="#/notebook">${ic("notebook")} Mở sổ tay</a> <a class="btn" href="#/exam">${ic("exam")} Thi thử</a></div>
      </div>`;
    return {
      html,
      after() {}
    };
  }

  // ---------- #/practice/<key>/<std> ----------
  function view(key, std) {
    const f = feature(key);
    std = std === "hsk3" ? "hsk3" : "hsk2";
    if (f && f.std.includes(std)) rememberStd(std);
    if (!f || !f.std.includes(std)) return { html: `<div class="card center empty"><h2>Không có bài luyện này</h2><a class="btn btn-primary" href="#/practice">Về Luyện tập</a></div>` };
    const head = `<a class="backlink" href="#/practice">${ic("back")} Luyện tập</a>
      <div class="practice-head"><span class="pm-ic lg tone-${f.tone}">${ic(f.icon)}</span><div><div class="eyebrow">${STD[std].long}</div><h1 style="margin:0">${esc(nameIn(f, std))}</h1><p class="muted" style="margin:2px 0 0">${esc(f.desc)}</p></div></div>`;
    if (!ready(key)) {
      return { html: `${head}<div class="card center empty mt"><div class="big-ic">${ic("clock")}</div><h2>Đang xây dựng</h2><p class="muted">Bài luyện này sẽ có trong bản cập nhật tới.</p><a class="btn" href="#/practice">Chọn bài khác</a></div>` };
    }
    return { html: `${head}<div id="pbox" class="mt"></div>`, after(el) { impl[key].run(std, el.querySelector("#pbox")); } };
  }

  // ---------- Khung chung: màn chọn cấp / số câu / độ khó ----------
  // opts: { std, counts:[..], extra: html, title }  → onStart({level, count, diff, ...form})
  function setup(box, { std, counts = [10, 20, 30], levels, extra = "", bestKeyOf, onStart, intro = "" }) {
    const st = STD[std];
    const saved = (pstate().last || {})[std] || {};
    const lv = saved.level && (levels || st.levels).includes(saved.level) ? saved.level : (levels || st.levels)[0];
    // lựa chọn lần trước dùng chung giữa các bài; chỉ giữ nếu bài này có lựa chọn đó
    const cnt0 = counts.includes(saved.count) ? saved.count : counts[1] || counts[0];
    box.innerHTML = `<form class="card setup" id="setup">
      ${intro ? `<p class="muted" style="margin-top:0">${intro}</p>` : ""}
      <div class="setup-row"><div class="setup-label">Cấp ${st.name}</div><div class="chips" data-name="level">${(levels || st.levels).map((l) => `<button type="button" data-v="${l}" class="${l === lv ? "on" : ""}">${std === "hsk3" ? "" : "HSK "}${std === "hsk3" ? "Cấp " + l : l}<small>${wordsOf(std, l).length} từ</small></button>`).join("")}</div></div>
      <div class="setup-row"><div class="setup-label">Số câu</div><div class="chips" data-name="count">${counts.map((c) => `<button type="button" data-v="${c}" class="${c === cnt0 ? "on" : ""}">${c}</button>`).join("")}</div></div>
      <div class="setup-row"><div class="setup-label">Độ khó</div><div class="chips" data-name="diff">${[["easy", "Dễ"], ["normal", "Vừa"], ["hard", "Khó"]].map(([v, t]) => `<button type="button" data-v="${v}" class="${v === (saved.diff || "normal") ? "on" : ""}">${t}</button>`).join("")}</div></div>
      ${extra}
      <div class="setup-foot"><span class="muted small" id="bestline"></span><button class="btn btn-primary btn-lg" type="submit">${ic("play")} Bắt đầu</button></div></form>`;
    const form = box.querySelector("#setup");
    const read = () => {
      const v = {};
      form.querySelectorAll(".chips").forEach((c) => { const on = c.querySelector(".on"); v[c.dataset.name] = on ? on.dataset.v : null; });
      v.level = +v.level; v.count = +v.count;
      return v;
    };
    const showBest = () => { if (bestKeyOf) { const b = best(bestKeyOf(read())); box.querySelector("#bestline").innerHTML = b ? `${ic("trophy")} Điểm cao: <b>${b}</b>` : ""; } };
    form.querySelectorAll(".chips").forEach((c) => c.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      c.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      showBest();
    }));
    showBest();
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = read();
      const p = pstate(); p.last = p.last || {}; p.last[std] = { level: v.level, count: v.count, diff: v.diff }; Store.save();
      onStart(v);
    };
  }

  // ---------- Khung chung: màn kết quả ----------
  // r: { title, score, correct, total, seconds, wrong:[{hz,py,vi,note,id}], isBest, onRetryWrong, onAgain, from }
  function results(box, r) {
    const mm = Math.floor(r.seconds / 60), ss = String(r.seconds % 60).padStart(2, "0");
    box.innerHTML = `<div class="card center result-card">
        <div class="big-ic">${ic(r.isBest ? "trophy" : "check")}</div>
        <h2 style="margin:4px 0">${r.isBest ? "Kỷ lục mới!" : "Hoàn thành"}</h2>
        <div class="result-stats"><div><b>${r.score}</b><span>điểm</span></div><div><b>${r.correct}/${r.total}</b><span>đúng</span></div><div><b>${mm}:${ss}</b><span>thời gian</span></div></div>
      </div>
      ${r.wrong.length ? `<div class="card mt"><div class="row between"><h3 style="margin:0">Cần ôn lại (${r.wrong.length})</h3></div>
        <ul class="wrong-list">${r.wrong.map((w) => `<li class="${w.hz.length > 6 ? "is-sent" : ""}"><span class="zh wl-hz">${esc(w.hz)}</span><span class="wl-body"><span>${pyHtml(w.py || "")}</span><span class="muted">${esc(w.vi || "")}</span>${w.note ? `<span class="small muted">${esc(w.note)}</span>` : ""}</span>${speakBtn(w.say || w.hz)}</li>`).join("")}</ul></div>` : `<p class="muted center mt">Không có câu sai nào.</p>`}
      <div class="row mt result-actions">
        ${r.wrong.length && r.onRetryWrong ? `<button class="btn btn-primary" id="retry">${ic("repeat")} Ôn lại câu sai</button>` : ""}
        ${r.wrong.length ? `<button class="btn" id="tonb">${ic("notebook")} Thêm vào sổ tay</button>` : ""}
        <button class="btn" id="again">${ic("play")} Chơi lại</button>
        <a class="btn btn-ghost" href="#/practice">Bài khác</a></div>`;
    bindSpeak(box);
    const retry = box.querySelector("#retry"); if (retry) retry.onclick = r.onRetryWrong;
    const tonb = box.querySelector("#tonb"); if (tonb) tonb.onclick = () => { const n = addToNotebook(r.wrong, r.from); toast(n ? `Đã thêm ${n} mục vào sổ tay` : "Các mục này đã có trong sổ tay"); tonb.disabled = true; };
    box.querySelector("#again").onclick = r.onAgain;
    box.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  // ---------- Sổ tay #/notebook ----------
  function notebook() {
    pstate();
    const nb = Store.state.notebook;
    const html = `<h1>Sổ tay</h1><p class="subtitle">Những từ và câu bạn lưu lại từ các bài luyện tập.</p>
      ${nb.length ? `<div class="row mb"><button class="btn" id="nb-srs">${ic("plus")} Đưa các từ vào thẻ ôn tập</button></div>
      <ul class="wrong-list card nb-list">${nb.map((w, i) => `<li><span class="zh wl-hz">${esc(w.hz)}</span><span class="wl-body"><span>${pyHtml(w.py)}</span><span class="muted">${esc(w.vi)}</span><span class="small muted">${esc(w.from || "")}${w.note ? " · " + esc(w.note) : ""}</span></span>${speakBtn(w.hz)}<button class="btn btn-icon btn-sm" data-del="${i}" aria-label="Xoá khỏi sổ tay" title="Xoá">${ic("x")}</button></li>`).join("")}</ul>`
        : `<div class="card center empty"><div class="big-ic">${ic("notebook")}</div><h2>Sổ tay đang trống</h2><p class="muted">Sau mỗi bài luyện, bấm "Thêm vào sổ tay" để lưu các câu sai.</p><a class="btn btn-primary" href="#/practice">Đi luyện tập</a></div>`}`;
    return {
      html,
      after(el) {
        bindSpeak(el);
        el.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => {
          const i = +b.dataset.del, item = nb[i];
          nb.splice(i, 1); Store.save(); App.route();
          toast("Đã xoá khỏi sổ tay", { undo: () => { nb.splice(i, 0, item); Store.save(); App.route(); } });
        });
        const s = el.querySelector("#nb-srs");
        if (s) s.onclick = () => {
          const ids = nb.map((w) => w.id || (VOCAB.find((v) => v.hz === w.hz) || {}).id || (H3.byHz(w.hz) || {}).id).filter(Boolean);
          const n = SRS.addWords([...new Set(ids)]);
          App.updateBadge();
          toast(n ? `Đã thêm ${n} từ vào bộ thẻ ôn tập` : "Các từ này đã có trong bộ thẻ");
        };
      },
    };
  }

  window.Practice = { FEATURES, STD, register, ready, feature, nameIn, wordsOf, sentencesOf, glossary, tokens, lookup, viNorm, viBare, record, best, addToNotebook, setup, results, hub, view, notebook, initMenu, pstate };
})();
