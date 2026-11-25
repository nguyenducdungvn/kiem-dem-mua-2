/* =========================================================
   KIỂM ĐẾM CA ĐÊM · MÙA 2 · TẬP 1: BÃI BỒI
   Màn 3: "Bàn giao" (03:30 – 06:00) · màn cuối của tập
   Gộp thêm vào STORY: cảnh t1_m3_*, mini-game đối chiếu ba tờ giấy (p4),
   hai kết cuối, trang "Cồn Lở" của sổ đo xuyên mùa. het_man3 là màn cuối (final).
   ========================================================= */
(function () {
  'use strict';
  const S0 = window.STORY;
  const SANS = "'Be Vietnam Pro', Arial, sans-serif";
  const NUM = "'Roboto Mono', monospace";

  S0.acts[2].scene = 't1_m3_mo';
  delete S0.acts[2].soon;
  S0.meta.version = '2.0.0';
  S0.meta.menu.sub = 'Làng Cồn Lở · Trọn tập, 3 màn';
  S0.meta.menu.facts = ['Khoảng 40 phút · 3 màn', 'Lựa chọn có hậu quả'];

  const area112 = (s) => (s.flags.ghi_so_ro ? S0.areaOf(s) : '214,0');
  const signed2007 = (s) => (s.flags.ky_that ? '248,6 m²' : s.flags.ky_muc_tim ? '311,0 m²' : '311,0 m² (để trống, có người ký thay)');
  // Điểm trung thực của Tập 1, 0–6
  S0.honesty1 = (s) => {
    const f = s.flags;
    return (f.ghi_so_ro ? 1 : 0) + (!f.theo_muc_tim && !f.moc_gps ? 1 : 0) + (f.do_sao_dung && !f.do_them_muc_tim ? 1 : 0)
      + (f.chung_cu ? 1 : 0) + (f.ky_that ? 1 : 0) + (f.giu_bang ? 1 : 0);
  };
  const baTuKy = (s) => !!s.flags.ky_that && (s.flags.chung_cu || s.flags.cho_ba_xem || s.TC >= 70);

  /* ---------- Sổ đo xuyên mùa: trang Cồn Lở mở ở cuối tập ---------- */
  S0.notebook = (s) => [
    { title: 'Bìa sổ', open: true, text: 'Sổ đo của Lương Thục Anh, dùng từ đêm ở nhà B4. Sau buổi bàn giao, cô thấy bốn trang cuối bị dán kín bằng hồ gạo. Trên mỗi trang có một dòng bút chì, nét chữ của ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu.' },
    { title: 'Trang Cồn Lở', open: !!s.flags.mo_trang_1, text: 'Hồ gạo bong ra khi trời sáng. Bên trong là sơ đồ ba cây gạo vẽ bút chì, ba tia mực xanh gặp nhau ở mép nước. Bên dưới, nét chữ ông Kha: “Người giữ sổ không phải tên của một người. Ai ký thay người đã đi, người đó đang giữ sổ. Đừng để cô ấy ký thay ai.”' },
    { title: 'Trang Chợ Sớm', open: false, text: '' },
    { title: 'Trang Ca Ba', open: false, text: '' },
    { title: 'Trang Con Dấu', open: false, text: '' }
  ];

  /* ---------- Mini-game: đối chiếu ba tờ giấy ---------- */
  const SVG_P4 = (() => {
    const card = (x, w, title, color, rows) => {
      let y = 96, out = `<rect x="${x}" y="40" width="${w}" height="330" rx="6" fill="#f6efdc" stroke="${color}" stroke-width="2"/>
        <text x="${x + 12}" y="68" font-family="${SANS}" font-size="14" font-weight="700" fill="${color}">${title}</text>`;
      rows.forEach(([id, label, val, mono, ink]) => {
        const h = val ? 48 : 30;
        out += `<g${id ? ` class="hit" data-id="${id}"` : ''}>
          <rect x="${x + 6}" y="${y - 18}" width="${w - 12}" height="${h}" rx="4" fill="${id ? '#fff8e6' : 'transparent'}" stroke="${id ? '#d3c7a8' : 'none'}"/>
          <text x="${x + 12}" y="${y}" font-family="${SANS}" font-size="12" fill="#6b5a3a">${label}</text>
          ${val ? `<text x="${x + 12}" y="${y + 20}" font-family="${mono ? NUM : SANS}" font-size="${mono ? 15 : 14}" font-weight="600" fill="${ink || '#2a251c'}">${val}</text>` : ''}
        </g>`;
        y += h + 8;
      });
      return out;
    };
    return `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đối chiếu biên bản 2007, sổ ông Tư và bảng con nước năm 2007">
<rect width="100%" height="100%" fill="#e9e0c8"/>
<text x="20" y="26" font-family="${SANS}" font-size="15" font-weight="700" fill="#2a251c">Ba tờ giấy cho cùng một đêm: 23 rạng 24/10/2007</text>
${card(14, 220, 'Biên bản sạt lở (mực tím)', '#6a2fa0', [
  [null, 'Hộ', 'Nguyễn Thị Tư'],
  ['BB_DT', 'Diện tích bị sạt lở', '311,0 m²', true, '#6a2fa0'],
  ['BB_GIO', 'Thời điểm đo', '03 giờ 00, rạng sáng 24/10', false, '#6a2fa0'],
  ['BB_KY', 'Người đo', 'Người giữ sổ (không họ tên)', false, '#6a2fa0'],
  ['BB_DAU', 'Xác nhận', 'Dấu đỏ UBND xã Cồn Lở', false, '#a33']
])}
${card(244, 176, 'Sổ đo ông Tư (mực xanh)', '#2f5f8f', [
  ['SO_GIO', 'Thời điểm đo', '01 giờ, nước ròng', false, '#2f5f8f'],
  ['SO_DT', 'Phần đã lở', '248,6 m²', true, '#2f5f8f'],
  [null, 'Cách đo', 'Ba cây gạo, sào'],
  [null, 'Trang sau', 'bị xé, dính mực tím']
])}
${card(430, 196, 'Bảng con nước 2007 (lưu trữ)', '#2a251c', [
  ['T22', '22:00', '2,3 m · đứng (đỉnh)', true],
  ['T01', '01:00', '0,9 m · ròng mạnh', true],
  ['T03', '03:00', '0,2 m · đứng (chân)', true],
  [null, 'Ghi chú', 'chép tay, trạm Cồn Lở']
])}
</svg>`;
  })();

  Object.assign(S0.scenes, {

    /* ===== 03:35 · Chòi trạm ===== */
    t1_m3_mo: {
      time: '03:35',
      title: 'Cây bút mực tím',
      act: 'Màn 3 · Bàn giao',
      checkpoint: true,
      effects: { MN: 1 },
      text: (s) => [
        'Chòi trạm. Mọi người ướt sũng, ngồi quanh cây đèn dầu. Con nước đã trở mình: nước lớn dần, mỗi lúc lại liếm lên một bậc đá ở bến.',
        `Anh Quý xoay tablet cho bạn xem. Hồ sơ thửa 112 chờ bàn giao với con số bạn đã ký: ${area112(s)} m². Bên dưới, một hồ sơ treo suốt hai mươi năm vừa tự mở lại: “112-cũ · Hộ Nguyễn Thị Tư · Diện tích bị sạt lở: chưa xác định.”`,
        '“Sáu giờ phần mềm khóa sổ,” anh nói. “Hồ sơ nào treo quá hai mươi năm mà không có số mới thì hệ thống tự lấy số cũ trong biên bản, tức 311,0.”',
        'Trên bàn, cạnh biên bản 2007, có một cây bút mực tím đã mở nắp. Ngòi còn ướt. Không ai trong chòi nhận là mình mang nó tới.'
      ],
      gain: { clues: ['Hồ sơ 112-cũ tự mở lại lúc 03:30. Nếu không có số mới trước 06:00, hệ thống tự lấy số cũ 311,0. Trên bàn có một cây bút mực tím không ai mang tới.'] },
      choices: [{ text: '…', next: 't1_m3_nut1' }]
    },

    /* ===== NÚT 1 · 03:50 ===== */
    t1_m3_nut1: {
      time: '03:50',
      title: 'Nút 1 · Hai con số',
      checkpoint: true,
      danger: true,
      timer: { sec: 25, next: 't1_m3_n1_het_gio', label: 'Anh Quý đang nhập số cũ' },
      text: (s) => [
        `Anh Quý đặt hai thứ cạnh nhau: biên bản 2007 ghi 311,0 m², và cuốn sổ của ông Tư ghi 248,6 m².${s.flags.tin_311 ? ' Con số bạn tính tới góc mực tím lúc nãy cũng là 311,0.' : ' Con số bạn đọc trên sào lúc nãy cũng là 248,6.'}`,
        '“Sổ tay của người đã mất không phải hồ sơ nhà nước,” anh nói, giọng mệt chứ không cứng. “Muốn sửa 311 thành 248,6 thì phải chỉ ra được biên bản 2007 sai ở chỗ nào. Không thì em giữ số cũ cho kịp giờ. Số cũ thì bà Tư được đền nhiều hơn mà.”',
        'Bà Tư ngồi ở góc chòi, tay đặt lên cuốn sổ của chồng.'
      ],
      choices: [
        { key: 'A', text: 'Đặt biên bản 2007, sổ ông Tư và bảng con nước năm ấy cạnh nhau, tìm chỗ sai', next: 't1_m3_p4' },
        { key: 'B', text: 'Giữ 311,0: bà Tư được nhiều nhất, khỏi phải lập lại hồ sơ', next: 't1_m3_n1B', flags: { giu_311: true } },
        { key: 'C', text: 'Gác hồ sơ 2007 lại, chỉ lo bàn giao thửa 112 cho kịp giờ', next: 't1_m3_n1C', flags: { gac_ho_so: true } }
      ]
    },

    t1_m3_n1_het_gio: {
      time: '03:51',
      title: 'Số cũ',
      text: [
        'Anh Quý gõ 311,0 vào ô diện tích, ngón tay lơ lửng trên nút Lưu. “Em lưu tạm nghen chị. Có gì sửa sau.”',
        'Bà Tư nhìn màn hình, rồi nhìn bạn. Bà không nói gì. Bạn nhớ lại lời bà ở bảng con nước lúc mười giờ tối: “Đừng nghe cái mực đó.”'
      ],
      effects: { TT: -5, DN: 10 },
      flags: { giu_311: true },
      choices: [{ text: '…', next: 't1_m3_ba_tu' }]
    },

    t1_m3_n1B: {
      time: '03:55',
      title: 'Giữ số cũ',
      text: [
        '“Cứ giữ 311,0,” bạn nói. “Bà Tư chờ hai mươi năm rồi. Giờ được nhiều thì càng tốt.”',
        'Anh Quý thở phào, gõ số vào máy. Bà Tư đứng dậy, đi ra bến, không nói lời nào. Anh Sáu nhìn theo má, rồi nhìn bạn, lần đầu tiên trong đêm với ánh mắt dò xét.',
        'Cây bút mực tím trên bàn lăn nhẹ một vòng, dừng lại ngay trước mặt bạn.'
      ],
      effects: { DN: 15, TC: -5 },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_n1C: {
      time: '03:55',
      title: 'Gác lại',
      text: [
        '“Hồ sơ 2007 để sau. Đêm nay mình lo cho xong thửa 112 đã.” Nghe hợp lý. Đúng quy trình. Ai cũng mệt.',
        'Bà Tư bật cười, một tiếng khô khốc. “Hai chục năm nay ai cũng nói để sau.” Bà đứng dậy, ra bến.',
        'Anh Quý gãi đầu: gác lại thì sáu giờ hệ thống vẫn tự lấy số 311,0. Gác lại cũng là chọn, chỉ là để người khác ký thay.'
      ],
      effects: { TC: -10, DN: 5 },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_p4: {
      time: '04:00',
      title: 'Đối chiếu ba tờ giấy',
      type: 'puzzle',
      paper: true,
      timer: { sec: 45, next: 't1_m3_p4_tre', label: 'Anh Quý sắp lưu số cũ' },
      text: ['Biên bản sạt lở, sổ ông Tư, và bảng con nước trạm Cồn Lở chép tay đêm ấy. Chạm vào các dòng tô nền để xem. Chỗ nào chứng minh con số 311,0 được đo sai?'],
      prompt: 'Chạm vào một dòng có tô nền.',
      svg: SVG_P4,
      inspect: {
        BB_DT: 'Biên bản: 311,0 m². Lớn hơn sổ ông Tư 62,4 m². Nhưng lớn hơn chưa chắc là sai: có khi sổ ông Tư mới thiếu.',
        BB_GIO: 'Biên bản: đo lúc 03 giờ 00, rạng sáng 24/10/2007.',
        BB_KY: 'Người đo không ghi họ tên, chỉ ký mực tím: Người giữ sổ. Thiếu họ tên là sai thủ tục, nhưng bổ sung được, và không làm con số sai đi.',
        BB_DAU: 'Dấu đỏ của Ủy ban xã Cồn Lở, rõ nét. Xã Cồn Lở có thật, con dấu cũng thật.',
        SO_GIO: 'Sổ ông Tư: đo lúc 01 giờ, nước ròng, bằng ba cây gạo và sào.',
        SO_DT: 'Sổ ông Tư: 248,6 m². Trùng với số đo bằng sào đêm nay, nếu đọc vạch ướt.',
        T22: 'Bảng con nước 2007: 22:00 · 2,3 m · nước đứng (đỉnh triều).',
        T01: 'Bảng con nước 2007: 01:00 · 0,9 m · ròng mạnh.',
        T03: 'Bảng con nước 2007: 03:00 · 0,2 m · nước đứng (chân triều). Bãi lộ rộng nhất trong đêm.'
      },
      answers: [
        { text: 'Giờ đo của biên bản: 03:00, đúng lúc nước đứng chân triều', next: 't1_m3_p4_dung', flags: { chung_cu: true } },
        { text: 'Người đo không ghi họ tên, chỉ ký mực tím', next: 't1_m3_p4_ky' },
        { text: 'Con dấu của xã Cồn Lở', next: 't1_m3_p4_dau' },
        { text: 'Con số 311,0 lớn hơn sổ ông Tư', next: 't1_m3_p4_dt' }
      ]
    },

    t1_m3_p4_tre: {
      time: '04:08',
      title: 'Đã lưu',
      text: [
        'Anh Quý bấm Lưu. “Em lưu tạm, chị tìm ra gì thì mình sửa.” Trên màn hình, ô 112-cũ hiện 311,0, kèm dòng chữ nhỏ: “Người nhập: hệ thống.”',
        'Bạn vẫn còn ba tờ giấy trên bàn, và một cảm giác mình đã nhìn thấy câu trả lời mà chưa kịp gọi tên.'
      ],
      effects: { MN: 1, TT: -5 },
      flags: { giu_311: true },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_p4_dung: {
      time: '04:05',
      title: 'Ba giờ sáng',
      text: [
        'Bạn đặt ngón tay lên dòng 03:00 của biên bản, rồi lên dòng 03:00 của bảng con nước. “Nước đứng chân triều. Bãi lộ rộng nhất. Người giữ sổ đo đúng cái giờ mà lời dặn trên cọc số 3 cấm đo.”',
        'Anh Quý nhìn ba tờ giấy rất lâu. Rồi anh mở tablet, tạo một biên bản bổ sung. “Có giờ đo sai, có sổ đo đúng giờ, có bảng con nước làm chứng. Vậy là đủ để sửa.”',
        'Bà Tư đứng dậy, đi tới bàn, đặt bàn tay khô quắt lên vai bạn. Chỉ vậy thôi. Rồi bà ra bến.'
      ],
      effects: { TC: 10, TT: 5 },
      gain: { clues: ['Biên bản 2007 đo lúc 03:00, đúng lúc nước đứng chân triều: giờ bãi lộ rộng nhất, giờ mà lời dặn R1 cấm đo. Ông Tư đo lúc 01:00, nước ròng mạnh.'] },
      choices: [{ text: 'Ra bến với bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_p4_ky: {
      time: '04:05',
      title: 'Không họ tên',
      text: [
        '“Người đo không ghi họ tên,” bạn nói. Anh Quý gật đầu, rồi lắc đầu. “Sai thủ tục thì bổ sung được chị. Thiếu tên không làm con số sai đi.”',
        'Anh vẫn chưa thấy chỗ con số sai. Bạn cũng chưa.'
      ],
      effects: { TT: -5, MN: 1 },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_p4_dau: {
      time: '04:05',
      title: 'Con dấu',
      text: [
        'Bạn soi con dấu dưới đèn dầu. Nét rõ, mực đỏ thấm đều. Anh Quý tra trên tablet: dấu thật của Ủy ban xã Cồn Lở, dùng tới năm 2025.',
        '“Dấu thật chị ơi.” Anh gác bút. Con dấu thật không làm con số thật.'
      ],
      effects: { TT: -5, MN: 1 },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    t1_m3_p4_dt: {
      time: '04:05',
      title: 'Lớn hơn',
      text: [
        '“311,0 lớn hơn sổ ông Tư sáu mươi hai mét vuông.” Anh Quý nhún vai. “Lớn hơn đâu có nghĩa là sai. Biết đâu ông Tư đo thiếu.”',
        'Bạn biết ông Tư không đo thiếu. Nhưng biết thì chưa đủ để chứng minh.'
      ],
      effects: { TT: -5, MN: 1 },
      choices: [{ text: 'Ra bến tìm bà Tư', next: 't1_m3_ba_tu' }]
    },

    /* ===== 04:20 · Khoảnh khắc nhân vật: bà Tư kể ===== */
    t1_m3_ba_tu: {
      time: '04:20',
      title: 'Đêm năm 2007',
      text: [
        'Bà Tư ngồi trên mũi đò, nhìn sang bờ bên kia. Lần này bà kể, không ai phải hỏi.',
        '“Đêm đó đất lở từ chín giờ. Tui chở mười bốn đứa nhỏ qua sông, con Lành đứng bên kia cầm đèn đón. Ông nhà tui ở lại. Ổng nói đất mình phải đo lúc nước ròng mới thiệt, đo xong mới đi.” Bà ngừng một chút. “Tui chèo về tới nơi thì ba giờ. Nước đứng. Chỗ ổng đứng không còn.”',
        '“Sáng ra có người đem biên bản tới cho tui ký. Ba trăm mười mét. Tui không ký. Ông nhà tui dạy: nước đứng thì đất giả bộ to. Tui không ký cái số ổng không đo.” Bà cười, một tiếng nhỏ. “Không ký thì không ai đền. Hai chục năm.”',
        '“Từ đó tối nào tui cũng chèo qua thắp cái đèn bên kia, cho ổng thấy đường về. Đêm nay là đêm cuối.”'
      ],
      gain: { clues: ['Bà Tư chưa bao giờ ký biên bản 311,0, vì ông Tư dạy “nước đứng thì đất giả bộ to”. Hồ sơ treo hai mươi năm vì chính bà từ chối con số sai. Tối nào bà cũng chèo qua thắp đèn bờ bên kia.'] },
      choices: [
        { key: 'A', text: 'Hứa với bà: lát nữa mình cùng làm đèn cho ông thấy đường lần cuối', next: 't1_m3_hua', flags: { hua_thap_den: true } },
        { key: 'B', text: 'Mở sổ ông Tư, chỉ cho bà con số 248,6 của chính ông', next: 't1_m3_cho_xem', flags: { cho_ba_xem: true } }
      ]
    },

    t1_m3_hua: {
      time: '04:30',
      title: 'Lời hứa',
      text: [
        'Bà Tư nhìn bạn, lần đầu tiên trong đêm nhìn thẳng. “Cô làm được hả?” Bạn không biết. Bạn vẫn gật đầu.',
        'Bà rút trong túi áo bà ba ra một hộp diêm ướt, chìa cho bạn. “Diêm của ổng. Ướt hết rồi. Tui giữ vậy thôi.”'
      ],
      effects: { TC: 5 },
      choices: [{ text: '…', next: 't1_m3_nut2' }]
    },

    t1_m3_cho_xem: {
      time: '04:30',
      title: 'Con số của ông',
      text: [
        'Bạn mở sổ, đưa đèn pin rọi vào dòng chữ cuối. Bà Tư không biết chữ nhiều. Bà dò từng số bằng đầu ngón tay, như dò vạch trên cây sào. Hai. Bốn. Tám. Sáu.',
        '“Ổng đo rồi,” bà nói, như nói với chính mình. “Ổng đo kịp rồi mới đi.” Bà gấp sổ lại, ôm vào ngực, rồi trả cho bạn. “Cô cầm. Cô ký cái số này cho ổng.”'
      ],
      effects: { TC: 10, DN: -5 },
      choices: [{ text: '…', next: 't1_m3_nut2' }]
    },

    /* ===== NÚT 2 · 04:50 ===== */
    t1_m3_nut2: {
      time: '04:50',
      title: 'Nút 2 · Đèn bờ bên kia lần cuối',
      checkpoint: true,
      danger: true,
      timer: { sec: 20, next: 't1_m3_n2_het_gio', label: 'Bà Tư đang tháo dây đò' },
      text: [
        'Đêm nay không ai chèo qua thắp đèn. Ngọn đèn ở bến Cồn Bồi chưa sáng lần nào từ lúc bạn rời ngôi nhà.',
        'Giữa dòng, chiếc xuồng có đèn bão lại hiện ra. Lần này người đội nón lá không vẫy. Người đó chèo rất chậm về phía bờ bên kia, rồi dừng lại giữa sông, quay mũi xuồng về phía bến. Đợi.',
        '“Ổng đợi tui,” bà Tư nói, tay đã cầm dây đò. Trên mái chòi trạm, dòng sơn cũ vẫn còn: “Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng.”'
      ],
      choices: [
        { key: 'A', text: 'Chèo cùng bà ra giữa dòng: bà muốn gặp ông lần cuối', next: 't1_giua_dong' },
        { key: 'B', text: 'Giữ bà lại ở bến, cùng bà chờ trời sáng', next: 't1_m3_n2B' },
        { key: 'C', text: 'Đưa bà cây đèn pin: rọi sang bờ bên kia như ông từng chờ', next: 't1_m3_n2C', cond: (s) => !!s.flags.hua_thap_den },
        { key: 'C', text: 'Nhờ cô Lành giơ đèn lên như đêm năm 2007', next: 't1_m3_n2D', cond: (s) => !s.flags.hua_thap_den && (s.flags.giu_bang || s.flags.ba_tu_ke || s.TC >= 75) }
      ]
    },

    t1_m3_n2_het_gio: {
      time: '04:51',
      title: 'Dây đò',
      text: [
        'Bà Tư đã đẩy đò ra. Bạn và anh Sáu lao xuống nước, níu được mạn đò khi nó vừa trôi khỏi bậc đá. Nước lạnh tới ngực.',
        'Hai người kéo đò về. Bà Tư không chống cự. Bà chỉ ngồi im trên đò, nhìn chiếc xuồng giữa dòng mờ dần, tắt, như một ngọn đèn hết dầu.'
      ],
      effects: { TT: -10, MN: 1 },
      choices: [{ text: '…', next: 't1_m3_nut3' }]
    },

    t1_m3_n2B: {
      time: '04:55',
      title: 'Chờ sáng',
      text: [
        'Bạn đặt tay lên tay bà, trên sợi dây đò. “Bà ơi, mình chờ sáng nghen bà.” Bà Tư không giật tay ra.',
        'Hai người ngồi trên bậc đá. Chiếc xuồng giữa dòng đợi rất lâu, rồi đèn bão tắt dần, như một ngọn đèn hết dầu. Bà Tư khóc không thành tiếng.',
        'Đúng luật. Bạn biết là đúng. Bạn vẫn thấy mình như vừa giữ một người ở lại khỏi một cuộc hẹn.'
      ],
      effects: { TT: -5, TC: 5 },
      flags: { giu_ba: true },
      choices: [{ text: '…', next: 't1_m3_nut3' }]
    },

    t1_m3_n2C: {
      time: '04:55',
      title: 'Ba nhịp đèn',
      text: [
        'Bạn đưa bà cây đèn pin. Bà Tư đứng thẳng trên mũi đò, giơ đèn về phía bờ bên kia, bật tắt ba lần. Ba nhịp. Như người đưa đò gọi đò.',
        'Bên kia sông, ngọn đèn ở bến Cồn Bồi sáng lên. Không ai thắp nó.',
        'Chiếc xuồng giữa dòng quay mũi, chèo thong thả về phía ngọn đèn. Tới bến bên kia thì đèn bão tắt, nhẹ, như có người thổi trước khi đi ngủ. Bà Tư hạ đèn pin xuống. “Ổng về tới rồi.”'
      ],
      effects: { TC: 10, DN: -10 },
      flags: { tien_ong: true },
      gain: { clues: ['(Hiếm) Bà Tư bật đèn pin ba nhịp, đèn bến Cồn Bồi tự sáng. Chiếc xuồng chèo về bờ bên kia rồi tắt đèn.'] },
      choices: [{ text: '…', next: 't1_m3_nut3' }]
    },

    t1_m3_n2D: {
      time: '04:55',
      title: 'Đèn của cô Lành',
      text: [
        'Cô Lành hiểu ngay. Cô bước ra mép bến, giơ cây đèn sạc lên cao, đứng yên như đêm năm 2007 cô đứng ở bờ bên kia.',
        'Một lúc lâu. Rồi bên kia sông, ngọn đèn ở bến Cồn Bồi sáng lên, đáp lại. Chiếc xuồng giữa dòng quay mũi, chèo về phía ấy, rồi tắt đèn.',
        '“Đứa nào cũng về được,” cô Lành nói khẽ. Bà Tư nắm tay cô, không nói gì.'
      ],
      effects: { TC: 5, DN: -5 },
      flags: { tien_ong: true },
      choices: [{ text: '…', next: 't1_m3_nut3' }]
    },

    /* ===== NÚT 3 · 05:30 · Chữ ký ===== */
    t1_m3_nut3: {
      time: '05:30',
      title: 'Nút 3 · Chữ ký',
      checkpoint: true,
      danger: true,
      text: (s) => {
        const f = s.flags, t = [];
        t.push('Năm giờ rưỡi. Trời bắt đầu xám ở phía đông. Anh Quý đặt lên bàn biên bản bổ sung cho hồ sơ 112-cũ. Ô diện tích còn trống. Ô người đo còn trống.');
        if (f.chung_cu) t.push('Kèm theo là bản chụp ba tờ giấy: biên bản đo lúc nước đứng, sổ ông Tư đo lúc nước ròng, bảng con nước đêm ấy. Đủ chứng cứ để sửa.');
        else t.push('Bạn có sổ ông Tư, nhưng chưa chỉ ra được biên bản 2007 sai ở đâu. Ký 248,6 bây giờ là ký bằng niềm tin, và bằng tên của bạn.');
        if (f.giu_311) t.push('Trên tablet, ô 112-cũ đang lưu tạm 311,0, người nhập: hệ thống.');
        t.push('Cây bút mực tím nằm cạnh tay bạn. Bạn không nhớ đã đặt nó ở đó. Bút của bạn thì nằm trong túi áo, còn ướt nước sông.');
        return t;
      },
      choices: [
        { key: 'A', text: 'Ký 248,6 m² bằng bút của mình, đính kèm sổ ông Tư', next: 't1_m3_ky_that', flags: { ky_that: true } },
        { key: 'B', text: 'Ký 311,0 m² bằng cây bút mực tím có sẵn: bà Tư được nhiều hơn', next: 't1_m3_ky_tim', flags: { ky_muc_tim: true } },
        { key: 'C', text: 'Để trống. Người có thẩm quyền hơn sẽ quyết sau', next: 't1_m3_bo_trong', flags: { bo_trong: true } }
      ]
    },

    t1_m3_ky_that: {
      time: '05:40',
      title: 'Bút của mình',
      effects: { DN: -15 },
      text: (s) => {
        const t = ['Bạn lấy bút của mình ra. Mực xanh, hơi nhòe vì nước. Bạn viết 248,6 vào ô diện tích, ký tên, ghi rõ họ tên: Lương Thục Anh. Rồi kẹp cuốn sổ ông Tư vào biên bản.'];
        t.push(s.flags.chung_cu ? 'Anh Quý ký làm chứng, không ngần ngừ. “Có chứng cứ đàng hoàng. Cấp trên hỏi thì em trả lời được.”' : 'Anh Quý ngập ngừng rất lâu. “Em không chắc cấp trên chịu đâu chị.” Rồi anh vẫn ký làm chứng. “Nhưng em thấy cây sào. Em ký cái em thấy.”');
        t.push(baTuKy(s) ? 'Bà Tư cầm bút. Bà ký chậm, nét run, một chữ “Tư” to tướng. Rồi bà ký luôn vào biên bản thửa 112. Hai chữ ký trong hai mươi năm.' : 'Bà Tư nhìn biên bản, chưa cầm bút. “Để tui coi trời sáng đã.”');
        t.push('Cây bút mực tím trên bàn khô ngòi, nứt dọc thân, như một cây bút đã cạn từ lâu.');
        return t;
      },
      choices: [{ text: 'Ra bến', next: 't1_m3_sang' }]
    },

    t1_m3_ky_tim: {
      time: '05:40',
      title: 'Mực tím',
      effects: { DN: 20 },
      text: [
        'Cây bút mực tím êm tay lạ lùng. Bạn viết 311,0. Nét số đều tăm tắp như kẻ thước, đẹp hơn chữ bạn mọi ngày.',
        'Rồi bạn ký. Bạn nhìn xuống chữ ký vừa khô: không phải tên bạn. Ba chữ, nghiêng nghiêng, quen thuộc: Người giữ sổ.',
        'Bà Tư đứng dậy, đi ra khỏi chòi, không nhìn tờ giấy. Anh Sáu đi theo má. Anh Quý cất biên bản vào cặp, tránh nhìn tay bạn.'
      ],
      choices: [{ text: 'Ra bến', next: 't1_m3_sang' }]
    },

    t1_m3_bo_trong: {
      time: '05:40',
      title: 'Ô trống',
      effects: { DN: 10, TC: -5 },
      text: [
        'Bạn để trống ô diện tích. “Chuyện này cần người có thẩm quyền hơn em quyết.” Đúng quy trình. Không ai trách được.',
        'Sáu giờ kém mười lăm, tablet rung. Phần mềm khóa sổ sớm. Ô 112-cũ tự điền: 311,0. Ô người đo tự điền, nét chữ nghiêng nghiêng màu tím: Người giữ sổ.',
        'Bạn không ký thay ai. Nhưng có người đã ký thay bạn.'
      ],
      choices: [{ text: 'Ra bến', next: 't1_m3_sang' }]
    },

    /* ===== 05:58 · Bình minh ===== */
    t1_m3_sang: {
      time: '05:58',
      title: 'Bình minh',
      flags: { mo_trang_1: true },
      text: (s) => {
        const f = s.flags, t = [];
        if (f.ky_that) {
          t.push('Mặt trời lên sau rặng bần bờ bên kia. Con nước lớn phủ kín chỗ ngôi nhà đêm qua. Không còn mái tôn, không còn đèn. Chỉ còn mặt sông đỏ hồng, chảy đều.');
          t.push(baTuKy(s) ? 'Bà Tư tháo mái chèo, trao cho cô Lành. “Điểm trường mới bên kia sông còn thiếu người đưa đò. Con chèo được mà.” Rồi bà nắm tay anh Sáu, bước lên bậc đá cuối cùng của bến Cồn Lở, không ngoái lại.' : 'Bà Tư ngồi trên bậc đá, nhìn mặt sông rất lâu. Rồi bà gọi anh Quý lại, chìa tay xin cây bút. Bà ký vào hai tờ biên bản ngay trên đầu gối. “Trời sáng rồi. Coi rõ rồi.”');
          if (f.tien_ong) t.push('Bên kia sông, ngọn đèn ở bến Cồn Bồi vẫn còn sáng một lúc giữa ban ngày, rồi mới tắt.');
          if (f.sau_tra_loi || f.sau_do_cung) t.push('Anh Sáu xé vé xe năm giờ. Anh sẽ ở lại giúp má dọn sang chỗ mới, rồi mới về thành phố.');
        } else {
          t.push('Trời sáng mà sông vẫn xám. Con nước lớn lên, nhưng ngôi nhà giữa sông không chìm. Nó đứng đó giữa ban ngày, nửa thân trên mặt nước, đèn trong cửa sổ vẫn sáng.');
          t.push('Bà Tư không lên xe với anh Sáu. Bà ngồi lại ở chòi trạm, nhìn ngôi nhà. “Còn số sai thì nhà còn đó,” bà nói. “Tui ở lại coi.”');
          t.push('Anh Sáu bỏ lỡ chuyến xe năm giờ, rồi chuyến bảy giờ. Đến trưa, anh mới đi.');
        }
        t.push('Trong ba lô, cuốn sổ đo của bạn nóng lên. Lớp hồ gạo dán trang “Cồn Lở” bong ra.');
        return t;
      },
      choices: [{ text: 'Mở trang sổ', next: 'het_man3' }]
    },

    het_man3: {
      type: 'actend',
      final: true,
      title: 'Hết Tập 1 · Bãi Bồi',
      time: '06:00',
      next: 'Tập 2 · Chợ Sớm',
      endOf: (s) => (s.flags.ky_muc_tim || s.flags.bo_trong ? 't1_ket_muc_tim' : 't1_ket_ban_giao'),
      teaser: 'Một khu chợ cũ của thị trấn sắp thành trung tâm thương mại. Từ ba giờ sáng, chợ ma dọn hàng và đòi bán cho bạn bằng lời hứa. Trong sổ nợ của chợ, có một dòng ghi bằng mực tím.',
      recap: (s) => {
        const f = s.flags, out = [], h = S0.honesty1(s);
        out.push(`Thửa 112 bàn giao với ${area112(s)} m². Phần đất lở năm 2007: ${signed2007(s)}.`);
        if (f.ky_that) out.push(baTuKy(s) ? 'Bà Tư đã ký, sau hai mươi năm, và trao mái chèo cho cô Lành.' : 'Bà Tư ký khi trời sáng rõ.');
        else out.push('Ngôi nhà giữa sông vẫn đứng đó giữa ban ngày. Bà Tư ở lại trông nó.');
        if (f.tien_ong) out.push('Đèn bờ bên kia đã sáng lần cuối, để ông Tư thấy đường về.');
        out.push(h >= 5 ? 'Trang “Cồn Lở” trong sổ đo đã mở. Ông Kha viết: đừng để cô ấy ký thay ai. Đêm nay bạn không ký thay ai.' : h >= 3 ? 'Trang “Cồn Lở” đã mở. Bạn đã chọn sự thật ở vài chỗ, và chọn điều dễ hơn ở vài chỗ khác.' : 'Trang “Cồn Lở” đã mở. Dòng chữ của ông Kha đọc như một lời trách.');
        return out;
      },
      summary: (s) => [['Thửa 112', area112(s) + ' m²'], ['Phần đất lở năm 2007', signed2007(s)], ['Điểm trung thực của tập', S0.honesty1(s) + '/6']]
    }
  });

  S0.endingsList.push(
    { id: 't1_ket_ban_giao', title: 'Kết cuối: Bàn giao một nơi chốn', kind: 'act', final: true, act: 3, hint: 'Ký con số của nước ròng bằng chính tên mình.' },
    { id: 't1_ket_muc_tim', title: 'Kết cuối: Người giữ sổ', kind: 'act', final: true, act: 3, hint: 'Ai không ký thì luôn có người sẵn sàng ký thay.' }
  );
  Object.assign(S0.endingIcons, { t1_ket_ban_giao: 'sun', t1_ket_muc_tim: 'pen' });

  Object.assign(S0.staging, {
    t1_m3_mo:         { view: 'tram', cast: ['quy'], fx: ['pen', 'tablet'], tablet: [{ t: '112-cũ · Hộ Nguyễn Thị Tư', s: 44, wt: 600, c: '#9fc3ff' }, { t: 'Chưa xác định', s: 96, c: '#ffffff' }, { t: 'Tự khóa sổ lúc 06:00', s: 46, wt: 700, c: '#ffd27a' }] },
    t1_m3_nut1:       { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'], sfx: ['heart'] },
    t1_m3_n1_het_gio: { view: 'tram', cast: ['quy'], fx: ['pen', 'docs', 'pen_glow'] },
    t1_m3_n1B:        { view: 'tram', cast: ['quy'], fx: ['pen', 'docs', 'pen_glow', 'pen_roll'] },
    t1_m3_n1C:        { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_p4:         { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_p4_tre:     { view: 'tram', cast: ['quy'], fx: ['pen', 'docs', 'pen_glow'] },
    t1_m3_p4_dung:    { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_p4_ky:      { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_p4_dau:     { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_p4_dt:      { view: 'tram', cast: ['quy'], fx: ['pen', 'docs'] },
    t1_m3_ba_tu:      { view: 'ben', cast: ['tu'], fx: ['farlamp_off', 'rise', 'close_tu'], sfx: ['water'] },
    t1_m3_hua:        { view: 'ben', cast: ['tu'], fx: ['farlamp_off', 'rise', 'close_tu'] },
    t1_m3_cho_xem:    { view: 'ben', cast: ['tu'], fx: ['farlamp_off', 'rise', 'close_tu'] },
    t1_m3_nut2:       { view: 'ben', cast: ['tu', 'sau', 'lanh'], fx: ['ghostboat', 'ghost_wait', 'rise'], sfx: ['heart'] },
    t1_m3_n2_het_gio: { view: 'ben', cast: ['tu', 'sau'], fx: ['ghostboat', 'ghost_wait', 'sinking', 'rise', 'shake'], sfx: ['splash'] },
    t1_m3_n2B:        { view: 'ben', cast: ['tu', 'sau', 'lanh'], fx: ['ghostboat', 'ghost_wait', 'sinking', 'rise'] },
    t1_m3_n2C:        { view: 'ben', cast: ['tu', 'sau', 'lanh'], fx: ['ghostboat', 'ghost_leave', 'farlamp_back', 'rise'], sfx: ['bell'] },
    t1_m3_n2D:        { view: 'ben', cast: ['tu', 'sau', 'lanh'], fx: ['ghostboat', 'ghost_leave', 'farlamp_back', 'rise'], sfx: ['bell'] },
    t1_m3_nut3:       { view: 'tram', cast: ['quy'], fx: ['pen', 'docs', 'pen_glow', 'dawn_window'], sfx: ['heart'] },
    t1_m3_ky_that:    { view: 'tram', cast: ['quy'], fx: ['docs', 'pen', 'pen_dead', 'dawn_window'] },
    t1_m3_ky_tim:     { view: 'tram', cast: ['quy'], fx: ['docs', 'pen', 'pen_glow', 'dawn_window'], sfx: ['sting'] },
    t1_m3_bo_trong:   { view: 'tram', cast: ['quy'], fx: ['docs', 'pen', 'pen_glow', 'tablet', 'dawn_window'], sfx: ['sting'], tablet: [{ t: '112-cũ · Đã khóa sổ', s: 44, wt: 600, c: '#9fc3ff' }, { t: '311,0 m²', s: 110, c: '#ffffff', mono: true }, { t: 'Người đo: Người giữ sổ', s: 46, wt: 700, c: '#c59bff' }] },
    t1_m3_sang:       { view: 'ben', cast: ['tu', 'sau', 'lanh', 'quy'], fx: (s) => (s.flags.ky_that ? ['dawn', 'rise', 'house_gone'] : ['dawn_grey', 'rise', 'house', 'house_day']), mood: 'dawn' },
    het_man3:         { view: 'ben', cast: [], fx: (s) => (s.flags.ky_that ? ['dawn', 'wide', 'rise', 'house_gone'] : ['dawn_grey', 'wide', 'rise', 'house', 'house_day']), mood: 'dawn' }
  });
})();
