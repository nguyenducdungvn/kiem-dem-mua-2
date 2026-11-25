# Kiểm Đếm Ca Đêm · Mùa 2 · Tập 1: Bãi Bồi
## Màn 3: Bàn giao (03:30 – 06:00) · màn cuối · bản v2.0.0

> Dữ liệu: `tap-1/story-act3.js`. Toàn văn: `kich-ban-tap-1-xuat.md`.

---

## Bước A: Đúc rút từ Màn 2

**Bài học: quyết định cuối cùng không đặt đồng hồ.**

Màn 2 có ba nút liên tiếp kèm đồng hồ trong không gian chật (trong nhà). Nhịp đó hợp với nước đang tràn, nhưng nếu giữ cho tới cuối tập thì quyết định quan trọng nhất (ký con số nào) sẽ thành phản xạ chứ không thành lựa chọn.

**Cách áp dụng:**
- Nút 1 và Nút 2 của Màn 3 vẫn có đồng hồ (anh Quý sắp lưu số cũ, bà Tư sắp tháo dây đò).
- **Nút 3 · Chữ ký không có đồng hồ.** Người chơi đọc lại toàn bộ chứng cứ mình có (lời kể thay đổi theo cờ `chung_cu`, `giu_311`) rồi mới ký.
- Giữa Nút 1 và Nút 2 có một khoảnh khắc nhân vật dài: bà Tư tự kể đêm 2007, không ai phải hỏi.

## Bước B: Tích hợp ý tưởng và nối manh mối

**Lời giải của Tập 1:** hồ sơ nhà bà Tư treo hai mươi năm không phải vì ai bỏ quên, mà vì **chính bà từ chối ký** con số 311,0. Ông Tư đã dạy bà: “nước đứng thì đất giả bộ to”. Bà chờ một người đo đúng.

| Ý tưởng | Trong Màn 3 |
|---|---|
| Bà Tư đòi đo lại thửa đất đã lở | Đổi chiều: bà không đòi nhiều hơn, bà đòi đúng. Phương án “giữ 311,0 cho bà được nhiều” hóa ra đi ngược ý bà |
| Mini-game (thêm) đối chiếu hồ sơ | Ba tờ giấy cho cùng một đêm: biên bản mực tím, sổ ông Tư, bảng con nước 2007. Chứng cứ đúng duy nhất: giờ đo 03:00 rơi vào lúc nước đứng chân. Ba đáp án còn lại đều “có vẻ đáng ngờ” nhưng không chứng minh con số sai |
| Đèn bờ bên kia | Từ 2007, tối nào bà Tư cũng chèo qua thắp đèn để ông thấy đường về. Đêm cuối: nút chết quen thuộc (chèo ra giữa dòng, luật R2) và hai lối tiễn biệt (đèn pin ba nhịp, hoặc cô Lành giơ đèn như năm 2007) |
| Người giữ sổ / ai ký thay người đã đi | Cây bút mực tím không ai mang tới. Ký bằng nó thì chữ ký thành “Người giữ sổ”. Để trống thì phần mềm tự điền và tự ký thay. Chỉ ký bằng bút của mình, ghi rõ họ tên, mới không ai ký thay ai |
| Sổ đo xuyên mùa | Trang “Cồn Lở” mở lúc bình minh (cờ `mo_trang_1`). Nét chữ ông Kha: “Người giữ sổ không phải tên của một người. Ai ký thay người đã đi, người đó đang giữ sổ. Đừng để cô ấy ký thay ai.” (gợi cho Tập 4, không lộ danh tính) |

**Dùng lại kết thúc:** chèo ra giữa dòng ở Nút 2 dẫn về kết thúc *Giữa dòng* của Màn 1. Lời kể của kết thúc này giờ đổi theo màn (đò bà Tư thay xuồng điểm trường, giờ ghi trong sổ đổi theo lúc chết), để tập giữ 10 kết thúc theo kế hoạch.

## Bước C: Viết và dựng

- 25 cảnh, 4 manh mối mới (1 hiếm), 2 kết cuối.
- 3D: chòi trạm có cây bút mực tím phát sáng (lăn về phía người chơi khi chọn giữ 311, tắt ngòi và nứt khi người chơi ký bằng bút của mình), sổ ông Tư và bảng con nước trên bàn, cửa sổ hửng sáng dần. Ở bến: con nước lớn dâng lên, xuồng ma đứng đợi giữa dòng rồi chèo về bờ bên kia khi đèn sáng lại, **bình minh** (trời hồng, mặt trời lên, trăng tắt) hoặc **bình minh xám** với ngôi nhà vẫn đứng giữa ban ngày.

### Sơ đồ nhánh

```
t1_m3_mo (03:35, MN+1, cây bút mực tím)
→ NÚT 1 · Hai con số (⏱25 giây → anh Quý lưu số cũ: cờ giu_311, +DN)
   A đối chiếu ba tờ giấy (⏱45 giây)
      giờ đo 03:00 = nước đứng chân → cờ chung_cu (+TC)
      không họ tên / con dấu / số lớn hơn → chưa chứng minh được (−TT, MN+1)
   B giữ 311,0 cho bà được nhiều (cờ giu_311, +DN 15)   (hấp dẫn, nhưng ngược ý bà Tư)
   C gác hồ sơ 2007 (−TC)
→ t1_m3_ba_tu (bà Tư kể đêm 2007) ─┬ A hứa làm đèn cho ông (cờ hua_thap_den)
                                    └ B chỉ cho bà con số 248,6 của ông (cờ cho_ba_xem, +TC)
→ NÚT 2 · Đèn bờ bên kia lần cuối (⏱20 giây → kéo đò về: −TT, MN+1)
   A chèo cùng bà ra giữa dòng → 💀 Giữa dòng
   B giữ bà lại chờ sáng (cờ giu_ba)
   C đèn pin ba nhịp (cần hua_thap_den) / cô Lành giơ đèn (cần giu_bang, ba_tu_ke hoặc Tin cậy ≥ 75) → cờ tien_ong, −DN
→ NÚT 3 · Chữ ký (không đồng hồ)
   A ký 248,6 bằng bút của mình (cờ ky_that, DN −15) → bà Tư ký nếu có chung_cu, cho_ba_xem hoặc Tin cậy ≥ 70
   B ký 311,0 bằng bút mực tím (cờ ky_muc_tim, DN +20)
   C để trống (cờ bo_trong, DN +10) → phần mềm tự điền, Người giữ sổ ký thay
→ t1_m3_sang (bình minh, mở trang Cồn Lở)
→ HẾT TẬP 1
   ky_that                → Kết cuối: Bàn giao một nơi chốn
   ky_muc_tim / bo_trong  → Kết cuối: Người giữ sổ
```

---

## Bảng tổng hợp cuối Tập 1

### Trạng thái & Chỉ số

| Mục | Giá trị |
|---|---|
| Cảnh cả tập | 93 (Màn 1: 40 · Màn 2: 28 · Màn 3: 25) |
| Luật | 8 (R1–R8; R5 là bẫy không rõ nguồn) |
| Manh mối | 28 (3 hiếm) |
| Mini-game | 4: bảng con nước, giao hội ba cây gạo, đo bằng sào, đối chiếu ba tờ giấy |
| Kết thúc | 10: 4 kết màn (Màn 1, Màn 2, 2 kết cuối) và 6 thất bại (Nước đứng, Giữa dòng, Bữa cơm, Nước lên, Làng dưới sông, Đếm sóng). Tất cả đều tới được |
| `check.js` | 2.927.587 trạng thái, 0 lỗi · có Mã hồ sơ: 3.123.289, 0 lỗi · chế độ đọc truyện: 2.095.383, 0 lỗi, chỉ còn 3 kết thúc vì lựa chọn |
| Đường trung thực trọn vẹn (chơi thử tự động) | Tỉnh táo 95 · Tin cậy 100 · Độ neo 0 · Mực nước 4/10 · điểm trung thực 6/6 |
| Điểm trung thực Tập 1 (0–6) | ký số nước ròng ở Màn 1 · cọc 7 đúng · đọc vạch ướt và không đo thêm theo mực tím · tìm ra chứng cứ · ký bằng tên mình · giữ bảng đen |

### Diện tích

| Hồ sơ | Con số | Ai ghi |
|---|---|---|
| Thửa 112, chiều 14:00 | 214,0 m² | đội đo, lúc nước đứng |
| Thửa 112, nước ròng 01:00 | 196,4 m² | Thục Anh (đúng) |
| Phần nhà bà Tư lở năm 2007 | 248,6 m² | ông Tư, 01:00 rạng 24/10/2007 (đúng) |
| Biên bản sạt lở 2007 | 311,0 m² | Người giữ sổ, 03:00, nước đứng chân |

### Sợi dây liên kết (sang Tập 2 · Chợ Sớm và cả mùa)

| Sợi dây | Dùng về sau |
|---|---|
| Trang “Cồn Lở” đã mở, lời ông Kha “đừng để cô ấy ký thay ai” | Mỗi tập sau có một chỗ người chơi bị mời ký thay; Tập 4 trả lời Người giữ sổ là ai |
| Cây bút mực tím | Xuất hiện lại ở chợ (sổ nợ có một dòng mực tím, đã nhắc ở teaser) |
| Kết cuối nào (`t1_ket_ban_giao` / `t1_ket_muc_tim`) | Lưu chung khóa `kd2_endings`; Tập 2 có thể đọc để đổi câu thoại (chung tên miền nên không cần mã) |
| Anh Quý (xã Hòa Bồi) | Có thể xuất hiện lại ở Tập 4 (trụ sở xã cũ), vì anh đã mang hồ sơ của “một cái chợ, một nhà máy dệt” |

### Bài học thiết kế

1. **Phương án tử tế nhất có thể sai vì không hỏi người được giúp.** “Giữ 311,0 cho bà Tư được nhiều” là lòng tốt áp đặt. Twist cuối (bà tự từ chối con số sai suốt hai mươi năm) làm người chơi nhìn lại mọi lựa chọn “cho bà nhiều hơn” trong cả tập.
2. **Bỏ trống cũng là một lựa chọn có hậu quả.** Lựa chọn C ở Nút 3 nghe như né tránh hợp lệ, nhưng hệ thống tự ký thay. Đây là câu trả lời của Tập 1 cho câu hỏi mùa, nên giữ hình mẫu này cho các tập sau.
3. **Dùng lại một kết thúc tốt hơn thêm kết thúc mới.** *Giữa dòng* xuất hiện ở Màn 1 và Màn 3 cùng một luật, nên giữ được 10 kết thúc theo kế hoạch, và người chơi cũ thấy vòng lặp có chủ đích.
4. **Tập 2 nên mở bằng một cảnh ngắn ở Trung tâm**, nơi Thục Anh nhận hồ sơ chợ và thấy một dòng mực tím, để nối hai tập mà không cần người chơi nhớ Tập 1.
