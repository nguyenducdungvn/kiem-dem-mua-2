/* =========================================================
   KIỂM ĐẾM CA ĐÊM · MÙA 2 · TẬP 2: CHỢ SỚM
   Màn 1: "Sổ nợ" (22:00 – 01:00)
   Khai báo STORY.meta, stats, acts, rules, notebook, scenes, endingsList, staging.
   Chỉ số riêng của tập: SN (Sổ nợ), −10 đến +10, bắt đầu 0, thua ở −6.
   Bọc IIFE: hằng của Tập 2 không lộ ra toàn cục. Các màn sau dùng chung qua STORY.T2.
   ========================================================= */
window.STORY = window.STORY || {};

(function () {
  'use strict';
  const ST = window.STORY;
  const SANS = "'Be Vietnam Pro', Arial, sans-serif";
  const NUM = "'Roboto Mono', monospace";
  const PURPLE = '#6a2fa0';

  /* ---------- Đọc kết cuối Tập 1 (chung tên miền, chung khóa kd2_endings) ---------- */
  const t1End = () => {
    try {
      const e = JSON.parse(window.localStorage.getItem('kd2_endings') || '{}');
      const a = e.t1_ket_muc_tim || 0, b = e.t1_ket_ban_giao || 0;
      if (!a && !b) return '';
      return a > b ? 'muc_tim' : 'ban_giao';
    } catch (err) { return ''; }
  };

  ST.meta = {
    season: 2, episode: 2,
    title: 'Chợ Sớm',
    fullTitle: 'Kiểm Đếm Ca Đêm · Mùa 2 · Tập 2: Chợ Sớm',
    brand: 'Kiểm Đếm Ca Đêm · Chợ Sớm',
    act: 'Màn 1 · Sổ nợ',
    version: '2.1.0-alpha.1',
    keyPrefix: 'kd2_t2',
    characters: ['Thục Anh', 'Bà Hai', 'Anh Toàn', 'Mi', 'Người giữ sổ', 'Chính cái chợ'],
    menu: {
      kicker: 'Mùa 2 · Phiếu Bàn Giao · Tập 2',
      title: 'Chợ Sớm',
      sub: 'Thị trấn Phú Cầu · Màn 1: Sổ nợ',
      hook: [
        'Chợ Sớm họp từ ba giờ sáng suốt sáu mươi năm. Sáng mai chợ đóng cửa để xây trung tâm thương mại. Đêm nay bạn phải đếm 186 lô sạp để tính tiền hỗ trợ cho tiểu thương.',
        'Nhưng chợ này đứng được là nhờ nợ. Bà Hai bán vải giữ cuốn sổ ghi ai thiếu ai suốt bốn mươi lăm năm, kể cả nợ của người đã mất. Và trong bản chụp sổ nợ nộp kèm hồ sơ, có một dòng mực tím không ai nhận là mình viết.'
      ],
      q: 'Đếm cho khớp sổ, hay đếm cho đúng người?',
      facts: ['Khoảng 15 phút · Màn 1/3', 'Lựa chọn có hậu quả']
    },
    journal: {
      title: 'Sổ tay kiểm đếm · Chợ Sớm',
      rulesTitle: 'Lời dặn in trên mặt sau vé thu phí chợ',
      rulesNote: 'Lời dặn càng nhiều nơi cùng ghi thì càng đáng tin. Lời dặn không rõ nguồn thì nên nghi.',
      ruleToast: 'Lời dặn mới:',
      sourceText: (n, list) => n + ' nơi cùng ghi: ' + list.join(', ')
    },
    share: (title, got, total) => `Mình vừa mở kết thúc “${title}” trong Kiểm Đếm Ca Đêm · Mùa 2 · Tập 2: Chợ Sớm (${got}/${total}). Bạn có đếm sạp còn treo đèn là sạp trống không?`,
    finalTitle: 'Cảm ơn bạn đã ở lại chợ Sớm đến phiên cuối'
  };

  /* ---------- Chỉ số: ba chỉ số chung của mùa + Sổ nợ riêng của Tập 2 ---------- */
  const signed = (v) => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');
  ST.stats = {
    TT: { label: 'Tỉnh táo', start: 70, min: 0, max: 100, cls: 'tt', good: 'up', warn: { lt: 40 }, fail: { le: 0, ending: 't2_dem_mai' }, story: { min: 1 }, tip: 'Tỉnh táo: dưới 40 bắt đầu ảo giác, về 0 là thua' },
    TC: { label: 'Tin cậy', start: 50, min: 0, max: 100, cls: 'tc', good: 'up', warn: { lt: 30 }, tip: 'Tin cậy của người trong chợ và đồng đội' },
    DN: { label: 'Độ neo', start: 0, min: 0, max: 100, cls: 'dn', good: 'down', warn: { ge: 30 }, fail: { ge: 60, ending: 't2_giu_lai_cho' }, story: { max: 59 }, tip: 'Độ neo: cái chợ giữ bạn lại. Từ 60 trở lên là thua' },
    SN: { label: 'Sổ nợ', start: 0, min: -10, max: 10, cls: 'sn', good: 'up', warn: { le: -3 }, fail: { le: -6, ending: 't2_giu_lai_cho' }, story: { min: -5 }, fmt: signed, tip: 'Sổ nợ: ghi đúng, trả thật thì dương; nhận vơ, ký sai, để người khác ký thay thì âm. Xuống −6 là thua. Đèn trong nhà lồng tắt dần theo Sổ nợ' }
  };

  ST.acts = [
    { n: 1, name: 'Màn 1 · Sổ nợ', time: '22:00 – 01:00', scene: 't2_mo' },
    { n: 2, name: 'Màn 2 · Chợ ma', time: '01:00 – 03:30', soon: true },
    { n: 3, name: 'Màn 3 · Phiên chợ cuối', time: '03:30 – 06:00', soon: true }
  ];

  /* ---------- Lời dặn (Màn 1 dùng L1–L4, L6, L7; L5 và L8 thêm ở Màn 2, Màn 3) ---------- */
  ST.rules = {
    L1: { text: 'Sau ba giờ sáng, đừng trả giá.', sources: ['vé 1955', 'vé 1990', 'lời bà Hai'] },
    L2: { text: 'Ai bán bằng lời hứa thì đừng mua.', sources: ['vé 1990', 'cột chợ dãy E'] },
    L3: { text: 'Sạp nào còn treo đèn thì đừng đếm là sạp trống.', sources: ['vé 2008', 'lời mẹ Mi dặn'] },
    L4: { text: 'Cân của chợ thì đừng cân lại bằng tay.', sources: ['vé 1975'] },
    L6: { text: 'Nợ của người đã đi thì để người thân trả hoặc tha.', sources: ['bìa trong sổ nợ'] },
    L7: { text: 'Xóa hết nợ thì ai cũng nhẹ người.', sources: ['?'], note: 'Mực tím, viết thêm vào mặt sau vé thu phí. Không năm, không dấu ban quản lý.' }
  };

  /* ---------- Sổ đo xuyên mùa ---------- */
  const COVER = 'Sổ đo của Lương Thục Anh, dùng từ đêm ở nhà B4. Sau buổi bàn giao, cô thấy bốn trang cuối bị dán kín bằng hồ gạo. Trên mỗi trang có một dòng bút chì, nét chữ của ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu.';
  const PAGE1 = 'Hồ gạo bong ra khi trời sáng. Bên trong là sơ đồ ba cây gạo vẽ bút chì, ba tia mực xanh gặp nhau ở mép nước. Bên dưới, nét chữ ông Kha: “Người giữ sổ không phải tên của một người. Ai ký thay người đã đi, người đó đang giữ sổ. Đừng để cô ấy ký thay ai.”';
  ST.notebook = (S) => [
    { title: 'Bìa sổ', open: true, text: COVER },
    { title: 'Trang Cồn Lở', open: !!t1End(), text: PAGE1 },
    { title: 'Trang Chợ Sớm', open: !!S.flags.mo_trang_2, text: '' },
    { title: 'Trang Ca Ba', open: false, text: '' },
    { title: 'Trang Con Dấu', open: false, text: '' }
  ];

  /* ---------- Hình vẽ dùng chung của tập ---------- */
  const PAPER = `
<defs><pattern id="kd2c-lines" width="24" height="26" patternUnits="userSpaceOnUse"><path d="M0 25.5H24" stroke="#d3c7a8" stroke-width="1"/></pattern></defs>
<rect width="100%" height="100%" fill="#efe7d2"/>`;

  /* Mini-game Nút 2: sơ đồ chợ 1998 (6 dãy × 31 ô) đặt cạnh trang cuối sổ thu phí */
  const SVG_P1 = (() => {
    const x0 = 44, cw = 7.6, ch = 22, rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const yOf = (r) => 104 + r * 44;
    const cell = (n) => { const r = Math.floor((n - 1) / 31), i = (n - 1) % 31; return [x0 + i * cw, yOf(r)]; };
    let grid = '';
    rows.forEach((name, r) => {
      grid += `<text x="${x0 - 16}" y="${yOf(r) + 16}" font-family="${SANS}" font-size="13" font-weight="700" fill="#5a4a36">${name}</text>`;
      for (let i = 0; i < 31; i++) grid += `<rect x="${x0 + i * cw}" y="${yOf(r)}" width="${cw}" height="${ch}" fill="#fbf6e8" stroke="#a89878" stroke-width="0.8"/>`;
    });
    const [x47, y47] = cell(47), [x93, y93] = cell(93), [x94, y94] = cell(94), [x120, y120] = cell(120), [x121] = cell(121);
    const hatch = (x, y) => `<path d="M${x} ${y + ch} L${x + cw} ${y} M${x} ${y + ch / 2} L${x + cw / 2} ${y} M${x + cw / 2} ${y + ch} L${x + cw} ${y + ch / 2}" stroke="#6b5a3a" stroke-width="1"/>`;
    const left = `
<rect x="16" y="44" width="292" height="372" rx="6" fill="#f6efdc" stroke="#b8ad92"/>
<text x="28" y="70" font-family="${SANS}" font-size="15" font-weight="700" fill="#2a251c">Sơ đồ chợ Sớm · 1998</text>
<text x="28" y="90" font-family="${SANS}" font-size="12" fill="#6b5a3a">Mỗi dãy 31 ô, đánh số mực tàu</text>
${grid}
<g class="hit" data-id="S47"><rect x="${x47 - 10}" y="${y47 - 22}" width="${cw + 20}" height="${ch + 30}" fill="transparent"/>
  <rect x="${x47}" y="${y47}" width="${cw}" height="${ch}" fill="#ffd27a" stroke="#8a5a1c" stroke-width="1.5"/>
  <circle cx="${x47 + cw / 2}" cy="${y47 - 9}" r="4.5" fill="#ffcf5a" stroke="#8a5a1c"/>
  <text x="${x47 + cw + 6}" y="${y47 - 5}" font-family="${NUM}" font-size="12" fill="#8a5a1c">47</text></g>
<g class="hit" data-id="S93"><rect x="${x93 - 30}" y="${y93 - 4}" width="64" height="${y94 - y93 + ch + 22}" fill="transparent"/>
  <rect x="${x93}" y="${y93}" width="${cw}" height="${ch}" fill="#bfe0b0" stroke="#3d6b2a" stroke-width="1.5"/>
  <rect x="${x94}" y="${y94}" width="${cw}" height="${ch}" fill="#bfe0b0" stroke="#3d6b2a" stroke-width="1.5"/>
  <text x="${x93 - 22}" y="${y93 + ch + 14}" font-family="${NUM}" font-size="12" fill="#3d6b2a">93</text>
  <text x="${x94 + cw + 4}" y="${y94 + ch + 14}" font-family="${NUM}" font-size="12" fill="#3d6b2a">94</text>
  <text x="${x94 + 34}" y="${y93 + ch + 14}" font-family="${SANS}" font-size="11" font-style="italic" fill="#3d6b2a">lối đi</text></g>
<g class="hit" data-id="S120"><rect x="${x120 - 6}" y="${y120 - 6}" width="${cw * 2 + 12}" height="${ch + 26}" fill="transparent"/>
  ${hatch(x120, y120)}${hatch(x121, y120)}
  <text x="${x120 - 4}" y="${y120 + ch + 14}" font-family="${NUM}" font-size="11" fill="#6b5a3a">120–121</text></g>
<g class="hit" data-id="SO98"><rect x="28" y="378" width="268" height="28" rx="4" fill="#fff8e6" stroke="#b8ad92"/>
  <text x="40" y="397" font-family="${SANS}" font-size="13" fill="#2a251c">Tổng: 186 ô · đánh số từ 1 đến 186</text></g>`;
    const R = (i) => 104 + i * 36;
    const row = (i, id, main, sub, ink) => `<g${id ? ` class="hit" data-id="${id}"` : ''}>
  <rect x="330" y="${R(i) - 22}" width="290" height="34" fill="${id ? (ink ? '#f3e9fb' : '#fff8e6') : 'transparent'}" stroke="${id ? '#c9bda0' : 'none'}"/>
  <text x="340" y="${R(i) - 2}" font-family="${SANS}" font-size="13.5" ${ink ? `font-style="italic" fill="${PURPLE}"` : 'fill="#2a251c"'}>${main}</text>
  ${sub ? `<text x="610" y="${R(i) + 8}" text-anchor="end" font-family="${SANS}" font-size="11" ${ink ? `font-style="italic" fill="${PURPLE}"` : 'fill="#7a6a4a"'}>${sub}</text>` : ''}</g>`;
    const right = `
<rect x="322" y="44" width="306" height="372" rx="6" fill="#fbf7ec" stroke="#b8ad92"/>
<rect x="322" y="44" width="306" height="372" rx="6" fill="url(#kd2c-lines)" opacity="0.6"/>
<text x="336" y="70" font-family="${SANS}" font-size="15" font-weight="700" fill="#8a2a1c">Sổ thu phí · trang tổng</text>
${row(0, '', 'Dòng 1 – 46', 'đã kiểm', false)}
${row(1, 'L47', 'Lô 47 · cá · bà Lan', 'phí đóng đều', false)}
${row(2, '', 'Dòng 48 – 92', 'đã kiểm', false)}
${row(3, 'L93', 'Lô 93–94 · rau · bà Lựu', 'một dòng', false)}
${row(4, '', 'Dòng 95 – 186 (không có 120, 121)', 'đã kiểm', false)}
${row(5, 'L187', 'Lô 187 · cân thuê', 'ký nhận: Người giữ sổ', true)}
${row(6, 'L188', 'Lô 188 · chè đậu trắng', 'ký nhận: Người giữ sổ', true)}
${row(7, 'L189', 'Lô 189 · đèn dầu', 'ký nhận: Người giữ sổ', true)}
<g class="hit" data-id="TONG"><rect x="330" y="${R(8) - 18}" width="290" height="32" rx="4" fill="#fff0e0" stroke="#c05030"/>
  <text x="340" y="${R(8) + 3}" font-family="${SANS}" font-size="14" font-weight="700" fill="#8a2a1c">Tổng: 186 dòng · khớp sơ đồ</text></g>`;
    return `<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ chợ Sớm năm 1998 đặt cạnh trang tổng sổ thu phí">
${PAPER}
<text x="16" y="30" font-family="${SANS}" font-size="16" font-weight="700" fill="#2a251c">Đối chiếu sơ đồ lô sạp với sổ thu phí · đêm cuối</text>
${left}
${right}
</svg>`;
  })();

  /* ---------- Cảnh ---------- */
  ST.start = 't2_mo';

  ST.scenes = {

    /* ===== 17:40 · Trung tâm ===== */
    t2_mo: {
      time: '17:40',
      title: 'Hồ sơ chợ Sớm',
      act: 'Màn 1 · Sổ nợ',
      text: () => {
        const e = t1End();
        const t = [
          'Ba tuần sau đêm ở Cồn Lở, phòng hồ sơ của Trung tâm giao cho bạn một bìa còng dày hai đốt ngón tay. Ngoài bìa ghi: Chợ Sớm, thị trấn Phú Cầu. 186 lô sạp. Kiểm đếm ca đêm, bàn giao trước 06:00.',
          'Chợ Sớm họp từ ba giờ sáng suốt sáu mươi năm. Sáng mai chợ đóng cửa để xây trung tâm thương mại. Đêm nay bạn đếm từng sạp để tính tiền hỗ trợ cho tiểu thương, ba mươi triệu một hộ.'
        ];
        if (e === 'muc_tim') t.push('Bạn lật hồ sơ bằng tay trái. Đầu ngón trỏ tay phải vẫn còn một vết tím mờ. Ba tuần rồi, xà phòng nào cũng không tẩy được.');
        if (e === 'ban_giao') t.push('Điện thoại rung. Anh Quý nhắn từ xã Hòa Bồi: “Bà Tư dọn lên chỗ mới rồi chị. Bà treo cái mái chèo trên tường phòng khách, nói để đó cho cô Lành mượn.”');
        t.push('Kẹp cuối hồ sơ là bản chụp mấy trang sổ nợ viết tay, ai đó nộp kèm “để làm chứng”. Giữa những dòng mực xanh có một dòng mực tím: “Sạp 47 · nợ một lời hứa · đã ký nhận thay. Người giữ sổ.”');
        t.push('Bạn từng thấy chữ ký này trên một biên bản sạt lở. Anh Quý khi ấy nói nó còn có trong hồ sơ của một cái chợ.');
        return t;
      },
      choices: [
        { key: 'A', text: 'Chép nguyên dòng mực tím vào sổ đo, từng chữ', next: 't2_cho', flags: { chep_muc_tim: true } },
        { key: 'B', text: 'Gấp hồ sơ lại, đi cho kịp chuyến xe cuối về Phú Cầu', next: 't2_cho', effects: { TT: 5 } }
      ]
    },

    /* ===== 22:00 · Nhà lồng ===== */
    t2_cho: {
      time: '22:00',
      title: 'Nhà lồng chợ Sớm',
      text: (s) => [
        'Nhà lồng chợ Sớm cao như một nhà ga cũ, mái tôn trên khung sắt sơn xanh đã rỉ. Hai mươi bốn bóng đèn tròn treo dọc lối đi chính. Mười giờ đêm, chợ chưa họp mà đèn đã sáng hết, như cả chợ đang chờ ai.',
        'Anh Toàn, ban quản lý chợ, đón bạn ở cổng, kẹp nách cuốn sổ thu phí bìa đỏ. “Sổ em khớp sơ đồ rồi chị, 186 lô, 186 dòng. Chị đếm nhanh giùm em, bốn giờ chủ đầu tư xuống.” Anh nói nhanh, như sợ con số nghe thấy rồi đổi ý.',
        'Ở sạp vải gần cổng, bà Hai ngồi xếp từng cây vải vào bao, cuốn sổ nợ gáy vải đặt trên đùi. Bà không ngẩng lên. “Cô đếm thì đếm. Mà nhớ, sau ba giờ sáng thì đừng trả giá với ai hết.”',
        'Anh Toàn dúi cho bạn một xấp vé thu phí cũ để làm giấy nháp. Mặt sau mỗi vé in một dòng dặn, chữ của ban quản lý từng thời. Vé năm 1955 và vé năm 1990 cùng in: “Sau ba giờ sáng, đừng trả giá.” Vé năm 2008 in: “Sạp nào còn treo đèn thì đừng đếm là sạp trống.”' + (s.flags.chep_muc_tim ? ' Trong sổ đo của bạn, dòng mực tím vừa chép vẫn chưa khô, dù bạn viết bằng bút bi xanh.' : '')
      ],
      gain: { rules: ['L1', 'L3'] },
      choices: [{ text: '…', next: 't2_nut1' }]
    },

    /* ===== NÚT 1 · 22:20 · Sạp 47 ===== */
    t2_nut1: {
      time: '22:20',
      title: 'Nút 1 · Sạp 47',
      checkpoint: true,
      danger: true,
      timer: { sec: 25, next: 't2_n1_het_gio', label: 'Anh Toàn đang chờ ghi sổ' },
      text: [
        'Dãy B, sạp 47. Quầy gạch men trắng đã ố, mấy thùng xốp chồng lên nhau, một cái cân đồng hồ kim đỏ chỉ số không. Sạp trống trơn. Chỉ có bóng đèn tròn treo trên quầy là còn sáng, vàng và ấm, như vừa có người bật.',
        'Mi dựng xe máy ở lối đi, áo khoác giao hàng còn ướt sương. “Sạp má em. Má mất năm 2019, sạp vẫn đứng tên má.” Cô nói một hơi: đếm là sạp đang kinh doanh thì tiền hỗ trợ đứng tên người đã mất, phải làm thủ tục thừa kế, ba tháng chưa chắc xong. Đếm là sạp trống thì ban quản lý trả tiền trả mặt bằng, mười hai triệu, sáng mai nhận liền.',
        '“Má em còn nợ bà Hai bốn triệu. Em muốn trả trước khi chợ đóng.” Mi nhìn bóng đèn, giọng nhỏ lại. “Hồi nhỏ má dặn em: sạp nào còn treo đèn thì đừng đếm là sạp trống. Mà đèn đó… chắc em quên tắt.”',
        'Anh Toàn đứng chờ với cây bút bi. Ô tình trạng sạp 47 còn trống.'
      ],
      choices: [
        { key: 'A', text: 'Ghi “sạp trống” như Mi nhờ: sáng mai Mi có tiền trả nợ cho má', next: 't2_sap_trong' },
        { key: 'B', text: 'Ghi đúng hiện trạng: còn treo đèn, đứng tên mẹ Mi, người thừa kế là Mi', next: 't2_n1_that', flags: { ghi_47_that: true } },
        { key: 'C', text: 'Tắt đèn trước rồi ghi “sạp trống”: vậy là đúng lời dặn, mà Mi vẫn có tiền', next: 't2_n1_tat', flags: { tat_den_47: true } }
      ]
    },

    t2_n1_het_gio: {
      time: '22:21',
      title: 'Bút chì',
      text: [
        'Bạn còn đang nhìn bóng đèn thì anh Toàn đã cúi xuống sổ. “Để em ghi tạm bút chì, sạp trống, mai tính.” Nét chì vừa chạm giấy, bóng đèn trên sạp 47 lắc mạnh, dù không có gió.',
        'Dưới quầy gạch men có tiếng thùng xốp dịch ra, như có người đang kéo ghế ngồi vào chỗ. Mi lùi một bước. Anh Toàn cũng lùi.',
        'Bạn giật cây bút, tẩy nét chì đến rách cả giấy, rồi ghi lại: “Sạp 47: còn treo đèn. Đứng tên bà Lan, đã mất. Người thừa kế: Mi.” Tiếng thùng xốp im bặt.'
      ],
      effects: { TT: -10, SN: -1 },
      flags: { ghi_47_that: true },
      gain: { clues: ['Anh Toàn vừa ghi bút chì “sạp trống” cho sạp 47 thì dưới quầy có tiếng thùng xốp dịch ra, như có người kéo ghế ngồi vào.'] },
      choices: [{ text: 'Đếm tiếp', next: 't2_mi' }]
    },

    t2_n1_that: {
      time: '22:25',
      title: 'Đèn còn sáng',
      text: [
        'Bạn viết vào ô tình trạng: “Còn treo đèn. Đứng tên bà Lan, đã mất năm 2019. Người thừa kế: Mi.” Nét chữ rõ ràng, không chừa chỗ nào để sửa.',
        'Mi nhìn tờ sổ, rồi nhìn bạn, mắt đỏ lên. “Vậy là ba tháng.” Cô quay đi. Anh Toàn thở dài, vì sổ của anh có thêm một dòng ghi chú, mà ghi chú thì chủ đầu tư sẽ hỏi.',
        'Bóng đèn trên sạp 47 dịu xuống một chút, như người ta thở ra.'
      ],
      effects: { SN: 1, TC: -5 },
      gain: { clues: ['Bóng đèn sạp 47 dịu xuống khi sạp được ghi đúng: còn treo đèn, người thừa kế là Mi.'] },
      choices: [{ text: 'Đếm tiếp', next: 't2_mi' }]
    },

    t2_n1_tat: {
      time: '22:25',
      title: 'Công tắc',
      text: [
        'Bạn với tay vặn công tắc trên cột. Bóng đèn tắt. Sạp 47 chìm vào bóng tối, giờ đúng là một sạp trống. Bạn cầm bút.',
        'Chưa kịp viết, bóng đèn tự sáng lại. Không phải từ từ như đèn cũ: nó bật một tiếng tách, sáng hơn lúc nãy. Công tắc trên cột vẫn ở nấc tắt.',
        'Mi lùi sát vào xe máy. “Em không có bật,” cô nói. “Từ hồi má mất, em chưa bật cái đèn đó lần nào.”',
        'Bạn ghi lại cho đúng: còn treo đèn, đứng tên bà Lan, người thừa kế là Mi. Tay bạn run tới mức anh Toàn phải giữ giùm cuốn sổ.'
      ],
      effects: { SN: -1, DN: 10, TT: -10 },
      flags: { ghi_47_that: true },
      gain: { clues: ['Đèn sạp 47 tự sáng lại khi công tắc vẫn ở nấc tắt. Mi nói từ năm 2019 cô chưa bật nó lần nào.'] },
      choices: [{ text: 'Đếm tiếp', next: 't2_mi' }]
    },

    /* ===== 22:40 · Khoảnh khắc nhân vật: Mi ===== */
    t2_mi: {
      time: '22:40',
      title: 'Mi',
      text: (s) => [
        'Mi ngồi trên yên xe, dò lại mấy đơn hàng chưa giao trên điện thoại. Hai mươi bốn tuổi, cô lớn lên dưới gầm sạp 47, ngủ trên thùng xốp, thức dậy bằng tiếng dao đánh vảy cá lúc ba giờ sáng.',
        '“Hồi đó cả chợ là nhà em,” cô nói. “Bà Hai may cho em cái áo đi học. Chú bán thịt dạy em làm toán bằng cây cân. Má em nói chợ này không ai đói, chỉ có người thiếu nợ.” Cô cười, rồi thôi cười.',
        s.flags.tat_den_47 ? 'Cô liếc lên bóng đèn sạp 47, rồi nhìn xuống ngay, như sợ nhìn lâu thì nó biết.' : 'Phía sau cô, bóng đèn sạp 47 vẫn sáng đều.'
      ],
      choices: [
        { key: 'A', text: 'Hỏi Mi về đêm cuối của má ở chợ', next: 't2_mi_hoi', flags: { hoi_me_mi: true } },
        { key: 'B', text: 'Bảo Mi về nghỉ, mai còn chạy đơn, có gì chị gọi', next: 't2_mi_ve', flags: { mi_ve: true } }
      ]
    },

    t2_mi_hoi: {
      time: '22:45',
      title: 'Đêm cuối của má',
      text: [
        'Mi kể: tháng Ba năm 2019, má cô dọn hàng lúc ba giờ sáng như mọi bữa, rồi gục bên quầy. Người ta chở má đi bệnh viện bằng chiếc xe ba gác của chợ. Má không về.',
        '“Bữa đó má còn hứa với ai một chuyện. Em nghe má nói qua điện thoại: ‘Sáng mai trả đủ.’ Mà sáng mai không có.” Mi vuốt mặt. “Em không biết má hứa với ai.”',
        'Bạn nhớ dòng mực tím trong bản chụp: Sạp 47, nợ một lời hứa.'
      ],
      effects: { TC: 5 },
      gain: { clues: ['Đêm cuối ở chợ, tháng 3/2019, mẹ Mi hứa qua điện thoại: “Sáng mai trả đủ.” Mi không biết bà hứa với ai.'] },
      choices: [{ text: 'Đếm sang dãy E', next: 't2_rao' }]
    },

    t2_mi_ve: {
      time: '22:45',
      title: 'Về nghỉ',
      text: [
        'Mi gật đầu, đội mũ bảo hiểm. “Có gì chị gọi em.” Tiếng xe máy xa dần ra phía cổng.',
        'Một lát sau, bạn nghe tiếng xe quay lại. Mi dựng xe ở góc chợ, ngồi im trên yên, không vào, cũng không về. Người lớn lên dưới gầm sạp không bỏ chợ được trong đêm cuối.'
      ],
      effects: { TT: 5, TC: -5 },
      choices: [{ text: 'Đếm sang dãy E', next: 't2_rao' }]
    },

    /* ===== 23:20 · Tiếng rao ===== */
    t2_rao: {
      time: '23:20',
      title: 'Tiếng rao',
      text: [
        'Bạn đếm tới dãy E thì nghe tiếng rao. Rất xa, từ cuối nhà lồng, chỗ bóng đèn không với tới: “Chè đậu trắng đây… chè nước cốt dừa… ăn trước trả sau…”',
        'Anh Toàn đứng khựng. “Dãy cuối dỡ hết sạp từ tháng trước rồi chị. Đâu còn ai bán.” Trên cột sắt đầu dãy E, ai đó lấy dao khắc vào lớp sơn: “Ai bán bằng lời hứa thì đừng mua.” Bạn lật xấp vé thu phí: mặt sau vé năm 1990 có in câu ấy, chữ nhỏ hơn, ngay dưới lời dặn về ba giờ sáng.',
        'Tiếng rao lại vang lên, gần hơn một chút: “Không có tiền cũng được… hứa thôi cũng được…”'
      ],
      gain: { rules: ['L2'] },
      choices: [
        { key: 'A', text: 'Đi về phía tiếng rao, xem còn ai bán trong chợ đêm nay', next: 't2_rao_theo', flags: { ghe_day_cuoi: true } },
        { key: 'B', text: 'Đứng yên, ghi giờ và chỗ phát ra tiếng rao vào sổ, rồi đếm tiếp', next: 't2_rao_dung' }
      ]
    },

    t2_rao_theo: {
      time: '23:25',
      title: 'Dãy cuối',
      text: [
        'Bạn đi về phía cuối nhà lồng. Mỗi bước, một bóng đèn sau lưng tắt. Dãy cuối không còn sạp, chỉ còn nền xi măng có những vết chân bàn hình vuông. Trên một vết vuông có chiếc ghế nhựa thấp và một nồi chè còn bốc khói.',
        'Không có ai. Bên cạnh nồi là một cái chén sạch và một tờ giấy gấp đôi: “Ăn đi cô. Trả sau.” Mùi nước cốt dừa ngọt tới mức bạn thấy đói, dù vừa ăn tối.',
        'Bạn không ăn. Lúc quay lại, anh Toàn đứng ở đầu dãy, rọi đèn pin vào bạn, mặt trắng bệch. Theo đồng hồ của anh, bạn đã đi mất mười lăm phút.',
        'Trong sổ đo, ở trang đếm dãy E, có thêm một dòng mực tím bạn không viết: “Dãy cuối · ghé một lần.”'
      ],
      effects: { TT: -15, SN: -1, DN: 5 },
      gain: { clues: ['Ở dãy cuối đã dỡ sạp có một nồi chè đậu trắng còn bốc khói và tờ giấy: “Ăn đi cô. Trả sau.” Sổ đo tự có thêm dòng mực tím: “Dãy cuối · ghé một lần.”'] },
      choices: [{ text: 'Lên phòng ban quản lý', next: 't2_toan' }]
    },

    t2_rao_dung: {
      time: '23:25',
      title: 'Ghi giờ',
      text: [
        'Bạn ghi vào sổ: “23:20. Tiếng rao chè đậu trắng, cuối nhà lồng, dãy đã dỡ. Không đi tới.” Viết xong, tiếng rao im.',
        'Anh Toàn nhìn bạn như nhìn một người biết chuyện. “Chị làm vậy là phải,” anh nói nhỏ. “Hồi em mới về ban quản lý, mấy bà trong chợ dặn em y vậy. Em tưởng họ giỡn.”'
      ],
      effects: { TC: 5 },
      gain: { clues: ['23:20, tiếng rao chè đậu trắng vọng từ dãy cuối đã dỡ sạp: “ăn trước trả sau… hứa thôi cũng được.”'] },
      choices: [{ text: 'Lên phòng ban quản lý', next: 't2_toan' }]
    },

    /* ===== 23:40 · Phòng ban quản lý ===== */
    t2_toan: {
      time: '23:40',
      title: 'Phòng ban quản lý',
      text: [
        'Phòng ban quản lý nằm trên gác lửng, cửa kính nhìn xuống cả nhà lồng. Trên tường dán sơ đồ chợ năm 1998, giấy đã vàng, 186 ô vuông đánh số bằng mực tàu. Quạt trần quay chậm, kêu lạch cạch.',
        'Anh Toàn mở sổ thu phí trên bàn. “Chủ đầu tư cần con số trước bốn giờ. 186 lô, 186 hộ, mỗi hộ ba mươi triệu. Sổ em 186 dòng, sơ đồ 186 ô. Khớp vậy là đẹp rồi chị.” Anh gõ ngón tay lên trang sổ, hơi mạnh.',
        'Trên vách sau lưng anh có đóng khung một tấm vé thu phí năm 1975, chữ in đã mờ: “Cân của chợ thì đừng cân lại bằng tay.” Anh Toàn thấy bạn nhìn. “Cái đó ông quản lý đời đầu treo. Em không dám gỡ.”',
        'Bạn đặt sổ thu phí cạnh sơ đồ. Hai con số bằng nhau. Bạn từng thấy một con số khớp hồ sơ như vậy, ở một bến đò, lúc nước đứng.'
      ],
      gain: { rules: ['L4'] },
      choices: [{ text: 'Đối chiếu từng dòng', next: 't2_p1' }]
    },

    /* ===== NÚT 2 · 23:50 · Mini-game đối chiếu ===== */
    t2_p1: {
      time: '23:50',
      title: 'Nút 2 · Sơ đồ và sổ thu phí',
      type: 'puzzle',
      paper: true,
      checkpoint: true,
      timer: { sec: 50, next: 't2_p1_tre', label: 'Anh Toàn đang bấm số gọi chủ đầu tư' },
      text: ['Bên trái là sơ đồ chợ năm 1998. Bên phải là trang tổng của sổ thu phí. Chạm vào những chỗ được đánh dấu để xem kỹ, rồi chốt số hộ tiểu thương được hỗ trợ.'],
      prompt: 'Chạm vào một ô trên sơ đồ hoặc một dòng trong sổ.',
      svg: SVG_P1,
      inspect: {
        S47: 'Sơ đồ, ô 47, dãy B. Hiện trạng: sạp không có hàng, nhưng bóng đèn trên quầy còn sáng. Vé năm 2008 dặn: sạp còn treo đèn thì đừng đếm là sạp trống.',
        S93: 'Sơ đồ, ô 93 cuối dãy C và ô 94 đầu dãy D. Giữa hai ô là một lối đi rộng gần hai mét. Hai sạp riêng, không thể là một.',
        S120: 'Sơ đồ, ô 120 và 121, dãy D: gạch chéo bút chì, ghi “dỡ làm lối thoát hiểm, 2005”. Không còn sạp, không có hộ nào. Sổ thu phí cũng không có hai dòng này.',
        SO98: 'Sơ đồ năm 1998 có 186 ô, đánh số từ 1 đến 186. Không có ô nào mang số 187 trở lên.',
        L47: 'Sổ thu phí: “Lô 47 · cá · bà Lan.” Từ năm 2019, Mi vẫn đóng phí đều mỗi tháng để sạp còn tên má.',
        L93: 'Sổ thu phí: “Lô 93–94 · rau · bà Lựu.” Bút chì bên lề: “Lựu bệnh từ 2011, em là Huệ đóng chung cho gọn.” Ghép một dòng thì bà Huệ mất phần hỗ trợ của mình.',
        L187: 'Sổ thu phí: “Lô 187 · cân thuê · ký nhận: Người giữ sổ.” Mực tím. Sơ đồ không có lô này. Ngoài nhà lồng cũng không có.',
        L188: 'Sổ thu phí: “Lô 188 · chè đậu trắng · ký nhận: Người giữ sổ.” Mực tím, nét còn bóng như mới viết.',
        L189: 'Sổ thu phí: “Lô 189 · đèn dầu · ký nhận: Người giữ sổ.” Mực tím. Ba lô mực tím, mỗi lô ba mươi triệu, cộng lại chín mươi triệu không ai đứng nhận.',
        TONG: 'Tổng cuối trang: “186 dòng. Khớp sơ đồ.” Nét chữ anh Toàn. Bằng đúng số ô trên sơ đồ, nhưng không phải cùng những người.'
      },
      answers: [
        { text: '186 hộ như sổ thu phí: khớp sơ đồ, chốt cho anh Toàn', next: 't2_p1_khop', flags: { nhan_lo_ma: true } },
        { text: '184 hộ: gạch ba lô mực tím, tách lô 93–94 thành hai hộ', next: 't2_p1_dung', flags: { doi_chieu_dung: true } },
        { text: '183 hộ: gạch ba lô mực tím, giữ nguyên lô 93–94', next: 't2_p1_thieu', flags: { ghep_93: true } },
        { text: '183 hộ: gạch ba lô mực tím, tách lô 93–94, và tính sạp 47 là sạp trống', next: 't2_sap_trong' }
      ]
    },

    t2_p1_tre: {
      time: '23:58',
      title: 'Anh Toàn đã báo số',
      text: [
        'Anh Toàn không chờ được nữa. Anh bấm máy: “Dạ anh Hiển, 186 hộ, khớp sổ khớp sơ đồ.” Đầu dây bên kia có tiếng cười nhẹ nhõm của một người còn trẻ.',
        'Bạn kéo cuốn sổ về phía mình, chỉ cho anh ba dòng mực tím ở cuối trang. Anh Toàn đọc, mặt xám lại. “Ba lô này… sơ đồ đâu có.” Anh định gọi lại, rồi không gọi. Con số đã báo rồi.'
      ],
      effects: { TT: -10, SN: -1 },
      flags: { toan_bao_khop: true },
      gain: { clues: ['Anh Toàn đã báo 186 hộ cho anh Hiển, chủ đầu tư, trước khi thấy ba dòng mực tím.'] },
      choices: [{ text: 'Xuống sạp vải của bà Hai', next: 't2_hai' }]
    },

    t2_p1_khop: {
      time: '00:00',
      title: 'Số đẹp',
      text: [
        'Bạn gật đầu. Anh Toàn mừng ra mặt, chụp trang sổ gửi đi liền. “Số đẹp vậy là chủ đầu tư khỏi hỏi, chị.”',
        'Quạt trần ngừng quay. Trong sổ thu phí, ba dòng mực tím đậm lên như vừa được tô lại. Ở dòng Lô 188, sau chữ “chè đậu trắng”, hiện thêm mấy chữ mới: “đã có người kiểm đếm.”',
        'Qua cửa kính, ở dãy cuối đã dỡ dưới nhà lồng, ba ngọn đèn dầu bật sáng. Ba cái sạp không có trên sơ đồ.'
      ],
      effects: { SN: -2, DN: 10, TC: 5 },
      gain: { clues: ['Khi chốt 186 dòng như sổ, ba ngọn đèn dầu bật sáng ở dãy cuối đã dỡ, đúng ba lô mực tím.'] },
      choices: [{ text: 'Xuống sạp vải của bà Hai', next: 't2_hai' }]
    },

    t2_p1_dung: {
      time: '00:00',
      title: 'Đúng người',
      text: [
        'Bạn lấy thước, gạch ba dòng mực tím bằng một nét bút bi xanh, rồi viết bên lề: “Không có trên sơ đồ 1998. Không có sạp. Không người nhận.” Dòng Lô 93–94 bạn tách làm hai: bà Lựu, bà Huệ.',
        '184. Không khớp sơ đồ, không khớp sổ, nhưng là 184 người có thật. Anh Toàn đọc đi đọc lại, rồi ngồi phịch xuống ghế. “Ba dòng đó có từ hồi em chưa về,” anh nói. “Năm nào cũng thu đủ phí. Có người đóng, mà em không biết ai.”',
        'Quạt trần quay đều trở lại. Dưới nhà lồng, một bóng đèn tròn vừa tắt hồi nãy sáng lên.'
      ],
      effects: { SN: 2, TC: 5 },
      gain: { clues: ['Ba lô mực tím 187, 188, 189 năm nào cũng có người đóng đủ phí, anh Toàn không biết là ai.'] },
      choices: [{ text: 'Xuống sạp vải của bà Hai', next: 't2_hai' }]
    },

    t2_p1_thieu: {
      time: '00:00',
      title: 'Thiếu một hộ',
      text: [
        'Bạn gạch ba dòng mực tím. Tổng còn 183. Anh Toàn nhăn mặt vì lệch sơ đồ ba số, nhưng anh chịu: bạn đã chỉ cho anh thấy ba lô ấy không có thật.',
        'Lúc bạn khép sổ, có tiếng gọi vọng lên từ dưới nhà lồng. Một bà cụ tóc bạc đứng ở lối đi giữa dãy C và dãy D, hai tay chắp trước bụng. “Cô ơi, sạp 94 của tui có tên chưa cô? Tui là Huệ, em bà Lựu.” Bà đã chờ ở đó từ chiều.',
        'Bạn chưa kịp trả lời thì anh Toàn đã cất sổ vào ngăn kéo.'
      ],
      effects: { SN: -1 },
      gain: { clues: ['Bà Huệ bán rau ở sạp 94, đóng phí chung với chị là bà Lựu từ năm 2011. Sổ thu phí ghép hai sạp làm một dòng.'] },
      choices: [{ text: 'Xuống sạp vải của bà Hai', next: 't2_hai' }]
    },

    /* ===== 00:15 · Khoảnh khắc nhân vật: bà Hai mở sổ nợ ===== */
    t2_hai: {
      time: '00:15',
      title: 'Sổ nợ của bà Hai',
      text: (s) => {
        const t = [
          'Bà Hai ngồi ở sạp vải, bao tải xếp cao sau lưng. Bà mở cuốn sổ nợ gáy vải trên đùi, lật chậm. Bốn mươi lăm năm, ai thiếu ai trong chợ này, bà ghi hết: thiếu tiền, thiếu vải, thiếu một bữa cơm, thiếu một lời xin lỗi.',
          '“Chợ này đứng được là nhờ nợ,” bà nói. “Người ta còn thiếu nhau thì còn quay lại. Cô coi.” Bà chỉ dòng chữ viết tay trên bìa trong: “Nợ của người đã đi thì để người thân trả hoặc tha.”',
          'Trang sạp 47, mực xanh: “Lan, mượn 4 triệu mua thùng đá, tháng 3/2019.” Bạn tìm dòng mực tím trong bản chụp. Nó không có ở đây. Trang sổ của bà Hai chỉ có mực xanh.'
        ];
        if (s.flags.m1_ghi_su_that) t.push('Bà Hai ngước lên nhìn bạn, lần đầu tiên trong đêm. “Cô là cô ghi số thật ở chung cư ngoài tỉnh hả? Vậy cô đọc được sổ này.”');
        if (s.flags.chep_muc_tim) t.push('Bạn mở sổ đo, đặt bản chép cạnh trang sổ của bà Hai. Lần này bạn để ý một điều lúc chép đã bỏ qua: cuối dòng mực tím có ghi giờ.');
        return t;
      },
      gain: { rules: ['L6'], clues: ['Trong sổ nợ thật của bà Hai, trang sạp 47 chỉ có mực xanh: mẹ Mi mượn 4 triệu, tháng 3/2019. Dòng mực tím trong bản chụp không có ở đây.'] },
      choices: [
        { key: 'A', text: 'Hỏi bà Hai: ai có thể viết dòng mực tím vào sổ của bà?', next: 't2_hai_hoi' },
        { key: 'B', text: 'Khuyên bà Hai xóa hết nợ trong sổ trước khi chợ đóng, cho mọi người nhẹ lòng', next: 't2_hai_xoa', flags: { khuyen_xoa_no: true } },
        { key: 'C', text: 'Đọc cho bà Hai nghe giờ ký ở cuối dòng mực tím bạn đã chép', next: 't2_hai_gio', cond: (s) => !!s.flags.chep_muc_tim, flags: { thay_gio_ky: true } }
      ]
    },

    t2_hai_hoi: {
      time: '00:20',
      title: 'Cuốn sổ khác',
      text: [
        'Bà Hai gấp sổ, ôm vào ngực. “Không ai viết vô sổ tui được. Sổ này tui ngủ cũng gối đầu.” Rồi bà im một lúc. “Mà chợ này có một cuốn sổ khác.”',
        '“Hồi trước, ai chết mà còn nợ, có người tới ký nhận thay. Nói là để người nhà khỏi lo. Ký bằng mực tím. Ký xong thì nợ không mất, mà cũng không ai trả được nữa. Nó nằm đó, như cái sạp không ai dọn.”',
        'Bà nhìn ra dãy B, chỗ bóng đèn sạp 47 vẫn sáng. “Con Lan thiếu tui bốn triệu. Tui đâu có đòi. Tui chỉ không muốn ai ký thay nó.”'
      ],
      effects: { TC: 5 },
      gain: { clues: ['Bà Hai: ai chết mà còn nợ, có người tới ký nhận thay bằng mực tím. Ký xong thì nợ không mất, mà cũng không ai trả được nữa.'] },
      choices: [{ text: '…', next: 't2_nut3' }]
    },

    t2_hai_xoa: {
      time: '00:20',
      title: 'Xóa cho nhẹ',
      text: [
        '“Chợ đóng rồi, bà xóa hết cho mọi người nhẹ lòng,” bạn nói. Nghe rất phải. Bà Hai nhìn bạn như nhìn một đứa cháu nói điều nó chưa hiểu.',
        '“Xóa hết thì ai nhớ ai?” Bà gõ ngón tay lên bìa sổ. “Người ta tha nhau thì người ta tha. Mình đâu có quyền xóa giùm.” Bà kéo cuốn sổ sát vào người hơn.',
        'Trên tấm vé thu phí bạn cầm làm giấy nháp, ở mặt sau, có một dòng mực tím lúc nãy chưa có: “Xóa hết nợ thì ai cũng nhẹ người.” Không năm, không dấu ban quản lý.'
      ],
      effects: { SN: -1, TC: -5, DN: 5 },
      gain: { rules: ['L7'] },
      choices: [{ text: '…', next: 't2_nut3' }]
    },

    t2_hai_gio: {
      time: '00:20',
      title: 'Giờ ký',
      text: [
        'Cuối dòng mực tím, sau chữ “Người giữ sổ”, có bốn con số nhỏ: 06:00. Bà Hai đeo kính, đọc lại bản chép của bạn rất lâu. “Sáu giờ sáng mai,” bà nói. “Là giờ chợ bàn giao.”',
        '“Dòng này chưa có ai viết, mà đã có người ký nhận rồi.” Bà gấp sổ lại. “Cô coi chừng. Sáng mai, ai đứng ký ở sạp 47, người đó gánh cái nợ này.”'
      ],
      effects: { TC: 10 },
      gain: { clues: ['(Hiếm) Dòng mực tím trong bản chụp đề giờ ký 06:00 sáng mai, giờ chợ bàn giao. Trong sổ thật, dòng ấy chưa có ai viết.'] },
      choices: [{ text: '…', next: 't2_nut3' }]
    },

    /* ===== NÚT 3 · 00:40 · Con số tổng ===== */
    t2_nut3: {
      time: '00:40',
      title: 'Nút 3 · Con số tổng',
      checkpoint: true,
      danger: true,
      timer: { sec: 30, next: 't2_n3_het_gio', label: 'Anh Toàn đang cầm bút' },
      text: (s) => {
        const t = [
          'Anh Toàn xuống tận sạp vải tìm bạn, cầm theo biên bản kiểm đếm in sẵn. Ô cuối cùng còn trống: “Tổng số hộ tiểu thương được hỗ trợ: …”, và dòng “Kiểm đếm viên ký, ghi rõ họ tên.”',
          '“Chị ký giùm em trước một giờ,” anh nói. “Bốn giờ anh Hiển xuống, ảnh muốn bàn giao sạch. Ảnh còn nói sẽ xóa hết nợ nần trong chợ cho bà con, ảnh chịu hết.” Anh cười, như người vừa được tha một món nợ.'
        ];
        if (s.flags.toan_bao_khop || s.flags.nhan_lo_ma) t.push('Anh đã báo 186 cho chủ đầu tư. Nếu bạn ký khác, anh phải gọi lại, và giải thích.');
        t.push('Bà Hai không nói gì. Bà chỉ đặt tay lên cuốn sổ nợ, như đặt tay lên một đứa nhỏ đang ngủ.');
        return t;
      },
      choices: [
        { key: 'A', text: 'Ký 184 hộ có thật: gạch ba lô mực tím, tách lô 93–94, ghi chú sạp 47 còn treo đèn', next: 't2_ky_that', flags: { ky_so_that: true } },
        { key: 'B', text: 'Ký 186 hộ như sổ thu phí: anh Toàn yên, chủ đầu tư yên, không ai phải giải thích', next: 't2_ky_khop', flags: { ky_so_khop: true } },
        { key: 'C', text: 'Chưa ký: để sáng mai đủ tiểu thương có mặt rồi mới chốt', next: 't2_bo_trong', flags: { bo_trong_1: true } }
      ]
    },

    t2_n3_het_gio: {
      time: '00:41',
      title: 'Ký thay',
      checkpoint: true,
      text: [
        'Anh Toàn nhìn đồng hồ, rồi nhìn bạn. “Thôi chị đang bận, em ký thay chị cho kịp nha. Chị coi lại sau.” Anh ghi 186, ký một chữ ký vội vào ô của kiểm đếm viên.',
        'Bạn giật lại tờ biên bản. Chữ ký của anh Toàn đang ngả sang màu tím, từ ngoài vào trong, như giấy thấm mực. Anh nhìn bàn tay mình. Đầu ngón trỏ của anh cũng tím.',
        'Anh Toàn đưa cây bút cho bạn, tay run. Bạn gạch chữ ký của anh. Ô tổng vẫn còn số 186 của anh.'
      ],
      effects: { TT: -5, DN: 5 },
      flags: { toan_ky_thay: true },
      choices: [
        { key: 'A', text: 'Sửa lại: 184 hộ có thật, ghi chú đủ, rồi ký tên mình', next: 't2_ky_that', flags: { ky_so_that: true } },
        { key: 'B', text: 'Giữ con số 186 anh Toàn đã ghi, chỉ ký lại bằng tên mình', next: 't2_ky_khop', flags: { ky_so_khop: true } }
      ]
    },

    t2_ky_that: {
      time: '00:50',
      title: 'Chữ ký của mình',
      text: (s) => [
        'Bạn viết: 184. Bên dưới, từng dòng ghi chú: ba lô 187, 188, 189 không có trên sơ đồ, không có sạp, không có người nhận. Lô 93 bà Lựu, lô 94 bà Huệ. Sạp 47 còn treo đèn, đứng tên bà Lan, người thừa kế là Mi. Rồi bạn ký, và ghi rõ họ tên mình.',
        '“Vậy là em phải giải thích với anh Hiển ba lô mực tím,” anh Toàn gãi đầu. Anh ngừng một chút. “Mà cũng phải. Em thu phí ba lô đó mười mấy năm, chưa thấy mặt ai.”',
        'Ở dãy B, bóng đèn sạp 47 vẫn sáng. Bà Hai khép sổ nợ, gật đầu với bạn một cái rất nhỏ. ' + (s.flags.mi_ve ? 'Ở góc chợ, Mi vẫn ngồi trên yên xe. Cô không lại gần, nhưng đã thôi nhìn ra cổng.' : 'Mi đứng ở đầu dãy B, không lại gần, nhưng đã thôi quay lưng.')
      ],
      effects: { SN: 2, DN: -10, TC: 5 },
      choices: [{ text: '…', next: 'het_man1' }]
    },

    t2_ky_khop: {
      time: '00:50',
      title: 'Số khớp',
      text: [
        'Bạn ký dưới con số 186, như sổ. Không ghi chú. Anh Toàn thở phào, chụp hình gửi đi liền. Con số khớp sơ đồ thì không ai hỏi.',
        'Ở dãy cuối đã dỡ, ba ngọn đèn dầu sáng lên, đều nhau như ba sạp mới mở hàng. Bạn nghe lại tiếng rao, lần này rõ từng chữ: “Chè đậu trắng đây… cô kiểm đếm ký rồi… ăn đi, trả sau…”',
        'Bà Hai không nhìn bạn. Bà lật sổ nợ tới một trang trắng, rồi lại gấp vào.'
      ],
      effects: { SN: -2, DN: 10 },
      choices: [{ text: '…', next: 'het_man1' }]
    },

    t2_bo_trong: {
      time: '00:50',
      title: 'Ô để trống',
      text: [
        '“Sáng mai đủ người rồi chốt,” bạn nói, và trả lại biên bản với ô tổng còn trống. Anh Toàn nhăn nhó nhưng không cãi. Anh kẹp biên bản vào sổ thu phí, mang lên gác.',
        'Mười phút sau, anh chạy xuống, cầm biên bản bằng hai tay như cầm một thứ nóng. Ô tổng đã có số: 189. Mực tím. Ở dòng kiểm đếm viên ký có một chữ ký bạn không viết. Bên dưới là ba chữ: Người giữ sổ.',
        '“Em không có ghi,” anh Toàn nói. “Em thề.” Bạn biết anh không nói dối. Ô trống ở chợ này không bao giờ trống lâu.'
      ],
      effects: { SN: -2, DN: 10 },
      gain: { clues: ['Để trống ô tổng thì mười phút sau ô ấy tự có số 189 bằng mực tím, ký “Người giữ sổ”.'] },
      choices: [{ text: '…', next: 'het_man1' }]
    },

    het_man1: {
      type: 'actend',
      title: 'Hết Màn 1 · Sổ nợ',
      time: '01:00',
      next: 'Màn 2 · Chợ ma',
      teaser: 'Từ ba giờ sáng, chợ Sớm họp phiên của nó. Người bán đã mất bày hàng ra, rao bán bằng lời hứa, và đòi thối tiền cho bạn. Ở sạp 47, có tiếng ai gọi Mi.',
      recap: (s) => {
        const f = s.flags, out = [];
        if (f.ky_so_that) out.push('Bạn đã ký 184 hộ có thật, kèm ghi chú ba lô mực tím và lô 93–94.');
        else if (f.ky_so_khop) out.push('Bạn đã ký 186 hộ như sổ thu phí, có cả ba lô mực tím.');
        else if (f.bo_trong_1) out.push('Bạn để trống ô tổng. Có người đã điền 189 và ký thay bạn bằng mực tím.');
        if (f.ghi_47_that) out.push('Sạp 47 được ghi đúng: còn treo đèn, người thừa kế là Mi.');
        if (f.hoi_me_mi) out.push('Mi đã kể đêm cuối của má cô ở chợ.');
        if (f.thay_gio_ky) out.push('Bạn biết giờ ký của dòng mực tím: 06:00 sáng mai.');
        if (f.toan_ky_thay) out.push('Đầu ngón trỏ của anh Toàn đã ngả tím.');
        return out;
      },
      summary: (s) => [
        s.flags.ky_so_that ? ['Số hộ có thật bạn ký', '184'] : s.flags.ky_so_khop ? ['Số hộ bạn ký (gồm 3 lô mực tím)', '186'] : ['Số hộ Người giữ sổ ký thay bạn', '189'],
        ['Số dòng trong sổ thu phí', '186']
      ]
    },

    /* ===== KẾT THÚC THẤT BẠI ===== */
    t2_sap_trong: {
      type: 'ending',
      title: 'Sạp trống',
      text: [
        'Bạn viết vào ô tình trạng: “Sạp 47: trống.” Mi thở ra, cảm ơn bạn hai lần. Anh Toàn gật đầu: thêm một sạp trống là thêm một dòng gọn.',
        'Bóng đèn trên quầy không tắt. Nó sáng hơn. Dưới quầy, mấy thùng xốp tự dịch ra, chừa một chỗ vừa đủ cho một người ngồi. Bạn thấy chân mình bước vào chỗ đó trước khi bạn kịp nghĩ.',
        'Sạp còn treo đèn thì chưa trống. Bạn vừa ghi nó trống, nên chợ tìm người ngồi vào cho đủ.',
        'Sáu giờ sáng, đội tháo dỡ đến. Họ thấy sạp 47 đang mở hàng: quầy gạch men lau sạch, cái cân kim đỏ chỉ đúng số không, và một cô gái mặc áo khoác của Trung tâm ngồi sau quầy, mỉm cười với từng người đi qua, chờ khách.',
        'Mi nhận mười hai triệu tiền trả mặt bằng. Cô mang bốn triệu tới trả bà Hai. Bà Hai không nhận. Bà mở sổ nợ, ghi thêm một dòng ở trang sạp 47, bằng mực xanh: “Cô kiểm đếm. Còn ngồi đó.”'
      ]
    },

    t2_giu_lai_cho: {
      type: 'ending',
      title: 'Giữ lại chợ',
      text: [
        'Mỗi lần bạn chọn điều gọn hơn, chợ ghi thêm một dòng: một con số khớp, một chữ ký không phải của mình, một món nợ được xóa giùm. Đến một lúc, bạn nợ chợ nhiều hơn chợ nợ bạn.',
        'Bóng đèn dọc lối đi tắt dần từ cuối nhà lồng vào, từng cặp một. Chỉ còn những ngọn đèn dầu ở dãy cuối là sáng. Ai đó đã dọn sẵn cho bạn một cái ghế nhựa thấp, một tấm ni lông, một cái cân.',
        'Người ta xây trung tâm thương mại trên nền chợ Sớm. Bảo vệ ca đêm kể: ba giờ sáng, ở tầng hầm giữ xe, có một sạp nhỏ dọn hàng. Cô bán hàng không bán gì, chỉ ghi sổ. Ai đi ngang cũng được cô hỏi: “Anh chị còn thiếu ai không? Để em ghi giùm.”'
      ]
    },

    t2_dem_mai: {
      type: 'ending',
      title: 'Đếm mãi',
      text: [
        'Bạn đếm sạp để giữ tỉnh táo. Một trăm tám mươi tư. Một trăm tám mươi lăm. Một trăm tám mươi sáu.',
        'Một trăm tám mươi bảy. Bạn biết không có sạp ấy, nhưng ngón tay bạn vẫn chỉ vào một khoảng trống và miệng bạn vẫn đếm. Một trăm tám mươi tám. Một trăm tám mươi chín. Một trăm chín mươi.',
        'Sáng hôm sau, anh Toàn tìm thấy bạn ở dãy cuối đã dỡ, đi chậm dọc bức tường, đếm những sạp không có. Người ta nói cô kiểm đếm viên ấy về sau làm việc rất kỹ. Cô chỉ không bao giờ đếm xong.'
      ]
    }
  };

  ST.endingsList = [
    { id: 't2_ket_man1', title: 'Kết Màn 1: Đèn sạp 47', kind: 'act', act: 1, hint: 'Đi hết đêm đầu tiên ở chợ Sớm và tự tay ký con số tổng.' },
    { id: 't2_sap_trong', title: 'Sạp trống', kind: 'fail', act: 1, hint: 'Sạp còn treo đèn thì chưa trống, dù người thân nhờ.' },
    { id: 't2_giu_lai_cho', title: 'Giữ lại chợ', kind: 'fail', act: 1, hint: 'Nợ chồng nợ: Sổ nợ xuống −6, hoặc chợ níu bạn quá chặt (Độ neo chạm 60).' },
    { id: 't2_dem_mai', title: 'Đếm mãi', kind: 'fail', act: 2, hint: 'Khi Tỉnh táo cạn kiệt.' }
  ];
  ST.actEndingOf = () => 't2_ket_man1';
  ST.endingIcons = { t2_ket_man1: 'bulb', t2_sap_trong: 'stall', t2_giu_lai_cho: 'ledger', t2_dem_mai: 'tally' };
  ST.moodOf = (S, st) => ((st.fx || []).includes('ghostlamps') ? 'tense' : 'night');

  /* ---------- Dàn dựng 3D + âm thanh ----------
     view: trungtam · nhalong · sap47 · bql   (tap-2/scene.js) */
  const TAB = (num, note, c) => [{ t: 'Chợ Sớm · Phú Cầu', s: 46, wt: 600, c: '#9fc3ff' }, { t: num, s: 120, c: '#ffffff', mono: true }, { t: note, s: 48, wt: 700, c: c || '#ffd27a' }];
  ST.T2 = { SANS, NUM, PURPLE, PAPER, TAB, t1End, signed };
  ST.staging = {
    t2_mo:         { view: 'trungtam', cast: [], fx: ['folder'] },
    t2_cho:        { view: 'nhalong', cast: ['toan', 'hai'], fx: ['gate'], sfx: ['shutter'] },
    t2_nut1:       { view: 'sap47', cast: ['mi', 'toan'], fx: ['lamp'], sfx: ['heart'] },
    t2_n1_het_gio: { view: 'sap47', cast: ['mi', 'toan'], fx: ['lamp', 'swing', 'shake'], sfx: ['thud'] },
    t2_n1_that:    { view: 'sap47', cast: ['mi', 'toan'], fx: ['lamp', 'soft'] },
    t2_n1_tat:     { view: 'sap47', cast: ['mi', 'toan'], fx: ['lamp_relight'], sfx: ['click', 'thud'] },
    t2_mi:         { view: 'nhalong', cast: ['mi'], fx: ['close_mi'] },
    t2_mi_hoi:     { view: 'nhalong', cast: ['mi'], fx: ['close_mi'] },
    t2_mi_ve:      { view: 'nhalong', cast: ['mi'], fx: ['close_mi', 'mi_far'] },
    t2_rao:        { view: 'nhalong', cast: ['toan'], fx: ['far'], sfx: ['call'] },
    t2_rao_theo:   { view: 'nhalong', cast: [], fx: ['deep', 'che'], sfx: ['call'] },
    t2_rao_dung:   { view: 'nhalong', cast: ['toan'], fx: ['far'] },
    t2_toan:       { view: 'bql', cast: ['toan'], fx: ['fan'] },
    t2_p1:         { view: 'bql', cast: ['toan'], fx: ['fan', 'tablet'], tablet: TAB('186', 'Khớp sổ thu phí', '#8fe0a8') },
    t2_p1_tre:     { view: 'bql', cast: ['toan'], fx: ['fan'], sfx: ['phone'] },
    t2_p1_khop:    { view: 'nhalong', cast: [], fx: ['deep', 'ghostlamps'], sfx: ['sting'] },
    t2_p1_dung:    { view: 'bql', cast: ['toan'], fx: ['fan', 'tablet'], tablet: TAB('184', 'Đúng người, lệch sổ') },
    t2_p1_thieu:   { view: 'nhalong', cast: ['hue'], fx: ['hue'] },
    t2_hai:        { view: 'nhalong', cast: ['hai'], fx: ['close_hai'] },
    t2_hai_hoi:    { view: 'nhalong', cast: ['hai'], fx: ['close_hai'] },
    t2_hai_xoa:    { view: 'nhalong', cast: ['hai'], fx: ['close_hai', 'purple'] },
    t2_hai_gio:    { view: 'nhalong', cast: ['hai'], fx: ['close_hai'] },
    t2_nut3:       { view: 'nhalong', cast: ['hai', 'toan'], fx: ['close_hai', 'tablet'], sfx: ['heart'], tablet: TAB('…', 'Chờ chữ ký') },
    t2_n3_het_gio: { view: 'nhalong', cast: ['hai', 'toan'], fx: ['close_hai', 'purple'] },
    t2_ky_that:    { view: 'nhalong', cast: ['hai', 'toan', 'mi'], fx: ['close_hai', 'tablet'], tablet: TAB('184', 'Đã ký', '#8fe0a8') },
    t2_ky_khop:    { view: 'nhalong', cast: [], fx: ['deep', 'ghostlamps'], sfx: ['call'] },
    t2_bo_trong:   { view: 'nhalong', cast: ['hai', 'toan'], fx: ['close_hai', 'purple', 'tablet'], tablet: TAB('189', 'Người giữ sổ', '#c9a0ff') },
    het_man1:      { view: 'nhalong', cast: [], fx: ['wide'] },
    t2_sap_trong:  { view: 'sap47', cast: [], fx: ['lamp', 'owner'] },
    t2_giu_lai_cho:{ view: 'nhalong', cast: [], fx: ['deep', 'ghostlamps', 'blackout'] },
    t2_dem_mai:    { view: 'nhalong', cast: [], fx: ['deep'] },
    menu:          { view: 'nhalong', cast: [], fx: ['menu'] }
  };
})();
