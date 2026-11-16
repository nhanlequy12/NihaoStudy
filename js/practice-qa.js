// Luyện tập: Hỏi đáp – nghe / đọc một câu hỏi rồi chọn câu đáp tự nhiên nhất, luyện phản xạ hội thoại.
// Nội dung tự soạn cho web, nằm trong js/data/practice-qa-data.js (window.QA_ITEMS). Mỗi mục có id cố định;
// muốn gỡ một câu sau khi rà soát thì xoá mục đó hoặc thêm id vào window.QA_OFF.
// Thứ tự 4 phương án được xáo cố định theo id, nên mỗi câu luôn hiện giống nhau và rà soát được trước.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const KEY = "qa";
  const L4 = "ABCD";
  const SLOW = 0.6;

  // ---------- Dữ liệu ----------
  const all = () => {
    const off = new Set(window.QA_OFF || []);
    return (window.QA_ITEMS || []).filter((x) => !off.has(x.id));
  };
  const itemsOf = (std, level) => all().filter((x) => x.std === std && x.level === level);

  // Xáo cố định theo id (FNV-1a → mulberry32)
  function seedOf(s) {
    let h = 2166136261;
    for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rand(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function optionsOf(it) {
    const list = [{ zh: it.a, py: it.apy, vi: it.avi, ok: true }].concat(it.d.map((d) => ({ zh: d.zh, py: d.py, vi: d.vi, why: d.why, ok: false })));
    const r = rand(seedOf(it.id));
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    return list;
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    App.keyHandler = null;
    const levels = P().STD[std].levels.filter((l) => itemsOf(std, l).length);
    if (!levels.length) { box.innerHTML = `<div class="card center empty"><h2>Chưa có câu hỏi</h2><p class="muted">Phần này đang được soạn.</p></div>`; return; }
    P().setup(box, {
      std,
      levels,
      counts: [10, 15, 20],
      intro: "Đọc hoặc nghe một câu hỏi, rồi chọn câu đáp tự nhiên nhất trong bốn câu. Mỗi câu sai đều có giải thích vì sao không hợp.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> câu hỏi có pinyin và nghĩa, các phương án có pinyin. <b>Vừa:</b> chỉ có chữ Hán, nghĩa câu hỏi để trong nút Gợi ý. <b>Khó:</b> luyện nghe, máy đọc câu hỏi (nghe lại, nghe chậm được), chữ chỉ hiện sau khi bạn trả lời.</details>`,
      bestKeyOf: (v) => `${KEY}:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = itemsOf(std, v.level);
        if (!pool.length) { toast("Cấp này chưa có câu hỏi"); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count));
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items) {
    App.setFocus(true);
    const t0 = Date.now();
    const easy = cfg.diff === "easy", hard = cfg.diff === "hard";
    const feat = P().feature(KEY);
    let i = 0, score = 0, right = 0;
    const wrong = [];

    const say = (text, rate) => TTS.speak(text, rate ? { rate } : {});

    function questionHtml(it) {
      if (hard) {
        return `<div class="qa-listen" id="qa-listen">
            <button class="btn btn-primary qa-play" id="qa-play">${ic("headphones")} Nghe câu hỏi</button>
            <button class="btn qa-slow" id="qa-slow">${ic("clock")} Nghe chậm</button>
          </div>
          <div class="qa-hidden muted small" id="qa-qtext">Câu hỏi sẽ hiện ra sau khi bạn trả lời.</div>`;
      }
      return `<div class="qa-qrow"><div class="zh qa-qzh">${esc(it.q)}</div>${speakBtn(it.q)}</div>
        ${easy ? `<div class="qa-py">${pyHtml(it.qpy)}</div><div class="qa-vi">${esc(it.qvi)}</div>`
          : `<button class="btn btn-sm btn-ghost qa-hintbtn" id="qa-hint" aria-expanded="false">${ic("info")} Gợi ý</button>
             <div class="qa-hintbox" id="qa-hintbox" hidden><div class="qa-py">${pyHtml(it.qpy)}</div><div class="qa-vi">${esc(it.qvi)}</div></div>`}`;
    }

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const opts = optionsOf(it);
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card qa-card">
          <div class="qa-turn"><span class="qa-av" aria-hidden="true">${ic("chat")}</span><div class="qa-bubble" id="qa-bubble">${questionHtml(it)}</div></div>
          <div class="qa-ask small muted">Chọn câu đáp phù hợp nhất</div>
          <div class="options one-col qa-opts" id="opts">${opts.map((o, k) => `<button class="option qa-opt" data-k="${k}"><span class="opt-key">${L4[k]}</span><span class="qa-obody"><span class="qa-ozh">${esc(o.zh)}</span>${easy ? `<span class="qa-opy">${pyHtml(o.py)}</span>` : ""}</span></button>`).join("")}</div>
          <div class="small muted kbd-hint qa-kbd"><span class="kbd">A</span>–<span class="kbd">D</span> hoặc <span class="kbd">1</span>–<span class="kbd">4</span> để chọn · <span class="kbd">Enter</span> câu tiếp${hard ? ` · <span class="kbd">R</span> nghe lại` : !easy ? ` · <span class="kbd">G</span> gợi ý` : ""}</div>
          <div id="fb"></div>
        </div>`;
      bindSpeak(box);
      const hint = box.querySelector("#qa-hint");
      if (hint) hint.onclick = () => {
        const hb = box.querySelector("#qa-hintbox"), open = hb.hidden;
        hb.hidden = !open; hint.setAttribute("aria-expanded", String(open));
      };
      if (hard) {
        box.querySelector("#qa-play").onclick = () => say(it.q);
        box.querySelector("#qa-slow").onclick = () => say(it.q, SLOW);
        say(it.q);
      }
      box.querySelectorAll(".qa-opt").forEach((b) => b.onclick = () => choose(it, opts, +b.dataset.k));
      App.keyHandler = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
        const k = e.key.toLowerCase();
        const idx = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[k];
        const bs = box.querySelectorAll(".qa-opt");
        if (idx != null && bs[idx] && !bs[idx].disabled) { e.preventDefault(); bs[idx].click(); }
        else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) { e.preventDefault(); n.click(); } }
        else if (k === "r" && hard) { e.preventDefault(); say(it.q); }
        else if (k === "g" && hint) { e.preventDefault(); hint.click(); }
      };
    }

    function lineHtml(tag, cls, zh, py, vi) {
      return `<div class="qa-line"><span class="qa-tag ${cls}">${tag}</span><div class="qa-lbody"><div class="zh qa-lzh">${esc(zh)}</div><div class="qa-py">${pyHtml(py)}</div><div class="qa-vi">${esc(vi)}</div></div>${speakBtn(zh)}</div>`;
    }

    function choose(it, opts, k) {
      if (box.querySelector("#next")) return;
      const pick = opts[k], ok = pick.ok;
      box.querySelectorAll(".qa-opt").forEach((b, j) => {
        b.disabled = true;
        if (opts[j].ok) b.classList.add("correct");
        else if (j === k) b.classList.add("wrong");
        // sau khi trả lời thì hiện pinyin cho mọi phương án
        if (!easy) b.querySelector(".qa-obody").insertAdjacentHTML("beforeend", `<span class="qa-opy">${pyHtml(opts[j].py)}</span>`);
      });
      if (hard) {
        const q = box.querySelector("#qa-qtext");
        q.className = "qa-qrow";
        q.innerHTML = `<div class="zh qa-qzh">${esc(it.q)}</div>`;
      } else if (!easy) {
        const hb = box.querySelector("#qa-hintbox"), hint = box.querySelector("#qa-hint");
        if (hb) hb.hidden = false;
        if (hint) hint.remove();
      }
      if (ok) { score += 10; right++; }
      else wrong.push({ hz: `${it.q} ${it.a}`, py: `${it.qpy} ${it.apy}`, vi: `${it.qvi} – ${it.avi}`, say: it.q + it.a, note: `Bạn chọn: ${pick.zh}` });
      const others = opts.filter((o) => !o.ok && o !== pick);
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
          <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng rồi" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span></div>
          <div class="qa-dialog">${lineHtml("Hỏi", "", it.q, it.qpy, it.qvi)}${lineHtml("Đáp", "ok", it.a, it.apy, it.avi)}</div>
          <p class="qa-explain">${ic("info")}<span>${esc(it.explain)}</span></p>
          ${ok ? "" : `<div class="qa-mine"><div class="small muted">Bạn chọn</div><div><span class="zh">${esc(pick.zh)}</span> <span class="qa-py">${pyHtml(pick.py)}</span></div><div class="qa-vi">${esc(pick.vi)}</div><div class="qa-why">${ic("x")}<span>${esc(pick.why)}</span></div></div>`}
          <details class="small qa-others"><summary>Vì sao ${ok ? "ba" : "hai"} câu còn lại không hợp</summary><ul>${others.map((o) => `<li><span class="zh">${esc(o.zh)}</span> <span class="muted">${esc(o.vi)}</span><br>${esc(o.why)}</li>`).join("")}</ul></details>
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      if (window.speechSynthesis) speechSynthesis.cancel();
      const seconds = Math.round((Date.now() - t0) / 1000);
      const bestKey = `${KEY}:${std}:${cfg.level}:${cfg.diff}`;
      const isBest = P().record({ type: KEY, std, level: cfg.level, title: `${P().nameIn(feat, std)} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey });
      const again = items.filter((x) => wrong.some((w) => w.say === x.q + x.a));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from: P().nameIn(feat, std),
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  // ---------- Kiểm tra tự động (dùng khi rà soát) ----------
  function check() {
    const items = window.QA_ITEMS || [];
    const out = { total: items.length, counts: {}, dupIds: [], badOptions: [], missingPinyin: [], missingText: [], unstable: [], answerPos: [0, 0, 0, 0] };
    const seen = new Set();
    items.forEach((it) => {
      const k = `${it.std}-${it.level}`;
      out.counts[k] = (out.counts[k] || 0) + 1;
      if (seen.has(it.id)) out.dupIds.push(it.id);
      seen.add(it.id);
      const opts = optionsOf(it);
      if (opts.length !== 4 || new Set(opts.map((o) => o.zh)).size !== 4 || opts.filter((o) => o.ok).length !== 1) out.badOptions.push(it.id);
      if (!it.qpy || !it.apy || it.d.some((d) => !d.py)) out.missingPinyin.push(it.id);
      if (!it.q || !it.a || !it.qvi || !it.avi || !it.explain || it.d.some((d) => !d.zh || !d.vi || !d.why)) out.missingText.push(it.id);
      if (JSON.stringify(optionsOf(it)) !== JSON.stringify(opts)) out.unstable.push(it.id);
      out.answerPos[opts.findIndex((o) => o.ok)]++;
    });
    return out;
  }

  // Bảng TSV cho người rà soát: mỗi dòng một câu, kèm thứ tự phương án đúng như trên web
  function tsv() {
    const clean = (s) => String(s == null ? "" : s).replace(/[\t\n]/g, " ");
    const head = ["id", "chuẩn", "cấp", "hỏi", "hỏi_py", "hỏi_vi", "đáp", "đáp_py", "đáp_vi"];
    [1, 2, 3].forEach((n) => head.push(`nhiễu${n}`, `nhiễu${n}_py`, `nhiễu${n}_vi`, `nhiễu${n}_vì_sao`));
    head.push("giải_thích", "thứ_tự_trên_web", "đáp_án");
    const rows = (window.QA_ITEMS || []).map((it) => {
      const opts = optionsOf(it);
      const r = [it.id, it.std === "hsk3" ? "HSK 3.0" : "HSK cũ", it.level, it.q, it.qpy, it.qvi, it.a, it.apy, it.avi];
      it.d.forEach((d) => r.push(d.zh, d.py, d.vi, d.why));
      r.push(it.explain, opts.map((o, k) => `${L4[k]}. ${o.zh}`).join(" "), L4[opts.findIndex((o) => o.ok)]);
      return r.map(clean).join("\t");
    });
    return [head.join("\t")].concat(rows).join("\n") + "\n";
  }

  P().register(KEY, { run });
  window.QADrill = { all, itemsOf, optionsOf, check, tsv };
})();
