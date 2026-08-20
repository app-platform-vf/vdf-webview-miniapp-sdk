---
sidebar_label: 'Giao thức chung'
sidebar_position: 2
hide_title: false
title: Giao thức chung
---

## Giao thức chung (Base Protocol)

Tất cả request và response đều kế thừa các trường chung bên dưới. Phần **Request** và **Response** của mỗi event chỉ hiển thị trường `data` riêng.

**MiniAppRequestBase — Tất cả Request đều có**

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | `string` | **required** | Tên event (VD: GET_LOCATION) |
| `sender` | `string` | **required** | Nguồn gửi, mặc định "MINIAPP_WEBVIEW" |
| `request_id` | `string` | **required** | ID duy nhất của request, dùng để map response |
| `data` | `object` | *optional* | Dữ liệu riêng của từng event (xem chi tiết bên dưới) |

**MiniAppResponseBase — Tất cả Response đều có**

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | `string` | **required** | Tên event tương ứng với request |
| `sender` | `string` | **required** | Nguồn gửi, mặc định "MINIAPP_SDK" |
| `response_id` | `string` | **required** | ID của response |
| `request_id` | `string` | **required** | ID của request tương ứng |
| `eventStatus` | `EventStatus` | **required** | Trạng thái xử lý (errorCode, errorMessageVN, errorMessageEN, realMsg) |
| `errorData` | `string` | *optional* | Dữ liệu lỗi chi tiết (nếu có) |
| `message` | `string` | *optional* | Thông báo bổ sung |
| `data` | `object` | *optional* | Dữ liệu trả về riêng của từng event (xem chi tiết bên dưới) |

**EventStatus**

| Field | Type | Description |
|---|---|---|
| `errorCode` | `string` | "SDK000" = thành công. Dùng `isSuccess(res)` để kiểm tra |
| `errorMessageVN` | `string` | Thông báo lỗi tiếng Việt |
| `errorMessageEN` | `string` | Thông báo lỗi tiếng Anh |
| `realMsg` | `string` | Thông báo gốc từ native |
