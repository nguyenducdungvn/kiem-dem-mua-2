/* =========================================================
   KIỂM ĐẾM CA ĐÊM · MÙA 2 · TẬP 1: BÃI BỒI
   Màn 1: "Con nước" (21:40 – 01:10)
   Cấu trúc cảnh giống Mùa 1: time, title, text (mảng hoặc hàm(S)), gain, checkpoint,
   choices / puzzle (svg + inspect + answers) / ending / actend.
   Chỉ số riêng của tập: MN (Mực nước), khai báo trong STORY.stats.
   ========================================================= */

window.STORY = window.STORY || {};

STORY.meta = {
  season: 2, episode: 1,
  title: 'Bãi Bồi',
  fullTitle: 'Kiểm Đếm Ca Đêm · Mùa 2 · Tập 1: Bãi Bồi',
  brand: 'Kiểm Đếm Ca Đêm · Bãi Bồi',
  act: 'Màn 1 · Con nước',
  version: '2.0.0-alpha.1',
  keyPrefix: 'kd2_t1',
  characters: ['Thục Anh', 'Bà Tư', 'Anh Sáu', 'Cô Lành', 'Anh Quý', 'Người giữ sổ', 'Chính dòng sông'],
  menu: {
    kicker: 'Mùa 2 · Phiếu Bàn Giao · Tập 1',
    title: 'Bãi Bồi',
    sub: 'Làng Cồn Lở · Màn 1: Con nước',
    hook: [
      'Làng Cồn Lở phải di dời vì sạt lở. Đêm nay là đêm cuối: bạn phải đo bàn giao thửa đất bến đò của bà Tư trước khi khúc bờ ấy bị nước nuốt.',
      'Nhưng ở Cồn Lở, đất đi theo con nước. Cọc mốc cắm ban ngày thì đêm trôi mất, diện tích trên tablet đổi theo từng phút, và những lời dặn khắc trên cọc tre nói một điều rất lạ: đừng đo khi nước đứng.'
    ],
    q: 'Con số nào mới là đất thật: con số lúc nước lên, hay con số lúc nước rút?',
    facts: ['Khoảng 15 phút · Màn 1/3', 'Lựa chọn có hậu quả']
  },
  journal: {
    title: 'Sổ tay kiểm đếm · Cồn Lở',
    rulesTitle: 'Lời dặn khắc trên cọc tre và mái tôn',
    rulesNote: 'Lời dặn càng nhiều nơi cùng khắc thì càng đáng tin. Lời dặn không rõ nguồn thì nên nghi.',
    ruleToast: 'Lời dặn mới:',
    sourceText: (n, list) => n + ' nơi cùng ghi: ' + list.join(', ')
  },
  share: (title, got, total) => `Mình vừa mở kết thúc “${title}” trong Kiểm Đếm Ca Đêm · Mùa 2 · Tập 1: Bãi Bồi (${got}/${total}). Bạn có đo đất lúc nước đứng không?`,
  finalTitle: 'Cảm ơn bạn đã đi cùng Cồn Lở đến cuối'
};

/* ---------- Chỉ số: ba chỉ số chung của mùa + Mực nước riêng của Tập 1 ---------- */
STORY.stats = {
  TT: { label: 'Tỉnh táo', start: 70, min: 0, max: 100, cls: 'tt', good: 'up', warn: { lt: 40 }, fail: { le: 0, ending: 't1_dem_song' }, story: { min: 1 }, tip: 'Tỉnh táo: dưới 40 bắt đầu ảo giác, về 0 là thua' },
  TC: { label: 'Tin cậy', start: 50, min: 0, max: 100, cls: 'tc', good: 'up', warn: { lt: 30 }, tip: 'Tin cậy của người làng và đồng đội' },
  DN: { label: 'Độ neo', start: 0, min: 0, max: 100, cls: 'dn', good: 'down', warn: { ge: 30 }, fail: { ge: 60, ending: 't1_lang_duoi_song' }, story: { max: 59 }, tip: 'Độ neo: dòng sông giữ bạn lại. Từ 60 trở lên là thua' },
  MN: { label: 'Mực nước', start: 2, min: 0, max: 10, show: 'pips', cls: 'mn', good: 'down', warn: { ge: 7 }, fail: { ge: 10, ending: 't1_nuoc_len' }, story: { max: 9 }, fmt: (v) => v + '/10', tip: 'Mực nước: dòng sông lấn dần vào chỗ bạn đứng. Chạm vạch 10 là thua. Chần chừ và đo sai đều làm nước lên' }
};

STORY.acts = [
  { n: 1, name: 'Màn 1 · Con nước', time: '21:40 – 01:10', scene: 't1_mo' },
  { n: 2, name: 'Màn 2 · Nước ròng', time: '01:10 – 03:30', soon: true },
  { n: 3, name: 'Màn 3 · Bàn giao', time: '03:30 – 06:00', soon: true }
];

/* ---------- Lời dặn (luật) ---------- */
STORY.rules = {
  R1: { text: 'Đừng đo khi nước đứng.', sources: ['lời bà Tư', 'cọc số 3', 'mái nhà số 9'] },
  R2: { text: 'Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng.', sources: ['mái điểm trường', 'cọc số 11'] },
  R3: { text: 'Đất trôi, nước trôi, cây gạo thì không. Lạc mốc thì hỏi ba cây gạo.', sources: ['cọc số 6', 'gốc gạo Miếu'] },
  R4: { text: 'Bảng đen còn chữ thì đừng xóa.', sources: ['cửa lớp Một', 'mái nhà số 2'] },
  R5: { text: 'Đo lúc nước cạn nhất thì được nhiều đất nhất.', sources: ['?'], note: 'Mực tím, viết thêm vào bảng con nước. Ký: Người giữ sổ.' }
};

/* ---------- Sổ đo xuyên mùa: mỗi tập mở một trang ---------- */
STORY.notebook = (S) => [
  { title: 'Bìa sổ', open: true, text: 'Sổ đo của Lương Thục Anh, dùng từ đêm ở nhà B4. Sau buổi bàn giao, cô thấy bốn trang cuối bị dán kín bằng hồ gạo. Trên mỗi trang có một dòng bút chì, nét chữ của ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu.' },
  { title: 'Trang Cồn Lở', open: !!S.flags.mo_trang_1, text: '' },
  { title: 'Trang Chợ Sớm', open: false, text: '' },
  { title: 'Trang Ca Ba', open: false, text: '' },
  { title: 'Trang Con Dấu', open: false, text: '' }
];

/* ---------- Diện tích thửa 112 theo cách đo ---------- */
const AREA_DAY = '214,0';
const areaOf = (s) => (s.flags.theo_muc_tim ? '233,8' : s.flags.moc_gps ? '201,9' : '196,4');
STORY.areaOf = areaOf;

/* ---------- Hình vẽ cho mini-game ---------- */
const PAPER_DEFS = `
<defs>
  <pattern id="kd2-lines" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 23.5H24" stroke="#d3c7a8" stroke-width="1"/></pattern>
  <filter id="kd2-ink"><feTurbulence baseFrequency="0.9" numOctaves="1" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.2"/></filter>
</defs>
<rect width="100%" height="100%" fill="#efe7d2"/>
<rect width="100%" height="100%" fill="url(#kd2-lines)"/>`;
const SANS = "'Be Vietnam Pro', Arial, sans-serif";
const NUM = "'Roboto Mono', monospace";

// Bảng con nước trạm Cồn Lở, đêm 23 rạng 24
const TIDE = [
  ['21:00', 1.9, 'lớn'], ['22:00', 2.2, 'đứng'], ['23:00', 2.1, 'ròng'], ['00:00', 1.7, 'ròng'],
  ['01:00', 1.0, 'ròng mạnh'], ['02:00', 0.5, 'ròng'], ['03:00', 0.3, 'đứng'], ['04:00', 0.6, 'lớn']
];
const SVG_P1 = (() => {
  const x0 = 34, y0 = 78, rh = 34;
  const hit = { '22:00': 'H22', '00:00': 'H00', '01:00': 'H01', '03:00': 'H03' };
  let rows = '';
  TIDE.forEach(([h, m, c], i) => {
    const y = y0 + i * rh;
    const id = hit[h];
    rows += `<g${id ? ` class="hit" data-id="${id}"` : ''}>
      <rect x="${x0}" y="${y}" width="330" height="${rh}" fill="${id ? '#fff8e6' : 'transparent'}" stroke="#b8ad92"/>
      <text x="${x0 + 12}" y="${y + 23}" font-family="${NUM}" font-size="16" fill="#2a251c">${h}</text>
      <text x="${x0 + 112}" y="${y + 23}" font-family="${NUM}" font-size="16" fill="#2a251c">${m.toFixed(1).replace('.', ',')} m</text>
      <text x="${x0 + 212}" y="${y + 23}" font-family="${SANS}" font-size="15" fill="#2a251c">${c}</text>
    </g>`;
  });
  // đường cong mực nước
  const gx = 394, gw = 220, gy = 90, gh = 210;
  const pts = TIDE.map(([, m], i) => `${gx + (i / (TIDE.length - 1)) * gw},${gy + gh - (m / 2.4) * gh}`).join(' ');
  const px = (i) => gx + (i / (TIDE.length - 1)) * gw, py = (m) => gy + gh - (m / 2.4) * gh;
  return `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảng con nước trạm Cồn Lở">
${PAPER_DEFS}
<text x="34" y="34" font-family="${SANS}" font-size="17" font-weight="700" fill="#2a251c">Bảng con nước · Trạm Cồn Lở · đêm 23 rạng 24</text>
<text x="34" y="58" font-family="${SANS}" font-size="13" fill="#6b5a3a">Giờ</text>
<text x="146" y="58" font-family="${SANS}" font-size="13" fill="#6b5a3a">Mực nước</text>
<text x="246" y="58" font-family="${SANS}" font-size="13" fill="#6b5a3a">Con nước</text>
${rows}
<rect x="${gx - 10}" y="${gy - 14}" width="${gw + 26}" height="${gh + 40}" fill="#f6efdc" stroke="#b8ad92"/>
<polyline points="${pts}" fill="none" stroke="#2f6f8f" stroke-width="3" stroke-linejoin="round"/>
${TIDE.map(([h, m], i) => `<circle cx="${px(i)}" cy="${py(m)}" r="4" fill="#2f6f8f"/><text x="${px(i)}" y="${gy + gh + 18}" text-anchor="middle" font-family="${NUM}" font-size="10" fill="#6b5a3a">${h.slice(0, 2)}</text>`).join('')}
<text x="${px(1)}" y="${py(2.2) - 10}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="#2f6f8f">đỉnh</text>
<text x="${px(6)}" y="${py(0.3) + 22}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="#2f6f8f">chân</text>
<!-- phấn của bà Tư -->
<text x="${x0 + 336}" y="${y0 + 4 * rh + 23}" font-family="${SANS}" font-size="14" font-style="italic" fill="#8a5a1c">← giờ này đất nói thật</text>
<!-- mực tím -->
<path d="M${x0 + 300} ${y0 + 6 * rh + 30} q 30 18 70 8" stroke="#6a2fa0" stroke-width="2" fill="none"/>
<text x="${x0 + 18}" y="${y0 + 8 * rh + 24}" font-family="${SANS}" font-size="14" font-style="italic" fill="#6a2fa0">Đo lúc nước cạn nhất thì được nhiều đất nhất. · Người giữ sổ</text>
</svg>`;
})();

// Sơ đồ giao hội từ ba cây gạo
const SVG_P2 = (() => {
  const G1 = [110, 300], G2 = [318, 340], G3 = [568, 292];
  const A = [330, 172], B = [362, 214], C = [396, 120], D = [236, 152];
  const ray = (from, through, len, color, dash) => {
    const dx = through[0] - from[0], dy = through[1] - from[1], L = Math.hypot(dx, dy);
    const ex = from[0] + dx / L * len, ey = from[1] + dy / L * len;
    return `<line x1="${from[0]}" y1="${from[1]}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${color}" stroke-width="2" ${dash ? 'stroke-dasharray="7 5"' : ''}/>`;
  };
  const tree = (p, id, name, lx) => `<g class="hit" data-id="${id}">
    <circle cx="${p[0]}" cy="${p[1]}" r="20" fill="#c7d8b4" stroke="#4d6b3a" stroke-width="2"/>
    <circle cx="${p[0] - 6}" cy="${p[1] - 5}" r="4" fill="#c0392b"/><circle cx="${p[0] + 7}" cy="${p[1] + 3}" r="4" fill="#c0392b"/><circle cx="${p[0] + 1}" cy="${p[1] + 9}" r="3" fill="#c0392b"/>
  </g><text x="${p[0] + (lx || 0)}" y="${p[1] + 40}" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="600" fill="#2a3a20">${name}</text>`;
  const pt = (p, id, label, fill) => `<g class="hit" data-id="${id}"><circle cx="${p[0]}" cy="${p[1]}" r="13" fill="${fill}" fill-opacity="0.25" stroke="#2a251c" stroke-width="2"/><circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#2a251c"/></g>
    <text x="${p[0] + 16}" y="${p[1] - 10}" font-family="${SANS}" font-size="16" font-weight="700" fill="#2a251c">${label}</text>`;
  return `<svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ giao hội từ ba cây gạo">
${PAPER_DEFS}
<path d="M0 30 H640 V128 C560 140 500 150 430 146 C360 142 300 160 230 150 C160 140 80 146 0 136 Z" fill="#b9d3dc" stroke="#5f8fa0" stroke-width="1.5"/>
<text x="24" y="58" font-family="${SANS}" font-size="14" fill="#2f5f70">Sông · nước đang ròng</text>
<path d="M600 70 h-70 m10 -8 l-10 8 l10 8" stroke="#2f5f70" stroke-width="2" fill="none"/>
<text x="24" y="408" font-family="${SANS}" font-size="12" fill="#6b5a3a">Tia mực xanh: biên bản đo năm 2007. Tia mực tím: ai đó viết đè lên góc của gạo Miếu.</text>
${ray(G1, A, 300, '#2f5f8f', true)}
${ray(G3, A, 300, '#2f5f8f', true)}
${ray(G2, A, 260, '#2f5f8f', true)}
${ray(G2, C, 300, '#6a2fa0', true)}
${tree(G1, 'G1', 'Gạo Đầu bến')}
${tree(G2, 'G2', 'Gạo Miếu')}
${tree(G3, 'G3', 'Gạo Trường', -10)}
${pt(A, 'PA', 'A', '#2f5f8f')}
${pt(B, 'PB', 'B', '#e0a020')}
${pt(C, 'PC', 'C', '#6a2fa0')}
${pt(D, 'PD', 'D', '#c05030')}
<rect x="${B[0] + 18}" y="${B[1] + 4}" width="12" height="20" rx="2" fill="none" stroke="#8a6a20" stroke-width="2"/>
<path d="M${D[0] - 6} ${D[1] + 16} v-28" stroke="#6b4a1e" stroke-width="3"/>
</svg>`;
})();

/* ---------- Cảnh ---------- */
STORY.start = 't1_mo';

STORY.scenes = {

  /* ===== 21:40 · Chuyến đò cuối ===== */
  t1_mo: {
    time: '21:40',
    title: 'Chuyến đò cuối',
    act: 'Màn 1 · Con nước',
    text: (s) => {
      const f = s.flags;
      const t = [
        'Bà Tư chèo đò bằng một mái, đứng, nhịp đều như người ta thở. Bốn mươi năm bà chở học trò qua khúc sông này. Đêm nay bà chở một mình bạn, chuyến cuối.',
        'Trong ba lô của bạn có tablet của Trung tâm Phát triển quỹ đất tỉnh Hòa Giang, máy đo laser, cây sào nhôm, và cuốn sổ đo cũ từ đêm ở nhà B4. Nhiệm vụ: đo bàn giao thửa 112, đất bến đò nhà bà Tư, trước sáu giờ sáng. Sau sáu giờ, khúc bờ ấy thuộc về dự án kè, và về dòng sông.'
      ];
      if (f.m1_co_ma) {
        if (f.m1_ghi_su_that) t.push('Bà Tư nhìn bạn lâu hơn mức cần thiết. “Cô là người ghi cái số thật ở chung cư ngoài tỉnh hả? Ở bển người ta kể. Vậy thì được.”');
        else if (f.m1_cong_khai) t.push('Bà Tư hỏi bạn có phải “cô áo xanh trên điện thoại” không. Cháu nội bà coi cái livestream ở nhà B4, coi tới sáng.');
        else t.push('Bà Tư không hỏi gì về nhà B4, dù cả tỉnh đều biết chuyện. Bà chỉ hỏi bạn có biết bơi không.');
        if (f.m1_tho_ra) t.push('Điện thoại rung. Út Thơ nhắn: “Chị đi Cồn Lở hả? Quay giùm em cái bến đò nha. Mà đừng quay lúc nước đứng, em đọc trên mạng người ta dặn vậy.”');
      }
      t.push('Giữa dòng, bà Tư ngừng chèo. Mặt nước phẳng như tấm kính. “Nước đang lớn, chút nữa nó đứng,” bà nói. “Cô nhớ nghen: đừng đo khi nước đứng.”');
      t.push('Bà cởi chiếc áo phao cam duy nhất trên đò, chìa cho bạn. Bà không mặc gì ngoài bộ bà ba đã bạc màu.');
      return t;
    },
    choices: [
      { key: 'A', text: 'Cảm ơn bà, mặc áo phao vào', next: 't1_mac_ao', flags: { mac_ao_phao: true } },
      { key: 'B', text: 'Đẩy lại cho bà: “Bà chèo, bà mặc đi”', next: 't1_nhuong_ao', flags: { nhuong_ao_phao: true } }
    ]
  },

  t1_mac_ao: {
    time: '21:45',
    title: 'Áo phao',
    text: [
      'Áo phao còn ấm, mùi khói bếp và dầu gió. Bà Tư cười, lần đầu tiên trong đêm. “Học trò của tui đứa nào cũng chê cái áo này xấu. Mà đứa nào cũng mặc.”',
      'Đò cập bến. Trên bờ, một ngọn đèn pin quét qua quét lại.'
    ],
    effects: { TT: 5 },
    choices: [{ text: 'Lên bờ', next: 't1_bai' }]
  },

  t1_nhuong_ao: {
    time: '21:45',
    title: 'Áo phao',
    text: [
      'Bà Tư nhìn chiếc áo trong tay bạn, rồi nhìn bạn. “Bốn mươi năm tui chưa mặc nó lần nào. Nước sông này biết mặt tui.” Nhưng bà vẫn khoác nó lên vai, không cài.',
      '“Cô tốt bụng,” bà nói nhỏ, như nói với mặt nước. “Đêm nay đừng tốt bụng quá.”',
      'Đò cập bến. Trên bờ, một ngọn đèn pin quét qua quét lại.'
    ],
    effects: { TC: 5 },
    choices: [{ text: 'Lên bờ', next: 't1_bai' }]
  },

  /* ===== 21:55 · Mười bốn cọc tre ===== */
  t1_bai: {
    time: '21:55',
    title: 'Mười bốn cọc tre',
    text: (s) => [
      'Anh Quý, cán bộ địa chính của xã Hòa Bồi mới sáp nhập, đón bạn với cái đèn bão và một xấp hồ sơ bọc ni lông. Sau lưng anh, anh Sáu, con trai bà Tư, đứng hút thuốc, áo sơ mi trắng còn nếp gấp của người mới từ thành phố về. Anh về để ký giấy cho má.',
      'Ban ngày, lúc 14:00, đội đo đã cắm mười bốn cọc tre quanh thửa 112. Hồ sơ ghi 214,0 m². Bây giờ chỉ còn mười một cọc đứng. Cọc số 7 ở góc tây nam đã mất, hai cọc nữa nằm nghiêng ngả trong nước.',
      'Bạn bật tablet. Con số diện tích nhảy liên tục: 214,0. 207,3. 219,8. 211,1. Như có ai đang kéo mép đất ra vào.',
      'Trên cọc số 3, ai đó khắc bằng dao, nét đã thâm đen: “Đừng đo khi nước đứng.” Bạn rọi đèn sang mái tôn căn nhà số 9 gần đó. Cũng dòng chữ ấy, sơn trắng, đã tróc.' + (s.flags.nhuong_ao_phao ? ' Bà Tư đứng dưới đò, tay giữ hờ chiếc áo phao cam, nhìn bạn đọc.' : '')
    ],
    effects: { MN: 1 },
    gain: { rules: ['R1'], clues: ['Diện tích thửa 112 trên tablet thay đổi theo từng phút, như mép đất đi theo con nước.'] },
    choices: [{ text: '…', next: 't1_nut1' }]
  },

  /* ===== NÚT 1 · 22:00 ===== */
  t1_nut1: {
    time: '22:00',
    title: 'Nút 1 · Nước đứng',
    checkpoint: true,
    danger: true,
    timer: { sec: 25, next: 't1_n1_het_gio', label: 'Nước đang đứng' },
    text: [
      'Tiếng nước vỗ bờ tắt hẳn. Dòng sông đứng lại, không xuôi, không ngược, phẳng lì dưới trăng. Lần đầu tiên trong đêm, con số trên tablet đứng yên: 214,0 m². Khớp từng số lẻ với hồ sơ ban ngày.',
      '“Trời thương rồi,” anh Quý reo. “Nước đứng là đo chuẩn nhất, sào không bị dòng kéo. Mình đo liền đi chị, ký xong là anh Sáu kịp chuyến xe năm giờ.”',
      'Anh Sáu dụi thuốc, gật đầu. Bà Tư dưới đò không nói gì. Bà đã quay lưng lại phía bờ.'
    ],
    choices: [
      { key: 'A', text: 'Đo ngay: mặt nước phẳng, số liệu khớp, mọi người được về sớm', next: 't1_nuoc_dung' },
      { key: 'B', text: 'Xin bảng con nước của trạm, tìm giờ đo cho đúng', next: 't1_p1' },
      { key: 'C', text: 'Không đo lại nữa: lấy luôn số đo lúc 14:00 và mời mọi người ký', next: 't1_n1C', flags: { dung_so_ngay: true } }
    ]
  },

  t1_n1_het_gio: {
    time: '22:01',
    title: 'Chần chừ',
    text: [
      'Bạn còn đang đứng nhìn mặt nước thì anh Quý đã cầm sào lội xuống. Nước ngập tới gối anh mà không gợn một vòng sóng nào.',
      'Bạn chụp lấy cổ áo anh lôi lên. Anh Quý cáu, rồi im bặt khi thấy chỗ anh vừa đứng: nước ở đó sâu hơn lúc nãy cả gang tay, dù không có con sóng nào.',
      'Anh Sáu lặng lẽ đưa bạn cái bảng con nước dán trong chòi trạm, giấy đã ố vàng.'
    ],
    effects: { TT: -10, MN: 1 },
    choices: [{ text: 'Đọc bảng con nước', next: 't1_p1' }]
  },

  t1_n1C: {
    time: '22:05',
    title: 'Số đo lúc 14:00',
    text: [
      'Anh Quý mừng ra mặt, rút bút. Anh Sáu ký ngay, nét chữ vội. Đến lượt bà Tư, bà không lên bờ.',
      '“Cô ký thì ký. Tui không ký,” bà nói từ dưới đò. “Đất nhà tui còn một miếng dưới sông. Chưa ai đo nó.”',
      'Anh Quý thở dài. Thiếu chữ ký của chủ hộ thì hồ sơ không xong, đội vẫn phải đo lại trước sáu giờ. Không ai nhìn bạn, nhưng ai cũng biết bạn vừa định ký thay một con số mình chưa đo.',
      'Mép nước nhích lên một vạch trên cọc số 3. Anh Sáu lặng lẽ đưa bạn cái bảng con nước dán trong chòi trạm.'
    ],
    effects: { DN: 10, TC: -5, MN: 1 },
    choices: [{ text: 'Đọc bảng con nước', next: 't1_p1' }]
  },

  t1_p1: {
    time: '22:05',
    title: 'Bảng con nước',
    type: 'puzzle',
    paper: true,
    timer: { sec: 45, next: 't1_p1_tre', label: 'Anh Quý sắp lội xuống đo' },
    text: ['Bảng con nước của trạm Cồn Lở, chép tay. Chạm vào các dòng có tô nền để xem kỹ, rồi chọn giờ đo. Nhớ lời dặn trên cọc số 3.'],
    prompt: 'Chạm vào một dòng có tô nền để xem ghi chú.',
    svg: SVG_P1,
    gain: { rules: ['R5'] },
    inspect: {
      H22: '22:00 · 2,2 m · nước đứng (đỉnh triều). Đúng lúc này. Mặt sông phẳng như gương, sào không bị dòng kéo.',
      H00: '00:00 · 1,7 m · nước bắt đầu ròng, còn yếu. Mép bờ vẫn ngập một dải dài.',
      H01: '01:00 · 1,0 m · nước ròng mạnh. Bên lề có nét phấn của bà Tư: “giờ này đất nói thật”.',
      H03: '03:00 · 0,3 m · nước đứng (chân triều). Bãi lộ ra rộng nhất. Dòng mực tím ở chân bảng chỉ vào giờ này, ký tên Người giữ sổ.'
    },
    answers: [
      { text: 'Đo lúc 22:00, ngay bây giờ', next: 't1_nuoc_dung' },
      { text: 'Đo lúc 00:00, khi nước vừa ròng', next: 't1_p1_som' },
      { text: 'Đo lúc 01:00, khi nước ròng mạnh', next: 't1_p1_dung' },
      { text: 'Đo lúc 03:00, khi bãi lộ rộng nhất', next: 't1_p1_3h', flags: { tin_muc_tim: true } }
    ]
  },

  t1_p1_tre: {
    time: '22:07',
    title: 'Nước đứng lâu quá',
    text: [
      'Bạn còn dò từng dòng thì anh Quý đã cắm sào xuống mép nước. Cây sào không nghiêng, không rung, cắm thẳng như cắm vào sáp. Anh rút không lên.',
      'Bà Tư chống mái chèo nhảy lên bờ, nhanh hơn một bà già bảy mươi tuổi có thể nhanh. Bà đạp gãy cây sào ngang mặt nước. “Tui nói rồi. Nước đứng là nó đang nghe.”',
      'Bà gõ ngón tay lên dòng 01:00 trên bảng, chỗ có nét phấn của bà. “Giờ này.”'
    ],
    effects: { TT: -15, MN: 1 },
    gain: { clues: ['Lúc nước đứng, cây sào cắm xuống mép nước không rút lên được, như cắm vào sáp.'] },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_sau' }]
  },

  t1_p1_som: {
    time: '22:10',
    title: 'Hẹn lúc 00:00',
    text: [
      'Bạn khoanh giờ 00:00. Nước vừa ròng, đo sớm thì mọi người được về sớm.',
      'Bà Tư nhìn tờ bảng qua vai bạn, chép miệng. “Mười hai giờ nước mới trở mình. Mép đất còn nằm dưới nước. Cô đo lúc đó là đo thiếu.” Bà gõ ngón tay lên dòng 01:00. “Giờ này.”',
      'Anh Quý ngẩn ra: bảng ghi rõ “ròng” cả hai giờ. Nhưng anh không cãi. Anh đã thấy cây sào của mình lúc nãy cắm xuống chỗ nước đứng.'
    ],
    effects: { TT: -5, MN: 1 },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_sau' }]
  },

  t1_p1_dung: {
    time: '22:10',
    title: 'Giờ đất nói thật',
    text: [
      'Bạn khoanh giờ 01:00. Nước ròng mạnh, mép đất lộ ra mà chưa kịp đứng lại. Bà Tư gật đầu, rất khẽ.',
      '“Ông nhà tui dạy vậy,” bà nói. “Nước lên thì đất giả bộ nhỏ, nước đứng thì đất giả bộ to. Nước đang rút thì đất không kịp giả bộ.”',
      'Anh Quý xem đồng hồ, tính nhẩm. Ba tiếng nữa, đo xong vẫn kịp làm hồ sơ trước sáu giờ. Anh lấy trong cặp ra một tập giấy cũ. “Vậy tranh thủ kiểm đếm điểm trường luôn chị.”'
    ],
    effects: { TC: 10, TT: 5 },
    gain: { clues: ['Bà Tư: nước lên thì đất giả bộ nhỏ, nước đứng thì đất giả bộ to. Nước đang rút thì đất không kịp giả bộ.'] },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_sau' }]
  },

  t1_p1_3h: {
    time: '22:10',
    title: 'Dòng mực tím',
    text: [
      'Bạn khoanh giờ 03:00. Lúc đó bãi lộ rộng nhất, thửa đất của bà Tư sẽ lớn nhất, tiền đền bù cũng nhiều nhất. Dòng mực tím ở chân bảng nói vậy.',
      'Anh Quý lắc đầu: ba giờ sáng thì không kịp làm hồ sơ. Bà Tư thì không lắc đầu. Bà nhìn dòng mực tím rất lâu, như nhìn mặt một người quen.',
      '“Người giữ sổ,” bà đọc chậm từng chữ. “Năm đó cũng có người ký tên y vậy.” Rồi bà gõ ngón tay lên dòng 01:00. “Đo giờ này. Đừng nghe cái mực đó.”',
      'Bạn gạch giờ 03:00 đi. Vết mực tím vẫn dính trên đầu ngón tay bạn, rửa không trôi.'
    ],
    effects: { DN: 10, MN: 1 },
    gain: { clues: ['Bà Tư từng thấy chữ ký “Người giữ sổ”. Bà nói: năm đó cũng có người ký tên y vậy.'] },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_sau' }]
  },

  /* ===== 22:20 · Khoảnh khắc nhân vật: anh Sáu ===== */
  t1_sau: {
    time: '22:20',
    title: 'Anh Sáu',
    text: [
      'Anh Sáu ngồi trên bậc đá của bến, châm điếu thuốc thứ năm. Anh đưa bạn xem điện thoại: một căn hộ 42 m² ở khu tái định cư ngoài thị trấn, có thang máy, có ban công. “Tui mua cho má rồi. Má chỉ cần ký.”',
      '“Má tui nói còn một thửa nữa dưới sông,” anh cười, cái cười mệt. “Hai mươi năm nay má nói vậy. Năm 2007 nhà tui lở xuống sông một khúc. Cái nhà cũ, cái bếp, cái cây khế. Xã lập biên bản rồi để đó. Má không chịu dọn lên chỗ mới, cứ ở cái chòi giữ bến này.”',
      'Anh nhìn ra dòng sông đang đứng lặng. “Chị là người của tỉnh. Chị nói giùm tui một câu đi.”'
    ],
    choices: [
      { key: 'A', text: 'Hỏi thêm về thửa đất dưới sông năm 2007', next: 't1_sau_hoi', flags: { hoi_thua_song: true } },
      { key: 'B', text: 'Khuyên anh: cứ để má ký cho xong, chuyện cũ để sau', next: 't1_sau_khuyen', flags: { khuyen_ky: true } }
    ]
  },

  t1_sau_hoi: {
    time: '22:25',
    title: 'Thửa dưới sông',
    text: [
      'Anh Sáu ngạc nhiên vì có người hỏi thật. Anh kể: đêm lở đất năm 2007, má anh chèo đò chở mười bốn đứa học trò điểm trường về bên kia sông tránh lở. Lúc bà quay lại, cái nhà đã không còn. Chỉ còn ngọn đèn dầu trên cửa sổ, nổi giữa sông một lúc rồi tắt.',
      '“Biên bản ghi nhà tui lở 311 m². Có chữ ký của người đo, mà không ai biết người đó là ai. Hồ sơ đền bù cứ treo vậy tới giờ.”',
      'Anh dụi thuốc. “Chị hỏi vậy là má tui quý chị rồi đó. Má nghe hết.” Dưới đò, bà Tư không quay lại, nhưng đã thôi quay lưng.'
    ],
    effects: { TC: 5 },
    gain: { clues: ['Năm 2007, nhà bà Tư lở xuống sông 311 m². Biên bản có chữ ký người đo, nhưng không ai biết người đó là ai.'] },
    choices: [{ text: 'Đi kiểm đếm điểm trường', next: 't1_truong' }]
  },

  t1_sau_khuyen: {
    time: '22:25',
    title: 'Chuyện cũ để sau',
    text: [
      'Anh Sáu gật gù, thở ra một hơi dài như được ai gỡ giùm gánh nặng. “Phải. Chuyện cũ để sau. Má tui lớn tuổi rồi.”',
      'Dưới đò, mái chèo của bà Tư gõ một tiếng vào mạn, khô khốc. Bà không nói gì. Bạn thấy nhẹ người, và hơi xấu hổ vì thấy nhẹ người.'
    ],
    effects: { TT: 5, TC: -5 },
    choices: [{ text: 'Đi kiểm đếm điểm trường', next: 't1_truong' }]
  },

  /* ===== 22:50 · Điểm trường ===== */
  t1_truong: {
    time: '22:50',
    title: 'Điểm trường Cồn Lở',
    text: [
      'Điểm trường chỉ có hai phòng học, mái tôn, cột cờ rỉ sét. Cô Lành đã đợi sẵn với cây đèn sạc. Cô dạy ở đây mười một năm, đến khi điểm trường bị gộp về trường xã. Đêm nay cô đến để ký biên bản kiểm đếm tài sản: mười bốn bộ bàn ghế, một bảng đen, một cột cờ, một cái kẻng.',
      'Trên bảng đen lớp Một còn nguyên một bài vẽ phấn: “Bài 12. Quê em bên sông.” Học trò vẽ cả làng Cồn Lở, từng nóc nhà, ba cây gạo, cái bến đò. Ở chỗ mà bây giờ là giữa dòng, có một ngôi nhà nhỏ, kế bên ghi: “nhà bà Tư đò”.',
      'Anh Quý gọi với vào: “Chị chụp hiện trạng thì xóa bảng giùm em, để hình cho sạch.” Trên khung cửa lớp Một, ai đó khắc: “Bảng đen còn chữ thì đừng xóa.” Trên mái tôn, chỗ đèn của bạn quét qua, có một dòng sơn khác: “Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng.”'
    ],
    gain: { rules: ['R4', 'R2'] },
    choices: [
      { key: 'A', text: 'Chụp nguyên bảng đen, không xóa', next: 't1_bang_giu', flags: { giu_bang: true } },
      { key: 'B', text: 'Xóa bảng như anh Quý dặn, cho ảnh hiện trạng sạch', next: 't1_bang_xoa', flags: { xoa_bang: true } }
    ]
  },

  t1_bang_giu: {
    time: '22:55',
    title: 'Quê em bên sông',
    text: [
      'Bạn chụp tấm bảng đen. Cô Lành đứng sau lưng bạn, khẽ chỉ: “Bài này tụi nhỏ vẽ tuần trước khi lở đất. Năm 2007. Không ai trong trường nỡ xóa. Mười mấy năm nay, mỗi lần quét vôi, tụi tôi chừa tấm bảng ra.”',
      'Trên màn hình điện thoại, bạn đặt ảnh tấm bảng chồng lên bản đồ địa chính. Ba cây gạo trong tranh trùng đúng ba cây gạo thật. Và ngôi nhà “bà Tư đò” nằm cách bờ hiện tại hơn hai chục mét, ngoài sông.'
    ],
    effects: { TC: 5 },
    gain: { clues: ['Bản đồ phấn của học trò năm 2007 trùng khớp ba cây gạo thật. Nhà bà Tư khi ấy nằm cách bờ hiện nay hơn 20 m, ngoài sông.'] },
    choices: [{ text: '…', next: 't1_nut2' }]
  },

  t1_bang_xoa: {
    time: '22:55',
    title: 'Bảng sạch',
    text: [
      'Bạn kéo giẻ qua tấm bảng. Phấn cũ không bám bụi như phấn mới. Nó ướt, và lạnh. Dưới lớp phấn bị xóa, mặt bảng sẫm lại thành một vệt dài giống mép nước.',
      'Cô Lành đứng sững ở cửa, không nói một lời. Ảnh hiện trạng rất sạch. Nhưng khi bạn mở lại ảnh, ở góc trên tấm bảng vẫn còn một ngôi nhà nhỏ bằng phấn, và một dòng chữ trẻ con: “nhà bà Tư đò”.',
      'Ngoài cửa sổ, nước sông nhích lên một vạch.'
    ],
    effects: { DN: 10, TT: -5, TC: -5, MN: 1 },
    gain: { clues: ['Xóa bảng rồi, ảnh chụp vẫn còn ngôi nhà phấn “nhà bà Tư đò”.'] },
    choices: [{ text: '…', next: 't1_nut2' }]
  },

  /* ===== NÚT 2 · 23:10 ===== */
  t1_nut2: {
    time: '23:10',
    title: 'Nút 2 · Đèn bờ bên kia',
    checkpoint: true,
    danger: true,
    timer: { sec: 20, next: 't1_n2_het_gio', label: 'Cô Lành đang chạy ra bến' },
    effects: { MN: 1 },
    text: [
      'Cái kẻng ngoài sân tự gõ ba tiếng. Không có gió.',
      'Bên kia sông, ngọn đèn ở bến Cồn Bồi, ngọn đèn mà bạn nhìn thấy suốt từ lúc lên bờ, vụt tắt. Cùng lúc đó, giữa dòng hiện lên một chiếc xuồng nhỏ có treo đèn bão. Trên xuồng có một người đội nón lá, khom lưng, giơ tay vẫy về phía bến.',
      '“Bà Tư!” cô Lành kêu lên. “Bà ra giữa sông làm gì giờ này?” Cô chạy ra bến, tháo dây chiếc xuồng của điểm trường.',
      'Trên mái tôn sau lưng bạn, dòng sơn trắng vẫn còn đó.'
    ],
    choices: [
      { key: 'A', text: 'Nhảy xuống xuồng chèo cùng cô Lành: người ta đang vẫy cứu', next: 't1_giua_dong' },
      { key: 'B', text: 'Kéo cô Lành lại, chỉ lên dòng chữ trên mái tôn', next: 't1_n2B' },
      { key: 'C', text: 'Gọi điện cho anh Sáu: má anh đang ở đâu?', next: 't1_n2C', cond: (s) => s.flags.hoi_thua_song || s.TC >= 65 }
    ]
  },

  t1_n2_het_gio: {
    time: '23:11',
    title: 'Dây xuồng',
    text: (s) => [
      'Cô Lành đã đẩy xuồng ra. Bạn lao theo, chụp được sợi dây ở đầu mũi, ngã sấp xuống bùn. Nước lạnh chạy vào cổ áo.' + (s.flags.mac_ao_phao ? ' Chiếc áo phao cam nổi bạn lên, kéo đầu bạn khỏi mặt nước.' : ' Bạn sặc một ngụm nước sông, tanh mùi phù sa và một mùi khác, như khói dầu hỏa.'),
      'Bạn giữ chặt sợi dây. Cô Lành ngoái lại, và lần đầu tiên cô thấy dòng chữ sơn trên mái tôn. Cô buông mái chèo.',
      'Giữa dòng, người đội nón lá ngừng vẫy. Chiếc xuồng có đèn bão chìm dần xuống, thẳng đứng, không một gợn sóng. Bên kia sông, ngọn đèn bến Cồn Bồi sáng lại.'
    ],
    effects: { TT: -15, MN: 2 },
    gain: { clues: ['Khi đèn bến Cồn Bồi tắt, giữa dòng hiện ra chiếc xuồng có đèn bão và một người đội nón lá. Đèn sáng lại thì xuồng chìm.'] },
    choices: [{ text: 'Lên bờ', next: 't1_bien_ban' }]
  },

  t1_n2B: {
    time: '23:12',
    title: 'Dòng sơn trên mái tôn',
    text: [
      'Bạn nắm cổ tay cô Lành, chĩa đèn pin lên mái tôn. Cô giằng ra, rồi đọc, rồi đứng im.',
      'Giữa dòng, người đội nón lá chậm rãi nhấc nón lên. Dưới nón không có mặt người, chỉ có ngọn đèn bão đang cháy. Chiếc xuồng chìm dần, thẳng đứng, không một gợn sóng. Bên kia sông, đèn bến Cồn Bồi sáng lại.',
      'Cô Lành ngồi thụp xuống bậc đá. “Đêm lở đất năm 2007, bà Tư chở mười bốn đứa học trò qua bờ bên kia. Tôi đứng ở bến bên kia cầm đèn đón. Đứa nào cũng về được.” Cô nói rất nhanh, như sợ mình quên. “Chỉ có cái nhà của bà là không về.”'
    ],
    effects: { TT: -5, TC: 5 },
    gain: { clues: ['Khi đèn bến Cồn Bồi tắt, giữa dòng hiện ra chiếc xuồng có đèn bão. Dưới nón lá không có mặt người, chỉ có ngọn đèn.'] },
    choices: [{ text: 'Đưa cô Lành về bến', next: 't1_bien_ban' }]
  },

  t1_n2C: {
    time: '23:12',
    title: 'Má anh đang ở đâu',
    text: [
      'Anh Sáu bắt máy ngay hồi chuông đầu. “Má tui ngồi kế tui nè, ở bến. Sao vậy chị?”',
      'Bạn nghe tiếng giành điện thoại, rồi giọng bà Tư, rất gần: “Đừng cho con Lành ra. Cái đó là cái nhà tui. Nó đi kiếm người đo nó.”',
      'Bạn kéo cô Lành lại đúng lúc mũi xuồng chạm nước. Giữa dòng, chiếc xuồng có đèn bão chìm dần, thẳng đứng. Đèn bến Cồn Bồi sáng lại. Cô Lành run, nhưng cô nắm tay bạn rất chặt.'
    ],
    effects: { TC: 10 },
    flags: { ba_tu_ke: true },
    gain: { clues: ['(Hiếm) Bà Tư gọi chiếc xuồng có đèn giữa sông là “cái nhà tui”, nó đi kiếm người đo nó.'] },
    choices: [{ text: 'Về bến', next: 't1_bien_ban' }]
  },

  /* ===== 23:40 · Biên bản năm 2007 ===== */
  t1_bien_ban: {
    time: '23:40',
    title: 'Biên bản năm 2007',
    text: (s) => [
      'Ở chòi trạm, anh Quý trải lên bàn tập giấy cũ anh mang từ kho lưu trữ của xã cũ. Trên cùng là biên bản sạt lở ngày 23 tháng 10 năm 2007, giấy than mờ, đóng dấu Ủy ban xã Cồn Lở.',
      '“Hộ bà Nguyễn Thị Tư. Diện tích bị sạt lở: 311,0 m². Đề nghị bồi thường, hỗ trợ theo quy định.” Dưới cùng, ở ô người đo, không có họ tên. Chỉ có một chữ ký bằng mực tím, và ba chữ viết tay: Người giữ sổ.',
      '“Em tra hết rồi,” anh Quý nói. “Xã không có ai tên vậy. Tỉnh cũng không. Mà cái chữ ký này,” anh lật tiếp, “có trong hồ sơ của ba xã khác nữa. Một cái chợ, một cái nhà máy dệt, và chính cái trụ sở xã cũ.”',
      'Bạn mở cuốn sổ đo của mình. Bốn trang cuối dán kín vẫn còn đó. Trang đầu tiên có dòng bút chì nét chữ ông Kha: “Cồn Lở”.' + (s.flags.tin_muc_tim ? ' Vết mực tím trên đầu ngón tay bạn bỗng ấm lên.' : '')
    ],
    gain: { clues: ['Biên bản sạt lở năm 2007 ghi nhà bà Tư mất 311,0 m², người đo ký bằng mực tím: “Người giữ sổ”. Chữ ký ấy còn có trong hồ sơ của một cái chợ, một nhà máy dệt và trụ sở xã cũ.'] },
    choices: [{ text: 'Ra kiểm tra cọc mốc trước giờ đo', next: 't1_nut3' }]
  },

  /* ===== NÚT 3 · 00:20 ===== */
  t1_nut3: {
    time: '00:20',
    title: 'Nút 3 · Cọc số 7',
    checkpoint: true,
    danger: true,
    timer: { sec: 25, next: 't1_n3_het_gio', label: 'Anh Quý đang cắm cọc' },
    effects: { MN: 1 },
    text: [
      'Nước bắt đầu ròng. Mặt sông chảy trở lại, kéo theo những bè lục bình đen sẫm. Còn bốn mươi phút nữa là đến giờ đo.',
      'Không có cọc số 7 ở góc tây nam thì không khép được thửa đất. Anh Quý giơ điện thoại: “Tọa độ cọc 7 lúc chiều đây chị. Mình cắm lại theo GPS, sai số chừng năm mét, hồ sơ chấp nhận được.” Theo điện thoại, chỗ đó giờ nằm hẳn trên bờ.',
      'Trên đầu cọc số 6 còn đứng, ai đó khắc: “Đất trôi, nước trôi, cây gạo thì không. Lạc mốc thì hỏi ba cây gạo.” Ba cây gạo cổ đứng sừng sững trong đêm, cây ở đầu bến, cây ở miếu, cây sau điểm trường.'
    ],
    gain: { rules: ['R3'] },
    choices: [
      { key: 'A', text: 'Cắm lại theo tọa độ điện thoại: nhanh, có số liệu, hồ sơ chấp nhận', next: 't1_n3A', flags: { moc_gps: true } },
      { key: 'B', text: 'Giao hội từ ba cây gạo để tìm lại đúng chỗ cọc 7', next: 't1_p2' },
      { key: 'C', text: 'Hỏi bà Tư: góc đất nhà bà ở đâu?', next: 't1_n3C', cond: (s) => s.flags.ba_tu_ke || s.flags.m1_ghi_su_that || s.TC >= 65 }
    ]
  },

  t1_n3_het_gio: {
    time: '00:21',
    title: 'Cọc mới',
    text: [
      'Anh Quý không đợi bạn. Anh đóng cọc mới xuống đúng tọa độ điện thoại, ba nhát búa, chắc nịch.',
      'Cây cọc mới nghiêng đi một chút ngay khi anh buông tay, như có ai dưới đất đẩy nhẹ. Anh Quý dựng nó lại. Nó lại nghiêng.'
    ],
    effects: { TT: -5, MN: 1 },
    flags: { moc_gps: true },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_ro' }]
  },

  t1_n3A: {
    time: '00:25',
    title: 'Theo tọa độ',
    text: [
      'Bạn gật đầu. Anh Quý đóng cọc mới xuống đúng tọa độ điện thoại, ba nhát búa, chắc nịch. Trên tablet, thửa 112 khép lại thành một hình đa giác gọn gàng.',
      'Cây cọc mới nghiêng đi một chút ngay khi anh buông tay, như có ai dưới đất đẩy nhẹ. Anh Quý dựng lại. Nó lại nghiêng, lần này về phía sông.'
    ],
    effects: { DN: 10, MN: 1 },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_ro' }]
  },

  t1_n3C: {
    time: '00:25',
    title: 'Góc nhà bà Tư',
    text: (s) => [
      (s.flags.m1_ghi_su_that && !s.flags.ba_tu_ke ? 'Bà Tư nhìn bạn một lúc. “Cô là người ghi số thật ở bển. Tui chỉ cô.” ' : '') + 'Bà Tư xắn ống quần, lội ra mép nước. Bà đi mười bước, hai mươi bước, đến khi nước ngập ngang hông thì đứng lại. “Góc bếp nhà tui đây.”',
      'Chỗ bà đứng cách bờ hơn hai chục mét. Đúng chỗ ngôi nhà phấn trên bảng đen của học trò. Bạn ghi vào sổ: mốc 7-cũ, năm 2007.',
      'Rồi bà chỉ mái chèo về phía ba cây gạo. “Còn cọc 7 mới thì cô hỏi tụi nó. Ông nhà tui đo bằng ba cây đó cả đời.”'
    ],
    effects: { TC: 10 },
    flags: { moc_ba_tu: true },
    gain: { clues: ['Bà Tư đứng ở mép nước sâu ngang hông, chỉ “góc bếp nhà tui”: cách bờ hơn 20 m, đúng chỗ ngôi nhà phấn trên bảng đen.'] },
    choices: [{ text: 'Giao hội từ ba cây gạo', next: 't1_p2' }]
  },

  t1_p2: {
    time: '00:30',
    title: 'Giao hội ba cây gạo',
    type: 'puzzle',
    paper: true,
    timer: { sec: 40, next: 't1_n3_het_gio', label: 'Anh Quý đang cắm cọc' },
    text: ['Biên bản năm 2007 có ghi góc ngắm từ ba cây gạo tới cọc 7. Mỗi góc là một tia. Chỗ đúng của cọc 7 là nơi cả ba tia cùng gặp nhau. Chạm vào cây và các điểm để xem.'],
    prompt: 'Chạm vào một cây gạo hoặc một điểm A, B, C, D.',
    svg: SVG_P2,
    inspect: {
      G1: 'Gạo Đầu bến. Góc ghi trong biên bản 2007: 48°, mực xanh. Thân cây có khắc: “cây gạo không trôi”.',
      G2: 'Gạo Miếu. Có hai góc: 312° viết mực xanh, và 318° viết đè bằng mực tím.',
      G3: 'Gạo Trường, sau điểm trường. Góc ghi: 205°, mực xanh.',
      PA: 'Điểm A. Ba tia mực xanh gặp nhau tại đây, lệch chưa tới 0,2 m. Nằm sát mép nước đang rút.',
      PB: 'Điểm B. Tọa độ GPS trên điện thoại anh Quý. Không tia nào đi qua. Cách A 4,6 m về phía bờ.',
      PC: 'Điểm C. Tia mực tím của gạo Miếu gặp tia gạo Đầu bến tại đây. Giữa dòng, cách bờ 9 m. Lấy điểm này thì thửa đất rộng thêm gần 40 m².',
      PD: 'Điểm D. Chỗ cây cọc số 7 cũ đang mắc trong lục bình, trôi 6 m xuôi dòng. Không tia nào đi qua.'
    },
    answers: [
      { text: 'Cắm cọc 7 ở điểm A', next: 't1_n3_dung' },
      { text: 'Cắm cọc 7 ở điểm B', next: 't1_n3A', flags: { moc_gps: true } },
      { text: 'Cắm cọc 7 ở điểm C', next: 't1_n3_tim', flags: { theo_muc_tim: true } },
      { text: 'Nhổ cây cọc cũ ở điểm D, mang về cắm lại', next: 't1_n3_troi' }
    ]
  },

  t1_n3_dung: {
    time: '00:40',
    title: 'Ba tia gặp nhau',
    text: [
      'Bạn ngắm từ gạo Đầu bến, rồi gạo Miếu, rồi gạo Trường. Ba tia mực xanh gặp nhau ở sát mép nước. Anh Quý đóng cọc. Cọc đứng thẳng, không nghiêng.',
      'Bà Tư đứng xa xa, gật đầu một cái. Anh Quý thì nhìn bạn như nhìn một người vừa làm phép. “Hồi học trung cấp em có học giao hội,” anh gãi đầu. “Mà chưa thấy ai dùng ngoài đời.”'
    ],
    effects: { TC: 5, TT: 5 },
    gain: { clues: ['Cọc 7 cắm theo ba tia mực xanh thì đứng thẳng. Cọc cắm theo GPS thì cứ nghiêng về phía sông.'] },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_ro' }]
  },

  t1_n3_tim: {
    time: '00:40',
    title: 'Tia mực tím',
    text: [
      'Bạn chọn điểm C. Thêm gần bốn mươi mét vuông cho bà Tư, ai mà thiệt? Anh Quý ngập ngừng, rồi lội ra đóng cọc giữa dòng, nước ngang ngực.',
      'Cây cọc cắm xuống dễ dàng như cắm vào đất khô. Anh Quý lội vào, run cầm cập, bảo bạn: “Lạ ghê chị. Dưới đó cứng như nền nhà. Em đạp trúng cái gì giống bậc thềm.”',
      'Vết mực tím trên ngón tay bạn đậm thêm.'
    ],
    effects: { DN: 20, MN: 1 },
    gain: { clues: ['Dưới điểm C giữa dòng, anh Quý đạp trúng thứ gì cứng như nền nhà, giống bậc thềm.'] },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_ro' }]
  },

  t1_n3_troi: {
    time: '00:40',
    title: 'Cọc trôi',
    text: [
      'Bạn lội ra đám lục bình, nhổ cây cọc số 7 cũ lên. Nó nhẹ bẫng, đầu cọc ướt sũng, dính một sợi chỉ đỏ như ai buộc dấu. Bạn mang về cắm lại đúng lỗ cũ trên bờ.',
      'Năm phút sau, cây cọc đã trôi ra mép nước. Mười phút sau, nó lại nằm trong đám lục bình, cách sáu mét. Lời khắc trên cọc số 6 không nói “cọc không trôi”. Nó nói “cây gạo không trôi”.',
      'Anh Quý thở dài, bật GPS. Bạn giành lấy điện thoại, rồi ngắm ba cây gạo, lần này cẩn thận. Ba tia gặp nhau ở sát mép nước.'
    ],
    effects: { TT: -15, MN: 2 },
    choices: [{ text: 'Chờ đến 01:00', next: 't1_ro' }]
  },

  /* ===== 01:00 · Nước ròng ===== */
  t1_ro: {
    time: '01:00',
    title: 'Nước ròng',
    checkpoint: true,
    text: (s) => {
      const f = s.flags, a = areaOf(s);
      const t = [
        'Một giờ sáng. Nước ròng mạnh, kéo mép sông lùi ra từng gang tay. Bạn dựng sào, bắn laser từ cọc 1 đến cọc 14. Lần này con số trên tablet không nhảy nữa.',
        `Thửa 112: ${a} m².`
      ];
      if (f.theo_muc_tim) t.push('Nhiều hơn hồ sơ ban ngày gần hai mươi mét vuông. Phần thêm vào nằm hết dưới nước, quanh cây cọc giữa dòng của anh Quý.');
      else if (f.moc_gps) t.push('Ít hơn hồ sơ ban ngày. Nhưng cây cọc theo GPS vẫn nghiêng về phía sông, và mỗi lần bạn đo lại, số lẻ lại lệch đi một chút.');
      else t.push('Ít hơn hồ sơ ban ngày 17,6 m². Đó là phần bờ đã lở trong một buổi chiều. Bà Tư sẽ được đền ít hơn. Con số đứng yên, như một sự thật không cần ai tin.');
      t.push('Rồi anh Sáu đánh rơi điếu thuốc. Ngoài sông, cách bờ hơn hai chục mét, nước rút tới đâu thì một mái tôn hiện ra tới đó. Rồi một khung cửa sổ, một bậc thềm, một ngọn đèn dầu đang cháy sau ô kính. Một ngôi nhà đứng giữa sông, ở chỗ mà hai mươi năm nay chỉ có nước.');
      t.push(f.moc_ba_tu ? 'Góc bếp của ngôi nhà nằm đúng chỗ bà Tư đứng lúc nãy, đúng mốc 7-cũ trong sổ của bạn.' : 'Ngôi nhà nằm đúng chỗ ngôi nhà phấn trên bảng đen của học trò.');
      t.push('Bà Tư đứng dậy trên đò, mái chèo trong tay. Bà không khóc. “Nhà tui đó,” bà nói. “Cô đo nó đi.”');
      t.push('Anh Quý chìa biên bản cho bạn ký trước. Ô diện tích thửa 112 còn trống.');
      return t;
    },
    choices: [
      { key: 'A', text: (s) => `Ghi con số vừa đo lúc nước ròng: ${areaOf(s)} m²`, next: 't1_ky_ro', flags: { ghi_so_ro: true } },
      { key: 'B', text: 'Ghi 214,0 m² như hồ sơ ban ngày: bà Tư không bị thiệt', next: 't1_ky_ngay', flags: { ghi_so_ngay: true } }
    ]
  },

  t1_ky_ro: {
    time: '01:10',
    title: 'Con số lúc nước ròng',
    text: (s) => [
      `Bạn viết ${areaOf(s)} vào ô diện tích, ký tên. Nét chữ của bạn hơi run nhưng rõ.`,
      s.flags.theo_muc_tim ? 'Mực trong bút bỗng chuyển sang màu tím ở nét cuối. Bạn nhìn lại: chữ ký vẫn là của bạn. Gần như vậy.' : 'Anh Sáu nhìn con số, môi mím lại. Rồi anh đưa bút cho má. Bà Tư không cầm. “Chưa. Còn cái nhà kia.”',
      'Ngoài sông, ngọn đèn dầu trong ngôi nhà giữa dòng chập chờn, như có người vừa đi ngang qua cửa sổ.'
    ],
    effects: { DN: -10 },
    choices: [{ text: '…', next: 'het_man1' }]
  },

  t1_ky_ngay: {
    time: '01:10',
    title: 'Con số lúc 14:00',
    text: [
      'Bạn viết 214,0 vào ô diện tích, ký tên. Không ai thiệt. Anh Sáu thở phào. Anh Quý gật đầu: số khớp hồ sơ thì cấp trên khỏi hỏi.',
      'Tablet rung lên một lần. Con số thửa 112 nhảy thành 214,0 và đứng yên, giống hệt lúc nước đứng.',
      'Bà Tư không cầm bút. Bà nhìn ra ngôi nhà giữa dòng. Ngọn đèn dầu sau ô kính vừa tắt.'
    ],
    effects: { DN: 10, TC: 5 },
    choices: [{ text: '…', next: 'het_man1' }]
  },

  het_man1: {
    type: 'actend',
    title: 'Hết Màn 1 · Con nước',
    time: '01:10',
    next: 'Màn 2 · Nước ròng',
    teaser: 'Ngôi nhà mái tôn chỉ hiện ra lúc nước ròng. Bà Tư nói đó là nhà bà, lở xuống sông năm 2007, chưa ai đền. Bà muốn bạn đo nó trước khi nước lên lại, và trên cửa ngôi nhà ấy có một chữ ký bằng mực tím.',
    recap: (s) => {
      const f = s.flags, out = [];
      out.push(f.ghi_so_ro ? `Bạn đã ký ${areaOf(s)} m² cho thửa 112, con số đo lúc nước ròng.` : 'Bạn đã ký 214,0 m² cho thửa 112, con số của buổi chiều.');
      if (f.hoi_thua_song || f.ba_tu_ke) out.push('Bà Tư đã bắt đầu tin bạn.');
      if (f.tin_muc_tim || f.theo_muc_tim) out.push('Trên đầu ngón tay bạn còn một vết mực tím.');
      return out;
    },
    summary: (s) => [['Diện tích thửa 112 bạn ký', (s.flags.ghi_so_ro ? areaOf(s) : AREA_DAY) + ' m²'], ['Hồ sơ lúc 14:00', AREA_DAY + ' m²']]
  },

  /* ===== KẾT THÚC THẤT BẠI ===== */
  t1_nuoc_dung: {
    type: 'ending',
    title: 'Nước đứng',
    text: [
      'Bạn bước xuống mép nước, dựng sào. Mặt sông phẳng lì. Thước laser bắt điểm ngọt như đo trên sân bóng. 214,0 m², khớp từng số lẻ với hồ sơ.',
      'Bạn chỉ thấy lạ là nước không chảy. Không xuôi, không ngược. Nước đứng như đang chờ bạn đo xong.',
      'Khi bạn ngẩng lên, bờ đã ở sau lưng mười mét. Chân bạn không lún. Chân bạn cắm.',
      'Sáng hôm sau, người ta tìm thấy cuốn sổ đo của bạn mắc trên cọc số 3, mở đúng trang có dòng “Đừng đo khi nước đứng”. Bên dưới là nét chữ của bạn: “214,0 m². Đã kiểm tra. Đúng như hồ sơ.” Mực còn ướt.',
      'Hồ sơ thửa 112 được duyệt trong buổi sáng. Không ai hỏi vì sao trên bản đồ, góc tây nam thửa đất có thêm một chấm mốc nằm giữa dòng.'
    ]
  },

  t1_giua_dong: {
    type: 'ending',
    title: 'Giữa dòng',
    text: [
      'Bạn nhảy xuống xuồng, cầm mái chèo thứ hai. Chiếc xuồng có đèn bão ở rất gần, chỉ mười nhát chèo. Rồi hai mươi. Rồi năm mươi.',
      'Khi bạn ngoái lại, cả làng Cồn Lở đã tắt đèn. Chỉ còn một ngọn đèn ở bến bên kia đang sáng lại, và nó cũng ở sau lưng bạn.',
      'Người đội nón lá đã ở ngay mũi xuồng. Họ đưa bạn mái chèo của họ, như trao ca trực. Dưới nón không có mặt người, chỉ có ngọn đèn.',
      'Sáng hôm sau, người ta thấy chiếc xuồng của điểm trường mắc trên ngọn cây gạo Đầu bến, cách mặt nước bốn mét. Trong xuồng có cuốn sổ đo mở ở trang cuối: “Mực nước lúc 23:10: không đo được, vì tôi đang ở dưới nó.”',
      'Từ đó, đêm nào nước đứng, người làng bên kia sông lại thấy hai ngọn đèn bão giữa dòng.'
    ]
  },

  t1_nuoc_len: {
    type: 'ending',
    title: 'Nước lên',
    text: [
      'Bạn đứng trên bờ mà nước đã tới đầu gối. Không phải con nước. Là cả khúc bờ đang trượt xuống sông, chậm như người ta kéo một tấm chiếu.',
      'Bạn bám vào cọc số 3. Cọc đi theo bạn. Bạn bám vào cọc số 6. Cọc cũng đi. Chỉ ba cây gạo là đứng yên, xa dần.',
      'Đến sáng, phần mềm của Trung tâm cập nhật: thửa 112 còn 0,0 m², trạng thái “đã bàn giao cho sông”. Ở ô người ký, có tên bạn.'
    ]
  },

  t1_dem_song: {
    type: 'ending',
    title: 'Đếm sóng',
    text: [
      'Bạn bắt đầu đếm sóng để giữ tỉnh táo. Một con sóng là một nhịp thở. Hai con sóng. Ba.',
      'Đến con sóng thứ một nghìn, bạn không còn nhớ mình đến Cồn Lở để làm gì. Đến con sóng thứ một vạn, bạn quên luôn tên mình, nhưng vẫn nhớ đếm.',
      'Bà Tư chở bạn về bằng chuyến đò sáng. Suốt đường, bạn nhìn mặt nước, môi mấp máy những con số. Ở Trung tâm, người ta nói cô kiểm đếm viên ấy giờ làm việc rất cẩn thận. Cô đếm mọi thứ, hai lần.'
    ]
  },

  t1_lang_duoi_song: {
    type: 'ending',
    title: 'Làng dưới sông',
    text: [
      'Dòng sông giữ bạn bằng những sợi rất mềm: một vết mực, một con số không thật, một lời dặn bị bỏ qua. Mỗi lần bạn chọn điều dễ hơn, nó buộc thêm một sợi.',
      'Đến một giờ sáng, bạn nhìn xuống nước và thấy cả làng Cồn Lở cũ ở dưới đó: nóc nhà, cây khế, ngọn đèn dầu. Không ai mời bạn xuống. Bạn chỉ thấy dưới đó dễ đo hơn.',
      'Năm sau, khi kè xây xong, người ta thả đèn hoa đăng tưởng niệm làng cũ. Có một ngọn đèn cứ trôi ngược dòng, dừng lại ở góc tây nam thửa 112, như một cây cọc.'
    ]
  }
};

STORY.endingsList = [
  { id: 't1_ket_man1', title: 'Kết Màn 1: Nhà hiện lúc nước ròng', kind: 'act', act: 1, hint: 'Đo đúng giờ, rồi tự chọn con số mình ký.' },
  { id: 't1_nuoc_dung', title: 'Nước đứng', kind: 'fail', act: 1, hint: 'Con số khớp hồ sơ không có nghĩa là đúng.' },
  { id: 't1_giua_dong', title: 'Giữa dòng', kind: 'fail', act: 1, hint: 'Có những lời kêu cứu không nên chèo ra đón.' },
  { id: 't1_nuoc_len', title: 'Nước lên', kind: 'fail', act: 1, hint: 'Chần chừ và đo sai quá nhiều lần: Mực nước chạm vạch 10.' },
  { id: 't1_lang_duoi_song', title: 'Làng dưới sông', kind: 'fail', act: 1, hint: 'Mỗi lần chọn điều dễ hơn, sông buộc thêm một sợi: Độ neo chạm 60.' },
  { id: 't1_dem_song', title: 'Đếm sóng', kind: 'fail', act: 2, hint: 'Khi Tỉnh táo cạn kiệt.' }
];
STORY.actEndingOf = () => 't1_ket_man1';
STORY.endingIcons = { t1_ket_man1: 'roof', t1_nuoc_dung: 'stake', t1_giua_dong: 'boat', t1_nuoc_len: 'tide', t1_lang_duoi_song: 'lamp', t1_dem_song: 'wave' };
STORY.moodOf = (S, st) => ((st.fx || []).includes('house') ? 'tense' : 'night');

/* ---------- Dàn dựng 3D + âm thanh ----------
   view: không gian · cast: nhân vật · fx: hiệu ứng · sfx: âm thanh · tablet: chữ trên tablet */
const TAB = (a, note, c) => [{ t: 'Thửa 112 · Cồn Lở', s: 46, wt: 600, c: '#9fc3ff' }, { t: a + ' m²', s: 120, c: '#ffffff', mono: true }, { t: note, s: 48, wt: 700, c: c || '#ffd27a' }];
STORY.staging = {
  t1_mo:        { view: 'song', cast: ['tu'], fx: ['farlamp'], sfx: ['oar'] },
  t1_mac_ao:    { view: 'song', cast: ['tu'], fx: ['farlamp'], sfx: ['water'] },
  t1_nhuong_ao: { view: 'song', cast: ['tu'], fx: ['farlamp', 'tujacket'], sfx: ['water'] },
  t1_bai:       { view: 'ben', cast: ['quy', 'sau'], fx: ['farlamp', 'tablet', 'stakes_lost'], tablet: TAB('211,1', 'Đang thay đổi…') },
  t1_nut1:      { view: 'ben', cast: ['quy', 'sau', 'tu'], fx: ['farlamp', 'still', 'tablet', 'stakes_lost'], sfx: ['heart'], tablet: TAB('214,0', 'Khớp hồ sơ', '#8fe0a8') },
  t1_n1_het_gio:{ view: 'ben', cast: ['quy', 'sau'], fx: ['farlamp', 'still', 'stakes_lost'], sfx: ['splash'] },
  t1_n1C:       { view: 'ben', cast: ['quy', 'sau', 'tu'], fx: ['farlamp', 'still', 'stakes_lost'] },
  t1_p1:        { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'still', 'stakes_lost'] },
  t1_p1_tre:    { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'still', 'stakes_lost', 'shake'], sfx: ['thud'] },
  t1_p1_som:    { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'stakes_lost'] },
  t1_p1_dung:   { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'stakes_lost'] },
  t1_p1_3h:     { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'stakes_lost'] },
  t1_sau:       { view: 'ben', cast: ['sau'], fx: ['farlamp', 'stakes_lost', 'closeup_sau'] },
  t1_sau_hoi:   { view: 'ben', cast: ['sau', 'tu'], fx: ['farlamp', 'stakes_lost', 'closeup_sau'] },
  t1_sau_khuyen:{ view: 'ben', cast: ['sau', 'tu'], fx: ['farlamp', 'stakes_lost', 'closeup_sau'] },
  t1_truong:    { view: 'truong', cast: ['lanh'], fx: ['board'], sfx: ['water'] },
  t1_bang_giu:  { view: 'truong', cast: ['lanh'], fx: ['board'] },
  t1_bang_xoa:  { view: 'truong', cast: ['lanh'], fx: ['board_wiped'], sfx: ['scrape_far'] },
  t1_nut2:      { view: 'ben', cast: ['lanh'], fx: ['ghostboat', 'stakes_lost', 'from_school'], sfx: ['bell', 'heart'] },
  t1_n2_het_gio:{ view: 'ben', cast: ['lanh'], fx: ['ghostboat', 'sinking', 'farlamp_back', 'stakes_lost', 'from_school', 'shake'], sfx: ['splash'] },
  t1_n2B:       { view: 'ben', cast: ['lanh'], fx: ['ghostboat', 'sinking', 'farlamp_back', 'stakes_lost', 'from_school'], sfx: ['water'] },
  t1_n2C:       { view: 'ben', cast: ['lanh'], fx: ['ghostboat', 'sinking', 'farlamp_back', 'stakes_lost', 'from_school'], sfx: ['phone'] },
  t1_bien_ban:  { view: 'tram', cast: ['quy'], fx: ['paper'] },
  t1_nut3:      { view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stakes_lost', 'trees'], sfx: ['water'] },
  t1_n3_het_gio:{ view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stake7_gps', 'trees'], sfx: ['thud'] },
  t1_n3A:       { view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stake7_gps', 'trees'], sfx: ['thud'] },
  t1_n3C:       { view: 'ben', cast: ['tu'], fx: ['farlamp', 'flow', 'stakes_lost', 'tu_wade', 'trees'], sfx: ['water'] },
  t1_p2:        { view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stakes_lost', 'trees'] },
  t1_n3_dung:   { view: 'ben', cast: ['quy', 'tu'], fx: ['farlamp', 'flow', 'stake7_ok', 'trees'], sfx: ['thud'] },
  t1_n3_tim:    { view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stake7_mid', 'trees'], sfx: ['splash'] },
  t1_n3_troi:   { view: 'ben', cast: ['quy'], fx: ['farlamp', 'flow', 'stake7_ok', 'trees'], sfx: ['splash'] },
  t1_ro:        { view: 'ben', cast: ['quy', 'sau', 'tu'], fx: (s) => ['farlamp', 'flow', 'ebb', 'house', 'tablet', s.flags.theo_muc_tim ? 'stake7_mid' : s.flags.moc_gps ? 'stake7_gps' : 'stake7_ok'], sfx: ['crumble'], tablet: (s) => TAB(areaOf(s), 'Đã ổn định', '#8fe0a8') },
  t1_ky_ro:     { view: 'ben', cast: ['quy', 'sau', 'tu'], fx: ['farlamp', 'flow', 'ebb', 'house'] },
  t1_ky_ngay:   { view: 'ben', cast: ['quy', 'sau', 'tu'], fx: ['farlamp', 'ebb', 'house', 'house_dark'] },
  het_man1:     { view: 'ben', cast: [], fx: ['farlamp', 'ebb', 'house', 'wide'] },
  t1_nuoc_dung: { view: 'ben', cast: [], fx: ['still', 'stakes_lost'] },
  t1_giua_dong: { view: 'song', cast: [], fx: ['ghostboat', 'village_dark'] },
  t1_nuoc_len:  { view: 'ben', cast: [], fx: ['flood'] },
  t1_dem_song:  { view: 'song', cast: [], fx: ['farlamp'] },
  t1_lang_duoi_song: { view: 'ben', cast: [], fx: ['ebb', 'house', 'underlights'] },
  menu:         { view: 'ben', cast: [], fx: ['menu', 'farlamp'] }
};
