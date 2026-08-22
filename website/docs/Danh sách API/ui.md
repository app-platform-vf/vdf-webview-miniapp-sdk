---
sidebar_label: 'UI'
sidebar_position: 8
hide_title: false
title: UI
---

### 1. updateMiniAppTheme()

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

**Ví dụ sử dụng (npm package)**

```typescript
import { updateMiniAppTheme, isSuccess } from 'vdf-webview-miniapp-sdk'

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
  console.log('Thành công')
}
```

**Sử dụng với bundle.js**

```javascript
const res = await WebviewSdk.updateMiniAppTheme({ data: {
      headerColor: "#FFFFFF",
      headerTitle: "Mini App",
      textColor: "#EE0033",
      leftButton: "back",
      actionButtonThemeType: "light",
      hideAndroidBottomNavigationBar: false,
      hideIOSSafeAreaBottom: false,
      toolbarMode: "normal"
    } })
if (WebviewSdk.isSuccess(res)) {
  console.log('Thành công')
}
```

---



