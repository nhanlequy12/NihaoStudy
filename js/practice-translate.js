// Luyện dịch: dịch câu tiếng Trung sang tiếng Việt, chấm theo ý chính.
// Câu lấy từ câu ví dụ tự soạn của từng từ (HSK cũ: bài 1–149; HSK 3.0: đề cương 2025).
// Máy chỉ chấm gần đúng (so ý chính với bản dịch mẫu), nên người học có thể tự xác nhận "Tôi dịch đúng ý".
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => Practice;

  // ---------- Chấm theo ý chính ----------
  // Hư từ và đại từ không tính vào ý chính (người dịch có thể thay "tôi" bằng "mình", bỏ "thì", "là"…)
  const STOP = new Set("là của và thì mà các những cái này kia đó ấy rồi đã sẽ đang được bị ở với cho để một rất lắm quá nhé nhỉ à ạ ơi vậy thế hãy nhá".split(" "));
  const PRON = new Set("tôi mình tớ ta chúng bạn cậu anh chị em ông bà cô chú nó họ hắn".split(" "));
  const NEG = /(^| )(không|chưa|đừng|chẳng|chớ|cấm|chả)( |$)/;
  const NEG_FALSE = /không (khí|gian|trung|quân|phận|lâu|ngờ|chỉ|những)|hàng không|(có|được|chưa|đúng|phải|nhé) không$/g;
  const hasDia = (s) => /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s);
  const BARE = (s) => P().viBare(s);
  const NORM = (s) => P().viNorm(s);
  const sylls = (s) => s.split(" ").filter(Boolean);
  // ý chính = các âm tiết thực; nếu câu chỉ toàn đại từ/hư từ (我们是朋友 → "Chúng tôi là bạn") thì giữ cả đại từ
  const content = (s) => {
    const all = sylls(s), c = [...new Set(all.filter((x) => !STOP.has(x) && !PRON.has(x)))];
    return c.length >= 2 ? c : [...new Set(all.filter((x) => !STOP.has(x)))];
  };
  const negOf = (s) => NEG.test(s.replace(NEG_FALSE, " "));

  function glossesOf(w) {
    return String(w.vi || "").split(/[,;，；]/).map((g) => g.replace(/\(.*?\)/g, " ").replace(/…|\.\.\./g, " ").trim()).filter((g) => g.length > 0);
  }

  function grade(item, answer) {
    const bare = !hasDia(answer);
    const f = bare ? BARE : NORM;
    const ans = f(answer), model = f(item.vi);
    const A = new Set(sylls(ans)), M = content(model);
    const hit = M.filter((x) => A.has(x));
    const recall = M.length ? hit.length / M.length : 1;
    const keyOk = glossesOf(item.word).some((g) => { const gs = sylls(f(g)); return gs.length && gs.every((x) => A.has(x)); });
    const negM = negOf(model), negA = negOf(ans);
    let verdict, why = [];
    if (!ans) { verdict = "wrong"; why.push("Chưa nhập bản dịch."); }
    else if (negM !== negA) { verdict = "wrong"; why.push(negM ? "Câu gốc có ý phủ định (不 / 没 / 别…) nhưng bản dịch chưa có." : "Bản dịch có ý phủ định mà câu gốc không có."); }
    else if (M.length <= 2 ? recall === 1 : recall >= 0.75 || (recall >= 0.6 && keyOk)) verdict = "right";
    else if (recall >= 0.35 || keyOk) verdict = "close";
    else verdict = "wrong";
    if (verdict !== "right" && ans && negM === negA) {
      if (!keyOk) why.push(`Chưa thấy nghĩa của từ trọng tâm ${item.word.hz} (${item.word.vi}).`);
      why.push(`Khớp ${hit.length}/${M.length} ý trong bản dịch mẫu.`);
    }
    if (bare && ans) why.push("Bạn gõ không dấu nên máy so không dấu.");
    return { verdict, recall, keyOk, hitSet: new Set(hit), bare, why };
  }

  // Tô bản dịch mẫu: chữ đã có trong bài làm (xanh), ý còn thiếu (gạch chân)
  function markModel(vi, g) {
    const f = g.bare ? BARE : NORM;
    return vi.split(/(\s+)/).map((tok) => {
      const k = f(tok);
      if (!k) return esc(tok);
      if (g.hitSet.has(k)) return `<span class="tm-hit">${esc(tok)}</span>`;
      if (!STOP.has(k) && !PRON.has(k)) return `<span class="tm-miss">${esc(tok)}</span>`;
      return esc(tok);
    }).join("");
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    P().setup(box, {
      std,
      counts: [10, 15, 20],
      intro: "Dịch câu tiếng Trung sang tiếng Việt. Máy chấm theo ý chính nên dịch thoát ý vẫn được tính đúng.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> chọn bản dịch đúng trong 4 câu. <b>Vừa:</b> tự gõ bản dịch, có pinyin và nghĩa các từ trong câu. <b>Khó:</b> tự gõ, không có pinyin và gợi ý.<br>Gõ không dấu cũng được, máy sẽ so không dấu. Nếu bạn chắc mình dịch đúng ý mà máy chưa nhận, bấm "Tôi dịch đúng ý".</details>`,
      bestKeyOf: (v) => `translate:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = P().sentencesOf(std, v.level);
        if (!pool.length) { toast("Cấp này chưa có câu luyện"); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count), pool);
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items, pool) {
    App.setFocus(true);
    const t0 = Date.now();
    let i = 0, score = 0, right = 0;
    const wrong = [];
    const max = items.length * 10;

    function options(item) {
      const f = NORM, M = new Set(content(f(item.vi)));
      const cands = shuffle(pool.filter((x) => x !== item && x.word.hz !== item.word.hz && !x.zh.includes(item.word.hz)))
        .filter((x) => { const c = content(f(x.vi)); const ov = c.filter((y) => M.has(y)).length / Math.max(1, Math.min(c.length, M.size)); return ov < 0.34 && x.vi !== item.vi; });
      return shuffle([item.vi, ...cands.slice(0, 3).map((x) => x.vi)]);
    }

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const gl = P().glossary(it.zh);
      const easy = cfg.diff === "easy", hard = cfg.diff === "hard";
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card tr-card">
          <div class="tr-zh-row"><div class="zh tr-zh">${esc(it.zh)}</div>${speakBtn(it.zh)}</div>
          <div class="tr-py ${hard ? "hidden" : ""}" id="trpy">${pyHtml(it.py)}</div>
          ${!easy && !hard ? glossHtml(gl, it) : ""}
          ${easy
            ? `<div class="options" id="opts">${options(it).map((o, k) => `<button class="option vi-text" data-o="${esc(o)}"><span class="opt-key">${"ABCD"[k]}</span>${esc(o)}</button>`).join("")}</div>`
            : `<label class="setup-label" for="tra" style="display:block;margin:14px 0 6px">Bản dịch của bạn</label><textarea id="tra" class="search tr-input" rows="2" placeholder="Gõ bản dịch tiếng Việt…" autocomplete="off"></textarea>
               <div class="row mt between"><span class="small muted kbd-hint"><span class="kbd">Enter</span> để kiểm tra · <span class="kbd">Shift</span>+<span class="kbd">Enter</span> xuống dòng</span><button class="btn btn-primary" id="check">${ic("check")} Kiểm tra</button></div>`}
          <div id="fb"></div>
        </div>`;
      bindSpeak(box);
      if (easy) {
        box.querySelectorAll("[data-o]").forEach((b) => b.onclick = () => {
          if (box.querySelector(".option.correct, .option.wrong")) return;
          const ok = b.dataset.o === it.vi;
          box.querySelectorAll("[data-o]").forEach((x) => { x.disabled = true; if (x.dataset.o === it.vi) x.classList.add("correct"); });
          if (!ok) b.classList.add("wrong");
          verdictOut(it, ok ? { verdict: "right", why: [] } : { verdict: "wrong", why: [] }, b.dataset.o, gl);
        });
        App.keyHandler = (e) => { const k = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[e.key.toLowerCase()]; const bs = box.querySelectorAll("[data-o]"); if (k != null && bs[k] && !bs[k].disabled) bs[k].click(); else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) n.click(); } };
      } else {
        const ta = box.querySelector("#tra");
        ta.focus();
        const check = () => { if (box.querySelector("#next")) return; const ans = ta.value.trim(); if (!ans) { ta.focus(); toast("Hãy gõ bản dịch trước", { type: "info" }); return; } ta.readOnly = true; box.querySelector("#check").remove(); verdictOut(it, grade(it, ans), ans, gl); };
        box.querySelector("#check").onclick = check;
        ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); const n = box.querySelector("#next"); n ? n.click() : check(); } });
        App.keyHandler = null;
      }
    }

    function glossHtml(gl, it) {
      if (!gl.length) return "";
      return `<div class="tr-gloss">${gl.map((w) => `<span class="${w.hz === it.word.hz ? "key" : ""}"><b class="zh">${esc(w.hz)}</b> ${esc(w.py)} · ${esc(String(w.vi).split(/[;；]/)[0])}</span>`).join("")}</div>`;
    }

    function verdictOut(it, g, ans, gl) {
      const fb = box.querySelector("#fb");
      const label = { right: "Đúng ý", close: "Gần đúng", wrong: "Chưa đúng" }[g.verdict];
      const cls = { right: "good", close: "mid", wrong: "bad" }[g.verdict];
      const pts = { right: 10, close: 5, wrong: 0 }[g.verdict];
      score += pts; if (g.verdict === "right") right++;
      const rec = { hz: it.zh, py: it.py, vi: it.vi, say: it.zh, note: ans && cfg.diff !== "easy" ? `Bạn dịch: ${ans}` : ans ? `Bạn chọn: ${ans}` : "" };
      if (g.verdict !== "right") wrong.push(rec);
      const py = box.querySelector("#trpy"); if (py) py.classList.remove("hidden");
      fb.innerHTML = `<div class="feedback ${cls} tr-fb">
          <div class="tr-verdict"><span class="pill ${cls === "good" ? "green" : cls === "mid" ? "gold" : "red"}">${label}</span><span class="small muted">+${pts} điểm</span></div>
          <div class="tr-model"><span class="small muted">Bản dịch mẫu</span><div>${g.hitSet ? markModel(it.vi, g) : esc(it.vi)}</div></div>
          ${g.why && g.why.length ? `<ul class="small tr-why">${g.why.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          <div class="small tr-key">Từ trọng tâm: <b class="zh">${esc(it.word.hz)}</b> ${pyHtml(it.word.py)} – ${esc(it.word.vi)}</div>
          ${cfg.diff !== "normal" ? `<details class="small"><summary>Từ trong câu</summary>${glossHtml(gl, it)}</details>` : ""}
          <div class="row mt">${g.verdict !== "right" && cfg.diff !== "easy" ? `<button class="btn btn-sm" id="override">${ic("check")} Tôi dịch đúng ý</button>` : ""}<button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      const ov = fb.querySelector("#override");
      if (ov) ov.onclick = () => {
        score += 10 - pts; right++; wrong.pop();
        fb.querySelector(".tr-verdict").innerHTML = `<span class="pill green">Đúng ý (bạn tự xác nhận)</span><span class="small muted">+10 điểm</span>`;
        fb.querySelector(".tr-fb").classList.remove("bad", "mid"); fb.querySelector(".tr-fb").classList.add("good");
        ov.remove();
      };
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const isBest = P().record({ type: "translate", std, level: cfg.level, title: `${P().nameIn(P().feature("translate"), std)} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey: `translate:${std}:${cfg.level}:${cfg.diff}` });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.zh));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from: P().nameIn(P().feature("translate"), std),
        onRetryWrong: () => session(box, std, cfg, shuffle(again), pool),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register("translate", { run });
  window.TranslateDrill = { grade, content, negOf };   // dùng cho kiểm thử
})();
