---
sidebar_label: 'Device Check Permission'
sidebar_position: 6
hide_title: false
title: Device Check Permission
---

### checkPermissionWithCode()

**Event Code:** `CHECK_PERMISSION_WITH_CODE`

Kiểm tra trạng thái quyền cụ thể.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | **required** | Tham so 1 |


**Response**

*No response data*

---

### checkCameraPermission()

**Event Code:** `CHECK_CAMERA_PERMISSION`

Kiểm tra quyền camera

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkLocationPermission()

**Event Code:** `CHECK_LOCATION_PERMISSION`

Kiểm tra quyền vị trí

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkPhotosPermission()

**Event Code:** `CHECK_PHOTOS_PERMISSION`

Kiểm tra quyền truy cập ảnh

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkVideosPermission()

**Event Code:** `CHECK_VIDEOS_PERMISSION`

Kiểm tra quyền truy cập video

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkAudioPermission()

**Event Code:** `CHECK_AUDIO_PERMISSION`

Kiểm tra quyền truy cập file audio

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkRecordAudioPermission()

**Event Code:** `CHECK_RECORD_AUDIO_PERMISSION`

Kiểm tra quyền ghi âm trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkContactsPermission()

**Event Code:** `CHECK_CONTACTS_PERMISSION`

Kiểm tra quyền truy cập danh bạ

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkDocumentPermission()

**Event Code:** `CHECK_DOCUMENT_PERMISSION`

Kiểm tra quyền truy cập file tài liệu

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkPhoneCallPermission()

**Event Code:** `CHECK_PHONE_CALL_PERMISSION`

Kiểm tra quyền gọi điện

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkPaymentPermission()

**Event Code:** `CHECK_PAYMENT_PERMISSION`

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkLoginPermission()

**Event Code:** `CHECK_LOGIN_PERMISSION`

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### checkLocalAuthenticationPermission()

**Event Code:** `CHECK_LOCAL_AUTHENTICATION_PERMISSION`

kiểm tra quyền xác thực sinh trắc học (vân tay, Face ID).

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

