# BÀN GIAO · Kiểm Đếm Ca Đêm · Mùa 2: Phiếu Bàn Giao (v2.0.0-alpha.1, 24/11/2026)

> Bảo Claude đọc `claude/kiem-dem-mua-2-handoff.md` (bản sao của file này), `claude/kiem-dem-mua-2.md` (kế hoạch mùa) và `claude/quy-tac-tieng-viet.md` trong Project "App GAME", rồi gắn repo `nguyenducdungvn/kiem-dem-mua-2` (ghi) và `nguyenducdungvn/kiem-dem-ca-dem` (đọc, khi cần tham chiếu Mùa 1).

## 1. Trạng thái
- **Repo:** https://github.com/nguyenducdungvn/kiem-dem-mua-2 (nhánh `main`). **Tên miền:** https://kiemdem2.hlvsuckhoe.com/ (file `CNAME` có sẵn; tác giả cần bật GitHub Pages, xem mục 6).
- **Đã xong:** tách engine dùng chung (mục 2), menu mùa, Mã hồ sơ Mùa 1, **Tập 1 · Bãi Bồi · Màn 1 · Con nước**: 40 cảnh, 5 luật, 14 manh mối, 6 kết thúc, 2 mini-game, 4 không gian 3D. `check.js`: 9.575 trạng thái, 0 lỗi.
- **Chưa làm:** Tập 1 Màn 2 · Nước ròng, Màn 3 · Bàn giao; ảnh OG; Mùa 1 bản 1.2 (Mã hồ sơ, xem `docs/ma-ho-so-mua-1.md`).

## 2. Cấu trúc file
| File | Vai trò |
|---|---|
| `index.html` | Một trang cho cả mùa. Không có `?tap` → menu mùa (chọn tập, Mã hồ sơ, giới thiệu…). `?tap=1` → nạp script của tập rồi mở menu tập. Mọi hộp thoại dùng chung |
| `config.js` | Tác giả, cà phê, góp ý, đăng ký; `season`: khóa lưu `kd2`, danh sách tập (`status: 'open' \| 'soon'`, `scripts`), câu tóm tắt Mã hồ sơ |
| `engine/core.js` | Engine (tách từ `js/engine.js` Mùa 1): chỉ số đọc từ `STORY.stats`, HUD dựng động, màn đọc từ `STORY.acts`, sổ đo xuyên mùa `STORY.notebook(S)`, mood `STORY.moodOf`, chia sẻ `STORY.meta.share`, tổng kết màn có `recap(S)` và `summary(S)` |
| `engine/scene3d-kit.js` | Bộ dựng 3D dùng chung (vật liệu, phòng, nhân vật, tablet, đèn pin, vòng lặp). Mỗi tập gọi `Scene3D.register({ views, figures, ambience, torch })` |
| `engine/audio.js` | Âm thanh WebAudio. Mới: `water oar bell crumble splash`, `SFX.setAmbience('river')` |
| `engine/icons.js` | Thư viện hình kết thúc. Mới: `tide stake boat lamp tree bell roof`. Tập khai báo `STORY.endingIcons` |
| `engine/ma-ho-so.js` | Mã hóa/giải mã Mã hồ sơ Mùa 1 (dùng chung cho cả hai mùa) |
| `tap-1/story-act1.js` | Tập 1 Màn 1: `meta`, `stats`, `acts`, `rules` R1–R5, `notebook`, `scenes`, `endingsList`, `staging` |
| `tap-1/scene.js` | Không gian `ben`, `song`, `truong`, `tram`; nhân vật `tu, sau, lanh, quy` |
| `tools/check.js` | `node tools/check.js tap-1/story-act1.js [--profile=m1_ghi_su_that,…] [--story] [--strict]` |
| `tools/export.js` | `node tools/export.js tap-1/story-act1.js > docs/tap-1/kich-ban-man-1-xuat.md` |
| `docs/` | `MUA-2.md` (kế hoạch mùa), `tap-1/kich-ban-man-1.md` (Bước A/B/C, sơ đồ nhánh, bảng tổng hợp), `ma-ho-so-mua-1.md`, file này |

**Khóa lưu trình duyệt:** `kd2_endings` (chung cả mùa), `kd2_settings`, `kd2_profile`, `kd2_progress`, `kd2_mute`; theo tập: `kd2_t1_save`, `kd2_t1_chapters`. Id kết thúc có tiền tố `t1_`.

**Thêm Màn 2 cho Tập 1:** tạo `tap-1/story-act2.js` theo mẫu Mùa 1 (IIFE, `Object.assign(STORY.scenes, …)`, `STORY.endingsList.push(…)`, `Object.assign(STORY.staging, …)`), gắn `STORY.scenes.het_man1.nextScene = 't1_m2_mo'`, đặt `act: 'Màn 2 · Nước ròng'` ở cảnh đầu, bỏ `soon` của màn 2 trong `STORY.acts`, thêm file vào `scripts` của tập 1 trong `config.js`. **Lưu ý:** `story-act1.js` khai báo các hằng toàn cục `PAPER_DEFS, SANS, NUM, TIDE, SVG_P1, SVG_P2, AREA_DAY, areaOf, TAB`. File màn sau phải bọc trong IIFE hoặc dùng tên khác, nếu không trình duyệt báo lỗi khai báo trùng.

**Thêm tập mới:** thư mục `tap-N/`, `meta.keyPrefix: 'kd2_tN'`, id kết thúc tiền tố `tN_`, đổi `status: 'open'` và `scripts` trong `config.js`. Chỉ số riêng khai báo trong `STORY.stats` (`show: 'pips'` cho dạng vạch).

## 3. Kinh thánh Tập 1 (tóm tắt)
- **Bối cảnh:** năm 2027, làng Cồn Lở, xã Hòa Bồi (mới sáp nhập), tỉnh Hòa Giang (hư cấu). Đo bàn giao thửa 112 (đất bến đò bà Tư) trước 06:00, sau đó khúc bờ thuộc dự án kè.
- **Cơ chế:** đất đi theo con nước; diện tích chỉ đúng khi đo lúc nước ròng mạnh (01:00). Lúc nước đứng, số đứng yên và “khớp hồ sơ”, đó là bẫy. Chỉ số riêng **Mực nước** (MN, 0–10, thua ở 10), mặt sông 3D dâng theo MN.
- **Luật:** R1 Đừng đo khi nước đứng (3 nguồn) · R2 Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng · R3 Cây gạo không trôi, lạc mốc thì hỏi ba cây gạo · R4 Bảng đen còn chữ thì đừng xóa · R5 (mực tím, không rõ nguồn, bẫy) Đo lúc nước cạn nhất thì được nhiều đất nhất.
- **Nhân vật:** bà Tư (70 tuổi, chèo đò 40 năm, đêm lở đất 2007 chở 14 học trò qua sông, nhà lở mất 311 m²); anh Sáu (con bà, mua căn hộ 42 m² cho má); cô Lành (dạy điểm trường 11 năm, đêm 2007 cầm đèn đón học trò ở bến bên kia); anh Quý (cán bộ địa chính xã mới, mang biên bản 2007).
- **Người giữ sổ:** ký mực tím trên biên bản sạt lở 23/10/2007 (311,0 m²), trên bảng con nước, trên góc ngắm gạo Miếu (318° đè lên 312°). Chữ ký có trong hồ sơ một cái chợ, một nhà máy dệt, trụ sở xã cũ.
- **Sổ đo của Thục Anh:** bốn trang cuối dán kín, nét chữ ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu. Trang Cồn Lở mở khi cờ `mo_trang_1` (cuối Tập 1).
- **Diện tích:** hồ sơ 14:00 là 214,0 m² · đo đúng 196,4 · cọc theo GPS 201,9 · theo mực tím 233,8.
- **Cờ Màn 1:** `mac_ao_phao, nhuong_ao_phao, dung_so_ngay, tin_muc_tim, hoi_thua_song, khuyen_ky, giu_bang, xoa_bang, ba_tu_ke, moc_gps, moc_ba_tu, theo_muc_tim, ghi_so_ro, ghi_so_ngay`.
- **Câu hỏi treo cho Màn 2:** đo ngôi nhà giữa sông bằng sào thế nào trước khi nước lên lại? Chữ ký mực tím trên cửa ngôi nhà? Bà Tư có ký không? Đèn bờ bên kia là của ai?

## 4. Quy trình mỗi màn (bắt buộc)
1. **Bước A:** rút 1 bài học về nhịp độ hoặc độ khó từ màn trước.
2. **Bước B:** tích hợp ý tưởng của người dùng, nối khớp manh mối cũ.
3. **Bước C:** viết rồi dựng (dữ liệu + 3D), chạy `check.js` (cả `--profile` và `--story`), chụp màn hình ở 1366 px và 390 px.
4. **Cuối màn:** bảng tổng hợp (Trạng thái & Chỉ số · Sợi dây liên kết · Bài học thiết kế), cập nhật HANDOFF (file này và Project), tăng version, ghi `CHANGELOG.md`, đẩy lên `main`.

## 5. Quy tắc cố định
- **Tiếng Việt:** `claude/quy-tac-tieng-viet.md`. Nhãn chữ Việt trong SVG dùng Be Vietnam Pro, chỉ số và giờ mới dùng Roboto Mono. `check.js` báo chuỗi chưa NFC.
- **Độc bản:** danh sách cấm của Mùa 1, cộng: không lặp twist Mùa 1 (căn hộ không có trong bản vẽ, livestream là hồ sơ công khai, đồ đạc tự về chỗ cũ), không bốc mộ hay quy tập mộ.
- **Thiết kế:** vào nút đầu sau tối đa 2 cảnh; phương án chết là phương án hấp dẫn hoặc tử tế nhất, có luật báo trước; đồng hồ chỉ ở nút hành động; khoảnh khắc nhân vật rải giữa các nút; 8–10 kết thúc mỗi tập.
- **Lỗi đã sửa, giữ làm mặc định:** `[hidden]{display:none!important}`; typeParagraphs có token; đồng hồ có guard; pixel ratio thấp trên điện thoại; mái tôn: `rotation.x` âm cho nửa mái phía bắc.
- **Phát hành:** phiên Claude không tạo được Release, không đẩy được tag. Tác giả tạo Release `v2.0.0` bằng tay khi Tập 1 hoàn chỉnh.

## 6. Việc tác giả cần làm sau lần đẩy đầu tiên
1. Repo → Settings → Pages: Source `Deploy from a branch`, nhánh `main`, thư mục `/ (root)`.
2. Custom domain: `kiemdem2.hlvsuckhoe.com`. Đợi chứng chỉ xong thì tick **Enforce HTTPS**.
3. ✓ Đã có Issue #1 “Đăng ký nhận tập mới” (đã điền `subscribe.issueUrl`). Mỗi khi ra màn hoặc tập mới, viết một bình luận trong Issue này để người theo dõi nhận email.
4. ✓ Thống kê: dùng chung mã Cloudflare Web Analytics của hlvsuckhoe.com (thẻ beacon cuối `index.html`, đã ghi trong Miễn trừ).
5. ✓ Trang chủ hlvsuckhoe.com (repo `hlvsuckhoe-web`, bản 2.3.1) đã có thẻ Mùa 2 ở Góc giải đố, kệ ứng dụng, chân trang, sitemap. Bản sao `nguyenducdungvn.github.io` tự đồng bộ 6 tiếng một lần. Ra màn hoặc tập mới thì sửa mô tả thẻ ở đó.
