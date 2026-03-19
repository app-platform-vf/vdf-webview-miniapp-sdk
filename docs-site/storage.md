---
sidebar_label: 'Storage'
sidebar_position: 7
hide_title: false
title: Storage
---

### saveStringValue()

**Event Code:** `SAVE_STRING_VALUE`

Lưu giá trị kiểu string.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `value` | `string` | **required** | Giá trị lưu |


**Response**

*No response data*

---

### saveBooleanValue()

**Event Code:** `SAVE_BOOLEAN_VALUE`

Lưu giá trị kiểu boolean.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `value` | `boolean` | **required** | Giá trị lưu |


**Response**

*No response data*

---

### saveIntegerValue()

**Event Code:** `SAVE_INTEGER_VALUE`

Lưu giá trị kiểu int.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `value` | `number` | **required** | Giá trị lưu |


**Response**

*No response data*

---

### saveLongValue()

**Event Code:** `SAVE_LONG_VALUE`

Lưu giá trị kiểu long.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `value` | `number` | **required** | Giá trị lưu |


**Response**

*No response data*

---

### saveFloatValue()

**Event Code:** `SAVE_FLOAT_VALUE`

Lưu giá trị kiểu float.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `value` | `any` | **required** | Giá trị lưu |


**Response**

*No response data*

---

### getStringValue()

**Event Code:** `GET_STRING_VALUE`

Lấy giá trị kiểu string.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `string` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | *optional* |  |


---

### getBooleanValue()

**Event Code:** `GET_BOOLEAN_VALUE`

Lấy giá trị kiểu boolean.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `boolean` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `boolean` | *optional* |  |


---

### getIntegerValue()

**Event Code:** `GET_INTEGER_VALUE`

Lấy giá trị kiểu int.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `number` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `number` | *optional* |  |


---

### getLongValue()

**Event Code:** `GET_LONG_VALUE`

Lấy giá trị kiểu long.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `number` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `number` | *optional* |  |


---

### getFloatValue()

**Event Code:** `GET_FLOAT_VALUE`

Lấy giá trị kiểu float.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | **required** | Key lưu |
| `defaultValue` | `any` | **required** | Giá trị mặc định |


**Response**

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `any` | *optional* |  |


---

### clearStorage()

**Event Code:** `CLEAR_STORAGE`

Lấy giá trị kiểu float.

**Request**

*No request parameters*

**Response**

*No response data*

---

