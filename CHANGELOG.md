# Nhật ký phiên bản

## v2.0.0 · 25/11/2026 · Tập 1 · Bãi Bồi trọn bộ
**Màn 2 · Nước ròng** (01:10 – 03:30)
- Chèo ra ngôi nhà giữa sông lúc nước ròng sâu nhất (Mực nước −3).
- Mini-game đo bằng sào: mặt cắt lòng sông, 5 cây sào, đọc vạch ướt để tìm mép bờ năm 2007.
- Bên trong ngôi nhà: khung cửa có vạch đo chiều cao anh Sáu, mâm cơm còn bốc khói và một lời mời sau tấm màn bếp, sổ đo của ông Tư.
- Lời dặn mới R6, R7, R8. Kết thúc mới: Kết Màn 2: Vạch ướt, Bữa cơm.

**Màn 3 · Bàn giao** (03:30 – 06:00)
- Mini-game đối chiếu ba tờ giấy: biên bản mực tím, sổ ông Tư, bảng con nước năm 2007.
- Bà Tư kể đêm 2007. Đèn bờ bên kia lần cuối. Nút chữ ký không có đồng hồ.
- Hai kết cuối: Bàn giao một nơi chốn, Người giữ sổ. Trang “Cồn Lở” trong sổ đo mở lúc bình minh.

**3D:** không gian mới trong ngôi nhà giữa sông; đò cập ngôi nhà, cây sào, tia laser, nhà chìm, con nước lớn, xuồng ma về bờ bên kia, bình minh; cây bút mực tím ở chòi trạm.

**Sửa lỗi và công cụ**
- Bấm “Sang màn” giờ tính đúng hiệu ứng chỉ số của cảnh mở màn (lỗi có từ engine Mùa 1).
- `check.js` chỉ tách trạng thái theo cờ tạo nhánh, chạy được cả tập (khoảng 3 triệu trạng thái) mà không tràn bộ nhớ.
- Màn cuối của một tập ghi “Tập tiếp theo đang được viết”.
- Kết thúc Giữa dòng đổi lời kể theo màn (dùng lại ở Màn 3).

## v2.0.0-alpha.1 · 24/11/2026
**Engine dùng chung cho cả mùa** (tách từ Mùa 1 bản 1.1.0)
- Một trang cho cả mùa: menu chọn tập, `?tap=N` mở thẳng một tập. Tập chưa làm ghi “Sắp ra mắt” kèm nút Đăng ký nhận tin.
- Chỉ số cấu hình theo tập (`STORY.stats`): ba chỉ số chung Tỉnh táo, Tin cậy, Độ neo, cộng một chỉ số riêng. HUD và bảng tổng kết dựng tự động.
- Mã hồ sơ Mùa 1: nhập mã 6 ký tự để mang lựa chọn ở nhà B4 sang Mùa 2.
- Sổ đo của Thục Anh trong sổ tay: bốn trang dán kín, mỗi tập mở một trang.
- Bộ dựng 3D tách thành kit dùng chung; mỗi tập tự đăng ký không gian và nhân vật.
- Âm thanh mới: nước vỗ bờ, mái chèo, kẻng trường, đất lở. Khóa lưu trình duyệt mới `kd2_…`.
- `check.js` đọc chỉ số từ truyện, thêm `--profile`, `--story`, báo chuỗi chưa NFC.
- Giữ nguyên các tính năng của Mùa 1 bản 1.1: chế độ đọc truyện, phím tắt, chia sẻ kết thúc, thẻ minh họa kết thúc, nhạc theo không khí, góp ý qua GitHub, mời cà phê.

**Tập 1 · Bãi Bồi · Màn 1: Con nước**
- 40 cảnh, 5 lời dặn, 14 manh mối, 6 kết thúc. Chỉ số riêng: Mực nước.
- Mini-game đọc bảng con nước và giao hội từ ba cây gạo.
- Bốn không gian 3D: bến đò Cồn Lở, giữa sông, điểm trường, chòi trạm. Mặt sông dâng theo Mực nước.
