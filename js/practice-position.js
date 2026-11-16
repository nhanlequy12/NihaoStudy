// Luyện tập: Chọn vị trí từ – đặt từ cho sẵn vào đúng chỗ A · B · C · D trong câu.
// Câu lấy từ câu ví dụ tự soạn của web; bỏ chính từ trọng tâm của câu khi đó là hư từ (phó từ, giới từ, liên từ,
// lượng từ, động từ năng nguyện) rồi đánh dấu 4 chỗ giữa các từ. Vị trí phương án được sinh cố định theo câu để có thể rà soát trước toàn bộ.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const L4 = "ABCD";
  const PER_LEVEL = 160;

  // Không dùng làm từ cần đặt: trợ từ, từ dễ đứng nhiều chỗ
  const SKIP = new Set("了 的 地 得 着 过 吗 呢 吧 啊 呀 嘛 么 们 一 和 也许 或许 大概 当然 其实 突然 终于 原来 本来 总之 另外 而且 并且 首先 其次 最后 然后 后来 结果 其中 尤其".split(" "));
  const MODAL = new Set("能 会 可以 要 想 应该 应当 必须 愿意 敢 肯 能够 需要 得".split(" "));
  // Bổ ngữ một chữ: 想到, 看完… thì 想/看 không phải động từ năng nguyện
  const RESULT = new Set("到 完 好 见 懂 起 出 开 住 着 走 过 成 掉".split(" "));
  // Ngoài từ trọng tâm của câu, lấy thêm các hư từ thông dụng này (nghĩa và từ loại ổn định)
  const COMMON = new Set("都 也 很 就 才 再 又 不 已经 正在 一起 一定 太 最 更 比较 非常 特别 常常 经常 马上 刚 刚才 先 别 被 从 比 离 往 向 个 件 条 位 双 杯 瓶 碗 辆 本 节 块 次 能 会 可以 应该 必须 愿意 但是 可是 所以 因为 虽然 如果".split(" "));
  // Câu hỏi đã rà soát: mã câu → [từ cần đặt, vị trí đáp án 0–3, (giải thích riêng)]. Chỉ những câu này được dùng (js/data/position-ok.js)
  const OK = () => window.POSITION_OK || {};
  const VERBAL_MW = new Set("次 趟 遍 回 下 番".split(" "));
  const CAT = { "phó từ": "adv", "giới từ": "prep", "liên từ": "conj", "lượng từ": "mw" };
  const POST_PREP = new Set("在 到 给 向 往 自 于".split(" "));
  const NUMDEM = /^([一二两三四五六七八九十百千万几半每这那哪某上下前后整第]|[0-9]+)/;
  // Câu đã rà soát (16/11/2026) thấy có hơn một chỗ đặt được hoặc thông tin từ chưa chắc → không dùng
  const BAD = new Set([
    "今天真倒霉，手机丢了。",
    "今天网络不太好，视频很卡。",
    "他今天晚上要加班。",
    "他吃完饭便出去了。",
    "他太懒了，什么都不做。",
    "他始终相信自己能成功。",
    "他急忙穿上衣服出门了。",
    "他病了，因此没来。",
    "他经常幻想自己住在北京。",
    "他起床后先去洗漱。",
    "你可以在网上查询考试成绩。",
    "你可以在网上购买火车票。",
    "做饺子要先准备面粉。",
    "坐飞机前要先过安检。",
    "外国游客购物可以申请退税。",
    "大夫说我要休息。",
    "学校规定不能抽烟。",
    "小偷被警察当场抓住了。",
    "我不笨，只是学得慢。",
    "我们另找时间再谈吧。",
    "我几乎每天都上网。",
    "我想和你单独谈谈。",
    "我曾在北京住过两年。",
    "我的自行车坏了，要拿去修理。",
    "我的银行账户里没钱了。",
    "我等了你整整一天。",
    "明天下雨的话，我不去。",
    "有些人不喜欢吃肉。",
    "每个人都应该交税。",
    "每个地方的风俗都不一样。",
    "每天早晚都要刷牙。",
    "每天至少学一个小时。",
    "消防车很快就赶到了现场。",
    "秋天，公园里落叶遍地。",
    "这个地区夏天常常水资源短缺。",
    "这个消息让人难以相信。",
    "这个软件可以实时查看路况。",
    "这是我特意为你做的菜。",
    "这里的变化真大。",
    "这里的风景的确很美丽。",
  ]);

  // ---------- Sinh câu hỏi cố định theo câu ----------
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const posOf = (w) => String((w && w.pos) || "");
  const isVerb = (w) => /^động từ/.test(posOf(w));

  function catOf(x, prev, next) {
    if (!x.w || SKIP.has(x.t)) return null;
    if (MODAL.has(x.t)) return next && next.w && isVerb(next.w) && !RESULT.has(next.t) ? "modal" : null;
    if ((x.t === "不" || x.t === "没") && prev && isVerb(prev.w)) return null;   // 打不开, 睡不着: bổ ngữ khả năng
    const parts = posOf(x.w).split(/\s*[,/]\s*/).filter(Boolean);
    if (!parts.length || !CAT[parts[0]]) return null;
    if (CAT[parts[0]] === "prep" && prev && (NUMDEM.test(prev.t) || (x.t === "为" && isVerb(prev.w)))) return null;   // 一把钥匙, 评为
    return parts.length === 1 ? CAT[parts[0]] : "gen";   // nhiều từ loại: không khẳng định từ loại khi giải thích
  }

  // fixed = [hz, j]: dựng lại đúng câu hỏi đã rà soát; không có fixed: chế độ sinh (dùng khi rà soát)
  function build(s, cnt, fixed) {
    const toks = P().tokens(s.zh);
    const ok = (k) => k >= 0 && s.zh.split(toks[k].t).length === 2;
    if (fixed) {
      const k = toks.findIndex((x) => x.t === fixed[0]);
      const cat = ok(k) && catOf(toks[k], toks[k - 1], toks[k + 1]);
      const it = cat ? tryTarget(s, toks, { k, cat }, cnt, fixed[1]) : null;
      if (it && fixed[2] != null) it.ruleFix = fixed[2];   // giải thích riêng sau rà soát ("" = không nêu quy tắc)
      return it;
    }
    const cands = [];
    toks.forEach((x, k) => {
      if (x.t !== s.word.hz && !COMMON.has(x.t)) return;
      if (window.__posDeny && window.__posDeny.has(hash(s.zh).toString(36) + "|" + x.t)) return;   // chỉ dùng khi rà soát
      const cat = ok(k) && catOf(x, toks[k - 1], toks[k + 1]);
      if (cat) cands.push({ k, cat });
    });
    const r = rng(hash(s.zh));
    const key = cands.filter((c) => toks[c.k].t === s.word.hz);
    const LAST = (c) => (toks[c.k].t === "很" || toks[c.k].t === "个" ? 1 : 0);   // hai từ quá phổ biến: chọn sau cùng
    for (const c of [...key, ...shuffleR(cands.filter((x) => !key.includes(x)), r).sort((a, b) => LAST(a) - LAST(b))]) {
      const it = tryTarget(s, toks, c, cnt);
      if (it) return it;
    }
    return null;
  }
  // xáo theo hạt giống để câu hỏi của mỗi câu luôn giống nhau
  function shuffleR(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function tryTarget(s, toks, c, cnt, fixedJ) {
    const target = toks[c.k];
    const r = rng(hash(s.zh + "|" + target.t));
    const rest = toks.filter((_, k) => k !== c.k);
    const correct = c.k;                       // chèn trước rest[correct]
    // chỗ đặt được: trước một từ, hoặc cuối vế câu (ngay trước dấu câu đầu tiên sau một từ)
    const okSlot = (b) => b < rest.length && (!rest[b].p || (b > 0 && !rest[b - 1].p));
    const starts = rest.map((x, b) => (b === 0 || rest[b - 1].p ? b : -1)).filter((b) => b >= 0);
    const zoneOf = (b) => { const s0 = starts.filter((x) => x <= b).pop(); return s0 != null && b - s0 <= 2 ? s0 : null; };
    const cz = zoneOf(correct);
    const pool = [];
    for (let b = 0; b < rest.length; b++) {
      if (b === correct || !okSlot(b)) continue;
      if (cz != null && zoneOf(b) === cz) continue;       // tránh hoán vị trước/sau chủ ngữ
      pool.push(b);
    }
    if (pool.length < 3) return null;
    // chia đều đáp án A–D: chọn số phương án nhiễu nằm trước chỗ đúng
    const near = (arr) => shuffleR(arr, r).sort((x, y) => (Math.abs(x - correct) > 4) - (Math.abs(y - correct) > 4));
    const before = near(pool.filter((b) => b < correct)), after = near(pool.filter((b) => b > correct));
    const lo = Math.max(0, 3 - after.length), hi = Math.min(3, before.length);
    // chọn vị trí đáp án đang ít nhất trong cấp này (cnt), hoà thì theo hạt giống
    let j = -1;
    if (fixedJ != null) { if (fixedJ < lo || fixedJ > hi) return null; j = fixedJ; }
    else for (let x = lo; x <= hi; x++) if (j < 0 || cnt[x] < cnt[j] || (cnt[x] === cnt[j] && r() < 0.5)) j = x;
    const slots = [correct, ...before.slice(0, j), ...after.slice(0, 3 - j)].sort((a, b) => a - b);
    const strs = slots.map((b) => rest.slice(0, b).map((x) => x.t).join("") + target.t + rest.slice(b).map((x) => x.t).join(""));
    if (new Set(strs).size !== 4 || strs[slots.indexOf(correct)] !== s.zh) return null;
    const prev = toks[c.k - 1], next = toks[c.k + 1];
    return {
      id: hash(s.zh).toString(36), zh: s.zh, py: s.py, vi: s.vi, word: s.word,
      target: target.w, hz: target.t, cat: c.cat, key: target.t === s.word.hz,
      rest: rest.map((x) => x.t), slots, answer: slots.indexOf(correct),
      prev: prev && !prev.p ? prev : null, next: next && !next.p ? next : null, prev2: toks[c.k - 2] || null,
    };
  }

  const memo = {};
  function itemsOf(std, level, gen) {
    const mk = std + level + (gen ? "g" : "");
    if (memo[mk]) return memo[mk];
    if (!gen) {
      const okm = OK(), out = [];
      P().sentencesOf(std, level).forEach((s) => { const f = okm[hash(s.zh).toString(36)]; const it = f && !BAD.has(s.zh) && build(s, null, f); if (it) out.push(it); });
      return (memo[mk] = out);
    }
    const bySent = new Map(), all = [];
    P().sentencesOf(std, level).forEach((s) => { if (BAD.has(s.zh)) return; const it = build(s, [0, 0, 0, 0]); if (it) { all.push(it); bySent.set(it, s); } });
    // ưu tiên câu hỏi về chính từ trọng tâm của câu (đúng cấp), sau đó mới tới hư từ thông dụng
    all.sort((a, b) => (b.key - a.key) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const per = {};   // mỗi từ tối đa 8 câu trong một cấp để bài đa dạng
    const chosen = all.filter((it) => (per[it.hz] = (per[it.hz] || 0) + 1) <= 8);
    // lượt 2: sinh lại các câu đã chọn, chia đều đáp án A–D; bỏ bớt câu chỉ có thể là A khi A đã quá nhiều
    const cnt = [0, 0, 0, 0], out = [];
    for (const it of chosen) {
      if (out.length >= PER_LEVEL) break;
      const x = build(bySent.get(it), cnt);
      if (!x) continue;
      if (x.answer === 0 && cnt[0] > 2 && cnt[0] > 1.25 * Math.min(cnt[1], cnt[2], cnt[3]) + 2) continue;
      out.push(x); cnt[x.answer]++;
    }
    return (memo[mk] = out);
  }

  // ---------- Giải thích ----------
  function explain(it) {
    const q = `«${esc(it.hz)}»`, Q = (t) => `«${esc(t)}»`;
    const i0 = it.zh.indexOf(it.hz);
    const where = `${esc(it.zh.slice(0, i0))}<b class="ps-mark">${esc(it.hz)}</b>${esc(it.zh.slice(i0 + it.hz.length))}`;
    const prev = it.prev, next = it.next, nextPos = posOf(next && next.w);
    const numBefore = prev && NUMDEM.test(prev.t);
    let rule = "";
    if (it.cat === "adv") rule = next && (/^(động từ|tính từ|phó từ|giới từ)/.test(nextPos) || MODAL.has(next.t))
      ? `${q} là phó từ, đứng trước động từ, tính từ hoặc cụm giới từ mà nó bổ nghĩa.` : `${q} là phó từ.`;
    else if (it.cat === "modal") rule = `${q} là động từ năng nguyện, đứng trước động từ hoặc cụm động từ mà nó bổ nghĩa.`;
    else if (it.cat === "conj") rule = `${q} là liên từ (từ nối).`;
    else if (it.cat === "prep") rule = it.hz === "被" && next && isVerb(next.w)
      ? `${q} đánh dấu câu bị động; ở câu này người thực hiện được lược đi nên ${q} đứng ngay trước động từ.`
      : prev && isVerb(prev.w) && POST_PREP.has(it.hz)
      ? `${q} là giới từ; ở câu này cụm ${q} + danh từ đứng sau động từ ${Q(prev.t)} làm bổ ngữ.`
      : `${q} là giới từ, ghép với danh từ hoặc đại từ phía sau thành cụm giới từ.`;
    else if (it.cat === "mw") rule = !numBefore ? `${q} là lượng từ.`
      : VERBAL_MW.has(it.hz) ? `${q} là lượng từ chỉ số lần (lượt), đứng sau ${Q(prev.t)}.`
      : /^danh từ/.test(nextPos) ? `${q} là lượng từ, đứng sau ${Q(prev.t)} và trước danh từ mà nó đi kèm.`
      : `${q} là lượng từ, đứng ngay sau ${Q(prev.t)}.`;
    return { where, rule: it.ruleFix != null ? esc(it.ruleFix) : rule };
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    P().setup(box, {
      std,
      counts: [10, 15, 20],
      intro: "Mỗi câu thiếu một từ. Chọn chỗ A, B, C hoặc D để đặt từ cho đúng ngữ pháp.",
      extra: `<details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó</summary><b>Dễ:</b> có pinyin, nghĩa của từ và bản dịch câu. <b>Vừa:</b> có pinyin và nghĩa của từ. <b>Khó:</b> chỉ có chữ Hán.<br>Bấm vào chữ cái trong câu hoặc dùng phím A–D, 1–4.</details>`,
      bestKeyOf: (v) => `position:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const pool = itemsOf(std, v.level);
        if (!pool.length) { toast("Cấp này chưa có câu luyện"); return; }
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

    function sentHtml(it, chosen) {
      let h = "";
      it.rest.forEach((t, b) => {
        const j = it.slots.indexOf(b);
        if (j >= 0) {
          if (chosen == null) h += `<button type="button" class="ps-slot" data-k="${j}" aria-label="Vị trí ${L4[j]}">${L4[j]}</button>`;
          else if (j === it.answer) h += `<span class="ps-ins ok"><small>${L4[j]}</small>${esc(it.hz)}</span>`;
          else if (j === chosen) h += `<span class="ps-ins bad"><small>${L4[j]}</small>${esc(it.hz)}</span>`;
          else h += `<span class="ps-slot off">${L4[j]}</span>`;
        }
        h += `<span class="ps-tok">${esc(t)}</span>`;
      });
      return h;
    }

    function show() {
      if (i >= items.length) return finish();
      const it = items[i];
      const easy = cfg.diff === "easy", hard = cfg.diff === "hard";
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card tr-card ps-card">
          <div class="ps-word"><span class="small muted">Đặt từ</span><b class="zh">${esc(it.hz)}</b>${hard ? "" : `<span class="ps-wmeta">${pyHtml(it.target.py)} · ${esc(String(it.target.vi).split(/[;；]/)[0])}</span>`}</div>
          <div class="zh ps-sent" id="pssent">${sentHtml(it)}</div>
          ${easy ? `<div class="muted ps-vi">${esc(it.vi)}</div>` : ""}
          <div class="ps-opts" id="opts">${L4.split("").map((l, k) => `<button class="btn ps-opt" data-k="${k}">${l}</button>`).join("")}</div>
          <div id="fb"></div>
        </div>`;
      const pick = (k) => {
        if (box.querySelector("#fb").innerHTML) return;
        const ok = k === it.answer;
        if (ok) { score += 10; right++; }
        box.querySelector("#pssent").innerHTML = sentHtml(it, k);
        box.querySelectorAll(".ps-opt").forEach((b) => { const j = +b.dataset.k; b.disabled = true; if (j === it.answer) b.classList.add("correct"); else if (j === k) b.classList.add("wrong"); });
        if (!ok) wrong.push({ hz: it.zh, py: it.py, vi: it.vi, say: it.zh, note: `Đặt ${it.hz}: bạn chọn ${L4[k]}, đúng là ${L4[it.answer]}` });
        const ex = explain(it);
        const fb = box.querySelector("#fb");
        fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
            <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng" : "Chưa đúng"}</span><span class="small muted">Đáp án ${L4[it.answer]} · +${ok ? 10 : 0} điểm</span></div>
            <div class="tr-zh-row"><div class="zh ps-full">${esc(it.zh)}</div>${speakBtn(it.zh)}</div>
            <div>${pyHtml(it.py)}</div><div class="muted">${esc(it.vi)}</div>
            <ul class="small tr-why"><li>Vị trí đúng: <span class="zh">${ex.where}</span></li>${ex.rule ? `<li>${ex.rule}</li>` : ""}</ul>
            <div class="small tr-key"><b class="zh">${esc(it.hz)}</b> ${pyHtml(it.target.py)} – ${esc(it.target.vi)}</div>
            <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
          </div>`;
        bindSpeak(fb);
        fb.querySelector("#next").onclick = () => { i++; show(); };
        fb.querySelector("#next").focus({ preventScroll: true });
        fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
      box.querySelectorAll("[data-k]").forEach((b) => b.onclick = () => pick(+b.dataset.k));
      App.keyHandler = (e) => {
        const k = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[e.key.toLowerCase()];
        if (k != null && !box.querySelector("#fb").innerHTML) pick(k);
        else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) n.click(); }
      };
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      const seconds = Math.round((Date.now() - t0) / 1000);
      const from = P().nameIn(P().feature("position"), std);
      const isBest = P().record({ type: "position", std, level: cfg.level, title: `${from} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey: `position:${std}:${cfg.level}:${cfg.diff}` });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.zh));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from,
        onRetryWrong: () => session(box, std, cfg, shuffle(again)),
        onAgain: () => run(std, box),
      });
    }
    show();
  }

  P().register("position", { run });
  // Mọi ứng viên (câu, từ cần đặt) của một cấp – để rà soát tách từ bằng CC-CEDICT
  function candidatesOf(std, level) {
    const out = [];
    P().sentencesOf(std, level).forEach((s) => {
      const toks = P().tokens(s.zh);
      toks.forEach((x, k) => {
        if ((x.t === s.word.hz || COMMON.has(x.t)) && s.zh.split(x.t).length === 2 && catOf(x, toks[k - 1], toks[k + 1])) out.push({ id: hash(s.zh).toString(36), zh: s.zh, hz: x.t, key: x.t === s.word.hz });
      });
    });
    return out;
  }
  window.PositionDrill = { itemsOf, build, explain, candidatesOf };   // dùng cho kiểm thử và rà soát
})();
