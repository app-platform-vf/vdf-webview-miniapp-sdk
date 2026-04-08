const fs = require("fs")
const path = require("path")
const os = require("os")
const { execSync } = require("child_process")

const EVENTS_JSON = "./packages/core/src/events.json"
const OUTPUT_DIR = path.join(__dirname, "../developer-portal/docs/API")

function toCamelCase(str) {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function categorizeEvent(event) {
  if (event.includes("USER_DATA") && event.includes("PERMISSION")) return "UserData Permission"
  if (event.startsWith("EXIT") || event.includes("OPEN")) return "Routing"
  if ((event.startsWith("REQUEST") && event.includes("PERMISSION")) || event.includes("EXECUTE_LOCAL_AUTHENTICATION")) return "Device Request Permission"
  if (event.startsWith("CHECK") && event.includes("PERMISSION")) return "Device Check Permission"
  if (((event.startsWith("SAVE_") || event.startsWith("GET_")) && event.endsWith("VALUE")) || event.includes("STORAGE")) return "Storage"
  if (event.includes("LOCATION")) return "Location"
  if (event.endsWith("COLOR") || event.endsWith("APPEARANCE") || event.includes("THEME")) return "UI"
  return "Get data event"
}

function renderFields(fields, prefix = "") {
  if (!fields || Object.keys(fields).length === 0) return ""
  let rows = ""
  for (const [name, info] of Object.entries(fields)) {
    const type = info.type || info.meta_data || "any"
    const required = info.required ? '**required**' : '*optional*'
    const desc = info.description || ""
    const def = info.default ? ` \`${info.default}\`` : ""
    rows += `| \`${prefix}${name}\` | \`${type}\` | ${required} | ${desc}${def} |\n`
  }
  return `| Field | Type | Required | Description |\n|---|---|---|---|\n${rows}`
}

function renderResponseFields(response) {
  if (!response || Object.keys(response).length === 0) return '*No response data*'

  if (response.data && response.data.fields) {
    const metaNote = response.data.meta_data === "array" ? ' `[array]`' : ""
    return `${metaNote}\n\n` + renderFields(response.data.fields)
  }

  const fields = {}
  for (const [key, val] of Object.entries(response)) {
    if (typeof val === "object" && val !== null) {
      fields[key] = val
      if (val.fields) {
        return renderFields({ [key]: val, ...val.fields })
      }
    }
  }
  if (Object.keys(fields).length > 0) return renderFields(fields)
  return '*No response data*'
}

/**
 * Sinh ra ví dụ sử dụng TypeScript cho một event,
 * khớp với hàm được generate bởi event.js (api.generated.ts).
 */
function renderUsageExample(ev) {
  const fnName = toCamelCase(ev.event)

  // --- Xây dựng phần call argument ---
  const reqData = ev.request && ev.request.data
  const hasDataFields = reqData && reqData.fields && Object.keys(reqData.fields).length > 0

  let callArg = ''
  if (hasDataFields) {
    // Lấy giá trị mẫu từ 'default' hoặc dùng placeholder theo type
    const fieldLines = Object.entries(reqData.fields).map(([name, info]) => {
      let val
      if (info.default !== undefined) {
        // default đã là chuỗi đại diện, dùng trực tiếp
        const d = info.default
        if (typeof d === 'boolean') val = String(d)
        else if (typeof d === 'number') val = String(d)
        else if (typeof d === 'string' && (d.startsWith('[') || d.startsWith('{'))) val = d.replace(/\s+/g, ' ')
        else val = JSON.stringify(d)
      } else {
        // Fallback placeholder theo type
        const t = info.type || 'string'
        if (t === 'boolean') val = 'true'
        else if (t === 'number') val = '0'
        else if (t === 'object') val = '{}'
        else if (t === 'array') val = '[]'
        else val = `'...'`
      }
      return `      ${name}: ${val}`
    })
    // stringify: hàm generated tự JSON.stringify bên trong, caller truyền object bình thường
    callArg = `{ data: {\n${fieldLines.join(',\n')}\n    } }`
  }

  // --- Xây dựng phần truy cập response ---
  let responseAccess = ''
  const res = ev.response || {}
  const hasDataResponse = res.data && res.data.fields && Object.keys(res.data.fields).length > 0
  const flatResponseKeys = Object.keys(res).filter(k => k !== 'data')

  if (hasDataResponse) {
    const fieldNames = Object.keys(res.data.fields)
    const isArray = res.data.meta_data === 'array'
    if (isArray) {
      responseAccess = `if (isSuccess(res)) {\n  // res.data la mang: ${fieldNames.slice(0, 3).join(', ')}...\n  res.data.forEach(item => console.log(item))\n}`
    } else {
      const accesses = fieldNames.slice(0, 3).map(f => `  console.log(res.data.${f})`).join('\n')
      responseAccess = `if (isSuccess(res)) {\n${accesses}\n}`
    }
  } else if (flatResponseKeys.length > 0) {
    const accesses = flatResponseKeys.slice(0, 3).map(f => `  console.log(res.${f})`).join('\n')
    responseAccess = `if (isSuccess(res)) {\n${accesses}\n}`
  } else {
    responseAccess = `if (isSuccess(res)) {\n  console.log('Thanh cong')\n}`
  }

  // --- Tổng hợp example ---
  const importLine = `import { ${fnName}, isSuccess } from '@webview-sdk/core'`
  const callLine = callArg
    ? `const res = await ${fnName}(${callArg})`
    : `const res = await ${fnName}()`

  // bundle.js variant
  const bundleCallLine = callArg
    ? `const res = await WebviewSdk.${fnName}(${callArg})`
    : `const res = await WebviewSdk.${fnName}()`
  const bundleResponseAccess = responseAccess.replace(/isSuccess\(/g, 'WebviewSdk.isSuccess(')

  return `**Ví dụ sử dụng (npm package)**\n\n\`\`\`typescript\n${importLine}\n\n${callLine}\n${responseAccess}\n\`\`\`\n\n**Sử dụng với bundle.js**\n\n\`\`\`javascript\n${bundleCallLine}\n${bundleResponseAccess}\n\`\`\`\n\n`
}

function getFrontMatter(title, position) {
  return `---
sidebar_label: '${title}'
sidebar_position: ${position}
hide_title: false
title: ${title}
---

`;
}

const categoryOrder = [
  "Routing", "UserData Permission", "Device Request Permission", "Device Check Permission",
  "Storage", "Location", "UI", "Get data event"
]

function generateMarkdown(events) {
  const grouped = {}
  events.forEach(ev => {
    const cat = categorizeEvent(ev.event)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(ev)
  })

  const docs = []
  let position = 1

  // 1. Getting Started
  let gettingStartedContent = `# Super MiniApp SDK - API Documentation

> Tự động sinh từ events.json — 56 events.

**Demo Links:**
- [Demo Angular](https://staging1.viettelmoney.vn/miniapp/01km03tv28thk14tt8bq4adha5/)
- [Demo React](https://staging1.viettelmoney.vn/miniapp/01km03s38mdqyz1xd1fj03yz90/)
- [Demo Vue](https://staging1.viettelmoney.vn/miniapp/01km03swe6njmgnx0jfva6dgvd/)
- [Demo Vanilla JS](https://staging1.viettelmoney.vn/miniapp/01kn5wx2sf1at32sjc9v1y6km3/)

## 1. Getting Started

### 1.1 Cài đặt

Có 2 cách tích hợp SDK:

| Cách | Phù hợp với | File cần tải |
|------|-------------|------|
| **npm package** | React, Vue, Angular (có bundler) | \`webview-sdk-core-1.0.0.tgz\` |
| **bundle.js** | Vanilla JS, HTML thuần (không cần bundler) | \`bundle.js\` |

**Tải file:**
- [webview-sdk-core-1.0.0.tgz](pathname:///files/webview-sdk-core-1.0.0.tgz) — npm package
- [bundle.js](pathname:///files/bundle.js) — Script file (IIFE)
- [Tải code demo](pathname:///files/demo.zip)

---

#### Cách 1: npm package (React / Vue / Angular)

**Bước 1:** Copy file \`webview-sdk-core-1.0.0.tgz\` vào thư mục \`core-lib/\` trong project
\`\`\`bash
mkdir -p core-lib
cp webview-sdk-core-1.0.0.tgz core-lib/
\`\`\`

**Bước 2:** Thêm dependency vào \`package.json\`
\`\`\`json
{
  "dependencies": {
    "@webview-sdk/core": "file:core-lib/webview-sdk-core-1.0.0.tgz"
  }
}
\`\`\`

**Bước 3:** Cài đặt
\`\`\`bash
npm install
\`\`\`

---

#### Cách 2: bundle.js (Vanilla JS / HTML thuần)

Không cần npm, không cần bundler — chỉ cần 1 file \`bundle.js\`.

**Bước 1:** Copy \`bundle.js\` vào project

**Bước 2:** Thêm script tag vào HTML
\`\`\`html
<script src="bundle.js"></script>
\`\`\`

**Bước 3:** Sử dụng qua global \`WebviewSdk\`
\`\`\`javascript
var app = WebviewSdk.getSharedMiniApp({ debug: true })
app.ready()

// Gọi API
var res = await WebviewSdk.getLocation()
if (WebviewSdk.isSuccess(res)) {
  console.log(res.data)
}
\`\`\`

*Tất cả API functions đều có sẵn trên object \`WebviewSdk\` — giống hệt cách dùng với npm package.*

### 1.2 Bắt đầu nhanh

\`\`\`typescript
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
\`\`\`

#### React
\`\`\`tsx
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
\`\`\`

#### Vue 3
\`\`\`vue
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
\`\`\`

#### Angular
\`\`\`typescript
import { Component } from '@angular/core'
import { getSharedMiniApp, MiniApp, getLocation, isSuccess } from '@webview-sdk/core'

@Component({
  template: \`<button (click)="handleClick()">Get Location</button>\`
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
\`\`\`

#### Vanilla JS (bundle.js)
\`\`\`html
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
\`\`\`

## 2. API Reference

### 2.1 Khoi tao

**npm package:**
\`\`\`ts
import { getSharedMiniApp } from '@webview-sdk/core'

const app = getSharedMiniApp({
  appId: 'com.example.miniapp',  // ID ung dung
  debug: true,                    // Bat log debug
  token: '',                      // Token xac thuc
  timeout: 5000                   // Timeout mac dinh (ms)
})
\`\`\`

**bundle.js:**
\`\`\`javascript
var app = WebviewSdk.getSharedMiniApp({
  appId: 'com.example.miniapp',
  debug: true,
  token: '',
  timeout: 5000
})
\`\`\`

\`getSharedMiniApp()\` tao singleton — goi nhieu lan van tra ve cung 1 instance, tu dong wire generated API.

### 2.2 Giao tiep voi Native

| Method | Mo ta |
|--------|-------|
| \`app.invoke(api, data?)\` | Goi native API, tra ve \`Promise\` voi ket qua |
| \`app.sendRaw(msg)\` | Gui \`MiniAppRequestBase\` truc tiep, day la core method |
| \`app.emit(event, data?)\` | Gui su kien 1 chieu den native |
| \`app.on(event, callback)\` | Lang nghe su kien tu native |
| \`app.once(event, callback)\` | Lang nghe su kien 1 lan |
| \`app.off(event, callback?)\` | Huy lang nghe. Bo \`callback\` de huy tat ca |

### 2.3 Lifecycle

| Method | Mo ta |
|--------|-------|
| \`app.ready()\` | Danh dau SDK san sang, xa hang doi message |
| \`app.destroy()\` | Huy SDK, don dep tai nguyen |
| \`app.onReady(cb)\` | Goi khi SDK san sang |
| \`app.onShow(cb)\` | Goi khi app hien thi |
| \`app.onHide(cb)\` | Goi khi app bi an |
| \`app.onError(cb)\` | Goi khi co loi |
| \`app.onDestroy(cb)\` | Goi khi app bi huy |

### 2.4 Plugin

\`\`\`ts
app.use({
  name: 'analytics',
  install(app) {
    app.on('navigate', (data) => {
      app.emit('analytics.pageView', { url: data.url })
    })
  }
})
\`\`\`

### 2.5 Middleware

\`\`\`ts
app.useMiddleware(async (message, next) => {
  console.log('Before:', message.event, message)
  await next()
  console.log('After:', message.event)
})
\`\`\`

`
  docs.push({
    filename: "getting-started.md",
    title: "Getting Started",
    content: getFrontMatter("Getting Started", position++) + gettingStartedContent
  })

  // 2. Giao thức chung
  let protocolContent = `## Giao thức chung (Base Protocol)

Tất cả request và response đều kế thừa các trường chung bên dưới. Phần **Request** và **Response** của mỗi event chỉ hiển thị trường \`data\` riêng.

**MiniAppRequestBase — Tất cả Request đều có**

| Field | Type | Required | Description |
|---|---|---|---|
| \`event\` | \`string\` | **required** | Tên event (VD: GET_LOCATION) |
| \`sender\` | \`string\` | **required** | Nguồn gửi, mặc định "MINIAPP_WEBVIEW" |
| \`request_id\` | \`string\` | **required** | ID duy nhất của request, dùng để map response |
| \`data\` | \`object\` | *optional* | Dữ liệu riêng của từng event (xem chi tiết bên dưới) |

**MiniAppResponseBase — Tất cả Response đều có**

| Field | Type | Required | Description |
|---|---|---|---|
| \`event\` | \`string\` | **required** | Tên event tương ứng với request |
| \`sender\` | \`string\` | **required** | Nguồn gửi, mặc định "MINIAPP_SDK" |
| \`response_id\` | \`string\` | **required** | ID của response |
| \`request_id\` | \`string\` | **required** | ID của request tương ứng |
| \`eventStatus\` | \`EventStatus\` | **required** | Trạng thái xử lý (errorCode, errorMessageVN, errorMessageEN, realMsg) |
| \`errorData\` | \`string\` | *optional* | Dữ liệu lỗi chi tiết (nếu có) |
| \`message\` | \`string\` | *optional* | Thông báo bổ sung |
| \`data\` | \`object\` | *optional* | Dữ liệu trả về riêng của từng event (xem chi tiết bên dưới) |

**EventStatus**

| Field | Type | Description |
|---|---|---|
| \`errorCode\` | \`string\` | "SDK000" = thành công. Dùng \`isSuccess(res)\` de kiem tra |
| \`errorMessageVN\` | \`string\` | Thông báo lỗi tiếng Việt |
| \`errorMessageEN\` | \`string\` | Thông báo lỗi tiếng Anh |
| \`realMsg\` | \`string\` | Thông báo gốc từ native |
`
  docs.push({
    filename: "base-protocol.md",
    title: "Giao thức chung",
    content: getFrontMatter("Giao thức chung", position++) + protocolContent
  })

  // 3. Categories
  categoryOrder.filter(c => grouped[c]).forEach(cat => {
    let catContent = ""
    let index = 1
    grouped[cat].forEach(ev => {
      const fnName = toCamelCase(ev.event)
      const hasRequest = ev.request && ev.request.data && ev.request.data.fields && Object.keys(ev.request.data.fields).length > 0
      const metaData = ev.request?.data?.meta_data
      const stringifyNote = metaData === "stringify" ? ' *(data is JSON.stringify())*' : ""

      // ✅ thêm số thứ tự
      catContent += `### ${index++}. ${fnName}()\n\n`

      catContent += `**Event Code:** \`${ev.event}\` - `
      if (ev.description) {
        catContent += `${ev.description}\n\n`
      }

      catContent += `**Request${hasRequest ? ` data${stringifyNote}` : ''}**\n\n`
      if (hasRequest) {
        catContent += renderFields(ev.request.data.fields) + "\n\n"
      } else {
        catContent += "*No request parameters*\n\n"
      }

      const hasResponse = ev.response && ev.response.data && ev.response.data.fields && Object.keys(ev.response.data.fields).length > 0
      catContent += `**Response${hasResponse ? ' data' : ''}**\n\n`
      catContent += renderResponseFields(ev.response) + "\n\n"
      catContent += renderUsageExample(ev)
      catContent += "---\n\n\n\n"
    })

    const filename = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-') + ".md"
    docs.push({
      filename: filename,
      title: cat,
      content: getFrontMatter(cat, position++) + catContent
    })
  })

  return docs
}

function buildDocs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  if (!fs.existsSync(OUTPUT_DIR + '/Danh sách API')) {
    fs.mkdirSync(OUTPUT_DIR + '/Danh sách API', { recursive: true })
  }

  const eventsData = JSON.parse(fs.readFileSync(EVENTS_JSON, "utf8"))
  const events = eventsData.events || []
  const docs = generateMarkdown(events)

  docs.forEach(doc => {
    fs.writeFileSync(path.join(OUTPUT_DIR + (categoryOrder.includes(doc.title) ? '/Danh sách API' : ''), doc.filename), doc.content)
    console.log(`  -> ${doc.filename} (generated)`)
  })

  console.log(`Docs generated: ${events.length} events in ${docs.length} files`)
}

buildDocs()

function copyDirSync(src, dest, excludeDirs = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory() && excludeDirs.includes(entry.name)) continue
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, excludeDirs)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyAssets() {
  const STATIC_FILES_DIR = path.join(__dirname, "../developer-portal/static/files")
  if (!fs.existsSync(STATIC_FILES_DIR)) fs.mkdirSync(STATIC_FILES_DIR, { recursive: true })

  // Copy tgz
  const tgzSrc = path.join(__dirname, "dist/webview-sdk-core-1.0.0.tgz")
  const tgzDest = path.join(STATIC_FILES_DIR, "webview-sdk-core-1.0.0.tgz")
  fs.copyFileSync(tgzSrc, tgzDest)
  console.log(`  -> Copied dist/webview-sdk-core-1.0.0.tgz -> ${tgzDest}`)

  // Copy bundle.js
  const bundleSrc = path.join(__dirname, "dist/bundle.js")
  const bundleDest = path.join(STATIC_FILES_DIR, "bundle.js")
  fs.copyFileSync(bundleSrc, bundleDest)
  console.log(`  -> Copied dist/bundle.js -> ${bundleDest}`)

  // Tạo demo.zip (bỏ dist, node_modules)
  const tempParent = path.join(os.tmpdir(), "webview-sdk-export-" + Date.now())
  const tempDemo = path.join(tempParent, "demo")
  if (fs.existsSync(tempParent)) fs.rmSync(tempParent, { recursive: true })
  copyDirSync(path.join(__dirname, "demo"), tempDemo, ["dist", "node_modules"])

  const zipDest = path.join(STATIC_FILES_DIR, "demo.zip")
  if (fs.existsSync(zipDest)) fs.unlinkSync(zipDest)
  execSync(`powershell -Command "Compress-Archive -Path '${tempDemo}' -DestinationPath '${zipDest}'"`)
  fs.rmSync(tempParent, { recursive: true })
  console.log(`  -> Created demo.zip -> ${zipDest}`)
}

copyAssets()
