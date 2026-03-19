---
sidebar_label: 'UserData Permission'
sidebar_position: 4
hide_title: false
title: UserData Permission
---

### requestMultipleUserDataPermission()

**Event Code:** `REQUEST_MULTIPLE_USER_DATA_PERMISSION`

Yêu cầu nhiều quyền user data cùng một lúc.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCodes` | `array` | *optional* | Danh sách mã quyền `["USER_AGE_PERMISSION"]` |
| `useSameReason` | `boolean` | *optional* | useSameReason `true` |


**Response data**

 `[array]`

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* | Mã quyền |
| `result` | `string` | *optional* | Granted - Quyền đã được cấp;  Denied -  Quyền bị từ chối; NotFound -  Permission code không tồn tại |
| `message` | `string` | *optional* | Nội dung  |


---

### checkMultipleUserDataPermission()

**Event Code:** `CHECK_MULTIPLE_USER_DATA_PERMISSION`

Kiểm tra trạng thái nhiều quyền user data cùng lúc.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCodes` | `array` | *optional* | Danh sách mã quyền `["USER_AGE_PERMISSION"]` |


**Response data**

 `[array]`

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* | Mã quyền |
| `result` | `string` | *optional* | Granted - Quyền đã được cấp;  Denied -  Quyền bị từ chối; NotFound -  Permission code không tồn tại |
| `message` | `string` | *optional* | Nội dung  |


---

