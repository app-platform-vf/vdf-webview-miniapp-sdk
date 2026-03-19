const fs = require("fs")
const path = require("path")

const EVENTS_JSON = "./packages/core/src/events.json"
const OUTPUT_DIR = "./docs-site"

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
  if (event.endsWith("COLOR") || event.endsWith("APPEARANCE")) return "UI"
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

function getFrontMatter(title, position) {
  return `---
sidebar_label: '${title}'
sidebar_position: ${position}
hide_title: false
title: ${title}
---

`;
}

function generateMarkdown(events) {
  const grouped = {}
  events.forEach(ev => {
    const cat = categorizeEvent(ev.event)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(ev)
  })

  const categoryOrder = [
    "Routing", "UserData Permission", "Device Request Permission", "Device Check Permission",
    "Storage", "Location", "UI", "Get data event"
  ]

  const docs = []
  let position = 1

  // 1. Getting Started
  let gettingStartedContent = `# Super MiniApp SDK - API Documentation

> Tự động sinh từ events.json — ${events.length} events.

**Demo Links:**
- [Demo Angular](https://staging1.viettelmoney.vn/miniapp/01km03tv28thk14tt8bq4adha5-pre-release/)
- [Demo React](https://staging1.viettelmoney.vn/miniapp/01km03s38mdqyz1xd1fj03yz90-pre-release/)
- [Demo Vue](https://staging1.viettelmoney.vn/miniapp/01km03swe6njmgnx0jfva6dgvd-pre-release/)

## Getting Started

### Cài đặt

**Bước 1:** Tải file thư viện và code demo
- [Tải webview-sdk-core-1.0.0.tgz](webview-sdk-core-1.0.0.tgz)
- [Tải code demo](demo.zip)

**Bước 2:** Copy file \`webview-sdk-core-1.0.0.tgz\` vào thư mục \`core-lib/\` trong project
\`\`\`bash
mkdir -p core-lib
cp webview-sdk-core-1.0.0.tgz core-lib/
\`\`\`

**Bước 3:** Thêm dependency vào \`package.json\`
\`\`\`json
{
  "dependencies": {
    "@webview-sdk/core": "file:core-lib/webview-sdk-core-1.0.0.tgz"
  }
}
\`\`\`

**Bước 4:** Cài đặt
\`\`\`bash
npm install
\`\`\`

*Chỉ cần 1 package duy nhất cho mọi framework (React, Vue, Angular, vanilla JS).*

### Bắt đầu nhanh

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
    grouped[cat].forEach(ev => {
      const fnName = toCamelCase(ev.event)
      const hasRequest = ev.request && ev.request.data && ev.request.data.fields && Object.keys(ev.request.data.fields).length > 0
      const metaData = ev.request?.data?.meta_data
      const stringifyNote = metaData === "stringify" ? ' *(data is JSON.stringify())*' : ""

      catContent += `### ${fnName}()\n\n`
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
      catContent += "---\n\n"
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

  const eventsData = JSON.parse(fs.readFileSync(EVENTS_JSON, "utf8"))
  const events = eventsData.events || []
  const docs = generateMarkdown(events)

  docs.forEach(doc => {
    fs.writeFileSync(path.join(OUTPUT_DIR, doc.filename), doc.content)
    console.log(`  -> ${doc.filename} (generated)`)
  })

  console.log(`Docs generated: ${events.length} events in ${docs.length} files`)
}

buildDocs()
