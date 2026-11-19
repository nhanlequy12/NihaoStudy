// Trang Thống kê (#/stats): bộ thẻ, dự báo ôn tập, tỉ lệ nhớ, từ theo cấp HSK, lịch sử thi thử, lịch hoạt động 12 tháng, từ khó nhất.
// Biểu đồ vẽ tay bằng HTML/CSS và SVG nhỏ, màu lấy từ biến CSS nên tự đổi theo giao diện sáng/tối.
(function () {
  const DAY = 86400000;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");
  // Khoá ngày giống Store.today() (ISO, theo UTC) để khớp với nhật ký Store.state.log
  const dayKey = (back) => new Date(Date.now() - back * DAY).toISOString().slice(0, 10);
  const ddmm = (k) => `${+k.slice(8, 10)}/${+k.slice(5, 7)}`;
  // Cấp HSK 2.0 của một từ (giống views.js)
  const levelOfId = (id) => (id <= 12 ? 1 : id <= 24 ? 2 : id <= 44 ? 3 : id <= 84 ? 4 : id <= 149 ? 5 : 6);
  const levelOfWord = (w) => w.level || levelOfId(w.l);
  const LV_COLOR = ["blue", "gold", "green", "red", "purple", "teal"];
  const MATURE = 21; // ngày: khoảng ôn ≥ 21 ngày coi là đã thuộc (như Anki và trang chủ)

  // Icon biểu đồ cột cho mục điều hướng (thêm vào bộ icon dùng chung của ui.js)
  (function addIcon() {
    const home = document.getElementById("i-home");
    if (!home || document.getElementById("i-chart")) return;
    home.parentNode.insertAdjacentHTML("beforeend", `<symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 16v-5M12 16V6M17 16v-8"/></symbol>`);
  })();

  const stateOf = (c) => (!c.interval ? "new" : c.interval < MATURE ? "learning" : "mature");
  function deckSplit(deck) {
    const r = { total: 0, new: 0, learning: 0, mature: 0 };
    Object.values(deck || {}).forEach((c) => { r.total++; r[stateOf(c)]++; });
    return r;
  }

  // Điểm hoạt động một ngày: như ô nhiệt ở trang chủ, cộng thêm lượt ôn thẻ viết
  const activity = (v) => (v ? (v.reviews || 0) + (v.writeReviews || 0) + (v.newWords || 0) * 2 + (v.lessons || 0) * 10 : 0);
  const studied = (v) => !!v && Object.values(v).some((x) => x > 0);
  const lvlClass = (n) => (n === 0 ? "" : n < 10 ? "l1" : n < 30 ? "l2" : "l3");

  function bestStreak(log, current) {
    const keys = Object.keys(log).filter((k) => studied(log[k])).sort();
    let best = 0, run = 0, prev = null;
    keys.forEach((k) => {
      const t = Date.parse(k + "T00:00:00Z");
      run = prev !== null && t - prev === DAY ? run + 1 : 1;
      best = Math.max(best, run);
      prev = t;
    });
    return Math.max(best, current);
  }

  // ---------- Từng khối ----------
  function tile(value, label, sub, color) {
    return `<div class="card stat"><div class="stat-value"${color ? ` style="color:var(${color})"` : ""}>${value}</div><div class="stat-label">${label}</div>${sub ? `<div class="st-sub">${sub}</div>` : ""}</div>`;
  }

  function deckCard(split, wsplit) {
    const seg = (sp) => {
      if (!sp.total) return `<div class="st-stack is-empty" aria-hidden="true"></div>`;
      return `<div class="st-stack" role="img" aria-label="${sp.new} mới, ${sp.learning} đang học, ${sp.mature} đã thuộc trên ${sp.total} thẻ">${[["new", "gold"], ["learning", "blue"], ["mature", "green"]].map(([k, c]) => sp[k] ? `<span class="${c}" style="flex-grow:${sp[k]}" title="${sp[k]} thẻ"></span>` : "").join("")}</div>`;
    };
    const legend = (sp) => `<div class="row small st-legend"><span class="pill gold">Mới ${sp.new}</span><span class="pill blue">Đang học ${sp.learning}</span><span class="pill green">Đã thuộc ${sp.mature}</span></div>`;
    return `<div class="card">
      <div class="row between"><h3 style="margin:0">Bộ thẻ nhận biết</h3><span class="small muted">${fmt(split.total)} thẻ</span></div>
      <div class="mt">${seg(split)}</div>${legend(split)}
      <div class="row between mt"><h3 style="margin:0">Bộ thẻ viết tay</h3><span class="small muted">${fmt(wsplit.total)} thẻ</span></div>
      <div class="mt">${seg(wsplit)}</div>${legend(wsplit)}
      <p class="small muted st-note">Theo khoảng cách tới lần ôn sau: <b>Mới</b> = chưa nhớ được lần nào hoặc vừa quên (0 ngày), <b>Đang học</b> = 1–${MATURE - 1} ngày, <b>Đã thuộc</b> = từ ${MATURE} ngày trở lên.</p>
    </div>`;
  }

  function forecastCard() {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const start = t0.getTime();
    const bucket = (deck) => {
      const out = new Array(14).fill(0); let overdue = 0;
      Object.values(deck || {}).forEach((c) => {
        if (c.due < start) overdue++;
        const d = Math.max(0, Math.floor((c.due - start) / DAY));
        if (d < 14) out[d]++;
      });
      return { out, overdue };
    };
    const r = bucket(Store.state.cards), w = bucket(Store.state.writeCards);
    const mx = Math.max(1, ...r.out.map((n, i) => n + w.out[i]));
    const label = (i) => { if (i === 0) return "Nay"; const d = new Date(start + i * DAY + 12 * 3600000); return String(d.getDate()); };
    const full = (i) => { const d = new Date(start + i * DAY + 12 * 3600000); return i === 0 ? "Hôm nay" : `${d.getDate()}/${d.getMonth() + 1}`; };
    const total = r.out.reduce((a, b) => a + b, 0) + w.out.reduce((a, b) => a + b, 0);
    const aria = "Số thẻ đến hạn 14 ngày tới: " + r.out.map((n, i) => `${full(i)} ${n} nhận biết, ${w.out[i]} viết`).join("; ");
    const cols = r.out.map((n, i) => {
      const m = w.out[i];
      return `<div class="st-col" title="${full(i)}: ${n} thẻ nhận biết, ${m} thẻ viết"><div class="st-bar"><span class="w" style="height:${(m / mx) * 100}%"></span><span class="r" style="height:${(n / mx) * 100}%"></span></div><small${i === 0 ? ' class="st-now"' : ""}>${label(i)}</small></div>`;
    }).join("");
    return `<div class="card">
      <div class="row between"><h3 style="margin:0">Dự báo ôn tập 14 ngày</h3><span class="small muted">cao nhất ${mx} thẻ/ngày</span></div>
      <div class="row small mt st-legend"><span><i class="st-key r"></i>Nhận biết</span><span><i class="st-key w"></i>Viết tay</span>${r.overdue + w.overdue ? `<span class="pill red">Quá hạn từ trước: ${r.overdue + w.overdue}</span>` : ""}</div>
      ${total ? `<div class="st-forecast mt" role="img" aria-label="${esc(aria)}">${cols}</div>` : `<p class="small muted">Chưa có thẻ nào đến hạn trong 14 ngày tới.</p>`}
      <p class="small muted st-note">Cột «Nay» gồm cả thẻ quá hạn. Ôn ngay: <a href="#/review">nhận biết</a> · <a href="#/write">viết tay</a>.</p>
    </div>`;
  }

  function retentionCard(log) {
    let ok = 0, bad = 0, wok = 0, wbad = 0;
    const daily = [];
    for (let i = 29; i >= 0; i--) {
      const k = dayKey(i), v = log[k] || {};
      ok += v.reviewsOk || 0; bad += v.reviewsBad || 0; wok += v.writeReviewsOk || 0; wbad += v.writeReviewsBad || 0;
      daily.push({ k, n: (v.reviews || 0) + (v.writeReviews || 0) });
    }
    const pct = (a, b) => (a + b ? Math.round((a / (a + b)) * 100) : null);
    const all = pct(ok + wok, bad + wbad), enough = ok + wok + bad + wbad >= 10;
    const meter = (name, a, b) => {
      const p = pct(a, b);
      return `<div class="st-meter"><div class="row between small"><span>${name}</span><span class="muted">${p === null ? "–" : `<b>${p}%</b> · ${a}/${a + b} lượt`}</span></div><div class="progress green"><span style="width:${p || 0}%"></span></div></div>`;
    };
    const mx = Math.max(1, ...daily.map((d) => d.n)), sum = daily.reduce((a, d) => a + d.n, 0);
    const spark = `<div class="st-mini" role="img" aria-label="Lượt ôn mỗi ngày trong 30 ngày qua, tổng ${sum} lượt">${daily.map((d) => `<span title="${ddmm(d.k)}: ${d.n} lượt ôn" style="height:${d.n ? Math.max(6, (d.n / mx) * 100) : 0}%"></span>`).join("")}</div>`;
    return `<div class="card">
      <div class="row between"><h3 style="margin:0">Tỉ lệ nhớ 30 ngày</h3>${enough ? `<span class="st-big" style="color:var(--green)">${all}%</span>` : ""}</div>
      ${enough ? `<div class="mt">${meter("Nhận biết", ok, bad)}${meter("Viết tay", wok, wbad)}</div>` : `<p class="small muted mt"><b>Chưa đủ dữ liệu.</b> Nǐ hǎo ghi lại đúng/sai của từng lượt ôn kể từ phiên bản này; cần ít nhất 10 lượt để tính tỉ lệ (hiện có ${ok + wok + bad + wbad}).</p>`}
      <div class="row between small mt"><span>Lượt ôn mỗi ngày</span><span class="muted">${fmt(sum)} lượt / 30 ngày</span></div>
      ${spark}
      <p class="small muted st-note">Đúng = chấm Khó, Tốt hoặc Dễ; sai = Quên. Tỉ lệ 80–90% là vừa sức.</p>
    </div>`;
  }

  function levelBar(name, color, words, inDeck, mature, href) {
    const a = words ? (mature / words) * 100 : 0, b = words ? ((inDeck - mature) / words) * 100 : 0;
    return `<a class="level-bar st-level" href="${href}"><span class="small"><b>${name}</b> <span class="muted">${fmt(inDeck)}/${fmt(words)} từ · ${fmt(mature)} đã thuộc</span></span>
      <div class="st-two ${color}" role="img" aria-label="${name}: ${inDeck} trên ${words} từ trong bộ thẻ, ${mature} đã thuộc"><span class="m" style="width:${a}%"></span><span class="d" style="width:${b}%"></span></div></a>`;
  }

  function levelsCard(cards) {
    const count = (ws) => {
      let d = 0, m = 0;
      ws.forEach((w) => { const c = cards[w.id]; if (c) { d++; if (c.interval >= MATURE) m++; } });
      return [d, m];
    };
    const v2 = [1, 2, 3, 4, 5, 6].map((lv) => {
      const ws = VOCAB.filter((w) => levelOfWord(w) === lv);
      const [d, m] = count(ws);
      return ws.length ? levelBar(`HSK ${lv}`, LV_COLOR[lv - 1], ws.length, d, m, `#/lessons/${lv}`) : "";
    }).join("");
    let v3 = "";
    if (window.H3 && H3.words.some((w) => cards[w.id])) {
      v3 = `<h3 class="st-sub-h">HSK 3.0 (2025)</h3><div class="level-bars">${[1, 2, 3, 4, 5, 6].map((lv) => {
        const ws = H3.byLevel(lv); const [d, m] = count(ws);
        return ws.length ? levelBar(`Cấp ${lv}`, LV_COLOR[lv - 1], ws.length, d, m, `#/words/${lv}`) : "";
      }).join("")}</div>`;
    }
    return `<div class="card st-levels">
      <div class="row between"><h3 style="margin:0">Từ đã học theo cấp</h3><span class="small muted"><i class="st-key m"></i>đã thuộc <i class="st-key d"></i>trong thẻ</span></div>
      <h3 class="st-sub-h">HSK 2.0</h3><div class="level-bars">${v2}</div>${v3}
    </div>`;
  }

  // Đường điểm thi thử của một cấp: SVG kích thước cố định (không méo), vạch đứt là mốc đậu 60%
  function sparkline(pts, title) {
    const W = 240, H = 64, P = 8, R = 34, n = pts.length; // R: lề phải chừa chỗ cho nhãn 60%
    const x = (i) => (n === 1 ? (W - R) / 2 : P + (i * (W - R - P)) / (n - 1));
    const y = (p) => H - P - (Math.max(0, Math.min(100, p)) / 100) * (H - 2 * P);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.pct).toFixed(1)}`).join(" ");
    return `<svg class="st-spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>
      <line class="pass" x1="0" x2="${W - R + 6}" y1="${y(60)}" y2="${y(60)}"/><text class="pass-t" x="${W}" y="${y(60) + 3}" text-anchor="end">60%</text>
      ${n > 1 ? `<path class="ln" d="${line}"/>` : ""}
      ${pts.map((p, i) => `<circle class="${p.pass ? "ok" : "no"}" cx="${x(i).toFixed(1)}" cy="${y(p.pct).toFixed(1)}" r="3.5"><title>${esc(p.date)}: ${p.pct}%</title></circle>`).join("")}</svg>`;
  }

  function examsCard(s) {
    const groups = [];
    const add = (key, name, list, href) => { if (list.length) groups.push({ key, name, list: list.slice(-20), count: list.length, href }); };
    [1, 2, 3, 4, 5, 6].forEach((lv) => add("2-" + lv, `HSK ${lv} · 2.0`, (s.exams || []).filter((e) => e.level === lv && e.max).map((e) => ({ date: e.date, pct: Math.round((e.total / e.max) * 100), pass: !!e.pass, label: `${e.total}/${e.max}` })), `#/exam/${lv}`));
    [1, 2, 3, 4, 5, 6].forEach((lv) => add("3-" + lv, `HSK ${lv} · 3.0`, (s.exams3 || []).filter((e) => e.level === lv).map((e) => ({ date: e.date, pct: e.pct || 0, pass: (e.pct || 0) >= 60, label: `${e.pct || 0}%` })), "#/exam"));
    const body = groups.length ? `<div class="st-exams">${groups.map((g) => {
      const last = g.list[g.list.length - 1], best = Math.max(...g.list.map((p) => p.pct));
      const title = `${g.name}: ${g.count} lần thi, gần nhất ${last.pct}% (${last.date}), cao nhất ${best}%, mốc đậu 60%`;
      return `<div class="st-exam"><div class="row between small"><b>${esc(g.name)}</b><span class="muted">${g.count} lần</span></div>${sparkline(g.list, title)}
        <div class="row between small"><span>Gần nhất <b>${esc(last.label)}</b> ${last.pass ? `<span class="pill green">Đậu</span>` : `<span class="pill">Chưa đậu</span>`}</span><span class="muted">cao nhất ${best}%</span></div></div>`;
    }).join("")}</div>` : `<p class="small muted">Chưa có lần thi thử nào. <a href="#/exam">Thi thử</a> sau khi học xong một cấp để biết mình còn yếu phần nào.</p>`;
    return `<div class="card"><div class="row between"><h3 style="margin:0">Lịch sử thi thử</h3><span class="small muted">điểm theo % tổng điểm</span></div><div class="mt">${body}</div></div>`;
  }

  // Lịch 12 tháng: mỗi cột là một tuần (Thứ Hai → Chủ Nhật); trên điện thoại chỉ hiện 26 tuần gần nhất
  function calendarCard(log) {
    const WEEKS = 53, SHORT = 26;
    const todayK = dayKey(0), todayT = Date.parse(todayK + "T00:00:00Z");
    const dow = (new Date(todayT).getUTCDay() + 6) % 7; // 0 = Thứ Hai
    const startT = todayT - (dow + (WEEKS - 1) * 7) * DAY;
    const cells = [], months = [];
    let active = 0, total = 0, activeShort = 0;
    for (let w = 0; w < WEEKS; w++) {
      const old = w < WEEKS - SHORT ? " old" : "";
      let mLabel = "";
      for (let d = 0; d < 7; d++) {
        const t = startT + (w * 7 + d) * DAY;
        if (t > todayT) break;
        const dt = new Date(t), k = dt.toISOString().slice(0, 10), v = log[k], n = activity(v);
        if (dt.getUTCDate() === 1 || (w === 0 && d === 0)) mLabel = "T" + (dt.getUTCMonth() + 1);
        if (studied(v)) { active++; if (!old) activeShort++; }
        total += n;
        cells.push(`<span class="${lvlClass(n)}${old}${k === todayK ? " st-now" : ""}" title="${ddmm(k)}/${k.slice(0, 4)}: ${n} điểm hoạt động"></span>`);
      }
      months.push(`<span class="${old.trim()}">${mLabel}</span>`);
    }
    const legend = `<span class="st-heat-legend" aria-hidden="true">Ít <i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i> Nhiều</span>`;
    return `<div class="card">
      <div class="row between"><h3 style="margin:0">Lịch hoạt động</h3><span class="small muted"><span class="st-long">12 tháng</span><span class="st-short">26 tuần</span> · mỗi ô = 1 ngày</span></div>
      <div class="st-cal mt" role="img" aria-label="Lịch hoạt động: ${active} ngày có học trong 12 tháng qua, ${activeShort} ngày trong 26 tuần gần nhất">
        <div class="st-days" aria-hidden="true"><span>T2</span><span></span><span>T4</span><span></span><span>T6</span><span></span><span>CN</span></div>
        <div class="st-cal-body"><div class="st-months" aria-hidden="true">${months.join("")}</div><div class="st-heat">${cells.join("")}</div></div>
      </div>
      <div class="row between small mt"><span class="muted">Điểm hoạt động = lượt ôn + 2 × từ mới + 10 × bài học</span>${legend}</div>
    </div>`;
  }

  function hardestCard(s) {
    const pick = (deck, kind) => Object.entries(deck || {}).filter(([, c]) => c.lapses > 0 || c.ef < 2.5).map(([id, c]) => ({ id, c, kind }));
    const list = pick(s.cards, "Nhận biết").concat(pick(s.writeCards, "Viết"))
      .sort((a, b) => b.c.lapses - a.c.lapses || a.c.ef - b.c.ef)
      .map((x) => Object.assign(x, { w: window.vocabById ? vocabById(x.id) : null }))
      .filter((x) => x.w).slice(0, 10);
    const py = (p) => (window.Views && Views.util ? Views.util.pyHtml(p) : esc(p));
    const href = (w) => (w.l ? `#/lesson/${w.l}` : w.h3l ? `#/lesson/${w.h3l}` : w.h3 ? `#/words/${w.h3}` : "#/dictionary");
    const body = list.length ? `<ol class="st-hard">${list.map(({ w, c, kind }) => `<li><a href="${href(w)}" title="Mở bài có từ ${esc(w.hz)}">
        <span class="zh st-hz">${esc(w.hz)}</span><span class="st-hard-body"><span class="py">${py(w.py)}</span><span class="small">${esc(w.vi)}</span></span>
        <span class="st-hard-meta small"><span class="pill ${c.lapses >= 3 ? "red" : "gold"}">quên ${c.lapses} lần</span><span class="muted">độ dễ ${c.ef.toFixed(2)}${kind === "Viết" ? " · viết" : ""}</span></span></a></li>`).join("")}</ol>`
      : `<p class="small muted">Chưa có từ nào bị quên. Từ nào bạn chấm «Quên» hoặc «Khó» nhiều sẽ hiện ở đây.</p>`;
    return `<div class="card"><div class="row between"><h3 style="margin:0">Từ khó nhất</h3><span class="small muted">theo số lần quên, rồi độ dễ thấp</span></div><div class="mt">${body}</div></div>`;
  }

  // ---------- Trang ----------
  function page() {
    const s = Store.state, log = s.log || {};
    const split = deckSplit(s.cards), wsplit = deckSplit(s.writeCards);
    const cur = Store.streakAlive(), best = bestStreak(log, cur);
    const days = Object.keys(log).filter((k) => studied(log[k])).length;
    const done = (s.completedLessons || []).length;
    const steps = Object.values((s.path && s.path.steps) || {}).filter((x) => x && x.done).length;
    const fresh = !split.total && !wsplit.total && !done && !days && !(s.exams || []).length && !(s.exams3 || []).length;

    const html = `<h1>Thống kê</h1>
      <p class="subtitle">Bạn đã học được bao nhiêu, ngày mai cần ôn bao nhiêu thẻ, từ nào hay quên. Số liệu chỉ lưu trên trình duyệt này.</p>
      ${fresh ? `<div class="card center st-empty"><h3 style="margin-top:0">Chưa có gì để thống kê</h3><p class="small muted">Học xong bài đầu tiên là các biểu đồ dưới đây bắt đầu có số liệu.</p><a class="btn btn-primary" href="#/start">${ic("play")} Bắt đầu học</a></div>` : ""}
      <div class="grid st-tiles${fresh ? " mt" : ""}">
        ${tile(fmt(split.total), "từ trong bộ thẻ", `${fmt(split.mature)} đã thuộc`)}
        ${tile(fmt(wsplit.total), "thẻ viết tay", `${fmt(wsplit.mature)} đã thuộc`)}
        ${tile(fmt(done), "bài học đã xong", steps ? `${fmt(steps)} bài nhỏ lộ trình` : "")}
        ${tile(`${cur}<small> / ${best}</small>`, "ngày liên tiếp", "hiện tại / dài nhất", cur ? "--primary-text" : "")}
        ${tile(fmt(s.xp), "điểm kinh nghiệm", "", "--gold-text")}
        ${tile(fmt(days), "ngày đã học", s.createdAt ? `từ ${ddmm(s.createdAt)}/${s.createdAt.slice(0, 4)}` : "")}
      </div>
      <div class="grid grid-2 mt">${deckCard(split, wsplit)}${forecastCard()}</div>
      <div class="grid grid-2 mt">${retentionCard(log)}${levelsCard(s.cards)}</div>
      <div class="mt">${calendarCard(log)}</div>
      <div class="grid grid-2 mt">${examsCard(s)}${hardestCard(s)}</div>`;
    return {
      html,
      after(el) {
        // Lịch hoạt động: cuộn về tuần mới nhất nếu khung hẹp
        const b = el.querySelector(".st-cal-body");
        if (b) b.scrollLeft = b.scrollWidth;
      },
    };
  }

  window.StatsView = { page };
})();
