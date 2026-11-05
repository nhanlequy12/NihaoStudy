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
    log: {},             // date -> { reviews, newWords, lessons, xp }
    routine: {},         // date -> { review: true, lesson: true, ... }
    toneDrill: { total: 0, correct: 0 },
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
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

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
  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !parsed.cards) throw new Error("Tệp không hợp lệ");
    state = Object.assign(defaults(), parsed);
    save();
  }
  function reset() { state = defaults(); save(); }

  window.Store = {
    get state() { return state; },
    save, today, logToday, addXp, touchStreak, streakAlive, markRoutine, exportJSON, importJSON, reset,
  };
})();
