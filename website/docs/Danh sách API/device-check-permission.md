---
sidebar_label: 'Device Check Permission'
sidebar_position: 6
hide_title: false
title: Device Check Permission
---

### 1. checkCameraPermission()

**Event Code:** `CHECK_CAMERA_PERMISSION` - Kiểm tra quyền camera

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkCameraPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkCameraPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkCameraPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 2. checkLocationPermission()

**Event Code:** `CHECK_LOCATION_PERMISSION` - Kiểm tra quyền vị trí

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkLocationPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkLocationPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkLocationPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 3. checkPhotosPermission()

**Event Code:** `CHECK_PHOTOS_PERMISSION` - Kiểm tra quyền truy cập ảnh

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkPhotosPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkPhotosPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkPhotosPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 4. checkVideosPermission()

**Event Code:** `CHECK_VIDEOS_PERMISSION` - Kiểm tra quyền truy cập video

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkVideosPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkVideosPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkVideosPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 5. checkAudioPermission()

**Event Code:** `CHECK_AUDIO_PERMISSION` - Kiểm tra quyền truy cập file audio

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkAudioPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkAudioPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkAudioPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 6. checkRecordAudioPermission()

**Event Code:** `CHECK_RECORD_AUDIO_PERMISSION` - Kiểm tra quyền ghi âm trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkRecordAudioPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkRecordAudioPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkRecordAudioPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 7. checkContactsPermission()

**Event Code:** `CHECK_CONTACTS_PERMISSION` - Kiểm tra quyền truy cập danh bạ

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkContactsPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkContactsPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkContactsPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 8. checkDocumentPermission()

**Event Code:** `CHECK_DOCUMENT_PERMISSION` - Kiểm tra quyền truy cập file tài liệu

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkDocumentPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkDocumentPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkDocumentPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 9. checkPhoneCallPermission()

**Event Code:** `CHECK_PHONE_CALL_PERMISSION` - Kiểm tra quyền gọi điện

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkPhoneCallPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkPhoneCallPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkPhoneCallPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 10. checkPaymentPermission()

**Event Code:** `CHECK_PAYMENT_PERMISSION` - **Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkPaymentPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkPaymentPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkPaymentPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 11. checkLoginPermission()

**Event Code:** `CHECK_LOGIN_PERMISSION` - **Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkLoginPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkLoginPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkLoginPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 12. checkLocalAuthenticationPermission()

**Event Code:** `CHECK_LOCAL_AUTHENTICATION_PERMISSION` - kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { checkLocalAuthenticationPermission, isSuccess } from 'vdf-webview-miniapp-sdk'

const res = await checkLocalAuthenticationPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.checkLocalAuthenticationPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



