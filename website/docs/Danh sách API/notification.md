---
sidebar_label: 'Notification'
sidebar_position: 8
hide_title: false
title: Notification
---

### 1. subscribeTopic()

**Event Code:** `SUBSCRIBE_TOPIC` - Đăng ký nhận thông báo theo topic do APP CHỦ sở hữu. SDK native gác quyền thông báo NOTIFICATION_PERMISSION theo thứ tự: đã đăng ký ở App Center (chưa: SDK801) -> sender đúng (khác: SDK001) -> app chủ hỗ trợ push (không: SDK001 + ServiceNotApplicable) -> người dùng đồng ý ở sheet (từ chối: SDK802) -> hộp thoại quyền thông báo của OS (từ chối: SDK802 + Denied/PermanentlyDenied), rồi chuyển NGUYÊN VĂN phong bì cho app chủ; kết quả do APP CHỦ trả về, cùng request_id. ⚠️ `sender` PHẢI là MINIAPP_WEBVIEW — web SDK điền sẵn; mini-app ghi đè `sender` (qua invoke/sendRaw hoặc tự dựng phong bì) thì SDK trả SDK001 'Invalid sender for SUBSCRIBE_TOPIC' và app chủ KHÔNG được gọi. `data` là JSON tự do: thoả thuận giữa app chủ và mini-app, SDK không định nghĩa, không đọc, không ghi log. App chủ không nhận event: SDK100. Mỗi mini-app đúng một topic.

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | `object` | *optional* | Kết quả do app chủ trả — schema do app chủ và mini-app thoả thuận |


**Ví dụ sử dụng (npm package)**

```typescript
import { subscribeTopic, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await subscribeTopic()
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.subscribeTopic()
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



### 2. unsubscribeTopic()

**Event Code:** `UNSUBSCRIBE_TOPIC` - Huỷ đăng ký nhận thông báo theo topic do APP CHỦ sở hữu. Không hiện popup. SDK native kiểm: đã đăng ký quyền thông báo ở App Center (chưa: SDK801) -> sender đúng (khác: SDK001), rồi chuyển NGUYÊN VĂN phong bì cho app chủ; kết quả do APP CHỦ trả về, cùng request_id. ⚠️ `sender` PHẢI là MINIAPP_WEBVIEW — web SDK điền sẵn; ghi đè thì SDK trả SDK001 'Invalid sender for UNSUBSCRIBE_TOPIC'. `data` là JSON tự do: thoả thuận giữa app chủ và mini-app. App chủ không nhận event: SDK100.

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | `object` | *optional* | Kết quả do app chủ trả — schema do app chủ và mini-app thoả thuận |


**Ví dụ sử dụng (npm package)**

```typescript
import { unsubscribeTopic, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await unsubscribeTopic()
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.unsubscribeTopic()
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



