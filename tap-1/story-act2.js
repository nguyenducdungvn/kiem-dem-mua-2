/* =========================================================
   KIỂM ĐẾM CA ĐÊM · MÙA 2 · TẬP 1: BÃI BỒI
   Màn 2: "Nước ròng" (01:10 – 03:30)
   Gộp thêm vào STORY: luật R6–R7–R8, cảnh t1_m2_*, mini-game đo bằng sào (p3),
   kết Màn 2 và kết thúc "Bữa cơm". Gắn het_man1.nextScene = 't1_m2_mo'.
   Bọc trong IIFE để không trùng hằng toàn cục với story-act1.js.
   ========================================================= */
(function () {
  'use strict';
  const S0 = window.STORY;
  const SANS = "'Be Vietnam Pro', Arial, sans-serif";
  const NUM = "'Roboto Mono', monospace";

  Object.assign(S0.rules, {
    R6: { text: 'Đo bằng sào thì đọc vạch ướt, đừng đọc vạch khô.', sources: ['thân sào ông Tư', 'cột nhà dưới sông'] },
    R7: { text: 'Ai trong nhà dưới sông mời ăn cơm thì cảm ơn rồi về.', sources: ['lời bà Tư', 'nắp nồi cơm', 'cột nhà dưới sông'] },
    R8: { text: 'Sổ của người đã đi thì đọc, đừng ký thêm vào.', sources: ['bìa sổ ông Tư'] }
  });

  S0.acts[1].scene = 't1_m2_mo';
  delete S0.acts[1].soon;
  S0.scenes.het_man1.nextScene = 't1_m2_mo';

  /* ---------- Mini-game: đo bằng sào (mặt cắt ngang lòng sông) ---------- */
  const SVG_P3 = (() => {
    const x0 = 60, top = 178, k = 44;             // k: số pixel cho 1 m độ sâu
    const poles = [['S1', 6, 0.5], ['S2', 12, 0.6], ['S3', 18, 0.8], ['S4', 24, 2.4], ['S5', 30, 2.7]];
    const px = (m) => x0 + m * 17.5;
    const bed = [[0, 0.3], [6, 0.5], [12, 0.6], [18, 0.8], [20.5, 0.95], [22, 2.2], [24, 2.4], [30, 2.7], [33, 2.75]];
    const bedPath = 'M' + bed.map(([m, d]) => `${px(m)},${top + d * k}`).join(' L') + ` L${px(33)},${top + 3.6 * k} L${px(0)},${top + 3.6 * k} Z`;
    let poleSvg = '';
    poles.forEach(([id, m, d]) => {
      const x = px(m), yb = top + d * k, yTop = top - 1.2 * k + 30;
      poleSvg += `<g class="hit" data-id="${id}">
        <rect x="${x - 14}" y="${yTop - 10}" width="28" height="${yb - yTop + 14}" fill="transparent"/>
        <line x1="${x}" y1="${yTop}" x2="${x}" y2="${yb}" stroke="#8a6a32" stroke-width="5" stroke-linecap="round"/>
        <line x1="${x}" y1="${top}" x2="${x}" y2="${yb}" stroke="#2f6f8f" stroke-width="5"/>
        <text x="${x}" y="${yTop - 14}" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="700" fill="#2a251c">${id}</text>
        <text x="${x + 8}" y="${top + 16}" font-family="${NUM}" font-size="12" fill="#2f5f70">${d.toFixed(1).replace('.', ',')}</text>
      </g>`;
    });
    const dryY = top - 0.5 * k;
    return `<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mặt cắt lòng sông từ bờ ra ngôi nhà, đo bằng sào">
<rect width="100%" height="100%" fill="#efe7d2"/>
<text x="24" y="30" font-family="${SANS}" font-size="16" font-weight="700" fill="#2a251c">Mặt cắt từ bờ ra ngôi nhà · đo bằng sào lúc nước ròng</text>
<rect x="${px(0)}" y="${top}" width="${px(33) - px(0)}" height="${3.6 * k}" fill="#b9d3dc"/>
<path d="${bedPath}" fill="#8a7458" stroke="#5a4630" stroke-width="2"/>
<rect x="18" y="${top - 26}" width="${px(0) - 18}" height="${3.6 * k + 26}" fill="#6b5a3a"/>
<text x="22" y="${top - 32}" font-family="${SANS}" font-size="12" fill="#2a251c">Bờ hiện nay</text>
<g class="hit" data-id="DOC"><rect x="${px(19.5)}" y="${top + 0.7 * k}" width="${px(23) - px(19.5)}" height="${1.8 * k}" fill="transparent" stroke="#c05030" stroke-dasharray="5 4" stroke-width="2"/>
<text x="${px(21.2)}" y="${top + 2.85 * k}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="#c05030">bờ dốc</text></g>
<rect x="${px(15)}" y="${top - 1.35 * k}" width="${px(20) - px(15)}" height="${1.35 * k}" fill="none" stroke="#5a4a36" stroke-width="2"/>
<path d="M${px(14.4)} ${top - 1.35 * k} L${px(17.5)} ${top - 1.9 * k} L${px(20.6)} ${top - 1.35 * k}" fill="none" stroke="#5a4a36" stroke-width="2"/>
<text x="${px(17.5)}" y="${top - 0.6 * k}" text-anchor="middle" font-family="${SANS}" font-size="12" fill="#5a4a36">ngôi nhà</text>
<g class="hit" data-id="KHO"><line x1="${px(4)}" y1="${dryY}" x2="${px(32)}" y2="${dryY}" stroke="#6a2fa0" stroke-width="2" stroke-dasharray="2 4"/>
<text x="${px(32)}" y="${dryY - 6}" text-anchor="end" font-family="${SANS}" font-size="12" font-style="italic" fill="#6a2fa0">vạch khô, sơn tím: 3,1 m</text></g>
${poleSvg}
<g class="hit" data-id="KHAC"><rect x="24" y="${top + 3.6 * k + 6}" width="300" height="26" rx="4" fill="#fff8e6" stroke="#b8ad92"/>
<text x="34" y="${top + 3.6 * k + 24}" font-family="${SANS}" font-size="13" fill="#8a5a1c">Dòng khắc trên thân sào của ông Tư</text></g>
<line x1="${px(0)}" y1="${top + 3.6 * k + 52}" x2="${px(30)}" y2="${top + 3.6 * k + 52}" stroke="#2a251c" stroke-width="1"/>
<text x="${px(30) + 6}" y="${top + 3.6 * k + 56}" font-family="${NUM}" font-size="11" fill="#2a251c">30 m</text>
<text x="${px(0)}" y="${top + 3.6 * k + 70}" font-family="${SANS}" font-size="11" fill="#6b5a3a">Số màu xanh: vạch ướt (độ sâu thật lúc này). Bề ngang thửa đất cũ: 13 m.</text>
</svg>`;
  })();

  const m2Area = (s) => (s.flags.tin_311 ? '311,0' : '248,6');
  S0.m2Area = m2Area;

  Object.assign(S0.scenes, {

    /* ===== 01:15 · Ra ngôi nhà ===== */
    t1_m2_mo: {
      time: '01:15',
      title: 'Ngôi nhà giữa sông',
      act: 'Màn 2 · Nước ròng',
      checkpoint: true,
      effects: { MN: -3 },
      text: (s) => {
        const f = s.flags, t = [];
        t.push('Nước ròng sâu nhất trong đêm. Mép sông lùi ra xa, để lộ một dải bùn đen bóng, và mực nước dưới chân bạn rút xuống ba vạch. Lần đầu từ lúc lên bờ, bạn thở ra được một hơi dài.');
        t.push('Bà Tư tháo dây đò. Anh Sáu nhảy theo xuống, đò chòng chành. “Má đi đâu tui đi đó.” Anh Quý ở lại bờ với tablet. Cô Lành đứng ở bến, giơ cao cây đèn sạc, như cô từng giơ đèn ở bến bên kia đêm năm 2007.');
        t.push(f.ghi_so_ngay
          ? 'Ngôi nhà giữa sông đã tắt đèn từ lúc bạn ký con số 214,0. Cửa sổ tối như một con mắt nhắm. Nhưng nó vẫn đứng đó, đợi.'
          : 'Ngọn đèn dầu trong ngôi nhà giữa sông vẫn sáng. Càng lại gần, bạn càng thấy rõ: mái tôn rỉ, bậc thềm đá ong, một cây khế trụi lá mọc nghiêng bên hông nhà.');
        if (f.mac_ao_phao) t.push('Chiếc áo phao cam vẫn trên người bạn.');
        else if (f.nhuong_ao_phao) t.push('Chiếc áo phao cam vẫn khoác hờ trên vai bà Tư, không cài.');
        t.push('Bà Tư chèo chậm lại, không nhìn bạn. “Hồi đó ai ghé nhà, ông nhà tui cũng mời ở lại ăn cơm. Giờ mà cô nghe ổng mời, cô cảm ơn rồi về nghen. Đừng ngồi.”');
        return t;
      },
      gain: { rules: ['R7'] },
      choices: [{ text: '…', next: 't1_m2_nut1' }]
    },

    /* ===== NÚT 1 · 01:30 ===== */
    t1_m2_nut1: {
      time: '01:30',
      title: 'Nút 1 · Cây sào của ông Tư',
      checkpoint: true,
      danger: true,
      timer: { sec: 25, next: 't1_m2_n1_het_gio', label: 'Anh Quý giục đo' },
      text: [
        'Đò cập bậc thềm. Trên sàn đò có một cây sào tre già, lên nước bóng như sừng. Bà Tư chỉ: “Sào của ông nhà tui.” Gần đầu sào có một dòng khắc bằng dao: “Đọc vạch ướt, đừng đọc vạch khô.”',
        'Muốn biết phần đất nào đã lở, phải biết đáy sông chỗ nào còn là đất cũ, chỗ nào là lòng sông. Biên bản 2007 khoanh bốn góc bằng mực tím, góc xa nhất cách bờ ba chục mét.',
        'Điện thoại rung. Anh Quý gọi từ bờ: “Chị bắn laser từ trên đò cho nhanh, khỏi lội. Nước lên lại là hết đo.”'
      ],
      gain: { rules: ['R6'] },
      choices: [
        { key: 'A', text: 'Bắn laser từ trên đò cho nhanh, khỏi xuống nước', next: 't1_m2_n1A' },
        { key: 'B', text: 'Cầm sào của ông Tư, nhờ bà Tư chèo tới từng điểm', next: 't1_m2_p3', effects: { TC: 5 } },
        { key: 'C', text: 'Mặc áo phao, lội xuống cắm sào cho chắc tay', next: 't1_m2_n1C_ao', cond: (s) => !!s.flags.mac_ao_phao },
        { key: 'C', text: 'Lội xuống cắm sào cho chắc tay, không cần áo phao', next: 't1_m2_n1C', cond: (s) => !s.flags.mac_ao_phao }
      ]
    },

    t1_m2_n1_het_gio: {
      time: '01:31',
      title: 'Tia laser',
      text: [
        'Bạn chưa kịp quyết thì anh Quý đã đứng trên bờ bắn laser thẳng ra ngôi nhà. Tia đỏ xuyên qua bậc thềm, qua khung cửa, qua cả ngọn đèn dầu, rồi tắt ở đâu đó giữa sông. Trên tablet: “Không có mục tiêu.”',
        'Với máy đo, ngôi nhà này không có. Bà Tư đặt cây sào vào tay bạn.'
      ],
      effects: { TT: -5, MN: 1 },
      choices: [{ text: 'Đo bằng sào', next: 't1_m2_p3' }]
    },

    t1_m2_n1A: {
      time: '01:35',
      title: 'Không có mục tiêu',
      text: [
        'Bạn bắn laser vào góc bậc thềm. Tia đỏ đi xuyên qua đá ong như qua khói, rồi tắt ở đâu đó giữa sông. Tablet báo: “Không có mục tiêu.” Bạn bắn vào cột nhà. “Không có mục tiêu.” Bạn bắn vào bàn tay bà Tư đang vịn mạn đò. 0,9 m.',
        'Anh Sáu bật cười, cái cười run run. “Máy của tỉnh không thấy nhà tui. Hai chục năm nay có ai thấy đâu.”',
        'Bà Tư đặt cây sào vào tay bạn.'
      ],
      effects: { TT: -10, MN: 1 },
      gain: { clues: ['Máy đo laser không thấy ngôi nhà giữa sông: “Không có mục tiêu”. Chỉ cây sào chạm được tới nó.'] },
      choices: [{ text: 'Đo bằng sào', next: 't1_m2_p3' }]
    },

    t1_m2_n1C_ao: {
      time: '01:35',
      title: 'Lội nước',
      text: [
        'Bạn trượt xuống nước. Lạnh buốt tới thắt lưng, rồi tới ngực. Đáy dưới chân lúc đầu cứng, có rễ cây, có gạch vỡ. Tới bước thứ hai mươi, chân bạn hẫng: đáy sông tụt xuống như mép bàn.',
        'Chiếc áo phao cam nâng bạn lên. Bà Tư chìa mái chèo kéo bạn sát mạn đò. “Ông nhà tui cũng lội y vậy,” bà nói. “Ổng không mặc áo.”',
        'Bạn đã biết mép bờ cũ ở đâu. Giờ chỉ cần đọc lại từng cây sào cho đúng.'
      ],
      effects: { TT: -5 },
      gain: { clues: ['Lội từ bậc thềm ra khoảng 20 m thì đáy sông tụt xuống như mép bàn: mép bờ năm 2007.'] },
      choices: [{ text: 'Đọc các cây sào', next: 't1_m2_p3' }]
    },

    t1_m2_n1C: {
      time: '01:35',
      title: 'Lội nước',
      text: [
        'Bạn trượt xuống nước. Lạnh buốt tới thắt lưng, rồi tới ngực. Đáy dưới chân lúc đầu cứng, có rễ cây, có gạch vỡ. Tới bước thứ hai mươi, chân bạn hẫng: đáy sông tụt xuống như mép bàn.',
        'Nước trùm qua đầu. Dưới đó tối, và yên lặng như trong một căn phòng đóng cửa. Có ai đó nắm cổ áo bạn kéo lên. Anh Sáu, ướt sũng, một tay bám mạn đò.',
        '“Ba tui chết y chỗ này,” anh nói, giọng không giận, chỉ mệt. Bạn ho ra nước sông, lạnh tới tận óc.'
      ],
      effects: { TT: -20, MN: 1 },
      gain: { clues: ['Lội từ bậc thềm ra khoảng 20 m thì đáy sông tụt xuống như mép bàn. Anh Sáu: ông Tư mất ở chính chỗ này.'] },
      choices: [{ text: 'Leo lên đò, đọc các cây sào', next: 't1_m2_p3' }]
    },

    t1_m2_p3: {
      time: '01:45',
      title: 'Đo bằng sào',
      type: 'puzzle',
      paper: true,
      timer: { sec: 50, next: 't1_m2_p3_tre', label: 'Nước sắp trở mình' },
      text: ['Năm cây sào cắm từ bờ ra tới góc mực tím của biên bản 2007. Chạm vào từng cây sào, bờ dốc, vạch tím và dòng khắc để xem. Đất cũ kéo ra tới đâu?'],
      prompt: 'Chạm vào một cây sào, bờ dốc, vạch tím hoặc dòng khắc.',
      svg: SVG_P3,
      inspect: {
        S1: 'S1, cách bờ 6 m. Vạch ướt 0,5 m. Đáy cứng, sào vướng rễ cây.',
        S2: 'S2, cách bờ 12 m. Vạch ướt 0,6 m. Đáy có gạch vỡ: nền bếp cũ.',
        S3: 'S3, cách bờ 18 m, ngay dưới bậc thềm ngôi nhà. Vạch ướt 0,8 m. Đáy vẫn bằng.',
        S4: 'S4, cách bờ 24 m. Vạch ướt 2,4 m. Sào hẫng một cái mới chạm đáy: lòng sông.',
        S5: 'S5, cách bờ 30 m, góc mực tím của biên bản 2007. Vạch ướt 2,7 m. Đáy cát chảy, không có một sợi rễ.',
        DOC: 'Giữa S3 và S4, đáy sông hụt xuống gần hai mét. Đây là mép bờ cũ: đất lở xuống nhưng vẫn nằm ở chỗ nông, bên ngoài là lòng sông từ trước.',
        KHO: 'Trên cả năm cây sào có một vạch khô sơn tím ở 3,1 m, thẳng tăm tắp như kẻ thước. Không con nước nào để lại vạch đều như thế.',
        KHAC: 'Khắc trên thân sào, nét dao của ông Tư: “Đọc vạch ướt, đừng đọc vạch khô.”'
      },
      answers: [
        { text: 'Đất cũ tới S5, góc mực tím: 311,0 m², khớp biên bản 2007', next: 't1_m2_p3_311', flags: { tin_311: true } },
        { text: 'Đất cũ tới S3, chỗ đáy còn bằng trước bờ dốc: 248,6 m²', next: 't1_m2_p3_dung', flags: { do_sao_dung: true } },
        { text: 'Đọc theo vạch khô 3,1 m: ở đây chưa từng là đất', next: 't1_m2_p3_kho' },
        { text: 'Đất cũ chỉ tới S1, chỗ đáy cứng nhất: 140,2 m²', next: 't1_m2_p3_it' }
      ]
    },

    t1_m2_p3_tre: {
      time: '01:58',
      title: 'Bà Tư đọc sào',
      text: [
        'Bạn còn đang dò từng cây sào thì bà Tư đã nhổ cây S3 lên, đưa sát mắt. Bà chẳng cần đèn.',
        '“Tám tấc. Bằng. Qua khỏi đây là hụt.” Bà cắm sào xuống lại, nhìn ra cây S5 cắm giữa dòng. “Ngoài kia là sông từ hồi tui còn con gái. Đất nhà tui tới đây thôi.”',
        'Bạn tính lại theo lời bà: 248,6 m².'
      ],
      effects: { TT: -5, MN: 1 },
      flags: { do_sao_dung: true },
      choices: [{ text: 'Vào nhà', next: 't1_m2_sau' }]
    },

    t1_m2_p3_dung: {
      time: '01:55',
      title: 'Vạch ướt',
      text: [
        'Bạn đọc từng vạch ướt, từ S1 ra S3. Tới bờ dốc thì dừng. Bề ngang thửa đất cũ 13 m. Phần đã lở: 248,6 m².',
        'Ít hơn biên bản 2007 sáu mươi hai mét vuông. Anh Sáu nhìn con số, rồi nhìn má. “Má, vậy là ít hơn.”',
        'Bà Tư không nhìn con số. Bà nhìn cây S3 cắm ngay dưới bậc thềm nhà mình. “Ít hơn,” bà nói, “mà là của mình.”'
      ],
      effects: { TC: 5, TT: 5 },
      gain: { clues: ['Đo bằng sào lúc nước ròng: phần đất nhà bà Tư đã lở là 248,6 m², tới bờ dốc giữa S3 và S4. Biên bản 2007 ghi 311,0 m², kéo tới tận lòng sông.'] },
      choices: [{ text: 'Vào nhà', next: 't1_m2_sau' }]
    },

    t1_m2_p3_311: {
      time: '01:55',
      title: 'Góc mực tím',
      text: [
        'Bạn tính tới S5. 311,0 m², khớp biên bản 2007 đến từng số lẻ. Bà Tư sẽ được đền nhiều nhất. Ai thiệt đâu.',
        'Cây sào S5 lún dần xuống cát chảy, chậm, đều, như có ai dưới đáy kéo. Bạn nắm lấy nó. Nó kéo cả tay bạn theo.',
        'Bà Tư gỡ tay bạn ra khỏi cây sào, không nói gì. Bà không vui. Bạn không hiểu vì sao bà không vui.'
      ],
      effects: { DN: 10 },
      gain: { clues: ['Cây sào cắm ở góc mực tím (S5) lún dần vào cát chảy, như có ai dưới đáy kéo.'] },
      choices: [{ text: 'Vào nhà', next: 't1_m2_sau' }]
    },

    t1_m2_p3_kho: {
      time: '01:55',
      title: 'Vạch khô',
      text: [
        'Bạn đọc vạch tím trên cả năm cây sào: 3,1 m, đều tăm tắp. Nếu vậy thì chỗ này lúc nào cũng sâu quá đầu người, chưa từng là đất.',
        'Ngọn đèn trong ngôi nhà chập chờn rồi tối hẳn. Bà Tư giằng lấy cây sào, gí dòng khắc vào sát mặt bạn: “Vạch ướt. Đọc vạch ướt.”',
        'Bạn đọc lại, từng cây một. Tới S3, đáy vẫn bằng. Qua S4 thì hụt. 248,6 m². Đèn trong nhà sáng lại, yếu hơn.'
      ],
      effects: { TT: -10, MN: 1 },
      flags: { do_sao_dung: true },
      choices: [{ text: 'Vào nhà', next: 't1_m2_sau' }]
    },

    t1_m2_p3_it: {
      time: '01:55',
      title: 'Đáy cứng nhất',
      text: [
        'Bạn chỉ tính tới S1, chỗ đáy còn cứng và có rễ. 140,2 m². Chắc chắn, không ai cãi được.',
        'Anh Sáu cãi. “Nền bếp nhà tui nằm ở S2 đó chị. Hồi nhỏ tui ngồi đó lột tôm. Chị tính vậy là chị cắt luôn cái bếp.”',
        'Bạn đọc lại tới S3, tới bờ dốc. 248,6 m². Bà Tư im lặng suốt lúc đó, như người đã quen bị đo thiếu.'
      ],
      effects: { TC: -10, MN: 1 },
      flags: { do_sao_dung: true },
      choices: [{ text: 'Vào nhà', next: 't1_m2_sau' }]
    },

    /* ===== 02:05 · Khoảnh khắc nhân vật: khung cửa ===== */
    t1_m2_sau: {
      time: '02:05',
      title: 'Khung cửa',
      text: [
        'Trong nhà khô ráo như chưa từng có nước. Mùi củi, mùi nước mắm, mùi chiếu cói. Anh Sáu đứng lặng trước khung cửa buồng.',
        'Trên khung cửa có những vạch dao khắc ngang, cái thấp nhất ngang đầu gối. Bên mỗi vạch là một dòng chữ nhỏ: “Sáu, 5 tuổi”, “Sáu, 8 tuổi”, “Sáu, 11 tuổi”. Vạch cao nhất: “Sáu, 14 tuổi, Tết 2007”.',
        '“Tết nào ba cũng đo tui,” anh nói. “Đo bằng cây sào đó. Ổng đo cái gì cũng đo, đo đất, đo nước, đo con.” Anh áp lưng vào khung cửa. Đầu anh vượt vạch cao nhất cả một gang tay. “Năm sau tui lên thành phố. Tui ghét cái sông này. Hai chục năm tui không về.”'
      ],
      choices: [
        { key: 'A', text: 'Rủ anh Sáu cùng đo góc nhà cuối với mình', next: 't1_m2_sau_cung', flags: { sau_do_cung: true } },
        { key: 'B', text: 'Nhắc anh Sáu: nước sắp lên, không còn nhiều thời gian', next: 't1_m2_sau_giuc' }
      ]
    },

    t1_m2_sau_cung: {
      time: '02:10',
      title: 'Hai người cầm sào',
      text: [
        'Anh Sáu cầm đầu sào, bạn cầm thước. Anh đo góc buồng nhanh và chắc tay, như người chưa từng quên. “Ba dạy tui hồi chín tuổi,” anh nói. “Tui tưởng quên rồi.”',
        'Lúc ghi số, anh hỏi bạn mượn bút, viết thêm vào sổ của bạn một dòng nhỏ: “Sáu đo, 2027.” Rồi anh đứng nhìn dòng chữ đó rất lâu.'
      ],
      effects: { TC: 10 },
      choices: [{ text: '…', next: 't1_m2_nut2' }]
    },

    t1_m2_sau_giuc: {
      time: '02:10',
      title: 'Không còn thời gian',
      text: [
        'Anh Sáu gật đầu, rời khung cửa. “Phải. Đo cho xong rồi về.” Anh đi trước, không ngoái lại.',
        'Bạn ghi diện tích căn buồng vào sổ. Gọn gàng, đúng quy trình. Sau lưng bạn, những vạch dao trên khung cửa đứng yên trong bóng tối.'
      ],
      effects: { TT: 5, TC: -5 },
      choices: [{ text: '…', next: 't1_m2_nut2' }]
    },

    /* ===== NÚT 2 · 02:20 ===== */
    t1_m2_nut2: {
      time: '02:20',
      title: 'Nút 2 · Bữa cơm',
      checkpoint: true,
      danger: true,
      timer: { sec: 20, next: 't1_m2_n2_het_gio', label: 'Bà Tư đang bước tới bàn' },
      text: [
        'Gian giữa có một mâm cơm dọn sẵn trên bộ ván. Cơm còn bốc khói. Một tộ cá linh kho, một tô canh chua bông điên điển. Ba cái chén, ba đôi đũa.',
        'Sau tấm màn bếp có tiếng củi nổ lách tách, và một giọng đàn ông, trầm, khàn khàn mùi thuốc rê: “Về rồi hả? Ngồi ăn cơm đi. Nước còn ròng lâu.”',
        'Bà Tư đứng sững. Hai mươi năm bà không nghe giọng đó. Trên nắp nồi cơm, trên cột nhà, có cùng một dòng khắc: “Ai trong nhà dưới sông mời ăn cơm thì cảm ơn rồi về.”'
      ],
      gain: { rules: ['R7'] },
      choices: [
        { key: 'A', text: 'Ngồi xuống ăn một chén cho ông vui, rồi về', next: 't1_bua_com' },
        { key: 'B', text: 'Cảm ơn ông, rồi dắt bà Tư ra cửa', next: 't1_m2_n2B' },
        { key: 'C', text: 'Để anh Sáu trả lời ba mình', next: 't1_m2_n2C', cond: (s) => s.flags.sau_do_cung || s.TC >= 70 }
      ]
    },

    t1_m2_n2_het_gio: {
      time: '02:21',
      title: 'Chén cơm',
      text: [
        'Bà Tư đã ngồi xuống mép ván, tay với lấy đôi đũa. Bạn chụp tay bà kéo dậy. Chén cơm đổ xuống sàn. Cơm rơi tới đâu, nước sông thấm lên tới đó.',
        'Sau tấm màn, tiếng củi tắt. Giọng đàn ông im. Bà Tư run cả người. “Ổng mời tui mà,” bà nói nhỏ. “Hai chục năm rồi ổng mới mời tui.”',
        'Bạn nói cảm ơn, với tấm màn, với mâm cơm, với ai đó. Rồi dắt bà ra cửa.'
      ],
      effects: { TT: -10, DN: 10, MN: 1 },
      choices: [{ text: '…', next: 't1_m2_so' }]
    },

    t1_m2_n2B: {
      time: '02:22',
      title: 'Cảm ơn rồi về',
      text: [
        '“Dạ, con cảm ơn ông. Tụi con ăn rồi, con xin phép đưa bà về.” Giọng bạn run, nhưng đủ rõ.',
        'Sau tấm màn, tiếng củi nổ thêm một tiếng rồi thôi. Giọng đàn ông cười khẽ, hiền: “Ừ. Về đi. Nhớ đo cho đúng.”',
        'Bà Tư để bạn dắt ra tới cửa. Tới bậc cửa, bà ngoái lại nhìn mâm cơm, lâu thật lâu, như người ta nhìn một tấm ảnh.'
      ],
      effects: { TT: -5, TC: 5 },
      gain: { clues: ['Giọng đàn ông sau tấm màn bếp dặn: “Về đi. Nhớ đo cho đúng.”'] },
      choices: [{ text: '…', next: 't1_m2_so' }]
    },

    t1_m2_n2C: {
      time: '02:22',
      title: 'Con về rồi',
      text: [
        'Anh Sáu bước tới tấm màn bếp, không vén nó lên. “Ba. Con về rồi.” Giọng anh vỡ ở chữ cuối. “Con ăn sau. Con đưa má về trước.”',
        'Sau tấm màn, tiếng củi tắt. Một lúc lâu, rồi giọng đàn ông, nhỏ như từ rất xa: “Thằng Sáu cao dữ. Ừ. Đưa má về.”',
        'Bà Tư nắm tay con trai. Lần đầu tiên trong đêm, bạn thấy bà khóc.'
      ],
      effects: { TC: 10 },
      flags: { sau_tra_loi: true },
      gain: { clues: ['(Hiếm) Ông Tư nhận ra con trai sau hai mươi năm: “Thằng Sáu cao dữ. Đưa má về.”'] },
      choices: [{ text: '…', next: 't1_m2_so' }]
    },

    /* ===== 02:35 · Sổ đo của ông Tư ===== */
    t1_m2_so: {
      time: '02:35',
      title: 'Sổ đo của ông Tư',
      text: (s) => {
        const f = s.flags, t = [];
        t.push('Trong tủ thờ, sau bát nhang, có một cuốn sổ bọc ni lông, khô cong. Bìa ghi bằng bút bi xanh: “Sổ đo · Nguyễn Văn Tư”. Ngay dưới, cùng nét chữ: “Sổ của người đã đi thì đọc, đừng ký thêm vào.”');
        t.push('Trang cuối cùng có chữ: “Đêm 23 rạng 24/10/2007, 01 giờ, nước ròng. Nhà mình. Đo bằng ba cây gạo và sào. Phần đã lở: 248,6 m². Sáng mai báo xã. Má thằng Sáu chở tụi nhỏ qua sông rồi, đèn bên kia còn sáng.”');
        t.push(f.tin_311 ? 'Con số ấy nhỏ hơn con số bạn vừa tính tới góc mực tím. Ông Tư không tính tới lòng sông.' : 'Con số ấy trùng từng số lẻ với con số bạn vừa đọc trên sào.');
        t.push('Trang kế tiếp bị xé mất. Mép giấy còn lại có lấm tấm mực tím.' + (f.tin_muc_tim || f.theo_muc_tim ? ' Vết mực trên đầu ngón tay bạn cùng một màu, và ấm lên khi bạn chạm vào mép giấy.' : ''));
        if (f.m1_kha_viet_phieu) t.push('Nét chữ ông Tư nghiêng nghiêng, kéo dài ở chữ g. Bạn đã thấy nét chữ giống vậy một lần: trên phiếu thứ 40 của ông Kha, ở nhà B4.');
        return t;
      },
      flags: { co_so_ong_tu: true },
      gain: { rules: ['R8'], clues: ['Sổ đo của ông Tư, 01:00 rạng sáng 24/10/2007, lúc nước ròng: phần nhà đã lở 248,6 m². Trang kế tiếp bị xé, mép giấy dính mực tím.'] },
      choices: [{ text: 'Mang sổ theo', next: 't1_m2_nut3' }]
    },

    /* ===== NÚT 3 · 03:00 ===== */
    t1_m2_nut3: {
      time: '03:00',
      title: 'Nút 3 · Nước đứng chân',
      checkpoint: true,
      danger: true,
      timer: { sec: 20, next: 't1_m2_n3_het_gio', label: 'Nước đang tràn vào nhà' },
      effects: { MN: 1 },
      text: [
        'Ba giờ sáng. Chân triều. Nước đứng lần thứ hai trong đêm, và ngôi nhà bắt đầu chìm. Không có tiếng động nào. Nước chỉ lặng lẽ tràn qua bậc cửa, loang trên nền đất như ai đổ một chậu nước.',
        'Trên cánh cửa chính, mực tím tự viết thành chữ, nét đều như kẻ thước: “Còn thiếu 62,4 m². Đo cho đủ rồi hẵng về.” Bên dưới là chữ ký bạn đã thấy ba lần trong đêm: Người giữ sổ.',
        'Bà Tư ngồi xuống bậc thềm, nước ngang mắt cá. “Tui ở lại với nhà,” bà nói. Anh Sáu đứng trên đò, mái chèo trong tay, nhìn bạn.'
      ],
      choices: [
        { key: 'A', text: 'Đo nốt cho đủ 311,0 như dòng mực tím đòi, rồi mới về', next: 't1_m2_n3A', flags: { do_them_muc_tim: true } },
        { key: 'B', text: 'Cầm sổ ông Tư, đưa bà Tư lên đò ngay', next: 't1_m2_n3B' },
        { key: 'C', text: 'Ngồi xuống thềm cạnh bà, để bà nói lời từ biệt với ngôi nhà', next: 't1_m2_n3C', flags: { ba_tu_tu_biet: true } }
      ]
    },

    t1_m2_n3_het_gio: {
      time: '03:02',
      title: 'Nước tràn',
      text: [
        'Nước lên tới gối. Anh Sáu nhảy khỏi đò, xốc má lên vai như xốc một bao lúa. Bạn với lấy cuốn sổ ông Tư, trượt chân trên bậc đá ong, đập vai xuống mép thềm.',
        'Khi cả ba lên được đò, ngôi nhà đã ngập tới bậu cửa sổ. Ngọn đèn dầu vẫn cháy bên trong, nhìn qua làn nước như nhìn qua một tấm kính mờ.'
      ],
      effects: { TT: -10, MN: 2 },
      choices: [{ text: 'Về bờ', next: 't1_m2_ve' }]
    },

    t1_m2_n3A: {
      time: '03:05',
      title: 'Cho đủ',
      text: [
        'Bạn cầm sào lội ra góc S5. Nước đứng, mặt sông phẳng lì. Cây sào cắm xuống ngọt như cắm vào sáp, và vạch ướt trên sào đọc đúng 3,1 m, trùng với vạch tím.',
        'Bạn ghi vào sổ: 311,0 m². Đủ rồi. Chữ trên cánh cửa mờ đi, như người ta hài lòng.',
        'Lúc bạn quay lại đò, nước đã lên tới ngực. Anh Sáu kéo bạn lên. Bà Tư nhìn cuốn sổ trong tay bạn như nhìn một người lạ.'
      ],
      effects: { DN: 15, MN: 3 },
      gain: { clues: ['Lúc nước đứng, vạch ướt trên sào ở góc S5 trùng đúng vạch khô sơn tím: 3,1 m.'] },
      choices: [{ text: 'Về bờ', next: 't1_m2_ve' }]
    },

    t1_m2_n3B: {
      time: '03:05',
      title: 'Lên đò',
      text: [
        '“Bà ơi, sổ của ông con cầm đây rồi. Con số của ông con mang về.” Bạn chìa cuốn sổ cho bà thấy dòng chữ 248,6.',
        'Bà Tư nhìn con số, rồi nhìn dòng mực tím trên cánh cửa. Bà đứng dậy, chậm, chống tay vào khung cửa có vạch đo của con trai. Anh Sáu đỡ bà xuống đò.',
        'Sau lưng, chữ mực tím trên cánh cửa loang ra, chảy thành những vệt dài như nước mắt, rồi trôi theo con nước.'
      ],
      effects: { DN: -5, TC: 5 },
      choices: [{ text: 'Về bờ', next: 't1_m2_ve' }]
    },

    t1_m2_n3C: {
      time: '03:05',
      title: 'Lời từ biệt',
      text: [
        'Bạn ngồi xuống bậc thềm cạnh bà, nước lạnh ngang mắt cá. Bà Tư đặt tay lên nền đá ong, như đặt lên lưng một con trâu già.',
        '“Nhà ơi, tui đi nghen. Ông ở lại coi nhà. Tui lên chỗ mới với thằng Sáu.” Bà nói vậy, bình thường như dặn hàng xóm trông giùm con gà.',
        'Rồi bà đứng dậy, tự bước xuống đò, không cần ai đỡ. Nước đã ngập tới gối. Bạn mất năm phút, và không tiếc phút nào.'
      ],
      effects: { TC: 10, MN: 1 },
      gain: { clues: ['Bà Tư từ biệt ngôi nhà: “Ông ở lại coi nhà. Tui lên chỗ mới với thằng Sáu.”'] },
      choices: [{ text: 'Về bờ', next: 't1_m2_ve' }]
    },

    /* ===== 03:20 · Về bờ ===== */
    t1_m2_ve: {
      time: '03:20',
      title: 'Về bờ',
      text: (s) => {
        const f = s.flags, t = [];
        t.push(f.sau_tra_loi ? 'Anh Sáu cầm mái chèo. Lần đầu từ năm 2007, anh chèo đò trên khúc sông này. Nhịp chèo vụng, rồi đều dần, giống nhịp của má anh.' : 'Bà Tư chèo. Nhịp chèo vẫn đều như thở, nhưng chậm hơn lúc đi.');
        t.push('Sau lưng các bạn, ngôi nhà chìm dần. Mái tôn, rồi khung cửa sổ, rồi ngọn đèn dầu. Ngọn đèn sáng dưới nước thêm một lúc, rồi tắt, nhẹ như có ai thổi.');
        if (f.do_them_muc_tim) t.push('Bạn giở sổ. Dưới con số 311,0 có một chữ ký mực tím. Bạn không nhớ mình đã ký.');
        else if (f.ba_tu_tu_biet) t.push('Bà Tư không ngoái lại. Bà đã chào nhà rồi.');
        t.push('Trên bờ, cô Lành vẫn giơ cây đèn sạc. Anh Quý chạy xuống bến, tay cầm tablet. “Chị ơi, phần mềm báo hồ sơ 112-cũ tự mở lại. Nó đòi một con số trước sáu giờ.”');
        return t;
      },
      choices: [{ text: '…', next: 'het_man2' }]
    },

    het_man2: {
      type: 'actend',
      title: 'Hết Màn 2 · Nước ròng',
      time: '03:30',
      next: 'Màn 3 · Bàn giao',
      nextScene: 't1_m3_mo',
      endOf: () => 't1_ket_man2',
      teaser: 'Hai con số cho cùng một mảnh đất đã lở: 248,6 m² trong sổ ông Tư, 311,0 m² trên biên bản mực tím. Còn hai tiếng rưỡi trước giờ bàn giao, và trên bàn chòi trạm có một cây bút mực tím không ai mang tới.',
      recap: (s) => {
        const f = s.flags, out = [];
        out.push(f.tin_311 ? 'Bạn đã tính phần đất lở tới góc mực tím: 311,0 m².' : 'Bạn đã đọc vạch ướt trên sào: phần đất lở là 248,6 m².');
        if (f.sau_tra_loi) out.push('Anh Sáu đã nói chuyện với ba mình sau hai mươi năm.');
        else if (f.sau_do_cung) out.push('Anh Sáu đã cầm lại cây sào của ba.');
        if (f.ba_tu_tu_biet) out.push('Bà Tư đã chào ngôi nhà.');
        if (f.do_them_muc_tim) out.push('Trong sổ của bạn có một chữ ký mực tím bạn không nhớ mình đã ký.');
        return out;
      },
      summary: (s) => [['Phần đất lở bạn đo', m2Area(s) + ' m²'], ['Sổ ông Tư (2007)', '248,6 m²'], ['Biên bản mực tím (2007)', '311,0 m²']]
    },

    /* ===== KẾT THÚC THẤT BẠI ===== */
    t1_bua_com: {
      type: 'ending',
      title: 'Bữa cơm',
      text: [
        'Bạn ngồi xuống mép ván. Cơm nóng, dẻo, thơm mùi gạo mới. Cá linh kho ngọt như cá ngày bé mẹ bạn kho. Bạn chỉ định ăn một chén.',
        'Tấm màn bếp vén lên. Một người đàn ông áo bà ba bước ra, tay còn mùi khói, xới thêm cho bạn chén thứ hai. “Ăn đi con. Nước còn ròng lâu.” Bạn không thấy rõ mặt ông. Bạn chỉ thấy ông cười.',
        'Nước còn ròng lâu thật. Bên ngoài, bà Tư gọi tên bạn, rồi anh Sáu gọi, rồi tiếng gọi xa dần. Bạn ăn thêm một chén nữa.',
        'Sáng hôm sau, ngôi nhà không còn. Trong sổ đo của ông Tư, dưới dòng 248,6 m², có thêm một dòng mới, nét chữ của bạn: “Khách ghé ăn cơm: 1.”',
        'Từ đó, đêm nào nước ròng, người làng bên kia sông thấy ngôi nhà giữa dòng sáng đèn, và trong cửa sổ có hai bóng người ngồi ăn cơm.'
      ]
    }
  });

  S0.endingsList.push(
    { id: 't1_ket_man2', title: 'Kết Màn 2: Vạch ướt', kind: 'act', act: 2, hint: 'Đi hết Màn 2, về được tới bờ.' },
    { id: 't1_bua_com', title: 'Bữa cơm', kind: 'fail', act: 2, hint: 'Có những lời mời nên cảm ơn rồi về.' }
  );
  Object.assign(S0.endingIcons, { t1_ket_man2: 'ruler', t1_bua_com: 'bowl' });

  const nhaFx = (extra) => (s) => ['lamp'].concat(extra || []);
  Object.assign(S0.staging, {
    t1_m2_mo:         { view: 'song', cast: ['tu', 'sau'], fx: (s) => ['farlamp', 'house_ahead'].concat(s.flags.ghi_so_ngay ? ['house_dark'] : []).concat(s.flags.nhuong_ao_phao ? ['tujacket'] : []), sfx: ['oar'] },
    t1_m2_nut1:       { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'], sfx: ['phone'] },
    t1_m2_n1_het_gio: { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'laser'], sfx: ['click'] },
    t1_m2_n1A:        { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'laser'], sfx: ['click'] },
    t1_m2_n1C_ao:     { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'], sfx: ['splash'] },
    t1_m2_n1C:        { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole', 'shake'], sfx: ['splash', 'heart'] },
    t1_m2_p3:         { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'] },
    t1_m2_p3_tre:     { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'] },
    t1_m2_p3_dung:    { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'] },
    t1_m2_p3_311:     { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole', 'pole_sink'], sfx: ['heart'] },
    t1_m2_p3_kho:     { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole', 'house_flicker'], sfx: ['sting'] },
    t1_m2_p3_it:      { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'ebb', 'house', 'at_house', 'pole'] },
    t1_m2_sau:        { view: 'nha', cast: ['sau'], fx: nhaFx(['marks']) },
    t1_m2_sau_cung:   { view: 'nha', cast: ['sau'], fx: nhaFx(['marks']) },
    t1_m2_sau_giuc:   { view: 'nha', cast: ['sau'], fx: nhaFx(['marks']) },
    t1_m2_nut2:       { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['steam', 'voice']), sfx: ['heart'] },
    t1_m2_n2_het_gio: { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['water_in', 'shake']), sfx: ['thud'] },
    t1_m2_n2B:        { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['steam', 'voice_soft']) },
    t1_m2_n2C:        { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['steam', 'voice_soft']) },
    t1_m2_so:         { view: 'nha', cast: ['tu'], fx: nhaFx(['altar']) },
    t1_m2_nut3:       { view: 'nha', cast: ['tu'], fx: nhaFx(['water_in', 'door', 'purple_door']), sfx: ['water', 'heart'] },
    t1_m2_n3_het_gio: { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['water_high', 'door', 'shake']), sfx: ['splash'] },
    t1_m2_n3A:        { view: 'ben', cast: ['tu', 'sau'], fx: ['farlamp', 'still', 'house', 'at_house', 'pole', 'pole_sink'], sfx: ['heart'] },
    t1_m2_n3B:        { view: 'nha', cast: ['tu', 'sau'], fx: nhaFx(['water_in', 'door', 'purple_run']) },
    t1_m2_n3C:        { view: 'nha', cast: ['tu'], fx: nhaFx(['water_in', 'door']) },
    t1_m2_ve:         { view: 'ben', cast: ['tu', 'sau', 'lanh', 'quy'], fx: ['farlamp', 'house', 'house_sink', 'flow'], sfx: ['oar'] },
    het_man2:         { view: 'ben', cast: [], fx: ['farlamp', 'house', 'house_sink', 'wide', 'flow'] },
    t1_bua_com:       { view: 'nha', cast: [], fx: ['lamp', 'steam', 'voice'] }
  });
})();
