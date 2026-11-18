// Luyện tập: Cặp thanh điệu – nghe máy đọc một từ hai âm tiết rồi chọn cặp thanh của nó (vd «2 + 3»).
// Người Việt hay lẫn thanh 2 ↔ 3 và 1 ↔ 4 khi hai thanh đi liền nhau, nên phương án nhiễu được chọn đúng theo các cặp dễ lẫn.
// Ma trận 20 cặp (thanh 1–4 × thanh 1–4 + nhẹ) ghi tỉ lệ đúng của từng cặp; chế độ «Luyện cặp yếu» ưu tiên các cặp sai nhiều.
//
// Quy ước: phương án ghi THANH GỐC (như từ điển). Riêng 3 + 3 khi nói thành 2 + 3 nên phương án có ghi chú «đọc như 2 + 3»
// và hai cặp 3 + 3 / 2 + 3 không bao giờ cùng xuất hiện trong một câu (nghe không phân biệt được).
// Lọc từ để máy đọc không sai (xem docs/kiem-tra-luyen-tap-9-cap-thanh.md):
//   – đúng 2 chữ Hán, pinyin tách được đúng 2 âm tiết; bỏ từ có 一 / 不 (biến điệu) và 儿 (nhi hoá);
//   – bỏ từ có chữ đa âm (POLY: chữ có hơn một cách đọc khác âm hoặc khác thanh trong từ vựng HSK / CC-CEDICT);
//   – bỏ từ mà các nguồn ghi thanh khác nhau (SKIP_D, thường là thanh nhẹ có/không), từ có âm tiết đầu thanh nhẹ,
//     và 3 + nhẹ khi chữ sau vốn thanh 3 (SKIP_B3: 小姐 có người đọc xiáojie).
(function () {
  const { esc, pyHtml, speakBtn, bindSpeak, shuffle } = Views.util;
  const P = () => window.Practice;
  const KEY = "tones";
  const SLOW = 0.55;
  const L4 = "ABCD";

  // ---------- Pinyin → âm tiết + thanh ----------
  // Bảng âm tiết chuẩn (không gồm m, n, ng, hm, hng – chỉ nhận khi đứng một mình)
  const STD_SYL = "a ai an ang ao e ei en eng er o ou ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu fa fan fang fei fen feng fo fou fu da dai dan dang dao de dei den deng di dia dian diao die ding diu dong dou du duan dui dun duo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nuo nü nüe la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lü lüe ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ka kai kan kang kao ke kei ken keng kong kou ku kua kuai kuan kuang kui kun kuo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun zhi zha zhai zhan zhang zhao zhe zhei zhen zheng zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo chi cha chai chan chang chao che chen cheng chong chou chu chua chuai chuan chuang chui chun chuo shi sha shai shan shang shao she shei shen sheng shou shu shua shuai shuan shuang shui shun shuo ri ran rang rao re ren reng rong rou ru rua ruan rui run ruo zi za zai zan zang zao ze zei zen zeng zong zou zu zuan zui zun zuo ci ca cai can cang cao ce cen ceng cong cou cu cuan cui cun cuo si sa sai san sang sao se sen seng song sou su suan sui sun suo ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun wa wai wan wang wei wen weng wo wu".split(" ");
  let VALID = null;
  const valid = () => VALID || (VALID = new Set(STD_SYL.concat((window.SYLLABLES || []).map((r) => r[0])).filter((s) => !/^(m|n|ng|hm|hng)$/.test(s))));
  const SOLO = new Set(["m", "n", "ng", "hm", "hng", "ê"]);
  const MARK = {};
  "āáǎà|ēéěè|īíǐì|ōóǒò|ūúǔù|ǖǘǚǜ".split("|").forEach((g, i) => [...g].forEach((c, t) => (MARK[c] = ["a", "e", "i", "o", "u", "ü"][i] + (t + 1))));
  MARK["ń"] = "n2"; MARK["ň"] = "n3"; MARK["ǹ"] = "n4";

  // Một cụm không dấu cách → mọi cách tách thành âm tiết hợp lệ (tối đa vài cách, để phát hiện mơ hồ)
  function chunkSegs(chunk) {
    let letters = "";
    const tone = {};
    for (const c of chunk) {
      if (MARK[c]) { letters += MARK[c][0]; tone[letters.length - 1] = +MARK[c][1]; }
      else if (/[a-zü]/.test(c)) letters += c;
      else return null;
    }
    if (SOLO.has(letters)) return [[{ s: letters, t: Object.values(tone)[0] || 5 }]];
    const V = valid(), out = [];
    (function rec(i, acc) {
      if (out.length > 3) return;
      if (i === letters.length) { out.push(acc); return; }
      for (let L = Math.min(6, letters.length - i); L >= 1; L--) {
        let s = letters.slice(i, i + L), r = false;
        if (!V.has(s)) {
          // âm cuối có -r (nhi hoá): nǎr, yìdiǎnr
          if (i + L === letters.length && L > 1 && s.endsWith("r") && V.has(s.slice(0, -1))) { s = s.slice(0, -1); r = true; }
          else continue;
        }
        if (i > 0 && /^[aoe]/.test(s)) continue;            // âm tiết bắt đầu bằng a/o/e phải có ' hoặc dấu cách đứng trước
        const ts = Object.keys(tone).map(Number).filter((k) => k >= i && k < i + L);
        if (ts.length > 1) continue;                          // mỗi âm tiết một dấu thanh
        const syl = { s, t: ts.length ? tone[ts[0]] : 5 };
        if (r) syl.r = true;
        rec(i + L, acc.concat(syl));
      }
    })(0, []);
    return out;
  }
  // "běifāng" → [{s:"bei",t:3},{s:"fang",t:1}]; null nếu không tách được hoặc tách được nhiều cách
  function parse(py) {
    const s = String(py || "").normalize("NFC").toLowerCase().replace(/u:/g, "ü").replace(/v/g, "ü").trim();
    if (!s) return null;
    let res = [];
    for (const chunk of s.split(/[\s'’\-]+/).filter(Boolean)) {
      const segs = chunkSegs(chunk);
      if (!segs || segs.length !== 1) return null;
      res = res.concat(segs[0]);
    }
    return res;
  }

  // ---------- Lọc từ an toàn cho máy đọc ----------
  // Sinh từ dữ liệu web + data/hsk/all-words.json (CC-CEDICT) – xem tài liệu kiểm tra. Chữ đa âm:
  const POLY = new Set("好吗不没系呢的中识兴一几少那分喝同看会服漂大哪觉作喂都和了给间正要还色便得长累教答乐别行为着结鲜发刷干扫空调地相片草角种板数通提担难解啊差重把据只更当应亲咱散弹血脏度处折价免卡赚省传假凉压仔量划供降禁切将稍尽与俩称喷晕炸臭档叉扇夹舍落露属载率占转卷强采创炮待朝藏挣涨糊吓倒摸挡吐冲劲模斗挑似佛俊背薄横歪恶令曾宁圈唉哈乙唯嗯哄磨挨奔晃磕溜扒搁拧劈抹扎拽症盛嚼咽削铺缝钻凹扁侧塞刹泥泊曲淋笼畜逮勾剥埋蒙杆踏倔伺闷撒仇蔓钉甭哦咋龟勒尿卜掺绷扳呛揣抡豁驮咧轴锯屯");
  // Nguồn ghi thanh khác nhau (web ↔ HSK/CC-CEDICT), thường là thanh nhẹ có/không: máy có thể đọc khác pinyin trên web
  const SKIP_D = new Set("学生 东西 后面 小姐 妻子 告诉 照顾 聪明 太阳 故事 孙子 味道 起来 精神 狮子 活泼 熟悉 刚刚 生意 棉花 位置 管子 学问 费用 小气 道理 逻辑 老婆 夫人 媳妇 拳头 出息 薪水 势力 书记 队伍 格式 公道 固执 本事 迷惑 动静 人家 回来 下来 回去 网上 心里 留下 早晨 老是 月饼 买卖 玫瑰 口袋 工夫 尺寸 金子 名气 外甥".split(" "));
  // 3 + nhẹ mà chữ sau vốn thanh 3: có từ đọc thành 2 + nhẹ (小姐 xiáojie), có từ không (姐姐) → bỏ hết cho chắc
  const SKIP_B3 = new Set("椅子 姐姐 奶奶 耳朵 饺子 马虎 姥姥 嗓子 尺子 影子 嫂子 指甲 本子 脑子 稿子".split(" "));
  const HAN = /^[\u3400-\u9fff]$/;

  // Lý do loại một từ (null = dùng được)
  function reasonOf(w) {
    const ch = [...String(w.hz || "")];
    if (ch.length !== 2 || !ch.every((c) => HAN.test(c))) return "len";
    if (/[一不]/.test(w.hz)) return "yibu";
    if (w.hz.includes("儿")) return "er";
    const p = parse(w.py);
    if (!p || p.length !== 2 || p.some((x) => x.r)) return "parse";
    if (ch.some((c) => POLY.has(c))) return "poly";
    if (p[0].t === 5) return "n1";
    if (SKIP_D.has(w.hz)) return "disp";
    if (SKIP_B3.has(w.hz)) return "b3";
    return null;
  }
  function itemOf(w) {
    if (reasonOf(w)) return null;
    const p = parse(w.py);
    return { w, a: p[0].t, b: p[1].t, key: `${p[0].t}-${p[1].t}` };
  }
  const cache = {};
  function poolOf(std, level) {
    const k = std + level;
    if (!cache[k]) {
      const seen = new Set();
      cache[k] = P().wordsOf(std, level).map(itemOf).filter((x) => x && !seen.has(x.w.hz) && seen.add(x.w.hz));
    }
    return cache[k];
  }

  // ---------- Cặp thanh và phương án nhiễu ----------
  const PAIRS = [];
  for (let a = 1; a <= 4; a++) for (let b = 1; b <= 5; b++) PAIRS.push(`${a}-${b}`);
  const MA = ["mā", "má", "mǎ", "mà", "ma"];
  const tName = (t) => (t === 5 ? "nhẹ" : String(t));
  const pairText = (a, b) => `${a} + ${tName(b)}`;
  const isSandhi = (a, b) => a === 3 && b === 3;
  function pairHtml(a, b) {
    return `<span class="tp-pair"><b>${pairText(a, b)}</b><span class="tp-ma"><span class="t${a}">${MA[a - 1]}</span> <span class="t${b}">${MA[b - 1]}</span></span>${isSandhi(a, b) ? `<span class="tp-note">đọc như 2 + 3</span>` : ""}</span>`;
  }
  // Các thanh dễ lẫn với từng thanh, theo thứ tự ưu tiên (người Việt: 2 ↔ 3, 1 ↔ 4)
  const CONF1 = { 1: [4, 2, 3], 2: [3, 1, 4], 3: [2, 4, 1], 4: [1, 3, 2] };
  const CONF2 = { 1: [4, 5, 2, 3], 2: [3, 1, 5, 4], 3: [2, 4, 5, 1], 4: [1, 3, 5, 2], 5: [1, 4, 2, 3] };
  // 3 + 3 nghe như 2 + 3: không để hai cặp này cùng là phương án
  const clash = (x, y) => (x === "3-3" && y === "2-3") || (x === "2-3" && y === "3-3");
  // 4 phương án {a, b, key, ok}; rnd: hàm ngẫu nhiên [0,1)
  function optionsOf(item, rnd = Math.random) {
    const { a, b } = item;
    const near = [], far = [];
    const push = (list, x, y) => { const k = `${x}-${y}`; if (k !== item.key && !clash(item.key, k) && !near.concat(far).some((o) => o.key === k)) list.push({ a: x, b: y, key: k, ok: false }); };
    // đổi một âm tiết sang thanh dễ lẫn nhất, rồi đổi cả hai, rồi các thanh còn lại
    push(near, CONF1[a][0], b); push(near, a, CONF2[b][0]); push(near, CONF1[a][0], CONF2[b][0]);
    push(near, CONF1[a][1], b); push(near, a, CONF2[b][1]);
    CONF1[a].forEach((x) => CONF2[b].forEach((y) => push(far, x, y)));
    CONF2[b].forEach((y) => push(far, a, y));
    CONF1[a].forEach((x) => push(far, x, b));
    // 2 phương án lấy trong nhóm dễ lẫn nhất, 1 phương án ngẫu nhiên trong phần còn lại, để không đoán được theo khuôn
    const mix = (arr) => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    const pick = [], add = (o) => { if (pick.length < 3 && !pick.some((p) => clash(p.key, o.key))) pick.push(o); };
    const n = mix(near);
    n.slice(0, 2).forEach(add);
    mix(n.slice(2).concat(far)).forEach(add);
    return mix(pick.concat({ a, b, key: item.key, ok: true }));
  }

  // ---------- Thống kê theo cặp (dùng chung mọi cấp, vì đây là kỹ năng nghe) ----------
  function stats() {
    const p = P().pstate();
    if (!p.tonePairs) p.tonePairs = {};
    return p.tonePairs;
  }
  function bump(key, ok) {
    const s = stats();
    const v = s[key] || [0, 0];
    s[key] = [v[0] + (ok ? 1 : 0), v[1] + 1];
  }
  // Tỉ lệ đúng làm trơn (Laplace): cặp chưa luyện coi như 50%
  const accOf = (v) => ((v ? v[0] : 0) + 1) / ((v ? v[1] : 0) + 2);
  const weakness = (key) => { const x = 1 - accOf(stats()[key]); return x * x + 0.05; };

  function matrixHtml(pool) {
    const s = stats();
    const have = {};
    (pool || []).forEach((it) => (have[it.key] = (have[it.key] || 0) + 1));
    const cell = (a, b) => {
      const k = `${a}-${b}`, v = s[k];
      const pct = v && v[1] ? Math.round((v[0] / v[1]) * 100) : null;
      const cls = pct == null ? "" : pct >= 85 ? "good" : pct >= 60 ? "mid" : "bad";
      const tip = `${pairText(a, b)}: ${v && v[1] ? `đúng ${v[0]}/${v[1]}` : "chưa luyện"}${pool ? ` · cấp này có ${have[k] || 0} từ` : ""}`;
      return `<td class="tp-cell ${cls}" title="${esc(tip)}"><b>${pct == null ? "–" : pct + "%"}</b><small>${v && v[1] ? v[1] + " lần" : pool ? (have[k] || 0) + " từ" : ""}</small></td>`;
    };
    const weak = PAIRS.filter((k) => s[k] && s[k][1] >= 3).sort((x, y) => accOf(s[x]) - accOf(s[y])).slice(0, 3).filter((k) => s[k][0] / s[k][1] < 0.85);
    return `<div class="card mt tp-matrix-card"><h3 style="margin-top:0">${ic("target")} Ma trận 20 cặp thanh</h3>
      <p class="muted small" style="margin-top:0">Tỉ lệ đúng của từng cặp qua mọi lần luyện (hàng: thanh của âm tiết đầu, cột: âm tiết sau). Ô đỏ là cặp bạn hay nghe nhầm.</p>
      <div class="tp-scroll"><table class="tp-matrix"><thead><tr><th></th>${[1, 2, 3, 4, 5].map((b) => `<th><span class="t${b}">${MA[b - 1]}</span><br>${tName(b)}</th>`).join("")}</tr></thead>
      <tbody>${[1, 2, 3, 4].map((a) => `<tr><th><span class="t${a}">${MA[a - 1]}</span> ${a}</th>${[1, 2, 3, 4, 5].map((b) => cell(a, b)).join("")}</tr>`).join("")}</tbody></table></div>
      ${weak.length ? `<p class="small" style="margin-bottom:0">Cặp yếu nhất: ${weak.map((k) => `<b>${pairText(+k[0], +k[2])}</b> (${Math.round((s[k][0] / s[k][1]) * 100)}%)`).join(", ")}. Chọn «Luyện cặp yếu» để ưu tiên các cặp này.</p>` : `<p class="small muted" style="margin-bottom:0">Luyện mỗi cặp vài lần để ma trận chỉ ra cặp yếu.</p>`}
    </div>`;
  }

  // CSS riêng của bài (nhúng một lần, không cần thêm tệp .css)
  function css() {
    if (document.getElementById("tp-css")) return;
    const st = document.createElement("style");
    st.id = "tp-css";
    st.textContent = `.tp-pair{display:flex;flex-direction:column;align-items:flex-start;gap:2px}.tp-pair b{font-size:1.2rem}.tp-ma{font-size:.9rem;font-weight:600}.tp-note{font-size:.78rem;color:var(--muted)}
.options.tp-opts{grid-template-columns:repeat(2,minmax(0,1fr))}.tp-opt{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:14px 16px}.tp-word{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;text-align:center}
.tp-hz{font-family:var(--font-zh);font-size:2.6rem;line-height:1.2}.tp-hidden{color:var(--muted);font-size:.95rem}.tp-sub{margin-top:4px}
.tp-scroll{overflow-x:auto}.tp-matrix{border-collapse:separate;border-spacing:4px;margin:0 auto;font-size:.9rem}.tp-matrix th{font-weight:600;padding:2px 6px;text-align:center;white-space:nowrap}
.tp-cell{min-width:58px;padding:6px 4px;text-align:center;border-radius:8px;background:var(--surface-2);line-height:1.2}.tp-cell b{display:block}.tp-cell small{color:var(--muted);font-size:.72rem}
.tp-cell.good{background:var(--green-soft)}.tp-cell.mid{background:var(--gold-soft)}.tp-cell.bad{background:var(--danger-soft)}
.tp-contrast{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px}`;
    document.head.appendChild(st);
  }

  // ---------- Chọn câu cho một lượt ----------
  // mix: rải đều các cặp (không để 4 + 4 chiếm phần lớn); weak: bốc cặp theo trọng số «độ yếu»
  function pick(pool, count, mode) {
    const by = {};
    shuffle(pool).forEach((it) => (by[it.key] = by[it.key] || []).push(it));
    const out = [];
    while (out.length < count) {
      const keys = Object.keys(by).filter((k) => by[k].length);
      if (!keys.length) break;
      let k;
      if (mode === "weak") {
        const ws = keys.map(weakness), sum = ws.reduce((x, y) => x + y, 0);
        let r = Math.random() * sum, i = 0;
        while (i < keys.length - 1 && (r -= ws[i]) > 0) i++;
        k = keys[i];
      } else k = keys[Math.floor(Math.random() * keys.length)];
      out.push(by[k].shift());
    }
    return out;
  }

  // ---------- Màn chọn ----------
  function run(std, box) {
    App.setFocus(false);
    App.keyHandler = null;
    css();
    const levels = P().STD[std].levels.filter((l) => poolOf(std, l).length >= 4);
    if (!levels.length) { box.innerHTML = `<div class="card center empty"><h2>Chưa có từ luyện</h2></div>`; return; }
    const savedMode = (P().pstate().last || {}).toneMode === "weak" ? "weak" : "mix";
    P().setup(box, {
      std,
      levels,
      counts: [10, 20, 30],
      intro: "Nghe máy đọc một từ hai âm tiết rồi chọn cặp thanh của nó. Người Việt hay nhầm thanh 2 với 3 và thanh 1 với 4, nhất là khi hai thanh đi liền nhau.",
      extra: `<div class="setup-row"><div class="setup-label">Chế độ</div><div class="chips" data-name="mode">${[["mix", "Trộn đều các cặp"], ["weak", "Luyện cặp yếu"]].map(([v, t]) => `<button type="button" data-v="${v}" class="${v === savedMode ? "on" : ""}">${t}</button>`).join("")}</div></div>
        <details class="hint" style="margin:4px 0 0"><summary>${ic("info")}Độ khó và quy ước</summary><b>Dễ:</b> có chữ Hán, nghĩa và pinyin không dấu. <b>Vừa:</b> có chữ Hán và nghĩa. <b>Khó:</b> chỉ nghe, chữ hiện sau khi trả lời.<br>
        Phương án ghi thanh gốc như trong từ điển. Hai thanh 3 đi liền nhau thì thanh đầu đọc thành thanh 2, nên «3 + 3» luôn kèm ghi chú «đọc như 2 + 3». «Nhẹ» là thanh nhẹ (không dấu).<br>
        Chỉ dùng từ máy đọc chắc chắn đúng: bỏ từ có chữ nhiều âm đọc, từ có 一 / 不 (đổi thanh theo chữ sau) và từ có 儿.<br>
        Phím: <span class="kbd">1</span>–<span class="kbd">4</span> chọn · <span class="kbd">Space</span> nghe lại · <span class="kbd">Enter</span> câu tiếp.</details>`,
      bestKeyOf: (v) => `${KEY}:${std}:${v.level}:${v.diff}`,
      onStart: (v) => {
        const p = P().pstate(); p.last = p.last || {}; p.last.toneMode = v.mode; Store.save();
        const pool = poolOf(std, v.level);
        if (pool.length < 4) { toast("Cấp này chưa đủ từ để luyện"); return; }
        session(box, std, v, pick(pool, v.count, v.mode), pool);
      },
    });
    box.insertAdjacentHTML("beforeend", matrixHtml(null));
  }

  // ---------- Một lượt luyện ----------
  function session(box, std, cfg, items, pool) {
    App.setFocus(true);
    css();
    const t0 = Date.now();
    const easy = cfg.diff === "easy", hard = cfg.diff === "hard";
    const feat = P().feature(KEY);
    let i = 0, score = 0, right = 0;
    const wrong = [];
    const say = (text, rate) => TTS.speak(text, rate ? { rate } : {});
    const bare = (py) => String(py).normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC");
    const gloss = (w) => String(w.vi || "").split(/[;；]/)[0];

    function show() {
      if (i >= items.length) return finish();
      const it = items[i], w = it.w;
      const opts = optionsOf(it);
      box.innerHTML = `<div class="tr-progress"><div class="row between small muted"><span>Câu ${i + 1}/${items.length}</span><span>${score} điểm</span></div><div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div></div>
        <div class="card">
          <div class="tp-word" id="tp-word">${hard ? `<span class="tp-hidden">Chữ sẽ hiện ra sau khi bạn trả lời.</span>`
            : `<div><div class="zh tp-hz">${esc(w.hz)}</div>${easy ? `<div class="tp-sub muted">${esc(bare(w.py))}</div>` : ""}<div class="tp-sub">${esc(gloss(w))}</div></div>`}</div>
          <div class="qa-listen" style="justify-content:center;margin-top:12px"><button class="btn btn-primary" id="tp-play">${ic("headphones")} Nghe lại</button><button class="btn" id="tp-slow">${ic("clock")} Nghe chậm</button></div>
          <div class="small muted center" style="margin-top:12px">Từ này có cặp thanh nào?</div>
          <div class="options tp-opts" id="opts">${opts.map((o, k) => `<button class="option tp-opt" data-k="${k}"><span class="opt-key">${k + 1}</span>${pairHtml(o.a, o.b)}</button>`).join("")}</div>
          <div class="small muted kbd-hint" style="margin-top:10px"><span class="kbd">1</span>–<span class="kbd">4</span> chọn · <span class="kbd">Space</span> nghe lại · <span class="kbd">Enter</span> câu tiếp</div>
          <div id="fb"></div>
        </div>`;
      box.querySelector("#tp-play").onclick = () => say(w.hz);
      box.querySelector("#tp-slow").onclick = () => say(w.hz, SLOW);
      box.querySelectorAll(".tp-opt").forEach((b) => b.onclick = () => choose(it, opts, +b.dataset.k));
      say(w.hz);
      App.keyHandler = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
        const k = e.key.toLowerCase();
        const idx = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 }[k];
        const bs = box.querySelectorAll(".tp-opt");
        if (idx != null && bs[idx] && !bs[idx].disabled) { e.preventDefault(); bs[idx].click(); }
        else if (e.key === " " || e.code === "Space") { e.preventDefault(); say(w.hz); }
        else if (e.key === "Enter") { const n = box.querySelector("#next"); if (n) { e.preventDefault(); n.click(); } }
      };
    }

    function choose(it, opts, k) {
      if (box.querySelector("#next")) return;
      const w = it.w, pickd = opts[k], ok = pickd.ok;
      box.querySelectorAll(".tp-opt").forEach((b, j) => {
        b.disabled = true;
        if (opts[j].ok) b.classList.add("correct");
        else if (j === k) b.classList.add("wrong");
      });
      bump(it.key, ok);
      Store.save();
      if (ok) { score += 10; right++; }
      else wrong.push({ hz: w.hz, py: w.py, vi: w.vi, id: w.id || null, note: `Cặp thanh ${pairText(it.a, it.b)} · bạn chọn ${pairText(pickd.a, pickd.b)}` });
      box.querySelector("#tp-word").innerHTML = `<div><div class="zh tp-hz">${esc(w.hz)}</div><div class="tp-sub" style="font-size:1.25rem;font-weight:600">${pyHtml(w.py)}</div><div class="tp-sub">${esc(gloss(w))}</div></div>`;
      // từ đối chiếu: một từ cùng cấp có đúng cặp bạn vừa chọn, để nghe hai cặp cạnh nhau
      const other = ok ? null : shuffle(pool.filter((x) => x.key === pickd.key && x.w.hz !== w.hz))[0];
      const notes = [];
      if (isSandhi(it.a, it.b)) notes.push(`Viết ${pairText(3, 3)}, nhưng khi nói thanh 3 đứng trước thanh 3 đổi thành thanh 2, nên bạn nghe thấy 2 + 3.`);
      if (it.b === 5) notes.push("Âm tiết sau đọc nhẹ, ngắn, không có dấu thanh; độ cao của nó phụ thuộc thanh đứng trước.");
      if (!ok && ((it.a === 2 && pickd.a === 3) || (it.a === 3 && pickd.a === 2) || (it.b === 2 && pickd.b === 3) || (it.b === 3 && pickd.b === 2))) notes.push("Thanh 2 đi lên liền một mạch; thanh 3 (khi không đứng cuối) chỉ xuống thấp rồi dừng, không lên lại.");
      if (!ok && ((it.a === 1 && pickd.a === 4) || (it.a === 4 && pickd.a === 1) || (it.b === 1 && pickd.b === 4) || (it.b === 4 && pickd.b === 1))) notes.push("Thanh 1 giữ cao và phẳng; thanh 4 bắt đầu cao rồi rơi mạnh xuống.");
      const fb = box.querySelector("#fb");
      fb.innerHTML = `<div class="feedback tr-fb ${ok ? "good" : "bad"}">
          <div class="tr-verdict"><span class="pill ${ok ? "green" : "red"}">${ok ? "Đúng rồi" : "Chưa đúng"}</span><span class="small muted">+${ok ? 10 : 0} điểm</span></div>
          <div class="tp-contrast"><span class="zh">${esc(w.hz)}</span> ${pyHtml(w.py)} · <b>${pairText(it.a, it.b)}</b>${speakBtn(w.hz)}</div>
          ${other ? `<div class="tp-contrast"><span class="small muted">Cặp ${pairText(pickd.a, pickd.b)} nghe như:</span><span class="zh">${esc(other.w.hz)}</span> ${pyHtml(other.w.py)}${speakBtn(other.w.hz)}</div>` : ""}
          ${notes.length ? `<ul class="small tr-why">${notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          <div class="row mt"><button class="btn btn-primary" id="next">${i + 1 < items.length ? "Câu tiếp" : "Xem kết quả"} ${ic("next")}</button></div>
        </div>`;
      bindSpeak(fb);
      fb.querySelector("#next").onclick = () => { i++; show(); };
      fb.querySelector("#next").focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function finish() {
      App.setFocus(false); App.keyHandler = null;
      if (window.speechSynthesis) speechSynthesis.cancel();
      const seconds = Math.round((Date.now() - t0) / 1000);
      const bestKey = `${KEY}:${std}:${cfg.level}:${cfg.diff}`;
      const isBest = P().record({ type: KEY, std, level: cfg.level, title: `${P().nameIn(feat, std)} · cấp ${cfg.level}`, score, correct: right, total: items.length, seconds, bestKey });
      const again = items.filter((x) => wrong.some((w) => w.hz === x.w.hz));
      P().results(box, {
        score, correct: right, total: items.length, seconds, isBest, wrong, from: P().nameIn(feat, std),
        onRetryWrong: () => session(box, std, cfg, shuffle(again), pool),
        onAgain: () => run(std, box),
      });
      box.insertAdjacentHTML("beforeend", matrixHtml(pool));
    }
    show();
  }

  // ---------- Kiểm tra tự động (dùng khi rà soát) ----------
  function check() {
    const out = { pools: {}, reasons: {}, badOptions: [], clash: [] };
    ["hsk2", "hsk3"].forEach((std) => P().STD[std].levels.forEach((l) => {
      const pool = poolOf(std, l), byPair = {};
      pool.forEach((it) => (byPair[it.key] = (byPair[it.key] || 0) + 1));
      const r = {};
      P().wordsOf(std, l).forEach((w) => { const x = reasonOf(w); if (x && x !== "len") r[x] = (r[x] || 0) + 1; });
      out.pools[`${std}-${l}`] = { n: pool.length, pairs: byPair };
      out.reasons[`${std}-${l}`] = r;
      pool.forEach((it) => {
        for (let t = 0; t < 5; t++) {
          const o = optionsOf(it);
          if (o.length !== 4 || new Set(o.map((x) => x.key)).size !== 4 || o.filter((x) => x.ok).length !== 1 || o.find((x) => x.ok).key !== it.key) out.badOptions.push(it.w.hz);
          if (o.some((x) => o.some((y) => clash(x.key, y.key)))) out.clash.push(it.w.hz);
        }
      });
    }));
    return out;
  }

  P().register(KEY, { run });
  window.ToneDrill = { parse, reasonOf, itemOf, poolOf, optionsOf, pairText, PAIRS, check, matrixHtml };
})();
