# WebView MiniApp SDK

SDK giao tiep giua WebView (JavaScript) va ung dung Native (Android / iOS / React Native) theo mo hinh **Super MiniApp**.

## Cai dat

```bash
npm install @webview-sdk/core

# Framework adapter (chon 1)
npm install @webview-sdk/react
npm install @webview-sdk/vue
npm install @webview-sdk/angular
```

## Bat dau nhanh

### Su dung truc tiep (Core)

```ts
import { createMiniApp } from '@webview-sdk/core'

const app = createMiniApp({
  appId: 'com.example.miniapp',
  debug: true,
  timeout: 5000
})

// Goi native API va cho ket qua
const location = await app.invoke('getLocation', { type: 'gcj02' })

// Gui su kien 1 chieu den native
app.emit('analytics.track', { action: 'click_button' })

// Lang nghe su kien tu native
app.on('pushNotification', (data) => {
  console.log('Nhan thong bao:', data)
})

// Khi WebView san sang
app.ready()
```

### React

```tsx
import { useMiniApp } from '@webview-sdk/react'
// Generated API — type-safe, co autocomplete day du
import { getUserInfo, scanQrCode, isSuccess } from '@webview-sdk/core'

function App() {
  const { on, ui, ready } = useMiniApp()  // tu dong wire generated API

  useEffect(() => {
    on('message', (data) => console.log(data))
    ready()
  }, [])

  const loadUser = async () => {
    const res = await getUserInfo({ user_id: '123' })
    if (isSuccess(res)) {
      console.log(res.data.full_name)  // type-safe
    }
  }

  const scan = async () => {
    const res = await scanQrCode()
    if (isSuccess(res)) {
      await ui.showToast({ title: res.data.code, icon: 'success' })
    }
  }

  return (
    <>
      <button onClick={loadUser}>Lay thong tin</button>
      <button onClick={scan}>Quet QR</button>
    </>
  )
}
```

> **Luu y:** `useMiniApp()` tu dong goi `wireToMiniApp()` noi generated API voi MiniApp instance. Chi can import ham tu `@webview-sdk/core` va goi truc tiep.

### Vue 3

```vue
<script setup>
import { useMiniApp } from '@webview-sdk/vue'
import { onMounted } from 'vue'
// Generated API — type-safe, co autocomplete day du
import { getUserInfo, scanQrCode, isSuccess } from '@webview-sdk/core'

const { on, ui, ready } = useMiniApp()  // tu dong wire generated API

// Listener tu dong cleanup khi component unmount
on('message', (data) => console.log(data))

onMounted(() => ready())

async function loadUser() {
  const res = await getUserInfo({ user_id: '123' })
  if (isSuccess(res)) {
    console.log(res.data.full_name)  // type-safe
  }
}

async function scan() {
  const res = await scanQrCode()
  if (isSuccess(res)) {
    await ui.showToast({ title: res.data.code, icon: 'success' })
  }
}
</script>

<template>
  <button @click="loadUser">Lay thong tin</button>
  <button @click="scan">Quet QR</button>
</template>
```

> **Luu y:** `useMiniApp()` tu dong goi `wireToMiniApp()` noi generated API voi MiniApp instance. Listener duoc tu dong huy khi component unmount.

### Angular

```ts
import { Component, OnInit } from '@angular/core'
import { MiniAppService } from '@webview-sdk/angular'
// Generated API — type-safe, co autocomplete day du
import { getUserInfo, scanQrCode, isSuccess } from '@webview-sdk/core'

@Component({ template: `
  <button (click)="loadUser()">Lay thong tin</button>
  <button (click)="scan()">Quet QR</button>
` })
export class AppComponent implements OnInit {
  constructor(private miniapp: MiniAppService) {}
  // MiniAppService tu dong goi wireToMiniApp() trong constructor

  ngOnInit() {
    this.miniapp.on('message', (data) => console.log(data))
    this.miniapp.ready()
  }

  async loadUser() {
    const res = await getUserInfo({ user_id: '123' })
    if (isSuccess(res)) {
      console.log(res.data.full_name)  // type-safe
    }
  }

  async scan() {
    const res = await scanQrCode()
    if (isSuccess(res)) {
      await this.miniapp.ui.showToast({ title: res.data.code, icon: 'success' })
    }
  }
}
```

> **Luu y:** `MiniAppService` tu dong goi `wireToMiniApp()` trong constructor. Generated API san sang ngay sau khi inject service.

---

## Event Code Generator

SDK ho tro dinh nghia danh sach event trong file JSON, sau do tu dong sinh ra cac ham API TypeScript type-safe.

### Cach hoat dong

```
events.json  -->  event.js  -->  generated/
                                   types.generated.ts      (interfaces)
                                   api.generated.ts        (ham API)
                                   event-map.generated.ts  (event constants)
```

### 1. Dinh nghia event trong `events.json`

Moi event gom `request` va `response`, theo giao thuc chung:

**Request chung:**
```json
{
  "event": "string",
  "sender": "string",
  "request_id": "string",
  "data": {}
}
```

**Response chung:**
```json
{
  "event": "string",
  "sender": "MINIAPP_SDK",
  "response_id": "string",
  "request_id": "string",
  "data": {},
  "token": "string",
  "eventStatus": {
    "errorCode": "SDK000",
    "errorMessageVN": "string",
    "errorMessageEN": "string",
    "realMsg": "string"
  },
  "errorData": "string",
  "message": "string"
}
```

**Vi du dinh nghia event:**
```json
{
  "event": "GET_USER_INFO",
  "description": "Lay thong tin nguoi dung",
  "request": {
    "data": {
      "user_id": { "type": "string", "required": false, "description": "ID nguoi dung" }
    }
  },
  "response": {
    "data": {
      "full_name": { "type": "string", "description": "Ho va ten" },
      "phone": { "type": "string", "description": "So dien thoai" },
      "email": { "type": "string", "description": "Email" },
      "avatar": { "type": "string", "description": "URL anh dai dien" }
    }
  }
}
```

### 2. Chay generator

```bash
node packages/core/src/event.js
```

### 3. File duoc sinh ra

| File | Noi dung |
|------|----------|
| `types.generated.ts` | `MiniAppRequest<T>`, `MiniAppResponse<T>`, `EventStatus` + interface cho tung event (`GetUserInfoRequest`, `GetUserInfoResponse`, ...) |
| `api.generated.ts` | Ham API tu dong: `getUserInfo()`, `getLocation()`, `scanQrCode()`, ... + object `MiniAppAPI` gom tat ca |
| `event-map.generated.ts` | `MiniAppEventMap` type-safe mapping + `MINIAPP_EVENTS` constants |

Ten ham API = `camelCase` cua truong `event`. Vi du: `GET_USER_INFO` -> `getUserInfo()`.

### 4. Su dung API da sinh

**Trong framework adapter (React / Vue / Angular) — khong can cau hinh them:**

```ts
// Import tu @webview-sdk/core — adapter da tu dong wire san
import { getUserInfo, getLocation, scanQrCode, isSuccess } from '@webview-sdk/core'
import { MINIAPP_EVENTS } from '@webview-sdk/core'

// Goi API theo ten ham (camelCase cua event name)
const res = await getUserInfo({ user_id: '123' })
// hoac qua object
const res = await MiniAppAPI.getUserInfo({ user_id: '123' })

// Kiem tra thanh cong (errorCode === 'SDK000')
if (isSuccess(res)) {
  console.log(res.data.full_name) // type-safe, co autocomplete
}
```

> Framework adapter (`useMiniApp` / `MiniAppService`) tu dong goi `wireToMiniApp(app)` khi khoi tao, ket noi generated API voi MiniApp instance. Khong can goi `initMiniAppAPI()` hay `MiniAppAPI.init()` thu cong.

**Su dung Core truc tiep (khong qua adapter):**

```ts
import { createMiniApp, wireToMiniApp, getUserInfo, isSuccess } from '@webview-sdk/core'

const app = createMiniApp({ appId: 'com.example.miniapp' })
wireToMiniApp(app)   // noi generated API voi instance nay
app.ready()

const res = await getUserInfo({ user_id: '123' })
if (isSuccess(res)) {
  console.log(res.data.full_name)
}
```

**Request gui di:**
```json
{
  "event": "GET_USER_INFO",
  "sender": "MINIAPP_WEBVIEW",
  "request_id": "req_1710000000_1",
  "data": { "user_id": "123" }
}
```

**Response nhan ve:**
```json
{
  "event": "GET_USER_INFO",
  "sender": "MINIAPP_SDK",
  "response_id": "res_xxx",
  "request_id": "req_1710000000_1",
  "data": { "full_name": "Nguyen Van A", "phone": "0901234567" },
  "token": "",
  "eventStatus": { "errorCode": "SDK000", "errorMessageVN": "Thanh cong", "errorMessageEN": "Success", "realMsg": "" },
  "errorData": "",
  "message": ""
}
```

### 5. Them event moi

Chi can them vao `events.json` roi chay lai:

```bash
node packages/core/src/event.js
```

Tu dong sinh ham API + types moi, khong can viet code thu cong.

### Danh sach event co san

| Ham API | Event | Mo ta |
|---------|-------|-------|
| `getUserInfo()` | `GET_USER_INFO` | Lay thong tin nguoi dung |
| `getLocation()` | `GET_LOCATION` | Lay vi tri hien tai |
| `scanQrCode()` | `SCAN_QR_CODE` | Mo camera quet ma QR |
| `getSystemInfo()` | `GET_SYSTEM_INFO` | Lay thong tin thiet bi |
| `setStorage()` | `SET_STORAGE` | Luu du lieu vao storage |
| `getStorage()` | `GET_STORAGE` | Doc du lieu tu storage |
| `removeStorage()` | `REMOVE_STORAGE` | Xoa du lieu theo key |
| `showToast()` | `SHOW_TOAST` | Hien thi toast |
| `showLoading()` | `SHOW_LOADING` | Hien thi loading |
| `hideLoading()` | `HIDE_LOADING` | An loading |
| `showDialog()` | `SHOW_DIALOG` | Hien thi hop thoai xac nhan |
| `navigateTo()` | `NAVIGATE_TO` | Chuyen trang |
| `navigateBack()` | `NAVIGATE_BACK` | Quay lai trang truoc |
| `getAccessToken()` | `GET_ACCESS_TOKEN` | Lay access token |
| `openDeepLink()` | `OPEN_DEEP_LINK` | Mo deep link |
| `share()` | `SHARE` | Chia se noi dung |
| `closeMiniapp()` | `CLOSE_MINIAPP` | Dong miniapp |

---

## API Reference

### MiniApp (Core)

#### Khoi tao

```ts
import { createMiniApp } from '@webview-sdk/core'

const app = createMiniApp({
  appId: 'com.example.miniapp',  // ID ung dung
  debug: false,                   // Bat log debug
  token: '',                      // Token xac thuc
  timeout: 5000                   // Timeout mac dinh (ms)
})
```

#### Giao tiep voi Native

| Method | Mo ta |
|--------|-------|
| `app.invoke(api, data?)` | Goi native API, tra ve `Promise` voi ket qua |
| `app.emit(event, data?)` | Gui su kien 1 chieu den native |
| `app.on(event, callback)` | Lang nghe su kien tu native |
| `app.once(event, callback)` | Lang nghe su kien 1 lan |
| `app.off(event, callback?)` | Huy lang nghe. Bo `callback` de huy tat ca |

#### Lifecycle

| Method | Mo ta |
|--------|-------|
| `app.ready()` | Danh dau SDK san sang, xa hang doi message |
| `app.destroy()` | Huy SDK, don dep tai nguyen |
| `app.onReady(cb)` | Goi khi SDK san sang |
| `app.onShow(cb)` | Goi khi app hien thi |
| `app.onHide(cb)` | Goi khi app bi an |
| `app.onError(cb)` | Goi khi co loi |
| `app.onDestroy(cb)` | Goi khi app bi huy |

#### Storage API

```ts
await app.storage.get('key')            // { data: any }
await app.storage.set('key', value)
await app.storage.remove('key')
await app.storage.clear()
await app.storage.info()                 // { keys, currentSize, limitSize }
```

#### UI API

```ts
await app.ui.showToast({ title: 'OK', icon: 'success', duration: 2000 })
await app.ui.hideToast()

await app.ui.showLoading({ title: 'Dang tai...', mask: true })
await app.ui.hideLoading()

const { confirm } = await app.ui.showDialog({
  title: 'Xac nhan',
  content: 'Ban co chac khong?',
  confirmText: 'Dong y',
  cancelText: 'Huy',
  showCancel: true
})

const { tapIndex } = await app.ui.showActionSheet({
  itemList: ['Chup anh', 'Chon tu thu vien']
})
```

#### Navigator API

```ts
await app.navigator.push('/page/detail', { id: 1 })
await app.navigator.pop()                  // Quay lai
await app.navigator.pop(2)                 // Quay lai 2 trang
await app.navigator.switchTab('/tab/home')
await app.navigator.redirect('/page/other', { id: 2 })
await app.navigator.reLaunch('/page/home')
```

#### Plugin

```ts
const myPlugin = {
  name: 'analytics',
  install(app) {
    app.on('navigate', (data) => {
      app.emit('analytics.pageView', { url: data.url })
    })
  }
}

app.use(myPlugin)
```

#### Middleware

```ts
// Log tat ca message truoc khi gui
app.useMiddleware(async (message, next) => {
  console.log('Sending:', message)
  await next()
  console.log('Sent:', message)
})

// Them token tu dong
app.useMiddleware(async (message, next) => {
  message.token = getAuthToken()
  await next()
})
```

---

## Giao thuc Message (Bridge Protocol)

### Request chung

```ts
interface MiniAppRequest<T = any> {
  event: string;        // Ten event (VD: "GET_USER_INFO")
  sender: string;       // Nguon gui (VD: "MINIAPP_WEBVIEW")
  request_id: string;   // ID duy nhat de map voi response
  data: T;              // Du lieu request
}
```

### Response chung

```ts
interface MiniAppResponse<T = any> {
  event: string;        // Ten event
  sender: string;       // "MINIAPP_SDK"
  response_id: string;  // ID response
  request_id: string;   // ID tu request de ghep cap
  data: T;              // Du lieu response
  token: string;        // Access token (neu co)
  eventStatus: {
    errorCode: string;       // "SDK000" = thanh cong
    errorMessageVN: string;  // Thong bao loi tieng Viet
    errorMessageEN: string;  // Thong bao loi tieng Anh
    realMsg: string;         // Thong bao goc tu he thong
  };
  errorData: string;    // Du lieu loi (neu co)
  message: string;      // Thong bao bo sung
}
```

### Luong giao tiep

```
WebView (JS)                              Native App
    |                                          |
    |-- { event: "GET_LOCATION",               |
    |     sender: "MINIAPP_WEBVIEW",           |
    |     request_id: "req_1",                 |
    |     data: { type: "gcj02" }              |
    |   }  ------------------------------>     |
    |                                          |
    |  <------------------------------         |
    |   { event: "GET_LOCATION",               |
    |     sender: "MINIAPP_SDK",               |
    |     response_id: "res_1",                |
    |     request_id: "req_1",                 |
    |     data: { lat: 10.76, lng: 106.66 },   |
    |     eventStatus: { errorCode: "SDK000" } |
    |   }                                      |
```

### Platform Support

| Platform | Bridge object |
|----------|--------------|
| React Native | `window.ReactNativeWebView.postMessage()` |
| Android | `window.AndroidBridge.postMessage()` |
| iOS (WKWebView) | `window.webkit.messageHandlers.bridge.postMessage()` |
| Web (fallback) | `window.postMessage()` |

---

## Cau truc thu muc

```
packages/
  core/                          @webview-sdk/core
    src/
      index.ts                   Export cong khai
      types.ts                   Tat ca interface/type
      MiniApp.ts                 Class chinh + createMiniApp()
      events.json                Dinh nghia danh sach event
      event.js                   Generator: doc JSON -> sinh API
      generated/                 [AUTO-GEN] Khong sua thu cong
        types.generated.ts       Interfaces request/response
        api.generated.ts         Cac ham API tu dong
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
      apis/
        Storage.ts               Storage API qua native
        UI.ts                    UI API (toast, loading, dialog)
        Navigator.ts             Navigator API
      utils/
        logger.ts                Logger bat/tat
        timeout.ts               withTimeout helper
        retry.ts                 retry helper
  react/                         @webview-sdk/react
    src/
      useMiniApp.ts              React hook
  vue/                           @webview-sdk/vue
    src/
      useMiniApp.ts              Vue 3 composable (auto cleanup)
  angular/                       @webview-sdk/angular
    src/
      miniapp.service.ts         Angular injectable service
```

## Huong dan cho Native Developer

De tich hop SDK tu phia native, can:

1. **Nhan message tu WebView**: Lang nghe message dang JSON tu WebView bridge
2. **Parse request**: Doc truong `event` de biet API nao duoc goi, doc `request_id` de gui response lai
3. **Thuc thi API**: Xu ly logic theo `event` (VD: `GET_LOCATION` -> doc GPS)
4. **Gui response**: Gui message ve WebView voi cung `request_id`, dat `eventStatus.errorCode = "SDK000"` neu thanh cong
5. **Gui event xuong WebView**: Push event bang message co `sender: "MINIAPP_SDK"` qua `evaluateJavascript` hoac `postMessage`

**Vi du xu ly phia Android (Kotlin):**
```kotlin
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun postMessage(json: String) {
        val request = JSONObject(json)
        val event = request.getString("event")
        val requestId = request.getString("request_id")

        when (event) {
            "GET_USER_INFO" -> {
                val response = JSONObject().apply {
                    put("event", event)
                    put("sender", "MINIAPP_SDK")
                    put("response_id", UUID.randomUUID().toString())
                    put("request_id", requestId)
                    put("data", JSONObject().apply {
                        put("full_name", "Nguyen Van A")
                        put("phone", "0901234567")
                    })
                    put("eventStatus", JSONObject().apply {
                        put("errorCode", "SDK000")
                    })
                }
                webView.evaluateJavascript(
                    "window.postMessage('${response}')", null
                )
            }
        }
    }
}, "AndroidBridge")
```

## Build & Generate

```bash
# Type-check toan bo project
npx tsc --noEmit

# Sinh API tu events.json
node packages/core/src/event.js

# Bien dich TypeScript (xuat ra dist/)
npx tsc

# Sinh trang documentation
node build-doc.js
```

## License

MIT
