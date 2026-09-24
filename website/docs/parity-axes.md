---
sidebar_label: 'Trục parity'
sidebar_position: 3
hide_title: false
title: Trục parity
---

Trang này liệt kê các **trục parity** của hợp đồng: những danh mục giá trị mà **hai SDK native phải mang y hệt nhau**.

:::warning Đây KHÔNG phải event
Trang mini-app **không gọi được** và **không nghe được** các trục dưới đây. Chúng đi từ SDK native lên **app chủ**. Tài liệu ghi ra ở đây vì hợp đồng là nơi hai nền tảng đối chiếu với nhau, không chỉ là nơi trang tra cứu.
:::

## MiniAppVisibility

Trạng thái hiển thị của bề mặt mini-app, đi từ SDK native lên APP CHỦ. Năm giá trị, cùng tên cùng nghĩa trên Android và iOS. ⚠️ KHÔNG phải event: trang mini-app không gọi được và không nghe được trục này — nó không có mặt trong `events.json.events`, không sinh ra hàm API nào, và không có kênh nào chuyển nó xuống trang. Khai ở đây để hợp đồng nói ra được rằng trục này tồn tại và để máy đối chiếu hai danh mục native.

| | |
|---|---|
| Chiều | `sdk-to-host` |
| Trang mini-app gọi được | **không** |
| Số giá trị | 5 |

### Giá trị

| Giá trị | Nghĩa |
|---|---|
| `FIRST_VISIBLE` | Bề mặt mini-app hiện ra LẦN ĐẦU. Đúng một lần cho mỗi bề mặt, kể cả khi app chủ gắn bộ lắng nghe muộn. |
| `VISIBLE_AGAIN` | Hiện lại sau khi đã bị che hoặc đã xuống nền. KHÔNG BAO GIỜ dùng thay cho lần đầu. |
| `COVERED` | Bị một bề mặt khác trong cùng ứng dụng che đi. |
| `BACKGROUNDED` | Cả ứng dụng xuống nền. |
| `CLOSED` | Bề mặt mini-app đóng hẳn. Chỉ tới được qua nhịp đẩy — nhịp hỏi không bao giờ trả giá trị này. |

### Đọc kỹ trước khi dựa vào

- Hai giá trị VISIBLE_* mang NGHĨA YẾU: 'không thấy bằng chứng bị che', không phải 'chắc chắn không bị che'. Overlay của app chủ và cửa sổ của hệ điều hành không nền tảng nào báo được.
- Android: app chủ add() một Fragment đè lên mà không hide() cái cũ thì KHÔNG tín hiệu nào phát. Đây là giới hạn đã đăng ký của nền tảng, không phải việc còn nợ.
- Đối xứng về GIÁ TRỊ và HÀNH VI, không đối xứng về hình dạng lời gọi: tên hàm và cách gắn bộ lắng nghe theo thói quen của từng nền tảng.

### Tên cũ bị đánh dấu phế thải

Phế thải là **cảnh báo lúc biên dịch**, không phải gỡ — hành vi không đổi, không tên nào biến mất.

| Tên | Loại | Nền tảng | Dùng gì thay |
|---|---|---|---|
| `currentState()` | function | android, ios | `currentVisibility()` |
| `observeLifecycle(...)` | function | android, ios | **không có đường thay** — KHÔNG trỏ trống sang observeVisibility. Hai tín hiệu 'đang khởi tạo' và 'lỗi kèm thông điệp' không có chỗ trên trục năm giá trị, nên cần chúng thì tiếp tục gọi hàm này — nó chạy y nguyên, không có kế hoạch gỡ. |
| `MiniAppDisplayState` | type | android | `MiniAppVisibility` |
| `MiniAppDisplayState` | type | ios | `MiniAppVisibility` |
| `MiniAppLifecycle` | type | android | **không có đường thay** — Initialization và Error(msg) không có đường thay. |
| `VDOMiniAppLifecycleType` | type | ios | **không có đường thay** — initialization và inError không có đường thay. |

### Tên trông giống nhưng KHÔNG phế thải

| Tên | Nền tảng | Vì sao giữ |
|---|---|---|
| `HostAppEventType` | android | Đi SDK → TRANG MINI-APP, không đi tới app chủ. MiniAppVisibility không thay thế nó; đánh dấu phế thải ở đây là trỏ người đọc sang một API làm việc khác. |
| `VDOHostAppEventType` | ios | Như trên. Chỉ có 3 case và không tên nào trùng bản Android — đó là một lệch riêng, không thuộc trục này. |

> Sáu danh mục cũ Ở LẠI, KHÔNG gỡ tên nào — bản Android đang công khai nên gỡ là phá tương thích. Sau đợt này có BẢY danh mục cùng mô tả một khái niệm; cái giá đó đã được nhận tường minh.
>
> Phế thải ở đây là CẢNH BÁO LÚC BIÊN DỊCH, không phải gỡ. Hành vi không đổi.
>

:::info Trạng thái phép đo
Hợp đồng khai danh sách này, nhưng **chưa có cổng máy nào đối chiếu nó với hai enum native**. Trạng thái đúng là **chưa đo**, không phải "không lệch".
:::

