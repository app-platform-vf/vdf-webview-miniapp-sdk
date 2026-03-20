---
sidebar_label: 'Storage'
sidebar_position: 7
hide_title: false
title: Storage
---

### 1. saveStringValue()

**Event Code:** `SAVE_STRING_VALUE` - Lưu giá trị kiểu string.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `user_preference` |
| `value` | `string` | **required** | Giá trị lưu `dark_mode` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { saveStringValue, isSuccess } from '@webview-sdk/core'

const res = await saveStringValue({ data: {
      key: "user_preference",
      value: "dark_mode"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 2. saveBooleanValue()

**Event Code:** `SAVE_BOOLEAN_VALUE` - Lưu giá trị kiểu boolean.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `notifications_enabled` |
| `value` | `boolean` | **required** | Giá trị lưu `true` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { saveBooleanValue, isSuccess } from '@webview-sdk/core'

const res = await saveBooleanValue({ data: {
      key: "notifications_enabled",
      value: true
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 3. saveIntegerValue()

**Event Code:** `SAVE_INTEGER_VALUE` - Lưu giá trị kiểu int.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `login_count` |
| `value` | `number` | **required** | Giá trị lưu `5` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { saveIntegerValue, isSuccess } from '@webview-sdk/core'

const res = await saveIntegerValue({ data: {
      key: "login_count",
      value: 5
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 4. saveLongValue()

**Event Code:** `SAVE_LONG_VALUE` - Lưu giá trị kiểu long.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `last_sync_timestamp` |
| `value` | `number` | **required** | Giá trị lưu `1234567890` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { saveLongValue, isSuccess } from '@webview-sdk/core'

const res = await saveLongValue({ data: {
      key: "last_sync_timestamp",
      value: 1234567890
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 5. saveFloatValue()

**Event Code:** `SAVE_FLOAT_VALUE` - Lưu giá trị kiểu float.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `rating` |
| `value` | `any` | **required** | Giá trị lưu `4.5` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { saveFloatValue, isSuccess } from '@webview-sdk/core'

const res = await saveFloatValue({ data: {
      key: "rating",
      value: 4.5
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 6. getStringValue()

**Event Code:** `GET_STRING_VALUE` - Lấy giá trị kiểu string.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `user_preference` |
| `defaultValue` | `string` | **required** | Giá trị mặc định `light_mode` |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getStringValue, isSuccess } from '@webview-sdk/core'

const res = await getStringValue({ data: {
      key: "user_preference",
      defaultValue: "light_mode"
    } })
if (isSuccess(res)) {
  console.log(res.value)
}
```

---



### 7. getBooleanValue()

**Event Code:** `GET_BOOLEAN_VALUE` - Lấy giá trị kiểu boolean.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu `notifications_enabled` |
| `defaultValue` | `boolean` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `boolean` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getBooleanValue, isSuccess } from '@webview-sdk/core'

const res = await getBooleanValue({ data: {
      key: "notifications_enabled",
      defaultValue: false
    } })
if (isSuccess(res)) {
  console.log(res.value)
}
```

---



### 8. getIntegerValue()

**Event Code:** `GET_INTEGER_VALUE` - Lấy giá trị kiểu int.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `number` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `number` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getIntegerValue, isSuccess } from '@webview-sdk/core'

const res = await getIntegerValue({ data: {
      key: '...',
      defaultValue: 0
    } })
if (isSuccess(res)) {
  console.log(res.value)
}
```

---



### 9. getLongValue()

**Event Code:** `GET_LONG_VALUE` - Lấy giá trị kiểu long.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `number` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `number` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getLongValue, isSuccess } from '@webview-sdk/core'

const res = await getLongValue({ data: {
      key: '...',
      defaultValue: 0
    } })
if (isSuccess(res)) {
  console.log(res.value)
}
```

---



### 10. getFloatValue()

**Event Code:** `GET_FLOAT_VALUE` - Lấy giá trị kiểu float.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `any` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `any` | *optional* |  |


**Ví dụ sử dụng**

```typescript
import { getFloatValue, isSuccess } from '@webview-sdk/core'

const res = await getFloatValue({ data: {
      key: '...',
      defaultValue: '...'
    } })
if (isSuccess(res)) {
  console.log(res.value)
}
```

---



### 11. clearStorage()

**Event Code:** `CLEAR_STORAGE` - Lấy giá trị kiểu float.

**Request**

*No request parameters*

**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { clearStorage, isSuccess } from '@webview-sdk/core'

const res = await clearStorage()
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



