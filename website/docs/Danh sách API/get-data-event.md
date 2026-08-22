---
sidebar_label: 'Get data event'
sidebar_position: 9
hide_title: false
title: Get data event
---

### 1. getMultipleUserData()

**Event Code:** `GET_MULTIPLE_USER_DATA` - Lấy nhiều trường dữ liệu người dùng từ host app.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `dataNames` | `array` | *optional* | Danh sách data cần lấy `["age", "userName", "fullName", "phoneNumber", "avatar", "gender", "birthday", "idNo"]` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `age` | `string` | *optional* |  |
| `userName` | `string` | *optional* |  |
| `fullName` | `string` | *optional* |  |
| `phoneNumber` | `string` | *optional* |  |
| `avatar` | `string` | *optional* |  |
| `gender` | `string` | *optional* |  |
| `birthday` | `string` | *optional* |  |
| `idNo` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { getMultipleUserData, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await getMultipleUserData({ data: {
      dataNames: ["age", "userName", "fullName", "phoneNumber", "avatar", "gender", "birthday", "idNo"]
    } })
if (isSuccess(res)) {
  console.log(res.age)
  console.log(res.userName)
  console.log(res.fullName)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.getMultipleUserData({ data: {
      dataNames: ["age", "userName", "fullName", "phoneNumber", "avatar", "gender", "birthday", "idNo"]
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.age)
  console.log(res.userName)
  console.log(res.fullName)
}
```

---



### 2. clearPermissionCache()

**Event Code:** `CLEAR_PERMISSION_CACHE` - Xóa tất cả quyền đã cache ở local.

**Request**

*Không có tham số riêng, nhưng `data` là bắt buộc — truyền object rỗng: `{ data: {} }`*

**Response**

*No response data*

**Ví dụ sử dụng (npm package)**

```typescript
import { clearPermissionCache, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await clearPermissionCache({ data: {} })
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.clearPermissionCache({ data: {} })
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



### 3. getLocalAuthenticationStatus()

**Event Code:** `GET_LOCAL_AUTHENTICATION_STATUS` -  lấy trạng thái xác thực sinh trắc học (vân tay, Face ID).

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `isHardwareSupportStrongBiometric` | `boolean` | *optional* | Phần cứng hỗ trợ sinh trắc mạnh |
| `isHardwareSupportBiometric` | `boolean` | *optional* | Phần cứng hỗ trợ sinh trắc |
| `isDeviceSecure` | `boolean` | *optional* | Thiết bị đã bật bảo mật |
| `canAuthenticateWithDeviceCredential` | `boolean` | *optional* | Có thể xác thực bằng PIN/password |
| `canAuthenticateWithBiometrics` | `boolean` | *optional* | Có thể xác thực bằng sinh trắc |
| `canAuthenticateWithStrongBiometrics` | `boolean` | *optional* | Có thể xác thực bằng sinh trắc mạnh |


**Ví dụ sử dụng (npm package)**

```typescript
import { getLocalAuthenticationStatus, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await getLocalAuthenticationStatus()
if (isSuccess(res)) {
  console.log(res.isHardwareSupportStrongBiometric)
  console.log(res.isHardwareSupportBiometric)
  console.log(res.isDeviceSecure)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.getLocalAuthenticationStatus()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.isHardwareSupportStrongBiometric)
  console.log(res.isHardwareSupportBiometric)
  console.log(res.isDeviceSecure)
}
```

---



### 4. getContacts()

**Event Code:** `GET_CONTACTS` - Lấy danh sách contacts từ danh bạ hệ thống. 

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `filter` | `object` | *optional* |  `{       "contactName": "John"     }` |
| `pager` | `object` | *optional* |  `{       "pageNumber": 1,       "limitRow": 100     }` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `contactList` | `array` | *optional* |  `[       {         "contactName": "John Doe",         "contactNumber": "0901234567",         "contactAvt": "base64_image_string"       }     ]` |
| `countContacts` | `number` | *optional* |  `1` |


**Ví dụ sử dụng (npm package)**

```typescript
import { getContacts, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await getContacts({ data: {
      filter: { "contactName": "John" },
      pager: { "pageNumber": 1, "limitRow": 100 }
    } })
if (isSuccess(res)) {
  console.log(res.data.contactList)
  console.log(res.data.countContacts)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.getContacts({ data: {
      filter: { "contactName": "John" },
      pager: { "pageNumber": 1, "limitRow": 100 }
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.contactList)
  console.log(res.data.countContacts)
}
```

---



### 5. getLocation()

**Event Code:** `GET_LOCATION` - Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `latitude` | `any` | *optional* | Vĩ độ `21.0285` |
| `longgitude` | `any` | *optional* | Kinh độ `105.8542` |


**Ví dụ sử dụng (npm package)**

```typescript
import { getLocation, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.latitude)
  console.log(res.longgitude)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.getLocation()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.latitude)
  console.log(res.longgitude)
}
```

---



### 6. shareTextContent()

**Event Code:** `SHARE_TEXT_CONTENT` - Mở dialog chia sẻ nội dung text.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | `string` | *optional* | Text nội dung `Check out this amazing product!` |


**Response**

*No response data*

**Ví dụ sử dụng (npm package)**

```typescript
import { shareTextContent, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await shareTextContent({ data: {
      content: "Check out this amazing product!"
    } })
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.shareTextContent({ data: {
      content: "Check out this amazing product!"
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



### 7. miniAppToken()

**Event Code:** `MINI_APP_TOKEN` - Get mini app token

**Request**

*No request parameters*

**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `miniAppToken` | `string` | **required** | miniAppToken |


**Ví dụ sử dụng (npm package)**

```typescript
import { miniAppToken, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await miniAppToken()
if (isSuccess(res)) {
  console.log(res.data.miniAppToken)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.miniAppToken()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.miniAppToken)
}
```

---



### 8. expiredSession()

**Event Code:** `EXPIRED_SESSION` - Session expiration event, Delegate cho host app xử lý

**Request**

*No request parameters*

**Response**

*No response data*

**Ví dụ sử dụng (npm package)**

```typescript
import { expiredSession, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await expiredSession()
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.expiredSession()
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



### 9. saveImageToGallery()

**Event Code:** `SAVE_IMAGE_TO_GALLERY` - Lưu ảnh vào bộ sưu tập

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | *optional* | Loại nguồn ảnh. Giá trị: `"url"` hoặc `"base64"` (không phân biệt hoa thường)  `url` |
| `data` | `string` | *optional* | Nội dung ảnh: đường dẫn URL đầy đủ (nếu type=url) hoặc chuỗi Base64 (nếu type=base64) `https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhat--Dem-Sai-G.jpg` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `success` | `boolean` | **required** | Thanh cong |


**Ví dụ sử dụng (npm package)**

```typescript
import { saveImageToGallery, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await saveImageToGallery({ data: {
      type: "url",
      data: "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhat--Dem-Sai-G.jpg"
    } })
if (isSuccess(res)) {
  console.log(res.data.success)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.saveImageToGallery({ data: {
      type: "url",
      data: "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhat--Dem-Sai-G.jpg"
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.success)
}
```

---



### 10. saveFile()

**Event Code:** `SAVE_FILE` - Lưu file vào thư mục

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | *optional* | Đường dẫn URL đầy đủ của File `https://pdfobject.com/pdf/sample.pdf` |
| `fileName` | `string` | *optional* | Tên file, không bắt buộc, nếu không truyền thì sẽ tự động lấy tên file trong url `test_file` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `success` | `boolean` | **required** | Thanh cong |


**Ví dụ sử dụng (npm package)**

```typescript
import { saveFile, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await saveFile({ data: {
      url: "https://pdfobject.com/pdf/sample.pdf",
      fileName: "test_file"
    } })
if (isSuccess(res)) {
  console.log(res.data.success)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.saveFile({ data: {
      url: "https://pdfobject.com/pdf/sample.pdf",
      fileName: "test_file"
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.success)
}
```

---



### 11. initRequest()

**Event Code:** `INIT_REQUEST` - Get init event

**Request**

*No request parameters*

**Response**

*No response data*

**Ví dụ sử dụng (npm package)**

```typescript
import { initRequest, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await initRequest()
if (isSuccess(res)) {
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.initRequest()
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



### 12. setScreenBrightness()

**Event Code:** `SET_SCREEN_BRIGHTNESS` - Đặt độ sáng màn hình (screen-scoped) cho màn hình mini-app đang hiển thị. Tự khôi phục khi rời màn/nền.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `number` | **required** | Độ sáng 0.0–1.0 `0.8` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `success` | `boolean` | **required** | Thành công `true` |


**Ví dụ sử dụng (npm package)**

```typescript
import { setScreenBrightness, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await setScreenBrightness({ data: {
      value: 0.8
    } })
if (isSuccess(res)) {
  console.log(res.data.success)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.setScreenBrightness({ data: {
      value: 0.8
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.success)
}
```

---



### 13. restoreScreenBrightness()

**Event Code:** `RESTORE_SCREEN_BRIGHTNESS` - Khôi phục độ sáng về giá trị đã lưu gần nhất theo session mini-app.

**Request**

*No request parameters*

**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `success` | `boolean` | **required** | Thành công `true` |


**Ví dụ sử dụng (npm package)**

```typescript
import { restoreScreenBrightness, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await restoreScreenBrightness()
if (isSuccess(res)) {
  console.log(res.data.success)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.restoreScreenBrightness()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data.success)
}
```

---



