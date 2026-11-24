# Mã hồ sơ: chuyển lựa chọn Mùa 1 sang Mùa 2

Hai tên miền (`kiemdem.` và `kiemdem2.`) không dùng chung bộ nhớ trình duyệt, nên Mùa 1 phải hiện một mã để người chơi tự mang sang.

## Định dạng
- 6 ký tự Crockford base32 (bỏ I, L, O, U), hiển thị dạng `ABC-123`. Khi nhập, chữ O tự đổi thành 0, I và L đổi thành 1, dấu cách và gạch ngang bị bỏ qua.
- 30 bit: phiên bản (1) · 13 cờ · 3 bit kết cuối · 12 bit kiểm tra. Gõ sai một ký tự thì mã bị từ chối (xác suất lọt khoảng 1/4.000).
- Mã hóa và giải mã nằm trong `engine/ma-ho-so.js`. **Mùa 1 dùng nguyên file này**, không viết lại.

| Bit | Cờ Mùa 1 | Ở Mùa 2 thành |
|---|---|---|
| 1 | `ghi_su_that` | `m1_ghi_su_that` |
| 2 | `cong_khai` | `m1_cong_khai` |
| 3 | `ban_ve_dung` | `m1_ban_ve_dung` |
| 4 | `tra_bong` | `m1_tra_bong` |
| 5 | `hua_phat` | `m1_hua_phat` |
| 6 | `tho_ra` | `m1_tho_ra` |
| 7 | `kha_viet_phieu` | `m1_kha_viet_phieu` |
| 8 | `goi_me` | `m1_goi_me` |
| 9 | `phat_thu_nhan` | `m1_phat_thu_nhan` |
| 10 | `tram_tu_thu` | `m1_tram_tu_thu` |
| 11 | `nhan_phan_chia` | `m1_nhan_phan_chia` |
| 12 | `ke_me` | `m1_ke_me` |
| 13 | đã mở kết thúc `chia_khoa_giu_lai` | `m1_chia_khoa_giu_lai` |

Kết cuối: 0 không có · 1 `ket4_tron_ven` · 2 `ket4_ky_uc` · 3 `ket4_ho_so_dung` · 4 `ket4_nguoi_o_lai`. Mùa 2 còn tự tính điểm trung thực 0–6 theo đúng công thức `STORY.honesty` của Mùa 1, và luôn đặt thêm cờ `m1_co_ma`.

## Việc cần làm ở Mùa 1 bản 1.2
1. Chép `engine/ma-ho-so.js` của repo Mùa 2 sang `js/ma-ho-so.js` của Mùa 1, thêm `<script src="js/ma-ho-so.js"></script>` trước `engine.js`.
2. Trong `renderActEnd` của `js/engine.js`, nhánh `if (sc.final)`, sau khi dựng bảng tổng kết:
   ```js
   const ends = read(END_KEY) || {};
   const code = MaHoSo.encode(Object.assign({}, S.flags, { chia_khoa_giu_lai: !!ends.chia_khoa_giu_lai }), endId);
   // chèn vào .summary một khối:
   // <div class="code"><b>Mã hồ sơ của bạn: ${code}</b><p>Nhập mã này ở Mùa 2 (kiemdem2.hlvsuckhoe.com → Mã hồ sơ Mùa 1) để Thục Anh nhớ những gì bạn đã chọn.</p><button>Chép mã</button></div>
   ```
3. Thêm nút “Mùa 2 ▶” trên menu Mùa 1, trỏ tới `https://kiemdem2.hlvsuckhoe.com/`.
4. Thử: đi hết Màn 4, chép mã, mở Mùa 2, bấm “Mã hồ sơ Mùa 1”, dán mã. Hộp thoại phải liệt kê đúng các điều đã chọn.

Mã mẫu để thử: `E41-5XS` (ghi sự thật, công khai, Út Thơ ra, có chìa khóa giữ lại, kết *Bàn giao trọn vẹn*). Mã trống: `800-280`.
