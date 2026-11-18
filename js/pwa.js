// PWA: đăng ký service worker, báo có bản mới, nút "Cài ứng dụng" trong trang Cài đặt, gợi ý cho iOS
(function () {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let deferred = null; // sự kiện beforeinstallprompt để gọi lại khi người dùng bấm nút
  let reg = null;
  let reloading = false;
  let askedReload = false;

  // Thông báo kèm nút hành động (dùng lại toast(); đổi nhãn nút "Hoàn tác" và giữ lâu hơn)
  function actionToast(msg, label, fn) {
    if (typeof window.toast !== "function") return;
    toast(msg, { type: "info", undo: fn });
    const btn = document.querySelector("#toast .toast-undo");
    if (btn) btn.textContent = label;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => document.getElementById("toast").classList.remove("show"), 15000);
  }

  function applyUpdate() {
    const waiting = reg && reg.waiting;
    if (waiting) { askedReload = true; waiting.postMessage({ type: "SKIP_WAITING" }); }
    else location.reload();
  }

  function promptUpdate() {
    actionToast("Đã có phiên bản mới của Nǐ hǎo.", "Tải lại", applyUpdate);
  }

  function watchWorker(w) {
    if (!w) return;
    w.addEventListener("statechange", () => {
      // Chỉ báo khi đã có bản cũ đang chạy (lần cài đầu tiên thì không)
      if (w.state === "installed" && navigator.serviceWorker.controller) promptUpdate();
    });
  }

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((r) => {
        reg = r;
        if (r.waiting && navigator.serviceWorker.controller) promptUpdate();
        if (r.installing) watchWorker(r.installing);
        r.addEventListener("updatefound", () => watchWorker(r.installing));
        // Kiểm tra bản mới khi quay lại ứng dụng sau một lúc
        document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") r.update().catch(() => {}); });
      }).catch((e) => console.warn("Không đăng ký được service worker:", e));
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Lần đầu SW mới "nhận" trang thì không tải lại; chỉ tải lại khi người dùng đã bấm "Tải lại"
      if (!askedReload) { renderCard(); return; }
      if (reloading) return;
      reloading = true;
      location.reload();
    });
    let notified = false;
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CONTENT_UPDATED" && !notified) { notified = true; promptUpdate(); }
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    renderCard();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    if (typeof window.toast === "function") toast("Đã cài Nǐ hǎo lên thiết bị");
    renderCard();
  });

  // ---------- Thẻ "Ứng dụng" trong trang Cài đặt ----------
  function cardBody() {
    const offline = navigator.serviceWorker && navigator.serviceWorker.controller
      ? "Đã lưu sẵn để dùng khi không có mạng. Chữ đã xem nét viết một lần cũng luyện được khi offline."
      : "Mở lại trang một lần khi có mạng để lưu sẵn dùng offline.";
    let action;
    if (standalone()) action = `<p class="small muted">Bạn đang dùng Nǐ hǎo như một ứng dụng đã cài.</p>`;
    else if (deferred) action = `<div class="row"><button class="btn btn-primary" id="pwa-install" type="button">⬇ Cài ứng dụng</button></div>`;
    else if (isIOS) action = `<p class="small">Trên iPhone/iPad: mở bằng <b>Safari</b>, bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên lên) rồi chọn <b>Thêm vào MH chính</b> (Add to Home Screen).</p>`;
    else action = `<p class="small muted">Trên Chrome hoặc Edge: mở menu trình duyệt và chọn <b>Cài đặt ứng dụng</b> / <b>Thêm vào màn hình chính</b>. Nếu không thấy, có thể ứng dụng đã được cài.</p>`;
    return `<h3 style="margin-top:0">Ứng dụng</h3><p class="small muted">${offline}</p>${action}`;
  }

  function renderCard() {
    const view = document.getElementById("view");
    if (!view || !/^#\/settings\/?$/.test(location.hash)) return;
    let card = document.getElementById("pwa-card");
    if (!card) {
      if (!view.querySelector(".card")) return; // trang Cài đặt chưa vẽ xong
      card = document.createElement("div");
      card.className = "card mt";
      card.id = "pwa-card";
      const cards = view.querySelectorAll(".card");
      const last = cards[cards.length - 1];
      // Đặt trước thẻ cuối ("Về Nǐ hǎo"), nếu chỉ có một thẻ thì đặt sau nó
      if (cards.length > 1) last.before(card); else last.after(card);
    }
    card.innerHTML = cardBody();
    const btn = card.querySelector("#pwa-install");
    if (btn) btn.onclick = async () => {
      if (!deferred) return;
      const ev = deferred;
      deferred = null;
      ev.prompt();
      try { await ev.userChoice; } catch (e) { /* bỏ qua */ }
      renderCard();
    };
  }

  // App vẽ lại #view mỗi lần đổi trang -> theo dõi để chèn thẻ vào trang Cài đặt
  function startObserver() {
    const view = document.getElementById("view");
    if (!view) return;
    new MutationObserver(() => { if (!document.getElementById("pwa-card")) renderCard(); }).observe(view, { childList: true });
    renderCard();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startObserver);
  else startObserver();
})();
