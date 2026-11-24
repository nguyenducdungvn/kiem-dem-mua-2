# Kiểm Đếm Ca Đêm · Mùa 2: Phiếu Bàn Giao

> Kế hoạch và bàn giao để làm Mùa 2 trong một chat mới. Đọc file này cùng `docs/HANDOFF.md` (Mùa 1) và `claude/quy-tac-tieng-viet.md` trong Project "App GAME".

## 0. Việc tác giả làm trước (khoảng 10 phút)

### 0.1 Tên gọi đã chốt
| Mục | Giá trị |
|---|---|
| Tên hiển thị | Kiểm Đếm Ca Đêm · Mùa 2: Phiếu Bàn Giao |
| Repo GitHub | `nguyenducdungvn/kiem-dem-mua-2` |
| Tên miền | `kiemdem2.hlvsuckhoe.com` |
| Khóa lưu trữ trình duyệt | `kd2_…` (ví dụ `kd2_t1_save`, `kd2_endings`) |
| Tag phiên bản | `v2.0.0` cho bản ra mắt tập 1, `v2.1.0` cho tập 2, … |

**Quy ước đặt tên cho các truyện sau:**
- Cùng thương hiệu, mùa mới: repo `kiem-dem-mua-N`, tên miền `kiemdemN.hlvsuckhoe.com`, khóa lưu `kdN_`.
- Truyện độc lập khác thương hiệu: repo là tên truyện không dấu nối bằng gạch ngang, tối đa 20 ký tự (ví dụ `ben-do-so-7`). Tên miền là tên đó viết liền (`bendoso7.hlvsuckhoe.com`).
- Tên hiển thị luôn theo dạng "Tên chính · Phụ đề", viết hoa chữ cái đầu mỗi từ, không viết hoa toàn bộ.

### 0.2 Tạo repo rỗng
1. Vào https://github.com/new.
2. Owner `nguyenducdungvn`, Repository name `kiem-dem-mua-2`, chọn **Public**.
3. Description: `Truyện tương tác kinh dị tâm lý, Mùa 2 của Kiểm Đếm Ca Đêm. Chơi trên trình duyệt.`
4. **Không** tick README, .gitignore hay License (để repo rỗng, lần đẩy đầu tiên sẽ sạch).

### 0.3 Tạo bản ghi tên miền
Ở nơi quản lý DNS của `hlvsuckhoe.com` (nhiều khả năng là Cloudflare):

| Type | Name | Target | Proxy | TTL |
|---|---|---|---|---|
| CNAME | `kiemdem2` | `nguyenducdungvn.github.io` | **DNS only** (mây xám) | Auto |

- Phải để **DNS only** thì GitHub mới cấp được chứng chỉ HTTPS.
- **Nên làm thêm để chống người khác chiếm tên miền con:** GitHub → Settings (tài khoản) → Pages → Add a domain → `hlvsuckhoe.com`. GitHub sẽ đưa một bản ghi TXT (`_github-pages-challenge-nguyenducdungvn`). Thêm bản ghi đó vào DNS rồi bấm Verify. Làm một lần là dùng được cho mọi tên miền con về sau.

### 0.4 Sau lần đẩy đầu tiên (Claude sẽ nhắc)
- Repo → Settings → Pages: Source chọn `Deploy from a branch`, nhánh `main`, thư mục `/ (root)`.
- Custom domain điền `kiemdem2.hlvsuckhoe.com`. Đợi chứng chỉ xong thì tick **Enforce HTTPS**.
- File `CNAME` sẽ có sẵn trong repo.
- Nếu muốn thống kê lượt xem: thêm site mới trong Cloudflare Web Analytics và gửi token cho Claude.

### 0.5 Câu mở đầu cho chat mới (copy nguyên văn)
> Trong Project "App GAME", hãy đọc `claude/kiem-dem-mua-2.md`, `claude/kiem-dem-ca-dem-handoff.md` và `claude/quy-tac-tieng-viet.md`. Gắn repo `nguyenducdungvn/kiem-dem-ca-dem` (đọc) và `nguyenducdungvn/kiem-dem-mua-2` (ghi). Tôi đã tạo repo rỗng và bản ghi CNAME `kiemdem2` → `nguyenducdungvn.github.io`. Bắt đầu Mùa 2 từ mục 4: tách engine, rồi làm Tập 1 "Bãi Bồi" Màn 1, theo quy trình Bước A/B/C và bảng tổng hợp cuối màn.

## 1. Bài học rút ra từ Mùa 1
**Nhịp độ và thiết kế**
- Vào nút lựa chọn đầu tiên sau tối đa 2 cảnh. Khoảnh khắc nhân vật đặt xen giữa các nút, không dồn ở đầu.
- Phương án chết nên là phương án tử tế hoặc hấp dẫn nhất, nhưng phải có một luật hoặc manh mối đã báo trước. Thua mà không có dấu hiệu nào sẽ khiến người chơi cảm thấy bị lừa.
- 27 kết thúc cho 80 phút là nhiều. Mùa 2 nên có 8–10 kết thúc mỗi tập, trong đó 3–4 kết màn, để mỗi kết thúc đáng nhớ hơn.
- Chế độ đọc truyện (bản 1.1) cho thấy cần thiết kế để người không thích áp lực thời gian vẫn đi hết được truyện. Mùa 2 có chế độ này ngay từ đầu.
- Ý mạnh nhất của Mùa 1 là "hồ sơ thành sự thật" và "trung thực làm giảm Độ neo". Mùa 2 giữ trục đạo đức này, nhưng mỗi tập đổi cơ chế cụ thể.

**Kỹ thuật**
- Viết `check.js` (duyệt mọi nhánh, gộp trạng thái trùng) từ màn đầu tiên, chạy sau mỗi lần sửa.
- Giữ các lỗi đã gặp làm mặc định:
  - `[hidden]{display:none!important}`;
  - typeParagraphs có token;
  - đồng hồ có guard;
  - pixel ratio thấp trên điện thoại;
  - nhãn chữ Việt không dùng font chữ số.
- Tiếng Việt: dùng font tự host có subset vietnamese, lưu chuỗi dạng NFC, không viết hoa toàn bộ chữ có dấu, không giãn chữ. Rà lại trước mỗi lần phát hành.
- Phát hành: tăng version, ghi `CHANGELOG.md`, tác giả tạo Release bằng tay (phiên Claude không tạo được Release, không đẩy được tag).

**Độc bản**
- Giữ danh sách cấm của Mùa 1: gọi tên đầy đủ, điểm danh hay sĩ số thừa, quan tài, nấm hoặc bào tử, siêu luật đếm số điều, kẻ giả mạo đồng minh, kéo dài thời hạn tập thể.
- Thêm vào danh sách: không lặp lại twist của chính Mùa 1, gồm "căn hộ không có trong bản vẽ", "livestream là hồ sơ công khai" và "đồ đạc tự về chỗ cũ".
- Không dùng chuyện bốc mộ hay quy tập mộ (vì liên quan quan tài).

## 2. Kinh thánh Mùa 2
- **Thời gian:** năm 2027, một năm sau đêm ở nhà B4. Tỉnh mới sau sáp nhập (hư cấu) là tỉnh Hòa Giang. Thục Anh giờ là kiểm đếm viên của Trung tâm Phát triển quỹ đất tỉnh. Mẹ cô đã mổ xong và đang hồi phục.
- **Chủ đề mùa:** *bàn giao một nơi chốn, chứ không chỉ một con số.* Mỗi tập là một khu đất sắp đổi chủ, với một ca đêm kiểm đếm cuối cùng.
- **Câu hỏi xuyên mùa:** Ai đang ký thay những người đã đi? Ở cả bốn khu, Thục Anh đều thấy cùng một chữ ký lạ trên biên bản cũ, ký tên "Người giữ sổ".
- **Đồ vật xuyên mùa:** cuốn sổ đo của Thục Anh. Mỗi tập mở khóa một trang. Trang cuối của Tập 4 cho biết "Người giữ sổ" là ai.
- **Chỉ số chung:** Tỉnh táo, Tin cậy, Độ neo giữ như Mùa 1. Mỗi tập thay Pin bằng một chỉ số riêng.
- **Kế thừa từ Mùa 1:** màn cuối Mùa 1 bản 1.2 sẽ hiện một **Mã hồ sơ** gồm 6 ký tự, mã hóa các cờ chính như `ghi_su_that`, `chia_khoa_giu_lai`, `cong_khai`. Người chơi nhập mã này ở Mùa 2 để có câu thoại và manh mối riêng. Cần mã vì hai tên miền khác nhau không dùng chung bộ nhớ trình duyệt. Các tập trong Mùa 2 dùng chung tên miền nên tự kế thừa.

## 3. Bốn tập
Mỗi tập có 2–3 màn, chơi khoảng 30–40 phút, có 8–10 kết thúc và một bộ luật riêng từ 6 đến 8 điều.

### Tập 1 · Bãi Bồi
- **Bối cảnh:** làng Cồn Lở bên sông (hư cấu), phải di dời vì sạt lở. Đêm cuối, đội phải đo đạc bàn giao trước khi khúc bờ bị nước nuốt.
- **Cơ chế "Đất đi theo con nước":** diện tích thửa đất thay đổi theo mực nước từng giờ. Cọc mốc cắm ban ngày thì đêm trôi đi. Con số chỉ đúng nếu đo vào giờ nước ròng.
- **Luật:** khắc trên cọc tre và mái tôn, ví dụ "Đừng đo khi nước đứng", "Đèn bờ bên kia tắt thì đừng chèo ra giữa dòng".
- **Chỉ số riêng:** Mực nước (tăng dần, chạm mức thì thua).
- **Mini-game:**
  - đọc bảng con nước;
  - giao hội từ 3 cây gạo cổ;
  - đo bằng sào.
- **Nhân vật:**
  - bà Tư, chủ bến đò, 40 năm chở học trò;
  - anh Sáu, con trai đi làm thành phố về ký giấy;
  - cô Lành, dạy ở điểm trường bị bỏ;
  - anh Quý, cán bộ địa chính của xã mới sáp nhập.
- **Twist:** có một ngôi nhà chỉ hiện ra lúc nước ròng. Đó là thửa đất bà Tư đã lở xuống sông 20 năm trước nhưng chưa từng được đền bù, và giờ bà đòi đo lại nó.

### Tập 2 · Chợ Sớm
- **Bối cảnh:** chợ cũ của thị trấn sắp thành trung tâm thương mại. Ca đêm kiểm đếm các lô sạp để tính hỗ trợ.
- **Cơ chế "Chợ nhớ nợ":** mỗi con số người chơi ký sẽ làm một khoản nợ trong sổ chợ được trả hoặc phát sinh. Từ 3 giờ sáng, chợ ma dọn hàng và đòi bán cho người chơi bằng "lời hứa".
- **Luật:** ghi trên mặt sau vé thu phí chợ.
- **Chỉ số riêng:** Sổ nợ (âm thì bị giữ lại chợ).
- **Mini-game:**
  - đối chiếu sơ đồ lô sạp;
  - phát hiện cân điêu;
  - đọc sổ nợ viết tay.
- **Nhân vật:**
  - bà Hai bán vải, giữ sổ nợ của cả chợ;
  - anh Toàn, ban quản lý chợ;
  - Mi, chị shipper lớn lên trong chợ;
  - ông chủ đầu tư trẻ.
- **Twist:** cuốn sổ nợ là thứ duy nhất giữ chợ đứng vững. Xóa nợ cho mọi người thì chợ sập.

### Tập 3 · Ca Ba
- **Bối cảnh:** nhà máy dệt cũ chuyển thành khu đô thị. Ca đêm kiểm kê máy móc và khu tập thể công nhân.
- **Cơ chế "Máy vẫn chạy ca ba":** tiếng máy dệt có nhịp. Đi lệch nhịp thì hành lang đổi hướng. Sổ giao ca tự viết thêm dòng mới.
- **Luật:** dán trong nội quy phân xưởng.
- **Chỉ số riêng:** Nhịp máy.
- **Mini-game:**
  - lần sơ đồ dây chuyền;
  - đọc sổ giao ca;
  - đối chiếu phiếu sản lượng.
- **Nhân vật:**
  - chú Lực, thợ máy về hưu;
  - chị Hằng, tổ trưởng;
  - Khôi, kỹ sư của chủ đầu tư;
  - một học viên trường nghề.
- **Twist:** dòng chữ trong sổ giao ca là ca bàn giao bị bỏ dở năm 2004. Ca đó chưa từng được ký nhận, nên nhà máy chưa "tan ca".

### Tập 4 · Con Dấu (kết mùa)
- **Bối cảnh:** trụ sở xã cũ sau sáp nhập. Ca đêm bàn giao 40 năm hồ sơ địa chính và nộp hủy con dấu cũ.
- **Cơ chế "Con dấu còn hiệu lực đến sáng":** giấy tờ nào được đóng dấu trong đêm sẽ thành sự thật. Đây là bản nâng cấp của "hồ sơ thành sự thật" ở Mùa 1, nhưng lần này người chơi cầm quyền đó trong tay.
- **Chỉ số riêng:** Mực dấu (số lần còn được đóng).
- **Mini-game:**
  - xếp hồ sơ theo số thửa;
  - phát hiện dấu giả;
  - ghép trang sổ đo.
- **Nút thắt mùa:** hồ sơ của Cồn Lở, chợ và nhà máy đều từng qua xã này, và "Người giữ sổ" ký trên cả ba. Người chơi chọn dùng con dấu để sửa quá khứ (mạnh nhưng sai thủ tục) hay bàn giao nguyên trạng và kể lại sự thật (chậm nhưng đúng).
- **Kết mùa:** cái kết tốt nhất không cần đóng dấu lần nào.

## 4. Kế hoạch kỹ thuật (bước đầu của chat mới)
1. **Tách engine:** chép từ Mùa 1 sang `kiem-dem-mua-2/engine/`.
   - Các file: `core.js` (từ engine.js), `audio.js`, `scene3d-kit.js` (vật liệu, đèn, nhân vật, tablet), `icons.js`.
   - Cấu hình chỉ số riêng của từng tập đặt trong `STORY.stats`, gồm tên, giới hạn và kết thúc khi cạn.
2. **Cấu trúc thư mục:**
   - `index.html`: menu mùa và chọn tập;
   - `tap-1/story-*.js`, `tap-1/scene.js`;
   - `?tap=1` hoặc trang `tap-1/`.
3. Giữ font, `check.js`, `export.js`, mẫu Issue và các tính năng của bản 1.1 (đọc truyện, phím tắt, chia sẻ, thẻ kết thúc, nhạc theo không khí).
4. **Ra mắt từng tập:** Tập 1 hoàn chỉnh là `v2.0.0`, sau đó mỗi tập là một bản minor. Màn hình chính ghi "Sắp ra mắt" cho tập chưa làm, có nút Đăng ký nhận tin.
5. Mùa 1 bản 1.2 (làm song song, nhỏ):
   - thêm Mã hồ sơ ở màn cuối;
   - thêm link "Mùa 2" trên menu khi Tập 1 ra mắt.

## 5. Đề xuất tiếp theo
1. **Mùa 1 bản 1.2:**
   - bản tiếng Anh (tách chuỗi ra `lang/en.js`);
   - PWA cài lên điện thoại, chơi được khi không có mạng;
   - Mã hồ sơ để chuyển sang Mùa 2.
2. **Cộng đồng:**
   - mở GitHub Discussions để người chơi bình chọn bối cảnh cho tập tiếp theo;
   - ghim chủ đề "Bạn đạt kết thúc nào?";
   - mỗi tập một Release để người theo dõi nhận thông báo.
3. **Mùa 3 (hướng mở):** "Nhà Mới". Bối cảnh là chung cư cao tầng mới xây, bàn giao cho cư dân khi còn lỗi. Lần này tòa nhà chưa có ký ức nào và đang học cách nhớ từ người ở đầu tiên. Mùa này đảo chiều Mùa 1 (nhà cũ) và Mùa 2 (đất cũ).
4. **Bản cho lớp học và đào tạo:**
   - mỗi tập kèm phiếu thảo luận về kỹ năng đọc hồ sơ, kiểm chứng thông tin và trung thực nghề nghiệp;
   - bản nội bộ cho ngành trắc địa và giải phóng mặt bằng.
5. **Bền vững:**
   - giữ nút mời cà phê;
   - cân nhắc in kịch bản Mùa 1 thành sách điện tử;
   - xem Cloudflare Analytics sau 2 tuần để biết người chơi bỏ ở đâu, rồi chỉnh nhịp độ tập sau theo đó.
