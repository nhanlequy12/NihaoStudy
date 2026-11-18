// Service worker của Nǐ hǎo: dùng được khi không có mạng sau lần mở đầu tiên.
// - Lúc cài: đọc index.html, lấy mọi <script src> và <link href> rồi lưu sẵn (không cần danh sách tay).
// - Tệp cùng nguồn: lấy từ bộ nhớ đệm trước, đồng thời tải bản mới ở nền (stale-while-revalidate).
// - Điều hướng (mở trang): trả index.html trong bộ nhớ đệm khi mất mạng.
// - CDN (Hanzi Writer, dữ liệu nét chữ, Google Fonts): lưu khi dùng, để chữ đã xem vẫn luyện viết được khi offline.
// Đổi VERSION khi sửa chính tệp này (hoặc muốn ép tải lại toàn bộ); nội dung js/css tự cập nhật qua stale-while-revalidate.
const VERSION = "v1";
const SHELL = "nihao-shell-" + VERSION;
const CDN = "nihao-cdn-v1"; // giữ qua các phiên bản: tệp CDN đều có số phiên bản cố định
const KEEP = [SHELL, CDN];

const SCOPE = self.registration.scope; // vd. https://nhanlequy12.github.io/NihaoStudy/
const INDEX = new URL("index.html", SCOPE).href;
const FIXED = ["index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/icon.svg", "icons/apple-touch-icon.png"]
  .map((p) => new URL(p, SCOPE).href);
// Chỉ lưu CDN trong danh sách này (không bao giờ lưu API, đăng nhập...)
const CDN_HOSTS = ["cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com", "cdnjs.cloudflare.com"];

const inScope = (url) => url.startsWith(SCOPE);
const isCdn = (u) => CDN_HOSTS.includes(u.hostname);

// Lấy mọi đường dẫn <script src> và <link href> (trừ preconnect/dns-prefetch) trong index.html
function assetsFromHtml(html) {
  const out = new Set();
  const tagRe = /<(script|link)\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const tag = m[0];
    const rel = (tag.match(/\brel\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || "";
    if (/preconnect|dns-prefetch/i.test(rel)) continue;
    const attr = m[1].toLowerCase() === "script" ? "src" : "href";
    const v = (tag.match(new RegExp("\\b" + attr + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)')", "i")) || []);
    const val = v[2] || v[3];
    if (!val || /^data:/i.test(val)) continue;
    try { out.add(new URL(val.replace(/&amp;/g, "&"), INDEX).href); } catch (e) { /* bỏ qua */ }
  }
  return [...out];
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    const cdn = await caches.open(CDN);
    const res = await fetch(INDEX, { cache: "reload" });
    if (!res.ok) throw new Error("Không tải được index.html");
    const html = await res.clone().text();
    await shell.put(INDEX, res);
    const urls = new Set([...FIXED, ...assetsFromHtml(html)]);
    urls.delete(INDEX);
    const jobs = [...urls].map(async (url) => {
      const u = new URL(url);
      if (inScope(url)) {
        const r = await fetch(url, { cache: "reload" });
        if (r.ok) await shell.put(url, r);
      } else if (isCdn(u) && !(await cdn.match(url))) {
        // <script>/<link> không có crossorigin -> tải kiểu no-cors cho khớp với cách trang yêu cầu
        const r = await fetch(new Request(url, { mode: "no-cors" }));
        if (r.ok || r.type === "opaque") await cdn.put(url, r);
      }
    });
    // Một tệp lỗi không làm hỏng cả lần cài; index.html thì bắt buộc (đã kiểm ở trên)
    await Promise.allSettled(jobs);
  })());
  // Lần cài đầu tiên: không có bản cũ nên tự kích hoạt. Bản cập nhật: chờ người dùng bấm "Tải lại".
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("nihao-") && !KEEP.includes(k)).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.disable(); } catch (e) { /* không sao */ } }
    await self.clients.claim(); // trang đang mở cũng đi qua SW ngay, để lưu được dữ liệu nét chữ và font
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// So sánh phiên bản hai phản hồi để biết nội dung trên máy chủ đã đổi
function changed(a, b) {
  for (const h of ["last-modified", "etag", "content-length"]) {
    const x = a.headers.get(h), y = b.headers.get(h);
    if (x && y) return x !== y;
  }
  return false;
}

let notifyTimer = null;
function notifyUpdated() {
  clearTimeout(notifyTimer);
  notifyTimer = setTimeout(async () => {
    const list = await self.clients.matchAll({ type: "window" });
    list.forEach((c) => c.postMessage({ type: "CONTENT_UPDATED" }));
  }, 1500);
}

// Tải bản mới ở nền rồi ghi đè vào bộ nhớ đệm
async function revalidate(cacheKey, request, cached) {
  try {
    const fresh = await fetch(request, { cache: "no-cache" });
    if (!fresh.ok) return fresh;
    const cache = await caches.open(SHELL);
    await cache.put(cacheKey, fresh.clone());
    if (cached && changed(cached, fresh) && /\.(html|js|css)$|\/$/.test(new URL(cacheKey).pathname)) notifyUpdated();
    return fresh;
  } catch (e) {
    return null;
  }
}

async function staleWhileRevalidate(event, cacheKey, request) {
  const cached = await caches.match(cacheKey, { ignoreVary: true });
  const net = revalidate(cacheKey, request, cached);
  if (cached) { event.waitUntil(net); return cached; }
  const fresh = await net;
  if (fresh) return fresh;
  return Response.error();
}

async function handleNavigate(event, url) {
  const path = url.origin + url.pathname;
  if (path === SCOPE || path === INDEX) {
    // Trang chính của ứng dụng (định tuyến bằng #): mở ngay từ bộ nhớ đệm
    const cached = await caches.match(INDEX);
    const net = revalidate(INDEX, new Request(INDEX), cached);
    if (cached) { event.waitUntil(net); return cached; }
    return (await net) || new Response("Không có mạng", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  // Trang khác trong phạm vi: ưu tiên mạng, mất mạng thì dùng bản đã lưu hoặc index.html
  try {
    const fresh = await fetch(event.request);
    if (fresh.ok) { const c = await caches.open(SHELL); event.waitUntil(c.put(path, fresh.clone())); }
    return fresh;
  } catch (e) {
    return (await caches.match(path)) || (await caches.match(INDEX)) || Response.error();
  }
}

async function cdnFirst(event, request, url) {
  const cache = await caches.open(CDN);
  const cached = await cache.match(request, { ignoreVary: true });
  // CSS của Google Fonts có thể đổi theo thời gian -> làm mới ở nền; còn lại có phiên bản cố định -> chỉ lấy từ đệm
  const refresh = async () => {
    const r = await fetch(request);
    if (r.ok || r.type === "opaque") await cache.put(request, r.clone());
    return r;
  };
  if (cached) {
    if (url.hostname === "fonts.googleapis.com") event.waitUntil(refresh().catch(() => {}));
    return cached;
  }
  try { return await refresh(); } catch (e) { return Response.error(); }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (req.mode === "navigate" && inScope(req.url)) {
    event.respondWith(handleNavigate(event, url));
    return;
  }
  if (inScope(req.url)) {
    if (url.pathname.endsWith("/sw.js")) return;
    // Bỏ ?query để khớp tệp đã lưu sẵn (vd. css/style.css?v=2)
    const key = url.origin + url.pathname;
    event.respondWith(staleWhileRevalidate(event, key, req));
    return;
  }
  if (isCdn(url)) event.respondWith(cdnFirst(event, req, url));
  // Mọi yêu cầu khác (API, trang ngoài...) để trình duyệt tự xử lý
});
