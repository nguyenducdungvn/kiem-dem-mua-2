# Kiểm Đếm Ca Đêm · Mùa 2 · Tập 1: Bãi Bồi
## Màn 1: Con nước (bản dựng v2.0.0-alpha.1)

> Toàn văn kịch bản xuất tự động nằm ở `kich-ban-man-1-xuat.md` (`node tools/export.js tap-1/story-act1.js`). File này ghi quy trình Bước A/B/C và bảng tổng hợp cuối màn.

---

## Bước A: Đúc rút từ màn trước (Mùa 1 · Màn 4 · Chốt sổ)

**Bài học: luật cứu mạng ở nút đầu phải được nghe tận tai, không chỉ đọc trong sổ.**

Ở Màn 4 Mùa 1, nút chết đầu tiên (“Mốc trôi”) dựa vào điều người chơi đã đọc từ ba màn trước. Người chơi liền mạch thì ổn. Nhưng Tập 1 là cửa vào của cả Mùa 2: nhiều người chưa chơi Mùa 1, sổ tay trống trơn. Nếu họ chết ở nút đầu vì một luật họ chưa kịp để ý, họ sẽ bỏ game.

**Cách áp dụng trong Màn 1:**
- Nút 1 nằm ở cảnh thứ 3 (sau “Chuyến đò cuối” và “Mười bốn cọc tre”), đúng nguyên tắc tối đa 2 cảnh.
- Luật R1 “Đừng đo khi nước đứng” xuất hiện ba lần trước khi người chơi phải chọn: bà Tư nói bằng lời trên đò, khắc trên cọc số 3, sơn trên mái nhà số 9. Sổ tay ghi 3 nguồn, độ tin cậy cao.
- Phương án chết (A, đo ngay) vẫn là phương án hấp dẫn nhất: mặt nước phẳng, số khớp hồ sơ, mọi người được về sớm. Nhưng có lối thứ ba để tự kiểm chứng (bảng con nước), và trên bảng có nét phấn của bà Tư.
- Chỉ số riêng Mực nước được chỉnh để thua chỉ khi mắc khoảng 5 lỗi (3 lần hết giờ cộng 2 lựa chọn sai). Cái chết vì Tỉnh táo bị đẩy sang Màn 2 (check.js xác nhận Màn 1 không chạm tới), tránh lỗi “chết vì cạn chỉ số” mà Màn 3 Mùa 1 gặp.

## Bước B: Tích hợp ý tưởng và nối manh mối

**Ý tưởng của tác giả (từ kế hoạch Mùa 2) đã đưa vào:**

| Ý tưởng | Trong Màn 1 |
|---|---|
| Đất đi theo con nước, cọc mốc trôi | Diện tích trên tablet nhảy theo từng phút (214,0 · 207,3 · 219,8…). 3 trong 14 cọc mất hoặc nghiêng. Số chỉ đứng yên khi nước đứng (và đó là cái bẫy) hoặc khi đo đúng lúc nước ròng |
| Luật khắc trên cọc tre và mái tôn | R1–R4 khắc trên cọc, mái tôn, khung cửa lớp học. R1 và R2 giữ nguyên câu chữ trong kế hoạch |
| Chỉ số riêng: Mực nước | `MN`, 10 vạch, tăng theo giờ và theo mỗi lần chần chừ hay đo sai. Mực nước trên sông 3D dâng theo chỉ số |
| Mini-game đọc bảng con nước | Nút 1 · bảng con nước trạm Cồn Lở, có đồ thị, nét phấn của bà Tư và dòng mực tím của Người giữ sổ |
| Mini-game giao hội từ 3 cây gạo | Nút 3 · ba tia mực xanh (biên bản 2007), một tia mực tím viết đè, điểm GPS, cây cọc trôi |
| Mini-game đo bằng sào | Để dành cho Màn 2 (đo ngôi nhà giữa sông) |
| Bốn nhân vật | Bà Tư (đò, áo phao), anh Sáu (con bà, căn hộ 42 m²), cô Lành (điểm trường, bảng đen), anh Quý (cán bộ địa chính xã mới, biên bản 2007) |
| Twist: ngôi nhà chỉ hiện lúc nước ròng | Gieo ở 4 chỗ (lời anh Sáu, bảng đen, đèn giữa sông, góc bếp bà Tư), hiện ra ở cảnh 01:00. Màn 2 mới đo nó |
| Người giữ sổ | Chữ ký mực tím trên biên bản sạt lở 2007, trên bảng con nước (luật R5 không rõ nguồn), trên góc ngắm của gạo Miếu. Anh Quý cho biết chữ ký có ở hồ sơ một cái chợ, một nhà máy dệt và trụ sở xã cũ (ba tập sau) |
| Sổ đo xuyên mùa | Sổ tay có mục “Sổ đo của Thục Anh”: bìa mở, bốn trang dán kín ghi bằng nét chữ ông Kha: Cồn Lở · Chợ Sớm · Ca Ba · Con Dấu. Trang Cồn Lở mở ở cuối Tập 1 (cờ `mo_trang_1`) |
| Mã hồ sơ Mùa 1 | 5 biến thể câu thoại theo cờ `m1_ghi_su_that`, `m1_cong_khai`, `m1_tho_ra`; người đã ghi sự thật ở B4 được bà Tư tin ngay (mở phương án C ở Nút 3) |

**Nối với Mùa 1:**
- “Hồ sơ thành sự thật” chuyển thành “con số khớp hồ sơ không có nghĩa là đúng”: kết thúc *Nước đứng* là lúc tablet báo 214,0 khớp hồ sơ.
- “Trung thực làm giảm Độ neo”: ký con số đo lúc nước ròng (ít hơn hồ sơ, bà Tư bị thiệt) thì Độ neo −10; ký 214,0 cho không ai thiệt thì Độ neo +10.
- Luật tin theo số nguồn, và một luật không rõ nguồn là bẫy (như L7 Mùa 1): R5 mực tím. Ai làm theo R5 thì Độ neo tăng và mang theo vết mực tím trên ngón tay sang Màn 2.
- Cuốn sổ đo từ đêm ở nhà B4, nét chữ ông Kha, “cô áo xanh trên điện thoại”.

**Rà danh sách cấm:** không gọi tên đầy đủ, không điểm danh hay sĩ số thừa, không quan tài, không nấm, không siêu luật đếm số điều, không kẻ giả mạo đồng minh, không kéo dài thời hạn tập thể, không bốc mộ. Không lặp twist Mùa 1: ngôi nhà giữa sông là nhà thật bị lở và chưa được đền (không phải căn hộ có trên bản vẽ mà không xây), không có livestream làm hồ sơ, không có đồ đạc tự về chỗ cũ.

## Bước C: Viết và dựng

- Dữ liệu: `tap-1/story-act1.js` (40 cảnh, 5 luật, 14 manh mối, 6 kết thúc).
- 3D: `tap-1/scene.js`, 4 không gian: bến đò (bãi đất, 14 cọc tre, nhà sàn mái tôn, điểm trường, ba cây gạo, sông có gợn sóng và dòng chảy, đèn bờ bên kia, xuồng có đèn bão, ngôi nhà nổi lên lúc nước ròng, đèn làng dưới nước), trên đò giữa sông, lớp học điểm trường (bảng đen vẽ phấn, 14 bộ bàn ghế), chòi trạm (biên bản 2007 có chữ ký mực tím). Nhân vật: bà Tư (nón lá, lưng còng), anh Sáu, cô Lành (đèn), anh Quý (mũ, đèn bão).
- Âm thanh mới: nước vỗ bờ (nền), mái chèo, kẻng trường, đất lở, té nước.
- `check.js`: 9.575 trạng thái, 0 lỗi. Có thêm chế độ `--profile` (giả lập Mã hồ sơ) và `--story` (chế độ đọc truyện).
- Chụp màn hình 1366 px và 390 px: menu mùa, menu tập, bảng con nước, giao hội, lớp học, đèn bờ bên kia, biên bản, nước ròng, kết màn, kết thúc *Giữa dòng*, Mã hồ sơ, sổ tay.

### Sơ đồ nhánh

```
t1_mo (21:40, trên đò) ─┬ A mặc áo phao (+TT, cờ mac_ao_phao)
                        └ B nhường áo cho bà Tư (+TC, cờ nhuong_ao_phao)
→ t1_bai (21:55, R1 ×3 nguồn, MN+1)
→ NÚT 1 (22:00, ⏱25 giây → chần chừ: −TT, MN+1 → bảng)
   A đo ngay lúc nước đứng → 💀 Nước đứng          (hấp dẫn nhất: số khớp hồ sơ)
   B bảng con nước (⏱45 giây, nhận R5 mực tím)
      22:00 → 💀 Nước đứng · 00:00 → đo sớm (−TT, MN+1) · 01:00 → đúng (+TC) · 03:00 → theo mực tím (+DN, MN+1)
   C dùng số 14:00, mời ký (cờ dung_so_ngay, +DN, −TC, MN+1) → bà Tư không ký → bảng
→ t1_sau (anh Sáu) ─┬ A hỏi thửa dưới sông (+TC, cờ hoi_thua_song)
                    └ B khuyên ký cho xong (+TT, −TC)
→ t1_truong (R4, R2) ─┬ A giữ bảng đen (+TC, manh mối bản đồ phấn)
                      └ B xóa bảng (+DN, −TT, −TC, MN+1)
→ NÚT 2 (23:10, MN+1, ⏱20 giây → kéo dây xuồng: −TT, MN+2)
   A chèo ra cứu → 💀 Giữa dòng                    (tử tế nhất: người ta đang vẫy)
   B chỉ dòng chữ trên mái tôn (−TT, +TC)
   C gọi anh Sáu (chỉ khi đã hỏi thửa dưới sông hoặc Tin cậy ≥ 65; +TC, cờ ba_tu_ke, manh mối hiếm)
→ t1_bien_ban (23:40, Người giữ sổ, ba hồ sơ khác)
→ NÚT 3 (00:20, MN+1, R3, ⏱25 giây → anh Quý cắm theo GPS)
   A cắm theo GPS (cờ moc_gps, +DN, MN+1)
   B giao hội (⏱40 giây): A đúng · B GPS · C mực tím (cờ theo_muc_tim, DN+20) · D cọc trôi (−TT, MN+2)
   C hỏi bà Tư (cần ba_tu_ke, m1_ghi_su_that hoặc Tin cậy ≥ 65; +TC, cờ moc_ba_tu) → giao hội
→ t1_ro (01:00, ngôi nhà hiện lúc nước ròng) ─┬ A ký số đo lúc nước ròng (DN −10, cờ ghi_so_ro)
                                               └ B ký 214,0 như hồ sơ (DN +10, cờ ghi_so_ngay)
→ HẾT MÀN 1 · Kết Màn 1: Nhà hiện lúc nước ròng
Thất bại theo chỉ số: MN ≥ 10 → 💀 Nước lên · DN ≥ 60 → 💀 Làng dưới sông · TT ≤ 0 → 💀 Đếm sóng (Màn 2)
```

### Diện tích thửa 112

| Cách đo | Diện tích | Ghi chú |
|---|---|---|
| Hồ sơ lúc 14:00 | 214,0 m² | Số khớp khi nước đứng (bẫy) |
| Ba tia mực xanh (đúng) | 196,4 m² | Ít hơn 17,6 m²: phần bờ lở trong một buổi chiều |
| Cọc 7 theo GPS | 201,9 m² | Cọc cứ nghiêng về phía sông |
| Tia mực tím | 233,8 m² | Phần thêm nằm dưới nước, có “bậc thềm” |
| Nhà bà Tư lở năm 2007 | 311,0 m² | Biên bản do Người giữ sổ ký, chưa đền |

---

## Bảng tổng hợp cuối Màn 1

### Trạng thái & Chỉ số

| Mục | Giá trị |
|---|---|
| Cảnh | 40 (34 cảnh truyện gồm 2 mini-game, 1 hết màn, 5 kết thúc thất bại) |
| Nút có đồng hồ | 3 nút chính + 2 mini-game |
| Luật | 5 (R1–R4 có nguồn, R5 không rõ nguồn) |
| Manh mối | 14 (1 hiếm) |
| Kết thúc | 6: 1 kết màn, 2 chết vì lựa chọn, 3 chết vì chỉ số (Đếm sóng dành cho Màn 2) |
| Trạng thái `check.js` duyệt | 9.575, 0 lỗi (12.375 khi có Mã hồ sơ) |
| Chỉ số khi tới kết màn | Tỉnh táo 25–85 · Tin cậy 40–100 · Độ neo 0–50 · Mực nước 5–9 |
| Đường trung thực trọn vẹn | Tỉnh táo 85 · Tin cậy 95 · Độ neo 0 · Mực nước 5 |

### Sợi dây liên kết (mang sang Màn 2)

| Cờ / manh mối | Dùng ở Màn 2 |
|---|---|
| `ghi_so_ro` / `ghi_so_ngay` | Ngôi nhà giữa sông phản ứng với con số bạn đã ký (đèn sáng hay tắt) |
| `tin_muc_tim`, `theo_muc_tim` | Vết mực tím trên ngón tay: Người giữ sổ nhận ra bạn |
| `moc_ba_tu` (mốc 7-cũ) | Điểm đầu tiên để đo ngôi nhà bằng sào |
| `ba_tu_ke`, `hoi_thua_song` | Bà Tư kể đêm 2007; mở lối đo nhà không cần xuống nước |
| `moc_gps` | Cọc nghiêng dần về phía sông, Mực nước tăng nhanh hơn |
| `mac_ao_phao` / `nhuong_ao_phao` | Ai mặc áo phao khi phải lội ra ngôi nhà |
| `xoa_bang` / `giu_bang` | Bản đồ phấn còn hay mất: có hay không có mốc góc nhà |
| Biên bản 311,0 m² | Mục tiêu đo của Màn 2 |
| Cờ `m1_*` từ Mã hồ sơ | Bà Tư tin ngay người từng “ghi số thật” ở B4 |

### Bài học thiết kế

1. **Luật cứu mạng phải được nói bằng lời ở tập mở đầu.** Người mới chưa quen đọc sổ tay. Ba nguồn cho R1 trước Nút 1 là đủ để cái chết “Nước đứng” thấy công bằng.
2. **Một con số đứng yên đáng sợ hơn một con số nhảy loạn.** Cơ chế “đất đi theo con nước” mạnh nhất khi tablet thôi nhảy và báo “Khớp hồ sơ”. Màn sau nên giữ cách dùng này: sự yên lặng là tín hiệu nguy hiểm.
3. **Mini-game nên có một đáp án “tử tế” sai.** 03:00 (bãi rộng nhất) và điểm C (thêm 40 m²) đều làm bà Tư được nhiều đất hơn, nhưng là của Người giữ sổ. Người chơi phải chọn giữa tử tế và đúng, không chỉ giữa nhanh và đúng.
4. **Chỉ số riêng cần hiện trong thế giới 3D.** Mực nước dâng lên trên sông theo MN giúp người chơi hiểu chỉ số mà không cần đọc hướng dẫn. Tập 2 (Sổ nợ) nên có biểu hiện tương tự trong cảnh.
5. **Màn 2 cần một nhịp thở ở đầu.** Mực nước khi hết Màn 1 có thể lên tới 9/10. Mở Màn 2 bằng lúc nước ròng sâu nhất (MN −2) để người chơi không vào màn mới khi đã sát vạch thua.
