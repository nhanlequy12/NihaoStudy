// HSK 3.0 (đề cương 2025): nối dữ liệu từ, bài học bổ sung và đề luyện vào web.
// Từ đã có trong 149 bài cũ dùng chung đối tượng (và thẻ ôn tập) với VOCAB; từ mới có id "h3_<chữ>".
(function () {
  const EXAM_DATE = "2026-12-13"; // kỳ thi HSK 3.0 đầu tiên trên toàn cầu
  const byHz = new Map();
  VOCAB.forEach((w) => { if (!byHz.has(w.hz)) byHz.set(w.hz, w); });

  const lessons = window.H3_LESSONS || [];
  const lessonOf = {};
  lessons.forEach((L, i) => {
    L.h3 = true;
    L.no = i + 1;
    L.label = `Bổ sung HSK 3.0 · Bài ${i + 1}`;
    L.words.forEach((hz) => { if (!lessonOf[hz]) lessonOf[hz] = L.id; });
  });

  const extra = new Map(); // id -> từ chỉ có trong HSK 3.0
  const words = [];
  (window.HSK3_WORDS || []).forEach((r) => {
    const hz = r[0], level = r.length === 2 ? r[1] : r[8];
    let w = byHz.get(hz);
    if (!w && r.length > 2) {
      w = { id: "h3_" + hz, hz, py: r[1], hv: r[2], vi: r[3], pos: r[4], ex: [r[5], r[6], r[7]], h3l: lessonOf[hz] || null };
      extra.set(w.id, w);
      byHz.set(hz, w);
    }
    if (!w) return;
    w.h3 = level;
    words.push(w);
  });

  const origById = window.vocabById, origByLesson = window.vocabByLesson;
  window.vocabById = (id) => extra.get(id) || origById(id);
  window.vocabByLesson = (l) => {
    if (typeof l === "string" && l.startsWith("h3b")) {
      const L = lessons.find((x) => x.id === l);
      return L ? L.words.map((hz) => byHz.get(hz)).filter(Boolean) : [];
    }
    return origByLesson(l);
  };

  let examsPromise = null;
  function loadExams() {
    if (window.HSK3_EXAMS) return Promise.resolve(window.HSK3_EXAMS);
    if (!examsPromise) {
      examsPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "js/data/h30-exams.js";
        s.onload = () => resolve(window.HSK3_EXAMS || []);
        s.onerror = () => { examsPromise = null; reject(new Error("Không tải được đề")); };
        document.head.appendChild(s);
      });
    }
    return examsPromise;
  }

  // Cấp 7–9: chỉ để tra cứu, tải khi cần (không đưa vào bộ thẻ để thẻ ôn tập không phụ thuộc tệp tải sau)
  let w79 = null, p79 = null;
  function load79() {
    if (w79) return Promise.resolve(w79);
    if (!p79) {
      p79 = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "js/data/h30-words-79.js";
        s.onload = () => {
          w79 = (window.HSK3_WORDS_79 || []).map((r) => {
            const known = byHz.get(r[0]);
            return { id: known ? known.id : null, hz: r[0], py: r[1], hv: r[2], vi: r[3], pos: r[4], ex: [r[5], r[6], r[7]], h3: 7, cv: r[8] === "c", l: known && known.l };
          });
          resolve(w79);
        };
        s.onerror = () => { p79 = null; reject(new Error("Không tải được dữ liệu cấp 7–9")); };
        document.head.appendChild(s);
      });
    }
    return p79;
  }

  function daysToExam() {
    const t = new Date(EXAM_DATE + "T00:00:00"), now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((t - now) / 86400000);
  }

  window.H3 = {
    EXAM_DATE,
    words,
    extraList: () => [...extra.values()],
    byLevel: (lv) => words.filter((w) => w.h3 === lv),
    byHz: (hz) => byHz.get(hz),
    lessons,
    findLesson: (id) => lessons.find((L) => L.id === id),
    loadExams,
    load79,
    daysToExam,
  };
})();
