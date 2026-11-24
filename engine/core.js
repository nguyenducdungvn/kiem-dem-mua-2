/* =========================================================
   Engine truyện tương tác · Kiểm Đếm Ca Đêm (dùng chung cho các mùa)
   Tách từ js/engine.js của Mùa 1 (v1.1.0). Không phụ thuộc thư viện.

   Một trang index.html cho cả mùa:
     index.html          → menu mùa, chọn tập (GAME_CONFIG.season)
     index.html?tap=N    → nạp script của tập N rồi mở menu tập

   Mỗi tập khai báo trong STORY:
     meta    { title, act, version, keyPrefix, menu, journal, characters, … }
     stats   { KEY: { label, start, min, max, show:'bar'|'pips', cls, good:'up'|'down',
                      warn:{lt|ge}, fail:{le|ge, ending}, story:{min|max}, fmt(v), tip } }
     acts    [{ n, name, time, scene }]
     rules, scenes, endingsList, actEndingOf, staging, endingIcons
   ========================================================= */
(function () {
  'use strict';

  const CFG = window.GAME_CONFIG || {};
  const SEASON = CFG.season || { key: 'kd', episodes: [] };
  const SK = SEASON.key || 'kd';                       // tiền tố khóa lưu chung của mùa (kd2)
  const END_KEY = SK + '_endings';                      // { idKếtThúc: thời điểm }
  const SET_KEY = SK + '_settings';
  const PROFILE_KEY = SK + '_profile';                  // Mã hồ sơ Mùa 1 đã nhập
  const PROG_KEY = SK + '_progress';                    // { t1: { got, total } } cho menu mùa
  let SAVE_KEY = SK + '_save', CH_KEY = SK + '_chapters';

  let STORY = null, STATS = {}, STAT_KEYS = [];
  let S = null;
  let checkpoint = null;
  let typingTimer = null;
  let countdown = null;
  let episode = null;

  const $ = (sel) => document.querySelector(sel);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sfx = (n) => { if (window.SFX) SFX.play(n); };

  /* ---------- Lưu trữ cục bộ ---------- */
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* bỏ qua */ } }
  function read(key) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function drop(key) { try { localStorage.removeItem(key); } catch (e) { /* bỏ qua */ } }
  const save = () => store(SAVE_KEY, { S, checkpoint });
  const gotEndings = () => { const all = read(END_KEY) || {}; return STORY ? STORY.endingsList.filter((e) => all[e.id]) : []; };
  function syncProgress() {
    if (!STORY || !episode) return;
    const p = read(PROG_KEY) || {};
    p['t' + episode.n] = { got: gotEndings().length, total: STORY.endingsList.length, act: (S && S.act) || '' };
    store(PROG_KEY, p);
  }
  function unlockEnding(id) {
    const e = read(END_KEY) || {};
    if (!e[id]) { e[id] = Date.now(); store(END_KEY, e); syncProgress(); return true; }
    return false;
  }

  /* ---------- Cài đặt: chế độ đọc truyện ---------- */
  const settings = Object.assign({ story: false }, read(SET_KEY) || {});
  const storyMode = () => !!settings.story;
  const profile = () => read(PROFILE_KEY);

  /* ---------- Chỉ số (cấu hình theo tập) ---------- */
  function newState() {
    const st = { flags: Object.assign({}, (profile() || {}).flags || {}), rules: [], clues: [], scene: STORY.start, time: '', path: [] };
    STAT_KEYS.forEach((k) => { st[k] = STATS[k].start; });
    return st;
  }
  // Chế độ đọc truyện: chỉ số không thể làm người chơi thua (chỉ thua khi chọn sai rõ ràng)
  const clamp = (k, v) => {
    const c = STATS[k]; if (!c) return v;
    let lo = c.min, hi = c.max;
    if (storyMode() && c.story) { if (c.story.min !== undefined) lo = c.story.min; if (c.story.max !== undefined) hi = c.story.max; }
    return Math.max(lo, Math.min(hi, v));
  };
  const hits = (cond, v) => !!cond && ((cond.le !== undefined && v <= cond.le) || (cond.ge !== undefined && v >= cond.ge) || (cond.lt !== undefined && v < cond.lt) || (cond.gt !== undefined && v > cond.gt));
  const fmt = (k, v) => (STATS[k].fmt ? STATS[k].fmt(v) : String(v));
  function applyEffects(eff) {
    if (!eff) return [];
    return Object.keys(eff).filter((k) => STATS[k]).map((k) => { S[k] = clamp(k, S[k] + eff[k]); return { k, d: eff[k] }; });
  }
  function statFail() {
    if (storyMode()) return null;
    for (const k of STAT_KEYS) if (STATS[k].fail && hits(STATS[k].fail, S[k])) return STATS[k].fail.ending;
    return null;
  }
  function applyGain(gain) {
    if (!gain) return;
    const word = (STORY.meta.journal && STORY.meta.journal.ruleToast) || 'Nhận luật';
    (gain.rules || []).forEach((r) => { if (!S.rules.includes(r)) { S.rules.push(r); toast(word + ' ' + r, 'rule'); } });
    (gain.clues || []).forEach((c) => { if (!S.clues.includes(c)) { S.clues.push(c); toast(c.startsWith('(Hiếm)') ? 'Manh mối hiếm!' : 'Manh mối mới', 'clue'); } });
  }

  /* ---------- HUD ---------- */
  function buildHUD() {
    const box = $('#stats'); box.innerHTML = '';
    STAT_KEYS.forEach((k) => {
      const c = STATS[k];
      const d = document.createElement('div');
      d.className = 'stat' + (c.show === 'pips' ? ' pinstat' : '');
      d.title = c.tip || c.label;
      d.innerHTML = c.show === 'pips'
        ? `<span class="lbl">${esc(c.label)}</span><span class="pins ${esc(c.cls || '')}" id="pips-${k}"></span><span class="num" id="val-${k}"></span>`
        : `<span class="lbl">${esc(c.label)}</span><span class="track"><span class="fill ${esc(c.cls || '')}" id="bar-${k}"></span></span><span class="num" id="val-${k}"></span>`;
      box.appendChild(d);
    });
  }
  function renderHUD() {
    STAT_KEYS.forEach((k) => {
      const c = STATS[k], v = S[k];
      const val = $('#val-' + k); if (!val) return;
      if (c.show === 'pips') {
        const p = $('#pips-' + k); p.innerHTML = '';
        for (let i = 0; i < c.max; i++) { const e = document.createElement('span'); e.className = 'pin' + (i < v ? ' on' : ''); p.appendChild(e); }
        val.textContent = c.fmt ? c.fmt(v) : '';
      } else {
        $('#bar-' + k).style.width = ((v - c.min) / (c.max - c.min) * 100) + '%';
        val.textContent = fmt(k, v);
      }
      val.parentElement.classList.toggle('warn', hits(c.warn, v));
    });
    $('#clock').textContent = S.time || '--:--';
    $('#journal-count').textContent = S.rules.length + S.clues.length;
    if (window.Scene3D && Scene3D.ok) Scene3D.setStats(S);
    document.body.classList.toggle('low-sanity', STATS.TT ? S.TT < 40 : false);
  }

  function renderJournal() {
    const J = STORY.meta.journal || {};
    $('#journal-title').textContent = J.title || 'Sổ tay';
    $('#journal-rules-title').textContent = J.rulesTitle || 'Luật';
    $('#journal-note').textContent = J.rulesNote || '';
    const rl = $('#journal-rules'); rl.innerHTML = '';
    if (!S.rules.length) rl.innerHTML = '<li class="muted">Chưa có.</li>';
    S.rules.slice().sort().forEach((id) => {
      const r = STORY.rules[id];
      const n = r.sources[0] === '?' ? 0 : r.sources.length;
      const conf = n >= 3 ? 'cao' : n === 2 ? 'vua' : 'thap';
      const src = n ? (J.sourceText ? J.sourceText(n, r.sources) : n + ' nguồn xác nhận: ' + r.sources.join(', ')) : 'Không rõ nguồn';
      const li = document.createElement('li');
      li.innerHTML = `<b>${id}</b> ${esc(r.text)}<span class="src conf-${conf}">${esc(src)}${r.note ? ' · ' + esc(r.note) : ''}</span>`;
      rl.appendChild(li);
    });
    const cl = $('#journal-clues'); cl.innerHTML = '';
    if (!S.clues.length) cl.innerHTML = '<li class="muted">Chưa có.</li>';
    S.clues.forEach((c) => { const li = document.createElement('li'); li.textContent = c; if (c.startsWith('(Hiếm)')) li.className = 'rare'; cl.appendChild(li); });
    // Sổ đo xuyên mùa: mỗi tập mở một trang
    const pg = $('#journal-pages');
    if (pg) {
      const pages = (STORY.notebook && STORY.notebook(S)) || [];
      pg.innerHTML = pages.map((p) => `<li class="${p.open ? '' : 'locked'}"><b>${esc(p.title)}</b>${p.open ? `<span>${esc(p.text)}</span>` : '<span>Trang này còn dán kín.</span>'}</li>`).join('');
      pg.previousElementSibling.hidden = !pages.length;
    }
  }

  /* ---------- Thông báo nổi ---------- */
  function toast(msg, kind) {
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || ''); t.textContent = msg;
    const box = $('#toasts'); box.appendChild(t);
    while (box.children.length > 4) box.firstChild.remove();
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3200);
  }
  function showDeltas(list) {
    list.forEach(({ k, d }) => {
      if (!d) return;
      const good = STATS[k].good === 'down' ? d < 0 : d > 0;
      toast(`${STATS[k].label} ${d > 0 ? '+' : ''}${d}`, good ? 'up' : 'down');
    });
  }

  /* ---------- Hiển thị cảnh ---------- */
  const sceneText = (sc) => (typeof sc.text === 'function' ? sc.text(S) : (sc.text || []));

  let typeToken = 0, activeSkip = null;
  function typeParagraphs(container, paras, done) {
    clearTimeout(typingTimer);
    if (activeSkip) container.removeEventListener('click', activeSkip);
    const token = ++typeToken;
    container.innerHTML = '';
    let i = 0, finished = false;
    const alive = () => token === typeToken;
    const finish = () => {
      if (finished || !alive()) return;
      finished = true; container.removeEventListener('click', skip); activeSkip = null; done();
    };
    function addP(txt, instant) {
      if (!alive()) return;
      const p = document.createElement('p'); p.textContent = txt; container.appendChild(p);
      if (instant) p.classList.add('in'); else requestAnimationFrame(() => p.classList.add('in'));
    }
    function skip() {
      if (!alive()) return;
      clearTimeout(typingTimer);
      container.querySelectorAll('p').forEach((p) => p.classList.add('in'));
      while (i < paras.length) addP(paras[i++], true);
      finish();
    }
    function step() {
      if (!alive()) return;
      if (i >= paras.length) { finish(); return; }
      addP(paras[i++]);
      typingTimer = setTimeout(step, reduceMotion ? 0 : 650);
    }
    activeSkip = skip;
    container.addEventListener('click', skip);
    step();
  }

  function actNumber(act) { return parseInt(((act || '').match(/Màn (\d+)/) || [])[1], 10); }

  function go(id) {
    const sc = STORY.scenes[id];
    if (!sc) { console.error('Không tìm thấy cảnh', id); return; }
    stopTimer();
    S.scene = id; S.path.push(id);
    if (sc.time) S.time = sc.time;
    if (sc.act) {
      S.act = sc.act;
      const n = actNumber(sc.act);
      if (n) { const ch = read(CH_KEY) || {}; const snap = clone(S); snap.path = []; ch[n] = snap; store(CH_KEY, ch); }
      syncProgress();
    }
    $('#game-act').textContent = S.act || STORY.meta.act;
    if (sc.checkpoint) checkpoint = clone(S);
    applyGain(sc.gain);
    renderHUD();
    save();
    stage3D(id, sc);

    const stage = $('#stage');
    stage.className = 'stage' + (sc.danger ? ' danger' : '') + (sc.type ? ' t-' + sc.type : '');
    stage.scrollTop = 0;
    $('#scene-time').textContent = sc.time || ''; $('#scene-time').classList.remove('as-text');
    $('#scene-title').textContent = sc.title || '';
    $('#puzzle').innerHTML = '';
    $('#choices').innerHTML = '';
    $('#timer').hidden = true;

    if (sc.type === 'ending') return renderEnding(id, sc);
    if (sc.type === 'actend') return renderActEnd(sc);

    typeParagraphs($('#text'), sceneText(sc), () => {
      if (S.scene !== id) return;
      if (sc.type === 'puzzle') renderPuzzle(sc); else renderChoices(sc.choices || []);
      if (sc.timer) startTimer(sc.timer);
    });
  }

  /* ---------- Đồng hồ đếm ngược (có guard: tự dừng khi đổi cảnh, mở hộp thoại, ẩn tab) ---------- */
  function startTimer(tm) {
    stopTimer();
    if (storyMode()) return;
    const owner = S.scene;
    const box = $('#timer'), bar = $('#timer-bar'), lbl = $('#timer-label');
    box.hidden = false;
    let left = tm.sec * 1000, last = performance.now(), warned = false;
    lbl.textContent = (tm.label || 'Còn') + ' · ' + tm.sec + ' giây';
    countdown = setInterval(() => {
      if (S.scene !== owner) { stopTimer(); return; }
      const now = performance.now(), dt = now - last; last = now;
      if (document.hidden || document.querySelector('dialog[open]') || document.body.classList.contains('view-only')) return;
      left -= dt;
      const pct = Math.max(0, left / (tm.sec * 1000));
      bar.style.width = (pct * 100) + '%';
      lbl.textContent = (tm.label || 'Còn') + ' · ' + Math.ceil(Math.max(0, left) / 1000) + ' giây';
      box.classList.toggle('urgent', pct < 0.3);
      if (pct < 0.3 && !warned) { warned = true; sfx('heart'); }
      if (left <= 0) { stopTimer(); sfx('sting'); proceedTo(tm.next); }
    }, 100);
  }
  function stopTimer() { if (countdown) clearInterval(countdown); countdown = null; const b = $('#timer'); if (b) { b.classList.remove('urgent'); b.hidden = true; } }

  /* ---------- Dàn dựng 3D + âm thanh ---------- */
  let lastView = '';
  function stage3D(id, sc) {
    let st = (STORY.staging && STORY.staging[id]) || null;
    if (st && typeof st.tablet === 'function') st = Object.assign({}, st, { tablet: st.tablet(S) });
    if (st && typeof st.fx === 'function') st = Object.assign({}, st, { fx: st.fx(S) });
    if (st && typeof st.cast === 'function') st = Object.assign({}, st, { cast: st.cast(S) });
    if (st && st.sfx) st.sfx.forEach((n, i) => setTimeout(() => sfx(n), i * 350));
    if (window.SFX && SFX.setMood) SFX.setMood((st && st.mood) || (STORY.moodOf ? STORY.moodOf(S, st || {}) : 'night'));
    if (sc.type === 'ending') sfx('sting');
    if (!window.Scene3D || !Scene3D.ok) return;
    Scene3D.setStats(S);
    Scene3D.show(st || {}, sc.type === 'ending');
    if (st && st.view) lastView = st.view;
    $('#location').textContent = (sc.time ? sc.time + ' · ' : '') + (Scene3D.viewName(lastView) || '');
  }

  function renderChoices(choices) {
    const box = $('#choices'); box.innerHTML = '';
    choices.forEach((c) => {
      if (c.cond && !c.cond(S)) return;
      const b = document.createElement('button');
      b.className = 'choice';
      b.innerHTML = (c.key ? `<span class="key">${c.key}</span>` : '') + `<span class="ct">${esc(typeof c.text === 'function' ? c.text(S) : c.text)}</span>` + (c.hint ? `<span class="hint">${esc(c.hint)}</span>` : '');
      b.addEventListener('click', () => choose(c));
      box.appendChild(b);
    });
    const first = box.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }

  function choose(c) {
    stopTimer(); sfx('click');
    if (c.flags) Object.assign(S.flags, c.flags);
    showDeltas(applyEffects(c.effects));
    proceedTo(typeof c.next === 'function' ? c.next(S) : c.next);
  }

  function proceedTo(next) {
    const target = STORY.scenes[next];
    if (target && target.effects) showDeltas(applyEffects(target.effects));
    if (target && target.flags) Object.assign(S.flags, target.flags);
    const fail = statFail();
    if (fail && (!target || target.type !== 'ending')) { go(fail); return; }
    go(next);
  }

  /* ---------- Mini-game trên bản vẽ / bảng biểu SVG ---------- */
  function renderPuzzle(sc) {
    const box = $('#puzzle');
    const svg = typeof sc.svg === 'function' ? sc.svg(S) : sc.svg;
    box.innerHTML = `<div class="blueprint${sc.paper ? ' paper-sheet' : ''}">${svg}</div><div class="inspect" id="inspect" aria-live="polite">${esc(sc.prompt || 'Chạm vào một ký hiệu để xem.')}</div>`;
    box.querySelectorAll('.hit').forEach((el) => {
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
      const show = () => {
        box.querySelectorAll('.hit').forEach((h) => h.classList.remove('sel'));
        el.classList.add('sel'); sfx('click');
        $('#inspect').textContent = sc.inspect[el.dataset.id] || '';
      };
      el.addEventListener('click', show);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    });
    renderChoices(sc.answers.map((a) => ({ text: a.text, next: a.next, flags: a.flags, effects: a.effects, cond: a.cond })));
  }

  /* ---------- Kết thúc thất bại ---------- */
  function renderEnding(id, sc) {
    const isNew = unlockEnding(id);
    document.body.classList.add('dead');
    setTimeout(() => document.body.classList.remove('dead'), 1400);
    $('#scene-time').textContent = 'Kết thúc thất bại' + (isNew ? ' · mới mở khóa' : ''); $('#scene-time').classList.add('as-text');
    typeParagraphs($('#text'), sceneText(sc), () => {
      const total = STORY.endingsList.length, got = gotEndings().length;
      const note = document.createElement('p'); note.className = 'collect';
      note.innerHTML = `${window.EndingIcon ? EndingIcon(id) : ''}<span>Bộ sưu tập kết thúc: ${got}/${total}</span>`;
      $('#text').appendChild(note); note.classList.add('in');
      const box = $('#choices');
      box.append(
        btn('Thử lại từ nút gần nhất', () => { if (checkpoint) { S = clone(checkpoint); S.path.pop(); go(S.scene); } else restart(); }),
        btn('Chia sẻ kết thúc này', () => shareEnding(sc.title)),
        btn('Về màn hình tập', openMenu, 'ghost')
      );
      box.querySelector('button').focus({ preventScroll: true });
    });
  }

  function shareEnding(title) {
    const got = gotEndings().length;
    const url = (CFG.gameUrl || location.origin + location.pathname) + (episode ? '?tap=' + episode.n : '');
    const text = STORY.meta.share ? STORY.meta.share(title, got, STORY.endingsList.length) : `Mình vừa mở kết thúc “${title}” (${got}/${STORY.endingsList.length}).`;
    if (navigator.share) { navigator.share({ title: STORY.meta.fullTitle || document.title, text, url }).catch(() => {}); return; }
    try { navigator.clipboard.writeText(text + ' ' + url).then(() => toast('Đã chép lời mời, dán vào nơi bạn muốn chia sẻ', 'up'), () => toast(url, 'clue')); } catch (e) { toast(url, 'clue'); }
  }

  function btn(text, fn, cls) {
    const b = document.createElement('button');
    b.className = 'choice' + (cls ? ' ' + cls : '');
    b.innerHTML = `<span class="ct">${esc(text)}</span>`;
    b.addEventListener('click', () => { sfx('click'); fn(); });
    return b;
  }

  /* ---------- Hết màn: tổng kết, cảm ơn, mời cà phê ---------- */
  function renderActEnd(sc) {
    const endId = (sc.endOf || STORY.actEndingOf)(S);
    const isNew = unlockEnding(endId);
    const endInfo = STORY.endingsList.find((e) => e.id === endId);
    const allClues = new Set(); Object.values(STORY.scenes).forEach((x) => (x.gain && x.gain.clues || []).forEach((c) => allClues.add(c)));
    const got = gotEndings().length;
    $('#scene-time').textContent = sc.time || S.time || ''; $('#scene-time').classList.remove('as-text');
    const rows = STAT_KEYS.map((k) => `<tr><th>${esc(STATS[k].label)}</th><td>${esc(fmt(k, S[k]))}${STATS[k].show === 'pips' ? '' : '/' + STATS[k].max}</td></tr>`).join('');
    const extra = sc.summary ? sc.summary(S).map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('') : '';
    $('#text').innerHTML = `
      <div class="summary">
        <p class="endname">${window.EndingIcon ? EndingIcon(endId) : ''}<span>${esc(endInfo.title)}${isNew ? ' <span class="new">mới</span>' : ''}</span></p>
        ${sc.recap ? `<div class="recap">${sc.recap(S).map((p) => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
        <table>
          ${rows}${extra}
          <tr><th>Luật đã thu</th><td>${S.rules.length}/${Object.keys(STORY.rules).length}</td></tr>
          <tr><th>Manh mối</th><td>${S.clues.length}/${allClues.size}</td></tr>
          <tr><th>Bộ sưu tập kết thúc</th><td>${got}/${STORY.endingsList.length}</td></tr>
        </table>
        <p class="teaser"><b>${sc.nextScene ? 'Tiếp theo' : 'Sắp ra mắt'}, ${esc(sc.next)}:</b> ${esc(sc.teaser || '')}</p>
        <div class="thanks">
          <h3>Cảm ơn bạn đã đọc đến đây</h3>
          <p>Mỗi lựa chọn của bạn đêm nay sẽ theo bạn sang các màn sau. ${sc.nextScene ? '' : 'Màn tiếp theo đang được viết. '}Còn ${allClues.size - S.clues.length} manh mối và ${STORY.endingsList.length - got} kết thúc bạn chưa thấy, chơi lại để tìm nhé.</p>
          <p>Nếu thấy hay, bạn có thể mời mình một ly cà phê để mình có thêm động lực viết tiếp.</p>
          ${(CFG.coffee && CFG.coffee.qr) ? `<button class="qr-thumb" id="qr-thumb" aria-label="Mở mã QR mời cà phê"><img src="${esc(CFG.coffee.qr)}" alt="Mã QR mời cà phê"><span>Quét mã để mời cà phê${CFG.author ? ' · ' + esc(CFG.author) : ''}</span></button>` : ''}
        </div>
      </div>`;
    const qt = $('#qr-thumb'); if (qt) qt.addEventListener('click', () => openDialog('dlg-coffee'));
    const box = $('#choices');
    if (sc.final) {
      $('#scene-title').textContent = STORY.meta.finalTitle || 'Cảm ơn bạn đã đi đến cuối';
      box.append(
        btn('✍️ Góp ý, nhận xét cho tác giả', () => openDialog('dlg-feedback')),
        btn('🔔 Đăng ký nhận tập tiếp theo', () => openDialog('dlg-subscribe')),
        btn('☕ Mời mình cà phê', () => openDialog('dlg-coffee')),
        btn('Chia sẻ kết thúc của bạn', () => shareEnding(endInfo.title)),
        btn('Chọn màn để thử nhánh khác', () => openDialog('dlg-chapters')),
        btn('Về các tập của mùa', toSeason, 'ghost')
      );
      box.firstChild.classList.add('primary');
      box.firstChild.focus({ preventScroll: true });
      return;
    }
    if (sc.nextScene) {
      const nb = btn('Sang ' + sc.next + ' ▶', () => { checkpoint = clone(S); go(sc.nextScene); });
      nb.classList.add('primary'); box.append(nb);
    } else {
      const sb = btn('🔔 Báo cho tôi khi có ' + sc.next, () => openDialog('dlg-subscribe'));
      sb.classList.add('primary'); box.append(sb);
    }
    box.append(btn('☕ Mời mình cà phê', () => openDialog('dlg-coffee')), btn('Chia sẻ kết thúc này', () => shareEnding(endInfo.title)), btn('Chơi lại từ đầu để tìm nhánh khác', restart), btn('Về màn hình tập', openMenu, 'ghost'));
    box.querySelector('button').focus({ preventScroll: true });
  }

  /* ---------- Màn hình tập ---------- */
  function openMenu() {
    stopTimer();
    document.body.classList.add('in-menu');
    document.body.classList.remove('in-season');
    const saved = read(SAVE_KEY);
    const ssc = saved && saved.S && STORY.scenes[saved.S.scene];
    const canContinue = ssc && ssc.type !== 'ending' && !(ssc.type === 'actend' && !ssc.nextScene) && saved.S.scene !== STORY.start;
    $('#btn-continue').hidden = !canContinue;
    $('#endings-count').textContent = `${gotEndings().length}/${STORY.endingsList.length}`;
    const fc = $('#facts-endings'); if (fc) fc.textContent = STORY.endingsList.length + ' kết thúc để sưu tầm';
    if (window.Scene3D && Scene3D.ok) Scene3D.show(STORY.staging.menu || {}, false);
    $('#location').textContent = '';
  }
  function closeMenu() { document.body.classList.remove('in-menu'); }
  function toSeason() { location.href = location.pathname; }

  function openDialog(id) {
    if (id === 'dlg-endings') renderEndings();
    if (id === 'dlg-coffee') renderCoffee();
    if (id === 'dlg-chapters') renderChapters();
    if (id === 'dlg-feedback') renderFeedback();
    if (id === 'dlg-subscribe') renderSubscribe();
    if (id === 'dlg-profile') renderProfile();
    $('#' + id).showModal();
  }

  /* ---------- Chọn màn ---------- */
  function renderChapters() {
    const ch = read(CH_KEY) || {};
    const ul = $('#chapters-list'); ul.innerHTML = '';
    (STORY.acts || []).forEach((a) => {
      const li = document.createElement('li');
      const open = !!ch[a.n];
      li.className = open ? '' : 'locked';
      li.innerHTML = `<div><b>${esc(a.name)}</b><small>${esc(a.time)}${a.soon ? ' · sắp ra mắt' : open ? '' : ' · chưa mở'}</small></div>`;
      if (open) {
        const b = document.createElement('button'); b.textContent = 'Chơi từ đây';
        b.addEventListener('click', () => { $('#dlg-chapters').close(); playChapter(a.n); });
        li.appendChild(b);
      }
      ul.appendChild(li);
    });
  }
  function playChapter(n) {
    const ch = read(CH_KEY) || {};
    if (!ch[n]) return;
    S = clone(ch[n]); checkpoint = clone(S); S.path = [];
    closeMenu();
    go(S.scene);
  }

  /* ---------- Góp ý ---------- */
  let fbStars = 0;
  function feedbackBody() {
    const names = STORY ? gotEndings().map((e) => e.title) : [];
    return [
      `Điểm: ${fbStars ? '★'.repeat(fbStars) + '☆'.repeat(5 - fbStars) + ' (' + fbStars + '/5)' : 'chưa chấm'}`,
      `Nhân vật nhớ nhất: ${$('#fb-char').value || '-'}`,
      `Đoạn nhớ nhất: ${$('#fb-moment').value.trim() || '-'}`,
      '',
      'Góp ý / ý tưởng:',
      $('#fb-text').value.trim() || '-',
      '',
      `Muốn nhận tập tiếp theo: ${$('#fb-sub').checked ? 'Có' : 'Không'}`,
      '',
      '---',
      `Phiên bản: v${CFG.version || (STORY && STORY.meta.version) || '-'} · ${episode ? 'Tập ' + episode.n + ' · ' + episode.name : 'Menu mùa'} · Đang ở: ${(S && S.act) || '-'}${STORY ? ' · Kết thúc đã mở: ' + names.length + '/' + STORY.endingsList.length : ''}`,
      names.length ? 'Đã mở: ' + names.join('; ') : ''
    ].join('\n');
  }
  function updateFeedbackLinks() {
    const body = feedbackBody();
    const title = '[Góp ý] ' + (fbStars ? fbStars + '★ ' : '') + ($('#fb-moment').value.trim().slice(0, 50) || (episode ? 'Tập ' + episode.n + ' · ' + episode.name : 'Mùa 2'));
    const gh = $('#fb-gh');
    if (gh) gh.href = `${CFG.repoUrl}/issues/new?labels=gop-y&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    const em = $('#fb-email');
    if (em) em.href = `mailto:${CFG.feedback.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  }
  function renderFeedback() {
    const chars = (STORY && STORY.meta.characters) || SEASON.characters || [];
    const sel = $('#fb-char');
    if (sel.options.length <= 1) chars.forEach((c) => { const o = document.createElement('option'); o.textContent = c; sel.appendChild(o); });
    const st = $('#fb-stars'); st.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = '★'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', i + ' sao');
      b.setAttribute('aria-checked', String(i === fbStars)); b.className = i <= fbStars ? 'on' : '';
      b.addEventListener('click', () => { fbStars = i; renderFeedback(); });
      st.appendChild(b);
    }
    const fb = CFG.feedback || {};
    const act = $('#fb-actions'); act.innerHTML = '';
    if (fb.github && CFG.repoUrl) act.insertAdjacentHTML('beforeend', '<a id="fb-gh" target="_blank" rel="noopener">Gửi qua GitHub</a>');
    if (fb.email) act.insertAdjacentHTML('beforeend', '<a id="fb-email">Gửi email</a>');
    if (fb.formUrl) act.insertAdjacentHTML('beforeend', `<a href="${esc(fb.formUrl)}" target="_blank" rel="noopener">Mở biểu mẫu góp ý</a>`);
    const cp = document.createElement('button'); cp.type = 'button'; cp.className = 'ghostbtn'; cp.textContent = 'Chép nội dung';
    cp.addEventListener('click', () => {
      try { navigator.clipboard.writeText(feedbackBody()).then(() => toast('Đã chép góp ý. Bạn có thể dán vào tin nhắn gửi tác giả.', 'up'), () => toast('Không chép được, bạn chép tay giúp mình nhé', 'down')); } catch (e) { toast('Không chép được, bạn chép tay giúp mình nhé', 'down'); }
    });
    act.appendChild(cp);
    ['#fb-char', '#fb-moment', '#fb-text', '#fb-sub'].forEach((q) => { const el = $(q); el.oninput = updateFeedbackLinks; el.onchange = updateFeedbackLinks; });
    updateFeedbackLinks();
  }

  /* ---------- Đăng ký nhận tập mới ---------- */
  function renderSubscribe() {
    const sub = CFG.subscribe || {};
    const items = [];
    if (sub.issueUrl) items.push(`<li><b>Theo dõi trên GitHub</b><p>Mở trang đăng ký, bấm <i>Subscribe</i> ở cột bên phải. Mỗi khi có tập mới, bạn sẽ nhận thông báo qua email của tài khoản GitHub.</p><a href="${esc(sub.issueUrl)}" target="_blank" rel="noopener">Mở trang đăng ký</a></li>`);
    if (CFG.repoUrl) items.push(`<li><b>Theo dõi kho truyện</b><p>Bấm <i>Watch → Custom → Releases</i> để nhận thông báo mỗi khi phát hành tập mới, hoặc bấm <i>Star</i> để lưu lại.</p><a href="${esc(CFG.repoUrl)}" target="_blank" rel="noopener">Mở kho GitHub</a></li>`);
    (sub.links || []).filter((l) => l && l.url).forEach((l) => items.push(`<li><b>${esc(l.label)}</b><p></p><a href="${esc(l.url)}" target="_blank" rel="noopener">Mở</a></li>`));
    items.push('<li><b>Gửi góp ý kèm lời nhắn “muốn nhận tập mới”</b><p>Tác giả đọc mọi góp ý và trả lời ngay trong đó khi có tập mới.</p><button type="button" id="sub-fb">Viết góp ý</button></li>');
    items.push(`<li><b>Rủ thêm một người bạn</b><p>Câu chuyện sống được nhờ người đọc.</p><button type="button" id="sub-share">Chép đường dẫn game</button></li>`);
    $('#sub-list').innerHTML = items.join('');
    $('#sub-fb').addEventListener('click', () => { $('#dlg-subscribe').close(); $('#fb-sub').checked = true; openDialog('dlg-feedback'); });
    $('#sub-share').addEventListener('click', () => {
      const url = CFG.gameUrl || location.href;
      try { navigator.clipboard.writeText(url).then(() => toast('Đã chép đường dẫn game', 'up'), () => toast(url, 'clue')); } catch (e) { toast(url, 'clue'); }
    });
  }

  function renderEndings() {
    const got = read(END_KEY) || {};
    const icons = STORY.endingIcons || {};
    $('#endings-grid').innerHTML = STORY.endingsList.map((e) => `
      <li class="${got[e.id] ? 'got' : 'locked'} ${e.kind}">
        ${got[e.id] && window.EndingIcon ? EndingIcon(e.id, icons) : '<svg class="eicon" viewBox="0 0 64 64" aria-hidden="true"><text x="32" y="42" text-anchor="middle" font-size="30" fill="currentColor">?</text></svg>'}
        <b>${got[e.id] ? esc(e.title) : '???'}</b>
        <span>${e.final ? 'Kết cuối' : e.kind === 'act' ? 'Kết màn' : 'Kết thúc thất bại'} · Màn ${e.act || 1}</span>
        <small>${esc(e.hint)}</small>
      </li>`).join('');
  }

  function renderCoffee() {
    const c = CFG.coffee || {};
    const links = (c.links || []).filter((l) => l && l.url);
    const bank = c.bank || {};
    let html = `<p>${esc(c.message || 'Cảm ơn bạn đã ủng hộ!')}</p>`;
    if (c.qr) html += `<img class="qr" src="${esc(c.qr)}" alt="Mã QR mời cà phê">`;
    if (bank.number) html += `<div class="bank"><div><span>Ngân hàng</span><b>${esc(bank.name || '')}</b></div><div><span>Số tài khoản</span><b>${esc(bank.number)}</b> <button class="tool" id="copy-bank">Chép</button></div><div><span>Chủ tài khoản</span><b>${esc(bank.owner || '')}</b></div>${bank.note ? `<div><span>Nội dung</span><b>${esc(bank.note)}</b></div>` : ''}</div>`;
    if (links.length) html += `<p class="links">${links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</p>`;
    if (!c.qr && !bank.number && !links.length) html += '<p class="muted">Tác giả đang cập nhật thông tin mời cà phê. Cảm ơn tấm lòng của bạn!</p>';
    $('#coffee-body').innerHTML = html;
    const cb = $('#copy-bank');
    if (cb) cb.addEventListener('click', () => {
      try { navigator.clipboard.writeText(bank.number).then(() => toast('Đã chép số tài khoản', 'up'), () => toast('Không chép được, bạn chép tay giúp mình nhé', 'down')); } catch (e) { toast('Không chép được, bạn chép tay giúp mình nhé', 'down'); }
    });
  }

  /* ---------- Mã hồ sơ Mùa 1 ---------- */
  function profileSummary(p) {
    const f = p.flags, out = [];
    const D = SEASON.profileLines || {};
    Object.keys(D).forEach((k) => { if (f[k]) out.push(D[k]); });
    if (p.final && SEASON.profileFinals && SEASON.profileFinals[p.final]) out.unshift(SEASON.profileFinals[p.final]);
    return out;
  }
  function renderProfile() {
    const p = profile();
    const st = $('#profile-state');
    $('#profile-input').value = p ? p.code : '';
    $('#profile-clear').hidden = !p;
    st.innerHTML = p
      ? `<p><b>Đã nhận mã ${esc(p.code)}.</b> Thục Anh mang theo những điều này vào Mùa 2:</p><ul>${profileSummary(p).map((l) => `<li>${esc(l)}</li>`).join('') || '<li>Một đêm ở nhà B4 mà cô không muốn kể lại.</li>'}</ul><p class="small muted">Mã chỉ có tác dụng với ván chơi mới. Ván đang dở giữ nguyên.</p>`
      : '<p class="small muted">Chưa nhập mã. Bạn vẫn chơi Mùa 2 bình thường, chỉ thiếu vài câu thoại và manh mối dành riêng cho người đã đi hết Mùa 1.</p>';
  }
  function bindProfile() {
    const ok = $('#profile-ok'); if (!ok) return;
    ok.addEventListener('click', () => {
      const r = window.MaHoSo ? MaHoSo.decode($('#profile-input').value) : { ok: false };
      if (!r.ok) { toast('Mã chưa đúng. Mã gồm 6 ký tự, ví dụ 7KQ-2MD', 'down'); sfx('warn'); return; }
      store(PROFILE_KEY, r); sfx('click'); toast('Đã nhận Mã hồ sơ ' + r.code, 'up'); renderProfile(); renderSeason();
    });
    $('#profile-clear').addEventListener('click', () => { drop(PROFILE_KEY); renderProfile(); renderSeason(); toast('Đã xóa Mã hồ sơ', 'clue'); });
  }

  function restart() {
    drop(SAVE_KEY);
    S = newState(); checkpoint = null;
    const ch = read(CH_KEY) || {}; ch[1] = clone(S); store(CH_KEY, ch);
    closeMenu();
    go(S.scene);
  }
  function continueGame() {
    const saved = read(SAVE_KEY);
    if (!saved || !saved.S) return restart();
    S = saved.S; checkpoint = saved.checkpoint;
    STAT_KEYS.forEach((k) => { if (typeof S[k] !== 'number') S[k] = STATS[k].start; });
    S.path.pop();
    closeMenu();
    go(S.scene);
  }

  /* ---------- Menu mùa ---------- */
  function renderSeason() {
    const box = $('#episodes'); if (!box) return;
    const prog = read(PROG_KEY) || {};
    box.innerHTML = SEASON.episodes.map((e) => {
      const p = prog['t' + e.n];
      const open = e.status === 'open';
      return `<li class="ep ${open ? 'open' : 'soon'}">
        <div class="ep-num">Tập ${e.n}</div>
        <div class="ep-body"><b>${esc(e.name)}</b><p>${esc(e.blurb)}</p>
          <small>${open ? esc(e.facts || '') + (p ? ` · Đã mở ${p.got}/${p.total} kết thúc` : '') : 'Sắp ra mắt'}</small></div>
        ${open ? `<a class="ep-go" href="?tap=${e.n}">${p ? 'Chơi tiếp' : 'Chơi'}</a>` : '<button class="ep-go ghost" data-open="dlg-subscribe">Đăng ký nhận tin</button>'}
      </li>`;
    }).join('');
    box.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { sfx('click'); openDialog(b.dataset.open); }));
    const pp = $('#profile-pill'); const p = profile();
    if (pp) pp.textContent = p ? p.code : 'chưa nhập';
  }

  /* ---------- Nạp tập ---------- */
  function loadScripts(list) {
    return list.reduce((pr, src) => pr.then(() => new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Không tải được ' + src));
      document.body.appendChild(s);
    })), Promise.resolve());
  }

  function setupEpisode() {
    STORY = window.STORY;
    STATS = STORY.stats; STAT_KEYS = Object.keys(STATS);
    const pre = STORY.meta.keyPrefix || (SK + '_t' + episode.n);
    SAVE_KEY = pre + '_save'; CH_KEY = pre + '_chapters';
    if (window.EndingIcon && STORY.endingIcons) window.EndingIcon.map = STORY.endingIcons;
    buildHUD();
    const m = STORY.meta.menu || {};
    document.title = STORY.meta.fullTitle || document.title;
    $('#menu-kicker').textContent = m.kicker || '';
    $('#menu-title').textContent = m.title || STORY.meta.title;
    $('#menu-sub').textContent = m.sub || '';
    $('#menu-hook').innerHTML = (m.hook || []).map((p) => `<p>${esc(p)}</p>`).join('') + (m.q ? `<p class="q">${esc(m.q)}</p>` : '');
    $('#menu-facts').innerHTML = (m.facts || []).map((f) => `<li>${esc(f)}</li>`).join('') + '<li id="facts-endings"></li><li>Tự động lưu</li>';
    $('#brand-title').textContent = STORY.meta.brand || 'Kiểm Đếm Ca Đêm';
    $('#game-act').textContent = STORY.meta.act;
    document.querySelectorAll('.ep-version').forEach((el) => { el.textContent = 'v' + STORY.meta.version; });
    syncProgress();
  }

  /* ---------- Khởi động ---------- */
  function init() {
    const v = CFG.version || '';
    document.querySelectorAll('.version').forEach((el) => { el.textContent = 'v' + v; });
    if (CFG.author) document.querySelectorAll('.author').forEach((el) => { el.textContent = CFG.author; });
    else document.querySelectorAll('.author-line').forEach((el) => { el.hidden = true; });

    const unlockAudio = () => { if (window.SFX) SFX.unlock(); };
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { sfx('click'); openDialog(b.dataset.open); }));
    document.querySelectorAll('dialog .close').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
    bindProfile();

    // Chế độ đọc truyện (dùng chung cả mùa)
    document.querySelectorAll('.btn-story').forEach((smBtn) => smBtn.addEventListener('click', () => { settings.story = !settings.story; store(SET_KEY, settings); syncStory(); sfx('click'); }));
    const syncStory = () => {
      document.querySelectorAll('.btn-story').forEach((b) => { b.setAttribute('aria-pressed', storyMode() ? 'true' : 'false'); b.querySelector('b').textContent = storyMode() ? 'Bật' : 'Tắt'; });
      document.body.classList.toggle('story-mode', storyMode());
      $('#game-act').dataset.mode = storyMode() ? ' · Chế độ đọc' : '';
    };
    syncStory();
    const share = $('#btn-share');
    if (share) share.addEventListener('click', () => {
      const url = CFG.gameUrl || location.href;
      try { navigator.clipboard.writeText(url).then(() => toast('Đã chép đường dẫn game', 'up'), () => toast(url, 'clue')); } catch (e) { toast(url, 'clue'); }
    });

    const n = parseInt(new URLSearchParams(location.search).get('tap'), 10);
    episode = SEASON.episodes.find((e) => e.n === n && e.status === 'open') || null;
    if (!episode) { document.body.classList.remove('loading'); document.body.classList.add('in-season'); renderSeason(); return; }

    // ---- Vào một tập ----
    loadScripts(episode.scripts).then(() => {
      setupEpisode();
      if (window.Scene3D) Scene3D.init();
      $('#btn-start').addEventListener('click', () => { unlockAudio(); sfx('click'); restart(); });
      $('#btn-continue').addEventListener('click', () => { unlockAudio(); sfx('click'); continueGame(); });
      $('#btn-season').addEventListener('click', toSeason);
      $('#btn-journal').addEventListener('click', () => { renderJournal(); $('#journal').showModal(); });
      $('#btn-menu').addEventListener('click', openMenu);
      $('#btn-hide').addEventListener('click', () => {
        const on = document.body.classList.toggle('view-only');
        $('#btn-hide').setAttribute('aria-pressed', on ? 'true' : 'false');
        $('#btn-hide').textContent = on ? 'Hiện chữ' : 'Xem cảnh';
      });
      const audioBtn = $('#btn-audio');
      const syncAudio = () => { const m = window.SFX && SFX.isMuted(); audioBtn.textContent = m ? '♪ Tắt' : '♪ Bật'; audioBtn.setAttribute('aria-pressed', m ? 'false' : 'true'); };
      audioBtn.addEventListener('click', () => { unlockAudio(); if (window.SFX) SFX.setMuted(!SFX.isMuted()); syncAudio(); });
      syncAudio();

      // Phím tắt: 1–4 hoặc A–D chọn, J sổ tay, H ẩn chữ, M âm thanh, Space/Enter hiện hết chữ
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (document.querySelector('dialog[open]') || document.body.classList.contains('in-menu')) return;
        const k = e.key.toLowerCase();
        const idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
        if (idx >= 0) { const b = document.querySelectorAll('#choices button')[idx]; if (b) { e.preventDefault(); b.click(); } return; }
        if (k === 'j') { e.preventDefault(); $('#btn-journal').click(); }
        else if (k === 'h') { e.preventDefault(); $('#btn-hide').click(); }
        else if (k === 'm') { e.preventDefault(); audioBtn.click(); }
        else if ((k === ' ' || k === 'enter') && tag !== 'button') { e.preventDefault(); $('#text').click(); }
      });

      // Chờ font tiếng Việt rồi mới dựng cảnh (chữ trên biển, tablet 3D dùng font này)
      const fontsReady = (document.fonts && document.fonts.load)
        ? Promise.all(['700 40px "Be Vietnam Pro"', '600 40px "Be Vietnam Pro"', '400 18px "Noto Serif"', '400 18px "Roboto Mono"'].map((f) => document.fonts.load(f)))
        : Promise.resolve();
      return Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]);
    }).then(() => { document.body.classList.remove('loading'); openMenu(); }, (err) => {
      console.error(err);
      document.body.classList.remove('loading'); document.body.classList.add('in-season'); renderSeason();
      toast('Không tải được tập này. Bạn thử tải lại trang nhé.', 'down');
    });
  }

  window.KD = { getState: () => S, go, restart, openMenu, story: () => STORY };
  document.addEventListener('DOMContentLoaded', init);
})();
