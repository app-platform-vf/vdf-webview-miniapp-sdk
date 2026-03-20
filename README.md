# WebView MiniApp SDK

SDK giao tiep giua WebView (JavaScript) va ung dung Native (Android / iOS / React Native) theo mo hinh **Super MiniApp**.

## Cai dat

```bash
npm install @webview-sdk/core
```

Chi can 1 package duy nhat cho moi framework (React, Vue, Angular, vanilla JS).

## Bat dau nhanh

```ts
import { getSharedMiniApp, getLocation, appOpenWebview, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })
app.ready()

// Goi API qua generated function (type-safe)
const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.data)
}

// Goi API co tham so
await appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } })

// Goi API qua invoke (dynamic)
const res2 = await app.invoke('GET_LOCATION')
```

### React

```tsx
import { useEffect } from 'react'
import { getSharedMiniApp, getLocation, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })

function App() {
  useEffect(() => { app.ready() }, [])

  const handleClick = async () => {
    const res = await getLocation()
    if (isSuccess(res)) console.log(res.data)
  }

  return <button onClick={handleClick}>Get Location</button>
}
```

### Vue 3

```vue
<script setup>
import { onMounted } from 'vue'
import { getSharedMiniApp, getLocation, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })
onMounted(() => { app.ready() })

async function handleClick() {
  const res = await getLocation()
  if (isSuccess(res)) console.log(res.data)
}
</script>

<template>
  <button @click="handleClick">Get Location</button>
</template>
```

### Angular

```ts
import { Component } from '@angular/core'
import { getSharedMiniApp, MiniApp, getLocation, isSuccess } from '@webview-sdk/core'

@Component({
  template: `<button (click)="handleClick()">Get Location</button>`
})
export class AppComponent {
  private app: MiniApp

  constructor() {
    this.app = getSharedMiniApp({ debug: true })
    this.app.ready()
  }

  async handleClick() {
    const res = await getLocation()
    if (isSuccess(res)) console.log(res.data)
  }
}
```

---

## Event Code Generator

SDK dinh nghia danh sach event trong file JSON, tu dong sinh cac ham API TypeScript type-safe.

### Cach hoat dong

```
events.json  -->  event.js  -->  generated/
                                   types.generated.ts      (interfaces)
                                   api.generated.ts        (ham API)
                                   event-map.generated.ts  (event constants)
```

### 1. Dinh nghia event trong `events.json`

**Vi du:**
```json
{
  "event": "GET_LOCATION",
  "description": "Lay vi tri hien tai",
  "request": {},
  "response": {
    "data": {
      "latitude": { "type": "number", "description": "Vi do" },
      "longitude": { "type": "number", "description": "Kinh do" }
    }
  }
}
```

**Event co tham so:**
```json
{
  "event": "APP_OPEN_WEBVIEW",
  "description": "Mo WebView moi",
  "request": {
    "data": {
      "url": { "type": "string", "required": true, "description": "URL can mo" },
      "serviceName": { "type": "string", "description": "Ten dich vu" }
    }
  },
  "response": {
    "data": {
      "success": { "type": "boolean" }
    }
  }
}
```

### 2. Chay generator

```bash
node packages/core/src/event.js
```

### 3. Su dung API da sinh

```ts
import { getLocation, appOpenWebview, isSuccess } from '@webview-sdk/core'

// Ham khong tham so
const res = await getLocation()

// Ham co tham so
const res2 = await appOpenWebview({ data: { url: 'https://example.com' } })

// Kiem tra thanh cong
if (isSuccess(res)) {
  console.log(res.data.latitude, res.data.longitude)  // type-safe
}
```

Ten ham API = `camelCase` cua truong `event`. Vi du: `GET_LOCATION` -> `getLocation()`, `APP_OPEN_WEBVIEW` -> `appOpenWebview()`.

---

## API Reference

### Khoi tao

```ts
import { getSharedMiniApp } from '@webview-sdk/core'

const app = getSharedMiniApp({
  appId: 'com.example.miniapp',  // ID ung dung
  debug: true,                    // Bat log debug
  token: '',                      // Token xac thuc
  timeout: 5000                   // Timeout mac dinh (ms)
})
```

`getSharedMiniApp()` tao singleton — goi nhieu lan van tra ve cung 1 instance, tu dong wire generated API.

### Giao tiep voi Native

| Method | Mo ta |
|--------|-------|
| `app.invoke(api, data?)` | Goi native API, tra ve `Promise` voi ket qua |
| `app.sendRaw(msg)` | Gui `MiniAppRequestBase` truc tiep, day la core method |
| `app.emit(event, data?)` | Gui su kien 1 chieu den native |
| `app.on(event, callback)` | Lang nghe su kien tu native |
| `app.once(event, callback)` | Lang nghe su kien 1 lan |
| `app.off(event, callback?)` | Huy lang nghe. Bo `callback` de huy tat ca |

### Lifecycle

| Method | Mo ta |
|--------|-------|
| `app.ready()` | Danh dau SDK san sang, xa hang doi message |
| `app.destroy()` | Huy SDK, don dep tai nguyen |
| `app.onReady(cb)` | Goi khi SDK san sang |
| `app.onShow(cb)` | Goi khi app hien thi |
| `app.onHide(cb)` | Goi khi app bi an |
| `app.onError(cb)` | Goi khi co loi |
| `app.onDestroy(cb)` | Goi khi app bi huy |

### Plugin

```ts
app.use({
  name: 'analytics',
  install(app) {
    app.on('navigate', (data) => {
      app.emit('analytics.pageView', { url: data.url })
    })
  }
})
```

### Middleware

```ts
app.useMiddleware(async (message, next) => {
  console.log('Before:', message.event, message)
  await next()
  console.log('After:', message.event)
})
```

---

## Generated API Functions

Tat ca ham duoc tu dong sinh tu `events.json`. Import truc tiep tu `@webview-sdk/core`.

### Navigation

| Function | Event | Mo ta |
|----------|-------|-------|
| `appOpenWebview(payload)` | `APP_OPEN_WEBVIEW` | Mo mot WebView moi voi URL va cau hinh tuy chinh |
| `appOpenStore(payload)` | `APP_OPEN_STORE` | Mo ung dung tu App Store/Google Play hoac launch app da cai |
| `exit(payload)` | `EXIT` | Dong Mini App va dieu huong ve man hinh khac |
| `openExternalLink(payload)` | `OPEN_EXTERNAL_LINK` | Mo URL bang browser mac dinh cua he thong |
| `openMiniApp(payload)` | `OPEN_MINI_APP` | Mo mot Mini App khac tu Mini App hien tai |

### User Data Permission

| Function | Event | Mo ta |
|----------|-------|-------|
| `requestMultipleUserDataPermission(payload)` | `REQUEST_MULTIPLE_USER_DATA_PERMISSION` | Yeu cau nhieu quyen user data cung mot luc |
| `checkMultipleUserDataPermission(payload)` | `CHECK_MULTIPLE_USER_DATA_PERMISSION` | Kiem tra trang thai nhieu quyen user data cung luc |
| `requestPermissionWithCode(payload)` | `REQUEST_PERMISSION_WITH_CODE` | Yeu cau quyen cu the theo permission code |
| `checkPermissionWithCode(payload)` | `CHECK_PERMISSION_WITH_CODE` | Kiem tra trang thai quyen cu the |

### User Data

| Function | Event | Mo ta |
|----------|-------|-------|
| `getMultipleUserData(payload)` | `GET_MULTIPLE_USER_DATA` | Lay nhieu truong du lieu nguoi dung tu host app |
| `clearPermissionCache(payload)` | `CLEAR_PERMISSION_CACHE` | Xoa tat ca quyen da cache o local |

### Device Permission — Request

| Function | Event | Mo ta |
|----------|-------|-------|
| `requestCameraPermission()` | `REQUEST_CAMERA_PERMISSION` | Yeu cau mo camera |
| `requestLocationPermission()` | `REQUEST_LOCATION_PERMISSION` | Yeu cau vi tri |
| `requestPhotosPermission()` | `REQUEST_PHOTOS_PERMISSION` | Yeu cau truy cap anh tren thiet bi |
| `requestVideosPermission()` | `REQUEST_VIDEOS_PERMISSION` | Yeu cau truy cap video tren thiet bi |
| `requestAudioPermission()` | `REQUEST_AUDIO_PERMISSION` | Yeu cau truy cap audio tren thiet bi |
| `requestRecordAudioPermission()` | `REQUEST_RECORD_AUDIO_PERMISSION` | Yeu cau ghi am tren thiet bi |
| `requestContactsPermission()` | `REQUEST_CONTACTS_PERMISSION` | Yeu cau truy cap danh ba tren thiet bi |
| `requestDocumentPermission()` | `REQUEST_DOCUMENT_PERMISSION` | Yeu cau truy cap tai lieu tren thiet bi |
| `requestPhoneCallPermission()` | `REQUEST_PHONE_CALL_PERMISSION` | Yeu cau thuc hien cuoc goi tren thiet bi |
| `requestPaymentPermission()` | `REQUEST_PAYMENT_PERMISSION` | Yeu cau quyen thanh toan |
| `requestLoginPermission()` | `REQUEST_LOGIN_PERMISSION` | Yeu cau quyen dang nhap |
| `requestLocalAuthenticationPermission()` | `REQUEST_LOCAL_AUTHENTICATION_PERMISSION` | Yeu cau xac thuc sinh trac hoc (van tay, Face ID) |

### Device Permission — Check

| Function | Event | Mo ta |
|----------|-------|-------|
| `checkCameraPermission()` | `CHECK_CAMERA_PERMISSION` | Kiem tra quyen camera |
| `checkLocationPermission()` | `CHECK_LOCATION_PERMISSION` | Kiem tra quyen vi tri |
| `checkPhotosPermission()` | `CHECK_PHOTOS_PERMISSION` | Kiem tra quyen truy cap anh |
| `checkVideosPermission()` | `CHECK_VIDEOS_PERMISSION` | Kiem tra quyen truy cap video |
| `checkAudioPermission()` | `CHECK_AUDIO_PERMISSION` | Kiem tra quyen truy cap file audio |
| `checkRecordAudioPermission()` | `CHECK_RECORD_AUDIO_PERMISSION` | Kiem tra quyen ghi am tren thiet bi |
| `checkContactsPermission()` | `CHECK_CONTACTS_PERMISSION` | Kiem tra quyen truy cap danh ba |
| `checkDocumentPermission()` | `CHECK_DOCUMENT_PERMISSION` | Kiem tra quyen truy cap file tai lieu |
| `checkPhoneCallPermission()` | `CHECK_PHONE_CALL_PERMISSION` | Kiem tra quyen goi dien |
| `checkPaymentPermission()` | `CHECK_PAYMENT_PERMISSION` | Kiem tra quyen thanh toan |
| `checkLoginPermission()` | `CHECK_LOGIN_PERMISSION` | Kiem tra quyen dang nhap |
| `checkLocalAuthenticationPermission()` | `CHECK_LOCAL_AUTHENTICATION_PERMISSION` | Kiem tra quyen xac thuc sinh trac hoc |

### Biometric Authentication

| Function | Event | Mo ta |
|----------|-------|-------|
| `executeLocalAuthentication(payload?)` | `EXECUTE_LOCAL_AUTHENTICATION` | Thuc hien xac thuc sinh trac hoc (van tay, Face ID) |
| `getLocalAuthenticationStatus()` | `GET_LOCAL_AUTHENTICATION_STATUS` | Lay trang thai xac thuc sinh trac hoc |

### Contacts & File

| Function | Event | Mo ta |
|----------|-------|-------|
| `getContacts(payload?)` | `GET_CONTACTS` | Lay danh sach contacts tu danh ba he thong |
| `pickFile(payload?)` | `PICK_FILE` | Mo trinh chon file tu thu vien hoac camera |

### Local Storage

| Function | Event | Mo ta |
|----------|-------|-------|
| `saveStringValue(payload)` | `SAVE_STRING_VALUE` | Luu gia tri kieu string |
| `saveBooleanValue(payload)` | `SAVE_BOOLEAN_VALUE` | Luu gia tri kieu boolean |
| `saveIntegerValue(payload)` | `SAVE_INTEGER_VALUE` | Luu gia tri kieu int |
| `saveLongValue(payload)` | `SAVE_LONG_VALUE` | Luu gia tri kieu long |
| `saveFloatValue(payload)` | `SAVE_FLOAT_VALUE` | Luu gia tri kieu float |
| `getStringValue(payload)` | `GET_STRING_VALUE` | Lay gia tri kieu string |
| `getBooleanValue(payload)` | `GET_BOOLEAN_VALUE` | Lay gia tri kieu boolean |
| `getIntegerValue(payload)` | `GET_INTEGER_VALUE` | Lay gia tri kieu int |
| `getLongValue(payload)` | `GET_LONG_VALUE` | Lay gia tri kieu long |
| `getFloatValue(payload)` | `GET_FLOAT_VALUE` | Lay gia tri kieu float |
| `clearStorage()` | `CLEAR_STORAGE` | Xoa toan bo local storage |

### Location & UI

| Function | Event | Mo ta |
|----------|-------|-------|
| `getLocation()` | `GET_LOCATION` | Lay vi tri GPS hien tai. Phai co quyen LOCATION_PERMISSION truoc |
| `setBackgroundStatusBarColor(payload?)` | `SET_BACKGROUND_STATUS_BAR_COLOR` | Thay doi mau nen status bar |
| `setNavigationBarColor(payload?)` | `SET_NAVIGATION_BAR_COLOR` | Thay doi mau nen navigation bar |
| `updateStatusBarAppearance(payload?)` | `UPDATE_STATUS_BAR_APPEARANCE` | Chuyen doi status bar giua dark/light mode |
| `updateNavigationBarAppearance(payload?)` | `UPDATE_NAVIGATION_BAR_APPEARANCE` | Chuyen doi navigation bar giua dark/light mode |

### Share

| Function | Event | Mo ta |
|----------|-------|-------|
| `shareTextContent(payload?)` | `SHARE_TEXT_CONTENT` | Mo dialog chia se noi dung text |

### Utility

| Function | Mo ta |
|----------|-------|
| `isSuccess(response)` | Kiem tra response co thanh cong khong (`errorCode === 'SDK000'`) |

---

## Giao thuc Message (Bridge Protocol)

Message format la `MiniAppRequestBase` — flat object, khong co `payload` wrapper:

### Request

```json
{
  "event": "GET_LOCATION",
  "sender": "MINIAPP_WEBVIEW",
  "request_id": "req_1710000000_abc",
  "token": "...",
  "timestamp": 1710000000
}
```

### Response

```json
{
  "event": "GET_LOCATION",
  "sender": "MINIAPP_SDK",
  "request_id": "req_1710000000_abc",
  "data": { "latitude": 10.76, "longitude": 106.66 },
  "eventStatus": {
    "errorCode": "SDK000",
    "errorMessageVN": "Thanh cong",
    "errorMessageEN": "Success",
    "realMsg": ""
  }
}
```

### Luong giao tiep

```
WebView (JS)                              Native App
    |                                          |
    |-- { event: "GET_LOCATION",               |
    |     sender: "MINIAPP_WEBVIEW",           |
    |     request_id: "req_xxx" }              |
    |   ------------------------------>        |
    |                                          |
    |  <------------------------------         |
    |   { event: "GET_LOCATION",               |
    |     sender: "MINIAPP_SDK",               |
    |     request_id: "req_xxx",               |
    |     data: { latitude: 10.76 },           |
    |     eventStatus: { errorCode: "SDK000" } |
    |   }                                      |
```

### Platform Support

| Platform | Bridge object | Mo ta |
|----------|--------------|-------|
| Android | `window.AndroidWebview.miniappWebviewToSdk(msg)` | Ben android dinh nghia interface nay de webview co the goi event |
| iOS (WKWebView) | `window.webkit.messageHandlers.miniappWebviewToSdk.postMessage(msg)` | Ben iOS dinh nghia interface nay de webview co the goi event |
| Web (fallback) | `window.miniappSdkToWebview(msg)` | Ben webview dinh nghia function nay de native co the gui message xuong webview |

---

## Cau truc thu muc

```
packages/
  core/                          @webview-sdk/core
    src/
      index.ts                   Export cong khai
      types.ts                   Tat ca interface/type
      MiniApp.ts                 Class chinh + createMiniApp()
      adapter.ts                 getSharedMiniApp() + createMiniAppInterface()
      events.json                Dinh nghia danh sach event
      event.js                   Generator: doc JSON -> sinh API
      generated/                 [AUTO-GEN] Khong sua thu cong
        types.generated.ts       Interfaces request/response
        api.generated.ts         Cac ham API + wireToMiniApp()
        event-map.generated.ts   Event constants + type map
      bridge/
        Transport.ts             Gui/nhan message den native
      modules/
        EventBus.ts              Pub/sub (on/once/off/emit)
        RequestManager.ts        Theo doi request/response + timeout
        MessageQueue.ts          Buffer message truoc khi ready
        MiddlewareManager.ts     Pipeline middleware async
      plugins/
        PluginManager.ts         He thong plugin
      utils/
        logger.ts                Logger bat/tat
        timeout.ts               withTimeout helper
        retry.ts                 retry helper
demo/
  angular/                       Demo Angular (chi dung @webview-sdk/core)
  react/                         Demo React (chi dung @webview-sdk/core)
  vue/                           Demo Vue 3 (chi dung @webview-sdk/core)
```


## Build & Generate

```bash
#1 Sinh API tu events.json
node packages/core/src/event.js

#2 Build all packages
npm run build

#3 Sinh API docs tu events.json
node build-doc.js

#4
# Dong goi code den dist/webview-sdk-core-1.0.0.tgz
# Copy dist/webview-sdk-core-1.0.0.tgz den demo/{platform}/core-lib/webview-sdk-core-1.0.0.tgz
# Chạy npm install @webview-sdk/core ---- Định nghĩa trong demo/{platform}/package.json -> @webview-sdk/core",
# Chạy demo/demo.js để tự động sinh code trong thư mục demo theo event.json định nghĩa
node scripts/copy-core-lib.js


#5 Pack tgz
# Bao gồm chạy lệnh #1, #2, #4
npm run pack
```



