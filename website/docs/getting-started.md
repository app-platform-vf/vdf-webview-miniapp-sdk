---
sidebar_label: 'Getting Started'
sidebar_position: 1
hide_title: false
title: Getting Started
---

# Super MiniApp SDK - API Documentation

> Tự động sinh từ events.json — 56 events.

**Demo Links (GitHub Pages):**
- [Demo Vanilla JS](https://app-platform-vf.github.io/vdf-webview-miniapp-sdk/demo/vanilla/)
- [Demo React](https://app-platform-vf.github.io/vdf-webview-miniapp-sdk/demo/react/)
- [Demo Vue](https://app-platform-vf.github.io/vdf-webview-miniapp-sdk/demo/vue/)
- [Demo Angular](https://app-platform-vf.github.io/vdf-webview-miniapp-sdk/demo/angular/)

## 1. Getting Started

### 1.1 Cài đặt

Có 2 cách tích hợp SDK:

| Cách | Phù hợp với | File cần tải |
|------|-------------|------|
| **npm package** | React, Vue, Angular (có bundler) | `webview-sdk-core-1.0.0.tgz` |
| **bundle.js** | Vanilla JS, HTML thuần (không cần bundler) | `bundle.js` |

**Tải file:**
- [webview-sdk-core-1.0.0.tgz](pathname:///files/webview-sdk-core-1.0.0.tgz) — npm package
- [bundle.js](pathname:///files/bundle.js) — Script file (IIFE)
- [Tải code demo](pathname:///files/demo.zip)

---

#### Cách 1: npm package (React / Vue / Angular)

**Bước 1:** Copy file `webview-sdk-core-1.0.0.tgz` vào thư mục `core-lib/` trong project
```bash
mkdir -p core-lib
cp webview-sdk-core-1.0.0.tgz core-lib/
```

**Bước 2:** Thêm dependency vào `package.json`
```json
{
  "dependencies": {
    "@webview-sdk/core": "file:core-lib/webview-sdk-core-1.0.0.tgz"
  }
}
```

**Bước 3:** Cài đặt
```bash
npm install
```

---

#### Cách 2: bundle.js (Vanilla JS / HTML thuần)

Không cần npm, không cần bundler — chỉ cần 1 file `bundle.js`.

**Bước 1:** Copy `bundle.js` vào project

**Bước 2:** Thêm script tag vào HTML
```html
<script src="bundle.js"></script>
```

**Bước 3:** Sử dụng qua global `WebviewSdk`
```javascript
var app = WebviewSdk.getSharedMiniApp({ debug: true })
app.ready()

// Gọi API
var res = await WebviewSdk.getLocation()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data)
}
```

*Tất cả API functions đều có sẵn trên object `WebviewSdk` — giống hệt cách dùng với npm package.*

### 1.2 Bắt đầu nhanh

```typescript
import { getSharedMiniApp, getLocation, appOpenWebview, isSuccess } from '@webview-sdk/core'

const app = getSharedMiniApp({ debug: true })
app.ready()

// Gọi API qua generated function (type-safe)
const res = await getLocation()
if (isSuccess(res)) {
  console.log(res.data)
}

// Gọi API có tham số
await appOpenWebview({ data: { url: 'https://example.com', serviceName: 'Demo' } })

// Gọi API qua invoke (dynamic)
const res2 = await app.invoke('GET_LOCATION')
```

#### React
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

#### Vue 3
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

#### Angular
```typescript
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

#### Vanilla JS (bundle.js)
```html
<script src="bundle.js"></script>
<script>
  var app = WebviewSdk.getSharedMiniApp({ debug: true })
  app.ready()

  async function handleClick() {
    var res = await WebviewSdk.getLocation()
    if (WebviewSdk.isSuccess(res)) console.log(res.data)
  }
</script>

<button onclick="handleClick()">Get Location</button>
```

## 2. API Reference

### 2.1 Khởi tạo

**npm package:**
```ts
import { getSharedMiniApp } from '@webview-sdk/core'

const app = getSharedMiniApp({
  appId: 'com.example.miniapp',  // ID ứng dụng
  debug: true,                    // Bật log debug
  token: '',                      // Token xác thực
  timeout: 5000                   // Timeout mặc định (ms)
})
```

**bundle.js:**
```javascript
var app = WebviewSdk.getSharedMiniApp({
  appId: 'com.example.miniapp',
  debug: true,
  token: '',
  timeout: 5000
})
```

`getSharedMiniApp()` tạo singleton — gọi nhiều lần vẫn trả về cùng 1 instance, tự động wire generated API.

### 2.2 Giao tiếp với Native

| Method | Mô tả |
|--------|-------|
| `app.invoke(api, data?)` | Gọi native API, trả về `Promise` với kết quả |
| `app.sendRaw(msg)` | Gửi `MiniAppRequestBase` trực tiếp, đây là core method |
| `app.emit(event, data?)` | Gửi sự kiện 1 chiều đến native |
| `app.on(event, callback)` | Lắng nghe sự kiện từ native |
| `app.once(event, callback)` | Lắng nghe sự kiện 1 lần |
| `app.off(event, callback?)` | Hủy lắng nghe. Bỏ `callback` để hủy tất cả |

### 2.3 Lifecycle

| Method | Mô tả |
|--------|-------|
| `app.ready()` | Đánh dấu SDK sẵn sàng, xả hàng đợi message |
| `app.destroy()` | Hủy SDK, dọn dẹp tài nguyên |
| `app.onReady(cb)` | Gọi khi SDK sẵn sàng |
| `app.onShow(cb)` | Gọi khi app hiển thị |
| `app.onHide(cb)` | Gọi khi app bị ẩn |
| `app.onError(cb)` | Gọi khi có lỗi |
| `app.onDestroy(cb)` | Gọi khi app bị hủy |

### 2.4 Plugin

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

### 2.5 Middleware

```ts
app.useMiddleware(async (message, next) => {
  console.log('Before:', message.event, message)
  await next()
  console.log('After:', message.event)
})
```

