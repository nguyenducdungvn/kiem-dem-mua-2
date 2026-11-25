# Tập 2 · Chợ Sớm · Kế hoạch dựng (chốt 25/11/2026)

> Đọc cùng `docs/HANDOFF.md` (Project: `claude/kiem-dem-mua-2-handoff.md`). Làm theo quy trình Bước A/B/C, mỗi màn một bảng tổng hợp. Mẫu code: `tap-1/` (act1 khai báo `meta/stats/acts/rules`, act2–3 bọc IIFE). Phát hành `v2.1.0` khi đủ 3 màn.

## 1. Khung
- **Bối cảnh:** chợ Sớm, thị trấn Phú Cầu (hư cấu), tỉnh Hòa Giang, năm 2027, ba tuần sau đêm ở Cồn Lở. Chợ họp từ 3 giờ sáng suốt 60 năm, sáng mai đóng cửa để xây trung tâm thương mại. Ca đêm kiểm đếm 186 lô sạp để tính tiền hỗ trợ cho tiểu thương.
- **Mở tập:** một cảnh ngắn ở Trung tâm. Thục Anh nhận hồ sơ chợ, thấy trong bản chụp sổ nợ có một dòng mực tím (nối teaser cuối Tập 1). Nếu `kd2_endings` có `t1_ket_muc_tim`: vết mực tím trên ngón tay cô chưa phai. Nếu có `t1_ket_ban_giao`: anh Quý nhắn tin “bà Tư đã dọn lên chỗ mới”.
- **Chỉ số riêng:** Sổ nợ (`SN`), từ −10 đến +10, bắt đầu 0, hiện dạng thanh (`fmt` có dấu + và −). Mua bằng lời hứa, nhận tiền thối của người không có mặt, ký con số sai thì sổ nợ âm. Trả nợ thật, ghi đúng thì dương. **SN ≤ −6 là thua** (bị giữ lại làm tiểu thương của chợ ma). Chế độ đọc truyện chặn ở −5.
- **Đích cảm xúc:** cuốn sổ nợ là thứ giữ chợ đứng. Xóa hết nợ thì chợ sập, giữ nợ sai thì chợ không bao giờ tan. Bàn giao đúng là để từng món nợ được trả, được chính chủ nợ tha, hoặc được ghi thật, rồi ký bằng tên mình.

## 2. Nhân vật
- **Bà Hai** (68 tuổi), bán vải 45 năm, giữ sổ nợ cả chợ. Ai thiếu ai, bà ghi hết, kể cả nợ của người đã mất.
- **Anh Toàn** (40 tuổi), ban quản lý chợ, cần số đẹp để đối chiếu với chủ đầu tư; không xấu, chỉ sợ trách nhiệm.
- **Mi** (24 tuổi), shipper, lớn lên dưới gầm sạp mẹ bán cá; mẹ Mi mất năm 2019, sạp 47 vẫn đứng tên mẹ.
- **Ông chủ đầu tư trẻ** (tên Hiển, 31 tuổi), đến lúc 4 giờ, muốn “xóa nợ cho mọi người” để chợ bàn giao sạch. Lòng tốt thật, nhưng là phương án làm chợ sập.
- **Người giữ sổ:** một dòng mực tím trong sổ nợ, ghi khoản nợ của những người đã đi, ký nhận thay họ.

## 3. Luật (8, ghi trên mặt sau vé thu phí chợ)
| Mã | Lời dặn | Nguồn | Vai trò |
|---|---|---|---|
| L1 | Sau ba giờ sáng, đừng trả giá. | vé 1955, vé 1990, bà Hai | Nút chết Màn 2 (trả giá với hàng chợ ma) |
| L2 | Ai bán bằng lời hứa thì đừng mua. | vé 1990, cột chợ | Bẫy mua hàng |
| L3 | Sạp nào còn treo đèn thì đừng đếm là sạp trống. | vé 2008, Mi | Mini-game sơ đồ lô sạp |
| L4 | Cân của chợ thì đừng cân lại bằng tay. | vé 1975 | Mini-game cân điêu |
| L5 | Đừng nhận tiền thối từ người không có mặt. | vé 2015, bà Hai | Nút chết Màn 2 |
| L6 | Nợ của người đã đi thì để người thân trả hoặc tha. | sổ nợ bìa trong | Màn 3 |
| L7 (bẫy, mực tím) | Xóa hết nợ thì ai cũng nhẹ người. | ? | Bẫy của Hiển và Người giữ sổ |
| L8 | Sổ nợ đóng lại thì chợ tan. | 1 nguồn, đúng | Lời giải Màn 3 |

## 4. Ba màn
### Màn 1 · Sổ nợ (22:00 – 01:00)
- Vào chợ, đếm sạp. Nút đầu ở cảnh 3.
- **Nút 1:** sạp 47 còn treo đèn dù đã trống từ 2019 (L3). Mi nhờ đếm là sạp trống để được hỗ trợ một lần.
- **Mini-game đối chiếu sơ đồ lô sạp:** 186 lô trên sơ đồ 1998 so với hiện trạng; có 3 lô “ma” chỉ có trên sổ (mực tím), 1 lô thật bị ghép.
- **Khoảnh khắc nhân vật:** bà Hai mở sổ nợ.
- **Nút 3:** con số tổng cho anh Toàn.
- **Kết màn:** *Kết Màn 1: Đèn sạp 47*.
- **Chết vì lựa chọn:** *Sạp trống* (đếm sạp còn đèn là trống, bị chợ giữ làm chủ sạp).

### Màn 2 · Chợ ma (01:00 – 03:30)
- Từ 3 giờ (dồn nhịp 01:00 → 03:00), chợ ma họp: người bán đã mất bày hàng, đòi bán bằng lời hứa.
- **Mini-game phát hiện cân điêu:** 4 cái cân. Một cân đúng, một cân điêu của người sống, một cân điêu của chợ ma, và một cân “đúng tới từng gram” khi không có ai đứng bán.
- **Nút 2:** người bán chè trả lại tiền thối, người đó không có mặt (L5).
- **Nút 3:** mẹ Mi xuất hiện ở sạp 47, gọi Mi.
- **Kết màn:** *Kết Màn 2: Phiên chợ ba giờ*.
- **Chết:** *Tiền thối* (nhận tiền thối của người không có mặt). Dùng lại *Sạp trống* khi trả giá sau ba giờ.

### Màn 3 · Phiên chợ cuối (03:30 – 06:00)
- **Mini-game đọc sổ nợ viết tay:** tìm dòng mực tím ký nhận thay người đã đi.
- Hiển đến, muốn xóa nợ hết (L7). Bà Hai giữ sổ. Mi phải chọn trả hay xin tha nợ cho mẹ.
- **Nút chữ ký cuối không đồng hồ.**
- **Kết cuối:**
  - *Phiên chợ cuối cùng*: bàn giao sổ nợ thật, từng món được trả, được tha hoặc ghi thật; chợ tan lúc bình minh, không sập.
  - *Người giữ sổ*: xóa hết nợ, ký bằng bút mực tím, hoặc để trống; chợ sập hoặc không bao giờ tan.
- **Mở trang “Chợ Sớm”** trong sổ đo: gợi ý thứ hai về danh tính Người giữ sổ, không lộ hẳn.

### Kết thúc (10)
- 4 kết màn: Màn 1, Màn 2, 2 kết cuối.
- 6 thất bại: Sạp trống, Tiền thối, Nợ lời hứa (mua hàng bằng lời hứa), Chợ sập (xóa hết nợ khi chưa ký), Giữ lại chợ (Sổ nợ ≤ −6), Đếm mãi (Tỉnh táo cạn; hoặc dùng lại tên khác cho khỏi trùng *Đếm sóng*).

## 5. 3D (`tap-2/scene.js`)
- **Không gian:**
  - nhà lồng chợ (mái tôn cao, dãy sạp đánh số, đèn bóng tròn);
  - sạp 47;
  - phòng ban quản lý (bàn, sổ nợ);
  - chợ ma (cùng nhà lồng, đèn dầu thay đèn điện, sương);
  - bình minh ở cổng chợ.
- **Nhân vật:** `hai`, `toan`, `mi`, `hien`, và `me_mi` (người bán ở chợ ma).
- **Âm thanh mới** (nếu cần): tiếng cân, tiếng rao xa, tiếng mở cửa sắt cuốn.

## 6. Ngăn bẫy đã gặp ở Tập 1
- File màn sau luôn bọc IIFE; đặt tên hằng khác với Tập 1.
- Cảnh mở màn mới nên giảm chỉ số riêng một chút (nhịp thở).
- Hai phiên bản của cùng một lựa chọn: dùng hai mục cùng `key`, `cond` ngược nhau.
- Chạy `node tools/check.js tap-2/story-act1.js …` sau mỗi màn. Mục tiêu: cả 10 kết thúc đều tới được, 0 lỗi, đường trung thực còn cách vạch thua ít nhất 5 lỗi.
- Khi xong Tập 2: `config.js` đổi Tập 2 thành `status: 'open'` kèm `scripts`; trang chủ hlvsuckhoe.com (repo `hlvsuckhoe-web`) sửa thẻ Mùa 2 rồi đồng bộ `nguyenducdungvn.github.io`; bình luận trong Issue #1; tác giả tạo Release `v2.1.0`.
