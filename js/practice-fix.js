// Luyện tập: Sửa câu sai – tìm chỗ sai ngữ pháp trong câu và hiểu vì sao sai.
// Câu sai tự soạn trong js/data/practice-fix-data.js (window.FIX_ITEMS), mỗi câu đúng một lỗi, chia 4 đoạn A–D.
// Dễ: có gợi ý loại lỗi, chọn đoạn sai. Vừa: chọn đoạn sai, không gợi ý.
// Khó: chọn câu sai trong 4 câu; 3 câu đúng là câu ví dụ của web cùng chuẩn, cùng cấp, chọn cố định theo mã câu.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const L4 = "ABCD";
  const KEY = "fix";
  const PUNCT = /[，。！？、；：“”‘’（）《》…—,.!?;:"'()·\s]/;

  const all = () => window.FIX_ITEMS || [];
  const itemsOf = (std, level) => all().filter((x) => x.std === std && x.level === level);

  // Chỗ khác nhau giữa câu sai và câu đúng (tiền tố chung + hậu tố chung)
  function fixOf(it) {
    if (it._fix) return it._fix;
    const a = it.wrong, b = it.correct;
    let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++;
    let s = 0; while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
    // Thay từ (认为 → 以为): nới chỗ tô ra đủ cả từ theo từ điển của web, tối đa 2 chữ mỗi bên
    if (p < a.length - s && p < b.length - s) {
      const cuts = (t) => { const set = new Set([0]); let k = 0; P().tokens(t).forEach((x) => { k += x.t.length; set.add(k); }); return set; };
      const ca = cuts(a), cb = cuts(b);
      for (let n = 0; n < 2 && p > 0 && !(ca.has(p) && cb.has(p)); n++) p--;
      for (let n = 0; n < 2 && s > 0 && !(ca.has(a.length - s) && cb.has(b.length - s)); n++) s--;
    }
    return (it._fix = { at: p, del: a.slice(p, a.length - s), ins: b.slice(p, b.length - s) });
  }

  // Băm chuỗi ổn định để chọn câu đúng cho mức Khó
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const grams = (s, n) => { const t = [...s].filter((c) => !PUNCT.test(c)).join(""), out = new Set(); for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out; };

  // 3 câu đúng cho mức Khó: câu ví dụ của web cùng chuẩn/cấp, dài gần bằng câu sai, không trùng nội dung với câu đã soạn
  const hardCache = new Map();
  function hardOthers(it) {
    if (hardCache.has(it.id)) return hardCache.get(it.id);
    const own = new Set([...grams(it.correct, 3), ...grams(it.wrong, 3)]);
    const L = it.wrong.length;
    const cands = P().sentencesOf(it.std, it.level)
      .filter((s) => /[。！？]$/.test(s.zh) && s.zh !== it.correct && s.zh !== it.wrong && ![...grams(s.zh, 3)].some((g) => own.has(g)))
      .sort((x, y) => hash(it.id + "|" + x.zh) - hash(it.id + "|" + y.zh));
    const out = [];
    for (const tol of [2, 4, 7, 99]) {
      for (const c of cands) { if (out.length >= 3) break; if (Math.abs(c.zh.length - L) <= tol && !out.includes(c)) out.push(c); }
      if (out.length >= 3) break;
    }
    hardCache.set(it.id, out);
    return out;
  }

  // Câu sai, đoạn lỗi tô đỏ (chèn: dấu ‸ ở chỗ thiếu)
  function wrongHtml(it) {
    const f = fixOf(it), w = it.wrong;
    const mid = f.del ? `<mark class="fx-del">${esc(f.del)}</mark>` : `<span class="fx-caret" aria-label="thiếu từ ở đây">‸</span>`;
    return esc(w.slice(0, f.at)) + mid + esc(w.slice(f.at + f.del.length));
  }
  // Câu đúng, phần sửa tô xanh
  function correctHtml(it) {
    const f = fixOf(it), c = it.correct;
    const mid = f.ins ? `<mark class="fx-ins">${esc(f.ins)}</mark>` : "";
    return esc(c.slice(0, f.at)) + mid + esc(c.slice(f.at + f.ins.length));
  }
  function fixNote(it) {
    const f = fixOf(it);
    if (f.del && f.ins) return `Đổi <b class="zh">${esc(f.del)}</b> → <b class="zh">${esc(f.ins)}</b>`;
    if (f.del) return `Bỏ <b class="zh">${esc(f.del)}</b>`;
    return `Thêm <b class="zh">${esc(f.ins)}</b>`;
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    App.keyHandler = null;
    P().setup(box, {
      std,
      counts: [5, 10, 20],
      intro: "Mỗi câu có đúng một lỗi ngữ pháp hoặc dùng từ. Tìm chỗ sai, rồi xem câu đã sửa và lời giải thích.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> câu chia thành 4 đoạn A–D, có gợi ý loại lỗi; chọn đoạn sai. <b>Vừa:</b> như Dễ nhưng không có gợi ý. <b>Khó:</b> 4 câu hoàn chỉnh, chọn câu sai.<br>Trên máy tính: bấm <span class="kbd">A</span>–<span class="kbd">D</span> hoặc <span class="kbd">1</span>–<span class="kbd">4</span> để chọn, <span class="kbd">Enter</span> sang câu tiếp.</details>`,
      bestKeyOf: (v) => `${KEY}:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = itemsOf(std, v.level);
        if (!pool.length) { toast("Cấp này chưa có câu luyện", { type: "info" }); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count));
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items) {
    App.setFocus(true);
    const t0 = Date.now();
    const hard = cfg.diff === "hard", easy = cfg.diff === "easy";
    let i = 0, score = 0, right = 0;
    const wrong = [];

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      let body;
      if (hard) {
        const opts = shuffle([{ zh: it.wrong, bad: true }, ...hardOthers(it).map((s) => ({ zh: s.zh, py: s.py, vi: s.vi }))]);
        it._opts = opts;
        body = `<div class="fx-ask">Câu nào <b>sai</b>?</div>
          <div class="options one-col fx-opts">${opts.map((o, k) => `<button class="option fx-opt" data-k="${k}"><span class="opt-key">${L4[k]}</span><span class="zh fx-opt-zh">${esc(o.zh)}</span></button>`).join("")}</div>`;
      } else {
        body = `<div class="fx-ask">Đoạn nào trong câu bị <b>sai</b>?</div>
          ${easy ? `<div class="fx-hint"><span class="pill gold">${ic("info")} Gợi ý: ${esc(it.type)}</span></div>` : ""}
          <div class="fx-segs" role="group" aria-label="Các đoạn của câu">${it.segments.map((s, k) => `<button class="fx-seg" data-k="${k}" aria-label="Đoạn ${L4[k]}: ${esc(s)}"><span class="zh fx-seg-zh">${esc(s)}</span><span class="fx-seg-key">${L4[k]}</span></button>`).join("")}</div>`;
      }
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card fx-card">${body}<div class="small muted kbd-hint fx-kbd"><span class="kbd">A</span>–<span class="kbd">D</span> hoặc <span class="kbd">1</span>–<span class="kbd">4</span> để chọn</div><div id="fb"></div></div>`;
      const btns = [...box.querySelectorAll("[data-k]")];
      btns.forEach((b) => b.onclick = () => answer(it, +b.dataset.k, btns));
      App.keyHandler = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const k = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[e.key.toLowerCase()];
        if (k != null && btns[k] && !btns[k].disabled) { e.preventDefault(); btns[k].click(); }
        else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) { e.preventDefault(); n.click(); } }
      };
    }

    function answer(it, k, btns) {
      if (btns[0].disabled) return;
      const ans = hard ? it._opts.findIndex((o) => o.bad) : it.bad;
      const ok = k === ans;
      btns.forEach((b) => { b.disabled = true; });
      btns[ans].classList.add("fx-answer");
      if (!ok) btns[k].classList.add("fx-miss");
      if (hard) btns[ans].querySelector(".fx-opt-zh").innerHTML = wrongHtml(it);
      if (ok) { score += 10; right++; }
      else wrong.push({ hz: it.correct, py: it.py, vi: it.vi, say: it.correct, note: `Câu sai: ${it.wrong} · ${it.type}`, id: null, _id: it.id });
      feedback(it, ok, k, ans);
    }

    function feedback(it, ok, k, ans) {
      const fb = box.querySelector("#fb");
      const picked = hard ? (ok ? "" : `Câu ${L4[k]} là câu đúng; câu sai là câu ${L4[ans]}.`) : (ok ? "" : `Bạn chọn đoạn ${L4[k]}; lỗi nằm ở đoạn ${L4[ans]}.`);
      fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"} fx-fb">
          <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Chính xác" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span>${picked ? `<span class="small fx-picked">${esc(picked)}</span>` : ""}</div>
          <div class="fx-line"><span class="fx-lab">Câu sai</span><span class="zh fx-zh">${wrongHtml(it)}</span></div>
          <div class="fx-line"><span class="fx-lab">Sửa lại</span><span class="fx-right"><span class="zh fx-zh">${correctHtml(it)}</span>${speakBtn(it.correct)}</span></div>
          <div class="fx-py">${pyHtml(it.py)}</div>
          <div class="fx-vi">${esc(it.vi)}</div>
          <div class="fx-why"><span class="pill gold">${esc(it.type)}</span> <span class="small fx-note">${fixNote(it)}</span><p>${esc(it.explain)}</p></div>
          ${hard ? hardList(it) : ""}
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    // Mức Khó: nghĩa của 3 câu đúng để người học không bỏ phí
    function hardList(it) {
      const others = it._opts.filter((o) => !o.bad);
      return `<details class="small fx-others"><summary>Ba câu đúng còn lại</summary><ul>${others.map((o) => `<li><span class="zh">${esc(o.zh)}</span><span>${pyHtml(o.py || "")}</span><span class="muted">${esc(o.vi || "")}</span></li>`).join("")}</ul></details>`;
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const f = P().feature(KEY);
      const isBest = P().record({ type: KEY, std, level: cfg.level, title: `${P().nameIn(f, std)} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey: `${KEY}:${std}:${cfg.level}:${cfg.diff}` });
      const again = items.filter((x) => wrong.some((w) => w._id === x.id));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from: P().nameIn(f, std),
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register(KEY, { run });

  // Dùng cho kiểm thử và rà soát: toàn bộ câu kèm 3 câu đúng của mức Khó
  function exportAll() {
    return all().map((it) => Object.assign({}, it, { fix: fixOf(it), hard: hardOthers(it).map((s) => ({ zh: s.zh, py: s.py, vi: s.vi, word: s.word.hz })) }));
  }
  window.FixDrill = { itemsOf, fixOf, hardOthers, exportAll };
})();
