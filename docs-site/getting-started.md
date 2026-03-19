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

## Getting Started

### Cài đặt

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

### Bắt đầu nhanh

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
