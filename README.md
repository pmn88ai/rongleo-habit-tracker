# 🌿 Quan Sát — Ứng dụng theo dõi thói quen xấu

> *Nhẹ nhàng. Trung thực. Không phán xét.*

---

## Giới thiệu

**Quan Sát** là web app giúp bạn theo dõi các thói quen xấu (hút thuốc, uống cà phê, v.v.) một cách trung thực và không áp lực. Không streak, không gamification, không câu nhử — chỉ có dữ liệu thật và lời nhắc nhẹ nhàng mỗi ngày.

Ứng dụng chạy hoàn toàn **offline-first**: mọi dữ liệu lưu trên thiết bị của bạn, không cần tài khoản, không cần server.

---

## Tính năng

### 🏠 Tổng quan (Dashboard)
- Hiển thị tất cả thói quen đang theo dõi
- Số lần thực hiện **hôm nay** so với **hôm qua** (↑ tăng / ↓ giảm / = giữ nguyên)
- Nút **+1** ghi log nhanh trong một nhấn
- Nút **+ Khác** để nhập số lượng tuỳ chỉnh kèm **ghi chú** (vd: "sau bữa sáng", "do stress")
- **Mini chart 7 ngày** hiển thị xu hướng theo tuần
- **Lời động viên** xuất hiện mỗi ngày, chọn ngẫu nhiên phù hợp với xu hướng

### 📋 Nhật ký (Log List)
- Danh sách tất cả lần ghi trong ngày, sắp xếp theo giờ
- Hiển thị số lượng, đơn vị, tên thói quen và ghi chú
- Lọc nhanh theo thói quen
- Xoá từng log nếu nhập nhầm

### ✨ Lời động viên
- **104 câu** chia 3 nhóm tương ứng với xu hướng ngày:
  - 🟢 **Cải thiện** (35 câu) — khi hôm nay ít hơn hôm qua
  - 🔵 **Giữ nguyên** (34 câu) — khi bằng hôm qua
  - 🔴 **Tăng thêm** (35 câu) — khi hôm nay nhiều hơn hôm qua
- **CRUD đầy đủ**: thêm, sửa, xoá từng câu
- Nhóm hiển thị theo loại để dễ quản lý

### ⚙️ Cài đặt
- **Thêm / xoá thói quen** — tên và đơn vị tuỳ chỉnh (điếu, ly, lần...)
- **Xuất dữ liệu** ra file `.json` để backup hoặc chuyển thiết bị
- **Nhập dữ liệu** từ file `.json` với hai chế độ:
  - 🔁 **Ghi đè** — xoá toàn bộ và thay bằng dữ liệu mới
  - ➕ **Gộp** — giữ dữ liệu cũ, thêm dữ liệu mới (không trùng ID)
- Kéo & thả file trực tiếp vào vùng import
- Xem trước số lượng habits / logs / messages trước khi xác nhận

---

## Cấu trúc dữ liệu

Dữ liệu lưu trong `localStorage` với 3 key:

```
habits          → danh sách thói quen
logs            → lịch sử ghi log
enc_messages    → câu động viên
```

### Format file backup `.json`

```json
{
  "version": 1,
  "exported_at": "2026-03-27T10:00:00Z",
  "data": {
    "habits": [
      { "id": "h1", "name": "Hút thuốc", "unit": "điếu", "created_at": "..." }
    ],
    "logs": [
      { "id": "l1", "habit_id": "h1", "quantity": 2, "note": "cà phê sáng", "created_at": "..." }
    ],
    "messages": [
      { "id": "i01", "type": "improve", "content": "Ít hơn hôm qua một chút..." }
    ]
  }
}
```

---

## Logic động viên

```
hôm_nay < hôm_qua  →  type = "improve"  →  random 1 câu trong 35 câu xanh lá
hôm_nay = hôm_qua  →  type = "same"     →  random 1 câu trong 34 câu xanh dương
hôm_nay > hôm_qua  →  type = "worse"    →  random 1 câu trong 35 câu đỏ
```

Lời động viên chỉ hiển thị khi đã có ít nhất 1 log trong ngày.

---

## Thiết kế & UX

| Nguyên tắc | Chi tiết |
|---|---|
| Không phán xét | Không dùng ngôn từ ép buộc hay tiêu cực |
| Không streak | Không tạo áp lực liên tiếp ngày |
| Trung thực | Hiển thị dữ liệu thật, không tô hồng |
| Mobile-first | Nút lớn, tap-friendly, bottom nav |
| Offline-first | Không cần mạng, không cần tài khoản |

**Responsive layout:**
- 📱 Mobile: bottom navigation bar, giao diện tập trung vào log nhanh
- 🖥️ Desktop: sidebar cố định bên trái, content area rộng hơn

---

## Công nghệ

| Thành phần | Chi tiết |
|---|---|
| Framework | React (JSX) |
| Styling | Tailwind CSS |
| State | React `useState` + `useCallback` |
| Lưu trữ | `localStorage` (offline, không cần backend) |
| Build target | Single `.jsx` file — có thể deploy trực tiếp với Vite hoặc Next.js |

---

## Hướng dẫn sử dụng nhanh

1. Mở app → tab **Tổng quan**
2. Nhấn **+** để tạo thói quen (vd: "Hút thuốc", đơn vị "điếu")
3. Mỗi lần thực hiện thói quen → nhấn **+1**
4. Cuối ngày xem tổng, so với hôm qua, và đọc lời nhắc
5. Vào **Cài đặt → Xuất dữ liệu** để backup định kỳ

---

## Roadmap (Phase sau)

- [ ] Auth + sync đa thiết bị (Supabase)
- [ ] Chart 30 ngày
- [ ] Dark mode
- [ ] Nhắc nhở (reminder notification)
- [ ] Social / chia sẻ tiến trình

---

## Giấy phép

MIT — tự do sử dụng, chỉnh sửa, phân phối.
