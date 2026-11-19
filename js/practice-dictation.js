// Luyện tập: Chép chính tả – nghe máy đọc (giọng tiếng Trung của trình duyệt) rồi gõ lại chữ Hán hoặc pinyin.
// Nội dung lấy từ từ vựng và câu ví dụ đã rà soát của web; chấm từng chữ / từng âm tiết, tô chỗ sai.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;

  // ---------- Pinyin: phân tích, tách âm tiết ----------
  const MARK = {};
  "āáǎà|ēéěè|īíǐì|ōóǒò|ūúǔù|ǖǘǚǜ".split("|").forEach((g, i) => [...g].forEach((c, t) => (MARK[c] = ["a", "e", "i", "o", "u", "ü"][i] + (t + 1))));
  const SYL_RE = /[bpmfdtnlgkhjqxzcsryw]?h?[aeiouü]+(?:ngr|nr|ng|n|r)?/g;
  // một cụm (không có dấu cách) → chữ cái + thanh theo vị trí; chữ số 1–5 là thanh của âm tiết đứng trước
  function analyze(str) {
    const s = String(str || "").normalize("NFC").toLowerCase().replace(/u:/g, "ü").replace(/v/g, "ü");
    let letters = "";
    const tone = {};
    for (const c of s) {
      if (MARK[c]) { letters += MARK[c][0]; tone[letters.length - 1] = +MARK[c][1]; }
      else if (/[a-zü]/.test(c)) letters += c;
      else if (/[0-5]/.test(c) && letters) tone[letters.length - 1] = +c === 0 ? 5 : +c;
    }
    return { letters, tone };
  }
  // chuỗi pinyin → danh sách âm tiết {l: chữ cái, t: thanh (5 = nhẹ / không ghi)}
  function syllables(py, chunkSplit = /[\s'’\-，。！？、；：,.!?;:“”"（）()…—]+/) {
    const out = [];
    // chữ số kết thúc một âm tiết: "ni3hao3" → "ni3 hao3"
    String(py || "").replace(/([0-5])(?=[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ])/g, "$1 ").split(chunkSplit).filter(Boolean).forEach((chunk) => {
      const a = analyze(chunk);
      let m;
      SYL_RE.lastIndex = 0;
      while ((m = SYL_RE.exec(a.letters))) {
        let t = 5;
        for (let k = m.index; k < m.index + m[0].length; k++) if (a.tone[k]) t = a.tone[k];
        out.push({ l: m[0], t });
      }
    });
    return out;
  }
  // đặt dấu thanh để hiển thị âm tiết người dùng gõ
  const TONED = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", ü: "ǖǘǚǜ" };
  function marked(l, t) {
    if (!t || t === 5) return l;
    let k = l.search(/[ae]/);
    if (k < 0) k = l.indexOf("ou");
    if (k < 0) { for (let i = l.length - 1; i >= 0; i--) if (TONED[l[i]]) { k = i; break; } }
    return k < 0 ? l : l.slice(0, k) + TONED[l[k]][t - 1] + l.slice(k + 1);
  }

  const HAN = /[\u3400-\u9fff]/;
  const hanOnly = (s) => [...String(s || "")].filter((c) => HAN.test(c));

  // Đáp án của một mục: âm tiết + chữ Hán tương ứng (để nới thanh cho 一/不). null nếu không khớp được số âm tiết.
  function target(item) {
    const syl = syllables(item.py);
    let chars = hanOnly(item.zh);
    if (chars.length !== syl.length) chars = chars.filter((c) => c !== "儿");
    if (chars.length !== syl.length || !syl.length) return null;
    return syl.map((s, i) => ({ ...s, hz: chars[i] }));
  }
  function toneOk(want, got) {
    if (want.t === got.t) return true;
    // 个/来/去 đọc nhẹ (一个, 拿出来…): chấp nhận cả thanh gốc trong từ điển
    if (want.t === 5) return got.t === 5 || ({ "个": 4, "来": 2, "去": 4 })[want.hz] === got.t;
    if (want.hz === "一") return [1, 2, 4].includes(got.t);
    if (want.hz === "不") return [2, 4].includes(got.t);
    return false;
  }

  // LCS trên hai dãy, eq(a, b) → mảng cặp chỉ số khớp
  function lcs(A, B, eq) {
    const n = A.length, m = B.length, d = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) d[i][j] = eq(A[i], B[j]) ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const pairs = [];
    for (let i = 0, j = 0; i < n && j < m;) {
      if (eq(A[i], B[j])) { pairs.push([i, j]); i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++;
    }
    return pairs;
  }

  // ---------- Chấm ----------
  function gradeHanzi(item, answer) {
    const T = hanOnly(item.zh), U = hanOnly(answer);
    const pairs = lcs(T, U, (a, b) => a === b);
    const tOk = new Set(pairs.map((p) => p[0])), uOk = new Set(pairs.map((p) => p[1]));
    const acc = T.length ? pairs.length / Math.max(T.length, U.length) : 0;
    return { acc, right: pairs.length === T.length && U.length === T.length, mode: "hanzi",
      want: T.map((c, i) => ({ text: c, ok: tOk.has(i) })), got: U.map((c, j) => ({ text: c, ok: uOk.has(j) })) };
  }
  function gradePinyin(item, answer) {
    const T = item.syl;
    let U = syllables(answer);
    // gõ liền không dấu cách (vd "xian" cho 西安): nếu chữ cái trùng khớp toàn bộ thì tách theo đáp án
    const a = analyze(String(answer || "").replace(/[\s'’\-，。！？、；：,.!?;:]+/g, ""));
    if (a.letters === T.map((s) => s.l).join("") && U.length !== T.length) {
      let off = 0;
      U = T.map((s) => { let t = 5; for (let k = off; k < off + s.l.length; k++) if (a.tone[k]) t = a.tone[k]; off += s.l.length; return { l: s.l, t }; });
    }
    const pairs = lcs(T, U, (w, g) => w.l === g.l);           // khớp theo chữ cái, sau đó xét thanh
    const tState = T.map(() => "miss"), uState = U.map(() => "bad");
    pairs.forEach(([i, j]) => { const ok = toneOk(T[i], U[j]); tState[i] = ok ? "ok" : "tone"; uState[j] = ok ? "ok" : "tone"; });
    const good = tState.filter((x) => x === "ok").length;
    const acc = T.length ? good / Math.max(T.length, U.length) : 0;
    const toneErr = pairs.filter(([i, j]) => tState[i] === "tone").map(([i, j]) => `${T[i].hz} ${marked(T[i].l, T[i].t)} (bạn ghi ${marked(U[j].l, U[j].t)})`);
    return { acc, right: good === T.length && U.length === T.length, mode: "pinyin", toneErr,
      want: T.map((s, i) => ({ text: marked(s.l, s.t), ok: tState[i] === "ok", tone: tState[i] === "tone" })),
      got: U.map((s, j) => ({ text: marked(s.l, s.t), ok: uState[j] === "ok", tone: uState[j] === "tone" })) };
  }

  // ---------- Nội dung theo độ khó ----------
  const len = (zh) => hanOnly(zh).length;
  function itemsOf(std, level, diff) {
    const out = [], seen = new Set();
    const add = (it) => { if (seen.has(it.zh)) return; const syl = target(it); if (!syl) return; seen.add(it.zh); out.push({ ...it, syl }); };
    if (diff === "easy") P().wordsOf(std, level).forEach((w) => { if (w.py && len(w.hz)) add({ zh: w.hz, py: w.py, vi: w.vi, word: w, kind: "word" }); });
    else {
      // câu của cấp xếp theo độ dài: nửa ngắn cho Vừa, nửa dài cho Khó
      const sents = P().sentencesOf(std, level).slice().sort((a, b) => len(a.zh) - len(b.zh) || (a.zh < b.zh ? -1 : 1));
      const half = Math.ceil(sents.length / 2);
      (diff === "normal" ? sents.slice(0, half) : sents.slice(half)).forEach((s) => add({ zh: s.zh, py: s.py, vi: s.vi, word: s.word, kind: "sent" }));
    }
    return out;
  }

  // ---------- Giọng đọc ----------
  const hasVoice = () => !!(window.speechSynthesis && TTS.voices && TTS.voices.length);
  const say = (text, slow) => { if (window.speechSynthesis) { speechSynthesis.cancel(); TTS.speak(text, slow ? { rate: 0.55 } : {}); } };

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    const saved = (P().pstate().last || {})["dictation-mode"] || "hanzi";
    P().setup(box, {
      std,
      counts: [10, 15, 20],
      intro: "Bấm nghe, máy đọc tiếng Trung, bạn gõ lại. Chấm từng chữ hoặc từng âm tiết và tô chỗ sai.",
      extra: `<div class="setup-row"><div class="setup-label">Gõ bằng</div><div class="chips" data-name="mode"><button type="button" data-v="hanzi" class="${saved === "hanzi" ? "on" : ""}">Chữ Hán</button><button type="button" data-v="pinyin" class="${saved === "pinyin" ? "on" : ""}">Pinyin</button></div></div>
        <details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó và cách gõ</summary><b>Dễ:</b> nghe từ đơn, có nghĩa và số chữ. <b>Vừa:</b> các câu ngắn hơn của cấp, nghĩa để trong gợi ý. <b>Khó:</b> các câu dài hơn, không gợi ý.<br>Pinyin gõ có dấu (nǐ hǎo) hoặc số (ni3 hao3) đều được, viết hoa hay có dấu cách cũng không sao; ü gõ v. Thanh nhẹ không cần ghi số.</details>`,
      bestKeyOf: (v) => `dictation:${std}:${v.level}:${v.diff}:${v.mode}`,
      onStart: (v) => {
        const p = P().pstate(); p.last = p.last || {}; p.last["dictation-mode"] = v.mode; Store.save();
        const pool = itemsOf(std, v.level, v.diff);
        if (!pool.length) { toast("Cấp này chưa có nội dung cho độ khó này"); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count));
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items) {
    App.setFocus(true);
    const t0 = Date.now(), pin = cfg.mode === "pinyin";
    let i = 0, score = 0, right = 0;
    const wrong = [];
    const onKey = (e) => { if (e.altKey && e.code === "KeyR") { e.preventDefault(); const it = items[i]; if (it) say(it.zh, e.shiftKey); } };
    document.addEventListener("keydown", onKey);
    const cleanup = () => document.removeEventListener("keydown", onKey);
    window.addEventListener("hashchange", cleanup, { once: true });

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const easy = cfg.diff === "easy", normal = cfg.diff === "normal";
      const noVoice = !hasVoice();
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card tr-card dc-card">
          <div class="dc-play">
            <button class="btn btn-primary dc-big" id="play" aria-label="Nghe">${ic("headphones")}<span>Nghe</span></button>
            <button class="btn" id="slow">${ic("soundon")} Nghe chậm</button>
          </div>
          ${noVoice ? `<div class="dc-novoice small">${ic("info")} Trình duyệt này không có giọng đọc tiếng Trung. Bạn có thể bấm "Hiện ${pin ? "chữ Hán" : "pinyin"}" để luyện gõ.<button class="btn btn-sm" id="reveal">Hiện ${pin ? "chữ Hán" : "pinyin"}</button><span id="revealed" class="dc-revealed"></span></div>` : ""}
          <div class="dc-hint small">
            ${easy ? `<span class="pill">${len(it.zh)} chữ</span> <span class="muted">${esc(String(it.vi).split(/[;；]/)[0])}</span>` : normal ? `<button class="btn btn-sm btn-ghost" id="hint">${ic("info")} Gợi ý nghĩa</button><span id="hintv" class="muted"></span>` : `<span class="muted">${len(it.zh)} chữ · không gợi ý</span>`}
          </div>
          <label class="setup-label" for="dca" style="display:block;margin:14px 0 6px">${pin ? "Gõ pinyin" : "Gõ chữ Hán"}</label>
          <input id="dca" class="search dc-input ${pin ? "" : "zh"}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" ${pin ? "" : 'lang="zh-CN"'} placeholder="${pin ? "vd: ni3 hao3 hoặc nǐ hǎo" : "Gõ bằng bộ gõ tiếng Trung…"}">
          <div class="row mt between"><span class="small muted kbd-hint"><span class="kbd">Enter</span> kiểm tra · <span class="kbd">Alt</span>+<span class="kbd">R</span> nghe lại · <span class="kbd">Alt</span>+<span class="kbd">Shift</span>+<span class="kbd">R</span> nghe chậm</span><button class="btn btn-primary" id="check">${ic("check")} Kiểm tra</button></div>
          <div id="fb"></div>
        </div>`;
      const inp = box.querySelector("#dca");
      box.querySelector("#play").onclick = () => { say(it.zh); inp.focus({ preventScroll: true }); };
      box.querySelector("#slow").onclick = () => { say(it.zh, true); inp.focus({ preventScroll: true }); };
      const rv = box.querySelector("#reveal"); if (rv) rv.onclick = () => { box.querySelector("#revealed").innerHTML = pin ? `<span class="zh">${esc(it.zh)}</span>` : pyHtml(it.py); rv.remove(); };
      const hb = box.querySelector("#hint"); if (hb) hb.onclick = () => { box.querySelector("#hintv").textContent = it.vi; hb.remove(); };
      const check = () => {
        if (box.querySelector("#next")) return;
        const ans = inp.value.trim();
        if (!ans) { inp.focus(); toast("Hãy gõ những gì bạn nghe được", { type: "info" }); return; }
        inp.readOnly = true; box.querySelector("#check").remove();
        feedback(it, pin ? gradePinyin(it, ans) : gradeHanzi(it, ans), ans);
      };
      box.querySelector("#check").onclick = check;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); const n = box.querySelector("#next"); n ? n.click() : check(); } });
      App.keyHandler = null;
      inp.focus({ preventScroll: true });
      say(it.zh);   // câu đầu tiên được gọi từ thao tác bấm "Bắt đầu"/"Câu tiếp" nên trình duyệt cho phép phát
    }

    function marks(list, cls) {
      return list.map((x) => `<span class="dc-u ${x.ok ? "ok" : x.tone ? "tone" : cls}">${esc(x.text)}</span>`).join(pin ? " " : "");
    }

    function feedback(it, g, ans) {
      const pts = g.right ? 10 : g.acc >= 0.5 ? Math.floor(g.acc * 10) : 0;
      score += pts; if (g.right) right++;
      else wrong.push({ hz: it.zh, py: it.py, vi: it.vi, say: it.zh, note: `Bạn gõ: ${ans}` });
      const notes = [];
      if (!g.right) {
        if (g.mode === "pinyin" && g.toneErr.length) notes.push(`Sai thanh: ${g.toneErr.slice(0, 4).join(", ")}.`);
        const miss = g.want.filter((x) => !x.ok && !x.tone).length, extra = g.got.filter((x) => !x.ok && !x.tone).length;
        if (miss) notes.push(`Thiếu hoặc sai ${miss} ${g.mode === "pinyin" ? "âm tiết" : "chữ"} (chữ mờ trong đáp án).`);
        if (extra) notes.push(`Có ${extra} ${g.mode === "pinyin" ? "âm tiết" : "chữ"} gõ thừa hoặc sai (tô đỏ).`);
      }
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback tr-fb ${g.right ? "good" : g.acc >= 0.5 ? "mid" : "bad"}">
          <div class="tr-verdict"><span class="pill ${g.right ? "green" : g.acc >= 0.5 ? "gold" : "red"}">${g.right ? "Chính xác" : `Đúng ${Math.round(g.acc * 100)}%`}</span><span class="small muted">+${pts} điểm</span></div>
          <div class="dc-cmp"><span class="small muted">Bạn gõ</span><div class="dc-line ${pin ? "" : "zh"}">${marks(g.got, "bad") || "—"}</div>
            <span class="small muted">Đáp án</span><div class="dc-line ${pin ? "" : "zh"}">${marks(g.want, "miss")}</div></div>
          <div class="tr-zh-row"><div class="zh dc-full">${esc(it.zh)}</div>${speakBtn(it.zh)}</div>
          <div>${pyHtml(it.py)}</div><div class="muted">${esc(it.vi)}</div>
          ${notes.length ? `<ul class="small tr-why">${notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${it.kind === "sent" ? `<div class="small tr-key">Từ trọng tâm: <b class="zh">${esc(it.word.hz)}</b> ${pyHtml(it.word.py)} – ${esc(it.word.vi)}</div>` : ""}
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      cleanup();
      App.setFocus(false); App.keyHandler = null;
      if (window.speechSynthesis) speechSynthesis.cancel();
      const seconds = Math.round((Date.now() - t0) / 1000);
      const from = P().nameIn(P().feature("dictation"), std);
      const bestKey = `dictation:${std}:${cfg.level}:${cfg.diff}:${cfg.mode}`;
      const isBest = P().record({ type: "dictation", std, level: cfg.level, title: `${from} · cấp ${cfg.level} · ${pin ? "pinyin" : "chữ Hán"}`, score, correct: right, total: items.length, seconds, bestKey });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.zh));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from,
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register("dictation", { run });
  window.DictationDrill = { itemsOf, gradeHanzi, gradePinyin, syllables, target, marked };   // dùng cho kiểm thử
})();
