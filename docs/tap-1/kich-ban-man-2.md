# Kiểm Đếm Ca Đêm · Mùa 2 · Tập 1: Bãi Bồi
## Màn 2: Nước ròng (01:10 – 03:30) · bản v2.0.0

> Toàn văn kịch bản cả tập: `kich-ban-tap-1-xuat.md` (`node tools/export.js tap-1/story-act1.js tap-1/story-act2.js tap-1/story-act3.js`). Dữ liệu: `tap-1/story-act2.js`.

---

## Bước A: Đúc rút từ Màn 1

**Bài học: không cho người chơi vào màn mới khi đang sát vạch thua.**

Hết Màn 1, Mực nước có thể lên tới 9/10. Nếu Màn 2 tiếp tục cộng nước ngay, người đã mắc vài lỗi ở Màn 1 sẽ chết ở nút đầu của Màn 2 mà không kịp hiểu vì sao.

**Cách áp dụng:**
- Mở màn bằng nước ròng sâu nhất trong đêm: Mực nước −3, và lời kể nói thẳng ra (“mực nước dưới chân bạn rút xuống ba vạch”).
- Nút 2 (bữa cơm) không cộng nước, vì đó là nút đạo đức, không phải nút thời gian. Chỉ Nút 3 (nước đứng chân) cộng nước theo giờ.
- Lựa chọn tử tế (ngồi cùng bà Tư chào ngôi nhà) chỉ tốn 1 vạch nước, để lòng tốt không bị phạt nặng như sai lầm.
- **Sửa một lỗi engine có từ Mùa 1:** bấm “Sang Màn 2” trước đây bỏ qua hiệu ứng của cảnh mở màn, nên khoản −3 không bao giờ được trừ. Đã sửa ở `engine/core.js` (dùng `proceedTo`) và ở `tools/check.js`.

## Bước B: Tích hợp ý tưởng và nối manh mối

| Ý tưởng (kế hoạch Mùa 2) | Trong Màn 2 |
|---|---|
| Mini-game đo bằng sào | Nút 1 → mặt cắt lòng sông, 5 cây sào. Đọc vạch ướt (độ sâu thật) để tìm bờ dốc giữa S3 và S4. Vạch khô sơn tím 3,1 m là bẫy (luật R6) |
| Twist: ngôi nhà chỉ hiện lúc nước ròng, chưa được đền | Người chơi bước vào ngôi nhà: mâm cơm còn bốc khói, khung cửa có vạch đo chiều cao anh Sáu, sổ đo của ông Tư trên tủ thờ |
| Người giữ sổ | Vạch khô sơn tím trên sào, chữ tự viết trên cửa: “Còn thiếu 62,4 m². Đo cho đủ rồi hẵng về.” Trang sổ ông Tư bị xé, mép dính mực tím |
| Câu hỏi mùa: ai đang ký thay người đã đi? | Ông Tư đo 248,6 m² lúc 01:00 đêm 2007 rồi mất. Biên bản 311,0 m² sáng hôm sau là ai đó ký thay ông |

**Nối với Màn 1:**
- Bảng con nước Màn 1 có 03:00 là “nước đứng chân”: Nút 3 Màn 2 diễn ra đúng giờ đó, và luật R1 lại quyết định.
- Cờ `ghi_so_ngay` (ký 214,0 ở Màn 1) làm ngôi nhà tắt đèn khi người chơi chèo tới.
- Cờ `mac_ao_phao` quyết định lội nước có an toàn không (hai phiên bản của lựa chọn C ở Nút 1).
- “Ông nhà tui dạy: nước đứng thì đất giả bộ to” (Màn 1) giờ có người dạy: ông Tư, với cây sào và cuốn sổ.
- Vết mực tím trên ngón tay (`tin_muc_tim`, `theo_muc_tim`) ấm lên khi chạm mép trang sổ bị xé.
- Mã hồ sơ: `m1_kha_viet_phieu` cho Thục Anh nhận ra nét chữ ông Tư giống nét chữ ông Kha.

**Rà danh sách cấm:** không có gọi tên đầy đủ, điểm danh, quan tài, nấm, kẻ giả mạo đồng minh. Ông Tư không phải kẻ thù giả làm bạn: ông thật lòng mời cơm, cái chết đến từ việc ở lại, không phải từ một cái bẫy của ông. Không có đồ đạc tự về chỗ cũ (Mùa 1).

## Bước C: Viết và dựng

- 28 cảnh (gồm mini-game và 1 kết thúc thất bại mới), 3 luật mới (R6–R8), 10 manh mối mới (1 hiếm).
- 3D: không gian mới **trong ngôi nhà giữa sông** (bộ ván, mâm cơm có hơi bốc lên, tấm màn bếp có ánh lửa khi ông Tư lên tiếng, khung cửa có vạch chiều cao, tủ thờ, chữ mực tím trên cửa, nước tràn vào nền). Ở bến: đò cập sát ngôi nhà, 5 cây sào cắm trên sông, tia laser xuyên qua ngôi nhà, nhà chìm dần khi về bờ. Trên đò: ngôi nhà hiện ra phía trước.

### Sơ đồ nhánh

```
t1_m2_mo (01:15, MN −3, R7 nghe từ bà Tư)
→ NÚT 1 · Cây sào (R6, ⏱25 giây → laser: −TT, MN+1)
   A bắn laser (−TT, MN+1) → sào
   B nhờ bà Tư chèo tới từng điểm (+TC) → sào
   C lội nước: có áo phao (−TT nhẹ) / không áo phao (−TT nặng, MN+1)
→ ĐO BẰNG SÀO (⏱50 giây)
   tới S3, 248,6 m² → đúng (cờ do_sao_dung)
   tới S5, 311,0 m² → cờ tin_311, +DN        (hấp dẫn: bà Tư được nhiều nhất)
   vạch khô → sai R6 (−TT, MN+1), sửa lại 248,6
   tới S1, 140,2 m² → anh Sáu cãi (−TC, MN+1), sửa lại 248,6
→ t1_m2_sau (khung cửa) ─┬ A rủ anh Sáu cùng đo (+TC, cờ sau_do_cung)
                         └ B giục anh (+TT, −TC)
→ NÚT 2 · Bữa cơm (⏱20 giây → bà Tư ngồi xuống: −TT, +DN, MN+1)
   A ngồi ăn một chén → 💀 Bữa cơm             (tử tế nhất: chiều lòng người đã khuất)
   B cảm ơn rồi về (R7)
   C để anh Sáu trả lời ba (cần sau_do_cung hoặc Tin cậy ≥ 70; cờ sau_tra_loi, manh mối hiếm)
→ t1_m2_so (sổ ông Tư, R8, cờ co_so_ong_tu)
→ NÚT 3 · Nước đứng chân (03:00, MN+1, ⏱20 giây → nước tràn: −TT, MN+2)
   A đo nốt cho đủ 311,0 (+DN 15, MN+3, cờ do_them_muc_tim)
   B cầm sổ, đưa mọi người lên đò (−DN)
   C ngồi cùng bà Tư chào ngôi nhà (+TC, MN+1, cờ ba_tu_tu_biet)
→ t1_m2_ve → HẾT MÀN 2 · Kết Màn 2: Vạch ướt
```

---

## Bảng tổng hợp cuối Màn 2

### Trạng thái & Chỉ số

| Mục | Giá trị |
|---|---|
| Cảnh | 28 |
| Luật mới | R6 (2 nguồn), R7 (3 nguồn), R8 (1 nguồn, đúng nhưng ít nơi ghi) |
| Manh mối mới | 10 (1 hiếm) |
| Kết thúc mới | Kết Màn 2: Vạch ướt · Bữa cơm (thất bại) |
| Kết thúc Đếm sóng (Tỉnh táo cạn) | Tới được từ Màn 2 trở đi, khi người chơi mắc nhiều lỗi làm mất Tỉnh táo |
| Đường trung thực | Mực nước vào Màn 2 là 2, ra Màn 2 là 3 |

### Sợi dây liên kết (sang Màn 3)

| Cờ | Dùng ở Màn 3 |
|---|---|
| `do_sao_dung` / `tin_311` | Lời của anh Quý khi đặt hai con số cạnh nhau |
| `co_so_ong_tu` | Cuốn sổ là chứng cứ ở bàn đối chiếu |
| `sau_tra_loi`, `sau_do_cung` | Anh Sáu ở lại giúp má dọn nhà (kết cuối) |
| `do_them_muc_tim` | Điểm trung thực của tập bị trừ |
| `ba_tu_tu_biet` | Bà Tư đã chào ngôi nhà |

### Bài học thiết kế

1. **Một nút đạo đức không nên kèm đồng hồ dài.** Nút 2 chỉ 20 giây và không cộng nước. Sức ép đến từ giọng nói sau tấm màn, không từ thanh thời gian.
2. **Lời dặn có một nguồn vẫn có thể đúng.** R8 chỉ ghi trên bìa sổ ông Tư (độ tin cậy thấp trong sổ tay), nhưng lại là lời dặn quan trọng nhất cho Màn 3. Người chơi học rằng ít nguồn không có nghĩa là sai, chỉ là cần cân nhắc.
3. **Công cụ kiểm tra phải lớn theo truyện.** Ba màn làm số trạng thái bùng nổ (tràn bộ nhớ). `check.js` giờ chỉ tách trạng thái theo các cờ thật sự tạo nhánh (tự dò trong điều kiện lựa chọn và cách chọn kết màn), còn khoảng 3 triệu trạng thái, chạy dưới 20 giây.
