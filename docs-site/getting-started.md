---
sidebar_label: 'Getting Started'
sidebar_position: 1
hide_title: false
title: Getting Started
---

# Super MiniApp SDK - API Documentation

> Tự động sinh từ events.json — 56 events.

**Demo Links:**
- [Demo Angular](https://staging1.viettelmoney.vn/miniapp/01km03tv28thk14tt8bq4adha5-pre-release/)
- [Demo React](https://staging1.viettelmoney.vn/miniapp/01km03s38mdqyz1xd1fj03yz90-pre-release/)
- [Demo Vue](https://staging1.viettelmoney.vn/miniapp/01km03swe6njmgnx0jfva6dgvd-pre-release/)

## 1. Getting Started

### 1.1 Cài đặt

**Bước 1:** Tải file thư viện và code demo
- [Tải webview-sdk-core-1.0.0.tgz](webview-sdk-core-1.0.0.tgz)
- [Tải code demo](demo.zip)

**Bước 2:** Copy file `webview-sdk-core-1.0.0.tgz` vào thư mục `core-lib/` trong project
```bash
mkdir -p core-lib
cp webview-sdk-core-1.0.0.tgz core-lib/
```

**Bước 3:** Thêm dependency vào `package.json`
```json
{
  "dependencies": {
    "@webview-sdk/core": "file:core-lib/webview-sdk-core-1.0.0.tgz"
  }
}
```

**Bước 4:** Cài đặt
```bash
npm install
```

*Chỉ cần 1 package duy nhất cho mọi framework (React, Vue, Angular, vanilla JS).*

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

## 2. API Reference

### 2.1 Khoi tao

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

### 2.2 Giao tiep voi Native

| Method | Mo ta |
|--------|-------|
| `app.invoke(api, data?)` | Goi native API, tra ve `Promise` voi ket qua |
| `app.sendRaw(msg)` | Gui `MiniAppRequestBase` truc tiep, day la core method |
| `app.emit(event, data?)` | Gui su kien 1 chieu den native |
| `app.on(event, callback)` | Lang nghe su kien tu native |
| `app.once(event, callback)` | Lang nghe su kien 1 lan |
| `app.off(event, callback?)` | Huy lang nghe. Bo `callback` de huy tat ca |

### 2.3 Lifecycle

| Method | Mo ta |
|--------|-------|
| `app.ready()` | Danh dau SDK san sang, xa hang doi message |
| `app.destroy()` | Huy SDK, don dep tai nguyen |
| `app.onReady(cb)` | Goi khi SDK san sang |
| `app.onShow(cb)` | Goi khi app hien thi |
| `app.onHide(cb)` | Goi khi app bi an |
| `app.onError(cb)` | Goi khi co loi |
| `app.onDestroy(cb)` | Goi khi app bi huy |

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

