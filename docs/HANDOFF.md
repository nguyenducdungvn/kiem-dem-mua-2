# BÀN GIAO · Kiểm Đếm Ca Đêm · Mùa 2: Phiếu Bàn Giao (v2.0.0, 25/11/2026)

> Bảo Claude đọc `claude/kiem-dem-mua-2-handoff.md` (bản sao của file này), `claude/kiem-dem-mua-2.md` (kế hoạch mùa) và `claude/quy-tac-tieng-viet.md` trong Project "App GAME", rồi gắn repo `nguyenducdungvn/kiem-dem-mua-2` (ghi) và `nguyenducdungvn/kiem-dem-ca-dem` (đọc, khi cần tham chiếu Mùa 1).

## 1. Trạng thái
- **Repo:** https://github.com/nguyenducdungvn/kiem-dem-mua-2 (nhánh `main`). **Tên miền:** https://kiemdem2.hlvsuckhoe.com/ (file `CNAME` có sẵn; tác giả cần bật GitHub Pages, xem mục 6).
- **Đã xong:** engine dùng chung (mục 2), menu mùa, Mã hồ sơ Mùa 1, **Tập 1 · Bãi Bồi trọn bộ 3 màn** (v2.0.0): 93 cảnh, 8 luật, 28 manh mối, 10 kết thúc (4 kết màn, 6 thất bại, tất cả tới được), 4 mini-game, 5 không gian 3D. `check.js`: 2.927.587 trạng thái, 0 lỗi (có Mã hồ sơ: 3,1 triệu; chế độ đọc truyện: 2,1 triệu; đều 0 lỗi).
- **Kịch bản và bảng tổng hợp từng màn:** `docs/tap-1/kich-ban-man-1.md`, `kich-ban-man-2.md`, `kich-ban-man-3.md` (có bảng tổng hợp cả tập); toàn văn `kich-ban-tap-1-xuat.md`.
- **Chưa làm:** Tập 2 · Chợ Sớm (bước tiếp theo); ảnh OG; Mùa 1 bản 1.2 (Mã hồ sơ, xem `docs/ma-ho-so-mua-1.md`). Tác giả tạo Release `v2.0.0` bằng tay.

## 2. Cấu trúc file
| File | Vai trò |
|---|---|
| `index.html` | Một trang cho cả mùa. Không có `?tap` → menu mùa (chọn tập, Mã hồ sơ, giới thiệu…). `?tap=1` → nạp script của tập rồi mở menu tập. Mọi hộp thoại dùng chung |
| `config.js` | Tác giả, cà phê, góp ý, đăng ký; `season`: khóa lưu `kd2`, danh sách tập (`status: 'open' \| 'soon'`, `scripts`), câu tóm tắt Mã hồ sơ |
| `engine/core.js` | Engine (tách từ `js/engine.js` Mùa 1; v2.0.0 sửa: nút “Sang màn” dùng `proceedTo` để tính hiệu ứng của cảnh mở màn): chỉ số đọc từ `STORY.stats`, HUD dựng động, màn đọc từ `STORY.acts`, sổ đo xuyên mùa `STORY.notebook(S)`, mood `STORY.moodOf`, chia sẻ `STORY.meta.share`, tổng kết màn có `recap(S)` và `summary(S)` |
| `engine/scene3d-kit.js` | Bộ dựng 3D dùng chung (vật liệu, phòng, nhân vật, tablet, đèn pin, vòng lặp). Mỗi tập gọi `Scene3D.register({ views, figures, ambience, torch })` |
| `engine/audio.js` | Âm thanh WebAudio. Mới: `water oar bell crumble splash`, `SFX.setAmbience('river')` |
| `engine/icons.js` | Thư viện hình kết thúc. Mới: `tide stake boat lamp tree bell roof bowl pen`. Tập khai báo `STORY.endingIcons` |
| `engine/ma-ho-so.js` | Mã hóa/giải mã Mã hồ sơ Mùa 1 (dùng chung cho cả hai mùa) |
| `tap-1/story-act1.js` | Tập 1 Màn 1: `meta`, `stats`, `acts`, `rules` R1–R5, `notebook`, `scenes`, `endingsList`, `staging`, `STORY.areaOf` |
| `tap-1/story-act2.js` | Màn 2 (IIFE): R6–R8, `t1_m2_*`, mini-game sào `t1_m2_p3`, `het_man2`, kết thúc `t1_bua_com`. Gắn `het_man1.nextScene` |
| `tap-1/story-act3.js` | Màn 3 (IIFE): `t1_m3_*`, mini-game đối chiếu `t1_m3_p4`, `het_man3` (`final: true`), 2 kết cuối, `STORY.honesty1(S)` (0–6), ghi đè `STORY.notebook` (trang Cồn Lở) |
| `tap-1/scene.js` | Không gian `ben`, `song`, `truong`, `tram`, `nha` (trong ngôi nhà giữa sông); nhân vật `tu, sau, lanh, quy` |
| `tools/check.js` | `node tools/check.js tap-1/story-act1.js tap-1/story-act2.js tap-1/story-act3.js [--profile=m1_ghi_su_that,…] [--story] [--strict]`. Chỉ tách trạng thái theo cờ tạo nhánh (tự dò trong `cond`, `next` dạng hàm, `endOf`) |
| `tools/export.js` | `node tools/export.js <3 file story> > docs/tap-1/kich-ban-tap-1-xuat.md` |
| `docs/` | `MUA-2.md` (kế hoạch mùa), `tap-1/kich-ban-man-1..3.md` (Bước A/B/C, sơ đồ nhánh, bảng tổng hợp), `ma-ho-so-mua-1.md`, file này |

**Khóa lưu trình duyệt:** `kd2_endings` (chung cả mùa), `kd2_settings`, `kd2_profile`, `kd2_progress`, `kd2_mute`; theo tập: `kd2_t1_save`, `kd2_t1_chapters`. Id kết thúc có tiền tố `t1_`.

**Thêm màn cho một tập:** làm như `tap-1/story-act2.js` (IIFE, `Object.assign(STORY.scenes, …)`, `STORY.endingsList.push(…)`, `Object.assign(STORY.staging, …)`, gắn `nextScene` của màn trước, bỏ `soon` trong `STORY.acts`, thêm file vào `scripts` trong `config.js`). Màn cuối: `final: true`, `endOf(S)` chọn kết cuối. **Lưu ý:** `story-act1.js` khai báo hằng toàn cục `PAPER_DEFS, SANS, NUM, TIDE, SVG_P1, SVG_P2, AREA_DAY, areaOf, TAB`; file sau luôn bọc IIFE. Nút không đồng hồ thì bỏ `timer`; lựa chọn có hai phiên bản theo điều kiện thì dùng hai mục cùng `key` với `cond` ngược nhau (đừng dùng `next` dạng hàm phụ thuộc cờ, `check.js` không dò được hết).

**Thêm tập mới:** thư mục `tap-N/`, `meta.keyPrefix: 'kd2_tN'`, id kết thúc tiền tố `tN_`, đổi `status: 'open'` và `scripts` trong `config.js`. Chỉ số riêng khai báo trong `STORY.stats` (`show: 'pips'` cho dạng vạch).

## 3. Kinh thánh Tập 1 (tóm tắt)
- **Bối cảnh:** năm 2027, làng Cồn Lở, xã Hòa Bồi (mới sáp nhập), tỉnh Hòa Giang (hư cấu). Đo bàn giao thửa 112 (đất bến đò bà Tư) trước 06:00, sau đó khúc bờ thuộc dự án kè.
- **Cơ chế:** đất đi theo con nước; diện tích chỉ đúng khi đo lúc nước ròng mạnh (01:00). Lúc nước đứng, số đứng yên và “khớp hồ sơ”, đó là bẫy. Chỉ số riêng **Mực nước** (MN, 0–10, thua ở 10), mặt sông 3D dâng theo MN.
- **Luật:** R1 Đừng đo khi nước đứng (3 nguồn) · R2 Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng · R3 Cây gạo không trôi, lạc mốc thì hỏi ba cây gạo · R4 Bảng đen còn chữ thì đừng xóa · R5 (mực tím, không rõ nguồn, bẫy) Đo lúc nước cạn nhất thì được nhiều đất nhất · R6 Đo bằng sào thì đọc vạch ướt, đừng đọc vạch khô · R7 Ai trong nhà dưới sông mời ăn cơm thì cảm ơn rồi về · R8 (1 nguồn, đúng) Sổ của người đã đi thì đọc, đừng ký thêm vào.
- **Nhân vật:** ông Tư (Nguyễn Văn Tư, đã mất đêm 2007: ở lại đo nhà lúc 01:00 nước ròng được 248,6 m², mất lúc 03:00 nước đứng; cây sào và cuốn sổ đo; giọng nói sau tấm màn bếp); bà Tư (70 tuổi, chèo đò 40 năm, đêm 2007 chở 14 học trò qua sông; **chưa từng ký biên bản 311,0 vì biết đó là số đo lúc nước đứng**, nên hồ sơ treo 20 năm; tối nào cũng chèo qua thắp đèn bờ bên kia cho ông); anh Sáu (con bà, mua căn hộ 42 m² cho má); cô Lành (dạy điểm trường 11 năm, đêm 2007 cầm đèn đón học trò ở bến bên kia); anh Quý (cán bộ địa chính xã mới, mang biên bản 2007).
- **Người giữ sổ:** ký mực tím trên biên bản sạt lở 23/10/2007 (311,0 m², đo lúc 03:00 rạng 24/10, nước đứng chân), trên bảng con nước, trên góc ngắm gạo Miếu (318° đè lên 312°), vạch khô 3,1 m trên sào, chữ tự viết trên cửa ngôi nhà, cây bút mực tím ở chòi trạm. Ký bằng bút ấy thì chữ ký thành “Người giữ sổ”; để trống thì phần mềm tự ký thay. Chữ ký có trong hồ sơ một cái chợ, một nhà máy dệt, trụ sở xã cũ. **Chưa lộ danh tính** (Tập 4).
- **Sổ đo của Thục Anh:** bốn trang cuối dán kín, nét chữ ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu. Trang Cồn Lở mở lúc bình minh Tập 1 (cờ `mo_trang_1`): sơ đồ ba cây gạo, và lời ông Kha “Người giữ sổ không phải tên của một người. Ai ký thay người đã đi, người đó đang giữ sổ. Đừng để cô ấy ký thay ai.”
- **Diện tích:** thửa 112: hồ sơ 14:00 là 214,0 m² · đo đúng 196,4 · cọc theo GPS 201,9 · theo mực tím 233,8. Phần nhà lở 2007 (112-cũ): sổ ông Tư 248,6 m² (đúng, tới bờ dốc giữa sào S3 và S4) · biên bản mực tím 311,0 m² (tới S5, lòng sông).
- **Cờ Màn 1:** `mac_ao_phao, nhuong_ao_phao, dung_so_ngay, tin_muc_tim, hoi_thua_song, khuyen_ky, giu_bang, xoa_bang, ba_tu_ke, moc_gps, moc_ba_tu, theo_muc_tim, ghi_so_ro, ghi_so_ngay`.
- **Cờ Màn 2:** `do_sao_dung, tin_311, sau_do_cung, sau_tra_loi, co_so_ong_tu, do_them_muc_tim, ba_tu_tu_biet`. **Màn 3:** `chung_cu, giu_311, gac_ho_so, hua_thap_den, cho_ba_xem, giu_ba, tien_ong, ky_that, ky_muc_tim, bo_trong, mo_trang_1`.
- **Kết cuối:** `ky_that` → *Bàn giao một nơi chốn* (bà Tư ký nếu có `chung_cu`, `cho_ba_xem` hoặc Tin cậy ≥ 70; trao mái chèo cho cô Lành) · `ky_muc_tim` hoặc `bo_trong` → *Người giữ sổ* (ngôi nhà vẫn đứng giữa ban ngày, bà Tư ở lại).
- **Gợi ý mở Tập 2 · Chợ Sớm:** một cảnh ngắn ở Trung tâm, Thục Anh nhận hồ sơ chợ có một dòng mực tím trong sổ nợ (đã nhắc ở teaser cuối Tập 1). Có thể đọc `kd2_endings` (`t1_ket_ban_giao` / `t1_ket_muc_tim`) để đổi câu thoại, vì chung tên miền.

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
- **Phát hành:** phiên Claude không tạo được Release, không đẩy được tag. Tác giả tạo Release bằng tay: `v2.0.0` cho Tập 1 trọn bộ (đã đủ điều kiện), `v2.1.0` cho Tập 2.
- **Thiết kế (thêm từ Tập 1):** mở màn mới bằng một nhịp thở (giảm chỉ số riêng); nút quyết định cuối không có đồng hồ; bỏ trống cũng là một lựa chọn có hậu quả; dùng lại kết thúc cũ khi cùng một luật, để giữ 8–10 kết thúc.

## 6. Việc tác giả cần làm sau lần đẩy đầu tiên
1. Repo → Settings → Pages: Source `Deploy from a branch`, nhánh `main`, thư mục `/ (root)`.
2. Custom domain: `kiemdem2.hlvsuckhoe.com`. Đợi chứng chỉ xong thì tick **Enforce HTTPS**.
3. ✓ Đã có Issue #1 “Đăng ký nhận tập mới” (đã điền `subscribe.issueUrl`). Mỗi khi ra màn hoặc tập mới, viết một bình luận trong Issue này để người theo dõi nhận email.
4. ✓ Thống kê: dùng chung mã Cloudflare Web Analytics của hlvsuckhoe.com (thẻ beacon cuối `index.html`, đã ghi trong Miễn trừ).
5. ✓ Trang chủ hlvsuckhoe.com (repo `hlvsuckhoe-web`, bản 2.3.2) có thẻ Mùa 2 ở Góc giải đố, kệ ứng dụng, chân trang, sitemap; đã cập nhật “Tập 1 trọn bộ 3 màn”. Bản sao `nguyenducdungvn.github.io` tự đồng bộ 6 tiếng một lần. Ra màn hoặc tập mới thì sửa mô tả thẻ ở đó.
