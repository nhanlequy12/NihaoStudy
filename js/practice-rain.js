// Mưa từ vựng: bong bóng từ rơi xuống, gõ pinyin hoặc viết chữ Hán để bắn vỡ.
// Lối chơi arcade: điểm, 3 mạng, combo, tốc độ tăng theo màn, hiệu ứng vỡ, âm thanh tổng hợp (WebAudio), điểm cao.
(function () {
  const { esc, shuffle } = Views.util;

  // ---------- Pinyin: so khớp chấp nhận "ni3" và "nǐ" ----------
  const MARK = {};
  "āáǎà|ēéěè|īíǐì|ōóǒò|ūúǔù|ǖǘǚǜ".split("|").forEach((g, i) => [...g].forEach((c, t) => (MARK[c] = ["a", "e", "i", "o", "u", "ü"][i] + (t + 1))));
  function analyze(str) {
    let s = String(str || "").normalize("NFC").toLowerCase().replace(/u:/g, "ü").replace(/v/g, "ü");
    let letters = "";
    const tone = {};
    for (const c of s) {
      if (MARK[c]) { letters += MARK[c][0]; tone[letters.length - 1] = +MARK[c][1]; }
      else if (/[a-zü]/.test(c)) letters += c;
      else if (/[0-5]/.test(c) && letters) tone[letters.length - 1] = +c === 0 ? 5 : +c;
    }
    return { letters, tone };
  }
  const SYL_RE = /[bpmfdtnlgkhjqxzcsryw]?h?[aeiouü]+(?:ngr|nr|ng|n|r)?/g;   // gồm cả âm cuối 儿 hoá (diǎnr, wánr)
  // Chuẩn bị đáp án cho một từ: chuỗi chữ cái + từng âm tiết (khoảng vị trí, thanh, chữ Hán tương ứng)
  function target(w) {
    // tách theo dấu cách / dấu nháy trong pinyin gốc (Xī'ān ≠ xiān), rồi tách âm tiết trong từng cụm
    let letters = "", spans = [], tone = {};
    String(w.py || "").split(/[\s'’\-]+/).filter(Boolean).forEach((chunk) => {
      const a = analyze(chunk), off = letters.length;
      Object.keys(a.tone).forEach((k) => (tone[+k + off] = a.tone[k]));
      let m;
      SYL_RE.lastIndex = 0;
      while ((m = SYL_RE.exec(a.letters))) spans.push([off + m.index, off + m.index + m[0].length]);
      letters += a.letters;
    });
    let chars = [...w.hz].filter((c) => /[\u3400-\u9fff]/.test(c));
    if (chars.length !== spans.length) chars = chars.filter((c) => c !== "儿");
    return { letters, syl: spans.map(([s, e], i) => ({ s, e, t: toneIn(tone, s, e) || 5, ch: chars.length === spans.length ? chars[i] : "" })) };
  }
  function toneIn(map, s, e) { for (let i = s; i < e; i++) if (map[i]) return map[i]; return null; }
  const toneCount = (map, s, e) => { let n = 0; for (let i = s; i < e; i++) if (map[i]) n++; return n; };
  // diff: easy = không cần thanh; normal = cần thanh, thanh nhẹ không bắt buộc; hard = đúng hết kể cả thanh nhẹ
  function matches(input, tgt, diff) {
    const a = analyze(input);
    if (!a.letters || a.letters !== tgt.letters) return false;
    if (diff === "easy") return true;
    return tgt.syl.every((y) => {
      if (toneCount(a.tone, y.s, y.e) > 1) return false;   // một âm tiết chỉ có một thanh (chặn "xi1an1" cho xiān)
      const ti = toneIn(a.tone, y.s, y.e);
      if (y.ch === "一" || y.ch === "不") {           // chấp nhận cả thanh gốc lẫn thanh biến điệu
        if (y.t === 5) return ti == null || ti === 5 || (diff === "normal");
        return ti != null && (y.ch === "一" ? [1, 2, 4] : [2, 4]).includes(ti);
      }
      if (y.t === 5) return diff === "normal" ? true : ti == null || ti === 5;
      return ti === y.t;
    });
  }

  // ---------- Nghĩa hiển thị cho chế độ "Nghĩa Việt" ----------
  // lấy ý đầu; bỏ ngoặc có chữ Hán, cách đọc («đọc …»), chú thích «A: …» hoặc chính pinyin của từ, để không lộ đáp án
  const PY_ONLY_MARK = /[āǎēěīǐōǒūǔǖǘǚǜ]/;
  const bareLat = (x) => String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
  function viText(s, py) {
    // ý đầu: cắt ở dấu ; đầu tiên nằm ngoài ngoặc
    let depth = 0, end = String(s || "").length;
    for (let k = 0; k < end; k++) { const c = s[k]; if (c === "(") depth++; else if (c === ")") depth = Math.max(0, depth - 1); else if ((c === ";" || c === "；") && !depth) { end = k; break; } }
    const first = String(s || "").slice(0, end).trim(), pyb = bareLat(py);
    const drop = (inner) => /[\u3400-\u9fff]/.test(inner) || /(^|[\s,(])đọc(\s|$)/.test(inner) || PY_ONLY_MARK.test(inner) || inner.includes(":") || (pyb.length > 1 && bareLat(inner).includes(pyb));
    const clean = (x) => x.replace(/[\u3400-\u9fff]+/g, "").replace(/\(\s*[,.…+\/]*\s*\)/g, "").replace(/\s+([,.])/g, "$1").replace(/\s{2,}/g, " ").trim().replace(/^[,.;:–\-\s]+|[,;:–\-\s]+$/g, "");
    const raw = first.replace(/\s*\(([^)]*)\)/g, (m, inner) => (drop(inner) ? "" : m));
    const hanTail = /[\u3400-\u9fff][\s,.…、，]*$/.test(raw);   // ý kết thúc bằng ví dụ chữ Hán (… như trong 桌子)
    let t = clean(raw);
    if (hanTail) for (let k = 0; k < 3; k++) t = t.replace(/(^|\s+)(như trong|ví dụ|vd)[:,]?$/i, "").replace(/(\S)\s+(như|trong|của|là|với|cho)[:,]?$/i, "$1").trim();   // từ nối bị treo sau khi bỏ chữ Hán
    if (/^(như trong|như)$/i.test(t)) t = "";
    if (!/\p{L}{2}/u.test(t)) return "";
    const MAX = 44;                                                                       // vừa 3 dòng trong bong bóng
    if (t.length > MAX) t = clean(t.replace(/\s*\([^)]*\)/g, ""));                      // quá dài: bỏ phần trong ngoặc
    if (t.length > MAX) {                                                                 // vẫn dài: giữ trọn các ý (ngăn bởi dấu phẩy) vừa chỗ
      const parts = t.split(/,\s*/); let keep = parts[0];
      for (const p of parts.slice(1)) { if ((keep + ", " + p).length > MAX) break; keep += ", " + p; }
      t = keep;
    }
    return t;
  }
  // khoá đồng nghĩa: đúng chữ hiển thị trên bong bóng (kể cả phần trong ngoặc), bỏ dấu câu, không phân biệt hoa thường
  const viKey = (w) => viText(w.vi, w.py).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  // ngắt dòng: tối đa khoảng 16 ký tự mỗi dòng, 3 dòng
  const linesCache = new WeakMap();
  function viLines(w) {
    if (linesCache.has(w)) return linesCache.get(w);
    const wrap = (text) => {
      const o = []; let cur = "";
      text.split(" ").forEach((word) => { if ((cur + " " + word).trim().length > 16 && cur) { o.push(cur); cur = word; } else cur = (cur + " " + word).trim(); });
      if (cur) o.push(cur);
      return o;
    };
    const full = viText(w.vi, w.py);
    let out = wrap(full);
    if (out.length > 3) out = wrap(full.replace(/\s*\([^)]*\)/g, "").replace(/\s+,/g, ","));   // quá 3 dòng: bỏ phần trong ngoặc
    if (out.length > 3) { out.length = 3; out[2] = out[2].replace(/…?$/, "…"); }
    linesCache.set(w, out);
    return out;
  }

  // ---------- Âm thanh 8-bit ----------
  let ac = null;
  const muted = () => !!Store.state.settings.sfxOff;
  function beep(freqs, { type = "square", dur = 0.08, vol = 0.06, gap = 0 } = {}) {
    if (muted()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      let t = ac.currentTime;
      freqs.forEach((f) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
        t += dur + gap;
      });
    } catch (e) { /* trình duyệt không có WebAudio: bỏ qua âm thanh */ }
  }
  const SFX = {
    pop: (combo) => beep([660 + Math.min(combo, 10) * 40, 990 + Math.min(combo, 10) * 40], { dur: 0.05 }),
    wrong: () => beep([220, 160], { type: "sawtooth", dur: 0.08, vol: 0.05 }),
    miss: () => beep([300, 200, 120], { type: "triangle", dur: 0.1, vol: 0.09 }),
    level: () => beep([523, 659, 784, 1047], { dur: 0.07 }),
    over: () => beep([392, 330, 262, 196], { type: "triangle", dur: 0.16, vol: 0.09 }),
    stroke: () => beep([880], { dur: 0.03, vol: 0.03 }),
  };

  // ---------- Đồ hoạ: bong bóng pixel vẽ sẵn vào canvas nhỏ rồi phóng to ----------
  const COLORS = ["#ff5d73", "#ffb547", "#4fd18b", "#4ab3ff", "#b388ff", "#ff8a3d"];
  const spriteCache = {};
  function bubbleSprite(r, color, glow) {
    const px = 3, R = Math.ceil(r / px), key = R + color + (glow ? "g" : "");
    if (spriteCache[key]) return spriteCache[key];
    const c = document.createElement("canvas"); c.width = c.height = R * 2 + 2;
    const g = c.getContext("2d");
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d > R) continue;
      let col = null;
      if (d > R - 1.2) col = glow ? "#ffffff" : color;                  // viền
      else if (d > R - 2.2 && glow) col = color;
      else if ((x + R * 0.45) ** 2 + (y + R * 0.45) ** 2 < (R * 0.22) ** 2) col = "rgba(255,255,255,.85)"; // đốm sáng
      else col = color + "33";                                            // thân trong suốt
      g.fillStyle = col; g.fillRect(x + R + 1, y + R + 1, 1, 1);
    }
    return (spriteCache[key] = c);
  }

  // ---------- Màn chọn ----------
  // Font pixel chỉ dùng trong trò chơi: tải khi mở trò chơi, không tải ở mọi trang
  function loadPixelFont() {
    if (document.getElementById("font-px")) return;
    const l = document.createElement("link");
    l.id = "font-px"; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(l);
  }

  function run(std, box) {
    loadPixelFont();
    App.setFocus(false);
    Practice.setup(box, {
      std,
      counts: [20, 40, 60],
      intro: "Bong bóng chứa từ rơi xuống. Bắn vỡ trước khi chạm đáy: mỗi bong bóng lọt xuống mất một mạng.",
      extra: `<div class="setup-row"><div class="setup-label">Chế độ</div><div class="chips" data-name="mode"><button type="button" data-v="py" class="on">Phiên âm<small>gõ pinyin</small></button><button type="button" data-v="hz">Chữ Hán<small>vẽ từng nét</small></button><button type="button" data-v="vi">Nghĩa Việt<small>gõ pinyin ra chữ Hán</small></button></div></div>
        <details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Cách chơi</summary>
        <b>Phiên âm:</b> bong bóng hiện chữ Hán và nghĩa; gõ pinyin rồi bóng tự vỡ. Gõ số thanh (<span class="kbd">ni3hao3</span>) hay dấu (<span class="kbd">nǐhǎo</span>) đều được; <span class="kbd">v</span> thay cho ü. Dễ: không cần thanh; Vừa: cần thanh, thanh nhẹ tuỳ ý; Khó: đúng cả thanh nhẹ.<br>
        <b>Chữ Hán:</b> bong bóng hiện pinyin và nghĩa; viết từng chữ vào khung theo đúng thứ tự nét. Dễ: có chữ mờ để tô; Vừa: hiện gợi ý sau 2 nét sai; Khó: không gợi ý.<br>
        <b>Nghĩa Việt:</b> bong bóng chỉ hiện nghĩa tiếng Việt; nhớ ra từ rồi gõ pinyin, bóng vỡ và hiện chữ Hán. Từ đồng nghĩa trong cùng cấp đều được tính. Dễ: có thêm âm Hán Việt làm gợi ý.<br>
        Vỡ liên tiếp để tăng combo (×2 từ 5 lần, tối đa ×5). Cứ 6 bóng vỡ lên một màn, bóng rơi nhanh hơn.</details>`,
      bestKeyOf: (v) => `rain:${std}:${v.mode}:${v.level}`,
      onStart: (v) => {
        let words = Practice.wordsOf(std, v.level).filter((w) => w.py && w.hz);
        if (v.mode === "hz") words = words.filter((w) => /^[\u3400-\u9fff]{1,2}$/.test(w.hz));
        if (v.mode === "vi") words = words.filter((w) => viText(w.vi, w.py));
        if (!words.length) { toast("Cấp này chưa có từ phù hợp"); return; }
        game(box, std, v, shuffle(words).slice(0, v.count));
      },
    });
  }

  // ---------- Trò chơi ----------
  function game(box, std, cfg, words) {
    const isHz = cfg.mode === "hz", isVi = cfg.mode === "vi";
    // chế độ nghĩa: các từ cùng cấp có cùng nghĩa hiển thị đều được chấp nhận (đẹp: 漂亮/美丽…)
    const synOf = (() => {
      if (!isVi) return null;
      const m = new Map();
      Practice.wordsOf(std, cfg.level).filter((w) => w.py && w.hz).forEach((w) => { const k = viKey(w); if (k) m.set(k, (m.get(k) || []).concat([w])); });
      return (w) => { const list = m.get(viKey(w)) || []; return [w, ...list.filter((x) => x.hz !== w.hz)]; };
    })();
    App.setFocus(true);
    document.body.classList.add("in-game");
    box.innerHTML = `<div class="rain">
        <div class="rain-hud">
          <span class="hud-item"><small>ĐIỂM</small><b id="h-score">0</b></span>
          <span class="hud-item"><small>MÀN</small><b id="h-level">1</b></span>
          <span class="hud-item"><small>COMBO</small><b id="h-combo">×1</b></span>
          <span class="hud-lives" id="h-lives" aria-label="Mạng"></span>
          <span class="hud-tools"><button class="icon-btn" id="h-exit" aria-label="Thoát" title="Thoát">${ic("x")}</button><button class="icon-btn" id="h-sound" aria-label="Tắt/bật âm thanh">${ic(muted() ? "soundoff" : "soundon")}</button><button class="icon-btn" id="h-pause" aria-label="Tạm dừng">${ic("clock")}</button></span>
        </div>
        <div class="rain-stage" id="stage"><canvas id="cv"></canvas><div class="rain-msg" id="msg"></div></div>
        ${isHz
          ? `<div class="rain-pad"><div class="pad-info"><div id="pad-py" class="pad-py"></div><div id="pad-vi" class="muted small"></div><div id="pad-step" class="small"></div><button class="btn btn-sm" id="skip">Bỏ qua từ này</button></div><div class="writer-target pad" id="pad"></div></div>`
          : `<div class="rain-input"><input id="ans" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${isVi ? "Nhớ ra từ rồi gõ pinyin, ví dụ ni3hao3" : "Gõ pinyin, ví dụ ni3hao3 hoặc nǐhǎo"}" aria-label="Gõ pinyin"><button class="btn" id="enter">Bắn</button></div>`}
        <p class="small muted center rain-foot">${esc(Practice.STD[std].long)} · cấp ${cfg.level} · ${words.length} từ · ${({ easy: "Dễ", normal: "Vừa", hard: "Khó" })[cfg.diff]} · <span class="kbd">Esc</span> tạm dừng</p>
      </div>`;

    const stage = box.querySelector("#stage"), cv = box.querySelector("#cv"), ctx = cv.getContext("2d"), msg = box.querySelector("#msg");
    let W = 0, H = 0, dpr = 1, bg = null;
    const vv = window.visualViewport;
    function resize() {
      const oldH = H;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = stage.clientWidth;
      const phone = innerWidth < 700;
      // điện thoại: tính theo vùng nhìn thấy thật (đã trừ bàn phím) để ô gõ không bị bàn phím che
      const vh = phone && vv ? vv.height : innerHeight;
      if (isHz) H = Math.round(phone ? Math.max(220, Math.min(300, innerHeight * 0.3)) : Math.max(300, Math.min(400, innerHeight * 0.42)));
      else if (phone) { const rest = (box.querySelector(".rain-hud")?.offsetHeight || 56) + (box.querySelector(".rain-input")?.offsetHeight || 72) + 24; H = Math.round(Math.max(220, Math.min(520, vh - rest, innerHeight * 0.5))); }
      else H = Math.round(Math.max(280, Math.min(520, innerHeight * 0.56)));
      stage.style.height = H + "px";
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
      bg = null; // vẽ lại nền tĩnh cho kích thước mới
      // giữ vị trí tương đối của bong bóng khi sân đổi chiều cao (bàn phím mở/đóng), tránh bóng nhảy
      if (oldH && oldH !== H && S) S.bubbles.forEach((b) => { b.y *= H / oldH; b.vy = (H + 2 * b.r) / fallTime(); });
      if (S) draw();
    }
    let S = null;
    resize();
    let rzRaf = 0;
    const onResize = () => { cancelAnimationFrame(rzRaf); rzRaf = requestAnimationFrame(resize); };
    addEventListener("resize", onResize);
    if (vv) vv.addEventListener("resize", onResize);

    const queue = words.slice();
    S = { score: 0, level: 1, combo: 0, lives: 3, popped: 0, bubbles: [], parts: [], floats: [], reveals: [], stars: [], wrong: [], spawnAt: 0, paused: false, over: false, started: performance.now(), pausedFor: 0, pauseStart: 0, flash: 0 };
    for (let i = 0; i < 60; i++) S.stars.push({ x: Math.random(), y: Math.random(), s: Math.random() < 0.2 ? 2 : 1, v: 0.004 + Math.random() * 0.01 });
    const T = { easy: 15, normal: 11.5, hard: 8.5 }[cfg.diff] * (isHz ? 2.4 : 1);   // giây để bóng rơi hết màn hình ở màn 1
    const GAP = { easy: 2700, normal: 2100, hard: 1500 }[cfg.diff] * (isHz ? 2.2 : 1);
    const MAXB = isHz ? { easy: 1, normal: 2, hard: 2 }[cfg.diff] : { easy: 3, normal: 4, hard: 6 }[cfg.diff];
    const fallTime = () => Math.max(isHz ? 7 : 3.2, T * Math.pow(0.88, S.level - 1));
    const gapTime = () => Math.max(isHz ? 2500 : 650, GAP * Math.pow(0.9, S.level - 1));

    const hud = {
      score: box.querySelector("#h-score"), level: box.querySelector("#h-level"), combo: box.querySelector("#h-combo"), lives: box.querySelector("#h-lives"),
    };
    function drawHud() {
      hud.score.textContent = S.score; hud.level.textContent = S.level;
      hud.combo.textContent = "×" + mult();
      hud.lives.innerHTML = [0, 1, 2].map((i) => `<span class="heart ${i < S.lives ? "on" : ""}">${ic("heart")}</span>`).join("");
    }
    const mult = () => Math.min(5, 1 + Math.floor(S.combo / 5));

    function measure(w) {
      if (isVi) {
        ctx.font = "700 15px 'Be Vietnam Pro', sans-serif";
        const lines = viLines(w);
        const wmax = Math.max(...lines.map((l) => ctx.measureText(l).width));
        return Math.max(44, Math.min(92, Math.max(wmax / 2 + 14, lines.length * 10 + 22)));
      }
      ctx.font = `700 ${isHz ? 17 : 26}px ${isHz ? "'Be Vietnam Pro'" : "'Noto Sans SC'"}, sans-serif`;
      const top = ctx.measureText(isHz ? w.py : w.hz).width;
      ctx.font = "500 12px 'Be Vietnam Pro', sans-serif";
      const vi = ctx.measureText(shortVi(w.vi)).width;
      return Math.max(40, Math.min(86, Math.max(top, vi) / 2 + 14));
    }
    // nghĩa ngắn cho bong bóng: lấy ý đầu, bỏ phần trong ngoặc; nếu cả nghĩa nằm trong ngoặc (trợ từ 得, 过, 着) thì giữ phần đó
    const shortVi = (s) => {
      const first = String(s || "").split(/[;；]/)[0];
      let t = first.replace(/\s*\(.*?\)\s*/g, " ").trim();
      if (!t) t = first.replace(/[()]/g, "").trim();
      return t.length > 22 ? t.slice(0, 21) + "…" : t;
    };

    function spawn(now) {
      if (!queue.length || S.bubbles.length >= MAXB) return;
      const w = queue.shift();
      const r = measure(w);
      const x = r + 6 + Math.random() * Math.max(1, W - 2 * r - 12);
      S.bubbles.push({ w, tgt: isHz ? null : target(w), tgts: isHz ? null : (isVi ? synOf(w) : [w]).map((x) => ({ w: x, t: target(x) })), x, y: -r, r, vy: (H + 2 * r) / fallTime(), color: COLORS[Math.floor(Math.random() * COLORS.length)], phase: Math.random() * 6, born: now });
      S.spawnAt = now + gapTime();
    }

    function pop(b, now, hitWord) {
      S.bubbles.splice(S.bubbles.indexOf(b), 1);
      if (isVi) S.reveals.push({ x: Math.min(W - 50, Math.max(50, b.x)), y: Math.max(64, b.y), hz: (hitWord || b.w).hz, py: (hitWord || b.w).py, t: 0, bad: false });
      S.combo++; S.popped++;
      const pts = 10 * S.level * mult() + Math.round(20 * Math.max(0, 1 - b.y / H));
      S.score += pts;
      S.floats.push({ x: b.x, y: b.y, text: `+${pts}${mult() > 1 ? " ×" + mult() : ""}`, t: 0 });
      for (let i = 0; i < 18; i++) {
        const a = (Math.PI * 2 * i) / 18 + Math.random() * 0.3, sp = 80 + Math.random() * 160;
        S.parts.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 0.6 + Math.random() * 0.3, t: 0, c: b.color });
      }
      S.rings = (S.rings || []).concat([{ x: b.x, y: b.y, r: b.r, t: 0, c: b.color }]);
      SFX.pop(S.combo);
      if (S.popped % 6 === 0) { S.level++; SFX.level(); banner(`MÀN ${S.level}`); S.bubbles.forEach((x) => (x.vy = (H + 2 * x.r) / fallTime())); }
      drawHud();
      if (isHz) nextTarget();
      checkEnd();
    }
    function miss(b) {
      if (S.over) return;
      S.bubbles.splice(S.bubbles.indexOf(b), 1);
      S.lives--; S.combo = 0; S.flash = 1;
      S.wrong.push(b.w);
      if (isVi) S.reveals.push({ x: Math.min(W - 60, Math.max(60, b.x)), y: H - 46, hz: b.w.hz, py: b.w.py, t: 0, bad: true });
      SFX.miss();
      drawHud();
      if (S.lives <= 0) return gameOver(false);
      if (isHz && b === hzTarget) nextTarget();
      checkEnd();
    }
    function checkEnd() { if (!queue.length && !S.bubbles.length && !S.over) gameOver(true); }

    let bannerT = 0;
    function banner(text, keep) { msg.textContent = text; msg.classList.add("show"); clearTimeout(bannerT); if (!keep) bannerT = setTimeout(() => msg.classList.remove("show"), 1100); }

    // ---------- Vòng lặp ----------
    let last = performance.now(), raf = 0;
    function frame(now) {
      if (!box.isConnected) return cleanup();
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!S.paused && !S.over) {
        if (now >= S.spawnAt) spawn(now);
        S.bubbles.forEach((b) => { b.y += b.vy * dt; b.phase += dt * 2; });
        for (const b of S.bubbles.slice()) if (b.y - b.r > H) miss(b);
        S.parts.forEach((p) => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; });
        S.parts = S.parts.filter((p) => p.t < p.life);
        S.floats.forEach((f) => { f.t += dt; f.y -= 40 * dt; });
        S.floats = S.floats.filter((f) => f.t < 0.9);
        S.reveals.forEach((r) => (r.t += dt));
        S.reveals = S.reveals.filter((r) => r.t < 1.6);
        (S.rings || []).forEach((r) => (r.t += dt));
        S.rings = (S.rings || []).filter((r) => r.t < 0.35);
        S.stars.forEach((s) => { s.y += s.v * dt * 10; if (s.y > 1) { s.y = 0; s.x = Math.random(); } });
        S.flash = Math.max(0, S.flash - dt * 2.5);
      }
      // đang tạm dừng: khung hình đứng yên, không cần vẽ lại (đỡ tốn pin)
      const idle = S.paused && !S.parts.length && !S.floats.length && !S.reveals.length;
      if (!idle || !S.drewIdle) { draw(); S.drewIdle = idle; }
      raf = requestAnimationFrame(frame);
    }
    // Nền tĩnh (dải màu + mặt đất) vẽ một lần vào canvas phụ, mỗi khung chỉ chép lại
    function background() {
      if (bg) return bg;
      bg = document.createElement("canvas"); bg.width = W * dpr; bg.height = H * dpr;
      const c = bg.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#14122b"); g.addColorStop(1, "#2a1b3d");
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 12) { c.fillStyle = (x / 12) % 2 ? "#ff5d73" : "#c23a52"; c.fillRect(x, H - 6, 12, 6); }
      return bg;
    }
    // Chữ trên bong bóng (có bóng đổ) vẽ sẵn một lần cho mỗi bong bóng; shadowBlur mỗi khung hình rất tốn trên điện thoại
    const fontsReady = () => !document.fonts || document.fonts.status === "loaded";
    function labelOf(b) {
      if (b.label) return b.label;
      const lw = Math.ceil(b.r * 2 + 48), lh = Math.ceil(b.r * 2 + 24);
      const c = document.createElement("canvas"); c.width = lw * dpr; c.height = lh * dpr;
      const x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.translate(lw / 2, lh / 2);
      paintLabel(x, b);
      c.cssW = lw; c.cssH = lh;
      if (fontsReady()) b.label = c;   // font chưa tải xong thì vẽ lại ở khung sau
      return c;
    }
    function paintLabel(ctx, b) {
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 4;
      {
        const wob = 0; b = { w: b.w, x: 0, y: 0 };
        if (isVi) {
          const lines = viLines(b.w), hv = cfg.diff === "easy" && b.w.hv ? b.w.hv : "";
          const lh = 18, y0 = b.y - ((lines.length - 1) * lh) / 2 - (hv ? 7 : 0);
          ctx.font = "700 15px 'Be Vietnam Pro', sans-serif";
          lines.forEach((l, i) => ctx.fillText(l, b.x + wob, y0 + i * lh));
          if (hv) { ctx.font = "500 12px 'Be Vietnam Pro', sans-serif"; ctx.fillStyle = "#ffe9a8"; ctx.fillText(hv, b.x + wob, y0 + lines.length * lh); }
          return;
        }
        if (isHz) {
          ctx.font = "700 17px 'Be Vietnam Pro', sans-serif"; ctx.fillText(b.w.py, b.x + wob, b.y - 7);
        } else {
          ctx.font = "700 26px 'Noto Sans SC', sans-serif"; ctx.fillText(b.w.hz, b.x + wob, b.y - 7);
        }
        ctx.font = "500 12px 'Be Vietnam Pro', sans-serif"; ctx.fillStyle = "#ffe9a8"; ctx.fillText(shortVi(b.w.vi), b.x + wob, b.y + 15);
      }
    }
    const snap = (v) => Math.round(v * dpr) / dpr;
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(background(), 0, 0, W, H);
      S.stars.forEach((s) => { ctx.fillStyle = s.s > 1 ? "#cfc6ff" : "#6d64a8"; ctx.fillRect(Math.round(s.x * W), Math.round(s.y * H), s.s * 2, s.s * 2); });
      // bong bóng
      S.bubbles.forEach((b) => {
        const wob = Math.sin(b.phase) * 3;
        const sp = bubbleSprite(b.r, b.color, isHz && b === hzTarget);
        const size = sp.width * 3;
        ctx.drawImage(sp, Math.round(b.x + wob - size / 2), Math.round(b.y - size / 2), size, size);
        const lb = labelOf(b);
        ctx.drawImage(lb, snap(b.x + wob - lb.cssW / 2), snap(b.y - lb.cssH / 2), lb.cssW, lb.cssH);
      });
      // vòng nổ, mảnh vỡ, điểm bay
      (S.rings || []).forEach((r) => { ctx.strokeStyle = r.c; ctx.globalAlpha = 1 - r.t / 0.35; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(r.x, r.y, r.r + r.t * 140, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; });
      S.parts.forEach((p) => { ctx.globalAlpha = 1 - p.t / p.life; ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4); });
      ctx.globalAlpha = 1;
      S.floats.forEach((f) => { ctx.globalAlpha = 1 - f.t / 0.9; ctx.fillStyle = "#ffe14d"; ctx.font = "12px 'Press Start 2P', monospace"; ctx.textAlign = "center"; ctx.fillText(f.text, f.x, f.y); });
      ctx.globalAlpha = 1;
      // chữ Hán hiện ra khi bắn trúng (vàng) hoặc khi để lọt (đỏ) ở chế độ nghĩa
      S.reveals.forEach((r) => {
        ctx.globalAlpha = Math.min(1, 2.2 * (1 - r.t / 1.6)); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 6;
        ctx.fillStyle = r.bad ? "#ff8fa0" : "#ffe14d"; ctx.font = "700 30px 'Noto Sans SC', sans-serif"; ctx.fillText(r.hz, r.x, r.y - 12 - r.t * 14);
        ctx.fillStyle = "#fff"; ctx.font = "600 13px 'Be Vietnam Pro', sans-serif"; ctx.fillText(r.py, r.x, r.y + 14 - r.t * 14);
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      if (S.flash) { ctx.fillStyle = `rgba(255,60,80,${0.35 * S.flash})`; ctx.fillRect(0, 0, W, H); }
    }

    // ---------- Chế độ phiên âm ----------
    const input = box.querySelector("#ans");
    if (input) {
      const tryPop = (final) => {
        const val = input.value.trim();
        if (!val) return;
        let hitWord = null;
        const hit = S.bubbles.slice().sort((a, b) => b.y - a.y).find((b) => { const m = b.tgts.find((x) => matches(val, x.t, cfg.diff)); if (m) hitWord = m.w; return !!m; });
        if (hit) { pop(hit, performance.now(), hitWord); input.value = ""; return; }
        if (final) {
          S.combo = 0; drawHud(); SFX.wrong();
          input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake");
          // gợi ý khi chữ cái đúng mà thiếu/sai thanh
          const a = analyze(val);
          if (cfg.diff !== "easy" && S.bubbles.some((b) => b.tgts.some((x) => x.t.letters === a.letters))) banner("Kiểm tra lại thanh điệu");
        }
      };
      input.addEventListener("input", () => tryPop(false));
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); tryPop(true); } });
      box.querySelector("#enter").onclick = () => { tryPop(true); input.focus(); };
      setTimeout(() => input.focus(), 50);
    }

    // ---------- Chế độ chữ Hán: luôn nhắm bong bóng thấp nhất ----------
    let hzTarget = null, writer = null, charIdx = 0, mistakes = 0;
    const padSize = () => Math.min(220, Math.max(150, Math.floor((box.clientWidth - 40) * 0.5)));
    function nextTarget() {
      if (!isHz || S.over) return;
      const lowest = S.bubbles.slice().sort((a, b) => b.y - a.y)[0] || null;
      if (lowest === hzTarget && (writer || !lowest)) return;
      hzTarget = lowest; charIdx = 0;
      startChar();
    }
    function startChar() {
      const pad = box.querySelector("#pad");
      if (!pad) return;
      if (writer) { try { writer.cancelQuiz(); } catch (e) {} }
      pad.innerHTML = "";
      const py = box.querySelector("#pad-py"), vi = box.querySelector("#pad-vi"), step = box.querySelector("#pad-step");
      if (!hzTarget) { py.textContent = "…"; vi.textContent = "Chờ bong bóng tiếp theo"; step.textContent = ""; writer = null; pad.style.width = pad.style.height = padSize() + "px"; return; }
      const w = hzTarget.w, ch = w.hz[charIdx];
      py.textContent = w.py; vi.textContent = w.vi; step.innerHTML = `Chữ ${charIdx + 1}/${w.hz.length}${cfg.diff === "easy" ? " · tô theo chữ mờ" : ""}`;
      const sz = padSize();
      pad.style.width = pad.style.height = sz + "px";
      const dark = document.documentElement.dataset.theme === "dark";
      const me = hzTarget;
      writer = HanziWriter.create(pad, ch, {
        width: sz, height: sz, padding: 8, showCharacter: false, showOutline: cfg.diff === "easy",
        showHintAfterMisses: cfg.diff === "hard" ? false : 2, highlightOnComplete: true,
        strokeColor: dark ? "#f1ebe3" : "#1f1a17", outlineColor: dark ? "#3a322a" : "#e6ddd1", drawingColor: "#c0392b", highlightColor: "#d4a017", drawingWidth: 7,
        onLoadCharDataError: () => {           // không có dữ liệu nét: bỏ từ này, không trừ mạng
          if (me !== hzTarget) return;
          S.bubbles.splice(S.bubbles.indexOf(me), 1);
          toast(`Chưa có dữ liệu nét cho chữ ${ch}, bỏ qua`, { type: "info" });
          writer = null; hzTarget = null; nextTarget(); checkEnd();
        },
      });
      writer.quiz({
        onCorrectStroke: () => SFX.stroke(),
        onMistake: () => { mistakes++; S.combo = 0; drawHud(); },
        onComplete: () => {
          if (me !== hzTarget || !S.bubbles.includes(me)) return;
          charIdx++;
          if (charIdx < w.hz.length) { setTimeout(startChar, 250); return; }
          writer = null;
          setTimeout(() => { if (S.bubbles.includes(me)) pop(me, performance.now()); }, 200);
        },
      });
    }
    if (isHz) {
      startChar();
      box.querySelector("#skip").onclick = () => { if (hzTarget && S.bubbles.includes(hzTarget)) miss(hzTarget); };
      // khi chưa có bong bóng nào, chờ bong bóng đầu tiên rồi mới nhắm
      const watch = setInterval(() => { if (!box.isConnected || S.over) return clearInterval(watch); if (!hzTarget || !S.bubbles.includes(hzTarget)) nextTarget(); }, 300);
    }

    // ---------- Tạm dừng, âm thanh ----------
    function setPause(p) {
      if (S.over || S.paused === p) return;
      S.paused = p;
      if (p) { S.pauseStart = performance.now(); banner("TẠM DỪNG", true); }
      else { S.pausedFor += performance.now() - S.pauseStart; S.spawnAt += performance.now() - S.pauseStart; msg.classList.remove("show"); if (input) input.focus(); }
    }
    box.querySelector("#h-pause").onclick = () => setPause(!S.paused);
    box.querySelector("#h-exit").onclick = async () => {
      setPause(true);
      if (await uiConfirm("Kết quả lượt này sẽ không được lưu.", { title: "Thoát trò chơi?", okText: "Thoát", cancelText: "Chơi tiếp" })) { S.over = true; cleanup(); App.setFocus(false); App.keyHandler = null; document.body.classList.remove("in-game"); run(std, box); }
      else setPause(false);
    };
    stage.addEventListener("click", () => { if (S.paused) setPause(false); });
    box.querySelector("#h-sound").onclick = (e) => {
      Store.state.settings.sfxOff = !muted(); Store.save();
      e.currentTarget.innerHTML = ic(muted() ? "soundoff" : "soundon");
    };
    App.keyHandler = (e) => { if (e.key === "Escape") { e.preventDefault(); setPause(!S.paused); } };
    const onVis = () => { if (document.hidden) setPause(true); };
    document.addEventListener("visibilitychange", onVis);

    function cleanup() {
      cancelAnimationFrame(raf);
      document.body.classList.remove("in-game");
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (writer) { try { writer.cancelQuiz(); } catch (e) {} }
    }

    // ---------- Kết thúc ----------
    function gameOver(cleared) {
      if (S.over) return;
      S.over = true;
      (cleared ? SFX.level : SFX.over)();
      banner(cleared ? "HẾT BONG BÓNG!" : "GAME OVER", true);
      const seconds = Math.round((performance.now() - S.started - S.pausedFor) / 1000);
      const total = S.popped + S.wrong.length;
      const modeName = isHz ? "chữ Hán" : isVi ? "nghĩa Việt" : "phiên âm";
      const isBest = Practice.record({ type: "rain", std, level: cfg.level, title: `Mưa từ vựng (${modeName}) · ${Practice.STD[std].name} cấp ${cfg.level}`, score: S.score, correct: S.popped, total, seconds, bestKey: `rain:${std}:${cfg.mode}:${cfg.level}` });
      setTimeout(() => {
        cleanup();
        App.setFocus(false);
        document.body.classList.remove("in-game");
        App.keyHandler = null;
        const wrong = S.wrong.map((w) => ({ hz: w.hz, py: w.py, vi: w.vi, id: w.id }));
        Practice.results(box, {
          score: S.score, correct: S.popped, total, seconds, isBest, wrong, from: "Mưa từ vựng",
          onRetryWrong: () => game(box, std, cfg, shuffle(S.wrong.slice())),
          onAgain: () => run(std, box),
        });
        const head = box.querySelector(".result-card h2");
        if (head && !cleared) head.insertAdjacentHTML("afterend", `<p class="muted" style="margin:0">Hết mạng ở màn ${S.level}${queue.length ? ` · còn ${queue.length} từ chưa rơi` : ""}</p>`);
      }, 1200);
    }

    stage._rain = S;   // để kiểm thử tự động đọc trạng thái
    drawHud();
    banner("SẴN SÀNG!");
    S.spawnAt = performance.now() + 900;
    raf = requestAnimationFrame(frame);
    box.scrollIntoView({ block: "start" });
  }

  Practice.register("rain", { run });
  window.RainGame = { analyze, target, matches, viText, viKey, lines: viLines, shortVi: (s) => { const f = String(s || "").split(/[;；]/)[0]; let t = f.replace(/\s*\(.*?\)\s*/g, " ").trim(); if (!t) t = f.replace(/[()]/g, "").trim(); return t; } };   // dùng cho kiểm thử
})();
