// Kiểm tra toàn bộ một tập: cảnh thiếu, cảnh không tới được, và mô phỏng mọi nhánh
// (gộp các trạng thái trùng nhau để không bùng nổ tổ hợp). Đọc chỉ số từ STORY.stats.
// Dùng:  node tools/check.js tap-1/story-act1.js [tap-1/story-act2.js …] [--profile=m1_ghi_su_that,m1_cong_khai] [--story]
//   --profile  mô phỏng người chơi đã nhập Mã hồ sơ Mùa 1 với các cờ đã cho
//   --story    mô phỏng chế độ đọc truyện (chỉ số bị chặn, không thua vì cạn chỉ số)
const fs = require('fs'), vm = require('vm');
const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v === undefined ? true : v]; }));
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
files.forEach((f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx));
const ST = ctx.STORY, sc = ST.scenes, STATS = ST.stats, KEYS = Object.keys(STATS); let err = 0;
const profileFlags = {}; if (opt.profile) String(opt.profile).split(',').filter(Boolean).forEach((f) => { profileFlags[f] = true; }); if (opt.profile) profileFlags.m1_co_ma = true;
const hits = (c, v) => !!c && ((c.le !== undefined && v <= c.le) || (c.ge !== undefined && v >= c.ge) || (c.lt !== undefined && v < c.lt) || (c.gt !== undefined && v > c.gt));
const statEndings = KEYS.filter((k) => STATS[k].fail).map((k) => STATS[k].fail.ending);
const probe = (fn) => { const out = new Set(); [{}, { flags: {} }].forEach(() => {}); const base = {}; KEYS.forEach((k) => { base[k] = STATS[k].start; });
  [0, 100].forEach((v) => { const S = { ...base, flags: {} }; KEYS.forEach((k) => { S[k] = v; }); try { out.add(fn(S)); } catch (e) { /* bỏ qua */ } });
  return [...out]; };
const nextsOf = (s) => {
  const out = [];
  (s.choices || []).concat(s.answers || []).forEach((c) => { if (typeof c.next === 'function') out.push(...probe(c.next)); else out.push(c.next); });
  if (s.timer) out.push(s.timer.next);
  if (s.nextScene) out.push(s.nextScene);
  return out;
};
// 1. tham chiếu
for (const [id, s] of Object.entries(sc)) {
  for (const n of nextsOf(s)) if (!sc[n]) { console.log('THIẾU CẢNH', id, '->', n); err++; }
  (s.gain && s.gain.rules || []).forEach((r) => { if (!ST.rules[r]) { console.log('LUẬT LẠ', r); err++; } });
  if (s.effects) Object.keys(s.effects).forEach((k) => { if (!STATS[k]) { console.log('CHỈ SỐ LẠ', id, k); err++; } });
  (s.choices || []).concat(s.answers || []).forEach((c) => c.effects && Object.keys(c.effects).forEach((k) => { if (!STATS[k]) { console.log('CHỈ SỐ LẠ', id, k); err++; } }));
  const txt = typeof s.text === 'function' ? s.text({ flags: profileFlags, ...Object.fromEntries(KEYS.map((k) => [k, STATS[k].start])) }) : (s.text || []);
  txt.forEach((p) => { if (p !== p.normalize('NFC')) { console.log('CHUỖI CHƯA NFC', id); err++; } });
}
statEndings.forEach((e) => { if (!sc[e]) { console.log('THIẾU KẾT THÚC CHỈ SỐ', e); err++; } });
const START = ST.start;
const seen = new Set(statEndings), q = [START];
while (q.length) { const i = q.pop(); if (seen.has(i)) continue; seen.add(i); nextsOf(sc[i]).forEach((n) => q.push(n)); }
for (const id in sc) if (!seen.has(id)) { console.log('KHÔNG TỚI ĐƯỢC', id); err++; }
for (const id in sc) if (sc[id].type === 'ending' && !ST.endingsList.some((e) => e.id === id)) { console.log('KẾT THÚC CHƯA LIỆT KÊ', id); err++; }
for (const id in (ST.staging || {})) if (!sc[id] && id !== 'menu') { console.log('DÀN DỰNG CHO CẢNH KHÔNG CÓ', id); err++; }
for (const id in sc) if (sc[id].type !== 'actend' && !(ST.staging || {})[id]) console.log('(gợi ý) cảnh chưa có dàn dựng 3D:', id);
const icons = ST.endingIcons || {}; ST.endingsList.forEach((e) => { if (!icons[e.id]) console.log('(gợi ý) kết thúc chưa có thẻ minh họa:', e.id); });
// 2. mô phỏng có gộp trạng thái
const clamp = (k, v) => { const c = STATS[k]; let lo = c.min, hi = c.max; if (opt.story && c.story) { if (c.story.min !== undefined) lo = c.story.min; if (c.story.max !== undefined) hi = c.story.max; } return Math.max(lo, Math.min(hi, v)); };
const statFail = (S) => { if (opt.story) return null; for (const k of KEYS) if (STATS[k].fail && hits(STATS[k].fail, S[k])) return STATS[k].fail.ending; return null; };
const key = (id, S) => id + '|' + KEYS.map((k) => S[k]).join(',') + '|' + Object.keys(S.flags).filter((f) => S.flags[f]).sort().join('.') + '|' + (S.ends || []).join('.');
const visited = new Set(); const endCount = {}; const actEnds = {}; const finals = []; const atActEnd = [];
const S0 = { flags: { ...profileFlags }, ends: [] }; KEYS.forEach((k) => { S0[k] = STATS[k].start; });
const stack = [[START, S0]];
let states = 0;
const apply = (T, eff) => { if (eff) for (const kk in eff) if (STATS[kk]) T[kk] = clamp(kk, T[kk] + eff[kk]); };
while (stack.length) {
  const [id, S] = stack.pop(); const k = key(id, S);
  if (visited.has(k)) continue; visited.add(k); states++;
  const s = sc[id];
  if (s.type === 'ending') { endCount[id] = (endCount[id] || 0) + 1; continue; }
  if (s.type === 'actend') {
    const e = (s.endOf || ST.actEndingOf)(S); actEnds[e] = (actEnds[e] || 0) + 1; atActEnd.push(S);
    if (s.nextScene) { stack.push([s.nextScene, { ...S, flags: { ...S.flags }, ends: S.ends.concat(e) }]); continue; }
    finals.push(S); continue;
  }
  const opts = (s.choices || s.answers || []).filter((c) => !c.cond || c.cond(S)).concat(s.timer && !opt.story ? [{ next: s.timer.next }] : []);
  if (!opts.length) { console.log('CẢNH CỤT (không có lựa chọn nào hiện ra)', id); err++; }
  for (const c of opts) {
    const T = { ...S, flags: { ...S.flags }, ends: S.ends.slice() };
    if (c.flags) Object.assign(T.flags, c.flags);
    apply(T, c.effects);
    let n = typeof c.next === 'function' ? c.next(T) : c.next; const t = sc[n];
    apply(T, t.effects);
    if (t.flags) Object.assign(T.flags, t.flags);
    const f = statFail(T);
    if (f && t.type !== 'ending') n = f;
    stack.push([n, T]);
  }
}
const rng = (list, k) => list.reduce((a, S) => [Math.min(a[0], S[k]), Math.max(a[1], S[k])], [999, -999]);
console.log('Trạng thái khác nhau đã duyệt:', states, opt.story ? '(chế độ đọc truyện)' : '', opt.profile ? '(có Mã hồ sơ: ' + opt.profile + ')' : '');
console.log('Kết thúc chạm tới (số trạng thái):', endCount);
console.log('Kết màn:', actEnds);
console.log('Chỉ số khi tới kết màn gần nhất ', KEYS.map((k) => k + ' ' + JSON.stringify(rng(atActEnd, k))).join('  '));
const allClues = new Set(); Object.values(sc).forEach((x) => (x.gain && x.gain.clues || []).forEach((c) => allClues.add(c)));
const listed = ST.endingsList.map((e) => e.id), reached = Object.keys(endCount).concat(Object.keys(actEnds));
console.log('Manh mối:', allClues.size, '· Luật:', Object.keys(ST.rules).length, '· Kết thúc liệt kê:', listed.length);
const miss = listed.filter((e) => !reached.includes(e));
console.log('Kết thúc liệt kê nhưng chưa tới được:', miss);
if (opt.strict && miss.length) err += miss.length;
console.log('Lỗi:', err);
process.exitCode = err ? 1 : 0;
