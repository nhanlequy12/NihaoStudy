// Bộ định tuyến hash và khởi tạo ứng dụng
(function () {
  const view = document.getElementById("view");

  // Nhóm của từng trang, để tô sáng đúng mục trên thanh tab điện thoại
  const TAB_OF = { "": "home", start: "learn", path: "learn", step: "learn", lessons: "learn", lesson: "learn", words: "learn", dialogues: "learn", read: "learn", pinyin: "learn", radicals: "learn", roadmap: "learn", review: "review", practice: "practice", notebook: "practice" };
  const SIDE_OF = { lesson: "/lessons", notebook: "/notebook", path: "/start", step: "/start" };
  const LEARN = [["lessons", "Bài học", "book"], ["words", "Từ vựng", "words"], ["dialogues", "Hội thoại", "chat"], ["read", "Đọc hiểu", "read"], ["radicals", "Bộ thủ", "radical"], ["pinyin", "Pinyin", "pinyin"]];
  const LEARN_OF = { lessons: "lessons", words: "words", dialogues: "dialogues", read: "read", radicals: "radicals", pinyin: "pinyin" };
  const learnNav = (cur) => `<nav class="learn-nav" aria-label="Mục học">${LEARN.map(([k, v, i]) => `<a href="#/${k}" class="${k === cur ? "active" : ""}"${k === cur ? ' aria-current="page"' : ""}>${ic(i)}<span>${v}</span></a>`).join("")}</nav>`;

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const name = parts[0] || "";
    App.keyHandler = null;
    setFocus(false);
    UI.closeSheet();
    if (window.speechSynthesis) speechSynthesis.cancel();
    let r;
    try {
      switch (name) {
        case "": r = Views.home(); break;
        case "roadmap": r = Views.roadmap(); break;
        case "start": r = Path.start(parts[1]); break;
        case "path": r = Path.stage(parts[1]); break;
        case "step": r = Path.step(parts[1], parts[2]); break;
        case "pinyin": r = Views.pinyin(parts[1]); break;
        case "radicals": r = Views.radicals(); break;
        case "lessons": r = Views.lessons(parts[1]); break;
        case "lesson": r = Views.lesson(parts[1], parts[2]); break;
        case "review": r = Views.review(); break;
        case "write": r = Views.write(parts[1], parts[2]); break;
        case "read": r = parts[1] ? Views.reading(parts[1]) : Views.readList(); break;
        case "speak": r = Views.speak(); break;
        case "dictionary": r = Views.dictionary(); break;
        case "exam": r = parts[1] && parts[1].startsWith("h3-") ? H3V.exam(parts[1]) : Views.exam(parts[1]); break;
        case "words": r = parts[1] === "hsk2" || (!parts[1] && Store.state.settings.course === "hsk2") ? H3V.words(parts[2], "hsk2") : H3V.words(parts[1]); break;
        case "dialogues": r = Views.dialogues(parts[1]); break;
        case "about": r = H3V.about(); break;
        case "settings": r = Views.settings(); break;
        case "practice": r = parts[1] ? Practice.view(parts[1], parts[2]) : Practice.hub(); break;
        case "notebook": r = Practice.notebook(); break;
        default: r = { html: `<div class="card center empty"><h2>Không tìm thấy trang</h2><p class="muted">Đường dẫn này không tồn tại.</p><a class="btn btn-primary" href="#/">Về trang chủ</a></div>` };
      }
    } catch (err) {
      console.error(err);
      r = { html: `<div class="card center empty"><h2>Trang gặp lỗi</h2><p class="muted">${String(err.message || err)}</p><a class="btn btn-primary" href="#/">Về trang chủ</a></div>` };
    }
    // Dải mục "Học" trên điện thoại: Bài học · Từ vựng · Hội thoại · Đọc hiểu · Bộ thủ · Pinyin, một chạm là tới
    const learnKey = LEARN_OF[name] && !(name === "read" && parts[1]) ? LEARN_OF[name] : null;
    view.innerHTML = (learnKey ? learnNav(learnKey) : "") + r.html;
    if (r.after) r.after(view);
    // mục đang xem trong dải "Học" luôn nằm trong tầm nhìn
    const ln = view.querySelector(".learn-nav"), la = ln && ln.querySelector(".active");
    if (la && ln.scrollWidth > ln.clientWidth) ln.scrollLeft = la.offsetLeft - ln.offsetLeft - (ln.clientWidth - la.offsetWidth) / 2;
    fitTabs(view);
    shortenSubtitle(view);
    window.scrollTo(0, 0);
    const sideKey = SIDE_OF[name] || "/" + name;
    document.querySelectorAll("[data-route]").forEach((a) => {
      const on = a.dataset.route === sideKey;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const tab = TAB_OF[name] || "more";
    document.querySelectorAll(".tabbar [data-tab]").forEach((a) => a.classList.toggle("active", a.dataset.tab === tab));
    const h1 = view.querySelector("h1");
    document.title = (h1 && name ? h1.textContent.trim() + " · " : "") + "Nǐ hǎo – Học tiếng Trung từ số 0";
    App.updateBadge();
  }

  // Đoạn giới thiệu dài: giữ câu đầu, phần còn lại gập vào "Xem thêm" để trang thoáng hơn
  function shortenSubtitle(root) {
    const p = root.querySelector(":scope > p.subtitle");
    if (!p || p.textContent.length < 170) return;
    const nodes = [...p.childNodes];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.nodeType !== 3) continue;
      const m = n.data.search(/\.\s/);
      if (m < 0) continue;
      const rest = n.data.slice(m + 2);
      if (p.textContent.length - (p.textContent.indexOf(n.data) + m) < 60) return;
      n.data = n.data.slice(0, m + 1);
      const d = document.createElement("details");
      d.className = "hint";
      d.innerHTML = `<summary>${ic("info")}Xem thêm</summary>`;
      d.append(rest, ...nodes.slice(i + 1));
      p.after(d);
      return;
    }
  }

  // Dải tab quá dài thì cuộn ngang: làm mờ mép phải và đưa tab đang chọn vào giữa
  function fitTabs(root) {
    root.querySelectorAll(".tabs").forEach((t) => {
      const upd = () => {
        const sc = t.scrollWidth > t.clientWidth + 2;
        t.classList.toggle("scrollable", sc);
        t.classList.toggle("at-end", !sc || t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
      };
      if (!t._fit) {
        t._fit = true;
        t.addEventListener("scroll", upd, { passive: true });
        const a = t.querySelector(".active");
        if (a && t.scrollWidth > t.clientWidth) t.scrollLeft = a.offsetLeft - t.offsetLeft - (t.clientWidth - a.offsetWidth) / 2;
      }
      upd();
    });
  }
  addEventListener("resize", () => fitTabs(view));
  // các trang tự vẽ lại một phần (đổi tab trong trang) cũng cần kiểm tra lại
  let fitRaf = 0;
  new MutationObserver(() => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(() => fitTabs(view)); }).observe(view, { childList: true, subtree: true });

  function updateBadge() {
    const n = SRS.dueIds().length;
    document.querySelectorAll("[data-due]").forEach((b) => { b.textContent = n > 99 ? "99+" : n; b.classList.toggle("zero", n === 0); });
  }

  // Chế độ tập trung: ẩn thanh điều hướng điện thoại khi ôn thẻ / làm đề
  function setFocus(on) { document.body.classList.toggle("focus-mode", !!on); }

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    Store.state.settings.theme = t; Store.save();
    const dark = t === "dark";
    document.querySelectorAll(".theme-toggle use").forEach((u) => u.setAttribute("href", dark ? "#i-sun" : "#i-moon"));
    const lbl = document.querySelector("#theme-toggle span");
    if (lbl) lbl.textContent = dark ? "Giao diện sáng" : "Giao diện tối";
    // màu thanh trạng thái theo giao diện đang chọn (có thể khác giao diện của hệ điều hành)
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => (m.content = dark ? "#141210" : "#f7f5f1"));
  }

  function setZh(size) {
    document.documentElement.dataset.zh = size || "normal";
    Store.state.settings.zhSize = size || "normal"; Store.save();
  }

  window.App = { route, updateBadge, setTheme, setZh, setFocus, keyHandler: null };

  // init
  setTheme(Store.state.settings.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  setZh(Store.state.settings.zhSize);
  document.querySelectorAll(".theme-toggle").forEach((b) => b.onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  document.getElementById("more-btn").onclick = () => UI.openSheet();
  document.getElementById("sheet-backdrop").onclick = () => UI.closeSheet();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("sheet").classList.contains("open")) { UI.closeSheet(); return; }
    if (App.keyHandler) App.keyHandler(e);
  });
  Practice.initMenu();
  window.addEventListener("hashchange", route);
  if (!location.hash) location.hash = "#/";
  route();
})();
