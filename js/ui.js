// Thành phần giao diện dùng chung: icon SVG, thông báo (toast) có Hoàn tác, hộp thoại xác nhận, bảng "Thêm" trên điện thoại.
(function () {
  // Icon nét mảnh 24×24 (vẽ riêng cho Nǐ hǎo), dùng qua <use href="#i-tên">
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/><path d="M8 7h8"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5"/><path d="M4 20v-4.5h4.5"/>',
    pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    exam: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    map: '<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    pinyin: '<path d="M4 18 8.5 6h1L14 18"/><path d="M5.8 14h6.4"/><path d="M15 10h5M17.5 7.5v10"/>',
    radical: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    read: '<path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    next: '<path d="m9 5 7 7-7 7"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    words: '<path d="M4 6h16M4 12h10M4 18h7"/><path d="m16 15 2 2 3.5-4"/>',
    flame: '<path d="M12 21c-4 0-7-2.8-7-6.5 0-4 3-6 4-9.5 2 1.5 3 3.5 3 5.5 1-.8 1.8-2 2-3.5 2.5 2 5 4.5 5 7.5 0 3.7-3 6.5-7 6.5z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    bubbles: '<circle cx="9" cy="14" r="5.5"/><circle cx="17" cy="7" r="3.5"/><path d="M7 12.5a2.5 2.5 0 0 1 2-1.5"/>',
    translate: '<path d="M3 5h9M7.5 3v2M5 5c.5 3 2.5 5.5 5.5 7M10 5c-.7 3.5-3 6.5-6 8"/><path d="m13 21 4-10 4 10M14.5 17.5h5"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.5"/>',
    sort: '<path d="M4 7h10M4 12h7M4 17h4"/><path d="M18 5v14M15 16l3 3 3-3"/>',
    bug: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    blank: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 14h4M14 14h3"/><path d="M7 10h10" stroke-dasharray="2 2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    notebook: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18M12 8h4M12 12h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 21h7M10 17h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    soundon: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/>',
    soundoff: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  };
  const sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sprite.setAttribute("aria-hidden", "true");
  sprite.style.display = "none";
  sprite.innerHTML = Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join("");
  document.body.prepend(sprite);

  window.ic = (name, cls = "") => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

  // ---------- Toast: thông báo ngắn, có thể kèm nút Hoàn tác ----------
  const host = document.getElementById("toast");
  host.setAttribute("role", "status");
  host.setAttribute("aria-live", "polite");
  window.toast = function (msg, opts = {}) {
    const type = opts.type || (/không hỗ trợ|không tải được|không hợp lệ|lỗi/i.test(msg) ? "error" : /hết giờ|bắt đầu|chưa thấy|hết từ/i.test(msg) ? "info" : "success");
    const icon = { success: "check", error: "alert", info: "info" }[type];
    host.className = `toast ${type}`;
    host.innerHTML = `${ic(icon)}<span>${String(msg).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))}</span>${opts.undo ? `<button class="toast-undo">Hoàn tác</button>` : ""}`;
    if (opts.undo) host.querySelector(".toast-undo").onclick = () => { opts.undo(); host.classList.remove("show"); };
    requestAnimationFrame(() => host.classList.add("show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => host.classList.remove("show"), opts.undo ? 5000 : 2600);
  };

  // ---------- Hộp thoại xác nhận (thay cho confirm() của trình duyệt) ----------
  window.uiConfirm = function (message, opts = {}) {
    return new Promise((resolve) => {
      const back = document.createElement("div");
      back.className = "dialog-backdrop";
      back.innerHTML = `<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t">
        <div class="dialog-ic ${opts.danger ? "danger" : ""}">${ic(opts.danger ? "alert" : "info")}</div>
        <h3 id="dlg-t">${opts.title || "Xác nhận"}</h3><p>${message}</p>
        <div class="dialog-actions"><button class="btn" data-v="0">${opts.cancelText || "Huỷ"}</button><button class="btn ${opts.danger ? "btn-danger" : "btn-primary"}" data-v="1">${opts.okText || "Đồng ý"}</button></div></div>`;
      const close = (v) => { back.classList.remove("show"); setTimeout(() => back.remove(), 160); document.removeEventListener("keydown", onKey, true); resolve(v); };
      const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); close(false); } };
      back.addEventListener("click", (e) => { if (e.target === back) close(false); });
      back.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => close(b.dataset.v === "1"));
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(back);
      requestAnimationFrame(() => back.classList.add("show"));
      back.querySelector('[data-v="1"]').focus();
    });
  };

  // ---------- Bảng "Thêm" (điện thoại) ----------
  const sheet = document.getElementById("sheet"), backdrop = document.getElementById("sheet-backdrop");
  window.UI = {
    openSheet() { sheet.style.transform = ""; backdrop.style.opacity = ""; sheet.classList.add("open"); backdrop.classList.add("open"); },
    closeSheet() { sheet.style.transform = ""; backdrop.style.opacity = ""; sheet.classList.remove("open"); backdrop.classList.remove("open"); },
  };

  // Vuốt xuống để đóng bảng "Thêm": bảng bám theo ngón tay, nền mờ nhạt dần theo quãng kéo;
  // thả ra thì đóng nếu kéo quá 30% chiều cao hoặc vuốt nhanh, không thì bật về.
  let sg = null;
  sheet.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || !sheet.classList.contains("open")) return;
    // chỉ bắt đầu kéo khi nội dung đang ở đầu (không giành cử chỉ cuộn)
    if (sheet.scrollTop > 0 && !e.target.closest(".sheet-handle")) return;
    sg = { id: e.pointerId, y: e.clientY, x: e.clientX, dy: 0, on: false, h: sheet.offsetHeight, lastY: e.clientY, lastT: performance.now(), v: 0 };
  });
  sheet.addEventListener("pointermove", (e) => {
    if (!sg || e.pointerId !== sg.id) return;
    const dy = e.clientY - sg.y;
    if (!sg.on) {
      if (dy < 8 || Math.abs(e.clientX - sg.x) > Math.abs(dy)) { if (dy < -4 || Math.abs(e.clientX - sg.x) > 10) sg = null; return; }
      sg.on = true; sheet.classList.add("dragging"); backdrop.style.transition = "none"; try { sheet.setPointerCapture(sg.id); } catch (err) {}
    }
    const now = performance.now();
    sg.v = (e.clientY - sg.lastY) / Math.max(1, now - sg.lastT); sg.lastY = e.clientY; sg.lastT = now;
    sg.dy = Math.max(0, dy);
    sheet.style.transform = `translate3d(0, ${sg.dy}px, 0)`;
    backdrop.style.opacity = String(1 - Math.min(1, sg.dy / sg.h));
  });
  const endSheet = (e) => {
    if (!sg || e.pointerId !== sg.id) return;
    const st = sg; sg = null;
    if (!st.on) return;
    sheet.classList.remove("dragging"); backdrop.style.transition = "";
    // chặn cú bấm nhầm vào ô vừa nhả tay
    const stop = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
    sheet.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => sheet.removeEventListener("click", stop, { capture: true }), 0);
    if (st.dy > st.h * 0.3 || st.v > 0.5) UI.closeSheet();
    else { sheet.style.transform = ""; backdrop.style.opacity = ""; }
  };
  sheet.addEventListener("pointerup", endSheet);
  sheet.addEventListener("pointercancel", endSheet);
})();
