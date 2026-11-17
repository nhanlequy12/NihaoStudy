// Luyện tập: Sắp xếp câu – kéo thả (hoặc bấm) các cụm từ thành câu đúng.
// Câu lấy từ câu ví dụ tự soạn của web. Mỗi câu được chia cụm cố định; chỉ dùng các câu đã rà soát là chỉ có
// một trật tự đúng (danh sách ORDER_OK trong js/data/practice-order-data.js: mã câu → vị trí ranh giới các cụm).
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const PER_LEVEL = 100;
  const RANGE = { easy: [3, 4], normal: [4, 6], hard: [5, 8] };
  const ATTACH = new Set("了 的 吗 呢 吧 啊 呀 着 过 得 地 么 嘛".split(" "));
  const NUM = /^([一二两三四五六七八九十百千万几半每这那哪]+|[0-9]+)$/;
  const PUNCT = /^[\s，。！？、；：“”‘’（）《》…—,.!?;:"'()·]+$/;

  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const idOf = (zh) => hash(zh).toString(36);

  // tách phần thân câu và dấu câu cuối (dấu cuối giữ cố định, không thành cụm)
  function split(zh) {
    const m = zh.match(/[。！？.!?…]+$/);
    return m ? [zh.slice(0, -m[0].length), m[0]] : [zh, ""];
  }
  // Chia cụm tự động (chế độ sinh): token → gộp trợ từ, số + lượng từ, dấu câu giữa câu → gộp bớt cho tối đa 8 cụm
  function autoChunks(body) {
    const toks = P().tokens(body);
    const units = [];
    toks.forEach((x, k) => {
      const last = units[units.length - 1];
      const isMw = x.w && /lượng từ/.test(x.w.pos || "");
      if (last && (x.p || PUNCT.test(x.t) || ATTACH.has(x.t) || (isMw && NUM.test(last)))) units[units.length - 1] = last + x.t;
      else units.push(x.t);
    });
    while (units.length > 8) {          // gộp cặp liền kề ngắn nhất
      let best = 0;
      for (let k = 1; k < units.length - 1; k++) if (units[k].length + units[k + 1].length < units[best].length + units[best + 1].length) best = k;
      units.splice(best, 2, units[best] + units[best + 1]);
    }
    return units;
  }
  const bounds = (chunks) => { let s = 0; return chunks.slice(0, -1).map((c) => (s += c.length)); };
  const fromBounds = (body, b) => { const out = []; let s = 0; [...b, body.length].forEach((e) => { out.push(body.slice(s, e)); s = e; }); return out; };

  function makeItem(s, b) {
    const [body, end] = split(s.zh);
    const chunks = b ? fromBounds(body, b) : autoChunks(body);
    if (chunks.length < 3 || chunks.join("") !== body) return null;
    // xáo cố định theo câu, không trùng thứ tự đúng
    const r = rng(hash(s.zh));
    let order = chunks.map((_, k) => k);
    for (let tries = 0; tries < 10 && order.every((v, k) => v === k); tries++) {
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    }
    if (order.every((v, k) => v === k)) order = order.slice(1).concat(order[0]);
    return { id: idOf(s.zh), zh: s.zh, py: s.py, vi: s.vi, word: s.word, chunks, end, order, n: chunks.length };
  }
  const fits = (it, diff) => it.n >= RANGE[diff][0] && it.n <= RANGE[diff][1];

  // gen = true: mọi ứng viên (để rà soát); mặc định: chỉ câu đã duyệt
  const memo = {};
  function itemsOf(std, level, gen) {
    const mk = std + level + (gen ? "g" : "");
    if (memo[mk]) return memo[mk];
    const ok = window.ORDER_OK || {}, out = [], seen = new Set();
    P().sentencesOf(std, level).forEach((s) => {
      if (seen.has(s.zh)) return; seen.add(s.zh);
      const id = idOf(s.zh);
      if (!gen && !ok[id]) return;
      const it = makeItem(s, gen ? null : ok[id]);
      if (it) out.push(it);
    });
    if (gen) {
      const L = (it) => [...it.zh].filter((c) => /[㐀-鿿]/.test(c)).length;
      out.sort((a, b) => ((L(a) < 6 || L(a) > 16) - (L(b) < 6 || L(b) > 16)) || (a.id < b.id ? -1 : 1));
      out.splice(PER_LEVEL);
    }
    return (memo[mk] = out);
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    P().setup(box, {
      std,
      counts: [10, 15, 20],
      intro: "Sắp xếp các cụm từ thành câu đúng. Kéo thả, hoặc bấm vào cụm để đưa lên dòng trả lời.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó và phím tắt</summary><b>Dễ:</b> 3–4 cụm, có bản dịch. <b>Vừa:</b> 4–6 cụm, bản dịch trong gợi ý. <b>Khó:</b> 5–8 cụm, không gợi ý.<br>Phím số chọn cụm, <span class="kbd">Backspace</span> bỏ cụm cuối, <span class="kbd">Enter</span> kiểm tra.</details>`,
      bestKeyOf: (v) => `order:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = itemsOf(std, v.level).filter((it) => fits(it, v.diff));
        if (!pool.length) { toast("Cấp này chưa có câu cho độ khó này"); return; }
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

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const easy = cfg.diff === "easy", normal = cfg.diff === "normal";
      let answer = [];                        // chỉ số cụm trên dòng trả lời
      let done = false;
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card tr-card od-card">
          ${easy ? `<div class="muted od-vi">${esc(it.vi)}</div>` : normal ? `<div class="od-vi"><button class="btn btn-sm btn-ghost" id="hint">${ic("info")} Gợi ý nghĩa</button><span id="hintv" class="muted"></span></div>` : ""}
          <div class="od-answer" id="ans" aria-label="Dòng trả lời"><span class="od-empty muted small">Kéo hoặc bấm các cụm bên dưới vào đây</span></div>
          <div class="od-bank" id="bank" aria-label="Các cụm từ"></div>
          <div class="row mt between"><span class="small muted kbd-hint"><span class="kbd">1–9</span> chọn cụm · <span class="kbd">Backspace</span> bỏ cụm cuối · <span class="kbd">Enter</span> kiểm tra</span>
            <span class="row"><button class="btn" id="reset">${ic("repeat")} Làm lại</button><button class="btn btn-primary" id="check">${ic("check")} Kiểm tra</button></span></div>
          <div id="fb"></div>
        </div>`;
      const ans = box.querySelector("#ans"), bank = box.querySelector("#bank");
      const hb = box.querySelector("#hint"); if (hb) hb.onclick = () => { box.querySelector("#hintv").textContent = it.vi; hb.remove(); };

      // Vẽ lại hai vùng; hiệu ứng FLIP cho chuyển động mượt
      // from: vị trí bắt đầu của một cụm (khi thả từ bóng kéo), để cụm trượt từ chỗ ngón tay về chỗ mới
      const calm = matchMedia("(prefers-reduced-motion: reduce)");
      function render(from) {
        const before = new Map();
        box.querySelectorAll(".od-chip").forEach((c) => before.set(c.dataset.k, c.getBoundingClientRect()));
        if (from) before.set(String(from.k), from.rect);
        const chip = (k, n) => `<button type="button" class="od-chip zh" data-k="${k}">${n != null ? `<small>${n}</small>` : ""}${esc(it.chunks[k])}</button>`;
        ans.innerHTML = (answer.length ? answer.map((k) => chip(k)).join("") : `<span class="od-empty muted small">Kéo hoặc bấm các cụm bên dưới vào đây</span>`) + (it.end ? `<span class="od-end zh">${esc(it.end)}</span>` : "");
        const inBank = it.order.filter((k) => !answer.includes(k));
        bank.innerHTML = inBank.map((k, n) => chip(k, n + 1)).join("") || `<span class="muted small">Đã dùng hết các cụm</span>`;
        box.querySelectorAll(".od-chip").forEach((c) => {
          const a = before.get(c.dataset.k); if (!a) return;
          const b = c.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
          if ((dx || dy) && !calm.matches) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
        });
      }
      const move = (k, toAns, at, from) => {
        if (done) return;
        answer = answer.filter((x) => x !== k);
        if (toAns) answer.splice(at == null ? answer.length : at, 0, k);
        render(from);
      };

      // Bấm: chuyển qua lại giữa hai vùng
      box.querySelector(".od-card").addEventListener("click", (e) => {
        const c = e.target.closest(".od-chip"); if (!c || c.dataset.dragged) { if (c) delete c.dataset.dragged; return; }
        const k = +c.dataset.k;
        move(k, !answer.includes(k));
      });

      // Kéo thả bằng Pointer Events (chuột và cảm ứng)
      let drag = null;
      box.querySelector(".od-card").addEventListener("pointerdown", (e) => {
        const c = e.target.closest(".od-chip"); if (!c || done || e.button > 0) return;
        drag = { c, k: +c.dataset.k, x: e.clientX, y: e.clientY, moved: false, ghost: null, id: e.pointerId };
      });
      // vị trí chèn theo điểm thả: trước cụm đầu tiên có tâm nằm sau điểm thả (theo hàng, rồi theo cột)
      const inAnswer = (e) => { const o = ans.getBoundingClientRect(); return e.clientX >= o.left && e.clientX <= o.right && e.clientY >= o.top - 20 && e.clientY <= o.bottom + 20; };
      const dropIndex = (e, k) => {
        const chips = [...ans.querySelectorAll(".od-chip")].filter((x) => +x.dataset.k !== k);
        for (let n = 0; n < chips.length; n++) {
          const r = chips[n].getBoundingClientRect();
          if (e.clientY < r.top) return { at: n, el: chips[n] };
          if (e.clientY <= r.bottom && e.clientX < r.left + r.width / 2) return { at: n, el: chips[n] };
        }
        return { at: chips.length, el: null };
      };
      const caret = document.createElement("span"); caret.className = "od-caret"; caret.setAttribute("aria-hidden", "true");
      const onMove = (e) => {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
        e.preventDefault();
        if (!drag.moved) {
          drag.moved = true;
          const r = drag.c.getBoundingClientRect();
          drag.ghost = drag.c.cloneNode(true); drag.ghost.classList.add("od-ghost");
          // đặt bóng kéo một lần, sau đó chỉ đổi transform: không tính lại bố cục mỗi lần ngón tay di chuyển
          Object.assign(drag.ghost.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px" });
          document.body.appendChild(drag.ghost); drag.c.classList.add("od-lifted");
          try { drag.c.setPointerCapture(drag.id); } catch (err) {}
        }
        drag.ghost.style.transform = `translate3d(${e.clientX - drag.x}px, ${e.clientY - drag.y}px, 0) rotate(-2deg) scale(1.05)`;
        const over = inAnswer(e);
        ans.classList.toggle("od-over", over);
        if (over) { const d = dropIndex(e, drag.k); const end = ans.querySelector(".od-end"); ans.insertBefore(caret, d.el || end || null); } else caret.remove();
      };
      const onUp = (e) => {
        if (!drag) return;
        const d = drag; drag = null;
        if (!d.moved) return;
        d.c.dataset.dragged = "1";
        const from = { k: d.k, rect: d.ghost.getBoundingClientRect() };
        caret.remove(); d.ghost.remove(); ans.classList.remove("od-over");
        // cụm trượt từ chỗ thả về vị trí mới (hoặc về lại khay nếu thả ra ngoài)
        if (inAnswer(e)) move(d.k, true, dropIndex(e, d.k).at, from);
        else move(d.k, false, null, from);
        setTimeout(() => { const c = box.querySelector(`.od-chip[data-k="${d.k}"]`); if (c) delete c.dataset.dragged; }, 0);
      };
      document.addEventListener("pointermove", onMove, { passive: false });
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
      const unbind = () => { document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerup", onUp); document.removeEventListener("pointercancel", onUp); };

      box.querySelector("#reset").onclick = () => { answer = []; render(); };
      const check = () => {
        if (done) return;
        if (answer.length < it.n) { toast("Hãy xếp hết các cụm lên dòng trả lời", { type: "info" }); return; }
        done = true; unbind();
        const want = it.chunks, got = answer.map((k) => it.chunks[k]);
        const ok = got.join("") === want.join("");
        if (ok) { score += 10; right++; }
        else wrong.push({ hz: it.zh, py: it.py, vi: it.vi, say: it.zh, note: `Bạn xếp: ${got.join(" ")}${it.end}` });
        ans.querySelectorAll(".od-chip").forEach((c, n) => { c.classList.add(got[n] === want[n] ? "good" : "bad"); c.disabled = true; });
        bank.querySelectorAll(".od-chip").forEach((c) => (c.disabled = true));
        box.querySelector("#check").remove(); box.querySelector("#reset").remove();
        const fb = box.querySelector("#fb");
        fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
            <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span></div>
            <div class="small muted">Câu đúng</div>
            <div class="od-model zh">${want.map((c) => `<span>${esc(c)}</span>`).join("")}${esc(it.end)}</div>
            <div class="tr-zh-row"><div>${pyHtml(it.py)}</div>${speakBtn(it.zh)}</div>
            <div class="muted">${esc(it.vi)}</div>
            ${!ok ? `<div class="small tr-why">Các cụm tô đỏ trên dòng trả lời là cụm đặt sai chỗ.</div>` : ""}
            <div class="small tr-key">Từ trọng tâm: <b class="zh">${esc(it.word.hz)}</b> ${pyHtml(it.word.py)} – ${esc(it.word.vi)}</div>
            <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
          </div>`;
        bindSpeak(fb);
        fb.querySelector("#next").onclick = () => { i++; show(); };
        fb.querySelector("#next").focus({ preventScroll: true });
        fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
      box.querySelector("#check").onclick = check;
      App.keyHandler = (e) => {
        if (e.key === "Enter") { const n = box.querySelector("#next"); n ? n.click() : check(); return; }
        if (done) return;
        if (e.key === "Backspace") { e.preventDefault(); if (answer.length) move(answer[answer.length - 1], false); return; }
        if (/^[1-9]$/.test(e.key)) { const inBank = it.order.filter((k) => !answer.includes(k)); const k = inBank[+e.key - 1]; if (k != null) move(k, true); }
      };
      window.addEventListener("hashchange", unbind, { once: true });
      render();
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const from = P().nameIn(P().feature("order"), std);
      const isBest = P().record({ type: "order", std, level: cfg.level, title: `${from} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey: `order:${std}:${cfg.level}:${cfg.diff}` });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.zh));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from,
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register("order", { run });
  window.OrderDrill = { itemsOf, makeItem, autoChunks, bounds, fits };   // dùng cho kiểm thử và rà soát
})();
