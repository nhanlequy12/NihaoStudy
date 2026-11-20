// Lưu tiến độ học vào localStorage
(function () {
  const KEY = "nihaostudy.v1";
  const today = () => new Date().toISOString().slice(0, 10);

  const defaults = () => ({
    createdAt: today(),
    xp: 0,
    streak: { count: 0, last: null },
    completedLessons: [],
    cards: {},           // id -> { ef, interval, reps, due, lapses }  (bộ thẻ nhận biết)
    writeCards: {},      // id -> cùng cấu trúc  (bộ thẻ viết tay)
    readings: {},        // id bài đọc -> { done: true, score }
    exams: [],           // lịch sử thi thử: { date, level, total, max, pass, sections, minutes }
    log: {},             // date -> { reviews, newWords, lessons, xp }
    routine: {},         // date -> { review: true, lesson: true, ... }
    toneDrill: { total: 0, correct: 0 },
    path: { steps: {}, tests: {}, placed: 0 }, // lộ trình từng bước: bài nhỏ đã qua, bài kiểm tra tổng hợp, giai đoạn được xếp lên
    settings: { theme: "light", newPerDay: 10, voice: "", rate: 0.85 },
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return Object.assign(defaults(), parsed, { settings: Object.assign(defaults().settings, parsed.settings || {}) });
    } catch (e) { return defaults(); }
  }
  function save() { state.updatedAt = Date.now(); localStorage.setItem(KEY, JSON.stringify(state)); }

  function logToday(field, n = 1) {
    const d = today();
    state.log[d] = state.log[d] || { reviews: 0, newWords: 0, lessons: 0, xp: 0 };
    state.log[d][field] = (state.log[d][field] || 0) + n;
    touchStreak();
    save();
  }
  function addXp(n) { state.xp += n; logToday("xp", n); }

  function touchStreak() {
    const d = today();
    if (state.streak.last === d) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yest = y.toISOString().slice(0, 10);
    state.streak.count = state.streak.last === yest ? state.streak.count + 1 : 1;
    state.streak.last = d;
    save();
  }
  function streakAlive() {
    const d = today();
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yest = y.toISOString().slice(0, 10);
    return state.streak.last === d || state.streak.last === yest ? state.streak.count : 0;
  }

  function markRoutine(key) {
    const d = today();
    state.routine[d] = state.routine[d] || {};
    state.routine[d][key] = true;
    save();
  }

  function exportJSON() { return JSON.stringify(state, null, 2); }

  // ---------- Kiểm tra dữ liệu nhập vào (tệp JSON hoặc mã đồng bộ) ----------
  const isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const num = (x) => typeof x === "number" && isFinite(x);
  function parseState(text) {
    let p;
    try { p = typeof text === "string" ? JSON.parse(text) : text; } catch (e) { throw new Error("Tệp không hợp lệ"); }
    if (!isObj(p) || !isObj(p.cards)) throw new Error("Tệp không hợp lệ");
    const objs = ["writeCards", "readings", "log", "routine", "toneDrill", "path", "settings", "streak", "practice"], arrs = ["completedLessons", "exams", "exams3", "notebook"];
    if (objs.some((k) => p[k] != null && !isObj(p[k])) || arrs.some((k) => p[k] != null && !Array.isArray(p[k]))) throw new Error("Tệp không hợp lệ");
    // Thẻ hỏng (thiếu hạn ôn) thì bỏ, không làm hỏng cả bộ
    ["cards", "writeCards"].forEach((k) => { if (p[k]) Object.keys(p[k]).forEach((id) => { if (!isObj(p[k][id]) || !num(p[k][id].due)) delete p[k][id]; }); });
    return p;
  }
  const fill = (p) => Object.assign(defaults(), p, { settings: Object.assign(defaults().settings, p.settings || {}) });

  // Ghi đè toàn bộ (lựa chọn "Thay toàn bộ")
  function importJSON(text) {
    state = fill(parseState(text));
    save();
  }

  // ---------- Gộp tiến độ từ máy khác ----------
  // Thẻ: giữ bản được ôn gần nhất (last); hoà thì bản nhiều lần ôn hơn
  const cardTime = (c) => c.last || 0;
  function mergeDeck(a = {}, b = {}, info) {
    const out = Object.assign({}, a);
    Object.keys(b).forEach((id) => {
      const x = a[id], y = b[id];
      if (!x) { out[id] = y; info.added++; return; }
      const newer = cardTime(y) > cardTime(x) || (cardTime(y) === cardTime(x) && (y.reps || 0) > (x.reps || 0));
      if (newer) { out[id] = y; info.updated++; }
    });
    return out;
  }
  // Hợp hai danh sách, bỏ trùng theo khoá
  const unionBy = (a = [], b = [], key) => { const seen = new Set(a.map(key)), out = a.slice(); b.forEach((x) => { const k = key(x); if (!seen.has(k)) { seen.add(k); out.push(x); } }); return out; };
  const sig = (x) => JSON.stringify(x);
  const byDate = (x, y) => String(x.date || "").localeCompare(String(y.date || ""));
  // Gộp theo khoá: f(x, y) quyết định khi cả hai bên cùng có
  const mergeMap = (a = {}, b = {}, f) => { const out = Object.assign({}, a); Object.keys(b).forEach((k) => { out[k] = k in a ? f(a[k], b[k]) : b[k]; }); return out; };
  const maxFields = (x = {}, y = {}) => mergeMap(x, y, (u, v) => (num(u) && num(v) ? Math.max(u, v) : u || v));
  const minDate = (u, v) => (!u ? v : !v ? u : u < v ? u : v);
  // Bước lộ trình / bài kiểm tra: điểm cao hơn; đã qua ở một bên là đã qua, ngày qua lấy ngày sớm hơn
  const mergeResult = (x, y) => Object.assign({}, y, x, {
    best: Math.max(x.best || 0, y.best || 0), done: !!(x.done || y.done),
    at: x.done && y.done ? minDate(x.at, y.at) : x.done ? x.at : y.done ? y.at : x.at || y.at,
  });
  const mergeReading = (x, y) => Object.assign({}, y, x, { done: !!(x.done || y.done), score: Math.max(x.score || 0, y.score || 0), at: Math.max(x.at || 0, y.at || 0) || x.at });

  function mergeStates(a, b) {
    const info = { added: 0, updated: 0, lessons: 0, steps: 0 };
    const m = Object.assign({}, b, a); // khoá lạ chỉ có ở máy kia vẫn được giữ
    m.cards = mergeDeck(a.cards, b.cards, info);
    m.writeCards = mergeDeck(a.writeCards, b.writeCards, info);
    m.completedLessons = unionBy(a.completedLessons, b.completedLessons, String);
    info.lessons = m.completedLessons.length - (a.completedLessons || []).length;
    m.readings = mergeMap(a.readings, b.readings, mergeReading);
    m.exams = unionBy(a.exams, b.exams, sig).sort(byDate);
    if (a.exams3 || b.exams3) m.exams3 = unionBy(a.exams3, b.exams3, sig).sort(byDate);
    m.log = mergeMap(a.log, b.log, maxFields);        // mỗi ngày: lấy số lớn hơn của từng chỉ số
    m.routine = mergeMap(a.routine, b.routine, (x, y) => Object.assign({}, y, x));
    const ta = a.toneDrill || {}, tb = b.toneDrill || {};
    m.toneDrill = (tb.total || 0) > (ta.total || 0) ? tb : ta;
    const pa = a.path || {}, pb = b.path || {};
    m.path = Object.assign({}, pb, pa, {
      steps: mergeMap(pa.steps, pb.steps, mergeResult), tests: mergeMap(pa.tests, pb.tests, mergeResult),
      placed: Math.max(pa.placed || 0, pb.placed || 0),
    });
    const doneSteps = (p) => Object.values((p && p.steps) || {}).filter((x) => x && x.done).length;
    info.steps = doneSteps(m.path) - doneSteps(pa);
    if (a.practice || b.practice) {
      const xa = a.practice || {}, xb = b.practice || {};
      m.practice = Object.assign({}, xb, xa, {
        history: unionBy(xa.history, xb.history, sig).sort((x, y) => String(y.at || "").localeCompare(String(x.at || ""))).slice(0, 200),
        best: maxFields(xa.best, xb.best),
        last: Object.assign({}, xb.last, xa.last),
      });
    }
    if (a.notebook || b.notebook) m.notebook = unionBy(a.notebook, b.notebook, (x) => x.hz + "|" + (x.note || "")).sort((x, y) => String(y.at || "").localeCompare(String(x.at || "")));
    // Chuỗi ngày: bên học gần nhất; cùng ngày thì chuỗi dài hơn
    const sa = a.streak || {}, sb = b.streak || {};
    m.streak = (sb.last || "") > (sa.last || "") || (sb.last === sa.last && (sb.count || 0) > (sa.count || 0)) ? sb : sa;
    // XP: không cộng dồn (hai máy có chung phần cũ) mà lấy số lớn nhất
    const logXp = Object.values(m.log).reduce((t, d) => t + ((d && d.xp) || 0), 0);
    m.xp = Math.max(a.xp || 0, b.xp || 0, logXp);
    m.createdAt = minDate(a.createdAt, b.createdAt);
    m.settings = a.settings;                          // cài đặt: giữ của máy này
    m.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return { state: m, info };
  }
  // Gộp vào tiến độ hiện có; dữ liệu lỗi thì ném lỗi và giữ nguyên trạng thái
  function mergeJSON(text) {
    const incoming = fill(parseState(text));
    const r = mergeStates(JSON.parse(JSON.stringify(state)), incoming);
    state = fill(r.state);
    save();
    return r.info;
  }

  // ---------- Mã đồng bộ: JSON → gzip → base64url (chỉ để sao chép, không gửi đi đâu) ----------
  const toB64 = (bytes) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const fromB64 = (str) => { const b = atob(str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4)); const out = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i); return out; };
  const pipe = (bytes, stream) => new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then((buf) => new Uint8Array(buf));
  // Tiền tố cho biết cách mã hoá: NH1z = gzip, NH1j = JSON thường (trình duyệt không có CompressionStream)
  async function toCode() {
    const bytes = new TextEncoder().encode(JSON.stringify(state));
    if (typeof CompressionStream === "function") {
      try { return "NH1z." + toB64(await pipe(bytes, new CompressionStream("gzip"))); } catch (e) { /* dùng JSON thường */ }
    }
    return "NH1j." + toB64(bytes);
  }
  // Mã → chuỗi JSON; nhận cả JSON dán thẳng vào
  async function fromCode(code) {
    const c = String(code || "").replace(/\s+/g, "");
    if (c.startsWith("{")) return String(code).trim();
    const m = /^NH1([zj])\.([A-Za-z0-9_-]+)$/.exec(c);
    if (!m) throw new Error("Mã không hợp lệ");
    let bytes;
    try { bytes = fromB64(m[2]); } catch (e) { throw new Error("Mã không hợp lệ"); }
    if (m[1] === "z") {
      if (typeof DecompressionStream !== "function") throw new Error("Trình duyệt này không giải nén được mã, hãy dùng tệp JSON");
      try { bytes = await pipe(bytes, new DecompressionStream("gzip")); } catch (e) { throw new Error("Mã không hợp lệ hoặc bị thiếu"); }
    }
    return new TextDecoder().decode(bytes);
  }

  // Tóm tắt cho thẻ Dữ liệu học ở Cài đặt
  const summary = () => ({
    cards: Object.keys(state.cards || {}).length, writeCards: Object.keys(state.writeCards || {}).length,
    lessons: (state.completedLessons || []).length,
    steps: Object.values((state.path && state.path.steps) || {}).filter((x) => x && x.done).length,
    updatedAt: state.updatedAt || null,
  });

  function reset() { state = defaults(); save(); }

  window.Store = {
    get state() { return state; },
    save, today, logToday, addXp, touchStreak, streakAlive, markRoutine, exportJSON, importJSON, mergeJSON, mergeStates, toCode, fromCode, summary, reset,
  };
})();
