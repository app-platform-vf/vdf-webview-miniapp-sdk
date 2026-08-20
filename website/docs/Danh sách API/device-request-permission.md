---
sidebar_label: 'Device Request Permission'
sidebar_position: 5
hide_title: false
title: Device Request Permission
---

### 1. requestCameraPermission()

**Event Code:** `REQUEST_CAMERA_PERMISSION` - Yêu cầu mở camera

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
import { requestCameraPermission, isSuccess } from '@webview-sdk/core'

const res = await requestCameraPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestCameraPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 2. requestLocationPermission()

**Event Code:** `REQUEST_LOCATION_PERMISSION` - Yêu cầu vị trí

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
import { requestLocationPermission, isSuccess } from '@webview-sdk/core'

const res = await requestLocationPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestLocationPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 3. requestPhotosPermission()

**Event Code:** `REQUEST_PHOTOS_PERMISSION` - Yêu cầu truy cập ảnh trên thiết bị

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
import { requestPhotosPermission, isSuccess } from '@webview-sdk/core'

const res = await requestPhotosPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestPhotosPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 4. requestVideosPermission()

**Event Code:** `REQUEST_VIDEOS_PERMISSION` - Yêu cầu truy cập video trên thiết bị

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
import { requestVideosPermission, isSuccess } from '@webview-sdk/core'

const res = await requestVideosPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestVideosPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 5. requestAudioPermission()

**Event Code:** `REQUEST_AUDIO_PERMISSION` - Yêu cầu truy cập audio trên thiết bị

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
import { requestAudioPermission, isSuccess } from '@webview-sdk/core'

const res = await requestAudioPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestAudioPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 6. requestRecordAudioPermission()

**Event Code:** `REQUEST_RECORD_AUDIO_PERMISSION` - Yêu cầu ghi âm trên thiết bị

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
import { requestRecordAudioPermission, isSuccess } from '@webview-sdk/core'

const res = await requestRecordAudioPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestRecordAudioPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 7. requestContactsPermission()

**Event Code:** `REQUEST_CONTACTS_PERMISSION` - Yêu cầu truy cập danh bạ trên thiết bị

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
import { requestContactsPermission, isSuccess } from '@webview-sdk/core'

const res = await requestContactsPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestContactsPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 8. requestDocumentPermission()

**Event Code:** `REQUEST_DOCUMENT_PERMISSION` - Yêu cầu truy cập tài liệu trên thiết bị

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
import { requestDocumentPermission, isSuccess } from '@webview-sdk/core'

const res = await requestDocumentPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestDocumentPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 9. requestPhoneCallPermission()

**Event Code:** `REQUEST_PHONE_CALL_PERMISSION` - Yêu cầu thực hiện cuộc gọi trên thiết bị

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
import { requestPhoneCallPermission, isSuccess } from '@webview-sdk/core'

const res = await requestPhoneCallPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestPhoneCallPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 10. requestPaymentPermission()

**Event Code:** `REQUEST_PAYMENT_PERMISSION` - **Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { requestPaymentPermission, isSuccess } from '@webview-sdk/core'

const res = await requestPaymentPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestPaymentPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 11. requestLoginPermission()

**Event Code:** `REQUEST_LOGIN_PERMISSION` - **Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { requestLoginPermission, isSuccess } from '@webview-sdk/core'

const res = await requestLoginPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestLoginPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 12. requestLocalAuthenticationPermission()

**Event Code:** `REQUEST_LOCAL_AUTHENTICATION_PERMISSION` - Yêu cầu xác thực sinh trắc học (vân tay, Face ID).

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
import { requestLocalAuthenticationPermission, isSuccess } from '@webview-sdk/core'

const res = await requestLocalAuthenticationPermission()
if (isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.requestLocalAuthenticationPermission()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.permissionCode)
  console.log(res.result)
  console.log(res.message)
}
```

---



### 13. executeLocalAuthentication()

**Event Code:** `EXECUTE_LOCAL_AUTHENTICATION` - Thực hiện xác thực sinh trắc học (vân tay, Face ID).

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `authOptionsParam` | `object` | *optional* |  `{       "sensitiveTransaction": true,       "authClassification": ["WEAK", "STRONG", "DEVICE"],       "sticky": false,       "isShowErrorDialog": true     }` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `result` | `string` | *optional* |  |
| `description` | `string` | *optional* |  |


**Ví dụ sử dụng (npm package)**

```typescript
import { executeLocalAuthentication, isSuccess } from '@webview-sdk/core'

const res = await executeLocalAuthentication({ data: {
      authOptionsParam: { "sensitiveTransaction": true, "authClassification": ["WEAK", "STRONG", "DEVICE"], "sticky": false, "isShowErrorDialog": true }
    } })
if (isSuccess(res)) {
  console.log(res.result)
  console.log(res.description)
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.executeLocalAuthentication({ data: {
      authOptionsParam: { "sensitiveTransaction": true, "authClassification": ["WEAK", "STRONG", "DEVICE"], "sticky": false, "isShowErrorDialog": true }
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log(res.result)
  console.log(res.description)
}
```

---



