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

## Huong dan cho Native Developer

De tich hop SDK tu phia native, can:

1. **Nhan message tu WebView**: Lang nghe message dang JSON tu WebView bridge
2. **Parse request**: Doc truong `event` de biet API nao duoc goi, doc `request_id` de gui response lai
3. **Thuc thi API**: Xu ly logic theo `event` (VD: `GET_LOCATION` -> doc GPS)
4. **Gui response**: Gui message ve WebView voi cung `request_id`, dat `eventStatus.errorCode = "SDK000"` neu thanh cong
5. **Gui event xuong WebView**: Push event qua `evaluateJavascript` hoac `postMessage`

**Vi du xu ly phia Android (Kotlin):**
```kotlin
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun postMessage(json: String) {
        val request = JSONObject(json)
        val event = request.getString("event")
        val requestId = request.getString("request_id")

        when (event) {
            "GET_LOCATION" -> {
                val response = JSONObject().apply {
                    put("event", event)
                    put("sender", "MINIAPP_SDK")
                    put("request_id", requestId)
                    put("data", JSONObject().apply {
                        put("latitude", 10.76)
                        put("longitude", 106.66)
                    })
                    put("eventStatus", JSONObject().apply {
                        put("errorCode", "SDK000")
                        put("errorMessageVN", "Thanh cong")
                        put("errorMessageEN", "Success")
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
# Sinh API tu events.json
node packages/core/src/event.js

# Build all packages
npm run build

# Pack tgz
npm run pack
```

## License

MIT
