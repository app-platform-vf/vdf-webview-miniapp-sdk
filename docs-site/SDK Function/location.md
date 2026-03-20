---
sidebar_label: 'Location'
sidebar_position: 8
hide_title: false
title: Location
---

### 1. getLocation()

**Event Code:** `GET_LOCATION` - Lấy vị trí GPS hiện tại của thiết bị. Phải có quyền LOCATION_PERMISSION trước khi sử dụng API này.

**Request**

*No request parameters*

**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `latitude` | `any` | *optional* |  |
| `longgitude` | `any` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getLocation, isSuccess } from '@webview-sdk/core'

const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.latitude)
  console.log(res.longgitude)
}
```

---



