---
sidebar_label: 'UI'
sidebar_position: 9
hide_title: false
title: UI
---

### 1. setBackgroundStatusBarColor()

**Event Code:** `SET_BACKGROUND_STATUS_BAR_COLOR` - Thay đổi màu nền status bar.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `color` | `string` | *optional* | Mã màu `#FF5722` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { setBackgroundStatusBarColor, isSuccess } from '@webview-sdk/core'

const res = await setBackgroundStatusBarColor({ data: {
      color: "#FF5722"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 2. setNavigationBarColor()

**Event Code:** `SET_NAVIGATION_BAR_COLOR` - Thay đổi màu nền navigation bar.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `color` | `string` | *optional* | Mã màu `#2196F3` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { setNavigationBarColor, isSuccess } from '@webview-sdk/core'

const res = await setNavigationBarColor({ data: {
      color: "#2196F3"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 3. updateStatusBarAppearance()

**Event Code:** `UPDATE_STATUS_BAR_APPEARANCE` - Chuyển đổi status bar giữa dark mode và light mode.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `appearance` | `string` | *optional* | LIGHT hoặc DARK - Appearance mode cho status bar `DARK` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { updateStatusBarAppearance, isSuccess } from '@webview-sdk/core'

const res = await updateStatusBarAppearance({ data: {
      appearance: "DARK"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 4. updateNavigationBarAppearance()

**Event Code:** `UPDATE_NAVIGATION_BAR_APPEARANCE` - Chuyển đổi navigation bar giữa dark mode và light mode.

**Request data *(data is JSON.stringify())***

| Field | Type | Required | Description |
|---|---|---|---|
| `appearance` | `string` | *optional* | LIGHT hoặc DARK - Appearance mode cho status bar `LIGHT` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { updateNavigationBarAppearance, isSuccess } from '@webview-sdk/core'

const res = await updateNavigationBarAppearance({ data: {
      appearance: "LIGHT"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 5. updateMiniAppTheme()

**Event Code:** `UPDATE_MINI_APP_THEME` - Update mini app theme

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `headerColor` | `string` | *optional* | Miniapp header background color `#FFFFFF` |
| `headerTitle` | `string` | *optional* | Miniapp header title `Mini App` |
| `textColor` | `string` | *optional* | Miniapp header text and button color  `#EE0033` |
| `leftButton` | `string` | *optional* | back - back button, none - không có gì `back` |
| `actionButtonThemeType` | `string` | *optional* | Mode hiển thị action: light - sáng , dark - tối  `light` |
| `hideAndroidBottomNavigationBar` | `boolean` | *optional* | Ẩn hiện android bottom bar |
| `hideIOSSafeAreaBottom` | `boolean` | *optional* | Ẩn hiện ios bottom safe area |
| `toolbarMode` | `string` | *optional* | Mode hiển thị header: normal  - bình thường , hidden - ẩn, transparent - trong suốt `normal` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { updateMiniAppTheme, isSuccess } from '@webview-sdk/core'

const res = await updateMiniAppTheme({ data: {
      headerColor: "#FFFFFF",
      headerTitle: "Mini App",
      textColor: "#EE0033",
      leftButton: "back",
      actionButtonThemeType: "light",
      hideAndroidBottomNavigationBar: false,
      hideIOSSafeAreaBottom: false,
      toolbarMode: "normal"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



