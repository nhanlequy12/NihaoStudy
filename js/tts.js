// Phát âm bằng Web Speech API (giọng zh-CN có sẵn trong Windows/Edge/Chrome) và nhận dạng giọng nói
(function () {
  let voices = [];
  function loadVoices() {
    voices = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter((v) => /^zh([-_]CN)?/i.test(v.lang) || /zh-CN|Chinese|普通话|中文/i.test(v.name + v.lang));
  }
  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice() {
    const want = Store.state.settings.voice;
    if (want) { const v = voices.find((x) => x.name === want); if (v) return v; }
    // ưu tiên giọng neural online của Edge, sau đó Google, sau đó bất kỳ zh-CN
    return voices.find((v) => /Xiaoxiao|Yunxi|Xiaoyi/i.test(v.name)) || voices.find((v) => /Google/i.test(v.name)) || voices.find((v) => /zh-CN/i.test(v.lang)) || voices[0] || null;
  }

  function speak(text, opts = {}) {
    if (!window.speechSynthesis) { toast("Trình duyệt không hỗ trợ phát âm"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = opts.rate != null ? opts.rate : Store.state.settings.rate || 0.85;
    u.pitch = 1;
    if (opts.onend) u.onend = opts.onend;
    speechSynthesis.speak(u);
    if (!v && !speak.warned) { speak.warned = true; toast("Chưa thấy giọng tiếng Trung, đang dùng giọng mặc định. Xem Cài đặt để biết cách thêm."); }
  }

  // Nhận dạng giọng nói (Chrome / Edge)
  function recognize(onResult, onError) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { onError && onError("Trình duyệt không hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome hoặc Edge."); return null; }
    const r = new SR();
    r.lang = "zh-CN"; r.interimResults = false; r.maxAlternatives = 3;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript);
      onResult(alts);
    };
    r.onerror = (e) => onError && onError(e.error === "not-allowed" ? "Bạn cần cho phép dùng micro." : "Lỗi nhận dạng: " + e.error);
    r.start();
    return r;
  }

  window.TTS = { speak, recognize, get voices() { return voices; }, pickVoice };
})();
