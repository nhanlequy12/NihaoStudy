// Thuật toán ôn tập ngắt quãng SM-2 (giống Anki), đơn giản hoá cho 4 mức: Quên / Khó / Tốt / Dễ
// Dùng chung cho nhiều bộ thẻ: SRS (nhận biết từ) và WSRS (viết tay cả từ, kiểu Skritter)
(function () {
  const DAY = 86400000;
  const now = () => Date.now();

  function makeSRS(deckKey, logField, newField) {
    const deck = () => { const s = Store.state; if (!s[deckKey]) s[deckKey] = {}; return s[deckKey]; };

    function card(id) {
      const d = deck();
      if (!d[id]) d[id] = { ef: 2.5, interval: 0, reps: 0, due: now(), lapses: 0, added: now() };
      return d[id];
    }
    function has(id) { return !!deck()[id]; }
    function remove(id) { delete deck()[id]; Store.save(); }

    // Thêm từ vào bộ thẻ (khi hoàn thành bài học)
    function addWords(ids) {
      let added = 0;
      ids.forEach((id) => { if (!deck()[id]) { card(id); added++; } });
      if (added) { if (newField) Store.logToday(newField, added); Store.save(); }
      return added;
    }

    // grade: 1 = Quên, 2 = Khó, 3 = Tốt, 4 = Dễ
    function review(id, grade) {
      const c = card(id);
      const q = { 1: 1, 2: 3, 3: 4, 4: 5 }[grade];
      if (q < 3) {
        c.reps = 0; c.interval = 0; c.lapses++;
        c.due = now() + 10 * 60000; // học lại sau 10 phút
      } else {
        if (c.reps === 0) c.interval = 1;
        else if (c.reps === 1) c.interval = grade === 4 ? 4 : 3;
        else c.interval = Math.round(c.interval * c.ef * (grade === 2 ? 0.8 : grade === 4 ? 1.3 : 1));
        c.reps++;
        c.due = now() + c.interval * DAY;
      }
      c.ef = Math.max(1.3, c.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      c.last = now();
      Store.logToday(logField, 1);
      Store.addXp(grade >= 3 ? 2 : 1);
      Store.save();
      return c;
    }

    function dueIds() {
      const t = now(), d = deck();
      return Object.keys(d).filter((id) => d[id].due <= t);
    }
    function allIds() { return Object.keys(deck()); }
    function stats() {
      const cards = Object.values(deck());
      const t = now();
      return {
        total: cards.length,
        due: cards.filter((c) => c.due <= t).length,
        learning: cards.filter((c) => c.reps < 2).length,
        young: cards.filter((c) => c.reps >= 2 && c.interval < 21).length,
        mature: cards.filter((c) => c.interval >= 21).length,
        forecast: [0, 1, 2, 3, 4, 5, 6].map((dd) => {
          const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() + dd);
          const end = start.getTime() + DAY;
          return cards.filter((c) => (dd === 0 ? c.due < end : c.due >= start.getTime() && c.due < end)).length;
        }),
      };
    }
    // Những thẻ hay quên nhất
    function hardest(n = 10) {
      const d = deck();
      return Object.keys(d).filter((id) => d[id].lapses > 0).sort((a, b) => d[b].lapses - d[a].lapses).slice(0, n);
    }
    // Mô tả khoảng cách tiếp theo cho nút chấm điểm
    function preview(id, grade) {
      const c = deck()[id] || { ef: 2.5, interval: 0, reps: 0 };
      if (grade === 1) return "10 phút";
      let iv;
      if (c.reps === 0) iv = 1;
      else if (c.reps === 1) iv = grade === 4 ? 4 : 3;
      else iv = Math.round(c.interval * c.ef * (grade === 2 ? 0.8 : grade === 4 ? 1.3 : 1));
      return iv === 1 ? "1 ngày" : iv < 30 ? iv + " ngày" : Math.round(iv / 30) + " tháng";
    }

    return { card, has, remove, addWords, review, dueIds, allIds, stats, hardest, preview };
  }

  window.SRS = makeSRS("cards", "reviews", "newWords");      // nhận biết: chữ → âm, nghĩa
  window.WSRS = makeSRS("writeCards", "writeReviews", null); // viết tay cả từ
})();
