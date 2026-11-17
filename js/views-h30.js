// Các màn hình HSK 3.0 (đề cương 2025): bài học bổ sung, từ vựng theo cấp, đề luyện cố định có giải thích, nguồn dữ liệu.
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, sentenceHtml } = Views.util;
  const LET = "ABCDEFGHIJ";
  const CJK = /[㐀-鿿]/;
  const COLORS = ["blue", "gold", "green", "red", "purple", "blue"];
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  const learnedIn = (list) => list.filter((w) => Store.state.cards[w.id]).length;
  const SKILL = {"chu-de-an-uong": "Chủ đề ăn uống", "chu-de-mau-sac": "Chủ đề màu sắc", "chu-de-quan-ao": "Chủ đề quần áo", "chu-de-thoi-tiet": "Chủ đề thời tiết", "doc-chi-tiet": "Đọc: chi tiết", "doc-dai-tu": "Đọc: đại từ", "doc-dien-tu": "Đọc: điền từ", "doc-doan-van": "Đọc: đoạn văn", "doc-hieu-cau": "Đọc: hiểu câu", "doc-hoi-dap": "Đọc: hỏi – đáp", "doc-lien-ket": "Đọc: liên kết đoạn", "doc-lien-ket-cau": "Đọc: liên kết câu", "doc-mach-van": "Đọc: mạch văn", "doc-ngu-canh": "Đọc: ngữ cảnh", "doc-ngu-phap": "Đọc: ngữ pháp", "doc-nguyen-nhan": "Đọc: nguyên nhân", "doc-quan-diem": "Đọc: quan điểm", "doc-so": "Đọc: con số", "doc-so-lieu": "Đọc: số liệu", "doc-suy-luan": "Đọc: suy luận", "doc-thoi-gian": "Đọc: thời gian", "doc-tu-vung": "Đọc: từ vựng", "doc-vi-tri": "Đọc: vị trí", "doc-y-chinh": "Đọc: ý chính", "nghe-chi-tiet": "Nghe: chi tiết", "nghe-dai-tu": "Nghe: đại từ", "nghe-dia-diem": "Nghe: địa điểm", "nghe-doan-van": "Nghe: đoạn văn", "nghe-hanh-dong": "Nghe: hành động", "nghe-hoi-thoai": "Nghe: hội thoại", "nghe-hoi-thoai-dai": "Nghe: hội thoại dài", "nghe-ngu-canh": "Nghe: ngữ cảnh", "nghe-nguyen-nhan": "Nghe: nguyên nhân", "nghe-noi-dung-chinh": "Nghe: nội dung chính", "nghe-phan-hoi": "Nghe: chọn câu đáp", "nghe-phu-dinh": "Nghe: phủ định", "nghe-quan-diem": "Nghe: quan điểm", "nghe-so": "Nghe: con số", "nghe-so-lieu": "Nghe: số liệu", "nghe-suy-luan": "Nghe: suy luận", "nghe-thai-do": "Nghe: thái độ", "nghe-thoi-gian": "Nghe: thời gian", "nghe-trinh-tu": "Nghe: trình tự", "nghe-tu-vung": "Nghe: từ vựng", "nghe-vi-tri": "Nghe: vị trí", "nghe-y-chinh": "Nghe: ý chính", "nghe-y-dinh": "Nghe: ý định", "ngu-phap-bie": "Ngữ pháp: 别", "ngu-phap-bo-ngu-ket-qua": "Ngữ pháp: bổ ngữ kết quả", "ngu-phap-bo-ngu-trang-thai": "Ngữ pháp: bổ ngữ trạng thái", "ngu-phap-cau-hoi-ma": "Ngữ pháp: câu hỏi 吗", "ngu-phap-dai-tu-nghi-van": "Ngữ pháp: đại từ nghi vấn", "ngu-phap-dong-tu-nang-nguyen": "Ngữ pháp: động từ năng nguyện", "ngu-phap-luong-tu": "Ngữ pháp: lượng từ", "ngu-phap-phu-dinh": "Ngữ pháp: phủ định", "ngu-phap-shi-de": "Ngữ pháp: 是…的", "ngu-phap-so-sanh-bi": "Ngữ pháp: so sánh 比", "ngu-phap-suiran-danshi": "Ngữ pháp: 虽然…但是", "ngu-phap-tai-le": "Ngữ pháp: 太…了", "ngu-phap-yi-ye-mei": "Ngữ pháp: 一…也没", "ngu-phap-yinwei": "Ngữ pháp: 因为", "ngu-phap-zhengzai": "Ngữ pháp: 正在", "viet-bo-thu": "Viết: bộ thủ", "viet-cau-tao-chu": "Viết: cấu tạo chữ", "viet-chu-han": "Viết: chữ Hán", "viet-dat-cau": "Viết: đặt câu", "viet-doan-van": "Viết: đoạn văn", "viet-ke-chuyen": "Viết: kể chuyện", "viet-nghi-luan": "Viết: nghị luận", "viet-ung-dung": "Viết: văn bản ứng dụng"};
  const skillName = (k) => SKILL[k] || k.replace(/-/g, " ");

  // ---------- Thẻ trên trang chủ ----------
  function homeCard() {
    const d = H3.daysToExam();
    const bars = [1, 2, 3, 4, 5, 6].map((lv) => {
      const ws = H3.byLevel(lv), n = learnedIn(ws);
      return `<a href="#/words/${lv}" class="h3-bar"><span class="small"><b>Cấp ${lv}</b> <span class="muted">${n}/${ws.length}</span></span><div class="progress"><span style="width:${ws.length ? (n / ws.length) * 100 : 0}%"></span></div></a>`;
    }).join("");
    return `<div class="card mt"><div class="row between"><div><div class="eyebrow">HSK 3.0 · đề cương 2025</div><h3 style="margin:4px 0 0">${d > 0 ? `Còn ${d} ngày đến kỳ thi HSK 3.0 đầu tiên (13/12/2026)` : d === 0 ? "Hôm nay là kỳ thi HSK 3.0 đầu tiên!" : "HSK 3.0 đã chính thức áp dụng"}</h3></div>
      <div class="row h3-actions"><a class="btn btn-sm" href="#/words">Từ vựng 3.0</a><a class="btn btn-sm" href="#/lessons/h3">Bài bổ sung</a><a class="btn btn-sm btn-primary" href="#/exam">Đề luyện 3.0</a></div></div>
      <p class="small muted" style="margin:8px 0 10px">Số từ HSK 3.0 đã vào bộ thẻ ôn tập, theo từng cấp. Từ đã học ở các bài HSK 2.0 được tính luôn.</p>
      <div class="h3-bars">${bars}</div></div>`;
  }

  // ---------- Danh sách bài bổ sung ----------
  function lessons() {
    const s = Store.state;
    const byLv = {};
    H3.lessons.forEach((L) => { (byLv[L.level] = byLv[L.level] || []).push(L); });
    const card = (L) => { const done = s.completedLessons.includes(L.id); return `
      <a class="card lesson-card ${done ? "done" : ""}" href="#/lesson/${L.id}"><div class="lesson-icon">${done ? "✓" : esc(L.icon)}</div><div class="lesson-body"><div class="lesson-title">Bài ${L.no}: ${esc(L.title)}</div><div class="lesson-meta">${esc(L.sub)} · ${L.words.length} từ · ${L.grammar.length} ngữ pháp</div></div>${done ? `<span class="pill green">Xong</span>` : ""}</a>`; };
    const html = `<a href="#/lessons" class="backlink">← Bài học HSK 2.0</a><h1>Bài bổ sung HSK 3.0</h1>
      <p class="subtitle">Đề thi HSK 3.0 (từ 13/12/2026) dùng danh sách từ của đề cương 2025. ${H3.lessons.reduce((a, L) => a + L.words.length, 0)} từ cấp 1–4 của đề cương chưa có trong 149 bài HSK 2.0 nên được dạy ở ${H3.lessons.length} bài dưới đây. Nên học bài HSK 2.0 cùng cấp trước, rồi học bài bổ sung. Hoàn thành bài (đạt 70%) thì từ vào bộ thẻ ôn tập như bình thường.</p>
      ${Object.keys(byLv).map((lv) => `<h2>HSK 3.0 cấp ${lv} <span class="muted small">${byLv[lv].filter((L) => s.completedLessons.includes(L.id)).length}/${byLv[lv].length} bài</span></h2><div class="grid grid-2">${byLv[lv].map(card).join("")}</div>`).join("")}
      <p class="small muted mt">Cấp 5–6 chưa có bài bổ sung; xem và thêm từ vào thẻ ở trang <a href="#/words/5">Từ vựng HSK 3.0</a>.</p>`;
    return { html };
  }

  // ---------- Từ vựng theo cấp ----------
  // std = "hsk2": danh sách từ HSK 2.0 (bản 2012) theo cấp, lấy từ dữ liệu các bài học; mặc định HSK 3.0
  function words(levelArg, std) {
    const h2 = std === "hsk2";
    const byLv = (n) => (h2 ? Practice.wordsOf("hsk2", n) : H3.byLevel(n));
    const level = (h2 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7]).includes(+levelArg) ? +levelArg : 1;
    if (Store.state.settings.course !== (h2 ? "hsk2" : "hsk3")) { Store.state.settings.course = h2 ? "hsk2" : "hsk3"; Store.save(); }
    const base = h2 ? "#/words/hsk2/" : "#/words/";
    let all = level === 7 ? [] : byLv(level);
    const strip = (x) => String(x || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "u").toLowerCase();
    const html = `<div class="row between page-head"><h1 style="margin:0">Từ vựng</h1>
        <div class="segmented" role="tablist" aria-label="Chuẩn HSK"><a role="tab" href="#/words/1" aria-selected="${!h2}" class="${h2 ? "" : "active"}">HSK 3.0</a><a role="tab" href="#/words/hsk2/1" aria-selected="${h2}" class="${h2 ? "active" : ""}">HSK 2.0</a></div></div>
      <p class="subtitle">${h2 ? "Từ vựng HSK 2.0 của các bài học, xếp theo cấp của bài (danh sách 2010 và phần bổ sung 2012). Mỗi cấp chỉ gồm từ mới của cấp đó; vài chục từ được dạy sớm hơn cấp chính thức nên nằm ở cấp thấp hơn, và có thêm một số từ dạy kèm trong bài như 哪儿, 没有." : "Danh sách từ theo đề cương thi HSK 2025 (CLEC), dùng cho kỳ thi HSK 3.0 từ 13/12/2026. Mỗi cấp chỉ gồm từ mới của cấp đó. Nghĩa, âm Hán Việt và câu ví dụ do Nǐ hǎo biên soạn."}</p>
      <div class="tabs">${[1, 2, 3, 4, 5, 6].map((n) => { const ws = byLv(n); return `<button class="${n === level ? "active" : ""}" data-lv="${n}">Cấp ${n} <span class="muted small">${learnedIn(ws)}/${ws.length}</span></button>`; }).join("")}${h2 ? "" : `<button class="${level === 7 ? "active" : ""}" data-lv="7">Cấp 7–9</button>`}</div>
      ${level === 7 ? `<div class="tip mb"><b>Cấp 7–9</b> (5.562 từ) hiện chỉ để tra cứu, chưa thêm vào bộ thẻ được. Từ có nhãn <span class="pill gold">CVDICT</span> lấy nghĩa từ từ điển mở CVDICT (dịch máy từ CC-CEDICT, giấy phép CC BY-SA 4.0), chưa được Nǐ hǎo biên tập và chưa có câu ví dụ.</div>` : ""}
      <div class="row mb filter-bar ${level === 7 ? "hidden" : ""}"><input class="search" id="q" placeholder="Lọc theo chữ Hán, pinyin, Hán Việt, nghĩa…" style="flex:1"><select id="f"><option value="all">Tất cả</option><option value="new">Chưa học</option><option value="known">Đã trong thẻ</option></select><button class="btn" id="add10">+ 10 từ chưa học vào thẻ</button></div>
      <div id="res"></div>`;
    return {
      html,
      after(el) {
        el.querySelectorAll("[data-lv]").forEach((b) => b.onclick = () => (location.hash = base + b.dataset.lv));
        const q = el.querySelector("#q"), f = el.querySelector("#f"), res = el.querySelector("#res");
        const lessonCell = (w) => w.l ? `<a class="pill" href="#/lesson/${w.l}">${w.l > 300 ? "Bổ sung 2012" : "Bài " + w.l}</a>` : w.h3l ? `<a class="pill blue" href="#/lesson/${w.h3l}">Bổ sung ${H3.findLesson(w.h3l).no}</a>` : "";
        function run() {
          const t = strip(q.value.trim()), raw = q.value.trim();
          let list = all;
          if (f.value === "new") list = list.filter((w) => !Store.state.cards[w.id]);
          if (f.value === "known") list = list.filter((w) => Store.state.cards[w.id]);
          if (t) list = list.filter((w) => w.hz.includes(raw) || strip(w.py).replace(/[\s']/g, "").includes(t.replace(/\s/g, "")) || strip(w.hv).includes(t) || strip(w.vi).includes(t));
          const shown = list.slice(0, 200);
          res.innerHTML = `<p class="small muted">${list.length} từ${list.length > 200 ? " (hiện 200 đầu, gõ để lọc)" : ""}</p>
            <table class="vocab-table"><thead><tr><th>Chữ</th><th>Pinyin</th><th>Hán Việt</th><th>Nghĩa</th><th>Ví dụ</th><th>Bài</th><th></th></tr></thead><tbody>${shown.map((w) => `<tr>
              <td class="hz">${esc(w.hz)}</td><td class="py">${pyHtml(w.py)}</td><td class="hv">${esc(w.hv)}</td><td>${esc(w.vi)}${w.cv ? ` <span class="pill gold" title="Nghĩa từ CVDICT (CC BY-SA 4.0), chưa biên tập">CVDICT</span>` : ""}<br><span class="small muted">${esc(w.pos)}</span></td>
              <td class="small">${w.ex && w.ex[0] ? `<span class="zh">${esc(w.ex[0])}</span><br><span class="muted">${pyHtml(w.ex[1])}</span><br>${esc(w.ex[2])}` : ""}</td><td>${lessonCell(w)}</td>
              <td><div class="row">${speakBtn(w.hz, "btn btn-sm", "Nghe")}<a class="btn btn-sm" href="#/write/${encodeURIComponent(w.hz[0])}">${ic("pen")}<span>Viết</span></a>${!w.id ? "" : Store.state.cards[w.id] ? `<span class="pill green" title="Đã trong bộ thẻ">${ic("check")} Trong thẻ</span>` : `<button class="btn btn-sm" data-add="${esc(w.id)}">${ic("plus")} Thẻ</button>`}</div></td></tr>`).join("")}</tbody></table>`;
          bindSpeak(res);
          res.querySelectorAll("[data-add]").forEach((b) => b.onclick = () => { const id = b.dataset.add; SRS.addWords([id]); toast("Đã thêm vào bộ thẻ ôn tập", { undo: () => { SRS.remove(id); App.updateBadge(); run(); } }); App.updateBadge(); run(); });
        }
        el.querySelector("#add10").onclick = () => {
          const ids = all.filter((w) => !Store.state.cards[w.id]).slice(0, 10).map((w) => w.id);
          if (!ids.length) { toast("Đã thêm hết từ của cấp này"); return; }
          const wids = ids.filter((id) => /^[一-鿿]+$/.test(vocabById(id).hz) && !WSRS.has(id));
          SRS.addWords(ids);
          WSRS.addWords(wids);
          App.route();
          toast(`Đã thêm ${ids.length} từ vào bộ thẻ ôn tập và luyện viết`, { undo: () => { ids.forEach((id) => SRS.remove(id)); wids.forEach((id) => WSRS.remove(id)); App.route(); } });
        };
        q.oninput = run; f.onchange = run;
        if (level === 7) {
          res.innerHTML = `<div class="skeleton-list" aria-busy="true" aria-label="Đang tải danh sách cấp 7–9">${"<div class='skeleton'></div>".repeat(6)}</div>`;
          H3.load79().then((list) => { all = list; run(); }).catch((e) => { res.innerHTML = `<div class="card">${esc(e.message)}</div>`; });
        } else run();
      },
    };
  }

  // ---------- Đề luyện cố định ----------
  let cur = null; // bài đang làm

  function examCards() {
    const hist = (Store.state.exams3 || []).slice().reverse().slice(0, 8);
    const levels = [1, 2, 3, 4, 5, 6];
    return `<div class="card mb"><div class="row between"><div><div class="eyebrow">Mới · HSK 3.0 (đề cương 2025)</div><h2 style="margin:4px 0">Đề luyện cố định có giải thích</h2></div>
      <span class="small muted">Thi lần đầu: 13/12/2026</span></div>
      <p class="small muted">Mỗi cấp một đề tự biên soạn theo đúng cấu trúc đề mẫu HSK 3.0 của CLEC: số phần, số câu, thời gian. Câu nào cũng có giải thích tiếng Việt, kết quả thống kê lỗi theo kỹ năng. CLEC chưa công bố thang điểm và điểm đạt của cấp 1–6, nên web chấm theo tỷ lệ đúng.</p>
      <div class="grid grid-3">${levels.map((lv) => `<a class="card lesson-card" href="#/exam/h3-${lv}"><div class="lesson-icon">${lv}</div><div class="lesson-body"><div class="lesson-title">HSK 3.0 · Cấp ${lv}</div><div class="lesson-meta">${["40 câu · ~40′", "60 câu · ~60′", "70 câu · ~83′", "70 câu · ~85′", "72 câu · ~110′", "82 câu · ~125′"][lv - 1]}</div></div></a>`).join("")}</div>
      ${hist.length ? `<h3>Lịch sử đề luyện 3.0</h3><table class="vocab-table"><thead><tr><th>Ngày</th><th>Đề</th><th>Nghe</th><th>Đọc</th><th>Viết</th><th>Đúng</th></tr></thead><tbody>${hist.map((h) => `<tr><td>${esc(h.date)}</td><td>Cấp ${h.level}</td>${["listening", "reading", "writing"].map((k) => { const x = h.sections.find((s) => s.key === k); return `<td>${x ? `${x.correct}/${x.total}` : "–"}</td>`; }).join("")}<td><b>${h.pct}%</b></td></tr>`).join("")}</tbody></table>` : ""}
    </div>`;
  }

  function exam(arg) {
    const level = +String(arg).replace("h3-", "");
    const html = `<a href="#/exam" class="backlink">${ic("back")} Thi thử</a><div id="ex"><div class="skeleton-list" aria-busy="true" aria-label="Đang tải đề">${"<div class='skeleton'></div>".repeat(4)}</div></div>`;
    return {
      html,
      after(el) {
        const box = el.querySelector("#ex");
        H3.loadExams().then((list) => {
          const E = list.find((e) => +e.level === level);
          if (!E) { box.innerHTML = `<div class="card">Chưa có đề cho cấp này.</div>`; return; }
          if (!cur || cur.exam.id !== E.id) start(E, box, true);
          else if (cur.finished) results(box);
          else { render(box); tick(box); }
        }).catch(() => { box.innerHTML = `<div class="card">Không tải được tệp đề <code>js/data/h30-exams.js</code>.</div>`; });
      },
    };
  }

  function flatten(E) {
    const items = [];
    E.sections.forEach((sec, si) => sec.parts.forEach((part) => part.groups.forEach((g, gi) => g.items.forEach((it) => items.push({ si, sec, part, g, gkey: `${si}-${part.part}-${gi}`, it })))));
    return items;
  }

  function start(E, box, intro) {
    cur = { exam: E, items: flatten(E), answers: {}, self: {}, plays: {}, si: 0, idx: 0, startedAt: Date.now(), secEnd: 0, finished: false, showPy: E.level <= 2 };
    if (!intro) return;
    const sec = E.sections;
    box.innerHTML = `<div class="card"><div class="eyebrow">${esc(E.format)}</div><h1 style="margin:4px 0">${esc(E.title)}</h1>
      <p class="muted">${cur.items.length} câu · khoảng ${E.minutes_total} phút. ${esc(E.scoring_note || "")}</p>
      <table class="vocab-table"><thead><tr><th>Phần</th><th>Số câu</th><th>Thời gian</th><th>Các dạng câu</th></tr></thead><tbody>${sec.map((s, si) => `<tr><td><b>${esc(s.name_zh)}</b> ${esc(s.name_vi)}</td><td>${cur.items.filter((x) => x.si === si).length}</td><td>${s.minutes} phút</td><td class="small">${s.parts.map((p) => `第${p.part}部分: ${esc(p.instruction_vi)}`).join("<br>")}</td></tr>`).join("")}</tbody></table>
      <ul class="small muted"><li>Mỗi phần có đồng hồ riêng; hết giờ sẽ tự chuyển phần. Phần nghe dùng giọng đọc của trình duyệt, nghe tối đa số lần ghi ở từng câu.</li><li>Tranh trong đề thật được thay bằng mô tả tiếng Việt.</li><li>Câu viết đoạn văn không chấm tự động: sau khi nộp, bạn so với bài mẫu và tiêu chí rồi tự đánh dấu Đạt / Chưa đạt.</li></ul>
      <div class="row"><button class="btn btn-primary btn-lg" id="go">Bắt đầu làm bài</button><label class="small"><input type="checkbox" id="py" ${cur.showPy ? "checked" : ""}> Hiện pinyin</label></div></div>`;
    box.querySelector("#py").onchange = (e) => (cur.showPy = e.target.checked);
    box.querySelector("#go").onclick = () => { beginSection(0); render(box); tick(box); };
  }

  function beginSection(si) {
    cur.si = si;
    cur.idx = cur.items.findIndex((x) => x.si === si);
    cur.secEnd = Date.now() + cur.exam.sections[si].minutes * 60000;
  }

  function tick(box) {
    clearInterval(tick.t);
    tick.t = setInterval(() => {
      if (!cur || cur.finished || !document.body.contains(box)) { clearInterval(tick.t); return; }
      const t = box.querySelector("#timer");
      const left = cur.secEnd - Date.now();
      if (t) { t.textContent = mmss(left); t.classList.toggle("danger", left < 60000); }
      if (left <= 0) { toast("Hết giờ phần này"); nextSection(box); }
    }, 500);
  }

  function nextSection(box) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (cur.si + 1 < cur.exam.sections.length) { beginSection(cur.si + 1); render(box); }
    else { cur.finished = true; cur.endedAt = Date.now(); clearInterval(tick.t); save(); results(box); }
  }

  const isChoice = (it) => Array.isArray(it.options) && it.options.length > 0;
  const isAuto = (x) => isChoice(x.it) || x.part.type === "w_char";

  function playGroup(x, btn) {
    const max = x.part.plays || 1;
    const used = cur.plays[x.gkey] || 0;
    if (used >= max) return;
    cur.plays[x.gkey] = used + 1;
    const lines = x.g.audio.map((l) => l[1]);
    let i = 0;
    const go = () => { if (i < lines.length) TTS.speak(lines[i++], { onend: () => setTimeout(go, 450) }); };
    go();
    if (btn) { btn.innerHTML = `${ic("volume")} Nghe (${max - cur.plays[x.gkey]} lần còn lại)`; btn.disabled = cur.plays[x.gkey] >= max; }
  }

  function render(box) {
    App.setFocus(true);
    const E = cur.exam, sec = E.sections[cur.si];
    const inSec = cur.items.filter((x) => x.si === cur.si);
    const x = cur.items[cur.idx], it = x.it, g = x.g;
    const ans = cur.answers[it.no];
    const max = x.part.plays || 1, used = cur.plays[x.gkey] || 0;
    let body = `<div class="small muted mb">第${x.part.part}部分 · ${esc(x.part.instruction_vi)}</div>`;
    if (g.audio) body += `<div class="row mb"><button class="btn" id="play" ${used >= max ? "disabled" : ""}>${ic("volume")} Nghe (${max - used} lần còn lại)</button></div>`;
    if (g.image_vi) body += `<div class="pool-box">🖼 <i>${esc(g.image_vi)}</i></div>`;
    if (g.passage) body += `<div class="passage zh" style="white-space:pre-line">${esc(g.passage)}</div>`;
    if (it.stem) body += `<div class="exam-stem ${CJK.test(it.stem) ? "zh" : ""}">${esc(it.stem)}${cur.showPy && it.stem_py ? `<div class="small muted" style="font-size:1rem">${esc(it.stem_py)}</div>` : ""}</div>`;
    if (isChoice(it)) {
      const opy = it.options_py || [];
      body += `<div class="options one-col">${it.options.map((o, k) => `<button class="option ${CJK.test(o) ? "zh" : "vi-text"} ${ans === k ? "sel" : ""}" data-k="${k}"><b>${LET[k]}.</b> ${esc(o)}${cur.showPy && opy[k] ? ` <span class="small muted">${esc(opy[k])}</span>` : ""}</button>`).join("")}</div>`;
    } else if (x.part.type === "w_char") {
      body += `<div class="row" style="justify-content:center"><input class="search zh" id="txt" style="max-width:160px;text-align:center;font-size:1.6rem" maxlength="4" value="${esc(ans || "")}" placeholder="字"></div>`;
    } else {
      const n = (ans || "").replace(/\s/g, "").length;
      body += `<textarea id="txt" class="search zh" rows="${x.part.type === "w_picture_sentence" ? 3 : 10}" style="width:100%;font-size:1.1rem" placeholder="Viết bằng chữ Hán…">${esc(ans || "")}</textarea><div class="small muted" id="cnt">${n} chữ</div>`;
    }
    const answered = (y) => cur.answers[y.it.no] != null && cur.answers[y.it.no] !== "";
    const posInSec = inSec.indexOf(x);
    box.innerHTML = `<div class="card"><div class="row between"><div><div class="eyebrow">${esc(E.title)}</div><h2 style="margin:2px 0">${esc(sec.name_zh)} · ${esc(sec.name_vi)} <span class="muted small">câu ${it.no}</span></h2></div>
        <div class="row"><label class="small"><input type="checkbox" id="py" ${cur.showPy ? "checked" : ""}> Pinyin</label><span class="timer" id="timer">${mmss(cur.secEnd - Date.now())}</span></div></div>
      <div class="exam-body mt">${body}</div>
      <div class="row between mt"><button class="btn" id="prev" ${posInSec <= 0 ? "disabled" : ""}>← Câu trước</button>
        ${posInSec < inSec.length - 1 ? `<button class="btn btn-primary" id="next">Câu sau →</button>` : `<button class="btn btn-primary" id="submit">${cur.si + 1 < E.sections.length ? "Nộp phần này, sang phần sau" : "Nộp bài"}</button>`}</div>
      <div class="qnav">${inSec.map((y) => `<button class="${answered(y) ? "done" : ""} ${y === x ? "cur" : ""}" data-no="${y.it.no}">${y.it.no}</button>`).join("")}</div></div>`;
    const go = (i) => { cur.idx = i; render(box); };
    box.querySelector("#py").onchange = (e) => { cur.showPy = e.target.checked; render(box); };
    const pb = box.querySelector("#play"); if (pb) pb.onclick = () => playGroup(x, pb);
    box.querySelectorAll(".option[data-k]").forEach((b) => b.onclick = () => { cur.answers[it.no] = +b.dataset.k; render(box); });
    const txt = box.querySelector("#txt");
    if (txt) txt.oninput = () => { cur.answers[it.no] = txt.value; const c = box.querySelector("#cnt"); if (c) c.textContent = txt.value.replace(/\s/g, "").length + " chữ"; };
    const pv = box.querySelector("#prev"); if (pv) pv.onclick = () => go(cur.items.indexOf(inSec[posInSec - 1]));
    const nx = box.querySelector("#next"); if (nx) nx.onclick = () => go(cur.items.indexOf(inSec[posInSec + 1]));
    const sb = box.querySelector("#submit");
    if (sb) sb.onclick = async () => {
      const left = inSec.filter((y) => !answered(y)).length;
      if (left && !(await uiConfirm(`Còn <b>${left} câu</b> chưa làm trong phần này. Nộp rồi sẽ không quay lại được.`, { title: "Nộp phần này?", okText: "Nộp", cancelText: "Làm tiếp" }))) return;
      nextSection(box);
    };
    box.querySelectorAll("[data-no]").forEach((b) => b.onclick = () => go(cur.items.findIndex((y) => y.it.no === +b.dataset.no)));
  }

  function grade(x) {
    const it = x.it, a = cur.answers[it.no];
    if (isChoice(it)) return a === it.answer;
    if (x.part.type === "w_char") return String(a || "").trim() === String(it.sample_answer || "").trim();
    return cur.self[it.no] === true; // tự đánh giá
  }

  function summary() {
    return cur.exam.sections.map((s, si) => {
      const xs = cur.items.filter((x) => x.si === si);
      return { key: s.key, name: `${s.name_zh} · ${s.name_vi}`, total: xs.length, correct: xs.filter(grade).length, manual: xs.filter((x) => !isAuto(x)).length };
    });
  }

  function save() {
    const s = Store.state;
    s.exams3 = s.exams3 || [];
    const sm = summary(), tot = sm.reduce((a, x) => a + x.total, 0), ok = sm.reduce((a, x) => a + x.correct, 0);
    cur.histIndex = s.exams3.length;
    s.exams3.push({ date: Store.today(), id: cur.exam.id, level: cur.exam.level, pct: Math.round((ok / tot) * 100), sections: sm.map(({ key, correct, total }) => ({ key, correct, total })), minutes: Math.round((cur.endedAt - cur.startedAt) / 60000) });
    Store.addXp(ok);
    Store.markRoutine("exam");
    Store.save();
  }
  function resave() {
    const h = (Store.state.exams3 || [])[cur.histIndex];
    if (!h) return;
    const sm = summary(), tot = sm.reduce((a, x) => a + x.total, 0), ok = sm.reduce((a, x) => a + x.correct, 0);
    h.pct = Math.round((ok / tot) * 100);
    h.sections = sm.map(({ key, correct, total }) => ({ key, correct, total }));
    Store.save();
  }

  function results(box) {
    App.setFocus(false);
    const sm = summary(), tot = sm.reduce((a, x) => a + x.total, 0), ok = sm.reduce((a, x) => a + x.correct, 0);
    const skills = {};
    cur.items.filter(isAuto).forEach((x) => (x.it.skills || []).forEach((k) => { skills[k] = skills[k] || { ok: 0, n: 0 }; skills[k].n++; if (grade(x)) skills[k].ok++; }));
    const weak = Object.entries(skills).filter(([, v]) => v.n >= 2).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).slice(0, 6);
    const fmt = (x, v) => v == null || v === "" ? "<i>bỏ trống</i>" : isChoice(x.it) ? `${LET[v]}. ${esc(x.it.options[v])}` : esc(v);
    const rev = (filter) => cur.items.filter(filter).map((x) => {
      const it = x.it, ok2 = grade(x), auto = isAuto(x);
      return `<div class="card mb ${!ok2 ? "wrong" : ""}" style="${!ok2 ? "border-left:4px solid var(--primary)" : ""}">
        <div class="row between"><b>Câu ${it.no}</b><span class="pill ${ok2 ? "green" : auto ? "red" : "gold"}">${ok2 ? "Đúng" : auto ? "Sai" : "Tự chấm"}</span></div>
        ${x.g.audio ? `<div class="small"><b>Lời nghe:</b> <span class="zh">${x.g.audio.map((l) => (l[0] ? esc(l[0]) + "：" : "") + esc(l[1])).join(" ")}</span> ${speakBtn(x.g.audio.map((l) => l[1]).join(""))}</div>` : ""}
        ${x.g.image_vi ? `<div class="small muted">🖼 ${esc(x.g.image_vi)}</div>` : ""}
        ${it.stem ? `<div class="zh mt">${esc(it.stem)}</div>` : ""}
        <div class="small mt">Bạn trả lời: ${fmt(x, cur.answers[it.no])}${isChoice(it) ? ` · Đáp án: <b>${LET[it.answer]}. ${esc(it.options[it.answer])}</b>` : ""}</div>
        ${it.sample_answer ? `<div class="small mt"><b>Bài mẫu:</b> <span class="zh" style="white-space:pre-line">${esc(it.sample_answer)}</span></div>` : ""}
        ${it.rubric_vi ? `<div class="small muted mt"><b>Tiêu chí:</b> ${esc(it.rubric_vi)}</div>` : ""}
        ${!auto ? `<div class="row mt"><span class="small">Tự đánh giá:</span><button class="btn btn-sm ${cur.self[it.no] === true ? "btn-primary" : ""}" data-self="${it.no}" data-v="1">Đạt</button><button class="btn btn-sm ${cur.self[it.no] === false ? "btn-primary" : ""}" data-self="${it.no}" data-v="0">Chưa đạt</button></div>` : ""}
        <div class="tip mt"><b>Giải thích:</b> ${esc(it.explain_vi)}</div></div>`;
    }).join("");
    box.innerHTML = `<div class="card center"><div class="eyebrow">${esc(cur.exam.title)}</div><h1 style="margin:6px 0">${Math.round((ok / tot) * 100)}% · ${ok}/${tot} câu</h1>
        <p class="muted small">${esc(cur.exam.scoring_note || "")}</p>
        <div class="grid grid-3 mt">${sm.map((x) => `<div class="card stat"><div class="stat-value">${x.correct}/${x.total}</div><div class="stat-label">${esc(x.name)}${x.manual ? ` · ${x.manual} câu tự chấm` : ""}</div></div>`).join("")}</div>
        ${weak.length ? `<h3>Kỹ năng cần luyện thêm</h3><div class="row" style="justify-content:center">${weak.map(([k, v]) => `<span class="pill ${v.ok / v.n < 0.6 ? "red" : "gold"}">${esc(skillName(k))} · ${v.ok}/${v.n}</span>`).join("")}</div>` : ""}
        <div class="row mt" style="justify-content:center"><button class="btn" id="again">Làm lại đề này</button><a class="btn btn-primary" href="#/exam">Chọn đề khác</a></div></div>
      <div class="tabs mt"><button class="active" data-f="wrong">Câu sai và câu tự chấm</button><button data-f="all">Tất cả câu</button></div><div id="rev"></div>`;
    const revBox = box.querySelector("#rev");
    const show = (f) => {
      revBox.innerHTML = rev(f === "all" ? () => true : (x) => !grade(x) || !isAuto(x)) || `<p class="muted">Không có câu sai. 🎉</p>`;
      bindSpeak(revBox);
      revBox.querySelectorAll("[data-self]").forEach((b) => b.onclick = () => { cur.self[+b.dataset.self] = b.dataset.v === "1"; resave(); results(box); });
    };
    box.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { box.querySelectorAll("[data-f]").forEach((y) => y.classList.toggle("active", y === b)); show(b.dataset.f); });
    box.querySelector("#again").onclick = () => start(cur.exam, box, true);
    show("wrong");
  }

  // ---------- Nguồn dữ liệu ----------
  function about() {
    const rows = [
      ["Đề cương HSK 2025 《HSK考试大纲》 (CLEC / Chinese Testing International)", "Danh sách từ HSK 3.0 cấp 1–9, cấp, pinyin, từ loại", "Bản quyền của CLEC, không có giấy phép mở", "Chỉ trích dữ kiện (từ, cấp, pinyin, từ loại). Không đăng lại tệp PDF, không lấy phần mô tả hay đề mẫu.", "https://www.chinesetest.cn/"],
      ["complete-hsk-vocabulary (Yanis Zafirópulos)", "Danh sách HSK 2.0 cấp 1–6, HSK 3.0 bản 2021, phồn thể, tần suất, bộ thủ", "MIT", "Giữ thông báo bản quyền và giấy phép MIT khi phân phối lại dữ liệu.", "https://github.com/drkameleon/complete-hsk-vocabulary"],
      ["CC-CEDICT (MDBG)", "Nghĩa tiếng Anh, pinyin số, phồn thể (bộ dữ liệu tải về)", "CC BY-SA 4.0", "Ghi công CC-CEDICT; mọi tệp có nghĩa tiếng Anh phải phát hành lại theo CC BY-SA 4.0.", "https://www.mdbg.net/chinese/dictionary?page=cc-cedict"],
      ["CVDICT (Phong Phan)", "Nghĩa tiếng Việt cho từ chưa được Nǐ hǎo biên soạn (chủ yếu cấp 7–9), gắn nhãn CVDICT", "CC BY-SA 4.0", "Ghi công CVDICT; tệp chứa nghĩa CVDICT (js/data/h30-words-79.js và các tệp data/hsk/) phải theo CC BY-SA 4.0. CVDICT dịch máy từ CC-CEDICT, chưa kiểm tra hết.", "https://github.com/ph0ngp/CVDICT"],
      ["Unihan (Unicode Consortium)", "Số nét, bộ thủ + số nét, âm đọc của chữ Hán", "Unicode License v3", "Giữ thông báo bản quyền Unicode khi phân phối lại.", "https://www.unicode.org/charts/unihan.html"],
      ["Make Me a Hanzi – dictionary.txt (Shaunak Kishore)", "Phân tách chữ, bộ thủ, gợi ý nguồn gốc chữ", "LGPL-3.0 trở lên", "Để thành tệp riêng (data/hsk/chars-makemeahanzi.json); bản sửa đổi phải giữ LGPL.", "https://github.com/skishore/makemeahanzi"],
      ["Make Me a Hanzi – graphics.txt / Hanzi Writer data", "Thứ tự nét, nét chữ dạng SVG (luyện viết)", "Arphic Public License", "Tệp riêng (data/hsk/chars-strokes-makemeahanzi.json) kèm văn bản giấy phép (data/licenses/).", "https://github.com/chanind/hanzi-writer-data"],
      ["Hanzi Writer (David Chanin)", "Thư viện hoạt hình và kiểm tra nét khi luyện viết", "MIT", "Tải từ CDN, giữ nguyên thông báo bản quyền.", "https://hanziwriter.org"],
    ];
    const html = `<h1>Nguồn dữ liệu và giấy phép</h1>
      <p class="subtitle">Nǐ hǎo dùng các bộ dữ liệu mở dưới đây, tải trực tiếp từ nơi phát hành (không crawl website). Nghĩa tiếng Việt có nhãn Nǐ hǎo, âm Hán Việt, câu ví dụ, 149 bài học, ${H3.lessons.length} bài bổ sung HSK 3.0, bài đọc và các đề luyện do Nǐ hǎo tự biên soạn. Đề luyện chỉ theo cấu trúc đề chính thức, không sao chép câu hỏi của bất kỳ đề hay website nào.</p>
      <div class="card"><table class="vocab-table"><thead><tr><th>Nguồn</th><th>Dùng cho</th><th>Giấy phép</th><th>Nghĩa vụ khi dùng</th></tr></thead><tbody>${rows.map((r) => `<tr><td><a href="${r[4]}" target="_blank" rel="noopener">${esc(r[0])}</a></td><td class="small">${esc(r[1])}</td><td class="small"><b>${esc(r[2])}</b></td><td class="small">${esc(r[3])}</td></tr>`).join("")}</tbody></table></div>
      <div class="card mt"><h3 style="margin-top:0">CC BY-SA 4.0 nghĩa là gì?</h3>
        <ul class="small"><li><b>BY – Ghi công:</b> ghi tên nguồn (CC-CEDICT, CVDICT), dẫn link tới giấy phép và nói rõ có chỉnh sửa hay không.</li>
        <li><b>SA – Chia sẻ tương tự:</b> nếu bạn phát hành lại dữ liệu có chứa phần lấy từ nguồn này (kể cả khi đã chỉnh sửa, ghép với dữ liệu khác trong cùng tệp), bản đó cũng phải theo CC BY-SA 4.0.</li>
        <li>Được dùng cả cho mục đích thương mại. Không được thêm điều khoản hạn chế người khác dùng lại.</li></ul>
        <p class="small muted">Vì vậy nghĩa tiếng Anh (CC-CEDICT) và nghĩa CVDICT nằm trong các tệp được đánh dấu riêng; phần do Nǐ hǎo tự soạn có thể tách ra bằng lệnh <code>python3 data/scripts/build_dataset.py --no-cedict</code>. Văn bản giấy phép: <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.vi" target="_blank" rel="noopener">CC BY-SA 4.0 (tiếng Việt)</a>.</p></div>
      <div class="card mt"><h3 style="margin-top:0">Dữ liệu trên web này</h3>
        <ul class="small"><li><code>js/data/h30-words.js</code> (HSK 3.0 cấp 1–6): nghĩa, Hán Việt, câu ví dụ do Nǐ hǎo biên soạn; danh sách từ theo đề cương 2025.</li>
        <li><code>js/data/h30-words-79.js</code> (cấp 7–9): có nghĩa từ CVDICT nên tệp này theo <b>CC BY-SA 4.0</b>.</li>
        <li>Bộ dữ liệu đầy đủ (JSON/CSV theo cấp, danh sách từ thiếu nghĩa) và cách build lại nằm trong thư mục <code>data/</code> của mã nguồn, xem <code>data/README.md</code>.</li></ul>
        <p class="small muted">Ghi công: Dữ liệu từ vựng dựa trên complete-hsk-vocabulary (MIT), CC-CEDICT (CC BY-SA 4.0, MDBG), CVDICT (CC BY-SA 4.0, Phong Phan), Unihan (Unicode License), Make Me a Hanzi (LGPL / Arphic Public License) và Hanzi Writer (MIT). Danh sách từ HSK 3.0 theo đề cương thi HSK 2025 của CLEC.</p></div>`;
    return { html };
  }

  window.H3V = { homeCard, lessons, words, exam, examCards, about };
})();
