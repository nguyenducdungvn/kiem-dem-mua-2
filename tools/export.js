// Xuất kịch bản một tập ra Markdown để đọc duyệt.
// Dùng: node tools/export.js tap-1/story-act1.js > docs/tap-1/kich-ban-xuat.md
const fs = require('fs'), vm = require('vm'); const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
process.argv.slice(2).forEach((f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx)); const ST = ctx.STORY, sc = ST.scenes, STATS = ST.stats;
const fx = (e) => (e ? Object.entries(e).map(([k, v]) => `${STATS[k] ? STATS[k].label : k} ${v > 0 ? '+' : ''}${v}`).join(' · ') : '');
const S0 = { flags: { m1_co_ma: true, m1_ghi_su_that: true, m1_cong_khai: true, m1_tho_ra: true } }; Object.keys(STATS).forEach((k) => { S0[k] = STATS[k].start; });
let md = `# ${ST.meta.fullTitle} · kịch bản xuất tự động (v${ST.meta.version})\n\n> Xuất từ file story. Sửa truyện thì sửa file .js rồi chạy lại \`node tools/export.js\`.\n\n`;
md += '## Luật\n\n| Mã | Nội dung | Nguồn |\n|---|---|---|\n' + Object.entries(ST.rules).map(([k, r]) => `| ${k} | ${r.text} | ${r.sources.join(', ')}${r.note ? ' · ' + r.note : ''} |`).join('\n') + '\n\n## Cảnh\n';
for (const [id, s] of Object.entries(sc)) {
  if (s.type === 'actend') { md += `\n### ■ ${s.title}\n\nTiếp theo: ${s.next}. ${s.teaser || ''}\n\n---\n`; continue; }
  md += `\n### ${s.type === 'ending' ? '💀 KẾT THÚC: ' : ''}${s.title}${s.time ? ` · ${s.time}` : ''}\n<sub>\`${id}\`</sub>\n\n`;
  const t = typeof s.text === 'function' ? s.text(S0) : s.text;
  if (typeof s.text === 'function') md += '*(Một số đoạn chỉ hiện ra tùy lựa chọn trước đó hoặc Mã hồ sơ Mùa 1. Bản xuất này giả định đã nhập mã.)*\n\n';
  t.forEach((p) => { md += `${p}\n\n`; });
  if (s.effects) md += `**Chỉ số:** ${fx(s.effects)}\n\n`;
  if (s.gain && s.gain.rules) md += `**Nhận luật:** ${s.gain.rules.join(', ')}\n\n`;
  if (s.gain && s.gain.clues) md += `**Manh mối:** ${s.gain.clues.join(' / ')}\n\n`;
  if (s.timer) md += `**Đồng hồ:** ${s.timer.sec} giây (${s.timer.label}). Hết giờ → \`${s.timer.next}\`\n\n`;
  if (s.flags) md += `**Cờ:** ${Object.keys(s.flags).join(', ')}\n\n`;
  if (s.inspect) { md += '**Ký hiệu:**\n\n'; for (const v of Object.values(s.inspect)) md += `- ${v}\n`; md += '\n'; }
  const opts = s.choices || s.answers || [];
  if (opts.length > 1 || s.answers) { md += '**Lựa chọn:**\n\n'; opts.forEach((c) => { md += `- ${c.key ? c.key + '. ' : ''}${typeof c.text === 'function' ? c.text(S0) : c.text}${c.cond ? ' *(có điều kiện)*' : ''}${c.effects ? ' [' + fx(c.effects) + ']' : ''} → \`${typeof c.next === 'function' ? 'tùy trạng thái' : c.next}\`\n`; }); md += '\n'; }
  md += '---\n';
}
process.stdout.write(md);
