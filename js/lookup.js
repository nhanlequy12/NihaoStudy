// Tra nhanh: chạm vào chữ Hán trong bài đọc, hội thoại, câu ví dụ, từ điển để xem pinyin, Hán Việt, nghĩa.
// Tách từ bằng ghép dài nhất trước (tối đa 6 chữ) trên mọi từ đã có (HSK 2.0 + HSK 3.0).
// Chỉ bọc chữ thành từng từ khi người dùng chạm lần đầu vào một khối chữ, trang dài vẫn nhẹ.
// Tắt hẳn trong bài kiểm tra, thi thử, luyện tập, ôn thẻ và lộ trình để không lộ đáp án.
(function () {
  const HAN = /[㐀-鿿豈-﫿]/;
  const MAXLEN = 6;
  const LEVEL_COLOR = { 1: "blue", 2: "gold", 3: "green", 4: "red", 5: "purple", 6: "teal" };
  const levelOfId = (id) => (id <= 12 ? 1 : id <= 24 ? 2 : id <= 44 ? 3 : id <= 84 ? 4 : id <= 149 ? 5 : 6);

  // ---------- Chỉ mục chữ → từ (dựng một lần) ----------
  let INDEX = null;
  function index() {
    if (INDEX) return INDEX;
    INDEX = new Map();
    const add = (w) => { if (w && w.hz && !INDEX.has(w.hz)) INDEX.set(w.hz, w); };
    (window.VOCAB || []).forEach(add);
    if (window.H3 && H3.extraList) H3.extraList().forEach(add);
    return INDEX;
  }
  function find(hz, extra) {
    const get = (s) => (extra && extra.get(s)) || index().get(s) || null;
    // 点儿, 一会儿…: từ có đuôi 儿 hóa tra theo gốc nếu chưa có mục riêng
    return get(hz) || (hz.length > 1 && hz.endsWith("儿") ? get(hz.slice(0, -1)) : null);
  }
  // Tách một đoạn chữ thành [{ t, w }]; w = null với dấu câu / chữ chưa có trong dữ liệu (miss = true nếu là chữ Hán)
  function segment(text, extra) {
    const d = index(), out = [];
    const get = (s) => (extra && extra.get(s)) || d.get(s);
    const longest = (i, min) => {
      for (let len = Math.min(MAXLEN, text.length - i); len >= min; len--) { const w = get(text.slice(i, i + len)); if (w) return { w, len }; }
      return null;
    };
    let i = 0;
    while (i < text.length) {
      const m = HAN.test(text[i]) ? longest(i, 1) : null;
      if (m) { out.push({ t: text.slice(i, i + m.len), w: m.w }); i += m.len; continue; }
      const prev = out[out.length - 1];
      if (HAN.test(text[i]) && prev && prev.w) {
        // đuôi 儿 hóa (点儿, 玩儿): gắn vào từ đứng trước
        if (text[i] === "儿") { prev.t += "儿"; i++; continue; }
        // ghép trước ăn mất chữ đầu của từ sau (有时|候 → 有|时候): lùi một chữ nếu cả hai phía đều là từ
        if (prev.t.length > 1) {
          const back = get(prev.t.slice(0, -1)), m2 = back && longest(i - 1, 2);
          if (m2) { prev.t = prev.t.slice(0, -1); prev.w = back; out.push({ t: text.slice(i - 1, i - 1 + m2.len), w: m2.w }); i += m2.len - 1; continue; }
        }
      }
      if (HAN.test(text[i])) { out.push({ t: text[i], w: null, miss: true }); i++; }
      else {
        let j = i + 1;
        while (j < text.length && !HAN.test(text[j])) j++;
        out.push({ t: text.slice(i, j), w: null });
        i = j;
      }
    }
    return out;
  }
  // Chữ lẻ chưa có mục riêng: tìm từ ngắn nhất chứa nó
  function hostOf(ch) {
    let best = null;
    index().forEach((w) => { if (w.hz.length > 1 && w.hz.includes(ch) && (!best || w.hz.length < best.hz.length)) best = w; });
    return best;
  }

  const api = { segment, find, hostOf, index };
  window.Lookup = api;
  if (!window.document || !document.addEventListener) return;

  // ---------- Bật/tắt (mặc định bật) ----------
  const enabled = () => !(window.Store && Store.state && Store.state.settings && Store.state.settings.lookup === false);
  function setEnabled(on) {
    Store.state.settings.lookup = !!on;
    Store.save();
    document.documentElement.classList.toggle("lk-on", !!on);
    if (!on) close();
  }
  api.enabled = enabled;
  api.setEnabled = setEnabled;
  document.documentElement.classList.toggle("lk-on", enabled());

  // ---------- Nơi được tra ----------
  const route = () => location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  function routeAllowed() {
    const p = route();
    switch (p[0]) {
      case "read": return !!p[1];
      case "lesson": return (p[2] || "vocab") !== "quiz";
      case "dialogues": case "dictionary": case "words": case "notebook": return true;
      default: return false; // trang chủ, ôn tập, luyện tập, thi thử, lộ trình, luyện viết/nói…
    }
  }
  const TARGET = ".zh, .zh-serif, .hz, .rtok, .lk-w";
  // không bao giờ tra bên trong: câu hỏi, đáp án, bài thi, nút, liên kết, ô nhập, phần tử kéo thả
  const EXCLUDE = "#quiz, .quiz, .quiz-q, .options, .option, .exam, .practice, [data-exam], [data-practice], button, a, input, textarea, select, summary, label, [contenteditable=''], [contenteditable='true'], [draggable='true'], [data-say], #lk-pop";
  const allowed = (el) => routeAllowed() && !el.closest(EXCLUDE);

  // từ riêng của bài đọc đang mở (tên người, địa danh…)
  function readingExtra() {
    const p = route();
    if (p[0] !== "read" || !p[1] || !window.READINGS) return null;
    const r = READINGS.find((x) => x.id === p[1]);
    if (!r || !r.extra || !r.extra.length) return null;
    return new Map(r.extra.map((e) => [e.hz, Object.assign({ hv: "", extra: true }, e)]));
  }

  // ---------- Bọc chữ thành từng từ (lười, chỉ khi chạm lần đầu) ----------
  function wrap(host) {
    host.dataset.lk = "1";
    const extra = readingExtra();
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (HAN.test(n.data) && !(n.parentElement && n.parentElement.closest(".lk-w, " + EXCLUDE)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      segment(node.data, extra).forEach((k) => {
        if (!k.w && !k.miss) { frag.appendChild(document.createTextNode(k.t)); return; }
        const s = document.createElement("span");
        s.className = k.w ? "lk-w" : "lk-w lk-miss";
        s.tabIndex = 0;
        s.setAttribute("role", "button");
        s.textContent = k.t;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  // ---------- Hộp tra ----------
  let pop = null, cur = null, curExtra = null, lastFocus = null, pendingQ = null;
  const U = () => Views.util;
  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.id = "lk-pop";
    pop.className = "lk-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "false");
    pop.setAttribute("aria-labelledby", "lk-hd");
    pop.tabIndex = -1;
    pop.hidden = true;
    document.body.appendChild(pop);
    pop.addEventListener("click", onPopClick);
    return pop;
  }

  function levelPills(w) {
    const out = [];
    const lv = w.level || (typeof w.l === "number" ? levelOfId(w.l) : null);
    if (lv) out.push(`<span class="pill ${LEVEL_COLOR[lv] || ""}">HSK ${lv}</span>`);
    if (w.h3) out.push(`<span class="pill">HSK 3.0 · cấp ${w.h3}</span>`);
    if (typeof w.l === "number") out.push(`<a class="pill" href="#/lesson/${w.l}">${w.l > 300 ? "Bổ sung " + (w.l - 300) : "Bài " + w.l}</a>`);
    else if (w.h3l) out.push(`<a class="pill" href="#/lesson/${encodeURIComponent(w.h3l)}">Bài bổ sung 3.0</a>`);
    if (w.extra) out.push(`<span class="pill gold">Từ riêng của bài đọc</span>`);
    return out.join("");
  }
  function inNotebook(hz) { return ((Store.state && Store.state.notebook) || []).some((x) => x.hz === hz && !x.note); }

  function render(hz) {
    const { esc, pyHtml } = U();
    const w = find(hz, curExtra);
    const ch0 = encodeURIComponent([...hz][0]);
    const say = `<button type="button" class="btn btn-sm" data-lk="say">${ic("volume")}<span>Nghe</span></button>`;
    const dict = `<a class="btn btn-sm" href="#/dictionary" data-lk="dict">${ic("search")}<span>Mở từ điển</span></a>`;
    const write = `<a class="btn btn-sm" href="#/write/${ch0}">${ic("pen")}<span>Viết</span></a>`;
    let html;
    if (!w) {
      const host = [...hz].length === 1 ? hostOf(hz) : null;
      html = `<div class="lk-head"><div class="lk-hz zh" id="lk-hd" lang="zh-CN">${esc(hz)}</div><div class="lk-meta"><div class="muted">Chưa có trong dữ liệu</div></div>
        <button type="button" class="btn btn-icon btn-sm lk-x" data-lk="close" aria-label="Đóng">${ic("x")}</button></div>
        ${host ? `<p class="lk-vi">Chữ này có trong từ <button type="button" class="lk-link zh" data-lk-go="${esc(host.hz)}">${esc(host.hz)}</button> <span class="muted">(${pyHtml(host.py)}: ${esc(host.vi)})</span></p>` : `<p class="lk-vi muted small">Bạn vẫn có thể nghe và luyện viết chữ này.</p>`}
        <div class="lk-actions">${say}${write}${dict}</div>`;
    } else {
      const chars = [...w.hz];
      const hvs = (w.hv || "").trim().split(/\s+/);
      const parts = chars.length > 1 ? `<div class="lk-chars" aria-label="Từng chữ">${chars.map((c, i) => { const cw = find(c, curExtra); const hv = cw && cw.hv ? cw.hv.split(/[,;]/)[0] : hvs.length === chars.length ? hvs[i] : ""; return `<button type="button" class="lk-ch" data-lk-go="${esc(c)}" aria-label="Tra chữ ${esc(c)}"><span class="zh">${esc(c)}</span>${hv ? `<span class="small muted">${esc(hv)}</span>` : ""}</button>`; }).join("")}</div>` : "";
      const srs = w.id && window.SRS ? (SRS.has(w.id) ? `<span class="pill green lk-state">${ic("check")} Trong thẻ ôn</span>` : `<button type="button" class="btn btn-sm" data-lk="srs">${ic("plus")}<span>Thẻ ôn</span></button>`) : "";
      const nb = window.Practice && Practice.addToNotebook ? (inNotebook(w.hz) ? `<span class="pill green lk-state">${ic("check")} Trong sổ tay</span>` : `<button type="button" class="btn btn-sm" data-lk="nb">${ic("notebook")}<span>Sổ tay</span></button>`) : "";
      const ex = w.ex && w.ex[0] && w.ex[0] !== w.hz ? `<p class="lk-ex"><span class="zh" lang="zh-CN">${esc(w.ex[0])}</span><br><span class="muted small">${esc(w.ex[2] || "")}</span></p>` : "";
      html = `<div class="lk-head"><div class="lk-hz zh" id="lk-hd" lang="zh-CN">${esc(w.hz)}</div>
        <div class="lk-meta"><div class="lk-py">${pyHtml(w.py || "")}</div>${w.hv ? `<div class="lk-hv hv">${esc(w.hv)}</div>` : ""}</div>
        <button type="button" class="btn btn-icon btn-sm lk-x" data-lk="close" aria-label="Đóng">${ic("x")}</button></div>
        <div class="lk-pills">${levelPills(w)}</div>
        <p class="lk-vi">${esc(w.vi)}${w.pos ? ` <span class="muted small">· ${esc(w.pos)}</span>` : ""}</p>
        ${parts}${ex}
        <div class="lk-actions">${say}${srs}${nb}${dict}</div>`;
    }
    pop.dataset.hz = w ? w.hz : hz;
    pop.innerHTML = html;
  }

  function open(el, hz, extra) {
    ensurePop();
    if (cur && cur !== el) cur.classList.remove("lk-hl");
    if (!pop.hidden && cur === el && pop.dataset.hz === hz) { close(true); return; }
    cur = el;
    curExtra = extra || null;
    if (el) el.classList.add("lk-hl");
    if (!lastFocus || pop.hidden) lastFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : el;
    render(hz);
    pop.hidden = false;
    place();
    pop.focus({ preventScroll: true });
    requestAnimationFrame(() => pop.classList.add("show"));
  }
  function close(restore) {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    pop.classList.remove("show");
    if (cur) cur.classList.remove("lk-hl");
    const back = lastFocus;
    cur = null; curExtra = null; lastFocus = null;
    if (restore && back && back.isConnected && back.focus) back.focus({ preventScroll: true });
  }
  api.open = (hz, el) => open(el || null, hz, readingExtra());
  api.close = () => close(false);

  const phone = () => window.matchMedia && matchMedia("(max-width: 600px)").matches;
  function place() {
    if (!pop || pop.hidden) return;
    const sheet = phone() || !cur || !cur.isConnected;
    pop.classList.toggle("lk-sheet", sheet);
    if (sheet) {
      pop.style.left = pop.style.top = "";
      // giữ từ đang tra ở phía trên bảng
      if (cur && cur.isConnected) {
        const r = cur.getBoundingClientRect(), limit = innerHeight - pop.offsetHeight - 12;
        if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: "smooth" });
      }
      return;
    }
    const r = cur.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, m = 8;
    const left = Math.max(m, Math.min(r.left + r.width / 2 - pw / 2, innerWidth - pw - m));
    let top = r.bottom + 8;
    if (top + ph > innerHeight - m && r.top - 8 - ph >= m) top = r.top - 8 - ph;
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(Math.max(m, top)) + "px";
  }

  function onPopClick(e) {
    const go = e.target.closest("[data-lk-go]");
    if (go) { const keep = cur; open(keep, go.dataset.lkGo, curExtra); return; }
    const b = e.target.closest("[data-lk]");
    if (!b) { if (e.target.closest("a[href]")) close(false); return; }
    const hz = pop.dataset.hz, w = find(hz, curExtra);
    switch (b.dataset.lk) {
      case "close": close(true); break;
      case "say": if (window.TTS) TTS.speak(hz); break;
      case "srs": {
        SRS.addWords([w.id]);
        if (window.App && App.updateBadge) App.updateBadge();
        toast("Đã thêm vào bộ thẻ ôn tập", { undo: () => { SRS.remove(w.id); if (window.App && App.updateBadge) App.updateBadge(); if (!pop.hidden && pop.dataset.hz === hz) render(hz); } });
        render(hz); pop.focus({ preventScroll: true });
        break;
      }
      case "nb": {
        const n = Practice.addToNotebook([{ hz: w.hz, py: w.py, vi: w.vi, id: w.id || null }], "Tra nhanh");
        toast(n ? "Đã lưu vào sổ tay" : "Từ này đã có trong sổ tay");
        render(hz); pop.focus({ preventScroll: true });
        break;
      }
      case "dict": {
        pendingQ = hz;
        close(false);
        if (route()[0] === "dictionary") { e.preventDefault(); fillDict(); }
        break;
      }
    }
  }
  function fillDict() {
    const q = document.querySelector("#view #q");
    if (!q || pendingQ == null) return;
    q.value = pendingQ;
    pendingQ = null;
    q.dispatchEvent(new Event("input", { bubbles: true }));
    window.scrollTo(0, 0);
  }

  // ---------- Sự kiện ----------
  // Bài đọc đã tách từ sẵn (.rtok): hộp tra thay cho khung nghĩa cũ (bắt ở pha capture, trước onclick của từ)
  document.addEventListener("click", (e) => {
    if (!enabled() || !(e.target instanceof Element)) return;
    const t = e.target.closest("#rtext .rtok");
    if (!t || !allowed(t)) return;
    e.stopPropagation();
    open(t, t.textContent, readingExtra());
  }, true);

  document.addEventListener("click", (e) => {
    if (!enabled() || e.button || !(e.target instanceof Element)) return;
    const t = e.target;
    if (t.closest("#lk-pop")) return;
    let w = t.closest(".lk-w");
    if (!w) {
      const host = t.closest(TARGET);
      if (!host || host.dataset.lk || !allowed(host) || !HAN.test(host.textContent)) return;
      const sel = window.getSelection && getSelection();
      if (sel && !sel.isCollapsed && host.contains(sel.anchorNode)) return; // đang bôi đen để chép
      wrap(host);
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      w = hit && hit.closest(".lk-w");
      if (!w || !host.contains(w)) return;
    } else if (!allowed(w)) return;
    const sel = window.getSelection && getSelection();
    if (sel && !sel.isCollapsed && w.contains(sel.anchorNode)) return;
    open(w, w.textContent, readingExtra());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pop && !pop.hidden) { e.stopPropagation(); close(true); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target instanceof Element && e.target.matches(".lk-w, #rtext .rtok[tabindex]") && enabled() && allowed(e.target)) {
      e.preventDefault();
      open(e.target, e.target.textContent, readingExtra());
    }
  }, true);

  // chạm ra ngoài thì đóng
  document.addEventListener("pointerdown", (e) => {
    if (!pop || pop.hidden || !(e.target instanceof Element)) return;
    if (pop.contains(e.target) || e.target === cur) return;
    close(false);
  }, true);

  let raf = 0;
  const replace = () => { if (raf || !pop || pop.hidden || phone()) return; raf = requestAnimationFrame(() => { raf = 0; place(); }); };
  window.addEventListener("scroll", replace, { passive: true });
  window.addEventListener("resize", () => { if (pop && !pop.hidden) place(); });
  window.addEventListener("hashchange", () => close(false));

  // Sau mỗi lần app vẽ trang: từ trong bài đọc nhận được bằng bàn phím, ô từ điển nhận từ cần tra, thêm công tắc ở Cài đặt
  function afterRender() {
    const p = route();
    if (p[0] === "read" && p[1]) document.querySelectorAll("#rtext .rtok").forEach((t) => { t.tabIndex = 0; t.setAttribute("role", "button"); });
    if (p[0] === "dictionary") fillDict();
    if (p[0] === "settings") settingsCard();
  }
  function settingsCard() {
    const view = document.getElementById("view");
    if (!view || view.querySelector("#lk-setting")) return;
    const card = document.createElement("div");
    card.className = "card mt";
    card.innerHTML = `<h3 style="margin-top:0">Tra nhanh khi chạm vào chữ</h3>
      <label class="row" style="gap:10px;align-items:center"><input type="checkbox" id="lk-setting" ${enabled() ? "checked" : ""}> <span>Chạm vào chữ Hán trong bài đọc, hội thoại, câu ví dụ và từ điển để xem pinyin, Hán Việt, nghĩa. Luôn tắt trong bài kiểm tra và luyện tập.</span></label>`;
    view.appendChild(card);
    card.querySelector("#lk-setting").onchange = (e) => { setEnabled(e.target.checked); toast(e.target.checked ? "Đã bật tra nhanh" : "Đã tắt tra nhanh"); };
  }
  function observe() {
    const view = document.getElementById("view");
    if (!view) return;
    new MutationObserver(afterRender).observe(view, { childList: true });
    afterRender();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
})();
