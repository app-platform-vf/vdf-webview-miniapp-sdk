---
sidebar_label: 'UserData Permission'
sidebar_position: 4
hide_title: false
title: UserData Permission
---

### 1. requestMultipleUserDataPermission()

**Event Code:** `REQUEST_MULTIPLE_USER_DATA_PERMISSION` - Yêu cầu nhiều quyền user data cùng một lúc.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCodes` | `array` | *optional* | Danh sách mã quyền `["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]` |
| `useSameReason` | `boolean` | *optional* | Các quyền dùng chung 1 mã lý do `true` |


**Response data**

 `[array]`

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* | Mã quyền `USER_AGE_PERMISSION` |
| `result` | `string` | *optional* | Granted - Quyền đã được cấp;  Denied -  Quyền bị từ chối; NotFound -  Permission code không tồn tại `Denied` |
| `message` | `string` | *optional* | Nội dung  `USER_AGE_PERMISSION is denied` |


**Ví dụ sử dụng**

```typescript
import { requestMultipleUserDataPermission, isSuccess } from '@webview-sdk/core'

const res = await requestMultipleUserDataPermission({ data: {
      permissionCodes: ["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"],
      useSameReason: true
    } })
if (isSuccess(res)) {
  // res.data la mang: permissionCode, result, message...
  res.data.forEach(item => console.log(item))
}
```

---



### 2. checkMultipleUserDataPermission()

**Event Code:** `CHECK_MULTIPLE_USER_DATA_PERMISSION` - Kiểm tra trạng thái nhiều quyền user data cùng lúc.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCodes` | `array` | *optional* | Danh sách mã quyền `["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]` |


**Response data**

 `[array]`

| Field | Type | Required | Description |
|---|---|---|---|
| `permissionCode` | `string` | *optional* | Mã quyền `USER_AGE_PERMISSION` |
| `result` | `string` | *optional* | Granted - Quyền đã được cấp;  Denied -  Quyền bị từ chối; NotFound -  Permission code không tồn tại `Denied` |
| `message` | `string` | *optional* | Nội dung  `USER_AGE_PERMISSION is denied` |


**Ví dụ sử dụng**

```typescript
import { checkMultipleUserDataPermission, isSuccess } from '@webview-sdk/core'

const res = await checkMultipleUserDataPermission({ data: {
      permissionCodes: ["USER_AGE_PERMISSION","USER_NAME_PERMISSION","USER_FULL_NAME_PERMISSION","USER_PHONE_NUMBER_PERMISSION","USER_AVATAR_PERMISSION"]
    } })
if (isSuccess(res)) {
  // res.data la mang: permissionCode, result, message...
  res.data.forEach(item => console.log(item))
}
```

---



