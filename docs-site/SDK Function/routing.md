---
sidebar_label: 'Routing'
sidebar_position: 3
hide_title: false
title: Routing
---

### 1. appOpenWebview()

**Event Code:** `APP_OPEN_WEBVIEW` - Mở một WebView mới với URL và cấu hình tùy chỉnh.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | **required** | URL của webview cần mở `https://example.com` |
| `serviceName` | `string` | *optional* | Tiêu đề hiển thị trên app bar `Tên dịch vụ` |
| `isPaymentConfirm` | `boolean` | *optional* | false = đóng mini app để sang gateway thanh toán |
| `resourceType` | `string` | *optional* | HTML = mở trong webview, khác = mở browser mặc định `HTML` |
| `returnUrl` | `string` | *optional* | URL trả về khi thành công/thất bại/timeout `https://example.com/return` |
| `cancelUrl` | `string` | *optional* | URL trả về khi người dùng cancel `https://example.com/cancel` |


**Response data**



| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | *optional* | url `https://example.com/return?status=success` |
| `type` | `string` | *optional* | RETURN - Người dùng hoàn tất và quay lại, kèm theo URL; CANCEL - Người dùng hủy, kèm theo URL; CLOSED - Người dùng tự đóng webview, không có URL `RETURN` |


**Ví dụ sử dụng**

```typescript
import { appOpenWebview, isSuccess } from '@webview-sdk/core'

const res = await appOpenWebview({ data: {
      url: "https://example.com",
      serviceName: "Tên dịch vụ",
      isPaymentConfirm: false,
      resourceType: "HTML",
      returnUrl: "https://example.com/return",
      cancelUrl: "https://example.com/cancel"
    } })
if (isSuccess(res)) {
  console.log(res.data.url)
  console.log(res.data.type)
}
```

---



### 2. appOpenStore()

**Event Code:** `APP_OPEN_STORE` - Mở ứng dụng từ App Store/Google Play hoặc launch app đã cài.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `fallbackUrlAndroid` | `string` | *optional* | URL android `market://details?id=com.example.app` |
| `fallbackUrlIos` | `string` | *optional* | URL Ios `itms-apps://itunes.apple.com/app/id123456789` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { appOpenStore, isSuccess } from '@webview-sdk/core'

const res = await appOpenStore({ data: {
      fallbackUrlAndroid: "market://details?id=com.example.app",
      fallbackUrlIos: "itms-apps://itunes.apple.com/app/id123456789"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 3. exit()

**Event Code:** `EXIT` - Đóng Mini App và điều hướng về màn hình khác.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `navigationAction` | `string` | *optional* | Quay về trang chủ của host app; TH khác - Chỉ đóng Mini App `RETURN_HOME_APP` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { exit, isSuccess } from '@webview-sdk/core'

const res = await exit({ data: {
      navigationAction: "RETURN_HOME_APP"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 4. openExternalLink()

**Event Code:** `OPEN_EXTERNAL_LINK` - Mở URL bằng browser mặc định của hệ thống.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `uri` | `string` | *optional* | Link Ngoài `https://google.com` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { openExternalLink, isSuccess } from '@webview-sdk/core'

const res = await openExternalLink({ data: {
      uri: "https://google.com"
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



### 5. openMiniApp()

**Event Code:** `OPEN_MINI_APP` - Mở một Mini App khác từ Mini App hiện tại.

**Request data**

| Field | Type | Required | Description |
|---|---|---|---|
| `route` | `object` | *optional* | Định tuyến màn hình trong Mini App  `{       "screenName": "home"     }` |
| `miniappKey` | `string` | *optional* | Key của Mini App cần mở  `01K5FY191HP42SMMJXHWG545ZZ` |
| `additional` | `object` | *optional* | Dữ liệu bổ sung truyền cho Mini App  `{       "param1": "value1",       "param2": "value2"     }` |
| `launchConfig` | `object` | *optional* | Chế độ launchConfig.mode: present(Mở Mini App mới đè lên Mini App cũ) hoặc replace(Kill Mini App cũ trước khi mở Mini App mới)	;   `{       "mode": "present"     }` |
| `themeConfig` | `object` | *optional* | Style cho navigation bar `{       "title": "My App",       "headerColor": "#EE0033",       "headerTitle": "Videos",       "textColor": "white",       "leftButton": "back",       "actionButtonThemeType": "normal",       "hideAndroidBottomNavigationBar": true,       "hideIOSSafeAreaBottom": true     }` |
| `tracking` | `object` | *optional* | Thông tin tracking `{       "campaign": "promotion",       "utmSource": "miniapp"     }` |


**Response**

*No response data*

**Ví dụ sử dụng**

```typescript
import { openMiniApp, isSuccess } from '@webview-sdk/core'

const res = await openMiniApp({ data: {
      route: { "screenName": "home" },
      miniappKey: "01K5FY191HP42SMMJXHWG545ZZ",
      additional: { "param1": "value1", "param2": "value2" },
      launchConfig: { "mode": "present" },
      themeConfig: { "title": "My App", "headerColor": "#EE0033", "headerTitle": "Videos", "textColor": "white", "leftButton": "back", "actionButtonThemeType": "normal", "hideAndroidBottomNavigationBar": true, "hideIOSSafeAreaBottom": true },
      tracking: { "campaign": "promotion", "utmSource": "miniapp" }
    } })
if (isSuccess(res)) {
  console.log('Thanh cong')
}
```

---



