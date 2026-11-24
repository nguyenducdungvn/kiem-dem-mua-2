/* =========================================================
   Mã hồ sơ: chuyển lựa chọn của Mùa 1 sang Mùa 2.
   Hai tên miền khác nhau không dùng chung bộ nhớ trình duyệt,
   nên màn cuối Mùa 1 (bản 1.2) hiện một mã 6 ký tự, người chơi nhập ở Mùa 2.

   Cấu trúc 30 bit (6 ký tự, bảng chữ Crockford base32, bỏ I L O U):
     2 bit phiên bản (=1) · 13 bit cờ · 3 bit kết cuối · 12 bit kiểm tra
   File này dùng chung cho cả hai mùa: Mùa 1 gọi MaHoSo.encode(...),
   Mùa 2 gọi MaHoSo.decode(...). Đừng đổi thứ tự FLAGS hay FINALS.
   ========================================================= */
(function (root) {
  'use strict';
  const ABC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  // Thứ tự bit là cố định. Thêm cờ mới thì phải tăng phiên bản.
  const FLAGS = ['ghi_su_that', 'cong_khai', 'ban_ve_dung', 'tra_bong', 'hua_phat', 'tho_ra', 'kha_viet_phieu',
    'goi_me', 'phat_thu_nhan', 'tram_tu_thu', 'nhan_phan_chia', 'ke_me', 'chia_khoa_giu_lai'];
  const FINALS = ['', 'ket4_tron_ven', 'ket4_ky_uc', 'ket4_ho_so_dung', 'ket4_nguoi_o_lai'];
  const VERSION = 1;

  const check = (p) => (((p ^ (p >>> 7)) * 2654435761) >>> 0) % 4093;

  /** flags: object cờ của Mùa 1 (S.flags), có thể kèm chia_khoa_giu_lai: true nếu đã mở kết thúc ấy.
      finalId: id kết cuối Mùa 1 (một trong FINALS). Trả về chuỗi dạng "ABC-123". */
  function encode(flags, finalId) {
    let p = VERSION;
    FLAGS.forEach((f) => { p = p * 2 + (flags && flags[f] ? 1 : 0); });
    p = p * 8 + Math.max(0, FINALS.indexOf(finalId || ''));
    let n = p * 4096 + check(p);
    let s = '';
    for (let i = 0; i < 6; i++) { s = ABC[n % 32] + s; n = Math.floor(n / 32); }
    return s.slice(0, 3) + '-' + s.slice(3);
  }

  /** Trả về { ok, flags: {m1_ghi_su_that: true, …}, final, honesty } hoặc { ok: false } */
  function decode(code) {
    const clean = String(code || '').toUpperCase().replace(/[\s\-_.]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    if (clean.length !== 6) return { ok: false };
    let n = 0;
    for (const ch of clean) { const v = ABC.indexOf(ch); if (v < 0) return { ok: false }; n = n * 32 + v; }
    const p = Math.floor(n / 4096), ck = n % 4096;
    if (check(p) !== ck) return { ok: false };
    let q = p;
    const fin = q % 8; q = Math.floor(q / 8);
    const raw = {};
    for (let i = FLAGS.length - 1; i >= 0; i--) { raw[FLAGS[i]] = q % 2 === 1; q = Math.floor(q / 2); }
    if (q !== VERSION || fin >= FINALS.length) return { ok: false };
    const flags = {};
    Object.keys(raw).forEach((k) => { if (raw[k]) flags['m1_' + k] = true; });
    flags.m1_co_ma = true;
    // Điểm trung thực 0–6, cùng công thức với STORY.honesty của Mùa 1
    const f = raw;
    const honesty = (f.ghi_su_that ? 1 : 0) + (f.ban_ve_dung ? 1 : 0) + ((f.cong_khai || f.tram_tu_thu) ? 1 : 0)
      + (f.kha_viet_phieu ? 1 : 0) + (f.tra_bong ? 1 : 0) + ((!f.nhan_phan_chia || f.cong_khai) ? 1 : 0);
    return { ok: true, flags, final: FINALS[fin], honesty, code: clean.slice(0, 3) + '-' + clean.slice(3) };
  }

  root.MaHoSo = { encode, decode, FLAGS, FINALS };
})(typeof window !== 'undefined' ? window : globalThis);
