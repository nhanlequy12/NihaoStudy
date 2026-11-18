// Luyện tập: Đoán nghĩa qua Hán Việt – xem âm Hán Việt (và chữ Hán) của một từ rồi chọn nghĩa tiếng Việt trong 4 phương án.
// Mục tiêu: cho người học thấy âm Hán Việt giúp đoán nghĩa (经济 kinh tế, 图书馆 đồ thư quán → thư viện).
// Chỉ dùng từ mà âm Hán Việt thật sự gợi nghĩa (quy tắc lọc bên dưới, danh sách chặn / bổ sung trong js/data/practice-hanviet-data.js;
// cách rà soát xem docs/kiem-tra-luyen-tap-10-han-viet.md). Sau khi trả lời, hiện từng chữ với âm Hán Việt và nghĩa riêng.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const KEY = "hanviet";
  const L4 = "ABCD";
  const HAN = /^[㐀-鿿]+$/;

  // ---------- Chuẩn hoá ----------
  // bỏ phần trong ngoặc (thường là giải thích, không phải nghĩa chính), bỏ dấu câu, chữ thường
  const nv = (s) => String(s || "").normalize("NFC").toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^\p{L}\s]/gu, " ").replace(/\s+/g, " ").trim();
  // nghĩa hiển thị: phần trước dấu chấm phẩy
  const meaning = (w) => String(w.vi || "").split(/[;；]/)[0].trim();
  // hư từ tiếng Việt không tính khi so hai nghĩa có trùng nhau không
  const STOP = new Set("là của và thì mà các những cái này kia đó ấy rồi đã sẽ đang được bị ở với cho để một rất lắm quá ra vào lên xuống đi làm có không người sự việc".split(" "));
  const data = () => window.HANVIET_DATA || { block: {}, allow: {} };

  // ---------- Lọc: âm Hán Việt có gợi nghĩa không ----------
  // full: cả chuỗi Hán Việt nằm nguyên trong nghĩa (经济 kinh tế = «kinh tế»)
  // part: một số âm Hán Việt có trong nghĩa (图书馆 đồ thư quán = «thư viện»); từ 4 chữ trở lên cần ít nhất 2 âm trùng
  // allow: từ Hán Việt quen thuộc mà nghĩa ghi bằng từ thuần Việt (朋友 bằng hữu = «bạn bè»), duyệt tay
  function hintOf(w) {
    if (!w || !w.hv || !w.vi || !HAN.test(w.hz || "")) return null;
    const n = [...w.hz].length;
    const hv = nv(w.hv).split(" ");
    if (hv.length !== n || hv.some((x) => !x)) return null;          // âm Hán Việt phải khớp từng chữ
    const D = data();
    if (D.block[w.hz]) return null;
    const v = nv(meaning(w)).split(" ");
    if (!v[0]) return null;
    if ((" " + v.join(" ") + " ").includes(" " + hv.join(" ") + " ")) return { kind: "full", hits: hv.slice() };
    const hits = hv.filter((x) => v.includes(x));
    if (hits.length && hits.length >= (n >= 4 ? 2 : 1)) return { kind: "part", hits };
    if (D.allow[w.hz]) return { kind: "allow", hits: [], why: D.allow[w.hz] };
    return null;
  }
  const posOf = (w) => String(w.pos || "").split(/[,/]/)[0].trim();
  const contentSet = (s) => new Set(nv(s).split(" ").filter((x) => x && !STOP.has(x)));

  const cache = {};
  function poolOf(std, level) {
    const k = std + level;
    if (!cache[k]) {
      const seen = new Set();
      cache[k] = P().wordsOf(std, level).filter((w) => !seen.has(w.hz) && seen.add(w.hz)).map((w) => { const h = hintOf(w); return h ? { w, hint: h } : null; }).filter(Boolean);
    }
    return cache[k];
  }

  // ---------- Phương án ----------
  // nhiễu: cùng cấp, ưu tiên cùng từ loại; nghĩa khác hẳn (không trùng âm tiết thực nào với nghĩa đúng),
  // không trùng âm nào với âm Hán Việt của từ hỏi (để chỉ đáp án đúng được Hán Việt gợi ý), không chung chữ Hán với từ hỏi
  const candCache = {};
  function candsOf(std, level) {
    const k = std + level;
    if (!candCache[k]) {
      const seen = new Set();
      candCache[k] = P().wordsOf(std, level).filter((x) => x.vi && meaning(x) && !seen.has(x.hz) && seen.add(x.hz)).map((x) => {
        const m = meaning(x), mn = nv(m);
        // syl: mọi âm tiết hiển thị, kể cả trong ngoặc (để phương án nhiễu không chứa âm Hán Việt của từ hỏi ở bất kỳ đâu)
        return { x, m, mn, syl: nv(m.replace(/[()]/g, " ")).split(" "), C: contentSet(m), pos: posOf(x) };
      }).filter((c) => c.mn);
    }
    return candCache[k];
  }
  function optionsOf(it, std, level, rnd = Math.random) {
    const w = it.w, ans = meaning(w), an = nv(ans);
    const A = contentSet(ans), H = new Set(nv(w.hv).split(" ")), chars = new Set([...w.hz]), pos = posOf(w);
    const ok = (c) => c.x.hz !== w.hz && c.mn !== an && ![...c.x.hz].some((ch) => chars.has(ch))
      && !c.syl.some((y) => H.has(y)) && ![...c.C].some((y) => A.has(y));
    const mix = (arr) => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    const all = mix(candsOf(std, level).filter(ok));
    const picked = [];
    for (const c of all.filter((c) => c.pos === pos).concat(all.filter((c) => c.pos !== pos))) {
      if (picked.length >= 3) break;
      // ba phương án nhiễu cũng phải khác nghĩa nhau
      if (picked.some((p) => p.mn === c.mn || [...p.C].some((z) => c.C.has(z)))) continue;
      picked.push(c);
    }
    return mix([{ text: ans, ok: true, w }].concat(picked.map((c) => ({ text: c.m, ok: false, w: c.x }))));
  }

  // ---------- Tách từng chữ ----------
  // chữ → các từ khác (trong toàn bộ từ vựng của web) có chữ đó với cùng âm Hán Việt và Hán Việt gợi nghĩa,
  // để thấy cùng một «yếu tố Hán Việt» lặp lại: 描 miêu → 描写 miêu tả
  let charIdx = null;
  function sameMorpheme(c, hvSyl, notHz) {
    if (!charIdx) {
      charIdx = new Map();
      const seen = new Set();
      VOCAB.concat(window.H3 ? H3.words : []).forEach((x) => {
        if (seen.has(x.hz) || [...x.hz].length < 2 || !hintOf(x)) return;
        seen.add(x.hz);
        const hv = nv(x.hv).split(" ");
        [...x.hz].forEach((ch, j) => { if (!charIdx.has(ch)) charIdx.set(ch, []); charIdx.get(ch).push({ x, s: hv[j] }); });
      });
    }
    return (charIdx.get(c) || []).filter((e) => e.s === hvSyl && e.x.hz !== notHz).slice(0, 2).map((e) => e.x);
  }
  function breakdown(w) {
    const hv = String(w.hv).trim().split(/\s+/), A = new Set(nv(meaning(w)).split(" "));
    const parse = window.ToneDrill && ToneDrill.parse;
    const syl = parse ? parse(w.py) : null;
    // âm đọc của chữ trong từ có khớp âm đọc của mục chữ đơn không (待 dài trong 待遇 ≠ mục 待 dāi «nán lại»)
    const sameReading = (e, i) => {
      if (!syl || syl.length !== [...w.hz].length) return true;
      const s = parse(e.py);
      return !!s && s.length === 1 && s[0].s === syl[i].s && (syl[i].t === 5 || s[0].t === syl[i].t);
    };
    return [...w.hz].map((c, i) => {
      const e = P().lookup(c);
      // chỉ dùng nghĩa của mục chữ đơn khi âm Hán Việt và âm đọc trùng (行 hành «đi» ≠ 行 hàng trong 银行)
      const own = e && e.hz === c && nv(e.hv) === nv(hv[i] || "") && sameReading(e, i);
      // nghĩa ngắn: bỏ ngoặc, lấy tối đa 2 nghĩa; bỏ hẳn nếu chỉ là ghi chú dùng chữ Hán (子: «như trong 桌子…»)
      let vi = own ? meaning(e).replace(/\s*\([^)]*(\)|$)/g, "").split(/,\s*/).slice(0, 2).join(", ").trim() : "";
      if (/[㐀-鿿]/.test(vi)) vi = "";
      return { c, hv: hv[i] || "", hit: A.has(nv(hv[i] || "")), vi, py: own ? e.py : "", also: sameMorpheme(c, nv(hv[i] || ""), w.hz) };
    });
  }
  function breakdownHtml(w) {
    return `<div class="hvq-break">${breakdown(w).map((x) => `<div class="hvq-ch"><span class="zh hvq-c">${esc(x.c)}</span><span class="hvq-hv ${x.hit ? "hit" : ""}">${esc(x.hv)}</span>${x.py ? `<span class="small">${pyHtml(x.py)}</span>` : ""}${x.vi ? `<span class="small">${esc(x.vi)}</span>` : ""}${x.also.length ? `<span class="small muted">cũng gặp trong: ${x.also.map((y) => `<span class="zh">${esc(y.hz)}</span> ${esc(y.hv)}`).join(", ")}</span>` : ""}</div>`).join("")}</div>`;
  }

  function css() {
    if (document.getElementById("hvq-css")) return;
    const st = document.createElement("style");
    st.id = "hvq-css";
    st.textContent = `.hvq-q{text-align:center}.hvq-hvbig{font-size:1.9rem;font-weight:700;letter-spacing:.01em}.hvq-hz{font-family:var(--font-zh);font-size:2.2rem;line-height:1.2}
.hvq-break{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}.hvq-ch{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:92px;max-width:180px;padding:8px 10px;border-radius:10px;background:var(--surface-2);text-align:center}
.hvq-c{font-size:1.6rem;line-height:1.2}.hvq-hv{font-weight:700}.hvq-hv.hit{color:var(--green)}.hvq-mean b{color:var(--green)}`;
    document.head.appendChild(st);
  }
  // tô các âm Hán Việt xuất hiện trong nghĩa
  function markMeaning(text, w) {
    const H = new Set(nv(w.hv).split(" "));
    return text.split(/(\s+)/).map((t) => (H.has(nv(t)) ? `<b>${esc(t)}</b>` : esc(t))).join("");
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    App.keyHandler = null;
    css();
    const levels = P().STD[std].levels.filter((l) => poolOf(std, l).length >= 4);
    if (!levels.length) { box.innerHTML = `<div class="card center empty"><h2>Chưa có từ luyện</h2></div>`; return; }
    P().setup(box, {
      std,
      levels,
      counts: [10, 20, 30],
      intro: "Xem âm Hán Việt của một từ rồi đoán nghĩa. Phần lớn từ Hán có âm Hán Việt quen thuộc với người Việt (经济 kinh tế, 图书馆 đồ thư quán → thư viện), nên nhớ âm Hán Việt là đoán được nghĩa.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> có chữ Hán, âm Hán Việt và pinyin. <b>Vừa:</b> chữ Hán và âm Hán Việt. <b>Khó:</b> chỉ có âm Hán Việt, chữ Hán hiện sau khi trả lời.<br>Sau mỗi câu, web tách từng chữ kèm âm Hán Việt và nghĩa riêng để bạn thấy vì sao đoán được.<br>Chỉ dùng từ mà âm Hán Việt gợi đúng nghĩa; từ dễ hiểu lầm (明白 minh bạch = hiểu, không phải «minh bạch») đã được loại.<br>Phím: <span class="kbd">1</span>–<span class="kbd">4</span> chọn · <span class="kbd">Space</span> nghe từ · <span class="kbd">Enter</span> câu tiếp.</details>`,
      bestKeyOf: (v) => `${KEY}:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = poolOf(std, v.level);
        if (pool.length < 4) { toast("Cấp này chưa đủ từ để luyện"); return; }
        session(box, std, v, shuffle(pool).slice(0, v.count));
      },
    });
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items) {
    App.setFocus(true);
    css();
    const t0 = Date.now();
    const easy = cfg.diff === "easy", hard = cfg.diff === "hard";
    const feat = P().feature(KEY);
    let i = 0, score = 0, right = 0;
    const wrong = [];

    function show() {
      if (i >= items.length) return finish();
      const it = items[i], w = it.w;
      const opts = optionsOf(it, std, cfg.level);
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card">
          <div class="hvq-q" id="hvq-q">
            <div class="small muted">Âm Hán Việt</div>
            <div class="hvq-hvbig">${esc(w.hv)}</div>
            ${hard ? "" : `<div class="zh hvq-hz">${esc(w.hz)}</div>${easy ? `<div>${pyHtml(w.py)}</div>` : ""}`}
          </div>
          <div class="small muted center" style="margin-top:12px">Từ này nghĩa là gì?</div>
          <div class="options one-col" id="opts">${opts.map((o, k) => `<button class="option vi-text hvq-opt" data-k="${k}"><span class="opt-key">${k + 1}</span><span>${esc(o.text)}</span></button>`).join("")}</div>
          <div class="small muted kbd-hint" style="margin-top:10px"><span class="kbd">1</span>–<span class="kbd">4</span> chọn · <span class="kbd">Space</span> nghe từ · <span class="kbd">Enter</span> câu tiếp</div>
          <div id="fb"></div>
        </div>`;
      box.querySelectorAll(".hvq-opt").forEach((b) => b.onclick = () => choose(it, opts, +b.dataset.k));
      App.keyHandler = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
        const k = e.key.toLowerCase();
        const idx = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 }[k];
        const bs = box.querySelectorAll(".hvq-opt");
        if (idx != null && bs[idx] && !bs[idx].disabled) { e.preventDefault(); bs[idx].click(); }
        else if (e.key === " " || e.code === "Space") { e.preventDefault(); TTS.speak(w.hz); }
        else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) { e.preventDefault(); n.click(); } }
      };
    }

    function choose(it, opts, k) {
      if (box.querySelector("#next")) return;
      const w = it.w, pick = opts[k], ok = pick.ok;
      box.querySelectorAll(".hvq-opt").forEach((b, j) => {
        b.disabled = true;
        if (opts[j].ok) b.classList.add("correct");
        else if (j === k) b.classList.add("wrong");
      });
      if (ok) { score += 10; right++; }
      else wrong.push({ hz: w.hz, py: w.py, vi: w.vi, id: w.id || null, note: `Hán Việt: ${w.hv} · bạn chọn «${pick.text}»` });
      box.querySelector("#hvq-q").innerHTML = `<div class="small muted">Âm Hán Việt</div><div class="hvq-hvbig">${esc(w.hv)}</div><div class="zh hvq-hz">${esc(w.hz)}</div><div>${pyHtml(w.py)}</div>`;
      const tip = it.hint.kind === "allow" ? `«${w.hv}» là từ Hán Việt có trong tiếng Việt${it.hint.why ? ` (${it.hint.why})` : ""}.`
        : it.hint.kind === "full" ? `Âm Hán Việt «${w.hv}» chính là từ tiếng Việt cùng nghĩa.`
        : `${it.hint.hits.length > 1 ? "Các âm" : "Âm"} ${it.hint.hits.map((x) => `«${x}»`).join(", ")} có ngay trong nghĩa tiếng Việt.`;
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
          <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng rồi" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span></div>
          <div class="hvq-mean"><span class="zh">${esc(w.hz)}</span> ${pyHtml(w.py)} ${speakBtn(w.hz)} – ${markMeaning(meaning(w), w)}</div>
          <p class="qa-explain">${ic("info")}<span>${esc(tip)}</span></p>
          <div class="small muted">${[...w.hz].length > 1 ? "Từng chữ" : "Chữ này"}</div>
          ${breakdownHtml(w)}
          ${ok ? "" : `<p class="small muted" style="margin-bottom:0">Bạn chọn «${esc(pick.text)}» – đó là nghĩa của <span class="zh">${esc(pick.w.hz)}</span> (${esc(pick.w.hv || "")}).</p>`}
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const bestKey = `${KEY}:${std}:${cfg.level}:${cfg.diff}`;
      const isBest = P().record({ type: KEY, std, level: cfg.level, title: `${P().nameIn(feat, std)} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.w.hz));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from: P().nameIn(feat, std),
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  // ---------- Kiểm tra tự động (dùng khi rà soát) ----------
  function check(tries = 3) {
    const out = { pools: {}, badOptions: [], fewSamePos: 0, total: 0 };
    ["hsk2", "hsk3"].forEach((std) => P().STD[std].levels.forEach((l) => {
      const pool = poolOf(std, l), kinds = {};
      pool.forEach((it) => {
        kinds[it.hint.kind] = (kinds[it.hint.kind] || 0) + 1;
        for (let t = 0; t < tries; t++) {
          const o = optionsOf(it, std, l);
          out.total++;
          if (o.length !== 4 || new Set(o.map((x) => nv(x.text))).size !== 4 || o.filter((x) => x.ok).length !== 1 || o.find((x) => x.ok).w !== it.w) out.badOptions.push(`${std}-${l} ${it.w.hz}`);
          // chỉ đáp án đúng được phép chứa âm Hán Việt của từ hỏi
          const H = new Set(nv(it.w.hv).split(" "));
          if (o.some((x) => !x.ok && nv(x.text.replace(/[()]/g, " ")).split(" ").some((y) => H.has(y)))) out.badOptions.push(`${std}-${l} ${it.w.hz} (nhiễu chứa âm Hán Việt)`);
          if (o.filter((x) => !x.ok && posOf(x.w) === posOf(it.w)).length < 3) out.fewSamePos++;
        }
      });
      out.pools[`${std}-${l}`] = { n: pool.length, kinds };
    }));
    return out;
  }

  P().register(KEY, { run });
  window.HanVietDrill = { hintOf, poolOf, optionsOf, breakdown, meaning, nv, check };
})();
