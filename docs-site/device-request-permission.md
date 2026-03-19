---
sidebar_label: 'Device Request Permission'
sidebar_position: 5
hide_title: false
title: Device Request Permission
---

### requestPermissionWithCode()

**Event Code:** `REQUEST_PERMISSION_WITH_CODE`

Yêu cầu quyền cụ thể theo permission code (cả SDK-level và device-level).

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | **required** | mã quyền `USER_AGE_PERMISSION` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestCameraPermission()

**Event Code:** `REQUEST_CAMERA_PERMISSION`

Yêu cầu mở camera

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestLocationPermission()

**Event Code:** `REQUEST_LOCATION_PERMISSION`

Yêu cầu vị trí

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestPhotosPermission()

**Event Code:** `REQUEST_PHOTOS_PERMISSION`

Yêu cầu truy cập ảnh trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestVideosPermission()

**Event Code:** `REQUEST_VIDEOS_PERMISSION`

Yêu cầu truy cập video trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestAudioPermission()

**Event Code:** `REQUEST_AUDIO_PERMISSION`

Yêu cầu truy cập audio trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestRecordAudioPermission()

**Event Code:** `REQUEST_RECORD_AUDIO_PERMISSION`

Yêu cầu ghi âm trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestContactsPermission()

**Event Code:** `REQUEST_CONTACTS_PERMISSION`

Yêu cầu truy cập danh bạ trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestDocumentPermission()

**Event Code:** `REQUEST_DOCUMENT_PERMISSION`

Yêu cầu truy cập tài liệu trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestPhoneCallPermission()

**Event Code:** `REQUEST_PHONE_CALL_PERMISSION`

Yêu cầu thực hiện cuộc gọi trên thiết bị

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestPaymentPermission()

**Event Code:** `REQUEST_PAYMENT_PERMISSION`

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestLoginPermission()

**Event Code:** `REQUEST_LOGIN_PERMISSION`

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### requestLocalAuthenticationPermission()

**Event Code:** `REQUEST_LOCAL_AUTHENTICATION_PERMISSION`

Yêu cầu xác thực sinh trắc học (vân tay, Face ID).

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* |  |
| `result` | `string` | *optional* |  |
| `message` | `string` | *optional* |  |


---

### executeLocalAuthentication()

**Event Code:** `EXECUTE_LOCAL_AUTHENTICATION`

Thực hiện xác thực sinh trắc học (vân tay, Face ID).

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `authOptionsParam` | `object` | *optional* |  `{       "sensitiveTransaction": true,       "authClassification": ["WEAK", "STRONG", "DEVICE"],       "sticky": false,       "isShowErrorDialog": true     }` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `result` | `string` | *optional* |  |
| `description` | `string` | *optional* |  |


---

