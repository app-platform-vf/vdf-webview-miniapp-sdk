---
sidebar_label: 'Get data event'
sidebar_position: 10
hide_title: false
title: Get data event
---

### 1. getMultipleUserData()

**Event Code:** `GET_MULTIPLE_USER_DATA` - Lấy nhiều trường dữ liệu người dùng từ host app.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `dataNames` | `array` | *optional* | Danh sách data cần lấy `["age", "userName", "fullName", "phone", "email", "avatar"]` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `age` | `string` | *optional* |  |
| `userName` | `string` | *optional* |  |
| `fullName` | `string` | *optional* |  |
| `email` | `string` | *optional* |  |
| `phone` | `string` | *optional* |  |
| `avatar` | `string` | *optional* |  |
| `gender` | `string` | *optional* |  |
| `address` | `string` | *optional* |  |
| `userId` | `string` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getMultipleUserData, isSuccess } from '@webview-sdk/core'

const res = await getMultipleUserData({ data: {
      dataNames: ["age", "userName", "fullName", "phone", "email", "avatar"]
    } })
if (isSuccess(res)) {
  console.log(res.age)
  console.log(res.userName)
  console.log(res.fullName)
}
```

---



### 2. clearPermissionCache()

**Event Code:** `CLEAR_PERMISSION_CACHE` - Xóa tất cả quyền đã cache ở local.

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `eventStatus` | `object` | *optional* |  |
| `errorCode` | `string` | *optional* |  `SDK000` |


**Ví dụ sử dụng**

```typescript
import { clearPermissionCache, isSuccess } from '@webview-sdk/core'

const res = await clearPermissionCache()
if (isSuccess(res)) {
  console.log(res.eventStatus)
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


**Ví dụ sử dụng**

```typescript
import { getLocalAuthenticationStatus, isSuccess } from '@webview-sdk/core'

const res = await getLocalAuthenticationStatus()
if (isSuccess(res)) {
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


**Ví dụ sử dụng**

```typescript
import { getContacts, isSuccess } from '@webview-sdk/core'

const res = await getContacts({ data: {
      filter: { "contactName": "John" },
      pager: { "pageNumber": 1, "limitRow": 100 }
    } })
if (isSuccess(res)) {
  console.log(res.data.contactList)
  console.log(res.data.countContacts)
}
```

---



### 5. pickFile()

**Event Code:** `PICK_FILE` - Mở trình chọn file từ thư viện hoặc camera. Phải có quyền tương ứng trước khi sử dụng:

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `mimeType` | `array` | *optional* | Mảng các MIME types cho phép `["image/*", "video/*"]` |
| `isCapture` | `boolean` | *optional* | true = Mở camera, false = Chọn từ thư viện `true` |
| `source` | `string` | *optional* | IOS only: PhotoLibrary hoặc Folder `PhotoLibrary` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `hostUrl` | `string` | *optional* |  `https://cdn.example.com/file.jpg` |


**Ví dụ sử dụng**

```typescript
import { pickFile, isSuccess } from '@webview-sdk/core'

const res = await pickFile({ data: {
      mimeType: ["image/*", "video/*"],
      isCapture: true,
      source: "PhotoLibrary"
    } })
if (isSuccess(res)) {
  console.log(res.data.hostUrl)
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

**Ví dụ sử dụng**

```typescript
import { shareTextContent, isSuccess } from '@webview-sdk/core'

const res = await shareTextContent({ data: {
      content: "Check out this amazing product!"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



