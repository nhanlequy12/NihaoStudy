// Bộ định tuyến hash và khởi tạo ứng dụng
(function () {
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const name = parts[0] || "";
    App.keyHandler = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
    let r;
    switch (name) {
      case "": r = Views.home(); break;
      case "roadmap": r = Views.roadmap(); break;
      case "pinyin": r = Views.pinyin(parts[1]); break;
      case "radicals": r = Views.radicals(); break;
      case "lessons": r = Views.lessons(parts[1]); break;
      case "lesson": r = Views.lesson(parts[1], parts[2]); break;
      case "review": r = Views.review(); break;
      case "write": r = Views.write(parts[1], parts[2]); break;
      case "read": r = parts[1] ? Views.reading(parts[1]) : Views.readList(); break;
      case "speak": r = Views.speak(); break;
      case "dictionary": r = Views.dictionary(); break;
      case "settings": r = Views.settings(); break;
      default: r = { html: `<div class="card center"><h2>Không tìm thấy trang</h2><a class="btn btn-primary" href="#/">Về trang chủ</a></div>` };
    }
    view.innerHTML = r.html;
    if (r.after) r.after(view);
    window.scrollTo(0, 0);
    nav.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.dataset.route === "/" + (name === "lesson" ? "lessons" : name)));
    nav.classList.remove("open");
    App.updateBadge();
  }

  function updateBadge() {
    const b = document.getElementById("due-badge");
    const n = SRS.dueIds().length;
    b.textContent = n; b.classList.toggle("zero", n === 0);
  }

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    Store.state.settings.theme = t; Store.save();
  }

  window.App = { route, updateBadge, setTheme, keyHandler: null };

  // init
  setTheme(Store.state.settings.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  document.getElementById("theme-toggle").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  document.getElementById("menu-toggle").onclick = () => nav.classList.toggle("open");
  document.addEventListener("keydown", (e) => { if (App.keyHandler) App.keyHandler(e); });
  window.addEventListener("hashchange", route);
  if (!location.hash) location.hash = "#/";
  route();
})();
